import PostModel from '../modules/Post.js';

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId
        });
        
        const post = await doc.save();
        res.json(post);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Ну удалось создать статью"
        })
    }
}

export const getAll = async (req, res) => {
    try {

        const id = req.params.id;

        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;
        
        
        const search = {};
        if(id) {
            search.user = {_id: id}
        }
        
        if(req.query.search) {
            search['$or'] = [
                {title: {"$regex": req.query.search, "$options": "i"}},
                {text: {"$regex": req.query.search, "$options": "i"}}
            ] 
        }
        if(req.query.tag) { 
            search['tags'] = {$in: req.query.tag }
        }

        
        const totalCount = await PostModel.find(search).countDocuments();
        const posts = await PostModel.find(search)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(req.query.limit)
        .populate('user')
        .exec();

        const totalPages = Math.ceil(totalCount / limit);
        res.status(200).json({
            pages: totalPages,
            page: page,
            posts: posts
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось найти статьи'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate(
            {_id: postId}, 
            {$inc: { viewsCount: 1 }}, 
            {returnDocument: 'after'}
        ).populate('user')
        .then((doc) => {
            res.json(doc)
        }).catch((err) => {
            console.log(err);
            res.status(404).json({
                message: 'Статья не найдена'
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось найти статью'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndDelete({
            _id: postId,
        }).then(doc => {
            res.json(doc)
        }).catch((err) => {
            console.log(err);
            return res.status(500).json({
                message: 'Ну удалось найти статью'
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Не удалось найти статью'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        const newPost = await PostModel.findOneAndUpdate({
            _id: postId,
        }, {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId
        }, {
            new: true
        }).populate('user'); 
        res.json(newPost)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Ну удалось обновить статью'
        })
    }
}