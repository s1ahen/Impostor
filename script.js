const words = {
    en: {
        animals: ["Lion", "Tiger", "Bear", "Elephant", "Giraffe", "Dog", "Cat", "Fish", "Bunny", "Snail"],
        fruits: ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Raspberry"],
        colors: ["Red", "Blue", "Green", "Yellow", "Purple"],
        countries: ["USA", "Canada", "Mexico", "Brazil", "Argentina"],
        vehicles: ["Car", "Truck", "Bicycle", "Motorcycle", "Airplane"]
    },
    es: {
        animals: ["León", "Tigre", "Oso", "Elefante", "Jirafa", "Perro", "Gato", "Pez", "Conejo", "Caracol"],
        fruits: ["Manzana", "Banana", "Cereza", "Dátil", "Elderberry", "Frambuesa"],
        colors: ["Rojo", "Azul", "Verde", "Amarillo", "Púrpura"],
        countries: ["EE.UU.", "Canadá", "México", "Brasil", "Argentina"],
        vehicles: ["Coche", "Camión", "Bicicleta", "Motocicleta", "Avión"]
    },
    fr: {
        animals: ["Lion", "Tigre", "Ours", "Éléphant", "Girafe", "Chien", "Chat", "Poisson", "Lapin", "Escargot"],
        fruits: ["Pomme", "Banane", "Cerise", "Datte", "Baie de sureau", "Framboise"],
        colors: ["Rouge", "Bleu", "Vert", "Jaune", "Violet"],
        countries: ["États-Unis", "Canada", "Mexique", "Brésil", "Argentine"],
        vehicles: ["Voiture", "Camion", "Vélo", "Moto", "Avion"]
    },
    de: {
        animals: ["Löwe", "Tiger", "Bär", "Elefant", "Giraffe", "Hund", "Katze", "Fisch", "Hase", "Schnecke"],
        fruits: ["Apfel", "Banane", "Kirsche", "Dattel", "Holunderbeere", "Himbeere"],
        colors: ["Rot", "Blau", "Grün", "Gelb", "Lila"],
        countries: ["USA", "Kanada", "Mexiko", "Brasilien", "Argentinien"],
        vehicles: ["Auto", "LKW", "Fahrrad", "Motorrad", "Flugzeug"]
    },
    sv: {
        animals: ["Lejon", "Tiger", "Björn", "Elefant", "Giraff", "Hund", "Katt", "Fisk", "Kanin", "Snigel"],
        fruits: ["Äpple", "Banan", "Körsbär", "Dadel", "Fläderbär", "Hallon"],
        colors: ["Röd", "Blå", "Grön", "Gul", "Lila"],
        countries: ["USA", "Kanada", "Mexiko", "Brasilien", "Argentina"],
        vehicles: ["Bil", "Lastbil", "Cykel", "Motorcykel", "Flygplan"]
    }
};

let numPlayers;
let playerWords = [];
let currentPlayer = 0;
let imposterIndex;
let discussionTime;
let votes = [];
let voteCount = {};
let selectedLanguage = 'en';

function changeLanguage() {
    selectedLanguage = document.getElementById("language").value;
}

function startGame() {
    const category = document.getElementById("category").value.toLowerCase();
    numPlayers = document.getElementById("num-players").value;
    discussionTime = document.getElementById("discussion-time").value;
    
    if (numPlayers < 3 || numPlayers > 10) {
        alert("Please enter a number between 3 and 10");
        return;
    }

    playerWords = [];
    const commonWordIndex = Math.floor(Math.random() * words[selectedLanguage][category].length);
    const commonWord = words[selectedLanguage][category][commonWordIndex];
    
    for (let i = 0; i < numPlayers; i++) {
        playerWords.push(commonWord);
    }

    const imposterWordList = words[selectedLanguage][category].filter(word => word !== commonWord);
    const imposterWord = imposterWordList[Math.floor(Math.random() * imposterWordList.length)];
    
    imposterIndex = Math.floor(Math.random() * numPlayers);
    playerWords[imposterIndex] = imposterWord;

    document.getElementById("game-setup").style.display = "none";
    document.getElementById("game-play").style.display = "block";
    document.getElementById("player-words").innerHTML = `Player 1's turn`;
    document.getElementById("reveal-button").disabled = false;
}

function revealWord() {
    if (currentPlayer < numPlayers) {
        const wordElement = document.getElementById("player-words");
        const timerElement = document.getElementById("timer");
        wordElement.innerHTML = `Player ${currentPlayer + 1}: ${playerWords[currentPlayer]}`;
        timerElement.style.display = "block";

        let timeLeft = 5;
        timerElement.innerHTML = timeLeft;
        document.getElementById("reveal-button").disabled = true;
        const countdown = setInterval(() => {
            timeLeft--;
            timerElement.innerHTML = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                timerElement.style.display = "none";
                wordElement.innerHTML = `Pass the phone to the next player`;
                document.getElementById("reveal-button").disabled = false;
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
    document.getElementById("imposter-word").innerHTML = playerWords[imposterIndex];
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
    document.getElementById("language").value = "en";
    document.getElementById("category").value = "animals";
    document.getElementById("num-players").value = "";
    document.getElementById("discussion-time").value = "180";
}
