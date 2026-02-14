import BaseRoutes from './base/BaseRouter';
import ThreadController from '../controllers/thread/ThreadController';
import { auth } from '../middlewares/AuthMiddleware';
import threadValidation from '../middlewares/validation/thread/ThreadValidation';
import { guest } from '../middlewares/GuestMiddleware';

class ThreadRoutes extends BaseRoutes {
  public routes(): void {
    this.router.get('/', guest, ThreadController.index);
    this.router.post('/', auth, threadValidation, ThreadController.create);
    this.router.get('/me', auth, ThreadController.showByCurrentUser);
    this.router.get('/likes', auth, ThreadController.showByLikeUser);
    this.router.put('/:id', auth, threadValidation, ThreadController.update);
    this.router.get('/:slug', guest, ThreadController.show);
    this.router.delete('/:id', auth, ThreadController.delete);
  }
}

export default new ThreadRoutes().router;
