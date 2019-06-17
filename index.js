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

const crypto = require('crypto')
const prompts = require('prompts')
const baseMessage = require('./helpers/baseMessage')
const encrypt = require('./helpers/encrypt')
const sendMessage = require('./helpers/sendMessage')
const customizeMessage = require('./helpers/customizeMessage')


prompts({
    type: 'text',
    name: 'threePhase',
    message: 'three-phase sensor? [y/n] (default:yes)',
    validate: threePhase => threePhase === 'y' || threePhase === 'Y' || threePhase === 'n' || threePhase === 'N' || threePhase === '',
  }).then(response=>{

  /**
   * @dev This parameters define what sensor is delivering messages and if is three or mono-phases
   * All the rest of information is obtained from other files or the database.
   * @param wifiID self-explanatory
   * @param isThreePhase if true, delivers three-phase data, else, mono-phase
   * @param keepBaseMessage if true, keep the original message of 'helpers/baseMessage',
   * else, changes the message according to 'helpers/customizeMessage' parameters
   */

  const isThreePhase = response.threePhase === 'Y' || response.threePhase === 'y' || response.threePhase === ''
  const wifiId = '7'
  const port = 23333
  const address = '104.214.27.39'
  const keepBaseMessage = false
  const phases = isThreePhase ? 'V3' : 'V1'
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
  }

  /**
   * @description if the second parameter is true, it will keep the 'base message'
   * so it can be customized directly on the 'helpers/baseMessage.js' file
   */
  const messageDelay = 15000 // in milliseconds
  const originalMessage = isThreePhase ? baseMessage[0] : baseMessage[1]
  console.log(`Wait ${messageDelay / 1000} seconds for first message`)
  setInterval(async () => {
    const customizedMessage = customizeMessage(originalMessage, keepBaseMessage, wifiId, isThreePhase)
    const encryptedMessage = encrypt(customizedMessage, parameters)
    sendMessage(port, address, encryptedMessage, customizedMessage)
  }, messageDelay)
})
