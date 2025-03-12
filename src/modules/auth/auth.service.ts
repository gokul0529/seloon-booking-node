import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Step 1: Find user by email
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) throw new BadRequestException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('User is not active');

    // Step 2: Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    const tokens = this.generateTokens(user);
    return tokens;

  }

  async me(userId: string) {
    const user = await this.userModel.findById(userId)
      .populate('roleId', 'permissions')
      .lean();
    return {
      message: 'User fetched successfully',
      data: user
    }
  }

  private generateTokens(user: UserDocument) {
    const payload = {
      sub: user._id,
      email: user.email,
      orgId: user.orgId,
      roleId: user.roleId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });

    return { accessToken, refreshToken };
  }

  generateAccessToken(user: UserDocument) {
    const payload = {
      sub: user._id,
      email: user.email,
      orgId: user.orgId,
      roleId: user.roleId,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    });
  }

  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
    const { oldPassword, newPassword } = resetPasswordDto;

    // Step 1: Find user by ID
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) throw new BadRequestException('User not found');
    if (!user.isActive) throw new UnauthorizedException('User is not active');

    // Step 2: Check old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    // Step 3: Hash new password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Step 4: Update user's password
    // user.password = hashedPassword;
    user.password = newPassword;
    await user.save();

    return { message: 'Password successfully updated' };
  }

  async logout(userId: string) {
    await this.userModel.updateOne({ _id: userId }, { $set: { refreshToken: null } });
    return { message: 'Logout successfully' };
  }

}
