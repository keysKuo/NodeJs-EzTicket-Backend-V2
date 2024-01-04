const slugify = require('slugify');
const { uuid } = require('uuidv4');


module.exports.createSlug = (str) => {
    return slugify(str + '', {
        replacement: '-',
        remove: false,
        lower: true,
        strict: false,
        locale: 'vi',
        trim: true,
    })
}

module.exports.createCode = (length) => {
    return uuid().substring(0, length);
}

module.exports.catchAsync = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch((error) => res.status(404).render('error', { layout: false, error }));
}