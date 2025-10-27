import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ResearchService } from './research.service';
import { CreateResearchDTO } from './dtos/createResearch.dto';
import { UpdateResearchDTO } from './dtos/updateResearch.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('research')
@UseGuards(JwtAuthGuard)
export class ResearchController {
  constructor(private researchService: ResearchService) {}

  @Post()
  async createResearch(@Body() createResearch: CreateResearchDTO) {
    return await this.researchService.createResearch(createResearch);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAllResearch() {
    return await this.researchService.findAllResearch();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('statistics')
  async getResearchStatistics() {
    return await this.researchService.getResearchStatistics();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  async findResearchById(@Param('id', ParseIntPipe) id: number) {
    return await this.researchService.findResearchById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateResearch(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResearch: UpdateResearchDTO,
  ) {
    return await this.researchService.updateResearch(id, updateResearch);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteResearch(@Param('id', ParseIntPipe) id: number) {
    return await this.researchService.deleteResearch(id);
  }
}
