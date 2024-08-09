import { ObjectId, WithId } from "mongodb";
import { CommentDBType, CommentViewModel, likeStatus, PaginatorCommentViewModelDB } from "../input-output-types/comments-type";
import { PaginatorPostViewModel, PostDbType, PostViewModel, TypePostHalper } from "../input-output-types/posts-type";
// import { commentCollection, postCollection } from "../db/mongo-db";
import { halper, commentsPagination } from "../middlewares/middlewareForAll";
import { CommentModel, PostModel } from "../db/schema-model-db";
import { CommetRepository } from "../comments/commentRepository";
import { CommentQueryRepository } from "../comments/commentQueryRepositiry";
import { UserDBModel } from "../input-output-types/users-type";

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

        const userLikeStatus = likeStatus.None;
        const user: WithId<UserDBModel> | undefined = undefined;

        const posts: PaginatorPostViewModel = {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items: items.map(post => PostQueryRepository.mapPost(post, userLikeStatus, user)),
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
    static async findCommentByPost (helper: TypePostHalper, id: string, userId: string | null) {
        const queryParams = commentsPagination(helper);
            const comments: WithId<CommentDBType>[] = await CommentModel
            .find({ postId: id })
            .sort({ [queryParams.sortBy]: queryParams.sortDirection })
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .exec();
            
            const totalCount = await CommentModel.countDocuments({ postId: id });

            const items = await Promise.all(comments.map( async comment => {
                let like 
                if(userId){
                    like = await CommetRepository.findLike(comment._id.toString() , userId);
                } 
                const userLikeStatus = like ? like.status : likeStatus.None;
                return CommentQueryRepository.mapComment(comment, userLikeStatus);
            })
            )

            return {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items,
            };
            
    }
    static mapPost (post: WithId<PostDbType>, userLikeStatus?: likeStatus, user?: WithId<UserDBModel>): PostViewModel {
        return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: post.extendedLikesInfo.likesCount,
            dislikesCount: post.extendedLikesInfo.dislikesCount,
            myStatus: userLikeStatus || likeStatus.None
        },
        newestLikes: post.newestLikes
        };
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
