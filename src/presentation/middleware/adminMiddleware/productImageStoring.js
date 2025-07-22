import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uniqueIdv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename); 

const uploadsDir = path.join('/tmp', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
            
        // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const uniqueSuffix=uniqueIdv4();
        const fileExtension = path.extname(file.originalname);
        
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
      
        
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 
    },
    fileFilter: fileFilter
});


export default upload;