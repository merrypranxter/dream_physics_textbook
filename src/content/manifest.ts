import chapter01 from './chapters/chapter-01-ontology-of-the-dream-universe.md?raw';
import chapter02 from './chapters/chapter-02-emotional-field-theory.md?raw';
import chapter03 from './chapters/chapter-03-mnemonic-gravity-recursion.md?raw';
import chapter04 from './chapters/chapter-04-identity-topology-multiplicity.md?raw';
import chapter05 from './chapters/chapter-05-symbolic-mechanics.md?raw';
import chapter06 from './chapters/chapter-06-kairotempics.md?raw';
import chapter07 from './chapters/chapter-07-topology-of-impossible-space.md?raw';
import chapter08 from './chapters/chapter-08-consciousness-as-a-probability-engine.md?raw';
import chapter09 from './chapters/chapter-09-dream-energetics.md?raw';
import chapter10 from './chapters/chapter-10-failure-modes-of-dream-physics.md?raw';
import chapter11 from './chapters/chapter-11-the-psychedelic-interface.md?raw';
import chapter12 from './chapters/chapter-12-the-architecture-of-awakening.md?raw';
import chapter13 from './chapters/chapter-13-engineering-the-dream-system.md?raw';
import chapter14 from './chapters/chapter-14-the-dream-physics-of-art-creation.md?raw';
import chapter15 from './chapters/chapter-15-the-grand-synthesis.md?raw';
import appendix from './chapters/appendix-first-law.md?raw';

export type Chapter = {
  slug: string;
  number: number;
  numeral: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  raw: string;
  glyphs: string;
  palette: [string, string, string];
  law: string;
  material: string;
};

