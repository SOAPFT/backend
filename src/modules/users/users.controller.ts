import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UserUuid } from '@/decorators/user-uuid.decorator';
import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiGetUserInfo,
  ApiUpdateProfile,
  ApiLogout,
  ApiOnboarding,
} from './decorators/users.swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OnBoardingDto } from './dto/onBoarding.dto';

@ApiTags('user')
@ApiBearerAuth('JWT-auth')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('onboarding')
  @ApiOnboarding()
  async completeOnboarding(
    @Body() onBoardingDto: OnBoardingDto,
    @UserUuid() UserUuid: string,
  ) {
    return this.usersService.completeOnboarding(UserUuid, onBoardingDto);
  }

  @Post('logout')
  @ApiLogout()
  async logout(@UserUuid() UserUuid: string) {
    return this.usersService.logout(UserUuid);
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
  async deleteAccount(@UserUuid() UserUuid: string) {
    return this.usersService.deleteUser(UserUuid);
  }

  @Get('userInfo')
  @ApiGetUserInfo()
  async getUserInfo(@UserUuid() UserUuid: string) {
    return this.usersService.getUserInfo(UserUuid);
  }
}
