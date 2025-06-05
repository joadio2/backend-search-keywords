import { PartialType } from '@nestjs/mapped-types';
import { CreateHealtDto } from './create-healt.dto';

export class UpdateHealtDto extends PartialType(CreateHealtDto) {}
