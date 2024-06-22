import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import { formatNumber } from '../constants/config';
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
        price={formatNumber(price)}
        quantity={formatNumber(quantity)}
        width={width}
        color={RED}
        onPress={() => onPress(item)}
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
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {},
});

export default Ask;
