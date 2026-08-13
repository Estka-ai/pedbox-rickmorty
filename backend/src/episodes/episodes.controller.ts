import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EpisodesService } from './episodes.service';
import { FindEpisodesQueryDto } from './dto/find-episodes-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('episodes')
@ApiBearerAuth()
@Controller('episodes')
@UseGuards(JwtAuthGuard)
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Get()
  findAll(@Query() query: FindEpisodesQueryDto) {
    return this.episodesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.episodesService.findOne(id);
  }
}
