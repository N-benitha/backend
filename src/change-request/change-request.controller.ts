import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ChangeRequestService } from './change-request.service';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { UpdateChangeRequestDto } from './dto/update-change-request.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from 'src/user/entities/enums/user-type.enum';

/**
 * Controller for managing change requests in the CR tracking system
 * Handles CRUD operations for change requests across all user types
 */
@UseGuards(AuthGuard, RolesGuard) // Ensures all endpoints require authentication and role validation
@Controller('change-request')
export class ChangeRequestController {
  constructor(private readonly changeRequestService: ChangeRequestService) {}

  /**
   * Creates a new change request
   * Used by developers to submit new CRs for approval
   */
  @Post('create')
  @Roles(UserType.DEVELOPER)
  create(@Body() createChangeRequestDto: CreateChangeRequestDto) {
    return this.changeRequestService.create(createChangeRequestDto);
  }

  /**
   * Retrieves all change requests for all users
   * Returns formatted response with essential CR information
   * Used by admins and approvers to view all pending/deployed requests
   */
  @Get('all-users')
  @Roles(UserType.ADMIN, UserType.APPROVER)
  async findAll() {
    const changeRequests = await this.changeRequestService.findAll();
    return {
      requests:
      changeRequests.map((changeRequest) => ({
        id: changeRequest.id,
        description: changeRequest.description,
        project: changeRequest.project,
        user: changeRequest.user,
        request_type: changeRequest.request_type,
        status: changeRequest.status,
        deployment_date: changeRequest.deployment_date,
        created_at: changeRequest.created_at,
        updated_at: changeRequest.updated_at
      }))
    };
  }

  // @Get('')
  // findByDate(@Body() date: Date) {
  //   const changeRequest = this.changeRequestService.findOne({where: {date}})
  // }

  /**
   * Retrieves change requests with applied filters
   * Supports filtering by project, user, status, date range, etc.
   * Used for dashboard filtering and reporting
   */
  @Get('query')
  @Roles(UserType.ADMIN, UserType.APPROVER, UserType.DEVELOPER)
  async findWithFilters(@Query() filters) {
    return this.changeRequestService.findWithFilters(filters);
  }

  // @Get(':/projectId')
  // async findByProject(@Param('projectId') projectId: string) {
  //   return this.changeRequestService.findByProject(projectId);
  // }

  // @Get(':/userId')
  // async findByUser(@Param('userId') userId: string) {
  //   return this.changeRequestService.findByProject(userId);
  // }

  /**
   * Retrieves a specific change request by ID
   */
  @Get(':id')
  @Roles(UserType.ADMIN, UserType.APPROVER, UserType.DEVELOPER)
  findOne(@Param('id') id: string) {
    return this.changeRequestService.findOne({where: {id}});
  }

  /**
   * Updates an existing change request
   */
  @Patch(':id')
  @Roles(UserType.DEVELOPER, UserType.APPROVER)
  update(@Param('id') id: string, @Body() updateChangeRequestDto: UpdateChangeRequestDto) {
    return this.changeRequestService.update(id, updateChangeRequestDto);
  }

  /**
   * Deletes a change request
   * Restricted to admins
   */
  @Delete(':id')
  @Roles(UserType.ADMIN)
  remove(@Param('id') id: string) {
    const changeRequest = this.changeRequestService.remove(id);
    return {
      message: "request deleted",
      changeRequest
    }
  }
}
