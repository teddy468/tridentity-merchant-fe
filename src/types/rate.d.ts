declare interface Rate {
  create_time: string;
  id: number;
  rating: number;
  description: string;
  data: { attachments: string[] };
  order: { user: RateUser };
}

declare interface RateUser {
  full_name: string;
  avatar: string;
}