export function isRouteProtected(url: string) {
  if (url.includes("/api/users")) {
    return true;
  }
  if (url.includes("/api/product")) {
    return true;
  }
  return false;
}

export function isAdmin(user: any) {
  return user.role.name.toLowerCase() === "Admin".toLowerCase();
}
