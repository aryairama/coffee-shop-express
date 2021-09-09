import { response, responsePagination } from '../helpers/helpers.js';
import historyModel from '../models/historyModel.js';

const getHistory = async (req, res, next) => {
//   let userId = 8;
//   const roles = 'member';
  let userId = req.userLogin.user_id;
  const { roles } = req.userLogin;
  if (roles === 'admin') {
    userId = 0;
  }
  const StatusPagination = req.query.pagination || 'on';
  let order = req.query.order || '';
  if (order.toUpperCase() === 'ASC') {
    order = 'ASC';
  } else if (order.toUpperCase() === 'DESC') {
    order = 'DESC';
  } else {
    order = 'DESC';
  }
  try {
    let histories;
    let pagination;
    const allRecord = await historyModel.getHistory(userId, order);
    if (allRecord.length > 0) {
      const limit = req.query.limit || 5;
      const pages = Math.ceil(allRecord.length / limit);
      let page = req.query.page || 1;
      let nextPage = parseInt(page, 10) + 1;
      let prevPage = parseInt(page, 10) - 1;
      if (nextPage > pages) {
        nextPage = pages;
      }
      if (prevPage < 1) {
        prevPage = 1;
      }
      if (page > pages) {
        page = pages;
      } else if (page < 1) {
        page = 1;
      }
      const start = (page - 1) * limit;
      pagination = {
        countData: allRecord.length,
        pages,
        limit: parseInt(limit, 10),
        curentPage: parseInt(page, 10),
        nextPage,
        prevPage,
      };
      if (StatusPagination === 'on') {
        histories = await historyModel.getHistory(userId, order, start, limit);
        return responsePagination(res, 'success', 200, 'Data histories', histories, pagination);
      }
      histories = await historyModel.getHistory(userId, order);
      return response(res, 'success', 200, 'Data histories', histories);
    }
    response(res, 'Not found', 200, 'Deliveries not found');
  } catch (err) {
    next(err);
  }
};

export default {
  getHistory,
};
