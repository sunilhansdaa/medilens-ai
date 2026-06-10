const express = require('express');
const {
  createReport,
  deleteReport,
  getReports,
  getReportById
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getReports);
router.get('/:id', getReportById);
router.post('/', createReport);
router.delete('/:id', deleteReport);

module.exports = router;