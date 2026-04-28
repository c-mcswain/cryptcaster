import { IndexedEntity } from "./core-utils";
import type { Story, User, Chat, ChatMessage } from "@shared/types";
import { MOCK_STORIES, MOCK_USERS } from "@shared/mock-data";
export class StoryEntity extends IndexedEntity<Story> {
  static readonly entityName = "story";
  static readonly indexName = "stories";
  static readonly initialState: Story = {
    id: "",
    title: "",
    source: "",
    content: "",
    isRecorded: false,
    createdAt: 0,
    kind: "story",
    mediaUrl: "",
    metadata: {}
  };
  static seedData = MOCK_STORIES.map(s => ({ ...s, kind: 'story' as const, metadata: {}, mediaUrl: "" }));
}
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}