import { Test, TestingModule } from '@nestjs/testing';
import { GetfilesService } from './getfiles.service';

describe('GetfilesService', () => {
  let service: GetfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetfilesService],
    }).compile();

    service = module.get<GetfilesService>(GetfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
