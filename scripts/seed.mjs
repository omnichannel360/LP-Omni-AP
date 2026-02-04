import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://fikhtfeqhzxcajbhjonf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpa2h0ZmVxaHp4Y2FqYmhqb25mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE5ODQwOCwiZXhwIjoyMDg1Nzc0NDA4fQ.zCsGEh8-Cy0Bk1gHERKQhgZYiB8NTS1I0I7OrhOLLAY"
);

const colorways = [
  { name: "Picket Fence", code: "WQ01", hex: "#c8bfb0" },
  { name: "Loft", code: "WQ06", hex: "#7a6e60" },
  { name: "White Elm", code: "WQ07", hex: "#d9d0c4" },
  { name: "Lyed Larch", code: "WQ30", hex: "#b5a88e" },
  { name: "White Oak", code: "WQ13", hex: "#ccc3b0" },
  { name: "Baltic Birch", code: "WQ12", hex: "#8a7e6e" },
  { name: "Knotty Spruce", code: "WQ29", hex: "#6e6354" },
  { name: "French Bobbin", code: "WQ08", hex: "#a09080" },
  { name: "Boat Shed", code: "WQ02", hex: "#5a5044" },
  { name: "Nordic Plank", code: "WQ15", hex: "#9e9080" },
  { name: "Boardwalk", code: "WQ10", hex: "#7e7264" },
  { name: "Mocha Legno", code: "WQ25", hex: "#6a5e50" },
  { name: "Mountain Lodge", code: "WQ24", hex: "#5e5448" },
  { name: "Wine Barrel", code: "WQ03", hex: "#4e4438" },
  { name: "Log Cabin", code: "WQ04", hex: "#544a3e" },
  { name: "Natural Oak", code: "WQ16", hex: "#b8a888" },
  { name: "Woodland Fog", code: "WQ22", hex: "#8e8878" },
  { name: "Driftwood", code: "WQ21", hex: "#7a7468" },
  { name: "Weathered Slate", code: "WQ14", hex: "#686058" },
  { name: "Petrified Ash", code: "WQ23", hex: "#5e5a50" },
  { name: "Antique Chest", code: "WQ11", hex: "#6e5840" },
  { name: "European Larch", code: "WQ17", hex: "#8a7050" },
  { name: "Fumed Oak", code: "WQ19", hex: "#504030" },
  { name: "Teak", code: "WQ18", hex: "#6e5438" },
  { name: "Charred Larch", code: "WQ09", hex: "#3a3028" },
  { name: "Shadow Oak", code: "WQ28", hex: "#484038" },
  { name: "Barn Door", code: "WQ05", hex: "#5a4e40" },
  { name: "Black Walnut", code: "WQ20", hex: "#3e3428" },
  { name: "Scorched Timber", code: "WQ26", hex: "#342c24" },
  { name: "Espresso Oak", code: "WQ27", hex: "#4a3e30" },
];

const specs = [
  { label: "Surface", value: "Ceiling" },
  { label: "Material", value: "Felt (100% polyester)" },
  { label: "Recycled Content", value: "60% minimum" },
  { label: "NRC Rating", value: "Testing in progress" },
  { label: "Thickness", value: '1/2" (12mm)' },
  { label: "Dimensions", value: '4" H x 24" W x 24" L\n6" H x 24" W x 24" L' },
  { label: "Fire Test", value: "ASTM E84-17a Class A" },
  { label: "Lead Time", value: "3\u20136 weeks" },
  { label: "Origin", value: "Manufactured and assembled in Australia" },
];

const resources = [
  "Specification Sheet",
  "Colorways",
  "Installation Guide",
  "Care Guide",
  "Warranty",
  "Material Safety",
  "LEED Contributions",
];

const sustainabilityContent =
  "We help designers, architects, and owners meet their clean building goals by testing all of our products against internationally recognized environmental and human safety standards to protect our employees, our customers, and future generations.";

const customContent =
  "Our design engineers and fabricators stand ready to serve on your design team, marrying their deep understanding of the art and science of soundscaping to your vision with custom cutting, printing, shaping, and technical advice to soundscape your designs. Let us help you.";

