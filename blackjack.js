const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const SUITS = ['♠', '♥', '♣', '♦']

const CARD_MODEL = document.createElement('div');
CARD_MODEL.classList.add('card');

var DEALER = document.getElementById("dealer");
var PLAYER = document.getElementById("player");
var HIT_BUTTON = document.getElementById("hit-button");
var PASS_BUTTON = document.getElementById("pass-button");
//var RESET_BUTTON = document.getElementById("reset-button");

let allDecks = [];
let dealerHand = [];
let playerHand = [];

//PART 1
//must be constant
const createDeck = () => {
    const deck = [];
    SUITS.forEach((suit) => {
        VALUES.forEach((value) => {
            const card = value + suit;
            deck.push(card)
        })
    })
    return deck;
}

//must be constant
const shuffleDecks = (num) => {
    for (let i = 0; i < num; i++) {
        const newDeck = createDeck();
        allDecks = [...allDecks, ...newDeck];
    }
}

//must be a constant
const selectRandomCard = () => {
    const randomIndex = Math.floor(Math.random() * allDecks.length);
    const card = allDecks[randomIndex];
    allDecks.splice(randomIndex, 1);//take out the card just used
    return card;
}

// PART 2


const dealHands = () => {
    dealerHand = [selectRandomCard(), selectRandomCard()];
    dealerHand.forEach((card, index) => {
        const newCard = CARD_MODEL.cloneNode(true);
        index === 0 ? newCard.classList.add('back') : newCard.innerHTML = card;
      //colors
        (card[card.length - 1] === '♦' || card[card.length - 1] === '♥') && newCard.setAttribute('data-red', true);
        DEALER.append(newCard);
    })
    playerHand = [selectRandomCard(), selectRandomCard()];
    playerHand.forEach((card) => {
        const newCard = CARD_MODEL.cloneNode(true);
        newCard.innerHTML = card;
        (card[card.length - 1] === '♦' || card[card.length - 1] === '♥') && newCard.setAttribute('data-red', true);
        PLAYER.append(newCard);
    })
}

// PART 3

const calcValue = (hand) => {
    let value = 0;
    let hasAce = 0;
    hand.forEach((card) => {
        if (card.length === 2) {
            if (card[0] === 'A') {
                hasAce += 1
            } else {
                (card[0] === 'K' || card[0] === 'Q' || card[0] === 'J') ? value += 10 : value += Number(card[0])
            }
        } else {
            value += 10
        }
    })
    if (hasAce > 0) {
        value + 11 > 21 ? value += 1 : value += 11;
        value += (hasAce-1)*1;
    }
    return value;
}

const hitPlayer = () => {
    const newCard = selectRandomCard();
    playerHand.push(newCard);
    const newCardNode = CARD_MODEL.cloneNode(true);
    newCardNode.innerHTML = newCard;
    PLAYER.append(newCardNode);
    const handValue = calcValue(playerHand);
    //document.getElementById('score').innerHTML = "Player Hand: " + handValue;
    
    
    if (handValue > 21) {
        console.log("bust")
        alert("bust");
    }
}

const decideWinner = async () => {
    let dealerValue = await calcValue(dealerHand);
    let playerValue = await calcValue(playerHand);

    alert(`Dealer has ${dealerValue}, you have ${playerValue}`)
    dealerValue > playerValue ? alert("dealer wins!") : alert("player wins!");
}

const hitDealer = async () => {
    //alert("TEST!pls show alert");
    //flip green card
    const hiddenCard = DEALER.children[0];
    hiddenCard.classList.remove("back");
    hiddenCard.innerHTML = dealerHand[0];
    //clac hand value
    let handValue = await calcValue(dealerHand);
    if (handValue < 16) {
        let newCard = selectRandomCard();
        dealerHand.push(newCard);
        const newCardNode = CARD_MODEL.cloneNode(true);
        newCardNode.innerHTML = newCard;
        DEALER.append(newCardNode)
        handValue = await calcValue(dealerHand);
    }

    if (handValue < 16) {
        hitDealer();
    }
    else if (handValue === 21) {
        alert("dealer wins!");
    }
    else if (handValue > 21) {
        alert("dealer bust");
    }
    else {
        decideWinner();
    }
}

/*const reset = async () => {
  location.reload();
}*/




HIT_BUTTON.addEventListener('click', hitPlayer);//the event listener aint working wtf
PASS_BUTTON.addEventListener('click', hitDealer);


//remove all consts, since they make things stuck forever? wait but then how is it pushing
shuffleDecks(5);
dealHands();