import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeloonService } from './seloon.service';
import { CreateSeloonDto } from './dto/create-seloon.dto';
import { UpdateSeloonDto } from './dto/update-seloon.dto';

@Controller('seloon')
export class SeloonController {
  constructor(private readonly seloonService: SeloonService) {}

  @Post()
  create(@Body() createSeloonDto: CreateSeloonDto) {
    return this.seloonService.create(createSeloonDto);
  }

  @Get()
  findAll() {
    return this.seloonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seloonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeloonDto: UpdateSeloonDto) {
    return this.seloonService.update(+id, updateSeloonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seloonService.remove(+id);
  }
}
