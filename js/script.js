



//Global Variables
const apiUrl = `https://randomuser.me/api/?nat=us,gb&results=12&exc=registered,nat,gender,phone`;
const gallery = document.getElementById('gallery');
const searchContainer = document.querySelector('.search-container');
let data;
let cardsHTML = `<p class="no-results">There are no employees returned now.</p>`;
let index;
let cards;




//Dynamically insert Search HTML
const searchHTML = `<form action="#" method="get">
<input type="search" id="search-input" class="search-input" placeholder="Search...">
<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`;
searchContainer.insertAdjacentHTML('beforeend', searchHTML);



//Get Data from API and Render HTML for .gallery
getData(apiUrl,() => renderHTML(gallery, generateCardHTML, data, undefined, cardsHTML,));




//eventListenerrs

//Click Event  Handlers
document.addEventListener('click', (event) => {
    //Display modal when any element with .card clicked  
    if(event.target.matches('.card')) {
        modalView(event.target);
    }
    //Display Prev modal when any button with .card clicked  
    if(event.target.className.includes('button.modal-prev')) {
        showPrev();
    }
    //Display Next modal when any button with .card clicked  
    if(event.target.className.includes('button.modal-next')) {
        showNext();
    }
    //Close modal  when X button with class .modal-close-btn clicked  
    if(event.target.matches('.modal-close-btn')) {
        event.target.parentNode.parentNode.remove();
    }
    //search and show result when input btn with class .search-submit is  clicked
    if(event.target.matches('.search-submit')){
        showFoundSearch(event);
     }

});


//keyup Events
document.addEventListener('keyup', (event) => {
    //Display next modal when right arrowkey keyup  
    if(event.keyCode === 39 ) {
        showNext();
    }
     //Display prev modal when left arrowkey keyup  
    if(event.keyCode === 37 ) {
        showPrev();
    }
});



//input Events
document.addEventListener('input', function () {
    if(event.target.matches('.search-input')){
        const value = document.getElementById('search-input').value.toLowerCase();
        //Reset all cards if search value length is zero
        if(value.length === 0) {
            resetAllCards();
        }
    }
    
});







//gets data from apia and then returns a callback
function getData (apiUrl, callback) {
    const request = new XMLHttpRequest();
    request.open('GET', apiUrl);
    request.onreadystatechange = function () {
        if(request.readyState === 4 && request.status === 200)
        {   //parse and set request.reponse.results to data
            data = JSON.parse(request.response).results;
            return callback();
        }
        //checks for errorr and display p.no-results html(as in cardsHTML)
        else if (request.status !== 200) {
            gallery.insertAdjacentHTML('beforeend', cardsHTML);
        }
    }
    request.send();
}


//Generates HTML for employee card
function generateCardHTML (employee) {
    return `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${employee.picture.medium}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
         </div>
         `;
}

//generate HTML for employee modal
function generateModalHTML (employee) {
    return `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container vhidden">
                    <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">${employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${employee.cell}</p>
                    <p class="modal-text">${employee.location.street}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                    <p class="modal-text">Birthday: ${formatDate(employee.dob.date)}</p>
                </div>
                <div class="loading">
                    <div class="lds-hourglass"></div>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`
}



//render  html => takes target as element  to insert html, a callback function to generate html and [data Array of employee Objects, [employee object, [html to insert]]
function renderHTML (target, callback, data = null, employee = null, html = '')  {
    //set html empty
    html = '';
    //check for wrong arguments
    if(data === null && employee === null) throw new  Error('No data provided');
    if(target === undefined) throw new  Error('No target provided');
    if(callback === undefined) throw new  Error('No callback function provided');

    //if data(array of object is undefined)
    if(data === null) {
        html += callback(employee);
    }
    //if employee object is undefined
    if(employee === null) {
        data.forEach(employee => {
            html += callback(employee);
        });
    }
    //insert the  html
    return target.insertAdjacentHTML('beforeend', html);
}


//format dateString {1987-05-02T20:15:04Z => 1987-05-02}
function formatDate (dateString) {
    return dateString.slice(0, dateString.indexOf('T'));
}


//Displays Modal
function modalView (target) {
    const modalContainer = document.querySelector('.modal-container');
    cards = document.querySelectorAll('.card');
    //get index of target to retrieve it appropraite data(employee in  data)
    index = [...cards].indexOf(target);
    //remove any instance of modal
    if(modalContainer) modalContainer.remove();
    //render the html
    renderHTML(document.body, generateModalHTML, undefined, data[index], undefined);
    const modalImg = document.querySelector('.modal-img');
    //make modal content visible after image loads  and remove placeholder loader .loading
    modalImg.onload = function () {
        modalImg.parentNode.className = 'modal-info-container';
        document.querySelector('.loading').remove();

    }
}


//show next card info in Modal by  incrementing index
function showNext () {
    const modalContainer = document.querySelector('.modal-container');
    if(!modalContainer) return;
    if(index < cards.length) index++;
    if(index >= cards.length) index = 0;
    const target = cards[index]
    return modalView(target);
}


//show prev card info in Modal by  decrementing index
function showPrev () {
    const modalContainer = document.querySelector('.modal-container');
    if(!modalContainer) return;
    if(index <= 0) index = cards.length;
    if(index > 0) index--;
    const target = cards[index]
    return modalView(target);
}


//displays search foundr results
function showFoundSearch (event) {
    event.preventDefault();
    const value = document.getElementById('search-input').value.toLowerCase();
    const names = document.querySelectorAll('#name');
    //iterate through names and check if is includes search input value and then hide card if does not include
    [...names].forEach((name) => {
        const nameText  = name.textContent.toLowerCase();
        if(!nameText.includes(value)) {
            name.parentNode.parentNode.className = 'card hidden';
        }
    });
}


//resets all cards (makes them visible like default);
function resetAllCards () {
    cards = document.querySelectorAll('.card');
    [...cards].forEach(card => card.className = 'card');
}