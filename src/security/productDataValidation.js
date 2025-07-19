import Joi from 'joi';

export const categorySchema = Joi.object({
  name: Joi.string().min(3).required().pattern(/\S.*/, { name: 'non-space' }).messages({
    'string.base': 'Name must be a string.',
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 3 characters long.',
    'any.required': 'Name is required.'
  }),
  description: Joi.string().allow('').optional().messages({
    'string.base': 'Description must be a string.'
  })
});

export const updateCategorySchema=Joi.object({
  name: Joi.string().min(3).required().pattern(/\S.*/, { name: 'non-space' }).messages({
    'string.base': 'Name must be a string.',
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 3 characters long.',
    'any.required': 'Name is required.'
  }),
  description: Joi.string().allow('').optional().messages({
    'string.base': 'Description must be a string.'
  }),
  categoryId:Joi.string()
});

export const productSchema = Joi.object({
  name: Joi.string().min(3).required().pattern(/\S.*/, { name: 'non-space' }).messages({
    'any.required': 'Product name is required',
    'string.base': 'Name must be a string'
  }),
  description:Joi.string().allow('').optional().messages({
    'string.base': 'Description must be a string.'
  }),
  price: Joi.number().greater(1).required().messages({
    'any.required': 'Price is required',
    'number.base': 'Price must be a number',
    'number.greater': 'Price must be greater than 1'
  }),
  category: Joi.string().pattern(/\S.*/, { name: 'non-space' }).required().messages({
    'any.required': 'Category is required',
    'string.base': 'Category must be a string'
  }),
  brand: Joi.string().pattern(/\S.*/, { name: 'non-space' }).required().messages({
    'any.required': 'Brand is required',
    'string.base': 'Brand must be a string'
  }),
  stock: Joi.number().greater(1).required().messages({
    'any.required': 'Stock is required',
    'number.base': 'Stock must be a number',
    'number.greater': 'Stock must be greater than 1'
  })
});
