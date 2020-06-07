const EventEmitter = require("events");
class IPC extends EventEmitter {
    constructor() {
        super();
        this.events = new Map();

        process.on("message", msg => {
            let event = this.events.get(msg._eventName);
            if (event) {
                event.fn(msg);
            }
        });
    }

    generateID() {
        return Date.now().toString();
    }

    register(event, callback) {
        this.events.set(event, { fn: callback });
    }

    unregister(name) {
        this.events.delete(name);
    }

    broadcast(message = {}, options = {}) {
        const id = this.generateID();
        
        process.send({ name: "broadcast", id, message, options });

        if (!options.receptive) return;

        return new Promise((resolve, reject) => {
            const callback = (responses) => {
                this.removeListener(id, callback);
                resolve(responses);
            };

            this.on(id, callback);
        });
    }

    masterDispatch(message = {}, options = {}) {
        const id = this.generateID();
        
        process.send({ name: "masterDispatch", id, message, options });

        if (!options.receptive) return;

        return new Promise((resolve, reject) => {
            const callback = (response) => {
                this.removeListener(id, callback);
                resolve(response);
            };

            this.on(id, callback);
        });
    }

    dispatchTo(cluster, message = {}, options = {}) {
        const id = this.generateID();
        
        process.send({ name: "dispatchTo", id, cluster, message, options });

        if (!options.receptive) return;

        return new Promise((resolve, reject) => {
            const callback = (response) => {
                this.removeListener(id, callback);
                resolve(response.value);
            };

            this.on(id, callback);
        });
    }

    async fetchUser(id) {
        process.send({ name: "fetchUser", id });

        return new Promise((resolve, reject) => {
            const callback = (user) => {
                this.removeListener(id, callback);
                resolve(user);
            };

            this.on(id, callback);
        });
    }

    async fetchGuild(id) {
        process.send({ name: "fetchGuild", id });

        return new Promise((resolve, reject) => {
            const callback = (guild) => {
                this.removeListener(id, callback);
                resolve(guild);
            };

            this.on(id, callback);
        });
    }

    async fetchChannel(id) {
        process.send({ name: "fetchChannel", id });

        return new Promise((resolve, reject) => {
            const callback = (channel) => {
                this.removeListener(id, callback);
                resolve(channel);
            };

            this.on(id, callback);
        });
    }

    async fetchMember(guildID, memberID) {
        process.send({ name: "fetchMember", guildID, memberID });

        return new Promise((resolve, reject) => {
            const callback = (channel) => {
                this.removeListener(memberID, callback);
                resolve(channel);
            };

            this.on(memberID, callback);
        });
    }
}

module.exports = IPC;