const IPC = require("./IPC.js");
const ShardUtil = require("./ShardUtil");

class Base {
    constructor(setup) {
        this.bot = setup.bot;
        this.client = setup.bot;
        this.clusterID = setup.clusterID;
        this.ipc = new IPC();
        setup.bot.shard = new ShardUtil(this);
    }

    restartCluster(clusterID) {
        this.ipc.sendTo(clusterID, "restart", { name: "restart" });
    }
}

module.exports = Base;