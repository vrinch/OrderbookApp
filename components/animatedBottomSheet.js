import React, { useEffect, useRef, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Vibration,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { SCREEN_WIDTH } from '../constants/config';
import { colors } from '../constants/theme';

const DEFAULT_POSITION = -SCREEN_WIDTH;

const { WHITE, GREEN } = colors;

const AnimatedBottomSheet = ({
  position = 'bottom',
  backgroundColor = GREEN,
  message,
  closeable = true,
  visible,
  onDismiss,
  timeOut = 3000,
}) => {
  /**
   * The animated value used for slide animation.
   *
   * @type {Animated.Value}
   */
  const slideAnimation = useRef(new Animated.Value(DEFAULT_POSITION)).current;

  useEffect(() => {
    if (visible) {
      slideIn();
    }
  }, [visible, slideIn]);

  /**
   * Function that slides in the bottom shee wrapper with animation.
   * @function slideIn
   * @memberof AnimatedBottomSheet
   * @returns {void}
   */
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

  /**
   * Slides out the component using an animated timing.
   * @function slideOut
   * @memberof AnimatedBottomSheet
   * @param {function} onDismiss - The function to be called when the animation is complete.
   * @returns {void}
   */
  const slideOut = useCallback(() => {
    Animated.timing(slideAnimation, {
      toValue: DEFAULT_POSITION,
      friction: 3,
      useNativeDriver: false,
    }).start(onDismiss);
  }, [onDismiss]);

  /**
   * Handles the movement of the pan responder.
   * @param {Object} _ - The event object.
   * @param {Object} gestureState - The state of the gesture.
   */
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

  /**
   * Handles the release of the pan responder gesture.
   *
   * @param {Object} _ - The event object.
   * @param {Object} gestureState - The state of the gesture.
   */
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

  /**
   * PanResponder for handling touch gestures.
   *
   * @typedef {Object} PanResponder
   * @property {function} onMoveShouldSetPanResponder - Determines whether the pan responder should become active for the given touch event and gesture state.
   * @property {function} onPanResponderMove - Callback fired when the touch gesture moves.
   * @property {function} onPanResponderRelease - Callback fired when the touch gesture is released.
   */
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      visible && Math.abs(gestureState.dy) > 5,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderRelease,
  });

  /**
   * Opacity value for the slide animation.
   *
   * @type {Animated.Value}
   */
  const opacity = slideAnimation.interpolate({
    inputRange: [DEFAULT_POSITION, 0],
    outputRange: [0, 1],
  });

  if (!visible) {
    return null;
  }

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
      <Text style={styles.textStyle}>{message}</Text>
    </Animated.View>
  );
};

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
    fontFamily: 'PoppinsMedium',
    fontSize: SCREEN_WIDTH / 27.85,
    color: WHITE,
    paddingTop: SCREEN_WIDTH / 19.5,
  },
});

export default AnimatedBottomSheet;
