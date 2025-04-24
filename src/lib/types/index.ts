export interface MemeTemplate {
  id: string;
  name: string;
  imageUrl: string;
  aspectRatio: number;
}

export interface PexelsImage {
  id: string;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

export interface PexelsResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsImage[];
  next_page: string;
}

export interface MemeText {
  top: string;
  bottom: string;
}

export interface TextGenerationResponse {
  suggestions: MemeText[];
}

export interface Meme {
  id: string;
  imageUrl: string;
  topText: string;
  bottomText: string;
  fontSize: number;
  textColor: string;
  strokeWidth: number;
  createdAt: Date;
}
