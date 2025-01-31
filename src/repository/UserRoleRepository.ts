const db = require("../db/models");

class UserRoleRepository {
  public static async addUserRole(userId: number, roleId: number) {
    try {
      const userRole = await db.userRole.create({
        user_id: userId,
        role_id: roleId,
      });
      return userRole;
    } catch (error) {
      console.error("Error adding user role:", error);
      return null;
    }
  }
}

export default UserRoleRepository;
