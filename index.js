/* eslint-disable no-spaced-func */
/* eslint-disable func-call-spacing */
/* eslint-disable no-unexpected-multiline */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
/**
  * @author Matías Barrios
  * @description script to simulate the behavior of a sensor. It delivers a three-phase or
  * mono-phase message on localhost (0.0.0.0:3000) depending on the value of 'phases' parameter.
  * Automatically creates the initialization vectors, retrieves the 'crypto' and 'mac' from Wifi
  * collection, customize the message (helpers/customizeMessage.js) encrypt it (helpers/encrypt.js)
  * and send it to specified port.
  */

const crypto = require('crypto');
const prompts = require('prompts');
const baseMessage = require('./helpers/baseMessage');
const encrypt = require('./helpers/encrypt');
const sendMessage = require('./helpers/sendMessage');
const customizeMessage = require('./helpers/customizeMessage');

const questions = [
  {
    type: 'select',
    name: 'phases',
    message: 'Choose type of sensor:',
    choices: [
      {
        title: 'Three-phase sensor',
        value: () => true,
      },
      {
        title: 'Mono-phase sensor',
        value: () => false,
      },
    ],
  },
  {
    type: 'select',
    name: 'delay',
    message: 'Choose message delay:',
    choices: [
      {
        title: '15 seconds (minimum)',
        value: 15000,
      },
      {
        title: '30 seconds',
        value: 30000,
      },
      {
        title: '45 seconds',
        value: 45000,
      },
      {
        title: '60 seconds',
        value: 60000,
      },
    ],
  },
  {
    type: 'select',
    name: 'env',
    message: 'Choose environment to deliver:',
    choices: [
      {
        title: 'Test',
        value: 'test',
      },
      {
        title: 'Production',
        value: 'prod',
      },
    ],
  },
];

function onCancel() {
  console.log('WenuWork server connection test cancelled');
  process.exit(0);
}

prompts(questions, { onCancel }).then((responses) => {
  /**
   * @dev This parameters define what sensor is delivering messages and if is three or mono-phases
   * All the rest of information is obtained from other files or the database.
   * @param wifiID self-explanatory
   * @param isThreePhase if true, delivers three-phase data, else, mono-phase
   * @param keepBaseMessage if true, keep the original message of 'helpers/baseMessage',
   * else, changes the message according to 'helpers/customizeMessage' parameters
   */

  const isThreePhase = responses.phases();
  const messageDelay = responses.delay;
  const environment = responses.env;
  const wifiId = '7';
  const port = 23333;
  const address = environment === 'test' ? '104.43.251.231' : '104.214.27.39';
  const keepBaseMessage = false;
  const phases = isThreePhase ? 'V3' : 'V1';
  const parameters = {
    wifiId,
    deviceId: isThreePhase ? [`${wifiId}01`, `${wifiId}02`, `${wifiId}03`] : [`${wifiId}01`],
    phases,
    mac: '7coOd16',
    cryptoKey: '8tyrj8aPGMBV4oRi',
    ivArray: [
      crypto.randomBytes(16).toString('base64'),
      crypto.randomBytes(16).toString('base64'),
      crypto.randomBytes(16).toString('base64'),
    ],
  };

  const originalMessage = isThreePhase ? baseMessage[0] : baseMessage[1];
  let customizedMessage = customizeMessage(originalMessage, keepBaseMessage, wifiId, isThreePhase, messageDelay);
  let encryptedMessage = encrypt(customizedMessage, parameters);
  sendMessage(port, address, encryptedMessage, customizedMessage);
  setInterval(async () => {
    customizedMessage = customizeMessage(originalMessage, keepBaseMessage, wifiId, isThreePhase, messageDelay);
    encryptedMessage = encrypt(customizedMessage, parameters);
    sendMessage(port, address, encryptedMessage, customizedMessage);
  }, messageDelay);
});
