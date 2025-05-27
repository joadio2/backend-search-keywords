import { IsString, IsNotEmpty } from 'class-validator';

export class Title {
  @IsNotEmpty()
  @IsString()
  title: string;
}
