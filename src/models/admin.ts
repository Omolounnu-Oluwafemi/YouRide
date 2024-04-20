import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface AdminAttributes {
  adminId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  image?: string;
  password: string;
  isActive?: boolean;
}

interface AdminCreationAttributes extends Optional<AdminAttributes, 'adminId'> {}

class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  public adminId!: string;
  public firstName!: string;
  public lastName!: string;
   public email!: string;
  public role!: string;
  public image!: string;
  public password!: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initAdmin = (sequelize: Sequelize) => {
  Admin.init(
    {
      adminId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM,
        values: ['Admin', 'Super Admin'],
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
       isActive: {
         type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }
    },
   {
      sequelize,
      tableName: 'Admins',
    },
  )
}

export { Admin, initAdmin };