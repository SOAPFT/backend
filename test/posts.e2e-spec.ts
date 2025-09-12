import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestAppModule } from './test-app.module';

describe('Posts E2E Tests', () => {
  let app: INestApplication;
  let authToken: string;
  let postId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get auth token
    const tokenResponse = await request(app.getHttpServer())
      .post('/auth/dev-token')
      .expect(201);

    authToken = tokenResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /posts', () => {
    it('should create a post successfully', async () => {
      const postData = {
        content: 'This is a test post',
        images: ['https://example.com/image1.jpg'],
        challengeId: null,
      };

      const response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(201);

      expect(response.body).toHaveProperty('postId');
      expect(response.body.message).toBe('게시글이 생성되었습니다.');
      postId = response.body.postId;
    });

    it('should fail to create post without content', () => {
      const postData = {
        images: ['https://example.com/image1.jpg'],
      };

      return request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(400);
    });

    it('should fail to create post without authentication', () => {
      const postData = {
        content: 'This is a test post',
        images: ['https://example.com/image1.jpg'],
      };

      return request(app.getHttpServer())
        .post('/posts')
        .send(postData)
        .expect(401);
    });
  });

  describe('GET /posts', () => {
    it('should get posts successfully', () => {
      return request(app.getHttpServer())
        .get('/posts?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('posts');
          expect(res.body).toHaveProperty('totalCount');
          expect(Array.isArray(res.body.posts)).toBe(true);
        });
    });

    it('should handle pagination parameters', () => {
      return request(app.getHttpServer())
        .get('/posts?page=2&limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('GET /posts/:postId', () => {
    it('should get post by ID successfully', () => {
      return request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('postId');
          expect(res.body).toHaveProperty('content');
          expect(res.body).toHaveProperty('images');
          expect(res.body).toHaveProperty('author');
        });
    });

    it('should return 404 for non-existent post', () => {
      return request(app.getHttpServer())
        .get('/posts/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /posts/:postId', () => {
    it('should update post successfully', () => {
      const updateData = {
        content: 'Updated post content',
        images: ['https://example.com/updated-image.jpg'],
      };

      return request(app.getHttpServer())
        .put(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('게시글이 수정되었습니다.');
        });
    });

    it('should fail to update non-existent post', () => {
      const updateData = {
        content: 'Updated content',
      };

      return request(app.getHttpServer())
        .put('/posts/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /posts/:postId', () => {
    it('should delete post successfully', () => {
      return request(app.getHttpServer())
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('게시글이 삭제되었습니다.');
        });
    });

    it('should return 404 when trying to delete already deleted post', () => {
      return request(app.getHttpServer())
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
