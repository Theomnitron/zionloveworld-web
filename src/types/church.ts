/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ChurchView = 'home' | 'sermons' | 'gallery';

export interface NavItem {
  id: string;
  label: string;
  view: ChurchView;
  anchor?: string; // For linking to specific sections on home (e.g. 'who-we-are', 'contact-us', 'giving')
}

export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  duration: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnailUrl: string;
  description: string;
   scripture: string;
  category: 'Sunday Service' | 'Midweek Service' | 'Special Service' | 'Conference';
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  date: string;
  category: 'Service' | 'Outreach' | 'Youth' | 'Worship' | 'Community';
}

export interface ChurchInfo {
  name: string;
  vision: string;
  mission: string;
  pastorName: string;
  phone: string;
  email: string;
  address: string;
  serviceTimes: { day: string; time: string; type: string }[];
}
