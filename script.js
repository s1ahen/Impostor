const words = {
    animals: ["lion", "tiger", "bear", "elephant", "giraffe"],
    fruits: ["apple", "banana", "cherry", "date", "elderberry"],
    colors: ["red", "blue", "green", "yellow", "purple"],
    countries: ["usa", "canada", "mexico", "brazil", "argentina"],
    vehicles: ["car", "truck", "bicycle", "motorcycle", "airplane"]
};
const imposterWord = "kiwi";
let numPlayers;
let playerWords = [];
let currentPlayer = 0;
let imposterIndex;
let discussionTime;
let votes = [];
let voteCount = {};

function startGame() {
    const category = document.getElementById("category").value.toLowerCase();
    numPlayers = document.getElementById("num-players").value;
    discussionTime = document.getElementById("discussion-time").value;
    
    if (numPlayers < 3 || numPlayers > 10) {
        alert("Please enter a number between 3 and 10");
        return;
    }

    playerWords = [];
    const commonWord = words[category][Math.floor(Math.random() * words[category].length)];
    
    for (let i = 0; i < numPlayers; i++) {
        playerWords.push(commonWord);
    }

    imposterIndex = Math.floor(Math.random() * numPlayers);
    playerWords[imposterIndex] = imposterWord;

    document.getElementById("game-setup").style.display = "none";
    document.getElementById("game-play").style.display = "block";
    document.getElementById("player-words").innerHTML = `Player 1's turn`;
}

function revealWord() {
    if (currentPlayer < numPlayers) {
        const wordElement = document.getElementById("player-words");
        const timerElement = document.getElementById("timer");
        wordElement.innerHTML = `Player ${currentPlayer + 1}: ${playerWords[currentPlayer]}`;
        timerElement.style.display = "block";

        let timeLeft = 5;
        timerElement.innerHTML = timeLeft;
        const countdown = setInterval(() => {
            timeLeft--;
            timerElement.innerHTML = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                timerElement.style.display = "none";
                wordElement.innerHTML = `Pass the phone to the next player`;
                currentPlayer++;
                if (currentPlayer < numPlayers) {
                    wordElement.innerHTML = `Player ${currentPlayer + 1}'s turn`;
                } else {
                    document.getElementById("reveal-button").style.display = "none";
                    startDiscussionTimer();
                }
            }
        }, 1000);
    }
}

function startDiscussionTimer() {
    document.getElementById("game-play").style.display = "none";
    document.getElementById("discussion-timer").style.display = "block";
    let timeLeft = discussionTime;
    const timerElement = document.getElementById("discussion-time-left");
    timerElement.innerHTML = `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;

    const countdown = setInterval(() => {
        timeLeft--;
        timerElement.innerHTML = `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            document.getElementById("discussion-timer").style.display = "none";
            startVoting();
        }
    }, 1000);
}

function startVoting() {
    document.getElementById("voting").style.display = "block";
    currentPlayer = 0;
    showVotingScreen();
}

function showVotingScreen() {
    document.getElementById("vote-input").value = "";
    document.getElementById("voter-number").innerHTML = currentPlayer + 1;
}

function submitVote() {
    const vote = document.getElementById("vote-input").value.trim();
    if (!vote) {
        alert("Please enter a name.");
        return;
    }
    votes[currentPlayer] = vote;
    if (voteCount[vote]) {
        voteCount[vote]++;
    } else {
        voteCount[vote] = 1;
    }

    currentPlayer++;
    if (currentPlayer < numPlayers) {
        showVotingScreen();
    } else {
        document.getElementById("voting").style.display = "none";
        showResults();
    }
}

function showResults() {
    document.getElementById("results").style.display = "block";
    const resultsGraph = document.getElementById("results-graph");
    resultsGraph.innerHTML = "";
    for (const [suspect, count] of Object.entries(voteCount)) {
        const resultItem = document.createElement("div");
        resultItem.innerHTML = `${suspect}: ${count} vote(s)`;
        resultsGraph.appendChild(resultItem);
    }
    document.getElementById("imposter-word").innerHTML = imposterWord;
}

function restartGame() {
    document.getElementById("game-setup").style.display = "block";
    document.getElementById("game-play").style.display = "none";
    document.getElementById("discussion-timer").style.display = "none";
    document.getElementById("voting").style.display = "none";
    document.getElementById("results").style.display = "none";

    currentPlayer = 0;
    votes = [];
    voteCount = {};
    playerWords = [];
    document.getElementById("category").value = "animals";
    document.getElementById("num-players").value = "";
    document.getElementById("discussion-time").value = "180";
}
