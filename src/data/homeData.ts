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
  imageUrl: "https://zdpkrcvdtrcvvwqmtuwm.supabase.co/storage/v1/object/public/others/Prophetic%20Declaration%20for%202026.png",
  themeTitle: "AS WE BEHOLD HIM, WE ARE CHANGED FROM GLORY TO GLORY",
  scriptureReference: "But we all, with open face beholding as in a glass the glory of the Lord, are changed into the same image from glory to glory, even as by the Spirit of the Lord. — 2 Cor. 3:18"
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
  // {
  //   id: "event-1",
  //   title: "Apostolic Fire Conference 2026",
  //   date: "July 12 - July 15, 2026",
  //   time: "6:00 PM Daily",
  //   location: "Zion Loveworld Cathedral, Dutse Makaranta, Abuja",
  //   bannerUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800",
  //   description: "Releasing spiritual fire, apostolic keys, and ministerial authority for supernatural territorial dominance."
  // },
  // {
  //   id: "event-2",
  //   title: "Prophetic Worship & Breakthrough Night",
  //   date: "August 28, 2026",
  //   time: "9:00 PM Till Dawn (Vigil)",
  //   location: "Zion Loveworld Cathedral, Dutse Makaranta, Abuja",
  //   bannerUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800",
  //   description: "Worship at the feet of the King. Expect high-voltage prophetic utterances, miraculous healings, and life covenant breakthroughs."
  // }
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
    description: "Fellowshipping in One Accord",
    time: "8:00 AM",
    badge: "Lord's Day"
  },
  {
    id: "sched-2",
    day: "Monday",
    title: "Monday Prayer Meeting",
    description: "Prayers of Supplication and Personal Life",
    time: "6:00 PM",
    badge: "Intercession"
  },
  {
    id: "sched-3",
    day: "Tuesday",
    title: "Tuesday Bible Study",
    description: "Systematic Scriptural Exposition for Understanding",
    time: "6:00 PM",
    badge: "Word Study"
  }
];
