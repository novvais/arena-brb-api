import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDashboardDTO } from './dtos/createDashboard.dto';
import { UpdateDashboardDTO } from './dtos/updateDashboard.dto';
import { DashboardFilterDto } from './dtos/dashboardFilter.dto';
import { Dashboard } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async createDashboard(
    createDashboard: CreateDashboardDTO,
  ): Promise<Dashboard | null> {
    // Verificar se já existe um dashboard para esse período
    const existingDashboard = await this.prisma.dashboard.findUnique({
      where: { period: createDashboard.period },
    });

    if (existingDashboard) {
      throw new ConflictException('Dashboard para este período já existe!', {
        cause: new Error(),
        description: 'Já existe um dashboard cadastrado para este período.',
      });
    }

    const newDashboard = await this.prisma.dashboard.create({
      data: {
        ...createDashboard,
      },
    });

    return newDashboard;
  }

  async findAllDashboards(): Promise<Dashboard[]> {
    const dashboards = await this.prisma.dashboard.findMany({
      where: { deletedAt: null },
      orderBy: { period: 'desc' },
    });

    return dashboards;
  }

  async findDashboardById(id: number): Promise<Dashboard | null> {
    const dashboard = await this.prisma.dashboard.findFirst({
      where: { id, deletedAt: null },
    });

    if (!dashboard) {
      throw new NotFoundException('Dashboard não encontrado!', {
        cause: new Error(),
        description: 'Não foi encontrado nenhum dashboard com esse ID.',
      });
    }

    return dashboard;
  }

  async findDashboardByPeriod(period: string): Promise<Dashboard | null> {
    const dashboard = await this.prisma.dashboard.findUnique({
      where: { period },
    });

    if (!dashboard) {
      throw new NotFoundException('Dashboard não encontrado!', {
        cause: new Error(),
        description: 'Não foi encontrado nenhum dashboard para este período.',
      });
    }

    return dashboard;
  }

  async updateDashboard(
    id: number,
    updateDashboard: UpdateDashboardDTO,
  ): Promise<Dashboard | null> {
    await this.findDashboardById(id);

    const updatedDashboard = await this.prisma.dashboard.update({
      where: { id },
      data: {
        ...updateDashboard,
      },
    });

    return updatedDashboard;
  }

  async deleteDashboard(id: number): Promise<{ message: string }> {
    await this.findDashboardById(id);

    await this.prisma.dashboard.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return { message: 'Dashboard deletado com sucesso!' };
  }

  async generateDashboardForPeriod(period: string): Promise<Dashboard> {
    // Verificar se já existe
    const existing = await this.prisma.dashboard.findUnique({
      where: { period },
    });

    // Buscar dados do research
    const totalResearch = await this.prisma.research.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte: new Date(period + '-01'),
          lt: new Date(period + '-32'),
        },
      },
    });

    const averageRecommendation = await this.prisma.research.aggregate({
      where: {
        deletedAt: null,
        createdAt: {
          gte: new Date(period + '-01'),
          lt: new Date(period + '-32'),
        },
      },
      _avg: {
        recommendationScore: true,
      },
    });

    const genderIdentityDistribution = await this.prisma.research.groupBy({
      by: ['genderIdentity'],
      _count: true,
      where: {
        deletedAt: null,
        createdAt: {
          gte: new Date(period + '-01'),
          lt: new Date(period + '-32'),
        },
      },
    });

    const ageRangeDistribution = await this.prisma.research.groupBy({
      by: ['ageRange'],
      _count: true,
      where: {
        deletedAt: null,
        createdAt: {
          gte: new Date(period + '-01'),
          lt: new Date(period + '-32'),
        },
      },
    });

    const eventTypeDistribution = await this.prisma.research.groupBy({
      by: ['eventType'],
      _count: true,
      where: {
        deletedAt: null,
        createdAt: {
          gte: new Date(period + '-01'),
          lt: new Date(period + '-32'),
        },
      },
    });

    const transportTypeDistribution = await this.prisma.research.groupBy({
      by: ['transportType'],
      _count: true,
      where: {
        deletedAt: null,
        createdAt: {
          gte: new Date(period + '-01'),
          lt: new Date(period + '-32'),
        },
      },
    });

    const dashboardData = {
      period,
      totalResponses: totalResearch,
      averageRecommendationScore:
        averageRecommendation._avg.recommendationScore || 0,
      genderIdentityDistribution: JSON.parse(
        JSON.stringify(genderIdentityDistribution),
      ),
      ageRangeDistribution: JSON.parse(JSON.stringify(ageRangeDistribution)),
      eventTypeDistribution: JSON.parse(JSON.stringify(eventTypeDistribution)),
      transportTypeDistribution: JSON.parse(
        JSON.stringify(transportTypeDistribution),
      ),
    };

    if (existing) {
      return await this.prisma.dashboard.update({
        where: { period },
        data: dashboardData,
      });
    } else {
      return await this.prisma.dashboard.create({
        data: dashboardData,
      });
    }
  }

  async getSurveyAnalytics(filters: DashboardFilterDto) {
    // Build where clause based on filters
    const where: any = {
      deletedAt: null,
    };

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate);
      }
    }

    if (filters.genderIdentity) {
      where.genderIdentity = filters.genderIdentity;
    }

    if (filters.ageRange) {
      where.ageRange = filters.ageRange;
    }

    if (filters.eventType) {
      where.eventType = filters.eventType;
    }

    // Get total responses
    const totalResponses = await this.prisma.research.count({ where });

    // Get NPS average
    const npsAverage = await this.prisma.research.aggregate({
      where,
      _avg: {
        recommendationScore: true,
      },
    });

    // Get next vibe score average
    const nextVibeAverage = await this.prisma.research.aggregate({
      where,
      _avg: {
        nextVibeScore: true,
      },
    });

    // Group by gender identity
    const genderBreakdown = await this.prisma.research.groupBy({
      by: ['genderIdentity'],
      _count: { genderIdentity: true },
      where,
    });

    // Group by age range
    const ageRangeBreakdown = await this.prisma.research.groupBy({
      by: ['ageRange'],
      _count: { ageRange: true },
      where,
    });

    // Group by event type
    const eventTypeBreakdown = await this.prisma.research.groupBy({
      by: ['eventType'],
      _count: { eventType: true },
      where,
    });

    // Group by transport type
    const transportTypeBreakdown = await this.prisma.research.groupBy({
      by: ['transportType'],
      _count: { transportType: true },
      where,
    });

    // Group by gate findability
    const gateFindabilityBreakdown = await this.prisma.research.groupBy({
      by: ['gateFindability'],
      _count: { gateFindability: true },
      where,
    });

    // Group by highlight
    const highlightBreakdown = await this.prisma.research.groupBy({
      by: ['highlight'],
      _count: { highlight: true },
      where,
    });

    // Group by frustration
    const frustrationBreakdown = await this.prisma.research.groupBy({
      by: ['frustration'],
      _count: { frustration: true },
      where,
    });

    // Transform groupBy results to object format
    const transformToObject = (array: any[], key: string) => {
      return array.reduce((acc, item) => {
        if (item[key] !== null) {
          acc[item[key]] = item._count[key] || item._count;
        }
        return acc;
      }, {});
    };

    return {
      totalResponses,
      npsAverage: npsAverage._avg.recommendationScore || 0,
      nextVibeAverage: nextVibeAverage._avg.nextVibeScore || 0,
      genderBreakdown: transformToObject(genderBreakdown, 'genderIdentity'),
      ageRangeBreakdown: transformToObject(ageRangeBreakdown, 'ageRange'),
      eventTypeBreakdown: transformToObject(eventTypeBreakdown, 'eventType'),
      transportTypeBreakdown: transformToObject(
        transportTypeBreakdown,
        'transportType',
      ),
      gateFindabilityBreakdown: transformToObject(
        gateFindabilityBreakdown,
        'gateFindability',
      ),
      highlightBreakdown: transformToObject(highlightBreakdown, 'highlight'),
      frustrationBreakdown: transformToObject(
        frustrationBreakdown,
        'frustration',
      ),
    };
  }

  async getPreferenceAnalytics(startDate?: string, endDate?: string) {
    // Build where clause based on date filters
    const where: any = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Get total submissions
    const totalSubmissions = await this.prisma.preferenceSubmission.count({
      where,
    });

    // Get all preference submissions
    const allPreferences = await this.prisma.preferenceSubmission.findMany({
      where,
      select: {
        preferences: true,
      },
    });

    // Count each preference
    const preferenceBreakdown: Record<string, number> = {};
    allPreferences.forEach((submission) => {
      submission.preferences.forEach((preference) => {
        if (preferenceBreakdown[preference]) {
          preferenceBreakdown[preference]++;
        } else {
          preferenceBreakdown[preference] = 1;
        }
      });
    });

    return {
      totalSubmissions,
      preferenceBreakdown,
    };
  }
}
