import { Module } from '@nestjs/common';
import { NotificationsController } from "./notifications.controller";
import { User } from "../users/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import {NotificationsConsumer} from "./notifications.consumer";

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [
    NotificationsController,
  ],
  providers: [NotificationsConsumer],
  exports: [],
})
export class NotificationsModule {}
