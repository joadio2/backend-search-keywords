import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleTaskController } from './schedule-task.controller';
import { ScheduleTaskService } from './schedule-task.service';

describe('ScheduleTaskController', () => {
  let controller: ScheduleTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleTaskController],
      providers: [ScheduleTaskService],
    }).compile();

    controller = module.get<ScheduleTaskController>(ScheduleTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
