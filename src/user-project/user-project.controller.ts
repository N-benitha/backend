import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserProjectService } from './user-project.service';
import { CreateUserProjectDto } from './dto/create-user-project.dto';
import { UpdateUserProjectDto } from './dto/update-user-project.dto';

@Controller('user-project')
export class UserProjectController {
  constructor(private readonly userProjectService: UserProjectService) {}

  @Post()
  async create(@Body() createUserProjectDto: CreateUserProjectDto) {
    return this.userProjectService.create(createUserProjectDto);
  }

  @Get('all')
  findAll() {
    return this.userProjectService.findAll();
  }

  @Get()
  async findByUser(@Query('userId') userId: string) {
    console.log(`Finding projects for user: ${userId}`);
    try {
      const userProjects = await this.userProjectService.findUserProjects(userId);

      const projects = userProjects.map(up => up.project);
      console.log(`Found ${projects.length} projects for user ${userId}`);
      return projects;      
    } catch (error) {
      console.error(`Error finding projects for user ${userId}:`, error);
      throw error;
    }
    
  }

  @Delete()
  async removeUserProject(@Body() data: { userId: string, projectId: string}) {
    console.log('Removing user-project with:', data);
    try {
      const userProjects = await this.userProjectService.findUserProjectByUserAndProject(
        data.userId,
        data.projectId
      );
      if (!userProjects.length) throw new Error('User-project association not found');

      await this.userProjectService.remove(userProjects[0].id);

      return {
        message: "Project successfully unassigned from user",
        removed: userProjects[0]
      };
    } catch (error) {
      console.error('Failed to remove user-project', error);
      throw error;      
    }
    
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userProjectService.findOne({where: {id}});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserProjectDto: UpdateUserProjectDto) {
    return this.userProjectService.update(id, updateUserProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const userProjects = this.userProjectService.remove(id);
    return {
      message: "Use-project association deleted",
      userProjects
    }
  }
}
