const { Joi } = require('celebrate');
const { ObjectId } = require('mongodb')

module.exports.validation = {
  addUser: {
    body: Joi.object({
      name: Joi.string().required().messages({
        'string.empty': 'Name is required.',
      }),
      mobile: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
          'string.pattern.base': 'Mobile number must be exactly 10 digits.',
          'string.empty': 'Mobile number is required.',
        }),
      email: Joi.string()
        .email()
        .optional()
        .messages({
          'string.email': 'Please provide a valid email address.',
        }),
      password: Joi.string()
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
        )
        .required()
        .messages({
          'string.pattern.base':
            'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
          'string.empty': 'Password is required.',
        }),
      role: Joi.string()
        .valid('admin', 'procurement_manager', 'inspection_manager', 'client')
        .required()
        .messages({
          'any.only': 'Role must be one of admin, procurement_manager, inspection_manager, or client.',
          'string.empty': 'Role is required.',
        }),
      procurementManager: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'procurementManager Id must be a valid MongoDB ObjectId'
      })
    }),
  },
  getUser: {
    body: Joi.object({
      name: Joi.string().optional(),
      mobile: Joi.string().pattern(/^[0-9]{10}$/).optional(),
      email: Joi.string().email().optional(),
      userId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .optional()
        .messages({
          'string.pattern.base': 'userId must be a valid MongoDB ObjectId'
        })
    }).required()
  },
  updateUser:{
    body : Joi.object({
      userId : Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'userId must be a valid MongoDB ObjectId'
      }).required(),
      procurementManager : Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'procurementManager Id must be a valid MongoDB ObjectId'
      }).required()
    }).required()
  },
  registration : {
    body : Joi.object({
      mobile : Joi.string().pattern(/^[0-9]{10}$/).optional(),
      email : Joi.string().email().optional(),
      password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8}$/)
        .required()
        .messages({
          'string.pattern.base': 'Password must be exactly 8 characters long, include uppercase, lowercase, number, and special character.'
        }).required()
    }).required()
  },
  login: {
    body: Joi.object({
      mobile: Joi.string().pattern(/^[0-9]{10}$/).optional(),
      email: Joi.string().email().optional(),
      password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8}$/)
        .required()
        .messages({
          'string.pattern.base': 'Password must be exactly 8 characters long, include uppercase, lowercase, number, and special character.'
        }).required()
    }).required()
  },
  createOrder: {
    body: Joi.object({
      clientId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .optional()
        .messages({
          'string.pattern.base': 'clientId must be a valid MongoDB ObjectId'
        }).required(),
      inspectionManagerId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .optional()
        .messages({
          'string.pattern.base': 'inspectionManagerId must be a valid MongoDB ObjectId'
        }).optional(), 
      title: Joi.string().required(),
      description: Joi.string().required()
    })
  },
  updateOrderStatus: {
    body: Joi.object({
      orderId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'userId must be a valid MongoDB ObjectId'
      }).required(),
      status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').required()
    })
  },
  linkChecklist: {
    body: Joi.object({
      orderId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'orderId must be a valid MongoDB ObjectId'
      }).required(),
      checklistId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'checklistId must be a valid MongoDB ObjectId'
      }).required()
    })
  },
  createChecklist: {
    body: Joi.object({
      title: Joi.string().required(),
      description: Joi.string().optional(),
      questions: Joi.array().items(
        Joi.object({
          questionId: Joi.string().required(),
          label: Joi.string().required(),
          type: Joi.string().valid('boolean', 'dropdown', 'image', 'multiple_choice', 'text').required(),
          required: Joi.boolean().default(false),
          options: Joi.array().items(Joi.string()).when('type', {
            is: Joi.valid('dropdown', 'multiple_choice'),
            then: Joi.required(),
            otherwise: Joi.optional()
          })
        })
      ).min(3).required()
    })
  },
  listChecklist: {
    body: Joi.object({
      checklistId: Joi.string().optional(),
      title: Joi.string().optional()
    })
  },
  submitAnswer: {
    body: Joi.object({
      checklistId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'checklistId must be a valid MongoDB ObjectId'
      }).required(),
      orderId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .optional()
      .messages({
        'string.pattern.base': 'checklistId must be a valid MongoDB ObjectId'
      }).required(),
      answers: Joi.array().items(
        Joi.object({
          questionId: Joi.string().required(),
          answer: Joi.alternatives().try(Joi.string(), Joi.boolean(), Joi.array(), Joi.object())
        })
      ).min(1).required()
    })
  }
}


