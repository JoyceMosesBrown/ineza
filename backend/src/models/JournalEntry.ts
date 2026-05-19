import mongoose, { Document, Schema } from 'mongoose';

export interface IJournalEntry extends Document {
  userId: mongoose.Types.ObjectId;
  text: string;
  aiResponse: string;
  sentiment: 'good' | 'okay' | 'struggling';
  date: string;
  createdAt: Date;
}

const JournalEntrySchema = new Schema<IJournalEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    aiResponse: {
      type: String,
      default: '',
    },
    sentiment: {
      type: String,
      enum: ['good', 'okay', 'struggling'],
      default: 'okay',
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// One entry per day per user
JournalEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);
