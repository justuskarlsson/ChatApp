var mysql      = require('promise-mysql');

module.exports = mysql.createPool({
  connectionLimit: 20,
  host     : '178.73.210.97',
  user     : 'silicon_user',
  password : 'valla',
  database : 'siliconvalla'
});