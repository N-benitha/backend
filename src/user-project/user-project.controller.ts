import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UserProjectService } from './user-project.service';
import { CreateUserProjectDto } from './dto/create-user-project.dto';
import { UpdateUserProjectDto } from './dto/update-user-project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from 'src/user/entities/enums/user-type.enum';

/**
 * Controller for managing user-project associations in the change request tracking system
 * Handles the many-to-many relationship between users and projects
 * Determines which projects users can create/view change requests for
 */
@UseGuards(AuthGuard, RolesGuard) // Ensures all endpoints require authentication and role validation
@Controller('user-project')
export class UserProjectController {
  constructor(private readonly userProjectService: UserProjectService) {}

  /**
   * Creates a new user-project association
   * Used by admins to assign users to projects they can work on
   * Enables project-based access control for change requests
   */
  @Post()
  @Roles(UserType.ADMIN)
  async create(@Body() createUserProjectDto: CreateUserProjectDto) {
    return this.userProjectService.create(createUserProjectDto);
  }

  /**
   * Retrieves all user-project associations
   * Helpful for understanding user access patterns and project coverage
   */
  @Get('all')
  findAll() {
    return this.userProjectService.findAll();
  }

  // @Get()
  // async findByUser(@Query('userId') userId: string) {
  //   console.log(`Finding projects for user: ${userId}`);
  //   try {
  //     const userProjects = await this.userProjectService.findUserProjects(userId);

  //     const projects = userProjects.map(up => up.project);
  //     console.log(`Found ${projects.length} projects for user ${userId}`);
  //     return projects;      
  //   } catch (error) {
  //     console.error(`Error finding projects for user ${userId}:`, error);
  //     throw error;
  //   }
    
  // }

  // @Delete()
  // async removeUserProject(@Body() data: { userId: string, projectId: string}) {
  //   console.log('Removing user-project with:', data);
  //   try {
  //     const userProjects = await this.userProjectService.findUserProjectByUserAndProject(
  //       data.userId,
  //       data.projectId
  //     );
  //     if (!userProjects.length) throw new Error('User-project association not found');

  //     await this.userProjectService.remove(userProjects[0].id);

  //     return {
  //       message: "Project successfully unassigned from user",
  //       removed: userProjects[0]
  //     };
  //   } catch (error) {
  //     console.error('Failed to remove user-project', error);
  //     throw error;      
  //   }
    
  // }


  /**
   * Retrieves a specific user-project association by ID
   * Used for viewing details of a particular user-project relationship
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userProjectService.findOne({where: {id}});
  }

  // Updates an existing user-project association
  @Patch(':id')
  @Roles(UserType.ADMIN)
  async update(@Param('id') id: string, @Body() updateUserProjectDto: UpdateUserProjectDto) {
    return this.userProjectService.update(id, updateUserProjectDto);
  }

  // Removes a user-project association
  @Delete(':id')
  @Roles(UserType.ADMIN)
  async remove(@Param('id') id: string) {
    const userProjects = await this.userProjectService.remove(id);
    return {
      message: "User-project association deleted",
      userProjects
    }
  }
}
