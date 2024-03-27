import { Test, TestingModule } from '@nestjs/testing';
import { EurekaServerController } from './eureka-server.controller';
import { EurekaServerService } from './eureka-server.service';

describe('EurekaServerController', () => {
  let eurekaServerController: EurekaServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EurekaServerController],
      providers: [EurekaServerService],
    }).compile();

    eurekaServerController = app.get<EurekaServerController>(EurekaServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(eurekaServerController.getHello()).toBe('Hello World!');
    });
  });
});
