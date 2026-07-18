# Dave's Kitchen — Recipe System

## Overview
A public recipe site at https://daves-kitchen.pages.dev built with React, hosted on Netlify, with recipes stored as JSON files in this GitHub repo. Claude adds and edits recipes by pushing JSON files via the GitHub API.

## Credentials
- **GitHub repo**: dave-buchert/daves-kitchen
- **GitHub token**: stored in Dave's Claude memory (key: daves_kitchen_github_token)
- **Netlify**: auto-deploys from this repo's main branch — no action needed after pushing

## How to add a recipe
1. Create a JSON file in /recipes/ using the schema below
2. Push via GitHub API PUT to repos/dave-buchert/daves-kitchen/contents/recipes/{slug}.json
3. Netlify rebuilds automatically in ~30 seconds

## How to edit a recipe
1. GET the file to retrieve its current SHA
2. Modify the JSON
3. PUT with the updated content and SHA

## Recipe JSON schema
```json
{
  "slug": "kebab-case-title",
  "title": "Full Recipe Title",
  "description": "1-2 sentence description shown on card and detail page",
  "cuisine": "American | Italian | Mediterranean | Asian | Mexican | etc",
  "meal_type": "Breakfast | Lunch | Dinner | Salad | Snack | Dessert | Side",
  "protein": "Chicken | Beef | Turkey | Fish | Pork | Eggs | null",
  "dietary": ["Vegetarian", "Vegan", "Gluten-Free", "High Protein", "High Fiber", "Dairy-Free"],
  "prep_time_minutes": 10,
  "cook_time_minutes": 25,
  "servings": 4,
  "is_side": false,
  "pairs_with": ["slug-of-paired-recipe"],
  "ingredients": [
    {"amount": "1.5", "unit": "cup", "name": "ingredient name"},
    {"amount": "2", "unit": "", "name": "whole items like eggs or bananas"},
    {"amount": "1", "unit": "pinch", "name": "salt"}
  ],
  "instructions": [
    "Step one text.",
    "Step two text."
  ],
  "notes": "Optional notes, tips, variations. Use \n\n for paragraph breaks.",
  "image_url": null
}
```

## Field rules
- **slug**: lowercase, hyphens only, must be unique, matches filename
- **meal_type**: filter pills are built dynamically — new values appear automatically
- **protein**: null if not protein-forward (e.g. salads, snacks)
- **is_side**: true for sides, false for mains, snacks, breakfasts
- **pairs_with**: array of slugs; bidirectional linking is automatic in the UI
- **dietary**: array, can be empty []
- **ingredients amount**: always a string, numeric value ("0.5" not 0.5)
- **instructions**: array of strings, one string per step — no numbering, the UI adds numbers
- **notes**: plain text, supports \n\n paragraph breaks

## Existing meal_type values
Breakfast, Lunch, Dinner, Salad, Snack

## Site structure
- /recipes/*.json — one file per recipe
- /src/App.jsx — React frontend, reads recipe list from GitHub API at runtime
- /netlify.toml — build config
- /index.html, /src/main.jsx — entry points
