import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import nodemailer from 'nodemailer';
import { devLog } from '@/utils/logging';
import { generateQRCode } from '@/utils/qrCode';

const stripeSecretKey = process.env.NODE_ENV === 'production'

    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_TEST_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey!, {
    apiVersion: '2024-06-20',
});


// Inicialize o Firebase Admin se ainda não estiver inicializado

if (!getApps().length)

    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });

const db = getFirestore();

async function sendEmail(to: string, subject: string, text: string, qrCodeDataUrl: string) {
    let transporter;
    let testAccount;

    if (process.env.NODE_ENV === 'development') {
        // Criar uma conta de teste Ethereal
        testAccount = await nodemailer.createTestAccount();
        // Criar um transporter Ethereal
        transporter = nodemailer.createTransport({

            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    } else {
        // Configuração para produção
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    let info = await transporter.sendMail({
        from: '"LovYou" <noreply@lovyou.com>',
        to: to,
        subject: subject,
        text: text,
        attachments: [
            {
                filename: 'qrcode.png',
                content: qrCodeDataUrl.split(';base64,').pop(),
                encoding: 'base64',

            },
        ],
    });
    if (process.env.NODE_ENV === 'development') {
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } else {
        devLog("Message sent: %s", info.messageId);
    }
}

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') as string;
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const siteId = session.metadata?.siteId;
        if (siteId) {
            const siteRef = db.collection('sites').doc(siteId);
            const siteDoc = await siteRef.get();
            const siteData = siteDoc.data();

            if (siteData) {
                await siteRef.update({ paid: true });

                if (session.customer_email) {
                    const customUrl = siteData.customUrl;
                    const uniqueHash = siteData.uniqueHash;
                    const qrCodeDataUrl = await generateQRCode(customUrl);
                    await sendEmail(
                        session.customer_email,
                        "Seu site LovYou está pronto!",
                        `Parabéns! Seu site LovYou foi criado com sucesso. 
            Você pode acessá-lo em: ${process.env.NEXT_PUBLIC_BASE_URL}/${customUrl}

            Para desbloquear seu site, use o seguinte código: ${uniqueHash}
            Guarde este código em um lugar seguro, pois você precisará dele para fazer alterações no seu site no futuro.

            Anexamos um QR code que você pode escanear para acessar seu site diretamente.`,
                        qrCodeDataUrl
                    );
                }
            }
        }
        return NextResponse.json({ success: true });

    }

    return NextResponse.json({ received: true });
}

export async function GET(req: Request) {
    if (process.env.NODE_ENV === 'development') {
        const testCustomUrl = 'test-couple';
        const testEmail = 'test@example.com';
        const qrCodeDataUrl = await generateQRCode(testCustomUrl);
        try {
            await sendEmail(
                testEmail,
                "Seu site LovYou está pronto!",

                `Parabéns! Seu site LovYou foi criado com sucesso. 

                Você pode acessá-lo em: ${process.env.NEXT_PUBLIC_BASE_URL}/${testCustomUrl}
                Para desbloquear seu site, use o seguinte código: TEST_HASH
                Guarde este código em um lugar seguro, pois você precisará dele para fazer alterações no seu site no futuro.

                Anexamos um QR code que você pode escanear para acessar seu site diretamente.`,

                qrCodeDataUrl
            );

            return NextResponse.json({ success: true, message: 'Test email sent. Check console for preview URL.' });
        } catch (error) {
            console.error('Error sending test email:', error);
            return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 });
        }
    }

    return NextResponse.json({ error: 'Test route only available in development' }, { status: 403 });
}
