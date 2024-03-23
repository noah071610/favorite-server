import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let databaseServiceMock;

  beforeEach(async () => {
    databaseServiceMock = {
      homepageData: {
        findMany: jest.fn(),
        createMany: jest.fn(),
      },
      post: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: DatabaseService, useValue: databaseServiceMock },
        { provide: CACHE_MANAGER, useValue: {} },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
