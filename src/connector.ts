import {Connector, Connection} from "bfmb-base-connector";
import * as Twit from "twit";

export const TWITTER_URL = "https://api.twitter.com/";

export class TwitterConnector extends Connector {

	constructor() {
		super("Twitter");
	}

	addConnection(options : any, callback : Function) : void {
		const self = this;
		let connection : TwitterConnection = new TwitterConnection(options);

		self.connections.push(connection);
		return callback(null, connection.getId());
	}

	receiveMessage(id : string, options : any = {}, callback : Function) : void {
		// TODO
	}

	sendMessage(id : string, options : any = {}, callback : Function) : void {
		// TODO
	}
}

export class TwitterConnection extends Connection {
	private twitInstance : Twit;

	constructor (options : any) {
		super(options);
		this.twitInstance = new Twit(this.getTwitOptions(options));
	}

	getTwitOptions(options : any) : any {
		return {
			consumer_key: options.consumerKey,
			consumer_secret: options.consumerSecret,
			access_token: options.accessToken,
			access_token_secret: options.accessTokenSecret,
			timeout_ms: options.timeout,
			strictSSL: options.strictSSL
		};
	}

	getTwitInstance() : Twit {
		return this.twitInstance;
	}
}

export const connector = new TwitterConnector();