import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';

/**
 * Service for managing user operations in the change request tracking system
 * Handles database interactions for user CRUD operations
 * Supports three user types: developer, approver, and admin
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user in the system
   * Used by admins to create accounts for developers, approvers, and other admins
   * @param data - User data (should be typed as CreateUserDto for consistency)
   * @returns Promise<User> - The created user entity
   */
  async create(data: any): Promise<User> {
    return this.userRepository.save(data);
  }

  /**
   * Retrieves all users from the database
   * Used by admins for user management and by approvers for user lookup
   * @returns Promise<User[]> - Array of all users in the system
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Finds a single user by specified criteria
   * Used for authentication, user profile retrieval, and user validation
   * @param options - TypeORM find options with conditions
   * @returns Promise<User | null> - Found user or null if not found
   */
  async findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.userRepository.findOne(options);
  }

  /**
   * Updates an existing user's information
   * Used by admins to modify user details, roles, or status
   * Returns the updated user entity for confirmation
   * @param id - User ID to update
   * @param updateUserDto - Updated user data
   * @returns Promise<User | null> - Updated user entity or null if not found
   */

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({where: {id}});

  }

  /**
   * Removes a user from the database
   * TODO: Implementing soft delete to maintain audit trail in the future
   * @param id - User ID to delete
   * @returns Promise<void>
   */
  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
