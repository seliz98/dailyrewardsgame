const testMode = true; // Set to false in production

const allIngredients = ["flour", "sugar", "milk", "eggs", "strawberries"];
const recipes = {
  "Strawberry Cake": ["flour", "sugar", "milk", "eggs", "strawberries"],
  // Add more recipes here
};
let completedRecipes =
  JSON.parse(localStorage.getItem("completedRecipes")) || [];

let collected = JSON.parse(localStorage.getItem("ingredients")) || [];

function getIngredients() {
  const now = Date.now();
  const lastClaim = parseInt(localStorage.getItem("lastClaimTime") || 0);
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (!testMode && now - lastClaim < twentyFourHours) {
    document.getElementById("saved").innerText =
      "✅ Already claimed your ingredient! Wait until tomorrow.";
    return;
  }
  /* if (now - lastClaim < twentyFourHours) {
    document.getElementById("saved").innerText =
      "✅ Already claimed your ingredient! Wait until tomorrow.";
    return;
  }*/

  const newIngredient =
    allIngredients[Math.floor(Math.random() * allIngredients.length)];

  if (!collected.includes(newIngredient)) {
    collected.push(newIngredient);
    localStorage.setItem("ingredients", JSON.stringify(collected));
    document.getElementById(
      "saved"
    ).innerText = `🎉 You got: ${newIngredient}!`;
  } else {
    document.getElementById(
      "saved"
    ).innerText = `😅 You got a duplicate: ${newIngredient}`;
  }

  localStorage.setItem("lastClaimTime", now);
  document.getElementById("saved").innerText +=
    "\n🧺 Your ingredients: " + collected.join(", ");
  checkCompletedRecipes();
  updateCountdown();
}

function checkCompletedRecipes() {
  for (const [recipeName, requiredIngredients] of Object.entries(recipes)) {
    const isComplete = requiredIngredients.every((ing) =>
      collected.includes(ing)
    );
    const alreadyCompleted = completedRecipes.includes(recipeName);

    if (isComplete && !alreadyCompleted) {
      completedRecipes.push(recipeName);
      localStorage.setItem(
        "completedRecipes",
        JSON.stringify(completedRecipes)
      );
      document.getElementById(
        "saved"
      ).innerText += `\n🎉 Congrats! You completed the recipe: ${recipeName}`;
    }
  }
}

function rewardsHistory() {
  if (collected.length === 0) {
    document.getElementById("saved").innerText =
      "🚫 You haven't collected any ingredients yet!";
  } else {
    document.getElementById(
      "saved"
    ).innerText = `🧺 Your ingredients: ${collected.join(", ")}`;
  }
}

function resetProgress() {
  localStorage.removeItem("ingredients");
  localStorage.removeItem("lastClaimTime");
  collected = [];
  document.getElementById("saved").innerText = "🔄 Progress has been reset!";
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
