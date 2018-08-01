/**
 * 404 错误
 */
exports.notFound = function (req, res, next) {
    res.render('page-404', null);
};