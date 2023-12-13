import { Controller, Get, Post, Body, UsePipes, Inject, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto, UpdateUserRequestDto } from './dto/create-user.dto';
import { User } from './user.model';
import { UserState } from './enum/user.state';
import { AuthendicatedUserInfoResponseDto, SignInResponseDto, VerifySignInResponseDto } from './dto/user.response.dto';
import { SignInRequestDto, VerifySignInAndUpRequestDto } from './dto/users.request.dto';
import { AuthService } from './auth/auth.service'; 
import { Logger } from 'winston';
import { ApiTags } from '@nestjs/swagger';
import { ApiError, ApiException, UserType, Public, UserTypes, AuthenticatedUser } from '@app/common';
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService, 
  ) {
  }

  @UsePipes(new ValidationPipe())
  @Public()
  @Post("createUser")
  async createUser(
    @Body() request: CreateUserRequestDto
  ): Promise<any> {

    

    if (await this.userService.exists({ email: request.email })) { 
      throw ApiException.buildFromApiError(ApiError.USER_EMAIL_EXISTS);
    }
    let newUser = new User();
    newUser.email = request.email;
    newUser.name = request.name;
    newUser.surname = request.surname;
    newUser.password = request.password;
    newUser.type = UserType.USER;

    let user = await this.userService.save(newUser);
    newUser.id = user.id;
    let auth = await this.authService.createVerifySignUpToken(newUser);

    // let email = new SignUpEmail();
    // email.code = auth.verificationCode;
    // email.nameSurname = user.name + " " + user.surname;
    // email.to = user.email;
    // email.language = Language.EN;//user.lang

    // await this.emailService.sendMail(new EmailBuilder(email));

    var response = new SignInResponseDto();
    response.token = auth.token; 
    return response;

  }

  @UsePipes(new ValidationPipe())
  @Public()
  @Post("verifySignUp")
  async verifySignUp(
    @Body() request: VerifySignInAndUpRequestDto
  ): Promise<any> {
 

    let auth = await this.authService.verifySignUpToken(request.token, request.verificationCode);
    let user = await this.userService.findById(auth.userId)
    user.state = UserState.ACTIVE;
    await this.userService.update(user);

  }


  @UsePipes(new ValidationPipe())
  @Public()
  @Post("signIn")
  async signIn(
    @Body() request: SignInRequestDto
  ): Promise<SignInResponseDto> {
 

    let user = await this.userService.getUserByEmail(request.email);
    if (!user) { 
      throw ApiException.buildFromApiError(ApiError.WRONG_EMAIL_OR_PASSWORD);
    }

    if (user.state != UserState.ACTIVE) {
      throw ApiException.buildFromApiError(ApiError.WRONG_EMAIL_OR_PASSWORD);
    }

    let isValidPassword = this.authService.validateUserPassword(user, request.password)

    if (!isValidPassword) {
      throw ApiException.buildFromApiError(ApiError.WRONG_EMAIL_OR_PASSWORD);
    }

    let auth = await this.authService.createVerifySignInToken(user);

    console.log("verification code: " + auth.verificationCode);

    // let email = new SignInEmail();
    // email.code = auth.verificationCode;
    // email.nameSurname = user.name + " " + user.surname;
    // email.to = user.email;
    // email.language = Language.EN;//user.lang

    // await this.emailService.sendMail(new EmailBuilder(email));

    var response = new SignInResponseDto();
    response.token = auth.token;
    return response;
  }

  @UsePipes(new ValidationPipe())
  @Public()
  @Post("verifySignIn")
  async verifySignIn(
    @Body() request: VerifySignInAndUpRequestDto
  ): Promise<VerifySignInResponseDto> {


    let auth = await this.authService.verifySignInToken(request.token, request.verificationCode);
    let user = await this.userService.findById(auth.userId);

    let response = new VerifySignInResponseDto();
    let accessToken = await this.authService.createSignInToken(user);
    response.accessToken = accessToken.token;
    response.authendicatedUser = new AuthendicatedUserInfoResponseDto();
    response.authendicatedUser.id = user.id;
    response.authendicatedUser.email = user.email;
    response.authendicatedUser.type = user.type;
    response.authendicatedUser.name = user.name;
    response.authendicatedUser.surname = user.surname;
    response.authendicatedUser.isSystemUSer = (user.type == UserType.SYSTEM_USER);
    user.lastLoginDate = new Date();

    await this.userService.update(user);

    return response;
  }


  @Get('getAllUser')
  @UserTypes(UserType.SYSTEM_USER)//for Admin
  getAllUser() {
    return this.userService.findAll();
  }

  @UsePipes(new ValidationPipe())
  @Post("updateUser")
  async updateUser(
    @Body() request: UpdateUserRequestDto,
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserDto): Promise<any> {


    if (authenticatedUser.id != request.id) {
      throw ApiException.buildFromApiError(ApiError.NOT_AUTHORIZED);
    }

    let user = await this.userService.findById(request.id);
    user.name = request.name;
    user.surname = request.surname;

    return this.userService.update(user);

  }

}
