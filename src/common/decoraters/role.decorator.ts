import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/common/constants';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
