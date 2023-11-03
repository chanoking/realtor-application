import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { User } from '../decorators/user.decorators';
import { SigninDtop, SignupDto, generateProdcutKeyDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException('product key가 존재하지 않습니다.');
      }

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

      const isValidProducKey = await bcrypt.compare(
        validProductKey,
        body.productKey,
      );

      if (!isValidProducKey) {
        throw new UnauthorizedException('product key가 검증되지 않았습니다.');
      }
    }

    return this.authService.signup(body, userType);
  }

  @Post('/signin')
  async signin(@Body() body: SigninDtop) {
    return await this.authService.signin(body);
  }

  @Post('/key')
  async generateProdcutKey(@Body() body: generateProdcutKeyDto) {
    return await this.authService.generateProductKey(body.email, body.userType);
  }

  @Get('/me')
  me(@User() user: UserType) {
    return user;
  }
}
