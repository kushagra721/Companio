import { Router, Request, Response, response } from 'express';
import dotenv from 'dotenv';
import { SignupModel } from '../models/UserModel';

dotenv.config();

export class ExternalController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.configureRoutes();
    }

    private configureRoutes(): void {
       // this.router.post('/otp', this.generateOtp);
       // this.router.post('/otp/verify', this.verifyOtp);
        this.router.post('/signUp',this.userSignUp);

    }

    private userSignUp = async (req: Request, res: Response): Promise<any>  => {
        try {
            const { name, mobileNo, profilePic, type, fcmToken, deviceType, uid } = req.body;
    
            // Check if user already exists
            const existingUser = await SignupModel.findOne({ mobileNo });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
    
            // Create new user
            const newUser = new SignupModel({ name, mobileNo, profilePic, type, fcmToken, deviceType, uid });
            await newUser.save();
    
            res.status(200).json({ message: 'User signed up successfully', user: newUser });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    };
    


}

