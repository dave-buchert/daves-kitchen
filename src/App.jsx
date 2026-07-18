import { useState, useEffect } from "react";

const GITHUB_RAW = "https://raw.githubusercontent.com/dave-buchert/daves-kitchen/main/recipes";
const GITHUB_API = "https://api.github.com/repos/dave-buchert/daves-kitchen/contents/recipes";

const QUOTES = [
  "Nobody puts Baby in a corner. But nobody puts leftovers in the trash either. — Dirty Dancing",
  "I'll have what she's having. — When Harry Met Sally",
  "You is kind, you is smart, you is important. Also, you is hungry. — The Help",
  "Life is like a box of chocolates. You never know what you're gonna get. — Forrest Gump",
  "We accept the food we think we deserve. — The Perks of Being a Wallflower",
  "Toto, I have a feeling we're not in Kansas anymore. Also, where's the food? — Wizard of Oz",
  "Just keep swimming... to the kitchen. — Finding Nemo",
  "To infinity and beyond the refrigerator. — Toy Story",
  "You can't handle the truth... about how good this tastes. — A Few Good Men",
  "Why so serious? It's just dinner. — The Dark Knight",
  "I am Groot. I am also hungry. — Guardians of the Galaxy",
  "Here's looking at you, cook. — Casablanca",
  "Get busy cooking, or get busy starving. — The Shawshank Redemption",
  "You had me at 'dinner's ready.' — Jerry Maguire",
  "Hasta la vista, hunger. — Terminator 2",
  "May the forks be with you. — Star Wars",
  "Elementary, my dear Watson. Now eat your vegetables. — Sherlock Holmes",
  "I'm gonna make him an offer he can't refuse... seconds. — The Godfather",
  "With great hunger comes great responsibility. — Spider-Man",
  "After all, tomorrow is another meal. — Gone with the Wind",
  "You're gonna need a bigger bowl. — Jaws",
  "Keep your friends close, and your snacks closer. — The Godfather Part II",
  "I see dead people... and they're all waiting for dessert. — The Sixth Sense",
  "To eat, or not to eat — that is never actually a question. — Hamlet (film)",
  "It's not who I am underneath, but what I cook that defines me. — Batman Begins",
  "Carpe diem. Seize the spatula. — Dead Poets Society",
  "There's no place like home cooking. — The Wizard of Oz",
  "I feel the need... the need to feed. — Top Gun",
  "You complete me... and so does this meal. — Jerry Maguire",
  "Roads? Where we're going, we don't need roads — we need recipes. — Back to the Future",
  "As God is my witness, I'll never go hungry again. — Gone with the Wind",
  "Cooking is believing. — Field of Dreams",
  "It's alive! It's alive! The sourdough starter! — Frankenstein",
  "Go ahead, make my plate. — Dirty Harry",
  "I'm the king of the kitchen! — Titanic",
  "Bond. James Bond. Shaken, not stirred, and starving. — Dr. No",
  "They may take our lives, but they'll never take our recipes! — Braveheart",
  "A census taker once tried to test my recipe. I ate his lunch. — Silence of the Lambs",
  "What we've got here is a failure to season. — Cool Hand Luke",
  "I'm walking here! To the fridge! — Midnight Cowboy",
  "You can't sit with us... unless you brought snacks. — Mean Girls",
  "I volunteer as tribute... to do the dishes. — The Hunger Games",
  "Winter is coming. Better make soup. — Game of Thrones",
  "One does not simply walk into the kitchen without eating something. — Lord of the Rings",
  "We're gonna need a bigger table. — Jaws",
  "You is what you eat, so eat something wonderful. — The Help",
  "The first rule of dinner club: always talk about dinner club. — Fight Club",
  "To infinity and be-yond the snack cabinet. — Toy Story",
  "I'm not even supposed to be here today... but the food brought me back. — Clerks",
  "Life moves pretty fast. If you don't stop and eat once in a while, you could miss it. — Ferris Bueller's Day Off",
  "I ate his liver with some fava beans and a nice Chianti. — Silence of the Lambs",
  "Hasta la pasta, baby. — Terminator 2",
  "Show me the money... and the menu. — Jerry Maguire",
  "What is this? A recipe card for ants? — Zoolander",
  "You had me at garlic. — Jerry Maguire",
  "I'm kind of a big dill. — Anchorman",
  "Smells like team spirit... and roasted garlic. — Singles",
  "Magic Mirror on the wall, who's the greatest cook of all? — Snow White",
  "I'm not a smart man, but I know what hunger is. — Forrest Gump",
  "Houston, we have a dinner problem. — Apollo 13",
  "Just when I thought I was out, they pull me back in... for seconds. — The Godfather Part III",
  "In the beginning, there was broth. — The Ten Commandments",
  "I ate the whole thing. I regret nothing. — Apocalypse Now",
  "Are you not entertained? Are you not fed? — Gladiator",
  "I'm the ghost of dinners past. — A Christmas Carol",
  "Every time a bell rings, a new dish gets plated. — It's a Wonderful Life",
  "Not all those who wander are lost. Some are just looking for the kitchen. — Lord of the Rings",
  "My precious... leftovers. — The Lord of the Rings",
  "You is kind, you is smart, you is a good cook. — The Help",
  "Even the smallest person can change the course of dinner. — Lord of the Rings",
  "I volunteer as tribute to eat the last piece. — The Hunger Games",
  "The stuff that dreams are made of... is a good breakfast. — The Maltese Falcon",
  "After all, tomorrow is another chance to cook. — Gone with the Wind",
  "I'm having an old friend for dinner. — Silence of the Lambs",
  "You is what you cook. — The Help",
  "It's not the years, honey, it's the mileage... on the oven. — Raiders of the Lost Ark",
  "Why so hungry? — The Dark Knight",
  "I am Iron Chef. — Iron Man",
  "Wakanda forever in the kitchen. — Black Panther",
  "Avengers... assemble for dinner. — Avengers: Endgame",
  "I can do this all day. Especially if there's food involved. — Captain America",
  "We don't talk about Bruno... but we do talk about his recipes. — Encanto",
  "Remember who you are. And eat something. — The Lion King",
  "Hakuna matata. It means eat without worry. — The Lion King",
  "The circle of life includes the food chain. — The Lion King",
  "Just keep cooking. Just keep cooking. — Finding Nemo",
  "Fish are friends... and also delicious. — Finding Nemo",
  "Remy, you had me at bouillabaisse. — Ratatouille",
  "Anyone can cook. But not everyone does. — Ratatouille",
  "Ego has entered the restaurant. — Ratatouille",
  "The only thing standing between you and a good meal is effort. — The Pursuit of Happyness",
  "Get busy living, or get busy ordering takeout. — The Shawshank Redemption",
  "That'll do, pig. That'll do... now make breakfast. — Babe",
  "You is brave enough to cook it. — The Help",
  "I'll be back. For leftovers. — The Terminator",
  "E.T. phone home... for a reservation. — E.T.",
  "There's no crying in cooking. — A League of Their Own",
  "You can't handle the roux. — A Few Good Men",
  "Fasten your seatbelts. It's going to be a bumpy dinner. — All About Eve",
  "Here's Johnny... and he brought snacks. — The Shining",
];

function randomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

async function fetchRecipeList() {
  const res = await fetch(GITHUB_API);
  const files = await res.json();
  return files.filter(f => f.name.endsWith(".json")).map(f => f.name.replace(".json", ""));
}

async function fetchRecipe(slug) {
  const res = await fetch(`${GITHUB_RAW}/${slug}.json?cache=${Date.now()}`);
  return res.json();
}

async function fetchAllRecipes() {
  const slugs = await fetchRecipeList();
  const recipes = await Promise.all(slugs.map(fetchRecipe));
  return recipes;
}

function Badge({ label, color = "coral" }) {
  const styles = {
    coral: { bg: "#FDF0EB", color: "#993C1D", border: "1px solid #F5C4B3" },
    slate: { bg: "#F0EFEE", color: "#444441", border: "1px solid #D3D1C7" },
    green: { bg: "#EAF3DE", color: "#3B6D11", border: "1px solid #C0DD97" },
    blue:  { bg: "#E6F1FB", color: "#185FA5", border: "1px solid #B5D4F4" },
  };
  const s = styles[color] || styles.coral;
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: "2px 8px",
      borderRadius: 20, whiteSpace: "nowrap",
      background: s.bg, color: s.color, border: s.border,
    }}>{label}</span>
  );
}

function Header({ onHome, searchQuery, setSearchQuery, quote }) {
  return (
    <header style={{
      background: "#444441",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ cursor: "pointer", flex: 1, minWidth: 160 }} onClick={onHome}>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#F1EFE8", letterSpacing: "-0.3px", fontFamily: "Georgia, serif" }}>
            What Dave Made
          </div>
          <div style={{ fontSize: 12, color: "#F0997B", marginTop: 1, fontStyle: "italic" }}>
            {quote}
          </div>
        </div>
        <input
          type="search"
          placeholder="Search recipes, ingredients..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            padding: "8px 14px", borderRadius: 20, border: "1px solid #5F5E5A",
            background: "#2C2C2A", color: "#F1EFE8", fontSize: 14, width: 240,
            outline: "none",
          }}
        />
      </div>
    </header>
  );
}

