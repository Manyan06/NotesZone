export const getUserAccess = (note, userId) => {
  if (!note || !userId) return null;
  if (String(note.owner) === String(userId)) return "owner";
  const shared = note.sharedWith.find(sw => String(sw.user) === String(userId));
  if (!shared) return null;
  return shared.role === "editor" ? "editor" : "viewer";
};

export const hasAccess = (note, userId, allowed = []) => {
  const access = getUserAccess(note, userId);
  return access && allowed.includes(access);
};
