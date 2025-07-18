export type User = {
  id: number;
  username: string;
  email: string;
};

export type Post = {
  id: number;
  user: User;
  caption: string;
  image?: string;
  created_at: string;
  likes: number;
  dislikes: number;
  user_liked: boolean;
  user_disliked: boolean;
  comments: Comment[];
  is_deleted: boolean;
  edited: boolean;
};

export type Comment = {
  id: number;
  user: string;
  content: string;
  created_at: string;
};

export interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  bio?: string;
  followers_count: number;
  following_count: number;
}



