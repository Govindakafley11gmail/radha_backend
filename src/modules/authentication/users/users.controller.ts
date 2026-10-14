import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseService } from 'src/common/response/response';
import Api_URL from 'src/router/authentication';
import type { Response, CookieOptions } from 'express';
import { Public } from 'src/common/token/decorator';

const responseService = new ResponseService();

// Cookie settings:
// - Production (Vercel frontend -> Render backend) is cross-site, so it needs
//   SameSite=None and Secure=true.
// - Local dev is same-site, so Lax without Secure works over http.
const isProd = process.env.NODE_ENV === 'production';

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
};

@Controller(Api_URL.user)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return responseService.success(
        user,
        'User created successfully',
        HttpStatus.CREATED,
      );
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
      return responseService.success(
        users,
        'Users fetched successfully',
        HttpStatus.OK,
      );
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
      return responseService.success(
        user,
        'User fetched successfully',
        HttpStatus.OK,
      );
    } catch (error: unknown) {
      return responseService.error(
        error instanceof Error ? error.message : String(error),
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.usersService.update(+id, updateUserDto);
      return responseService.success(
        updatedUser,
        'User updated successfully',
        HttpStatus.OK,
      );
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
      return responseService.success(
        null,
        `User with id ${id} deleted successfully`,
        HttpStatus.OK,
      );
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
    @Res({ passthrough: true }) res: Response, // lets us set cookies and still return a body
  ) {
    try {
      const { user, accessToken, refreshToken } =
        await this.usersService.login(loginDto);

      res.cookie('access_token', accessToken, {
        ...baseCookieOptions,
        maxAge: 1000 * 60 * 60, // 1 hour
      });

      res.cookie('refresh_token', refreshToken, {
        ...baseCookieOptions,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days (was 10 seconds)
      });

      // Tokens stay in HttpOnly cookies only, not in the JSON body
      return responseService.success(
        { user },
        'Login successfully',
        HttpStatus.OK,
      );
    } catch (error: unknown) {
      // Throwing sets a real 401 status, unlike returning an error object
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Login failed',
      );
    }
  }
}