const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        // extract token 
        const token = req.body.token || req.cookies.token || req.headers.authorization?.split(" ")[1];
        console.log("token through body", req.body.token );
        console.log("token through header", req.cookies.token );

        console.log("token through Auth", req.headers.authorization?.split(" ")[1]);


        // checking token is null
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        // verifying token with your secret key
        try {
            console.log("row token", token);
            console.log("jwt secret", process.env.JWT_SECRET)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decoded token", decoded);
            
            req.user = decoded;
            next();
        } catch (error) {
            console.log("error in decoding token");
            return res.status(401).json({
                success: false,
                message: "Token is invalid" + error.message
            });
        }

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token"
        });
    }
}

exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified"
        });
    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for admins"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified"
        });
    }
}
