import { messageModel } from "../../../DB/model/Message.model.js";
import { userModel } from "../../../DB/model/User.model.js";



export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const { reciverId } = req.params;
        const user = await userModel.findById(reciverId).select("userName email")
        if (!user) {
            res.json({ message: "In-valid reciver" })
        } else {
            const newMessage = new messageModel({ text, reciverId })
            const savedMessage = await newMessage.save()
            res.json({ message: "Done", savedMessage })
        }
    } catch (error) {
        res.json({ message: "catch error", error })

    }

}


export const allMessages = async (req, res) => {
    const messages = await messageModel.find({ reciverId: req.user._id, isDeleted: false })
    res.json({ message: "Done", messages })
}




export const messageByID = async (req, res) => {
    const messages = await messageModel.findOne({
        _id: req.params.id , reciverId: req.user._id, isDeleted: false
    })
    res.json({ message: "Done", messages })
}




export const updateMessage = async (req, res) => {
    const messages = await messageModel.findOneAndUpdate({
        _id: req.params.id , reciverId: req.user._id, isDeleted: false
    }, {isDeleted:true})
    res.json({ message: "Done", messages })
}



