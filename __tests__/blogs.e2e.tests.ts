import request from 'supertest';
const app = require('./app'); // Подразумевается, что Ваше приложение находится в файле app.js

describe('BlogController', () => {
it('should create a new blog', async () => {
    const newBlogData = {
    name: 'Test Blog',
    description: 'This is a test blog',
    websiteUrl: 'http://www.testblog.com'
    };

    const res = await request(app)
    .post('/blog')
    .send(newBlogData);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe(newBlogData.name);
});
it('should create a new post for a blog', async () => {
    // Предположим, что у Вас уже есть блог с ID "12345"
    const newPostData = {
    title: 'Test Post',
    shortDescription: 'This is a test post',
    content: 'Lorem ipsum dolor sit amet'
    };

    const res = await request(app)
    .post('/blog/12345/post')
    .send(newPostData);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(newPostData.title);
});
it('should get all blogs', async () => {
    const res = await request(app)
    .get('/blogs');

    expect(res.status).toBe(200);
     // Дополнительные проверки здесь
});
});


describe('BlogController', () => {
    describe('POST /blogs', () => {
        it('should create a new blog and return 201 status', async () => {
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'http://testblog.com'
            };

            const response = await request(app)
                .post('/blogs')
                .send(newBlog)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(newBlog.name);
            expect(response.body.description).toBe(newBlog.description);
            expect(response.body.websiteUrl).toBe(newBlog.websiteUrl);
        });

        it('should return 500 if blog creation fails', async () => {
            const invalidBlog = {
                name: '', // Invalid name
                description: 'This is a test blog',
                websiteUrl: 'http://testblog.com'
            };

            await request(app)
                .post('/blogs')
                .send(invalidBlog)
                .expect(500);
        });
    });
    describe('POST /blogs/:id/posts', () => {
        it('should create a new post for a blog and return 201 status', async () => {
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'http://testblog.com'
            };

            const createBlogResponse = await request(app)
                .post('/blogs')
                .send(newBlog)
                .expect(201);

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post'
            };

            const response = await request(app)
                .post(`/blogs/${createBlogResponse.body.id}/posts`)
                .send(newPost)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newPost.title);
            expect(response.body.shortDescription).toBe(newPost.shortDescription);
            expect(response.body.content).toBe(newPost.content);
        });

        it('should return 404 if blog does not exist', async () => {
            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post'
            };

            await request(app)
                .post('/blogs/non-existent-id/posts')
                .send(newPost)
                .expect(404);
        });
    });
    describe('GET /blogs', () => {
        it('should return a list of blogs', async () => {
            const response = await request(app)
                .get('/blogs')
                .expect(200);

            expect(response.body).toHaveProperty('items');
            expect(Array.isArray(response.body.items)).toBe(true);
        });
    });
    describe('GET /blogs/:id', () => {
        it('should return a blog by ID', async () => {
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'http://testblog.com'
            };

            const createBlogResponse = await request(app)
                .post('/blogs')
                .send(newBlog)
                .expect(201);

            const response = await request(app)
                .get(`/blogs/${createBlogResponse.body.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(newBlog.name);
            expect(response.body.description).toBe(newBlog.description);
            expect(response.body.websiteUrl).toBe(newBlog.websiteUrl);
        });

        it('should return 404 if blog does not exist', async () => {
            await request(app)
                .get('/blogs/non-existent-id')
                .expect(404);
        });
    });
    describe('GET /blogs/:id/posts', () => {
        it('should return posts for a blog', async () => {
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'http://testblog.com'
            };

            const createBlogResponse = await request(app)
                .post('/blogs')
                .send(newBlog)
                .expect(201);

            const newPost = {
                title: 'Test Post',
                shortDescription: 'This is a test post',
                content: 'This is the content of the test post'
            };

            await request(app)
                .post(`/blogs/${createBlogResponse.body.id}/posts`)
                .send(newPost)
                .expect(201);

            const response = await request(app)
                .get(`/blogs/${createBlogResponse.body.id}/posts`)
                .expect(200);

            expect(response.body).toHaveProperty('items');
            expect(Array.isArray(response.body.items)).toBe(true);
        });

        it('should return 404 if blog does not exist', async () => {
            await request(app)
                .get('/blogs/non-existent-id/posts')
                .expect(404);
        });
    });
    describe('PUT /blogs/:id', () => {
        it('should update a blog and return 204 status', async () => {
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'http://testblog.com'
            };

            const createBlogResponse = await request(app)
                .post('/blogs')
                .send(newBlog)
                .expect(201);

            const updatedBlog = {
                name: 'Updated Blog',
                description: 'This is an updated blog',
                websiteUrl: 'http://updatedblog.com'
            };

            await request(app)
                .put(`/blogs/${createBlogResponse.body.id}`)
                .send(updatedBlog)
                .expect(204);
        });

        it('should return 404 if blog does not exist', async () => {
            const updatedBlog = {
                name: 'Updated Blog',
                description: 'This is an updated blog',
                websiteUrl: 'http://updatedblog.com'
            };

            await request(app)
                .put('/blogs/non-existent-id')
                .send(updatedBlog)
                .expect(404);
        });
    });
    describe('DELETE /blogs/:id', () => {
        it('should delete a blog and return 204 status', async () => {
            const newBlog = {
                name: 'Test Blog',
                description: 'This is a test blog',
                websiteUrl: 'http://testblog.com'
            };

            const createBlogResponse = await request(app)
                .post('/blogs')
                .send(newBlog)
                .expect(201);

            await request(app)
                .delete(`/blogs/${createBlogResponse.body.id}`)
                .expect(204);
        });

        it('should return 404 if blog does not exist', async () => {
            await request(app)
                .delete('/blogs/non-existent-id')
                .expect(404);
        });
    });
});