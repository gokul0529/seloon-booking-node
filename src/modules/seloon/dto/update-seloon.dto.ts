import { PartialType } from '@nestjs/swagger';
import { CreateSeloonDto } from './create-seloon.dto';

export class UpdateSeloonDto extends PartialType(CreateSeloonDto) {}
