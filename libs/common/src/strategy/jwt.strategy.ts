import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';  
import { Request } from 'express'; 
import { tokenConfig } from '../environment/config'; 
import { ITokenPayload } from 'apps/users/src/auth/interfaces/token-payload.interface';
import { AuthenticatedUserDto } from 'apps/users/src/dto/authenticated-user.dto';
import { AuthService } from 'apps/users/src/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
			private authService: AuthService,
			) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
			secretOrKey: tokenConfig.jwtSacretKey,
			passReqToCallback: true			
		});
	}

	async validate(req: Request & {ipAddress: string}, payload: ITokenPayload): Promise<AuthenticatedUserDto> {
 
		let user = await this.authService.checkAndGetAuthenticatedUser(payload.authId);		
		if(!user) { 
			throw new UnauthorizedException();
		}
		return user;
	}
}