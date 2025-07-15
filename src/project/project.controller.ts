import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from 'src/user/entities/enums/user-type.enum';

/**
 * Controller for managing projects in the change request tracking system
 * Projects are containers for change requests and are managed by admins
 */
@UseGuards(AuthGuard, RolesGuard) // Ensures all endpoints require authentication and role validation
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * Creates a new project in the system
   * Typically used by admins to set up new projects for change request tracking system
   */
  @Post('create')
  @Roles(UserType.ADMIN)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  /**
   * Retrieves all projects with basic information
   * Used for project selection dropdowns and project listing views
   * Returns simplified project data without related entities
   */
  @Get('all-projects')
  async findAll() {
    const projects = await this.projectService.findAll();
    return {
      projects: projects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description
      }))
    };
  }

  /**
   * Retrieves a specific project by ID
   * Used for viewing detailed project information and associated change requests
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne({where: {id}});
  }

  /**
   * Updates an existing project
   * Restricted to admins for modifying project details
   */
  @Patch(':id')
  @Roles(UserType.ADMIN)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  /**
   * Deletes a project from the system
   * Restricted to admins
   */
  @Delete(':id')
  @Roles(UserType.ADMIN)
  async remove(@Param('id') id: string) {
    const project = await this.projectService.remove(id);
    return {
      message: "Project deleted",
      project
    }
  }
}
