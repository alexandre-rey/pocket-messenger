import { PbUtils } from '@/pb.utils';
import React, { useState } from 'react';

import '../styles/register.css';
import { SignUpForm } from '@/interfaces/user.interface';
import { useTranslation } from 'react-i18next';

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
            setError(t('passwordMissmatch'));
            setLoading(false);
            return;
        }

        try {
            await PbUtils.registerUser(form);
            setSuccess(t('registerSuccess'));
        } catch (err) {
            setError(t('registerError'));
        } finally {
            setLoading(false);
        }
    };

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsRegistering(false);
    };

    const { t } = useTranslation();

    return (
        <div className='container center'>
            <div className='register_container'>
                <div className='register_form_container'>
                    <div className='register_header'>
                        <a href='/' onClick={handleBack}>{t('backToLogin')}</a>
                        <h2>{t('register')}</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>{t('username')}</label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>{t('email')}</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>{t('password')}</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>{t('confirmPassword')}</label>
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
                            {loading ? t('registering') : t('register')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
