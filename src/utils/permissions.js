export const ROLE_PERMISSIONS = {
  admin: {
    doctors: {
      view: true,
      create: true,
      edit: true,
      delete: true,
    },

    appointments: {
      view: true,
      create: false,
      edit: true,
      delete: false,
    },

    schedules: {
      view: true,
      create: true,
      edit: true,
      delete: true,
    },

    patients: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
  },

  patient: {
    doctors: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },

    appointments: {
      view: true,
      create: true,
      edit: false,
      delete: false,
    },
  },
};

export const can = (role, module, action) => {
  return ROLE_PERMISSIONS?.[role]?.[module]?.[action] || false;
};
