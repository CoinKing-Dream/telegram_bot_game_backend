import express, { Router, Request, Response } from "express";
import Wallet from "../../models/Wallet";

const router: Router = express.Router();

router.post("/add", async (req: Request, res: Response) => {
  const wallet_new = new Wallet({
    wallet_address: req.body.wallet_address,
  });
  try {
    const { wallet_address } = req.body;
    let wallet_check = await Wallet.findOne({ wallet_address });
    if (wallet_check) {
      return res.json(wallet_check);
    } else {
      await wallet_new.save();
      res.json(wallet_new);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});

router.post("/update", async (req: Request, res: Response) => {
  const wallet = await Wallet.findOne({
    wallet_address: req.body.wallet_address
  });

  if (wallet) {
    let firstDate = new Date(Date.parse(wallet.createdDate));

    const ageDifference = Math.floor(Math.abs(firstDate.getTime() - new Date().getTime()) / 1000);

    let level = 0;
    if (ageDifference < 1 * 60 * 60 * 24) {
      level = 0;
    } else if (ageDifference >= 1 * 60 * 60 * 24 && ageDifference < 5 * 60 * 60 * 24) {
    // } else if (ageDifference >= 1 * 60 && ageDifference < 10 * 60 ) {
      level = 1;
    } else if (ageDifference >= 5 * 60 * 60 * 24 && ageDifference < 10 * 60 * 60 * 24) {
      level = 2;
    } else if (ageDifference >= 10 * 60 * 60 * 24 && ageDifference < 20 * 60 * 60 * 24) {
      level = 3;
    } else if (ageDifference >= 20 * 60 * 60 * 24) {
      level = 4;
    }
    console.log(ageDifference, 5 * 60 * 60 * 24);
    console.log(firstDate, new Date());
    
    
    const updated_wallet = await Wallet.findOneAndUpdate(
      {
        wallet_address: req.body.wallet_address
      },
      { 
        balance: req.body.balance, 
        energy: req.body.energy, 
        level,
      },
    );

    // return res.status(200).json({ 
    //   wallet_address: updated_wallet.wallet_address,
    //   balance: req.body.balance, 
    //   energy: req.body.energy, 
    //   level,
    //   createdDate: updated_wallet.createdDate,
    // });

  } else {
    return res.status(400).json({ msg: "You have no permission" });
  }
});

router.post("/currentuserinfo", async (req: Request, res: Response) => {
  const wallet = await Wallet.findOne({
    wallet_address: req.body.wallet_address
  });

  if (wallet) {
    return res.status(200).send({
      "wallet_address": wallet.wallet_address,
      "balance": wallet.balance,
      "energy": wallet.energy
    });
  } else {
    return res.status(400).json({ msg: "You have no permission" });
  }
});

router.post("/all", async (req: Request, res: Response) => {
  const factories = await Wallet.find().sort({balance: -1});
  
  res.status(200).send(factories);
});

router.post("/current_time", async (req: Request, res: Response) => {
  console.log("current_time");
  
  const wallet = await Wallet.findOne({
    wallet_address: req.body.wallet_address
  });

  if (wallet) {
    return res.status(200).json({
      createdDate: wallet.createdDate,
      recovery_energy_time: new Date().toISOString()
    });
  } else {
    return res.status(400).json({ msg: "Error!" });
  }
})

router.delete("/delete/:wallet_id", async (req: Request, res: Response) => {
  let wallet = await Wallet.findOne({ wallet_address: req.params.wallet_address });
  if (!wallet) {
    return res.status(404).json({ msg: "User not found." });
  }
  await Wallet.deleteOne({ wallet_address: req.params.wallet_address });
  res.json({ msg: "Delete Successfully" });
});

export default router;
