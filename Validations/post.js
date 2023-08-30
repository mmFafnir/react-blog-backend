import {body} from 'express-validator';


export const postCreateValidation = [
    body('title', 'Неверный заголовок статьи ').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').isLength({min: 3}).isString(),
    body('tags', 'Неверный формат теков (укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на картинку').optional().isString(),
];


