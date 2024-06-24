import React from 'react';
import { View, StyleSheet } from 'react-native';

import SkeletonLoader from './skeletonLoader';
import { colors } from '../constants/theme';
import { SCREEN_WIDTH } from '../constants/config';

const { BONE_COLOR } = colors;

const Loader = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.loaderStyle, styles.loaderWrapper]}>
        <SkeletonLoader width={SCREEN_WIDTH} style={styles.loaderWrapper} />
      </View>
      <View style={[styles.loaderStyle, styles.loaderWrapper]}>
        <SkeletonLoader width={SCREEN_WIDTH} style={styles.loaderWrapper} />
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
    // paddingVertical: SCREEN_WIDTH / 78, // 5
  },
  loaderWrapper: {
    width: SCREEN_WIDTH / 5,
    height: SCREEN_WIDTH / 16,
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
