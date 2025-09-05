function sanitizeUser(user: any) {
  const { passwordHash, ...rest } = user;
  return rest;
}
export { sanitizeUser };
