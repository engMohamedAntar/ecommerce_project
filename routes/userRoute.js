//userRoute.js
const express = require("express");
const {
  uploadImage,
  resizeImage,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  changePassword,
  getLoggedUser,
  changeMyPassword,
  updateLoggedUserData,
  deactivateMe
} = require("../services/userService");
const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
  changePasswordValidator,
  changeMyPasswordValidator,
} = require("../utils/validators/userValidator");
const { protect, allowedTo } = require("../services/authService");

const router = express.Router();

router.use(protect);
router.get("/getme", getLoggedUser, getUserValidator, getUser);
router.put("/changemypassword", changeMyPasswordValidator, changeMyPassword);
router.put("/updatemydata", uploadImage, resizeImage, updateLoggedUserData, updateUserValidator, updateUser);
router.delete("/deactivateme", deactivateMe );

router.use(allowedTo("admin"));
router.post("/", uploadImage, resizeImage, createUserValidator, createUser);
router.get("/", getUsers);
router.get("/:id", getUserValidator, getUser);
router.put("/:id", uploadImage, resizeImage, updateUserValidator, updateUser);
router.delete("/:id", deleteUserValidator, deleteUser);
router.put("/changepassword/:id", changePasswordValidator, changePassword);

module.exports = router;
