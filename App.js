import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Centrifuge } from 'centrifuge';
import { PROD_JWT, TESTNET_JWT } from '@env';

// import {
//   connectToCentrifuge,
//   subscribeToChannel,
// } from './utils/centrifugeClient';
import { Bid, Ask, AnimatedBottomSheet } from './components';
import { SCREEN_WIDTH, formatNumber } from './constants/config';
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

const centrifuge = new Centrifuge('wss://api.testnet.rabbitx.io/ws'); // testnet to prod

centrifuge.setToken(TESTNET_JWT);

const data = {
  asks: [
    ['25.4631', '73.63'],
    ['25.6858', '530.33'],
    ['25.6959', '390.66'],
    ['25.6983', '58.39'],
    ['25.7', '52.69'],
    ['25.8114', '12.49'],
    ['25.8443', '120.46'],
    ['25.8549', '68.56'],
    ['25.8763', '3.76'],
    ['25.9', '10'],
    ['25.9052', '57.9'],
  ],
  bids: [
    ['25.3353', '103.61'],
    ['25.3459', '1056.52'],
    ['25.3565', '18730.93'],
    ['25.3989', '459.26'],
    ['25.4095', '165.35'],
    ['25.4201', '725.64'],
    ['25.4307', '1273.91'],
    ['25.4413', '998.33'],
    ['25.452', '2640.82'],
    ['25.4626', '611.76'],
  ],
  market_id: 'SOL-USD',
  sequence: 9097270,
  timestamp: 1677226216475971,
};

const Header = ({ leftText, rightText }) => (
  <View style={styles.headerWrapper}>
    <Text style={styles.leftTextStyle}>{leftText}</Text>
    <Text style={styles.rightTextStyle}>{rightText}</Text>
  </View>
);
export default function App() {
  const [askList, setAskList] = useState([]);
  const [bidList, setBidList] = useState([]);
  const [tokenTitle, setTokenTitle] = useState('');
  const [currencyType, setCurrencyType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageBgColor, setMessageBgColor] = useState(DARK_GREY);
  const [message, setMessage] = useState('');
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  useEffect(() => {
    connectToCentrifuge();

    const subscription = subscribeToChannel('orderbook:SOL-USD', message => {
      console.log('Received data:', message);
      // Handle the received data as needed
    });

    return () => {
      // Cleanup on component unmount
      subscription.unsubscribe();
    };
  }, []);

  const connectToCentrifuge = () => {
    centrifuge.on('connected', function (ctx) {
      console.log('connected', ctx);
    });

    centrifuge.on('connecting', function (ctx) {
      console.log('connecting', ctx);
    });

    centrifuge.on('disconnected', function (ctx) {
      console.log('disconnected', ctx);
    });

    centrifuge.connect();
  };

  const subscribeToChannel = (channel, callback) => {
    const subscription = centrifuge.newSubscription(channel);

    // subscription.on('publication', ctx => {
    //   callback(ctx.data);
    // });

    subscription.on('subscribed', ctx => {
      console.log('Subscribed to channel:', channel, ctx);
    });

    subscription.on('error', ctx => {
      console.error('Subscription error on channel:', channel, ctx);
    });

    subscription.subscribe();

    return subscription;
  };

  useEffect(() => {
    getMarketID();
    getData();
  }, []);

  function getMarketID() {
    const marketID = data.market_id.split('-');
    setTokenTitle(marketID[0]);
    setCurrencyType(marketID[1]);
  }

  function getData() {
    const sortedAskList = sortArrayByPrice(data.asks);
    const sortedBidList = sortArrayByPrice(data.bids);
    setAskList([...sortedAskList]);
    setBidList([...sortedBidList]);
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

  function sortArrayByPrice(arr) {
    const arrayList = convertArrayToObjects(arr);
    return arrayList.sort((a, b) => b.price - a.price);
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
      `You have selected a quantity of ${formatNumber(quantity)} ${tokenTitle} at a price of ${price}`,
    );
  };

  const handleBidSelection = ({ price, quantity }) => {
    showErrorMessage(
      GREEN,
      `You have selected a quantity of ${formatNumber(quantity)} ${tokenTitle} at a price of ${price}`,
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
          leftText={`(${currencyType.toUpperCase()})`}
          rightText={`(${tokenTitle.toUpperCase()})`}
        />
        <View style={styles.mainContainer}>
          <Ask data={askList.slice(0, -1)} onPress={handleAskSelection} />
          {!!askList.length && (
            <Text style={styles.lastAskPriceStyle}>
              {formatNumber(askList[askList.length - 1].price)}
            </Text>
          )}

          {!!bidList.length && (
            <View style={styles.priceWrapper}>
              <View style={styles.flagWrapper}>
                <Ionicons
                  name={'flag'}
                  color={WHITE}
                  size={SCREEN_WIDTH / 30}
                />
                <Text style={styles.flagTextStyle}>
                  {' '}
                  {formatNumber(bidList[0].price)}
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
          <Bid data={bidList.slice(1)} onPress={handleBidSelection} />
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
    paddingHorizontal: SCREEN_WIDTH / 19.5,
    paddingTop: SCREEN_WIDTH / 5,
    paddingBottom: SCREEN_WIDTH / 13,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftTextStyle: {
    color: DARK_GREY,
    paddingRight: SCREEN_WIDTH / 30,
    textAlign: 'left',
  },
  rightTextStyle: {
    color: '#727587',
    paddingLeft: SCREEN_WIDTH / 30,
    textAlign: 'right',
  },
  mainContainer: {
    flex: 1,
    paddingTop: SCREEN_WIDTH / 39,
  },
  lastAskPriceStyle: {
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH / 26,
    color: RED,
    paddingTop: SCREEN_WIDTH / 39,
  },
  priceWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: SCREEN_WIDTH / 39,
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
