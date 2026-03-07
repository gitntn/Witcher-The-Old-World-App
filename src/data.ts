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

export const MONSTER_DATA = {
  1: [
    { id: 'arachas', name: 'Arachas', type: 'Insectoide', ability: 'Antes de crear la Reserva de Vida, descarta 1 carta de tu mano.', narrative: 'Te adentras en un bosque denso cubierto de telarañas gigantes. Una Arachas te acecha desde la canopia, lista para emboscarte.' },
    { id: 'arquespor', name: 'Arquespor', type: 'Planta Maldita', ability: 'Debes descartar 1 Poción sin usar para iniciar el combate.', narrative: 'Una planta carnosa emerge de la tierra. Exhala un polen corrosivo que pudrirá tus pociones si te acercas demasiado.' },
    { id: 'arpia', name: 'Arpía', type: 'Bestia', ability: 'Durante solo tu primer Turno de Combate, tu nivel de Ataque se reduce a 0.', narrative: 'Estás escalando un desfiladero rocoso. Las arpías atacan en picado para desestabilizarte al inicio de la pelea.' },
    { id: 'barghest_1', name: 'Barghest', type: 'Espectro', ability: 'Antes de crear tu Reserva de Vida, baja 1 en tu nivel de Escudo.', narrative: 'Rastreas al Barghest hasta un altar profanado. Su presencia absorbe la magia debilitando tus defensas.' },
    { id: 'boira', name: 'Boira', type: 'Necrófago', ability: 'En el 1er Turno del Monstruo, elige el Ataque que te haga descartar más cartas.', narrative: 'La niebla se vuelve tan espesa que apenas ves. La Boira usa ilusiones para que bajes la guardia.' },
    { id: 'demoniopodrido', name: 'Demonio Podrido', type: 'Necrófago', ability: 'Si es derrotado, robas solo 1 carta en la Fase III de tu turno.', narrative: 'Este necrófago apesta a muerte. Al asestarle el golpe de gracia, su cuerpo explotará violentamente.' },
    { id: 'ekimmara', name: 'Ekimmara', type: 'Vampiro', ability: 'Si no tienes Ficha de Rastro, descarta 1 carta de tu mano antes del combate.', narrative: 'Un vampiro salvaje desciende del techo de la cripta, ciego de furia. Su asalto inicial será demoledor.' },
    { id: 'nido_ghuls', name: 'Nido de Ghuls', type: 'Necrófago', ability: 'Durante tu primer turno, el Monstruo puede descartar hasta 2 cartas como máximo.', narrative: 'Descubres un agujero rebosante de Ghuls hambrientos. Son demasiados para asestar golpes letales al inicio.' },
    { id: 'nido_nekkers', name: 'Nido de Nekkers', type: 'Ogro', ability: 'Si al final de tu Turno no hay carta de Esquiva (verde) en el Combo, robas 1 carta menos.', narrative: 'Los Nekkers no dejan de saltar; si no esquivas constantemente, te abrumarán por puro número.' },
    { id: 'nido_sumergidos', name: 'Nido de Sumergidos', type: 'Necrófago', ability: 'Después de crear la Reserva, descarta 1 carta de tu mazo y barájalo.', narrative: 'A orillas del río, varios Sumergidos emergen. Su asalto inicial te obliga a barajar y cambiar tus planes.' },
    { id: 'bruxa_1', name: 'Bruxa', type: 'Vampiro', ability: 'Aplica reglas de combate estándar sin habilidades extra.', narrative: 'Escuchas un canto melancólico. Una joven de piel pálida te observa desde las sombras de un viñedo.' }
  ],
  2: [
    { id: 'aparicion', name: 'Aparición Nocturna', type: 'Espectro', ability: 'Durante tu 1er Turno, juega tu primera carta de Combo aleatoriamente.', narrative: 'Una figura espectral danza bajo la luna, distorsionando la realidad y tu percepción del tiempo.' },
    { id: 'brujagua', name: 'Bruja del Agua', type: 'Necrófago', ability: 'Durante todo el combate, solo puedes usar 1 Poción como máximo.', narrative: 'Un hedor a fango podrido impregna el aire. Una Bruja del Agua te lanza una bola de lodo directamente al cinto.' },
    { id: 'brujasepulcral', name: 'Bruja Sepulcral', type: 'Necrófago', ability: 'Si recibes Daño en el turno 1 del monstruo, primero descarta cartas de la mano.', narrative: 'Escuchas crujidos. La Bruja usa su asquerosa lengua gigante como látigo amenazante en el primer turno.' },
    { id: 'dama', name: 'Dama del Mediodía', type: 'Espectro', ability: 'Durante cada turno, tu Escudo solo puede subir 1 en total como máximo.', narrative: 'El sol abrasa los campos. Un calor sofocante seca tus pulmones y evapora tus defensas mágicas.' },
    { id: 'demonibestia', name: 'Demonibestia', type: 'Relicto', ability: 'Las cartas moradas no tienen efecto durante el combate, solo sirven para extender combos.', narrative: 'Su tercer ojo brilla con un tono carmesí que inhibe e interfiere directamente en tus Señales Ofensivas.' },
    { id: 'grifo', name: 'Grifo', type: 'Híbrido', ability: 'Durante todo el Combate, robas 1 carta menos en el último paso de tu Turno.', narrative: 'El Grifo desciende con un chillido atronador. Las ráfagas de sus alas dificultan tu recuperación de recursos.' },
    { id: 'hombrelobo', name: 'Hombre Lobo', type: 'Bestia Maldita', ability: 'Antes de que el Jugador cree su Reserva de Vida, baja 2 en su nivel de Escudo.', narrative: 'Su aullido ensordecedor a la luz de la luna hace temblar tus rodillas, mermando tu preparación defensiva.' },
    { id: 'manticora', name: 'Mantícora', type: 'Híbrido', ability: 'Cada vez que el monstruo inflige Daño, se resta 1 del Daño y descartas 1 carta aleatoria de tu mano.', narrative: 'Su cola de escorpión gotea un veneno neurotóxico que entumece la mente del brujo al más mínimo contacto.' },
    { id: 'penitente', name: 'Penitente', type: 'Espectro', ability: 'Si el Jugador no tiene Ficha de Rastro, no inflige ningún Daño durante su primer Turno de Combate.', narrative: 'Una densa sombra intangible te envuelve. Si no estudiaste su rastro, tus ataques la atravesarán inútilmente.' },
    { id: 'susurradora', name: 'Susurradora', type: 'Relicto', ability: 'Durante todo el Combate: cada vez que tu Combo incluya una Señal Defensiva (amarilla), bajas 2 de Escudo.', narrative: 'Las voces en tu cabeza se intensifican. Sus susurros corrompen tu mente al intentar usar magia defensiva.' },
    { id: 'tejedora', name: 'Tejedora', type: 'Relicto', ability: 'Antes de crear tu Reserva, baja 1 tu Defensa, y baja 1 tu Escudo (si está por encima del máximo).', narrative: 'El suelo se vuelve un lodazal viscoso. Ella canaliza un maleficio que merma tu defensa y agota tu aguante.' },
    { id: 'wyverno', name: 'Wyverno', type: 'Dracónido', ability: 'Al final del primer Turno de Combate del Monstruo, descartas 1 carta aleatoria de tu mano.', narrative: 'Desciende en picado desde las nubes buscando desarraigar las armas y opciones directamente de tus manos.' }
  ],
  3: [
    { id: 'estrige', name: 'Estrige', type: 'Maldito', ability: 'Antes de que el Jugador cree su Reserva de Vida, baja 1 en su nivel de Escudo por cada carta que tenga en su mano.', narrative: 'Vida del Monstruo: 18. 👉 Este monstruo castiga a jugadores que acumulan muchas cartas antes del combate. Menos cartas en mano = menos penalización.' },
    { id: 'leshen', name: 'Leshen', type: 'Relicto', ability: 'De forma temporal y solo durante este Combate, baja 1 en el nivel de Defensa del Jugador. Su nivel de Escudo baja si se encuentra por encima de su máximo.', narrative: 'Vida del Monstruo: 19. 👉 Es peligroso si dependes mucho de Defensa alta o de subir Escudo por encima del límite.' },
    { id: 'guisadora', name: 'Guisadora', type: 'Relicto', ability: 'Durante todo el Combate: cada vez que el Combo del Jugador incluya una carta de Esquiva (verde) o Señal Defensiva (amarillo), dicho Jugador inflige 1 Daño menos.', narrative: 'Vida del Monstruo: 17. 👉 Castiga builds defensivos. Si juegas muy reactivo, haces menos daño.' },
    { id: 'babagor', name: 'Babagor', type: 'Relicto', ability: 'Durante solo el primer Turno de Combate del Jugador, este puede infligir 1 Daño como máximo.', narrative: 'Vida del Monstruo: 18. 👉 Es un “freno inicial”. Necesitas sobrevivir el primer turno y luego explotar daño en los siguientes.' },
    { id: 'yghern', name: 'Yghern', type: 'Insectoide', ability: 'Durante todo el Combate: cada vez que el Combo del Jugador incluya 1 carta de Ataque Rápido (azul), dicho Jugador inflige 1 Daño menos.', narrative: 'Vida del Monstruo: 18. 👉 Castiga estrategias de Ataque Rápido. Si tu mazo es muy azul, este combate se vuelve más lento.' },
    { id: 'lamia', name: 'Lamia', type: 'Vampiro', ability: 'Durante cada Turno de Combate del Monstruo en el que el Monstruo tenga solo 1 o 2 cartas en su mazo, su Ataque inflige 2 Daños adicionales.', narrative: 'Vida del Monstruo: 17. 👉 Es más peligrosa al final del combate. Cuando su mazo está por agotarse, pega mucho más fuerte.' },
    { id: 'troll', name: 'Troll', type: 'Ogro', ability: 'Durante el primer turno de combate del monstruo, el monstruo inflige 3 de daño adicional.', narrative: 'Vida del Monstruo: 19. 👉 Sobrevivir a su primera embestida es crucial. Prepara tus cartas de Escudo o pociones defensivas para mitigar este golpe masivo inicial.' }
  ]
};

