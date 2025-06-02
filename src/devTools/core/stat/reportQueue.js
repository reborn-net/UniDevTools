import devOptions from "../libs/devOptions";


/**
 * 等待上报的队列列表
 */
let reportQueueList = []

/**
 * 上报间隔时间ms
 */
let reportLimit = 5 * 1000;

/**
 * 客户端ID
 */
let clientId = ""

/**
 * 上报的API地址
 */
let reportApi = "";

/**
 * 数据添加到上传队列中
 */
export function addReportQueue(type, data) {
	reportQueueList.push({
		type,
		data,
		time: Date.now(),
	})
	if (reportQueueList.length > 10000) {
		reportQueueList.shift(); // 限制队列长度
	}
}

/**
 * 开始上报队列运行
 */
export function startReportQueue() {
	if (!clientId) {
		clientId = uni.getStorageSync("devTools_clientId")
	}

	const runNext = () => {
		setTimeout(startReportQueue, reportLimit)
	};

	let uploadData = reportQueueList;
	reportQueueList = [];

	const reportEnd = (errMsg) => {
		if (errMsg) {
			if (uploadData) {
				reportQueueList.unshift(...uploadData);
			}
			console.error("[devtools.stat]日志上报失败", errMsg);
		}
		runNext();
	}

	try {

		let devOps = devOptions.getOptions();
		if (
			!devOps
			|| !devOps.status
			|| !devOps.stat
			|| !devOps.stat.status
		) {
			return runNext();
		}

		if (!reportApi) {
			reportApi = devOps.stat.api
		}


		let time = new Date().getTime();

		let randStr = Math.random().toString(36).substring(2, 10);

		uni.request({
			url: reportApi,
			method: 'POST',
			responseType: 'json',
			header: {
				'Content-Type': 'application/json',
				'X-Dev-Id': clientId,
				'X-Dev-Name': 'UniDevTools',
				'X-Dev-Version': devOps.version,
				'X-Dev-Sign': createReportSign(uploadData, time, randStr, clientId, reportApi),
				'X-Dev-Time': time,
				'X-Dev-Rand': randStr,
			},
			data: {
				data: reportQueueList,
				system: uni.getSystemInfoSync(),
			},
			success(res) {
				if (res.data.success) {
					reportEnd()
				} else {
					reportEnd("请求成功但状态码错误:" + JSON.stringify(res.data));
				}
			},
			fail(error) {
				let msg = "网络请求失败";
				if (error && error.message) {
					msg = error.message;
				}
				reportEnd("请求发送失败:" + msg);
			}
		})
	} catch (error) {
		let msg = "代码运行报错";
		if (error && error.message) {
			msg = error.message;
		}
		reportEnd("代码运行报错:" + msg);
	}
}



export function waitNetConnect() {

}


/**
 * 创建请求签名
 */
function createReportSign(reportList = [], t = 0, str = "", clientId = "", url = "") {
	let st = String(t).slice(2, 3);
	let rStr = String(t).slice(1, 2);
	let cid = String(clientId).slice(15, 16);
	let s1 = "";
	let s2 = "";
	let st2 = t.toString(36)
	if (reportList.length >= 1) {
		s1 = getSignStrOne(JSON.stringify(reportList[0]));
	}
	if (reportList.length >= 2) {
		s2 = getSignStrOne(JSON.stringify(reportList[reportList.length - 1]));
	}
	let ccStr = `${st}${rStr}${s2}${cid}${st2}${str}${s1}${url}${st}${rStr}`
	let sign = stringToBinary(ccStr);
	let c = `${ccStr}-${sign.split("0").length}`;
	return s32(c);
}
function getSignStrOne(str = "") {
	if (str.length < 5) {
		return "";
	}
	if (str.length > 100) {
		str = str.slice(95, 96);
	} else {
		str = str.slice(1, 2)
	}
	return str;
}
function stringToBinary(str) {
	let result = '';
	for (let i = 0; i < str.length; i++) {
		let binary = str.charCodeAt(i).toString(2);
		result += binary.padStart(8, '0'); // 补齐8位
	}
	return result;
}
function s32(input) {
	let hash = 0;
	if (input.length === 0) return '00000000000000000000000000000000';
	for (let i = 0; i < input.length; i++) {
		const char = input.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0;
	}
	const hex = (hash >>> 0).toString(16).padStart(8, '0');
	return hex.repeat(4).substring(0, 32);
}