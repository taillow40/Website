const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

router.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'pages/projects.html'));
});

router.get('/about_me', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'pages/about.html'));
});

router.get('/clickyclick', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'pages/games/clickyclick.html'));
});

router.get('/meal_maker', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'pages/meal-maker.html'));
});

router.get('/stocks', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'StockGraphs/graphs.html'));
});

router.get('/evan', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'Evan/evan.html'));
});
 
module.exports = router;