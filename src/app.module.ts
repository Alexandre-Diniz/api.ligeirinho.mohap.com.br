import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModuleModule } from './test_module/test_module.module';

@Module({
  imports: [TestModuleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
