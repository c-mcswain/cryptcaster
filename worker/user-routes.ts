import { Hono } from "hono";
import type { Env } from "./core-utils";
import { StoryEntity, ZineEntity } from "./entities";
import { ok, bad, notFound } from "./core-utils";
import type { ZineContent } from "@shared/types";

const CURRENT_ZINE: ZineContent = {
  id: "singleton",
  intro:
    "Another evening, another inbox full of ghoulish complaints from humans who insist they are probably not haunted, which is exactly what haunted people say. The Cryptcaster terminal is open, the void is behaving poorly, and I remain deeply invested in the wellbeing of mortals for completely normal and not at all suspicious reasons.",
  announcements: [
    "The Cryptcaster inbox is accepting spooky complaints, haunted gossip, and suspiciously specific human problems.",
    "The current issue is being assembled by candlelight, static, and questionable judgment.",
    "Phantom friends are encouraged to submit chronicles before the void gets bored."
  ],
  featuredStoryId: "",
  coverImageUrl:
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  lastUpdated: Date.now(),
  editorName: "Vamp Von Vixen",
  advertisement:
    "O-NEGATIVE ENERGY DRINK — IT'S IN YOUR BLOOD. LITERALLY. USE CODE 'VOID' FOR 10% OFF YOUR NEXT INFUSION."
};

function isStaleDefaultZine(zine: ZineContent | null | undefined) {
  if (!zine) return true;

  return (
    zine.featuredStoryId === "s8" ||
    zine.editorName === "CreepQueen" ||
    zine.intro?.includes("forbidden orchards") ||
    zine.announcements?.some((announcement) =>
      announcement.includes("The Shadow Market")
    )
  );
}

export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // AUTH
  app.post("/api/auth/login", async (c) => {
    const { username, password } = await c.req.json();

    if (username === "creepqueenadmin" && password === "6642") {
      return ok(c, {
        token: "grim-token-" + Math.random().toString(36).substring(7),
        user: { id: "u1", name: "CreepQueen" }
      });
    }

    return bad(c, "Invalid credentials");
  });

  // ZINE
  app.get("/api/zine", async (c) => {
    await ZineEntity.ensureSeed(c.env);

    const zine = new ZineEntity(c.env, "singleton");
    const savedZine = await zine.getState();

    if (isStaleDefaultZine(savedZine)) {
      await zine.patch({
        ...CURRENT_ZINE,
        lastUpdated: Date.now()
      });

      return ok(c, await zine.getState());
    }

    return ok(c, savedZine);
  });

  app.put("/api/zine", async (c) => {
    const body = await c.req.json();
    const zine = new ZineEntity(c.env, "singleton");

    await zine.patch({
      ...body,
      lastUpdated: Date.now()
    });

    return ok(c, await zine.getState());
  });

  // STORIES
  app.get("/api/stories", async (c) => {
    await StoryEntity.ensureSeed(c.env);

    const page = await StoryEntity.list(
      c.env,
      c.req.query("cursor") ?? null,
      100
    );

    return ok(c, page);
  });

  app.get("/api/stories/:id", async (c) => {
    const story = new StoryEntity(c.env, c.req.param("id"));

    if (!(await story.exists())) {
      return notFound(c, "Story not found");
    }

    return ok(c, await story.getState());
  });

  app.post("/api/stories", async (c) => {
    const body = await c.req.json();

    if (!body.title || !body.content) {
      return bad(c, "Title and Content required");
    }

    const kind = body.kind || "story";
    const metadata = body.metadata || {};

    const newStory = {
      id: crypto.randomUUID(),
      title: body.title,
      source: body.source || "Anonymous Submission",
      content: body.content,
      isRecorded: false,
      createdAt: Date.now(),
      kind,
      mediaUrl: body.mediaUrl || "",
      metadata
    };

    await StoryEntity.create(c.env, newStory);

    return ok(c, newStory);
  });

  // PUBLIC SUBMISSION ENDPOINT
  app.post("/api/submit", async (c) => {
    const body = await c.req.json();

    if (!body.subject || !body.content) {
      return bad(c, "Subject and content required");
    }

    const ticketId = `SUB-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const newSubmission = {
      id: crypto.randomUUID(),
      title: `[SUBMISSION] ${body.subject}`,
      source: body.name || "Unknown Listener",
      content: body.content,
      isRecorded: false,
      createdAt: Date.now(),
      kind: "submission" as const,
      mediaUrl: body.mediaUrl || "",
      metadata: {
        senderEmail: body.email,
        subject: body.subject,
        ticketId,
        submitterName: body.name
      }
    };

    await StoryEntity.create(c.env, newSubmission);

    return ok(c, newSubmission);
  });

  app.patch("/api/stories/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const inst = new StoryEntity(c.env, id);

    if (!(await inst.exists())) {
      return notFound(c, "Story not found");
    }

    await inst.patch(body);

    return ok(c, await inst.getState());
  });

  app.delete("/api/stories/:id", async (c) => {
    const id = c.req.param("id");
    const deleted = await StoryEntity.delete(c.env, id);

    return ok(c, { id, deleted });
  });
}
