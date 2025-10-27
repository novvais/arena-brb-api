import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
} from 'class-validator';

export class CreateDashboardDTO {
  @IsNotEmpty()
  @IsString()
  period: string;

  @IsOptional()
  @IsInt()
  totalResponses?: number;

  @IsOptional()
  @IsNumber()
  averageRecommendationScore?: number;

  @IsOptional()
  genderIdentityDistribution?: object;

  @IsOptional()
  ageRangeDistribution?: object;

  @IsOptional()
  eventTypeDistribution?: object;

  @IsOptional()
  transportTypeDistribution?: object;
}
