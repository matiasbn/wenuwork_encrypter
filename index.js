/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
import dgram from 'dgram'
import gaussian from 'gaussian'
import incomingMessage from './templates/incomingMessage'
import encrypt from './helpers/encrypt'
// UDP socket
const socket = dgram.createSocket('udp4')

// Setup samples
const dataMean = 220
const dataStandardDeviation = Number(0.01)
const dataDistribution = gaussian(dataMean, dataStandardDeviation)

const message = encrypt(incomingMessage)

// Send message
const port = 3000
const address = '0.0.0.0'

socket.send(message, port, address, (response) => {
  console.log(response)
})
