// The shop catalog. Each entry is one species/grade you sell.
//
//   id          unique, lowercase, no spaces (used in the page URL)
//   name        English name, e.g. "Tiger cowrie"
//   scientific  optional scientific name, e.g. "Cypraea tigris"
//               (leave out or "" if unknown)
//   type        English shell type, e.g. "Cowries" (drives the type filter)
//   sizeMm      typical size in millimetres
//   price       price in NZD for one specimen
//   stock       how many you have; 0 shows "Sold out" + a notify-me form
//   photos      list of image paths in assets/img/shells/ (empty = placeholder)
//   description a sentence or two about the specimen
//
// SAMPLE DATA: replace these with your real shells.
window.SHELLS = [
  {
    id: "cypraea-tigris",
    name: "Tiger cowrie",
    scientific: "Cypraea tigris",
    type: "Cowries",
    sizeMm: 85,
    price: 35,
    stock: 6,
    photos: [],
    description: "Glossy dorsum with bold dark spotting on a pale ground. Clean aperture and teeth."
  },
  {
    id: "conus-textile",
    name: "Textile cone",
    scientific: "Conus textile",
    type: "Cones",
    sizeMm: 72,
    price: 28,
    stock: 4,
    photos: [],
    description: "Classic tented pattern in chestnut and gold, sharp lip, good colour."
  },
  {
    id: "murex-pecten",
    name: "Venus comb murex",
    scientific: "Murex pecten",
    type: "Murex",
    sizeMm: 120,
    price: 65,
    stock: 2,
    photos: [],
    description: "Long, delicate spines largely intact. A striking display piece."
  },
  {
    id: "haliotis-iris",
    name: "Pāua",
    scientific: "Haliotis iris",
    type: "Abalone & pāua",
    sizeMm: 140,
    price: 45,
    stock: 8,
    photos: [],
    description: "Polished New Zealand pāua with intense blue-green iridescence."
  },
  {
    id: "amalda-australis",
    name: "Southern olive",
    scientific: "Amalda australis",
    type: "Olives",
    sizeMm: 38,
    price: 18,
    stock: 0,
    photos: [],
    description: "New Zealand endemic, smooth and lustrous with a banded spire."
  },
  {
    id: "harpa-major",
    name: "Major harp",
    scientific: "Harpa major",
    type: "Harps",
    sizeMm: 90,
    price: 32,
    stock: 3,
    photos: [],
    description: "Strong axial ribs with rosy chevron pattern between them."
  },
  {
    id: "cypraea-mappa",
    name: "Map cowrie",
    scientific: "Leporicypraea mappa",
    type: "Cowries",
    sizeMm: 70,
    price: 55,
    stock: 1,
    photos: [],
    description: "Intricate 'map' pattern with a well-defined dorsal line."
  },
  {
    id: "lambis-chiragra",
    name: "Chiragra spider conch",
    scientific: "Harpago chiragra",
    type: "Conchs",
    sizeMm: 160,
    price: 48,
    stock: 0,
    photos: [],
    description: "Six long digitations, orange-pink aperture."
  }
];
