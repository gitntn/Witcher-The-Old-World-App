import p1 from './p1.json';
import p2 from './p2.json';
import p3 from './p3.json';
import p4 from './p4.json';

export const MONSTER_DECISIONS: Record<string, {
  nivel: number;
  vida: number;
  tipo: string;
  habilidad: string;
  buenas: string[];
  malas: string[];
  estandar: string[];
}> = {
  ...p1,
  ...p2,
  ...p3,
  ...p4
};
