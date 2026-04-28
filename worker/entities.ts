import { IndexedEntity } from "./core-utils";
import type { Story, User, ZineContent } from "@shared/types";
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
export class ZineEntity extends IndexedEntity<ZineContent> {
  static readonly entityName = "zine";
  static readonly indexName = "zines";
  static readonly initialState: ZineContent = {
    id: "singleton",
    intro: "Welcome to the first edition of the Midnight Zine. The shadows are long tonight...",
    announcements: ["New broadcast incoming Friday", "The crypt is now open for public submissions"],
    featuredStoryId: null,
    coverImageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop",
    lastUpdated: Date.now(),
    editorName: "CreepQueen"
  };
  static seedData = [
    {
      id: "singleton",
      intro: "Shadows whisper across the terminal, carrying the weight of a thousand unread screams. The Midnight Zine has returned to chronicle the morally grim. Stay vigilant.",
      announcements: [
        "The Shadow Market: Merch drop at midnight",
        "Live Reading: The Mojave Static - Friday",
        "Submit your chronicles or be forgotten"
      ],
      featuredStoryId: "s4",
      coverImageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1000&auto=format&fit=crop",
      lastUpdated: Date.now(),
      editorName: "CreepQueen"
    }
  ];
}
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}