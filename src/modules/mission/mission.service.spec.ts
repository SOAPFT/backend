import { Test, TestingModule } from '@nestjs/testing';
import { MissionService } from './mission.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Mission } from '@/entities/mission.entity';
import { MissionParticipation } from '@/entities/mission-participation.entity';
import { User } from '@/entities/user.entity';
import { Repository } from 'typeorm';

describe('MissionService', () => {
  let service: MissionService;
  let missionRepository: jest.Mocked<Repository<Mission>>;
  let participationRepository: jest.Mocked<Repository<MissionParticipation>>;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionService,
        {
          provide: getRepositoryToken(Mission),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(MissionParticipation),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MissionService>(MissionService);
    missionRepository = module.get(getRepositoryToken(Mission));
    participationRepository = module.get(
      getRepositoryToken(MissionParticipation),
    );
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
