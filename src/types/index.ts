export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  type: string;
  validated: boolean;
}
