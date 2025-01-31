const db = require("../db/models");

class UserRepository {
  static async getUsers(page = 1, limit = 10) {
    try {
      const totalCount = await db.user.count({
        include: [
          {
            model: db.role,
            as: "roles",
            where: {
              name: {
                [db.Sequelize.Op.ne]: "ADMIN", // Filter agar tidak mengambil user dengan role ADMIN
              },
            },
            required: true, // Hanya ambil user yang memiliki role (mencegah user tanpa role masuk)
          },
        ],
        paranoid: false,
      });

      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = Math.max(1, Math.min(page, totalPages));

      const data = await db.user.findAll({
        attributes: [
          "id",
          "username",
          "created_at",
          "updated_at",
          "deleted_at",
          "expried_token",
        ],
        include: [
          {
            model: db.role,
            as: "roles",
            where: {
              name: {
                [db.Sequelize.Op.ne]: "ADMIN",
              },
            },
            required: true,
          },
        ],
        offset: (currentPage - 1) * limit,
        limit: limit,
        paranoid: false,
      });

      return {
        data,
        currentPage,
        totalPages,
        totalCount,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async getUserById(id: number) {
    try {
      const user = await db.user.findOne({
        where: { id: id },
        include: [
          {
            model: db.role,
            through: { attributes: [] },
            attributes: ["name"],
          },
        ],
        paranoid: false,
      });
      return user ? user : false;
    } catch (err) {
      console.error(err);
    }
  }

  public static async deleteUser(id: number) {
    try {
      await db.user.destroy({
        where: { id: id },
      });
    } catch (err) {
      console.error(err);
    }
  }

  public static async addUser(username: string, password: string) {
    try {
      const user = await db.user.create({ username, password });
      return user ? user : false;
    } catch (err) {
      console.error(err);
    }
  }

  public static async getUserByUsername(username: string) {
    try {
      const user = await db.user.findOne({
        where: { username },
        include: [
          {
            model: db.role,
            through: { attributes: [] },
            attributes: ["name"],
          },
        ],
        paranoid: false,
      });

      return user || null;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public static async updateUserById(
    id: Number,
    username: string,
    password?: string
  ) {
    try {
      const updates: any = { username };
      if (password) {
        updates.password = password;
      }
      await db.user.update(updates, { where: { id } });
    } catch (err) {
      console.error(err);
    }
  }

  public static async reactivateUser(username: string) {
    try {
      await db.user.update(
        { deleted_at: null },
        { where: { username }, paranoid: false }
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public static async updateExpriedToken(expried_token: Date, id: Number) {
    try {
      console.log(`expried ${expried_token}`);
      await db.user.update(
        { expried_token: expried_token },
        { where: { id: id } }
      );
    } catch (err) {
      console.log(err);
    }
  }
}

export default UserRepository;
