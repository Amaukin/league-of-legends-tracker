import { Module } from '@nestjs/common';
import { HttpRequestService } from './http-request.service';

@Module({
  providers: [HttpRequestService]
})
export class HttpRequestModule {}
