'use strict';

//        MOSTRAR RESULTADOS DE BÚSQUEDA            //

// Función para generar el código HTML que debe aparecer para cada resultado
const getResultsHtmlCode = (eachResult, isFavourite) => {
  let resultHtmlCode = '';
  let recommended= '';
  if(eachResult.score>7){
    recommended= 'Recomendado';
    }else {
      recommended= '';
    }
  if (eachResult.images.webp.image_url === null) {
    resultHtmlCode += `<li id= "${eachResult.mal_id}" class= 'liResult js-newLiElement ${isFavourite ? ' selected' : ''}'>
                            <div class= 'liResult__imgContainer'>
                              <img class= 'liResult__imgContainer--img' src='https://via.placeholder.com/210x295/ffffff/666666/?text=${eachResult.title}' title='${eachResult.title}' alt='${eachResult.title}'>
                            </div>
                            <h3 class= 'liResult__title>${eachResult.title}</h3>
                          </li>`;
  } else {
    resultHtmlCode += `<li id= "${eachResult.mal_id}" class= 'liResult js-newLiElement${isFavourite ? ' selected' : ''}'>
                          <div class= 'liResult__imgContainer'>
                            <img class= 'liResult__imgContainer--img' src='${eachResult.images.webp.image_url}' title='${eachResult.title}' alt='${eachResult.title}'>
                          </div>
                          <h3>${eachResult.title}</h3><p class= 'paragraph'>${recommended}</p></li>`;
  }
  
  return resultHtmlCode;
};

// Función para pintar los resultados
const renderResults = (htmlElement, results) => {
  let resultsCode = '';
  const favouritesFromLocalStorage = JSON.parse(getFavouritesFromLocalStorage());
  // para cada resultado del array
  for (const eachResult of results) {
    let isFavourite = false;

    if (favouritesFromLocalStorage) {
      const indexOfFavourite = favouritesFromLocalStorage.findIndex(favourite => parseInt(favourite.id) === eachResult.mal_id);
      isFavourite = indexOfFavourite !== -1;
    }
    resultsCode += getResultsHtmlCode(eachResult, isFavourite); // le paso el nuevo código que se tiene que generar
  }
  htmlElement.innerHTML += resultsCode;
};



const addEventListenerToResults = () => {
  const resultsList = containerResults.querySelector('.js-resultsList');
  resultsList.childNodes.forEach((result) => {
    result.addEventListener('click', () => toogleFavourite(result));
  });
};

// Escuchar evento para pintar resultados
searchBtn.addEventListener('click', function (event) {
  event.preventDefault();
  const searchTerm = searchInput.value;
  if (searchTerm.length >= 3) {
    const listResults = document.createElement('ul');
    listResults.classList.add('resultsSection__containerResult--seriesList');
    listResults.classList.add('js-resultsList');
    containerResults.innerHTML = '';

    getApiData(searchTerm)
      .then((results) => {
        renderResults(listResults, results);
        containerResults.appendChild(listResults);
      })
      .then(() => {
        addEventListenerToResults();
      });
  } else {
    //si no...
    containerResults.innerHTML = '';
    containerResults.innerHTML = `<p> Debes introducir una búqueda válida </p>`; // debe introducir una búsqueda válida
  }
});


//                                    LISTENERS                                   //

// Listener para mostrar el formulario en la versión móvil
searchIcon.addEventListener('click', () => {
  searchInput.classList.toggle('header__form--searchInput');
  searchInput.classList.toggle('removeHiddenSearchInput');
  searchBtn.classList.toggle('header__form--btns--btnSearch');
  searchBtn.classList.toggle('btnsMobile__btnSearchMobile');
  resetBtn.classList.toggle('header__form--btns--btnReset');
  resetBtn.classList.toggle('btnsMobile__btnResetMobile');
});
