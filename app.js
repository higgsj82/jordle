const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')
const quantityToggle = document.querySelector('.quantity-toggle')

let correctWord = "GREAT";
let wordLength;
const wordLengths = [4,5,6]


wordLengths.forEach(num => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = `${num} letter word` 
    buttonElement.setAttribute('id', 'word-length-' + num)
    buttonElement.addEventListener('click', () => wordLength = num)
    quantityToggle.append(buttonElement)
})
    

// const getWord = () => {
//     fetch('http://localhost:3000/word')
//         .then(response => response.json())
//         .then(json => {
//             // console.log(json)
//             correctWord = json.toUpperCase()
//         })
//         .catch(err => console.log(err))
// }

// getWord()

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'DELETE'
]

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex)=> {
   const rowElement = document.createElement('div')
   rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
    guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    })
   tileDisplay.append(rowElement)
})


keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement)
})

const handleClick = (key) => {
    if (!isGameOver) {
        if (key === 'DELETE') {
            deleteLetter()
            return
        }

        if (key === 'ENTER') {
            checkRow()
            return
        }

        addLetter(key)
    }
}

const addLetter = (letter) => {
    if (currentTile , 5 && currentRow < 6) {
        const tile = document.getElementById('guessRow-' + currentRow +'-tile-' + currentTile)
        tile.textContent = letter
        guessRows[currentRow][currentTile] = letter
        tile.setAttribute('data', letter) // gonna be used to color our letters later
        currentTile++
        // console.log('guess rows:', guessRows)
    }
}

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = ''
        guessRows[currentRow][currentTile] = ''
        tile.setAttribute('data', '')
    }
}

const checkRow = () => {
    const guessedWord = guessRows[currentRow].join('') // grab the current row and joins it into a correctWord 
    // console.log('guess', guessedWord)
    if (currentTile > 4) {
        fetch(`http://localhost:3000/check/?word=${guessedWord}`)
            .then(response => response.json())
            .then(json => {
                // console.log(json)
                if (json == "Entry word not found") {
                    showMessage('Not a word')
                    return
                } else {
                    flipTile()
                    if (correctWord == guessedWord) {
                        showMessage('Great job!')
                        isGameOver = true;
                        return
                    } else {
                        if (currentRow >= 5) {
                            isGameOver = true
                            showMessage('Game Over!')
                            return
                        }
                        if (currentRow < 5) {
                            currentRow++
                            currentTile = 0
                        }
                    }
                }
            })
            .catch(err => console.log(err))

    }
}

const showMessage = (message) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = message;
    messageDisplay.append(messageElement)
    setTimeout(() => messageDisplay.removeChild(messageElement), 3000)
}

const addColorToKeyboard = (letterKey, color) => {
    const key = document.getElementById(letterKey)
    key.classList.add(color)
}

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkWord = correctWord
    const guess = []

    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay'})
    })

    guess.forEach((guess, i) => {
        if (guess.letter == correctWord[i]) {
            guess.color = 'green-overlay'
            checkWord = checkWord.replace(guess.letter, '')
        }
    })

    guess.forEach((guess, i) => {
        if (checkWord.includes(guess.letter)) {
            guess.color = 'yellow-overlay'
            checkWord = checkWord.replace(guess.letter, '')
        }
    })

    rowTiles.forEach((tile, i) => {
        const letterData = tile.getAttribute('data')

        setTimeout(() => {
            tile.classList.add(guess[i].color)
            addColorToKeyboard(guess[i].letter, guess[i].color)
        }, 500 * i)
    })
}

