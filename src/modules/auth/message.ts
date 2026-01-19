export const AUTH_SUCCESS_MESSAGES = {
  OTP_SENT: {
    en: 'A One-Time Password (OTP) has been sent to your email.',
    fr: 'Un mot de passe à usage unique (OTP) a été envoyé à votre adresse e-mail.',
    es: 'Se ha enviado una contraseña de un solo uso (OTP) a su correo electrónico.',
    ar: 'تم إرسال كلمة مرور لمرة واحدة (OTP) إلى بريدك الإلكتروني.',
  },
  SIGNUP_COMPLETED: {
    en: 'Signup has been completed',
    fr: "L'inscription a été complétée",
    es: 'El registro se ha completado',
    ar: 'تم إكمال التسجيل',
  },
  LOGIN_COMPLETED: {
    en: 'Login has been completed',
    fr: 'La connexion a été complétée',
    es: 'El inicio de sesión se ha completado',
    ar: 'تم إكمال تسجيل الدخول',
  },
  PASSWORD_RESET_OTP_SENT: {
    en: 'A One-Time Password (OTP) has been sent to your email. Please enter it to proceed with the password reset.',
    fr: 'Un mot de passe à usage unique (OTP) a été envoyé à votre adresse e-mail. Veuillez le saisir pour procéder à la réinitialisation du mot de passe.',
    es: 'Se ha enviado una contraseña de un solo uso (OTP) a su correo electrónico. Ingrésela para continuar con el restablecimiento de contraseña.',
    ar: 'تم إرسال كلمة مرور لمرة واحدة (OTP) إلى بريدك الإلكتروني. الرجاء إدخالها للمتابعة في إعادة تعيين كلمة المرور.',
  },
  PASSWORD_UPDATED: {
    en: 'Your password has been successfully updated. Please proceed to log in with your new credentials.',
    fr: 'Votre mot de passe a été mis à jour avec succès. Veuillez vous connecter avec vos nouveaux identifiants.',
    es: 'Su contraseña se ha actualizado correctamente. Proceda a iniciar sesión con sus nuevas credenciales.',
    ar: 'تم تحديث كلمة المرور الخاصة بك بنجاح. يرجى المتابعة لتسجيل الدخول باستخدام بيانات الاعتماد الجديدة.',
  },
};

export const SIGNUP_ERROR_MESSAGES = {
  EMAIL_ALREADY_REGISTERED: {
    en: 'Email already registered',
    fr: 'Email déjà enregistré',
    es: 'Correo electrónico ya registrado',
    ar: 'البريد الإلكتروني مسجل مسبقًا',
  },
};

export const LOGIN_ERROR_MESSAGES = {
  INVALID_EMAIL: {
    en: 'Invalid email',
    fr: 'E-mail invalide',
    es: 'Correo electrónico no válido',
    ar: 'البريد الإلكتروني غير صالح',
  },
  INVALID_CREDENTIALS: {
    en: 'Invalid credentials',
    fr: 'Identifiants invalides',
    es: 'Credenciales inválidas',
    ar: 'بيانات اعتماد غير صالحة',
  },
  APPLE_LOGIN_NOT_IMPLEMENTED: {
    en: 'Apple login not implemented',
    fr: 'Connexion Apple non implémentée',
    es: 'Inicio de sesión con Apple no implementado',
    ar: 'تسجيل الدخول عبر Apple غير مدعوم',
  },
  UNSUPPORTED_PROVIDER: {
    en: 'Unsupported provider',
    fr: 'Fournisseur non pris en charge',
    es: 'Proveedor no soportado',
    ar: 'مزود غير مدعوم',
  },
  INVALID_TOKEN_OR_CREDENTIALS: {
    en: 'Invalid token or credentials',
    fr: 'Jeton ou identifiants invalides',
    es: 'Token o credenciales inválidas',
    ar: 'رمز أو بيانات اعتماد غير صالحة',
  },
  ACCOUNT_SUSPENDED: {
    en: 'Account is suspended',
    fr: 'Le compte est suspendu',
    es: 'La cuenta está suspendida',
    ar: 'الحساب معلق',
  },
};

export const FORGOT_PASSWORD_ERROR_MESSAGES = {
  USER_NOT_FOUND: {
    en: 'User not found',
    fr: 'Utilisateur non trouvé',
    es: 'Usuario no encontrado',
    ar: 'المستخدم غير موجود',
  },
};

export const RESET_PASSWORD_ERROR_MESSAGES = {
  USER_NOT_FOUND: {
    en: 'User not found',
    fr: 'Utilisateur non trouvé',
    es: 'Usuario no encontrado',
    ar: 'المستخدم غير موجود',
  },
  NEW_PASSWORD_SAME_AS_OLD: {
    en: 'New password cannot be the same as the old password',
    fr: 'Le nouveau mot de passe ne peut pas être le même que l’ancien',
    es: 'La nueva contraseña no puede ser igual a la antigua',
    ar: 'لا يمكن أن تكون كلمة المرور الجديدة هي نفسها القديمة',
  },
};
