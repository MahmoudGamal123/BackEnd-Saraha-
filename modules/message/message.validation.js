import joi from 'joi'



export const sendMessage = {
    params: joi.object().required().keys({
        reciverId: joi.string().min(24).max(24).required()
    }),
    body: joi.object().required().keys({
        text: joi.string().min(5).max(5000).required(),
        items: joi.object({
            a: joi.number().min(1).max(10).integer().required(),
            b: joi.string().required()
        }).required(),
        arr: joi.array().items(joi.boolean(), joi.number().integer()).required()
        // query: joi.object().required().keys({
        //     flag: joi.boolean().truthy("1").falsy("0").sensitive({ enabled: true })
    })
}