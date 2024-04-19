// import multer from 'multer';

// export const upload = multer({ storage: multer.memoryStorage() });



import  multer  from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, file.originalname)

    }
  })

  const fileFilter = async(req,file,cb)=>{

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype  === 'image/jpg'){
        cb(null, true);       
    }else{
      cb(new Error("only Jpeg and PNG files are allowed"),false);
    }
  }
  
  
export const upload = multer({ storage, fileFilter});