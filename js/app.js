
//https://api.nps.gov/api/v1/parks?stateCode=NY&stateCode=NJ&limit=10

const handleFormSubmit = () => {
    document.querySelector("button[type='submit']")
      .addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector(".results-list").innerHTML = ""; 
        
        const selectedStates = document.querySelectorAll("#states-list option:checked");
        const statesList = Array.from(selectedStates).map(el => el.value);
        const limit = document.querySelector("#max-results").value;
        console.log(statesList);
        getParksList(statesList, limit)
      })
  }

  const parseStates = (statesList) => {
    let queryString = "";
    if (statesList.length == 1) {
        queryString += `stateCode=${statesList}`
    } 
    else {
        statesList.map(state => {
            queryString += (state === statesList[statesList.length-1]) ? `stateCode=${state}` : `stateCode=${state}&`;
        })
    }
    return queryString;
  }


  const getParksList = async (statesList, limit) => {
    let params = `?${parseStates(statesList)}&limit=${limit}`
    try {
        // Call the Endpoint with settings
        let response = await fetch(`https://api.nps.gov/api/v1/parks${params}&api_key=${apiConfig.clientKey}'`)
        var parkData = await response.json();
        if (!response.ok) {
            throw new Error(userData.message); 
          }
    }
    catch(error) {
        console.log(error);
        document.querySelector(".results-list").innerHTML += 
            `<div>
            <p>
            ${error}
            <br>Could not find parks for this area.
            </p>
            </div>`;
            return;
        }

    //console.log()
    listParks(parkData.data)
}




//
const listParks = (data) => {
    data.map(obj => {
        //img desc
        const name = obj.fullName;
        const desc = obj.description;
        const img = (obj.images.length != 0)? obj.images[0].url 
            : "https://sciences.ucf.edu/psychology/wp-content/uploads/sites/63/2019/09/No-Image-Available.png"
        const address = obj.addresses[0];
        const addressString = (obj.addresses.length != 0)?
            `${address.line1}<br>${address.city} ${address.stateCode} ${address.postalCode}`
            : "No specified address"
        const link = obj.url;
        const states = obj.states;
        appendToList(img, name, desc, addressString, link, states);
        //console.log(img, name, addressString, link, states)
    })
}

//
const appendToList = (parkImg, parkName, parkDesc, parkAddress, parkLink, states) => {
    document.querySelector(".results-list").innerHTML += 
    `        
    <li>
        <div class="park-container">
            <img class='park-image' alt="Park-image" src=${parkImg}>
            <div class="park-card">
                <h1 class="park-name">${parkName}</h1>
                <p class="park-desc">${parkDesc}</p>
                <p class="park-states">Located in: ${states}</p>
                <p class="park-address">${parkAddress}</p>
                <a class="park-link" href="${parkLink}">${parkLink}</a>
            </div>
        </div>
    </li>
    `; 
}

const main = () => {
    handleFormSubmit();
}
  
main();


/*         <li>
                        <div class="park-container">
                            <img class='park-image' alt="Park-image">
                            <div class="park-card">
                                <h1 class="park-name">Park Name</h1>
                                <p class="park-states">NJ NY</p>
                                <p class="park-address">Park Address</p>
                                <a class="park-link">Link to site</a>
                            </div>
                        </div>
                    </li>
                    */