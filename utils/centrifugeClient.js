// utils/centrifugeClient.js

import { Centrifuge } from 'centrifuge';
import axios from 'axios';

const centrifuge = new Centrifuge('wss://api.testnet.rabbitx.io/ws');

const authenticateCentrifuge = async () => {
  try {
    const response = await axios.post('https://api.testnet.rabbitx.io/auth', {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwiZXhwIjo1MjYyNjUyMDEwfQ.x_245iYDEvTTbraw1gt4jmFRFfgMJb-GJ-hsU9HuDik',
    });

    return response.data;
  } catch (error) {
    console.error('Error authenticating with Centrifuge:', error);
    throw error;
  }
};

export const connectToCentrifuge = async () => {
  try {
    const authData = await authenticateCentrifuge();

    centrifuge.setToken(authData.token);

    return new Promise((resolve, reject) => {
      centrifuge.on('connect', () => {
        console.log('Connected to Centrifuge');
        resolve();
      });

      centrifuge.on('disconnect', () => {
        console.log('Disconnected from Centrifuge');
        reject();
      });

      centrifuge.connect();
    });
  } catch (error) {
    console.error('Error connecting to Centrifuge:', error);
    throw error;
  }
};

export default centrifuge;
