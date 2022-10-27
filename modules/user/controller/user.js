import { userModel } from "../../../DB/model/User.model.js"

import bcrypt from 'bcryptjs'

export const profile = async (req, res) => {
    const user = await userModel.findById(req.user._id)
    res.json({ message: "Done", user })
}


export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await userModel.findById(req.user._id)
    const match = await bcrypt.compare(oldPassword, user.password)
    if (!match) {
        res.json({ message: "In-valid login password" })
    } else {
        const hash = await bcrypt.hash(newPassword, parseInt(process.env.SaltRound))
        await userModel.updateOne({ _id: user._id }, { password: hash })
        res.json({ message: "Done" })

    }

}