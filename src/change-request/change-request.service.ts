import { Injectable } from '@nestjs/common';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { UpdateChangeRequestDto } from './dto/update-change-request.dto';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { ChangeRequest } from './entities/change-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestStatus } from './entities/enums/request-status.enum';
import { RequestType } from './entities/enums/request-type.enum';

/**
 * Service for managing change request operations in the change request tracking system
 * Handles database interactions for all change requests-related operations
 */
@Injectable()
export class ChangeRequestService {
  constructor(
    @InjectRepository(ChangeRequest)
    private changeRequestService: Repository<ChangeRequest>
  ) {}

  /**
   * Creates a new change request in the database
   * @param createChangeRequestDto - Data for creating the change request
   * @returns Promise<ChangeRequest> - The created change request entity
   */
  async create(createChangeRequestDto: CreateChangeRequestDto): Promise<ChangeRequest> {
    return this.changeRequestService.save(createChangeRequestDto);
  }

  /**
   * Retrieves all change requests with related project and user data
   * Used by all to view all change requests across projects
   * @returns Promise<ChangeRequest[]> - Array of all change requests
   */
  async findAll(): Promise<ChangeRequest[]> {
    return this.changeRequestService.find({
      relations: ['project', 'user']
    });
  }

  /**
   * Finds a single change request by specified criteria
   * @param options - TypeORM find options with conditions
   * @returns Promise<ChangeRequest | null> - Found change request or null
   */
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

  /**
   * Updates an existing change request
   * Used by developers to modify pending change requests or by approvers to change status
   * @param id - Change request ID
   * @param updateChangeRequestDto - Updated data
   * @returns Promise with update result
   */
  async update(id: string, updateChangeRequestDto: UpdateChangeRequestDto) {
    return this.changeRequestService.update(id, updateChangeRequestDto);
  }

  /**
   * Removes a change request from the database
   * Restricted to admins
   * @param id - Change request ID to delete
   * @returns Promise<void>
   */
  async remove(id: string): Promise<void> {
    await this.changeRequestService.delete(id);
  }

  /**
   * Retrieves change requests based on dynamic filter criteria
   * Supports filtering by project, user, status, request type, and deployment date
   * Used for dashboard filtering and reporting functionality
   * @param filters - Object containing filter criteria
   * @returns Promise<ChangeRequest[]> - Filtered change requests
   */
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

  /**
   * Retrieves all change requests for a specific project
   * Used by admins to view project-specific change requests
   * @param projectId - Project identifier
   * @returns Promise<ChangeRequest[]> - Change requests for the project
   */
  async findByProject(projectId: string) {
    return this.changeRequestService.find({
      where: {project: { id: projectId }},
      relations: ['project', 'user']
    })
  }

  /**
   * Retrieves all change requests created by a specific user
   * Used by developers to view their own submitted change requests
   * @param userId - User identifier
   * @returns Promise<ChangeRequest[]> - Change requests by the user
   */
  async findByUser(userId: string) {
    return this.changeRequestService.find({
      where: {user: { id: userId }},
      relations: ['project', 'user']
    })
  }
}
