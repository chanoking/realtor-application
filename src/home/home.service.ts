import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'src/user/decorators/user.decorators';
import { CreateHomeDto, HomeResponseDto } from './dto/home.dto';

interface GetHomesParams {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
}

interface CreateHomeParams {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: PropertyType;
  images: { url: string }[];
}

interface UpdateHomeParams {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  propertyType?: PropertyType;
}

@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}
  async getHomes(filters: GetHomesParams): Promise<HomeResponseDto[]> {
    const homes = await this.prisma.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyTYPE: true,
        number_of_bedrooms: true,
        number_of_bathrooms: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: {
        ...filters,
      },
    });

    if (!homes) {
      throw new NotFoundException('Not Found');
    }
    return homes.map((home) => {
      const fetchHome = { ...home, image: home.images[0].url };
      delete fetchHome.images;
      return new HomeResponseDto(fetchHome);
    });
  }

  async getHome(id: number) {
    const home = await this.prisma.home.findUnique({
      where: { id },
    });
  }

  async createHome(
    {
      address,
      numberOfBathrooms,
      numberOfBedrooms,
      city,
      land_size,
      price,
      propertyType,
      images,
    }: CreateHomeDto,
    userId: number,
  ) {
    const home = await this.prisma.home.create({
      data: {
        address,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        city,
        land_size,
        price,
        propertyTYPE: propertyType,
        realtor_id: 4,
      },
    });

    const homeImages = images.map((image) => {
      return { ...image, home_id: home.id };
    });

    await this.prisma.image.createMany({ data: homeImages });

    return new HomeResponseDto(home);
  }

  async updateHome(id: number, data: UpdateHomeParams) {
    const home = await this.prisma.home.findUnique({
      where: { id },
    });

    if (!home) {
      throw new NotFoundException('Not Found');
    }

    const updatedHome = await this.prisma.home.update({
      where: {
        id,
      },
      data,
    });

    return new HomeResponseDto(updatedHome);
  }
  async deletedHome(id: number) {
    await this.prisma.image.deleteMany({
      where: {
        home_id: id,
      },
    });
    await this.prisma.home.delete({
      where: {
        id,
      },
    });
  }

  async getRealtorByHomeId(id: number) {
    const home = await this.prisma.home.findUnique({
      where: {
        id,
      },
      select: {
        realtor: {
          select: {
            name: true,
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) {
      throw new NotFoundException('존재하지 않습니다.');
    }

    return home.realtor;
  }

  async inquire(buyer: UserType, homeId, message) {
    const realtor = await this.getRealtorByHomeId(homeId);

    return await this.prisma.message.create({
      data: {
        realtor_id: realtor.id,
        buyer_id: buyer.id,
        home_id: homeId,
        messsage: message,
      },
    });
  }
  getMessagesByHome(homeId: number) {
    return this.prisma.message.findMany({
      where: {
        home_id: homeId,
      },
      select: {
        messsage: true,
        buyer: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });
  }
}
