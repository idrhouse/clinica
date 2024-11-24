import { LoginForm } from '../models/Login';
import { User } from '../models/User';

export interface AuthContextType {
    user: User | null;
    login: (data: LoginForm) => Promise<void>;
    logout: () => void;
  }

  