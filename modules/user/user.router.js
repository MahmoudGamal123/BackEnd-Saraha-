

import { Router } from 'express'
import { auth } from '../../middlwear/auth.js'
import { validation } from '../../middlwear/validation.js'
import * as validators from './user.validation.js'
import * as uController from './controller/user.js'
const router = Router()


router.get("/", auth(), uController.profile)


router.patch("/updatepassword" ,validation(validators.updatePassword) ,auth() , uController.updatePassword)







export  default  router