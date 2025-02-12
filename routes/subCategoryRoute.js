// subCategoryRoute.js
const express= require('express');
const router= express.Router();
const {createSubCategory, getSubCategory, getSubCategories, updateSubCategory,deleteSubCategory}= require('../services/subCategoryService');

router.post('/', createSubCategory);
router.get('/', getSubCategories);
router.get('/:id', getSubCategory);
router.put('/:id', updateSubCategory);
router.delete('/:id', deleteSubCategory);

module.exports= router;