

import {body} from 'express-validator';


export const commentValidation = [
    body('text', 'Неверный формат сообщения').isString(),    
]

export const updateValidation = [
    body('text', 'Неверный формат сообщения').isString(),
]


export const createAnswerValidation = [
    body('text', 'Неверный формат сообщения').isString(),
    body('userAnswer', 'Неверный формат имени пользователя').isString(),
]