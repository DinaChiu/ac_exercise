const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
const MOVIES_PER_PAGE = 12
let filteredMovies = []
const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')
let method = 'card' //預設模式
// 宣告currentPage去紀錄目前分頁，確保切換模式時分頁不會跑掉且搜尋時不會顯示錯誤
let currentPage = 1

axios
  .get(INDEX_URL) // 修改這裡
  .then((response) => {
    for (const movie of response.data.results) {
      movies.push(movie)
      renderPaginator(movies.length)
      renderMovieList(getMoviesByPage(currentPage), method)
    }
    // console.log(movies)
  })
  .catch((err) => console.log(err))

function getMoviesByPage(page) {

  const data = filteredMovies.length ? filteredMovies : movies
  //計算起始 index
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  //回傳切割後的新陣列
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  //計算總頁數
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  //製作 template 
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //放回 HTML
  paginator.innerHTML = rawHTML
}


function renderMovieList(data, method) {
  let rawHTML = ''
  // console.log(para)
  if (method === 'list') {
    data.forEach((item) => {
      // title, image
      rawHTML += `
      <li class="list-group-item" style="display:flex;">
        <div style="width:70%;">${item.title}</div>
        <button data-id="${item.id}" class="btn btn-primary btn-show-movie" 
        data-bs-toggle="modal" data-bs-target="#movie-modal">More</button>
        <button data-id="${item.id}" class="btn btn-info btn-add-favorite">+</button>
      </li>
    `
    })
    rawHTML = `<ul class="list-group list-group-flush">` + rawHTML + `</ul>`
  } else if (method === 'card'){
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
  }

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

//監聽模式按鈕
const changeMethod = document.querySelector('#change-method')
changeMethod.addEventListener('click', function onChangeClicked(event) {
  // console.log(paginator)

  if (event.target.dataset.method === 'card') {
    method = 'card'
    renderMovieList(getMoviesByPage(currentPage), method)
  } else if (event.target.dataset.method === 'list') {
    method = 'list'
    renderMovieList(getMoviesByPage(currentPage), method)
  }

})


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


  if (!keyword.length) {
    return alert('請輸入有效字串！')
  }
  //條件篩選
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  //重製分頁器
  renderPaginator(filteredMovies.length)  //新增這裡
  //預設顯示第 1 頁的搜尋結果
  currentPage = 1
  renderMovieList(getMoviesByPage(currentPage), method)  //修改這裡

})


// 監聽 data panel
paginator.addEventListener('click', function onPanelClicked(event) {
  // console.log(event.target.dataset.page)
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  currentPage = page
  renderMovieList(getMoviesByPage(currentPage), method)
})


