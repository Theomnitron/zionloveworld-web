/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  category: 'General Services' | 'Thanksgivings' | 'Ordinations' | 'Youth Fellowship' | string;
  description: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // {
  //   id: "gallery-1",
  //   imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800",
  //   title: "An Atmosphere of Apostolic Praise",
  //   category: "General Services",
  //   description: "Believers raising hands in unity during a powerful breakthrough worship sequence led by the Zion Choir."
  // },
  // {
  //   id: "gallery-2",
  //   imageUrl: "https://images.unsplash.com/photo-1507504038482-7621c338bd61?q=80&w=800",
  //   title: "The Sanctuary Altar Design",
  //   category: "General Services",
  //   description: "The interior majesty of the main auditorium, glowing under holy illumination representing divine order."
  // },
  // {
  //   id: "gallery-3",
  //   imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800",
  //   title: "Annual Covenant Thanksgiving Festivities",
  //   category: "Thanksgivings",
  //   description: "Rejoicing together with songs of praise and thanksgiving offerings to celebrate two decades of divine guidance."
  // },
  // {
  //   id: "gallery-4",
  //   imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800",
  //   title: "The Joy of Prophetic Breakthrough",
  //   category: "Thanksgivings",
  //   description: "A snapshot of pure spiritual elation as congregation members celebrate testimonies of miraculous deliverance."
  // },
  // {
  //   id: "gallery-5",
  //   imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800",
  //   title: "Consecration of the Ministerial Council",
  //   category: "Ordinations",
  //   description: "Apostle Zion Loveworld laying hands and commissioning the newly appointed church elders and deacons."
  // },
  // {
  //   id: "gallery-6",
  //   imageUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=800",
  //   title: "Solemn Altar Dedication Ceremony",
  //   category: "Ordinations",
  //   description: "A quiet, profound moment of prayer and anointing at the altar during the solemn ordinations."
  // },
  // {
  //   id: "gallery-7",
  //   imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800",
  //   title: "Empowered Youth Leaders Summit",
  //   category: "Youth Fellowship",
  //   description: "Our young vibrant generation gathering under the banner of holiness, developing kingdom networks."
  // },
  // {
  //   id: "gallery-8",
  //   imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800",
  //   title: "Weekly Word Discipleship Circle",
  //   category: "Youth Fellowship",
  //   description: "Youth leaders gathered for intimate bible study, breaking down deep theological mysteries with active fellowship."
  // }
];