export const ACTION_POOLS: Record<string, string[]> = {
  'Vampiro': ['Lanzar polvo lunar al aire para cubrir el entorno.', 'Retroceder lentamente mientras ofreces un cebo.', 'Rodar rápidamente hacia la zona más oscura.', 'Preparar la Señal de Yrden en el suelo frente a ti.', 'Cargar de frente apuntando al torso.', 'Beber a ciegas una poción de tu cinturón.'],
  'Necrófago': ['Lanzar una bomba de metralla a sus pies.', 'Avanzar con una rápida ráfaga de cortes diagonales.', 'Mantener la máxima distancia posible de forma cautelosa.', 'Usar Igni para quemar el terreno que les rodea.', 'Esperar su primer salto para realizar una pirueta.', 'Buscar terreno elevado y rocoso inmediatamente.'],
  'Espectro': ['Canalizar la Señal de Yrden y esperar dentro de ella.', 'Cerrar los ojos, respirar hondo y agudizar el oído.', 'Atacar lanzando una nube de polvo de plata.', 'Moverte en círculos amplios para desorientar su carga.', 'Confiar ciegamente en la vibración de tu medallón de brujo.', 'Acelerar el paso con la espada en guardia alta.'],
  'Relicto': ['Atacar directamente al entorno (árboles/altares) que le rodea.', 'Activar Quen y avanzar un paso a la vez, firmemente.', 'Lanzar una bomba de Dimerita hacia su cabeza.', 'Cargar en línea recta canalizando toda tu fuerza en un golpe.', 'Estudiar sus movimientos adoptando una postura defensiva.', 'Intentar un corte bajo a sus extremidades inferiores.'],
  'Escurridizos': ['Disparar un virote de ballesta directo a sus ojos.', 'Canalizar Aard para desestabilizar su centro de gravedad.', 'Rodar en diagonal en el último milisegundo posible.', 'Avanzar cubriéndote con los árboles y rocas del terreno.', 'Intentar cercenar una de sus extremidades laterales.', 'Aplicar un ungüento rápido en la hoja de tu espada.'],
  'Bestias': ['Imbuir la espada en aceite y cargar de frente con un grito.', 'Golpear la espada contra tu armadura para intimidar.', 'Usar la Señal de Axia para intentar calmar o aturdir a la criatura.', 'Esconderte entre la maleza para preparar una emboscada.', 'Atacar agresivamente a las patas para quitarle movilidad.', 'Rodar hacia su flanco ciego aprovechando tu tamaño.']
};

