// bus-server/src/User/loginController.ts
import { prisma } from "../config/db";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { hash, compare } from "bcrypt";
import { sendMail } from "../utils/mail";
import { generateOTP } from "../utils/otp";
import { BaseUrl } from "../config/constvariables";
import dotenv from "dotenv";
dotenv.config();

export interface VerifyEmailAndOTPRequest {
  otp: string;
  email: string;
  password: string;
}

export const userRegisterController = async (req: Request, res: Response) => {
  try {
    const { username, email, password, phoneNumber, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(StatusCodes.FORBIDDEN).json("User already exists");
    }

    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        role,
      },
    });

    const emailOptions = {
      to: user.email,
      subject: "Welcome ",
      html: `<p>Dear ${user.username},</p>
              <p>Thank you for registering with us. We're excited to have you on board.</p>
              <p>Best regards,<br>${BaseUrl}</p>`,
    };
    await sendMail(emailOptions);

    if (role === "ADMIN") {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          group: user.id,
        },
      });
    }

    return res.status(StatusCodes.OK).json({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed to register user",
      error: error?.stack || error?.message || error,
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json("User not found");
    }
    const verifyPassword = await compare(password, user.password);

    if (!verifyPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).send("Invalid Password");
    }

    // Return user details including the user ID
    return res.status(StatusCodes.OK).json({
      userId: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      group: user.group,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed to authenticate user",
      error: error?.stack || error?.message || error,
    });
  }
};

export const userForgotPasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json("User not found");
    }

    const otp = generateOTP(); // Generate OTP here

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: otp,
      },
    });

    // Send OTP to user through your preferred method (e.g., email or SMS)
    // Example email sending code:
    const emailOptions = {
      to: user.email,
      subject: "OTP for Password Reset",
      html: `<p>Dear ${updatedUser.username},</p>
              <p>Your OTP for password reset is: ${otp}</p>
              <p>If you did not request this, please ignore this message.</p>
              <p> use this link to updat or your mobile app ${BaseUrl}/update/password </p>
              <p>Best regards,<br>${BaseUrl} Team</p>`,
    };

    await sendMail(emailOptions);

    return res
      .status(StatusCodes.OK)
      .json("OTP sent to your email account for password reset");
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed to send OTP for password reset",
      error: error?.stack || error?.message || error,
    });
  }
};

export const verifyEmailAndOTP = async (req: Request, res: Response) => {
  try {
    const { otp, email, password } = req.body as VerifyEmailAndOTPRequest;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json("Invalid email");
    }

    // Verify OTP
    if (user.token !== otp) {
      return res.status(StatusCodes.BAD_REQUEST).json("Invalid OTP");
    }

    // Clear the OTP after successful verification
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: null,
      },
    });

    // Update the password
    const hashedPassword = await hash(password, 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Send email notification
    const emailOptions = {
      to: user.email,
      subject: "Password Reset Successful",
      html: `<p>Dear ${user.username},</p>
              <p>Your password has been successfully reset.</p>
              <p>If you did not perform this action, please contact support immediately.</p>
             
              <p>Best regards,<br>${BaseUrl} Team</p>`,
    };

    await sendMail(emailOptions);

    return res.status(StatusCodes.OK).json("Password updated successfully");
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: "Failed to verify email and OTP or update password",
      error: error?.stack || error?.message || error,
    });
  }
};

export const updateUserProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, username, email, phoneNumber } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return res.status(StatusCodes.NOT_FOUND).json("iligal request !!!!! ");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        email,
        phoneNumber,
      },
    });

    // Send email notification after profile update
    const emailOptions = {
      to: updatedUser.email,
      subject: "Profile Updated",
      html: `<p>Dear ${updatedUser.username},</p>
              <p>Your profile has been successfully updated.</p>
              <p>Thank you for keeping your information up-to-date.</p>
              <p>Best regards,<br>Your App Team</p>`,
    };
    await sendMail(emailOptions);

    return res.status(StatusCodes.OK).json(updatedUser);
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update user profile",
      error: error?.stack || error?.message || error,
    });
  }
};
