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
  { id: "1", src: "https://live.staticflickr.com/65535/54496203758_f190109f97_b.jpg", alt: "Arashiyama", width: 1024, height: 683 },
  { id: "2", src: "https://live.staticflickr.com/65535/54496131679_eb06f49cdf_b.jpg", alt: "Kyoto", width: 1024, height: 683 },
  { id: "3", src: "https://live.staticflickr.com/65535/54496203918_cebe36a5b0_b.jpg", alt: "Nenba Village", width: 1024, height: 683 },
  { id: "4", src: "https://live.staticflickr.com/65535/54495944446_0ae7eb9b28_b.jpg", alt: "Nenba Village", width: 1024, height: 683 },
  { id: "5", src: "https://live.staticflickr.com/65535/54496204023_f90bbce7a1_b.jpg", alt: "Nenba Village", width: 1024, height: 683 },
  { id: "6", src: "https://live.staticflickr.com/65535/54496203958_839a899b60_b.jpg", alt: "Tokyo", width: 1024, height: 683 },
  { id: "7", src: "https://live.staticflickr.com/65535/54496132194_cbce667e48_b.jpg", alt: "Ginza", width: 1024, height: 683 },
  { id: "8", src: "https://live.staticflickr.com/65535/54496132204_12bc053ede_b.jpg", alt: "Tokyo", width: 1024, height: 683 },
  { id: "9", src: "https://live.staticflickr.com/65535/53385539454_96540b436b_b.jpg", alt: "Texel, The Netherlands", width: 1024, height: 683 },
  { id: "10", src: "https://live.staticflickr.com/65535/53385539409_4f6136c195_b.jpg", alt: "Texel, The Netherlands", width: 1024, height: 683 },
  { id: "11", src: "https://live.staticflickr.com/65535/53385412903_e29888a918_b.jpg", alt: "Texel, The Netherlands", width: 1024, height: 683 },
  { id: "12", src: "https://live.staticflickr.com/65535/53384309357_737f7e0d99_b.jpg", alt: "Texel, The Netherlands", width: 1024, height: 683 },
  { id: "13", src: "https://live.staticflickr.com/65535/53384309402_554e66d7cc_b.jpg", alt: "Texel, The Netherlands", width: 1024, height: 683 },
  { id: "14", src: "https://live.staticflickr.com/65535/53385539574_ffe821fab3_b.jpg", alt: "Texel, The Netherlands", width: 1024, height: 683 },
  { id: "15", src: "https://live.staticflickr.com/65535/53385539584_030ef12794_b.jpg", alt: "Texel, The Netherlands", width: 1024, height: 683 },
  { id: "16", src: "https://live.staticflickr.com/65535/53385539564_ea7b98e1cb_b.jpg", alt: "Texel, The Netherlands", width: 1024, height: 683 },
  { id: "17", src: "https://live.staticflickr.com/65535/53324194068_19d7765d81_b.jpg", alt: "Lonely", width: 1024, height: 683 },
  { id: "18", src: "https://live.staticflickr.com/65535/52914150860_62058ec579_b.jpg", alt: "P1020293", width: 1024, height: 683 },
  { id: "19", src: "https://live.staticflickr.com/65535/52913185217_5b1dc19550_b.jpg", alt: "P1020231", width: 1024, height: 683 },
  { id: "20", src: "https://live.staticflickr.com/65535/52913767296_f2c00cf62a_b.jpg", alt: "P1020228", width: 1024, height: 683 },
];
