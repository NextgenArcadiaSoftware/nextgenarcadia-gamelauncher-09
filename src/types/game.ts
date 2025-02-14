
export interface Game {
  id: string;
  title: string;
  description: string;
  genre: string;
  release_date: string;
  thumbnail: string;
  trailer?: string;
  executable_path?: string;
  launch_code?: string;
  status: 'enabled' | 'disabled';
  created_at?: string;
  updated_at?: string;
}
