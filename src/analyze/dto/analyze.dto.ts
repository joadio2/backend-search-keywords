import {
  IsArray,
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsEmail,
  IsNumber,
} from 'class-validator';

export class AnalyzeDto {
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

  @IsString()
  @IsOptional()
  scheduleTime?: string;

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
