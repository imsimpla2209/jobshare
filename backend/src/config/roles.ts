const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers', 'dashboard', 'backup', 'manageContents'],
}

export const roles: string[] = Object.keys(allRoles)
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles))
