import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Res, Req, UnauthorizedException, ValidationPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserType } from './entities/enums/user-type.enum';

/**
 * Controller for managing users in the change request tracking system
 * Handles user CRUD operations with role-based access control
 * Protected by authentication and role guards
 */
@UseGuards(AuthGuard, RolesGuard) // Ensures all endpoints require authentication and role validation
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  /**
   * Retrieves all users in the system
   * Returns simplified user data without sensitive information
   * Restricted to admins only for user management purposes
   */
  @Get()
  @Roles(UserType.ADMIN)
  async findAll() {
    const users = await this.userService.findAll();
    return {
      users: users.map((user) => ({
        id: user.id,
        username: user.username,
        user_type: user.user_type // Shows role: developer, approver, or admin
      }))
    };
  }

  /**
   * Creates a new user in the system
   * Hashes the password before storing for security
   * Excludes password from response data
   * Restricted to admins only for user account creation
   */
  @Post('create')
  @Roles(UserType.ADMIN)
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const {username, email, password, user_type, status} = createUserDto;
    // Hash password with salt rounds of 12 for security
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userService.create({
      username,
      email,
      password: hashedPassword,
      user_type,
      status
    });

    // Remove password from response for security
    const {password: _password, ...result} = user;
    
    return {
      message: "User created",
      result
    }
  }

  /**
   * Retrieves a specific user by ID
   * Returns user details without sensitive information
   * Accessible by admins and approvers for user verification
   */
  @Get(':id')
  @Roles(UserType.ADMIN, UserType.APPROVER)
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne({where: {id}});
    return {
      id: user?.id,
      username: user?.username,
      user_type: user?.user_type,
      status: user?.status, // Active/Idle status
    }
  }

  /**
   * Updates an existing user's information
   * Restricted to admins for user account management
   */
  @Patch(':id')
  @Roles(UserType.ADMIN)
  update(@Param('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Deletes a user from the system
   * Restricted to admins only for user account management
   */
  @Delete(':id')
  @Roles(UserType.ADMIN)
  async remove(@Param('id') id: string) {
    const deleted = await this.userService.remove(id);
    return {
      message: "User deleted",
      deleted
    }
  }
}
