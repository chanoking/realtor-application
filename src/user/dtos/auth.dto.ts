import { UserType } from '@prisma/client';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^01([0])-?([0-9]{4})-?([0-9]{4})$/, {
    message: '정확한 휴대번호를 입력해주세요',
  })
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호를 영어와 숫자로만 만들어주세요 ',
  })
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey?: string;
}

export class SigninDtop {
  @IsEmail()
  @IsNotEmpty({ message: '필수 입력 사항입니다.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '필수 입력사합입니다.' })
  @MinLength(4, { message: '4자 이상 입력해주세요' })
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: '비밀번호를 영어와 숫자로만 입력해주세요.',
  })
  password: string;
}

export class generateProdcutKeyDto {
  @IsEmail()
  @IsNotEmpty({ message: '필수 입력 사항입니다.' })
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
