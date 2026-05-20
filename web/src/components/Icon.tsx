import {
  Wind, Droplets, Heart, Phone, Moon, Utensils, Activity, PenLine,
  Leaf, BookOpen, Baby, Star, Brain, Handshake, Volume2, Pause,
  Clock, CheckCircle, HeartHandshake, MessageCircle, Users, type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  Wind, Droplets, Heart, Phone, Moon, Utensils, Activity, PenLine,
  Leaf, BookOpen, Baby, Star, Brain, Handshake, Volume2, Pause,
  Clock, CheckCircle, HeartHandshake, MessageCircle, Users,
};

export default function Icon({ name, size = 18, color, strokeWidth = 1.8 }: {
  name: string; size?: number; color?: string; strokeWidth?: number;
}) {
  const C = MAP[name];
  if (!C) return null;
  return <C size={size} color={color} strokeWidth={strokeWidth} />;
}
