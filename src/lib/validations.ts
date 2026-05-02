export const validateRut = (rut: string): boolean => {
  if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) return false;
  
  let tmp = rut.split('-');
  let digv = tmp[1]; 
  let rutNum = tmp[0];
  
  if(digv === 'K') digv = 'k';
  
  return (dv(rutNum) == digv);
};

const dv = (T: string | number) => {
  let M = 0, S = 1;
  let parsedT = typeof T === 'string' ? parseInt(T, 10) : T;
  for(; parsedT; parsedT = Math.floor(parsedT/10)) {
    S = (S + parsedT % 10 * (9 - M++ % 6)) % 11;
  }
  return S ? S - 1 : 'k';
};

export const formatRut = (rut: string): string => {
  const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (cleanRut.length <= 1) return cleanRut;
  
  const result = cleanRut.slice(-4, -1) + '-' + cleanRut.substr(cleanRut.length - 1);
  for (let i = 4; i < cleanRut.length; i += 3) {
    result.slice(-i - 3, -i) + '.' + result;
  }
  
  let formatted = '';
  let body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);
  
  for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
    formatted = body.charAt(i) + ((j > 0 && j % 3 === 0) ? '.' : '') + formatted;
  }
  
  return `${formatted}-${dv}`;
};

export const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return re.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  if (!/[A-Z]/.test(password)) return { isValid: false, message: 'La contraseña debe contener al menos una mayúscula' };
  if (!/[a-z]/.test(password)) return { isValid: false, message: 'La contraseña debe contener al menos una minúscula' };
  if (!/[0-9]/.test(password)) return { isValid: false, message: 'La contraseña debe contener al menos un número' };
  return { isValid: true, message: '' };
};
