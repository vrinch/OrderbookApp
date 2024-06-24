import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Centrifuge } from 'centrifuge';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { PROD_JWT, TESTNET_JWT } from '@env';

import { Header, Bid, Ask, AnimatedBottomSheet } from './components';
import {
  SCREEN_WIDTH,
  defaultNumber,
  formatNumber,
  formatNumberWithComma,
} from './constants/config';
import { colors } from './constants/theme';

const { DARK_GREY, RED, WHITE, BACKGROUND_COLOR, GREEN } = colors;

const myWs = function (options) {
  return class wsClass extends WebSocket {
    constructor(...args) {
      if (args.length === 1) {
        super(...[...args, 'centrifuge-json', ...[options]]);
      } else {
        super(...[...args, ...[options]]);
      }
    }
  };
};

const centrifuge = new Centrifuge('wss://api.prod.rabbitx.io/ws'); // or testnet

centrifuge.setToken(PROD_JWT); // TESTNET_JWT

export default function App() {
  const [askList, setAskList] = useState([]);
  const [bidList, setBidList] = useState([]);
  const [orderBook, setOrderBook] = useState(null);
  const [selectedMarketId, setSelectedMarketId] = useState('ETH-USD');
  const [messageBgColor, setMessageBgColor] = useState(DARK_GREY);
  const [message, setMessage] = useState('');
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [orderSequence, setOrderSequence] = useState('');
  const [bidPrice, setBidPrice] = useState(0);
  const [askPrice, setAskPrice] = useState(0);
  const [subscriptions, setSubscriptions] = useState({});

  useEffect(() => {
    connectToCentrifuge();

    const subscription = subscribeToChannel(
      `orderbook:${selectedMarketId}`,
      message => {
        setOrderBook(message);
        setOrderSequence(message.sequence);
      },
    );

    return () => {
      // Cleanup on component unmount
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [selectedMarketId]);

  useEffect(() => {
    if (orderBook) {
      getData(orderBook);
    }
  }, [orderBook]);

  const connectToCentrifuge = () => {
    centrifuge.on('connected', function (ctx) {
      console.log('connected', ctx);
      // Resubscribe to all channels after reconnecting
      Object.keys(subscriptions).forEach(channel => {
        const subscription = subscribeToChannel(
          channel,
          subscriptions[channel].callback,
        );
        setSubscriptions(prev => ({
          ...prev,
          [channel]: subscription,
        }));
      });
    });

    centrifuge.on('connecting', function (ctx) {
      console.log('connecting', ctx);
    });

    centrifuge.on('disconnected', function (ctx) {
      console.log('disconnected', ctx);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        centrifuge.connect();
      }, 3000);
    });

    centrifuge.connect();
  };

  const subscribeToChannel = (channel, callback) => {
    const subscription = centrifuge.newSubscription(channel);

    subscription.on('subscribed', ctx => {
      callback(ctx.data);
    });

    subscription.on('publication', ctx => {
      callback(ctx.data);
    });

    subscription.on('error', ctx => {
      console.error('Subscription error on channel:', channel, ctx);
    });

    subscription.subscribe();

    // Save the subscription and its callback for resubscription on reconnect
    setSubscriptions(prev => ({
      ...prev,
      [channel]: { subscription, callback },
    }));

    return subscription;
  };

  function getData(data) {
    // console.log('asks and bids length: ', askList.length, bidList.length);
    // console.log('Received data getData:', data.asks);
    const sortedAskList = sortArrayByPrice(data.asks, askList);
    const sortedBidList = sortArrayByPrice(data.bids, bidList);

    const trimAskList =
      sortedAskList.length > defaultNumber
        ? sortedAskList.slice(-defaultNumber)
        : sortedAskList;
    const trimBidList =
      sortedBidList.length > defaultNumber
        ? sortedBidList.slice(0, defaultNumber)
        : sortedBidList;

    setAskPrice(trimAskList[trimAskList.length - 1].price);
    setBidPrice(trimBidList[1].price);

    setAskList([...trimAskList]);
    setBidList([...trimBidList]);
  }

  function sortArrayByPrice(newArr, oldArr) {
    const convertedArrayList = convertArrayToObjects(newArr);
    const mergeArrayList = [...oldArr, ...convertedArrayList];
    const filteredArrayList = filterArrayByValue(mergeArrayList);
    const removedDuplicates = removeDuplicatesByKey(filteredArrayList, 'price');

    return removedDuplicates.sort((a, b) => b.price - a.price);
  }

  function convertArrayToObjects(arr) {
    if (arr.length) {
      return arr.map(subArray => {
        return {
          price: parseFloat(subArray[0]),
          quantity: parseFloat(subArray[1]),
        };
      });
    } else {
      return [];
    }
  }

  function filterArrayByValue(arr) {
    return arr.filter(
      ({ price, quantity }, index) => price > 0 && quantity > 0,
    );
  }

  function removeDuplicatesByKey(arr, key) {
    const newSet = new Set();
    return arr.filter(item => {
      const keyValue = item[key];
      if (newSet.has(keyValue)) {
        return false;
      } else {
        newSet.add(keyValue);
        return true;
      }
    });
  }

  function showErrorMessage(color, message) {
    setMessageBgColor(color);
    setMessage(message);
    setOpenBottomSheet(true);
  }

  const handleMore = () => {
    showErrorMessage(GREEN, 'This feature is coming soon.');
  };

  const handleAskSelection = ({ price, quantity }) => {
    showErrorMessage(
      RED,
      `You have selected a quantity of ${formatNumber(quantity)} ${selectedMarketId.split('-')[0]} at a price of $${formatNumberWithComma(price)}`,
    );
  };

  const handleBidSelection = ({ price, quantity }) => {
    showErrorMessage(
      GREEN,
      `You have selected a quantity of ${formatNumber(quantity)} ${selectedMarketId.split('-')[0]} at a price of $${formatNumberWithComma(price)}`,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          style={'light'}
        />
        <Header leftText={'Price'} rightText={'Quantity'} />
        <Header
          rightText={`(${selectedMarketId.split('-')[0].toUpperCase()})`}
          leftText={`(${selectedMarketId.split('-')[1].toUpperCase()})`}
        />
        <View style={styles.mainContainer}>
          <View style={styles.section}>
            <Ask
              data={askList.length ? askList.slice(0, -1) : []}
              onPress={handleAskSelection}
            />
          </View>
          {!!askPrice && (
            <Text style={styles.lastAskPriceStyle}>
              {formatNumberWithComma(askPrice)}
            </Text>
          )}

          {!!bidPrice && (
            <View style={styles.priceWrapper}>
              <View style={styles.flagWrapper}>
                <Ionicons
                  name={'flag'}
                  color={WHITE}
                  size={SCREEN_WIDTH / 30}
                />
                <Text style={styles.flagTextStyle}>
                  {' '}
                  {formatNumberWithComma(bidPrice)}
                </Text>
                <Text style={styles.dottedUnderline}></Text>
              </View>
              <TouchableOpacity
                style={styles.moreButtonStyle}
                onPress={handleMore}>
                <Text style={styles.moreTextStyle}>More</Text>
                <Ionicons
                  name={'chevron-forward'}
                  color={DARK_GREY}
                  size={SCREEN_WIDTH / 30}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.section}>
            <Bid
              data={askList.length ? askList.slice(1) : []}
              onPress={handleBidSelection}
            />
          </View>
        </View>
      </View>
      <AnimatedBottomSheet
        backgroundColor={messageBgColor}
        message={message}
        visible={openBottomSheet}
        onDismiss={() => setOpenBottomSheet(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingTop: getStatusBarHeight() + SCREEN_WIDTH / 13,
    // paddingBottom: SCREEN_WIDTH / 13,
  },
  mainContainer: {
    flex: 1,
    paddingTop: SCREEN_WIDTH / 39,
  },
  section: {
    flex: 0.45,
    width: '100%',
  },
  lastAskPriceStyle: {
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH / 26,
    color: RED,
    paddingTop: SCREEN_WIDTH / 50,
    paddingHorizontal: SCREEN_WIDTH / 19.5,
  },
  priceWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: SCREEN_WIDTH / 50,
    paddingHorizontal: SCREEN_WIDTH / 19.5,
  },
  flagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagTextStyle: {
    fontSize: 12,
    color: WHITE,
    opacity: 0.7,
    textDecorationLine: 'underline',
  },
  moreButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreTextStyle: {
    color: DARK_GREY,
  },
});
