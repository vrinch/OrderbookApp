import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { SCREEN_WIDTH } from '../constants/config';
import { colors } from '../constants/theme';

const { DARK_GREY } = colors;

const Header = ({ leftText, rightText }) => (
  <View style={styles.headerWrapper}>
    <Text style={styles.leftTextStyle}>{leftText}</Text>
    <Text style={styles.rightTextStyle}>{rightText}</Text>
  </View>
);

// define your styles
const styles = StyleSheet.create({
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
    color: DARK_GREY,
    paddingLeft: SCREEN_WIDTH / 30,
    textAlign: 'right',
  },
});

export default Header;
