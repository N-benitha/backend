import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { title } from 'process';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne({where: {id}});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const project = this.projectService.remove(id);
    return {
      message: "Project deleted",
      project
    }
  }
}
