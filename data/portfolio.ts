export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  tags: string[];
  year: number;
}

export const projects: Project[] = [
  {
    id: "respa-dot-id",
    title: "respa.id",
    description:
      "Personal website — photo gallery, blog, and portfolio — built with Next.js and deployed to GCP Cloud Run.",
    thumbnail: "/thumbnails/respa-dot-id.svg",
    url: "https://github.com/rezpaditya/respa-dot-id",
    tags: ["Next.js", "TypeScript", "Cloud Run"],
    year: 2026,
  },
  {
    id: "urunan",
    title: "Urunan",
    description:
      "Bill-splitting web app for group expenses — track who paid what and settle up easily.",
    thumbnail: "/thumbnails/urunan.svg",
    url: "https://github.com/rezpaditya/Urunan",
    tags: ["Vue.js", "TypeScript"],
    year: 2024,
  },
  {
    id: "musihoven-pay",
    title: "Musihoven Pay",
    description:
      "iOS app for in-app payment integration, built in Swift for the Musihoven platform.",
    thumbnail: "/thumbnails/musihoven-pay.svg",
    url: "https://github.com/rezpaditya/musihoven-pay",
    tags: ["Swift", "iOS"],
    year: 2024,
  },
  {
    id: "scroll-sync-app",
    title: "ScrollSyncApp",
    description:
      "Android utility that synchronises scroll position across multiple views or devices in real time.",
    thumbnail: "/thumbnails/scroll-sync-app.svg",
    url: "https://github.com/rezpaditya/ScrollSyncApp",
    tags: ["Java", "Android"],
    year: 2023,
  },
  {
    id: "peerjs",
    title: "PeerJS",
    description:
      "WebRTC peer-to-peer video/audio client and signalling server enabling direct browser-to-browser communication.",
    thumbnail: "/thumbnails/peerjs.svg",
    url: "https://github.com/rezpaditya/peerjs-client",
    tags: ["JavaScript", "WebRTC", "P2P"],
    year: 2023,
  },
  {
    id: "sijepat",
    title: "Sijepat",
    description:
      "Corporate resource-booking system: reserve meeting rooms, stationery, catering, and company vehicles in one place.",
    thumbnail: "/thumbnails/sijepat.svg",
    url: "https://github.com/rezpaditya",
    tags: ["Reservation", "Enterprise"],
    year: 2022,
  },
  {
    id: "simapro",
    title: "Simapro",
    description:
      "Geolocation-tagging system for tracking and managing company assets on an interactive map.",
    thumbnail: "/thumbnails/simapro.svg",
    url: "https://github.com/rezpaditya/Simapro",
    tags: ["Java", "Geolocation", "Android"],
    year: 2016,
  },
  {
    id: "indigolabs",
    title: "Indigolabs",
    description:
      "Programming practicum management platform for universities — handles scheduling, practical exams, and progress reporting.",
    thumbnail: "/thumbnails/indigolabs.svg",
    url: "https://github.com/rezpaditya",
    tags: ["Education", "Scheduling"],
    year: 2020,
  },
];
