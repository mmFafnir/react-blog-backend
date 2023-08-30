
import {body} from 'express-validator';


export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должет быть минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должет быть минимум 5 символов').isLength({min: 5}),
];


export const updateUserValidation = [
    body('fullName', 'Укажите имя').isLength({min: 3}).isString(),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isString(),
    body('professions', 'Неверный формат проффесии').optional().isLength({min: 3}),
    body('description', 'Описание должно содержать более 3 символов').optional().isLength({min: 3}),
];
