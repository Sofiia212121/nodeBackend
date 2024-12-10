import { IsString, Length, IsStrongPassword } from 'class-validator';

export class UpdateUserPasswordRequest {
    @IsString()
    @Length(8, 255)
    password!: string;

    @IsString()
    @Length(8, 255)
    @IsStrongPassword()
    newPassword!: string;

    @IsString()
    @Length(8, 255)
    passwordConfirmation!: string;
}
