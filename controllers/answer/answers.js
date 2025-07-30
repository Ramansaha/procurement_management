const checklistModel = require('../../models/checklist/checklist');
const answerModel = require('../../models/answer/answer');
const apiResponse = require('../../helper/apiResponse');
const { ObjectId } = require('mongodb');

// Submit answers(Insoection manager)
module.exports.submitAnswer = async (request, response) => {
  try {
    const { checklistId, answers, orderId } = request.body;
    const userId = new ObjectId(request.body.auth.userId);
    const checklist = request.body.checklist
    if (!checklist) {
      return apiResponse.notFoundResponse(response, 'Checklist not found');
    }

    const requiredFields = checklist.questions.filter(q => q.required);
    const missingFields = requiredFields.filter(q => {
      const answer = answers.find(a => a.questionId === q.questionId);
      return !answer || answer.answer === undefined || answer.answer === null;
    });

    if (missingFields.length > 0) {
      return apiResponse.validationErrorWithData(response, 'Missing required answers', missingFields.map(f => f.label));
    }

    const saveResult = await answerModel.submitAnswers({
      checklistId,
      orderId,
      answers,
      userId
    });
    if(!saveResult.status) return apiResponse.duplicateResponse(response, "Unable to save response!")
    return apiResponse.successResponse(response, 'Answers submitted successfully');
  } catch (error) {
    console.log('Error in submitAnswer:', error);
    return apiResponse.errorResponse(response, 'Error submitting answers');
  }
};
