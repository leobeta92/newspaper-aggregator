const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NYT API
const apiKey = 's2yAtSphTJxxvRdvQwmlzF8SHShsGET7';
const apiUrl = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key
=${apiKey}`;

let resultsArray = [];
let favorites = {};

// Limit number of articles
const count = 4;

function showContent() {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
    // if (page === 'results') {
    //     resultsNav.classList.remove('hidden');
    //     favoritesNav.classList.add('hidden');
    // } else {
    //     resultsNav.classList.add('hidden');
    //     favoritesNav.classList.remove('hidden');
    // }
    loader.classList.add('hidden');
}

// Get APOD results
function createDOMNodes(page) {
    // const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    const currentArray = resultsArray.results;
    const displayArray = currentArray.splice(0,count);
    // console.log("Current Array:",displayArray.length);
    displayArray.forEach((result) => {
        // Card Container
        console.log("Result:",displayArray.indexOf(result));
        const card = document.createElement('div');
        card.classList.add('card');
        // Link 
        const link = document.createElement('a');
        link.href = result.url;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.multimedia[0].url;
        image.alt = 'NYT Top Article';
        image.title = 'View Article';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Save Text
        // const saveText = document.createElement('p');
        // saveText.classList.add('clickable');
        // if (page === 'results') {
        //     saveText.textContent = 'Add to Favorites';
        //     saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);      
        // }
        // else {
        //     saveText.textContent = 'Remove Favorite';
        //     saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);  
    
        // }
        // Card Text
        const cardAbstract = document.createElement('p');
        cardAbstract.textContent = result.abstract;
        cardAbstract.classList.add('card-text-hidden');

        // See More & Arrow
        const seeMoreContainer = document.createElement('div');
        seeMoreContainer.classList.add('see-more-container');
        const linkSeeMore = document.createElement('a');
        linkSeeMore.classList.add('link');
        linkSeeMore.setAttribute('href', result.url); 
        linkSeeMore.setAttribute('target',"_blank"); 
       
        const seeMore = document.createElement('p');
        seeMore.classList.add('see-more');
        seeMore.textContent = 'See More >';
        // seeMore.setAttribute('onclick', `console.log('${result.abstract}')`); 
        seeMore.setAttribute('href', result.url);  
        // seeMore.setAttribute('onclick', () => {
        //     console.log('Adding/Removing:',cardAbstract);
        //     // if (cardAbstract.classList.contains('card-text-hidden')) {
        //     //     cardAbstract.classList.remove('card-text-hidden') 
        //     // }
        // });  

        linkSeeMore.append(seeMore);
        seeMoreContainer.append(linkSeeMore);
 
        // seeMore.setAttribute('onclick', cardAbstract.classList.toggle('card-text-hidden'));  

        // seeMore.setAttribute('onclick',`console.log(${e})`);
        
        // const arrow = document.createElement('p');
        // arrow.textContent = 'v';
        // arrow.classList.add('see-more');

        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // // Date
        // const date = document.createElement('strong');
        // date.textContent = result.created_date;
        // // Copyright
        // const copyrightResult = result.byline;
        // const copyright = document.createElement('span');
        // copyright.textContent = ` ${copyrightResult}`;

        // Append
        // footer.append(date,copyright);
        // cardBody.append(cardTitle, saveText, cardAbstract, linkSeeMore);
        cardBody.append(cardTitle, cardAbstract, linkSeeMore);
        link.appendChild(image);
        card.append(link,cardBody);
        imagesContainer.appendChild(card);
    });
}

// Update DOM
function updateDOM(page) {
    // Get favorites from local storage
    // if (localStorage.getItem('nasaFavorites')) {
    //     favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
    // }
    // console.log("Updating DOM");
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

// Get 10 Images from NASA API
async function getNYTArticles() {
    // Show loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        console.log("Initial Array:",resultsArray);
        updateDOM();
    }
    catch (error) {
        // Catch error here.

    }
}

// See More for Abstract
function seeMore(event) {
    

}


// add result to favorites
function saveFavorite(itemUrl) {
    // Loop through Results array to select favorite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            // show save confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            // Set favorites in localStorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

// Remove item from favorites
function removeFavorite(itemUrl) {
    console.log("removing from favorites");
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        // Set favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites'); 
    }

}

// On Load
getNYTArticles();