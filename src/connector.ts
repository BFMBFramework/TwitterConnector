import {Connector, Connection} from "bfmb-base-connector";
import * as request from "request";

export const TWITTER_URL = "https://api.Twitter.org/";

export class TwitterConnector extends Connector {

	constructor() {
		super("Twitter");
	}

	addConnection(options : any, callback : Function) : void {
		const self = this;
		let connection : TwitterConnection = new TwitterConnection(options);

		callback(null, connection.getId())
		/*
		connection.getMe(function (err : Error, user : TwitterUser) {
			if (err) return callback(err);
			self.connections.push(connection);
			callback(null, connection.getId());
		});*/
	}

	receiveMessage(id : string, options : any = {}, callback : Function) : void{
		const connection : TwitterConnection = <TwitterConnection> this.getConnection(id);
		if (connection) {
			connection.getUpdates(options, callback);
		} else {
			callback(new Error("No connection on list with id: " + id));
		}
	}

	sendMessage(id : string, options : any = {}, callback : Function) : void{
		const connection : TwitterConnection = <TwitterConnection> this.getConnection(id);
		if (connection) {
			connection.sendMessage(options, callback);
		} else {
			callback(new Error("No connection on list with id: " + id));
		}
	}
}

export class TwitterConnection extends Connection {
	private token : string;
	private last_update_id : number;
	//private user : TwitterUser; 

	constructor (options : any) {
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

	getUpdates (options : any = {}, callback : Function) : void {
		if (!options.offset) options.offset = this.last_update_id + 1;
		if (!options.timeout) options.timeout = 15;

		request.get({url: TWITTER_URL + "bot" + this.token + "/getUpdates", formData: options}, (err : any, r : any, body : string) => {
			const response : Array<any> = JSON.parse(body).result;
						
			if (err) return callback(err);
			if (!response) return callback(new Error("No response received."));

			this.last_update_id = response[response.length - 1].update_id;
			callback(null, response);
		});
	}

	sendMessage (options : any = {}, callback : Function) : void {
		if(!options.chat_id) return callback(new Error("Parameter chat_id is required in Twitter API."));
		if(!options.text) return callback(new Error("Parameter text is required in Twitter API."));

		request.post({url: TWITTER_URL + "bot" + this.token + "/sendMessage", formData: options}, (err : any, r : any, body : string) => {
			const response = JSON.parse(body).result;
			
			if (err) return callback(err);
			if (!response) return callback(new Error("No response received."));
			
			callback(null, response);
		});
	}
}

export const connector = new TwitterConnector();