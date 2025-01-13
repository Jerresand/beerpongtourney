declare module 'mongoose' {
  interface Document {
    comparePassword?(candidatePassword: string): Promise<boolean>;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      JWT_SECRET: string;
    }
  }
}

declare interface IUser {
  email: string;
  password: string;
  name: string;
  profilePicture?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    language?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

declare interface IUserDocument extends IUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export { IUser, IUserDocument }; 