import { Module } from '@nestjs/common';
import { BlogsModule } from './blogs/blogs.module';
import { AnnouncementModule } from './announcement/announcement.module';

@Module({
  imports: [BlogsModule, AnnouncementModule]
})
export class WebsiteModule {}
