import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Trip, TripCreationAttributes } from './trip';

interface UserAttributes {
  userId: string;
  phoneNumber: string;
  email: string;
  country: string;
  state: string | null;
  firstName: string | null;
  lastName: string | null;
  referralCount: number | null;
  ssoProvider: string;
  googleId: string | null;
  facebookId: string | null;
  appleId: string | null;
  verificationCode: string | null;
  userRating: number | null;
  numberOfRatings: number;
  profileImage: string | null;
  communicationMethod: string | null;
  workAddress: string | null;
  homeAddress: string | null;
  wallet: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  public userId!: string;
  public phoneNumber!: string;
  public email!: string;
  public country!: string;
  public state!: string | null;
  public firstName!: string | null;
  public lastName!: string | null;
  public referralCount!: number;
  public ssoProvider!: string;
  public googleId!: string | null;
  public facebookId!: string | null;
  public appleId!: string | null;
  public verificationCode!: string | null;
  public userRating!: number | null;
  public numberOfRatings!: number;
  public profileImage!: string | null;
  public communicationMethod!: string | null;
  public workAddress!: string | null;
  public homeAddress!: string | null;
  public wallet!: number;

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
      wallet: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      state: {
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
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
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
      userRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true,
      },
      numberOfRatings: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      profileImage: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      communicationMethod: { 
        type: DataTypes.ENUM('Call', 'Chat', 'Call or Chat'),
        allowNull: true,
      },
      homeAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      workAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
     },
    {
      sequelize,
      tableName: 'Users',
    }
  );

  return User;
};

export { User, initUser };