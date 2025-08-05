const testMode = true; // Set to false in production

const allIngredients = [
  "flour",
  "sugar",
  "milk",
  "eggs",
  "strawberries",
  "chocolate",
  "bananas",
];
const recipes = {
  "Strawberry Cake": ["flour", "sugar", "milk", "eggs", "strawberries"],
  "Chocolate Cake": ["flour", "sugar", "milk", "eggs", "chocolate"],
  Pancake: ["flour", "sugar", "milk", "eggs"],
  Omelette: ["eggs", "milk"],
  "Fruit Smoothie": ["milk", "bananas", "strawberries"],
  "Chocolate Milkshake": ["milk", "chocolate", "sugar"],
  "Banana Bread": ["flour", "sugar", "milk", "eggs", "bananas"],
};
let collected = JSON.parse(localStorage.getItem("ingredients")) || [];
let completedRecipes =
  JSON.parse(localStorage.getItem("completedRecipes")) || [];

function getIngredients() {
  const now = Date.now();
  const lastClaim = parseInt(localStorage.getItem("lastClaimTime") || 0);
  console.log(lastClaim, now);
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (!testMode && now - lastClaim < twentyFourHours) {
    document.getElementById("saved").innerText =
      "✅ Already claimed your ingredient! Wait until tomorrow.";
    return;
  }

  const newIngredient =
    allIngredients[Math.floor(Math.random() * allIngredients.length)];

  let message = "";

  if (!collected.includes(newIngredient)) {
    collected.push(newIngredient);
    localStorage.setItem("ingredients", JSON.stringify(collected));
    message += `🎉 You got: ${newIngredient}!`;
  } else {
    message += `😅 You got a duplicate: ${newIngredient}`;
  }

  localStorage.setItem("lastClaimTime", now);

  document.getElementById(
    "saved"
  ).innerText = `${message}\n🧺 Your ingredients: ${collected.join(", ")}`;

  updateCountdown();
}
/*
function checkCompletedRecipes() {
  const savedEl = document.getElementById("saved");
  const completedEl = document.getElementById("completed");

  if (collected.length === 0) {
    savedEl.innerText = "🚫 You haven't collected any ingredients yet!";
    completedEl.innerText = "";
    return; // Exit early
  }
  const normalizedCollected = collected.map((i) => i.trim().toLowerCase());
  let newCompletions = [];
  let message = "";

  // Helper: Find partial recipe matches
  function getPartialMatches() {
    const partials = [];

    for (const [recipeName, requiredIngredients] of Object.entries(recipes)) {
      const normalizedRequired = requiredIngredients.map((i) =>
        i.trim().toLowerCase()
      );
      const matched = normalizedRequired.filter((i) =>
        normalizedCollected.includes(i)
      );
      const remaining = normalizedRequired.filter(
        (i) => !normalizedCollected.includes(i)
      );

      if (
        remaining.length > 0 &&
        matched.length > 0 &&
        !completedRecipes.includes(recipeName)
      ) {
        partials.push({ recipeName, matched, remaining });
      }
    }

    return partials;
  }

  // Check complete recipes
  for (const [recipeName, requiredIngredients] of Object.entries(recipes)) {
    const normalizedRequired = requiredIngredients.map((i) =>
      i.trim().toLowerCase()
    );

    const isComplete = normalizedRequired.every((ing) =>
      normalizedCollected.includes(ing)
    );
    const alreadyCompleted = completedRecipes.includes(recipeName);

    if (isComplete && !alreadyCompleted) {
      completedRecipes.push(recipeName);
      newCompletions.push(recipeName);
    }
  }

  localStorage.setItem("completedRecipes", JSON.stringify(completedRecipes));

  // 🎉 New completions
  if (newCompletions.length > 0) {
    message += `🎉 You completed ${
      newCompletions.length > 1 ? "these recipes" : "a recipe"
    }:\n`;
    newCompletions.forEach((r) => (message += `• ${r}\n`));
  } else {
    message += "🙈 No new recipes completed today.\n";
  }

  // 🍽️ Display all completed recipes
  if (completedRecipes.length > 0) {
    message += `\n📜 Completed recipes:\n`;
    completedRecipes.forEach((r) => (message += `✔️ ${r}\n`));
  } else {
    message += "\n🗒️ No recipes completed yet.";
  }

  // ✨ Show recipe progress hints
  const partials = getPartialMatches();
  if (partials.length > 0) {
    message += `\n👀 You're getting close to:\n`;
    partials.forEach(({ recipeName, remaining }) => {
      message += `• ${recipeName}: Missing ${remaining.length} item${
        remaining.length > 1 ? "s" : ""
      } → ${remaining.join(", ")}\n`;
    });
    completedEl.innerText = message;
  }

  document.getElementById("completed").innerText = message;
}

*/

