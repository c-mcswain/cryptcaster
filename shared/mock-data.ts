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
  },
  {
    id: 's4',
    title: 'The Whispering Terminal',
    source: 'Anonymous Dev Leak',
    content: 'I left my IDE open overnight. When I came back, the git diff showed 4,000 lines of code I didn’t write. It wasn’t logic—it was a series of coordinates followed by the phrase "HE IS BREATHING" repeated in hex code.',
    isRecorded: false,
    createdAt: Date.now() - 50000000
  },
  {
    id: 's5',
    title: 'The 404 Signal',
    source: 'Field Report: Agent X',
    content: 'There is a 3-mile radius in the Pacific Northwest where no digital signal escapes. If you bring an analog radio, it plays the sound of crashing waves, even when you’re miles from the coast. Some listeners claim to hear a lighthouse bell ringing in the background.',
    isRecorded: false,
    createdAt: Date.now() - 120000000
  },
  {
    id: 's6',
    title: 'Echoes in the Server Rack',
    source: 'Facility Log #66',
    content: 'The temperature in Rack 7 always drops to exactly -4 degrees Celsius at midnight, regardless of the cooling system settings. Yesterday, we found frosted handprints on the inside of the glass casing. The server has no internal fans.',
    isRecorded: true,
    createdAt: Date.now() - 250000000
  },
  {
    id: 's7',
    title: 'The Glitch in the Grave',
    source: 'Grim Investigative Dept.',
    content: 'Our recent investigation into "Smart Cemeteries" has uncovered a disturbing trend. The QR codes etched onto modern tombstones, intended to show digital memorials of the deceased, have begun to malfunction. Visitors report that scanning the codes no longer redirects to a biography, but instead opens a live, high-definition feed of their own front door. Even more unsettling, many report seeing a figure standing in the reflection of their screen—a figure that isn’t there when they turn around.',
    isRecorded: false,
    createdAt: Date.now() - 100000
  },
  {
    id: 's8',
    title: 'ILLEGAL “NECKTARINE” STAND SHUT DOWN BY GRIM ENFORCEMENT',
    source: 'Sunnyvale Gazette (Midnight Edition)',
    content: 'Midnight Enforcement agents raided a roadside produce stand late Tuesday following reports of “audible fruit distress.” The vendor, a local woman known only as “Nanna,” was selling what she termed “Necktarines”—a stone fruit that appears to have a pulsating jugular vein. Witnesses claim that when sliced, the fruit emits a low-frequency hum and tastes of “sweet iron and forgotten promises.” One consumer reported hearing a murder of crows every time they closed their eyes for forty-eight hours after ingestion. Nanna remains at large; the fruit has been confiscated for deep-crypt analysis. DO NOT CONSUME. IF YOU HEAR THE HUM, FLEE.',
    isRecorded: false,
    createdAt: Date.now()
  }
];
export const MOCK_USERS: User[] = [{ id: 'u1', name: 'CreepQueen' }];
export const MOCK_CHATS: Chat[] = [{ id: 'c1', title: 'Crypt Talk' }];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [];