import React, { useMemo, useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import { formatNumber, formatNumberWithComma } from '../constants/config';
import { colors } from '../constants/theme';
import PriceAndQuantity from './priceAndQuantity';

const { RED } = colors;

const Ask = ({ data, onPress }) => {
  const flatListRef = useRef(null);

  const sumQuantities = useMemo(() => {
    return data.reduce((sum, obj) => sum + obj.quantity, 0);
  }, [data]);

  const calculatePercentage = quantity => {
    const totalQuantity = sumQuantities;
    if (totalQuantity) {
      return (quantity / totalQuantity) * 100;
    }
    return 0;
  };

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
        ref={flatListRef}
        renderItem={renderItem}
        extraData={data}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        // scrollEnabled={false}
        onLayout={() => flatListRef.current.scrollToEnd()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Ask;
