/* eslint-disable no-console */
import dgram from 'dgram'

const socket = dgram.createSocket('udp4')
const port = 3000
const address = '0.0.0.0'

const sendMessage = (encryptedMessage, originalMessage) => {
  socket.send(encryptedMessage, port, address, () => {
    console.log('Encrypted message:')
    console.log(encryptedMessage)
    console.log('Original message:')
    console.log(originalMessage)
  })
}

export default sendMessage
