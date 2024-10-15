
export interface Member {
    username: string;
    id: string;
    avatar: string;
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
    oldPassword: string;
    avatar: File | null;
}

export interface SignUpForm {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
    avatar: File | null;
}