import { Test, TestingModule } from '@nestjs/testing';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

describe('LikesController', () => {
  let controller: LikesController;
  let likesService: jest.Mocked<LikesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesController],
      providers: [
        {
          provide: LikesService,
          useValue: {
            createLike: jest.fn(),
            removeLike: jest.fn(),
            getUserLikedPosts: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LikesController>(LikesController);
    likesService = module.get(LikesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
