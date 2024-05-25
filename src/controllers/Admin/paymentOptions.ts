import { Request, Response } from 'express';
import { PaymentOptions } from '../../models/paymentOption';

export const createPaymentOption = async (req: Request, res: Response) => {
    const { paymentName, privateKey, publicKey } = req.body;

    try {
        // Check if the payment option already exists
        const existingPaymentOption = await PaymentOptions.findOne({ where: { paymentName } });

        if (existingPaymentOption) {
            return res.status(400).json({
                status: 400,
                error: 'Payment option already exists'
            });
        }

        const paymentOption = await PaymentOptions.create({
            paymentName, privateKey, publicKey
        });

        res.status(201).json({
            status: 201,
            message: 'Payment option created successfully',
            data: paymentOption
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            error: 'An error occurred while processing your request'
        });
    }
};
export const paymentOptionAvailability = async (req: Request, res: Response) => {
    const { paymentOptionId } = req.params;

    try {
        const paymentOption = await PaymentOptions.findOne({ where: { paymentOptionId } });

        if (!paymentOption) {
            return res.status(404).json({
                status: 404,
                error: 'Payment option not found'
            });
        }

        paymentOption.paymentAvailable = !paymentOption.paymentAvailable;

        await paymentOption.save();

        res.status(200).json({
            status: 200,
            message: 'Payment option availability updated successfully',
            data: paymentOption
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: 'An error occurred while processing your request'
        });
    }
};
export const updatePaymentOptionKeys = async (req: Request, res: Response) => {
    const { publicKey, privateKey } = req.body;
    const { paymentOptionId } = req.params;

    try {
        const paymentOption = await PaymentOptions.findOne({ where: { paymentOptionId } });

        if (!paymentOption) {
            return res.status(404).json({
                status: 404,
                error: 'Payment option not found'
            });
        }

        paymentOption.publicKey = publicKey;
        paymentOption.privateKey = privateKey;

        // Save the updated payment option
        await paymentOption.save();

        res.status(200).json({
            status: 200,
            message: 'Payment option keys updated successfully',
            data: paymentOption
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: 'An error occurred while processing your request'
        });
    }
};
export const getAllPaymentOptions = async (req: Request, res: Response) => {
    try {
        const paymentOptions = await PaymentOptions.findAll();

        res.status(200).json({
            status: 200,
            message: 'Payment options retrieved successfully',
            data: paymentOptions
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: 'An error occurred while processing your request'
        });
    }
};
