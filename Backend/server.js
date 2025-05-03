const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const csvRoute = require("./routes/csvRoute");
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errorHandler");


dotenv.config();
const app = express();
const PORT = 5000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(logger);
app.use(morgan("dev"));

// Error Handling
app.use(notFound);
app.use(errorHandler);



// Handle CSV route
app.use("/api", csvRoute);

// Handle custom redirect route for Google Drive file
app.get('/d/:fileId', async (req, res) => {
    const fileId = req.params.fileId;
    
    // Generate the original Google Drive webViewLink
    const webViewLink = `https://drive.google.com/file/d/${fileId}/view`;
    
    // Perform the redirect
    res.redirect(webViewLink);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
