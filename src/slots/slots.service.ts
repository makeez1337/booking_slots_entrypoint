import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Slot} from "./entities/slot.entity";
import {Repository} from "typeorm";

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot) private slotsRepository: Repository<Slot>,
  ) {
  }

  async getAvailable() {
    console.log('NOT CACHED CALL')
    const [data, count] = await this.slotsRepository
      .createQueryBuilder('slot')
      .where('slot.booked_count < slot.capacity')
      .getManyAndCount()

    return {
      count,
      data,
    }
  }
}