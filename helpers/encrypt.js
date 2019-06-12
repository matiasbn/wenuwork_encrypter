import crypto from 'crypto'

const encryptedBase64Array = []
const hmacBase64IVArray = []
const hmacBase64EncryptedArray = []

const encrypt = (incomingMessage, parameters) => {
  const {
    wifiId, deviceId, phases, cryptoKey, ivArray, mac,
  } = parameters
  incomingMessage.forEach((message, index) => {
    const cipher = crypto.createCipheriv(
      'aes-128-cbc',
      Buffer.from(cryptoKey, 'ascii'),
      Buffer.from(ivArray[index], 'base64'),
    )
    let encrypted = cipher.update(message, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    encryptedBase64Array[index] = encrypted
    const hmacIvBase64 = crypto.createHmac('sha256', mac)
      .update(Buffer.from(ivArray[index], 'base64'), 'ascii')
      .digest('base64')
    hmacBase64IVArray[index] = hmacIvBase64
    const hmacMessageBase64 = crypto.createHmac('sha256', mac)
      .update(Buffer.from(encrypted, 'base64'), 'ascii')
      .digest('base64')
    hmacBase64EncryptedArray[index] = hmacMessageBase64
  })
  // Final message
  const messageHeader = `${wifiId}-${phases}-[`
  const messageSensor1 = `${deviceId[0]}-${ivArray[0]}-${encryptedBase64Array[0]}-${hmacBase64IVArray[0]}-${hmacBase64EncryptedArray[0]}`
  const messageSensor2 = `${deviceId[1]}-${ivArray[1]}-${encryptedBase64Array[1]}-${hmacBase64IVArray[1]}-${hmacBase64EncryptedArray[1]}`
  const messageSensor3 = `${deviceId[2]}-${ivArray[2]}-${encryptedBase64Array[2]}-${hmacBase64IVArray[2]}-${hmacBase64EncryptedArray[2]}`
  const message = `${messageHeader + messageSensor1},${messageSensor2},${messageSensor3}]\n`

  return message
}


export default encrypt
