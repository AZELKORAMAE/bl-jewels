'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Identifiants invalides');
            } else {
                router.push('/admin');
            }
        } catch (err) {
            setError('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-light/30 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-light">
                <div className="text-center mb-8">
                    <span className="text-gold-primary text-3xl mb-4 block">✦</span>
                    <h1 className="text-2xl font-heading mb-2">Accès Bijouterie</h1>
                    <p className="text-sm text-gray-elegant">Gestion du store privé</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-error/10 text-error text-xs p-3 rounded-lg border border-error/20 text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="mon-store@luxe.com"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Mot de passe</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn btn-gold w-full btn-lg ${loading ? 'btn-loading' : ''}`}
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => alert('Veuillez contacter le support à azelkoramae@gmail.com pour réinitialiser votre accès.')}
                            className="text-xs text-gray-elegant hover:text-gold-primary transition-colors hover:underline"
                        >
                            Mot de passe oublié ?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