export const GOOD_CONSEQUENCES = [
  "¡Maniobra perfecta! Ganas la iniciativa. Robas 1 carta adicional de tu mazo antes de que empiece el combate.",
  "Tus reflejos de brujo rinden frutos. Aumentas tu nivel de Escudo en 1 antes del choque inicial.",
  "Encuentras una apertura crítica en su postura. El monstruo comienza la pelea descartando 1 carta de su Reserva de Vida.",
  "El entorno juega a tu favor. Te posicionas de forma impecable y el primer ataque que recibas infligirá -1 de Daño.",
  "Encuentras un momento para prepararte. Ganas 1 de Oro o devuelves 1 carta de tus descartes a tu mazo de combate."
];

export const BAD_CONSEQUENCES = [
  "Un error de cálculo fatal. Recibes 1 Daño directo (baja Escudo o descarta carta) antes de empezar el combate.",
  "Te desestabilizan con un golpe contundente. Bajas 2 niveles de Escudo (si tienes) antes de empezar.",
  "El terreno te juega una mala pasada. Tropiezas y debes descartar 1 carta aleatoria de tu mano.",
  "Un impacto inesperado rompe un frasco de tu cinto. Debes descartar 1 Poción que tengas (sin usarla).",
  "La criatura desaparece de tu vista y te embosca. Pierdes tu Ficha de Rastro (si tenías una) y el monstruo ataca primero.",
  "Adoptas una mala postura táctica. Tu desequilibrio hace que tu primer ataque del combate inflija -1 de Daño.",
  "El monstruo te acorrala con un rugido ensordecedor. Debes descartar 1 carta de tu elección de tu mano antes de empezar.",
  "Un ataque de extrema rapidez te deja vulnerable. Empiezas el combate sufriendo 2 Daños directos.",
  "Tu medallón vibraba violentamente, pero reaccionaste tarde. El monstruo gana la iniciativa y ataca primero (incluso si tenías Rastro)."
];

