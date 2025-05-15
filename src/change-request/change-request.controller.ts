import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChangeRequestService } from './change-request.service';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { UpdateChangeRequestDto } from './dto/update-change-request.dto';
import { title } from 'process';

@Controller('change-request')
export class ChangeRequestController {
  constructor(private readonly changeRequestService: ChangeRequestService) {}

  @Post('create')
  create(@Body() createChangeRequestDto: CreateChangeRequestDto) {
    return this.changeRequestService.create(createChangeRequestDto);
  }

  @Get('all-users')
  async findAll() {
    const changeRequests = await this.changeRequestService.findAll();
    return {
      requests:
      changeRequests.map((changeRequest) => ({
        id: changeRequest.id,
        description: changeRequest.description,
        request_type: changeRequest.request_type,
        status: changeRequest.status,
        deployment_date: changeRequest.deployment_date
      }))
    };
  }

  // @Get('')
  // findByDate(@Body() date: Date) {
  //   const changeRequest = this.changeRequestService.findOne({where: {date}})
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.changeRequestService.findOne({where: {id}});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChangeRequestDto: UpdateChangeRequestDto) {
    return this.changeRequestService.update(id, updateChangeRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const changeRequest = this.changeRequestService.remove(id);
    return {
      message: "request deleted",
      changeRequest
    }
  }
}
