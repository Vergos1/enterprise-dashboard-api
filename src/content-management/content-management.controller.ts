import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Content Management')
@Controller('cm')
export class ContentManagementController {}
