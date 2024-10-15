import { SignUpForm } from '@/interfaces';
import { PbUtils } from '@/pb.utils';
import React, { useState } from 'react';

import '../styles/register.css';

interface Props {
    setIsRegistering: (isRegistering: boolean) => void;
}

const Register: React.FC<Props> = ({ setIsRegistering }: Props) => {
    const [form, setForm] = useState<SignUpForm>({
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        avatar: null,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setForm((prev) => ({ ...prev, avatar: files ? files[0] : null }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (form.password !== form.passwordConfirm) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        try {
            await PbUtils.registerUser(form);
            setSuccess('Inscription réussie ! Veuillez vérifier votre email.');
        } catch (err) {
            setError('Erreur lors de l’inscription');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsRegistering(false);
    };

    return (
        <div className='container center'>
            <div className='register_container'>
                <div className='register_form_container'>
                    <div className='register_header'>
                        <a href='/' onClick={handleBack}>Back</a>
                        <h2>S’inscrire</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="passwordConfirm"
                                value={form.passwordConfirm}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Avatar</label>
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </div>

                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? 'En cours...' : 'S’inscrire'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
