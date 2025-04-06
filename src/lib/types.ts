// Auth and User Types
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  client_type?: 'individual' | 'company' | string;
  company_name?: string;
  profile_completed: boolean;
  completion_percentage?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserSession {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Staff related types
export interface Staff {
  id: string;
  name: string;
  role: string;
  experience: number;
  salary: number;
  availability: boolean;
  image_url?: string;
  location?: string;
  skills?: string[];
  status?: string;
  verified?: boolean;
  phone?: string;
  email?: string;
  age?: number;
  gender?: string;
  marital_status?: string;
  education_background?: string[];
  work_history?: string[];
}

// Request related types
export interface StaffRequest {
  id: string;
  client_id: string;
  staff_id: string;
  service_type: string;
  duration: string;
  start_date: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

// Common types
export interface SelectOption {
  value: string;
  label: string;
}

export type ProfileField = {
  id: string;
  name: string;
  label: string;
  required: boolean;
  completed: boolean;
  weight: number;
};

// Profile completion section types
export type ProfileCompletionSection = {
  id: string;
  title: string;
  description: string;
  fields: ProfileField[];
  completionPercentage: number;
}; 