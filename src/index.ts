/**
 *
 * Elijah Cobb
 * elijah@elijahcobb.com
 * https://elijahcobb.com
 *
 */

import {Process, ProcessResponse} from "@elijahjcobb/process";
import * as PrettyBytes from "pretty-bytes";
import * as Twitter from "twitter";
import * as FileSystem from "fs";
import * as Path from "path";

const twitter: Twitter = new Twitter({
	consumer_key: "",
	consumer_secret: "",
	access_token_key: "",
	access_token_secret: ""
});

type SpeedtestResponse = {
	client: {
		rating: string,
		loggedin: string,
		isprating: string,
		ispdlavg: string,
		ip: string,
		isp: string,
		lon: string,
		ispulavg: string,
		country: string,
		lat: string,
	},
	bytes_sent: number,
	download: number,
	timestamp: string
	share: null,
	bytes_received: number,
	ping: number,
	upload: number,
	server: {
		latency: number,
		name: string,
		url: string,
		country: string,
		lon: string,
		cc: string,
		host: string,
		sponsor: string,
		url2: string,
		lat: string,
		id: string,
		d: number
	}
};

type SpectrumResponse = {
	ping: string,
	download: {
		value: number,
		readable: string
	},
	upload: {
		value: number,
		readable: string
	}
};

async function runTest(): Promise<SpectrumResponse> {

	const process: Process = new Process("speedtest-cli", "--json");
	const res: ProcessResponse = await process.run();

	const resBody: string = res.data;
	const resObj: SpeedtestResponse = JSON.parse(resBody);

	const download: string = PrettyBytes(resObj.download, { bits: true }) + "/s";
	const upload: string = PrettyBytes(resObj.upload, { bits: true }) + "/s";
	const ping: string = resObj.ping + "ms";

	return {
		ping,
		download: {
			readable: download,
			value: resObj.download
		},
		upload: {
			readable: upload,
			value: resObj.upload
		}
	};
}

function log(res: SpectrumResponse): void {

	const fileLocation: string = Path.resolve("./spectrum.csv");
	if (!FileSystem.existsSync(fileLocation)) FileSystem.writeFileSync(fileLocation, "Time,Download,Upload,Ping");

	FileSystem.appendFileSync(fileLocation, `\n${Date.now()},${res.download.readable},${res.upload.readable},${res.ping}`);

}

function wait(minutes: number): Promise<void> {

	return new Promise<void>(((resolve: Function, reject: Function): void => {

		setTimeout(() => {

			resolve();

		}, minutes * 1000 * 60);

	}));

}

async function tweet(payload: string): Promise<Twitter.ResponseData> {

	return  await twitter.post("statuses/update", {status: payload});

}

async function runTwitterBot(): Promise<void> {

	console.log("Starting Test");

	const speeds: SpectrumResponse = await runTest();
	const downloadValue: number = speeds.download.value;
	const downloadReadable: string = speeds.download.readable;

	console.log(`Current: ${downloadReadable} (${downloadValue})`);

	if (downloadValue < 200 * 1_000_000) {

		console.log(`${new Date().toString()} - NOT FAST ENOUGH!`);
		const msg: string = `Hey Ask_Spectrum, I am paying for 400 down... Right now all you're giving me is ${downloadReadable}. What's up..?`;
		console.log(msg);

	} else {

		console.log(`${new Date().toString()} - WE CHILL`);

	}

	await wait(1 / 60);
	await runTwitterBot();

}

async function runLogger(): Promise<void> {

	const testResult: SpectrumResponse = await runTest();
	log(testResult);
	await wait(1 / 60);

	await runLogger();

}

(async (): Promise<void> => {

	await runLogger();

})().then(() => {}).catch((err: any) => console.error(err));