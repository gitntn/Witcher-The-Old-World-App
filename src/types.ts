import { LucideIcon } from 'lucide-react';

export interface Monster {
  id: string;
  name: string;
  type: string;
  ability: string;
  narrative: string;
  level: number;
  activeLocation?: string;
  weaknessLocation?: string;
}

export interface MonsterStyle {
  icon: LucideIcon;
  color: string;
  bg: string;
}

export interface TerrainStyle {
  icon: LucideIcon;
  color: string;
  bg: string;
  label: string;
  bgImage: string;
}

export interface EventOption {
  text: string;
  type: 'good' | 'bad' | 'neutral';
  outcome: string;
  narrativeText: string;
  mechanicText: string;
}
