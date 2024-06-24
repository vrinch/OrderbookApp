import React, { useMemo, useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import {
  defaultNumber,
  formatNumber,
  formatNumberWithComma,
  makeArrayNumber,
  SCREEN_WIDTH,
} from '../utils/config';
import { colors } from '../constants/theme';
import PriceAndQuantity from './priceAndQuantity';
import Loader from './loader';

const { RED } = colors;

/**
 * Ask Component
 * Displays a list of ask prices and quantities.
 *
 * @param {Object} props - Component properties.
 * @param {Array} props.data - Array of ask data objects.
 * @param {function} props.onPress - Function to handle press events on each item.
 *
 * @returns {JSX.Element}
 */
const Ask = ({ data = [], onPress }) => {
  // Reference for the FlatList component
  const flatListRef = useRef(null);

  // Memoized calculation of the total quantity of all asks
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
          color={RED}
          onPress={() => onPress(item)}
          disabled
        />
      );
    }
    return <Loader />;
  };

  // If data is empty, create a default array with empty elements
  const dataList = data.length ? data : makeArrayNumber(defaultNumber);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        renderItem={renderItem}
        extraData={dataList}
        data={dataList}
        keyExtractor={(item, index) => index.toString()}
        onLayout={() => flatListRef.current.scrollToEnd()}
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

export default Ask;
