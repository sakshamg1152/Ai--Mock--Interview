import bcrypt , {hash} from "bcrypt";
import {User} from "../models/user.model.js";
import httpStatus from "http-status";
import crypto from "crypto";

const changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        const user = await User.findById(req.user._id);

        const isCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isCorrect) {

            return res.status(400).json({
                message: "Current password is incorrect"
            });

        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            message: "Password changed successfully"
        });

    }

    catch(err){

        return res.status(500).json({
            message: err.message
        });

    }

};



const login = async (req,res)=>{
    const { username , password } = req.body;
    if(!username || !password){
        return res.status(400).json({
            message : "Please provide username and password"
        });
    }
    try{
        const user = await User.findOne({ username });

        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({
                message : "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password , user.password);

        if(isMatch){
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({
                message: "Login Successful",
                token: token,
                user: {
                    _id: user._id,
                    username: user.username,
                    name: user.name
                }
            });
        }else{
            return res.status(httpStatus.UNAUTHORIZED).json({
                message : "Invalid username and password"
            });
        }

    }catch(e){
        return res.status(400).json({
            message : `Something went wrong ${e}`
        });
    }
}


const register = async (req,res)=>{
    const { name , username , password } = req.body;

    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message : "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name:name,
            username: username,
            password : hashedPassword,
        });

        await newUser.save();
        res.status(httpStatus.CREATED).json({message : "User Registered"});

    }catch(e){
        return res.status(400).json({message : `Something went wrong ${e}`});
    }
}

export { login, register , changePassword}