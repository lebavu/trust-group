type Role = "User" | "Admin";

export interface User {
  _id: string
  id: string
  name: string
  roles: Role[]
  role_id: string
  email: string
  profile_image: string
  handphone_number: string
  password: string
  verified_code_forgot: string
  createdAt: string
  updatedAt: string
}
