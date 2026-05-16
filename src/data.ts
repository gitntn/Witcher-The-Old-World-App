import { MONSTER_DECISIONS } from './monsterDecisions';

export const LOCATIONS = {
  'Agua': ['1. Kaer Seren', '4. Ban Ard', '5. Cidaris', '12. Glenmore', '14. Loc Ichaer', '15. Gorthur Gvaed'],
  'Montaña': ['2. Hengfors', '3. Kaer Morhen', '9. Cintra', '11. Beauclair', '13. Doldeth', '18. Ard Modron'],
  'Bosque': ['6. Novigrad', '7. Vizima', '8. Vengerberg', '10. Haern Caduch', '16. Dhuwod', '17. Stygga']
};

export const SETUP_RESOURCES: Record<number, {cards: number, gold: number}[]> = {
  1: [ { cards: 5, gold: 3 } ],
  2: [ { cards: 3, gold: 2 }, { cards: 5, gold: 4 } ],
  3: [ { cards: 3, gold: 2 }, { cards: 4, gold: 4 }, { cards: 5, gold: 6 } ],
  4: [ { cards: 2, gold: 4 }, { cards: 3, gold: 5 }, { cards: 4, gold: 6 }, { cards: 5, gold: 7 } ],
  5: [ { cards: 2, gold: 5 }, { cards: 3, gold: 5 }, { cards: 4, gold: 5 }, { cards: 4, gold: 7 }, { cards: 5, gold: 7 } ]
};

// Map dynamically from MONSTER_DECISIONS
const buildMonsterData = () => {
  const data: Record<number, any[]> = { 1: [], 2: [], 3: [] };
  
  for (const [name, stats] of Object.entries(MONSTER_DECISIONS)) {
    const level = stats.nivel;
    const id = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    let narrative = `Te encuentras cara a cara con un(a) ${name} (${stats.tipo}).`;
    
    // Attempt to retain original narrative flavor loosely
    if(stats.tipo.includes('Acuatic') || stats.tipo.includes('Agua') || stats.tipo.includes('Sumergid')) narrative = `El agua turbia se agita violentamente. Emerge un(a) ${name} listo(a) para atacar.`;
    else if(stats.tipo.includes('Espectr')) narrative = `La temperatura cae de golpe. Un(a) ${name} etéreo(a) aparece ante ti emitiendo un sonido sepulcral.`;
    else if(stats.tipo.includes('Necrófag')) narrative = `Un hedor a podredumbre invade el aire justo antes de que el(la) ${name} se arroje sobre ti.`;
    
    data[level].push({
      id,
      name,
      type: stats.tipo,
      ability: stats.habilidad,
      narrative
    });
  }
  return data;
};

export const MONSTER_DATA = buildMonsterData();

export const ACTION_POOLS: Record<string, string[]> = {
  'Vampiro': ['Lanzar polvo lunar al aire para cubrir el entorno.', 'Retroceder lentamente mientras ofreces un cebo.', 'Rodar rápidamente hacia la zona más oscura.', 'Preparar la Señal de Yrden en el suelo frente a ti.', 'Cargar de frente apuntando al torso.', 'Beber a ciegas una poción de tu cinturón.'],
  'Necrófago': ['Lanzar una bomba de metralla a sus pies.', 'Avanzar con una rápida ráfaga de cortes diagonales.', 'Mantener la máxima distancia posible de forma cautelosa.', 'Usar Igni para quemar el terreno que les rodea.', 'Esperar su primer salto para realizar una pirueta.', 'Buscar terreno elevado y rocoso inmediatamente.'],
  'Espectro': ['Canalizar la Señal de Yrden y esperar dentro de ella.', 'Cerrar los ojos, respirar hondo y agudizar el oído.', 'Atacar lanzando una nube de polvo de plata.', 'Moverte en círculos amplios para desorientar su carga.', 'Confiar ciegamente en la vibración de tu medallón de brujo.', 'Acelerar el paso con la espada en guardia alta.'],
  'Relicto': ['Atacar directamente al entorno (árboles/altares) que le rodea.', 'Activar Quen y avanzar un paso a la vez, firmemente.', 'Lanzar una bomba de Dimerita hacia su cabeza.', 'Cargar en línea recta canalizando toda tu fuerza en un golpe.', 'Estudiar sus movimientos adoptando una postura defensiva.', 'Intentar un corte bajo a sus extremidades inferiores.'],
  'Escurridizos': ['Disparar un virote de ballesta directo a sus ojos.', 'Canalizar Aard para desestabilizar su centro de gravedad.', 'Rodar en diagonal en el último milisegundo posible.', 'Avanzar cubriéndote con los árboles y rocas del terreno.', 'Intentar cercenar una de sus extremidades laterales.', 'Aplicar un ungüento rápido en la hoja de tu espada.'],
  'Bestias': ['Imbuir la espada en aceite y cargar de frente con un grito.', 'Golpear la espada contra tu armadura para intimidar.', 'Usar la Señal de Axia para intentar calmar o aturdir a la criatura.', 'Esconderte entre la maleza para preparar una emboscada.', 'Atacar agresivamente a las patas para quitarle movilidad.', 'Rodar hacia su flanco ciego aprovechando tu tamaño.']
};

export const GOOD_CONSEQUENCES = [
  "¡Maniobra perfecta! Ganas la iniciativa. Robas 1 carta adicional de tu mazo antes de empezar el combate.",
  "Tus reflejos rinden frutos. Ganas 1 nivel de Escudo; si ya estás al máximo (Nivel 4), roba 1 carta de tu mazo en su lugar.",
  "Encuentras una apertura crítica. El monstruo comienza el combate descartando 1 carta de su Reserva de Vida.",
  "Posicionamiento impecable. El primer ataque que recibas en este combate infligirá -1 de Daño.",
  "Aprovechas un respiro para prepararte. Robas 1 carta de tu mazo o ganas 1 Poción de tu elección.",
  "Concentración absoluta. Tu primer ataque del combate infligirá +1 de Daño."
];

export const BAD_CONSEQUENCES = [
  "Un error de cálculo. Debes descartar 1 carta de tu mano antes de que empiece el combate.",
  "Te desestabilizan con un golpe contundente. Baja tu nivel de Escudo en 1.",
  "El terreno te juega una mala pasada. Tropiezas y debes descartar 1 carta aleatoria de tu mano.",
  "Un impacto inesperado rompe un frasco de tu cinto. Debes descartar 1 Poción sin usar.",
  "La criatura te embosca. Pierdes tu Ficha de Rastro (si tenías) y el monstruo gana la iniciativa.",
  "Adoptas una mala postura. Tu primer ataque del combate infligirá -1 de Daño.",
  "Cansancio acumulado. Empiezas el combate sufriendo 1 daño directo (descarta 1 carta del mazo)."
];

export const NEUTRAL_CONSEQUENCES = [
  "Logras mantener la compostura. El combate comienza sin ventajas ni desventajas previas.",
  "Esquivas el peligro por los pelos. Inicias el enfrentamiento en condiciones puramente estándar.",
  "La tensión se puede cortar con un cuchillo. Ambos miden sus fuerzas. Empiezas la pelea de forma normal.",
  "No ganas terreno, pero tampoco lo cedes. Te preparas para un combate sin bonificaciones."
];

export const FIXED_TERRAINS = ['Montaña', 'Bosque', 'Agua'];
