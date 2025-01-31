class GettedUser {
  id: number;
  username: string;
  createdAt: Date;
  deletedAt: Date | null;
  roles: string[];

  constructor(payload: {
    id: number;
    username: string;
    createdAt: Date;
    deletedAt: Date | null;
    roles: string[];
  }) {
    const { id, username, createdAt, deletedAt, roles } = payload;
    this.id = id;
    this.username = username;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
    this.roles = roles ? roles.map((role: any) => role.name) : [];
  }
}

export default GettedUser;
