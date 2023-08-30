
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer'
import cors from 'cors';
import fs from 'fs';

import { loginValidation, registerValidation, updateUserValidation } from './Validations/auth.js';
import { postCreateValidation } from './Validations/post.js';
import { commentValidation, createAnswerValidation, updateValidation } from './Validations/comment.js';
import { workCreateValidation } from './Validations/work.js';

import { UserController, PostController, CommentController, WorkController } from './controllers/index.js';

import {checkAuth, handleValidErrors} from './utils/index.js';


const user = 'admin'
const password = 'admin123';

mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.epdwo.mongodb.net/blog?retryWrites=true&w=majority`)
    .then(() => {console.log('DB:OK')})
    .catch((err) => {console.log('DB: err', err)})


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});


app.use(express.json());

app.use(cors());

app.use('/uploads', express.static('uploads'));

// Auth 
app.post('/auth/login', loginValidation, handleValidErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.patch('/auth/me', checkAuth, updateUserValidation, handleValidErrors, UserController.updateMe);

//User 
app.get('/users/:id', UserController.getUser);

// Save Files
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `http://localhost:4444/uploads/${req.file.originalname}`,
    })
});

app.delete('/upload/:id', checkAuth, (req, res) => {
    try {
        console.log(req.params)
        fs.unlinkSync(`./uploads/${req.params.id}`);
        res.status(201).json({
            message: 'Картинка удалена'
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Произошла ошибка при удаении картинки'
        })
    }
});

//Posts 
app.get('/posts', PostController.getAll);
app.get('/posts/user/:id', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidErrors, PostController.update);

//Comment 
app.get('/posts/:id/comments', CommentController.getAll);
app.post('/posts/:id/comments', commentValidation, handleValidErrors, checkAuth, CommentController.create);
app.patch('/posts/comments/:commentId', updateValidation, handleValidErrors, checkAuth, CommentController.update);

//Comment Answer
app.post('/posts/comments/answers/:id', createAnswerValidation, handleValidErrors, checkAuth, CommentController.createAnswer);
app.patch('/posts/comments/answer/:id', updateValidation, handleValidErrors, checkAuth, CommentController.updateAnswer);

//Works
app.post('/works', workCreateValidation, handleValidErrors, checkAuth, WorkController.create);
app.get('/works/:id', WorkController.getAll);
app.delete('/works/:id', WorkController.remove)

app.listen(4444, (error) => {
    if(error) {
        return console.log(error)
    }
    console.log('Server ok');
});


