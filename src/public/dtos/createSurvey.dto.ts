import { IsEnum, IsInt, IsString, IsOptional, Min, Max } from 'class-validator';

// Import enums from Prisma Client (these will be generated)
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

export enum Findability {
  EXTREMELY_EASY = 'EXTREMELY_EASY',
  EASY = 'EASY',
  REASONABLE = 'REASONABLE',
  DIFFICULT = 'DIFFICULT',
  VERY_DIFFICULT = 'VERY_DIFFICULT',
}

export enum Highlight {
  EVENT_QUALITY = 'EVENT_QUALITY',
  STAFF_SERVICE = 'STAFF_SERVICE',
  BATHROOM_CLEANLINESS = 'BATHROOM_CLEANLINESS',
  FOOD_AREAS = 'FOOD_AREAS',
  OVERALL_STRUCTURE = 'OVERALL_STRUCTURE',
  ACCESSIBILITY = 'ACCESSIBILITY',
}

export enum Frustration {
  PARKING_ARRIVAL = 'PARKING_ARRIVAL',
  ENTRY_QUEUES = 'ENTRY_QUEUES',
  FOOD_PRICES = 'FOOD_PRICES',
  BATHROOM_WAIT = 'BATHROOM_WAIT',
  NOTHING_FRUSTRATED = 'NOTHING_FRUSTRATED',
}

export class CreateSurveyDto {
  @IsInt()
  userId: number;

  // Q1: Como você se declara?
  @IsOptional()
  @IsEnum(GenderIdentity, { message: 'Invalid gender identity' })
  genderIdentity?: GenderIdentity;

  // Q2: Qual é a sua faixa etária?
  @IsOptional()
  @IsEnum(AgeRange, { message: 'Invalid age range' })
  ageRange?: AgeRange;

  // Q3: Qual tipo de evento você participou?
  @IsOptional()
  @IsEnum(EventType, { message: 'Invalid event type' })
  eventType?: EventType;

  // Q4: Qual foi o principal meio de transporte?
  @IsOptional()
  @IsEnum(TransportType, { message: 'Invalid transport type' })
  transportType?: TransportType;

  // Q5: NPS (0-10)
  @IsOptional()
  @IsInt({ message: 'Recommendation score must be an integer' })
  @Min(0, { message: 'Recommendation score must be at least 0' })
  @Max(10, { message: 'Recommendation score must be at most 10' })
  recommendationScore?: number;

  // Q6: Facilidade para encontrar o portão?
  @IsOptional()
  @IsEnum(Findability, { message: 'Invalid gate findability' })
  gateFindability?: Findability;

  // Q7: Área de destaque?
  @IsOptional()
  @IsEnum(Highlight, { message: 'Invalid highlight' })
  highlight?: Highlight;

  // Q8: Ponto de frustração?
  @IsOptional()
  @IsEnum(Frustration, { message: 'Invalid frustration' })
  frustration?: Frustration;

  // Q9: 'Vibe' para o próximo evento (0-10)
  @IsOptional()
  @IsInt({ message: 'Next vibe score must be an integer' })
  @Min(0, { message: 'Next vibe score must be at least 0' })
  @Max(10, { message: 'Next vibe score must be at most 10' })
  nextVibeScore?: number;

  // Q10: Qual próximo artista?
  @IsOptional()
  @IsString({ message: 'Artist wish must be a string' })
  artistWish?: string;
}
