import mongoose from 'mongoose'
// import { WithId } from 'mongodb'
// import { ObjectId } from 'mongodb'
import { BlogDbType } from '../input-output-types/blogs-type'
import { PostDbType } from '../input-output-types/posts-type'
import { CommentatorInfo, CommentDBType, LikesInfo, likeStatus } from '../input-output-types/comments-type'
import { EmailConfirmationType, UserDBModel } from '../input-output-types/users-type'
import { ApiInfoType } from '../input-output-types/eny-type'
import { SessionsType } from '../input-output-types/sessions-types'

export const BlogSchema = new mongoose.Schema<BlogDbType>({
    // _id: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, require: true },
    isMembership: { type: Boolean, require: true }
})
export const BlogModel = mongoose.model<BlogDbType>('blogs', BlogSchema)

export const PostSchema = new mongoose.Schema<PostDbType>({
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String, require: true }
})
export const PostModel = mongoose.model<PostDbType>('posts', PostSchema)

const commentatorInfoSchema = new mongoose.Schema<CommentatorInfo>({
    userId: { type: String, required: true },
    userLogin: { type: String, required: true }
}, { _id: false });
// const likesInfo = new mongoose.Schema<LikesInfo>({
//     likesCount: { type: Number, required: true },
//     dislikesCount: { type: Number, required: true },
//     myStatus: { type: likeStatus[], required: true }
// }, { _id: false });
export const CommentSchema = new mongoose.Schema<CommentDBType>({
    postId: { type: String, require: true },
    content: { type: String, require: true },
    createdAt: { type: String, require: true },
    commentatorInfo: { type: commentatorInfoSchema, require: true },
})
export const CommentModel = mongoose.model<CommentDBType>('comments', CommentSchema)

const emailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    confirmationCode: {type: String, required: false},
    expirationDate: {type: String, required: false},
    isConfirmed: {type: Boolean, required: true}
}, { _id: false });
export const UserSchema = new mongoose.Schema<UserDBModel>({
    login: { type: String, require: true },
    password: { type: String, require: true },
    email: { type: String, require: true },
    createdAt: { type: String, require: true },
    emailConfirmation: { type: emailConfirmationSchema, require: true }
})
export const UserModel = mongoose.model<UserDBModel>('users', UserSchema)

export const ApiSchema = new mongoose.Schema<ApiInfoType>({
    ip: { type: String, require: true },
    URL: { type: String, require: true }, 
    date: { type: Date, require: true }, 
})
export const ApiModel = mongoose.model<ApiInfoType>('api-info', ApiSchema)

export const SessionSchema = new mongoose.Schema<SessionsType>({
    user_id: { type: String, require: true },
    device_id: { type: String, require: true },
    iat: { type: String, require: true },
    exp: { type: String, require: true },
    device_name: { type: String, require: true },
    ip: { type: String, require: true }
})
export const SessionModel = mongoose.model<SessionsType>('sessions', SessionSchema)