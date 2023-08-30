import mongoose from "mongoose";



const AnswerSchemaComment = new mongoose.Schema({
    text: {
         type: String,
         trim: true,
         required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userAnswer: {
        type: String,
        required: true
    }
    }, {
        timestamps: true,
    })
    
export default mongoose.model('AnswerComment', AnswerSchemaComment);