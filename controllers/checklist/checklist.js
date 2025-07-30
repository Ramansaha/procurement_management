const checklistModel = require('../../models/checklist/checklist');
const apiResponse = require('../../helper/apiResponse');
const { ObjectId } = require('mongodb')

// Create checklist(procurement_manager)
module.exports.createChecklist = async (request, response) => {
  try {
    const creator = request.body.auth;
    const { title, questions } = request.body;
    if (creator.role !== 'procurement_manager') return apiResponse.unAuthorizedResponse(response, "You don't have access to create checklist")

    const checklist = await checklistModel.createChecklist({
      title,
      questions,
      createdBy: new ObjectId(creator.userId),
      role: creator.role
    });

    if (!checklist.status) {
      return apiResponse.errorResponse(response, 'Checklist creation failed');
    }

    return apiResponse.successResponseWithData(response, 'Checklist created successfully', checklist.data);
  } catch (error) {
    console.error('Error creating checklist:', error);
    return apiResponse.errorResponse(response, 'Internal server error');
  }
};

// Get cheklists based on filters
module.exports.getAllChecklists = async (request, response) => {
  try {
    const result = await checklistModel.getAllChecklists(request.query);
    return apiResponse.successResponseWithData(response, 'Checklists fetched successfully', result);
  } catch (error) {
    console.error('Error fetching checklists:', error);
    return apiResponse.errorResponse(response, 'Internal server error');
  }
};

// Get checkList based on Id
module.exports.getChecklistById = async (request, response, next) => {
  try {
    // if()
    const checklistId = request.body.checklistId;
    if (!checklistId) {
      return apiResponse.validationErrorWithData(response, 'Checklist ID is required');
    }

    const result = await checklistModel.getChecklistById(checklistId);

    if (!result.status || !result.data) {
      return apiResponse.notFoundResponse(response, 'Checklist not found');
    }

    request.body.checklist = result.data;
    next(); 
  } catch (error) {
    console.log('Error in getChecklistById controller:', error);
    return apiResponse.errorResponse(response, 'Failed to get checklist');
  }
};

