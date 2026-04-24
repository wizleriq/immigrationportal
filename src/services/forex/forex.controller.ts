import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../data-source";
import { ForexRateQuote } from "../../entities/forex-rate-quote.entities";

// Create forex rate
export const createForexRateQuote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const repo = AppDataSource.getRepository(ForexRateQuote);
        const {
            base_currency,
            target_currency,
            fx_rate,
            service_fee_percent,
            flat_fee_amount,
        } = req.body;

        const rate = new ForexRateQuote();

        rate.base_currency = base_currency;
        rate.target_currency = target_currency;
        rate.fx_rate = fx_rate;
        rate.service_fee_percent = service_fee_percent;
        rate.flat_fee_amount = flat_fee_amount;

        rate.created_at = new Date();
        rate.expires_at = new Date(Date.now() + 60 * 60 * 100);

        await repo.save(rate);

        return res.status(201).json({ message: "Forex rate quote created successfully", data: rate });
    } catch (error) {
        next
        }
    }

    //Get  forex rate
export const getForexRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repo = AppDataSource.getRepository(ForexRateQuote);

    const { base, target } = req.query;

    const rate = await repo.findOne({
      where: {
        base_currency: base as string,
        target_currency: target as string,
      },
      order: {
        created_at: "DESC",
      },
    });

    if (!rate) {
      return res.status(404).json({
        message: "Forex rate quote not found",
      });
    }

    return res.json({
      message: "Forex rate retrieved successfully",
      data: rate,
    });

  } catch (error) {
    next(error);
  }
};


export const updateForexRateQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const repo = AppDataSource.getRepository(ForexRateQuote);

    const { id } = req.params;

    const rate = await repo.findOne({
      where: { id },
    });

    if (!rate) {
      return res.status(404).json({
        message: "Forex rate quote not found",
      });
    }

    Object.assign(rate, req.body);

    await repo.save(rate);

    return res.json({
      message: "Forex rate quote updated successfully",
      data: rate,
    });

  } catch (error) {
    next(error);
  }
};