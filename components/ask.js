import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { formatNumber, formatNumberWithComma } from '../constants/config';
import { colors } from '../constants/theme';
import PriceAndQuantity from './priceAndQuantity';

const { RED } = colors;

const Ask = ({ data, onPress }) => {
  function sumQuantities() {
    if (data.length) {
      return data.reduce((sum, obj) => sum + obj.quantity, 0);
    }
    return 0;
  }

  function calculatePercentage(quantity) {
    const totalQuantity = sumQuantities();
    if (totalQuantity) {
      return (quantity / totalQuantity) * 100;
    }
    return 0;
  }

  const renderItem = ({ item }) => {
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
  };

  return (
    <View style={styles.container}>
      <FlatList
        renderItem={renderItem}
        extraData={data}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        initialScrollIndex={!!data.length ? data.length - 1 : 0}
        scrollEnabled={false}
        getItemLayout={(ctx, index) => ({
          length: 50,
          offset: 50 * index,
          index,
        })}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {},
});

export default Ask;
