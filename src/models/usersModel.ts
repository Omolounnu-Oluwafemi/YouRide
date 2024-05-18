import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Trip, TripCreationAttributes } from './trip';

interface UserAttributes {
  userId: string;
  phoneNumber: string;
  email: string;
  country: string | null;
  firstName: string;
  lastName: string;
  referralCount: number | null;
  ssoProvider: string;
  googleId: string;
  facebookId: string;
  appleId: string;
  verificationCode: string | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public userId!: string;
  public phoneNumber!: string;
  public email!: string;
  public country!: string;
  public firstName!: string;
  public lastName!: string;
  public referralCount!: number;
  public ssoProvider!: string;
  public googleId!: string;
  public facebookId!: string;
  public appleId!: string;
  public verificationCode!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public static associate(models: { [key: string]: any }) {
    User.hasMany(models.Trip, { foreignKey: 'userId', as: 'trips' });
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
      country: {
        type: DataTypes.STRING,
        allowNull: true,
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
      referralCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
       verificationCode: {
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