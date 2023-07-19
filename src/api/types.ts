export interface IUser {
  name: string;
  email: string;
  role_id: string;
  handphone_number: string;
  _id: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GenericResponse {
  status: string;
  message: string;
}

export interface ILoginResponse {
  status: string;
  // access_token: string;
  token: string;
}

export interface IUserResponse {
  status: string;
  token: string;
  data: {
    user: IUser;
  };
}

export interface UserRequest {
  title: string;
  content: string;
  image: string;
  user: string;
}

export interface UserResponse {
  id: string;
  handphone_number: string;
  name: string;
  email: string;
  profile_image: string;
  role_id: string;
  verified_code_forgot: string;
  user: IUser;
  created_at: string;
  updated_at: string;
}

export interface UsersResponse {
  status: string;
  data: {
    user: UserResponse[];
  };
}
//branches type
export interface Branch {
  id: string;
  name: string;
  address: string;
  image_url: string | File;
  errors?: {
    name?: string;
    address?: string;
    image_url?: string;
  };
}
export interface User {
  id: string;
  handphone_number: string;
  name: string;
  email: string;
  profile_image: string | File;
  role_id: string;
  verified_code_forgot: string;
  errors?: {
    handphone_number?: string;
    name?: string;
    email?: string;
    profile_image?: string;
    role_id?: string;
    verified_code_forgot?: string;
  };
}
