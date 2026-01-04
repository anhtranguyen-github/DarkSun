/**
 * Business Logic & Validation Utilities
 * Centralized validation functions for BlueMoon System
 */

// XSS Sanitization - Remove HTML tags
const sanitizeHtml = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>?/gm, '').trim();
};

// Email format validation
const isValidEmail = (email) => {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Vietnamese phone format validation (10-11 digits, starts with 0)
const isValidPhone = (phone) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^0\d{9,10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

// ID Card validation (9 or 12 digits)
const isValidIdCard = (idCard) => {
    if (!idCard) return true; // Optional field
    return /^\d{9}$|^\d{12}$/.test(idCard);
};

// Name validation (2-100 chars, no HTML)
const isValidName = (name, minLength = 2, maxLength = 100) => {
    if (!name || typeof name !== 'string') return false;
    const sanitized = sanitizeHtml(name);
    return sanitized.length >= minLength && sanitized.length <= maxLength;
};

// Date validations
const isValidBirthDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 150); // Not older than 150 years

    return date <= now && date >= minDate;
};

const isValidFutureDate = (dateStr) => {
    if (!dateStr) return true;
    const date = new Date(dateStr);
    const now = new Date();
    return date >= now;
};

const isDateRangeValid = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    return new Date(endDate) >= new Date(startDate);
};

// Area validation (positive number, reasonable range)
const isValidArea = (area) => {
    const num = Number(area);
    return !isNaN(num) && num > 0 && num <= 10000; // Max 10000 m2
};

// Price validation (non-negative, reasonable)
const isValidPrice = (price) => {
    const num = Number(price);
    return !isNaN(num) && num >= 0 && num <= 999999999999; // Max ~1 trillion
};

// Username validation (3-50 chars, alphanumeric + underscore)
const isValidUsername = (username) => {
    if (!username || typeof username !== 'string') return false;
    return /^[a-zA-Z0-9_]{3,50}$/.test(username);
};

// Password validation (6+ chars)
const isValidPassword = (password) => {
    if (!password || typeof password !== 'string') return false;
    return password.length >= 6 && password.length <= 100;
};

// License plate validation (Vietnamese format)
const isValidLicensePlate = (plate) => {
    if (!plate) return false;
    const sanitized = plate.toUpperCase().trim().replace(/[^A-Z0-9- ]/g, '');
    return sanitized.length >= 5 && sanitized.length <= 20;
};

// Temp residence type validation
const VALID_TEMP_RESIDENCE_TYPES = ['tam_tru', 'tam_vang'];
const isValidTempResidenceType = (type) => {
    return VALID_TEMP_RESIDENCE_TYPES.includes(type?.toLowerCase());
};

// Vehicle type validation
const VALID_VEHICLE_TYPES = ['XeMay', 'Oto', 'XeDapDien'];
const isValidVehicleType = (type) => {
    return VALID_VEHICLE_TYPES.includes(type);
};

// Gender validation
const VALID_GENDERS = ['Nam', 'Nữ', 'Khác'];
const isValidGender = (gender) => {
    return VALID_GENDERS.includes(gender);
};

// Length validation helper
const isValidLength = (str, min = 0, max = 255) => {
    if (!str) return min === 0;
    return str.length >= min && str.length <= max;
};

module.exports = {
    sanitizeHtml,
    isValidEmail,
    isValidPhone,
    isValidIdCard,
    isValidName,
    isValidBirthDate,
    isValidFutureDate,
    isDateRangeValid,
    isValidArea,
    isValidPrice,
    isValidUsername,
    isValidPassword,
    isValidLicensePlate,
    isValidTempResidenceType,
    isValidVehicleType,
    isValidGender,
    isValidLength,
    VALID_TEMP_RESIDENCE_TYPES,
    VALID_VEHICLE_TYPES,
    VALID_GENDERS
};
