import { Router, Request, Response, response } from 'express';
import dotenv from 'dotenv';
import { SignupModel } from './models/Entities/UserEntity';


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

    // private verifyOtp = async (req: Request, res: Response): Promise<any> => {
    //     try {
    //         const verifyOtpDto: VerifyOtpDto = req.body;
    //         const response = await this.adw_OtpService.handleVerifyOtp(verifyOtpDto);
    //         return res.status(HttpStatus.OK).json(response);
    //     } catch (error) {
    //         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //             status: ApiResponse.ERROR,
    //             message: "Internal Server Error",
    //         });
    //     }
    // }

    // private generateOtp = async (req: Request, res: Response) => {
    //     const generateOtpDto: GenerateOTPDto = req.body;
    //     if (!generateOtpDto.mobile_number || !/^\d{10}$/.test(generateOtpDto.mobile_number)) {
    //         res.status(400).json({ error: "Mobile number must be exactly 10 digits" });
    //         return;
    //     }
    //     const mobileNo = generateOtpDto.mobile_number;
    //     const source = generateOtpDto.source;
    //     try {
    //         const timestamp = new Date();
    //         const currTimeStamp = timestamp.getTime();
    //         const otp = Math.floor(Math.random() * 9000) + 1000;
    //         const adw_otp = await ADWLeadsEntity.findOne({ mobileNo, source });
    //         if (adw_otp == null) {
    //             const lead = new ADWLeadsEntity({
    //                 mobileNo: mobileNo,
    //                 otp,
    //                 otp_count: 1,
    //                 otp_verified: false,
    //                 source,
    //                 timestamp: currTimeStamp,
    //             });
    //             await lead.save();
    //         } else {
    //             adw_otp.otp = otp;
    //             adw_otp.otp_verified = false;
    //             adw_otp.otp_count = adw_otp.otp_count ? adw_otp.otp_count + 1 : 1;
    //             adw_otp.timestamp = currTimeStamp;
    //             await adw_otp.save();
    //         }
    //         const templateId = process.env.TEMPLATE_ID_OTP_GEN;
    //         if (!templateId) {
    //             throw new Error('TEMPLATE_ID_OTP_GEN  variable is not defined.');
    //         }
    //         const sendSmsReqDto: SendSmsReqDto = new SendSmsReqDto();
    //         sendSmsReqDto.toMobNumber = mobileNo;
    //         sendSmsReqDto.templateId = Number(templateId);
    //         sendSmsReqDto.templateParams = {};
    //         sendSmsReqDto.templateParams["1"] = String(otp);
    //         const error = await this.phoenixServices.sendSmsNotification(sendSmsReqDto);
    //         //const error=false;
    //         if (error) {
    //             res.json({ message: "Failed to send otp", status: "failed" });
    //         } else {
    //             res.json({ message: "Otp sent successfully", status: "success" });
    //         }
    //     } catch (e) {
    //         console.error("Error in sending otp", e);
    //         res.status(500).json({ error: "Failed to send otp", status: "failed" });
    //     }
    // };

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

