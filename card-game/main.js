// 放在文件最上方
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}
const Symbol = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

const controller = {
  currentState: GAME_STATE.FirstCardAwaits,  // 加在第一行
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },
  // 判斷狀態
  dispatchCardAction(card) {
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        this.currentState = GAME_STATE.SecondCardAwaits
        model.revealedCards.push(card)
        view.flipCards(card)
        break;
      case GAME_STATE.SecondCardAwaits:

        view.renderTriedTimes(++model.triedTimes)
        model.revealedCards.push(card)
        view.flipCards(card)

        if (model.isRevealedCardsMatched()) {
          // 配對成功
          view.renderScore(model.score += 10)
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(...model.revealedCards)
          model.revealedCards = []
          if (model.score === 260) {
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()
            return
          }

          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          // 配對失敗
          this.currentState = GAME_STATE.CardsMatchFailed
          setTimeout(this.resetCards, 1000)
          view.wrongAnimations(...model.revealedCards)
        }

        break;

    }
    // console.log(this.currentState)
  },
  resetCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits
  },

}

const model = {
  //revealedCards 是一個暫存牌組，使用者每次翻牌時，就先把卡片丟進這個牌組，集滿兩張牌時就要檢查配對有沒有成功，檢查完以後，這個暫存牌組就需要清空
  revealedCards: [],

  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },
  score: 0,
  triedTimes: 0
}

const view = {

  getCardContent(index) {

    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbol[Math.floor(index / 13)]
    return `
      <p>${number}</p>
      <img src="${symbol}">
      <p>${number}</p>
      `
  },

  getCardElement(index) {
    return `<div class="card back" data-index="${index}"> </div> `
  },

  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  displayCards(indexes) {
    const rootElement = document.querySelector("#cards");
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join("");
  },

  // 翻牌
  flipCards(...cards) {
    // console.log(card)
    cards.map(card => {
      // 如果牌面為背面
      if (card.classList.contains('back')) {
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return
      }

      // 牌面已經翻開的狀態下
      card.classList.add('back')
      card.innerHTML = null
    })
  },

  // ...card 將傳進去的字串變成陣列[1,2,3,4,5]
  pairCards(...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })
  },
  renderScore(score) {
    document.querySelector('.score').textContent = `Score:${score}`
  },
  renderTriedTimes(times) {
    document.querySelector('.tried').textContent = `You've tried: ${times} times`
  },
  wrongAnimations(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', event => event.target.classList.remove('wrong'), { once: true })
    })
  },
  showGameFinished() {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>congratulations on finishing!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
      <button class="btn btn-primary reload">Play Again</button>
    `
    const header = document.querySelector('#header')
    header.before(div)
    console.log(document.querySelector(".reload"))
    document.querySelector(".reload").addEventListener('click', event => {
      this.playAgain()
    })
  },

  playAgain() {
    window.location.reload()
  }
}

const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}


controller.generateCards()

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    controller.dispatchCardAction(card)
  })
})

// document.querySelector(".reload").addEventListener('click',playAgain())



