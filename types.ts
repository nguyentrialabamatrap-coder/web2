
export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  imageUrl?: string;
}

export type View = 'list' | 'form' | 'detail';
