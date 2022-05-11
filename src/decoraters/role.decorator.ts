import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/constants';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
