<img src="https://github.com/user-attachments/assets/48a92305-b6aa-4744-a28e-c14b80b096f2" height="320" width="650"><br>
**about:** a movie search application that uses API to fetch movie details to help users to search for movies, add selected movies to a personal list **(the movie list is saved locally, so clearing the browser cache will result in losing the list)** & remove movies from the list<br>
**requirements:** **Node.js** (v14 or higher recommended), **npm** (Node package manager), a valid **OMDb API key** (get from [OMDb API](https://www.omdbapi.com/apikey.aspx))<br> 
**setup:** 
```bash
   git clone https://github.com/saiyameh/movie.git
   cd movie
```
**structure:**
```bash
movie/
├── public/
│   ├── index.html         # main HTML file
│   ├── style.css          # stylesheet for the app
│   └── script.js          # JS file for search, add, remove functionality & popups
├── server/
    ├── index.js           # backend for OMDb search endpoint
    ├── package.json       # dependencies: express, cors, axios, dotenv
    └── .env               # file to store environment variables (OMDB_API_KEY)
```
**install server dependencies:** open terminal in server directory
```bash
cd server
npm install
```
**configure OMDb API Key:** edit .env file in the server directory to allow the backend to access the OMDb API
```ini
OMDB_API_KEY=your_actual_api_key_here
```
**run the server:** from the server directory, start your Node.js server
```bash
node index.js
```
**usage:** http://localhost:3000
