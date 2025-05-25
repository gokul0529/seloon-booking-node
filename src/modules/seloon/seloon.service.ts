import { Injectable } from '@nestjs/common';
import { CreateSeloonDto } from './dto/create-seloon.dto';
import { UpdateSeloonDto } from './dto/update-seloon.dto';

@Injectable()
export class SeloonService {
  create(createSeloonDto: CreateSeloonDto) {
    return 'This action adds a new seloon';
  }

  findAll() {
    return `This action returns all seloon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seloon`;
  }

  update(id: number, updateSeloonDto: UpdateSeloonDto) {
    return `This action updates a #${id} seloon`;
  }

  remove(id: number) {
    return `This action removes a #${id} seloon`;
  }
}
