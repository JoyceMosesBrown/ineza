import mongoose, { Document, Schema } from 'mongoose';

export interface IPeerMessage extends Document {
  district: string;
  authorAlias: string;
  userId: mongoose.Types.ObjectId;
  text: string;
  reactions: { heart: number; pray: number };
  createdAt: Date;
}

const PeerMessageSchema = new Schema<IPeerMessage>(
  {
    district: { type: String, required: true },
    authorAlias: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, maxlength: 500 },
    reactions: {
      heart: { type: Number, default: 0 },
      pray: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPeerMessage>('PeerMessage', PeerMessageSchema);
