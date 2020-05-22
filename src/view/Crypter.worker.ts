import { CryptoWorker } from "@modules/CryptoWorker";
import { WorkerAssigner } from "@view/WorkerAssigner";

function initCryptoWorker() {
    const cryptoWorker = new CryptoWorker();
    new WorkerAssigner(cryptoWorker);
}

initCryptoWorker();