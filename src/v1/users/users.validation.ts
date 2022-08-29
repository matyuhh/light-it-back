import * as Joi from 'joi';

export const userRegisterSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  surname: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  year_of_birth: Joi.number().required(),
  gender: Joi.string().required(),
});
