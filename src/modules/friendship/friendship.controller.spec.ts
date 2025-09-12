import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipController } from './friendship.controller';
import { FriendshipService } from './friendship.service';

describe('FriendshipController', () => {
  let controller: FriendshipController;
  let friendshipService: jest.Mocked<FriendshipService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendshipController],
      providers: [
        {
          provide: FriendshipService,
          useValue: {
            createFriendRequest: jest.fn(),
            acceptFriendRequest: jest.fn(),
            rejectFriendRequest: jest.fn(),
            getFriends: jest.fn(),
            searchUsers: jest.fn(),
            getSentFriendRequests: jest.fn(),
            getReceivedFriendRequests: jest.fn(),
            removeFriend: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FriendshipController>(FriendshipController);
    friendshipService = module.get(FriendshipService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
