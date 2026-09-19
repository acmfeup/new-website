import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { parseCorsOrigins } from "./config/cors";
import { API_PORT } from "./config/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: parseCorsOrigins(process.env.CORS_ORIGIN) });

  await app.listen(API_PORT);
  Logger.log(`api listening on http://localhost:${API_PORT}`, "Bootstrap");
}

bootstrap();
