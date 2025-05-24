import { Injectable } from '@nestjs/common';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { UpdateChangeRequestDto } from './dto/update-change-request.dto';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { ChangeRequest } from './entities/change-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestStatus } from './entities/enums/request-status.enum';
import { RequestType } from './entities/enums/request-type.enum';

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
    return this.changeRequestService.find({
      relations: ['project', 'user']
    });
  }

  async findOne(options: FindOneOptions<ChangeRequest>): Promise<ChangeRequest | null> {
    return this.changeRequestService.findOne({
      ...options, 
      relations: ['project', 'user']
    });
  }

  async findMany(options: FindManyOptions<ChangeRequest>): Promise<ChangeRequest | null> {
    return this.changeRequestService.findOne({
      ...options, 
      relations: ['project', 'user']
    });
  }


  async update(id: string, updateChangeRequestDto: UpdateChangeRequestDto) {
    return this.changeRequestService.update(id, updateChangeRequestDto);
  }

  async remove(id: string): Promise<void> {
    await this.changeRequestService.delete(id);
  }

  async findWithFilters(filters: {
    projectId?: string;
    userId?: string;
    status?: string;
    requestType?: string;
    deplyomentDate?: string;
  }) {
    const where: FindOptionsWhere<ChangeRequest> = {};

    if (filters.projectId) where.project = { id: filters.projectId };
    if (filters.userId) where.user = { id: filters.userId};
    if (filters.status) where.status = filters.status as RequestStatus;
    if (filters.requestType) where.request_type = filters.requestType as RequestType;
    if (filters.deplyomentDate) where.deployment_date = new Date(filters.deplyomentDate);

    return this.changeRequestService.find({
      where,
      relations: ['project', 'user']
    });
  }

  async findByProject(projectId: string) {
    return this.changeRequestService.find({
      where: {project: { id: projectId }},
      relations: ['project', 'user']
    })
  }

  async findByUser(userId: string) {
    return this.changeRequestService.find({
      where: {user: { id: userId }},
      relations: ['project', 'user']
    })
  }
}
