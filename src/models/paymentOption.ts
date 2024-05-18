import { Model, Optional, DataTypes, Sequelize } from 'sequelize';

interface PaymentOptionAttributes {
    paymentOptionId: string;
    paymentName: string;
    privateKey: string;
    publicKey: string;
    paymentAvailable: boolean | null;
}

interface PaymentCreationOptionAttributes extends Optional<PaymentOptionAttributes, 'paymentOptionId'> { }

class PaymentOptions extends Model< PaymentOptionAttributes, PaymentCreationOptionAttributes> implements PaymentOptionAttributes  {
    public paymentOptionId!: string;
    public paymentName!: string;
    public privateKey!: string;
    public publicKey!: string;
    public paymentAvailable!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate(models: { [key: string]: any }) {
    PaymentOptions.hasMany(models.Country, { foreignKey: 'paymentOptionId', as: 'countries' });
  }
}

const initPaymentOption = (sequelize: Sequelize) => {
    PaymentOptions.init({
        paymentOptionId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        paymentName: {
            type: DataTypes.ENUM,
            values: ['Stripe Payment', 'Paystack Payment'],
            allowNull: false,
        },
        privateKey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publicKey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        paymentAvailable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'PaymentOptions',
    });

    return PaymentOptions;
};

export { PaymentOptions, initPaymentOption };