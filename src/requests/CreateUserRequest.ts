import { IsString, IsEmail, Length } from 'class-validator';
import { IsUnique } from '../validators/UniqueValidator';
import { User } from '../entities/User';

export class CreateUserRequest {
    @IsString()
    @Length(1, 255)
    firstName!: string;

    @IsString()
    @Length(1, 255)
    lastName!: string;

    @IsEmail()
    @Length(1, 255)
    @IsUnique(User, 'email', { message: 'Email already in use' })
    email!: string;

    @IsString()
    @Length(1, 20)
    @IsUnique(User, 'phone', { message: 'Phone number already in use' })
    phone!: string;

    @IsString()
    @Length(6, 255)
    password!: string;
}
