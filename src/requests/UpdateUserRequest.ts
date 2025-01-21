import { IsString, IsEmail, Length, IsInt, Matches } from 'class-validator';
import { IsUnique } from '../validators/UniqueValidator';
import { User } from '../entities/User';

export class UpdateUserRequest {
    @IsInt()
    id!: number;

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
    @Length(19, 19, { message: 'Phone number must be in the format: +38 (0##) ###-##-##' })
    @Matches(/^\+38 \(0\d{2}\) \d{3}-\d{2}-\d{2}$/, {
        message: 'Phone number must be in the format: +38 (0##) ###-##-##',
    })
    @IsUnique(User, 'phone', { message: 'Phone number already in use' })
    phone!: string;
}
