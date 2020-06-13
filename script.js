const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');
const errorMessage = document.querySelector('.error-message');

const apiURL = 'https://api.lyrics.ovh';

async function searchSongs(term) {
    // ---------------------------------------
    // Using fetch
    // ---------------------------------------
    // fetch(`${apiURL}/suggest/${term}`)
    //     .then(response => response.json())
    //     .then(data => showData(data));
    // ---------------------------------------
    // Using async/await
    // ---------------------------------------
    const response = await fetch(`${apiURL}/suggest/${term}`);
    const data = await response.json();
    showData(data);
}

function showData(data) {
    result.innerHTML = `
        <ul class="songs">
            ${data.data.map(song => `
                <li>
                    <span>
                        <strong>${song.artist.name}</strong>
                        &nbsp;&#45;&nbsp;${song.title}
                    </span>
                    <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">
                        Get Lyrics
                    </button>
                </li>`).join('')}
        </ul>
    `;
    if(data.prev || data.next) {
        more.innerHTML = `
            ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Previous</button>` : ''}
            ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;
    } else {
        more.innerHTML = '';
    }
}

async function getMoreSongs(url) {
    // ------------------------------------------------------------------------
    // Pass the request through a proxy to bypass CORS
    // ------------------------------------------------------------------------
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await response.json();
    showData(data);
}

async function getLyrics(artist, songTitle) {
    const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await response.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,'<br>');
    result.innerHTML = `
        <h2>
            <strong>${artist}</strong>&nbsp;&#45;&nbsp${songTitle}
        </h2>
        <span>${lyrics}</span>
    `;
    more.innerHTML = '';
}

form.addEventListener('submit', event => {
    event.preventDefault();
    const searchTerm = search.value.trim();
    if(!searchTerm) {
        // alert('Please type in a search term!');
        errorMessage.classList.remove('invisible');
        errorMessage.classList.add('visible');
        setTimeout(() => {
            errorMessage.classList.remove('visible');
            errorMessage.classList.add('invisible');
        },1000);
    } else {
        searchSongs(searchTerm);
    }
});

result.addEventListener('click', event => {
    const clickedElement = event.target;
    if(clickedElement.tagName === 'BUTTON') {
        // -------------------------------------------------------------
        // Use the data attributes
        // -------------------------------------------------------------
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-songtitle');
        getLyrics(artist, songTitle);
    }
});