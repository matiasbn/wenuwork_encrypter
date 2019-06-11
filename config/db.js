import { Libs } from '@wenuwork/common'

import Logger from './logger'

const { bluebird, mongoose } = Libs

const initDB = () => {
  const options = {
    appname: '@wenuwork/encrypter',
    autoReconnect: true,
    promiseLibrary: bluebird,
    keepAlive: 300000,
    connectTimeoutMS: 30000,
    reconnectTries: 30,
    useNewUrlParser: true,
    useCreateIndex: true,
    readPreference: 'secondaryPreferred',
  }

  // Connect to mongo db
  mongoose
    .connect(process.env.MONGO_URL, options)
    .then(() => Logger.info('[MONGOOSE] MongoDB connected'))
    .catch(err => Logger.error(`[MONGOOSE] Failed to connect to MongoDB ${err.toString()}`))

  mongoose
    .connection
    .on('error', () => {
      throw new Error(`Unable to connect to database: ${process.env.MONGO_URL}`)
    })


  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      process.exit(0)
    })
  })
}

export default { initDB }
