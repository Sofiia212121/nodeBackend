import { IsString, IsEmail, Length } from 'class-validator';

export class LoginUserRequest {
    @IsEmail()
    @Length(1, 255)
    email!: string;

    @IsString()
    @Length(6, 255)
    password!: string;
}
