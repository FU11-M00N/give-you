const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn } = require('../middlewares');
const { afterUploadImage, likePost, unlikePost, uploadPost, getPost, getPosts } = require('../controllers/post');

const router = express.Router();

try {
   fs.readdirSync('uploads');
} catch (error) {
   console.error('uploads 폴더 생성');
   fs.mkdirSync('uploads');
}

const fileFilter = (req, file, cb) => {
   if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpeg') {
      cb(null, true); // 해당 mimetype 만 허용
   } else {
      req.fileValidationError = 'jpg, jpeg, png, gif, webp 파일만 업로드 가능합니다.';
      cb(null, false);
   }
};

const upload = multer({
   storage: multer.diskStorage({
      //폴더 경로 지정
      destination: (req, file, done) => {
         done(null, 'uploads/');
      },
      filename: (req, file, done) => {
         const ext = path.extname(file.originalname);
         const fileName = path.basename(file.originalname, ext) + Date.now() + ext;
         done(null, fileName);
      },
   }),
   fileFilter: fileFilter,
   limits: { fileSize: 30 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);
router.post('/', isLoggedIn, upload.single('img'), uploadPost);
// router.patch('/', isLoggedIn, upload.single('img'), updatePost);

router.get('/:id', getPost);
router.get('/', getPosts);

router.get('/:id/like', isLoggedIn, likePost);
router.delete('/:id/unlike', isLoggedIn, unlikePost);

module.exports = router;
