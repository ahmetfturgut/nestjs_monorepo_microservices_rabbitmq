import { RegexClass } from "@app/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, Max, Min } from "class-validator";  

export class CreateUserRequestDto {

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    surname: string;

    @ApiProperty()
    @IsString()
    @Matches(RegexClass.PASSWORD, { message: "password error" })
    password: string;

}


export class UpdateUserRequestDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    surname: string;


}
