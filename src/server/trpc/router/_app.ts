import { router } from "../trpc";
import { protectedRouter } from "./protected";
import { authRouter } from "./auth";
import { profileRouter } from "./profile";
import { guideRouter } from "./guides";
import { userWineryRoutes } from "./userWinery";
import { wineriesRouter } from "./wineries";
import { userToursRoutes } from "./userTours";

export const appRouter = router({
  protected: protectedRouter,
  auth: authRouter,
  profile: profileRouter,
  guides: guideRouter,
  userWinery: userWineryRoutes,
  wineries: wineriesRouter,
  userTours: userToursRoutes
});

// export type definition of API
export type AppRouter = typeof appRouter;
