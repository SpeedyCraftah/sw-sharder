class ShardUtil {
    constructor(cluster) {
        this._cluster = cluster;
        this.ipc = cluster.ipc;
        cluster.bot.shard = this;
    }

    get id() {
        return this._cluster.clusterID;
    }

    broadcastEval(code) {
        const id = this.ipc.generateID();

        process.send({ name: "broadcastEval", id, code });

        return new Promise((resolve, reject) => {
            const callback = (responses) => {
                this.ipc.removeListener(id, callback);
                resolve(responses);
            };

            this.ipc.on(id, callback);
        });
    }

    masterEval(code) {
        const id = this.ipc.generateID();

        process.send({ name: "masterEval", id, code });

        return new Promise((resolve, reject) => {
            const callback = (responses) => {
                this.ipc.removeListener(id, callback);
                resolve(responses);
            };

            this.ipc.on(id, callback);
        });
    }

}

module.exports = ShardUtil;