const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []

axios
  .get(INDEX_URL) // 修改這裡
  .then((response) => {
    for (const movie of response.data.results) {
      movies.push(movie)
      renderMovieList(movies)
    }
    // console.log(movies)
  })
  .catch((err) => console.log(err))


function renderMovieList(data) {
  let rawHTML = ''
  // console.log(data)
  data.forEach((item) => {
    // title, image
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image
      }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button data-id="${item.id}" class="btn btn-primary btn-show-movie" 
          data-bs-toggle="modal" data-bs-target="#movie-modal">More</button>
          <button data-id="${item.id}" class="btn btn-info btn-add-favorite">+</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {

  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  console.log(list)

  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

const dataPanel = document.querySelector('#data-panel')

// 監聽 data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  // console.log(event.target)
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

//監聽表單提交事件
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()

  const keyword = searchInput.value.trim().toLowerCase()
  let filteredMovies = []

  if (!keyword.length) {
    return alert('請輸入有效字串！')
  }
  //條件篩選
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  //重新輸出至畫面
  renderMovieList(filteredMovies)
})
// function searchForm(tetx) {

// } 


