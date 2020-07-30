class QuarterRandomizer {
    /**
     * Generates a random number within the given range inclusively.
     * @param {number} min Mimimum possible value (inclusive).
     * @param {number} max Maximum possible value (inclusive).
     */
    static randRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static generateMines(board) {
        let mines = [];
        let height = board.getHeight();
        let width = board.getWidth();
        let duplicateMineFlag = false;
        let randRow;
        let randCol;

        for (let i = 0; i < height * width / 4; i++) {
            randRow = this.randRange(0, height-1);
            randCol = this.randRange(0, width-1);

            // check whether a mine has already been generated at the same coordinates
            for (let mine of mines) {
                if (mine[0] === randRow && mine[1] === randCol) {
                    duplicateMineFlag = true;
                    break;
                }
            }

            if (duplicateMineFlag) {
                duplicateMineFlag = false;
                continue;
            } else {
                mines.push([randRow, randCol]);
            }
        }

        return mines;
    }
}

class Board {
    height;
    width;
    board = [];
    mines = [];

    constructor(randomizer, height, width) {
        this.height = height | config.defaultDimensions[0];
        this.width = width | config.defaultDimensions[1];

        // generate empty 2d array
        for (let row = 0; row < this.height; row++) {
            this.board.push([]);

            for (let col = 0; col < this.height; col++) {
                this.board[row].push(0);
            }
        }

        // place the mines
        for (let mine of randomizer.generateMines(this)) {
            this.mines.push(mine);
            this.board[mine[0]][mine[1]] = -1;
            
            // increment the numbers in the surrounding squares
            if (mine[0] > 0) { // top square
                this.incrementSquare(mine[0]-1, mine[1]);
            }
            if (mine[1] > 0) { // left square
                this.incrementSquare(mine[0], mine[1]-1);
            }
            if (mine[0] < height-1) { // bottom square
                this.incrementSquare(mine[0]+1, mine[1]);
            }
            if (mine[1] < width-1) { // right square
                this.incrementSquare(mine[0], mine[1]+1);
            }
            if (mine[0] > 0 && mine[1] > 0) { // top-left square
                this.incrementSquare(mine[0]-1, mine[1]-1);
            }
            if (mine[0] > 0 && mine[1] < width-1) { // top-right square
                this.incrementSquare(mine[0]-1, mine[1]+1);
            }
            if (mine[0] < height-1 && mine[1] > 0) { // bottom-left square
                this.incrementSquare(mine[0]+1, mine[1]-1);
            }
            if (mine[0] < height-1 && mine[1] < width-1) { // bottom-right square
                this.incrementSquare(mine[0]+1, mine[1]+1);
            }
        }
    }

    /**
     * Increment the given square if it is not a mine.
     */
    incrementSquare(row, col) {
        if (this.board[row][col] >= 0) {
            this.board[row][col]++;
        }
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    getSquare(row, col) {
        return this.board[row][col];
    }

    /**
     * Given a square, recursively finds all squares containing a 0 that are connected to it.
     * If the given square is not a 0, returns an empty array. If the given square is a 0, returns
     * an array containing all of the squares that are connected to it and are also 0.
     * @param {number} row The square's row. Index starts at 0.
     * @param {number} col The square's column. Index starts at 0.
     * @param {number[][]} zeros An array of the coordinates of the zeros.
     */
    zeroGroup(row, col, zeros) {
        zeros = zeros === undefined || zeros.length === 0 ? [] : zeros;

        // check if current square is already in the found zeros
        for (let zero of zeros) {
            if (zero[0] === row && zero[1] === col) {
                return zeros;
            }
        }

        if (this.board[row][col] !== 0) {
            return zeros;
        }

        zeros.push([row, col]);

        if (row > 0 && col > 0) { // top-left square
            zeros = this.zeroGroup(row-1, col-1, zeros);
        }
        if (col > 0) { // left square
            zeros = this.zeroGroup(row, col-1, zeros);
        }
        if (row < this.height-1 && col > 0) { // bottom-left square
            zeros = this.zeroGroup(row+1, col-1, zeros);
        }
        if (row < this.height-1) { // bottom square
            zeros = this.zeroGroup(row+1, col, zeros);
        }
        if (row < this.height-1 && col < this.width-1) { // bottom-right square
            zeros = this.zeroGroup(row+1, col+1, zeros);
        }
        if (col < this.width-1) { // right square
            zeros = this.zeroGroup(row, col+1, zeros);
        }
        if (row > 0 && col < this.width-1) { // top-right square
            zeros = this.zeroGroup(row-1, col+1, zeros);
        }
        if (row > 0) { // top square
            zeros = this.zeroGroup(row-1, col, zeros);
        }

        return zeros;
    }

    print() {
        console.log(this.board);
    }
}