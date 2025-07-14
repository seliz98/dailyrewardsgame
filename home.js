const allIngredients = ["flour", "sugar", "milk", "eggs", "strawberries"];
let collected = JSON.parse(localStorage.getItem("ingredients")) || [];

function myFunction() {
  const today = new Date().toDateString();
  const lastClaim = localStorage.getItem("lastClaim");

  if (lastClaim === today) {
    document.getElementById("saved").innerText =
      "✅ Already claimed your ingredient today!";
    return;
  }

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

  localStorage.setItem("lastClaim", today);
}

function myFunction2() {
  if (collected.length === 0) {
    document.getElementById("saved").innerText =
      "🚫 You haven't collected any ingredients yet!";
  } else {
    document.getElementById(
      "saved"
    ).innerText = `🧺 Your ingredients: ${collected.join(", ")}`;
  }
}
