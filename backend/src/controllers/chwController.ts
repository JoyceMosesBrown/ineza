import { Response } from 'express';
import User from '../models/User';
import TrackerEntry from '../models/TrackerEntry';
import CHW from '../models/CHW';
import { AuthRequest } from '../middleware/auth';

// GET /api/chw/users  — CHW sees all their assigned users
export const getAssignedUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const chwId = req.userId!;
    const chw = await CHW.findById(chwId).populate('assignedUsers', 'nickname district streak lastCheckIn createdAt');

    if (!chw) {
      res.status(404).json({ success: false, message: 'CHW not found' });
      return;
    }

    // Attach latest risk level for each user
    const usersWithRisk = await Promise.all(
      (chw.assignedUsers as any[]).map(async (user: any) => {
        const latest = await TrackerEntry.findOne({ userId: user._id })
          .sort({ date: -1 })
          .select('riskLevel date mood');
        return {
          id: user._id,
          nickname: user.nickname,
          district: user.district,
          streak: user.streak,
          lastCheckIn: user.lastCheckIn,
          riskLevel: latest?.riskLevel ?? 'unknown',
          lastMood: latest?.mood ?? null,
          lastTracked: latest?.date ?? null,
        };
      })
    );

    res.json({ success: true, count: usersWithRisk.length, users: usersWithRisk });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/chw/users/:userId/summary  — detailed view of one user
export const getUserSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-pin');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Last 30 days of tracker data
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const sinceStr = since.toISOString().split('T')[0];

    const trackerEntries = await TrackerEntry.find({
      userId,
      date: { $gte: sinceStr },
    }).sort({ date: 1 }).select('-__v');

    // Average mood
    const moods = trackerEntries.map(e => e.mood).filter(Boolean) as number[];
    const avgMood = moods.length ? moods.reduce((a, b) => a + b, 0) / moods.length : null;

    res.json({
      success: true,
      user: {
        id: user._id,
        nickname: user.nickname,
        district: user.district,
        streak: user.streak,
        lastCheckIn: user.lastCheckIn,
        language: user.language,
      },
      summary: {
        avgMood: avgMood ? Number(avgMood.toFixed(1)) : null,
        totalEntries: trackerEntries.length,
        highRiskDays: trackerEntries.filter(e => e.riskLevel === 'high').length,
        mediumRiskDays: trackerEntries.filter(e => e.riskLevel === 'medium').length,
      },
      trackerEntries,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
