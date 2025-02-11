const gaussian = require('gaussian');
const format = require('date-fns/format');
const stringToObject = require('./stringToObject');
const objectToMessage = require('./objectToMessage');
/**
 * @description To setup samples as gaussian distributions N(mean,standardDeviation)
 * e.g. mean = 220 and standardDeviation = 0.01 would produce samples of
 * (219.9<220<220.1)
 * Mean = average
 */
// v
const voltageMean = 220;
const voltageStandardDeviation = Number(0.01);
const voltageDistribution = gaussian(voltageMean, voltageStandardDeviation);
// i
const currentMean = 4;
const currentStandardDeviation = Number(0.01);
const currentDistribution = gaussian(currentMean, currentStandardDeviation);

// pow, powVA, powVAR
const powerMean = 880;
const powerStandardDeviation = Number(0.01);
const powerDistribution = gaussian(powerMean, powerStandardDeviation);

function customizeMessage(originalMessage, keepOriginal, wifiId, isThreePhase, messageDelay) {
  const customizedMessages = [];
  const currentDate = Date.now() * 1000;
  console.log('\n');
  console.log(`Message delivered at ${format(currentDate / 1000, 'h:mm:ss a')}, wait ${messageDelay / 1000} seconds for next message to be delivered`);
  for (let i = 0; i < originalMessage.length; i += 1) {
    const sign = Math.random() > 0.5 ? -1 : 1;
    const msgObject = stringToObject(originalMessage[i]);
    msgObject.id = wifiId;
    msgObject.v = voltageDistribution.ppf(Math.random()).toFixed(2);
    msgObject.i1 = currentDistribution.ppf(Math.random()).toFixed(2);
    msgObject.p1 = powerDistribution.ppf(Math.random()).toFixed(2);
    if (isThreePhase) {
      msgObject.powVAR = sign * powerDistribution.ppf(Math.random()).toFixed(2);
      msgObject.powVA = powerDistribution.ppf(Math.random()).toFixed(2);
    }
    const finalMessage = objectToMessage(msgObject, currentDate);
    customizedMessages.push(finalMessage);
  }
  return keepOriginal ? originalMessage : customizedMessages;
}

module.exports = customizeMessage;
