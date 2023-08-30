import mongoose from "mongoose";



const CommentSchema = new mongoose.Schema({
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
    postId: {
        type: String,
        require: true
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnswerComment',
        required: false
    }]
    }, {
        timestamps: true,
    })

export default mongoose.model('Comment', CommentSchema);