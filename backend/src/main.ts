import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from "../config/app-config";
import {NestExpressApplication} from "@nestjs/platform-express";
const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  (app as NestExpressApplication).use(cors({
    origin: appConfig.corsOrigin,
  }));

  await app.listen(appConfig.listenPort, () => {
    console.log('Server is working ...');
  });
}
bootstrap();