const howToSpecify = [
  {
    step: 1,
    title: "1. Choose your surfaces.",
    description:
      "Soundscape your space by placing enough sound absorption where it has the greatest impact. Hint: adjoining surfaces with sound absorbing materials reduce reverberation faster.",
  },
  {
    step: 2,
    title: "2. Select a color, pattern, or cut.",
    description:
      "Choose from our broad palette and pattern gallery to create your own unique design. Select a slat profile, overall tile size, and color combination.",
  },
  {
    step: 3,
    title: "3. Measure your installation space.",
    description:
      "Take the dimensions and get in touch so we can help you soundscape your space efficiently. Let us know the type and size of the ceiling grid supporting your frame.",
  },
];

// Products from listing page
const products = [
  {
    name: "Woven Ceiling Frames",
    slug: "woven-buffalo-woodgrain",
    category: "Woven",
    surface: "Ceiling Frames",
    description: "Bold, evenly spaced grid creating a striking yet balanced aesthetic.",
    gradient: "from-[#3a3028] via-[#5a4e40] to-[#8a7e6e]",
    status: "active",
    breadcrumb_category: "Ceiling",
    breadcrumb_type: "Frames",
    breadcrumb_series: "Woven",
    breadcrumb_availability: "Premier, WoodGrain",
    colorways,
    specs,
    resources,
    build_thicknesses: ["12mm"],
    build_sizes: ['4"H x 12"W x 12"L', '6"H x 12"W x 12"L'],
    build_face_colors: ["WoodGrain"],
    sustainability_content: sustainabilityContent,
    custom_content: customContent,
    custom_button_text: "Talk to Us",
    custom_button_link: "/contact",
    how_to_specify: howToSpecify,
    sort_order: 0,
  },
  {
    name: "Gingham",
    slug: "woven-gingham",
    category: "Woven",
    surface: "Ceiling Frames",
    description: "Classic crosshatch pattern with timeless appeal.",
    gradient: "from-[#5a5044] via-[#7a6e60] to-[#a09080]",
    status: "active",
    sort_order: 1,
  },
  {
    name: "Pincheck",
    slug: "woven-pincheck",
    category: "Woven",
    surface: "Ceiling Frames",
    description: "Delicate dotted texture for subtle acoustic elegance.",
    gradient: "from-[#6e5438] via-[#8a7050] to-[#b8a888]",
    status: "active",
    sort_order: 2,
  },
  {
    name: "Tartan",
    slug: "woven-tartan",
    category: "Woven",
    surface: "Ceiling Frames",
    description: "Intersecting lines creating depth and visual richness.",
    gradient: "from-[#4a3e30] via-[#6e5840] to-[#9e9080]",
    status: "active",
    sort_order: 3,
  },
  {
    name: "Rafter",
    slug: "rafter",
    category: "Frames",
    surface: "Ceiling",
    description: "Linear frame design for structured ceiling installations.",
    gradient: "from-[#4a3e30] to-[#6e5840]",
    status: "active",
    sort_order: 4,
  },
  {
    name: "Fillet",
    slug: "fillet",
    category: "Frames",
    surface: "Ceiling",
    description: "Refined recess frame for clean ceiling aesthetics.",
    gradient: "from-[#5a5044] to-[#8a7e6e]",
    status: "active",
    sort_order: 5,
  },
];

