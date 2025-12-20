import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog} from './entities/blog.entity';
import { CreateBlogDto, PaginationDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';


@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
  ) {}

  async create(dto: CreateBlogDto): Promise<Blog> {
    const blog = this.blogRepository.create(dto);
    return this.blogRepository.save(blog);
  }

  async findAll(pagination: PaginationDto) {
    const { page, limit } = pagination;

    const skip = (page - 1) * limit;

    const [data, total] = await this.blogRepository.findAndCount({
      take: limit,
      skip,
      order: {
        createdAt: 'DESC', // recommended
      },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) throw new NotFoundException(`Blog #${id} not found`);
    return blog;
  }

  async update(id: string, dto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.findOne(id);
    Object.assign(blog, dto);
    return this.blogRepository.save(blog);
  }

  async remove(id: string): Promise<void> {
    const blog = await this.findOne(id);
    await this.blogRepository.remove(blog);
  }
}
