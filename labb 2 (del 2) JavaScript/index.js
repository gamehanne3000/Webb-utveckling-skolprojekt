let objRep = document.querySelector('#objectRepresantation')
let showBtn = document.querySelector('#showBtn')
let addBtn = document.querySelector('#addBtn')
let changeBtn = document.querySelector('#changeBtn')
let deleteBtn = document.querySelector('#deleteBtn')

/* 
Visa det hela "objektet" med en knapp men aktiveras även direkt när sidan uppdateras
*/
function fetchCities() {
    
    fetch('https://avancera.app/cities/', {   
    method: 'GET', 
    headers: {
        'Content-Type': 'application/JSON'
    },
    }). then(response => response.json()). then(result => { 

        let result_string = JSON.stringify(result, null," ")
        objRep.textContent = result_string
    })
}

showBtn.addEventListener('click', () => {
    fetchCities()
})


/* 
    Add button 
*/
addBtn.addEventListener('click', () => {

    let addName = document.querySelector('#txtName').value
    let addPopulation = document.querySelector('#txtPopulation').value

    if (addName.length == 0 || addPopulation.length == 0) {
        alert('Both name and population must be entered')
    }else {
        fetch('https://avancera.app/cities/', {
        body: JSON.stringify({ name: addName, population: addPopulation }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
        }). then(response => response.json()). then(result => { 

            let result_string = JSON.stringify(result, null," ")
            objRep.textContent = result_string

            console.log('input: ' + addName)
            console.log('input: ' + addPopulation)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
})


/* 
    Change button    ----------------
*/
changeBtn.addEventListener('click', () => {

    let changeName = document.querySelector('#txtName').value
    let changePopulation = document.querySelector('#txtPopulation').value
    let changeIdentification = document.querySelector('#txtIdentification').value
    let link = 'https://avancera.app/cities/'+ changeIdentification

    if (changeName.length == 0 || changePopulation.length == 0 || changeIdentification.length == 0){
        alert('all fields must be entered with information')
    }else{
        // Notera att url ska innehålla objektets id
        fetch(link, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'},
            body: JSON.stringify({ name: changeName, population: changePopulation, id: changeIdentification })

        }). then(response => response.json()). then(result => { 

            let result_string = JSON.stringify(result, null," ")
            objRep.textContent = result_string

            console.log('input: ' + changeName)
            console.log('input: ' + changePopulation)
            console.log('input: ' + changeIdentification)
            
            }).catch((error) => {
            console.error('Error:', error);
        })
    }
})


/* 
    Delete button
*/
deleteBtn.addEventListener('click', () => {

    let deleteIdentification = document.querySelector('#txtIdentification').value
    let link = 'https://avancera.app/cities/'+ deleteIdentification
    
    if (deleteIdentification.length == 0) {
       alert('you forgot to type in the id')
    } else {
        fetch(link, {
            method: 'DELETE'})
            .then((data) => {
                console.log('Success:', data);
                
            })
            .catch((error) => {
            console.error('Error:', error);
        });
    }
})

// användaren kan nu se sitt sista borttagna element
/*
---------------------------------------------------------------
Generate a Pokemon 
---------------------------------------------------------------
*/

/* 
    GeneratePokemon button
*/
let genPok = document.querySelector('#generateAnPokemon')
genPok.addEventListener('click', () => {
    fetchPokemon()
})

/* 
    Fetch the pokmenon function
*/
const fetchPokemon = () => {

    // Slumpgenerar genom de första 151 pokemon i konto regionen
    let kantoRegionen = 151
    pokIndex = Math.floor(Math.random() * kantoRegionen)
    var urlForListOfPokemon = ('https://pokeapi.co/api/v2/pokemon/' + pokIndex)
    
    // hämta relevant data
    fetch(urlForListOfPokemon, {   
    method: 'GET', 
    headers: {
        'Content-Type': 'application/JSON'
    },
    })
    . then(response => response.json())
    . then(result => { 
        
        // referar till vilka element som ska hämtas
        const pokemonAttr = {
            image_default: result.sprites['front_default'],
            image_shiny: result.sprites['front_shiny'], 
            name: result.name,
            id: result.id,
            weight: result.weight,
            base_experience: result.base_experience,
            // iterera genom all 'typer' som finns i array 'types' och hämta dessa värden samtidigt som jag gör det till en sträng, eftersom att typen 'type' ska vara en sträng och inte en array när jag skriver ut informationen senare
            type: result.types.map((type) => type.type.name).join(', ')
        } 
        displayPokemon(pokemonAttr)

        localStorage.setItem('pokNameSaved', result.name)
        showPokText.textContent = 'next time you refresh the browser you will se last registerd pokemon :)'
    })
}

    // Min impletering av en användarvänlig webstorage hantering
    let showPokText = document.querySelector('#showLastPokemon')
    if(!localStorage.getItem('pokNameSaved')) {
        showPokText.textContent = "It seems like you haven't generated a pokemon yet"
        } else {
            let lastSeenPokSaved = localStorage.getItem('pokNameSaved')
            showPokText.innerHTML = '<strong>last seen pokemon since last time you where on this page was: </strong>' + lastSeenPokSaved
    }

/* 
    Display a pokemon function -> OBS har valt att inte skapa HTML i javascript utan bara refererat till elementen för att att slippa återskapa ett nytt objekt av diverse pokemon under varandra. Utan min avsikt är att bara uppdatera informationen på hemsidan. 
*/
let showPokemon = document.getElementById('wrapperForPokemonInfo')

const displayPokemon = (pokemonAttr) => {

    // Bild på icke shiny och shiny pokemon
    let pic_wrapper = document.querySelector('#pic-wrapper') // referens
    let url = "<img src=" + pokemonAttr.image_default +  " alt=picture on pokemon front not shiny>" + "<img src=" + pokemonAttr.image_shiny +  " alt=picture on pokemon front not shiny>"
    pic_wrapper.innerHTML = url

    // name
    let name = document.querySelector('#name')
    name.innerHTML = '<strong>Name: </strong>' + pokemonAttr.name
    
    // pokemon id i pokeindex
    let pokId = document.querySelector('#pokId')
    pokId.innerHTML = '<strong>Pokemom-Id: </strong>' + pokemonAttr.id
    
    // base experience
    let base_experience = document.querySelector('#base-experience')
    base_experience.innerHTML = '<strong>Base-experience: </strong>' + pokemonAttr.base_experience
    
    // Vilken/vilka typer har pokemonen
    let type = document.querySelector('#type')
    type.innerHTML = '<strong>Type: </strong>' + pokemonAttr.type
    
    // Hur mycker väger den
    let weight = document.querySelector('#weight')
    weight.innerHTML = '<strong>Weight: </strong>' + pokemonAttr.weight
    
}




