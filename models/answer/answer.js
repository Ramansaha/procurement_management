const { create } = require('../../helper/mongo');
const collection_name = 'answers';

module.exports.submitAnswers = async (body) => {
  try {
    const data = {
      orderId: body.orderId,
      checklistId: body.checklistId,
      answers: body.answers,
      submittedBy: body.userId,
      submittedAt: new Date()
    };
    return await create(data, collection_name);
  } catch (error) {
    console.log('Error in submitAnswers:', error);
    throw error;
  }
};
