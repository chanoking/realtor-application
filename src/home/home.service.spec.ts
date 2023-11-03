import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeService, homeSelect } from './home.service';

const mockGetHomes = [
  {
    id: 1,
    address: 'mokpo',
    city: 'seoul',
    price: 10000,
    propertyType: PropertyType.RESIDENTIAL,
    image: 'img1',
    numberOfBedrooms: 3,
    numberOfBathrooms: 2.5,
    images: [
      {
        url: 'src1',
      },
    ],
  },
];

describe('HomeService', () => {
  let service: HomeService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue([mockGetHomes]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHomes', () => {
    const filters = {
      city: 'Toronto',
      price: {
        gte: 1000000,
        lte: 1400000,
      },
      PropertyType: PropertyType.RESIDENTIAL,
    };
    it('should call prisma find many with correct params', () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);

      jest
        .spyOn(prisma.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await service.getHome(filters);

      expect(mockPrismaFindManyHomes).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: filters,
      });
    });

    it('should throw not found exception if not homes are found', async () => {
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue([]);

      jest
        .spyOn(prisma.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);
    });

    describe('createMany', () => {
      it("should call prisma home.create with the correct " async() => {
        const mockCreatehome = jest.fn().mockReturnValue(mockHome)

        jest.spyOn(prisma.home, "create").mockImplementation(mockCreatehome)

        await service.createHome(mockCreatehome)
      })
    })
  });
});
