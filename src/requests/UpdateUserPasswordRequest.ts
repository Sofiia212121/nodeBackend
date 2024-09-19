import { IsString, Length } from 'class-validator';

export class UpdateUserPasswordRequest {
    @IsString()
    @Length(8, 255)
    password!: string;

    @IsString()
    @Length(8, 255)
    newPassword!: string;

    @IsString()
    @Length(8, 255)
    passwordConfirmation!: string;
}
