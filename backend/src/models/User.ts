import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  nickname: string;
  district: string;
  language: 'rw' | 'en';
  pin: string;
  role: 'user' | 'chw';
  chwId?: mongoose.Types.ObjectId;
  streak: number;
  lastCheckIn?: Date;
  createdAt: Date;
  comparePin(candidatePin: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    nickname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      enum: ['rw', 'en'],
      default: 'rw',
    },
    pin: {
      type: String,
      required: true,
      minlength: 4,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'chw'],
      default: 'user',
    },
    chwId: {
      type: Schema.Types.ObjectId,
      ref: 'CHW',
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastCheckIn: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hash PIN before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('pin')) return;
  const salt = await bcrypt.genSalt(10);
  this.pin = await bcrypt.hash(this.pin, salt);
});

UserSchema.methods.comparePin = async function (candidatePin: string): Promise<boolean> {
  return bcrypt.compare(candidatePin, this.pin);
};

export default mongoose.model<IUser>('User', UserSchema);
