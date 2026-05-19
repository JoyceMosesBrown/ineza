import { Response } from 'express';
import JournalEntry from '../models/JournalEntry';
import { AuthRequest } from '../middleware/auth';

const AI_RESPONSES = {
  struggling: [
    'Ndakumva. Ubyumvamo ni bikomeye, kandi ubwo ni ukuri bwawe. Ntibihindura umutegetsi wawe nk\'umubyeyi.',
    'Ibyiyumvo byawe bifite agaciro. Ntabwo ugomba guhangana wenyine na ibi.',
    'Urashimishije kuko warandikiye uyu munsi. Gusa gushaka ubufasha ni intwari nini.',
  ],
  okay: [
    'Urakora neza kuruta uko utekereza. Komeza ukomere.',
    'Buri munsi winjiye ni intsinzi. Wirerure gato uyu munsi.',
    'Urashimishije. Ntabwo birangira uyu munsi.',
  ],
  good: [
    'Bishimishije kumva ko uramutse neza! Iterambere ryawe rirabagaragara.',
    'Uyu munsi ni nziza. Ibuka uyu mwanya.',
    'Komeza ugire amahoro. Urabyayishije neza.',
  ],
};

function detectSentiment(text: string): 'good' | 'okay' | 'struggling' {
  const lower = text.toLowerCase();
  const struggling = ['bigoye', 'nkiheba', 'scared', 'afraid', 'struggling', 'hard', 'tired', 'cry', 'hopeless', 'ntibishoboka'];
  const good = ['neza', 'nishimye', 'good', 'happy', 'great', 'better', 'improved', 'nishimye'];
  if (struggling.some(w => lower.includes(w))) return 'struggling';
  if (good.some(w => lower.includes(w))) return 'good';
  return 'okay';
}

function pickResponse(bucket: 'good' | 'okay' | 'struggling'): string {
  const list = AI_RESPONSES[bucket];
  return list[Math.floor(Math.random() * list.length)];
}

// POST /api/journal
export const createEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text, date } = req.body;
    const userId = req.userId!;

    if (!text || !date) {
      res.status(400).json({ success: false, message: 'text and date are required' });
      return;
    }

    const sentiment = detectSentiment(text);
    const aiResponse = pickResponse(sentiment);

    const entry = await JournalEntry.findOneAndUpdate(
      { userId, date },
      { text, aiResponse, sentiment },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, entry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/journal
export const getEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const limit = Number(req.query.limit) || 30;

    const entries = await JournalEntry.find({ userId })
      .sort({ date: -1 })
      .limit(limit)
      .select('-__v');

    res.json({ success: true, count: entries.length, entries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/journal/:date
export const getEntryByDate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const entry = await JournalEntry.findOne({
      userId: req.userId!,
      date: req.params.date,
    });

    if (!entry) {
      res.status(404).json({ success: false, message: 'No entry for this date' });
      return;
    }

    res.json({ success: true, entry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
