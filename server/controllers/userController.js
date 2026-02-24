import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Resume from "../models/Resume.js";

const generateToken = (userId) =>{
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'});
}

// REGISTER
export const registerUser = async(req, res) =>{
    try{    
        const {name, email , password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: 'Missing required fields'})
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name, email, password: hashedPassword
        })

        const token = generateToken(newUser._id)
        newUser.password = undefined;

        return res.status(201).json({token, user: newUser})

    }catch(error){
        return res.status(400).json({message: error.message})
    }
}

// LOGIN
export const loginUser = async(req, res) =>{
    try{    
        const { email , password} = req.body;

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(200).json({token, user})

    }catch(error){
        return res.status(400).json({message: error.message})
    }
}

// GET USER
export const getUserById = async(req, res) =>{
    try{    
        const user = await User.findById(req.userId)

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        user.password = undefined;
        return res.status(200).json({user})

    }catch(error){
        return res.status(400).json({message: error.message})
    }
}

// GET RESUMES
export const getUserResumes = async (req, res) =>{
    try{
        const resumes = await Resume.find({userId: req.userId})
        return res.status(200).json({resumes})

    }catch(error){
        return res.status(400).json({message: error.message})
    }
}
