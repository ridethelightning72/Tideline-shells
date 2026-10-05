// The shop catalog. Each entry is one species/grade you sell.
//
//   id          unique, lowercase, no spaces (used in the page URL)
//   name        scientific name, e.g. "Cypraea tigris"
//   author      optional authority, e.g. "Linnaeus, 1758"
//   common      optional common name
//   family      e.g. "Cypraeidae" (drives the family filter)
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
    name: "Cypraea tigris",
    author: "Linnaeus, 1758",
    common: "Tiger cowrie",
    family: "Cypraeidae",
    sizeMm: 85,
    price: 35,
    stock: 6,
    photos: [],
    description: "Glossy dorsum with bold dark spotting on a pale ground. Clean aperture and teeth."
  },
  {
    id: "conus-textile",
    name: "Conus textile",
    author: "Linnaeus, 1758",
    common: "Textile cone",
    family: "Conidae",
    sizeMm: 72,
    price: 28,
    stock: 4,
    photos: [],
    description: "Classic tented pattern in chestnut and gold, sharp lip, good colour."
  },
  {
    id: "murex-pecten",
    name: "Murex pecten",
    author: "Lightfoot, 1786",
    common: "Venus comb murex",
    family: "Muricidae",
    sizeMm: 120,
    price: 65,
    stock: 2,
    photos: [],
    description: "Long, delicate spines largely intact. A striking display piece."
  },
  {
    id: "haliotis-iris",
    name: "Haliotis iris",
    author: "Gmelin, 1791",
    common: "Pāua",
    family: "Haliotidae",
    sizeMm: 140,
    price: 45,
    stock: 8,
    photos: [],
    description: "Polished New Zealand pāua with intense blue-green iridescence."
  },
  {
    id: "amalda-australis",
    name: "Amalda australis",
    author: "Sowerby I, 1830",
    common: "Southern olive",
    family: "Ancillariidae",
    sizeMm: 38,
    price: 18,
    stock: 0,
    photos: [],
    description: "New Zealand endemic, smooth and lustrous with a banded spire."
  },
  {
    id: "harpa-major",
    name: "Harpa major",
    author: "Röding, 1798",
    common: "Major harp",
    family: "Harpidae",
    sizeMm: 90,
    price: 32,
    stock: 3,
    photos: [],
    description: "Strong axial ribs with rosy chevron pattern between them."
  },
  {
    id: "cypraea-mappa",
    name: "Leporicypraea mappa",
    author: "Linnaeus, 1758",
    common: "Map cowrie",
    family: "Cypraeidae",
    sizeMm: 70,
    price: 55,
    stock: 1,
    photos: [],
    description: "Intricate 'map' pattern with a well-defined dorsal line."
  },
  {
    id: "lambis-chiragra",
    name: "Harpago chiragra",
    author: "Linnaeus, 1758",
    common: "Chiragra spider conch",
    family: "Strombidae",
    sizeMm: 160,
    price: 48,
    stock: 0,
    photos: [],
    description: "Six long digitations, orange-pink aperture."
  }
];
