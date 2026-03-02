import { authHealthService,sendOtpEmailService,
  sendOtpSmsService, } from "../services/auth.service.js";
import { verifyOtp,storeOtp } from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";
import { sendOtpWhatsAppService } from "../services/auth.service.js";

export const authHealthCheck = (req, res) => {
      const result=authHealthService();
      return res.status(200).json(result);
  };



export const sendOtpEmailController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const result = await sendOtpEmailService(email);
    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP via email",
    });
  }
};

export const sendOtpSmsController = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const result = await sendOtpSmsService(phone);
    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP via SMS",
    });
  }
};


export const sendOtpWhatsAppController = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const result = await sendOtpWhatsAppService(phone);
    return res.status(200).json(result);

  } 
  catch (error) {
    // console.error("WhatsApp Error:", error);
  
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const verifyOtpController = async (req, res) => {
// try {
//   const { email, otp } = req.body;

//   // basic validation
//   if (!email || !otp) {
//     return res.status(400).json({
//       success: false,
//       message: "Email and OTP are required",
//     });
//   }
//   // console.log(" user entered otp: ",otp);
//   const result = await verifyOtp(email, otp);

//   if (!result.success) {
//     return res.status(400).json(result);
//   }

//   // ✅ OTP verified → generate JWT
//   const token = generateToken({ email });
  
//   return res.status(200).json({
//     success: true,
//     message: "OTP verified successfully",
//     token,
//   });
// } catch (error) {
//   return res.status(500).json({
//     success: false,
//     message: "Internal server error",
//   });
// }
// };



// handling all three verifications in one function
export const verifyOtpController = async (req, res) => {
  try {
    const { identifier, type, otp } = req.body;

    // Basic validation
    if (!identifier || !type || !otp) {
      return res.status(400).json({
        success: false,
        message: "Identifier, type and OTP are required",
      });
    }

    const result = await verifyOtp(identifier, type, otp);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Generate JWT after successful OTP
    const token = generateToken({ identifier, type });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getMeController = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};
