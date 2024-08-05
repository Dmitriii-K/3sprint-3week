import { CommentViewModel, LikesType, likeStatus } from "../input-output-types/comments-type";
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
    static async likeStatus(userId: string, data: likeStatus, comment: CommentViewModel) {
        const existLike = await CommetRepository.findLike(userId)
        if(!existLike){
            const newLike: LikesType = {
                userId: userId,
                myStatus: data
            }
            if(data === likeStatus.Like){
                comment.likesInfo.likesCount ++
            } else if (data === likeStatus.Dislike) {
                comment.likesInfo.dislikesCount ++
            }
            await CommetRepository.insertLike(newLike)
        } else{
            if (existLike.myStatus !== data) {
                // Обновление счетчиков лайков и дизлайков
                if (existLike.myStatus === likeStatus.Like && data === likeStatus.Dislike) {
                    comment.likesInfo.likesCount--;
                    comment.likesInfo.dislikesCount++;
                } else if (existLike.myStatus === likeStatus.Dislike && data === likeStatus.Like) {
                    comment.likesInfo.dislikesCount--;
                    comment.likesInfo.likesCount++;
                }
                existLike.myStatus = data;
                await CommetRepository.updateLikeStatus(existLike);
                return true
            }
        }
        return false
        // Обновление статуса лайка и счетчиков
        // console.log(data) // **************************
        // const updateStatus: any = {
        //     $set: {
        //         'likesInfo.myStatus': data
        //     },
        //     $inc: {
        //         'likesInfo.likesCount': data === likeStatus.Like ? 1 : 0,
        //         'likesInfo.dislikesCount': data === likeStatus.Dislike ? 1 : 0
        //     }
        // };
        // const updateStatus: any = {
        //             'likesInfo.likeStatus': data,
        //             'likesInfo.userId': userId
        // }
        // Если статус сбрасывается на None, корректируем счетчики
        // if (data === likeStatus.None) {
        //     if (comment.likesInfo.myStatus === likeStatus.Like) {
        //         updateStatus.$inc['likesInfo.likesCount'] = -1;
        //     } else if (comment.likesInfo.myStatus === likeStatus.Dislike) {
        //         updateStatus.$inc['likesInfo.dislikesCount'] = -1;
        //     }
        // }
        // console.log(comment.id) //*************************
        // console.log(updateStatus) //*************************
        // const result = await CommetRepository.updateLikeStatus(updateStatus);
        // if (result) {
        //     return result;
        // } else {
        //     return false;
        // }
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