import BaseRoutes from './base/BaseRouter';
import addUserValidation from '../middlewares/validation/user/AddUserValidation';
import UserController from '../controllers/user/UserController';
import { auth } from '../middlewares/AuthMiddleware';
import { admin } from '../middlewares/AdminMiddleware';
import { updateUserValidation } from '../middlewares/validation/user/UpdateUserValidation';

class UserRoutes extends BaseRoutes {
  public routes(): void {
    this.router.get('/', auth, admin, UserController.index);
    this.router.post('/', addUserValidation, UserController.create);
    this.router.put('/', auth, updateUserValidation, UserController.update);
    this.router.get('/me', auth, UserController.show);
    this.router.delete('/:id', auth, admin, UserController.delete);
    this.router.post('/:username/active', auth, admin, UserController.active);
  }
}

export default new UserRoutes().router;
