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

