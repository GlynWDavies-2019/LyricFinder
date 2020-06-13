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
            ${data.data.map(song => `<li><span><strong>${song.artist.name}</strong>&nbsp;-&nbsp;${song.title}</span></li>`).join('')}
        </ul>
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