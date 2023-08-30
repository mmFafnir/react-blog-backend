import PostModel from '../modules/Post.js'; 
import CommentModel from '../modules/Comments.js';
import AnswerModel from '../modules/AnswerComment.js';


export const create = async (req, res) => {
    try {
        const id = req.params.id;
        const doc = await CommentModel.create({
            postId: id,
            text: req.body.text,
            user: req.userId
        });
        
        const comment = await CommentModel.findOne({ _id: doc._id }).populate('user').exec();
        
        res.json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось создать статью"
        });
    }
}

export const update = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        
        const newComment = await CommentModel.findOneAndUpdate({
            _id: commentId,
        }, {
            text: req.body.text
        }, {
            new: true
        }).populate('answers'); 

        res.json(newComment)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            "message": "Не удалось найти коммент"
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const id = req.params.id;
        const page = req.query.page || 1; // текущая страница
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const totalCount = await CommentModel.countDocuments({ postId: id });
        const comments = await CommentModel.find({postId:id})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(req.query.limit)
        .populate('user')
        .populate('answers')
        .populate({
            path:     'answers',			
	        populate: { path:  'user',
		    model: 'User' }
        })
        .exec();
        
        const totalPages = Math.ceil(totalCount / limit);
        res.status(200).json({
            pages: totalPages,
            page: page,
            comments: comments
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось найти комментарии'
        })
    }
}

export const createAnswer = async (req, res) => {
    try {
        const commentId = req.params.id;

        const doc = await AnswerModel.create({
            text: req.body.text,
            userAnswer: req.body.userAnswer,
            user: req.userId
        });

        const answer = await AnswerModel.findById(doc._id).populate('user').exec();
        const commentRelated = await CommentModel.findById(commentId)
        .populate('answers')
        .populate('user')
        .populate({
            path: 'answers',
            populate: {path: 'user', model: 'User'}
        });
        commentRelated.answers.push(answer);
        
        await commentRelated.save();
        
        res.json(commentRelated);

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Не удалось создать статью"
        })
    }
}

export const updateAnswer = async (req, res) => {
    try {
        const commentId = req.params.id;
        const newAnswer = await AnswerModel.findOneAndUpdate({
            _id: commentId,
        }, {
            text: req.body.text
        }, {
            new: true
        })
        
        res.json(newAnswer);

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Не удалось создать статью"
        })
    }
}



