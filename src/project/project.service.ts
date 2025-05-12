import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor (
    @InjectRepository(Project)
    private projectService: Repository<Project>
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectService.save(createProjectDto);
  }

  async findAll(): Promise<Project[]> {
    return this.projectService.find();
  }

  async findOne(options: FindOneOptions<Project>): Promise<Project | null> {
    return this.projectService.findOne(options);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.projectService.update(id, updateProjectDto);
    return this.projectService.findOne({where: {id}})
  }

  async remove(id: string): Promise<void> {
    await this.projectService.delete(id);
  }
}
