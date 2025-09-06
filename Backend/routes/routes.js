const express = require("express");
const router = express.Router();
const controller = require("../controllers/signUp");
const upload = require("../middlewares/upload");
const { authenticateToken } = require("../middlewares/auth");

router.get("/", authenticateToken, controller.getUserData);
router.get("/:id", authenticateToken, controller.getUserById);
router.post("/", authenticateToken, upload.single("photo_name"), controller.postUserData);
router.put("/:id", authenticateToken, upload.single("photo_name"), controller.updateUserData);
router.delete("/", authenticateToken, controller.deleteUserData);

module.exports = router;
