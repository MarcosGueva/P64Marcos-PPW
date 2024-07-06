document.addEventListener("DOMContentLoaded", () => {
    const recipeForm = document.getElementById("recipe-form");
    const recipeNameInput = document.getElementById("recipe-name");
    const recipesList = document.getElementById("recipes");

    recipeForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const recipeName = recipeNameInput.value.trim();
        if (recipeName !== "") {
            const li = document.createElement("li");
            li.textContent = recipeName;
            recipesList.appendChild(li);
            recipeNameInput.value = "";
        }
    });
});