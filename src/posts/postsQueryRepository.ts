import { ObjectId, WithId } from "mongodb";
import { CommentDBType, CommentViewModel, likeStatus, PaginatorCommentViewModelDB } from "../input-output-types/comments-type";
import { PaginatorPostViewModel, PostDbType, PostViewModel, TypePostHalper } from "../input-output-types/posts-type";
// import { commentCollection, postCollection } from "../db/mongo-db";
import { halper, commentsPagination } from "../middlewares/middlewareForAll";
import { CommentModel, PostModel } from "../db/schema-model-db";

export class PostQueryRepository {
    static async getAllPosts (helper: TypePostHalper) {
        const queryParams = halper(helper);
        const items: WithId<PostDbType>[] = (await PostModel
            .find({})
            .sort({ [queryParams.sortBy]: queryParams.sortDirection })
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .exec());
        const totalCount = await PostModel.countDocuments({});
        const posts: PaginatorPostViewModel = {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items: items.map(PostQueryRepository.mapPost),
        };
        return posts
    }
    static async findPostById (id: string) {
        const mongoId = new ObjectId(id);
        const post = await PostModel.findOne({_id: mongoId});
        if (!post) {
            return null;
        };
        return PostQueryRepository.mapPost(post);
    }
    static async findCommentById (id: string) {
        const mongoId = new ObjectId(id);
        const comment = await CommentModel.findOne({_id: mongoId});
        if (!comment) {
            return null;
        };
        return PostQueryRepository.mapComment(comment);
    }
    static async findCommentByPost (helper: TypePostHalper, id: string) {
        const queryParams = commentsPagination(helper);
            const items: WithId<CommentDBType>[] = await CommentModel
            .find({ postId: id })
            .sort({ [queryParams.sortBy]: queryParams.sortDirection })
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .exec();
            const totalCount = await CommentModel.countDocuments({ postId: id });
            const comments: PaginatorCommentViewModelDB = {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items: items.map(PostQueryRepository.mapComment),
            };
            return comments
    }
    static mapPost (post: WithId<PostDbType>): PostViewModel {
        return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        };
    }
    static mapComment (comment: WithId<CommentDBType>): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo: comment.commentatorInfo,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: likeStatus.None
            }
        };
    }
}
