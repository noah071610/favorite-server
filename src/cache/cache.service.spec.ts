import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';
import { CachedService } from './cached.service';

describe('CachedService', () => {
  let service: CachedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CachedService,
        DatabaseService,
        { provide: CACHE_MANAGER, useValue: {} },
      ],
    }).compile();

    service = module.get<CachedService>(CachedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
