import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('report')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Upload a CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './csvfile',
        filename: (req, file, cb) => {
          const newFileName = Date.now() + `${file.originalname}`;
          cb(null, newFileName);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const response = await this.appService.uploadFile(file.path);
    if (response) {
      res.send({
        status: HttpStatus.OK,
        response,
      });
    } else {
      res.send({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        response,
      });
    }
  }

  @ApiOperation({ summary: 'Generates report from database' })
  @Get('generate')
  async generateReport(
    @Query('month') month: string,
    @Query('year') year: number,
    @Res() res: Response,
  ) {
    const report = await this.appService.generateReport(month, year);
    if (report) {
      res.send({
        status: HttpStatus.OK,
        report,
      });
    } else {
      res.json({
        message: 'Report Generation Failed',
      });
    }
  }
}
