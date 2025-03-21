function toggleDropdown() {
    document.getElementById("dropdownMenu").classList.toggle("show");
}

// Close dropdown if clicked outside
window.onclick = function(event) {
    if (!event.target.matches('.hamburger')) {
        let dropdown = document.getElementById("dropdownMenu");
        if (dropdown.classList.contains("show")) {
            dropdown.classList.remove("show");
        }
    }
};

// Inline task editing
document.addEventListener("DOMContentLoaded", () => {
    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const taskItem = event.target.closest(".task-item");
            taskItem.querySelector("span").style.display = "none"; // Hide text
            taskItem.querySelector(".edit-form").style.display = "inline"; // Show input
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const howToBtn = document.getElementById("howToPlayBtn");
    const instructions = document.getElementById("howToPlayInstructions");

    if (howToBtn && instructions) {
        howToBtn.addEventListener("click", () => {
            instructions.classList.toggle("hidden");
            howToBtn.textContent = instructions.classList.contains("hidden")
            ? "How to Play"
            : "Close Instructions";
        });
    }
});