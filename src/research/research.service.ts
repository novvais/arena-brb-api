import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResearchDTO } from './dtos/createResearch.dto';
import { UpdateResearchDTO } from './dtos/updateResearch.dto';
import { Research } from '@prisma/client';

@Injectable()
export class ResearchService {
  constructor(private prisma: PrismaService) {}

  async createResearch(
    createResearch: CreateResearchDTO,
  ): Promise<Research | null> {
    // Verificar se o usuário existe
    const userExists = await this.prisma.user.findFirst({
      where: { id: createResearch.userId, deletedAt: null },
    });

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado!', {
        cause: new Error(),
        description: 'Não foi possível encontrar o usuário especificado.',
      });
    }

    const newResearch = await this.prisma.research.create({
      data: {
        ...createResearch,
      },
    });

    return newResearch;
  }

  async findAllResearch(): Promise<Research[]> {
    const researchList = await this.prisma.research.findMany({
      where: { deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return researchList;
  }

  async findResearchById(id: number): Promise<Research | null> {
    const research = await this.prisma.research.findFirst({
      where: { id, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!research) {
      throw new NotFoundException('Pesquisa não encontrada!', {
        cause: new Error(),
        description: 'Não foi encontrada nenhuma pesquisa com esse ID.',
      });
    }

    return research;
  }

  async updateResearch(
    id: number,
    updateResearch: UpdateResearchDTO,
  ): Promise<Research | null> {
    await this.findResearchById(id);

    const updatedResearch = await this.prisma.research.update({
      where: { id },
      data: {
        ...updateResearch,
      },
    });

    return updatedResearch;
  }

  async deleteResearch(id: number): Promise<{ message: string }> {
    await this.findResearchById(id);

    await this.prisma.research.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return { message: 'Pesquisa deletada com sucesso!' };
  }

  async getResearchStatistics() {
    const totalResearch = await this.prisma.research.count({
      where: { deletedAt: null },
    });

    const averageRecommendation = await this.prisma.research.aggregate({
      where: { deletedAt: null },
      _avg: {
        recommendationScore: true,
      },
    });

    const genderIdentityDistribution = await this.prisma.research.groupBy({
      by: ['genderIdentity'],
      _count: true,
      where: { deletedAt: null },
    });

    const ageRangeDistribution = await this.prisma.research.groupBy({
      by: ['ageRange'],
      _count: true,
      where: { deletedAt: null },
    });

    const eventTypeDistribution = await this.prisma.research.groupBy({
      by: ['eventType'],
      _count: true,
      where: { deletedAt: null },
    });

    const transportTypeDistribution = await this.prisma.research.groupBy({
      by: ['transportType'],
      _count: true,
      where: { deletedAt: null },
    });

    return {
      totalResponses: totalResearch,
      averageRecommendationScore:
        averageRecommendation._avg.recommendationScore || 0,
      genderIdentityDistribution,
      ageRangeDistribution,
      eventTypeDistribution,
      transportTypeDistribution,
    };
  }
}
