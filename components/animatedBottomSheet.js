import React, { useEffect, useRef, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Vibration,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { SCREEN_WIDTH } from '../utils/config';
import { colors } from '../constants/theme';

// Constants
const DEFAULT_POSITION = -SCREEN_WIDTH;
const { WHITE, GREEN } = colors;

/**
 * AnimatedBottomSheet Component
 * A component that displays an animated bottom sheet.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.position - Position of the bottom sheet ('bottom' or 'top').
 * @param {Object} props.textStyle - Custom styles for the text.
 * @param {string} props.backgroundColor - Background color of the bottom sheet.
 * @param {string} props.message - Message to be displayed inside the bottom sheet.
 * @param {boolean} props.closeable - Determines if the bottom sheet is closeable.
 * @param {boolean} props.visible - Visibility of the bottom sheet.
 * @param {function} props.onDismiss - Callback function when the bottom sheet is dismissed.
 * @param {number} props.timeOut - Timeout before the bottom sheet is automatically closed.
 *
 * @returns {JSX.Element}
 */
const AnimatedBottomSheet = ({
  position = 'bottom',
  textStyle,
  backgroundColor = GREEN,
  message,
  closeable = true,
  visible,
  onDismiss,
  timeOut = 3000,
}) => {
  // The animated value used for slide animation
  const slideAnimation = useRef(new Animated.Value(DEFAULT_POSITION)).current;

  // Effect to handle slide in animation when the component becomes visible
  useEffect(() => {
    if (visible) {
      slideIn();
    }
  }, [visible, slideIn]);

  // Function to slide in the bottom sheet with animation
  const slideIn = useCallback(() => {
    Vibration.vibrate();
    Animated.timing(slideAnimation, {
      toValue: 0,
      friction: 3,
      useNativeDriver: false,
    }).start(() => {
      if (closeable) {
        setTimeout(slideOut, timeOut);
      }
    });
  }, [closeable, slideOut, timeOut]);

  // Function to slide out the bottom sheet with animation
  const slideOut = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: DEFAULT_POSITION,
      friction: 3,
      useNativeDriver: false,
    }).start(onDismiss);
  }, [onDismiss]);

  // Handles the movement of the pan responder
  const handlePanResponderMove = (_, gestureState) => {
    const shouldSlide =
      closeable &&
      ((gestureState.dy > 0 && position === 'bottom') ||
        (gestureState.dy < 0 && position === 'top'));

    if (shouldSlide) {
      slideAnimation.setValue(
        position === 'top' ? gestureState.dy : -gestureState.dy,
      );
    }
  };

  // Handles the release of the pan responder gesture
  const handlePanResponderRelease = (_, gestureState) => {
    if (closeable) {
      const dismissCondition =
        (gestureState.dy > Math.round(SCREEN_WIDTH / 7.8) &&
          position === 'bottom') || // 50
        (gestureState.dy < Math.round(-(SCREEN_WIDTH / 7.8)) &&
          position === 'top'); // 50

      if (dismissCondition) {
        slideOut();
      } else {
        Animated.timing(slideAnimation, {
          toValue: 0,
          friction: 3,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  // PanResponder for handling touch gestures
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      visible && Math.abs(gestureState.dy) > 5,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderRelease,
  });

  // Opacity value for the slide animation
  const opacity = slideAnimation.interpolate({
    inputRange: [DEFAULT_POSITION, 0],
    outputRange: [0, 1],
  });

  // Return null if the bottom sheet is not visible
  if (!visible) {
    return null;
  }

  // Render the animated bottom sheet
  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          backgroundColor,
          [position]: slideAnimation,
          opacity,
          paddingBottom: position === 'bottom' ? getStatusBarHeight() : 0,
          paddingTop: position === 'top' ? getStatusBarHeight() : 0,
        },
      ]}>
      <Text style={[textStyle, styles.textStyle]}>{message}</Text>
    </Animated.View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999999999,
    width: '100%',
    paddingHorizontal: SCREEN_WIDTH / 19.5,
  },
  textStyle: {
    fontFamily: 'BoingMedium',
    fontSize: SCREEN_WIDTH / 27.85,
    color: WHITE,
    paddingTop: SCREEN_WIDTH / 19.5,
  },
});

export default AnimatedBottomSheet;
