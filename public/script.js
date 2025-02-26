// Attach event listener to the Search button
document.getElementById('searchBtn').addEventListener('click', function () {
  let query = document.getElementById('searchInput').value;
  if (query.trim() === '') {
    showPopup('Please enter a movie name');
    return;
  }

  fetch(`/api/search?query=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      console.log(data); // Debugging: view API response
      if (data.Response === "False") {
        displayNoResults(data.Error || "No results found.");
      } else if (data.Search && data.Search.length > 0) {
        displayResults(data.Search);
      } else {
        displayNoResults("No results found");
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      showPopup('Error fetching data');
    });
});

function displayResults(movies) {
  let resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous results

  movies.forEach(movie => {
    let movieElement = document.createElement('div');
    movieElement.classList.add('movie-item');
    movieElement.innerHTML = `
      <h3>${movie.Title} (${movie.Year})</h3>
      ${movie.Poster && movie.Poster !== "N/A" ? `<img src="${movie.Poster}" alt="${movie.Title} Poster" style="max-width:200px;">` : ''}
      <p>Type: ${movie.Type}</p>
      <button onclick="addToList('${movie.imdbID}', '${escapeQuotes(movie.Title)}')">Add to List</button>
    `;
    resultsDiv.appendChild(movieElement);
  });
}

function displayNoResults(message) {
  let resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<p>${message}</p>`;
}

// Use the custom popup instead of alert()
function showPopup(message) {
  const popup = document.getElementById('popup');
  popup.textContent = message;
  popup.classList.add('show');

  // Hide the popup after 3 seconds
  setTimeout(() => {
    popup.classList.remove('show');
  }, 3000);
}

// --- Local Storage Methods ---

// Add a movie to the list using Local Storage and clear the search results
function addToList(imdbID, movieTitle) {
  // Retrieve the current movie list from localStorage, or initialize an empty array
  let movieList = JSON.parse(localStorage.getItem('movieList')) || [];
  
  // Check for duplicates
  if (movieList.some(movie => movie.imdbID === imdbID)) {
    showPopup(`${movieTitle} is already in the list!`);
    return;
  }
  
  // Add the new movie and update local storage
  movieList.push({ imdbID: imdbID, title: movieTitle });
  localStorage.setItem('movieList', JSON.stringify(movieList));
  
  showPopup(`${movieTitle} added to list!`);
  loadList();
  
  // Clear the search results so only the list is displayed
  document.getElementById('results').innerHTML = '';
}

// Load the movie list from Local Storage and display it with a Remove button
function loadList() {
  let movieList = JSON.parse(localStorage.getItem('movieList')) || [];
  let listDiv = document.getElementById('myList');
  listDiv.innerHTML = ''; // Clear the current list
  
  movieList.forEach(movie => {
    // Create a container for each movie
    const movieContainer = document.createElement('p');
    movieContainer.innerHTML = `${movie.title} (${movie.imdbID}) `;
    
    // Create the Remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '-';
    removeBtn.style.fontSize = '1.2 rem';  // Smaller font size
    removeBtn.style.padding = '0px 5px';  // Less padding
    removeBtn.style.marginLeft = '10px';
    removeBtn.addEventListener('click', () => removeFromList(movie.imdbID));
    
    movieContainer.appendChild(removeBtn);
    listDiv.appendChild(movieContainer);
  });
}

// Remove a movie from Local Storage and update the list
function removeFromList(imdbID) {
  let movieList = JSON.parse(localStorage.getItem('movieList')) || [];
  // Filter out the movie with the matching imdbID
  movieList = movieList.filter(movie => movie.imdbID !== imdbID);
  localStorage.setItem('movieList', JSON.stringify(movieList));
  showPopup('Movie removed!');
  loadList();
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'");
}

window.onload = loadList;
