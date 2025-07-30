const router = require('express').Router();
const checklistController = require('../../controllers/checklist/checklist');
const auth = require('../../controllers/auth/auth');
const { celebrate } = require('celebrate');
const { validation } = require('../../helper/validation');

// Create checklist
router.post(
  '/create',
  celebrate(validation.createChecklist),
  auth.isAuth,
  checklistController.createChecklist
);

// Get checklist with filters and pagination
router.get(
  '/list',
  auth.isAuth,
  checklistController.getAllChecklists
);

module.exports = router;
