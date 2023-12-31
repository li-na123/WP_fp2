<?php
/* Header */
$active = 'Game';
$navigation = array(
    'active' => $active,
    'items' => array(
        'Home' => 'index.php',
        'Game' => 'gamepage.php'
    )
);
$page_title = 'Shut the box';
include 'tpl/head.php';?>

<head>
    <title>Two-Player Game</title>
    <link rel="stylesheet" type="text/css" href="css/game.css">
    <script src="scripts/game.js"></script>
</head>
<body>

<!--Game-->
<div class="container">
    <h1>Shut the Box - Two-Player Game</h1>
    <div id="player1" class="player-board">
        <h2>Player 1</h2>
        <!-- Player 1's tiles/buttons -->
    </div>
    <div id="player2" class="player-board">
        <h2>Player 2</h2>
        <!-- Player 2's tiles/buttons -->
    </div>
    <div class="submit">
        <button id="submit-choice">Submit</button>
    </div>
    <div class="dice">
        <p id="diceValue">Dice result: </p>
        <button id="rollButton">Roll</button>
    </div>
    <input id="player" type="hidden" value="<?php if(isset($_GET['player'])){echo '$_GET[\'player\']';}?>">
    <div class="message">
        <p id="messageText"></p>
        <p id="diceValue"></p>
        <p id="currentPlayer"></p>
        <p id="board"></p>
        <p id="playerName"></p>
    </div>
</div>


</body>
<?php
include __DIR__ . '/scripts/add_dicevalue_currentplayer.php';
include __DIR__ . '/scripts/get_player_tiles.php';
include __DIR__ . '/tpl/footer.php';
?>
