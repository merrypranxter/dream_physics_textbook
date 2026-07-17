import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Copy,
  FlaskConical,
  Menu,
  Moon,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { DreamShader } from './components/DreamShader';
import { GlyphWeather } from './components/GlyphWeather';
import { MarkdownDocument } from './components/MarkdownDocument';
import { chapterBySlug, chapters, type Chapter } from './content/manifest';
import conceptsSource from './content/data/concepts.json';
import phenomenaSource from './content/data/phenomena.json';
import promptsSource from './content/data/prompts-index.json';

type Place = 'threshold' | 'manual' | 'symbolarium' | 'laboratory';
type ReadingMode = 'luminous' | 'quiet';
type Route = { place: Place; slug?: string };

type Concept = {
  name: string;
  symbol?: string;
  definition: string;
  chapter: number;
  tags: string[];
  equation?: string;
  properties?: string[];
  examples?: Array<string | { emotion: string; effect: string }>;
  components?: string[];
  mechanism?: string;
  manifestations?: string[];
};

type Phenomenon = {
  name: string;
  description: string;
  ai_prompt_tags: string[];
  category: string;
};

type ArtPrompt = { category: string; prompt: string };

const preferenceKey = 'dream-physics:reading-mode:v1';
const concepts = conceptsSource.concepts as Concept[];
const phenomena = phenomenaSource.categories.flatMap((category) =>
  category.phenomena.map((phenomenon) => ({ ...phenomenon, category: category.name })),
) as Phenomenon[];
const prompts = promptsSource.prompts as ArtPrompt[];

