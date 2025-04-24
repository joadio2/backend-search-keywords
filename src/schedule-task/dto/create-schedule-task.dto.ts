import {
  IsArray,
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsISO8601,
} from 'class-validator';

export class CreateScheduleTaskDto {
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
  @IsNotEmpty()
  schedule: boolean;

  @IsISO8601()
  @IsNotEmpty()
  scheduleAt: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  reportType: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
