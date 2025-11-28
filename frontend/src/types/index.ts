export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Game {
  id: number;
  title: string;
  description: string;
  releaseDate: string;
  price?: number;
  imageUrl?: string;
  videoUrl?: string;
  steamLink?: string;
  carouselImageUrls?: string[];
  carouselVideoUrls?: string[];
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string;
}
