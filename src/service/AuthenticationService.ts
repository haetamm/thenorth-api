import { hash, compare } from 'bcrypt';
import { sign, verify, SignOptions } from 'jsonwebtoken';

export interface User {
  sub: number;
  username: string;
  roles: string[];
}

class AuthenticationService {
  public static passwordHash = (password: string): Promise<string> => {
    return hash(password, 10);
  };

  public static passwordCompare = async (
    text: string,
    encript: string
  ): Promise<boolean> => {
    const result = await compare(text, encript);
    return result;
  };

  public static generateToken(user: User): string {
    const secretKey = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES;

    // Validasi environment variables
    if (!secretKey || !expiresIn) {
      throw new Error(
        'JWT_SECRET or JWT_EXPIRES is not defined in environment variables!'
      );
    }

    const options: SignOptions = {
      expiresIn: expiresIn as SignOptions['expiresIn'], // Type assertion yang tepat
    };

    const token: string = sign({ user }, secretKey, options);
    return token;
  }

  public static decodeToken(token: string): any {
    const secretKey = process.env.JWT_SECRET;

    // Validasi environment variables
    if (!secretKey) {
      throw new Error('JWT_SECRET is not defined in environment variables!');
    }

    const credential: any = verify(token, secretKey);
    return credential;
  }
}

export default AuthenticationService;
