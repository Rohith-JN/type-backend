export const validateRegister = (options: {
  username: string;
  email: string;
  password: string;
}) => {
  if (!options.email.includes('@')) {
    return {
      field: 'email',
      message: 'Invalid email format',
    };
  }

  if (options.username.length <= 2) {
    return {
      field: 'username',
      message: 'Username length must be greater than 2',
    };
  }

  if (options.username.includes('@')) {
    return {
      field: 'username',
      message: 'Username cannot include an @',
    };
  }

  if (options.password.length <= 2) {
    return {
      field: 'password',
      message: 'Password length must be greater than 2',
    };
  }

  return null;
};
