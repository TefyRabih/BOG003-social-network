/** Crear div que contiene template de notFound*/
export const nFound = () => {

    const divnFound = document.createElement('div');
  
    const viewnFound =
      `<a href="#/">No se encuentra la página</a>
      `
    divnFound.innerHTML = viewnFound; 
  
    return divnFound;
  };