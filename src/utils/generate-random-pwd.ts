export function generateRandomPwd() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const format = '____-____-____';

  for (let i = 0; i < format.length; i++) {
    if (format[i] === '_') {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    } else {
      result += format[i];
    }
  }

  return result;
}
