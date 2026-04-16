import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'docx',
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only images (jpg, png, gif) and documents (pdf, doc, docx) are allowed.'
      ),
      false
    );
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';

    if (file.fieldname === 'avatar') {
      folder += 'avatars/'; // Fixed: added trailing slash and correct folder name
    } else if (file.fieldname === 'resume') {
      folder += 'resumes/';
    } else {
      folder += 'others/';
    }

    const fullPath = path.join(__dirname, '../', folder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const userId = req.user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${userId}-${timestamp}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export const uploadAvatar = upload.single('avatar');
export const uploadResume = upload.single('resume');
export const uploadCoverLetter = upload.single('cover');
export const uploadMultiple = upload.array('files', 5);
export { storage };
