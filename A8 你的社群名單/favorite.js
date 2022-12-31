const BASE_URL = 'https://user-list.alphacamp.io/api/v1/users'
const users = []
const BASE_PAGE = 20
const favoriteUser = JSON.parse(localStorage.getItem('favoriteUser'))

axios
  .get(BASE_URL) // 修改這裡
  .then((response) => {
    for (const user of favoriteUser) {
      users.push(user)
      renderPage(users.length)
      renderUsersList(getEverPage(1))
      // console.log(users)
    }
  })
  .catch((err) => console.log(err))




const search = document.querySelector('#search-form')
const input = document.querySelector('#search-input')
let filterUser = []

search.addEventListener('submit', function searchButton(event) {
  event.preventDefault()

  let keyword = input.value.trim().toLowerCase()
  filterUser = users.filter((element) => element.name.toLowerCase().includes(keyword))

  renderPage(filterUser.length)
  renderUsersList(filterUser)
  // console.log(filterUser)
})


const dataPanel = document.querySelector('#data-panel')

// 監聽 data panel
dataPanel.addEventListener('click', function onPanelClicked(event) {
  // console.log(event.target)
  if (event.target.matches('.show-user')) {
    // console.log(event.target.dataset.id)
    showUserModal(event.target.dataset.id)
  } else if (event.target.matches('.remove-my-favorite')) {
    removeUserModal(event.target.dataset.id)
  }
})

const paginator = document.querySelector('#paginator')

paginator.addEventListener('click', function clickPage(event) {
  let now_page = event.target.dataset.page
  renderUsersList(getEverPage(now_page))
})

function getEverPage(pageNumber) {
  return users.slice((pageNumber - 1) * BASE_PAGE, pageNumber * BASE_PAGE)
  //0-12 13-24 25-36
}

function renderPage(length) {
  const total_page = Math.ceil(length / BASE_PAGE)

  let pageHTML = ''
  for (let page = 1; page <= total_page; page++) {
    pageHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = pageHTML
}

function renderUsersList(data) {
  let rawHTML = ''
  // console.log(data)
  data.forEach((item) => {
    // title, image
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img
          src="${item.avatar}" data-id="${item.id}"
          class="card-img-top show-user" alt="User Poster" 
          data-bs-toggle="modal" data-bs-target="#user-modal"/>
        <div class="card-body">
          <h5 class="card-title">${item.name} ${item.surname}</h5>
          <button data-id="${item.id}" type="button" class="btn btn-primary remove-my-favorite">Delete</button>
        </div>
      </div>
    </div>
  </div>`

  })
  dataPanel.innerHTML = rawHTML
}

function showUserModal(id) {
  const modalTitle = document.querySelector('#user-modal-title')
  const modalImage = document.querySelector('#user-modal-image')
  const modalDate = document.querySelector('#user-modal-date')
  const modalDescription = document.querySelector('#user-modal-description')

  axios.get(BASE_URL + '/' + id).then((response) => {
    const data = response.data
    // console.log(response, data)
    modalTitle.innerText = data.name
    modalDate.innerText = 'Birthday: ' + data.birthday
    modalDescription.innerText = `email: ${data.email}
                                  gender: ${data.gender}
                                  age : ${data.age}
                                  region : ${data.region}`

    modalImage.innerHTML = `<img src=" ${data.avatar}
      " alt="user-poster" class="img-fluid">`
  })
}

function removeUserModal(id) {
  id = Number(id)
  const index = favoriteUser.findIndex(element => element.id === id)
  favoriteUser.splice(index,1)

  localStorage.setItem('favoriteUser', JSON.stringify(favoriteUser))
  renderUsersList(favoriteUser)
  // console.log(favoriteUser)
} 