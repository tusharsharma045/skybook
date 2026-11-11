export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role?: 'USER';
  avatarUrl?: string | null;
  createdAt?: string;
  savedPassengers?: SavedPassenger[];
  _count?: {
    bookings: number;
  };
}

export interface SavedPassenger {
  id: string;
  userId: string;
  type: 'ADULT' | 'CHILD' | 'INFANT';
  title?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'UNDISCLOSED';
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword?: string;
}
