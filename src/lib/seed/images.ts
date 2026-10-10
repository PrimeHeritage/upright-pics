import type { ImageAsset } from '@/types'

/**
 * Placeholder photography (Unsplash licence, free to use). These are seed
 * images only: the owner replaces them with his own originals from the admin.
 * Credits are kept so the seed script can preserve attribution.
 */
const u = (
  id: string,
  width: number,
  height: number,
  alt: string,
  credit: string,
): ImageAsset & { credit: string } => ({
  src: `https://images.unsplash.com/${id}`,
  width,
  height,
  alt,
  credit,
})

export const seedImages = {
  // Weddings: white
  bridePortrait: u('photo-1645827042168-4fb0cdd0bf7e', 3264, 4928, 'Bride in a lace gown holding a bouquet of red roses', 'Oyemike Princewill'),
  brideWindow: u('photo-1649525663526-01467119a796', 4016, 5309, 'Bride in a ball gown by tall windows holding a bouquet', 'Gaff Multimedia'),
  coupleSofa: u('flagged/photo-1578905324575-6458ca977a28', 2500, 3750, 'Groom standing beside the bride seated on a leather sofa', 'Samson Ejim'),
  coupleKiss: u('photo-1551963319-13ff32a5acd1', 6240, 4160, 'Groom kissing the bride on her forehead outdoors', 'One zone Studio'),
  coupleMono: u('photo-1684253866485-b26f847ff97e', 3456, 5184, 'Black and white portrait of a bride and groom under palm trees', 'Elizabeth Pappoe'),
  ringHands: u('photo-1730321885391-74a0c04ef211', 3000, 2003, 'Bride and groom holding hands during the ceremony', 'Andrew Itaga'),

  // Weddings: traditional
  oliveCouple: u('photo-1788035963488-cbfabe82ed4a', 3851, 4814, 'Couple in olive green traditional Nigerian wedding attire', 'McFollis'),
  oliveBride: u('photo-1788035963411-368610593d20', 3880, 4850, 'Bride in an olive green dress and gele', 'McFollis'),
  oliveGroom: u('photo-1788035963223-06abb95a1289', 3808, 4760, 'Groom in a green agbada and cap holding a carved staff', 'McFollis'),
  blackCoupleWalk: u('photo-1790563378465-572d52edf0b1', 4480, 6720, 'Couple in black traditional attire walking down steps', 'McFollis'),
  blackCoupleLook: u('photo-1790563379817-b2b188ac7d87', 5600, 4480, 'Couple in black traditional attire looking at each other', 'McFollis'),
  blackCoupleStage: u('photo-1790563379948-3ca6ec50b3d3', 4480, 6720, 'Couple in black traditional attire on a warmly lit stage', 'McFollis'),
  asoOkeCouple: u('photo-1661332306744-70f9ed1a7f40', 7952, 5304, 'Couple in cream aso-oke with a gold hand fan', 'Tope. A Asokere'),
  asoOkeSmile: u('photo-1661332517932-2d441bfb2994', 5329, 5283, 'Couple in aso-oke and coral beads smiling together', 'Tope. A Asokere'),
  coralBride: u('photo-1618999114008-fbf937170cdb', 4000, 6000, 'Bride in coral beads and a red and gold crown', 'Dennis Irorere'),
  headdress: u('photo-1649677874593-a04cb075c7a0', 6016, 4016, 'Woman in an ornate headdress and feather shawl', 'Gaff Multimedia'),

  // Portraits
  turtleneck: u('photo-1605980776566-0486c3ac7617', 3933, 5090, 'Studio portrait of a man in a black turtleneck', 'Veroll Sterling'),
  tealBackdrop: u('photo-1709004915865-38bc70f4cb78', 4000, 6000, 'Man standing against a deep teal studio backdrop', 'Gilda González'),
  smileDark: u('photo-1596529257881-85dfcdc8f880', 2448, 3696, 'Smiling young man photographed on a black backdrop', 'Divine Effiong'),
  collar: u('photo-1614594955631-e977926ea681', 3536, 5000, 'Close portrait of a man adjusting his collar', 'Diana Simumpande'),
  profileBraid: u('photo-1527203561188-dae1bc1a417f', 5329, 7460, 'Profile of a woman with a long braided ponytail on ochre', 'Jessica Felicio'),
  leafCrown: u('photo-1593351799227-75df2026356b', 2448, 3600, 'Woman wearing a crown of green leaves', 'Divine Effiong'),
  blackSuit: u('photo-1636144896336-b056be4a8dfe', 2325, 3488, 'Woman in a black suit lit in low light', 'Mo Darbz'),
  blazerAfro: u('photo-1748290880596-2a2c80530bc0', 3648, 5472, 'Woman with an afro in a black blazer on a pale backdrop', 'Alexia'),
  seatedDenim: u('photo-1658497736108-c5f907966c51', 3456, 5184, 'Woman seated on a chair in a white top and denim', 'Jabari Timothy'),
  collarPrint: u('photo-1531123897727-8f129e1688ce', 4000, 6000, 'Woman in a printed dress holding her white collar', 'Prince Akachi'),
  headwrap: u('photo-1723922969507-5285cff3d8a9', 3376, 6000, 'Woman in a kente headwrap and statement earrings', 'Kingsley Hemans'),
  capPortrait: u('photo-1688143029511-b37423aa60a2', 4000, 6016, 'Man in a white kaftan and embroidered cap on black', 'Tolu Akinyemi'),

  // Family & celebrations
  familyMatching: u('photo-1775688425905-a4539d6160da', 3601, 5402, 'Family posing in matching traditional clothing', 'Oswald Elsaboath'),
  fatherSon: u('photo-1763368161231-3d1e91e48d08', 4244, 5305, 'Father carrying his son in matching white by the sea', 'Emmanuel Black'),
  festival: u('photo-1722481744477-d0b0bb2bbba2', 4000, 6000, 'Masquerade performer surrounded by a festival crowd', 'Ayano Tosin'),
  toast: u('photo-1699730164892-d7c433524ff3', 6989, 9318, 'Guests raising glasses under balloons and confetti', 'OurWhisky Foundation'),
  cultural: u('photo-1660675133902-acd1b057f75d', 4320, 2880, 'Dancers in traditional dress performing outdoors', 'Emmanuel Yeboah Okine'),

  // Graduations
  gradCouple: u('photo-1594750852563-5ed8e0421d40', 3334, 5000, 'Graduates in black gowns smiling on campus', 'Nqobile Vundla'),
  gradWalk: u('photo-1692883702706-a50fc21da44f', 3448, 5168, 'Two graduates in green gowns walking down a tree-lined road', 'Raymond Owusu-Afriyie'),
  gradChild: u('photo-1628198661856-102874fb9d82', 4608, 3072, 'Young girl in a green graduation gown and cap', 'Oyemike Princewill'),

  // Aerial
  aerialBridge: u('photo-1744907895363-d351aa6019ef', 4032, 2268, 'Aerial view of a bridge and lagoon in Lagos', 'Tunde Buremo'),
  aerialSkyline: u('photo-1749058388308-744fdc8991ed', 4224, 2814, 'Lagos skyline meeting the ocean from above', 'Onaopemipo Oladipupo'),
  aerialRiver: u('photo-1765475467677-579353b25ce0', 8000, 6000, 'Boats on the lagoon beside a bridge and the city', 'Malik Buraimoh'),
  aerialHighway: u('photo-1707008797390-38f13ea40163', 4320, 5400, 'Aerial view of a highway cutting through the city', 'Vitalis Nwenyi'),
  aerialMarket: u('photo-1785094165709-54fef69c2c4d', 3449, 5174, 'Top-down view of a market street with colourful umbrellas', 'Fahd Aminu'),

  // Craft
  shooting: u('photo-1621024994278-e409544f4085', 2997, 4504, 'Photographer shooting with a DSLR in a dark studio', 'Colin Lloyd'),
  lens: u('photo-1609034227505-5876f6aa4e90', 3072, 3840, 'Hand holding a camera lens under coloured light', 'Amari James'),
  silhouette: u('photo-1666114264360-0427e27ac91d', 3727, 5590, 'Silhouette of a photographer holding a camera', 'Mohammadreza Charkhgard'),
  galleryWall: u('photo-1781208745207-e8a4c9985de7', 7728, 5052, 'Wall of framed photographs in a warm gallery', 'Cristian Pineda'),
  framesInHand: u('photo-1789841418151-7a5b9a8812e6', 3259, 2185, 'Woman holding two framed prints against a wall', 'Barney Goodman'),
} satisfies Record<string, ImageAsset & { credit: string }>
