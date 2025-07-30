// const moment = require('moment')
// const apiResponse = require('../helper/apiResponse')

// module.exports.uploadImage = (request, response, next) => {
//     try {
//         if (request.body.skip) return next()
//         if (!request.files || Object.keys(request.files).length === 0) {
//             return response.status(400).send("No files were uploaded")
//         }
//         let file = request.files.file
//         let type = request.files.file.mimetype.split('/')
//         let fileName = `Image_` + moment().format('YYYYMMDDHHmmss') + `.${type[1]}`

//         file.mv(request.body.folderPath + `/${fileName}`, (err) => {
//             if (err) {
//                 console.log(err);
//                 return response.status(500).send(err)
//             }
//             request.body.ImagePath = request.body.dbfolderPath + `${fileName}`
//             // console.log(request.body.ImagePath);

//             return next()

//         })
//     } catch (error) {
//         console.log(error);
//         return apiResponse.errorResponse(response, error.message)

//     }
// }

const moment = require('moment');
const fs = require('fs');
const path = require('path');

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
    "image/png", "image/jpeg", "image/jpg", "image/gif", "image/svg+xml",
    "audio/mpeg", "audio/wav", "audio/ogg",
    "video/mp4", "video/mpeg", "video/quicktime",
    "application/pdf", 
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
    "application/vnd.ms-excel", // XLS
    "text/plain",
    "application/zip"
];

module.exports.uploadMediaFiles = async (request, response, next) => {
    try {
        if (request.body?.skip) return next();
        if (!request.files || Object.keys(request.files).length === 0) return next();

        const files = Array.isArray(request.files.file) ? request.files.file : [request.files.file];
        const mediaPaths = [];

        const folderPath = request.body.folderPath 
            ? path.join(__dirname, '../uploads', request.body.folderPath) 
            : path.join(__dirname, '../uploads');

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const filePromises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const type = file.mimetype;

                if (!ALLOWED_MIME_TYPES.includes(type)) {
                    return reject(new Error(`File type ${type} not allowed`));
                }

                const fileExtension = path.extname(file.name);
                const uniqueSuffix = `${moment().format('YYYYMMDDHHmmss')}-${Math.random().toString(36).substring(2, 8)}`;
                const fileName = `${uniqueSuffix}${fileExtension}`;
                const savePath = path.join(folderPath, fileName);
                const relativePath = path.relative(path.join(__dirname, '../uploads'), savePath).replace(/\\/g, '/');

                mediaPaths.push(relativePath);

                const fileStream = fs.createWriteStream(savePath);
                fileStream.on('error', (err) => reject(err));
                fileStream.on('finish', () => resolve());

                fileStream.write(file.data);
                fileStream.end();
            });
        });

        await Promise.all(filePromises);

        request.body.mediaPaths = mediaPaths;
        next();
    } catch (err) {
        console.error("File Upload Error:", err);
        return response.status(500).json({ message: err.message });
    }
};
