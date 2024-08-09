import { ObjectId, WithId } from "mongodb";
import { BlogDbType, BlogViewModel, TypeBlogHalper, TypePostForBlogHalper } from "../input-output-types/blogs-type";
// import { blogCollection, postCollection } from "../db/mongo-db";
import { BlogModel, PostModel } from "../db/schema-model-db";
import { PostQueryRepository } from "../posts/postsQueryRepository";
import { halper } from "../middlewares/middlewareForAll";
import { PostDbType } from "../input-output-types/posts-type";
import { UserDBModel } from "../input-output-types/users-type";
import { likeStatus } from "../input-output-types/comments-type";

export class BlogQueryRepository {
    static async getAllBlogs (helper: TypeBlogHalper) {
        const queryParams = halper(helper);
        const search = helper.searchNameTerm
        ? { name: { $regex: helper.searchNameTerm, $options: "i" } }
        : {};
        const items: WithId<BlogDbType>[] = await BlogModel
            .find(search)
            .sort({ [queryParams.sortBy]: queryParams.sortDirection })
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .exec();
        const totalCount = await BlogModel.countDocuments(search);
        const blogs = {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items: items.map(BlogQueryRepository.blogMap),
        };
        return blogs
    }
    static async getBlogById (id: string) {
        const mongoId = new ObjectId(id)
        const blog =  await BlogModel.findOne({_id: mongoId});
        if (!blog) {
            return null;
        };
        return BlogQueryRepository.blogMap(blog);
    }
    static async getPostForBlogById (id: string) {
        const mongoId = new ObjectId(id)
        const post =  await PostModel.findOne({_id: mongoId});
        if (!post) {
            return null;
        };
        return PostQueryRepository.mapPost(post)
    }
    static async getPostFofBlog (helper: TypePostForBlogHalper, id: string) {
        const queryParams = halper(helper);
        const items: WithId<PostDbType>[] = await PostModel
            .find({ blogId: id })
            .sort({ [queryParams.sortBy]: queryParams.sortDirection })
            .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
            .limit(queryParams.pageSize)
            .exec();
        const totalCount = await PostModel.countDocuments({ blogId: id });

        const userLikeStatus = likeStatus.None;
        const user: WithId<UserDBModel> | undefined = undefined;

        const posts = {
            pagesCount: Math.ceil(totalCount / queryParams.pageSize),
            page: queryParams.pageNumber,
            pageSize: queryParams.pageSize,
            totalCount,
            items: items.map(post => PostQueryRepository.mapPost(post, userLikeStatus, user)),
        };
        return posts
    }
    static blogMap (blog: WithId<BlogDbType>): BlogViewModel {
        return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
        };
    }
};