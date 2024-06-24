import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Centrifuge } from 'centrifuge';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { PROD_JWT, TESTNET_JWT } from '@env';

import { Header, Bid, Ask, AnimatedBottomSheet } from '../components';
import {
  SCREEN_WIDTH,
  defaultNumber,
  formatNumber,
  formatNumberWithComma,
} from '../utils/config';
import { colors } from '../constants/theme';
import Loader from '../components/loader';

const { DARK_GREY, RED, WHITE, BACKGROUND_COLOR, GREEN } = colors;

// Function to extend WebSocket with custom options
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

// Initializing Centrifuge with production WebSocket URL
const centrifuge = new Centrifuge('wss://api.prod.rabbitx.io/ws'); // or testnet
centrifuge.setToken(PROD_JWT); // Setting token for production or testnet

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

  // Effect hook to connect to Centrifuge and subscribe to selected market's orderbook
  useEffect(() => {
    connectToCentrifuge(); // Function to connect to Centrifuge WebSocket

    // Subscribe to orderbook updates for the selected market
    const subscription = subscribeToChannel(
      `orderbook:${selectedMarketId}`,
      message => {
        setOrderBook(message); // Update orderbook data
        setOrderSequence(message.sequence); // Update order sequence
      },
    );

    // Clean up function to unsubscribe on component unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [selectedMarketId]);

  // Effect hook to process orderbook data changes
  useEffect(() => {
    if (orderBook) {
      getData(orderBook); // Function to process received orderbook data
    }
  }, [orderBook]);

  // Function to connect to Centrifuge WebSocket
  const connectToCentrifuge = () => {
    // Event listeners for Centrifuge WebSocket events
    centrifuge.on('connected', function (ctx) {
      console.log('connected', ctx);
      // Resubscribe to all channels after reconnecting
      Object.keys(subscriptions).forEach(channel => {
        const subscription = subscribeToChannel(
          channel,
          subscriptions[channel].callback,
        );
        // Update subscriptions state with new subscription
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

    centrifuge.connect(); // Connect to Centrifuge WebSocket
  };

  // Function to subscribe to a channel on Centrifuge WebSocket
  const subscribeToChannel = (channel, callback) => {
    const subscription = centrifuge.newSubscription(channel);

    // Event listener for successful subscription
    subscription.on('subscribed', ctx => {
      callback(ctx.data); // Callback function with subscribed data
    });

    // Event listener for publication updates
    subscription.on('publication', ctx => {
      callback(ctx.data); // Callback function with published data
    });

    // Event listener for subscription errors
    subscription.on('error', ctx => {
      console.error('Subscription error on channel:', channel, ctx);
    });

    subscription.subscribe(); // Subscribe to the channel

    // Save the subscription and its callback for resubscription on reconnect
    setSubscriptions(prev => ({
      ...prev,
      [channel]: { subscription, callback },
    }));

    return subscription; // Return the subscription object
  };

  // Function to process received orderbook data
  function getData(data) {
    const sortedAskList = sortArrayByPrice(data.asks, askList); // Sort ask list by price
    const sortedBidList = sortArrayByPrice(data.bids, bidList); // Sort bid list by price

    // Trim and update ask and bid lists
    const trimAskList =
      sortedAskList.length > defaultNumber
        ? sortedAskList.slice(-defaultNumber)
        : sortedAskList; // Trimming the sorted ask list to a default max number of 13, while also checking if the sorted ask list is greater than the default number
    const trimBidList =
      sortedBidList.length > defaultNumber
        ? sortedBidList.slice(0, defaultNumber)
        : sortedBidList; // Trimming the sorted bid list to a default max number of 13, while also checking if the sorted bid list is greater than the default number

    // Update state with latest ask and bid prices and lists
    setAskPrice(trimAskList[trimAskList.length - 1].price);
    setBidPrice(trimBidList[1].price);
    setAskList([...trimAskList]);
    setBidList([...trimBidList]);
  }

  // Function to sort an array of objects by price in descending order
  function sortArrayByPrice(newArr, oldArr) {
    const convertedArrayList = convertArrayToObjects(newArr); // Convert array to objects
    const mergeArrayList = [...oldArr, ...convertedArrayList]; // Merge old and new arrays
    const filteredArrayList = filterArrayByValue(mergeArrayList); // Filter array by value
    const removedDuplicates = removeDuplicatesByKey(filteredArrayList, 'price'); // Remove duplicates by key

    return removedDuplicates.sort((a, b) => b.price - a.price); // Sort by price in descending order
  }

  // Function to convert an array of arrays to an array of objects with price and quantity
  function convertArrayToObjects(arr) {
    if (arr.length) {
      return arr.map(subArray => {
        return {
          price: parseFloat(subArray[0]), // Convert price to float
          quantity: parseFloat(subArray[1]), // Convert quantity to float
        };
      });
    } else {
      return [];
    }
  }

  // Function to filter an array of objects by price and quantity
  function filterArrayByValue(arr) {
    return arr.filter(
      ({ price, quantity }, index) => price > 0 && quantity > 0,
    );
  }

  // Function to remove duplicates from an array of objects by a specified key
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

  // Function to display a message in the bottom sheet
  function showMessage(color, message) {
    setMessageBgColor(color); // Set background color for message
    setMessage(message); // Set message content
    setOpenBottomSheet(true); // Open bottom sheet
  }

  // Function to handle 'More' button press
  const handleMore = () => {
    showErrorMessage(GREEN, 'This feature is coming soon.'); // Show coming soon message
  };

  // Function to handle selection of ask price
  const handleAskSelection = ({ price, quantity }) => {
    // Show message for selected ask price
    showErrorMessage(
      RED,
      `You have selected a quantity of ${formatNumber(quantity)} ${
        selectedMarketId.split('-')[0]
      } at a price of $${formatNumberWithComma(price)}`,
    );
  };

  // Function to handle selection of bid price
  const handleBidSelection = ({ price, quantity }) => {
    // Show message for selected bid price
    showErrorMessage(
      GREEN,
      `You have selected a quantity of ${formatNumber(quantity)} ${
        selectedMarketId.split('-')[0]
      } at a price of $${formatNumberWithComma(price)}`,
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
          {!!askPrice ? (
            <Text style={styles.lastAskPriceStyle}>
              {formatNumberWithComma(askPrice)}
            </Text>
          ) : (
            <Loader
              reduceHeight
              hideRightLoader
              style={{ paddingHorizontal: SCREEN_WIDTH / 19.5 }}
            />
          )}

          {!!bidPrice ? (
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
                onPress={handleMore}
                disabled>
                <Text style={styles.moreTextStyle}>More</Text>
                <Ionicons
                  name={'chevron-forward'}
                  color={DARK_GREY}
                  size={SCREEN_WIDTH / 30}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Loader
              reduceHeight
              style={{ paddingHorizontal: SCREEN_WIDTH / 19.5 }}
            />
          )}
          <View style={styles.section}>
            <Bid
              data={bidList.length ? bidList.slice(1) : []}
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

// Styles for component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingTop: getStatusBarHeight() + SCREEN_WIDTH / 13,
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
    fontFamily: 'BoingBold',
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
    fontFamily: 'BoingRegular',
    opacity: 0.7,
    textDecorationLine: 'underline',
  },
  moreButtonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreTextStyle: {
    fontFamily: 'BoingRegular',
    color: DARK_GREY,
  },
});
