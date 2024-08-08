import { ObjectId, WithId } from "mongodb";
// import { commentCollection } from "../db/mongo-db";
import { CommentDBType, CommentViewModel, likeStatus } from "../input-output-types/comments-type";
import { CommentModel } from "../db/schema-model-db";
import { CommetRepository } from "./commentRepository";

export class CommentQueryRepository {
    static async findCommentById (id: string, userId: string) {
        // console.log(userId)//********************
        // console.log(id)//********************
        const mongoId = new ObjectId(id);
        const comment = await CommentModel.findOne({_id: mongoId});
        if (!comment) {
            return null;
        };
        const like = await CommetRepository.findLike(id, userId);
        const userLikeStatus = like ? like.status : likeStatus.None;
        return CommentQueryRepository.mapComment(comment, userLikeStatus);
    }
    static mapComment (comment: WithId<CommentDBType>, userLikeStatus?: likeStatus): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: userLikeStatus || likeStatus.None
            }
        };
    }
}