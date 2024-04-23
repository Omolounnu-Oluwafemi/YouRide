import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
// import { Trip } from './trip';

interface DriversAttributes {
  driverId: string;
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
  vehicleNumber: string;
  driverLicense: string;
  vehicleLogBook: string;
  privateHireLicenseBadge: string;
  insuranceCertificate: string;
  motTestCertificate: string;
  isAvailable: boolean;
}

interface DriverCreationAttributes extends Optional<DriversAttributes, 'driverId'> {}

class Driver extends Model<DriversAttributes, DriverCreationAttributes> implements DriversAttributes {
  public driverId!: string;
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
  public vehicleNumber!: string;
  public driverLicense!: string;
  public vehicleLogBook!: string;
  public privateHireLicenseBadge!: string;
  public insuranceCertificate!: string;
  public motTestCertificate!: string;
  public isAvailable!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

   public static associate(models: { [key: string]: any }) {
    Driver.hasMany(models.Trip, { foreignKey: 'driverId', as: 'trips' });
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
        type: DataTypes.ENUM,
        values: ['Private Driver', 'Taxi Driver', 'Delivery Driver'],
        allowNull: false,
      },
      referralCode: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true, 
      },
      vehicleYear: {
        type: DataTypes.ENUM,
        values: ['2024', '2023', '2022', '2021', '2020', '2019', '2018'],
        allowNull: false,
      },
      vehicleManufacturer: {
        type: DataTypes.ENUM,
        values: ['ACE', 'Acura', 'AIWAYS', 'AKT', 'BMW', 'BYD', 'Chevrolet'],
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
      vehicleNumber: {
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
   
    },
    {
      sequelize,
      tableName: 'Drivers',
    }
  );
};

export { Driver, initDriver };

  