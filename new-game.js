function createNewGame() {
    let height = config.defaultDimensions[0];
    let width = config.defaultDimensions[1];
    let board = new Board(QuarterRandomizer, height, width);
    let gameContainer = document.getElementById("game-container");
    let square;

    // erase previous game
    gameContainer.innerHTML = "";

    window.board = new Board(QuarterRandomizer, height, width);

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            square = document.createElement("div");
            square.classList.add("square-covered");
            square.id = row + "_" + col;

            // disable right-click menu
            square.oncontextmenu = (e) => {
                e.preventDefault();
                return false;
            };
            square.onmousedown = (e) => {
                let square = document.getElementById(row + "_" + col);

                // flag an uncovered square on right-click
                if (e.which === 3 && !square.classList.contains("square-uncovered")) {
                    if (!square.classList.contains("square-flagged")) {
                        square.classList.add("square-flagged");
                    } else {
                        square.classList.remove("square-flagged");
                    }
                    return;
                }

                square.classList.remove("square-covered");
                square.classList.remove("square-flagged");
                square.classList.add("square-uncovered");
                square.textContent = board.getSquare(row, col);
            };
            gameContainer.appendChild(square);
        }
    }
}