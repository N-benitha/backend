import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Res, Req, UnauthorizedException, ValidationPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from './entities/enums/user-type.enum';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Get()
  @Roles(UserType.ADMIN)
  async findAll() {
    const users = await this.userService.findAll();
    return {
      users: users.map((user) => ({
        id: user.id,
        username: user.username,
        user_type: user.user_type
      }))
    };
  }

  @Post('create')
  @Roles(UserType.ADMIN)
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const {username, email, password, user_type, status} = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userService.create({
      username,
      email,
      password: hashedPassword,
      user_type,
      status
    });
    const {password: _password, ...result} = user;
    
    return {
      message: "User created",
      result
    }
  }

  @Get(':id')
  @Roles(UserType.ADMIN, UserType.APPROVER)
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne({where: {id}});
    return {
      id: user?.id,
      username: user?.username,
      user_type: user?.user_type,
      status: user?.status,
    }
  }

  @Patch(':id')
  @Roles(UserType.ADMIN)
  update(@Param('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN)
  remove(@Param('id') id: string) {
    const deleted = this.userService.remove(id);
    return {
      message: "User deleted",
      deleted
    }
  }
}
