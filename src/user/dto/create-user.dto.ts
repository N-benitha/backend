import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { UserType } from '../entities/enums/user-type.enum';
import { UserStatus } from '../entities/enums/user-status.enum';
export class CreateUserDto {
        @IsString()
        @IsNotEmpty()
        username: string;
    
        @IsEmail()
        @IsNotEmpty()
        email: string;
    
        @IsNotEmpty()
        password:string;
    
        @IsOptional()
        @IsEnum(UserType, {
            message: 'Valid type required'
        })
        user_type: UserType;
    
        @IsOptional()
        @IsEnum(UserStatus, {
            message: 'Valid role required'
        })
        status: UserStatus;
    
}
