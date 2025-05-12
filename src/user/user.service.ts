import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  async create(data: any): Promise<User> {
    return this.userRepository.save(data);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.userRepository.findOne(options);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({where: {id}});

  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
