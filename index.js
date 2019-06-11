/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
import dgram from 'dgram'
import gaussian from 'gaussian'
import { Models } from '@wenuwork/common'
import incomingMessage from './templates/incomingMessage'
import encrypt from './helpers/encrypt'
import DB from './config/db'

// Init db
import './config/env'

const { Wifi } = Models

DB.initDB()

// Setup samples
const dataMean = 220
const dataStandardDeviation = Number(0.01)
const dataDistribution = gaussian(dataMean, dataStandardDeviation)

// Sensor parameters
const wifiId = '22'
const deviceId = ['2201', '2202', '2203']
const phases = 'V3' // V3 = tree-phase, V1 = mono-phase
const mac = '9YnQwnS'
const cryptoKey = 'Pe4XJPjaSPTqWkE5'
const ivArray = [
  'd+xCMYLf0zvnHOQdih/4Dg==',
  'NvJwviCdJ177CuhBL986kw==',
  '1At4MROStTEUurugK9VfaQ==',
]
Wifi.findOne({ wifiId }).then((wifi) => {
  console.log(wifi)
})
const parameters = {
  wifiId, deviceId, phases, mac, cryptoKey, ivArray,
}
console.log(Date.now())
// Encrypt message
const message = encrypt(incomingMessage, parameters)


// Send message through UDP socket
const socket = dgram.createSocket('udp4')
const port = 3000
const address = '0.0.0.0'
socket.send(message, port, address, (response) => {
  console.log(response)
})
