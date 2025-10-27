import { PartialType } from '@nestjs/mapped-types';
import { CreateDashboardDTO } from './createDashboard.dto';

export class UpdateDashboardDTO extends PartialType(CreateDashboardDTO) {}
