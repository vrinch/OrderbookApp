import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../constants/theme';

const { BONE_COLOR, HIGHLIGHT_COLOR } = colors;

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

/**
 * A skeleton loader component that animates a horizontal loading bar.
 * @param {Object} props - The props object for the component.
 * @param {string} [props.boneColor] - The color of the bones in the loader.
 * @param {string} [props.highlightColor] - The color of the highlight in the loader.
 * @param {Object} [props.style] - The style object for the component.
 * @param {number} [props.width=50] - The width of the loader.
 * @returns {JSX.Element} - The skeleton loader component.
 */
const SkeletonLoader = ({ boneColor, highlightColor, style, width = 50 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const firstColor = boneColor || BONE_COLOR;
  const secondColor = highlightColor || HIGHLIGHT_COLOR;

  useEffect(() => {
    // Simplified the Animated.loop configuration
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    // Cleanup animation on component unmount
    return () => animation.stop();
  }, [animatedValue]);

  /**
   * The animated value for translating the X-axis.
   *
   * @type {Animated.Value}
   */
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <AnimatedLG
      colors={[firstColor, secondColor, firstColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[{ transform: [{ translateX }] }, style]}
    />
  );
};

export default SkeletonLoader;
