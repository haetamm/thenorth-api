import { Request, Response } from 'express';
import ThreadRepository from '../repository/ThreadRepository';
import LikeRepository from '../repository/LikeRepository';
import { AuthenticatedRequest } from '../utilities/interface';
import { failResponse, successResponse } from '../utilities/response';

class LikeService {
  credential: any;
  body: Request['body'];
  params: Request['params'];

  constructor(req: AuthenticatedRequest, res: Response) {
    this.credential = req?.user;
    this.body = req.body;
    this.params = req.params;
  }

  async likeUnlike(): Promise<any> {
    const { threadId } = this.params;
    const id = this.credential.id;
    const thread = await ThreadRepository.getThreadById(Number(threadId));

    if (!thread) {
      return failResponse(404, 'thread tidak ditemukan');
    }

    const like = await LikeRepository.checkLikesThread(Number(id), thread.id);

    let likeCount = 0;
    let liked = 0;
    const response = {
      like_count: likeCount,
      user_id: id,
      thread_id: thread.id,
      liked,
    };

    if (!like) {
      likeCount = await LikeRepository.likeAdd(Number(id), thread.id);
      liked = 1;
      response.like_count = likeCount;
      response.liked = liked;
      return successResponse(201, response);
    }

    if (like.deletedAt !== null) {
      likeCount = await LikeRepository.likeUpdate(like.id, thread.id);
      liked = 1;
      response.like_count = likeCount;
      response.liked = liked;
      return successResponse(201, response);
    }

    likeCount = await LikeRepository.unlikeDelete(like.id, thread.id);
    liked = 0;
    response.like_count = likeCount;
    response.liked = liked;
    return successResponse(201, response);
  }
}

export default LikeService;
