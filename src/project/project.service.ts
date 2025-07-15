import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { FindOneOptions, Repository } from 'typeorm';

/**
 * Service for managing project operations in the change request tracking system
 * Projects serve as containers for organizing change requests by application/system
 */
@Injectable()
export class ProjectService {
  constructor (
    @InjectRepository(Project)
    private projectRepository: Repository<Project>
  ) {}

  /**
   * Creates a new project in the system
   * Used by admins to set up new projects for change request tracking system
   * @param createProjectDto - Data for creating the project
   * @returns Promise<Project> - The created project entity
   */
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectRepository.save(createProjectDto);
  }

  /**
   * Retrieves all projects from the database
   * Used for project selection dropdowns and admin project management
   * @returns Promise<Project[]> - Array of all projects
   */
  async findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  /**
   * Finds a single project by specified criteria
   * Used for retrieving project details and associated change requests
   * @param options - TypeORM find options with conditions
   * @returns Promise<Project | null> - Found project or null if not found
   */
  async findOne(options: FindOneOptions<Project>): Promise<Project | null> {
    return this.projectRepository.findOne(options);
  }

  /**
   * Updates an existing project and returns the updated entity
   * Restricted to admins for modifying project details
   * @param id - Project ID to update
   * @param updateProjectDto - Updated project data
   * @returns Promise<Project | null> - Updated project entity
   */
  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.projectRepository.update(id, updateProjectDto);
    return this.projectRepository.findOne({where: {id}})
  }

  /**
   * Removes a project from the database
   * @param id - Project ID to delete
   * @returns Promise<void>
   */
  async remove(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }
}
