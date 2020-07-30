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
            square.uncover = () => {
                let square = document.getElementById(row + "_" + col);
                square.classList.remove("square-covered");
                square.classList.remove("square-flagged");
                square.classList.add("square-uncovered");
                if (board.getSquare(row, col) !== 0) {
                    square.textContent = board.getSquare(row, col);
                }
            }
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

                square.uncover();

                // If a 0 square is clicked, uncover all surrounding 0 squares and the non-zero square that directly border them
                if (board.getSquare(row, col) === 0) {
                    let zeros = board.zeroGroup(row, col);

                    for (let zero of zeros) {
                        document.getElementById(zero[0] + "_" + zero[1]).uncover();

                        // uncover non-zero squares that border the zero square
                        if (zero[0] > 0 && zero[1] > 0 && board.getSquare(zero[0]-1, zero[1]-1) !== 0) { // top-left square
                            document.getElementById((zero[0]-1) + "_" + (zero[1]-1)).uncover();
                        }
                        if (zero[1] > 0 && board.getSquare(zero[0], zero[1]-1) !== 0) { // left square
                            document.getElementById(zero[0] + "_" + (zero[1]-1)).uncover();
                        }
                        if (zero[0] < board.getHeight()-1 && zero[1] > 0 && board.getSquare(zero[0]+1, zero[1]-1) !== 0) { // bottom-left square
                            document.getElementById((zero[0]+1) + "_" + (zero[1]-1)).uncover();
                        }
                        if (zero[0] < board.getHeight()-1 && board.getSquare(zero[0]+1, zero[1]) !== 0) { // bottom square
                            document.getElementById((zero[0]+1) + "_" + zero[1]).uncover();
                        }
                        if (zero[0] < board.getHeight()-1 && zero[1] < board.getWidth()-1 && board.getSquare(zero[0]+1, zero[1]+1) !== 0) { // bottom-right square
                            document.getElementById((zero[0]+1) + "_" + (zero[1]+1)).uncover();
                        }
                        if (zero[1] < board.getWidth()-1 && board.getSquare(zero[0], zero[1]+1) !== 0) { // right square
                            document.getElementById(zero[0] + "_" + (zero[1]+1)).uncover();
                        }
                        if (zero[0] > 0 && zero[1] < board.getWidth()-1 && board.getSquare(zero[0]-1, zero[1]+1) !== 0) { // top-right square
                            document.getElementById((zero[0]-1) + "_" + (zero[1]+1)).uncover();
                        }
                        if (zero[0] > 0 && board.getSquare(zero[0]-1, zero[1]) !== 0) { // top square
                            document.getElementById((zero[0]-1) + "_" + zero[1]).uncover();
                        }
                    }
                }
            };
            gameContainer.appendChild(square);
        }
    }
}