// Designs for the main Woven product
const designs = [
  {
    design_key: "buffalo",
    label: "Buffalo",
    title: "Woven, Buffalo",
    description:
      "Woven\u2019s Buffalo design is defined by its bold, evenly spaced grid, creating a striking yet balanced aesthetic. This pattern brings a sense of structure and warmth to any setting. Carefully engineered, it provides an ideal blend of openness and acoustic performance, making it well-suited for high-traffic areas. Easily integrated with ceiling elements such as sprinklers, speakers, and lighting, the Buffalo design enhances both functionality and visual appeal.",
    hero_images: [
      { url: "", caption: "Woven, Buffalo Ceiling Frames | French Bobbin | WoodGrain Collection" },
      { url: "", caption: "Woven, Buffalo Ceiling Frames | Nordic Plank | WoodGrain Collection" },
    ],
    sort_order: 0,
  },
  {
    design_key: "gingham",
    label: "Gingham",
    title: "Woven, Gingham",
    description:
      "Woven\u2019s Gingham design features a classic alternating checked pattern that radiates warmth and familiarity. With balanced proportions and refined detail, Gingham brings a sense of comfort to any ceiling installation while maintaining exceptional acoustic control in open-plan environments.",
    hero_images: [
      { url: "", caption: "Woven, Gingham Ceiling Frames | Loft | WoodGrain Collection" },
      { url: "", caption: "Woven, Gingham Ceiling Frames | White Elm | WoodGrain Collection" },
    ],
    sort_order: 1,
  },
  {
    design_key: "pincheck",
    label: "Pincheck",
    title: "Woven, Pincheck",
    description:
      "Woven\u2019s Pincheck design offers a refined, small-scale texture that appears solid from a distance while revealing intricate detail up close. This understated pattern is perfect for environments where subtle elegance and acoustic performance are equally important.",
    hero_images: [
      { url: "", caption: "Woven, Pincheck Ceiling Frames | European Larch | WoodGrain Collection" },
      { url: "", caption: "Woven, Pincheck Ceiling Frames | Teak | WoodGrain Collection" },
    ],
    sort_order: 2,
  },
  {
    design_key: "tartan",
    label: "Tartan",
    title: "Woven, Tartan",
    description:
      "Woven\u2019s Tartan design brings a bold, intersecting pattern of wide and narrow bands that commands attention. Inspired by traditional textile craft, this design transforms ceiling planes into dynamic architectural features while delivering outstanding sound absorption.",
    hero_images: [
      { url: "", caption: "Woven, Tartan Ceiling Frames | Log Cabin | WoodGrain Collection" },
      { url: "", caption: "Woven, Tartan Ceiling Frames | Black Walnut | WoodGrain Collection" },
    ],
    sort_order: 3,
  },
  {
    design_key: "tattersall",
    label: "Tattersall",
    title: "Woven, Tattersall",
    description:
      "Woven\u2019s Tattersall design features a subtle grid of evenly spaced lines creating a clean, structured pattern. This refined design offers an understated elegance ideal for professional settings where acoustic performance meets sophisticated aesthetic.",
    hero_images: [
      { url: "", caption: "Woven, Tattersall Ceiling Frames | Driftwood | WoodGrain Collection" },
      { url: "", caption: "Woven, Tattersall Ceiling Frames | Weathered Slate | WoodGrain Collection" },
    ],
    sort_order: 4,
  },
  {
    design_key: "windowpane",
    label: "Windowpane",
    title: "Woven, Windowpane",
    description:
      "Woven\u2019s Windowpane design creates a clean, wide-set grid that defines space with architectural clarity. The generous proportions between lines give this pattern an open, airy quality while the woven felt delivers exceptional noise reduction.",
    hero_images: [
      { url: "", caption: "Woven, Windowpane Ceiling Frames | Natural Oak | WoodGrain Collection" },
      { url: "", caption: "Woven, Windowpane Ceiling Frames | Boardwalk | WoodGrain Collection" },
    ],
    sort_order: 5,
  },
];

async function seed() {
  console.log("Seeding database...\n");

  // Insert products
  for (const product of products) {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error(`Error inserting product "${product.name}":`, error.message);
      continue;
    }

    console.log(`Created product: ${data.name} (${data.id})`);

    // Insert designs for the main woven product
    if (product.slug === "woven-buffalo-woodgrain") {
      for (const design of designs) {
        const { data: designData, error: designError } = await supabase
          .from("designs")
          .insert({ ...design, product_id: data.id })
          .select()
          .single();

        if (designError) {
          console.error(`Error inserting design "${design.label}":`, designError.message);
        } else {
          console.log(`  Design: ${designData.label} (${designData.id})`);
        }
      }
    }
  }

  console.log("\nSeed complete!");
}

seed().catch(console.error);
