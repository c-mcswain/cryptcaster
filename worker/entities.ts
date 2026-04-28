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
    createdAt: 0
  };
  static seedData = MOCK_STORIES;
}
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}