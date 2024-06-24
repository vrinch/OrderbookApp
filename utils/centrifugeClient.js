// utils/centrifugeClient.js

import Centrifuge from 'centrifuge';

const myWs = function (options) {
  return class wsClass extends WebSocket {
    constructor(...args) {
      if (args.length === 1) {
        super(...[...args, 'centrifuge-json', ...[options]]);
      } else {
        super(...[...args, ...[options]]);
      }
    }
  };
};

const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwIiwiZXhwIjo1MjYyNjUyMDEwfQ.x_245iYDEvTTbraw1gt4jmFRFfgMJb-GJ-hsU9HuDik';
const centrifuge = new Centrifuge('wss://api.testnet.rabbitx.io/ws', {
  websocket: myWs({ headers: { Authorization: `Bearer ${jwt}` } }),
});

export const connectToCentrifuge = () => {
  centrifuge.on('connected', function (ctx) {
    console.log('connected', ctx);
  });

  centrifuge.on('connecting', function (ctx) {
    console.log('connecting', ctx);
  });

  centrifuge.on('disconnected', function (ctx) {
    console.log('disconnected', ctx);
  });

  centrifuge.connect();
};

export const subscribeToChannel = (channel, callback) => {
  const subscription = centrifuge.newSubscription(channel);

  subscription.on('publication', ctx => {
    callback(ctx.data);
  });

  subscription.on('subscribed', ctx => {
    console.log('Subscribed to channel:', channel, ctx);
  });

  subscription.on('error', ctx => {
    console.error('Subscription error on channel:', channel, ctx);
  });

  subscription.subscribe();

  return subscription;
};

export default centrifuge;
