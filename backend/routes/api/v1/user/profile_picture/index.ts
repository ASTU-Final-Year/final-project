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
import user from "..";
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
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      (req, { session }) => {
        const { user } = session;
        const profilePicture =
          (user.profile?.picture &&
            Bun.file(`../uploads/profile-pictures/${user.profile.picture}`)) ||
          placeholderImages[user.gender] ||
          placeholderImages["U"];
        return blob(profilePicture);
      },
    ],
  },
  PUT: {
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (req, ctx) => {
        const { session } = ctx;
        let file: Bun.BunFile;
        let fileWriter: Bun.FileSink;

        const { user } = session;
        const picture = session.user.profile?.picture;
        if (picture) {
          const picturePath = `../uploads/profile-pictures/${picture}`;
          const profilePicture = Bun.file(picturePath);
          profilePicture.delete();
        }
        return parseUploadStreaming({
          allowedTypes: ["image/jpeg", "image/png"],
          maxFileSize: 2 * 1024 * 1024,
          maxTotalSize: 2 * 1024 * 1024 + 1024,
          maxFields: 1,
          maxFiles: 1,
          async onFileStart(uploadId, fieldName, fileName, contentType) {
            const ext = fileName.substring(fileName.lastIndexOf("."));
            const customFilename = session.userId + ext;
            const path = "../uploads/profile-pictures/" + customFilename;
            file = Bun.file(path);
            ctx.file = file;
            fileWriter = file.writer();
            return {
              customFilename,
              path,
            };
          },
          async onFileChunk(
            uploadId,
            fieldName,
            fileName,
            chunk,
            offset,
            isLast,
          ) {
            const chunkSize = chunk.byteLength;
            fileWriter.write(chunk);
          },
          async onFileComplete(
            uploadId,
            fieldName,
            fileName,
            fileSize,
            customFilename,
            metadata,
          ) {
            if (fileWriter) {
              fileWriter.end();
            }
          },
        })(req, ctx);
      },
      async (req, { session, files }) => {
        const { user } = session;
        const picture = files.get("profile")?.customFilename;
        // const picturePath = `../uploads/profile-pictures/${picture}`;
        // const profilePicture = Bun.file(picturePath);
        // return blob(profilePicture);
        // console.log(files, file);
        const r = await db
          .update(tables.user)
          .set({
            profile: { ...user.profile, picture },
          })
          .where(eq(tables.user.id, user.id))
          .returning({ profile: tables.user.profile });
        return json({
          count: r.length,
          profile_picture: r,
        });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXSession & CTXAuth & CTXCookie & CTXBody,
  {
    PUT: CTXUpload & { file: Bun.File };
  }
>;
