import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { SCREEN_WIDTH } from '../constants/config';
import { colors } from '../constants/theme';

const { GREEN, RED, DARK_GREY } = colors;

function PriceAndQuantity({
  price,
  quantity,
  width,
  color,
  onPress,
  disabled,
}) {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[{ color }, styles.itemTextStyle]}>{price}</Text>
      <Text style={[{ color }, styles.itemTextStyle]}>{quantity}</Text>
      <View
        style={[
          { width: `${width}%`, backgroundColor: color },
          styles.overlayWrapper,
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SCREEN_WIDTH / 78,
  },
  itemTextStyle: {
    fontWeight: '600',
    fontSize: SCREEN_WIDTH / 30,
    paddingHorizontal: 5,
    paddingVertical: SCREEN_WIDTH / 70,
  },
  overlayWrapper: {
    position: 'absolute',
    right: 0,
    height: '100%',
    opacity: 0.2,
    alignSelf: 'flex-end',
    borderRadius: SCREEN_WIDTH / 78,
  },
});

export default PriceAndQuantity;
