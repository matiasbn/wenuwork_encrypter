/* eslint-disable no-eval */

const stringToObject = (message) => {
  let modMsg = message.split(',')
  modMsg = modMsg.splice(1, modMsg.length - 1)
  modMsg[0] = modMsg[0].replace('*', '')
  modMsg[modMsg.length - 1] = modMsg[modMsg.length - 1].replace('$', '')
  for (let i = 0; i < modMsg.length; i += 1) {
    modMsg[i] = modMsg[i].replace('=', ':')
  }
  modMsg = modMsg.join(',')
  modMsg = eval(`({${modMsg}})`)
  return modMsg
}

export default stringToObject
