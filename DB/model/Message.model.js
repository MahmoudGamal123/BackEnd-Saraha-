
import { Schema  , model} from 'mongoose'
const messageSchema = new Schema({
    text: { type: String, required: true },
    reciverId:  { type: Schema.Types.ObjectId, ref:'User' ,required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
})


export const messageModel   = model('Message'  , messageSchema)