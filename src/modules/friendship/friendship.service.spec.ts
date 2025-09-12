import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipService } from './friendship.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Friendship } from '@/entities/friendship.entity';
import { User } from '@/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Repository } from 'typeorm';

describe('FriendshipService', () => {
  let service: FriendshipService;
  let friendshipRepository: jest.Mocked<Repository<Friendship>>;
  let userRepository: jest.Mocked<Repository<User>>;
  let notificationsService: jest.Mocked<NotificationsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendshipService,
        {
          provide: getRepositoryToken(Friendship),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            }),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            createNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FriendshipService>(FriendshipService);
    friendshipRepository = module.get(getRepositoryToken(Friendship));
    userRepository = module.get(getRepositoryToken(User));
    notificationsService = module.get(NotificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
