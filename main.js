(() => {
    let gameContainer = document.getElementById("game-container");
    gameContainer.style.width = 40 * config.defaultDimensions[1] + "px";
    createNewGame();

    let newGameButton = document.getElementById("new-game-button");
    newGameButton.onclick = (e) => {
        createNewGame();
    };
})();