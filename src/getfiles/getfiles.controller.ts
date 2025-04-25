import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { GetfilesService } from './getfiles.service';

@Controller('getfiles')
export class GetfilesController {
  constructor(private readonly getfilesService: GetfilesService) {}

  @Get(':id')
  async findAll(@Param('id') id: string, @Res() res: Response) {
    const getfile = await this.getfilesService.findByUserId(id);

    if (!getfile || getfile === 404) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'No se encontró ningún archivo',
      });
    }

    return res.status(HttpStatus.OK).json({
      message: 'Archivo encontrado',
      data: getfile,
    });
  }
}
