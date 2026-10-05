import Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  DB_URL: Joi.string().required(),
  DB_SYNC: Joi.boolean().default(false),
  DB_AUTOLOAD: Joi.boolean().default(false),
  JWT_SECRET: Joi.string().required(),
  ACCESS_TOKEN_TTL: Joi.string()
    .pattern(/^\d+(ms|s|m|h|d|w|y)$/i)
    .required(),
  REFRESH_TOKEN_TTL: Joi.string()
    .pattern(/^\d+(ms|s|m|h|d|w|y)$/i)
    .required(),
});
