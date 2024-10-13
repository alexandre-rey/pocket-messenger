import pb from '@/pocketbase';
import React, { useState, useEffect, useContext } from 'react';

import '../styles/settings.css';
import { DispatchContext } from '@/state/state.context';
import { Action, ActionType } from '@/state/action';

interface UserProfile {
    id: string;
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
    oldPassword: string;
    avatar: File | null;
    verified: boolean;
}

const Settings = () => {
    const [profile, setProfile] = useState<UserProfile>({
        id: '',
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        oldPassword: '',
        avatar: null,
        verified: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const dispatch = useContext(DispatchContext);

    useEffect(() => {
        // Récupérer les infos de l'utilisateur connecté
        const getProfile = async () => {
            try {
                const user = (await pb.collection<UserProfile>('users').authRefresh()).record;
                setProfile({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    password: '',
                    passwordConfirm: '',
                    oldPassword: '',
                    avatar: null, // A gérer pour afficher l'avatar si nécessaire
                    verified: user.verified || false,
                });
            } catch (err) {
                console.error(err);
            }
        };

        getProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setProfile((prev) => ({ ...prev, [name]: checked }));
        } else if (type === 'file') {
            setProfile((prev) => ({ ...prev, avatar: files ? files[0] : null }));
        } else {
            setProfile((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (profile.password !== profile.passwordConfirm) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('username', profile.username);
        formData.append('email', profile.email);
        formData.append('oldPassword', profile.oldPassword);
        formData.append('password', profile.password);
        formData.append('passwordConfirm', profile.passwordConfirm);

        if (profile.avatar) {
            formData.append('avatar', profile.avatar);
        }

        try {
            await pb.collection('users').update(profile.id, formData);

            let action: Action = { type: ActionType.SET_LOGGED, payload: { isLogged: true, username: pb.authStore.model?.username } };

            if (profile.password !== '' && profile.passwordConfirm !== '' && profile.oldPassword !== '') {
                action = { type: ActionType.SET_LOGGED, payload: { isLogged: false } };
                pb.authStore.clear();
            }

            dispatch && dispatch(action);

            setSuccess('Profil mis à jour avec succès');
        } catch (err) {
            setError('Erreur lors de la mise à jour du profil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='settings_container'>
            <div className='settings_form_container'>
                <form onSubmit={handleSubmit} className='settings_form'>
                    <div
                        className='settings_profile_section'>
                        <h3>Profile</h3>
                        <div>
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={profile.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
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
                    </div>


                    <div className='settings_password_section'>
                        <h3>Change password</h3>
                        <p className='settings_hint' >Leave empty if you don't want to change your password</p>
                        <div>
                            <label>Old password</label>
                            <input
                                type="password"
                                name="oldPassword"
                                value={profile.oldPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>New password</label>
                            <input
                                type="password"
                                name="password"
                                value={profile.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Confirm new password</label>
                            <input
                                type="password"
                                name="passwordConfirm"
                                value={profile.passwordConfirm}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
