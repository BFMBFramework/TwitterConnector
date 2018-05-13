import {Connector, Connection} from "bfmb-base-connector";
import * as request from "request";

export const TWITTER_URL = "https://api.twitter.com/";

export class TwitterConnector extends Connector {

	constructor() {
		super("Twitter");
	}

	addConnection(options : any, callback : Function) : void {
		const self = this;
		let connection : TwitterConnection = new TwitterConnection(options);

		connection.authenticate({}, function (err : Error, response : any) {
			if (err) return callback(err);
			self.connections.push(connection);
			callback(null, connection.getId());
		});
	}

	receiveMessage(id : string, options : any = {}, callback : Function) : void {
		// TODO
	}

	sendMessage(id : string, options : any = {}, callback : Function) : void {
		// TODO
	}
}

export class TwitterConnection extends Connection {
	private token : string;
	private last_id : number;
	//private user : TwitterUser; 

	constructor (options : any) {
		super(options);
		this.token = options.token;
		this.last_id = 0;
	}

	authenticate (options : any = {}, callback : Function) : void {
		request.get({url: TWITTER_URL + "oauth/authenticate?oauth_token=" + this.token}, (err : any, r : any, body : string) => {
			const response : Array<any> = JSON.parse(body);

			if (err) return callback(err);
			if (!response) return callback(new Error("No response received."));

			callback(null, response);
		});
	}
}

export const connector = new TwitterConnector();