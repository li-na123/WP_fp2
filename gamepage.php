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
    <title>Shut the Box - Two-Player Game</title>
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
        <p id="diceResult">Dice result: </p>
        <button id="rollButton">Roll</button>
    </div>
    <div class="message">
        <p id="messageText"></p>
    </div>
</div>


<!--Chat-->
<div class="form-container" id="chat-container">
    <!-- output for chat -->
    <div class="col-md-12" id="message_box">
    </div>

    <!-- input fields for chat -->
    <form class="form-popup" method="post">
        <input type="text" id="name" placeholder="Type name.." name="name" required>
        <div class="invalid-feedback">Please enter your name</div>
        <textarea id="message" placeholder="Type message.." name="message"></textarea>
        <div class="invalid-feedback">Please enter a message</div>
        <button type="button" class="btn-primary" name="submit" id="submit-button">Submit</button>
        <!-- button to close chat -->
        <button type="button" class="btn cancel" id="close-button">Close</button>
    </form>
</div>

<!-- button to open chat -->
<button type="button" id="open-button">Open chat</button>


</body>
<?php
include __DIR__ . '/scripts/ajax_handler.php';
include __DIR__ . '/tpl/footer.php';
?>
