import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { newPassword } = body;

        if (!newPassword || newPassword.length < 4) {
            return NextResponse.json(
                { success: false, error: 'Mot de passe trop court' },
                { status: 400 }
            );
        }

        await dbConnect();

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await User.findByIdAndUpdate((session.user as any).id, {
            password: hashedPassword,
            mustChangePassword: false,
        });

        return NextResponse.json({
            success: true,
            message: 'Mot de passe mis à jour',
        });
    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors du changement de mot de passe' },
            { status: 500 }
        );
    }
}
