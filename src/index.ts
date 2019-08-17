/**
 *
 * Elijah Cobb
 * elijah@elijahcobb.com
 * https://elijahcobb.com
 *
 */

import {Process, ProcessResponse} from "@elijahjcobb/process";
import * as PrettyBytes from "pretty-bytes";

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
	download: string,
	upload: string
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
		download,
		upload
	};
}

runTest().then((res: SpectrumResponse) => {

	console.log(res);


}).catch((err: any) => console.error(err));