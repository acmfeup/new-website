import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { toNodeHandler } from "better-auth/node";
import { AppModule } from "./app.module";
import { auth } from "./auth/auth";
import { API_PORT, CORS_ORIGINS } from "./config/env";

async function bootstrap() {
  // Better Auth checks its config (e.g. a missing secret in production) lazily,
  // on the first /api/auth request, and that error crashes the process. Await
  // it here so a bad config fails at boot and the deploy's /health check stops it.
  await auth.$context;
  const app = await NestFactory.create(AppModule);
  // credentials: the browser only sends the session cookie to another origin
  // when CORS allows it.
  app.enableCors({
    origin: CORS_ORIGINS,
    credentials: true,
  });
  // Better Auth owns /api/auth/*. Mounted on Express directly, and before
  // listen(), so it runs ahead of Nest's body parser, which would otherwise
  // consume the request body Better Auth needs to read.
  app
    .getHttpAdapter()
    .getInstance()
    .all("/api/auth/*splat", toNodeHandler(auth));
  // Handle SIGTERM: in a container node is PID 1, which ignores it unless a
  // handler exists, so Cloud Run would SIGKILL mid-request after the grace period.
  app.enableShutdownHooks();

  await app.listen(API_PORT);
  Logger.log(`api listening on http://localhost:${API_PORT}`, "Bootstrap");
}

bootstrap();
