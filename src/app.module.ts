import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ConfigService } from './configuration.service';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [
      NotificationService,
      {
          provide: ConfigService,
          useValue: new ConfigService(`${process.env.NODE_ENV}.env`),
      }
  ],
  exports: [ConfigService],
})
export class AppModule {}
