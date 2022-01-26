const BigPromise = require('../middlewares/bigPromise');


exports.home = BigPromise((req, res) =>{

    res.status(200).json({
        success: "true",
        message: "Hello From API"
    });
});
exports.homeDummy = BigPromise((req, res) =>{

    res.status(200).json({
        success: "true",
        message: "Hello From another dummy page"
    });
});