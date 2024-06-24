import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import {
  formatNumber,
  formatNumberWithComma,
  makeArrayNumber,
  defaultNumber,
  SCREEN_WIDTH,
} from '../utils/config';
import { colors } from '../constants/theme';
import PriceAndQuantity from './priceAndQuantity';
import Loader from './loader';

const { GREEN } = colors;

/**
 * Bid Component
 * Displays a list of bid prices and quantities.
 *
 * @param {Object} props - Component properties.
 * @param {Array} props.data - Array of bid data objects.
 * @param {function} props.onPress - Function to handle press events on each item.
 *
 * @returns {JSX.Element}
 */
const Bid = ({ data, onPress }) => {
  // Memoized calculation of the total quantity of all bids
  const sumQuantities = useMemo(() => {
    return data.reduce((sum, obj) => sum + obj.quantity, 0);
  }, [data]);

  // Function to calculate the percentage width based on the quantity
  const calculatePercentage = quantity => {
    const totalQuantity = sumQuantities;
    if (totalQuantity) {
      return (quantity / totalQuantity) * 100;
    }
    return 0;
  };

  // Function to render each item in the FlatList
  const renderItem = ({ item }) => {
    if (data.length) {
      const { price, quantity } = item;
      const width = calculatePercentage(quantity);
      return (
        <PriceAndQuantity
          price={formatNumberWithComma(price)}
          quantity={formatNumber(quantity)}
          width={width}
          color={GREEN}
          onPress={() => onPress(item)}
          // disabled
        />
      );
    }
    return <Loader />;
  };

  // If data is empty, create a default array with empty elements
  const dataList = data.length ? data : makeArrayNumber(defaultNumber);

  return (
    <View style={styles.container}>
      <FlashList
        renderItem={renderItem}
        extraData={dataList}
        data={dataList}
        estimatedItemSize={defaultNumber}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.contentContainerStyle}
      />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingHorizontal: SCREEN_WIDTH / 19.5,
  },
});

export default Bid;
