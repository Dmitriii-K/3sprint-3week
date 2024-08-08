import request from 'supertest';
const app = require('./app'); // Подключите Ваше приложение Express

describe('User API', () => {
    it('should create a new user', async () => {
    const userData = {
    login: 'testuser',
    password: 'password123',
    email: 'testuser@example.com',
    };

    const response = await request(app)
    .post('/api/users')
    .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.login).toBe(userData.login);
    expect(response.body.email).toBe(userData.email);
    expect(response.body.createdAt).toBeDefined();
    });
    it('should delete a user', async () => {
    const userId = '123'; // Замените на существующий ID пользователя

    const response = await request(app).delete(`/api/users/${userId}`);

    expect(response.status).toBe(204);
    });
    it('should get a list of users', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('pagesCount');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('pageSize');
    expect(response.body).toHaveProperty('totalCount');
    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe
    })
})


describe('UserController', () => {
    describe('POST /users', () => {
        it('should create a new user and return 201 status', async () => {
            const newUser = {
                login: 'testuser',
                password: 'password123',
                email: 'test@example.com'
            };

            const response = await request(app)
                .post('/users')
                .send(newUser)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.login).toBe(newUser.login);
            expect(response.body.email).toBe(newUser.email);
        });

        it('should return 400 if user with the same login or email already exists', async () => {
            const existingUser = {
                login: 'existinguser',
                password: 'password123',
                email: 'existing@example.com'
            };

            // Создаем пользователя, чтобы протестировать дубликат
            await request(app)
                .post('/users')
                .send(existingUser)
                .expect(201);

            const response = await request(app)
                .post('/users')
                .send(existingUser)
                .expect(400);

            expect(response.body).toEqual({
                errorsMessages: [{ message: 'email and login should be unique', field: 'email and login' }]
            });
        });
    });
    describe('DELETE /users/:id', () => {
        it('should delete a user and return 204 status', async () => {
            const newUser = {
                login: 'todelete',
                password: 'password123',
                email: 'todelete@example.com'
            };

            const createResponse = await request(app)
                .post('/users')
                .send(newUser)
                .expect(201);

            const userId = createResponse.body.id;

            await request(app)
                .delete(`/users/${userId}`)
                .expect(204);
        });

        it('should return 404 if user does not exist', async () => {
            const nonExistentUserId = '603c7bfb4b97f4a3e0ccb4a2'; // Несуществующий ID

            await request(app)
                .delete(`/users/${nonExistentUserId}`)
                .expect(404);
        });
    });
    describe('GET /users', () => {
        it('should return a list of users', async () => {
            const response = await request(app)
                .get('/users')
                .expect(200);

            expect(response.body).toHaveProperty('items');
            expect(Array.isArray(response.body.items)).toBe(true);
        });
    });
});