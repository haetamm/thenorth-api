import { Request, Response } from 'express';
import CommentRepository from '../repository/CommentRepository';
import ThreadRepository from '../repository/ThreadRepository';
import { AuthenticatedRequest } from '../utilities/interface';
import { failResponse, successResponse } from '../utilities/response';

class CommentService {
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

  async addComment(): Promise<any> {
    const { threadId } = this.params;
    const { comentar } = this.body;
    const id = this.credential.id;

    const thread = await this.getThreadById(Number(threadId));
    const comment = await CommentRepository.addComment(
      Number(id),
      thread.id,
      comentar
    );

    if (!comment) {
      return failResponse(400, 'thread gagal ditambahkan');
    }

    const comments = await CommentRepository.getCommentByThreadId(thread.id);
    return successResponse(201, comments);
  }

  async deleteComment(): Promise<any> {
    const { threadId, commentId } = this.params;
    const id = this.credential.id;
    const thread = await this.getThreadById(Number(threadId));

    const comment = await CommentRepository.getCommentById(Number(commentId));
    if (!comment) {
      return failResponse(404, 'comentar tidak ditemukan');
    }

    if (id !== comment.user_id || thread.id !== comment.thread_id) {
      return failResponse(403, 'anda tidak berhak mengakses resource ini');
    }

    await CommentRepository.deleteComment(comment.id);
    const comments = await CommentRepository.getCommentByThreadId(thread.id);
    return successResponse(200, comments);
  }

  async getCommentByThreadId(): Promise<any> {
    const { threadId } = this.params;
    const thread = await this.getThreadById(Number(threadId));
    const comments = await CommentRepository.getCommentByThreadId(thread.id);
    return successResponse(200, comments);
  }
}

export default CommentService;
