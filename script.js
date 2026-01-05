import { flashCardData } from "./data/data.js";


const categorySelect = document.querySelector('#category-select');
const cardSection = document.querySelector('.card-section');
const cardText = document.querySelector('.card-text');
const categoryTag = document.querySelector('.category-tag');
const know = document.querySelector('.action-button-know');
const reset = document.querySelector('.action-button-reset');
const cardCta = document.querySelector('.card-cta');
const actionShuffle = document.querySelector('.action-button-shuffle');
const hideMastered = document.querySelector('#hide-mastered');
const actionLeft = document.querySelector('.action-button-left');
const actionRight = document.querySelector('.action-button-right');
const totalCards = document.querySelector('#totalCards');
const masteredCards = document.querySelector('#masteredCards');
const inProgressCards = document.querySelector('#inProgressCards');
const notStarted = document.querySelector('#notStarted');
const cardInfo = document.querySelector('.card-info');
const study = document.querySelector('#study')
const all = document.querySelector('#all');

const state = {
    question: null,
    category: 'All Categories',
    mastered: [],
    hideMastered: false,
    visited: [],
    historyIndex: -1,
    totalQuestions: calculateTotalQuestions(),
    mode: 'all',
    categoryTotal: function() { // Add this computed property
        return getCategoryTotalQuestions(this.category);
    }
}


function setStudyMode() {
    state.mode = 'study';
    state.hideMastered = true;
    state.visited = [];
    state.historyIndex = -1;

    state.question = getRandomCard(state.category, flashCardData);
    displayQuestion();
}

function setAllCardsMode() {
    state.mode = 'all';
    state.hideMastered = false;
    state.visited = [];
    state.historyIndex = -1;

    state.question = getRandomCard(state.category, flashCardData);
    displayQuestion();
}


function calculateTotalQuestions() {
    let totalQues = 1;

    for(let data of flashCardData) {
        totalQues += data.questions.length;
    }

    return totalQues;
}

function getCategoryTotalQuestions(category) {
    if (category === 'All Categories') {
        return state.totalQuestions;
    }
    
    for(let data of flashCardData) {
        if (data.category === category) {
            return data.questions.length;
        }
    }
    return 0;
}

function addToMastered(card) {
    if (card.isTerminal) return;

    const exists = state.mastered.some(m =>
        m.category === card.category &&
        m.question.front === card.question.front &&
        m.question.back === card.question.back
    );

    if (!exists) {
        state.mastered.push({ ...card });
    }
}


function updateDashboard() {
    totalCards.textContent = state.totalQuestions;
    masteredCards.textContent = state.mastered.length;
    inProgressCards.textContent = state.visited.length;
    notStarted.textContent = state.totalQuestions - state.visited.length;
}

function updateCardInfo() {
    const categoryTotal = getCategoryTotalQuestions(state.category);
    cardInfo.textContent = `Card ${state.historyIndex + 1} of ${categoryTotal}`;
}

function populate() {
    const categories = ['All Categories'];
    for(let data of flashCardData) {
        categories.push(data.category);
    }

    for(let category of categories) {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    }
}

function displayQuestion() {
    if (state.question.isTerminal) {
        cardText.textContent = state.question.question.front;
        categoryTag.textContent = state.question.category;
        cardInfo.textContent = `Card 0 of ${getCategoryTotalQuestions(state.category)}`;
    } else {
        cardText.textContent = state.question.question.front;
        categoryTag.textContent = state.question.category;
        updateCardInfo();
    }
}



function getRandomCard(category, data, hideMastered = state.hideMastered) {
    let pool = [];

    for (let item of data) {
        if (category === 'All Categories' || item.category === category) {
            for (let q of item.questions) {
                const questionObj = {
                    category: item.category,
                    question: q
                };

                const isMastered = state.mastered.some(m =>
                    m.category === questionObj.category &&
                    m.question.front === questionObj.question.front &&
                    m.question.back === questionObj.question.back
                );

                const isVisited = state.visited.some(v =>
                    v.category === questionObj.category &&
                    v.question.front === questionObj.question.front &&
                    v.question.back === questionObj.question.back
                );

                if (
                    (!hideMastered || !isMastered) &&
                    !isVisited
                ) {
                    pool.push(questionObj);
                }
            }
        }
    }

    if (pool.length === 0) {
        return {
            category: category === 'All Categories'
                ? 'All Categories'
                : category,
            question: {
                front: category === 'All Categories'
                    ? 'All Questions Mastered'
                    : 'Topic Mastered',
                back: category === 'All Categories'
                    ? 'All Questions Mastered'
                    : 'Topic Mastered'
            },
            isTerminal: true
        };
    }

    return pool[Math.floor(Math.random() * pool.length)];
}

