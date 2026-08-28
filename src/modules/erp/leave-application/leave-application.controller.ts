import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { LeaveApplicationService } from "./leave-application.service";
import { CreateLeaveApplicationDto } from "./dto/create-leave-application.dto";
import { UpdateLeaveApplicationDto } from "./dto/update-leave-application.dto";
import { ResponseService } from "src/common/response/response";
import { Request } from "express";

const responseService = new ResponseService();

interface AuthRequest extends Request {
  user: {
    id: string;
    role: any[];
  };
}

@Controller("leave-application")
export class LeaveApplicationController {
  constructor(
    private readonly leaveApplicationService: LeaveApplicationService,
  ) {}

  @Post()
  async create(@Req() req: AuthRequest, @Body() dto: CreateLeaveApplicationDto) {
    const result = await this.leaveApplicationService.create(+req.user.id, dto);

    return responseService.success(
      result,
      "Leave application created",
      HttpStatus.CREATED,
    );
  }

  @Get()
  async findAll(@Req() req: AuthRequest) {
    const result = await this.leaveApplicationService.findAll(+req.user.id);

    return responseService.success(
      result,
      "Fetched successfully",
      HttpStatus.OK,
    );
  }

  @Get("balance")
  async balance(@Req() req: AuthRequest) {
    const result = await this.leaveApplicationService.leavesBalance(
      +req.user.id,
    );

    return responseService.success(
      result,
      "Balance fetched",
      HttpStatus.OK,
    );
  }

  @Get(":id")
  async findOne(@Req() req: AuthRequest, @Param("id") id: string) {
    const result = await this.leaveApplicationService.findOne(
      +req.user.id,
      id,
    );

    return responseService.success(result, "Fetched", HttpStatus.OK);
  }

  @Patch(":id")
  async update(
    @Req() req: AuthRequest,
    @Param("id") id: string,
    @Body() dto: UpdateLeaveApplicationDto,
  ) {
    const result = await this.leaveApplicationService.update(
      +req.user.id,
      id,
      dto,
      req.user.role || [],
    );

    return responseService.success(
      result,
      "Updated successfully",
      HttpStatus.OK,
    );
  }

  @Delete(":id")
  async remove(@Req() req: AuthRequest, @Param("id") id: string) {
    const result = await this.leaveApplicationService.remove(
      +req.user.id,
      id,
    );

    return responseService.success(result, "Deleted", HttpStatus.OK);
  }
}