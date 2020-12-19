const express=require("express");
const authController=require("../controllers/auth");
const { route } = require("./pages");
const router=express.Router();

router.post("/register",authController.register);
router.post("/login",authController.login);
router.post("/validate",authController.validate);
router.post("/forgotpassword",authController.forgotpassword);
router.post("/resetpassword",authController.resetpassword);
router.post("/validationforresetpassword",authController.validationforresetpassword);
module.exports=router;
