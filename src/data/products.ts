export type Category = "chaînes" | "bracelets" | "bagues";
export type Color = "argent" | "doré";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  sizes: string[];
  colors: Color[];
  images: Record<Color, string>;
  stock: number;
}

export const categories: { name: Category; label: string }[] = [
  { name: "chaînes", label: "Chaînes" },
  { name: "bracelets", label: "Bracelets" },
  { name: "bagues", label: "Bagues" },
];

export const sizeGuideData = {
  chaînes: {
    title: "Guide des tailles — Chaînes",
    description: "Mesurez la longueur souhaitée autour de votre cou avec un mètre ruban souple.",
    sizes: [
      { size: "40 cm", description: "Ras du cou" },
      { size: "42 cm", description: "Court, au-dessus de la clavicule" },
      { size: "45 cm", description: "Classique, à la clavicule" },
      { size: "47 cm", description: "Mi-long" },
      { size: "50 cm", description: "Long, sous la clavicule" },
    ],
  },
  bracelets: {
    title: "Guide des tailles — Bracelets",
    description: "Mesurez votre tour de poignet et ajoutez 1 à 2 cm pour le confort.",
    sizes: [
      { size: "16 cm", description: "Poignet fin" },
      { size: "18 cm", description: "Poignet moyen" },
      { size: "20 cm", description: "Poignet large" },
    ],
  },
  bagues: {
    title: "Guide des tailles — Bagues",
    description: "Enroulez un fil autour de votre doigt et mesurez la longueur en mm. Divisez par 3.14 pour obtenir le diamètre.",
    sizes: [
      { size: "48", description: "Diamètre 15.3 mm" },
      { size: "50", description: "Diamètre 15.9 mm" },
      { size: "52", description: "Diamètre 16.5 mm" },
      { size: "54", description: "Diamètre 17.2 mm" },
      { size: "56", description: "Diamètre 17.8 mm" },
    ],
  },
};
