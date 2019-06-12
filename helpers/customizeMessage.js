import gaussian from 'gaussian'

/**
 * @description To setup samples as gaussian distributions N(mean,standardDeviation)
 * e.g. mean = 220 and standardDeviation = 0.01 would produce samples of
 * (219.9<220<220.1)
 * Mean = average
 */
// v
const voltageMean = 220
const voltageStandardDeviation = Number(0.01)
const voltageDistribution = gaussian(voltageMean, voltageStandardDeviation)
// i
const currentMean = 4
const currentStandardDeviation = Number(0.01)
const currentDistribution = gaussian(currentMean, currentStandardDeviation)

// pow, powVA, powVAR
const powerMean = 220
const powerStandardDeviation = Number(0.01)
const powerDistribution = gaussian(powerMean, powerStandardDeviation)

const customizeMessage = (originalMessage, keepOriginal, wifiId) => {
  const customizedMessages = []
  const currentDate = Date.now() * 1000
  originalMessage.forEach((message) => {
    const sign = Math.random() > 0.5 ? -1 : 1
    const tokenizedMessage = message.split(',')
    tokenizedMessage[0] = currentDate
    tokenizedMessage[2] = `id=${wifiId}`
    tokenizedMessage[4] = `v=${voltageDistribution.ppf(Math.random()).toFixed(2)}`
    tokenizedMessage[5] = `i=${currentDistribution.ppf(Math.random()).toFixed(2)}`
    tokenizedMessage[7] = `p1=${powerDistribution.ppf(Math.random()).toFixed(2)}`
    tokenizedMessage[8] = `powVAR=${sign * powerDistribution.ppf(Math.random()).toFixed(2)}`
    tokenizedMessage[9] = `powVA=${powerDistribution.ppf(Math.random()).toFixed(2)}`
    customizedMessages.push(tokenizedMessage.join(','))
  })
  return keepOriginal ? originalMessage : customizedMessages
}

export default customizeMessage
