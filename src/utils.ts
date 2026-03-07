import { 
  Shield, Sword, Swords, Skull, ScrollText, ArrowLeft, Dices, ChevronRight, 
  AlertTriangle, Heart, Zap, Sparkles, Droplet, Ghost, Moon, Leaf, 
  TreePine, Feather, Bug, Flame, Mountain, PawPrint, RotateCcw, X, Wind, Waves, Info, CheckCircle2, UserX, UserCheck, Coins, MapPin, RefreshCw, Target
} from 'lucide-react';
import { LOCATIONS, MONSTER_DATA, ACTION_POOLS } from './data';

export const getMonsterStyle = (type: string) => {
  const styles: Record<string, any> = {
    'Vampiro': { icon: Droplet, color: 'text-red-500', bg: 'bg-red-900/20' },
    'Necrófago': { icon: Skull, color: 'text-zinc-400', bg: 'bg-zinc-900/20' },
    'Espectro': { icon: Ghost, color: 'text-cyan-400', bg: 'bg-cyan-900/20' },
    'Bestia': { icon: PawPrint, color: 'text-yellow-600', bg: 'bg-yellow-900/20' },
    'Maldito': { icon: Moon, color: 'text-purple-500', bg: 'bg-purple-900/20' },
    'Bestia Maldita': { icon: Moon, color: 'text-purple-500', bg: 'bg-purple-900/20' },
    'Planta Maldita': { icon: Leaf, color: 'text-green-500', bg: 'bg-green-900/20' },
    'Relicto': { icon: TreePine, color: 'text-emerald-500', bg: 'bg-emerald-900/20' },
    'Híbrido': { icon: Feather, color: 'text-orange-400', bg: 'bg-orange-900/20' },
    'Insectoide': { icon: Bug, color: 'text-lime-500', bg: 'bg-lime-900/20' },
    'Dracónido': { icon: Flame, color: 'text-orange-600', bg: 'bg-orange-900/20' },
    'Ogro': { icon: Mountain, color: 'text-stone-400', bg: 'bg-stone-900/20' },
  };
  return styles[type] || { icon: Skull, color: 'text-stone-500', bg: 'bg-stone-900/20' };
};

export const getTerrainStyle = (terrain: string) => {
  switch(terrain) {
    case 'Bosque': return { 
      icon: TreePine, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-950/40', 
      label: 'Bosque',
      bgImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800' 
    };
    case 'Montaña': return { 
      icon: Mountain, 
      color: 'text-stone-300', 
      bg: 'bg-stone-800/60', 
      label: 'Montaña',
      bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' 
    };
    case 'Agua': return { 
      icon: Waves, 
      color: 'text-blue-300', 
      bg: 'bg-blue-950/40', 
      label: 'Agua',
      bgImage: 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&q=80&w=800' 
    };
    default: return { icon: TreePine, color: 'text-stone-500', bg: 'bg-stone-900/50', label: 'Desconocido' };
  }
};

export const getRandomLocation = (terrain: string, currentLoc: string | null = null) => {
  const pool = LOCATIONS[terrain as keyof typeof LOCATIONS];
  let available = pool.filter(l => l !== currentLoc);
  if (available.length === 0) available = pool;
  return available[Math.floor(Math.random() * available.length)];
};

export const getRandomWeaknessLocation = (terrain: string, excludeLocs: string[] = []) => {
  let pool = LOCATIONS[terrain as keyof typeof LOCATIONS];
  let available = pool.filter(l => !excludeLocs.includes(l));
  if (available.length === 0) available = pool;
  return available[Math.floor(Math.random() * available.length)];
};

export const getActionPool = (type: string) => {
  if (type.includes('Vampiro')) return ACTION_POOLS['Vampiro'];
  if (type.includes('Necrófago')) return ACTION_POOLS['Necrófago'];
  if (type.includes('Espectro')) return ACTION_POOLS['Espectro'];
  if (type.includes('Relicto')) return ACTION_POOLS['Relicto'];
  if (type.includes('Insectoide') || type.includes('Dracónido') || type.includes('Híbrido')) return ACTION_POOLS['Escurridizos'];
  return ACTION_POOLS['Bestias'];
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

let usedMonsterIds: string[] = [];

export const resetUsedMonsters = () => {
  usedMonsterIds = [];
};

export const drawMonster = (level: number, currentActiveMonsters: any[]): any => {
  const activeIds = currentActiveMonsters.map(m => m.id);
  let pool = MONSTER_DATA[level as keyof typeof MONSTER_DATA].map(m => ({ ...m, level })); 
  
  let available = pool.filter(m => !activeIds.includes(m.id) && !usedMonsterIds.includes(m.id));

  if (available.length === 0) {
    const poolIds = pool.map(m => m.id);
    usedMonsterIds = usedMonsterIds.filter(id => !poolIds.includes(id));
    available = pool.filter(m => !activeIds.includes(m.id));
  }

  const picked = { ...available[Math.floor(Math.random() * available.length)] };
  usedMonsterIds.push(picked.id);

  return picked;
};
