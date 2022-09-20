import { forwardRef, Module } from "@nestjs/common";
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BookModule } from "../book/book.module";

@Module({
  imports: [
      forwardRef(() => BookModule),
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
