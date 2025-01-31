const bcrypt = require("bcrypt");

("use strict");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Cek dan insert role USER jika belum ada
    const userRole = await queryInterface.rawSelect(
      "roles",
      {
        where: { name: "USER" },
      },
      ["id"]
    );

    if (!userRole) {
      await queryInterface.bulkInsert("roles", [
        {
          name: "USER",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
      console.log("Role USER berhasil ditambahkan.");
    } else {
      console.log("Role USER sudah ada, skip insert.");
    }

    // 2. Cek dan insert role ADMIN jika belum ada
    const adminRole = await queryInterface.rawSelect(
      "roles",
      {
        where: { name: "ADMIN" },
      },
      ["id"]
    );

    if (!adminRole) {
      await queryInterface.bulkInsert("roles", [
        {
          name: "ADMIN",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
      console.log("Role ADMIN berhasil ditambahkan.");
    } else {
      console.log("Role ADMIN sudah ada, skip insert.");
    }

    // 3. Cek dan insert user dengan username = user123 jika belum ada
    const user123 = await queryInterface.rawSelect(
      "users",
      {
        where: { username: "user123" },
      },
      ["id"]
    );

    if (!user123) {
      // Insert user user123
      await queryInterface.bulkInsert("users", [
        {
          username: "user123",
          password: await bcrypt.hash("123456", 10),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      // Dapatkan ID user yang baru diinsert
      const userId = await queryInterface.rawSelect(
        "users",
        {
          where: { username: "user123" },
        },
        ["id"]
      );

      // Dapatkan role_id untuk USER
      const userRoleId = await queryInterface.rawSelect(
        "roles",
        {
          where: { name: "USER" },
        },
        ["id"]
      );

      // Insert relasi user roles
      await queryInterface.bulkInsert("user_roles", [
        {
          user_id: userId,
          role_id: userRoleId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
      console.log("User user123 berhasil ditambahkan dengan role USER.");
    } else {
      console.log("User user123 sudah ada, skip insert.");
    }

    // 4. Cek dan insert user dengan username = admin123 jika belum ada
    const admin123 = await queryInterface.rawSelect(
      "users",
      {
        where: { username: "admin123" },
      },
      ["id"]
    );

    if (!admin123) {
      // Insert user admin123
      await queryInterface.bulkInsert("users", [
        {
          username: "admin123",
          password: await bcrypt.hash("123456", 10),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      // Dapatkan ID user yang baru diinsert
      const userId = await queryInterface.rawSelect(
        "users",
        {
          where: { username: "admin123" },
        },
        ["id"]
      );

      // Dapatkan role_id untuk ADMIN
      const adminRoleId = await queryInterface.rawSelect(
        "roles",
        {
          where: { name: "ADMIN" },
        },
        ["id"]
      );

      // Insert relasi user roles
      await queryInterface.bulkInsert("user_roles", [
        {
          user_id: userId,
          role_id: adminRoleId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
      console.log("User admin123 berhasil ditambahkan dengan role ADMIN.");
    } else {
      console.log("User admin123 sudah ada, skip insert.");
    }
  },

  async down(queryInterface, Sequelize) {
    // Hapus data yang dimasukkan oleh seeder ini
    await queryInterface.bulkDelete("user_roles", null, {});
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("roles", null, {});
  },
};
