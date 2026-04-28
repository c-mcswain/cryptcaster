import type { Story, User, Chat, ChatMessage } from './types';
export const MOCK_STORIES: Story[] = [
  {
    id: 's1',
    title: 'The Static Between Stations',
    source: 'Listener Email: Greg V.',
    content: 'I was driving through the Mojave at 3 AM when the radio started picking up a voice. It wasn’t a DJ. It sounded like my own voice, describing exactly what I was doing in real-time...',
    isRecorded: false,
    createdAt: Date.now() - 86400000
  },
  {
    id: 's2',
    title: 'Shadow in the Server Room',
    source: 'IT Forum Post',
    content: 'We found a legacy server that hadn’t been touched since 1996. When we plugged a monitor in, the terminal was just scrolling one name over and over. My name.',
    isRecorded: true,
    createdAt: Date.now() - 172800000
  },
  {
    id: 's3',
    title: 'The Attic Doll',
    source: 'Reddit: r/NoSleep',
    content: 'My daughter found an old Victorian doll in the attic. The weird part is, every morning we find it sitting at the breakfast table. We don’t have an attic.',
    isRecorded: false,
    createdAt: Date.now() - 345600000
  }
];
export const MOCK_USERS: User[] = [{ id: 'u1', name: 'CryptMaster' }];
export const MOCK_CHATS: Chat[] = [{ id: 'c1', title: 'Crypt Talk' }];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [];