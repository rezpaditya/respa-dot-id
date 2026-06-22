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
    id: "1",
    title: "Inventory Management System",
    description:
      "A full-stack web application for managing warehouse inventory with real-time updates, barcode scanning, and analytics dashboard.",
    thumbnail: "https://picsum.photos/seed/proj1/800/500",
    url: "https://github.com/rezpaditya",
    tags: ["Next.js", "PostgreSQL", "Docker"],
    year: 2024,
  },
  {
    id: "2",
    title: "E-Commerce Platform",
    description:
      "Scalable e-commerce solution with multi-vendor support, payment gateway integration, and automated order management.",
    thumbnail: "https://picsum.photos/seed/proj2/800/500",
    url: "https://github.com/rezpaditya",
    tags: ["React", "Node.js", "Stripe"],
    year: 2024,
  },
  {
    id: "3",
    title: "Data Pipeline Dashboard",
    description:
      "Real-time data visualization platform that aggregates logs and metrics from distributed services with alerting capabilities.",
    thumbnail: "https://picsum.photos/seed/proj3/800/500",
    url: "https://github.com/rezpaditya",
    tags: ["Python", "Kafka", "Grafana"],
    year: 2023,
  },
  {
    id: "4",
    title: "Task Management App",
    description:
      "Collaborative project management tool with Kanban boards, time tracking, and Slack integration for remote teams.",
    thumbnail: "https://picsum.photos/seed/proj4/800/500",
    url: "https://github.com/rezpaditya",
    tags: ["Vue.js", "FastAPI", "Redis"],
    year: 2023,
  },
  {
    id: "5",
    title: "AI Content Summarizer",
    description:
      "Browser extension and API service that uses LLMs to summarize articles, PDFs, and web pages on demand.",
    thumbnail: "https://picsum.photos/seed/proj5/800/500",
    url: "https://github.com/rezpaditya",
    tags: ["TypeScript", "OpenAI", "Chrome Extension"],
    year: 2024,
  },
  {
    id: "6",
    title: "Location-Based Social App",
    description:
      "Mobile-first app for discovering local events and connecting with nearby communities using geolocation.",
    thumbnail: "https://picsum.photos/seed/proj6/800/500",
    url: "https://github.com/rezpaditya",
    tags: ["React Native", "Maps API", "Firebase"],
    year: 2023,
  },
];
