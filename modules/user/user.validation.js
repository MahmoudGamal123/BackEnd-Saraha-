import joi from 'joi'


export const updatePassword = {
    headers: joi.object().required().keys({
        authorization: joi.string().required()
    }).options({ allowUnknown: true }),
    body: joi.object().required().keys({
        oldPassword: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        newPassword: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        cPassword: joi.string().valid(joi.ref('newPassword'))
    })
}