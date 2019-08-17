/**
 *
 * Elijah Cobb
 * elijah@elijahcobb.com
 * https://elijahcobb.com
 *
 */

import * as ChildProcess from "child_process";


const ls: ChildProcess.ChildProcessWithoutNullStreams = ChildProcess.spawn("ls", ["-lh", "/usr"]);

ls.stdout.on("data", (data: any) => {
	console.log(`stdout: ${data}`);
});

ls.on("close", (code: number) => {
	console.log(`child process close all stdio with code ${code}`);
});

ls.on("exit", (code: number) => {
	console.log(`child process exited with code ${code}`);
});
