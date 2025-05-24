import { Injectable } from '@nestjs/common';
import { CreateUserProjectDto } from './dto/create-user-project.dto';
import { UpdateUserProjectDto } from './dto/update-user-project.dto';
import { UserProject } from './entities/user-project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Project } from 'src/project/entities/project.entity';

@Injectable()
export class UserProjectService {
  constructor (
    @InjectRepository(UserProject)
    private userProjectsRepository: Repository<UserProject>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>
  ) {}

  async create(createUserProjectDto: CreateUserProjectDto) {
    // check if association already exists
    const existingAssociation = await this.userProjectsRepository.findOne({
      where: {
        user: { id: createUserProjectDto.userId},
        project: { id: createUserProjectDto.projectId}
      },
      relations: ['user', 'project']
    });
    if (existingAssociation) {
      console.log('Association already exists:', existingAssociation);
      return existingAssociation;      
    }

    // otherwise create one
    const user = await this.userRepository.findOne({where: {id: createUserProjectDto.userId}});
    const project = await this.projectRepository.findOne({where: {id: createUserProjectDto.projectId}});

    if (!user || !project) throw new Error('User or Project not found');

    const userProject = this.userProjectsRepository.create({
      user,
      project,
    });
    return this.userProjectsRepository.save(userProject);
  }

 async findAll(): Promise<UserProject[]> {
    return this.userProjectsRepository.find({
      relations: ['project', 'user']
    });
  }

  async findOne(options: FindOneOptions<UserProject>): Promise<UserProject | null> {
    return this.userProjectsRepository.findOne({
      ...options,
      relations: ['project', 'user']
    });
  }

  async findUserProjects(userId: string): Promise<UserProject[]> {
    return this.userProjectsRepository.find({
      where: { user: { id: userId } },
      relations: ['project', 'user']
    });
  }

  async findUserProjectByUserAndProject(userId: string, projectId: string): Promise<UserProject[]> {
    return this.userProjectsRepository.find({
      where: {
        user: { id: userId},
        project: {id: projectId}
      },
      relations: ['project', 'user']
    });
  }

  async update(id: string, updateUserProjectDto: UpdateUserProjectDto) {
    const userProject = await this.userProjectsRepository.findOne({ where: { id } });
    if (!userProject) {
      throw new Error('UserProject not found');
    }

    // If userId is provided, load the User entity
    if (updateUserProjectDto.userId) {
      const user = await this.userRepository.findOne({ where: { id: updateUserProjectDto.userId } });
      if (!user) throw new Error('User not found');
      userProject.user = user;
    }

    // If projectId is provided, load the Project entity
    if (updateUserProjectDto.projectId) {
      const project = await this.projectRepository.findOne({ where: { id: updateUserProjectDto.projectId } });
      if (!project) throw new Error('Project not found');
      userProject.project = project;
    }

    return this.userProjectsRepository.save(userProject);
  }

  async remove(id: string): Promise<void> {
    await this.userProjectsRepository.delete(id);
  }
}
