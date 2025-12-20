import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseService } from 'src/common/response/response';
import Api_URL from 'src/router/authentication';
import type { Response } from 'express'; // ✅ use 'import type'
import { Public } from 'src/common/token/decorator';

const responseService = new ResponseService();

@Controller(Api_URL.user)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return responseService.success(user, 'User created successfully', HttpStatus.CREATED);
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to create user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return responseService.success(users, 'Users fetched successfully', HttpStatus.OK);
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(+id);
      return responseService.success(user, 'User fetched successfully', HttpStatus.OK);
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.usersService.update(+id, updateUserDto);
      return responseService.success(updatedUser, 'User updated successfully', HttpStatus.OK);
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `Failed to update user with id ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(+id);
      return responseService.success(null, `User with id ${id} deleted successfully`, HttpStatus.OK);
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `Failed to delete user with id ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
   @Public()
   @Post('login')
  async login(
    @Body() loginDto: { email: string; password: string },
    @Res({ passthrough: true }) res: Response, // enable sending cookies
  ) {
    try {
      const { user, accessToken, refreshToken } = await this.usersService.login(loginDto);

      // Set tokens in HttpOnly cookies
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: 'lax',
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'lax',
      });

      return responseService.success(user, 'Login successful', HttpStatus.OK);
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        'Login failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
