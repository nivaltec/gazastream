export interface AuthResponse {
  token: string;
  refreshToken?: string;

  user: {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl?: string;
  };
}
