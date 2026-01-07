import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findOne(dto.email);
    if (existingUser) {
      throw new BadRequestException("L'utilisateur existe déjà");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationToken = Math.random().toString(36).substring(2, 15);

    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    await this.mailService.sendVerificationEmail(user.email, verificationToken);
    
    return { message: "Inscription réussie. Veuillez vérifier votre email." };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const users = await this.usersService.findAll();
    const user = users.find(u => u.verificationToken === dto.token);

    if (!user) {
      throw new BadRequestException('Jeton de vérification invalide');
    }

    await this.usersService.update(user.id, {
      isVerified: true,
      verificationToken: null,
    });

    return { message: 'Email vérifié avec succès.' };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findOne(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Veuillez d’abord vérifier votre email');
    }

    const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString();
    const twoFactorExpires = new Date(Date.now() + 5 * 60 * 1000);

    await this.usersService.update(user.id, {
      twoFactorCode,
      twoFactorExpires,
    });

    await this.mailService.sendTwoFactorEmail(user.email, twoFactorCode);

    return { message: 'Code 2FA envoyé à votre adresse email.' };
  }

  async verify2fa(dto: Verify2faDto) {
    const user = await this.usersService.findOne(dto.email);
    if (!user || user.twoFactorCode !== dto.code || !user.twoFactorExpires || new Date() > user.twoFactorExpires) {
      throw new UnauthorizedException('Code 2FA invalide ou expiré');
    }

    await this.usersService.update(user.id, {
      twoFactorCode: null,
      twoFactorExpires: null,
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
