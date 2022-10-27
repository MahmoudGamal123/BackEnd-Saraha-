import * as rController from './controller/registration.js'
import { Router } from 'express'
import * as validators from './auth.validation.js'
import { validation } from '../../middlwear/validation.js'
const router = Router()



router.post("/signup", validation(validators.signup), rController.signup)
router.get("/confirmEmail/:token", rController.confirmEmail)
router.get("/requestRfToken/:token", rController.requestRefToken)


router.post("/signin", validation(validators.signin), rController.signin)

router.post("/requestCode", rController.sendCode)
router.post("/forgetPassword", rController.forgetPassword)










export default router