import { Injectable } from '@nestjs/common';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { UpdateChangeRequestDto } from './dto/update-change-request.dto';
import { FindManyOptions, Repository } from 'typeorm';
import { ChangeRequest } from './entities/change-request.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChangeRequestService {
  constructor(
    @InjectRepository(ChangeRequest)
    private changeRequestService: Repository<ChangeRequest>
  ) {}

  async create(createChangeRequestDto: CreateChangeRequestDto): Promise<ChangeRequest> {
    return this.changeRequestService.save(createChangeRequestDto);
  }

  async findAll(): Promise<ChangeRequest[]> {
    return this.changeRequestService.find();
  }

  async findOne(options: FindManyOptions<ChangeRequest>): Promise<ChangeRequest | null> {
    return this.changeRequestService.findOne(options);
  }

  async update(id: string, updateChangeRequestDto: UpdateChangeRequestDto) {
    return this.changeRequestService.update(id, updateChangeRequestDto);
  }

  async remove(id: string): Promise<void> {
    await this.changeRequestService.delete(id);
  }
}
