import { Request, Response } from 'express';
import UserRepository from '../repository/UserRepository';
import AuthenticationService from './AuthenticationService';
import AddedUser from '../entities/AddedUser';
import ThreadRepository from '../repository/ThreadRepository';
import GettedUser from '../entities/GetttedUser';
import CommentRepository from '../repository/CommentRepository';
import LikeRepository from '../repository/LikeRepository';
import RoleRepository from '../repository/RoleRepository';
import UserRoleRepository from '../repository/UserRoleRepository';
import { AuthenticatedRequest } from '../utilities/interface';
import { failResponse, successResponse } from '../utilities/response';

class UserService {
  credential: any;
  body: Request['body'];
  params: Request['params'];

  constructor(req: AuthenticatedRequest, res: Response) {
    if (req.user) {
      this.credential = req.user;
    } else {
      this.credential = null;
    }
    this.body = req.body;
    this.params = req.params;
  }

  private async getUserById(id: number) {
    const user = await UserRepository.getUserById(id);
    if (!user) {
      return failResponse(404, 'user tidak ditemukan');
    }
    return user;
  }

  async getUsers(page: number, limit: number): Promise<any> {
    const users = await UserRepository.getUsers(page, limit);
    return users;
  }

  async addUser(): Promise<any> {
    const { username, password } = this.body;
    const hashedPassword: string =
      await AuthenticationService.passwordHash(password);
    const user = await UserRepository.addUser(username, hashedPassword);
    if (!user) {
      return failResponse(400, 'user gagal ditambahkan');
    }

    const role = await RoleRepository.findByName('USER');
    if (!role) {
      return failResponse(404, 'Role USER tidak ditemukan');
    }

    await UserRoleRepository.addUserRole(user.id, role.id);

    return successResponse(201, new AddedUser(user));
  }

  async getUser(): Promise<any> {
    const id = this.credential.id;
    const user = await this.getUserById(id);
    return successResponse(200, new GettedUser(user));
  }

  async updateUser(): Promise<any> {
    const { username, password } = this.body;
    const id = this.credential.id;
    const user = await this.getUserById(id);

    const hashedPassword = password
      ? await AuthenticationService.passwordHash(password)
      : undefined;
    await UserRepository.updateUserById(user.id, username, hashedPassword);
    return successResponse(201, `profile ${user.username} berhasil diupdate`);
  }

  async deleteUserById(): Promise<any> {
    const { id } = this.params;
    const user = await this.getUserById(Number(id));
    const expiresDate = new Date();

    if (new Date(user.expried_token) > expiresDate) {
      return failResponse(403, 'user sedang online');
    }

    await UserRepository.updateExpriedToken(expiresDate, user.id);
    await Promise.all([
      UserRepository.deleteUser(user.id),
      ThreadRepository.deleteThreadByUserId(user.id),
      CommentRepository.deleteCommentByUserId(user.id),
      LikeRepository.deleteLikeByUserId(user.id),
    ]);

    return successResponse(
      201,
      `user ${user.username}, berhasil dinonaktifkan`
    );
  }

  async activatedUser(): Promise<any> {
    const { username } = this.params;
    const user = await UserRepository.getUserByUsername(username);

    if (!user) {
      return failResponse(404, 'user tidak ditemukan');
    }

    if (user.deletedAt === null) {
      return failResponse(403, 'user masih active');
    }

    await UserRepository.reactivateUser(user.username);
    await ThreadRepository.reactivateThread(user.id, user.deletedAt);
    await CommentRepository.reactivateComment(user.id, user.deletedAt);
    await LikeRepository.reactivateLike(user.id, user.deletedAt);

    return successResponse(201, 'user berhasil diaktifkan');
  }
}

export default UserService;
