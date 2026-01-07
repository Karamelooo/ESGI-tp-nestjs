import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/auth/verify-email?token=${token}`;
    await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM'),
      to: email,
      subject: 'Vérifiez votre adresse email',
      html: `<p>Veuillez cliquer ici pour vérifier votre email : <a href="${url}">${url}</a></p>`,
    });
  }

  async sendTwoFactorEmail(email: string, code: string) {
    await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM'),
      to: email,
      subject: 'Votre code de connexion 2FA',
      html: `<p>Votre code de connexion est : <strong>${code}</strong></p>`,
    });
  }
}
