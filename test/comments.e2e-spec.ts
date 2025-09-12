import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestAppModule } from './test-app.module';

describe('Comments E2E Tests', () => {
  let app: INestApplication;
  let authToken: string;
  let postId: string;
  let commentId: string;

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

    // Create a test post first
    const postResponse = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'Test post for comments',
        images: [],
      })
      .expect(201);

    postId = postResponse.body.postId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /comments', () => {
    it('should create a comment successfully', async () => {
      const commentData = {
        postId: postId,
        content: 'This is a test comment',
        parentCommentId: null,
      };

      const response = await request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)
        .expect(201);

      expect(response.body).toHaveProperty('commentId');
      expect(response.body.message).toBe('댓글이 생성되었습니다.');
      commentId = response.body.commentId;
    });

    it('should create a reply comment successfully', () => {
      const replyData = {
        postId: postId,
        content: 'This is a reply comment',
        parentCommentId: commentId,
      };

      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(replyData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('commentId');
          expect(res.body.message).toBe('댓글이 생성되었습니다.');
        });
    });

    it('should fail to create comment without content', () => {
      const commentData = {
        postId: postId,
        parentCommentId: null,
      };

      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)
        .expect(400);
    });

    it('should fail to create comment for non-existent post', () => {
      const commentData = {
        postId: 'non-existent-post-id',
        content: 'This comment should fail',
        parentCommentId: null,
      };

      return request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)
        .expect(404);
    });

    it('should fail without authentication', () => {
      const commentData = {
        postId: postId,
        content: 'Unauthorized comment',
        parentCommentId: null,
      };

      return request(app.getHttpServer())
        .post('/comments')
        .send(commentData)
        .expect(401);
    });
  });

  describe('GET /comments/:postId', () => {
    it('should get comments for post successfully', () => {
      return request(app.getHttpServer())
        .get(`/comments/${postId}?page=1&limit=10`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('comments');
          expect(res.body).toHaveProperty('totalCount');
          expect(Array.isArray(res.body.comments)).toBe(true);
        });
    });

    it('should handle pagination for comments', () => {
      return request(app.getHttpServer())
        .get(`/comments/${postId}?page=2&limit=5`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should return empty array for post with no comments', async () => {
      // Create a new post without comments
      const newPostResponse = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Post without comments',
          images: [],
        })
        .expect(201);

      const newPostId = newPostResponse.body.postId;

      return request(app.getHttpServer())
        .get(`/comments/${newPostId}?page=1&limit=10`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.comments).toEqual([]);
          expect(res.body.totalCount).toBe(0);
        });
    });
  });

  describe('PUT /comments/:commentId', () => {
    it('should update comment successfully', () => {
      const updateData = {
        content: 'Updated comment content',
      };

      return request(app.getHttpServer())
        .put(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('댓글이 수정되었습니다.');
        });
    });

    it('should fail to update non-existent comment', () => {
      const updateData = {
        content: 'Updated content',
      };

      return request(app.getHttpServer())
        .put('/comments/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);
    });

    it('should fail to update comment without content', () => {
      return request(app.getHttpServer())
        .put(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('DELETE /comments/:commentId', () => {
    it('should delete comment successfully', () => {
      return request(app.getHttpServer())
        .delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('댓글이 삭제되었습니다.');
        });
    });

    it('should return 404 when trying to delete already deleted comment', () => {
      return request(app.getHttpServer())
        .delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent comment', () => {
      return request(app.getHttpServer())
        .delete('/comments/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
