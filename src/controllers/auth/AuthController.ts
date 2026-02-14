import { Request, Response } from 'express';
import IController from './InterfaceController';
import UserRepository from '../../repository/UserRepository';
import AuthenticationService from '../../service/AuthenticationService';
import { AuthenticatedRequest } from '../../utilities/interface';

class AuthController implements IController {
  index = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {
    return res.json(req.user);
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;

    const user = await UserRepository.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User tidak ditemukan',
      });
    }

    const compare = await AuthenticationService.passwordCompare(
      password,
      user.password
    );
    if (!compare) {
      return res.status(401).json({
        status: 'fail',
        message: 'Username atau password salah',
      });
    }

    const roles = user.roles ? user.roles.map((role: any) => role.name) : [];

    const tokenPayload = {
      sub: user.id,
      username: user.username,
      roles: roles,
    };

    const token = AuthenticationService.generateToken(tokenPayload);

    const expiresDate = new Date();
    expiresDate.setHours(expiresDate.getHours() + 1);

    await UserRepository.updateExpriedToken(expiresDate, user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: expiresDate,
    });

    return res.json({
      statusCode: 200,
      status: 'success',
      message: 'Login sukses',
      token: token,
    });
  };

  logout = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {
    const credential = req.user?.id;
    const expiresDate = new Date();

    await UserRepository.updateExpriedToken(expiresDate, Number(credential));
    res.setHeader('Authorization', '');
    // res.clearCookie('token');
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.json({ message: 'Logout berhasil' });
  };
}

export default new AuthController();
