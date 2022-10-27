import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userModel } from "../../../DB/model/User.model.js"
import { sendEmail } from '../../../service/sendEmail.js'
import { nanoid } from 'nanoid'
import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';
export const signup = async (req, res) => {
    try {
        const { email, password, userName } = req.body
        const user = await userModel.findOne({ email }).select("email")
        if (user) { 
            res.status(400).json({ message: "Email exist" })
        } else {
            const hashPassword = await bcrypt.hash(password, parseInt(process.env.SaltRound))
            const newUser = new userModel({ email, password: hashPassword, userName })
            const saveduser = await newUser.save()
            const token = jwt.sign({ id: saveduser._id }, process.env.confirmEmailToken,
                { expiresIn: 60 * 60 })
            const rfToken = jwt.sign({ id: saveduser._id }, process.env.confirmEmailToken)
            const emailMessage = `<a href='${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}'> Follow me to confrim Your account</a> 
            <br>
<a href='${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/requestRfToken/${rfToken}'> request new link</a>`
            sendEmail(saveduser.email, 'Confirm Email', emailMessage)
            saveduser ? res.status(201).json({ message: "Done", emailMessage }) :
                res.status(400).json({ message: "fail to add new User" })
        }
    } catch (error) {
        res.status(500).json({ message: "Catch error", error })
    }
}

export const requestRefToken = async (req, res) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.confirmEmailToken)
    if (!decoded?.id) {
        res.json({ message: "In-valid token payload" })
    } else {
        const user = await userModel.findById(decoded.id)
        if (user?.confirmEmail) {
            res.json({ message: "Already confirmed" })
        } else {
            const token = jwt.sign({ id: user._id }, process.env.confirmEmailToken,
                { expiresIn: 60 * 2 })
            const emailMessage = `<a href='${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}'>
             Follow me to confrim Your account</a> `
            sendEmail(user.email, 'Confirm-Email', emailMessage)
            res.json({ message: "Done" })

        }
    }
}

export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.confirmEmailToken)
        const user = await userModel.updateOne({ _id: decoded.id, confirmEmail: false },
            { confirmEmail: true })
        user.modifiedCount ? res.json({ message: "Email confirmed plz login " }) :
            res.json({ message: "eathir email already confirmed or in-valid email " })
    } catch (error) {
        res.json({ message: "catch error", error })
    }

}


export const signin = async (req, res) => {


        const { email, password } = req.body
        const user = await userModel.findOne({ email })// {} null
        if (!user) {
            res.status(404).json({ message: "in-valid account" })
        } else {
            if (!user.confirmEmail) {
                res.json({ message: "Plz confirm your email first" })
            } else {
                const match = await bcrypt.compare(password, user.password) // t f
                if (!match) {
                    res.json({ message: "In-valid password" })
                } else {
                    const token = jwt.sign({ id: user._id, isLoggedIn: true },
                        process.env.TOKENSIGNATURE,
                        { expiresIn: 60 * 60 })
                    await userModel.updateOne({ _id: user._id }, { online: true })
                    res.status(StatusCodes.OK).json({ message: "Done", token , statusCode:getReasonPhrase(StatusCodes.OK)})
                }

            }
        }
}


export const sendCode = async (req, res) => {
    const { email } = req.body
    const user = await userModel.findOne({ email }).select('email blocked  isDeleted')
    if (user?.isDeleted || user?.blocked) {
        res.json({ message: "Can not send code to not register account or blocked" })
    } else {
        const code = nanoid()
        await userModel.updateOne({ _id: user._id }, { code })
        sendEmail(user.email,
            'forget password', `<h1> Plz Use this code : ${code} to reset u password</h1>`)
        res.json({ message: "Done" })
    }
}


export const forgetPassword = async (req, res) => {
    const { email, code, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        res.json({ message: "Not register account" })
    } else {
        if (user.code != code || code == null) {
            res.json({ message: "In-valid Code" })
        } else {
            const hashPassword = await bcrypt.hash(password, parseInt(process.env.SaltRound))
            await userModel.updateOne({ _id: user._id }, { password: hashPassword, code: null })
            res.json({ message: "Done" })
        }
    }
}