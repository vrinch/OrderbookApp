import React from 'react';
import { View, StyleSheet } from 'react-native';

import SkeletonLoader from './skeletonLoader';
import { colors } from '../constants/theme';
import { SCREEN_WIDTH } from '../utils/config';

const { BONE_COLOR } = colors;

const Loader = ({ style, reduceHeight, hideRightLoader }) => (
  <View style={[style, styles.container]}>
    <View
      style={[
        { height: SCREEN_WIDTH / (reduceHeight ? 26 : 16) },
        styles.loaderStyle,
        styles.loaderWrapper,
      ]}>
      <SkeletonLoader
        width={SCREEN_WIDTH / 5}
        style={[
          { height: SCREEN_WIDTH / (reduceHeight ? 26 : 16) },
          styles.loaderWrapper,
        ]}
      />
    </View>
    {!hideRightLoader && (
      <View
        style={[
          { height: SCREEN_WIDTH / (reduceHeight ? 26 : 16) },
          styles.loaderStyle,
          styles.loaderWrapper,
        ]}>
        <SkeletonLoader
          width={SCREEN_WIDTH / 5}
          style={[
            { height: SCREEN_WIDTH / (reduceHeight ? 26 : 16) },
            styles.loaderWrapper,
          ]}
        />
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loaderWrapper: {
    width: SCREEN_WIDTH / 5,
    borderRadius: SCREEN_WIDTH / 78,
    backgroundColor: BONE_COLOR,
    overflow: 'hidden',
  },
  loaderStyle: {
    marginVertical: SCREEN_WIDTH / 70,
    backgroundColor: BONE_COLOR,
    overflow: 'hidden',
  },
});

export default Loader;
