import Cache from "./classes/cache.js";
import Message from "./classes/msg.js";
import Network from "./classes/network.js";

const msg = new Message();
const cache = new Cache();
const network = new Network();

// main
(async () => {
  let startingTick = Math.floor(new Date().getTime() / 1000);
  msg.primary('[debug::main] Testing has been started.');

  await network.load(cache);
  const signs = await network.getMultiPermitSignature("USD Coin");
  console.log(signs);

  msg.success(
    `Finished in ${
      Math.floor(new Date().getTime() / 1000) - startingTick
    } seconds.`
  );

  process.exit();
})();
