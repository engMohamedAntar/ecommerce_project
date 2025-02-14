const {check}= require('express-validator');
const validatorMiddleware= require('../../middlewares/validatorMiddleware');

exports.createSubCategoryValidator= [
    check('name')
    .notEmpty().withMessage('name is required')
    .isLength({min:3}).withMessage('Too short name')
    .isLength({max: 32}).withMessage('Too long name'),
    check('category')
    .isMongoId().withMessage('category not a valid mongoId'),
    validatorMiddleware
];

exports.getSubCategoryValidator= [
    check('id')
    .isMongoId().withMessage('id not a valid mongoId'),
    validatorMiddleware
];
exports.updateSubCategoryValidator= [
    check('id')
    .isMongoId().withMessage('id not a valid mongoId'),
    check('name')
    .optional()
    .isLength({min: 3}).withMessage('Too short name')
    .isLength({max: 32}).withMessage('Too long name'),
    check('category')
    .optional()
    .isMongoId().withMessage('category not a valid mongoId'),
    validatorMiddleware
];

exports.deleteSubCategoryValidator= [
    check('id')
    .isMongoId().withMessage('id not a valid mongoId'),
    validatorMiddleware
];