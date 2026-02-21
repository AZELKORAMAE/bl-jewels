'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function FirstLoginPage() {
    const { data: session, update } = useSession();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 4) {
            setError('Le mot de passe doit faire au moins 4 caractères');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword }),
            });

            const data = await res.json();

            if (data.success) {
                // Force user to login with new password
                // We use signOut to clear the current session and redirect to login page
                await signOut({ callbackUrl: '/admin/login' });
            } else {
                setError(data.error || 'Une erreur est survenue');
            }
        } catch (err) {
            setError('Erreur réseau');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gold-light/20 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gold-primary/20">
                <div className="text-center mb-8">
                    <span className="text-4xl mb-4 block">🆕</span>
                    <h1 className="text-2xl font-heading mb-2">Sécurisez votre accès</h1>
                    <p className="text-sm text-gray-elegant">Première connexion : vous devez changer votre mot de passe temporaire.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-error/10 text-error text-xs p-3 rounded-lg border border-error/20 text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="input-group">
                            <label className="input-label">Nouveau mot de passe</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input border-gold-primary/30"
                                placeholder="Min. 4 caractères"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Confirmez le mot de passe</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input border-gold-primary/30"
                                placeholder="Confirmez pour valider"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn btn-gold w-full btn-lg ${loading ? 'btn-loading' : ''}`}
                    >
                        {loading ? 'Mise à jour...' : 'Activer l\'accès Premium'}
                    </button>
                </form>
            </div>
        </div>
    );
}
