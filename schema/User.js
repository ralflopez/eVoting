const joi = require('joi');

const LoginUser = joi.object({
    email:      joi
                .string()
                .min(4)
                .email()
                .required(),

    password:   joi
                .string()
                .min(8)
                .required()
});

const RegisterUser = joi.object({
    name:       joi
                .string()
                .required(),

    email:      joi
                .string()
                .min(4)
                .email()
                .required(),

    password:   joi
                .string()
                .min(8)
                .required(),
                
});

module.exports = { LoginUser, RegisterUser }