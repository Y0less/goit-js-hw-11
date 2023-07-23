import getImages from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
export const searchParams = {
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: '',
  page: '',
};

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  // loadMore: document.querySelector('.load-more'),
  observerWatchdog: document.querySelector('.observer-watchdog'),
};

const observerOptions = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};

const perPage = 40;
let searchQuery = '';
let totalHits = null;

const observer = new IntersectionObserver(handleObserver, observerOptions);
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  overlayOpacity: 0.6,
});

refs.searchForm.addEventListener('submit', handleSubmit);
// refs.loadMore.addEventListener('click', handleLoadmore);

function handleSubmit(evt) {
  evt.preventDefault();
  refs.gallery.innerHTML = '';
  searchQuery = '';
  searchParams.per_page = perPage;
  searchParams.page = 1;
  // hideLoadMore();
  searchQuery = evt.currentTarget.elements.searchQuery.value;
  observer.unobserve(refs.observerWatchdog);
  getImages(searchQuery)
    .then(data => {
      totalHits = data.totalHits;
      if (!totalHits) {
        notifyFailure();
        // hideLoadMore();
        return;
      }
      notifySuccess(totalHits);
      generateMarkup(data);
      // showLoadMore();
      checkCollectionEnd(data);
      lightbox.refresh();
      if (data.totalHits > perPage * searchParams.page) {
        observer.observe(refs.observerWatchdog);
      }
      if (data.totalHits <= perPage * searchParams.page) {
        observer.unobserve(refs.observerWatchdog);
      }
    })
    .catch(error => {
      console.log(error);
      // hideLoadMore();
    })
    .finally();
}

function handleLoadmore() {
  searchParams.page += 1;
  if (totalHits <= perPage * (searchParams.page - 1)) {
    return;
  }
  getImages(searchQuery)
    .then(data => {
      generateMarkup(data);
      // showLoadMore();
      checkCollectionEnd(data);
      lightbox.refresh();
      if (data.totalHits <= perPage * searchParams.page) {
        observer.unobserve(refs.observerWatchdog);
      }
      autoScrollUp();
    })
    .catch(error => {
      console.log(error);
      // hideLoadMore();
    })
    .finally();
}

function generateMarkup(data = []) {
  const markup = data.hits
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
      ) =>
        `

  <div class="photo-card">
  <a class="gallery-link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item"><b>Likes</b><br />${likes}</p>
      <p class="info-item"><b>Views </b><br />${views}</p>
      <p class="info-item"><b>Comments </b><br />${comments}</p>
      <p class="info-item"><b>Downloads </b><br />${downloads}</p>
    </div>
  </div>
`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function checkCollectionEnd(data) {
  if (data.totalHits <= perPage * searchParams.page) {
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    // hideLoadMore();
  }
}

function autoScrollUp() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function notifyFailure() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function notifySuccess(matches) {
  Notify.success(`Hooray! We found ${matches} images.`);
}

function handleObserver(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      handleLoadmore();
    }
  });
}

// function showLoadMore() {
//   refs.loadMore.classList.remove('is-hidden');
// }
// function hideLoadMore() {
//   refs.loadMore.classList.add('is-hidden');
// }