function readRoute(): Route {
  const [placeValue, slug] = window.location.hash.replace(/^#\/?/, '').split('/');
  const place = (['manual', 'symbolarium', 'laboratory'] as Place[]).includes(placeValue as Place)
    ? placeValue as Place
    : 'threshold';
  return { place, slug: place === 'manual' && chapterBySlug[slug] ? slug : undefined };
}

function chapterSearchText(chapter: Chapter) {
  return `${chapter.title} ${chapter.subtitle} ${chapter.law} ${chapter.raw}`.toLowerCase();
}

function navigate(place: Place, slug?: string) {
  const next = place === 'threshold' ? '#threshold' : `#${place}${slug ? `/${slug}` : ''}`;
  if (window.location.hash === next) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else window.location.hash = next;
}

function ChapterGlyph({ chapter }: { chapter: Chapter }) {
  return <span className="chapter-glyph" aria-hidden="true">{Array.from(chapter.glyphs).slice(0, 3).join('')}</span>;
}

function SearchLantern({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const lowered = query.trim().toLowerCase();
  const chapterMatches = lowered ? chapters.filter((chapter) => chapterSearchText(chapter).includes(lowered)).slice(0, 6) : [];
  const conceptMatches = lowered ? concepts.filter((concept) => `${concept.name} ${concept.definition} ${concept.tags.join(' ')}`.toLowerCase().includes(lowered)).slice(0, 5) : [];
  const phenomenonMatches = lowered ? phenomena.filter((phenomenon) => `${phenomenon.name} ${phenomenon.description} ${phenomenon.ai_prompt_tags.join(' ')}`.toLowerCase().includes(lowered)).slice(0, 5) : [];

  return (
    <div className="lantern-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="search-lantern" role="dialog" aria-modal="true" aria-labelledby="search-title">
        <div className="lantern-head">
          <div>
            <span className="eyebrow">Lantern / direct retrieval</span>
            <h2 id="search-title">Search the sleeping cosmos</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close search"><X /></button>
        </div>
        <label className="search-field">
          <Search aria-hidden="true" />
          <span className="sr-only">Search chapters, concepts, and phenomena</span>
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try memory, doors, identity, recursion…" />
        </label>
        {!lowered ? (
          <p className="lantern-hint">Type a word. The field will gather every nearby meaning.</p>
        ) : (
          <div className="search-results">
            <section>
              <h3>Field manual</h3>
              {chapterMatches.length ? chapterMatches.map((chapter) => (
                <a href={`#manual/${chapter.slug}`} onClick={onClose} key={chapter.slug}><span>{chapter.numeral}</span>{chapter.title}</a>
              )) : <p>No chapter answered.</p>}
            </section>
            <section>
              <h3>Symbols</h3>
              {conceptMatches.length ? conceptMatches.map((concept) => (
                <a href="#symbolarium" onClick={onClose} key={concept.name}><span>{concept.symbol || '◇'}</span>{concept.name}</a>
              )) : <p>No concept answered.</p>}
            </section>
            <section>
              <h3>Phenomena</h3>
              {phenomenonMatches.length ? phenomenonMatches.map((phenomenon) => (
                <a href="#symbolarium" onClick={onClose} key={phenomenon.name}><span>≈</span>{phenomenon.name}</a>
              )) : <p>No phenomenon answered.</p>}
            </section>
          </div>
        )}
      </section>
    </div>
  );
}

function Threshold({ onChapterHover }: { onChapterHover: (chapter: Chapter) => void }) {
  const onDoorPointer = (event: PointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
    event.currentTarget.style.setProperty('--lean-x', `${x * 3}deg`);
    event.currentTarget.style.setProperty('--lean-y', `${y * -3}deg`);
  };

  return (
    <main id="main" className="threshold-place">
      <section className="clearing" aria-labelledby="main-title">
        <div className="title-orbit">
          <span className="eyebrow">A field manual of the sleeping cosmos</span>
          <h1 id="main-title"><span>Dream</span> <span>Physics</span></h1>
          <p className="opening-law">Dreams are not broken reality. They are realities organized by different laws.</p>
          <div className="entry-actions">
            <button className="tactile-button primary" type="button" onClick={() => navigate('manual', 'ontology')}><BookOpen /> Enter the field manual</button>
            <button className="tactile-button" type="button" onClick={() => navigate('laboratory')}><FlaskConical /> Disturb a dream law</button>
          </div>
          <p className="framework-note">A speculative artistic framework—part textbook, part cosmology, part instrument for thinking sideways.</p>
        </div>
        <div className="oneiros-core" aria-hidden="true">
          <div className="core-ring ring-one" />
          <div className="core-ring ring-two" />
          <div className="core-ring ring-three" />
          <span>Ο</span>
          <small>ONEIROS</small>
        </div>
        <div className="clearing-marginalia" aria-hidden="true">
          <span>perception → matter</span>
          <span>emotion → curvature</span>
          <span>memory → gravity</span>
        </div>
      </section>

      <section className="chapter-habitat" aria-labelledby="chapter-path-title">
        <header className="habitat-heading">
          <div>
            <span className="eyebrow">The cultivated impossible</span>
            <h2 id="chapter-path-title">Fifteen clearings and one buried law</h2>
          </div>
          <p>Follow the path in order, or step sideways wherever a symbol catches your sleeve.</p>
        </header>
        <div className="chapter-garden" role="list">
          {chapters.map((chapter) => (
            <a
              className="chapter-door"
              href={`#manual/${chapter.slug}`}
              role="listitem"
              key={chapter.slug}
              style={{ '--door-a': chapter.palette[0], '--door-b': chapter.palette[1], '--door-c': chapter.palette[2] } as CSSProperties}
              onPointerMove={onDoorPointer}
              onPointerLeave={(event) => { event.currentTarget.style.setProperty('--lean-x', '0deg'); event.currentTarget.style.setProperty('--lean-y', '0deg'); }}
              onFocus={() => onChapterHover(chapter)}
              onMouseEnter={() => onChapterHover(chapter)}
            >
              <span className="door-surface">
                <span className="door-number">{chapter.numeral}</span>
                <ChapterGlyph chapter={chapter} />
                <strong>{chapter.shortTitle}</strong>
                <small>{chapter.material}</small>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="district-crossing" aria-labelledby="district-title">
        <div className="crossing-label">
          <span className="eyebrow">Lateral paths</span>
          <h2 id="district-title">The book grows extra organs</h2>
        </div>
        <a className="district-route symbol-route" href="#symbolarium">
          <Compass aria-hidden="true" />
          <span><strong>Symbolarium</strong><small>Concept atlas + phenomena seed bank</small></span>
          <span aria-hidden="true">◇ ≈ Ο ↺</span>
        </a>
        <a className="district-route lab-route" href="#laboratory">
          <FlaskConical aria-hidden="true" />
          <span><strong>Dream Laboratory</strong><small>Touch the equations and watch the scene answer</small></span>
          <span aria-hidden="true">Σ ∿ Δ ↯</span>
        </a>
      </section>
    </main>
  );
}

function Manual({ chapter, onSelect }: { chapter: Chapter; onSelect: (chapter: Chapter) => void }) {
  const [filter, setFilter] = useState('');
  const chapterIndex = chapters.indexOf(chapter);
  const previous = chapters[chapterIndex - 1];
  const next = chapters[chapterIndex + 1];
  const visibleChapters = chapters.filter((item) => chapterSearchText(item).includes(filter.toLowerCase()));

  return (
    <main id="main" className="manual-place">
      <aside className="manual-path" aria-label="Field manual chapters">
        <div className="location-marker"><span>You are here</span><strong>Field Manual / {chapter.numeral}</strong></div>
        <label className="chapter-filter"><Search /><span className="sr-only">Filter chapters</span><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Filter the path" /></label>
        <nav>
          {visibleChapters.map((item) => (
            <a
              href={`#manual/${item.slug}`}
              aria-current={item.slug === chapter.slug ? 'page' : undefined}
              key={item.slug}
              onClick={() => onSelect(item)}
            >
              <span>{item.numeral}</span><strong>{item.shortTitle}</strong><small>{item.glyphs}</small>
            </a>
          ))}
        </nav>
        {!visibleChapters.length && <p className="empty-path">No clearing carries that phrase. Try the lantern above.</p>}
      </aside>

      <article className="reader" style={{ '--chapter-a': chapter.palette[0], '--chapter-b': chapter.palette[1], '--chapter-c': chapter.palette[2] } as CSSProperties}>
        <header className="chapter-header">
          <div className="chapter-coordinate"><span>FIELD</span><strong>{chapter.numeral}</strong></div>
          <div>
            <span className="eyebrow">Material condition: {chapter.material}</span>
            <h1>{chapter.title}</h1>
            <p>{chapter.subtitle}</p>
          </div>
          <pre className="chapter-ascii" aria-label={`Symbol alphabet for ${chapter.title}`}>{`╭─ ${chapter.glyphs} ─╮\n│ ${chapter.glyphs.split('').reverse().join('')} │\n╰─ ${chapter.glyphs} ─╯`}</pre>
        </header>
        <aside className="governing-law"><span>Local law</span><p>{chapter.law}</p></aside>
        <MarkdownDocument chapter={chapter} />
        <nav className="reader-neighbors" aria-label="Adjacent chapters">
          {previous ? <a href={`#manual/${previous.slug}`}><ChevronLeft /><span><small>Previous clearing</small>{previous.shortTitle}</span></a> : <a href="#threshold"><ChevronLeft /><span><small>Return</small>The threshold</span></a>}
          {next ? <a href={`#manual/${next.slug}`}><span><small>Next clearing</small>{next.shortTitle}</span><ChevronRight /></a> : <a href="#symbolarium"><span><small>Continue sideways</small>Symbolarium</span><ChevronRight /></a>}
        </nav>
      </article>
    </main>
  );
}

function Symbolarium({ onTheme }: { onTheme: (chapter: Chapter) => void }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All fields');
  const [copied, setCopied] = useState<string | null>(null);
  const lowered = query.toLowerCase();
  const categories = ['All fields', ...phenomenaSource.categories.map((item) => item.name)];
  const visiblePhenomena = phenomena.filter((item) =>
    (category === 'All fields' || item.category === category)
    && `${item.name} ${item.description} ${item.ai_prompt_tags.join(' ')}`.toLowerCase().includes(lowered),
  );
  const visibleConcepts = concepts.filter((item) => `${item.name} ${item.definition} ${item.tags.join(' ')}`.toLowerCase().includes(lowered));

  const copyConcept = async (concept: Concept) => {
    try {
      await navigator.clipboard.writeText(`${concept.name}: ${concept.definition}${concept.equation ? `\n${concept.equation}` : ''}`);
      setCopied(concept.name);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied('error');
      window.setTimeout(() => setCopied(null), 1800);
    }
  };

  return (
    <main id="main" className="symbolarium-place">
      <header className="place-intro">
        <div>
          <span className="eyebrow">District 02 / searchable seed bank</span>
          <h1>The Symbolarium</h1>
          <p>Concepts are preserved as specimens. Phenomena are allowed to cross-pollinate.</p>
        </div>
        <pre aria-hidden="true">{`  ◇──Ο──≈\n ╱   ↺   ╲\nψ──∞──∿──Σ`}</pre>
      </header>

      <section className="atlas-controls" aria-label="Filter the symbolarium">
        <label className="search-field"><Search /><span className="sr-only">Search the atlas</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search symbol, symptom, law…" /></label>
        <div className="category-current"><span>Field</span><strong>{category}</strong></div>
      </section>

      <section className="concept-beds" aria-labelledby="concepts-title">
        <header><span className="eyebrow">Fundamental structures</span><h2 id="concepts-title">Concept specimens</h2></header>
        <div className="specimen-shelf">
          {visibleConcepts.map((concept) => {
            const sourceChapter = chapters[Math.max(0, concept.chapter - 1)];
            return (
              <article
                className={`concept-specimen ${copied === concept.name ? 'just-copied' : ''}`}
                key={concept.name}
                onMouseEnter={() => onTheme(sourceChapter)}
                style={{ '--specimen-a': sourceChapter.palette[0], '--specimen-b': sourceChapter.palette[1] } as CSSProperties}
              >
                <div className="specimen-mark" aria-hidden="true">{concept.symbol || sourceChapter.glyphs[0]}</div>
                <span className="specimen-coordinate">CH {String(concept.chapter).padStart(2, '0')}</span>
                <h3>{concept.name}</h3>
                <p>{concept.definition}</p>
                {concept.equation && <code>{concept.equation}</code>}
                <div className="tag-cluster">{concept.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="specimen-actions">
                  <a href={`#manual/${sourceChapter.slug}`}>Read the source</a>
                  <button type="button" onClick={() => copyConcept(concept)} aria-label={`Copy definition of ${concept.name}`}>
                    {copied === concept.name ? <Check /> : <Copy />}{copied === concept.name ? 'Captured' : 'Copy'}
                  </button>
                </div>
                {copied === concept.name && <span className="copy-residue" aria-hidden="true">✦ · ✧ · ✦</span>}
              </article>
            );
          })}
        </div>
        {!visibleConcepts.length && <p className="empty-path">No concept crystallized from that search.</p>}
      </section>

      <section className="phenomena-bank" aria-labelledby="phenomena-title">
        <header><span className="eyebrow">Observed dream behaviors</span><h2 id="phenomena-title">Phenomena seed bank</h2></header>
        <div className="field-tabs" role="group" aria-label="Phenomena category">
          {categories.map((item) => <button className={category === item ? 'active' : ''} type="button" onClick={() => setCategory(item)} key={item}>{item}</button>)}
        </div>
        <div className="phenomena-flow">
          {visiblePhenomena.map((phenomenon, index) => (
            <article key={phenomenon.name} style={{ '--seed-index': index % 7 } as CSSProperties}>
              <span>{phenomenon.category}</span>
              <h3>{phenomenon.name}</h3>
              <p>{phenomenon.description}</p>
              <small>{phenomenon.ai_prompt_tags.join(' · ')}</small>
            </article>
          ))}
        </div>
        {!visiblePhenomena.length && <p className="empty-path">The seed bank is dormant under that filter.</p>}
      </section>
      <p className="copy-status" aria-live="polite">{copied === 'error' ? 'The symbol resisted copying. Select the text manually.' : copied ? `${copied} captured to your clipboard.` : ''}</p>
    </main>
  );
}

function asciiDream(coherence: number, fragmentation: number, salience: number) {
  const ramp = ' .·:≈*Ο#@';
  const rows: string[] = [];
  for (let y = 0; y < 13; y += 1) {
    let row = '';
    for (let x = 0; x < 31; x += 1) {
      const dx = x - 15;
      const dy = y - 6;
      const radial = Math.sin(Math.hypot(dx, dy) * (.32 + salience / 190) - coherence / 17);
      const fracture = Math.sin((x * 1.7 + y * 2.3) * (fragmentation / 115 + .12));
      const value = Math.max(0, Math.min(.999, .5 + radial * .27 + fracture * fragmentation / 420));
      row += ramp[Math.floor(value * ramp.length)];
    }
    rows.push(row);
  }
  return rows.join('\n');
}

function Laboratory({ onTheme }: { onTheme: (chapter: Chapter) => void }) {
  const [coherence, setCoherence] = useState(72);
  const [fragmentation, setFragmentation] = useState(34);
  const [salience, setSalience] = useState(58);
  const [category, setCategory] = useState('concept');
  const [oracleIndex, setOracleIndex] = useState(0);
  const sceneStability = Math.round(Math.min(100, coherence * 120 / (coherence + fragmentation * 1.3 + 18)));
  const identityContainment = Math.round(Math.max(0, 100 - salience * .66 - fragmentation * .3 + coherence * .25));
  const state = sceneStability > 78 ? 'crystalline' : sceneStability > 50 ? 'breathing' : sceneStability > 25 ? 'recursive' : 'dissolving';
  const categoryPrompts = prompts.filter((prompt) => prompt.category === category);
  const prompt = categoryPrompts[oracleIndex % Math.max(1, categoryPrompts.length)] || prompts[0];

  useEffect(() => { onTheme(chapters[8]); }, [onTheme]);

  return (
    <main id="main" className="laboratory-place">
      <header className="place-intro lab-intro">
        <div>
          <span className="eyebrow">District 03 / lawful interference</span>
          <h1>The Dream Laboratory</h1>
          <p>Touch the variables. The instrument does not predict dreams—it makes the book’s internal physics legible.</p>
        </div>
        <div className="lab-status"><span>Scene state</span><strong>{state}</strong><small>simulation only</small></div>
      </header>

      <section className="instrument-bench" aria-labelledby="instrument-title">
        <div className="instrument-controls">
          <header><span className="eyebrow">Instrument 01</span><h2 id="instrument-title">Affective scene stabilizer</h2></header>
          <label>
            <span><strong>Emotional coherence</strong><output>{coherence}</output></span>
            <input type="range" min="0" max="100" value={coherence} onChange={(event) => setCoherence(Number(event.target.value))} />
            <small>Clear emotional current binds a scene.</small>
          </label>
          <label>
            <span><strong>Memory fragmentation</strong><output>{fragmentation}</output></span>
            <input type="range" min="0" max="100" value={fragmentation} onChange={(event) => setFragmentation(Number(event.target.value))} />
            <small>Competing memory shards shear continuity.</small>
          </label>
          <label>
            <span><strong>Symbolic salience</strong><output>{salience}</output></span>
            <input type="range" min="0" max="100" value={salience} onChange={(event) => setSalience(Number(event.target.value))} />
            <small>What matters grows until it becomes geography.</small>
          </label>
        </div>
        <div className="instrument-output" data-state={state}>
          <div className="output-meters">
            <span><small>Scene stability</small><strong>{sceneStability}%</strong></span>
            <span><small>I-Nexus containment</small><strong>{identityContainment}%</strong></span>
          </div>
          <pre aria-label={`ASCII simulation of a ${state} dream scene`}>{asciiDream(coherence, fragmentation, salience)}</pre>
          <p><strong>Reading:</strong> {state === 'crystalline' ? 'The scene has mistaken coherence for architecture.' : state === 'breathing' ? 'Boundaries hold, but the room knows it is being observed.' : state === 'recursive' ? 'Memory wells are pulling the scene back through itself.' : 'Meaning remains; geometry has resigned.'}</p>
        </div>
      </section>

      <section className="oracle-bench" aria-labelledby="oracle-title">
        <div className="oracle-heading"><span className="eyebrow">Instrument 02 / sourced prompt material</span><h2 id="oracle-title">Visual law oracle</h2></div>
        <div className="oracle-categories" role="group" aria-label="Prompt category">
          {promptsSource.categories.map((item) => <button type="button" className={category === item ? 'active' : ''} onClick={() => { setCategory(item); setOracleIndex(0); }} key={item}>{item}</button>)}
        </div>
        <blockquote><span aria-hidden="true">“</span>{prompt.prompt}<span aria-hidden="true">”</span></blockquote>
        <button className="tactile-button" type="button" onClick={() => setOracleIndex((value) => value + 1)}><Sparkles /> Re-seed the oracle</button>
      </section>

      <aside className="lab-disclaimer">These controls illustrate the textbook’s speculative equations. They are not clinical measurements, diagnostic tools, or instructions for altering consciousness.</aside>
    </main>
  );
}

function ArchiveColophon() {
  return (
    <footer className="archive-colophon" data-status="verified">
      <div className="archive-signal" aria-hidden="true">// SOURCE SIGNAL: INTACT // 07.17.2026 //</div>
      <div>
        <span className="eyebrow">Compost / provenance / exit</span>
        <h2>The manual remains underneath the weather.</h2>
      </div>
      <p><strong>Editorial condition:</strong> supplied manuscript preserved intact; structured chapters and data drawn from the source archive. Source link verified <time dateTime="2026-07-17">July 17, 2026</time>.</p>
      <nav aria-label="Source and return links">
        <a href="https://github.com/merrypranxter/dream_physics" target="_blank" rel="noreferrer">Original source archive ↗</a>
        <a href="#threshold">Return to the threshold ↑</a>
      </nav>
    </footer>
  );
}

function App() {
  const [route, setRoute] = useState<Route>(() => readRoute());
  const [themeChapter, setThemeChapter] = useState(chapters[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [whisper, setWhisper] = useState(false);
  const [readingMode, setReadingMode] = useState<ReadingMode>(() => {
    try {
      const saved = localStorage.getItem(preferenceKey);
      return saved === 'quiet' ? 'quiet' : 'luminous';
    } catch { return 'luminous'; }
  });

  const activeChapter = route.place === 'manual' && route.slug ? chapterBySlug[route.slug] : themeChapter;
  const quiet = readingMode === 'quiet';
  const placeLabel = route.place === 'threshold' ? 'Threshold' : route.place === 'manual' ? 'Field Manual' : route.place === 'symbolarium' ? 'Symbolarium' : 'Dream Laboratory';

  useEffect(() => {
    const onHash = () => {
      const next = readRoute();
      setRoute(next);
      setMenuOpen(false);
      if (next.place === 'manual' && next.slug) setThemeChapter(chapterBySlug[next.slug]);
      else if (next.place === 'symbolarium') setThemeChapter(chapters[4]);
      else if (next.place === 'laboratory') setThemeChapter(chapters[8]);
      else setThemeChapter(chapters[0]);
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    window.addEventListener('hashchange', onHash);
    if (!window.location.hash) window.history.replaceState(null, '', '#threshold');
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.title = route.place === 'manual' && route.slug ? `${chapterBySlug[route.slug].title} — Dream Physics` : `${placeLabel} — Dream Physics`;
  }, [placeLabel, route]);

  useEffect(() => {
    let timer = window.setTimeout(() => setWhisper(true), 14000);
    const settle = () => {
      window.clearTimeout(timer);
      setWhisper(false);
      timer = window.setTimeout(() => setWhisper(true), 30000);
    };
    window.addEventListener('pointerdown', settle, { passive: true });
    window.addEventListener('keydown', settle);
    window.addEventListener('scroll', settle, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerdown', settle);
      window.removeEventListener('keydown', settle);
      window.removeEventListener('scroll', settle);
    };
  }, []);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);

  const changeReadingMode = () => {
    const next: ReadingMode = quiet ? 'luminous' : 'quiet';
    setReadingMode(next);
    try { localStorage.setItem(preferenceKey, next); } catch { /* Complete default remains available. */ }
  };

  const forgetPreference = () => {
    setReadingMode('luminous');
    try { localStorage.removeItem(preferenceKey); } catch { /* Storage is optional. */ }
  };

  const rootStyle = useMemo(() => ({
    '--theme-a': activeChapter.palette[0],
    '--theme-b': activeChapter.palette[1],
    '--theme-c': activeChapter.palette[2],
  }) as CSSProperties, [activeChapter]);

  return (
    <div className="dream-app" data-reading-mode={readingMode} style={rootStyle}>
      <a className="skip-link" href="#main">Skip to main content</a>
      <DreamShader chapter={activeChapter} quiet={quiet} />
      <GlyphWeather chapter={activeChapter} quiet={quiet} />
      <div className="atmosphere-grain" aria-hidden="true" />

      <header className="site-header">
        <a className="site-mark" href="#threshold" aria-label="Dream Physics — return to threshold"><span>Ο</span><strong>DREAM<br />PHYSICS</strong></a>
        <div className="where-am-i"><span>You are here</span><strong>{placeLabel}{route.slug ? ` / ${activeChapter.numeral}` : ''}</strong></div>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="Toggle site paths">{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? 'open' : ''} aria-label="Primary paths">
          <a href="#threshold" aria-current={route.place === 'threshold' ? 'page' : undefined}>Threshold</a>
          <a href="#manual/ontology" aria-current={route.place === 'manual' ? 'page' : undefined}>Field Manual</a>
          <a href="#symbolarium" aria-current={route.place === 'symbolarium' ? 'page' : undefined}>Symbolarium</a>
          <a href="#laboratory" aria-current={route.place === 'laboratory' ? 'page' : undefined}>Dream Lab</a>
        </nav>
        <div className="header-tools">
          <button type="button" onClick={() => setSearchOpen(true)} aria-label="Open search lantern"><Search /><span>Search</span><kbd>⌘/</kbd></button>
          <button type="button" className="mode-button" onClick={changeReadingMode} aria-pressed={quiet} title="This single visual preference is remembered only in this browser."><Moon /><span>{quiet ? 'Re-enchant' : 'Quiet reading'}</span></button>
        </div>
      </header>

      {route.place === 'threshold' && <Threshold onChapterHover={setThemeChapter} />}
      {route.place === 'manual' && <Manual chapter={activeChapter} onSelect={setThemeChapter} />}
      {route.place === 'symbolarium' && <Symbolarium onTheme={setThemeChapter} />}
      {route.place === 'laboratory' && <Laboratory onTheme={setThemeChapter} />}

      <ArchiveColophon />
      <button className="preference-reset" type="button" onClick={forgetPreference}>Forget display preference</button>
      <div className={`field-whisper ${whisper ? 'awake' : ''}`} aria-hidden="true"><span>the margin briefly remembers itself</span><b>⌁</b></div>
      {searchOpen && <SearchLantern onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

export default App;
