import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { FindCharactersQueryDto } from './dto/find-characters-query.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  findAll(@Query() query: FindCharactersQueryDto) {
    return this.charactersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.findOne(id);
  }
}
