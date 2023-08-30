import {body} from 'express-validator';


export const workCreateValidation = [
    body('title', 'Неверный заголовок работы ').isLength({min: 3}).isString(),
    body('text', 'Введите текст работы').isLength({min: 3}).isString(),
    body('tags', 'Неверный формат теков (укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на картинку').optional().isURL(),
    body('avatarUrl', 'Неверная ссылка на работу').optional().isURL(),
];
