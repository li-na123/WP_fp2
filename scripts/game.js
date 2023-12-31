/**
 * update game state without reloading the whole page using AJAX
 */
function updateGameState() {
    $.getJSON("data/gameState.json", function(gameState) {
        // Extract diceValue and currentPlayer from gameState
        let diceValue = gameState.diceValue;
        let currentPlayer = gameState.currentPlayer;

        // Display the data on the page
        $("#diceValue").text("Dice result: " + diceValue);

    })
}

/**
 * get information over what board updated and process it
 */
function updateBoardState() {
    $.getJSON("data/boardState.json", function(boardState) {
        // Extract diceValue and currentPlayer from gameState
        let board = boardState.board;
        let playerName = boardState.playerName;
        // add a function to keep track of which tile is closed
        let tileNumber = 1
        // check each tile in the board array
        board.forEach(function (tile) {
            if (tile === '-1') {
                $(".player-board button").each(function () {
                    let player = $(this).attr("data-player");
                    let buttonTile = parseInt($(this).attr("data-tile"));
                    if (player === playerName && buttonTile === tileNumber) {
                        $(this).prop("disabled", true); // Disable the button to indicate it is closed
                        $(this).addClass("closed"); // Add a CSS class to visually indicate a closed tile
                    }
                });
            }
            // make sure the next tile's index is one higher
            tileNumber += 1
            // make sure to start counting again if count is over 9
            if (tileNumber === 10){
                i = 0
            }
        });
    })
}
/**
 * Function that generates a playerboard with numbered tiles that are buttons
 * @param board, HTML tag where the board should be placed in the HTML file
 * @param playerName, a string with the name of the player
 * @param playerTiles, an empty array where the buttons can be added
 */
function generatePlayerBoard(board, playerName, playerTiles) {
    for (let i = 1; i <= 9; i++) {
        let button = $("<button></button>");
        button.text(i);
        button.attr("data-player", playerName);
        button.attr("data-tile", i);
        board.append(button);
        playerTiles.push(i); // Assign the tile to the respective player's array
    }
}

/**
 * post updated information of the game to the JSON file
 * @param board, array of the board with -1 in the place of tiles that are closed
 * @param playerName, string of the player who the board belongs to
 */
function postGameboard(board, playerName) {
    $.ajax({
        url: "scripts/get_player_tiles.php",
        method: "POST",
        data: {
            board: board,
            playerName: playerName,
        },
        dataType: "text",
        success: function () {
            // Get the current gameState
            updateGameState();
        },
    })
}

/**
 * Rolls the dice and starts all functions that should only happen once the dice
 * are rolled
 * @param rollButton, the button that is clicked when the player wants to roll the dice
 * @param player1Tiles, array of the tiles belonging to player 1
 * @param player2Tiles, array of the tiles belonging to player 2
 */
function rollDice(rollButton, player1Tiles, player2Tiles) {
    // define important variables
    let tileButtons = $(".player-board button");
    let submitButton = $("#submit-choice");
    let currentPlayer = window.currentPlayer
    var diceResult = $("#diceResult");
    // roll dice
    let diceValue = Math.floor(Math.random() * 11) + 2;
    // show result
    diceResult.text("Dice result: " + diceValue);

    postGameState(diceValue, currentPlayer) // Posts diceValue and currentPlayer to gameState.json to retrieve later

    checkEndGame(tileButtons, diceValue, currentPlayer)
    toggleButtons(rollButton, submitButton);
    allowSelection(currentPlayer, tileButtons);
    submitButton.off().on("click", function () {
        submit(player1Tiles, player2Tiles, tileButtons, currentPlayer, diceValue, rollButton, submitButton)
    });
}

/**
 * add latest diceValue and currentPlayer to json file
 * @param diceValue, value of the dice when it was last rolled
 * @param currentPlayer, current player (string)
 */
function postGameState(diceValue, currentPlayer){
    $.ajax({
        url: "scripts/add_dicevalue_currentplayer.php",
        method: "POST",
        data: {
            diceValue: diceValue,
            currentPlayer: currentPlayer},
        dataType: "text",
        success: function () {
            // Get the current diceValue and player
            updateGameState();
        },

    });
}

/**
 * toggle which button is visible
 * @param rollButton, the button someone presses when they want to roll the dice
 * @param submitButton, button for submitting the selected tiles
 */
function toggleButtons(rollButton, submitButton) {
    rollButton.toggle();
    submitButton.toggle();
}

/**
 * checks if the game should be ended by seeing if the sum of open tiles is less than the dice value
 * @param tileButtons, all the buttons that are used as tiles
 * @param diceValue, the value of the latest dice roll
 * @param currentPlayer, the name of the current player
 */
function checkEndGame(tileButtons, diceValue, currentPlayer) {
    // Check if sum of open tiles is less than dice value
    openTiles = [];
    tileButtons.each(function () {
        let player = $(this).attr("data-player");
        let tile = parseInt($(this).attr("data-tile"));
        if (player === currentPlayer && !($(this).hasClass("closed"))) {
            openTiles.push(tile);
        }})
    // Check if open tiles sum up to less than dice value and end game if so
    let sumOpen = calculateSum(openTiles)
    if(sumOpen < diceValue) {
        // Redirect to endpage
        window.location.href = "http://localhost:8888/WP23/WP_fp2/endpage.php";
    }
}

