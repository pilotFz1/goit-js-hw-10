export const fetchCountries = name => {
  const BASE_URL = 'https://restcountries.com/v3.1/name/';
  const URL = `${BASE_URL}${name}?fields=name,capital,population,languages,flags`;

  return fetch(URL).then(response => {
    if (response.status === 200) {
      return response.json();
    }

    return Promise.reject('not found');
  });
};
