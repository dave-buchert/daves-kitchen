import { useState, useEffect } from "react";

const GITHUB_RAW = "https://raw.githubusercontent.com/dave-buchert/daves-kitchen/main/recipes";
const GITHUB_API = "https://api.github.com/repos/dave-buchert/daves-kitchen/contents/recipes";

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

function Header({ onHome, searchQuery, setSearchQuery }) {
  return (
    <header style={{
      background: "#444441",
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ cursor: "pointer", flex: 1, minWidth: 160 }} onClick={onHome}>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#F1EFE8", letterSpacing: "-0.3px", fontFamily: "Georgia, serif" }}>
            Dave's Kitchen
          </div>
          <div style={{ fontSize: 12, color: "#F0997B", marginTop: 1, fontStyle: "italic" }}>
            Sharing as I learn
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
        {recipe.is_side && <Badge label="Side" color="green" />}
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

  const pairedRecipes = (recipe.pairs_with || [])
    .map(s => allRecipes.find(r => r.slug === s))
    .filter(Boolean);

  const pairedByOthers = allRecipes.filter(r =>
    r.slug !== recipe.slug && r.pairs_with?.includes(recipe.slug)
  );

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
            {[...pairedRecipes, ...pairedByOthers].map(r => (
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
  const cuisines = [...new Set(recipes.map(r => r.cuisine).filter(Boolean))];
  const mealTypes = [...new Set(recipes.map(r => r.meal_type).filter(Boolean))];
  const proteins = [...new Set(recipes.map(r => r.protein).filter(Boolean))];

  const select = (key, val) => setFilters(f => ({ ...f, [key]: f[key] === val ? "" : val }));

  const pill = (label, key, val) => (
    <button key={val} onClick={() => select(key, val)} style={{
      padding: "4px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer",
      border: filters[key] === val ? "1px solid #993C1D" : "1px solid #D3D1C7",
      background: filters[key] === val ? "#FDF0EB" : "white",
      color: filters[key] === val ? "#993C1D" : "#5F5E5A",
      fontWeight: filters[key] === val ? 500 : 400,
    }}>{label}</button>
  );

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
      {pill("Sides only", "is_side", true)}
      {mealTypes.map(v => pill(v, "meal_type", v))}
      {proteins.map(v => pill(v, "protein", v))}
      {cuisines.map(v => pill(v, "cuisine", v))}
    </div>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlug, setCurrentSlug] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ cuisine: "", meal_type: "", protein: "", is_side: "" });

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
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const searchable = [
        r.title, r.description, r.cuisine, r.meal_type, r.protein,
        ...(r.ingredients || []).map(i => i.name),
        ...(r.dietary || []),
      ].join(" ").toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });

  const SNACK_TYPES = ["Snack", "Appetizer"];
  const mains = filtered.filter(r => !r.is_side && !SNACK_TYPES.includes(r.meal_type));
  const sides = filtered.filter(r => r.is_side);
  const snacks = filtered.filter(r => !r.is_side && SNACK_TYPES.includes(r.meal_type));

  return (
    <div style={{ minHeight: "100vh", background: "#F8F6F4", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Header
        onHome={() => { setCurrentSlug(null); setSearchQuery(""); window.history.pushState({}, "", "/"); }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
                <section>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: "#888780", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
                    Snacks & Appetizers
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                    {snacks.map(r => <RecipeCard key={r.slug} recipe={r} onClick={setCurrentSlug} allRecipes={recipes} />)}
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
