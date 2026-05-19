import { Response } from 'express';
import Alert from '../models/Alert';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// POST /api/sos  — user taps the SOS button
export const triggerSOS = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (!user.chwId) {
      res.status(400).json({
        success: false,
        message: 'No CHW assigned to this user',
      });
      return;
    }

    const alert = await Alert.create({
      userId,
      chwId: user.chwId,
      type: 'sos',
      message: `🆘 ${user.nickname} asaba ubufasha bw'ihutirwa - ${user.district}`,
    });

    res.status(201).json({
      success: true,
      alert,
      message: 'Ubutumwa bwatumwe kuri umujyanama wawe. Nturi wenyine.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/sos/alerts  — CHW sees all active alerts
export const getAlerts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const chwId = req.userId!;
    const alerts = await Alert.find({ chwId, resolved: false })
      .sort({ createdAt: -1 })
      .populate('userId', 'nickname district lastCheckIn streak');

    res.json({ success: true, count: alerts.length, alerts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/sos/alerts/:id/resolve  — CHW resolves alert
export const resolveAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, chwId: req.userId! },
      { resolved: true, resolvedAt: new Date() },
      { new: true }
    );

    if (!alert) {
      res.status(404).json({ success: false, message: 'Alert not found' });
      return;
    }

    res.json({ success: true, alert });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
