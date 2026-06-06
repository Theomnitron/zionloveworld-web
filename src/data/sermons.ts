/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  category: 'Sunday Service' | 'Bible Study' | 'Apostolic Conference' | string;
  audioUrl: string;
  fileSize: string;
  scriptures: string[];
  description: string;
}

export const SERMONS: Sermon[] = [
  // {
  //   id: "sermon-1",
  //   title: "THE UNSTOPPABLE FORCE OF HOLINESS",
  //   speaker: "Apostle Zion Loveworld",
  //   date: "June 01, 2026",
  //   category: "Sunday Encounter",
  //   audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  //   fileSize: "42.5 MB",
  //   scriptures: ["Hebrews 12:14", "Romans 6:22", "1 Thessalonians 4:7"],
  //   description: "Dive deep into understanding why holiness is not an optional suggestion, but our primary spiritual atmosphere and mandate for triumph in these times. Apostle Zion Loveworld breaks down scriptural keys for activating divine power, maintaining pristine covenant integrity, and dominating in the assignments God has called you to."
  // },
  // {
  //   id: "sermon-2",
  //   title: "THE ACADEMY OF DESTINY SEED",
  //   speaker: "Pastor Grace Adeleke",
  //   date: "May 27, 2026",
  //   category: "Midweek Academy",
  //   audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  //   fileSize: "32.1 MB",
  //   scriptures: ["Genesis 12:1-3", "Galatians 3:29", "Deuteronomy 28:1-2"],
  //   description: "A comprehensive midweek masterclass on unlocking your kingdom inheritance and aligning your career, business, and family with prophetic blueprints. Learn the practical laws of divine governance, spiritual stewardship, and the mechanics of planting seeds that dominate generational structures."
  // },
  // {
  //   id: "sermon-3",
  //   title: "CONQUERING TERRITORIES BY APOSTOLIC UNCTION",
  //   speaker: "Apostle Zion Loveworld",
  //   date: "May 24, 2026",
  //   category: "Apostolic Conference",
  //   audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  //   fileSize: "54.8 MB",
  //   scriptures: ["Joshua 1:3-9", "Ephesians 6:10-18", "1 John 5:4"],
  //   description: "An intense prophetic activation recorded live from our global gathering. Unpack how to dominate economic and social systems, level ancestral barriers, dismantle strongholds, and expand corporate covenant networks across communities and nations under the authority of God's anointing."
  // }
];
