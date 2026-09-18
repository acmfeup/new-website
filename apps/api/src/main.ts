import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { parseCorsOrigins } from "./config/cors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: parseCorsOrigins(process.env.CORS_ORIGIN) });

  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port);
  Logger.log(`api listening on http://localhost:${port}`, "Bootstrap");
}

bootstrap();
