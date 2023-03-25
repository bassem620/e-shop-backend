const Category = require('../models/categoryModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');

// @desc    Get list of categories
// @route   GET /api/v1/category
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
    const page = req.query.page*1 || 1;
    const limit = req.query.limit*1 || 1;
    const skip = (page -1) * limit;
    const categories = await Category.find({}).skip(skip).limit(limit);
    res.status(200).json({
        results: categories.length,
        page,
        data: categories
    })
});

// @desc    Get specific categories
// @route   GET /api/v1/category/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if(!category){
        res.status(404).json({msg:`Category (${id}) is not found`});
    }
    res.status(200).json({data: category});
});

// @desc    Create category
// @route   POST /api/v1/category
// @access  Private
exports.addCategory = asyncHandler(async (req, res) => {
    const name = req.body.name;
    const category = await Category.create({name, slug: slugify(name)});
    res.status(201).json({data: category});
});

// @desc    Update specific category
// @route   PUT /api/v1/category/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findOneAndUpdate({_id: id}, {name, slug: slugify(name)}, {new: true});
    if(!category){
        res.status(404).json({msg:`Category (${id}) is not found`});
    }
    res.status(200).json({data: category});
});

// @desc    Delete specific category
// @route   DELETE /api/v1/category/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if(!category){
        res.status(404).json({msg:`Category (${id}) is not found`});
    }
    res.status(204).send();
});