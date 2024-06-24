import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { SCREEN_WIDTH } from '../utils/config';
import { colors } from '../constants/theme';

const { DARK_GREY } = colors;

/**
 * Header Component
 * Displays a header with left-aligned and right-aligned text.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.leftText - Text to display on the left side.
 * @param {string} props.rightText - Text to display on the right side.
 *
 * @returns {JSX.Element}
 */
const Header = ({ leftText, rightText }) => (
  <View style={styles.headerWrapper}>
    <Text style={styles.leftTextStyle}>{leftText}</Text>
    <Text style={styles.rightTextStyle}>{rightText}</Text>
  </View>
);

// Styles for the Header component
const styles = StyleSheet.create({
  // Wrapper for the header, setting width, layout direction, and padding
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_WIDTH / 19.5,
  },
  // Style for the left-aligned text
  leftTextStyle: {
    color: DARK_GREY,
    paddingRight: SCREEN_WIDTH / 30,
    textAlign: 'left',
    fontFamily: 'BoingRegular',
  },
  // Style for the right-aligned text
  rightTextStyle: {
    color: DARK_GREY,
    paddingLeft: SCREEN_WIDTH / 30,
    textAlign: 'right',
    fontFamily: 'BoingRegular',
  },
});

export default Header;
