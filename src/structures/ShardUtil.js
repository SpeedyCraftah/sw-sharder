class ShardUtil {
    constructor(cluster) {
        this._cluster = cluster;
        this.ipc = cluster.ipc;
        cluster.bot.shard = this;
    }

    get id() {
        return this._cluster.clusterID;
    }



}

module.exports = ShardUtil;