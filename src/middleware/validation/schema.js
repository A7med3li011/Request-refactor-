import Joi from "joi";

///// signup///////
export const signupSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters.",
    "string.max": "Name must not exceed 30 characters.",
  }),

  phone: Joi.string().min(10).max(15).required().messages({
    "string.empty": "Phone number is required.",
    "string.min": "Phone number must be at least 10 digits.",
    "string.max": "Phone number must not exceed 15 digits.",
  }),

  role: Joi.string()
    .valid("owner", "contractor", "consultant")
    .required()
    .messages({
      "any.only": "Role must be one of: owner, contractor, or consultant.",
      "string.empty": "Role is required.",
    }),

  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
  }),

  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one special character.",
      "string.empty": "Password is required.",
    }),
});

/// verified schema ///

export const verifiedSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
  }),

  otp: Joi.string().min(4).max(4).required().messages({
    "string.empty": "OTP is required.",
    "string.min": "OTP must be  4 digits.",
    "string.max": "OTP must be 4 digits.",
  }),
});

/// login schema ///

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
  }),

  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one special character.",
      "string.empty": "Password is required.",
    }),
});

/// Resend otp ///

export const resendOtp = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
  }),
});
export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
  }),
  otp: Joi.string().min(4).max(4).required().messages({
    "string.empty": "OTP is required.",
    "string.min": "OTP must be  4 digits.",
    "string.max": "OTP must be 4 digits.",
  }),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one special character.",
      "string.empty": "Password is required.",
    }),
});

export const updateUserProfileSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
  }),
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters.",
    "string.max": "Name must not exceed 30 characters.",
  }),
  phone: Joi.string().min(10).max(15).required().messages({
    "string.empty": "Phone number is required.",
    "string.min": "Phone number must be at least 10 digits.",
    "string.max": "Phone number must not exceed 15 digits.",
  }),
  birthOfDate: Joi.date()
    .less("now") // must be before the current date
    .required()
    .messages({
      "date.base": "Birth date must be a valid date.",
      "date.less": "Birth date cannot be in the future.",
      "any.required": "Birth date is required.",
    }),
  country: Joi.string().required().messages({
    "string.empty": "Country is required.",
    "any.required": "Country is required.",
  }),

  city: Joi.string().required().messages({
    "string.empty": "City is required.",
    "any.required": "City is required.",
  }),

  address: Joi.string().required().messages({
    "string.empty": "Address is required.",
    "any.required": "Address is required.",
  }),
  role: Joi.string()
    .valid("owner", "contractor", "consultant", "user")
    .required()
    .messages({
      "any.only": "Role must be one of: owner, contractor, or consultant.",
      "string.empty": "Role is required.",
    }),
});
export const updateUserCompanySchema = Joi.object({
  companyName: Joi.string().min(3).max(30).required().messages({
    "string.empty": "CompanyName is required.",
    "string.min": "CompanyName must be at least 3 characters.",
    "string.max": "CompanyName must not exceed 30 characters.",
  }),
});
export const createTagSchema = Joi.object({
  tags: Joi.array().items(
    Joi.object({
      title: Joi.string().min(3).max(30).required().messages({
        "string.empty": "title is required.",
        "string.min": "title must be at least 3 characters.",
        "string.max": "title must not exceed 30 characters.",
      }),
      color: Joi.string()
        .pattern(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
        .required()
        .messages({
          "string.empty": "Color is required.",
          "string.pattern.base":
            "Color must be a valid hex code (e.g., #fff or #ffffff).",
        }),
    })
  ),
});
export const updateTagSchema = Joi.object({
  title: Joi.string().min(3).max(30).required().messages({
    "string.empty": "title is required.",
    "string.min": "title must be at least 3 characters.",
    "string.max": "title must not exceed 30 characters.",
  }),
  color: Joi.string()
    .pattern(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .required()
    .messages({
      "string.empty": "Color is required.",
      "string.pattern.base":
        "Color must be a valid hex code (e.g., #fff or #ffffff).",
    }),
});
export const createVocationSchema = Joi.object({
  title: Joi.string()
    .pattern(/^[A-Za-z\s]+$/) // Only English letters and spaces
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.empty": "title is required.",
      "string.pattern.base": "title must contain only English letters.",
      "string.min": "title must be at least 3 characters.",
      "string.max": "title must not exceed 30 characters.",
    }),

  title_ar: Joi.string()
    .pattern(/^[\u0600-\u06FF\s]+$/) // Only Arabic letters and spaces
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.empty": "title_ar is required.",
      "string.pattern.base": "title_ar must contain only Arabic letters.",
      "string.min": "title_ar must be at least 3 characters.",
      "string.max": "title_ar must not exceed 30 characters.",
    }),
});
