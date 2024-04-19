import UserModel from '../model/User.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator';
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from 'fs';


/** middleware for verify user */
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}


/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
// export async function register(req, res) {
//     try {
//         console.log("inside the register controller")
//         const { username, password, profile, email ,mobile} = req.body;

//         // Check if username already exists
//         const existingUsername = await UserModel.findOne({ username });
//         if (existingUsername) {
//             return res.status(400).send({ error: "Username already exists" });
//         }

//         // Check if email already exists
//         const existingEmail = await UserModel.findOne({ email });
//         if (existingEmail) {
//             return res.status(400).send({ error: "Email already exists" });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create new user
//         const newUser = new UserModel({
//             username,
//             password: hashedPassword,
//             profile: profile || '',
//             email,
//             mobile
//         });

//         // Save new user to the database
//         await newUser.save();

//         return res.status(201).send({ msg: "User registered successfully" });
//     } catch (error) {
//         console.log("Error:", error);
//         return res.status(500).send({ error: "Internal Server Error" });
//     }
// }
export async function register(req, res) {



    try {
        console.log("inside the register controller");
        const { username, password, email, mobile} = req.body;
        // const profile = req.file ? req.file.buffer.toString('base64') : '';
    
        // Check if username already exists
        const existingUsername = await UserModel.findOne({ username });
        if (existingUsername) {
          return res.status(400).send({ error: "Username already exists" });
        }
    
        // Check if email already exists
        const existingEmail = await UserModel.findOne({ email });
        if (existingEmail) {
          return res.status(400).send({ error: "Email already exists" });
        }
        // console.log("body data",req.body.profile);

        // console.log("req fiels",req.profile)
        const avatarLocalPath = req.body.profile;

        const base64Data = avatarLocalPath.replace(/^data:image\/\w+;base64,/, '');

        // Convert the base64 data to a Buffer object
        const buffer = Buffer.from(base64Data, 'base64');
      
        // Write the buffer to a file
        fs.writeFileSync(`/public/temp/${req.body.username}`, buffer);
      


        



        console.log("PATH OF IMAGE",`/public/temp/${req.body.username}`)
        const avatar2 = await uploadOnCloudinary(`/public/temp/${req.body.username}`);
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
    console.log("avatar upload",avatar2)
        // Create new user
        const newUser = new UserModel({
          username,
          password: hashedPassword,
          profile: avatar2.url
           || '',
          email,
          mobile
        });
    
        // Save user to database
        await newUser.save();
    
        // Return success response
        res.status(201).send({ message: "User created successfully" });
      } catch (error) {
        console.error("Error creating user:", error);
        // Return error response
        res.status(500).send({ error: "Internal server error" });
      }

    // try {
    //   console.log("inside the register controller");
    //   const { username, password, profile, email, mobile } = req.body;
  
    //   // Check if username already exists
    //   const existingUsername = await UserModel.findOne({ username });
    //   if (existingUsername) {
    //     return res.status(400).send({ error: "Username already exists" });
    //   }
  
    //   // Check if email already exists
    //   const existingEmail = await UserModel.findOne({ email });
    //   if (existingEmail) {
    //     return res.status(400).send({ error: "Email already exists" });
    //   }
  
    //   // Hash password with a random salt
    //   const hashedPassword = await bcrypt.hash(password, null);
  
    //   // Create budget
    //   const newUser = new UserModel({
    //     username,
    //     password: hashedPassword,
    //     profile: profile || '',
    //     email,
    //     mobile
    //   });
  
    //   // Save user to database
    //   await newUser.save();
  
    //   // Return success response
    //   res.status(201).send({ message: "User created successfully" });
    // } catch (error) {
    //   console.error("Error creating user:", error);
    //   // Return error response
    //   res.status(500).send({ error: "Internal server error" });
    // }
  }



/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req,res){
   
    const { username, password } = req.body;

    try {
        
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

                        // create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        username : user.username
                                    }, ENV.JWT_SECRET , { expiresIn : "24h"});

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });                                    

                    })
                    .catch(error =>{
                        return res.status(400).send({ error: "Password does not Match"})
                    })
            })
            .catch( error => {
                return res.status(404).send({ error : "Username not Found"});
            })

    } catch (error) {
        return res.status(500).send({ error});
    }
}


