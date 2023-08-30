
import WorkModel from '../modules/Work.js';


export const create = async (req, res) => {
    try {
        const doc = new WorkModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            url: req.body.url,
            userId: req.userId
        });
        
        const work = await doc.save();
        res.json(work);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось создать статью"
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const id = req.params.id;
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;
        const search = {
            userId: id
        };

        if(req.query.search) {
            search['$or'] = [
                {title: {"$regex": req.query.search, "$options": "i"}},
                {text: {"$regex": req.query.search, "$options": "i"}}
            ];
        }
        
        const totalCount = await WorkModel.find(search).countDocuments();
        const works = await WorkModel.find(search)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(req.query.limit)
            .exec();

        
        const totalPages = Math.ceil(totalCount / limit);
        res.status(200).json({
            pages: totalPages,
            page: page,
            works: works
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Не удалось найти работы пользователя"
        })
    }
}


export const remove = async (req, res) => {
    try {
        const id = req.params.id;
        WorkModel.findOneAndDelete({
            _id: id,
        }).then(doc => {
            res.json(doc)
        }).catch((err) => {
            console.log(err);
            return res.status(400).json({
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
