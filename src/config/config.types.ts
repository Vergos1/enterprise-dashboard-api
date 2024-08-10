import { DatabaseConfig } from '../database/config/database.config.types';
import { AuthConfig } from '../auth/config/auth-config.type';

export type AllConfigType = {
  database: DatabaseConfig;
  auth: AuthConfig;
};
