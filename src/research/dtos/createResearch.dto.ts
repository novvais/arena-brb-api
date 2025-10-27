import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

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

export enum TransportType {
  PRIVATE_CAR = 'PRIVATE_CAR',
  APP_UBER_99 = 'APP_UBER_99',
  PUBLIC_TRANSPORT = 'PUBLIC_TRANSPORT',
  RIDE_TAXI = 'RIDE_TAXI',
  OTHER = 'OTHER',
}

export class CreateResearchDTO {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsOptional()
  @IsEnum(GenderIdentity)
  genderIdentity?: GenderIdentity;

  @IsOptional()
  @IsEnum(AgeRange)
  ageRange?: AgeRange;

  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;

  @IsOptional()
  @IsEnum(TransportType)
  transportType?: TransportType;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  recommendationScore?: number;
}
