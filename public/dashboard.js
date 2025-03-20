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
        console.log("🚀 Firing Confetti...");
        confetti({
            particleCount: 200,
            spread: 80,
            startVelocity: 30,
            origin: { x: 0.5, y: 0.5 }
        });
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
    const tabs = document.querySelectorAll(".inventory-tab");
    const items = document.querySelectorAll(".inventory-item");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove 'active' class from all tabs
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active"); // Add to clicked tab

            const selectedCategory = tab.dataset.category;
            
            // Hide all items
            items.forEach(item => {
                if (item.dataset.category === selectedCategory) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }
            });
        });
    });

    // Set default active category to "Pets"
    document.querySelector(".inventory-tab.active").click();
});