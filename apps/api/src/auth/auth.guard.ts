import type { IncomingMessage } from "node:http";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth";

export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

export type AuthedRequest = IncomingMessage & {
  user: AuthSession["user"];
  session: AuthSession["session"];
};

/**
 * `@UseGuards(AuthGuard)` on a controller or route: 401 without a valid
 * session cookie, otherwise `req.user` and `req.session` are set.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const result = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!result) {
      throw new UnauthorizedException();
    }

    req.user = result.user;
    req.session = result.session;
    return true;
  }
}
