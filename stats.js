let health = 3;
let invincibility = false;
let lost = false;

function decrementHP() {
    if (!invincibility) {
        health--;
		if (health == 0) {
            lost = true;
            document.getElementById("health").innerHTML = "";
            document.getElementById("gameOver").innerHTML = "<h1>Game Over</h1> <h2>Refresh to Restart</h2>";

		}
		if (health == 2) {
			document.getElementById("health").innerHTML =
				'<img src="heart.jpg" id="heart" alt="heart" width="50" height="50"><img src="heart.jpg" id="heart" alt="heart" width="50" height="50">';
		}
		if (health == 1) {
			document.getElementById("health").innerHTML =
				'<img src="heart.jpg" id="heart" alt="heart" width="50" height="50">';
		}
    }
}


let score = 0;
function increaseScore() {
    if (lost == false) {
        score++;

        document.getElementById("score").innerHTML = "<h1>" + score + "</h1>";
    }
}

setInterval(increaseScore, 1000);