const objectToMessage = (msgObject, currentDate) => {
  let message = JSON.stringify(msgObject);
  message = message.replace('{', '').replace('}', '');
  message = message.split(',');
  for (let i = 0; i < message.length; i += 1) {
    message[i] = message[i].replace(':', '=');
    message[i] = message[i].replace('"', '');
    message[i] = message[i].replace('"', '');
    message[i] = message[i].replace('"', '');
    message[i] = message[i].replace('"', '');
  }
  message[0] = `*${message[0]}`;
  message[message.length - 1] = `${message[message.length - 1]}$`;
  message = message.join(',');
  message = `${currentDate},${message}`;
  return message;
};

module.exports = objectToMessage;
