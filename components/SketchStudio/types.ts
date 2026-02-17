export enum AppState {
  DRAWING = 'DRAWING',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
  EDITING = 'EDITING'
}

export enum ContextOption {
  HUMAN = 'Human Character',
  OBJECT = 'Object / Prop',
  LANDSCAPE = 'Landscape / Environment',
  ARCHITECTURE = 'Architecture / Building',
  CREATURE = 'Fantasy Creature',
  VEHICLE = 'Vehicle / Machinery',
  ABSTRACT = 'Abstract Concept'
}

export enum StyleOption {
  CINEMATIC = 'Cinematic Realistic',
  PHOTOREALISTIC = 'Photorealistic',
  CYBERPUNK = 'Cyberpunk / Neon',
  STEAMPUNK = 'Steampunk',
  POPART = 'Pop Art',
  WATERCOLOR = 'Watercolor Painting',
  OIL_PAINTING = 'Oil Painting',
  ANIME = 'Anime / Manga',
  PIXEL_ART = 'Pixel Art',
  SKETCH = 'Detailed Pencil Sketch',
  FANTASY = 'High Fantasy',
  SCIFI = 'Sci-Fi Concept Art'
}

export interface GeneratedImage {
  imageUrl: string;
  promptUsed: string;
}

export interface GenerationConfig {
  context: ContextOption;
  style: StyleOption;
  customPrompt?: string;
}
