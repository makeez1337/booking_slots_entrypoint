import { Module } from '@nestjs/common';
import { NotificationsController } from "./notifications.controller";
import { User } from "../users/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [
    NotificationsController,
  ],
  providers: [],
  exports: [],
})
export class NotificationsModule {}
