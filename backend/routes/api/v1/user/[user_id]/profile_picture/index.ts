import {
  authenticate,
  blob,
  json,
  parseCookie,
  parseUploadStreaming,
  Status,
  status,
  type CTXAuth,
  type CTXBody,
  type CTXCookie,
  type CTXUpload,
  type RouterHandlers,
} from "@bepalo/router";
import { parseAuth, parseSession } from "~/middleware";
import user from "../..";
import { db } from "~/db";
import { tables } from "~/db/schema";
import { eq } from "drizzle-orm";

const placeholderImages = {
  M: Bun.file("../public/images/male-profile.png"),
  F: Bun.file("../public/images/female-profile.png"),
  U: Bun.file("../public/images/male-profile.png"),
};

export default {
  GET: {
    // FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (req, { params, session }) => {
        const { user_id } = params;
        const users = await db
          .select({ gender: tables.user.gender, profile: tables.user.profile })
          .from(tables.user)
          .where(eq(tables.user.id, user_id));
        if (!users || users.length === 0) {
          return json(
            { error: "User not found" },
            { status: Status._404_NotFound },
          );
        }
        const [user] = users;
        const profilePicture =
          (user.profile?.picture &&
            Bun.file(`../uploads/profile-pictures/${user.profile.picture}`)) ||
          placeholderImages[user.gender] ||
          placeholderImages["U"];
        return blob(profilePicture);
      },
    ],
  },
} satisfies RouterHandlers;