function RecipeCard({ recipe, onClick, allRecipes }) {
  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);
  return (
    <div
      onClick={() => onClick(recipe.slug)}
      style={{
        background: "white", borderRadius: 10, border: "1px solid #F5C4B3",
        padding: "16px 18px", cursor: "pointer", transition: "box-shadow 0.15s",
        display: "flex", flexDirection: "column", gap: 8,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(211,90,48,0.12)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#2C2C2A", lineHeight: 1.3 }}>
          {recipe.title}
        </h3>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {recipe.healthy && <Badge label="✓ Healthy" color="green" />}
          {recipe.is_side && <Badge label="Side" color="slate" />}
        </div>
      </div>
      {recipe.description && (
        <p style={{ margin: 0, fontSize: 13, color: "#5F5E5A", lineHeight: 1.5 }}>
          {recipe.description}
        </p>
      )}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
        {recipe.meal_type && <Badge label={recipe.meal_type} color="slate" />}
        {recipe.protein && <Badge label={recipe.protein} color="coral" />}
        {recipe.cuisine && <Badge label={recipe.cuisine} color="blue" />}
        {totalTime > 0 && <Badge label={`${totalTime} min`} color="slate" />}
      </div>
      {recipe.pairs_with?.length > 0 && (
        <div style={{ fontSize: 12, color: "#854F0B", marginTop: 2 }}>
          Pairs with: {recipe.pairs_with.map(s => {
            const r = allRecipes.find(r => r.slug === s);
            return r ? r.title : s;
          }).join(", ")}
        </div>
      )}
    </div>
  );
}

function RecipeDetail({ recipe, onBack, allRecipes, onNavigate }) {
  const [servings, setServings] = useState(recipe.servings || 4);
  const baseServings = recipe.servings || 4;
  const ratio = servings / baseServings;

  const scaleAmount = (amount) => {
    if (!amount) return "";
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    const scaled = num * ratio;
    return scaled % 1 === 0 ? scaled : parseFloat(scaled.toFixed(2));
  };

  const pairedSlugs = new Set(recipe.pairs_with || []);
  const pairedByOtherSlugs = allRecipes
    .filter(r => r.slug !== recipe.slug && r.pairs_with?.includes(recipe.slug))
    .map(r => r.slug);
  pairedByOtherSlugs.forEach(s => pairedSlugs.add(s));

  const pairedRecipes = [...pairedSlugs]
    .map(s => allRecipes.find(r => r.slug === s))
    .filter(Boolean);

  const pairedByOthers = [];

  useEffect(() => {
    window.history.pushState({}, "", `/recipe/${recipe.slug}`);
    window.scrollTo(0, 0);
    return () => window.history.pushState({}, "", "/");
  }, [recipe.slug]);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
      <button
        onClick={onBack}
        style={{
          background: "none", border: "1px solid #D3D1C7", borderRadius: 6,
          padding: "6px 14px", fontSize: 13, color: "#5F5E5A", cursor: "pointer", marginBottom: 24,
        }}
      >
        ← All recipes
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#2C2C2A", fontFamily: "Georgia, serif", flex: 1 }}>
          {recipe.title}
        </h1>
        {recipe.is_side && <Badge label="Side dish" color="green" />}
      </div>

      {recipe.description && (
        <p style={{ margin: "0 0 20px", fontSize: 15, color: "#444441", lineHeight: 1.6 }}>
          {recipe.description}
        </p>
      )}
      {recipe.source_name && (
        <p style={{ margin: "-12px 0 20px", fontSize: 13, color: "#888780", fontStyle: "italic" }}>
          Recipe from{" "}
          {recipe.source_url
            ? <a href={recipe.source_url} target="_blank" rel="noopener noreferrer" style={{ color: "#993C1D", textDecoration: "none" }}>{recipe.source_name}</a>
            : recipe.source_name}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {recipe.cuisine && <Badge label={recipe.cuisine} color="blue" />}
        {recipe.meal_type && <Badge label={recipe.meal_type} color="slate" />}
        {recipe.protein && <Badge label={recipe.protein} color="coral" />}
        {(recipe.dietary || []).map(d => <Badge key={d} label={d} color="green" />)}
      </div>

      <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
        {recipe.prep_time_minutes > 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#993C1D" }}>{recipe.prep_time_minutes}</div>
            <div style={{ fontSize: 12, color: "#888780" }}>min prep</div>
          </div>
        )}
        {recipe.cook_time_minutes > 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#993C1D" }}>{recipe.cook_time_minutes}</div>
            <div style={{ fontSize: 12, color: "#888780" }}>min cook</div>
          </div>
        )}
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => setServings(Math.max(1, servings - 1))}
              style={{ background: "none", border: "1px solid #D3D1C7", borderRadius: 4, width: 24, height: 24, cursor: "pointer", fontSize: 16, color: "#444441" }}>−</button>
            <span style={{ fontSize: 20, fontWeight: 600, color: "#993C1D", minWidth: 24, textAlign: "center" }}>{servings}</span>
            <button onClick={() => setServings(servings + 1)}
              style={{ background: "none", border: "1px solid #D3D1C7", borderRadius: 4, width: 24, height: 24, cursor: "pointer", fontSize: 16, color: "#444441" }}>+</button>
          </div>
          <div style={{ fontSize: 12, color: "#888780" }}>servings</div>
        </div>
      </div>

      {recipe.ingredients?.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#2C2C2A", marginBottom: 14, fontFamily: "Georgia, serif" }}>
            Ingredients
          </h2>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 0 }}>
            {recipe.ingredients.map((ing, i) => (
              <li key={i} style={{ padding: "10px 0", borderBottom: "1px solid #F5EDE8", fontSize: 15, color: "#2C2C2A", userSelect: "text" }}>
                <span style={{ color: "#993C1D", fontWeight: 500 }}>
                  {scaleAmount(ing.amount)}{ing.unit ? ` ${ing.unit}` : ""}
                </span>
                {" "}{ing.name}{ing.note ? <span style={{ color: "#888780", fontSize: 13, fontStyle: "italic" }}> — {ing.note}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recipe.instructions?.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#2C2C2A", marginBottom: 14, fontFamily: "Georgia, serif" }}>
            Instructions
          </h2>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
            {recipe.instructions.map((step, i) => {
              const text = typeof step === "string" ? step : step.text;
              const cue = typeof step === "object" ? step.time_cue : null;
              return (
                <li key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <span style={{
                    minWidth: 28, height: 28, borderRadius: "50%",
                    background: "#444441", color: "#F1EFE8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 600, flexShrink: 0, marginTop: 2,
                  }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    {cue && (
                      <span style={{
                        display: "inline-block", fontSize: 11, fontWeight: 600,
                        color: "#185FA5", background: "#E6F1FB",
                        border: "1px solid #B5D4F4", borderRadius: 20,
                        padding: "1px 8px", marginBottom: 5,
                      }}>{cue}</span>
                    )}
                    <p style={{ margin: 0, fontSize: 15, color: "#2C2C2A", lineHeight: 1.7 }}>{text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {recipe.notes && (
        <div style={{
          background: "#FDF0EB", border: "1px solid #F5C4B3", borderRadius: 8,
          padding: "16px 18px", marginBottom: 32,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#993C1D", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Notes</div>
          <p style={{ margin: 0, fontSize: 14, color: "#444441", lineHeight: 1.7 }}>{recipe.notes}</p>
        </div>
      )}

      {(pairedRecipes.length > 0 || pairedByOthers.length > 0) && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#2C2C2A", marginBottom: 14, fontFamily: "Georgia, serif" }}>
            Pairs well with
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pairedRecipes.map(r => (
              <div key={r.slug}
                onClick={() => onNavigate(r.slug)}
                style={{
                  padding: "10px 14px", background: "white", border: "1px solid #F5C4B3",
                  borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: "#2C2C2A", fontWeight: 500 }}>{r.title}</span>
                <span style={{ fontSize: 12, color: "#993C1D" }}>{r.is_side ? "Side" : "Main"} →</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterBar({ filters, setFilters, recipes }) {
  const SECTION_MEAL_TYPES = [];
  const cuisines = [...new Set(recipes.map(r => r.cuisine).filter(Boolean))].sort();
  const mealTypes = [...new Set(recipes.map(r => r.meal_type).filter(Boolean))]
    .filter(v => !SECTION_MEAL_TYPES.includes(v)).sort();
  const proteins = [...new Set(recipes.map(r => r.protein).filter(Boolean))].sort();
  const dietaryTags = [...new Set(recipes.flatMap(r => r.dietary || []).filter(Boolean))].sort();

  const select = (key, val) => setFilters(f => ({ ...f, [key]: f[key] === val ? "" : val }));
  const hasAnyFilter = Object.values(filters).some(v => v !== "" && v !== false);

  const pill = (label, key, val) => (
    <button key={String(val)} onClick={() => select(key, val)} style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 12, cursor: "pointer",
      border: filters[key] === val ? "1px solid #993C1D" : "1px solid #D3D1C7",
      background: filters[key] === val ? "#FDF0EB" : "white",
      color: filters[key] === val ? "#993C1D" : "#5F5E5A",
      fontWeight: filters[key] === val ? 500 : 400,
    }}>{label}</button>
  );

  return (
    <div style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 10 }}>
      {proteins.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#B0ADA6", textTransform: "uppercase", letterSpacing: "0.06em", minWidth: 52 }}>Protein</span>
          {proteins.map(v => pill(v, "protein", v))}
        </div>
      )}
      {cuisines.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#B0ADA6", textTransform: "uppercase", letterSpacing: "0.06em", minWidth: 52 }}>Cuisine</span>
          {cuisines.map(v => pill(v, "cuisine", v))}
        </div>
      )}
      {mealTypes.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#B0ADA6", textTransform: "uppercase", letterSpacing: "0.06em", minWidth: 52 }}>Meal</span>
          {mealTypes.map(v => pill(v, "meal_type", v))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#B0ADA6", textTransform: "uppercase", letterSpacing: "0.06em", minWidth: 52 }}>Diet</span>
        {pill("✓ Healthy", "healthy", true)}
        {dietaryTags.map(v => pill(v, "dietary", v))}
      </div>
      {hasAnyFilter && (
        <div>
          <button onClick={() => setFilters({ cuisine: "", meal_type: "", protein: "", is_side: "", healthy: "", dietary: "" })} style={{
            padding: "3px 10px", borderRadius: 20, fontSize: 12, cursor: "pointer",
            border: "1px solid #F5C4B3", background: "#FDF0EB", color: "#993C1D", fontWeight: 500,
          }}>✕ Clear filters</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlug, setCurrentSlug] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ cuisine: "", meal_type: "", protein: "", is_side: "", healthy: "", dietary: "" });
  const [quote] = useState(randomQuote);

  useEffect(() => {
    fetchAllRecipes()
      .then(data => { setRecipes(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });

    const slug = window.location.pathname.match(/\/recipe\/(.+)/)?.[1];
    if (slug) setCurrentSlug(slug);
  }, []);

  const currentRecipe = currentSlug ? recipes.find(r => r.slug === currentSlug) : null;

  const filtered = recipes.filter(r => {
    if (filters.cuisine && r.cuisine !== filters.cuisine) return false;
    if (filters.meal_type && r.meal_type !== filters.meal_type) return false;
    if (filters.protein && r.protein !== filters.protein) return false;
    if (filters.is_side === true && !r.is_side) return false;
    if (filters.healthy === true && !r.healthy) return false;
    if (filters.dietary && !(r.dietary || []).includes(filters.dietary)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const searchable = [
        r.title, r.description, r.cuisine, r.meal_type, r.protein,
        r.source_name,
        ...(r.ingredients || []).map(i => i.name),
        ...(r.dietary || []),
      ].join(" ").toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });

  const SNACK_TYPES = ["Snack", "Appetizer"];
  const SALAD_TYPES = ["Salad"];
  const DESSERT_TYPES = ["Dessert"];
  const sort = arr => [...arr].sort((a, b) => a.title.localeCompare(b.title));
  const mains = sort(filtered.filter(r => !r.is_side && !SNACK_TYPES.includes(r.meal_type) && !SALAD_TYPES.includes(r.meal_type) && !DESSERT_TYPES.includes(r.meal_type)));
  const sides = sort(filtered.filter(r => r.is_side));
  const salads = sort(filtered.filter(r => !r.is_side && SALAD_TYPES.includes(r.meal_type)));
  const snacks = sort(filtered.filter(r => !r.is_side && SNACK_TYPES.includes(r.meal_type)));
  const desserts = sort(filtered.filter(r => !r.is_side && DESSERT_TYPES.includes(r.meal_type)));

  return (
    <div style={{ minHeight: "100vh", background: "#F8F6F4", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Header
        onHome={() => { setCurrentSlug(null); setSearchQuery(""); window.history.pushState({}, "", "/"); }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        quote={quote}
      />

      {currentRecipe ? (
        <RecipeDetail
          recipe={currentRecipe}
          onBack={() => { setCurrentSlug(null); window.history.pushState({}, "", "/"); }}
          allRecipes={recipes}
          onNavigate={setCurrentSlug}
        />
      ) : (
        <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
          {loading && (
            <div style={{ textAlign: "center", color: "#888780", padding: 60 }}>Loading recipes...</div>
          )}
          {error && (
            <div style={{ textAlign: "center", color: "#993C1D", padding: 60 }}>Error loading recipes: {error}</div>
          )}
          {!loading && !error && recipes.length === 0 && (
            <div style={{ textAlign: "center", color: "#888780", padding: 60 }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>No recipes yet</div>
            </div>
          )}
          {!loading && !error && recipes.length > 0 && (
            <>
              <FilterBar filters={filters} setFilters={setFilters} recipes={recipes} />
              {mains.length > 0 && (
                <section style={{ marginBottom: 40 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: "#888780", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
                    Main dishes
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                    {mains.map(r => <RecipeCard key={r.slug} recipe={r} onClick={setCurrentSlug} allRecipes={recipes} />)}
                  </div>
                </section>
              )}
              {salads.length > 0 && (
                <section style={{ marginBottom: 40 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: "#888780", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
                    Salads
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                    {salads.map(r => <RecipeCard key={r.slug} recipe={r} onClick={setCurrentSlug} allRecipes={recipes} />)}
                  </div>
                </section>
              )}
              {sides.length > 0 && (
                <section style={{ marginBottom: 40 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: "#888780", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
                    Sides
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                    {sides.map(r => <RecipeCard key={r.slug} recipe={r} onClick={setCurrentSlug} allRecipes={recipes} />)}
                  </div>
                </section>
              )}
              {snacks.length > 0 && (
                <section style={{ marginBottom: 40 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: "#888780", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
                    Snacks & Appetizers
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                    {snacks.map(r => <RecipeCard key={r.slug} recipe={r} onClick={setCurrentSlug} allRecipes={recipes} />)}
                  </div>
                </section>
              )}
              {desserts.length > 0 && (
                <section>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: "#888780", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
                    Desserts
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                    {desserts.map(r => <RecipeCard key={r.slug} recipe={r} onClick={setCurrentSlug} allRecipes={recipes} />)}
                  </div>
                </section>
              )}
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", color: "#888780", padding: 60 }}>No recipes match your search.</div>
              )}
            </>
          )}
        </main>
      )}
    </div>
  );
}
