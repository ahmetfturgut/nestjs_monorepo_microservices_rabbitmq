import { SetMetadata } from '@nestjs/common';  
import { UserType } from '../tools/enums/usertype.enum';

export const UserTypes = (...usertypes: UserType[]) => SetMetadata('userTypes', usertypes);