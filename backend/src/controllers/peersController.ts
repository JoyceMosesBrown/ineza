import { Response } from 'express';
import PeerMessage from '../models/PeerMessage';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// GET /api/peers?district=Gasabo
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { district } = req.query;
    const filter = district ? { district: String(district) } : {};
    const messages = await PeerMessage.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-userId -__v');

    res.json({ success: true, count: messages.length, messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/peers
export const postMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { text } = req.body;

    if (!text?.trim()) {
      res.status(400).json({ success: false, message: 'text is required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const message = await PeerMessage.create({
      district: user.district,
      authorAlias: `Mama ${user.nickname}`,
      userId,
      text: text.trim(),
    });

    res.status(201).json({
      success: true,
      message: {
        _id: message._id,
        district: message.district,
        authorAlias: message.authorAlias,
        text: message.text,
        reactions: message.reactions,
        createdAt: message.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/peers/:id/react
export const reactToMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type } = req.body;
    if (!['heart', 'pray'].includes(type)) {
      res.status(400).json({ success: false, message: 'type must be heart or pray' });
      return;
    }

    const update = { $inc: { [`reactions.${type}`]: 1 } };
    const message = await PeerMessage.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!message) {
      res.status(404).json({ success: false, message: 'Message not found' });
      return;
    }

    res.json({ success: true, reactions: message.reactions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
