import type { Story, User, Chat, ChatMessage } from './types';
export const MOCK_STORIES: Story[] = [
  {
    id: 's1',
    title: 'The Static Between Stations',
    source: 'Listener Email: Greg V.',
    content: 'I was driving through the Mojave at 3 AM when the radio started picking up a voice. It wasn’t a DJ. It sounded like my own voice, describing exactly what I was doing in real-time...\n\nEvery turn I made, every sip of lukewarm coffee I took, the voice narrated with terrifying precision. Then, it started narrating things I hadn’t done yet.',
    isRecorded: false,
    createdAt: Date.now() - 86400000
  },
  {
    id: 's2',
    title: 'Shadow in the Server Room',
    source: 'IT Forum Post',
    content: 'We found a legacy server that hadn’t been touched since 1996. When we plugged a monitor in, the terminal was just scrolling one name over and over. My name.\n\nThe hardware was cold—not just powered-off cold, but absolute zero cold. We pulled the plug, but the scrolling didn’t stop.',
    isRecorded: true,
    createdAt: Date.now() - 172800000
  },
  {
    id: 's3',
    title: 'The Attic Doll',
    source: 'Reddit: r/NoSleep',
    content: 'My daughter found an old Victorian doll in the attic. The weird part is, every morning we find it sitting at the breakfast table. We don’t have an attic.\n\nYesterday, it was holding a knife. Today, it was holding my car keys.',
    isRecorded: false,
    createdAt: Date.now() - 345600000
  },
  {
    id: 's8',
    title: 'ILLEGAL “NECKTARINE” STAND SHUT DOWN BY GRIM ENFORCEMENT',
    source: 'Sunnyvale Gazette (Midnight Edition)',
    content: 'Midnight Enforcement agents raided a roadside produce stand late Tuesday following reports of “audible fruit distress.” The vendor, a local woman known only as “Nanna,” was selling what she termed “Necktarines”—a stone fruit that appears to have a pulsating jugular vein.\n\nWitnesses claim that when sliced, the fruit emits a low-frequency hum and tastes of “sweet iron and forgotten promises.” One consumer reported hearing a murder of crows every time they closed their eyes for forty-eight hours after ingestion.\n\nNanna remains at large; the fruit has been confiscated for deep-crypt analysis. The authorities warned that the pits of these fruits, if planted, do not grow trees, but rather “organic transmission towers.”\n\nDO NOT CONSUME. IF YOU HEAR THE HUM, FLEE.',
    isRecorded: false,
    createdAt: Date.now(),
    kind: 'story'
  }
];
export const MOCK_USERS: User[] = [{ id: 'u1', name: 'CreepQueen' }];
export const MOCK_CHATS: Chat[] = [{ id: 'c1', title: 'Crypt Talk' }];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [];