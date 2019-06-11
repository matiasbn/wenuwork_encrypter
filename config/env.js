import { Libs } from '@wenuwork/common'
import Logger from './logger'

const {
  appRootPath,
  dotenv,
  joi: Joi,
} = Libs

dotenv.config({
  path: `${appRootPath.path}/.env`,
})

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(['development', 'production', 'test']).default('development'),
  MONGO_URL: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
})
  .unknown()
  .required()

const { error } = Joi.validate(process.env, envVarsSchema)

if (error) {
  Logger.error(`Config validation error: ${error.message}`)
  process.exit(0)
}
