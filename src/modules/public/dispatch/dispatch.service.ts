import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispatch } from './entities/dispatch.entity';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { UpdateDispatchDto } from './dto/update-dispatch.dto';

@Injectable()
export class DispatchService {
  constructor(
    @InjectRepository(Dispatch)
    private readonly dispatchRepo: Repository<Dispatch>,
  ) {}
  

  // ✅ Create Dispatch
  async create(createDispatchDto: CreateDispatchDto): Promise<Dispatch> {
    // 1️⃣ Get the last dispatch to calculate versionNo
    const lastDispatch = await this.dispatchRepo
      .createQueryBuilder('dispatch')
      .orderBy('dispatch.versionNo', 'DESC')
      .getOne();

    const versionNo = lastDispatch ? lastDispatch.versionNo + 1 : 1;

    // 2️⃣ Generate dispatchNo
    const year = new Date().getFullYear();
    const dispatchNo = `RADHA/${year}/PI/${String(versionNo).padStart(4, '0')}`;

    // 3️⃣ Create Dispatch entity
    const dispatch = this.dispatchRepo.create({
      ...createDispatchDto,
      versionNo,
      dispatchNo,
    });

    // 4️⃣ Save to DB
    return await this.dispatchRepo.save(dispatch);
  }

  // ✅ Find all Dispatches
  async findAll(): Promise<Dispatch[]> {
    return await this.dispatchRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  // ✅ Find one Dispatch by UUID
  async findOne(id: string): Promise<Dispatch> {
    const dispatch = await this.dispatchRepo.findOne({
      where: { id },
    });

    if (!dispatch) {
      throw new NotFoundException(`Dispatch with id ${id} not found`);
    }

    return dispatch;
  }

  // ✅ Update Dispatch
  async update(
    id: string,
    updateDispatchDto: UpdateDispatchDto,
  ): Promise<Dispatch> {
    const dispatch = await this.findOne(id);
    Object.assign(dispatch, updateDispatchDto);
    return await this.dispatchRepo.save(dispatch);
  }

  // ✅ Remove Dispatch
  async remove(id: string): Promise<void> {
    const dispatch = await this.findOne(id);
    await this.dispatchRepo.remove(dispatch);
  }
}
