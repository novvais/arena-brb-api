import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePreferenceDto } from './dtos/createPreference.dto';
import { CreateSurveyDto } from './dtos/createSurvey.dto';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async createPreferenceSubmission(createPreferenceDto: CreatePreferenceDto) {
    return this.prisma.preferenceSubmission.create({
      data: {
        preferences: createPreferenceDto.preferences,
      },
    });
  }

  async createSurveyResponse(createSurveyDto: CreateSurveyDto) {
    return this.prisma.research.create({
      data: {
        userId: createSurveyDto.userId,
        genderIdentity: createSurveyDto.genderIdentity,
        ageRange: createSurveyDto.ageRange,
        eventType: createSurveyDto.eventType,
        transportType: createSurveyDto.transportType,
        recommendationScore: createSurveyDto.recommendationScore,
        gateFindability: createSurveyDto.gateFindability,
        highlight: createSurveyDto.highlight,
        frustration: createSurveyDto.frustration,
        nextVibeScore: createSurveyDto.nextVibeScore,
        artistWish: createSurveyDto.artistWish,
      },
    });
  }
}
