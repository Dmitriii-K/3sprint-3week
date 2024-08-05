// import { commentCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";
import { CommentModel } from "../db/schema-model-db";
import { LikesInfo } from "../input-output-types/comments-type";

export class CommetRepository {
    static async updateComment (id : string, content : string) {
        const mongoId = new ObjectId(id);
        const updateComment = await CommentModel.updateOne({ _id: mongoId },{$set: {content}});
        return updateComment.modifiedCount === 1
        
    }
    static async updateLikeStatus (id : string, updateStatus : any) {
        const mongoId = new ObjectId(id);
        const updateComment = await CommentModel.updateOne({ _id: mongoId },{$set: {updateStatus}});
        return updateComment.modifiedCount === 1
    }
    static async findUserByComment (id: string) {
        const mongoId = new ObjectId(id);
        return CommentModel.findOne({_id: mongoId});
    }
    static async deleteComment(id: string) {
        const mongoId = new ObjectId(id);
        const comment = await CommentModel.deleteOne({_id: mongoId});
        return comment.deletedCount === 1
    }
}