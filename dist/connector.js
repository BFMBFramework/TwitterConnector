"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bfmb_base_connector_1 = require("bfmb-base-connector");
const request = require("request");
exports.TWITTER_URL = "https://api.Twitter.org/";
class TwitterConnector extends bfmb_base_connector_1.Connector {
    constructor() {
        super("Twitter");
    }
    addConnection(options, callback) {
        const self = this;
        let connection = new TwitterConnection(options);
        callback(null, connection.getId());
        /*
        connection.getMe(function (err : Error, user : TwitterUser) {
            if (err) return callback(err);
            self.connections.push(connection);
            callback(null, connection.getId());
        });*/
    }
    receiveMessage(id, options = {}, callback) {
        const connection = this.getConnection(id);
        if (connection) {
            connection.getUpdates(options, callback);
        }
        else {
            callback(new Error("No connection on list with id: " + id));
        }
    }
    sendMessage(id, options = {}, callback) {
        const connection = this.getConnection(id);
        if (connection) {
            connection.sendMessage(options, callback);
        }
        else {
            callback(new Error("No connection on list with id: " + id));
        }
    }
}
exports.TwitterConnector = TwitterConnector;
class TwitterConnection extends bfmb_base_connector_1.Connection {
    //private user : TwitterUser; 
    constructor(options) {
        super(options);
        this.token = options.token;
        this.last_update_id = 0;
    }
    /*
    getMe (callback : Function) : void{
        if (this.user) {
            return callback(null, this.user);
        }

        request.get({url: TWITTER_URL + "bot" + this.token + "/getMe"}, (err : any, r : any, body : string) => {
            const response = JSON.parse(body).result;
            
            if (err) return callback(err);
            if (!response) return callback(new Error("No response received."));
            
            this.user = new TwitterUser(response);
            callback(null, this.user);
        });
    }
    */
    getUpdates(options = {}, callback) {
        if (!options.offset)
            options.offset = this.last_update_id + 1;
        if (!options.timeout)
            options.timeout = 15;
        request.get({ url: exports.TWITTER_URL + "bot" + this.token + "/getUpdates", formData: options }, (err, r, body) => {
            const response = JSON.parse(body).result;
            if (err)
                return callback(err);
            if (!response)
                return callback(new Error("No response received."));
            this.last_update_id = response[response.length - 1].update_id;
            callback(null, response);
        });
    }
    sendMessage(options = {}, callback) {
        if (!options.chat_id)
            return callback(new Error("Parameter chat_id is required in Twitter API."));
        if (!options.text)
            return callback(new Error("Parameter text is required in Twitter API."));
        request.post({ url: exports.TWITTER_URL + "bot" + this.token + "/sendMessage", formData: options }, (err, r, body) => {
            const response = JSON.parse(body).result;
            if (err)
                return callback(err);
            if (!response)
                return callback(new Error("No response received."));
            callback(null, response);
        });
    }
}
exports.TwitterConnection = TwitterConnection;
exports.connector = new TwitterConnector();
