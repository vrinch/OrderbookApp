import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export function formatNumber(number) {
  if (number >= 1e9) {
    return (number / 1e9).toFixed(1) + 'B';
  }
  if (number >= 1e6) {
    return (number / 1e6).toFixed(1) + 'M';
  }
  if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + 'K';
  }
  return number.toString();
}

/**
 * Returns a string representation of a number with commas and two decimal places.
 * @param {number} number - The number to format.
 * @returns {string} The formatted number as a string.
 */
export const formatNumberWithComma = (number = 0) => {
  // Convert number to string and split into integer and decimal parts
  const parts = number.toString().split('.');
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  // Add commas to integer part using regex
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Return formatted number
  return integerPart + decimalPart;
};

export const sampleData = {
  asks: [
    ['25.4631', '73.63'],
    ['25.6858', '530.33'],
    ['25.6959', '390.66'],
    ['25.6983', '58.39'],
    ['25.7', '52.69'],
    ['25.8114', '12.49'],
    ['25.8443', '120.46'],
    ['25.8549', '68.56'],
    ['25.8763', '3.76'],
    ['25.9', '10'],
    ['25.9052', '57.9'],
  ],
  bids: [
    ['25.3353', '103.61'],
    ['25.3459', '1056.52'],
    ['25.3565', '18730.93'],
    ['25.3989', '459.26'],
    ['25.4095', '165.35'],
    ['25.4201', '725.64'],
    ['25.4307', '1273.91'],
    ['25.4413', '998.33'],
    ['25.452', '2640.82'],
    ['25.4626', '611.76'],
  ],
  market_id: 'SOL-USD',
  sequence: 9097270,
  timestamp: 1677226216475971,
};
