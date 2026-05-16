import React, { useState } from "react";
import {
  Sword,
  Swords,
  Skull,
  ScrollText,
  ArrowLeft,
  Dices,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  X,
  Wind,
  Info,
  CheckCircle2,
  UserX,
  UserCheck,
  Coins,
  MapPin,
  RefreshCw,
  Target,
  Zap,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  SETUP_RESOURCES,
  FIXED_TERRAINS,
  GOOD_CONSEQUENCES,
  BAD_CONSEQUENCES,
  NEUTRAL_CONSEQUENCES,
} from "./data";
import {
  getMonsterStyle,
  getTerrainStyle,
  getRandomLocation,
  getRandomWeaknessLocation,
  shuffleArray,
  drawMonster,
  resetUsedMonsters,
} from "./utils";
import { Monster, EventOption } from "./types";

import { MONSTER_IMAGES } from "./monsterImages";
import { MONSTER_DECISIONS } from "./monsterDecisions";

export default function App() {
  const [view, setView] = useState("setup");
  const [playerCount, setPlayerCount] = useState(1);
  const [activeMonsters, setActiveMonsters] = useState<Monster[]>([]);
  const [extraLevel1Pile, setExtraLevel1Pile] = useState(0);

  const [selectedMonsterIndex, setSelectedMonsterIndex] = useState<
    number | null
  >(null);
  const [generatedOptions, setGeneratedOptions] = useState<EventOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<EventOption | null>(
    null,
  );
  const [isShuffling, setIsShuffling] = useState(false);
  const [combatOutcome, setCombatOutcome] = useState<string | null>(null);

  const [showResetModal, setShowResetModal] = useState(false);
  const [dyingIndex, setDyingIndex] = useState<number | null>(null);
  const [fleeingIndex, setFleeingIndex] = useState<number | null>(null);
  const [spawnNotification, setSpawnNotification] = useState<any>(null);

  const [witcherCombatWinner, setWitcherCombatWinner] = useState<string | null>(
    null,
  );
  const [dagonOutcome, setDagonOutcome] = useState<string | null>(null);

  const startGame = (players: number) => {
    setPlayerCount(players);
    let extras = players === 4 ? 1 : players === 5 ? 2 : 0;
    setExtraLevel1Pile(extras);
    setView("playerSetup");
  };

  const confirmStartGame = () => {
    resetUsedMonsters();

    const m1 = drawMonster(1, []);
    m1.activeLocation = getRandomLocation(FIXED_TERRAINS[0]);
    m1.weaknessLocation = getRandomWeaknessLocation(FIXED_TERRAINS[0], [
      m1.activeLocation,
    ]);

    const m2 = drawMonster(1, [m1]);
    m2.activeLocation = getRandomLocation(FIXED_TERRAINS[1]);
    m2.weaknessLocation = getRandomWeaknessLocation(FIXED_TERRAINS[1], [
      m2.activeLocation,
    ]);

    const m3 = drawMonster(1, [m1, m2]);
    m3.activeLocation = getRandomLocation(FIXED_TERRAINS[2]);
    m3.weaknessLocation = getRandomWeaknessLocation(FIXED_TERRAINS[2], [
      m3.activeLocation,
    ]);

    setActiveMonsters([m1, m2, m3]);
    setView("board");
  };

  const confirmResetGame = () => {
    setView("setup");
    setActiveMonsters([]);
    setSpawnNotification(null);
    setDyingIndex(null);
    setFleeingIndex(null);
    setShowResetModal(false);
    resetUsedMonsters();
  };

  const rerollLocation = (index: number) => {
    setActiveMonsters((prev) => {
      const newMonsters = [...prev];
      const monster = newMonsters[index];
      const terrain = FIXED_TERRAINS[index];
      monster.activeLocation = getRandomLocation(
        terrain,
        monster.activeLocation,
      );
      return newMonsters;
    });
  };

  const rerollWeaknessLocation = (index: number) => {
    setActiveMonsters((prev) => {
      const newMonsters = [...prev];
      const monster = newMonsters[index];
      const terrain = FIXED_TERRAINS[index];
      monster.weaknessLocation = getRandomWeaknessLocation(terrain, [
        monster.activeLocation,
        monster.weaknessLocation,
      ]);
      return newMonsters;
    });
  };

  const startMonsterEvent = (index: number) => {
    const monster = activeMonsters[index];
    setSelectedMonsterIndex(index);

    // Check if we have specific data for this monster
    const specificData = MONSTER_DECISIONS[monster.name] || {
      buenas: [],
      estandar: [],
      malas: [],
    };

    const goodPool = specificData.buenas;
    const neutralPool = specificData.estandar;
    const badPool = specificData.malas;

    const goodText =
      goodPool.length > 0
        ? goodPool[Math.floor(Math.random() * goodPool.length)]
        : "Ataque seguro.";
    const neutralText =
      neutralPool.length > 0
        ? neutralPool[Math.floor(Math.random() * neutralPool.length)]
        : "Ataque estándar.";
    const badText =
      badPool.length > 0
        ? badPool[Math.floor(Math.random() * badPool.length)]
        : "Ataque arriesgado.";

    const optionsData: {
      actionText: string;
      type: "good" | "neutral" | "bad";
    }[] = [
      { actionText: goodText, type: "good" },
      { actionText: neutralText, type: "neutral" },
      { actionText: badText, type: "bad" },
    ];

    const shuffledData = shuffleArray(optionsData);

    const newOptions = shuffledData.map((data) => {
      const type = data.type;
      let mechanicText = "";
      let narrativeText = data.actionText;

      if (type === "good")
        mechanicText =
          GOOD_CONSEQUENCES[
            Math.floor(Math.random() * GOOD_CONSEQUENCES.length)
          ];
      else if (type === "bad")
        mechanicText =
          BAD_CONSEQUENCES[Math.floor(Math.random() * BAD_CONSEQUENCES.length)];
      else
        mechanicText =
          NEUTRAL_CONSEQUENCES[
            Math.floor(Math.random() * NEUTRAL_CONSEQUENCES.length)
          ];

      const fullOutcome = `${mechanicText}`;

      return {
        text: data.actionText,
        type,
        outcome: fullOutcome,
        narrativeText: data.actionText,
        mechanicText,
      };
    });

    setGeneratedOptions(newOptions);
    setIsShuffling(true);
    setView("event");
    setTimeout(() => {
      setIsShuffling(false);
    }, 700);
  };

  const cancelEvent = () => {
    setView("board");
    setSelectedMonsterIndex(null);
    setGeneratedOptions([]);
    setSelectedOption(null);
  };

  const resolveBoardUpdate = () => {
    if (selectedMonsterIndex === null) return;

    if (combatOutcome === "victory") {
      setView("board");
      setDyingIndex(selectedMonsterIndex);

      setTimeout(() => {
        const targetTerrain = FIXED_TERRAINS[selectedMonsterIndex];
        let newMonster,
          usedExtraPile = false;
        const activeRemaining = activeMonsters.filter(
          (_, i) => i !== selectedMonsterIndex,
        );

        if (extraLevel1Pile > 0) {
          newMonster = drawMonster(1, activeRemaining);
          setExtraLevel1Pile((prev) => prev - 1);
          usedExtraPile = true;
        } else {
          const nextLevel = Math.min(
            activeMonsters[selectedMonsterIndex].level + 1,
            3,
          );
          newMonster = drawMonster(nextLevel, activeRemaining);
        }

        newMonster.activeLocation = getRandomLocation(targetTerrain);
        newMonster.weaknessLocation = getRandomWeaknessLocation(targetTerrain, [
          newMonster.activeLocation,
        ]);

        const newBoard = [...activeMonsters];
        newBoard[selectedMonsterIndex] = newMonster;
        setActiveMonsters(newBoard);

        setDyingIndex(null);
        setSpawnNotification({
          monster: newMonster,
          usedExtraPile,
          type: "spawn",
        });
        setTimeout(() => setSpawnNotification(null), 4500);
      }, 1500);
    } else if (combatOutcome === "fled") {
      setView("board");
      setFleeingIndex(selectedMonsterIndex);

      setTimeout(() => {
        const currentMonster = activeMonsters[selectedMonsterIndex];
        const targetTerrain = FIXED_TERRAINS[selectedMonsterIndex];
        const activeRemaining = activeMonsters.filter(
          (_, i) => i !== selectedMonsterIndex,
        );

        const newMonster = drawMonster(currentMonster.level, activeRemaining);

        newMonster.activeLocation = getRandomLocation(targetTerrain);
        newMonster.weaknessLocation = getRandomWeaknessLocation(targetTerrain, [
          newMonster.activeLocation,
        ]);

        const newBoard = [...activeMonsters];
        newBoard[selectedMonsterIndex] = newMonster;
        setActiveMonsters(newBoard);

        setFleeingIndex(null);
        setSpawnNotification({
          monster: newMonster,
          usedExtraPile: false,
          type: "flee",
        });
        setTimeout(() => setSpawnNotification(null), 4500);
      }, 1200);
    } else if (combatOutcome === "defeat") {
      setView("board");
      const stayingMonster = activeMonsters[selectedMonsterIndex];
      setSelectedMonsterIndex(null);
      setGeneratedOptions([]);
      setSelectedOption(null);
      setSpawnNotification({
        monster: stayingMonster,
        usedExtraPile: false,
        type: "stay",
      });
      setTimeout(() => setSpawnNotification(null), 4500);
    }
  };

  const renderResetModal = () => {
    if (!showResetModal) return null;
    return (
      <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-stone-950 border-2 border-red-900/60 p-8 sm:p-12 rounded-sm shadow-[0_0_50px_rgba(239,68,68,0.15)] max-w-lg w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900"></div>
          <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
          <h3 className="text-3xl font-display text-red-500 mb-4 uppercase tracking-[0.2em] drop-shadow-md">
            ¿Abandonar Cacería?
          </h3>
          <p className="text-stone-300 text-lg mb-10 leading-relaxed font-serif italic relative z-10 px-4">
            Se perderá todo el progreso del tablero activo y volverás a la
            configuración inicial. ¿Estás seguro de que deseas abandonar la
            senda?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShowResetModal(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowResetModal(false);
                }
              }}
              className="px-8 py-4 bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-stone-800 hover:border-stone-600 rounded-sm uppercase tracking-widest font-bold text-sm cursor-pointer outline-none focus:ring-2 focus:ring-stone-500 transition-all flex-1 text-center"
            >
              Mantener el Rumbo
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={confirmResetGame}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  confirmResetGame();
                }
              }}
              className="px-8 py-4 bg-red-950/40 text-red-500 hover:text-red-400 hover:bg-red-950/80 border border-red-900/50 hover:border-red-500 rounded-sm uppercase tracking-widest font-bold text-sm shadow-[0_0_15px_rgba(220,38,38,0.2)] cursor-pointer outline-none focus:ring-2 focus:ring-red-500 transition-all flex-1 text-center"
            >
              Sí, Abandonar
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSetup = () => (
    <div className="flex flex-col items-center justify-center space-y-10 text-center px-4 max-w-2xl mx-auto py-12">
      <div className="mb-4 relative">
        <div className="relative inline-block mt-4">
          <Sword className="w-28 h-28 text-amber-500 mx-auto mb-8 opacity-90 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)]" />
          <Sparkles className="w-10 h-10 text-amber-300 absolute -top-4 -right-4 animate-pulse drop-shadow-[0_0_10px_rgba(252,211,77,0.8)]" />
        </div>
        <h1 className="text-5xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-500 to-amber-700 tracking-[0.1em] mb-6 font-bold uppercase drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
          El Viejo Mundo
        </h1>
        <p className="text-stone-300 text-xl font-serif italic bg-stone-900/60 backdrop-blur-sm p-6 rounded-sm border-t border-b border-amber-900/50 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          Selecciona la cantidad de brujos. Las reglas y compensaciones de la
          caja base se aplicarán de forma automática.
        </p>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { val: 1, desc: "Solitario. Reglas estándar." },
          { val: 2, desc: "Reglas estándar de reaparición." },
          { val: 3, desc: "Reglas estándar de reaparición." },
          { val: 4, desc: "Pila de Caza: +1 Monstruo Lvl I extra." },
          { val: 5, desc: "Pila de Caza: +2 Monstruos Lvl I extra." },
        ].map((btn) => (
          <div
            key={btn.val}
            role="button"
            tabIndex={0}
            onClick={() => startGame(btn.val)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startGame(btn.val);
              }
            }}
            className={`cursor-pointer focus:outline-none w-full group flex flex-col items-center justify-center p-8 bg-stone-900/80 backdrop-blur-md border-2 border-stone-700 hover:border-amber-500 hover:bg-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-300 shadow-2xl relative overflow-hidden ${btn.val === 5 ? "sm:col-span-2" : ""}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-700/0 via-amber-700/5 to-amber-700/20 group-hover:from-amber-700/10 group-hover:via-amber-700/20 group-hover:to-amber-700/40 transition-colors"></div>
            <span className="relative z-10 text-2xl font-display text-stone-200 group-hover:text-amber-400 font-bold uppercase mb-3 tracking-widest drop-shadow-md pointer-events-none">
              {btn.val} Jugador{btn.val > 1 ? "es" : ""}
            </span>
            <span className="relative z-10 text-xs text-amber-600/80 group-hover:text-amber-500 text-center uppercase tracking-widest font-bold pointer-events-none">
              {btn.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlayerSetup = () => {
    const setupData = SETUP_RESOURCES[playerCount] || SETUP_RESOURCES[1];

    return (
      <div className="w-full max-w-4xl mx-auto relative px-2 sm:px-4 pb-10 mt-4">
        <button
          onClick={() => setView("setup")}
          className="flex items-center text-amber-500 hover:text-amber-300 mb-8 transition-colors group px-4 py-2 font-bold uppercase tracking-widest text-sm drop-shadow-md outline-none focus:ring-2 focus:ring-amber-500 rounded bg-stone-900/50 border border-stone-800 w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          Volver a Selección de Jugadores
        </button>

        <div className="text-center py-10 px-6 sm:px-12 bg-gradient-to-b from-stone-900/90 to-stone-950/90 border-t-[12px] border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative rounded-sm backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-950 p-5 rounded-full border-4 border-stone-700 shadow-[0_0_30px_rgba(0,0,0,0.9)] z-10 text-stone-400">
            <UserCheck className="w-14 h-14" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-display text-amber-500 mb-6 mt-8 uppercase tracking-widest drop-shadow-lg relative z-10">
            Preparación de la Mesa
          </h2>
          <p className="text-stone-300 text-lg mb-12 font-serif italic relative z-10">
            Distribuye el oro y las cartas iniciales exactamente según el orden
            de turno oficial.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-10">
            {setupData.map((data, i) => (
              <div
                key={i}
                className={`bg-stone-900 border border-stone-700 p-6 rounded-sm flex items-center justify-between shadow-xl transition-all duration-300 hover:border-amber-600/50 hover:bg-stone-900/80 ${playerCount === 5 && i === 4 ? "md:col-span-2 md:w-1/2 md:mx-auto" : ""}`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold font-serif text-xl mr-5 shadow-inner ${i === 0 ? "bg-amber-950/50 border-amber-600 text-amber-400" : "bg-stone-800 border-stone-600 text-stone-400"}`}
                  >
                    {i + 1}
                  </div>
                  <div className="text-left">
                    <p
                      className={`font-bold uppercase tracking-widest text-base drop-shadow-sm ${i === 0 ? "text-amber-500" : "text-stone-200"}`}
                    >
                      {i === 0 ? "Jugador Inicial" : `Jugador ${i + 1}`}
                    </p>
                    <p className="text-stone-500 text-sm mt-1 font-serif italic">
                      {playerCount === 1
                        ? "Lobo Solitario"
                        : `Empieza su turno ${i + 1}º`}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-yellow-500 font-bold text-base flex items-center justify-end">
                    <Coins className="w-4 h-4 mr-2" /> {data.gold} Oro
                  </p>
                  <p className="text-stone-300 text-base flex items-center justify-end">
                    <ScrollText className="w-4 h-4 mr-2 text-stone-400" />{" "}
                    {data.cards} Cartas
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-amber-950/60 to-transparent border-l-4 border-amber-700 p-8 rounded-r-sm mb-12 text-left shadow-2xl relative z-10">
            <h4 className="text-amber-500 font-bold uppercase tracking-widest text-lg mb-4 flex items-center drop-shadow-sm">
              <AlertTriangle className="w-6 h-6 mr-3" /> Recordatorio de Reglas
            </h4>
            <ul className="text-stone-300 text-lg space-y-4 list-none tracking-wide font-serif italic">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-amber-700 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  Todos los jugadores deben tener su mazo de 10 cartas
                  específico de su Escuela.
                </div>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-amber-700 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  Coloca todos tus marcadores de atributos en el{" "}
                  <strong>Nivel 1</strong> de tu tablero.
                </div>
              </li>
              {(playerCount === 4 || playerCount === 5) && (
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-amber-700 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">
                    Empezando por el Jugador Inicial y en sentido horario, cada
                    jugador elige <strong>un Atributo</strong> (puede ser la
                    Especialidad) y lo sube a <strong>Nivel 2</strong>.
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={confirmStartGame}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                confirmStartGame();
              }
            }}
            className="witcher-button-primary inline-flex text-lg px-12 py-5"
          >
            <Sword className="w-6 h-6 mr-4 group-hover:rotate-12 transition-transform pointer-events-none" />
            <span className="pointer-events-none">Comenzar la Cacería</span>
          </div>
        </div>
      </div>
    );
  };

  const renderBoard = () => (
    <div className="w-full max-w-5xl mx-auto relative pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 px-4 border-b border-amber-900/50 pb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-900/10 to-transparent bottom-0 h-full pointer-events-none"></div>
        <div className="text-center sm:text-left mb-4 sm:mb-0 relative z-10 w-full sm:w-auto">
          <h2 className="text-3xl sm:text-4xl font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 uppercase tracking-widest flex items-center justify-center sm:justify-start drop-shadow-md">
            <Skull className="w-8 h-8 mr-4 text-amber-500 drop-shadow-md" />{" "}
            Rastros Activos
          </h2>
          <p className="text-stone-300 text-sm mt-3 font-serif italic tracking-wide">
            Partida:{" "}
            {playerCount <= 3
              ? playerCount === 1
                ? "Solitario"
                : "1-3 Jugadores"
              : `${playerCount} Jugadores`}
            .
            {extraLevel1Pile > 0 && (
              <span className="text-amber-500 font-bold ml-2">
                ({extraLevel1Pile} Nivel I Extra en Reserva)
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowResetModal(true)}
          className="flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-stone-900/80 backdrop-blur-sm border border-stone-700 text-stone-300 hover:text-red-400 hover:border-red-900 hover:bg-red-950/40 transition-all rounded shadow-md relative z-10"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Reiniciar Cacería
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-20 max-w-6xl mx-auto">
        {activeMonsters.map((monster, index) => {
          const slotTerrain = FIXED_TERRAINS[index];
          const {
            icon: TerrainIcon,
            color: terrainColor,
            bg: terrainBg,
            label: terrainLabel,
            bgImage,
          } = getTerrainStyle(slotTerrain);
          const {
            icon: MonsterIcon,
            color: iconColor,
            bg: bgColor,
          } = getMonsterStyle(monster.type);
          const isDying = dyingIndex === index;
          const isFleeing = fleeingIndex === index;

          return (
            <div
              key={`${monster.id}-${index}`}
              className="flex flex-col w-full h-full"
            >
              {/* Cabecera Constante de Locación */}
              <div
                className={`flex items-center justify-center h-28 mb-3 rounded-xl shadow-2xl z-10 relative overflow-hidden border border-stone-800 ${!bgImage ? terrainBg : "bg-stone-900"}`}
                style={
                  bgImage
                    ? {
                        backgroundImage: `url('${bgImage}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}
                }
              >
                {bgImage && (
                  <div className="absolute inset-0 bg-stone-950/60 transition-opacity duration-300 hover:bg-stone-950/40"></div>
                )}
                <div className="relative z-10 flex items-center transform scale-105">
                  <TerrainIcon
                    className={`w-7 h-7 mr-3 ${terrainColor}`}
                    style={{
                      filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.9))",
                    }}
                  />
                  <span
                    className={`font-serif font-bold uppercase tracking-[0.2em] text-lg ${terrainColor}`}
                    style={{ textShadow: "0px 4px 6px rgba(0,0,0,0.9)" }}
                  >
                    {terrainLabel}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-900/50 to-transparent"></div>
              </div>

              {/* RASTRO DE DEBILIDAD */}
              <div className="flex items-center justify-between bg-stone-900/80 backdrop-blur-sm border border-stone-800 rounded-xl p-4 mb-4 shadow-lg relative overflow-hidden group transition-all hover:border-cyan-900/50 z-10">
                <div className="absolute -left-4 -top-4 w-20 h-20 bg-cyan-900/10 rounded-full blur-2xl pointer-events-none transition-all group-hover:bg-cyan-800/20"></div>

                <div className="flex items-center relative z-10">
                  <div className="w-10 h-10 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center mr-3 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Target className="w-5 h-5 text-cyan-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div className="text-left flex flex-col">
                    <span className="text-[10px] text-stone-500 uppercase tracking-[0.2em] font-bold mb-1">
                      Debilidad
                    </span>
                    <span className="text-sm font-bold text-stone-300 tracking-wide">
                      {monster.weaknessLocation}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    rerollWeaknessLocation(index);
                  }}
                  className="p-2 text-stone-600 hover:text-cyan-500 transition-colors"
                  title="Cambiar localización de debilidad"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() =>
                  !isDying && !isFleeing && startMonsterEvent(index)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!isDying && !isFleeing) startMonsterEvent(index);
                  }
                }}
                className={`cursor-pointer focus:outline-none relative overflow-hidden flex flex-col items-center justify-end text-center border-l-2 border-r-2 border-t-2 border-b-4 transition-all duration-700 h-[400px] group rounded-xl flex-1 shadow-2xl bg-stone-900 bg-cover bg-center
                  ${isDying ? "border-red-900 grayscale opacity-40 scale-95 pointer-events-none" : ""}
                  ${isFleeing ? "opacity-0 translate-x-20 pointer-events-none" : ""}
                  ${!isDying && !isFleeing ? "border-stone-800 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]" : ""}
                `}
                style={{
                  backgroundImage: `url(${MONSTER_IMAGES[monster.id] || MONSTER_IMAGES["arachas"]})`,
                }}
              >
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-950/20 group-hover:via-stone-950/70 transition-all duration-500"></div>

                {isDying && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <X
                      className="w-32 h-32 text-red-600 animate-ping opacity-80"
                      strokeWidth={3}
                    />
                  </div>
                )}
                {isFleeing && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Wind className="w-24 h-24 text-stone-500 opacity-80" />
                  </div>
                )}

                <div
                  className={`absolute top-0 left-0 px-4 py-1.5 text-[10px] font-bold border-r border-b border-stone-800 rounded-br uppercase tracking-widest z-20
                  ${monster.level === 1 ? "bg-stone-950 text-green-600" : monster.level === 2 ? "bg-stone-950 text-yellow-600" : "bg-stone-950 text-red-600"}`}
                >
                  Nivel {monster.level}
                </div>

                <div className="absolute top-0 right-0 flex items-center bg-stone-950/90 backdrop-blur-sm border-l border-b border-stone-800 rounded-bl z-20 overflow-hidden">
                  <div className="px-3 py-1.5 flex items-center text-[10px] font-bold text-stone-300 uppercase tracking-widest">
                    <MapPin className="w-3 h-3 mr-1.5 text-amber-500" />
                    {monster.activeLocation}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      rerollLocation(index);
                    }}
                    className="px-2 py-1.5 bg-stone-900/80 hover:bg-amber-900/40 text-stone-500 hover:text-amber-500 border-l border-stone-800 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>

                <div className="relative z-10 w-full p-6 flex flex-col items-center">
                  <div
                    className={`p-4 rounded-full ${bgColor} border-2 border-stone-800 mb-4 group-hover:scale-110 transition-transform duration-700 shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md bg-opacity-70 flex flex-col items-center justify-center`}
                  >
                    <MonsterIcon
                      className={`w-10 h-10 ${iconColor} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                    />
                  </div>
                  <h3 className="text-3xl font-display text-white group-hover:text-amber-400 transition-colors uppercase tracking-[0.05em] drop-shadow-md">
                    {monster.name}
                  </h3>
                  <span
                    className={`text-[11px] uppercase tracking-[0.4em] mt-2 ${iconColor} font-bold drop-shadow-lg`}
                  >
                    {monster.type}
                  </span>
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-amber-950/80 border border-amber-500/50 text-amber-500 px-4 py-2 text-xs uppercase tracking-widest rounded-sm font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center">
                    <Swords className="w-4 h-4 mr-2" /> Iniciar Cacería
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 mt-8 pt-8 border-t border-stone-800">
        <div className="flex flex-wrap justify-center gap-4">
          {playerCount > 1 && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setView("witcherCombatSelect")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setView("witcherCombatSelect");
                }
              }}
              className="px-8 py-4 bg-stone-900 border-2 border-stone-700 text-stone-300 hover:border-amber-500 hover:text-amber-500 transition-all uppercase tracking-widest font-bold rounded-lg shadow-lg flex items-center group cursor-pointer outline-none focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <Swords className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform pointer-events-none text-stone-500 group-hover:text-amber-500" />
              <span className="pointer-events-none">Lucha Entre Brujos</span>
            </div>
          )}

          <div
            role="button"
            tabIndex={0}
            onClick={() => setView("dagonCombatSelect")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setView("dagonCombatSelect");
              }
            }}
            className="px-8 py-4 bg-stone-900 border-2 border-stone-700 text-stone-300 hover:border-cyan-500 hover:text-cyan-500 transition-all uppercase tracking-widest font-bold rounded-lg shadow-lg flex items-center group cursor-pointer outline-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <Skull className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform pointer-events-none text-stone-500 group-hover:text-cyan-500" />
            <span className="pointer-events-none">Lucha contra Dagon</span>
          </div>
        </div>
      </div>

      {spawnNotification && (
        <div
          className={`fixed bottom-10 left-1/2 -translate-x-1/2 bg-stone-900 border-2 shadow-[0_0_30px_rgba(0,0,0,0.8)] p-4 px-8 rounded-lg animate-fade-in-up z-50 flex items-center
          ${spawnNotification.type === "stay" ? "border-stone-500 shadow-stone-700/40" : "border-amber-600 shadow-amber-600/40"}`}
        >
          {spawnNotification.type === "stay" ? (
            <Info className="w-8 h-8 text-stone-400 mr-4 animate-pulse" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-amber-500 mr-4 animate-pulse" />
          )}
          <div className="text-left">
            <p
              className={`font-bold uppercase tracking-widest text-sm ${spawnNotification.type === "stay" ? "text-stone-400" : "text-amber-500"}`}
            >
              {spawnNotification.type === "flee" && "El Rastro se Enfría..."}
              {spawnNotification.type === "spawn" && "El Rastro Continúa..."}
              {spawnNotification.type === "stay" && "El Monstruo Permanece..."}
            </p>
            <p className="text-stone-200 font-serif text-lg">
              {spawnNotification.type === "stay" ? (
                <span>
                  <strong className="text-white">
                    {spawnNotification.monster.name}
                  </strong>{" "}
                  recupera toda su vida en{" "}
                  <strong>{spawnNotification.monster.activeLocation}</strong>.
                </span>
              ) : (
                <span>
                  ¡Aparece un{" "}
                  <strong className="text-white">
                    {spawnNotification.monster.name}
                  </strong>{" "}
                  en <strong>{spawnNotification.monster.activeLocation}</strong>
                  !
                </span>
              )}
            </p>
            {spawnNotification.usedExtraPile && (
              <p className="text-stone-400 text-xs italic mt-1">
                Extraído de la Reserva Adicional.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderEvent = () => {
    if (selectedMonsterIndex === null) return null;
    const activeMonster = activeMonsters[selectedMonsterIndex];
    const { icon: MonsterIcon, color: iconColor } = getMonsterStyle(
      activeMonster.type,
    );
    const currentTerrain = FIXED_TERRAINS[selectedMonsterIndex];
    const { icon: TerrainIcon, color: terrainColor } =
      getTerrainStyle(currentTerrain);

    return (
      <div className="w-full max-w-3xl mx-auto relative px-2 sm:px-4 pb-10">
        <button
          onClick={cancelEvent}
          className="flex items-center text-amber-500 hover:text-amber-300 mb-6 transition-colors group px-2 font-bold uppercase tracking-widest text-sm drop-shadow-md outline-none focus:ring-2 focus:ring-amber-500 rounded"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Volver al Tablero
        </button>

        <div
          className="border-4 border-double border-amber-900/60 bg-stone-900 rounded-sm shadow-[0_0_60px_rgba(0,0,0,0.95)] relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(28, 25, 23, 0.98), rgba(28, 25, 23, 0.88)), url(${MONSTER_IMAGES[activeMonster.id] || MONSTER_IMAGES["arachas"]})`,
          }}
        >
          <MonsterIcon
            className={`absolute -right-10 -bottom-10 w-96 h-96 ${iconColor} opacity-5 rotate-12 pointer-events-none drop-shadow-2xl mix-blend-screen transition-transform duration-1000 ease-in-out scale-110`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none"></div>

          <div className="p-6 sm:p-10 relative z-10">
            <div className="flex flex-col sm:flex-row justify-between border-b border-amber-900/40 pb-6 mb-8 relative">
              <div className="relative z-10 w-full">
                <span className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs flex items-center drop-shadow-md mb-2 bg-stone-950/60 px-3 py-1 rounded-sm w-fit border border-amber-900/30">
                  <Sparkles className="w-3 h-3 mr-2 inline text-amber-400" />{" "}
                  Evento de Cacería en {activeMonster.activeLocation}
                </span>
                <h2 className="text-4xl sm:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-700 mt-2 drop-shadow-md leading-tight">
                  {activeMonster.name}
                </h2>
              </div>

              <div className="flex flex-row sm:flex-col items-center sm:items-end mt-4 sm:mt-0 space-x-3 sm:space-x-0 sm:space-y-3 shrink-0">
                <div
                  className={`px-4 py-1.5 border border-current font-bold rounded-sm flex items-center h-max uppercase tracking-widest text-xs shadow-inner backdrop-blur-md
                    ${activeMonster.level === 1 ? "text-green-400 bg-stone-950/90 border-green-900/50" : activeMonster.level === 2 ? "text-yellow-400 bg-stone-950/90 border-yellow-900/50" : "text-red-400 bg-stone-950/90 border-red-900/50"}`}
                >
                  Nivel {activeMonster.level}
                </div>
                <div
                  className={`px-4 py-1.5 font-bold rounded-sm flex items-center text-xs uppercase tracking-widest bg-stone-950/80 backdrop-blur-md border border-stone-800 shadow-inner ${terrainColor}`}
                >
                  <TerrainIcon className="w-4 h-4 mr-2 opacity-80" />{" "}
                  {currentTerrain}
                </div>
              </div>
            </div>

            <div className="relative mb-12 bg-stone-950/40 p-6 rounded-sm border-l-2 border-amber-700/50 shadow-inner">
              <p className="text-lg sm:text-2xl text-stone-200 leading-relaxed font-serif italic">
                "{activeMonster.narrative}"
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6 border-b border-stone-800 pb-2">
                <p className="text-sm text-stone-400 uppercase tracking-widest flex items-center font-bold drop-shadow-md">
                  <Dices className="w-4 h-4 mr-2 text-stone-500" /> ¿Cómo
                  procedes, Brujo?
                </p>
              </div>

              {isShuffling ? (
                <div className="flex justify-center items-center h-56 bg-stone-950/80 border border-amber-900/40 rounded-sm backdrop-blur-md shadow-inner">
                  <Dices className="w-8 h-8 text-amber-500 animate-spin mr-4 drop-shadow-md" />
                  <span className="text-amber-500 font-serif animate-pulse text-2xl tracking-wide">
                    Analizando rastro...
                  </span>
                </div>
              ) : (
                <div className="grid gap-4">
                  {generatedOptions.map((option, index) => (
                    <div
                      role="button"
                      tabIndex={0}
                      key={index}
                      onClick={() => {
                        setSelectedOption(option);
                        setView("outcome");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedOption(option);
                          setView("outcome");
                        }
                      }}
                      className="w-full text-left p-6 sm:p-8 bg-gradient-to-r from-stone-900 via-stone-900/95 to-stone-900/80 border border-stone-700 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-stone-200 transition-all duration-300 relative overflow-hidden group rounded-sm shadow-md backdrop-blur-md cursor-pointer outline-none flex items-center"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-700/10 to-amber-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                      <div className="relative z-10 flex items-center pointer-events-none w-full">
                        <span className="text-amber-500 font-display text-2xl mr-6 px-4 py-2 bg-stone-950 border border-amber-900/50 rounded-sm flex-shrink-0 shadow-inner group-hover:bg-amber-950/30 transition-colors drop-shadow-md">
                          {index + 1}
                        </span>
                        <span className="font-serif text-lg sm:text-xl leading-relaxed text-stone-300 group-hover:text-stone-100 transition-colors">
                          {option.text}
                        </span>
                      </div>
                      <ArrowLeft className="w-5 h-5 text-amber-500/0 group-hover:text-amber-500/50 rotate-180 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none drop-shadow-md" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOutcome = () => {
    if (!selectedOption || selectedMonsterIndex === null) return null;
    let resultColor, ResultIcon, resultTitle, resultGradient, borderColor;
    switch (selectedOption.type) {
      case "good":
        resultColor = "text-green-500";
        ResultIcon = Zap;
        resultTitle = "Maniobra Exitosa";
        resultGradient = "from-green-950/80 via-green-900/20 to-stone-950";
        borderColor = "border-green-800/80";
        break;
      case "bad":
        resultColor = "text-red-500";
        ResultIcon = AlertTriangle;
        resultTitle = "Error Táctico";
        resultGradient = "from-red-950/80 via-red-900/20 to-stone-950";
        borderColor = "border-red-800/80";
        break;
      default:
        resultColor = "text-amber-500";
        ResultIcon = Shield;
        resultTitle = "Choque Estándar";
        resultGradient = "from-amber-950/60 via-amber-900/10 to-stone-950";
        borderColor = "border-amber-800/60";
    }
    const activeMonster = activeMonsters[selectedMonsterIndex];

    return (
      <div className="w-full max-w-3xl mx-auto relative px-2 sm:px-4 pb-10 mt-4">
        <button
          onClick={() => {
            setView("event");
            setSelectedOption(null);
          }}
          className="flex items-center text-amber-500 hover:text-amber-300 mb-8 transition-colors group px-4 py-2 font-bold uppercase tracking-widest text-sm drop-shadow-md outline-none focus:ring-2 focus:ring-amber-500 rounded bg-stone-900/50 border border-stone-800 w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          Volver a las opciones
        </button>

        <div
          className={`text-center py-10 px-6 sm:px-12 bg-gradient-to-b ${resultGradient} border-t-[12px] border-b-[12px] ${borderColor} shadow-[0_0_50px_rgba(0,0,0,0.8)] relative rounded-sm backdrop-blur-sm overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-950 p-5 rounded-full border-4 ${borderColor} shadow-[0_0_30px_rgba(0,0,0,0.9)] z-20`}
          >
            <ResultIcon
              className={`w-14 h-14 ${resultColor} drop-shadow-[0_0_8px_currentColor]`}
            />
          </div>

          <h3
            className={`text-4xl sm:text-5xl font-display uppercase tracking-widest mt-10 mb-10 ${resultColor} drop-shadow-lg relative z-10`}
          >
            {resultTitle}
          </h3>

          <div className="bg-stone-950/80 p-8 sm:p-10 rounded-sm border border-stone-800 shadow-2xl mb-10 relative z-10 text-left overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-stone-700"></div>
            <span className="inline-block bg-stone-900 px-4 py-1 text-xs text-stone-400 uppercase tracking-[0.2em] font-bold border border-stone-800 rounded-sm mb-4">
              Narrativa del Evento
            </span>
            <p className="text-xl sm:text-2xl text-stone-200 leading-relaxed font-serif mb-8 italic drop-shadow-sm">
              "{selectedOption.narrativeText}"
            </p>
            <div
              className={`p-6 bg-stone-950/90 border-2 ${resultColor === "text-green-500" ? "border-green-900/60 shadow-[0_0_15px_rgba(34,197,94,0.1)]" : resultColor === "text-red-500" ? "border-red-900/60 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-amber-900/60 shadow-[0_0_15px_rgba(245,158,11,0.1)]"} rounded flex items-center`}
            >
              <Dices
                className={`w-8 h-8 mr-5 flex-shrink-0 ${resultColor} animate-pulse`}
              />
              <p
                className={`text-lg sm:text-xl text-left font-bold tracking-wide ${resultColor} drop-shadow-sm`}
              >
                {selectedOption.mechanicText}
              </p>
            </div>
          </div>

          <div className="bg-[#1a1412] p-8 sm:p-10 rounded-sm border-2 border-amber-900/60 shadow-2xl mb-12 relative z-10 text-left overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Skull className="w-24 h-24 text-amber-500" />
            </div>
            <span className="inline-flex items-center bg-amber-950/80 border-amber-800 px-4 py-1.5 text-xs text-amber-400 uppercase tracking-[0.2em] font-bold border rounded-sm mb-4">
              <Sparkles className="w-3 h-3 mr-2" /> Aplica esta regla del
              monstruo
            </span>
            <p className="text-xl sm:text-2xl text-amber-100 leading-relaxed font-serif mt-2 font-medium relative z-10 drop-shadow-md">
              "{activeMonster.ability}"
            </p>
          </div>

          <div className="pt-10 border-t border-stone-800/80 relative z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 bg-stone-950 text-stone-500 uppercase tracking-widest text-xs font-bold w-max">
              Combate en mesa
            </div>
            <p className="text-stone-300 font-display uppercase tracking-widest mb-8 text-xl drop-shadow-md">
              Resuelve este combate y confirma el resultado:
            </p>
            <div className="grid sm:grid-cols-3 gap-5">
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setCombatOutcome("victory");
                  setView("combatResolution");
                }}
                className="p-6 bg-green-950/30 border-2 border-green-900/50 text-green-500 hover:bg-green-900/60 hover:text-green-100 hover:border-green-400 transition-all font-bold uppercase tracking-widest rounded-sm shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] flex flex-col items-center justify-center group h-36 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 backdrop-blur-sm relative overflow-hidden"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setCombatOutcome("victory");
                    setView("combatResolution");
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent pointer-events-none"></div>
                <Skull className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform pointer-events-none drop-shadow-md relative z-10" />
                <span className="text-sm pointer-events-none relative z-10 drop-shadow-sm">
                  La bestia ha caído
                </span>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setCombatOutcome("fled");
                  setView("combatResolution");
                }}
                className="p-6 bg-cyan-950/30 border-2 border-cyan-900/50 text-cyan-500 hover:bg-cyan-900/60 hover:text-cyan-100 hover:border-cyan-400 transition-all font-bold uppercase tracking-widest rounded-sm flex flex-col items-center justify-center group h-36 shadow-[0_0_15px_rgba(8,145,178,0.15)] hover:shadow-[0_0_25px_rgba(8,145,178,0.3)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-sm relative overflow-hidden"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setCombatOutcome("fled");
                    setView("combatResolution");
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent pointer-events-none"></div>
                <Wind className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform pointer-events-none drop-shadow-md relative z-10" />
                <span className="text-sm pointer-events-none relative z-10 drop-shadow-sm">
                  El monstruo huyó del combate
                </span>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setCombatOutcome("defeat");
                  setView("combatResolution");
                }}
                className="p-6 bg-red-950/30 border-2 border-red-900/50 text-red-500 hover:bg-red-900/60 hover:text-red-100 hover:border-red-400 transition-all font-bold uppercase tracking-widest rounded-sm flex flex-col items-center justify-center group h-36 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400 backdrop-blur-sm relative overflow-hidden"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setCombatOutcome("defeat");
                    setView("combatResolution");
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none"></div>
                <AlertTriangle className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform pointer-events-none drop-shadow-md relative z-10" />
                <span className="text-sm pointer-events-none relative z-10 drop-shadow-sm">
                  La bestia te venció
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCombatResolution = () => {
    let title, iconColor, content, gradient, borderColor;

    if (combatOutcome === "victory") {
      title = "Monstruo Derrotado";
      iconColor = "text-green-500";
      gradient = "from-green-950/60 via-green-900/10 to-stone-950";
      borderColor = "border-green-800/80";
      content = (
        <ul className="text-stone-300 text-lg space-y-6 list-none tracking-wide">
          <li className="flex items-start">
            <CheckCircle2 className="w-8 h-8 text-green-500 mr-4 flex-shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <div className="flex-1 leading-relaxed">
              Ganas&nbsp;<strong>2 de Oro</strong>.
            </div>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-8 h-8 text-green-500 mr-4 flex-shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <div className="flex-1 leading-relaxed">
              Sube 1 en el Marcador de Trofeo y&nbsp;
              <strong>sufre Fatiga</strong>&nbsp;(destruye cartas).
            </div>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-8 h-8 text-green-500 mr-4 flex-shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <div className="flex-1 leading-relaxed">
              Desliza la Carta de Monstruo bajo tu Tablero de Jugador (Trofeo).
            </div>
          </li>
        </ul>
      );
    } else if (combatOutcome === "fled") {
      title = "Monstruo Ahuyentado";
      iconColor = "text-cyan-500";
      gradient = "from-cyan-950/60 via-cyan-900/10 to-stone-950";
      borderColor = "border-cyan-800/80";
      content = (
        <ul className="text-stone-300 text-lg space-y-6 list-none tracking-wide">
          <li className="flex items-start bg-cyan-950/20 p-4 rounded-sm border border-cyan-900/50 mb-6 shadow-inner">
            <Info className="w-6 h-6 text-cyan-500 mr-4 flex-shrink-0 mt-1" />
            <div className="flex-1 italic leading-relaxed text-cyan-100">
              Condición:&nbsp;Quedaste Noqueado pero al Monstruo le
              quedaba&nbsp;
              <strong className="text-cyan-400">0 o 1 carta</strong>&nbsp;en su
              Reserva.
            </div>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-8 h-8 text-cyan-500 mr-4 flex-shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <div className="flex-1 leading-relaxed">
              Ganas&nbsp;<strong>2 de Oro</strong>.
            </div>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-8 h-8 text-cyan-500 mr-4 flex-shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <div className="flex-1 leading-relaxed">
              Añade una Carta de Acción de&nbsp;<strong>coste 0</strong>&nbsp;a
              tu mano.
            </div>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="w-8 h-8 text-cyan-500 mr-4 flex-shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <div className="flex-1 leading-relaxed">
              Descarta la Carta y la Ficha del Monstruo de tu mesa.
            </div>
          </li>
        </ul>
      );
    } else {
      title = "Derrota Absoluta";
      iconColor = "text-red-500";
      gradient = "from-red-950/60 via-red-900/10 to-stone-950";
      borderColor = "border-red-800/80";
      content = (
        <ul className="text-stone-300 text-lg space-y-6 list-none tracking-wide">
          <li className="flex items-start bg-red-950/20 p-4 rounded-sm border border-red-900/50 mb-6 shadow-inner">
            <Info className="w-6 h-6 text-red-500 mr-4 flex-shrink-0 mt-1" />
            <div className="flex-1 italic leading-relaxed text-red-100">
              Condición:&nbsp;Quedaste Noqueado y al Monstruo le quedaban&nbsp;
              <strong className="text-red-400">2 o más cartas</strong>.
            </div>
          </li>
          <li className="flex items-start">
            <X className="w-8 h-8 text-red-500 mr-4 flex-shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <div className="flex-1 leading-relaxed">
              Toma 1&nbsp;<strong>Ficha de Rastro</strong>&nbsp;del terreno del
              monstruo (si no tienes una).
            </div>
          </li>
          <li className="flex items-start">
            <X className="w-8 h-8 text-red-500 mr-4 flex-shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <div className="flex-1 leading-relaxed">
              Añade una Carta de Acción de&nbsp;<strong>coste 0</strong>&nbsp;a
              tu pila de descartes.
            </div>
          </li>
          <li className="flex items-start p-4 bg-red-950/40 border-l-4 border-red-600 rounded-r-sm mt-6 shadow-md">
            <AlertTriangle className="w-8 h-8 text-red-500 mr-4 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1 leading-relaxed">
              <strong className="text-red-400">Penalización Crítica:</strong>
              &nbsp;En este Turno, solo puedes robar hasta 2 cartas en la Fase
              III.
            </div>
          </li>
        </ul>
      );
    }

    return (
      <div className="w-full max-w-3xl mx-auto relative px-2 sm:px-4 pb-10 mt-4">
        <button
          onClick={() => {
            setView("outcome");
            setCombatOutcome(null);
          }}
          className="flex items-center text-amber-500 hover:text-amber-300 mb-8 transition-colors group px-4 py-2 font-bold uppercase tracking-widest text-sm drop-shadow-md outline-none focus:ring-2 focus:ring-amber-500 rounded bg-stone-900/50 border border-stone-800 w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          Volver a resultado
        </button>

        <div
          className={`text-center py-10 px-6 sm:px-12 bg-gradient-to-b ${gradient} border-t-[12px] border-b-[12px] ${borderColor} shadow-[0_0_50px_rgba(0,0,0,0.8)] relative rounded-sm backdrop-blur-sm overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-950 p-5 rounded-full border-4 ${borderColor} z-20 shadow-[0_0_30px_rgba(0,0,0,0.9)]`}
          >
            {combatOutcome === "victory" ? (
              <Skull
                className={`w-14 h-14 ${iconColor} drop-shadow-[0_0_8px_currentColor]`}
              />
            ) : combatOutcome === "fled" ? (
              <Wind
                className={`w-14 h-14 ${iconColor} drop-shadow-[0_0_8px_currentColor]`}
              />
            ) : (
              <AlertTriangle
                className={`w-14 h-14 ${iconColor} drop-shadow-[0_0_8px_currentColor]`}
              />
            )}
          </div>

          <h3
            className={`text-5xl sm:text-6xl font-display uppercase tracking-widest mt-10 mb-12 drop-shadow-lg relative z-10 ${iconColor}`}
          >
            {title}
          </h3>

          <div
            className={`bg-stone-950/90 p-8 sm:p-10 rounded-sm border shadow-2xl mb-12 text-left relative z-10 overflow-hidden ${combatOutcome === "victory" ? "border-green-900/60 shadow-[0_0_20px_rgba(34,197,94,0.15)]" : combatOutcome === "fled" ? "border-cyan-900/60 shadow-[0_0_20px_rgba(8,145,178,0.15)]" : "border-red-900/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]"}`}
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              {combatOutcome === "victory" ? (
                <Skull className="w-32 h-32" />
              ) : combatOutcome === "fled" ? (
                <Wind className="w-32 h-32" />
              ) : (
                <AlertTriangle className="w-32 h-32" />
              )}
            </div>
            <h4
              className={`font-display font-bold uppercase tracking-widest text-xl mb-8 flex items-center drop-shadow-sm ${iconColor}`}
            >
              {combatOutcome === "victory" ? (
                <CheckCircle2 className="w-8 h-8 mr-4" />
              ) : combatOutcome === "fled" ? (
                <Wind className="w-8 h-8 mr-4" />
              ) : (
                <AlertTriangle className="w-8 h-8 mr-4" />
              )}
              CONSECUENCIAS
            </h4>
            {content}
          </div>

          <div className="bg-stone-900/80 p-8 sm:p-10 rounded-sm border border-stone-800 shadow-inner mb-12 text-left relative z-10 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-stone-700"></div>
            <h4 className="font-display font-bold uppercase tracking-widest text-base mb-6 text-stone-400 opacity-90 flex items-center underline decoration-stone-700 underline-offset-8">
              Reglas Universales (Todos los Resultados)
            </h4>
            <ul className="text-stone-300 text-lg space-y-3 list-disc pl-6 marker:text-stone-500 font-serif italic">
              <li>
                <div className="flex-1">
                  Baraja las Cartas de Combate de Monstruo.
                </div>
              </li>
              <li>
                <div className="flex-1">
                  Baraja todas tus Cartas de Acción (mazo, descartes y mano)
                  para formar un nuevo mazo.
                </div>
              </li>
              <li>
                <div className="flex-1">
                  Sube tu nivel de Escudo hasta tu nivel de Defensa.
                </div>
              </li>
            </ul>
          </div>

          <div
            onClick={resolveBoardUpdate}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                resolveBoardUpdate();
              }
            }}
            className={`w-full px-12 py-6 mx-auto bg-stone-900 border-2 transition-all duration-300 font-bold uppercase tracking-[0.2em] text-lg rounded-sm flex items-center justify-center shadow-xl group focus:outline-none focus:ring-2 cursor-pointer outline-none relative z-10 overflow-hidden ${combatOutcome === "victory" ? "border-green-700/80 text-green-500 hover:border-green-400 hover:text-green-400 hover:bg-stone-800 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] focus:ring-green-500" : combatOutcome === "fled" ? "border-cyan-700/80 text-cyan-500 hover:border-cyan-400 hover:text-cyan-400 hover:bg-stone-800 hover:shadow-[0_0_25px_rgba(8,145,178,0.4)] focus:ring-cyan-500" : "border-red-700/80 text-red-500 hover:border-red-400 hover:text-red-400 hover:bg-stone-800 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] focus:ring-red-500"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            <RotateCcw className="w-8 h-8 mr-4 group-hover:-rotate-90 transition-transform duration-700 pointer-events-none relative z-10" />
            <span className="pointer-events-none relative z-10">
              Aceptar y Actualizar Tablero
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderWitcherCombatSelect = () => {
    return (
      <div className="w-full max-w-3xl mx-auto relative px-2 sm:px-4 pb-10 mt-4">
        <button
          onClick={() => setView("board")}
          className="flex items-center text-amber-500 hover:text-amber-300 mb-8 transition-colors group px-4 py-2 font-bold uppercase tracking-widest text-sm drop-shadow-md outline-none focus:ring-2 focus:ring-amber-500 rounded bg-stone-900/50 border border-stone-800 w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          Cancelar y Volver al Tablero
        </button>

        <div className="text-center py-10 px-6 sm:px-12 bg-gradient-to-b from-stone-900 to-stone-950 border-t-[12px] border-b-[12px] border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative rounded-sm overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-950 p-5 rounded-full border-4 border-stone-700 shadow-[0_0_30px_rgba(0,0,0,0.9)] z-10">
            <Swords className="w-14 h-14 text-stone-400 drop-shadow-[0_0_8px_currentColor]" />
          </div>

          <h3 className="text-4xl sm:text-5xl font-display uppercase tracking-widest mt-10 mb-4 text-stone-200 drop-shadow-lg relative z-10">
            Lucha Entre Brujos
          </h3>
          <p className="text-stone-400 text-lg sm:text-xl mb-12 font-serif italic relative z-10">
            Elige el resultado del combate en la mesa.
          </p>

          <div className="bg-gradient-to-r from-amber-950/80 to-amber-900/40 border-l-4 border-amber-600 p-6 sm:p-8 rounded-sm mb-12 text-left shadow-2xl flex flex-col sm:flex-row items-center sm:items-start relative z-10">
            <div className="bg-amber-950/80 p-3 flex-shrink-0 rounded-full border border-amber-700/50 mb-4 sm:mb-0 sm:mr-6 shadow-inner">
              <Coins className="w-10 h-10 text-amber-400 animate-pulse drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
            </div>
            <div>
              <h4 className="text-amber-500 font-bold uppercase tracking-widest text-lg mb-3 drop-shadow-sm text-center sm:text-left">
                Fase de Apuestas (Espectadores)
              </h4>
              <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-serif italic text-center sm:text-left">
                ¡Antes de comenzar a cruzar espadas! Los demás jugadores en la
                mesa pueden <strong>apostar Oro</strong> por el Brujo que creen
                que ganará este duelo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                setWitcherCombatWinner("attacker");
                setView("witcherCombatResolution");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setWitcherCombatWinner("attacker");
                  setView("witcherCombatResolution");
                }
              }}
              className="p-8 bg-stone-900 border-2 border-amber-800/60 hover:border-amber-500 text-amber-500 hover:text-amber-400 hover:bg-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-300 rounded-sm shadow-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] text-center group relative overflow-hidden cursor-pointer outline-none flex flex-col items-center justify-center min-h-[220px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-amber-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <UserCheck className="w-16 h-16 mb-4 text-amber-600 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(217,119,6,0.5)] pointer-events-none relative z-10" />
              <p className="font-display font-bold uppercase tracking-widest text-2xl drop-shadow-sm pointer-events-none relative z-10 mb-2">
                Ganó el Atacante
              </p>
              <p className="text-stone-400 text-sm font-serif italic pointer-events-none relative z-10 px-4 leading-relaxed group-hover:text-stone-300 transition-colors">
                (El Jugador que inició el combate en su Turno Activo)
              </p>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                setWitcherCombatWinner("defender");
                setView("witcherCombatResolution");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setWitcherCombatWinner("defender");
                  setView("witcherCombatResolution");
                }
              }}
              className="p-8 bg-stone-900 border-2 border-cyan-800/60 hover:border-cyan-500 text-cyan-500 hover:text-cyan-400 hover:bg-stone-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-300 rounded-sm shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] text-center group relative overflow-hidden cursor-pointer outline-none flex flex-col items-center justify-center min-h-[220px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <UserX className="w-16 h-16 mb-4 text-cyan-600 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(8,145,178,0.5)] pointer-events-none relative z-10" />
              <p className="font-display font-bold uppercase tracking-widest text-2xl drop-shadow-sm pointer-events-none relative z-10 mb-2">
                Ganó el Defensor
              </p>
              <p className="text-stone-400 text-sm font-serif italic pointer-events-none relative z-10 px-4 leading-relaxed group-hover:text-stone-300 transition-colors">
                (El Jugador que fue atacado y no está en su turno)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWitcherCombatResolution = () => {
    return (
      <div className="w-full max-w-4xl mx-auto relative px-2 sm:px-4 pb-10 mt-4">
        <button
          onClick={() => {
            setView("witcherCombatSelect");
            setWitcherCombatWinner(null);
          }}
          className="flex items-center text-amber-500 hover:text-amber-300 mb-8 transition-colors group px-4 py-2 font-bold uppercase tracking-widest text-sm drop-shadow-md outline-none focus:ring-2 focus:ring-amber-500 rounded bg-stone-900/50 border border-stone-800 w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          Volver a la selección
        </button>

        <div
          className={`text-center py-10 px-6 sm:px-12 bg-gradient-to-b ${witcherCombatWinner === "attacker" ? "from-amber-950/60 via-amber-900/10 to-stone-950 border-t-[12px] border-b-[12px] border-amber-800/80 shadow-[0_0_50px_rgba(245,158,11,0.15)]" : "from-cyan-950/60 via-cyan-900/10 to-stone-950 border-t-[12px] border-b-[12px] border-cyan-800/80 shadow-[0_0_50px_rgba(8,145,178,0.15)]"} relative rounded-sm backdrop-blur-sm overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-950 p-5 rounded-full border-4 ${witcherCombatWinner === "attacker" ? "border-amber-700/80 shadow-[0_0_30px_rgba(245,158,11,0.5)]" : "border-cyan-700/80 shadow-[0_0_30px_rgba(8,145,178,0.5)]"} z-20`}
          >
            {witcherCombatWinner === "attacker" ? (
              <UserCheck className="w-14 h-14 text-amber-500 drop-shadow-[0_0_8px_currentColor]" />
            ) : (
              <UserX className="w-14 h-14 text-cyan-500 drop-shadow-[0_0_8px_currentColor]" />
            )}
          </div>

          <h3
            className={`text-5xl sm:text-6xl font-display uppercase tracking-widest mt-10 mb-12 drop-shadow-lg relative z-10 ${witcherCombatWinner === "attacker" ? "text-amber-500" : "text-cyan-500"}`}
          >
            Victoria del{" "}
            {witcherCombatWinner === "attacker" ? "Atacante" : "Defensor"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 relative z-10">
            <div
              className={`bg-stone-950/90 p-8 sm:p-10 rounded-sm border shadow-2xl text-left relative overflow-hidden ${witcherCombatWinner === "attacker" ? "border-amber-900/60 shadow-[0_0_20px_rgba(245,158,11,0.1)]" : "border-cyan-900/60 shadow-[0_0_20px_rgba(8,145,178,0.1)]"}`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <CheckCircle2 className="w-32 h-32" />
              </div>
              <h4
                className={`font-display font-bold uppercase tracking-widest text-xl mb-8 flex items-center drop-shadow-sm ${witcherCombatWinner === "attacker" ? "text-amber-500" : "text-cyan-500"}`}
              >
                <CheckCircle2 className="w-8 h-8 mr-4" /> Recompensas
              </h4>
              <ul className="text-stone-300 text-lg space-y-6 list-none tracking-wide relative z-10">
                {witcherCombatWinner === "attacker" && (
                  <>
                    <li className="flex items-start">
                      <Sparkles className="w-6 h-6 text-amber-500 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                      <div className="flex-1 leading-relaxed">
                        Obtienes <strong>1 Trofeo</strong> del oponente (Si no
                        tenías uno de esa Escuela).
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Sparkles className="w-6 h-6 text-amber-500 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                      <div className="flex-1 leading-relaxed">
                        Sube 1 en el Marcador de Trofeo y{" "}
                        <strong>sufre Fatiga</strong> (destruye cartas).
                      </div>
                    </li>
                  </>
                )}
                <li className="flex items-start">
                  <Coins className="w-6 h-6 text-yellow-500 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                  <div className="flex-1 leading-relaxed">
                    Ganas <strong>Oro</strong> igual al valor indicado al lado
                    de la ficha de reputación del Perdedor en el marcador de
                    trofeos.
                  </div>
                </li>
                {witcherCombatWinner === "attacker" ? (
                  <li className="flex items-start">
                    <ScrollText className="w-6 h-6 text-stone-400 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(156,163,175,0.5)]" />
                    <div className="flex-1 leading-relaxed">
                      Fase III: Robas cartas de forma normal (hasta 3).
                    </div>
                  </li>
                ) : (
                  <li className="flex items-start">
                    <ScrollText className="w-6 h-6 text-stone-400 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(156,163,175,0.5)]" />
                    <div className="flex-1 leading-relaxed">
                      Inmediatamente: Barajas tu mazo y{" "}
                      <strong>robas hasta 4 cartas</strong>.
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-[#1a1412] p-8 sm:p-10 rounded-sm border-2 border-red-900/50 shadow-2xl text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 focus:opacity-10 pointer-events-none transition-opacity">
                <AlertTriangle className="w-32 h-32" />
              </div>
              <h4 className="font-display font-bold uppercase tracking-widest text-xl mb-8 flex items-center text-red-500 drop-shadow-sm">
                <AlertTriangle className="w-8 h-8 mr-4" /> Penalizaciones
              </h4>
              <ul className="text-stone-300 text-lg space-y-6 list-none tracking-wide relative z-10">
                <li className="flex items-start">
                  <X className="w-6 h-6 text-red-500 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)] animate-pulse" />
                  <div className="flex-1 leading-relaxed">
                    Añade una Carta de Acción de{" "}
                    <strong>coste 0 a tu pila de descartes</strong>.
                  </div>
                </li>
                {witcherCombatWinner === "defender" ? (
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-red-500 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                    <div className="flex-1 leading-relaxed">
                      Fase III del Turno: Robas 1 carta menos{" "}
                      <strong>(máximo 2 cartas)</strong>.
                    </div>
                  </li>
                ) : (
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-red-500 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                    <div className="flex-1 leading-relaxed">
                      Inmediatamente: Barajas tu mazo y{" "}
                      <strong>robas 3 cartas</strong> (en vez de 4).
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="bg-stone-900/80 p-8 sm:p-10 rounded-sm border border-stone-800 shadow-inner mb-12 text-left relative z-10 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-stone-700"></div>
            <h4 className="font-display font-bold uppercase tracking-widest text-base mb-6 text-stone-400 opacity-90 flex items-center underline decoration-stone-700 underline-offset-8">
              Reglas Universales y Apuestas
            </h4>
            <ul className="text-stone-300 text-lg space-y-3 list-disc pl-6 marker:text-stone-500 mb-8 font-serif italic">
              <li>
                <div className="flex-1">
                  Ambos Brujos suben su nivel de Escudo hasta su nivel de
                  Defensa.
                </div>
              </li>
              <li>
                <div className="flex-1">
                  Ambos Brujos barajan todas sus Cartas de Acción (mazo,
                  descartes y mano) para formar un nuevo mazo.
                </div>
              </li>
              <li>
                <div className="flex-1">
                  Coloca la ficha de <strong>Taberna Cerrada</strong> en esta
                  Localización.
                </div>
              </li>
            </ul>
            <div className="bg-amber-950/30 p-6 border-l-4 border-amber-700/50 rounded-r-sm">
              <p className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-3 flex items-center">
                <Coins className="w-5 h-5 mr-3 text-yellow-500" />
                Resolución de Apuestas
              </p>
              <p className="text-stone-300 text-base leading-relaxed font-serif italic">
                Si un espectador apostó por el ganador, recupera su Oro apostado
                y gana una cantidad de Oro idéntica a la que ganó el Brujo
                vencedor. Los que apostaron al perdedor pierden su oro.
              </p>
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              setView("board");
              setWitcherCombatWinner(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setView("board");
                setWitcherCombatWinner(null);
              }
            }}
            className={`w-full sm:w-auto px-12 py-6 mx-auto bg-stone-900 border-2 ${witcherCombatWinner === "attacker" ? "border-amber-700/80 text-amber-500 hover:border-amber-400 hover:bg-stone-800" : "border-cyan-700/80 text-cyan-500 hover:border-cyan-400 hover:bg-stone-800"} transition-all duration-300 font-bold uppercase tracking-[0.2em] text-lg rounded-sm flex items-center justify-center shadow-xl hover:shadow-[0_0_25px_currentColor] group focus:outline-none focus:ring-2 ${witcherCombatWinner === "attacker" ? "focus:ring-amber-500" : "focus:ring-cyan-500"} cursor-pointer outline-none relative z-10 overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            <RotateCcw className="w-8 h-8 mr-4 group-hover:-rotate-90 transition-transform duration-700 pointer-events-none relative z-10" />
            <span className="pointer-events-none relative z-10">
              Aceptar y Volver al Tablero
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderDagonCombatSelect = () => {
    return (
      <div className="w-full max-w-4xl mx-auto relative px-2 sm:px-4 pb-10 mt-4">
        <button
          onClick={() => setView("board")}
          className="flex items-center text-stone-400 hover:text-cyan-400 mb-8 transition-colors group px-4 py-2 font-bold uppercase tracking-widest text-sm drop-shadow-md outline-none focus:ring-2 focus:ring-cyan-500 rounded bg-stone-900/50 border border-stone-800 w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          Volver al tablero
        </button>

        <div className="text-center py-10 px-4">
          <h3 className="text-4xl sm:text-5xl font-display uppercase tracking-widest mb-4 text-stone-200 drop-shadow-lg flex justify-center items-center">
            <Skull className="w-10 h-10 mr-4 text-cyan-500" />
            Lucha contra Dagon
          </h3>
          <p className="text-stone-400 text-lg mb-12 font-serif italic relative z-10">
            Confirma el resultado de esta mítica batalla en la mesa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                setDagonOutcome("victory");
                setView("dagonCombatResolution");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setDagonOutcome("victory");
                  setView("dagonCombatResolution");
                }
              }}
              className="p-8 bg-stone-900 border-2 border-green-800/60 hover:border-green-500 text-green-500 hover:text-green-400 hover:bg-stone-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-300 rounded-sm shadow-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] text-center group relative overflow-hidden cursor-pointer outline-none flex flex-col items-center justify-center min-h-[220px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <CheckCircle2 className="w-16 h-16 mb-4 text-green-600 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(22,163,74,0.5)] pointer-events-none relative z-10" />
              <p className="font-display font-bold uppercase tracking-widest text-2xl drop-shadow-sm pointer-events-none relative z-10 mb-2">
                Dagon Ahuyentado
              </p>
              <p className="text-stone-400 text-sm font-serif italic pointer-events-none relative z-10 px-4 leading-relaxed group-hover:text-stone-300 transition-colors">
                Ganaste la pelea, o te derrotó pero le quedaron solo 0 o 1 cartas de vida.
              </p>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                setDagonOutcome("defeat");
                setView("dagonCombatResolution");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setDagonOutcome("defeat");
                  setView("dagonCombatResolution");
                }
              }}
              className="p-8 bg-stone-900 border-2 border-red-800/60 hover:border-red-500 text-red-500 hover:text-red-400 hover:bg-stone-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 rounded-sm shadow-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] text-center group relative overflow-hidden cursor-pointer outline-none flex flex-col items-center justify-center min-h-[220px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-red-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <AlertTriangle className="w-16 h-16 mb-4 text-red-600 group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(220,38,38,0.5)] pointer-events-none relative z-10" />
              <p className="font-display font-bold uppercase tracking-widest text-2xl drop-shadow-sm pointer-events-none relative z-10 mb-2">
                Derrota Total
              </p>
              <p className="text-stone-400 text-sm font-serif italic pointer-events-none relative z-10 px-4 leading-relaxed group-hover:text-stone-300 transition-colors">
                Te derrotó y a Dagon le quedaron 2 o más cartas en su Reserva de Vida.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDagonCombatResolution = () => {
    return (
      <div className="w-full max-w-4xl mx-auto relative px-2 sm:px-4 pb-10 mt-4">
        <button
          onClick={() => {
            setView("dagonCombatSelect");
            setDagonOutcome(null);
          }}
          className="flex items-center text-cyan-500 hover:text-cyan-300 mb-8 transition-colors group px-4 py-2 font-bold uppercase tracking-widest text-sm drop-shadow-md outline-none focus:ring-2 focus:ring-cyan-500 rounded bg-stone-900/50 border border-stone-800 w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          Volver a la selección
        </button>

        <div
          className={`text-center py-10 px-6 sm:px-12 bg-gradient-to-b ${dagonOutcome === "victory" ? "from-green-950/60 via-green-900/10 to-stone-950 border-t-[12px] border-b-[12px] border-green-800/80 shadow-[0_0_50px_rgba(34,197,94,0.15)]" : "from-red-950/60 via-red-900/10 to-stone-950 border-t-[12px] border-b-[12px] border-red-800/80 shadow-[0_0_50px_rgba(239,68,68,0.15)]"} relative rounded-sm backdrop-blur-sm overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-950 p-5 rounded-full border-4 ${dagonOutcome === "victory" ? "border-green-700/80 shadow-[0_0_30px_rgba(22,163,74,0.5)]" : "border-red-700/80 shadow-[0_0_30px_rgba(220,38,38,0.5)]"} z-20`}
          >
            {dagonOutcome === "victory" ? (
              <CheckCircle2 className="w-14 h-14 text-green-500 drop-shadow-[0_0_8px_currentColor]" />
            ) : (
              <AlertTriangle className="w-14 h-14 text-red-500 drop-shadow-[0_0_8px_currentColor]" />
            )}
          </div>

          <h3
            className={`text-4xl sm:text-6xl font-display uppercase tracking-widest mt-10 mb-12 drop-shadow-lg relative z-10 ${dagonOutcome === "victory" ? "text-green-500" : "text-red-500"}`}
          >
            {dagonOutcome === "victory"
              ? "Dagon Ahuyentado"
              : "Derrota Total"}
          </h3>

          <div className="bg-stone-950/90 p-8 sm:p-10 rounded-sm border shadow-2xl text-left relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              {dagonOutcome === "victory" ? (
                <CheckCircle2 className="w-32 h-32" />
              ) : (
                <AlertTriangle className="w-32 h-32" />
              )}
            </div>
            <h4
              className={`font-display font-bold uppercase tracking-widest text-xl mb-8 flex items-center drop-shadow-sm ${dagonOutcome === "victory" ? "text-green-500" : "text-red-500"}`}
            >
              {dagonOutcome === "victory" ? (
                <>
                  <CheckCircle2 className="w-8 h-8 mr-4" /> Recompensas
                </>
              ) : (
                <>
                  <X className="w-8 h-8 mr-4" /> Penalizaciones
                </>
              )}
            </h4>
            <ul className="text-stone-300 text-lg space-y-6 list-none tracking-wide relative z-10">
              {dagonOutcome === "victory" && (
                <>
                  <li className="flex items-start">
                    <Sparkles className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                    <div className="flex-1 leading-relaxed">
                      Se coloca la miniatura de Dagon en la casilla correspondiente del Medidor de Peligro.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Coins className="w-6 h-6 text-yellow-500 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                    <div className="flex-1 leading-relaxed">
                      Ganas <strong>2 de Oro</strong>.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Sparkles className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                    <div className="flex-1 leading-relaxed">
                      Ganas una carta de coste 0 elegida a dedo del grupo de 6 cartas disponibles.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Sparkles className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                    <div className="flex-1 leading-relaxed">
                      Tomas la carta superior del mazo de Cartas de Bonificación de Dagon y la pones con tus Trofeos.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-stone-500 mr-4 flex-shrink-0 mt-1" />
                    <div className="flex-1 leading-relaxed text-stone-400">
                      <strong>Nota:</strong> El Jugador NO avanza en su Medidor de Trofeos ni sufre Fatiga.
                    </div>
                  </li>
                </>
              )}
              {dagonOutcome === "defeat" && (
                <>
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-red-500 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)] animate-pulse" />
                    <div className="flex-1 leading-relaxed">
                      Dagon permanece en la Localización de Dagon (en el Medidor de Peligro).
                    </div>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-red-500 mr-4 flex-shrink-0 mt-1" />
                    <div className="flex-1 leading-relaxed">
                      Ganas la <strong>Ficha de Rastro de Dagon</strong> (si aún no la tenías).
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Sparkles className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                    <div className="flex-1 leading-relaxed">
                      Ganas una carta de coste 0 elegida a dedo del grupo de 6 cartas disponibles.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-red-500 mr-4 flex-shrink-0 mt-1 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                    <div className="flex-1 leading-relaxed">
                      Durante la Fase III de este Turno, robas <strong>1 carta menos</strong>.
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>


          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              setView("board");
              setDagonOutcome(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setView("board");
                setDagonOutcome(null);
              }
            }}
            className={`w-full sm:w-auto px-12 py-6 mx-auto bg-stone-900 border-2 ${dagonOutcome === "victory" ? "border-green-700/80 text-green-500 hover:border-green-400 hover:bg-stone-800 focus:ring-green-500" : "border-red-700/80 text-red-500 hover:border-red-400 hover:bg-stone-800 focus:ring-red-500"} transition-all duration-300 font-bold uppercase tracking-[0.2em] text-lg rounded-sm flex items-center justify-center shadow-xl hover:shadow-[0_0_25px_currentColor] group focus:outline-none focus:ring-2 cursor-pointer outline-none relative z-10 overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            <RotateCcw className="w-8 h-8 mr-4 group-hover:-rotate-90 transition-transform duration-700 pointer-events-none relative z-10" />
            <span className="pointer-events-none relative z-10">
              Aceptar y Volver al Tablero
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans flex flex-col selection:bg-amber-900 selection:text-white">
      {renderResetModal()}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.05] z-[-1]"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/dark-leather.png")',
        }}
      ></div>
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      ></div>

      <header className="border-b border-stone-800 bg-stone-900/90 backdrop-blur-md p-4 sticky top-0 z-40 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => view !== "setup" && setShowResetModal(true)}
          >
            <div className="w-12 h-12 rounded-full bg-stone-950 border-2 border-amber-700 flex items-center justify-center mr-4 group-hover:border-amber-500 transition-all duration-500 shadow-[0_0_15px_rgba(180,83,9,0.2)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <span className="text-amber-600 font-serif font-bold text-2xl group-hover:text-amber-400 transition-colors">
                W
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-amber-600 font-serif tracking-[0.2em] uppercase text-sm font-bold leading-tight group-hover:text-amber-400 transition-colors">
                El Viejo Mundo
              </span>
              <span className="text-stone-500 text-[10px] tracking-[0.3em] uppercase font-medium">
                Compendio del Brujo
              </span>
            </div>
          </div>

          {view !== "setup" && (
            <div className="flex items-center space-x-4">
              <div className="h-8 w-px bg-stone-800 mx-2"></div>
              <button
                onClick={() => setShowResetModal(true)}
                className="text-stone-500 hover:text-red-500 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 sm:p-8 relative z-0 min-h-[85vh] max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full flex justify-center"
          >
            {view === "setup" && renderSetup()}
            {view === "playerSetup" && renderPlayerSetup()}
            {view === "board" && renderBoard()}
            {view === "event" && renderEvent()}
            {view === "outcome" && renderOutcome()}
            {view === "combatResolution" && renderCombatResolution()}
            {view === "witcherCombatSelect" && renderWitcherCombatSelect()}
            {view === "witcherCombatResolution" &&
              renderWitcherCombatResolution()}
            {view === "dagonCombatSelect" && renderDagonCombatSelect()}
            {view === "dagonCombatResolution" && renderDagonCombatResolution()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-stone-900 bg-stone-950/80 p-6 text-center">
        <p className="text-stone-600 text-[10px] uppercase tracking-[0.4em] font-serif">
          Basado en el universo de The Witcher • Fan Project
        </p>
      </footer>
    </div>
  );
}