export const chapters: Chapter[] = [
  { slug: 'ontology', number: 1, numeral: '01', title: 'Ontology of the Dream Universe', shortTitle: 'Ontology', subtitle: 'What exists when the world is asleep', raw: chapter01, glyphs: '~≈○Ο·', palette: ['#ff63cf', '#68fff1', '#8459ff'], law: 'Perception condenses until it mistakes itself for matter.', material: 'liquid opal' },
  { slug: 'emotional-fields', number: 2, numeral: '02', title: 'Emotional Field Theory', shortTitle: 'Affective Fields', subtitle: 'How feelings sculpt dreamworld spacetime', raw: chapter02, glyphs: '∿↝●♡·', palette: ['#ff537d', '#ffb04a', '#d64dff'], law: 'Feeling curves the room before the room can contain it.', material: 'heated velvet' },
  { slug: 'mnemonic-gravity', number: 3, numeral: '03', title: 'Mnemonic Gravity & Recursion', shortTitle: 'Memory Gravity', subtitle: 'Memory as mass; recurrence as orbit', raw: chapter03, glyphs: '↺◌⊙∴·', palette: ['#ffd35a', '#fc5ca8', '#3c8dff'], law: 'What is unresolved becomes heavy enough to orbit.', material: 'golden sediment' },
  { slug: 'identity-topology', number: 4, numeral: '04', title: 'Identity Topology & Multiplicity', shortTitle: 'Identity', subtitle: 'The mathematics of the dream-self', raw: chapter04, glyphs: 'I|/\\⊕', palette: ['#77f9ff', '#c991ff', '#ff6fdf'], law: 'The witness, actor, and landscape share one nervous system.', material: 'multiplying mirror' },
  { slug: 'symbolic-mechanics', number: 5, numeral: '05', title: 'Symbolic Mechanics', shortTitle: 'Symbols', subtitle: 'How symbols form, mutate, and become narratives', raw: chapter05, glyphs: '⌁◇◆≋·', palette: ['#f6ff6b', '#ff5cba', '#53e5ff'], law: 'Meaning changes shape to conserve emotional charge.', material: 'holographic foil' },
  { slug: 'kairotempics', number: 6, numeral: '06', title: 'Kairotempics', shortTitle: 'Dream Time', subtitle: 'The physics of nonlinear dream time', raw: chapter06, glyphs: '↝⧖⋮∞·', palette: ['#7c72ff', '#ff75d8', '#a8ffbd'], law: 'Time advances only when significance changes phase.', material: 'slow chrome' },
  { slug: 'impossible-space', number: 7, numeral: '07', title: 'Topology of Impossible Space', shortTitle: 'Impossible Space', subtitle: 'Non-Euclidean dream architecture', raw: chapter07, glyphs: '┌┐╱╲⌂', palette: ['#46ffd2', '#3468ff', '#ff4fb8'], law: 'Doors join meanings, not measurements.', material: 'folded glass' },
  { slug: 'probability-engine', number: 8, numeral: '08', title: 'Consciousness as a Probability Engine', shortTitle: 'Probability', subtitle: 'The dream-mind as quantum observer', raw: chapter08, glyphs: '?∑ψ⋰·', palette: ['#c8ff5b', '#58b8ff', '#b94cff'], law: 'Attention chooses which possible world becomes visible.', material: 'interference silk' },
  { slug: 'dream-energetics', number: 9, numeral: '09', title: 'Dream Energetics', shortTitle: 'Energetics', subtitle: 'Emotional fuel, attention, and intention', raw: chapter09, glyphs: '+−↯≈·', palette: ['#ffdf57', '#ff704f', '#5affda'], law: 'Attention is currency; emotion is fuel; intention is force.', material: 'charged amber' },
  { slug: 'failure-modes', number: 10, numeral: '10', title: 'Failure Modes of Dream Physics', shortTitle: 'Failure Modes', subtitle: 'When dream logic breaks down', raw: chapter10, glyphs: '!//×?·', palette: ['#ff3f85', '#70f8ff', '#8f70ff'], law: 'A broken law reveals the renderer beneath it.', material: 'cracked signal' },
  { slug: 'psychedelic-interface', number: 11, numeral: '11', title: 'The Psychedelic Interface', shortTitle: 'The Interface', subtitle: 'Where dream physics overlaps waking reality', raw: chapter11, glyphs: '<>*#%·', palette: ['#ff4fd8', '#4dfff3', '#f4ff55'], law: 'Two render engines occupy the same sensory surface.', material: 'multichrome membrane' },
  { slug: 'awakening', number: 12, numeral: '12', title: 'The Architecture of Awakening', shortTitle: 'Awakening', subtitle: 'The physics of returning to waking reality', raw: chapter12, glyphs: '|/\\^°·', palette: ['#ffe6ff', '#85ddff', '#ffd66b'], law: 'The world returns by rebuilding its constraints.', material: 'pearl aperture' },
  { slug: 'engineering', number: 13, numeral: '13', title: 'Engineering the Dream System', shortTitle: 'Engineering', subtitle: 'Lucid dreaming as systems practice', raw: chapter13, glyphs: '[]{}=>·', palette: ['#6fffd2', '#5a8cff', '#fe65b7'], law: 'Lucidity is not control; it is negotiated instrumentation.', material: 'soft machinery' },
  { slug: 'art-creation', number: 14, numeral: '14', title: 'The Dream Physics of Art & Creation', shortTitle: 'Art & Creation', subtitle: 'Creative process through the dream-physics lens', raw: chapter14, glyphs: '✦✧:*·', palette: ['#ff4fa3', '#ffcf54', '#68f7ff'], law: 'Art stabilizes Oneiros long enough to share it.', material: 'pigment bloom' },
  { slug: 'grand-synthesis', number: 15, numeral: '15', title: 'The Grand Synthesis', shortTitle: 'Grand Synthesis', subtitle: 'The unified framework', raw: chapter15, glyphs: '∞ΟΣ✺·', palette: ['#ff65ce', '#60ffe8', '#9f6bff'], law: 'Every law is a local dialect of meaningful perception.', material: 'cosmic brocade' },
  { slug: 'first-law', number: 16, numeral: 'A', title: 'The First Law of Dream Physics', shortTitle: 'First Law', subtitle: 'Appendix: the invariant beneath the cosmos', raw: appendix, glyphs: 'Ⅰ≡○∞·', palette: ['#f8f0ff', '#8ef7ff', '#d5ff72'], law: 'Reality follows the strongest coherent meaning available.', material: 'archival opal' },
];

export const chapterBySlug = Object.fromEntries(chapters.map((chapter) => [chapter.slug, chapter]));
