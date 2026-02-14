const { v4: uuidv4 } = require('uuid');
import { Request, Response } from 'express';
import ThreadRepository from '../repository/ThreadRepository';
import LikeRepository from '../repository/LikeRepository';
import { AuthenticatedRequest, User } from '../utilities/interface';
import { failResponse, successResponse } from '../utilities/response';

class ThreadService {
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

  private async getThreadById(id: number) {
    const thread = await ThreadRepository.getThreadById(id);
    if (!thread) {
      return failResponse(404, 'thread tidak ditemukan');
    }
    return thread;
  }

  async getThreads(page: number, limit: number): Promise<any> {
    const id = this.credential?.id;
    const threads = await ThreadRepository.getThreads(page, limit, id);

    return threads;
  }

  async addThread(): Promise<any> {
    const { title, body } = this.body;
    const slug = uuidv4();
    const id = this.credential.id;
    const result = await ThreadRepository.addThread(
      Number(id),
      slug,
      title,
      body
    );
    if (!result) {
      return failResponse(400, 'thread gagal ditambahkan');
    }
    return successResponse(201, result);
  }

  async showByCurrentUser(page: number, limit: number): Promise<any> {
    const id = this.credential.id;
    const thread = await ThreadRepository.getThreadByUserId(page, limit, id);
    return successResponse(200, thread);
  }

  async getThreadByLikeUser(page: number, limit: number): Promise<any> {
    const id = this.credential.id;

    const likes = await LikeRepository.getThreadIdsByUserId(id);
    const thread = await ThreadRepository.getThreadByUserIdAndThreadId(
      page,
      limit,
      likes,
      id
    );
    return successResponse(200, thread);
  }

  async updateThreadById(): Promise<any> {
    const { id: threadId } = this.params;
    const { title, body } = this.body;
    const id = this.credential.id;
    const thread = await this.getThreadById(Number(threadId));

    if (thread.user_id !== id) {
      return failResponse(403, 'anda tidak berhak mengakses resource ');
    }

    await ThreadRepository.updateThread(thread.id, title, body);
    return successResponse(
      201,
      `thread yang berjudul ${thread.title}, berhasil diupdate`
    );
  }

  async deleteThreadById(): Promise<any> {
    const { id: threadId } = this.params;
    const id = this.credential.id;
    const thread = await this.getThreadById(Number(threadId));

    if (thread.user_id !== id) {
      return failResponse(403, 'anda tidak berhak mengakses resource ');
    }

    await ThreadRepository.deleteThread(thread.id);
    return successResponse(
      200,
      `thread yang berjudul ${thread.title}, berhasil dihapus`
    );
  }

  async getThreadBySlug(): Promise<any> {
    const { slug } = this.params;
    const id = this.credential?.id;
    const thread = await ThreadRepository.getThreadBySlug(slug);
    if (!thread) {
      return failResponse(404, 'thread tidak ditemukan');
    }

    const detailThread = await ThreadRepository.getDetailThread(thread.id, id);
    return { statusCode: 200, status: 'success', data: detailThread };
  }
}

export default ThreadService;
