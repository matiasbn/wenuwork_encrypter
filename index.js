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
 * @param {String} phases V3 = tree-phase, V1 = mono-phase
 */
const wifiId = '29'
const phases = 'V3'
const isThreePhase = phases === 'V3'

// Retrieve info from database
const { Wifi } = Models
Wifi.findOne({ wifiId }).then((wifiData) => {
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
  const originalMessage = isThreePhase ? baseMessage[0] : baseMessage[1]
  setInterval(() => {
    const customizedMessage = customizeMessage(originalMessage, false, wifiId, isThreePhase)
    const encryptedMessage = encrypt(customizedMessage, parameters)
    sendMessage(encryptedMessage, customizedMessage)
  }, 1500)
})
