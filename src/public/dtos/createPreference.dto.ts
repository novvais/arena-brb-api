import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class CreatePreferenceDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'Preferences array cannot be empty' })
  @IsString({ each: true, message: 'Each preference must be a string' })
  preferences: string[];
}
