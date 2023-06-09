import { utils, providers, Wallet, Contract, BigNumber } from "ethers";
import dotenv from "dotenv";
import Message from "./msg.js";
import ABI from "./abis.js";
import Cache from "./cache.js";

dotenv.config();

const msg = new Message();

const data = {
  ERC20: process.env.ERC20,
  SPENDER: process.env.SPENDER,
};

export default class Network {
  async load(cache) {
    msg.primary(`[debug::network] Load network..`);
    try {
      this.cache = cache;
      this.node = new providers.JsonRpcProvider(process.env.RPC);
      this.network = await this.node.getNetwork();
      this.spender = data.SPENDER;
      msg.primary("Completed!");
    } catch (e) {
      msg.error(`[error::network] ${e}`);
      process.exit();
    }
  }

  async getERC20PermitSignature(
    signer,
    token,
    permitName,
    spender,
    value,
    deadline
  ) {
    const [nonce, name, version, chainId] = await Promise.all([
      token.nonces(signer.address),
      permitName,
      "2",
      "43114",
    ]);

    return utils.splitSignature(
      await signer._signTypedData(
        {
          name,
          version,
          chainId,
          verifyingContract: token.address,
        },
        {
          Permit: [
            {
              name: "owner",
              type: "address",
            },
            {
              name: "spender",
              type: "address",
            },
            {
              name: "value",
              type: "uint256",
            },
            {
              name: "nonce",
              type: "uint256",
            },
            {
              name: "deadline",
              type: "uint256",
            },
          ],
        },
        {
          owner: signer.address,
          spender,
          value,
          nonce,
          deadline,
        }
      )
    );
  }

  async getMultiPermitSignature(permitName) {
    const approveAmount = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
    const accounts = new Cache();
    await accounts.load(`accounts.json`);
    const signatures = new Cache();
    await signatures.load(`signatures2.json`);
    signatures.createList();

    const length = accounts.data.length;
    const deadline = 1686821441;
    const res = [];
    for (let i = 0; i < length; i++) {
      try {
        let wallet = new Wallet(accounts.data[i].privateKey);
        let account = wallet.connect(this.node);
        const erc20 = new Contract(data.ERC20, ABI.erc20, account);
        const sign = await this.getERC20PermitSignature(
          account,
          erc20,
          permitName,
          this.spender,
          approveAmount,
          deadline
        );
        signatures.data.push([sign.v, sign.r, sign.s]);
        msg.success(
          `[debug::transact] TX has been submitted. Waiting for response..`
        );
      } catch (error) {
        console.log(error);
      }
    }
    await signatures.save();
    return res;
  }
}
