import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { Secret } from './user.interface';

@Injectable()
export class TwoFactorAuthService {

    constructor() { }

    generateSecret(email: string): Promise<Secret> {
        return speakeasy.generateSecret({ name: `ImageHub (${email})` });
    }

    generateQrCode(secret): Promise<string> {
        return qrcode.toDataURL(secret.otpauth_url);
    }

    verifyToken(token, secret) {
        return speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token,
        });
    }

}
