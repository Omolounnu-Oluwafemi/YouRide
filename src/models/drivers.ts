import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface DriversAttributes {
  driverId: string;
  categoryId: string | null;
  countryId: string | null;
  phoneNumber: string;
  country: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  category: string;
  referralCode: string;
  vehicleYear: number;
  vehicleManufacturer: string;
  vehicleColor: string;
  licensePlate: string;
  driverLicense: string;
  vehicleLogBook: string;
  privateHireLicenseBadge: string;
  insuranceCertificate: string;
  motTestCertificate: string;
  isAvailable: boolean;
  latitude: string; 
  longitude: string;
  driverRating: number | null;
  numberOfRatings: number;
  
  verificationCode: string | null;
}

interface DriverCreationAttributes extends Optional<DriversAttributes, 'driverId'> {}

class Driver extends Model<DriversAttributes, DriverCreationAttributes> implements DriversAttributes {
  public driverId!: string;
  public categoryId!: string | null;
  public countryId!: string | null;
  public phoneNumber!: string;
  public email!: string;
  public country!: string;
  public firstName!: string;
  public lastName!: string;
  public gender!: string;
  public category!: string;
  public referralCode!: string;
  public vehicleYear!: number;
  public vehicleManufacturer!: string;
  public vehicleColor!: string;
  public licensePlate!: string;
  public driverLicense!: string;
  public vehicleLogBook!: string;
  public privateHireLicenseBadge!: string;
  public insuranceCertificate!: string;
  public motTestCertificate!: string;
  public isAvailable!: boolean;
  public latitude!: string; 
  public longitude!: string; 
  public verificationCode!: string | null;
  public driverRating!: number | null;
  public numberOfRatings!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

   public static associate(models: { [key: string]: any }) {
     Driver.hasMany(models.Trip, { foreignKey: 'driverId', as: 'trips' });
    Driver.belongsTo(models.VehicleCategory, { foreignKey: 'categoryId', as: 'vehicleCategory' });
    Driver.belongsTo(models.Country, { foreignKey: 'countryId', as: 'country' });
  }
}

const initDriver = (sequelize: Sequelize) => {
  Driver.init(
    {
      driverId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
          references: {
            model: 'VehicleCategories',
            key: 'categoryId'
        }
      },
      countryId: {
        type: DataTypes.UUID,
        allowNull: true,
          references: {
            model: 'Countries',
            key: 'countryId'
        }
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
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
      gender: {
        type: DataTypes.ENUM,
        values: ['Male', 'Female', 'Other'],
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      referralCode: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      driverRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true,
      },
      numberOfRatings: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true, 
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      vehicleYear: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vehicleManufacturer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vehicleColor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      licensePlate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
       driverLicense: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vehicleLogBook: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      privateHireLicenseBadge: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      insuranceCertificate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      motTestCertificate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
        verificationCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'Drivers',
    }
  );

  return Driver;
};

export { Driver, initDriver };

  