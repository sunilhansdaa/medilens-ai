const Report = require('../models/Report');

const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

const getReportById = async (req, res, next) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

const createReport = async (req, res, next) => {
  try {
    const report = await Report.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json({
      success: true,
      message: 'Report saved successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }
    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReports, getReportById, createReport, deleteReport };