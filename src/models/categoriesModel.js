import connection from '../configs/db.js';
import { promiseResolveReject } from '../helpers/helpers.js';

const addcategory = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO categories SET ?', data, (err, result) => {
    promiseResolveReject(resolve, reject, err, result);
  });
});

const getCategories = (search, order, fieldOrder, start = '', limit = '') => new Promise((resolve, reject) => {
  if (start === '' && limit === '') {
    connection.query(
      `SELECT * FROM categories WHERE category_name LIKE '%${search}%' ORDER BY ${fieldOrder} ${order}`,
      (err, result) => {
        promiseResolveReject(resolve, reject, err, result);
      },
    );
  } else {
    connection.query(
      `SELECT * FROM categories WHERE category_name LIKE '%${search}%' ORDER BY ${fieldOrder} ${order} LIMIT ${start}, ${limit}`,
      (err, result) => {
        promiseResolveReject(resolve, reject, err, result);
      },
    );
  }
});

const showCategory = (field, fieldValue) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM categories WHERE ${field} = '${fieldValue}'`, (err, result) => {
    promiseResolveReject(resolve, reject, err, result);
  });
});

const updateCategory = (data, categoryId) => new Promise((resolve, reject) => {
  connection.query(`UPDATE categories SET ? WHERE category_id = ${categoryId}`, data, (err, result) => {
    promiseResolveReject(resolve, reject, err, result);
  });
});

const showRelationCategory = (categoryId) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM products WHERE category_id = ${categoryId}`, (err, result) => {
    promiseResolveReject(resolve, reject, err, result);
  });
});

const deleteCategory = (categoryId) => new Promise((resolve, reject) => {
  connection.query(`DELETE FROM categories WHERE category_id = ${categoryId}`, (err, result) => {
    promiseResolveReject(resolve, reject, err, result);
  });
});

export default {
  addcategory,
  showCategory,
  getCategories,
  updateCategory,
  showRelationCategory,
  deleteCategory,
};