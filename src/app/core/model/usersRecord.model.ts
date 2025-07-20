import { AutoIncrementPrimaryKey } from '../decorators';
import { MissingRequiredFieldException } from '../exceptions';
import { AuditInfo } from './auditInfo.model';
import { UserRole } from './types';

export class UserRecord extends AuditInfo {
  @AutoIncrementPrimaryKey()
  userId!: number;
  username: string;
  password: string;
  role: UserRole;
  picture: string;
  constructor(
    username: string,
    password: string,
    role: UserRole,
    picture: string
  ) {
    super();
    const requiredFields = { username, password, role, picture };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || value === '') {
        throw new MissingRequiredFieldException(key);
      }
    }
    this.username = username;
    this.password = password;
    this.role = role;
    this.picture = picture;
  }
}
