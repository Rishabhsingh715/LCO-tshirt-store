const express = require('express');
const router = express.Router();

const { 
        signup,
        login,
        logout,
        forgotPassword,
        passwordReset,
        getLoggedInUserDetails,
        changePassword,
        updateUser,
        adminAllUsers,
        managerAllUsers

        } = require('../controllers/userController');
        
const { isLoggedIn, customRole} = require('../middlewares/user');

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn ,getLoggedInUserDetails);
router.route("/password/update").post(isLoggedIn, changePassword );
router.route("/user/update").post(isLoggedIn, updateUser );
router.route("/admin/users").get(isLoggedIn,customRole('admin'),adminAllUsers );
router.route("/manager/users").get(isLoggedIn,customRole('manager'),managerAllUsers );







module.exports = router;