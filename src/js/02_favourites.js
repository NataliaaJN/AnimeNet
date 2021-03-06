'use strict';
//                                FUNCIONES                                      //

// Función para desplegar la sección de favoritos
const handleClickFavouritesCollapsable = () => {
  const resultsSection = document.querySelector('.js-seriesResult');
  favouritesSection.classList.toggle('collapsed');
  favouritesSection.classList.toggle('favoritesSection');
  resultsSection.classList.toggle('resultsSectionIfFavouritesOpen');
  resultsSection.classList.toggle('resultsSection');
};

//               GUARDAR LOS FAVORITOS EN LOCALSTORAGE                   //

const favouritesOnLocalStorage = 'favouritesList';  // Guardo el nombre clave

// Función para coger los favoritos guardados en localStorage
const getFavouritesFromLocalStorage = () => {
  return localStorage.getItem(favouritesOnLocalStorage);  // Llamo a los datos guardados por el nombre clave
};

// Función para guardar los favoritos en el localStorage
const addFavouriteToLocalStorage = (favouriteToAdd) => {
  // Creo un objeto con lo que debe contener cada elemento que guardemos en favoritos
  const favouriteObject = {
    id: favouriteToAdd.id,
    src: favouriteToAdd.querySelector('img').src,
    name: favouriteToAdd.querySelector('h3').innerHTML,
  };
  let favouritesListStorage = JSON.parse(getFavouritesFromLocalStorage()); // Paso los datos guardados de string a su forma original
  if (!favouritesListStorage) {
    favouritesListStorage = [];
  }
  // Añado el objeto al array de favoritos guardados en localStorage
  favouritesListStorage.push(favouriteObject);
  localStorage.setItem(favouritesOnLocalStorage, JSON.stringify(favouritesListStorage)); // Cuando añado un favorito, guardo el array de favoritos en localStorage
};


// Función para eliminar favoritos del localStorage
const removeFavouriteToLocalStorage = (favouriteToRemove) => {
  let favouritesListStorage = JSON.parse(getFavouritesFromLocalStorage()); // Paso los datos guardados de string a su forma original
  // Compruebo si la serie ya está en favoritos:
  // 1º- busco el índice del favorito que coincida con el id del favorito que quiero borrar
  const index = favouritesListStorage.findIndex(favourite => favourite.id === favouriteToRemove.id);
  // 2º- si está en el array... (si no está, devuelve -1)
  if (index !== -1) {
    favouritesListStorage.splice(index, 1); // lo elimino de la lista de favoritos
  }
  localStorage.setItem(favouritesOnLocalStorage, JSON.stringify(favouritesListStorage)); // Cuando elimino un favorito, vuelvo a guardar el array de favoritos en localStorage
  counter--;
  renderFavouritesCounter();
};

// Función para buscar si existe el resultado (li) en el listado (ul) en base al favorito
const searchOnResults = (liHtml) => {
  const resultsList = containerResults.querySelector('.js-resultsList'); // recojo el elemento ul de HTML
  const resultChildNodes = resultsList ? resultsList.childNodes : [];    // si existe el ul -> devuelve sus elementos hijos (li), si no -> devuelve un array vacío
  return Array.from(resultChildNodes).find(result => result.id === liHtml.id); // Convierto el nodo en array y ejecuto el método find para buscar el primer resultado que cumpla la condición (busco un resultado-li en el listado-ul que coincida con el li que hay en favoritos)
};

// Función para eliminar la clase 'selected' al resultado
const deleteOnResultIfExists = (liHtml) => {
  const resultsListChild = searchOnResults(liHtml);
  if (resultsListChild) { // si es verdad que el resultado que está como favorito está también en los resultados de búsqueda
    resultsListChild.classList.remove('selected'); // quítale la clase 'selected'
  }
};

//                  AÑADIR O ELIMINAR FAVORITOS                //

// Función para eliminar favoritos:

const removeFavourite = (liHtml) => {
  const favouriteListChild = Array.from(favouritesList.childNodes).find(favourite => favourite.id === liHtml.id);
  deleteOnResultIfExists(liHtml); // llama a la función que borra el resultado si existe en los resultados de búsqueda
  favouritesList.removeChild(favouriteListChild); // Elimina del ul de favoritos, los hijos li
  removeFavouriteToLocalStorage(liHtml); // Ejecuta la función que elimina un favorito del localStorage
};

// Función para añadir favoritos:
const addFavourite = (liHtml) => {
  //Comprobamos que el nodo no esté en favoritos
  //Convertimos NodeList a Array con el método estático from
  const indexOnFavourites = Array.from(favouritesList.childNodes).findIndex(favourite => favourite.id === liHtml.id);
  liHtml.classList.toggle('selected');

  if (indexOnFavourites !== -1) {
    return; //si ya está en favoritos, se sale de la función
  }

  //Clonamos el nodo para añadirlo en favoritos
  const clonedLiHtml = liHtml.cloneNode(true); // Clono el resultado (elemento li) creado al hacer una búsqueda
  clonedLiHtml.classList.add('clonedLiHtmlStyle');

  //Como no quiero que se clone el nuevo párrafo 'recommended' de resultados:
  clonedLiHtml.removeChild(clonedLiHtml.childNodes[clonedLiHtml.childNodes.length-1]);
  
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML += `<i class="deleteBtn__crossIcon far fa-times-circle"></i>`;
  const deleteBtn = clonedLiHtml.appendChild(deleteButton);
  deleteBtn.classList.add('deleteBtn');
  deleteBtn.classList.add('js-remove-button');

  const favouritesLiElem = favouritesList.appendChild(clonedLiHtml); // A la lista ul de favoritos, le añado como hijo el li clonado
  addFavouriteToLocalStorage(clonedLiHtml); // Ejecuto la función declarada previamente, para guardarlo en el localStorage
  favourites.push(favouritesLiElem); // Añado los li al array de favoritos

  //Añadir el listener de eliminar favorito
  deleteBtn.addEventListener('click', () => removeFavourite(clonedLiHtml));

  counter++;
  renderFavouritesCounter();
};

const toogleFavourite = (liHtml) => {
  if (liHtml.classList.contains('selected')) {
    removeFavourite(liHtml);
  } else {
    addFavourite(liHtml);
  }
};


// Listener en icono estrella para desplegar sección de favoritos
for (const star of starIcons) {
  star.addEventListener('click', handleClickFavouritesCollapsable);
}