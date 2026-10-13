require('dotenv').config();
const express = require('express');
const pino = require('pino');
const expressPino = require('express-pino-logger');

// Task 1: Import the Natural library
const natural = require("natural");

const logger = pino();
const expressLogger = expressPino({ logger });

// Task 2: Initialize the Express server
const app = express();
const port = 3000;

app.use(express.json());
app.use(expressLogger);

// Task 3: Create a POST /sentiment endpoint
app.post('/sentiment', async (req, res) => {

    // Task 4: Extract the sentence parameter from the query string
    const { sentence } = req.query;

    if (!sentence) {
        logger.error('No sentence provided');
        return res.status(400).json({ error: 'No sentence provided' });
    }

    // Initialize the sentiment analyzer with Natural's PorterStemmer and "English" language
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer("English", stemmer, "afinn");

    try {
        // Perform sentiment analysis
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        // Task 5: Default is neutral; set negative or positive based on the score
        let sentiment = "neutral";

        if (analysisResult < 0) {
            sentiment = "negative";
        } else if (analysisResult > 0.33) {
            sentiment = "positive";
        }

        logger.info(`Sentiment analysis result: ${analysisResult}`);

        // Task 6: Success return state
        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });

    } catch (error) {
        logger.error(`Error performing sentiment analysis: ${error}`);

        // Task 7: Error return state
        res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});