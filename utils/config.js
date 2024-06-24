import { Dimensions } from 'react-native';

// Get screen dimensions
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

// Format large numbers into abbreviated forms (e.g., 1B for billion, 1M for million, etc.)
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

// Format a number string with commas and two decimal places
export function formatNumberWithComma(number = 0) {
  // Ensure the number has exactly two decimal places
  const fixedNumber = number.toFixed(2);

  // Split the number into integer and decimal parts
  const parts = fixedNumber.split('.');

  // Add commas to the integer part
  let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Concatenate the integer and decimal parts
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  return integerPart + decimalPart;
}

// Default number constant
export const defaultNumber = 13;

// Sample data for bids and asks in a market
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

export const makeArrayNumber = num =>
  new Array(num).fill('').map((_, i) => i + 1);
