export const USER_SUCCESS_MESSAGES = {
  ONBOARDING_COMPLETE: {
    en: 'User onboarding completed successfully.',
    fr: "L'intégration de l'utilisateur a été complétée avec succès.",
    es: 'La incorporación del usuario se completó con éxito.',
    ar: 'اكتمل إعداد المستخدم بنجاح',
  },
  IMAGES_UPLOADED: {
    en: 'User images uploaded successfully.',
    fr: "Les images de l'utilisateur ont été téléchargées avec succès.",
    es: 'Las imágenes del usuario se han subido correctamente.',
    ar: 'تم تحميل صور المستخدم بنجاح',
  },
  USER_DETAILS_RETRIEVED: {
    en: 'User details retrieved successfully.',
    fr: "Les détails de l'utilisateur ont été récupérés avec succès.",
    es: 'Los detalles del usuario se recuperaron con éxito.',
    ar: 'تم استرجاع تفاصيل المستخدم بنجاح',
  },
  SIMILAR_USERS_RETRIEVED: {
    en: 'Users with similar faces retrieved successfully.',
    fr: 'Les utilisateurs ayant des visages similaires ont été récupérés avec succès.',
    es: 'Los usuarios con rostros similares se recuperaron con éxito.',
    ar: 'تم استرجاع المستخدمين ذوي الوجوه المتشابهة بنجاح',
  },
};

export const USER_ERROR_MESSAGES = {
  USER_NOT_FOUND: {
    en: 'User not found',
    fr: 'Utilisateur non trouvé',
    es: 'Usuario no encontrado',
    ar: 'المستخدم غير موجود',
  },
  ALREADY_UPLOADED_PICTURE: {
    en: 'You have already uploaded picture',
    fr: 'Vous avez déjà téléchargé une image',
    es: 'Ya has subido una imagen',
    ar: 'لقد قمت بتحميل الصورة بالفعل',
  },
  NO_FILES_UPLOADED: {
    en: 'No files uploaded',
    fr: 'Aucun fichier téléchargé',
    es: 'No se han subido archivos',
    ar: 'لم يتم تحميل أي ملفات',
  },
  PROFILE_PICTURE_REQUIRED: {
    en: 'Profile picture is required',
    fr: 'La photo de profil est requise',
    es: 'Se requiere foto de perfil',
    ar: 'صورة الملف الشخصي مطلوبة',
  },
  AT_LEAST_ONE_IMAGE_REQUIRED: {
    en: 'At least one image is required',
    fr: 'Au moins une image est requise',
    es: 'Se requiere al menos una imagen',
    ar: 'مطلوب صورة واحدة على الأقل',
  },
  ACCOUNT_SUSPENDED: {
    en: 'Your account is suspended',
    fr: 'Votre compte est suspendu',
    es: 'Tu cuenta está suspendida',
    ar: 'تم تعليق حسابك',
  },
  NO_VERIFICATION_IMAGE_UPLOADED: {
    en: 'No verification image uploaded',
    fr: 'Aucune image de vérification téléchargée',
    es: 'No se ha subido ninguna imagen de verificación',
    ar: 'لم يتم تحميل أي صورة للتحقق',
  },
  USER_VERIFICATION_FAILED: {
    en: 'User verification failed',
    fr: "La vérification de l'utilisateur a échoué",
    es: 'La verificación del usuario falló',
    ar: 'فشل التحقق من المستخدم',
  },
  IMAGE_PROCESSING_FAILED: {
    en: 'AWS Rekognition cannot process one of the images. Make sure it is a valid JPEG/PNG with a clear face.',
    fr: "AWS Rekognition ne peut pas traiter l'une des images. Assurez-vous qu'il s'agit d'un JPEG/PNG valide avec un visage clair.",
    es: 'AWS Rekognition no puede procesar una de las imágenes. Asegúrate de que sea un JPEG/PNG válido con un rostro claro.',
    ar: 'لا يمكن لـ AWS Rekognition معالجة إحدى الصور. تأكد من أنها JPEG/PNG صالحة وبها وجه واضح.',
  },
};
