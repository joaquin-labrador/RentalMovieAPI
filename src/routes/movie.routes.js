const movieController = require('../controllers/movie.controller');
const express = require('express');
const router = express.Router();


router.get('/',movieController.getMovies);
router.get('/:id',movieController.getMovieById);
router.get('/title/:title',movieController.getMovieByName);


module.exports = router;