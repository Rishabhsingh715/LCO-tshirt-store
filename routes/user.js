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
        managerAllUsers,
        adminGetSingleUser,
        adminUpdateOneUserDetails,
        adminDeleteOneUser

        } = require('../controllers/userController');
        
const { isLoggedIn, customRole} = require('../middlewares/user');


//user routes
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userdashboard").get(isLoggedIn ,getLoggedInUserDetails);
router.route("/password/update").post(isLoggedIn, changePassword );

//user only routes
router.route("/user/update").post(isLoggedIn, updateUser );


//admin only routes
router.route("/admin/users").get(isLoggedIn,customRole('admin'),adminAllUsers );
router.route("/admin/user/:id")
.get(isLoggedIn,customRole('admin'),adminGetSingleUser)
.put(isLoggedIn,customRole('admin'),adminUpdateOneUserDetails)
.delete(isLoggedIn,customRole('admin'),adminDeleteOneUser);


//manager only routes
router.route("/manager/users").get(isLoggedIn,customRole('manager'),managerAllUsers );









module.exports = router;