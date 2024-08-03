// import { commentCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";
import { CommentModel } from "../db/schema-model-db";

export class CommetRepository {
    static async updateComment (id : string, content : string) {
        const mongoId = new ObjectId(id);
        const updateComment = await CommentModel.updateOne({ _id: mongoId },{$set: {content}});
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