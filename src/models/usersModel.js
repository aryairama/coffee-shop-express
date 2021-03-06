const connection = require('../configs/db');
const { promiseResolveReject } = require('../helpers/helpers');

const checkExistUser = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM users where ${field} = ?`, fieldValue, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const insertUser = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO users set ?', data, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const updateUser = (data, id) => new Promise((resolve, reject) => {
  connection.query('UPDATE users set ? where user_id = ?', [data, id], (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const readUser = (search, order, fieldOrder, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT * FROM users WHERE (lastname LIKE "%${search}%" OR firstname LIKE "%${search}%" OR 
      email LIKE "%${search}%") ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT * FROM users WHERE (lastname LIKE "%${search}%" OR firstname LIKE "%${search}%" OR 
      email LIKE "%${search}%") ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

module.exports = {
  checkExistUser,
  insertUser,
  updateUser,
  readUser,
};
