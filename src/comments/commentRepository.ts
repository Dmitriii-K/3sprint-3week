// import { commentCollection } from "../db/mongo-db";
import { ObjectId } from "mongodb";
import { CommentModel, LikesModel } from "../db/schema-model-db";
import { LikesType } from "../input-output-types/comments-type";

export class CommetRepository {
    static async updateComment (id : string, content : string) {
        const mongoId = new ObjectId(id);
        const updateComment = await CommentModel.updateOne({ _id: mongoId },{$set: {content}});
        return updateComment.modifiedCount === 1
        
    }
    static async findLike(id: string){
        const mongoId = new ObjectId(id);
        return LikesModel.findOne({_id: mongoId});
    }
    static async insertLike (data: LikesType) {
        const result = CommentModel.create(data);
        return (await result)._id.toString()
    }
    static async updateLikeStatus ( updateStatus : any) {
        // console.log(id) //*************************
        const updateComment = await CommentModel.create(updateStatus);
        return (await updateComment)._id.toString()
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