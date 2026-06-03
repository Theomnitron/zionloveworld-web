/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 📋 1. THEME OF THE YEAR DATA STRUCTURE
 */
export interface ThemeData {
  imageUrl: string;
  themeTitle: string;
  scriptureReference: string;
}

export const currentThemeData: ThemeData = {
  imageUrl: "https://images.unsplash.com/photo-1544427928-142ec227831e?q=80&w=800",
  themeTitle: "THE YEAR OF HOLINESS AND DIVINE ESTABLISHMENT",
  scriptureReference: "But as He which hath called you is holy, so be ye holy in all manner of conversation. — 1 Peter 1:15"
};

/**
 * 📅 2. UPCOMING EVENTS DATA STRUCTURE
 */
export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  bannerUrl: string;
  description: string;
}

export const upcomingEventsData: UpcomingEvent[] = [
  {
    id: "event-1",
    title: "Apostolic Fire Conference 2026",
    date: "July 12 - July 15, 2026",
    time: "6:00 PM Daily",
    location: "Zion Loveworld Cathedral, Dutse Makaranta, Abuja",
    bannerUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800",
    description: "Releasing spiritual fire, apostolic keys, and ministerial authority for supernatural territorial dominance."
  },
  {
    id: "event-2",
    title: "Prophetic Worship & Breakthrough Night",
    date: "August 28, 2026",
    time: "9:00 PM Till Dawn (Vigil)",
    location: "Zion Loveworld Cathedral, Dutse Makaranta, Abuja",
    bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800",
    description: "Worship at the feet of the King. Expect high-voltage prophetic utterances, miraculous healings, and life covenant breakthroughs."
  }
];

/**
 * ⏰ 3. HIGHLY DETAILED SERVICE SCHEDULE ARRAY
 */
export interface ServiceSchedule {
  id: string;
  day: 'Sunday' | 'Monday' | 'Tuesday' | string;
  title: string;
  description: string;
  time: string;
  badge: string;
}

export const serviceSchedules: ServiceSchedule[] = [
  {
    id: "sched-1",
    day: "Sunday",
    title: "Sunday Celebration Service",
    description: "Apostolic Atmosphere & Prophetic Realignment",
    time: "8:00 AM",
    badge: "Lord's Day"
  },
  {
    id: "sched-2",
    day: "Monday",
    title: "Monday Prayer Meeting",
    description: "Breakthrough Declarations & Spiritual Warfare",
    time: "6:00 PM",
    badge: "Intercession"
  },
  {
    id: "sched-3",
    day: "Tuesday",
    title: "Tuesday Bible Study",
    description: "Systematic Scriptural Exposition & Doctrine",
    time: "6:00 PM",
    badge: "Discipleship"
  }
];
