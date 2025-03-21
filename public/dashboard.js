document.addEventListener("DOMContentLoaded", () => {
    const petSprite = document.getElementById("pet-sprite");
    const selectedPet = petSprite.dataset.pet; // Get the pet from data attribute
    const petImages = {
        "default": "/assets/pet-mushroom-walk.png",
        "cat": "/assets/pet-cat.png",
        "dog": "/assets/pet-dog.png"
    };

    // Set correct pet sprite
    petSprite.style.backgroundImage = `url('${petImages[selectedPet] || petImages["default"]}')`;

    // Movement Logic
    let position = 0;
    let direction = 1; // 1 for right, -1 for left
    const speed = 1.5;
    const maxRight = document.querySelector(".pet-area").offsetWidth - petSprite.offsetWidth;

    function movePet() {
        position += speed * direction;
        
        // if (position >= maxRight || position <= 0) {
        //     direction *= -1;
        //     petSprite.style.transform = `scaleX(${direction})`; // Flip sprite
        // }

        // Flip direction **only when fully reaching the edge**
        if (position >= maxRight) {
            direction = -1;
            petSprite.style.transform = "scaleX(-1)"; // Flip left
        } 
        else if (position <= 10) { // Small buffer for smooth flipping
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
    
        // 🎉 Fire confetti 
        confetti({
            particleCount: 200,
            spread: 80,
            startVelocity: 30,
            origin: { x: 0.5, y: 0.5 }
        });
    
        // 🚀 Refresh inventory on level up
        refreshInventory();
    }

    // Ensure XP bar updates when page loads
    updateXPBar(xp);
});

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