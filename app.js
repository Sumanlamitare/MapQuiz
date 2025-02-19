//---------------------js for map start ---------------------------
//.setView([lat, log],zoom view)
var map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

var popup = L.popup();

async function onMapClick(e) {
  const ans = await checkIfCorrect(e.latlng);
  if (ans) {
    popup.setLatLng(e.latlng).setContent("Your Answer is Correct ").openOn(map);
  } else {
    popup
      .setLatLng(e.latlng)
      .setContent("Your Answer is Incorrect ")
      .openOn(map);
  }

  //   var marker = L.marker(e.latlng).addTo(map);
}
map.on("click", onMapClick);

//---------------------js for map end ---------------------------

let countryList = getCountryList(); //populates the country list
let countryCode = ""; //variable to hold the country code
const startButton = document.getElementById("startButton");
const hintList = document.querySelectorAll("hint");
const hint1 = document.getElementById("hint1");
const hint2 = document.getElementById("hint2");
const hint3 = document.getElementById("hint3");
const infoDiv = document.getElementById("question");

const playerName = document.getElementById("name");

const playerScore = document.getElementById("score");

const playerHints = document.getElementById("attempts");

const playerAttempts = document.getElementById("hints");

startButton.addEventListener("click", startGame);

//
async function startGame() {
  hint1.innerHTML = hint2.innerHTML = hint3.innerHTML = ""; //clear previous hints

  infoDiv.innerHTML = "";

  const countryIndex = Math.floor(Math.random() * countryList.length); //get a random number
  country = countryList[countryIndex].name.common; //use the random number to get a random country
  countryCode = countryList[countryIndex].cca2; //set the country code to check answer later
  countryList.splice(countryIndex, 1); //remove the country from the array so it doesn't appear again

  const countryInfo = await getInfo(country); //get info about the country

  //use country info to display for hints
  const flag = document.createElement("img");
  flag.style.marginTop = "1em";
  flag.src = countryInfo[0].flags.png;
  hint1.appendChild(flag);

  const capital = document.createElement("h4");
  capital.textContent = `Capital city: ${countryInfo[0].capital}`;
  hint1.appendChild(capital);

  const continent = document.createElement("h4");
  continent.textContent = `Continent: ${countryInfo[0].continents}`;
  hint1.appendChild(continent);

  const population = document.createElement("h4");
  population.textContent = `Population: ${countryInfo[0].population}`;
  hint1.appendChild(population);
}

// get element for the div to display instruction

function onLoad() {
  let player = prompt("Please enter your name to begin the game");
  let infoheader = document.createElement("h1");
  infoheader.textContent = "Instruction";
  infoDiv.appendChild(infoheader);
  // console.log("Function called");
  let instruction = document.createElement("p");
  instruction.innerHTML =
    "<b>Welcome to the World Map Quiz!</b> <br><br> In this game, you’ll guess the countries based on the hints provided. <br><br> Once the game starts, use the map to locate the country. After finding the location on the map, submit your guess by <b>clicking</b> on the location. <br><br> Your score will be based on several factors, including the number of <b>attempts</b>, <b>hints</b> used, and the <b>accuracy</b> of your guesses. <br><br> Click the <b>Start</b> button to begin your adventure.";

  infoDiv.appendChild(instruction);

  playerName.innerHTML = `<b>Player Name: </b>${player}`;

  playerScore.innerHTML = "<b>Score: </b> 0";

  playerAttempts.innerHTML = "<b>Attempts: </b>3";

  playerHints.innerHTML = "<b>Hints: </b> 3";
}

window.onLoad = onLoad();

async function getCountryList() {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/all?fields=name,cca2`
    );
    const data = await response.json();
    countryList = data;

    // return setCountry;
  } catch (error) {
    console.log(`Error : ${error}`);
  }
}

//function to get the country info
async function getInfo(country) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${country}?fullText=true`
    );
    const data = await response.json();
    console.log(data[0].name.common);
    return data;
  } catch (error) {
    console.log(`Error : ${error}`);
  }
}

//this is called when user clicks on the map to see if the answer is correct
async function checkIfCorrect(e) {
  try {
    const response = await fetch(
      `http://api.geonames.org/countryCodeJSON?lat=${e.lat}&lng=${e.lng}&username=kumarbijayananda`
    );
    const data = await response.json();

    return data.countryCode === countryCode ? true : false; //return true if codes are the same else false
  } catch (error) {
    console.log("Error from checkIfCorrect:" + error);
  }
}
