import React, { useState } from 'react';
import { 
  Sword, Swords, Skull, ScrollText, ArrowLeft, Dices, 
  AlertTriangle, Sparkles, RotateCcw, X, Wind, Info, CheckCircle2, UserX, UserCheck, Coins, MapPin, RefreshCw, Target, Zap, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SETUP_RESOURCES, FIXED_TERRAINS, GOOD_CONSEQUENCES, BAD_CONSEQUENCES, NEUTRAL_CONSEQUENCES, NEKKER_NARRATIVES, GENERIC_GOOD_NARRATIVE, GENERIC_BAD_NARRATIVE, GENERIC_NEUTRAL_NARRATIVE } from './data';
import { getMonsterStyle, getTerrainStyle, getRandomLocation, getRandomWeaknessLocation, getActionPool, shuffleArray, drawMonster, resetUsedMonsters } from './utils';

export default function App() {
  const [view, setView] = useState('setup'); 
  const [playerCount, setPlayerCount] = useState(1);
  const [activeMonsters, setActiveMonsters] = useState<any[]>([]);
  const [extraLevel1Pile, setExtraLevel1Pile] = useState(0);
  
  const [selectedMonsterIndex, setSelectedMonsterIndex] = useState<number | null>(null);
  const [generatedOptions, setGeneratedOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [combatOutcome, setCombatOutcome] = useState<string | null>(null); 
  
  const [showResetModal, setShowResetModal] = useState(false);
  const [dyingIndex, setDyingIndex] = useState<number | null>(null);
  const [fleeingIndex, setFleeingIndex] = useState<number | null>(null);
  const [spawnNotification, setSpawnNotification] = useState<any>(null);

  const [witcherCombatWinner, setWitcherCombatWinner] = useState<string | null>(null); 

  const startGame = (players: number) => {
    setPlayerCount(players);
    let extras = players === 4 ? 1 : players === 5 ? 2 : 0;
    setExtraLevel1Pile(extras);
    setView('playerSetup'); 
  };

  const confirmStartGame = () => {
    resetUsedMonsters();

    const m1 = drawMonster(1, []);
    m1.activeLocation = getRandomLocation(FIXED_TERRAINS[0]);
    m1.weaknessLocation = getRandomWeaknessLocation(FIXED_TERRAINS[0], [m1.activeLocation]);
    
    const m2 = drawMonster(1, [m1]);
    m2.activeLocation = getRandomLocation(FIXED_TERRAINS[1]);
    m2.weaknessLocation = getRandomWeaknessLocation(FIXED_TERRAINS[1], [m2.activeLocation]);
    
    const m3 = drawMonster(1, [m1, m2]);
    m3.activeLocation = getRandomLocation(FIXED_TERRAINS[2]);
    m3.weaknessLocation = getRandomWeaknessLocation(FIXED_TERRAINS[2], [m3.activeLocation]);

    setActiveMonsters([m1, m2, m3]);
    setView('board');
  };

  const confirmResetGame = () => {
    setView('setup');
    setActiveMonsters([]);
    setSpawnNotification(null);
    setDyingIndex(null);
    setFleeingIndex(null);
    setShowResetModal(false);
    resetUsedMonsters();
  };

  const rerollLocation = (index: number) => {
    setActiveMonsters(prev => {
      const newMonsters = [...prev];
      const monster = newMonsters[index];
      const terrain = FIXED_TERRAINS[index];
      monster.activeLocation = getRandomLocation(terrain, monster.activeLocation);
      return newMonsters;
    });
  };

  const rerollWeaknessLocation = (index: number) => {
    setActiveMonsters(prev => {
      const newMonsters = [...prev];
      const monster = newMonsters[index];
      const terrain = FIXED_TERRAINS[index];
      monster.weaknessLocation = getRandomWeaknessLocation(terrain, [monster.activeLocation, monster.weaknessLocation]);
      return newMonsters;
    });
  };

  const startMonsterEvent = (index: number) => {
    const monster = activeMonsters[index];
    setSelectedMonsterIndex(index);
    
    const actionPool = getActionPool(monster.type);
    const chosenActions = shuffleArray(actionPool).slice(0, 3);
    const assignedTypes = shuffleArray(['good', 'neutral', 'bad']);
    
    const newOptions = chosenActions.map((action, idx) => {
      let narrativeText = '';
      let mechanicText = '';
      const type = assignedTypes[idx];

      if (type === 'good') mechanicText = GOOD_CONSEQUENCES[Math.floor(Math.random() * GOOD_CONSEQUENCES.length)];
      else if (type === 'bad') mechanicText = BAD_CONSEQUENCES[Math.floor(Math.random() * BAD_CONSEQUENCES.length)];
      else mechanicText = NEUTRAL_CONSEQUENCES[Math.floor(Math.random() * NEUTRAL_CONSEQUENCES.length)];

      if (monster.id === 'nido_nekkers') {
        const lorePool = NEKKER_NARRATIVES[type as keyof typeof NEKKER_NARRATIVES];
        narrativeText = lorePool[Math.floor(Math.random() * lorePool.length)];
      } else {
        if (type === 'good') narrativeText = GENERIC_GOOD_NARRATIVE[Math.floor(Math.random() * GENERIC_GOOD_NARRATIVE.length)];
        else if (type === 'bad') narrativeText = GENERIC_BAD_NARRATIVE[Math.floor(Math.random() * GENERIC_BAD_NARRATIVE.length)];
        else narrativeText = GENERIC_NEUTRAL_NARRATIVE[Math.floor(Math.random() * GENERIC_NEUTRAL_NARRATIVE.length)];
      }
      
      const fullOutcome = `${narrativeText} (Efecto: ${mechanicText})`;

      return { text: action, type, outcome: fullOutcome, narrativeText, mechanicText };
    });

    setGeneratedOptions(newOptions);
    setIsShuffling(true);
    setView('event');
    setTimeout(() => { setIsShuffling(false); }, 700);
  };

  const cancelEvent = () => {
    setView('board');
    setSelectedMonsterIndex(null);
    setGeneratedOptions([]);
    setSelectedOption(null);
  };

  const resolveBoardUpdate = () => {
    if (selectedMonsterIndex === null) return;
    
    if (combatOutcome === 'victory') {
      setView('board');
      setDyingIndex(selectedMonsterIndex); 
      
      setTimeout(() => {
        const targetTerrain = FIXED_TERRAINS[selectedMonsterIndex];
        let newMonster, usedExtraPile = false;
        const activeRemaining = activeMonsters.filter((_, i) => i !== selectedMonsterIndex);

        if (extraLevel1Pile > 0) {
          newMonster = drawMonster(1, activeRemaining);
          setExtraLevel1Pile(prev => prev - 1);
          usedExtraPile = true;
        } else {
          const nextLevel = Math.min(activeMonsters[selectedMonsterIndex].level + 1, 3);
          newMonster = drawMonster(nextLevel, activeRemaining);
        }
        
        newMonster.activeLocation = getRandomLocation(targetTerrain);
        newMonster.weaknessLocation = getRandomWeaknessLocation(targetTerrain, [newMonster.activeLocation]);

        const newBoard = [...activeMonsters];
        newBoard[selectedMonsterIndex] = newMonster;
        setActiveMonsters(newBoard);
        
        setDyingIndex(null);
        setSpawnNotification({ monster: newMonster, usedExtraPile, type: 'spawn' });
        setTimeout(() => setSpawnNotification(null), 4500);
      }, 1500);
    } 
    else if (combatOutcome === 'fled') {
      setView('board');
      setFleeingIndex(selectedMonsterIndex);
      
      setTimeout(() => {
        const currentMonster = activeMonsters[selectedMonsterIndex];
        const targetTerrain = FIXED_TERRAINS[selectedMonsterIndex];
        const activeRemaining = activeMonsters.filter((_, i) => i !== selectedMonsterIndex);
        
        const newMonster = drawMonster(currentMonster.level, activeRemaining);
        
        newMonster.activeLocation = getRandomLocation(targetTerrain);
        newMonster.weaknessLocation = getRandomWeaknessLocation(targetTerrain, [newMonster.activeLocation]);
        
        const newBoard = [...activeMonsters];
        newBoard[selectedMonsterIndex] = newMonster;
        setActiveMonsters(newBoard);
        
        setFleeingIndex(null);
        setSpawnNotification({ monster: newMonster, usedExtraPile: false, type: 'flee' });
        setTimeout(() => setSpawnNotification(null), 4500);
      }, 1200);
    }
    else if (combatOutcome === 'defeat') {
      setView('board');
      const stayingMonster = activeMonsters[selectedMonsterIndex];
      setSelectedMonsterIndex(null);
      setGeneratedOptions([]);
      setSelectedOption(null);
      setSpawnNotification({ monster: stayingMonster, usedExtraPile: false, type: 'stay' });
      setTimeout(() => setSpawnNotification(null), 4500);
    }
  };

  const renderResetModal = () => {
    if (!showResetModal) return null;
    return (
      <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-stone-900 border-2 border-amber-700 p-8 rounded shadow-[0_0_50px_rgba(0,0,0,0.9)] max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
          <h3 className="text-2xl font-serif text-amber-500 mb-2 uppercase tracking-widest">¿Abandonar Cacería?</h3>
          <p className="text-stone-300 mb-8 leading-relaxed font-serif">Se perderá todo el progreso del tablero activo y volverás a la configuración inicial. ¿Estás seguro?</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setShowResetModal(false)} className="px-6 py-3 bg-stone-800 text-stone-300 hover:bg-stone-700 rounded uppercase font-bold text-sm">Cancelar</button>
            <button onClick={confirmResetGame} className="px-6 py-3 bg-red-950/80 text-red-400 hover:bg-red-900 hover:text-white border border-red-800 rounded uppercase font-bold text-sm shadow-[0_0_15px_rgba(220,38,38,0.2)]">Sí, Reiniciar</button>
          </div>
        </div>
      </div>
    );
  };

  const renderSetup = () => (
    <div className="flex flex-col items-center justify-center space-y-10 text-center px-4 max-w-2xl mx-auto">
      <div className="mb-4 relative">
        <div className="relative inline-block">
          <Sword className="w-24 h-24 text-amber-500 mx-auto mb-6 opacity-90 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          <Sparkles className="w-8 h-8 text-amber-300 absolute top-0 right-0 animate-pulse" />
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-amber-500 tracking-wider mb-4 font-bold uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">El Viejo Mundo</h1>
        <p className="text-stone-400 text-lg italic bg-stone-900/50 p-4 rounded border border-stone-800">Selecciona la cantidad de brujos. Las reglas de la caja base se aplicarán de forma automática.</p>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { val: 1, desc: 'Solitario. Reglas estándar.' },
          { val: 2, desc: 'Reglas estándar de reaparición.' },
          { val: 3, desc: 'Reglas estándar de reaparición.' },
          { val: 4, desc: 'Pila de Caza: +1 Monstruo Lvl I extra.' },
          { val: 5, desc: 'Pila de Caza: +2 Monstruos Lvl I extra.' }
        ].map(btn => (
          <button key={btn.val} onClick={() => startGame(btn.val)} className={`w-full group flex flex-col items-center justify-center p-5 bg-stone-900 border-2 border-stone-700 hover:border-amber-500 hover:bg-stone-800 transition-all duration-300 ${btn.val === 5 ? 'sm:col-span-2' : ''}`}>
            <span className="text-xl font-serif text-stone-200 group-hover:text-amber-400 font-bold uppercase mb-2">{btn.val} Jugador{btn.val > 1 ? 'es' : ''}</span>
            <span className="text-sm text-stone-500 text-center">{btn.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPlayerSetup = () => {
    const setupData = SETUP_RESOURCES[playerCount] || SETUP_RESOURCES[1];

    return (
      <div className="w-full max-w-3xl mx-auto relative px-2 sm:px-4 pb-10 mt-4">
        <button 
          onClick={() => setView('setup')} 
          className="flex items-center text-amber-600 hover:text-amber-400 mb-6 transition-colors group px-2 font-bold uppercase tracking-widest text-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a Selección de Jugadores
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-amber-500 mb-2 uppercase tracking-widest">Preparación de la Mesa</h2>
          <p className="text-stone-400">Distribuye el oro y las cartas iniciales exactamente según el orden de turno oficial.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {setupData.map((data, i) => (
            <div key={i} className={`bg-stone-900 border border-stone-700 p-5 rounded-sm flex items-center justify-between shadow-lg ${playerCount === 5 && i === 4 ? 'sm:col-span-2 sm:w-1/2 sm:mx-auto' : ''}`}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-600 flex items-center justify-center text-amber-500 font-bold font-serif text-lg mr-4">
                  {i + 1}
                </div>
                <div className="text-left">
                  <p className="text-stone-200 font-bold uppercase tracking-wider text-sm">
                    {i === 0 ? 'Jugador Inicial' : `Jugador ${i + 1}`}
                  </p>
                  <p className="text-stone-500 text-xs mt-1">
                     {playerCount === 1 ? 'Lobo Solitario' : `Empieza su turno ${i + 1}º`}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-yellow-500 font-bold text-sm">{data.gold} Oro</p>
                <p className="text-stone-300 text-sm">{data.cards} Cartas</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-stone-900/80 border border-amber-900/50 p-6 rounded-sm mb-8 text-left shadow-inner">
          <h4 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-3 flex items-center">
             <AlertTriangle className="w-4 h-4 mr-2" /> Recordatorio de Reglas
          </h4>
          <ul className="text-stone-300 text-sm space-y-2 list-disc pl-5 marker:text-amber-700">
            <li><div className="flex-1">Todos los jugadores deben tener su mazo de 10 cartas específico de su Escuela.</div></li>
            <li><div className="flex-1">Coloca todos tus marcadores de atributos en el <strong>Nivel 1</strong> de tu tablero.</div></li>
            <li><div className="flex-1">Si son 4 o 5 jugadores, empezando por el Jugador Inicial y en sentido horario, cada jugador elige <strong>un Atributo</strong> (puede ser la Especialidad) y lo sube a <strong>Nivel 2</strong>.</div></li>
          </ul>
        </div>

        <button onClick={confirmStartGame} className="w-full sm:w-auto px-10 py-4 bg-stone-800 border border-amber-700 text-amber-500 hover:bg-amber-900/30 hover:text-amber-400 transition-all font-bold uppercase tracking-wider flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(180,83,9,0.2)] hover:shadow-[0_0_25px_rgba(217,119,6,0.6)] group rounded-sm">
          <Sword className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
          Comenzar la Cacería
        </button>
      </div>
    );
  };

  const renderBoard = () => (
    <div className="w-full max-w-5xl mx-auto relative pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 px-4 border-b border-stone-800 pb-4">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h2 className="text-3xl font-serif text-amber-500 uppercase tracking-widest flex items-center justify-center sm:justify-start">
            <Skull className="w-6 h-6 mr-3 text-stone-500" /> Rastros Activos
          </h2>
          <p className="text-stone-400 text-sm mt-1">
             Partida: {playerCount <= 3 ? (playerCount === 1 ? 'Solitario' : '1-3 Jugadores') : `${playerCount} Jugadores`}. 
             {extraLevel1Pile > 0 && <span className="text-amber-600 font-bold ml-2">({extraLevel1Pile} Nivel I Extra en Reserva)</span>}
          </p>
        </div>
        <button onClick={() => setShowResetModal(true)} className="flex items-center px-4 py-2 bg-stone-900 border border-stone-700 text-stone-400 hover:text-red-400 hover:border-red-900 hover:bg-red-950/30 transition-all rounded">
          <RotateCcw className="w-4 h-4 mr-2" /> Reiniciar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4">
        {activeMonsters.map((monster, index) => {
          const slotTerrain = FIXED_TERRAINS[index];
          const { icon: TerrainIcon, color: terrainColor, bg: terrainBg, label: terrainLabel, bgImage } = getTerrainStyle(slotTerrain);
          const { icon: MonsterIcon, color: iconColor, bg: bgColor } = getMonsterStyle(monster.type);
          const isDying = dyingIndex === index;
          const isFleeing = fleeingIndex === index;
          
          return (
            <div key={`${monster.id}-${index}`} className="flex flex-col w-full h-full">
              <div 
                className={`flex items-center justify-center h-28 mb-3 rounded-xl shadow-xl z-10 relative overflow-hidden ${!bgImage ? terrainBg : 'bg-stone-900'}`}
                style={bgImage ? { backgroundImage: `url('${bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                {bgImage && <div className="absolute inset-0 bg-stone-950/50 transition-opacity duration-300 hover:bg-stone-950/30"></div>}
                <div className="relative z-10 flex items-center transform scale-105">
                  <TerrainIcon className={`w-7 h-7 mr-3 ${terrainColor}`} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.9))' }} />
                  <span className={`font-serif font-bold uppercase tracking-widest text-lg ${terrainColor}`} style={{ textShadow: '0px 4px 6px rgba(0,0,0,0.9)' }}>
                    {terrainLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-gradient-to-r from-stone-900 to-stone-800 border border-cyan-900/40 rounded-xl p-4 mb-4 shadow-[0_4px_15px_rgba(6,182,212,0.07)] relative overflow-hidden group transition-all hover:border-cyan-700/60 z-10">
                <div className="absolute -left-4 -top-4 w-20 h-20 bg-cyan-900/20 rounded-full blur-2xl pointer-events-none transition-all group-hover:bg-cyan-800/30"></div>

                <div className="flex items-center relative z-10">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-950 border-2 border-cyan-800 flex items-center justify-center mr-3 sm:mr-4 shadow-[0_0_12px_rgba(6,182,212,0.25)] group-hover:scale-110 transition-transform duration-500">
                     <Target className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 drop-shadow-[0_0_5px_currentColor]" />
                   </div>
                   <div className="text-left flex flex-col">
                     <span className="text-[10px] sm:text-xs text-cyan-500/90 uppercase tracking-widest font-bold leading-none mb-1.5 flex items-center">
                       <Sparkles className="w-3 h-3 mr-1 opacity-70" />
                       Ficha de Debilidad
                     </span>
                     <span className="text-base sm:text-lg font-bold text-stone-100 flex items-center leading-none tracking-wide">
                       <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 text-cyan-500" />
                       {monster.weaknessLocation}
                     </span>
                   </div>
                </div>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); rerollWeaknessLocation(index); }}
                  className="p-2.5 bg-stone-950 hover:bg-cyan-950 border border-stone-800 hover:border-cyan-600 rounded-lg transition-all duration-300 text-stone-500 hover:text-cyan-300 shadow-sm relative z-10 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                  title="Cambiar localización de debilidad si hay un brujo ahí"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <button
                onClick={() => !isDying && !isFleeing && startMonsterEvent(index)}
                disabled={isDying || isFleeing}
                className={`relative overflow-hidden flex flex-col items-center text-center p-6 border-2 transition-all duration-700 h-64 justify-center group rounded-xl flex-1
                  ${isDying ? 'bg-red-950/40 border-red-900 grayscale opacity-40 scale-95 pointer-events-none' : ''}
                  ${isFleeing ? 'opacity-0 translate-x-20 pointer-events-none' : ''}
                  ${(!isDying && !isFleeing) ? 'bg-gradient-to-b from-stone-800 to-stone-900 border-stone-700 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:-translate-y-2' : ''}
                `}
              >
                {isDying && <div className="absolute inset-0 flex items-center justify-center z-20"><X className="w-32 h-32 text-red-600 animate-ping opacity-80" strokeWidth={3} /></div>}
                {isFleeing && <div className="absolute inset-0 flex items-center justify-center z-20"><Wind className="w-24 h-24 text-stone-500 opacity-80" /></div>}

                <div className={`absolute top-0 left-0 px-3 py-1 text-sm font-bold border-r border-b border-stone-700 rounded-br
                  ${monster.level === 1 ? 'bg-stone-800 text-green-500' : monster.level === 2 ? 'bg-stone-800 text-yellow-500' : 'bg-stone-800 text-red-500'}`}>
                  NIVEL {monster.level}
                </div>

                <div className="absolute top-0 right-0 flex items-center bg-stone-900 border-l border-b border-stone-700 rounded-bl z-20 overflow-hidden shadow-sm">
                  <div className="px-3 py-1 flex items-center text-xs font-bold text-stone-300">
                    <MapPin className="w-3 h-3 mr-1 text-amber-600" />
                    {monster.activeLocation}
                  </div>
                  <div 
                    role="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); rerollLocation(index); }}
                    className="px-2 py-1.5 bg-stone-800 hover:bg-amber-600 hover:text-stone-950 text-stone-400 border-l border-stone-700 transition-colors flex items-center justify-center"
                    title="Cambiar carta de rastro si hay un brujo en esta localización"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className={`p-4 rounded-full ${bgColor} border border-stone-700/50 mb-4 group-hover:scale-110 transition-transform duration-500 mt-4`}>
                  <MonsterIcon className={`w-12 h-12 ${iconColor} drop-shadow-[0_0_8px_currentColor]`} />
                </div>
                <span className="text-2xl font-serif text-stone-200 group-hover:text-amber-400 transition-colors uppercase tracking-wider">{monster.name}</span>
                <span className={`text-xs uppercase tracking-widest mt-2 ${iconColor} opacity-80 font-semibold`}>{monster.type}</span>
              </button>
            </div>
          );
        })}
      </div>

      {playerCount > 1 && (
        <div className="w-full max-w-5xl mx-auto px-4 mt-8 pt-8 border-t border-stone-800">
          <div className="flex justify-center">
            <button 
              onClick={() => setView('witcherCombatSelect')}
              className="px-8 py-4 bg-stone-900 border-2 border-stone-700 text-stone-300 hover:border-amber-500 hover:text-amber-500 transition-all uppercase tracking-widest font-bold rounded-lg shadow-lg flex items-center group"
            >
              <Swords className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform text-stone-500 group-hover:text-amber-500" />
              Lucha Entre Brujos
            </button>
          </div>
        </div>
      )}

      {spawnNotification && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 bg-stone-900 border-2 shadow-[0_0_30px_rgba(0,0,0,0.8)] p-4 px-8 rounded-lg animate-fade-in-up z-50 flex items-center
          ${spawnNotification.type === 'stay' ? 'border-stone-500 shadow-stone-700/40' : 'border-amber-600 shadow-amber-600/40'}`}>
           {spawnNotification.type === 'stay' ? (
             <Info className="w-8 h-8 text-stone-400 mr-4 animate-pulse" />
           ) : (
             <AlertTriangle className="w-8 h-8 text-amber-500 mr-4 animate-pulse" />
           )}
           <div className="text-left">
             <p className={`font-bold uppercase tracking-widest text-sm ${spawnNotification.type === 'stay' ? 'text-stone-400' : 'text-amber-500'}`}>
                {spawnNotification.type === 'flee' && 'El Rastro se Enfría...'}
                {spawnNotification.type === 'spawn' && 'El Rastro Continúa...'}
                {spawnNotification.type === 'stay' && 'El Monstruo Permanece...'}
             </p>
             <p className="text-stone-200 font-serif text-lg">
                {spawnNotification.type === 'stay' ? (
                  <span><strong className="text-white">{spawnNotification.monster.name}</strong> recupera toda su vida en <strong>{spawnNotification.monster.activeLocation}</strong>.</span>
                ) : (
                  <span>¡Aparece un <strong className="text-white">{spawnNotification.monster.name}</strong> en <strong>{spawnNotification.monster.activeLocation}</strong>!</span>
                )}
             </p>
             {spawnNotification.usedExtraPile && <p className="text-stone-400 text-xs italic mt-1">Extraído de la Reserva Adicional.</p>}
           </div>
        </div>
      )}
    </div>
  );

  const renderEvent = () => {
    if (selectedMonsterIndex === null) return null;
    const activeMonster = activeMonsters[selectedMonsterIndex];
    const { icon: MonsterIcon, color: iconColor } = getMonsterStyle(activeMonster.type);
    const currentTerrain = FIXED_TERRAINS[selectedMonsterIndex];
    const { icon: TerrainIcon, color: terrainColor } = getTerrainStyle(currentTerrain);

    return (
      <div className="w-full max-w-3xl mx-auto relative px-2 sm:px-4 pb-10">
        <button 
          onClick={cancelEvent} 
          className="flex items-center text-amber-600 hover:text-amber-400 mb-6 transition-colors group px-2 font-bold uppercase tracking-widest text-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al Tablero
        </button>

        <div className="p-6 sm:p-10 border-4 border-double border-stone-700 bg-stone-900 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <MonsterIcon className={`absolute -right-10 -bottom-10 w-64 h-64 ${iconColor} opacity-5 rotate-12 pointer-events-none`} />

          <div className="flex flex-col sm:flex-row justify-between border-b border-stone-700 pb-4 mb-6 relative z-10">
            <div>
              <span className="text-amber-700 font-bold uppercase tracking-widest text-xs flex items-center"><Sparkles className="w-3 h-3 mr-1 inline" /> Evento de Cacería en {activeMonster.activeLocation}</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-amber-500 mt-1">{activeMonster.name}</h2>
            </div>
            
            <div className="flex flex-col items-end mt-4 sm:mt-0 space-y-2">
               <div className={`px-4 py-1 border border-current font-bold rounded bg-stone-950 flex items-center h-max
                  ${activeMonster.level === 1 ? 'text-green-500' : activeMonster.level === 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                 Nivel {activeMonster.level}
               </div>
               <div className={`px-3 py-1 font-bold rounded flex items-center text-xs uppercase tracking-widest ${terrainColor}`}>
                 <TerrainIcon className="w-4 h-4 mr-1" /> {currentTerrain}
               </div>
            </div>
          </div>

          <p className="text-lg sm:text-xl text-stone-300 leading-relaxed font-serif italic border-l-4 border-amber-900 pl-6 py-2 bg-stone-800/30 relative z-10 mb-8">
            "{activeMonster.narrative}"
          </p>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-amber-600 uppercase tracking-widest flex items-center"><Dices className="w-4 h-4 mr-2" /> ¿Cómo procedes, Brujo?</p>
            </div>
            
            {isShuffling ? (
              <div className="flex justify-center items-center h-48 bg-stone-800 border border-stone-700">
                 <Dices className="w-8 h-8 text-amber-600 animate-spin mr-3" />
                 <span className="text-amber-600 font-serif animate-pulse text-lg">Analizando opciones al azar...</span>
              </div>
            ) : (
              generatedOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => { setSelectedOption(option); setView('outcome'); }}
                  className="w-full text-left p-5 bg-stone-800 border border-stone-600 hover:bg-stone-700 hover:border-amber-500 text-stone-200 transition-all duration-200 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-900/0 via-amber-900/10 to-amber-900/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-start">
                    <span className="text-amber-500 font-bold mr-4 border border-amber-800/50 rounded px-2 py-0.5 bg-stone-900 flex-shrink-0">{index + 1}</span>
                    <span className="font-serif text-lg">{option.text}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOutcome = () => {
    if (!selectedOption || selectedMonsterIndex === null) return null;
    let resultColor, ResultIcon, resultTitle;
    switch(selectedOption.type) {
      case 'good': resultColor = 'text-green-500'; ResultIcon = Zap; resultTitle = 'Maniobra Exitosa'; break;
      case 'bad': resultColor = 'text-red-500'; ResultIcon = AlertTriangle; resultTitle = 'Error Táctico'; break;
      default: resultColor = 'text-yellow-500'; ResultIcon = Shield; resultTitle = 'Choque Estándar';
    }
    const activeMonster = activeMonsters[selectedMonsterIndex];

    return (
      <div className="w-full max-w-2xl mx-auto relative px-2 sm:px-4 pb-10 mt-4">
        <button 
          onClick={() => { setView('event'); setSelectedOption(null); }} 
          className="flex items-center text-amber-600 hover:text-amber-400 mb-10 transition-colors group px-2 font-bold uppercase tracking-widest text-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a las opciones
        </button>

        <div className="text-center p-8 sm:p-10 bg-stone-900 border-t-4 border-b-4 border-stone-700 shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-950 p-3 rounded-full border-2 border-stone-700">
            <ResultIcon className={`w-10 h-10 ${resultColor}`} />
          </div>

          <h3 className={`text-2xl font-serif uppercase tracking-widest mt-6 mb-6 ${resultColor}`}>{resultTitle}</h3>
          
          <div className="bg-stone-950/80 p-6 rounded border border-stone-800 shadow-inner mb-6 relative">
            <span className="absolute -top-3 left-4 bg-stone-900 px-2 text-xs text-stone-500 uppercase tracking-widest font-bold">Narrativa del Evento</span>
            <p className="text-xl text-stone-200 leading-relaxed font-serif mt-2 mb-4">{selectedOption.narrativeText}</p>
            <div className={`p-3 bg-stone-900 border ${resultColor === 'text-green-500' ? 'border-green-900/50' : resultColor === 'text-red-500' ? 'border-red-900/50' : 'border-yellow-900/50'} rounded flex items-start`}>
               <Dices className={`w-5 h-5 mr-2 flex-shrink-0 mt-0.5 ${resultColor}`} />
               <p className={`text-sm text-left font-bold ${resultColor}`}>{selectedOption.mechanicText}</p>
            </div>
          </div>

          <div className="bg-amber-950/20 p-6 rounded border border-amber-900/50 shadow-inner mb-10 relative">
            <span className="absolute -top-3 left-4 bg-stone-900 px-2 text-xs text-amber-600 uppercase tracking-widest font-bold">Aplica esta regla de la carta</span>
            <p className="text-lg text-amber-200 leading-relaxed font-serif mt-2 font-medium">"{activeMonster.ability}"</p>
          </div>

          <div className="pt-8 border-t border-stone-800">
            <p className="text-stone-400 italic mb-6 text-sm">Resuelve el combate en el tablero físico y registra el resultado final:</p>
            <div className="flex flex-col gap-3">
               <button onClick={() => { setCombatOutcome('victory'); setView('combatResolution'); }} className="px-6 py-4 bg-red-950/80 border border-red-700 text-red-400 hover:bg-red-900 hover:text-white transition-all font-bold uppercase tracking-wider rounded flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                 <Skull className="w-5 h-5 mr-3" /> ¡Monstruo Derrotado!
               </button>
               <button onClick={() => { setCombatOutcome('fled'); setView('combatResolution'); }} className="px-6 py-4 bg-cyan-950/30 border border-cyan-900 text-cyan-500 hover:bg-cyan-900 hover:text-white transition-all font-bold uppercase tracking-wider rounded flex items-center justify-center">
                 <Wind className="w-5 h-5 mr-3" /> Monstruo Ahuyentado
               </button>
               <button onClick={() => { setCombatOutcome('defeat'); setView('combatResolution'); }} className="px-6 py-4 bg-stone-800 border border-stone-600 text-stone-300 hover:bg-stone-700 hover:text-white transition-all font-bold uppercase tracking-wider rounded flex items-center justify-center">
                 <AlertTriangle className="w-5 h-5 mr-3" /> Derrota Absoluta
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCombatResolution = () => {
    let title, iconColor, content;

    if (combatOutcome === 'victory') {
      title = "Monstruo Derrotado";
      iconColor = "text-green-500";
      content = (
        <ul className="text-stone-300 text-left space-y-4 list-none">
          <li className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">Ganas&nbsp;<strong>2 de Oro</strong>.</div>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">Sube 1 en el Marcador de Trofeo y&nbsp;<strong>sufre Fatiga</strong>&nbsp;(destruye cartas).</div>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">Desliza la Carta de Monstruo bajo tu Tablero de Jugador (Trofeo).</div>
          </li>
        </ul>
      );
    } else if (combatOutcome === 'fled') {
      title = "Monstruo Ahuyentado";
      iconColor = "text-cyan-500";
      content = (
        <ul className="text-stone-300 text-left space-y-4 list-none">
          <li className="flex items-start">
            <Info className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">Condición:&nbsp;Quedaste Noqueado pero al Monstruo le quedaba&nbsp;<strong>0 o 1 carta</strong>&nbsp;en su Reserva.</div>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">Ganas&nbsp;<strong>2 de Oro</strong>.</div>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">Añade una Carta de Acción de&nbsp;<strong>coste 0</strong>&nbsp;a tu mano.</div>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">Descarta la Carta y la Ficha del Monstruo de tu mesa.</div>
          </li>
        </ul>
      );
    } else {
      title = "Derrota Absoluta";
      iconColor = "text-red-500";
      content = (
        <ul className="text-stone-300 text-left space-y-4 list-none">
          <li className="flex items-start">
            <Info className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">Condición:&nbsp;Quedaste Noqueado y al Monstruo le quedaban&nbsp;<strong>2 o más cartas</strong>.</div>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">Toma 1&nbsp;<strong>Ficha de Rastro</strong>&nbsp;del terreno del monstruo (si no tienes una).</div>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">Añade una Carta de Acción de&nbsp;<strong>coste 0</strong>&nbsp;a tu pila de descartes.</div>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1"><strong>Penalización:</strong>&nbsp;En este Turno, solo puedes robar hasta 2 cartas en la Fase III.</div>
          </li>
        </ul>
      );
    }

    return (
      <div className="w-full max-w-2xl mx-auto relative px-2 sm:px-4 pb-10 mt-4">
        <button 
          onClick={() => { setView('outcome'); setCombatOutcome(null); }} 
          className="flex items-center text-amber-600 hover:text-amber-400 mb-6 transition-colors group px-2 font-bold uppercase tracking-widest text-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver
        </button>

        <div className="text-center p-8 sm:p-10 bg-stone-900 border-t-4 border-b-4 border-stone-700 shadow-2xl relative">
          <h3 className={`text-2xl sm:text-3xl font-serif uppercase tracking-widest mt-2 mb-8 ${iconColor}`}>{title}</h3>
          
          <div className="bg-stone-950/50 p-6 sm:p-8 rounded border border-stone-800 shadow-inner mb-8">
            {content}
          </div>

          <div className="bg-stone-800 p-6 rounded border border-stone-700 shadow-inner mb-8 text-left">
            <h4 className="text-stone-400 font-bold uppercase tracking-widest text-xs mb-4">Reglas Universales (Todos los Resultados)</h4>
            <ul className="text-stone-300 text-sm space-y-2 list-disc pl-5 marker:text-stone-500">
              <li><div className="flex-1">Baraja las Cartas de Combate de Monstruo.</div></li>
              <li><div className="flex-1">Baraja todas tus Cartas de Acción (mazo, descartes y mano) para formar un nuevo mazo.</div></li>
              <li><div className="flex-1">Sube tu nivel de Escudo hasta tu nivel de Defensa.</div></li>
            </ul>
          </div>

          <button 
            onClick={resolveBoardUpdate}
            className="w-full px-6 py-4 bg-amber-600 border border-amber-500 text-stone-950 hover:bg-amber-500 transition-all font-bold uppercase tracking-wider rounded flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5 mr-3" /> Aceptar y Actualizar Tablero
          </button>
        </div>
      </div>
    );
  };

  const renderWitcherCombatSelect = () => {
    return (
      <div className="w-full max-w-2xl mx-auto relative px-2 sm:px-4 pb-10 mt-4">
        <button 
          onClick={() => setView('board')} 
          className="flex items-center text-amber-600 hover:text-amber-400 mb-6 transition-colors group px-2 font-bold uppercase tracking-widest text-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Cancelar y Volver al Tablero
        </button>

        <div className="text-center p-8 sm:p-10 bg-stone-900 border-t-4 border-b-4 border-stone-700 shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-950 p-3 rounded-full border-2 border-stone-700">
            <Swords className="w-10 h-10 text-stone-300" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif uppercase tracking-widest mt-6 mb-2 text-stone-200">Lucha Entre Brujos</h3>
          <p className="text-stone-400 text-sm mb-6">Elige el resultado del combate en la mesa.</p>

          <div className="bg-amber-950/30 border border-amber-700/50 p-4 rounded mb-8 text-left shadow-inner flex items-start">
            <Coins className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1 animate-pulse" />
            <div>
              <h4 className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-1">Fase de Apuestas (Espectadores)</h4>
              <p className="text-stone-300 text-sm">
                ¡Antes de comenzar a cruzar espadas! Los demás jugadores en la mesa pueden <strong>apostar Oro</strong> por el Brujo que creen que ganará este duelo.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
             <button onClick={() => { setWitcherCombatWinner('attacker'); setView('witcherCombatResolution'); }} className="p-6 bg-stone-800 border-2 border-amber-700 text-amber-500 hover:bg-stone-700 hover:text-amber-400 transition-all rounded shadow-lg text-left group">
               <div className="flex items-center">
                 <UserCheck className="w-8 h-8 mr-4 text-amber-600 group-hover:scale-110 transition-transform" />
                 <div>
                   <p className="font-bold uppercase tracking-wider text-lg">Ganó el Atacante</p>
                   <p className="text-stone-400 text-xs mt-1">(El Jugador que inició el combate en su Turno Activo)</p>
                 </div>
               </div>
             </button>
             
             <button onClick={() => { setWitcherCombatWinner('defender'); setView('witcherCombatResolution'); }} className="p-6 bg-stone-800 border-2 border-cyan-700 text-cyan-500 hover:bg-stone-700 hover:text-cyan-400 transition-all rounded shadow-lg text-left group">
               <div className="flex items-center">
                 <UserX className="w-8 h-8 mr-4 text-cyan-600 group-hover:scale-110 transition-transform" />
                 <div>
                   <p className="font-bold uppercase tracking-wider text-lg">Ganó el Defensor</p>
                   <p className="text-stone-400 text-xs mt-1">(El Jugador que fue atacado y no está en su turno)</p>
                 </div>
               </div>
             </button>
          </div>
        </div>
      </div>
    );
  };

  const renderWitcherCombatResolution = () => {
    return (
      <div className="w-full max-w-4xl mx-auto relative px-2 sm:px-4 pb-10 mt-4">
        <button 
          onClick={() => { setView('witcherCombatSelect'); setWitcherCombatWinner(null); }} 
          className="flex items-center text-amber-600 hover:text-amber-400 mb-6 transition-colors group px-2 font-bold uppercase tracking-widest text-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver a la selección
        </button>

        <div className="text-center p-6 sm:p-10 bg-stone-900 border-t-4 border-b-4 border-stone-700 shadow-2xl relative">
          <h3 className={`text-2xl sm:text-3xl font-serif uppercase tracking-widest mt-2 mb-8 ${witcherCombatWinner === 'attacker' ? 'text-amber-500' : 'text-cyan-500'}`}>
            Victoria del {witcherCombatWinner === 'attacker' ? 'Atacante' : 'Defensor'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className={`bg-stone-950/50 p-6 rounded border shadow-inner text-left ${witcherCombatWinner === 'attacker' ? 'border-amber-900/50' : 'border-cyan-900/50'}`}>
              <h4 className={`font-bold uppercase tracking-widest text-sm mb-4 flex items-center ${witcherCombatWinner === 'attacker' ? 'text-amber-500' : 'text-cyan-500'}`}>
                 <CheckCircle2 className="w-5 h-5 mr-2" /> Recompensas del Ganador
              </h4>
              <ul className="text-stone-300 text-sm space-y-3 list-none">
                {witcherCombatWinner === 'attacker' && (
                  <>
                    <li className="flex items-start"><Sparkles className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" /><div className="flex-1">Obtienes <strong>1 Trofeo</strong> del oponente (Si no tenías uno de esa Escuela).</div></li>
                    <li className="flex items-start"><Sparkles className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" /><div className="flex-1">Sube 1 en el Marcador de Trofeo y <strong>sufre Fatiga</strong> (destruye cartas).</div></li>
                  </>
                )}
                <li className="flex items-start"><Coins className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" /><div className="flex-1">Ganas <strong>Oro</strong> igual al valor indicado al lado de la ficha de reputación del Perdedor en el marcador de trofeos.</div></li>
                {witcherCombatWinner === 'attacker' ? (
                  <li className="flex items-start"><ScrollText className="w-4 h-4 text-stone-400 mr-2 flex-shrink-0 mt-0.5" /><div className="flex-1">Fase III: Robas cartas de forma normal (hasta 3).</div></li>
                ) : (
                  <li className="flex items-start"><ScrollText className="w-4 h-4 text-stone-400 mr-2 flex-shrink-0 mt-0.5" /><div className="flex-1">Inmediatamente: Barajas tu mazo y <strong>robas hasta 4 cartas</strong>.</div></li>
                )}
              </ul>
            </div>

            <div className="bg-red-950/20 p-6 rounded border border-red-900/50 shadow-inner text-left">
              <h4 className="text-red-500 font-bold uppercase tracking-widest text-sm mb-4 flex items-center">
                 <AlertTriangle className="w-5 h-5 mr-2" /> Penalizaciones del Perdedor
              </h4>
              <ul className="text-stone-300 text-sm space-y-3 list-none">
                <li className="flex items-start"><X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" /><div className="flex-1">Añade una Carta de Acción de <strong>coste 0 a tu pila de descartes</strong>.</div></li>
                {witcherCombatWinner === 'defender' ? (
                  <li className="flex items-start"><X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" /><div className="flex-1">Fase III del Turno: Robas 1 carta menos <strong>(máximo 2 cartas)</strong>.</div></li>
                ) : (
                  <li className="flex items-start"><X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" /><div className="flex-1">Inmediatamente: Barajas tu mazo y <strong>robas 3 cartas</strong> (en vez de 4).</div></li>
                )}
              </ul>
            </div>
          </div>

          <div className="bg-stone-800 p-6 rounded border border-stone-700 shadow-inner mb-8 text-left">
            <h4 className="text-stone-400 font-bold uppercase tracking-widest text-xs mb-4">Reglas Universales y Apuestas</h4>
            <ul className="text-stone-300 text-sm space-y-2 list-disc pl-5 marker:text-stone-500">
              <li><div className="flex-1">Ambos Brujos suben su nivel de Escudo hasta su nivel de Defensa.</div></li>
              <li><div className="flex-1">Ambos Brujos barajan todas sus Cartas de Acción (mazo, descartes y mano) para formar un nuevo mazo.</div></li>
              <li><div className="flex-1">Coloca la ficha de <strong>Taberna Cerrada</strong> en esta Localización.</div></li>
              <li className="mt-4"><div className="flex-1 text-yellow-500"><strong>Resolución de Apuestas (Espectadores):</strong> Si alguien apostó por el ganador, recupera su Oro apostado y gana una cantidad de Oro idéntica a la que ganó el Brujo vencedor. Los que apostaron al perdedor, pierden su Oro a la banca.</div></li>
            </ul>
          </div>

          <button 
            onClick={() => setView('board')}
            className="w-full sm:w-auto mx-auto px-8 py-4 bg-stone-700 border border-stone-500 text-stone-200 hover:bg-stone-600 transition-all font-bold uppercase tracking-wider rounded flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5 mr-3" /> Terminar Resolución y Volver
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans flex flex-col selection:bg-amber-900 selection:text-white">
      {renderResetModal()}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      
      <header className="border-b border-stone-800 bg-stone-900/80 backdrop-blur p-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center cursor-pointer group" onClick={() => view !== 'setup' && setShowResetModal(true)}>
            <div className="w-10 h-10 rounded-full bg-amber-900/50 border-2 border-amber-600 flex items-center justify-center mr-3 group-hover:bg-amber-800/50 transition-colors shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <span className="text-amber-500 font-serif font-bold text-xl">W</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-amber-600 font-serif tracking-widest uppercase text-sm font-bold leading-tight group-hover:text-amber-400 transition-colors">El Viejo Mundo</span>
              <span className="text-stone-500 text-xs tracking-widest uppercase">Compendio del Brujo</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 sm:p-8 relative z-0 min-h-[85vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-center"
          >
            {view === 'setup' && renderSetup()}
            {view === 'playerSetup' && renderPlayerSetup()}
            {view === 'board' && renderBoard()}
            {view === 'event' && renderEvent()}
            {view === 'outcome' && renderOutcome()}
            {view === 'combatResolution' && renderCombatResolution()}
            {view === 'witcherCombatSelect' && renderWitcherCombatSelect()}
            {view === 'witcherCombatResolution' && renderWitcherCombatResolution()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
