import Joi from 'joi';

export const addressValidationSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 3 characters',
      'string.max': 'Full name must not exceed 100 characters',
      'string.pattern.base': 'Full name must contain only letters and spaces',
    }),

  phone: Joi.string()
    .pattern(/^0[2-9]\d{7,9}$/) // Allows 09, 021, 027, etc.
    .required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Phone number must be a valid New Zealand format (e.g., 0211234567)',
    }),

  street: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Street is required',
      'string.min': 'Street must be at least 3 characters',
      'string.max': 'Street must not exceed 100 characters',
    }),

  streetNumber: Joi.string()
    .trim()
    .alphanum()
    .required()
    .messages({
      'string.empty': 'Street number is required',
      'string.alphanum': 'Street number must be alphanumeric',
    }),

  unitNumber: Joi.string()
    .trim()
    .alphanum()
    .allow('', null)
    .messages({
      'string.alphanum': 'Unit number must be alphanumeric',
    }),

  suburb: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Suburb is required',
      'string.min': 'Suburb must be at least 2 characters',
      'string.max': 'Suburb must not exceed 100 characters',
    }),

  city: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'City is required',
      'string.min': 'City must be at least 2 characters',
      'string.max': 'City must not exceed 100 characters',
    }),

  region: Joi.string()
    .valid(
      'Auckland', 'Wellington', 'Canterbury', 'Otago', 'Waikato', 'Bay of Plenty',
      'Northland', 'Hawke\'s Bay', 'Manawatu-Wanganui', 'Taranaki',
      'Southland', 'Tasman', 'Nelson', 'West Coast', 'Marlborough', 'Gisborne'
    )
    .required()
    .messages({
      'any.only': 'Region must be a valid New Zealand region',
      'string.empty': 'Region is required',
    }),

  postalCode: Joi.string()
    .pattern(/^\d{4}$/)
    .required()
    .messages({
      'string.empty': 'Postal code is required',
      'string.pattern.base': 'Postal code must be exactly 4 digits',
    }),

  landmark: Joi.string()
    .trim()
    .max(150)
    .allow('', null),

  addressType: Joi.string()
    .valid('Home', 'Work', 'Other')
    .default('Home')
    .messages({
      'any.only': 'Address type must be one of: Home, Work, Other',
    }),

  
});
