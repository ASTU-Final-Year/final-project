// backend/routes/api/v1/client/upload/index.ts
import {
  authenticate,
  json,
  parseCookie,
  parseUploadStreaming,
  type CTXAuth,
  type CTXBody,
  type CTXCookie,
  type CTXUpload,
  type RouterHandlers,
} from "@bepalo/router";
import { parseAuth, parseSession, type CTXSession } from "~/middleware";
import { db } from "~/db";
import { tables } from "~/db/schema";
import { and, eq } from "drizzle-orm";
import { HttpError } from "~/lib/bepalo-query-utils";

// Allowed file types based on requirement config
const ALLOWED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "text/plain": [".txt"],
};

export default {
  PUT: {
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (req, ctx) => {
        const url = new URL(req.url);
        const taskId = url.searchParams.get("taskId");
        const requirementId = url.searchParams.get("requirementId");

        if (!taskId || !requirementId) {
          return json(
            { error: "taskId and requirementId are required" },
            { status: 400 },
          );
        }

        // Fetch task and validate
        const [task] = await db
          .select({
            id: tables.task.id,
            status: tables.task.status,
            isDone: tables.task.isDone,
            requirements: tables.task.requirements,
            submissions: tables.task.submissions,
            appointmentId: tables.task.appointmentId,
          })
          .from(tables.task)
          .where(eq(tables.task.id, taskId));

        if (!task) {
          return json({ error: "Task not found" }, { status: 404 });
        }

        // Check if task belongs to the current user
        const [appointment] = await db
          .select({ clientId: tables.appointment.clientId })
          .from(tables.appointment)
          .where(eq(tables.appointment.id, task.appointmentId));

        if (!appointment || appointment.clientId !== ctx.session.userId) {
          return json({ error: "Unauthorized" }, { status: 403 });
        }

        // Check if task is already completed
        if (task.isDone || task.status === "completed") {
          return json({ error: "Task already completed" }, { status: 400 });
        }

        // Validate requirement exists
        const requirement = task.requirements?.form?.[requirementId];
        if (!requirement) {
          return json({ error: "Requirement not found" }, { status: 404 });
        }

        // Validate requirement type is file
        if (requirement.type !== "file") {
          return json(
            { error: "Requirement is not a file type" },
            { status: 400 },
          );
        }

        ctx.data = { task, requirement, requirementId };

        // Parse file upload
        let uploadedFile: { filename: string; path: string } | null = null;
        let fileWriter: Bun.FileSink | null = null;

        return await parseUploadStreaming({
          maxFileSize: requirement.maxSize || 5 * 1024 * 1024, // Default 5MB
          maxTotalSize: (requirement.maxSize || 5 * 1024 * 1024) + 1024,
          maxFields: 1,
          maxFiles: 1,
          allowedTypes: requirement.accept || [
            "image/jpeg",
            "image/png",
            "application/pdf",
          ],
          async onFileStart(uploadId, fieldName, fileName, contentType) {
            // Validate content type
            if (
              requirement.accept &&
              !requirement.accept.includes(contentType)
            ) {
              throw new HttpError(
                `Invalid file type. Accepted: ${requirement.accept.join(", ")}`,
                400,
              );
            }

            const ext = fileName.substring(fileName.lastIndexOf("."));
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(7);
            const customFilename = `${ctx.session.userId}_${taskId}_${requirementId}_${timestamp}_${randomStr}${ext}`;
            const path = `../uploads/task-submissions/${customFilename}`;

            const file = Bun.file(path);
            uploadedFile = { filename: customFilename, path };
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
            if (fileWriter) {
              fileWriter.write(chunk);
            }
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
          async onFileError(uploadId, fieldName, fileName, error) {
            console.error("File upload error:", error);
            throw new HttpError("File upload failed", 500);
          },
        })(req, ctx);
      },
      async (req, ctx) => {
        const { task, requirementId } = ctx.data as any;
        const { files } = ctx;
        const uploadedFile = files?.get("file");

        if (!uploadedFile || !uploadedFile.customFilename) {
          return json({ error: "No file uploaded" }, { status: 400 });
        }

        // Get existing submissions
        const existingSubmissions = task.submissions || {};
        const existingUploadedFiles = existingSubmissions.uploadedFiles || {};

        // Update the task with the file reference
        const updatedSubmissions = {
          ...existingSubmissions,
          uploadedFiles: {
            ...existingUploadedFiles,
            [requirementId]: {
              filename: uploadedFile.customFilename,
              uploadedAt: new Date().toISOString(),
              fileSize: uploadedFile.size,
              fileType: uploadedFile.type,
            },
          },
          [requirementId]: {
            fileName: uploadedFile.customFilename,
            uploadedAt: new Date().toISOString(),
          },
        };

        const [updatedTask] = await db
          .update(tables.task)
          .set({
            submissions: updatedSubmissions,
            updatedAt: new Date(),
          })
          .where(eq(tables.task.id, task.id))
          .returning({ submissions: tables.task.submissions });

        return json({
          success: true,
          message: "File uploaded successfully",
          file: {
            filename: uploadedFile.customFilename,
            size: uploadedFile.size,
            type: uploadedFile.type,
          },
          submissions: updatedTask?.submissions,
        });
      },
    ],
  },

  GET: {
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (req, ctx) => {
        const url = new URL(req.url);
        const taskId = url.searchParams.get("taskId");
        const requirementId = url.searchParams.get("requirementId");
        const filename = url.searchParams.get("filename");

        if (!taskId || !requirementId || !filename) {
          return json(
            { error: "taskId, requirementId, and filename are required" },
            { status: 400 },
          );
        }

        // Fetch task and validate
        const [task] = await db
          .select({
            id: tables.task.id,
            submissions: tables.task.submissions,
            appointmentId: tables.task.appointmentId,
          })
          .from(tables.task)
          .where(eq(tables.task.id, taskId));

        if (!task) {
          return json({ error: "Task not found" }, { status: 404 });
        }

        // Check authorization
        const [appointment] = await db
          .select({ clientId: tables.appointment.clientId })
          .from(tables.appointment)
          .where(eq(tables.appointment.id, task.appointmentId));

        if (!appointment || appointment.clientId !== ctx.session.userId) {
          // Also allow employees to view uploaded files
          const [employee] = await db
            .select({ id: tables.employee.id })
            .from(tables.employee)
            .where(eq(tables.employee.userId, ctx.session.userId));

          if (!employee) {
            return json({ error: "Unauthorized" }, { status: 403 });
          }
        }

        // Verify the file exists in submissions
        const uploadedFile =
          task.submissions && task.submissions[requirementId];
        if (!uploadedFile || uploadedFile.filename !== filename) {
          return json({ error: "File not found" }, { status: 404 });
        }

        // Serve the file
        const filePath = `../uploads/task-submissions/${filename}`;
        const file = Bun.file(filePath);

        if (!(await file.exists())) {
          return json({ error: "File not found on server" }, { status: 404 });
        }

        return new Response(file, {
          headers: {
            "Content-Type": uploadedFile.fileType || "application/octet-stream",
            "Content-Disposition": `inline; filename="${filename}"`,
          },
        });
      },
    ],
  },

  DELETE: {
    FILTER: [parseCookie(), authenticate({ parseAuth }), parseSession()],
    HANDLER: [
      async (req, ctx) => {
        const url = new URL(req.url);
        const taskId = url.searchParams.get("taskId");
        const requirementId = url.searchParams.get("requirementId");

        if (!taskId || !requirementId) {
          return json(
            { error: "taskId and requirementId are required" },
            { status: 400 },
          );
        }

        // Fetch task and validate
        const [task] = await db
          .select({
            id: tables.task.id,
            status: tables.task.status,
            isDone: tables.task.isDone,
            submissions: tables.task.submissions,
            appointmentId: tables.task.appointmentId,
          })
          .from(tables.task)
          .where(eq(tables.task.id, taskId));

        if (!task) {
          return json({ error: "Task not found" }, { status: 404 });
        }

        // Check authorization
        const [appointment] = await db
          .select({ clientId: tables.appointment.clientId })
          .from(tables.appointment)
          .where(eq(tables.appointment.id, task.appointmentId));

        if (!appointment || appointment.clientId !== ctx.session.userId) {
          return json({ error: "Unauthorized" }, { status: 403 });
        }

        if (task.isDone || task.status === "completed") {
          return json({ error: "Task already completed" }, { status: 400 });
        }

        // Get the file to delete
        const uploadedFile = task.submissions?.uploadedFiles?.[requirementId];
        if (uploadedFile) {
          const filePath = `../uploads/task-submissions/${uploadedFile.filename}`;
          const file = Bun.file(filePath);
          await file.delete();
        }

        // Remove file reference from submissions
        const updatedSubmissions = { ...task.submissions };
        delete updatedSubmissions.uploadedFiles?.[requirementId];
        delete updatedSubmissions[requirementId];

        await db
          .update(tables.task)
          .set({
            submissions: updatedSubmissions,
            updatedAt: new Date(),
          })
          .where(eq(tables.task.id, task.id));

        return json({
          success: true,
          message: "File deleted successfully",
        });
      },
    ],
  },
} satisfies RouterHandlers<
  CTXSession & CTXAuth & CTXCookie & CTXBody,
  {
    PUT: CTXUpload;
  }
>;
