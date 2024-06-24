import React from 'react';
import { View, StyleSheet } from 'react-native';

import SkeletonLoader from './skeletonLoader';
import { colors } from '../constants/theme';
import { SCREEN_WIDTH } from '../utils/config';

const { BONE_COLOR } = colors;

/**
 * Loader Component
 * Displays loading skeletons to indicate content is being loaded.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.style - Additional styles for the loader container.
 * @param {boolean} props.reduceHeight - Flag to reduce the height of the loaders.
 * @param {boolean} props.hideRightLoader - Flag to hide the right-side loader.
 *
 * @returns {JSX.Element}
 */
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

// Styles for the Loader component
const styles = StyleSheet.create({
  // Container for the loader elements
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Wrapper style for individual loader elements
  loaderWrapper: {
    width: SCREEN_WIDTH / 5,
    borderRadius: SCREEN_WIDTH / 78,
    backgroundColor: BONE_COLOR,
    overflow: 'hidden',
  },
  // Style for the loaders, including margin and background color
  loaderStyle: {
    marginVertical: SCREEN_WIDTH / 70,
    backgroundColor: BONE_COLOR,
    overflow: 'hidden',
  },
});

export default Loader;
