import crypto from 'crypto'

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
// const decipher = crypto.createCipheriv('aes-128-cbc',Buffer.from(cryptoKey,'ascii'),ivArray[0])
// let encrypted = cipher.update(incomingMessage[1],'utf8','base64')
// encrypted+=cipher.final('base64')
// let deciphered = decipher.update(encrypted,'base64','utf8')
// deciphered += decipher.final('utf8')
const encryptedBase64Array = []
const hmacBase64IVArray = []
const hmacBase64EncryptedArray = []

const encrypt = (incomingMessage) => {
  incomingMessage.forEach((message, index) => {
    const cipher = crypto.createCipheriv(
      'aes-128-cbc',
      Buffer.from(cryptoKey, 'ascii'),
      Buffer.from(ivArray[index], 'base64'),
    )
    let encrypted = cipher.update(message, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    encryptedBase64Array.push(encrypted)
    const hmacIvBase64 = crypto.createHmac('sha256', mac)
      .update(Buffer.from(ivArray[index], 'base64'), 'ascii')
      .digest('base64')
    hmacBase64IVArray.push(hmacIvBase64)
    const hmacMessageBase64 = crypto.createHmac('sha256', mac)
      .update(Buffer.from(encrypted, 'base64'), 'ascii')
      .digest('base64')
    hmacBase64EncryptedArray.push(hmacMessageBase64)
    // console.log(message)
    // const sign = Math.random() > 0.5 ? -1:1;
    // message.data.v = dataDistribution.ppf(Math.random())
    // message.data.i1 = dataDistribution.ppf(Math.random())/50
    // message.data.p1 = dataDistribution.ppf(Math.random())
    // message.data.powVAR = sign*dataDistribution.ppf(Math.random())
    // message.data.powVA = dataDistribution.ppf(Math.random())
    // finalMessage.push(message)
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
