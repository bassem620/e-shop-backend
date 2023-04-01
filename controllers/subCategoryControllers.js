const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');
const handlers = require('./handlers');

const SubCategory = require('../models/subCategoryModel');

// @desc    Get list of subCategories
// @route   GET /api/v1/subCategory
// @access  Public
exports.createFilterObj = (req, res, next) => {
    let filter = {};
    if(req.params.categoryId) filter = {category: req.params.categoryId};
    req.filter = filter;
    next();
}

exports.getSubCategories = asyncHandler(async (req, res) => {
    const docCount = await SubCategory.countDocuments();
    const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .pagination(docCount)
    .filter()
    .search()
    .limitFields()
    .sort()
    .mongooseQueryExec();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const subCategories = await mongooseQuery;
    
    res.status(200).json({
        results: subCategories.length,
        paginationResult,
        data: subCategories
    })
});

// @desc    Get a specific subCategory
// @route   GET /api/v1/subCategory/:id
// @access  Public
exports.getSubCategory = handlers.getOne(SubCategory);

// @desc    Create subCategory
// @route   POST /api/v1/subCategory
// @access  Private
exports.setCategoryIdToBody = (req, res, next) => {
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
}

exports.addSubCategory = handlers.createOne(SubCategory);

// @desc    Update a specific subCategory
// @route   PUT /api/v1/subCategory/:id
// @access  Private
exports.updateSubCategory = handlers.updateOne(SubCategory);

// @desc    Delete a specific subCategory
// @route   DELETE /api/v1/subCategory/:id
// @access  Private
exports.deleteSubCategory = handlers.deleteOne(SubCategory);