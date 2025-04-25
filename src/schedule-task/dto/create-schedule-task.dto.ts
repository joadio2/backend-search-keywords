import {
  IsArray,
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class TaskDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  urls: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  keywords: string[];

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  schedule?: boolean;

  @IsDateString()
  @IsOptional()
  scheduleAt?: string;

  @IsBoolean()
  @IsOptional()
  repeatMonthly?: boolean;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  reportType: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsNotEmpty()
  userId: string;
}
