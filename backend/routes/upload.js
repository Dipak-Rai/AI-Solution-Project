const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// create uploads folder automatically
const uploadDir =
path.join(
  __dirname,
  '../uploads'
);

if (
  !fs.existsSync(
    uploadDir
  )
) {
  fs.mkdirSync(
    uploadDir,
    {
      recursive: true,
    }
  );
}

const storage =
multer.diskStorage({

  destination:
    (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        uploadDir
      );

    },

  filename:
    (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        `${Date.now()}${path.extname(
          file.originalname
        )}`
      );

    },

});

const upload =
multer({
  storage,
});

router.post(
  '/',
  upload.single(
    'file'
  ),
  (
    req,
    res
  ) => {

    if (
      !req.file
    ) {

      return res
        .status(
          400
        )
        .json({
          message:
            'No file uploaded',
        });

    }

    res.json({

      fileUrl:
        `/uploads/${req.file.filename}`,

      fileName:
        req.file.originalname,

    });

  }
);

module.exports =
router;