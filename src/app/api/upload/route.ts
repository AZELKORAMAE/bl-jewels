import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'Aucun fichier n\'a été envoyé.' },
                { status: 400 }
            );
        }

        // Convertir le fichier en Base64 pour stockage direct en base de données
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

        return NextResponse.json({
            success: true,
            url: base64Image,
        });
    } catch (error: any) {
        console.error('Erreur lors de l\'upload:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur lors du traitement de l\'image.' },
            { status: 500 }
        );
    }
}
