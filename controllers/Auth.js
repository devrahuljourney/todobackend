const bcrypt = require("bcrypt");
const User = require("../modals/User");
const jwt = require("jsonwebtoken");
const mailerTransport = require("../mailer");

require("dotenv").config();

exports.signup = async (req,res) =>{
    try {
        // get the  data from the request
        const {name,email,password,role} = req.body;

        // Check for null or empty strings
    if (!name.trim() || !email.trim() || !password.trim() || !role.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details",
      });
    }
    
    //  if(!email.toLowerCase().endsWith('@gmail.com')){
    //     return res.status(400).json({
    //         success: false,
    //         message: "Valid email required",
    //       });
    //  }
    // Check password length and character types
    if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }

        // find the user in database

        const existingUser = await User.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        // if user is not present in database hash the password

        let hashPassword;
        try {
            hashPassword = await bcrypt.hash(password,10);
        } catch (error) {
            return res.status(500).json({
                success:false,
                message : "error in hashing password"
            })
        }

        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            role
        })

        const mailOptions = {
            from: 'Todo App Team ',
            to: newUser.email,
            subject: 'Registration Successful',
            html: `
              <html>
                <head>
                  <title>Registration Successful</title>
                </head>
                <body>
                  <h1>Thank you for registering!</h1>
                  <p>Dear ${newUser.name},</p>
                  <p>Welcome to our Todo App. Your registration was successful.</p>
                  <p>Here are your registration details:</p>
                  <ul>
                    <li><strong>Name:</strong> ${newUser.name}</li>
                    <li><strong>Email:</strong> ${newUser.email}</li>
                    <li><strong>Role:</strong> ${newUser.role}</li>
                  </ul>
                  <p>We hope you enjoy using our app.</p>
                  <p>Best regards,</p>
                  <p>Your Todo App Team</p>
                </body>
              </html>
            `,
          };
      
          mailerTransport.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });

          console.log("mail format " , mailOptions)

        return res.status(200).json({
            success: true,
            message: 'User created successfully, confirmation email has been sent',
        });

    } catch (error) {
        console.log("error in signup data " ,error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered",
        })
    }
};

exports.login = async (req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.json({
                success:false,
                message: "Please fill all the field",
            })
        }

        const user = await User.findOne({email});
        if(!user){
            return res.json({
                success: false,
                message:"User is not Registerd"
            })
        }

        
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }
          
        console.log("payload ", payload)
         
        if(await bcrypt.compare(password,user.password)){




            const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2h"})
            
            console.log("token" , token);
            res.cookie('token', token, { httpOnly: true });

            return res.json({
                success: true,
                message: "Login successful",
                token: token,
                user_id:payload.id
            });
        }
        else{
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure',
        });
    }
}