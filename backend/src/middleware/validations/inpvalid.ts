import { body } from 'express-validator';

const registerValidation = [
  body('firstName').isLength({ min: 3 }).withMessage('Имя должно содержать не менее 3 символов.'),
  body('lastName')
    .isLength({ min: 3 })
    .withMessage('Фамилия должна содержать не менее 3 символов.'),
  body('email').isEmail().withMessage('Неверный формат электронной почты'),
  body('password')
    .isLength({ min: 5, max: 32 })
    .withMessage('Пароль должен содержать не менее 5 символов.'),
];

export default registerValidation;
