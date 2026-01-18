import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server';
import User from '../models/User';
import Application from '../models/Application';

let mongoServer: MongoMemoryServer;
let authCookie: string[];

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create and login a test user
    const res = await request(app)
        .post('/api/auth/register')
        .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });

    authCookie = res.headers['set-cookie'];
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Application.deleteMany({});
});

describe('Application Routes', () => {
    describe('POST /api/applications', () => {
        it('should create a new application', async () => {
            const res = await request(app)
                .post('/api/applications')
                .set('Cookie', authCookie)
                .send({
                    companyName: 'Google',
                    jobTitle: 'Software Engineer',
                    jobPortal: 'LinkedIn',
                    employmentType: 'Full-time',
                    source: 'Job board',
                    status: 'Applied',
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('companyName', 'Google');
        });

        it('should not create application without auth', async () => {
            const res = await request(app)
                .post('/api/applications')
                .send({
                    companyName: 'Google',
                    jobTitle: 'Software Engineer',
                });

            expect(res.status).toBe(401);
        });

        it('should validate required fields', async () => {
            const res = await request(app)
                .post('/api/applications')
                .set('Cookie', authCookie)
                .send({
                    companyName: 'Google',
                });

            expect(res.status).toBe(400);
            expect(res.body.errors).toBeDefined();
        });
    });

    describe('GET /api/applications', () => {
        beforeEach(async () => {
            await Application.create([
                {
                    userId: (await User.findOne({ email: 'test@example.com' }))!._id,
                    companyName: 'Google',
                    jobTitle: 'Software Engineer',
                    jobPortal: 'LinkedIn',
                    employmentType: 'Full-time',
                    source: 'Job board',
                    status: 'Applied',
                },
                {
                    userId: (await User.findOne({ email: 'test@example.com' }))!._id,
                    companyName: 'Microsoft',
                    jobTitle: 'Frontend Developer',
                    jobPortal: 'Naukri',
                    employmentType: 'Full-time',
                    source: 'Referral',
                    status: 'HR Screen',
                },
            ]);
        });

        it('should get all applications', async () => {
            const res = await request(app)
                .get('/api/applications')
                .set('Cookie', authCookie);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.pagination).toBeDefined();
        });

        it('should filter by status', async () => {
            const res = await request(app)
                .get('/api/applications?status=Applied')
                .set('Cookie', authCookie);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].status).toBe('Applied');
        });

        it('should search by company name', async () => {
            const res = await request(app)
                .get('/api/applications?search=Google')
                .set('Cookie', authCookie);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].companyName).toBe('Google');
        });

        it('should paginate results', async () => {
            const res = await request(app)
                .get('/api/applications?page=1&limit=1')
                .set('Cookie', authCookie);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.pagination.pages).toBe(2);
        });
    });

    describe('GET /api/applications/:id', () => {
        it('should get single application', async () => {
            const app1 = await Application.create({
                userId: (await User.findOne({ email: 'test@example.com' }))!._id,
                companyName: 'Google',
                jobTitle: 'Software Engineer',
                jobPortal: 'LinkedIn',
                employmentType: 'Full-time',
                source: 'Job board',
            });

            const res = await request(app)
                .get(`/api/applications/${app1._id}`)
                .set('Cookie', authCookie);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.companyName).toBe('Google');
        });

        it('should return 404 for non-existent application', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/applications/${fakeId}`)
                .set('Cookie', authCookie);

            expect(res.status).toBe(404);
        });
    });

    describe('PUT /api/applications/:id', () => {
        it('should update application', async () => {
            const app1 = await Application.create({
                userId: (await User.findOne({ email: 'test@example.com' }))!._id,
                companyName: 'Google',
                jobTitle: 'Software Engineer',
                jobPortal: 'LinkedIn',
                employmentType: 'Full-time',
                source: 'Job board',
                status: 'Applied',
            });

            const res = await request(app)
                .put(`/api/applications/${app1._id}`)
                .set('Cookie', authCookie)
                .send({
                    status: 'HR Screen',
                });

            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe('HR Screen');
            expect(res.body.data.statusHistory).toHaveLength(2);
        });
    });

    describe('DELETE /api/applications/:id', () => {
        it('should delete application', async () => {
            const app1 = await Application.create({
                userId: (await User.findOne({ email: 'test@example.com' }))!._id,
                companyName: 'Google',
                jobTitle: 'Software Engineer',
                jobPortal: 'LinkedIn',
                employmentType: 'Full-time',
                source: 'Job board',
            });

            const res = await request(app)
                .delete(`/api/applications/${app1._id}`)
                .set('Cookie', authCookie);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);

            const found = await Application.findById(app1._id);
            expect(found).toBeNull();
        });
    });

    describe('GET /api/applications/follow-ups', () => {
        it('should get applications needing follow-up', async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            await Application.create({
                userId: (await User.findOne({ email: 'test@example.com' }))!._id,
                companyName: 'Google',
                jobTitle: 'Software Engineer',
                jobPortal: 'LinkedIn',
                employmentType: 'Full-time',
                source: 'Job board',
                status: 'Applied',
                followUpDate: yesterday,
            });

            const res = await request(app)
                .get('/api/applications/follow-ups')
                .set('Cookie', authCookie);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });
    });
});
