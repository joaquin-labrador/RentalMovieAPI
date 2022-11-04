const express = require("express");
const router = express.Router();
const favouriteFilmController = require("../controllers/fouvoritefilm.controller");
const { requireToken } = require("../middleware/requiretoken");

router.get("/", requireToken, favouriteFilmController.getAllFavouriteFilms);
router.get(
  "/user",
  requireToken,
  favouriteFilmController.getFavouriteFilmByUserId
);
router.get("/:id", requireToken, favouriteFilmController.getFavouriteFilmById);
router.post("/", requireToken, favouriteFilmController.createFavouriteFilm);

module.exports = router;
