import { Subject, type Subscription } from "rxjs";

export type LogEntry = {
	type: "info" | "error" | "warn" | "debug";
	message: string;
	timestamp?: Date;
};

export class Logger {
	private logStream: Subject<LogEntry>;
	private subscriptions: Subscription[] = []; // Array to store multiple subscriptions

	constructor() {
		this.logStream = new Subject<LogEntry>();
	}

	log(type: LogEntry["type"], message: string) {
		this.logStream.next({
			type,
			message,
			timestamp: new Date(),
		});
	}

	info(message: string) {
		this.log("info", message);
	}

	error(message: string) {
		this.log("error", message);
	}

	warn(message: string) {
		this.log("warn", message);
	}

	debug(message: string) {
		this.log("debug", message);
	}

	subscribe(callback: (logEntry: LogEntry) => void): Subscription {
		const subscription = this.logStream.subscribe(callback);
		this.subscriptions.push(subscription); // Store each subscription
		return subscription;
	}

	unsubscribeAll() {
		for (const subscription of this.subscriptions) {
			subscription.unsubscribe();
		}
		this.subscriptions = [];
	}
}
