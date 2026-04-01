import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import configuration from '../../shared/config/configuration';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(configuration.KEY)
    private config: ConfigType<typeof configuration>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.port === 465,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });
  }

  async sendPaymentConfirmation(to: string, userName: string | null) {
    const greeting = userName ? `Hola ${userName}` : 'Hola';
    await this.transporter.sendMail({
      from: `"Test Vocacional IA" <${this.config.mail.from}>`,
      to,
      subject: '¡Tu pago fue confirmado! Continuá tu test',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h1 style="color:#4f46e5">${greeting}!</h1>
          <p>Tu pago fue procesado exitosamente. Ya podés continuar con tu test vocacional y recibir tu informe completo.</p>
          <a href="${this.config.app.url}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">
            Continuar mi test
          </a>
          <p style="margin-top:32px;color:#6b7280;font-size:14px">Gracias por elegirnos.</p>
        </div>
      `,
    });
  }

  async sendWelcome(to: string, userName: string | null) {
    const greeting = userName ? `Bienvenido, ${userName}` : 'Bienvenido';
    await this.transporter.sendMail({
      from: `"Test Vocacional IA" <${this.config.mail.from}>`,
      to,
      subject: `¡${greeting} a Test Vocacional IA!`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h1 style="color:#4f46e5">${greeting}!</h1>
          <p>Tu cuenta fue creada exitosamente. Ya podés acceder a tu perfil y ver el historial de tus tests.</p>
          <a href="${this.config.app.url}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">
            Ir a mi cuenta
          </a>
        </div>
      `,
    });
  }
}
