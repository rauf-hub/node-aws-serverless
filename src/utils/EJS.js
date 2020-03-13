'use strict';
const ejs = require('ejs');
const path = require('path');

/**
  * Generate email templates
  * @param {object} model 
  * @param {object} rules 
  * @param {array} errors 
  */
exports.generateEmailEjsTemplate = (req) => {
  let data = req.data;
  let ejs_file_path = path.join(__dirname, `../ejs/email/${req.template}`);
  return new Promise((resolve, reject) => {
    ejs.renderFile(ejs_file_path,  {data:data}, function (err, result) {
      // render on success
      if (err) {
        reject({status : false , err: err});
      } else {
        resolve({status : true , message: result});
      }
    });
  });
};