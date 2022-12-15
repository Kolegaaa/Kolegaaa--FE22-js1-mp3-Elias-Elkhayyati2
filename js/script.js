const länderInfo = document.querySelector("#land-input");

const btn = document.querySelector("#land-btn");
btn.addEventListener("click", getCountriesForLanguage);
const countries = [];
const languages = {};
const languageGroups = {};
let highest 

function getCountriesForLanguage(event) {
  event.preventDefault();
  const input = document.querySelector("#land-input");
  const infoContainer = document.getElementById("info-container");
  // användare söker på "Arabic". då vill vi fråga: "finns det en språkkod för arabic?"
  const name = input.value.trim().toLowerCase();
  input.value = "";
  infoContainer.innerHTML = "";
  let code = "";
  const languageCode = languages[name];
  if (languageCode) {
    code = languageCode;
  } else {
    // språket saknas. visa felmeddelande till användaren
    return alert("Språket saknas!");
  }


  // "ara" -> fråga: "vilka länder har ara som språkkod"
  let countryGroup = [];
  if (languageGroups[code]) {
    countryGroup = languageGroups[code];
  }
   // Sorterar från högsta till lägsta kanske lite avancerat för mig men fick de förklarat att man kan göra så 
    countryGroup.sort((a, b) => b.population - a.population);
  // render countries
  for (let i = 0; i < countryGroup.length; i++) {
   if (i==0) {
    console.log('biggest population',countryGroup[0]);
    const country = countryGroup[i];
    infoContainer.innerHTML += `
    <div class = "country-container">
    <p> Namn : <span id="namn">${country.name.common}</span></p>
        <p>Subregion: <span id="subregion">${country.subregion}</span></p>
        <p>Huvudstad: <span id="huvudstad">${country.capital}</span></p>
        <p>Befolkningsmängd: <span id="biggestPopulation">${country.population}</span></p>
        <img src='${country.flags.png}'>
        </div>
    `;

   }

   else {
    const country = countryGroup[i];
    infoContainer.innerHTML += `
    <div class = "country-container">
    <p> Namn : <span id="namn">${country.name.common}</span></p>
        <p>Subregion: <span id="subregion">${country.subregion}</span></p>
        <p>Huvudstad: <span id="huvudstad">${country.capital}</span></p>
        <p>Befolkningsmängd: <span id="befolkningsmängd">${country.population}</span></p>
        <img src='${country.flags.png}'>
        </div>
    `;
  

   }
   console.log(countryGroup[i], i);

  }
}


fetch(`https://restcountries.com/v3.1/all`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.forEach((country) => {
      // lagra alla länder
      countries.push(country);
    });

    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      // if (!highest || highest.population < country.population) highest = country
      // om landet saknar språk, gå vidare till nästa land.
      if (!country.languages) {
        continue;
      }
  
      // gå igenom alla språk i landet
      Object.entries(country.languages).forEach((entry) => {
        // språk kan ha en kod och ett namn. språkets kod: 'ara'. språkets namn: 'Arabic'
        // entry: ["ara", "Arabic"]
        const languageCode = entry[0];
        const languageName = entry[1];
        languages[languageName.toLowerCase()] = languageCode;
    
        // spara landet i en språkgrupp
        if (languageGroups[languageCode]) {
          languageGroups[languageCode].push(country);
        } else {
          languageGroups[languageCode] = [country];
        }
      });
    }
  })
  .catch((error) => { console.error(error); });