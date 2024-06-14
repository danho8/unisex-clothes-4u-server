import { Process, Processor } from '@nestjs/bull';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bull';
import { Transporter, createTransport } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const UNISEX_REGISTER = {
  TemplateName: 'UNISEX_REGISTER',
  SubjectPart: 'Welcome to 4UNISEX!!!',
  TextPart: '',
  HtmlPart: `<div class="container"style="width: 658px;height: auto;margin: 0 auto;border-radius: 14px 14px 0px 0px;background-color: #ffffff;">
  <div class="header" style="width: 658px;height: 133.88px;background-color: #f02a4e;border-radius: 14px 14px 0px 0px;display: flex;justify-content: center;align-items: center;">
    <img src="{img}" alt="Logo 4UNISEX" class="logo" style="width: 210px;height:59px"/>
  </div><div class="content">
    <div class="title" style=" color: blue; width: 431px; height: 39px; color: #0e0d0d; margin: 60px 40px 24px 40px;">
      <h1>Xác minh tài khoản</h1>
    </div>
  </div>
  <div class="registration-confirmation" style="margin: 24px 40px; line-height: 20px; font-size: 14px">
    <p>Chúng tôi rất vui khi thấy bạn đăng ký tài khoản ở <span style="color: #f02a4e">4UNISEX.</span></p>
    <p>Vui lòng xác nhận địa chỉ email <span style="font-weight: bold">{email}</span> bằng cách nhấn vào link bên dưới
    </p>
    <button style=" padding: 14px 16px; background-color: #f02a4e; border: none; border-radius: 14px; margin-top: 15px; margin-bottom: 15px;">
      <a style="color: #ffffff; text-decoration: none" href="{url}" target="_blank">Xác minh email</a>
    </button>
    <p> Nếu bạn không cho phép đăng ký địa chỉ email của mình, đừng lo lắng, bạn chỉ cần bỏ qua email này.</p><hr style="color: red; opacity: 0.2; margin-top: 24px" />
  </div>
  <div class="footer" style=" width: 568px; height: 78px; font-size: 10px; margin: 40px 40px 50px 40px; color: #7f8a98; line-height: 17px;">
    <p>Nếu bạn có bất kỳ câu hỏi, phản hồi, ý tưởng hoặc vấn đề nào, đừng ngần ngại liên hệ với chúng tôi!</p>
    <p>Số điện thoại: 0905 123 456</p>
    <p>Địa chỉ: 122 Tòa nhà ABCD, Hải Châu, Đà Nẵng!</p>
    <p>Email: 4ut@gmail.com</p>
  </div>
</div>
`,
};

@Processor('email')
export class EmailProcessor {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  @Process('sendEmail')
  async sendEmail(job: Job): Promise<any> {
    try {
      const { email, token } = job.data;
      const url = `${process.env.URL_CLIENT}?email=${email}&token=${token}`;
      await this.transporter.sendMail({
        from: `"4UT Unisex - Customer Services" ${process.env.EMAIL}`,
        to: email,
        subject: UNISEX_REGISTER.SubjectPart,
        html: UNISEX_REGISTER.HtmlPart.replace('{email}', email)
          .replace('{url}', url)
          .replace('{img}', process.env.CONFIRMATION_LOGO || ''),
      });
    } catch (error) {
      throw new BadRequestException(
        'Send Email Confirmed Failed!!!',
        error.message,
      );
    }
  }

  @Process('sendOTPByEmail')
  async sendOTPByEmail(job: Job): Promise<any> {
    try {
      const { email, otp } = job.data;
      await this.transporter.sendMail({
        from: `"4UT Unisex - Customer Services" ${process.env.EMAIL}`,
        to: email,
        subject: 'Your OTP Code',
        html: `Your OTP code is: ${otp}`,
      });
    } catch (error) {
      throw new BadRequestException(
        'Send OTP Email Confirmed Failed!!!',
        error.message,
      );
    }
  }
}