function previousCard() {
    if (state.historyIndex <= 0) return;

    state.historyIndex--;
    state.question = state.visited[state.historyIndex];
    displayQuestion();
}

function nextCard() {
    if (state.historyIndex < state.visited.length - 1) {
        state.historyIndex++;
        state.question = state.visited[state.historyIndex];
        displayQuestion();
        return;
    }

    // Generate a new card
    const next = getRandomCard(state.category, flashCardData);

    if (!next || next.isTerminal) {
        state.question = next;
        displayQuestion();
        return;
    }

    state.visited.push(next);
    state.historyIndex = state.visited.length - 1;
    state.question = next;
    displayQuestion();
}



function mastered() {
    if (state.question?.isTerminal) return;

    addToMastered(state.question);
    
    // Get next card after mastering current one
    state.question = getRandomCard(state.category, flashCardData);
    
    document.querySelector('.know-text').textContent = 'Mastered !';
    know.style.pointerEvents = 'none';

    setTimeout(() => {
        document.querySelector('.know-text').textContent = 'I Know This';
        know.style.pointerEvents = 'auto';        
    }, 2000);
    
    // Update the display with the new card
    displayQuestion();
}

function shuffle() {
  let currentIndex = flashCardData.length;

  while (currentIndex != 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [flashCardData[currentIndex], flashCardData[randomIndex]] = [
      flashCardData[randomIndex], flashCardData[currentIndex]];
  }

  state.question = getRandomCard(state.category, flashCardData);
  displayQuestion();
}

function resetProgress () {
    state.mastered = [];
    state.visited = [];
    state.historyIndex = -1;
    updateDashboard();
}

categorySelect.addEventListener('change', () => {
    const selectedIndex = categorySelect.selectedIndex;
    const option = document.getElementsByTagName('option')[selectedIndex].value;
    
    // Reset visited history for new category
    state.visited = [];
    state.historyIndex = -1;
    
    const card = getRandomCard(option, flashCardData);
    state.question = card;
    state.category = option;
    
    // Add first card of new category to visited
    if (card && !card.isTerminal) {
        state.visited.push(card);
        state.historyIndex = 0;
    }
    
    displayQuestion();
    updateCardInfo();
});


cardSection.addEventListener('click', () => {
    // Check if it's a terminal card before trying to access .back
    if (state.question?.isTerminal) return;
    
    cardText.textContent = state.question.question.back;
    // ... rest of the code remains the same
    cardSection.classList.remove('fill-pink');
    cardSection.classList.add('fill-cream');
    cardSection.classList.add('animate__animated');
    cardSection.classList.add('animate__flipInX')
    cardCta.textContent = '';

    setTimeout(() => {
        cardText.textContent = state.question.question.front;
        cardSection.classList.remove('fill-cream');
        cardSection.classList.add('fill-pink');
        cardSection.classList.remove('animate__animated');
        cardSection.classList.remove('animate__flipInX');
        cardCta.textContent = 'Click to reveal answer';
    }, 2000);
});

know.addEventListener('click', () => {
    mastered();
    updateDashboard()
})

actionShuffle.addEventListener('click', () => {
    shuffle();
    actionShuffle.textContent = 'Shuffled!';
    actionShuffle.style.pointerEvents = 'none';

    setTimeout(() => {
        actionShuffle.textContent = 'Shuffle  '
        actionShuffle.style.pointerEvents = 'auto';
        const icon = document.createElement('i');
        icon.classList.add('fa-solid');
        icon.classList.add('fa-shuffle');
        actionShuffle.appendChild(icon);
    }, 2000);
})

reset.addEventListener('click', () => {
    resetProgress();
    document.querySelector('.reset-text').textContent = 'Progress Reset!';
    reset.style.pointerEvents = 'none';

    setTimeout(() => {
        document.querySelector('.reset-text').textContent = 'Reset Progress';
        reset.style.pointerEvents = 'auto';
    }, 2000)

    state.question = getRandomCard(state.category, flashCardData);
    displayQuestion();
});

hideMastered.addEventListener('click', () => {
    state.hideMastered = !state.hideMastered;
    console.log(state.hideMastered);
})

actionLeft.addEventListener('click', () => {
    previousCard();
})

actionRight.addEventListener('click', () => {
    nextCard();
    updateDashboard();
    updateCardInfo();
})

study.addEventListener('click', () => {
    setStudyMode();
    study.classList.add('study-mode-active');
    all.classList.remove('study-mode-active');
})

all.addEventListener('click', () => {
    setAllCardsMode();
    all.classList.add('study-mode-active');
    study.classList.remove('study-mode-active');
})

populate();
state.question = getRandomCard(state.category, flashCardData);

if (state.question && !state.question.isTerminal) {
    state.visited.push(state.question);
    state.historyIndex = 0;
}
displayQuestion();
updateDashboard();
updateCardInfo();



