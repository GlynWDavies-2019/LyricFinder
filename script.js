const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

async function searchSongs(term) {
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
                        &nbsp;-&nbsp;${song.title}
                    </span>
                    <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">
                        Get Lyrics
                    </button>
                </li>`).join('')}
        </ul>
    `;
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
}

form.addEventListener('submit', event => {
    event.preventDefault();
    const searchTerm = search.value.trim();
    if(!searchTerm) {
        alert('Please type in a search term!');
    } else {
        searchSongs(searchTerm);
    }
});

result.addEventListener('click', event => {
    const clickedElement = event.target;
    if(clickedElement.tagName === 'BUTTON') {
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-songtitle');
        getLyrics(artist, songTitle);
    }
});