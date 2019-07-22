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

import { Models } from '@wenuwork/common'
import crypto from 'crypto'
import baseMessage from './helpers/baseMessage'
import encrypt from './helpers/encrypt'
import sendMessage from './helpers/sendMessage'
import customizeMessage from './helpers/customizeMessage'
import DB from './config/db'

// Init db
import './config/env'

DB.initDB()

/**
 * @dev This parameters define what sensor is delivering messages and if is three or mono-phases
 * All the rest of information is obtained from other files or the database.
 * @param wifiID self-explanatory
 * @param isThreePhase if true, delivers three-phase data, else, mono-phase
 * @param keepBaseMessage if true, keep the original message of 'helpers/baseMessage',
 * else, changes the message according to 'helpers/customizeMessage' parameters
 */
const wifiId = '22'
const isThreePhase = true
const keepBaseMessage = false

// Retrieve info from database
const { Wifi } = Models
Wifi.findOne({ wifiId }).then((wifiData) => {
  const phases = isThreePhase ? 'V3' : 'V1'
  const parameters = {
    wifiId,
    deviceId: isThreePhase ? [`${wifiId}01`, `${wifiId}02`, `${wifiId}03`] : [`${wifiId}01`],
    phases,
    mac: wifiData.mac,
    cryptoKey: wifiData.crypto,
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
  let customizedMessage = customizeMessage(originalMessage, keepBaseMessage, wifiId, isThreePhase)
  let encryptedMessage = encrypt(customizedMessage, parameters)
  sendMessage(encryptedMessage, customizedMessage)
  setInterval(() => {
    customizedMessage = customizeMessage(originalMessage, keepBaseMessage, wifiId, isThreePhase)
    encryptedMessage = encrypt(customizedMessage, parameters)
    sendMessage(encryptedMessage, customizedMessage)
  }, messageDelay)
})
