import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

describe('HomeController', () => {
  let controller: HomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getHomes: jest.fn().mockReturnValue([]),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHomes', async () => {
    it('should contruct filter object correctly', async () => await controller.getHome('Toronto') )
  })
});
