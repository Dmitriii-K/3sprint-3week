import { WithId } from "mongodb";
import { CommentDBType, CommentInputModel, likeStatus } from "../input-output-types/comments-type";
import { PostDbType, PostInputModel, PostViewModel } from "../input-output-types/posts-type";
import { UserDBModel } from "../input-output-types/users-type";
import { PostRepository } from "./postsRepository";
import { UserRepository } from "../users/userRepository";

export class PostService {
    static async createPost (data: PostInputModel, id: string, user: WithId<UserDBModel>) {
        const findBlogNameForId = await PostRepository.findBlogNameForId(id)
        const createDate = new Date().toISOString();
        const newPost: PostDbType = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: findBlogNameForId!.name,
            createdAt: createDate,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
            },
            newestLikes: []
        };
        return PostRepository.insertPost(newPost);
    }
    static async createCommentByPost (paramId: string, data: CommentInputModel, user: WithId<UserDBModel>) {
        const post = await PostRepository.findPostById(paramId);
        const createDate = new Date().toISOString();
        const newComment: CommentDBType = {
            postId: paramId,
            content: data.content,
            createdAt:	createDate,
            commentatorInfo: { 
                userId:	user._id.toString(),
                userLogin: user.login,
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0
            }
        };
        return PostRepository.insertComment(newComment)
    }
    static async updatePostLike(userId: string, data: likeStatus, post: WithId<PostDbType>) {
        const userLikeIndex = post.newestLikes.findIndex(like => like.userId === userId);
        if (userLikeIndex !== -1) {
            post.newestLikes.splice(userLikeIndex, 1);
        }

        if (data === likeStatus.Like) {
            post.extendedLikesInfo.likesCount += 1;
            post.newestLikes.unshift({
                addedAt: new Date().toISOString(),
                userId: userId,
                login: (await UserRepository.findUserById(userId))!.login
            });
        } else if (data === likeStatus.Dislike) {
            post.extendedLikesInfo.dislikesCount += 1;
        }

        if (post.newestLikes.length > 3) {
            post.newestLikes.pop();
        }

        await PostRepository.updatePostLikes(post);
        return true;

        // const isAlreadyLiked = post.extendedLikesInfo.likesCount > 0 && post.newestLikes.find(like => like.userId === userId);
        // const isAlreadyDisliked = post.extendedLikesInfo.dislikesCount > 0 && post.newestLikes.find(like => like.userId === userId);

        // let update: { $set: { extendedLikesInfo: ExtendedLikesInfoType, newestLikes: NewestLikesType[] } };
    
        // switch (likeStatus) {
        // case likeStatus.Like:
        //     if (!isAlreadyLiked) {
        //     const newLike = {
        //         addedAt: new Date().toISOString(),
        //         userId,
        //         login: "", // Assuming you have a way to get user login
        //     };
        //     const updatedLikesCount = post.extendedLikesInfo.likesCount + 1;
        //     const updatedNewestLikes = post.newestLikes.length >= 3 ? post.newestLikes.slice(1).concat(newLike) : [...post.newestLikes, newLike];
        //     update = { $set: { extendedLikesInfo: { likesCount: updatedLikesCount, dislikesCount: post.extendedLikesInfo.dislikesCount }, newestLikes: updatedNewestLikes } };
        //     }
        //     break;
        // case likeStatus.Dislike:
        //     if (!isAlreadyDisliked) {
        //     const newDislike = {
        //         addedAt: new Date().toISOString(),
        //         userId,
        //         login: "", // Assuming you have a way to get user login
        //     };
        //     const updatedDislikesCount = post.extendedLikesInfo.dislikesCount + 1;
        //     const updatedNewestLikes = post.newestLikes.length >= 3 ? post.newestLikes.slice(1).concat(newDislike) : [...post.newestLikes, newDislike];
        //     update = { $set: { extendedLikesInfo: { likesCount: post.extendedLikesInfo.likesCount, dislikesCount: updatedDislikesCount }, newestLikes: updatedNewestLikes } };
        //     }
        //     break;
        // case likeStatus.None:
        //     if (isAlreadyLiked) {
        //     const updatedLikesCount = post.extendedLikesInfo.likesCount - 1;
        //     const updatedNewestLikes = post.newestLikes.filter(like => like.userId !== userId);
        //     update = { $set: { extendedLikesInfo: { likesCount: updatedLikesCount, dislikesCount: post.extendedLikesInfo.dislikesCount }, newestLikes: updatedNewestLikes } };
        //     } else if (isAlreadyDisliked) {
        //     const updatedDislikesCount = post.extendedLikesInfo.dislikesCount - 1;
        //     const updatedNewestLikes = post.newestLikes.filter(like => like.userId !== userId);
        //     update = { $set: { extendedLikesInfo: { likesCount: post.extendedLikesInfo.likesCount, dislikesCount: updatedDislikesCount }, newestLikes: updatedNewestLikes } };
        //     }
        //     break;
        // }
    
        // if (update) {
        // await PostModel.updateOne({ _id: post._id }, update);
        // return true;
        // }
        // return false;
    }
    static async updatePost (data: PostInputModel, id: string) {
        const succsesUpdate = await PostRepository.updatePost(data, id)
        if(succsesUpdate) {
            return succsesUpdate
        } else {
            return false
        }
    }
    static async deletePost (id: string) {
        const result = await PostRepository.deletePost(id)
        if(result) {
            return true
                } else {
            return false
            }
    }
}