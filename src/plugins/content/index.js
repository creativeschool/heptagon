module.exports = process.env.IS_ELECTRON ? require('./electron') : require('./web')