export const NEUTRAL_CONSEQUENCES = [
  "Logras mantener la compostura. El combate comienza sin ventajas ni desventajas previas.",
  "Esquivas el peligro por los pelos. Inicias el enfrentamiento en condiciones puramente estándar.",
  "La tensión se puede cortar con un cuchillo. Ambos miden sus fuerzas. Empiezas la pelea de forma normal.",
  "No ganas terreno, pero tampoco lo cedes. Te preparas para un combate sin bonificaciones."
];

export const GENERIC_GOOD_NARRATIVE = ["¡Maniobra perfecta!", "Tus reflejos de brujo rinden frutos.", "Encuentras una apertura crítica en su postura.", "El entorno juega a tu favor.", "Encuentras un momento para prepararte."];
export const GENERIC_BAD_NARRATIVE = ["Un error de cálculo fatal.", "Te desestabilizan con un golpe contundente.", "El terreno te juega una mala pasada.", "Un impacto inesperado rompe tu guardia.", "La criatura desaparece de tu vista y te embosca.", "Adoptas una mala postura táctica.", "El monstruo te acorrala con un rugido ensordecedor.", "Un ataque de extrema rapidez te deja vulnerable.", "Tu medallón vibraba violentamente, pero reaccionaste tarde."];
export const GENERIC_NEUTRAL_NARRATIVE = ["Logras mantener la compostura.", "Esquivas el peligro por los pelos.", "La tensión se puede cortar con un cuchillo. Ambos miden sus fuerzas.", "No ganas terreno, pero tampoco lo cedes."];

