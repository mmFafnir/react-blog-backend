import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import UserModal from '../modules/User.js';


export const register = async (req, res) => {
    try {

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModal({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            description: req.body.description,
            professions: req.body.professions,
            passwordHash: hash
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 'secret123', {
            expiresIn: '30d',
        })
        
        const { passwordHash, ...userData } = user._doc;

        res.json({...userData, token});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Ну удалось зарегестрироваться'
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModal.findOne({ email: req.body.email});

        if(!user) {
            return res.status(404).json({
                massage: 'Пользователь не  найден'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if(!isValidPass) {
            return res.status(400).json({
                success: false,
                massage: 'Неверный логин или пароль'
            });
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret123',
            {
                expiresIn: '30d'
            }
        );

        const { passwordHash, ...userData } = user._doc;
        
        res.status(200).json({
            ...userData,
            token
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            massage: 'Не удалось авторизоваться'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModal.findById(req.userId);

        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        const { passwordHash, ...userData } = user._doc;
        res.status(200).json({...userData});

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Нет доступа'
        })
    }
}


export const updateMe = async (req, res) => {
    try {
         console.log(req.userId)

        const newUser = await UserModal.findOneAndUpdate({
            _id: req.userId,
        }, {
            fullName: req.body.fullName,
            professions: req.body.professions,
            description: req.body.description,
            avatarUrl: req.body.avatarUrl,
        }, {
            new: true
        }); 
        res.json(newUser)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Ну удалось обновить статью'
        })
    }
}

export const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        
        const user = await UserModal.findById(id);
        const {fullName, email, description, professions, avatarUrl, _id} = user._doc;

        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        res.status(200).json({fullName, email, description, professions, avatarUrl, _id});

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Нет доступа'
        })
    }
}


