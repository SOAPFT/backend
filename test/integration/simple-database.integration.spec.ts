import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Simple test entity without enums or complex relationships
@Entity('test_user')
class TestUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  uuid: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('test_post')
class TestPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  uuid: string;

  @Column({ type: 'varchar', length: 50 })
  authorUuid: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 20, default: 'published' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

describe('Simple Database Integration Tests', () => {
  let module: TestingModule;
  let userRepository: Repository<TestUser>;
  let postRepository: Repository<TestPost>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [TestUser, TestPost],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([TestUser, TestPost]),
      ],
    }).compile();

    userRepository = module.get<Repository<TestUser>>(
      getRepositoryToken(TestUser),
    );
    postRepository = module.get<Repository<TestPost>>(
      getRepositoryToken(TestPost),
    );
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await postRepository.clear();
    await userRepository.clear();
  });

  describe('Basic CRUD Operations', () => {
    it('should create and retrieve a user', async () => {
      const userData = {
        uuid: 'test-uuid-1',
        name: 'Test User',
        email: 'test@example.com',
        isActive: true,
      };

      const user = userRepository.create(userData);
      await userRepository.save(user);

      const foundUser = await userRepository.findOne({
        where: { uuid: 'test-uuid-1' },
      });

      expect(foundUser).toBeDefined();
      expect(foundUser.name).toBe('Test User');
      expect(foundUser.email).toBe('test@example.com');
      expect(foundUser.isActive).toBe(true);
      expect(foundUser.createdAt).toBeInstanceOf(Date);
    });

    it('should update user information', async () => {
      const user = userRepository.create({
        uuid: 'test-uuid-2',
        name: 'Original Name',
        email: 'original@example.com',
      });

      await userRepository.save(user);

      // Update user
      await userRepository.update(
        { uuid: 'test-uuid-2' },
        {
          name: 'Updated Name',
          email: 'updated@example.com',
        },
      );

      const updatedUser = await userRepository.findOne({
        where: { uuid: 'test-uuid-2' },
      });

      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.email).toBe('updated@example.com');
      expect(updatedUser.updatedAt).toBeInstanceOf(Date);
    });

    it('should delete user', async () => {
      const user = userRepository.create({
        uuid: 'test-uuid-3',
        name: 'To Delete',
        email: 'delete@example.com',
      });

      await userRepository.save(user);

      // Verify user exists
      let foundUser = await userRepository.findOne({
        where: { uuid: 'test-uuid-3' },
      });
      expect(foundUser).toBeDefined();

      // Delete user
      await userRepository.delete({ uuid: 'test-uuid-3' });

      // Verify user is deleted
      foundUser = await userRepository.findOne({
        where: { uuid: 'test-uuid-3' },
      });
      expect(foundUser).toBeNull();
    });
  });

  describe('Relationship Operations', () => {
    it('should handle posts linked to users', async () => {
      // Create user
      const user = userRepository.create({
        uuid: 'author-uuid-1',
        name: 'Author User',
        email: 'author@example.com',
      });
      await userRepository.save(user);

      // Create post
      const post = postRepository.create({
        uuid: 'post-uuid-1',
        authorUuid: user.uuid,
        content: 'This is a test post content',
        status: 'published',
      });
      await postRepository.save(post);

      // Verify post exists and links to user
      const foundPost = await postRepository.findOne({
        where: { uuid: 'post-uuid-1' },
      });

      expect(foundPost).toBeDefined();
      expect(foundPost.authorUuid).toBe('author-uuid-1');
      expect(foundPost.content).toBe('This is a test post content');
      expect(foundPost.status).toBe('published');

      // Verify we can query posts by author
      const userPosts = await postRepository.find({
        where: { authorUuid: 'author-uuid-1' },
      });

      expect(userPosts).toHaveLength(1);
      expect(userPosts[0].uuid).toBe('post-uuid-1');
    });
  });

  describe('Query Operations', () => {
    beforeEach(async () => {
      // Create test data
      const users = [
        {
          uuid: 'user-1',
          name: 'Alice',
          email: 'alice@example.com',
          isActive: true,
        },
        {
          uuid: 'user-2',
          name: 'Bob',
          email: 'bob@example.com',
          isActive: true,
        },
        {
          uuid: 'user-3',
          name: 'Charlie',
          email: 'charlie@example.com',
          isActive: false,
        },
      ];

      for (const userData of users) {
        const user = userRepository.create(userData);
        await userRepository.save(user);
      }

      const posts = [
        {
          uuid: 'post-1',
          authorUuid: 'user-1',
          content: 'Alice post 1',
          status: 'published',
        },
        {
          uuid: 'post-2',
          authorUuid: 'user-1',
          content: 'Alice post 2',
          status: 'draft',
        },
        {
          uuid: 'post-3',
          authorUuid: 'user-2',
          content: 'Bob post 1',
          status: 'published',
        },
      ];

      for (const postData of posts) {
        const post = postRepository.create(postData);
        await postRepository.save(post);
      }
    });

    it('should count records', async () => {
      const userCount = await userRepository.count();
      const postCount = await postRepository.count();
      const activeUserCount = await userRepository.count({
        where: { isActive: true },
      });

      expect(userCount).toBe(3);
      expect(postCount).toBe(3);
      expect(activeUserCount).toBe(2);
    });

    it('should handle pagination', async () => {
      const [users, total] = await userRepository.findAndCount({
        order: { name: 'ASC' },
        take: 2,
        skip: 0,
      });

      expect(users).toHaveLength(2);
      expect(total).toBe(3);
      expect(users[0].name).toBe('Alice');
      expect(users[1].name).toBe('Bob');
    });

    it('should filter by criteria', async () => {
      const publishedPosts = await postRepository.find({
        where: { status: 'published' },
      });

      const alicePosts = await postRepository.find({
        where: { authorUuid: 'user-1' },
      });

      expect(publishedPosts).toHaveLength(2);
      expect(alicePosts).toHaveLength(2);
    });
  });

  describe('Transaction Operations', () => {
    it('should handle database transactions', async () => {
      await postRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const user = transactionalEntityManager.create(TestUser, {
            uuid: 'tx-user-1',
            name: 'Transaction User',
            email: 'tx@example.com',
          });
          await transactionalEntityManager.save(user);

          const post = transactionalEntityManager.create(TestPost, {
            uuid: 'tx-post-1',
            authorUuid: user.uuid,
            content: 'Transaction post content',
            status: 'published',
          });
          await transactionalEntityManager.save(post);
        },
      );

      // Verify both entities were created
      const user = await userRepository.findOne({
        where: { uuid: 'tx-user-1' },
      });
      const post = await postRepository.findOne({
        where: { uuid: 'tx-post-1' },
      });

      expect(user).toBeDefined();
      expect(post).toBeDefined();
      expect(post.authorUuid).toBe(user.uuid);
    });
  });
});
