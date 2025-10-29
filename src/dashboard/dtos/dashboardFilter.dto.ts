import { IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum GenderIdentity {
  CISGENDER_WOMAN = 'CISGENDER_WOMAN',
  TRANSGENDER_WOMAN = 'TRANSGENDER_WOMAN',
  CISGENDER_MAN = 'CISGENDER_MAN',
  TRANSGENDER_MAN = 'TRANSGENDER_MAN',
  PREFER_NOT_TO_INFORM = 'PREFER_NOT_TO_INFORM',
}

export enum AgeRange {
  UNDER_18 = 'UNDER_18',
  AGE_18_25 = 'AGE_18_25',
  AGE_26_35 = 'AGE_26_35',
  AGE_36_45 = 'AGE_36_45',
  OVER_45 = 'OVER_45',
}

export enum EventType {
  SHOWS_FESTIVALS = 'SHOWS_FESTIVALS',
  EXECUTIVE_EVENT = 'EXECUTIVE_EVENT',
  SOCCER_GAME = 'SOCCER_GAME',
  CHILDREN_EVENT = 'CHILDREN_EVENT',
  GUIDED_TOUR = 'GUIDED_TOUR',
}

export class DashboardFilterDto {
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date string' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date string' })
  endDate?: string;

  @IsOptional()
  @IsEnum(GenderIdentity, { message: 'Invalid gender identity' })
  genderIdentity?: GenderIdentity;

  @IsOptional()
  @IsEnum(AgeRange, { message: 'Invalid age range' })
  ageRange?: AgeRange;

  @IsOptional()
  @IsEnum(EventType, { message: 'Invalid event type' })
  eventType?: EventType;
}
