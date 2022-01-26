
// its like passing the function to a middleware, where it is checked for resolved or not.
module.exports = (func)=> (req, res, next)=> {
    Promise.resolve(func(req, res, next)).catch(next);
}