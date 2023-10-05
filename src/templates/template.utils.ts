export function validateToken(token: string) {
  return (param: string) => !param.includes(' ') && param.trim().split(' ')[0].toLowerCase() === token;
}