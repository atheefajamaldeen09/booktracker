// Book nooks: little miniature scenes you build piece by piece, like the
// wooden shelf-insert kits. Reading earns the pieces; a finished nook goes
// on the visual bookshelf, standing between your books.
// The drawings for each piece are in components/nook/scenes.

export type NookId = "sakura" | "wizard" | "bookshop" | "greenhouse" | "toyshop" | "bakery" | "station" | "clocktower";

export type NookDef = {
  id: NookId;
  name: string;
  blurb: string;
  // The wooden case the scene sits in
  wood: string;
  // Pieces in the order you build them; the lights always go on last
  pieces: { id: string; name: string }[];
};

// "id: Name" pairs, to keep the long lists readable
const pieces = (list: Record<string, string>) => Object.entries(list).map(([id, name]) => ({ id, name }));

export const NOOKS: NookDef[] = [
  {
    id: "sakura",
    name: "Sakura Alley",
    blurb: "A lantern-lit lane at dusk, with a tea house, a noodle shop and a tram at the end of the street.",
    wood: "#a8714b",
    pieces: pieces({
      sky: "Evening sky",
      street: "Cobbled street",
      pagoda: "Hilltop pagoda",
      houses: "Back-street houses",
      teahouse: "Tea house",
      noodles: "Noodle shop",
      tram: "Little yellow tram",
      cherry: "Cherry blossom branch",
      lanterns: "Paper lanterns",
      bicycle: "Bicycle and flower pots",
      cat: "Rooftop cat",
      birds: "Evening birds",
      tank: "Rooftop water tank",
      wires: "Telegraph wires",
      flowerbox: "Window flowers",
      chime: "Wind chime",
      banner: "Tea house banner",
      parasol: "Paper parasol",
      stonelantern: "Stone lantern",
      lights: "Switch on the lights",
    }),
  },
  {
    id: "wizard",
    name: "Wizard's Alley",
    blurb: "A crooked midnight lane of potion and wand shops, floating candles and one watchful owl.",
    wood: "#5d4a73",
    pieces: pieces({
      sky: "Midnight sky",
      street: "Cobblestones",
      tower: "Wizard's tower",
      houses: "Crooked houses",
      potions: "Potion shop",
      wands: "Wand and spell-book shop",
      arch: "Stone arch and shop sign",
      cauldron: "Bubbling cauldron and broom",
      pumpkins: "Pumpkins and spell books",
      candles: "Floating candles",
      owl: "The owl",
      bats: "Bats",
      star: "Shooting star",
      ivy: "Creeping ivy",
      barrel: "Old barrel",
      walllamp: "Wand shop lantern",
      letters: "Flying letters",
      web: "Cobweb and spider",
      blackcat: "Black cat",
      lights: "Switch on the lights",
    }),
  },
  {
    id: "bookshop",
    name: "The Corner Bookshop",
    blurb: "Two floors of crammed shelves, a rolling ladder, a reading chair and the shop cat.",
    wood: "#8a4f45",
    pieces: pieces({
      walls: "Walls and floors",
      upstairs: "Upstairs shelves",
      downstairs: "Downstairs shelves",
      window: "Arched window",
      ladder: "Rolling ladder",
      rug: "Patterned rug",
      armchair: "Reading armchair",
      table: "Tea table and book stacks",
      plants: "Trailing plants",
      lamps: "Lamps",
      cat: "Shop cat",
      frames: "Framed pictures",
      clock: "Wall clock",
      stars: "Window stars",
      bunting: "Paper bunting",
      globe: "Old globe",
      stool: "Step stool",
      blanket: "Knitted blanket",
      mouse: "Bookish mouse",
      lights: "Switch on the lights",
    }),
  },
  {
    id: "greenhouse",
    name: "Garden Greenhouse",
    blurb: "A glasshouse full of seedlings, hanging baskets and climbing roses, with a chair for reading in the sun.",
    wood: "#6f8f7a",
    pieces: pieces({
      sky: "Morning sky and hedge",
      floor: "Brick wall and tiled floor",
      glass: "Glass roof and frame",
      bench: "Potting bench",
      shelf: "Shelf of seedlings",
      baskets: "Hanging baskets",
      monstera: "Big leafy monstera",
      roses: "Climbing roses",
      chair: "Garden chair, book and tea",
      can: "Watering can",
      butterflies: "Butterflies and a robin",
      tomato: "Tomato vine",
      sunflowers: "Sunflowers",
      wallcat: "Cat on the wall",
      birdhouse: "Hanging birdhouse",
      hat: "Straw sun hat",
      boots: "Yellow wellies",
      lantern: "Candle lantern",
      snail: "Garden snail",
      lights: "Switch on the lights",
    }),
  },
  {
    id: "toyshop",
    name: "Teddy's Toy Shop",
    blurb: "A toy shop at closing time: a ferris wheel, a rocking horse and a teddy in a top hat minding the counter.",
    wood: "#b5463c",
    pieces: pieces({
      walls: "Starry wallpaper",
      floor: "Chequered floor",
      shelves: "Toy shelves",
      counter: "Shop counter",
      ferris: "Ferris wheel",
      marquee: "Marquee sign",
      bigbear: "Top-hat teddy",
      carousel: "Little carousel",
      drum: "Toy drum",
      robot: "Tin robot and rocket",
      blocks: "Blocks and sailing boat",
      dollhouse: "Dolls' house and jack-in-the-box",
      horse: "Rocking horse",
      train: "Wooden train",
      smallbear: "Little bear on a chair",
      balloons: "Balloons",
      kite: "Paper kite",
      bunting: "Bunting",
      lamps: "Hanging lamps",
      lights: "Switch on the lights",
    }),
  },
  {
    id: "bakery",
    name: "Honey Bun Bakery",
    blurb: "A mustard-yellow bakery with a window full of warm bread, a pink cake and a bear in a baker's hat.",
    wood: "#d9b068",
    pieces: pieces({
      wall: "Cream brick wall",
      floor: "Pavement",
      window: "Shop window",
      door: "Mustard door",
      ledge: "Window sill and panel",
      shelves: "Bread shelves",
      loaves: "Loaves and baguettes",
      buns: "Croissants and a bun",
      cake: "Pink tiered cake",
      baker: "Baker bear",
      awning: "Scalloped awning",
      sign: "Bakery sign",
      lamp: "Window lamp",
      opensign: "Open sign",
      lantern: "Wall lantern",
      sacks: "Flour sack and rolling pin",
      planters: "Flower planter",
      easel: "Chalkboard menu",
      cat: "Bakery cat",
      lights: "Switch on the lights",
    }),
  },
  {
    id: "station",
    name: "Time Station",
    blurb: "A red steam engine pulls out of the tunnel under the great station clock, lamps blazing.",
    wood: "#6f86a8",
    pieces: pieces({
      wall: "Sandstone wall",
      platform: "Platform and rails",
      tunnel: "Tunnel mouth",
      girders: "Iron roof girders",
      cab: "Engine cab",
      boiler: "Boiler",
      chimney: "Funnel",
      wheels: "Wheels and cowcatcher",
      buffer: "Buffer beam and headlamps",
      steam: "Puffs of steam",
      clock: "Station clock",
      sign: "Station sign",
      pillars: "Stone pillars",
      arch: "Great stone arch",
      lamps: "Platform lanterns",
      signal: "Signal",
      luggage: "Stack of suitcases",
      bench: "Red velvet seat",
      pigeons: "Pigeons",
      lights: "Switch on the lights",
    }),
  },
  {
    id: "clocktower",
    name: "Clocktower Lane",
    blurb: "A sunny lane under an old clock: a café, a book shop, a twisty pine and a bright red post box.",
    wood: "#9fb59a",
    pieces: pieces({
      sky: "Afternoon sky",
      lane: "Cobbled lane",
      tower: "Clock tower",
      houses: "Back-lane house",
      cafe: "Café",
      bookshop: "Book shop",
      pine: "Twisty old pine",
      balcony: "Iron balcony and geraniums",
      windowbox: "Window box",
      cafesign: "Café sign",
      booksign: "Book shop sign",
      lamp: "Street lamp",
      steps: "Stone steps",
      postbox: "Red post box",
      table: "Café table and chair",
      menu: "Chalkboard menu",
      flowers: "Pot of yellow flowers",
      bunting: "Bunting",
      cat: "Ginger cat",
      lights: "Switch on the lights",
    }),
  },
];

export const nookById = (id: string) => NOOKS.find((n) => n.id === id);

// Every book you finish is worth this many pieces
export const PIECES_PER_BOOK = 1;
// A new builder gets a couple of pieces to start with
export const STARTER_PIECES = 2;
// Every kit has the same number of pieces
export const PIECES_PER_KIT = NOOKS[0].pieces.length;

export type NookProgress = {
  // The kit on your workbench, and how many of its pieces are in place
  current: NookId | null;
  placed: number;
  // Finished nooks, oldest first
  done: { id: NookId; finishedOn: string }[];
  // Pieces waiting to be placed
  available: number;
  // Books finished since you opened your first kit
  booksCounted: number;
};
