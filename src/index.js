import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetch-countries';
import countriesListTpl from './templates/countries-list.hbs';
import countryInfoTpl from './templates/country-info.hbs';

const DEBOUNCE_DELAY = 500;
const refs = {
  searchBox: document.querySelector('#search-box'),
  countriesList: document.querySelector('.js-country-list'),
  countryInfo: document.querySelector('.js-country-info'),
};

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const value = e.target.value.trim();
  if (value === '') {
    return;
  }

  fetchCountries(value).then(handleData).catch(onError);
}

function handleData(data) {
  if (data.length > 10) {
    onTooManyMatches();
    return;
  }

  if (data.length === 1) {
    renderCountryInfo(data[0]);
    return;
  }

  renderCountriesList(data);
}

function renderCountriesList(list) {
  refs.countryInfo.innerHTML = '';
  refs.countriesList.innerHTML = countriesListTpl(list);
}

function renderCountryInfo(country) {
  refs.countriesList.innerHTML = '';
  refs.countryInfo.innerHTML = countryInfoTpl(country);
}

function onError() {
  Notiflix.Notify.failure('Oops, there is no country with that name.');
}

function onTooManyMatches() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}
