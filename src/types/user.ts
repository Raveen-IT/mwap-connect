
export type Gender = 'male' | 'female' | 'other';

export type WorkingType = 
  | 'construction' 
  | 'agriculture' 
  | 'manufacturing' 
  | 'domestic' 
  | 'hospitality' 
  | 'other';

export interface User {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  workingType: WorkingType;
  migrationPlace: string;
  mobile: string;
  aadhaarNumber: string;
  email?: string;
  profileImage?: string;
  registrationDate: string;
  isVerified: boolean;
}