function checkCompletedRecipes() {
  const savedEl = document.getElementById("saved");
  const completedEl = document.getElementById("completed");

  if (collected.length === 0) {
    savedEl.innerText = "🚫 You haven't collected any ingredients yet!";
    completedEl.innerText = "";
    return;
  }

  const normalizedCollected = collected.map((i) => i.trim().toLowerCase());
  let newCompletions = [];
  let message = "";

  for (const [recipeName, requiredIngredients] of Object.entries(recipes)) {
    const normalizedRequired = requiredIngredients.map((i) =>
      i.trim().toLowerCase()
    );

    const isComplete = normalizedRequired.every((ing) =>
      normalizedCollected.includes(ing)
    );
    const alreadyCompleted = completedRecipes.includes(recipeName);

    if (isComplete && !alreadyCompleted) {
      completedRecipes.push(recipeName);
      newCompletions.push(recipeName);
    }
  }

  localStorage.setItem("completedRecipes", JSON.stringify(completedRecipes));

  if (newCompletions.length > 0) {
    message += `🎉 You completed ${
      newCompletions.length > 1 ? "these recipes" : "a recipe"
    }:\n`;
    newCompletions.forEach((r) => (message += `• ${r}\n`));
  } else {
    message += "🙈 No new recipes completed today.\n";
  }

  if (completedRecipes.length > 0) {
    message += `\n📜 Completed recipes:\n`;
    completedRecipes.forEach((r) => (message += `✔️ ${r}\n`));
  } else {
    message += "\n🗒️ No recipes completed yet.";
  }

  const partials = getPartialMatches(collected, recipes, completedRecipes);
  if (partials.length > 0) {
    message += `\n👀 You're getting close to:\n`;
    partials.forEach(({ recipeName, remaining }) => {
      message += `• ${recipeName}: Missing ${remaining.length} item${
        remaining.length > 1 ? "s" : ""
      } → ${remaining.join(", ")}\n`;
    });
  }

  completedEl.innerText = message;
}

function getPartialMatches(collected, recipes, completedRecipes) {
  const normalizedCollected = collected.map((i) => i.trim().toLowerCase());
  const partials = [];

  for (const [recipeName, requiredIngredients] of Object.entries(recipes)) {
    const normalizedRequired = requiredIngredients.map((i) =>
      i.trim().toLowerCase()
    );

    const matched = normalizedRequired.filter((i) =>
      normalizedCollected.includes(i)
    );

    const remaining = normalizedRequired.filter(
      (i) => !normalizedCollected.includes(i)
    );

    if (
      remaining.length > 0 &&
      matched.length > 0 &&
      !completedRecipes.includes(recipeName)
    ) {
      partials.push({ recipeName, matched, remaining });
    }
  }

  return partials;
}

function rewardsHistory() {
  const savedEl = document.getElementById("saved");
  const completedEl = document.getElementById("completed");

  if (collected.length === 0) {
    savedEl.innerText = "🚫 You haven't collected any ingredients yet!";
    completedEl.innerText = "";
  } else {
    savedEl.innerText = `🧺 Your ingredients: ${collected.join(", ")}`;
  }
}

function resetProgress() {
  localStorage.removeItem("ingredients");
  localStorage.removeItem("lastClaimTime");
  localStorage.removeItem("completedRecipes");
  collected = [];
  completedRecipes = [];
  document.getElementById("saved").innerText = "🔄 Progress has been reset!";
  document.getElementById("completed").innerText = "";
  updateCountdown();
}

function updateCountdown() {
  const countdownEl = document.getElementById("countdown");
  const lastClaim = parseInt(localStorage.getItem("lastClaimTime") || 0);
  const end = lastClaim + 24 * 60 * 60 * 1000;

  function tick() {
    const now = Date.now();
    const remaining = end - now;

    if (remaining <= 0) {
      countdownEl.innerText = "⏳ You can claim a new ingredient!";
      clearInterval(window.timer);
      return;
    }

    const hrs = Math.floor(remaining / (1000 * 60 * 60));
    const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((remaining % (1000 * 60)) / 1000);

    countdownEl.innerText = `⏱️ Next claim in: ${hrs}h ${mins}m ${secs}s`;
  }

  tick();
  clearInterval(window.timer);
  window.timer = setInterval(tick, 1000);
}

// Start countdown when the script runs
updateCountdown();
