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
export const useVoucher = async (req: Request, res: Response) => {
    const { couponCode } = req.body;

    try {
        const voucher = await Voucher.findOne({ where: { couponCode } });

        if (!voucher) {
            return res.status(404).json({ error: "Voucher not found" });
        }

        if (voucher.usageLimit === 0) {
            return res.status(400).json({ error: "Voucher has reached its usage limit" });
        }

        // Decrease the usageLimit by 1
        voucher.usageLimit -= 1;

        // If usageLimit is now 0, set status to 'inactive'
        if (voucher.usageLimit === 0) {
            voucher.status = 'inactive';
        }

        // Save the updated voucher
        await voucher.save();

        res.status(200).json({
            Success: "Voucher used successfully",
            data: voucher
        });
    } catch (error: any) {
        // Handle error
    }
};