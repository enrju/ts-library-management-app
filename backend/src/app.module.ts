import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule} from "@nestjs/typeorm";
import { ormConfig } from "../config/orm-config";
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [
      TypeOrmModule.forRoot(ormConfig),
      UserModule,
      AuthModule,
      BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