/**
 * submits the selected tiles if they are correct and starts all necessary functions
 * , shows an error message if not
 * @param player1Tiles, array of the tiles of player number one
 * @param player2Tiles, array of the tiles of player number two
 * @param tileButtons, all buttons that are used as tiles
 * @param currentPlayer1, name of the current player (not necessarily player 1)
 * @param diceValue, value of the latest dice throw
 * @param rollButton, button to press to roll the dice
 * @param submitButton, button to press to submit selected values
 */
function submit(player1Tiles, player2Tiles, tileButtons, currentPlayer1, diceValue, rollButton, submitButton) {
    // find tiles attached to current player
    let currentPlayerTiles = currentPlayer1 === "Player 1" ? player1Tiles : player2Tiles;

    // Find selected tiles
    let selectedTiles = [];
    tileButtons.each(function () {
        let player = $(this).attr("data-player");
        let tile = parseInt($(this).attr("data-tile"));
        // add tiles selected by current player that were not closed to array
        if (player === currentPlayer1 && tile !== -1 && $(this).hasClass("selected")) {
            selectedTiles.push(tile);
            $(this).removeClass("selected");
        }
    });

    // Check if selected tiles sum up to dice value
    sumSelect = calculateSum(selectedTiles)
    if (sumSelect === diceValue) {
        // close selected tiles
        closeTiles(selectedTiles, currentPlayerTiles, tileButtons, currentPlayer1)
        // update who the current player
        updatePlayer(currentPlayer1)
        // post game-board to gameState.json
        postGameboard(currentPlayerTiles, currentPlayer1)
        // Post diceValue and currentPlayer to gameState.json to retrieve later
        postGameState(diceValue, currentPlayer1)
        // toggle buttons
        toggleButtons(rollButton, submitButton);
        // show whose turn it is
        showTurnMessage(currentPlayer1)
    }
    else {
        // Show error message
        window.alert("Selected tiles do not match dice value. Please try again.")
    }

}

/**
 * A function that adds all values of an array consisting of numbers to each other
 * @param Array, which consists solely of integers
 * @returns sum, an integer, the values in the array added up
 */
function calculateSum(Array) {
    let sum = Array.reduce(function (acc, curr) {
        return acc + curr;
    }, 0);
    return sum;
}

/**
 * Closes the selected tiles
 * @param selectedTiles, the selected tiles
 * @param currentPlayerTiles, the tiles that belong to the current player
 * @param tileButtons, the buttons belonging to all the tiles
 * @param currentPlayer1, the current player's name (not necessarily player 1)
 */
function closeTiles(selectedTiles, currentPlayerTiles, tileButtons, currentPlayer1) {
    // Close selected tiles
    selectedTiles.forEach(function (tile) {
        let index = currentPlayerTiles.indexOf(tile);
        currentPlayerTiles[index] = -1; // Mark the tile as closed
        tileButtons.each(function () {
            let player = $(this).attr("data-player");
            let buttonTile = parseInt($(this).attr("data-tile"));
            if (player === currentPlayer1 && buttonTile === tile) {
                $(this).prop("disabled", true); // Disable the button to indicate it is closed
                $(this).addClass("closed"); // Add a CSS class to visually indicate a closed tile
            }
        });
    });
}

/**
 * Updates the name of the current player
 * @param currentPlayer1, the name of the current player
 */
function updatePlayer(currentPlayer1) {
    // update who the current player is
    currentPlayer1 = currentPlayer1 === "Player 1" ? "Player 2" : "Player 1";
    window.currentPlayer = currentPlayer1
}

/**
 * Sends the users a message about whose turn it is
 * @param currentPlayer, name of the (new) current player
 */
function showTurnMessage(currentPlayer) {
    // show message about whose turn it is
    let messageText = $("#messageText");
    messageText.text(currentPlayer + "'s turn. Select tiles and roll again.");
}

/**
 * enables the selecting of buttons of the tiles that belong to the current player
 * and are not closed yet
 * @param currentPlayer, name of the current player
 * @param tileButtons, all the buttons that are used as tiles
 */
function allowSelection (currentPlayer, tileButtons) {
    // Add event listeners to tile buttons
    tileButtons.off('click').on("click", function () {
        // Add event listeners to tile buttons
        let player = $(this).attr("data-player");
        let tile = parseInt($(this).attr("data-tile"));
        // check if current player clicked an unclosed tile
        if (player === currentPlayer && tile !== -1) {
            // Toggle the selection of the tile
            $(this).toggleClass("selected");
        }
    });
}


$(document).ready(function() {
    // define important variables
    window.currentPlayer = "Player 1";
    let player1Board = $("#player1");
    let player2Board = $("#player2");
    // Arrays to hold the player tiles
    let player1Tiles = [];
    let player2Tiles = [];

    // Generates boards with tiles/buttons
    generatePlayerBoard(player1Board, "Player 1", player1Tiles);
    generatePlayerBoard(player2Board, "Player 2", player2Tiles);

    // when the button to roll is clicked, roll the dice
    let rollButton = $("#rollButton");
    rollButton.on("click", function () {
        rollDice(rollButton, player1Tiles, player2Tiles)
    });

    // update game state in the background
    setInterval(updateGameState, 500);
    setInterval(updateBoardState, 500);
});
