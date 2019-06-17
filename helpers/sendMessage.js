/* eslint-disable no-console */
const dgram = require('dgram')

const socket = dgram.createSocket('udp4')

function sendMessage(port, address, encryptedMessage, originalMessage) {
  socket.send(encryptedMessage, port, address, () => {
    console.log('Encrypted message:')
    console.log(encryptedMessage)
    console.log('Original message:')
    console.log(originalMessage)
  })
}

module.exports = sendMessage
