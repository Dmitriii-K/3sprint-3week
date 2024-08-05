import { CommentViewModel, LikesInfo, likeStatus } from "../input-output-types/comments-type";
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
    static async likeStatus(data: likeStatus, comment: CommentViewModel): Promise<boolean> {
        // Обновление статуса лайка и счетчиков
        const updateStatus: any = {
            $set: {
                'likesInfo.myStatus': data
            },
            $inc: {
                'likesInfo.likesCount': data === likeStatus.Like ? 1 : 0,
                'likesInfo.dislikesCount': data === likeStatus.Dislike ? 1 : 0
            }
        };
    
        // Если статус сбрасывается на None, корректируем счетчики
        if (data === likeStatus.None) {
            if (comment.likesInfo.myStatus === likeStatus.Like) {
                updateStatus.$inc['likesInfo.likesCount'] = -1;
            } else if (comment.likesInfo.myStatus === likeStatus.Dislike) {
                updateStatus.$inc['likesInfo.dislikesCount'] = -1;
            }
        }
        const result = await CommetRepository.updateLikeStatus(comment.id, updateStatus);
        if (result) {
            return result;
        } else {
            return false;
        }
    }
    // static async likeStatus (data: likeStatus, comment: CommentViewModel) {
    //     // Обновление статуса лайка и счетчиков
    // const updateStatus: LikesInfo = {
    //     'likesInfo.myStatus': data,
    //     $inc: {
    //     'likesInfo.likesCount': data === 'Like' ? 1 : 0,
    //     'likesInfo.dislikesCount': data === 'Dislike' ? 1 : 0
    //     }
    // };

    //   // Если статус сбрасывается на None, корректируем счетчики
    // if (data === 'None') {
    //     if (comment.likesInfo.myStatus === 'Like') {
    //     updateStatus.$inc['likesInfo.likesCount'] = -1;
    //     } else if (comment.likesInfo.myStatus === 'Dislike') {
    //     updateStatus.$inc['likesInfo.dislikesCount'] = -1;
    //     }
    // }

    // const result = await CommetRepository.updateLikeStatus(comment.id, updateStatus);
    // if(result) {
    //     return result
    // } else {
    //     return false
    // }

    // //     // Обновление статуса лайка
    // // const previousStatus = comment.likesInfo.myStatus;
    // // comment.likesInfo.myStatus = data; // Используем переданное значение data

    // // // Обновление счетчиков лайков/дизлайков
    // // if (data === likeStatus.Like && previousStatus !== likeStatus.Like) {
    // //     comment.likesInfo.likesCount += 1;
    // // } else if (data === likeStatus.Dislike && previousStatus !== likeStatus.Dislike) {
    // //     comment.likesInfo.dislikesCount += 1;
    // // } else if (data === likeStatus.None) {
    // //     if (previousStatus === likeStatus.Like) {
    // //         comment.likesInfo.likesCount -= 1;
    // //     } else if (previousStatus === likeStatus.Dislike) {
    // //         comment.likesInfo.dislikesCount -= 1;
    // //     }
    // // }
    // // // сохранение?
    // }
    static async deleteComment (id: string) {
        const deleteResult = await CommetRepository.deleteComment(id);
        if (deleteResult) {
            return true;
        } else {
            return null;
        }
    }
}