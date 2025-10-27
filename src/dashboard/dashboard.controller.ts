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
import { DashboardService } from './dashboard.service';
import { CreateDashboardDTO } from './dtos/createDashboard.dto';
import { UpdateDashboardDTO } from './dtos/updateDashboard.dto';
import { JwtAuthGuard } from 'src/auth/strategy/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Post()
  async createDashboard(@Body() createDashboard: CreateDashboardDTO) {
    return await this.dashboardService.createDashboard(createDashboard);
  }

  @Post('generate/:period')
  async generateDashboard(@Param('period') period: string) {
    return await this.dashboardService.generateDashboardForPeriod(period);
  }

  @Get()
  async findAllDashboards() {
    return await this.dashboardService.findAllDashboards();
  }

  @Get('period/:period')
  async findDashboardByPeriod(@Param('period') period: string) {
    return await this.dashboardService.findDashboardByPeriod(period);
  }

  @Get(':id')
  async findDashboardById(@Param('id', ParseIntPipe) id: number) {
    return await this.dashboardService.findDashboardById(id);
  }

  @Put(':id')
  async updateDashboard(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDashboard: UpdateDashboardDTO,
  ) {
    return await this.dashboardService.updateDashboard(id, updateDashboard);
  }

  @Delete(':id')
  async deleteDashboard(@Param('id', ParseIntPipe) id: number) {
    return await this.dashboardService.deleteDashboard(id);
  }
}
