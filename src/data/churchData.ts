/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChurchInfo, Sermon, GalleryItem, NavItem } from '../types/church';

export const NAV_ITEMS: NavItem[] = [
  { id: 'who-we-are', label: 'Who We Are', view: 'home', anchor: 'who-we-are' },
  { id: 'sermons', label: 'Sermons', view: 'sermons' },
  { id: 'gallery', label: 'Gallery', view: 'gallery' },
  { id: 'contact-us', label: 'Contact Us', view: 'home', anchor: 'contact-us' },
  { id: 'giving', label: 'Giving', view: 'home', anchor: 'giving' },
];

export const CHURCH_INFO: ChurchInfo = {
  name: "Zion Loveworld Gospel Ministry International",
  logo: "https://zdpkrcvdtrcvvwqmtuwm.supabase.co/storage/v1/object/public/others/Zion%20Logo.png",
  vision: "To broadcast the unfathomable love and redemption of Jesus Christ, building a global sanctuary of active disciples equipped with unwavering faith and grounded in active service.",
  mission: "Equipping lives through dynamic Word teaching, pure prophetic worship, global community outreach, and systematic discipleship, elevating a generation of leaders to dominate in every sphere.",
  pastorName: "Bishop Olaitan O. Emmanuel",
  phone: "+234 (0) 8118886806",
  email: "zionloveworldministry@gmail.com",
  address: "Zion Loveworld Avenue, Dutse Makaranta, FCT Abuja, Nigeria",
  serviceTimes: [
    { day: "Sunday", time: "08:00 AM - 11:00 AM", type: "Sunday Celebration Service" },
    { day: "Monday", time: "06:00 PM - 07:00 PM", type: "Prayer Meeting" },
    { day: "Tuesday", time: "06:00 PM - 08:00 PAM", type: "Bible Study" }
  ]
};

// export const INSTALLED_SERMONS: Sermon[] = [
//   {
//     id: "sermon-1",
//     title: "Humble Yourself Before God",
//     preacher: "Bishop Olaitan O. Emmanuel",
//     date: "April 28, 2026",
//     duration: "1 hr",
//     scripture: "James 4:10, Psalms 10:17-18",
//     category: "Sunday Service",
//     thumbnailUrl: "/src/assets/images/sermon_setup_1780405761020.png",
//     description: "Discover the intrinsic keys to unlocking divine authority. In this sermon, Pastor Ezekiel shares systematic guidelines on how to navigate challenging times by standing firm in the Word of Promise and aligning your speech with heaven's decrees."
//   },
//   {
//     id: "sermon-2",
//     title: "Walk in Perfect Harmony & Divine Love",
//     preacher: "Pastor Grace Adeleke",
//     date: "May 24, 2026",
//     duration: "45 mins",
//     scripture: "1 John 4:7-12, Ephesians 5:1-2",
//     category: "Sunday Service",
//     thumbnailUrl: "/src/assets/images/church_worship_hero_1780405742635.png",
//     description: "Love is not just a sentiment, it is an active spiritual force. Pastor Grace details the transformative impact of embodying Christ's compassion in modern society, repairing connections, and establishing the Loveworld standard."
//   },
//   {
//     id: "sermon-3",
//     title: "The Prophetic Power of Heartfelt Worship",
//     preacher: "Pastor Ezekiel Adeleke",
//     date: "May 17, 2026",
//     duration: "52 mins",
//     scripture: "Psalm 100:1-5, 2 Chronicles 20:21-22",
//     category: "Sunday Service",
//     thumbnailUrl: "/src/assets/images/church_community_1780405780230.png",
//     description: "Worship is our absolute primary ministry. When praise goes up, walls inevitably crash down. Learn the spiritual dimensions of sound and submission in this revelatory teaching."
//   },
//   {
//     id: "sermon-4",
//     title: "Possessing the Gates: Wisdom for Spiritual Authority",
//     preacher: "Pastor Ezekiel Adeleke",
//     date: "May 10, 2026",
//     duration: "1 hour 15 mins",
//     scripture: "Genesis 22:17, Matthew 16:18-19",
//     category: "Special Service",
//     thumbnailUrl: "/src/assets/images/sermon_setup_1780405761020.png",
//     description: "This systematic teaching uncovers how to identify spiritual structures and exercise administrative authority in your industry, career, and household using the keys of the Kingdom."
//   }
// ];

// export const INSTALLED_GALLERY: GalleryItem[] = [
//   {
//     id: "g-1",
//     imageUrl: "/src/assets/images/church_worship_hero_1780405742635.png",
//     title: "Pentecost Prophetic Convocation",
//     description: "Moments of supreme worship and divine activation during our annual convocation service.",
//     date: "May 31, 2026",
//     category: "Service"
//   },
//   {
//     id: "g-2",
//     imageUrl: "/src/assets/images/church_community_1780405780230.png",
//     title: "Sanctuary Fellowship Meet",
//     description: "Families and new covenant partners connecting in the white-filled cathedral grand lobby.",
//     date: "June 01, 2026",
//     category: "Community"
//   },
//   {
//     id: "g-3",
//     imageUrl: "/src/assets/images/sermon_setup_1780405761020.png",
//     title: "Midweek Spiritual Elevation Academy",
//     description: "Deep dive theological exploration and scripture unpacking by our ministerial cabinet.",
//     date: "May 27, 2026",
//     category: "Service"
//   }
// ];
