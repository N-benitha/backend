import { Module } from '@nestjs/common';
import { ChangeRequestService } from './change-request.service';
import { ChangeRequestController } from './change-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChangeRequest } from './entities/change-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChangeRequest])],
  controllers: [ChangeRequestController],
  providers: [ChangeRequestService],
})
export class ChangeRequestModule {}
