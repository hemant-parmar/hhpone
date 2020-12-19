import { Role } from './role.model';

export class Account {
  id: string;
  userName: string;
  employeeId: string;
  employeeName: string;
  email: string;
  role: Role;
  jwtToken?: string;
}
