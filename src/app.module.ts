import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm.config'
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { JwtModule } from '@nestjs/jwt';
import { ChangeRequestModule } from './change-request/change-request.module';
import { UserProjectModule } from './user-project/user-project.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: {expiresIn: '1d'}
    }),
    UserModule,
    ProjectModule,
    ChangeRequestModule,
    UserProjectModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
