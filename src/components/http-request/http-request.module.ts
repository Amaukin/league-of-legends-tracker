import { Module } from '@nestjs/common';
import { HttpRequestService } from './http-request.service';
import { AppService } from '../../app.service';

@Module({
  providers: [HttpRequestService, AppService]
})
export class HttpRequestModule {}
