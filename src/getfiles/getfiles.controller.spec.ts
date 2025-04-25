import { Test, TestingModule } from '@nestjs/testing';
import { GetfilesController } from './getfiles.controller';
import { GetfilesService } from './getfiles.service';

describe('GetfilesController', () => {
  let controller: GetfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetfilesController],
      providers: [GetfilesService],
    }).compile();

    controller = module.get<GetfilesController>(GetfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
