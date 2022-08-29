import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { HealthService } from './health.service';
import { IDiagnosisRequest } from './health.types';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @UseGuards(JwtGuard)
  @Get('/symptoms')
  @HttpCode(200)
  getSymptomsList() {
    try {
      return this.healthService.getSymptomsList();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @UseGuards(JwtGuard)
  @Get('/diagnosis')
  @HttpCode(200)
  getDiagnosisHistory(@Query('id') id: string) {
    try {
      return this.healthService.getDiagnosisHistory(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @UseGuards(JwtGuard)
  @Post('/diagnosis')
  @HttpCode(200)
  getDiagnosisListFromSymptoms(@Body() data: IDiagnosisRequest) {
    try {
      return this.healthService.getDiagnosisListFromSymptoms(data);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @UseGuards(JwtGuard)
  @Put('/diagnosis/:id')
  @HttpCode(200)
  setDiagnosisValidity(
    @Body() data: IDiagnosisRequest,
    @Param('id') id: string,
  ) {
    try {
      return this.healthService.setDiagnosisValidity({ data, id });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
