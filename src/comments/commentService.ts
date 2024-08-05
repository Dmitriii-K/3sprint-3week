import { CommentViewModel, likeStatus } from "../input-output-types/comments-type";
import { CommetRepository } from "./commentRepository";

export class CommentService {
    static async findUserByComment (id: string) {
        const user = await CommetRepository.findUserByComment(id)
        if(!user) {
            return null
        } else {
            return user
        }
    }
    static async updateComment (id: string, content: string) {
        const updateResult = await CommetRepository.updateComment(id, content);
        if(updateResult) {
            return updateResult
        } else {
            return false
        }
    }
    static async likeStatus (data: likeStatus, comment: CommentViewModel) {
        // Обновление статуса лайка
    const previousStatus = comment.likesInfo.myStatus;
    comment.likesInfo.myStatus = data; // Используем переданное значение data

    // Обновление счетчиков лайков/дизлайков
    if (data === likeStatus.Like && previousStatus !== likeStatus.Like) {
        comment.likesInfo.likesCount += 1;
    } else if (data === likeStatus.Dislike && previousStatus !== likeStatus.Dislike) {
        comment.likesInfo.dislikesCount += 1;
    } else if (data === likeStatus.None) {
        if (previousStatus === likeStatus.Like) {
            comment.likesInfo.likesCount -= 1;
        } else if (previousStatus === likeStatus.Dislike) {
            comment.likesInfo.dislikesCount -= 1;
        }
    }
    // сохранение?
    }
    static async deleteComment (id: string) {
        const deleteResult = await CommetRepository.deleteComment(id);
        if (deleteResult) {
            return true;
        } else {
            return null;
        }
    }
}