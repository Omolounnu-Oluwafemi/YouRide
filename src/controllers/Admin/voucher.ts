import { Request, Response } from 'express';
import { Voucher } from '../../models/voucher';

export const createVoucher = async (req: Request, res: Response) => {
    const { country, couponCode, description, usageLimit, perUserLimit, discount, activationDate, expiryDate, validity, status } = req.body;

    try {
        const newVoucher = await Voucher.create({
            country,
            couponCode,
            description,
            usageLimit,
            perUserLimit,
            discount,
            activationDate,
            expiryDate,
            validity,
            status
        });

        res.status(201).json({
            Success: "Voucher created successfully",
            data: newVoucher
        }  
        );
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}


