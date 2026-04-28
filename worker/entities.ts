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
  static seedData = MOCK_STORIES.map(s => ({
    ...s,
    kind: (s.id === 's8' || s.title.includes('[SUBMISSION]')) ? s.kind || 'story' : 'story' as const,
    metadata: s.metadata || {},
    mediaUrl: s.mediaUrl || ""
  }));
}
export class ZineEntity extends IndexedEntity<ZineContent> {
  static readonly entityName = "zine";
  static readonly indexName = "zines";
  static readonly initialState: ZineContent = {
    id: "singleton",
    intro: "The sweet scent of forbidden orchards drifts through the terminal tonight, carrying the weight of a thousand unread screams. The Midnight Zine has returned to chronicle the morally grim. Stay vigilant.",
    announcements: [
      "The Shadow Market: Now accepting crypt currency",
      "(Un)Alive Reading: Time, Date, and Realm TBD",
      "Submit your chronicles or be forgotten",
      "Vampire Facial Giveaway: Win a pint of O-Negative"
    ],
    featuredStoryId: 's8',
    coverImageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    lastUpdated: Date.now(),
    editorName: "CreepQueen",
    advertisement: "O-NEGATIVE ENERGY DRINK - IT’S IN YOUR BLOOD. LITERALLY. USE CODE 'VOID' FOR 10% OFF YOUR NEXT INFUSION."
  };
  static seedData = [
    {
      id: "singleton",
      intro: "The sweet scent of forbidden orchards drifts through the terminal tonight, carrying the weight of a thousand unread screams. The Midnight Zine has returned to chronicle the morally grim. Stay vigilant.",
      announcements: [
        "The Shadow Market: Now accepting crypt currency",
        "(Un)Alive Reading: Time, Date, and Realm TBD",
        "Submit your chronicles or be forgotten",
        "Vampire Facial Giveaway: Win a pint of O-Negative"
      ],
      featuredStoryId: "s8",
      coverImageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      lastUpdated: Date.now(),
      editorName: "CreepQueen",
      advertisement: "O-NEGATIVE ENERGY DRINK - IT’S IN YOUR BLOOD. LITERALLY. USE CODE 'VOID' FOR 10% OFF YOUR NEXT INFUSION."
    }
  ];
}
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}