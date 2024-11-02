import type * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
import { Subject, type Subscription } from "rxjs";

// Define the type for FileSystem events
export type FileSystemEvent = {
	type: "read" | "write" | "delete" | "rename" | "mkdir" | "rmdir";
	filePath: string;
	content?: string; // For write events
	options?: any; // For additional options like encoding, flags, etc.
	timestamp?: Date;
	error?: Error; // For error handling
};

// Define the interface for file system operations
export interface FileSystemOps {
	readFile: typeof fsPromises.readFile;
	writeFile: typeof fsPromises.writeFile;
	unlink: typeof fsPromises.unlink;
	readdir: typeof fsPromises.readdir;
	mkdir: typeof fsPromises.mkdir;
	rmdir: typeof fsPromises.rmdir;
}

// Default file system operations using Node's `fs` module
const defaultFileSystemOps: FileSystemOps = {
	readFile: fsPromises.readFile,
	writeFile: fsPromises.writeFile,
	unlink: fsPromises.unlink,
	readdir: fsPromises.readdir,
	mkdir: fsPromises.mkdir,
	rmdir: fsPromises.rmdir,
};

export class FileSystem {
	private eventStream: Subject<FileSystemEvent>;
	private subscriptions: Subscription[] = [];
	private ops: FileSystemOps;

	constructor(ops?: Partial<FileSystemOps>) {
		this.eventStream = new Subject<FileSystemEvent>();
		this.ops = { ...defaultFileSystemOps, ...ops }; // Merge default ops with user-provided ones
	}

	// Stream subscription
	subscribe(callback: (event: FileSystemEvent) => void): Subscription {
		const subscription = this.eventStream.subscribe(callback);
		this.subscriptions.push(subscription);
		return subscription;
	}

	unsubscribeAll() {
		for (const subscription of this.subscriptions) {
			subscription.unsubscribe();
		}
		this.subscriptions = [];
	}

	// Read file and emit event
	async readFile(filePath: string, encoding: BufferEncoding = "utf-8") {
		try {
			const content = await this.ops.readFile(filePath, encoding);
			this.eventStream.next({
				type: "read",
				filePath,
				content,
				timestamp: new Date(),
			});
			return content;
		} catch (error) {
			this.eventStream.next({
				type: "read",
				filePath,
				timestamp: new Date(),
				error: error instanceof Error ? error : undefined,
			});
			throw error;
		}
	}

	// Write file and emit event
	async writeFile(
		filePath: string,
		content: string,
		options?: fs.WriteFileOptions,
	) {
		try {
			await this.ops.writeFile(filePath, content, options);
			this.eventStream.next({
				type: "write",
				filePath,
				content,
				options,
				timestamp: new Date(),
			});
		} catch (error) {
			this.eventStream.next({
				type: "write",
				filePath,
				content,
				timestamp: new Date(),
				error: error instanceof Error ? error : undefined,
			});
			throw error;
		}
	}

	// Delete file and emit event
	async unlink(filePath: string) {
		try {
			await this.ops.unlink(filePath);
			this.eventStream.next({
				type: "delete",
				filePath,
				timestamp: new Date(),
			});
		} catch (error) {
			this.eventStream.next({
				type: "delete",
				filePath,
				timestamp: new Date(),
				error: error instanceof Error ? error : undefined,
			});
			throw error;
		}
	}

	async readdir(dirPath: string) {
		try {
			const files = await this.ops.readdir(dirPath);
			this.eventStream.next({
				type: "read",
				filePath: dirPath,
				content: JSON.stringify(files), // Emit directory listing as JSON string
				timestamp: new Date(),
			});
			return files;
		} catch (error) {
			this.eventStream.next({
				type: "read",
				filePath: dirPath,
				timestamp: new Date(),
				error: error instanceof Error ? error : undefined,
			});
			throw error;
		}
	}

	// Create directory and emit event
	async mkdir(dirPath: string) {
		try {
			await this.ops.mkdir(dirPath);
			this.eventStream.next({
				type: "mkdir",
				filePath: dirPath,
				timestamp: new Date(),
			});
		} catch (error) {
			this.eventStream.next({
				type: "mkdir",
				filePath: dirPath,
				timestamp: new Date(),
				error: error instanceof Error ? error : undefined,
			});
			throw error;
		}
	}

	// Remove directory and emit event
	async rmdir(dirPath: string) {
		try {
			await this.ops.rmdir(dirPath);
			this.eventStream.next({
				type: "rmdir",
				filePath: dirPath,
				timestamp: new Date(),
			});
		} catch (error) {
			this.eventStream.next({
				type: "rmdir",
				filePath: dirPath,
				timestamp: new Date(),
				error: error instanceof Error ? error : undefined,
			});
			throw error;
		}
	}
}
