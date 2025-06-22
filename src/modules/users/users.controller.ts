import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UserUuid } from '@/decorators/user-uuid.decorator';
import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiDeleteUser,
  ApiGetUserInfo,
  ApiUpdateProfile,
  ApiLogout,
} from './decorators/users.swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('user')
@ApiBearerAuth('JWT-auth')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('logout')
  @ApiLogout()
  async logout(@UserUuid() userUuid: string) {
    return this.usersService.logout(userUuid);
  }

  @Post('profile')
  @ApiUpdateProfile()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UserUuid() UserUuid: string,
  ) {
    return this.usersService.updateProfile(UserUuid, updateProfileDto);
  }

  @Delete('member')
  @UseGuards(JwtAuthGuard)
  @ApiDeleteUser()
  async deleteAccount(@UserUuid() UserUuid: string) {
    return this.usersService.deleteUser(UserUuid);
  }

  @Get('userInfo')
  @ApiGetUserInfo()
  async getUserInfo(@UserUuid() UserUuid: string) {
    return this.usersService.getUserInfo(UserUuid);
  }
}
