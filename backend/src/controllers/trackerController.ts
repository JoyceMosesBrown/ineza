import { Response } from 'express';
import TrackerEntry from '../models/TrackerEntry';
import Alert from '../models/Alert';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// POST /api/tracker
export const saveTrackerEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { date, mood, sleep, ate, cried, babyBond, anxiety, social } = req.body;

    if (!date) {
      res.status(400).json({ success: false, message: 'date is required' });
      return;
    }

    const entry = await TrackerEntry.findOneAndUpdate(
      { userId, date },
      { mood, sleep, ate, cried, babyBond, anxiety, social },
      { upsert: true, new: true, runValidators: true }
    );

    // Recalculate streak
    const today = new Date().toISOString().split('T')[0];
    const user = await User.findById(userId);
    if (user) {
      if (date === today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yd = yesterday.toISOString().split('T')[0];
        const prevEntry = await TrackerEntry.findOne({ userId, date: yd });
        user.streak = prevEntry ? user.streak + 1 : 1;
        user.lastCheckIn = new Date();
        await user.save();
      }
    }

    // Auto-fire high-risk alert if riskLevel is high
    if (entry.riskLevel === 'high' && user?.chwId) {
      const existing = await Alert.findOne({
        userId,
        type: 'high_risk',
        resolved: false,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });
      if (!existing) {
        await Alert.create({
          userId,
          chwId: user.chwId,
          type: 'high_risk',
          message: `${user.nickname} ari mu bihe bikomeye - genzura vuba`,
        });
      }
    }

    res.status(201).json({ success: true, entry, streak: user?.streak ?? 0 });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tracker?days=7
export const getTrackerEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const days = Number(req.query.days) || 30;

    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split('T')[0];

    const entries = await TrackerEntry.find({
      userId,
      date: { $gte: sinceStr },
    })
      .sort({ date: 1 })
      .select('-__v');

    res.json({ success: true, count: entries.length, entries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tracker/:date
export const getTrackerByDate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const entry = await TrackerEntry.findOne({
      userId: req.userId!,
      date: req.params.date,
    });
    if (!entry) {
      res.status(404).json({ success: false, message: 'No tracker entry for this date' });
      return;
    }
    res.json({ success: true, entry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
