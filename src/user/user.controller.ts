import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles('admin')
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.userService.findById(Number(id));
  }
}
