const Router = require('express');
const router = Router();
const { celebrate } = require('celebrate');
const { validation } = require('../../helper/validation');
const image = require('../../helper/image')
const auth = require('../../controllers/auth/auth');
const answer = require('../../controllers/answer/answers');
const apiResponse = require('../../helper/apiResponse')
const checkList = require('../../controllers/checklist/checklist')

// Submit answer
router.post(
  '/submit',
  (request, response, next) => {
    let parsedAnswers = JSON.parse(request.body.answers)
    request.body.answers = parsedAnswers
    return next()
  },
  celebrate(validation.submitAnswer),
  auth.isAuth,
  (request, response, next) => {
    if (request.body.auth.role !== "inspection_manager") return apiResponse.unAuthorizedResponse(response, "Checklist can be filled by inspection_manager")
    request.files && request.files.file.data.length > 0
      ? (request.body.folderPath = '../uploads/checklist')
      : (request.body.skip = true);
    next();
  },
  image.uploadMediaFiles,
  checkList.getChecklistById,
  answer.submitAnswer
);

// Upload image
router.post('/upload',
  auth.isAuth,
  image.uploadMediaFiles,
  (request, response) =>{
    return apiResponse.successResponseWithData(response, "media file uploaded successfully!", {mediaPath : request.body.mediaPaths})
  }
)

module.exports = router;
