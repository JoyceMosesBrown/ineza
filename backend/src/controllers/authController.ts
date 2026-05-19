import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import CHW from '../models/CHW';

const signToken = (id: string, role: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (jwt.sign as any)({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '30d',
  });

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nickname, district, language, pin } = req.body;

    if (!nickname || !district || !pin) {
      res.status(400).json({ success: false, message: 'nickname, district, and pin are required' });
      return;
    }

    if (String(pin).length < 4) {
      res.status(400).json({ success: false, message: 'PIN must be at least 4 digits' });
      return;
    }

    const user = await User.create({
      nickname: nickname.trim(),
      district: district.trim(),
      language: language || 'rw',
      pin: String(pin),
    });

    const token = signToken(String(user._id), user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        nickname: user.nickname,
        district: user.district,
        language: user.language,
        role: user.role,
        streak: user.streak,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, pin } = req.body;

    if (!userId || !pin) {
      res.status(400).json({ success: false, message: 'userId and pin are required' });
      return;
    }

    const user = await User.findById(userId).select('+pin');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePin(String(pin));
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Incorrect PIN' });
      return;
    }

    const token = signToken(String(user._id), user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        nickname: user.nickname,
        district: user.district,
        language: user.language,
        role: user.role,
        streak: user.streak,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/chw/login
export const chwLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({ success: false, message: 'phone and password are required' });
      return;
    }

    const chw = await CHW.findOne({ phone }).select('+password');
    if (!chw) {
      res.status(404).json({ success: false, message: 'CHW not found' });
      return;
    }

    const isMatch = await chw.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Incorrect password' });
      return;
    }

    const token = signToken(String(chw._id), 'chw');

    res.json({
      success: true,
      token,
      chw: {
        id: chw._id,
        name: chw.name,
        district: chw.district,
        phone: chw.phone,
        assignedCount: chw.assignedUsers.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
