import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userIdFromParams = parseInt(request.params.userId || request.body.userId);

    if (!user) {
      return false;
    }


    if (user.role === Role.ADMIN) {
      return true;
    }


    if (user.userId !== userIdFromParams) {
      throw new ForbiddenException('Vous ne pouvez accéder qu’à vos propres données');
    }

    return true;
  }
}
