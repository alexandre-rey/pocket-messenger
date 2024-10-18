import React, { useState, useEffect, useContext } from "react";
import "../styles/settings.css";
import { useTranslation } from "react-i18next";

import { DispatchContext } from "@/state/state.context";
import { Action, ActionType } from "@/state/action";
import { PbUtils } from "@/pb.utils";
import { UserProfile } from "@/interfaces/user.interface";

const Settings = () => {
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    oldPassword: "",
    avatar: null,
  });

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const user = await PbUtils.getUserProfile();

        setProfile({
          id: user.id,
          username: user.username,
          email: user.email,
          password: "",
          passwordConfirm: "",
          oldPassword: "",
          avatar: null, // A gérer pour afficher l'avatar si nécessaire
        });
      } catch (err) {
        console.error(err);
      }
    };

    getProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setProfile((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
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
      setError(t("passwordMissmatch"));
      setLoading(false);

      return;
    }

    try {
      await PbUtils.updateUser(profile);

      let action: Action = {
        type: ActionType.SET_LOGGED,
        payload: { isLogged: true, username: profile.username },
      };

      if (
        profile.password !== "" &&
        profile.passwordConfirm !== "" &&
        profile.oldPassword !== ""
      ) {
        action = { type: ActionType.SET_LOGGED, payload: { isLogged: false } };
        PbUtils.clearAuth();
      }

      dispatch && dispatch(action);

      setSuccess(t("profileUpdated"));
    } catch (err) {
      setError(t("updateError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings_container">
      <div className="settings_form_container">
        <form className="settings_form" onSubmit={handleSubmit}>
          <div className="settings_profile_section">
            <h3>{t("profile")}</h3>
            <div>
              <label>{t("username")}</label>
              <input
                name="username"
                type="text"
                value={profile.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>{t("email")}</label>
              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="avatar">Avatar</label>
              <input
                accept="image/*"
                id="avatar"
                name="avatar"
                type="file"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="settings_password_section">
            <h3>{t("changePassword")}</h3>
            <p className="settings_hint">{t("leaveEmptyPassword")}</p>
            <div>
              <label>{t("oldPassword")}</label>
              <input
                name="oldPassword"
                type="password"
                value={profile.oldPassword}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>{t("newPassword")}</label>
              <input
                name="password"
                type="password"
                value={profile.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>{t("confirmPassword")}</label>
              <input
                name="passwordConfirm"
                type="password"
                value={profile.passwordConfirm}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <button disabled={loading} type="submit">
            {loading ? t("updatingProfile") : t("updateProfile")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
