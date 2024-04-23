import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

enum Validity {
    PERMANENT = 'permanent',
    CUSTOM = 'custom',
}

enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    EXPIRED = 'expired'
}

interface VoucherAttributes {
    voucherId: string;
    country: string;
    couponCode: string;
    description: string;
    usageLimit: number;
    perUserLimit: number;
    discount: number;
    activationDate: Date;
    expiryDate: Date;
    validity: string;
    status: string;
}

interface VoucherCreationAttributes extends Optional< VoucherAttributes, 'voucherId'> {}

class Voucher extends Model<VoucherAttributes, VoucherCreationAttributes> implements VoucherAttributes {
    public voucherId!: string;
    public country!: string;
    public couponCode!: string;
    public description!: string;
    public usageLimit!: number;
    public perUserLimit!: number;
    public discount!: number;
    public expiryDate!: Date;
    public activationDate!: Date;
    public validity!: string;
    public status!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate(models: { [key: string]: any }) {
    Voucher.hasMany(models.Trip, { foreignKey: 'voucherId', as: 'trips' });
}
}

const initVoucher = (sequelize: Sequelize) => {
    Voucher.init(
        {
           voucherId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            couponCode: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            usageLimit: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            perUserLimit: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            discount: {
                type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 100
                }
            },
             activationDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            expiryDate: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: true,
                    isAfter: new Date().toString()
                }
            },
            validity: {
                type: DataTypes.ENUM,
                values: Object.values(Validity),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM,
                values: Object.values(Status),
                allowNull: false,
            },
        },
        {
        sequelize,
        tableName: 'Vouchers',
        },
    );
}

export { Voucher, initVoucher };