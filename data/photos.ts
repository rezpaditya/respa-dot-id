export interface Photo {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  location?: string;
  year?: number;
}

export const photos: Photo[] = [
  {
    id: "1",
    src: "https://picsum.photos/seed/landscape1/800/1067",
    alt: "Mountain landscape at golden hour",
    width: 800,
    height: 1067,
    location: "Bromo, East Java",
    year: 2024,
  },
  {
    id: "2",
    src: "https://picsum.photos/seed/street1/1200/800",
    alt: "Street life in the city",
    width: 1200,
    height: 800,
    location: "Jakarta",
    year: 2024,
  },
  {
    id: "3",
    src: "https://picsum.photos/seed/nature1/800/800",
    alt: "Tropical forest path",
    width: 800,
    height: 800,
    location: "Bali",
    year: 2023,
  },
  {
    id: "4",
    src: "https://picsum.photos/seed/ocean1/1200/800",
    alt: "Ocean waves at sunset",
    width: 1200,
    height: 800,
    location: "Lombok",
    year: 2023,
  },
  {
    id: "5",
    src: "https://picsum.photos/seed/portrait1/800/1067",
    alt: "Candid street portrait",
    width: 800,
    height: 1067,
    location: "Yogyakarta",
    year: 2024,
  },
  {
    id: "6",
    src: "https://picsum.photos/seed/arch1/1200/800",
    alt: "Traditional architecture detail",
    width: 1200,
    height: 800,
    location: "Solo",
    year: 2023,
  },
  {
    id: "7",
    src: "https://picsum.photos/seed/rice1/800/1067",
    alt: "Rice terraces in the morning mist",
    width: 800,
    height: 1067,
    location: "Ubud, Bali",
    year: 2024,
  },
  {
    id: "8",
    src: "https://picsum.photos/seed/temple1/800/800",
    alt: "Ancient temple at dusk",
    width: 800,
    height: 800,
    location: "Borobudur",
    year: 2023,
  },
  {
    id: "9",
    src: "https://picsum.photos/seed/market1/1200/800",
    alt: "Busy morning market",
    width: 1200,
    height: 800,
    location: "Bandung",
    year: 2024,
  },
  {
    id: "10",
    src: "https://picsum.photos/seed/coast1/800/1067",
    alt: "Rugged coastline cliffs",
    width: 800,
    height: 1067,
    location: "Gunungkidul",
    year: 2024,
  },
  {
    id: "11",
    src: "https://picsum.photos/seed/fog1/1200/800",
    alt: "Foggy mountain village",
    width: 1200,
    height: 800,
    location: "Dieng Plateau",
    year: 2023,
  },
  {
    id: "12",
    src: "https://picsum.photos/seed/river1/800/1067",
    alt: "River through dense jungle",
    width: 800,
    height: 1067,
    location: "Kalimantan",
    year: 2024,
  },
];
