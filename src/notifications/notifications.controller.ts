import {Controller, NotFoundException} from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {Repository} from "typeorm";

@Controller('notifications')
export class NotificationsController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  private readonly MAX_RETRY_COUNT = 3;

  @EventPattern('booking.created')
  async bookingCreated(
    @Payload() payload: { userId: string; slotId: string },
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    // Extract RabbitMQ 'x-death' header to track retries
    const xDeath = originalMsg.properties.headers?.['x-death'];
    const retryCount = xDeath ? xDeath[0].count : 0;

    try {
      const user = await this.userRepository.findOne({
        where: {
          id: 'asdqwe',
        }
      })

      if (!user) {
        throw new NotFoundException("User does not exist");
      }

      console.log(`Email sent to user with email: ${user?.email}`)
      channel.ack(originalMsg);
    } catch (error) {
      channel.nack(originalMsg, false, false);


    }
  }
}