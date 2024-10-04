/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
// Spotify
// Firebase functions setup
const functions = require('firebase-functions');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors')({ origin: true });

require('dotenv').config(); // Load environment variables


const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Initialize Spotify API
// const spotifyApi = new SpotifyWebApi({
//   clientId: 'e766892102b04c559335509e3fa258ef', // Replace with your clientId
//   clientSecret: '7d0265c05e0c4ba590b05260f3d1cea8', // Replace with your clientSecret
//   redirectUri: 'https://sirihelenewahl.no/callback' // Ensure this matches your Spotify Developer Dashboard setting
// });
const spotifyApi = new SpotifyWebApi({
  clientId: clientId,// Replace with your clientId
  clientSecret: clientSecret, // Replace with your clientSecret
  redirectUri: 'https://sirihelenewahl.no/callback' // Ensure this matches your Spotify Developer Dashboard setting
});

exports.getSpotifyToken = functions.https.onRequest(async (req, res) => {
  const authOptions = {
      method: 'POST',
      headers: {
          'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: req.query.code,
          redirect_uri: req.query.redirect_uri
      })
  };

  try {
      const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
      const data = await response.json();
      res.json(data);
  } catch (error) {
      res.status(500).send(error.toString());
  }
});

exports.getClientId = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
      res.json({ clientId: process.env.CLIENT_ID });
  });
});

// Login function - Redirect user to Spotify Authorization page
exports.login = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-read-recently-played'
    ];
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, null, true);
    res.redirect(authorizeURL); // Redirect to Spotify's authorization URL
  });
});

// Callback function - Exchange authorization code for access token
exports.callback = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    console.log('Request received:', req.body);

    // Extract code from the body (since we're handling a POST request from the frontend)
    const code = req.body.code;

    if (code) {
      try {
        // Exchange code for access token
        const data = await spotifyApi.authorizationCodeGrant(code);
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];
        const expiresIn = data.body['expires_in'];

        console.log('Access token received:', accessToken);

        // Return the tokens back to the client
        res.json({ access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn });
      } catch (error) {
        console.error('Error getting Tokens:', error);
        res.status(500).send('Error getting Tokens');
      }
    } else {
      console.error('No code found');
      res.status(400).send('No code found');
    }
  });
});


// Trenger funksjon for: Starte et vors, joine et vors, legge til sanger, hosten får spillelisten


//exports.createPlaylist =

