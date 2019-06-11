import { Libs } from '@wenuwork/common'

const { pino } = Libs

const logger = pino({
  prettyPrint: process.env.NODE_ENV === 'development',
})

export default logger
