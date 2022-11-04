const express = require("express");
const router = express.Router();
const { requireToken } = require("../middleware/requiretoken");
const rentController = require("../controllers/rent.controller");

router.post("/", requireToken, rentController.addRent);
router.get("/", requireToken, rentController.gentRents);
router.get("/user/", requireToken, rentController.getRentByUserId);
router.get("/:id", requireToken, rentController.getRentById);
router.put("/:id", requireToken, rentController.returnRent);

module.exports = router;
