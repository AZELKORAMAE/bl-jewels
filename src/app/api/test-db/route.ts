import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'not defined';
        const maskedUri = MONGODB_URI.includes('@')
            ? MONGODB_URI.split('@')[0].split(':').slice(0, 2).join(':') + ':****@' + MONGODB_URI.split('@')[1]
            : MONGODB_URI;

        console.log('API Test Route: Starting connection test...');
        await dbConnect();

        const dbState = mongoose.connection.readyState;
        const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

        return NextResponse.json({
            success: true,
            message: 'Connexion réussie à MongoDB !',
            status: states[dbState] || 'unknown',
            uri_type: MONGODB_URI.includes('cluster0') ? 'Atlas (Cloud)' : 'Local',
            uri_preview: maskedUri
        });
    } catch (error: any) {
        console.error('API Test Route Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Échec de la connexion à MongoDB',
            error: error.message,
            stack: error.stack,
            tip: error.message.includes('IP not whitelisted')
                ? 'Votre adresse IP n\'est pas autorisée dans MongoDB Atlas. Allez dans Network Access et ajoutez 0.0.0.0/0.'
                : error.message.includes('Authentication failed')
                    ? 'Le mot de passe dans votre fichier .env.local est incorrect.'
                    : 'Vérifiez votre connexion internet ou si le serveur a besoin d\'un redémarrage.'
        }, { status: 500 });
    }
}
