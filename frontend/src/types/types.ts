export type User = {
  id: number;
  username: string;
  email: string;
  bio?: string;                           
  gender?: 'Male' | 'Female' | 'Prefer not to say'; 
  contact?: string;                        
  country_code?: string;                   
  profile_image?: string;                  
  is_following?: boolean;                  
  followers_count?: number;                
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
  user_username: string;                   
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
  gender?: 'Male' | 'Female' | 'Prefer not to say'; 
  contact?: string;                      
  country_code?: string;                   
  profile_image?: string;                  
  followers_count: number;
  following_count: number;
  is_following?: boolean;                 
}


export interface UserSettings {
  theme: 'light' | 'dark' | 'green-orange';
  sidebarLayout: 'expanded' | 'collapsed';
  postView: 'grid' | 'list';
}
