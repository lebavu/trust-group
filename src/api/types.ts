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
  name: string;
  email: string;
  profile_image: string;
  handphone_number: string;
  role_id: string;
  password: string;
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
  image_url: string;
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
  profile_image: string;
  role_id: string;
  password: string;
  new_password: string;
  verified_code_forgot: string;
  errors?: {
    name?: string;
    email?: string;
    profile_image?: string;
    handphone_number?: string;
    role_id?: string;
    password?: string;
    new_password?: string;
    verified_code_forgot?: string;
  };
}

export interface PawnTickets {
  id: string;
  user_id: string;
  name: string;
  pawn_status: string;
  ticket_no: string;
  pawn_type: number;
  pawn_amount: string;
  interest_payable: string;
  downloan_amount: string;
  monthly_repayment: string;
  already_paid: string;
  balance_remaining: string;
  duration: string;
  pawn_date: Date | null | string;
  next_renewal: Date | null | string;
  expiry_date: Date | null | string;
  errors?: {
    user_id?: string;
    name?: string;
    pawn_status?: string;
    ticket_no?: string;
    pawn_type?: number;
    pawn_amount?: string;
    interest_payable?: string;
    downloan_amount?: string;
    monthly_repayment?: string;
    already_paid?: string;
    balance_remaining?: string;
    duration?: string;
    pawn_date?: Date | null | string;
    next_renewal?: Date | null | string;
    expiry_date?: Date | null | string;
  };
}

//e valuations categories
export interface EValuationCategory {
  id: string;
  name: string;
  desc: string;
  parent: string;
  errors?: {
    name?: string;
    desc?: string;
    parent?: string;
  };
}

export type EValuationCategoryFormData = {
  id: string;
  name: string;
  desc: string;
  parent: string
};
export interface EValuationCategoryResponse {
  status: string;
  data: {
    data: EValuationCategory[];
  };
}
//role type
export interface Role {
  id: string;
  name: string;
  role: string;
  errors?: {
    name?: string;
    role?: string;
  };
}

//media
export interface Media{
  id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
  errors?: {
    image_url?: string;
  };
}

//e-valuation
export interface EValuation{
  id: string;
  user_id: string;
  category_id: string;
  status: number | string;
  name: string;
  price: string;
  image: string;
  type: string;
  metal: string;
  size: string;
  weight: string;
  other_remarks: string;
  content: string;
  date: Date | null | string;
  appointment_date: Date | null | string
  branch_id: string;
  errors?: {
    user_id?: string;
    category_id?: string;
    status?: number | string;
    name?: string;
    price?: string;
    image?: string;
    type?: string;
    metal?: string;
    size?: string;
    weight?: string;
    other_remarks?: string;
    content?: string;
    date?: Date | null | string;
    appointment_date?: Date | null | string
    branch_id?: string;
  };
}
export interface MetaData {
  per_page: number;
  total: number;
  current_page: number;
  last_page: number
}
export interface EValuationsResponse {
  data: EValuation[];
  meta: MetaData;
}