export const NEKKER_NARRATIVES = {
  good: [
    "Notas la tierra removida a tiempo y arrojas una bomba de metralla a su túnel; el Nekker sale herido y aturdido.",
    "Usas la señal de Yrden para cubrir tu retaguardia; el monstruo queda atrapado en la trampa mágica al intentar emboscarte.",
    "Identificas al líder de la manada y le asestas un golpe letal preventivo, desorganizando al resto.",
    "El olor a arcilla húmeda y sangre vieja te alerta de la emboscada; desenvainas justo antes de que salten.",
    "Impregnas tu espada con aceite para ogroides rápidamente; tu primer tajo quema la gruesa piel del monstruo.",
    "Usas Aard para colapsar la entrada de su madriguera, obligándolo a salir de frente y sin factor sorpresa.",
    "Te posicionas sobre una roca alta, forzando al Nekker a escalar y dejándolo con la guardia abierta.",
    "Finges un tropiezo y dejas que salte; lo recibes de lleno con la punta de tu espada de plata.",
    "Un tajo horizontal preciso rebana las garras del atacante antes de que logre tocarte.",
    "Disparas tu ballesta hacia la oscuridad del matorral y escuchas un chillido sordo; comienzas con ventaja.",
    "Esquivas su salto con una pirueta fluida y lo pateas contra el tronco de un árbol cercano.",
    "El Nekker calcula mal su embestida y tropieza con unas raíces expuestas, dándote la apertura perfecta.",
    "Lanzas la señal de Igni hacia la hierba seca; la barrera de fuego aterroriza a la bestia y la hace retroceder.",
    "Golpeas tu espada contra una piedra con fuerza; el eco metálico aturde sus sensibles oídos subterráneos.",
    "Logras un corte bajo que alcanza los tendones de sus piernas, reduciendo drásticamente su movilidad.",
    "Lo engañas lanzando un guantelete a los arbustos; ataca el cebo mientras tú lo flanqueas por la izquierda.",
    "Lees sus huellas frescas en el barro y te adelantas a su ruta, logrando emboscarlo tú a él.",
    "El reflejo del sol del mediodía en tu hoja ciega al monstruo justo en el momento de su salto.",
    "Usas la señal de Axii; su mente primitiva se nubla por un segundo, tiempo suficiente para un golpe limpio.",
    "Bloqueas su ataque y usas el impulso de la bestia para lanzarla por los aires, dejándola vulnerable al caer."
  ],
  neutral: [
    "El Nekker salta desde los matorrales; logras bloquear sus garras, pero la fuerza del impacto te hace retroceder.",
    "Mantienes la guardia alta y esquivas su primer embate; inician una danza mortal midiéndose mutuamente.",
    "Lanzas un rápido Igni que solo logra chamuscarle la piel superficialmente; el monstruo chilla y ataca.",
    "Ruedas por el suelo para esquivar una lluvia de tierra y piedras que levanta al salir de su agujero.",
    "Sus afiladas garras chocan con tu espada de plata en un chispazo sonoro; la fuerza de ambos está equilibrada.",
    "La criatura suelta un gruñido gutural llamando a otros, pero te centras en el que tienes enfrente.",
    "Te rodea a cuatro patas buscando un punto ciego, obligándote a girar constantemente para no perderlo de vista.",
    "Das un tajo de advertencia al aire; el Nekker retrocede un paso, pero se prepara para cargar de nuevo.",
    "La pelea comienza en un terreno lodoso, dificultando el movimiento tanto para ti como para la bestia.",
    "Retrocedes lentamente hacia un árbol para evitar que te ataquen por la espalda, cediendo la iniciativa.",
    "Intercambian un par de golpes rápidos sin que ninguno logre conectar un ataque profundo.",
    "El monstruo duda un segundo al ver el tamaño de tu espada, pero su instinto asesino gana y se lanza.",
    "Bloqueas un pedazo de madera podrida que te arroja a la cabeza antes de que acorte la distancia.",
    "Te pones en una postura defensiva clásica; decides esperar a que la criatura cometa el primer error.",
    "Saca sus garras de la tierra húmeda; tú desenvainas tu espada con un siseo metálico. Empieza el combate.",
    "Una ráfaga de viento sopla fuerte, ocultando los sonidos de sus pisadas y forzándote a depender de tus ojos.",
    "Logras desviar su ataque aéreo con tu antebrazo blindado, pero el impacto te deja el brazo entumecido.",
    "Te mantienes firme en tu posición mientras el Nekker escarba frenéticamente a tu alrededor buscando una apertura.",
    "La bestia gruñe mostrando sus dientes afilados; evalúas su musculatura y te preparas para el impacto.",
    "Ambos cargan al mismo tiempo, encontrándose en el centro del claro en un choque brutal de acero y garras."
  ],
  bad: [
    "Te confías al ver su pequeño tamaño; otro Nekker emerge justo bajo tus pies y te hace perder el equilibrio.",
    "Su agilidad errática te toma por sorpresa y sus garras logran rasgar tu armadura de cuero.",
    "El chillido agudo de la criatura te desorienta por un segundo, dándole la oportunidad perfecta para golpearte.",
    "El monstruo te lanza un puñado de tierra a los ojos; te frotas la cara ciego mientras recibes el primer tajo.",
    "Pisas en falso sobre un agujero de Nekker camuflado y te tuerces el tobillo al inicio del combate.",
    "Uno de ellos salta desde las ramas bajas de un árbol, cayendo sobre tu espalda pesadamente.",
    "Tu espada de plata se atasca por un microsegundo en una raíz gruesa al intentar desenvainar.",
    "Logran rodearte antes de que termines de beber tu poción; tienes que tirar el frasco para defenderte.",
    "Un Nekker más pequeño se desliza entre tus piernas y te muerde profundamente la pantorrilla.",
    "El olor a putrefacción del nido te provoca una arcada violenta, interrumpiendo tu concentración.",
    "Una garra afortunada golpea tu cinturón y rompe un frasco de aceite útil, manchándote la bota.",
    "Resbalas en la hierba cubierta de rocío; caes sobre una rodilla y el monstruo salta directo a tu cuello.",
    "Un segundo chillido a tu izquierda te distrae; giras la cabeza y el verdadero atacante te golpea por la derecha.",
    "Su embestida es mucho más pesada de lo que calculaste y el impacto en tu pecho te saca el aire.",
    "Te clavan unas garras sucias y oxidadas en el antebrazo; sientes el ardor de la infección inmediata.",
    "Intentas lanzar la señal de Quen, pero titubeas con los dedos y el escudo no se forma a tiempo.",
    "Al retroceder, el sol se filtra entre las hojas y te da directo en los ojos, cegándote en el peor momento.",
    "Un zarpazo lateral golpea la guarda de tu espada con tanta fuerza que casi la sueltas por la vibración.",
    "Entras en pánico por un segundo al escuchar la tierra temblar bajo ti; pierdes la iniciativa del combate.",
    "El Nekker finta un salto y en su lugar barre tus piernas con sus gruesos brazos, derribándote al lodo."
  ]
};

export const FIXED_TERRAINS = ['Montaña', 'Bosque', 'Agua'];
