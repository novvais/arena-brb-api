import { PartialType } from '@nestjs/mapped-types';
import { CreateResearchDTO } from './createResearch.dto';

export class UpdateResearchDTO extends PartialType(CreateResearchDTO) {}
