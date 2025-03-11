import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {

    @ApiProperty({ example: 'admin@dgnxt.in', description: 'The user ID' })
    @IsNotEmpty({ message: 'Please provide your email' })
    @IsEmail({}, { message: 'Please provide a valid email' })
    email: string;
    @ApiProperty({ example: 'password123', description: 'The user password' })
    @IsNotEmpty({ message: 'Please provide your password' })
    password: string;
}