/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
    const { username } = req.params;
    console.log(username);
  
    try {
      if (!username) {
        return res.status(501).send({ error: "Invalid Username" });
      }
  
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.status(501).send({ error: "Couldn't Find the User" });
      }
  
      /** remove password from user */
      // mongoose return unnecessary data with object so convert it into json
      const { password, ...rest } = Object.assign({}, user.toJSON());
  
      return res.status(201).send(rest);
    } catch (error) {
      return res.status(404).send({ error: "Cannot Find User Data" });
    }
  }

  export async function getUserById(req, res) {
    const {id} = req.params;
console.log("INSIDE THE CONTROLLER",id)

    try{
        if(!id){
            return res.status(501).send({error:"Invalid User ID"})
        }
        const user = await UserModel.findOne({_id:id});
        return res.status(201).send(user);
    }catch(err){
        return res.status(500).send({err:"can't find user data"});
    }
  }



  // export async function getAllUser(req, res) {
  //   try {
  //     const users = await UserModel.aggregate([
  //       {
  //         $sort: {
  //           $or: [{ updatedAt: -1 }, { createdAt: -1 }],
  //         },
  //       },
  //     ]);
  //     return res.status(200).send(users);
  //   } catch (error) {
  //     console.error('Error fetching users:', error);
  //     return res.status(500).send({ message: 'Internal server error' });
  //   }
  // }


  
  


//delete a user

export async function getAllUser(req, res) {
  try {
    const users = await UserModel.aggregate([
      {
        $facet: {
          sortByUpdatedAt: [
            { $sort: { updatedAt: -1 } }
          ],
          sortByCreatedAt: [
            { $sort: { createdAt: -1 } }
          ]
        }
      },
      {
        $project: {
          mergedUsers: { $concatArrays: ["$sortByUpdatedAt", "$sortByCreatedAt"] }
        }
      },
      {
        $unwind: "$mergedUsers"
      },
      {
        $replaceRoot: { newRoot: "$mergedUsers" }
      }
    ]);
    return res.status(200).send(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}






export async function deleteUser(req, res) {
    console.log("inside the controller")

    const { userId } = req.params;
  console.log(userId);
    try {
      if (!userId) {
        return res.status(501).send({ error: "Invalid Username" });
      }
  
      const user = await UserModel.findOneAndDelete({ _id:userId });
  
      if (!user) {
        return res.status(501).send({ error: "Couldn't Find the User" });
      }
  
      return res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        console.log("catch err",error)
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }


/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/



export async function updateUser(req,res){
    try {
        
        // const id = req.query.id;
        const { userId } = req.user;

        if(userId){
            const body = req.body;

            // update the data
            const data = await UserModel.updateOne({ _id : userId }, body);

            return res.status(201).send({ msg : "Record Updated...!"});
        }else{
            return res.status(401).send({ error : "User Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}





export async function updateUserOne(req,res){
    try {
        
        // const id = req.query.id;
        const { userId } = req.params;

        if(userId){
            const body = req.body;

            // update the data
            const data = await UserModel.updateOne({ _id : userId }, body);

            return res.status(201).send({ msg : "Record Updated...!"});
        }else{
            return res.status(401).send({ error : "User Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
   if(req.app.locals.resetSession){
        return res.status(201).send({ flag : req.app.locals.resetSession})
   }
   return res.status(440).send({error : "Session expired!"})
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    try {
      if (!req.app.locals.resetSession)
        return res.status(440).send({ error: "Session expired!" });
  
      const { username, password } = req.body;
  
      try {
        const user = await UserModel.findOne({ username });
  
        if (!user) {
          return res.status(404).send({ error: "Username not Found" });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        await UserModel.updateOne({ username: user.username }, { password: hashedPassword });
  
        req.app.locals.resetSession = false; // reset session
  
        return res.status(201).send({ msg: "Record Updated...!" });
      } catch (error) {
        return res.status(500).send({ error });
      }
    } catch (error) {
      return res.status(401).send({ error });
    }
  }

