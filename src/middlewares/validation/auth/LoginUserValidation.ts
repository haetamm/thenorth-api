import { check } from 'express-validator';
import { userValidationRequest } from '../user/UserValidationRequest';
import UserRepository from '../../../repository/UserRepository';

const loginUserValidation = [
  check('username').trim().notEmpty().withMessage('harus diisi.'),
  check('password').trim().notEmpty().withMessage('harus diisi.'),
  check('username').custom(async (value, { req }) => {
    const user = await UserRepository.getUserByUsername(value);
    if (!user) {
      throw new Error('username or password wrong');
    }
    if (user.deletedAt) {
      throw new Error('akun telah di nonaktifkan');
    }
    return true;
  }),
  userValidationRequest,
];

export default loginUserValidation;
