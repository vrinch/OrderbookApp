import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { SCREEN_WIDTH } from '../utils/config';

/**
 * PriceAndQuantity Component
 * Displays price and quantity information with an overlay indicating the percentage width.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.price - The price to display.
 * @param {string} props.quantity - The quantity to display.
 * @param {number} props.width - The width of the overlay as a percentage.
 * @param {string} props.color - The color of the text and overlay.
 * @param {function} props.onPress - The function to call when the component is pressed.
 * @param {boolean} props.disabled - Whether the component is disabled.
 *
 * @returns {JSX.Element}
 */
const PriceAndQuantity = ({
  price,
  quantity,
  width,
  color,
  onPress,
  disabled,
}) => {
  // Style for the overlay indicating the percentage width
  const overlayStyle = {
    width: `${width}%`,
    backgroundColor: color,
  };

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.itemTextStyle, { color }]}>{price}</Text>
      <Text style={[styles.itemTextStyle, { color }]}>{quantity}</Text>
      <View style={[styles.overlayWrapper, overlayStyle]} />
    </TouchableOpacity>
  );
};

// Styles for the PriceAndQuantity component
const styles = StyleSheet.create({
  // Container for the item, aligning text and overlay
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SCREEN_WIDTH / 78,
  },
  // Style for the text displaying price and quantity
  itemTextStyle: {
    fontWeight: '600',
    fontFamily: 'BoingSemiBold',
    fontSize: SCREEN_WIDTH / 30,
    paddingHorizontal: 5,
    paddingVertical: SCREEN_WIDTH / 70,
  },
  // Wrapper for the overlay, positioned to the right
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
