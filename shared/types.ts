// Ko Lake Villa Database Types for Supabase Migration
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Gallery {
  id: string;
  imageUrl: string;
  category: string;
  altText?: string;
  uploadedAt: Date;
}
