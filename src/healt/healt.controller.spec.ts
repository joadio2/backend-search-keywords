import { Test, TestingModule } from '@nestjs/testing';
import { HealtController } from './healt.controller';
import { HealtService } from './healt.service';

describe('HealtController', () => {
  let controller: HealtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealtController],
      providers: [HealtService],
    }).compile();

    controller = module.get<HealtController>(HealtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
