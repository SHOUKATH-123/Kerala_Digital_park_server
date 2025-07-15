import Joi from 'joi'
import countries from 'world-countries';

export const userSchema = Joi.object({
    firstName: Joi.string().min(3).trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$#!%*?&]{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must be at least 8 characters long, with uppercase, lowercase, number, and special character.',
        }),
    country: Joi.string().trim().required(),
    countryCode: Joi.string().pattern(/^\+\d{1,4}$/).required()
});

export const setNewPasswordSchema = Joi.object({
    UId: Joi.string().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$#!%*?&]{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
        })
});

const getCountriesWithPhoneCodes = () => {
    return countries
        .filter(country => country.idd.root)
        .map(country => ({
            country: country.name.common,
            code: country.idd.root + (country.idd.suffixes?.[0] || ''),
            iso2: country.cca2,
            iso3: country.cca3
        }))
        .sort((a, b) => a.country.localeCompare(b.country));
};

export const checkCountry = (country, code) => {

    if (!country || !code) {
        return {
            valid: false,
            error: 'Both country and code are required'
        };
    }
    const countryName = country.trim();
    const countryCode = code.trim();

    const validCountries = getCountriesWithPhoneCodes();

    const matchedCountry = validCountries.find(
        validCountry => validCountry.country.toLowerCase() === countryName.toLowerCase()
    );

    if (!matchedCountry) {
        return {
            valid: false,
            error: `Country name "${countryName}" is not valid.`
        }
    }
    if (matchedCountry.code !== countryCode) {
        return {
            valid: false,
            error: `Country code "${countryCode}" is not valid for "${matchedCountry.country}". Expected code: "${matchedCountry.code}".`
        }
    }
    return {
        valid: true,
    }

};
