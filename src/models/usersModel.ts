import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Ride } from '../models/ride';

interface UserAttributes {
  userId: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  ssoProvider: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
 
  public userId!: string;
  public phoneNumber!: string;
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public ssoProvider!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
   public static associate(models: { [key: string]: any }) {
    User.hasMany(models.Ride, { foreignKey: 'userId', as: 'rides' });
  }
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
    },
    {
      sequelize,
      tableName: 'User',
    }
  );
};

export { User, initUser };