
// Importing necessary modules
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import qrcode from "qrcode";

// Initializing the Express app
const app = express();
const port = 3000;

// Setting up static files and body parser middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Function to fetch advice from the API
const fetchAdvice = async () => {
  const response = await axios.get("https://api.adviceslip.com/advice");
  return response.data;
};

const fetchJoke = async () => {
  const response = await axios.get("https://v2.jokeapi.dev/joke/Dark?blacklistFlags=nsfw,religious,political,racist,sexist,explicit");
  return response.data;
};

// Function to fetch a random gif using a random offset
const fetchRandomGif = async () => {
  const randomOffset = Math.floor(Math.random() * 100);
  const response = await axios.get(
    `http://api.giphy.com/v1/gifs/search?api_key=w19zgODq9P7shbmMs92yXs2X2X9nfHNX&q=
    dualvoidanima&limit=1
    &offset=${randomOffset}`
  );
  return response.data;
};


// Function to fetch a random secret
const fetchRandomSecret = async () => {
  const response = await axios.get("https://secrets-api.appbrewery.com/random");
  return response.data.secret;
};

// Function to fetch a random activity from the bored API
const fetchRandomActivity = async () => {
  const response = await axios.get("https://bored-api.appbrewery.com/random");
  return response.data;
};





// Function to generate a QR code from a given string
// Function to generate a QR code from a given string with custom colors
const generateQRCode = async (data) => {
  const options = {
    color: {
      dark: "#000000",  // Set the foreground color (black in this example)
      light: "#EE82EE"  // Set the background color (white in this example)
    }
  };
  return await qrcode.toDataURL(data, options);
};


// GET route
app.get("/", async (req, res) => {
  try {
    const adviceData = await fetchAdvice();
    const giphyData = await fetchRandomGif();
    const secret = await fetchRandomSecret();
    const qrCodeDataUrl = await generateQRCode(secret); // Use your preferred colors
    const data = await fetchRandomActivity();
    const joke = await fetchJoke()
    console.log(joke.joke)
    console.log(joke.setup)
    console.log(joke.joke)

    
    res.render("index.ejs", { adviceData, giphyData, secret: qrCodeDataUrl, data ,joke});
    

  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", { error: error.message });
  }
});

// POST route
app.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const type = req.body.type;
    const participants = req.body.participants;
    const response = await axios.get(
      `https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`
    );
    const result = response.data;

    const adviceData = await fetchAdvice();
    const giphyData = await fetchRandomGif();
    const secret = await fetchRandomSecret();
    const qrCodeDataUrl = await generateQRCode(secret);
    const joke = await fetchJoke()

    res.render("index.ejs", { adviceData, giphyData, secret: qrCodeDataUrl, data: result[Math.floor(Math.random() * result.length)],joke });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    const adviceData = await fetchAdvice();
    const giphyData = await fetchRandomGif();
    const secret = await fetchRandomSecret();
    const qrCodeDataUrl = await generateQRCode(secret);

    res.render("index.ejs", { adviceData, giphyData, secret: qrCodeDataUrl, error: "No activities that match your criteria." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
