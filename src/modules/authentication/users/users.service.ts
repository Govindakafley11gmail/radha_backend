/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permission/entities/permission.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
    private readonly jwtService: JwtService,
  ) {}

  // Create user with hashed password
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, roleIds = [], permissionIds = [] } = createUserDto;

    const roles = roleIds.length
      ? await this.roleRepository.find({ where: { id: In(roleIds) } })
      : [];

    const permissions = permissionIds.length
      ? await this.permissionRepository.find({ where: { id: In(permissionIds) } })
      : [];

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      roles,
      permissions,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['roles', 'permissions'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'permissions'],
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.roleIds) {
      user.roles = await this.roleRepository.find({ where: { id: In(updateUserDto.roleIds) } });
    }

    if (updateUserDto.permissionIds) {
      user.permissions = await this.permissionRepository.find({ where: { id: In(updateUserDto.permissionIds) } });
    }

    // Hash password if updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  // Login and generate access & refresh tokens
  async login(user: { email: string; password: string }): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const { email, password } = user;

    const foundUser = await this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'permissions'],
    });

    if (!foundUser) {
      throw new NotFoundException(`User with name "${email}" not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { id: foundUser.id, name: foundUser.name, email: foundUser.email , role: foundUser.roles, permission: foundUser.permissions };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'ACCESS_SECRET',
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET',
      expiresIn: '7d',
    });

    return { user: foundUser, accessToken, refreshToken };
  }
}
