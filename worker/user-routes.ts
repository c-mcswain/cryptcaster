import { Hono } from "hono";
import type { Env } from './core-utils';
import { StoryEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // STORIES
  app.get('/api/stories', async (c) => {
    await StoryEntity.ensureSeed(c.env);
    const page = await StoryEntity.list(c.env, c.req.query('cursor') ?? null, 100);
    return ok(c, page);
  });
  app.get('/api/stories/:id', async (c) => {
    const story = new StoryEntity(c.env, c.req.param('id'));
    if (!await story.exists()) return notFound(c, 'Story not found');
    return ok(c, await story.getState());
  });
  app.post('/api/stories', async (c) => {
    const body = await c.req.json();
    if (!body.title || !body.content) return bad(c, 'Title and Content required');
    const kind = body.kind || 'story';
    const metadata = body.metadata || {};
    const newStory = {
      id: crypto.randomUUID(),
      title: body.title,
      source: body.source || 'Anonymous Submission',
      content: body.content,
      isRecorded: false,
      createdAt: Date.now(),
      kind: kind,
      mediaUrl: body.mediaUrl || "",
      metadata: metadata
    };
    await StoryEntity.create(c.env, newStory);
    return ok(c, newStory);
  });
  // PUBLIC SUBMISSION ENDPOINT
  app.post('/api/submit', async (c) => {
    const body = await c.req.json();
    if (!body.subject || !body.content) return bad(c, 'Subject and content required');
    console.log('[SUBMISSION LOG] Intent to notify creepqueen@morallygrim.com');
    const ticketId = `SUB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newSubmission = {
      id: crypto.randomUUID(),
      title: `[SUBMISSION] ${body.subject}`,
      source: body.name || 'Unknown Listener',
      content: body.content,
      isRecorded: false,
      createdAt: Date.now(),
      kind: 'submission' as const,
      mediaUrl: body.mediaUrl || "",
      metadata: {
        senderEmail: body.email,
        subject: body.subject,
        ticketId: ticketId,
        submitterName: body.name
      }
    };
    await StoryEntity.create(c.env, newSubmission);
    return ok(c, newSubmission);
  });
  app.patch('/api/stories/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const inst = new StoryEntity(c.env, id);
    if (!await inst.exists()) return notFound(c, 'Story not found');
    await inst.patch(body);
    return ok(c, await inst.getState());
  });
  app.delete('/api/stories/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await StoryEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
}