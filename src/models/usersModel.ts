import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface UserAttributes {
  userId: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  ssoProvider: string;
  googleId: string;
  appleId: string;
  facebookId: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public userId!: string;
  public phoneNumber!: string;
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public ssoProvider!: string;
  public googleId!: string;
  public appleId!: string;
  public facebookId!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initUser = (sequelize: Sequelize) => {
  User.init(
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ssoProvider: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
        facebookId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      appleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'Users',
    }
  );
};

export { User, initUser };