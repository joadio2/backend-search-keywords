import { PartialType } from '@nestjs/mapped-types';
import { CreateGetfileDto } from './create-getfile.dto';

export class UpdateGetfileDto extends PartialType(CreateGetfileDto) {}
