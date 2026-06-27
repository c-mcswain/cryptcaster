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

  static seedData = MOCK_STORIES.map((s) => ({
    ...s,
    kind:
      s.id === "s8" || s.title.includes("[SUBMISSION]")
        ? s.kind || "story"
        : ("story" as const),
    metadata: s.metadata || {},
    mediaUrl: s.mediaUrl || ""
  }));
}

export class ZineEntity extends IndexedEntity<ZineContent> {
  static readonly entityName = "zine";
  static readonly indexName = "zines";
  static readonly initialState: ZineContent = {
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

  static seedData = [
    {
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
    }
  ];
}

export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
