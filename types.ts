

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  IMAGE_GEN = 'IMAGE_GEN',
  VIDEO_STUDIO = 'VIDEO_STUDIO',
  TEXT_ENGINE = 'TEXT_ENGINE',
  THUMBNAIL_ENGINE = 'THUMBNAIL_ENGINE',
  STORY_STUDIO = 'STORY_STUDIO',
  SKETCH_STUDIO = 'SKETCH_STUDIO',
  CHAT_BOT = 'CHAT_BOT',
  SETTINGS = 'SETTINGS',
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
}

export interface GenerationItem {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'TEXT' | 'THUMBNAIL';
  url: string; // Image URL
  title?: string;
  timestamp: string;
  meta?: string; // e.g., duration, style name
}

export const MOCK_GENERATIONS: GenerationItem[] = [
  {
    id: '1',
    type: 'IMAGE',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMUVC9qSZqXGV3lrEORIY3geWU55ShO38gKE0UDjNem4H3u5iZ9ks-xgtvZLUt2bj5Kn0x2s0QSCGqWFSYCM6YjVoQIIT19bEjibwy4qBTChbmJDHoxFR1P1F-nXbENWyEljEbtFlsZu-4oHlU4s5D-YoKvyVqhUUPUFG9W38g0mSIAxETGfYiaTTLPGyVBnYAfshoX6A22JS9l0U_GpiqAbObMRNHIutGqI6QW7YwT8ghMnGwPYV_2eru_6hH6VZXpLosP1I76_Oa',
    timestamp: '2m ago'
  },
  {
    id: '2',
    type: 'VIDEO',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxYL_1wgzB4A7CUKOM5uYCe6RtQRu752oiJd9BuSornr-1GgoIy7OfrcjSDVYHPX5LBdEZvr27YCd01krovy6dp343tlR8ffJnU-NpR8XQb9YO1X4cqCMwr3Uj0_AvoE0xWNJm39IZATT97wv8qsZmzgXY5RDbtzvBykeGSBiwCDG4jVV0w55eNBBL7BDVHbmtrs4HWx5MOuNO-A3PHXX4m9lckt_njSrZEUOFYnvY3hTUJhPSXpM2KQWaHjgQTNV9A1PxCaqs5lDk',
    title: 'Cyberpunk Streetscape',
    timestamp: '0:15s',
    meta: '15s'
  },
  {
    id: '3',
    type: 'THUMBNAIL',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEpHeiSrrPHbvB2-uuBcgp-foKKgcTrOYuVNZWOXTYk6N3Zd2GPPgMwAnM3h36g3iQ6_ZEVI6vzCY_DXhWQsUns2Tdoj0Y90c6VW7K6j6TY2bs9AaDC7ZPZwMaUectRIiSwothZyI7AAr0qSflM1C4wuko6THJvSvC6unydYDuHCz3YqFPD0QHgtjZnXpCL-yT8BmMYM-s3Pypd-EsvqgmmltjKG-3Si8_LwEFFGBd-tH-1ExCMTNDHMFNQDTHtoAoWXTEA_Cat37B',
    timestamp: '30m ago'
  },
  {
    id: '4',
    type: 'TEXT',
    url: '', // Text items might not have a main image, but we render a card
    title: 'The intersection of human creativity...',
    timestamp: '1h ago',
    meta: 'Text Gen'
  },
  {
    id: '5',
    type: 'IMAGE',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPO75E8QltwiWCU_9zBhNbyytpq30S7dj_ncD889hvbJWpKEw9PmwPfArDc7UWDSy6T6_-n6i5XBy4gJzcHUSy55wZ_68ZY-Wf41MF1vlxZZLH6Bli2HNR7FNEI9JcmF5HQLcr8jaCBtvMmb4KawGXNUu8C2dXt973TKeACv9jY3Lcf1SLN6X0oWD-0fnley5G7MwAeAbsH2x2MeQ0XgMIa2msUcy8PNu3myxH1qVx9Lf04DZPkEBohe9sR_jj_HgaHmG0iRANaxVv',
    timestamp: '2h ago'
  },
  {
    id: '6',
    type: 'VIDEO',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnZ2XAj7F7L6r95sxqCYV64WIdofvv1YjiKKKUBGOhUlJaVXMix4l24TKjK9CxhQynwGFyMHJPIJYoh6Y7d-nnLuFg915We6hRpy7yeDYivVbc1tdMJhTo0JfYWpDJIqign0WKCFo0H6mkHj1k94JcMR8RwfuAGjdv1Bn3839sZfeASz2jivDsuLSUghxaF-5NBvhRpM0F7Z0uZv9363906RQg4iTVQk0vq8R9T55Ceb3TgU3TSAekvvyd6K1zJnwoSj-rncgFbnNB',
    title: 'Orbital Render',
    timestamp: '3h ago',
    meta: 'Orbital Render'
  },
];