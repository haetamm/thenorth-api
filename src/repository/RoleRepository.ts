const db = require('../db/models');

class RoleRepository {
  public static async findByName(name: string) {
    try {
      const role = await db.role.findOne({ where: { name } });
      return role;
    } catch (error) {
      console.error('Error finding role by name:', error);
      return null;
    }
  }
}

export default RoleRepository;
