document.addEventListener("DOMContentLoaded", () => {
    const petSprite = document.getElementById("pet-sprite");
    const petImage = petSprite.dataset.petImage || "/assets/pet-default.png";
    petSprite.style.backgroundImage = `url('${petImage}')`;

    // Set correct pet sprite
    // petSprite.style.backgroundImage = `url('${petImages[selectedPet] || petImages["default"]}')`;

    // Movement Logic
    let position = 0;
    let direction = 1; // 1 for right, -1 for left
    const speed = 1.5;
    const maxRight = petSprite.parentElement.clientWidth - petSprite.clientWidth;

    function movePet() {
        position += speed * direction;
        
        const edgeBuffer = .5;

        if (position >= maxRight - edgeBuffer) {
            direction = -1;
            petSprite.style.transform = "scaleX(-1)"; //Flip left
        } else if (position <= edgeBuffer) {
            direction = 1;
            petSprite.style.transform = "scaleX(1)"; // Face right
        }
        
        petSprite.style.left = position + "px";
        requestAnimationFrame(movePet);
    }

    movePet(); // Start animation
});

document.addEventListener("DOMContentLoaded", () => {
    const xpBar = document.getElementById("xp-bar");
    const xpProgress = document.querySelector(".xp-bar-container");
    const userLevelElement = document.getElementById("user-level");

    if (!userLevelElement) {
        console.error("🚨 ERROR: user-level element not found in DOM!");
        return; // Stop execution to prevent further errors
    }

    console.log("🔍 Loaded XP from EJS:", userXP);
    console.log("🔍 Loaded Level from EJS:", userLevel);

    let xp = userXP;
    let level = userLevel;

    function updateXPBar(newXP) {
        let xpPercentage = newXP % 100; 
        xpBar.style.width = `${xpPercentage}%`;
    
        console.log("🔄 XP Updated:", newXP, "| XP Bar:", xpPercentage);
    
        if (newXP >= 100) {  
            console.log("🎉 Level Up Detected! XP:", newXP);
            levelUp();
        }
    }

    function levelUp() {
        level++;
        userLevelElement.textContent = level; 
    
        console.log("🎊 Level Up! New Level:", level);
    
        // Fire confetti 
        confetti();
    
        // Refresh inventory on level up
        refreshInventory();

        // Show level-up modal
        showLevelUpModal(level);
    }

    // Ensure XP bar updates when page loads
    updateXPBar(xp);
});

function showLevelUpModal(level) {
    const modal = document.getElementById("levelUpModal");
    const levelSpan = document.getElementById("modal-level");
    const unlockedContainer = document.getElementById("unlocked-items");

    levelSpan.textContent = level;
    unlockedContainer.innerHTML = "Loading...";

    fetch(`/account/unlocked-items?level=${level}`)
    .then(res => res.json())
    .then(items => {
        unlockedContainer.innerHTML = "";
        if (items.length === 0) {
            unlockedContainer.innerHTML = "<p>No items unlocked at this level.</p>";
            return;
        }

        items.forEach(item => {
            const img = document.createElement("img");
            img.src = item.image;
            img.alt = item.name;
            unlockedContainer.appendChild(img);
        });

        modal.classList.remove("hidden");
    })
    .catch(err => {
        console.error("Error fetching unlocked items:", err);
        unlockedContainer.innerHTML = "<p>Error loading items.</p>";
    });

    // Close modal button
    document.getElementById("closeModalBtn").addEventListener("click", () => {
        modal.classList.add("hidden");
    });
}

// Handling edit button clicks
document.addEventListener("DOMContentLoaded", () => {
    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent accidental form submissions

            const taskItem = button.closest(".task-item"); // Get the closest task item

            // Toggle the "editing" class on the task item
            taskItem.classList.toggle("editing");
        });
    });
});

// INVENTORY LOGIC ****************
document.addEventListener("DOMContentLoaded", () => {
    const inventoryContainer = document.getElementById("inventory-items");
    const tabs = document.querySelectorAll(".inventory-tab");

    function refreshInventory() {
        fetch("/account/inventory")
            .then(response => response.json())
            .then(data => {
                inventoryContainer.innerHTML = ""; // Clear old items

                if (data.length === 0) {
                    inventoryContainer.innerHTML = "<p>Your inventory is empty.</p>";
                    return;
                }

                data.forEach(item => {
                    const itemDiv = document.createElement("div");
                    itemDiv.classList.add("inventory-item");
                    itemDiv.dataset.category = item.type;
                
                    itemDiv.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" />
                        <p>${item.name}</p>
                    `;
                
                    // 🟢 Click Event: update environment
                    itemDiv.addEventListener("click", () => {
                        if (item.type === "Pet") {
                            document.getElementById("pet-sprite").style.backgroundImage = `url('${item.gameImage}')`;
                        } else if (item.type === "Background") {
                            document.getElementById("background-layer").style.backgroundImage = `url('${item.gameImage}')`;
                        } else if (item.type === "Decoration") {
                            document.getElementById("decor-layer").style.backgroundImage = `url('${item.gameImage}')`;
                        }
                    });
                
                    inventoryContainer.appendChild(itemDiv);
                });

                // Ensure only the active tab's items are visible
                const activeTab = document.querySelector(".inventory-tab.active");
                if (activeTab) filterInventory(activeTab.dataset.category);
            })
            .catch(error => console.error("❌ ERROR: Failed to fetch inventory:", error));
    }

    // Function to filter inventory based on active tab
    function filterInventory(category) {
        const items = document.querySelectorAll(".inventory-item");
        items.forEach(item => {
            item.style.display = item.dataset.category === category ? "block" : "none";
        });
    }

    // Tab click event listener
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Filter inventory by selected tab
            filterInventory(tab.dataset.category);
        });
    });

    // Refresh inventory on page load
    refreshInventory();
});