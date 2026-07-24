import {Controller, Get, UseInterceptors} from "@nestjs/common";
import { SlotsService } from "./slots.service";
import {CacheInterceptor, CacheKey} from "@nestjs/cache-manager";

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get('/available')
  @UseInterceptors(CacheInterceptor)
  async getAvailable() {
    return this.slotsService.getAvailable()
  }
}