import getImages from './pixabay-api';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', handleSubmit);

function handleSubmit(evt) {
  evt.preventDefault();
  const searchQuery = evt.currentTarget.elements.searchQuery.value;
  console.log('searchQuery :>> ', searchQuery); //hide
  getImages(searchQuery)
    .then(
      data => (
        console.log(data), //hide
        generateMarkup(data)
      )
    )
    .catch(error => console.log(error));
}

function generateMarkup(data = []) {
  markup = data.hits
    .map(
      (
        {
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        } = data.hits
      ) => `<div class="photo-card">
        <div class="img-container"> 
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><br>${likes}
    </p>
    <p class="info-item">
      <b>Views </b><br>${views}
    </p>
    <p class="info-item">
      <b>Comments </b><br>${likes}
    </p>
    <p class="info-item">
      <b>Downloads </b><br>${likes}
    </p>
  </div>
</div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

//temporary
getImages('dogs').then(data => generateMarkup(data));
