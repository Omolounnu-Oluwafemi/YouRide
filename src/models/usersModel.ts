import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Trip, TripCreationAttributes } from './trip';
interface UserAttributes {
  userId: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  ssoProvider: string;
  googleId: string;
  facebookId: string;
  appleId: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> { }

class User extends Model<UserAttributes, UserCreationAttributes> {
  public userId!: string;
  public phoneNumber!: string;
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public ssoProvider!: string;
  public googleId!: string;
  public facebookId!: string;
  public appleId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public static associate(models: { [key: string]: any }) {
    User.hasMany(models.Trip, { foreignKey: 'userId', as: 'trips'});
  }
  // Add the createTrip method to the User class
  public createTrip!: (trip: TripCreationAttributes) => Promise<Trip>;
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
      ssoProvider: {
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