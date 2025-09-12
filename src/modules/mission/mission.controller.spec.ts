import { Test, TestingModule } from '@nestjs/testing';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';

describe('MissionController', () => {
  let controller: MissionController;
  let missionService: jest.Mocked<MissionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionController],
      providers: [
        {
          provide: MissionService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            joinMission: jest.fn(),
            leaveMission: jest.fn(),
            getMissionParticipants: jest.fn(),
            getUserMissions: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MissionController>(MissionController);
    missionService = module.get(MissionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
