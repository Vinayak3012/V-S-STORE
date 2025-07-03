module.exports = (fn) => {
  return function (req, res, next) {
    //to resolve sync error
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
