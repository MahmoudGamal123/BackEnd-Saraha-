
import * as messageController from './controller/message.js'
import { Router } from 'express'
import { auth } from '../../middlwear/auth.js'
import { validation } from '../../middlwear/validation.js'
import * as validators from './message.validation.js'
const router = Router()


router.get("/",(req,res)=>{
    res.json({message:"Message Module"})
})

router.post("/:reciverId",validation(validators.sendMessage) ,messageController.sendMessage )

router.get("/messageList" ,auth() ,messageController.allMessages)

router.get("/:id" ,auth() ,messageController.messageByID)


router.patch("/:id" , auth() , messageController.updateMessage)







export  default  router