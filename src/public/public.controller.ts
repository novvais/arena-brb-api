import { Controller, Post, Body } from '@nestjs/common';
import { PublicService } from './public.service';
import { CreatePreferenceDto } from './dtos/createPreference.dto';
import { CreateSurveyDto } from './dtos/createSurvey.dto';

@Controller()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Post('preferences')
  async createPreference(@Body() createPreferenceDto: CreatePreferenceDto) {
    return this.publicService.createPreferenceSubmission(createPreferenceDto);
  }

  @Post('survey')
  async createSurvey(@Body() createSurveyDto: CreateSurveyDto) {
    return this.publicService.createSurveyResponse(createSurveyDto);
  }
}
