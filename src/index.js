import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  countrySearch: document.querySelector('#search-box'),
  countryInfo: document.querySelector('.country-info'),
  countriesList: document.querySelector('.country-list'),
};
const getName = evt => evt.target.value.trim().toLowerCase();

const searchCountry = evt => {
  const search = getName(evt);

  if (search === '') {
    reset();
    return;
  }

  fetchCountries(search).then(renderMarkup).then(addSearch).catch(errors);
};

refs.countrySearch.addEventListener(
  'input',
  debounce(searchCountry, DEBOUNCE_DELAY)
);

const renderMarkup = array => {
  if (array.length > 10) {
    return Promise.reject('a lot');
  }

  if (array.length > 1) {
    return {
      type: 'country',
      markup: array
        .map(
          country =>
            `<li><img src=${country.flags.svg} alt="country flag" width="25" height="20">   ${country.name.common}</li>`
        )
        .join(''),
    };
  }
  if (array.length === 1) {
    const country = array[0];
    return {
      type: 'countrys',
      markup: `
    <h2><img src=${
      country.flags.svg
    } alt="country flag" width="25" height="20">   ${country.name.common}</h2>

    <h4>Capital: ${country.capital}</h4>
    <h4>Population: ${country.population}</h4>
    <h4>Languages: ${Object.values(country.languages)}</h4>    
    `,
    };
  }
};

const reset = () => {
  refs.countryInfo.innerHTML = '';
  refs.countriesList.innerHTML = '';
};

const addSearch = searchMarkup => {
  reset();

  if (searchMarkup.type === 'country') {
    refs.countriesList.insertAdjacentHTML('beforeend', searchMarkup.markup);
  } else if (searchMarkup.type === 'countrys') {
    refs.countryInfo.insertAdjacentHTML('beforeend', searchMarkup.markup);
  }
};

const errors = error => {
  reset();
  error === 'a lot'
    ? Notify.info('Too many matches found. Please enter a more specific name.')
    : Notify.failure('Oops, there is no country with that name');
};
