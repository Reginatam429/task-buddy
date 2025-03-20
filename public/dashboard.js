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
    const userLevel = document.getElementById("user-level");

    let xp = userXP;
    let level = userLevel; 

    console.log("🔍 Initial XP:", xp);
    console.log("🔍 Initial Level:", level);

    function updateXPBar(newXP) {
        let xpPercentage = newXP % 100; 
        xpBar.style.width = `${xpPercentage}%`;

        console.log("🔄 XP Updated:", newXP, "| XP Bar:", xpPercentage);

        if (newXP >= 100 && xpPercentage === 0) { 
            console.log("🎉 Level Up Detected!");
            levelUp();
        }
    }

    function levelUp() {
        level++; // Increase level
        userLevel.textContent = level; // Update level UI

        console.log("🎊 Level Up! New Level:", level);

        // 🎉 Trigger Confetti Effect
        confetti({
            particleCount: 200,
            spread: 80,
            startVelocity: 30,
            origin: { x: 0.5, y: 0.5 } // Centered effect
        });

        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 60,
                startVelocity: 20,
                origin: { x: 0.5, y: 0.5 }
            });
        }, 500);
    }

    // Ensure XP bar updates when page loads
    updateXPBar(xp);
});