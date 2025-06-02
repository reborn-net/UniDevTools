/**
 * DevTools 导出配置选项
 */
export interface DevToolsExportOptions {
	/**
	 * 导出时的 DevTools 版本号
	 */
	version: number;
	/**
	 * 当前导出的完整配置
	 */
	config: DevToolsConfig;
	/**
	 * 导出时间戳（毫秒）
	 */
	exportTime: number;
	/**
	 * 导出平台标识，如 'h5'、'app'、'mp-weixin' 等
	 */
	platform: string;
}

/**
 * DevTools 配置
 */
export interface DevToolsConfig {
	/**
	 * 配置版本号
	 */
	version: number;
	/**
	 * 是否启用调试工具
	 */
	status: boolean;
	/**
	 * 调试页面路由
	 */
	route: string;
	/**
	 * 浮窗气泡配置
	 */
	bubble: {
		/**
		 * 是否显示气泡
		 */
		status: boolean;
		/**
		 * 气泡显示文字
		 */
		text: string;
		/**
		 * 气泡文字颜色
		 */
		color: string;
		/**
		 * 气泡背景色
		 */
		bgColor: string;
	};
	/**
	 * 控制台日志配置
	 */
	console: DevToolsCacheConfig & {
		/**
		 * 是否输出到浏览器控制台
		 */
		isOutput: boolean;
	};
	/**
	 * 错误日志配置
	 */
	error: DevToolsCacheConfig;
	/**
	 * 网络请求日志配置
	 */
	network: DevToolsCacheConfig;
	/**
	 * 运行日志配置
	 */
	logs: DevToolsCacheConfig;
	/**
	 * 页面统计配置
	 */
	pageStatistics: {
		/**
		 * 是否开启页面统计
		 */
		status: boolean;
		/**
		 * 缓存上限（字节）
		 */
		size: number;
		/**
		 * 日活跃时间的保存条数
		 */
		dayOnlineRowMax: number;
	};
	/**
	 * uniBus 事件总线配置
	 */
	uniBus: DevToolsCacheConfig & {
		/**
		 * bus统计上限（字节）
		 */
		countMaxSize: number;
	};
	/**
	 * dev页面路由（去除首/）
	 */
	devRoute: string;
}

/**
 * 缓存相关配置
 */
export interface DevToolsCacheConfig {
	/**
	 * 是否启用该功能
	 */
	status: boolean;
	/**
	 * 缓存相关设置
	 */
	cache: {
		/**
		 * 是否启用缓存
		 */
		status: boolean;
		/**
		 * 缓存上限（字节）
		 */
		size: number;
		/**
		 * 单条记录缓存上限（字节）
		 */
		rowSize: number;
	};
}

/**
 * 错误日志项
 */
export interface DevToolsErrorLog {
	/**
	 * 日志时间戳
	 */
	t: number;
	/**
	 * 错误信息
	 */
	m: string;
	/**
	 * 错误堆栈/trace
	 */
	tr: string;
	/**
	 * 页面路径
	 */
	p: string;
	/**
	 * 错误类型（ve: vue error, vw: vue warn, oe: other error, n: unknown）
	 */
	type: string;
	/**
	 * 可选，格式化时间
	 */
	date?: string;
}

/**
 * 控制台日志项
 */
export interface DevToolsConsoleLog {
	/**
	 * 日志内容数组
	 */
	list: any[];
	/**
	 * 日志时间戳
	 */
	time: number;
	/**
	 * 日志所在页面
	 */
	page: string;
	/**
	 * 日志类型
	 */
	type: 'log' | 'error' | 'warn' | 'info';
	/**
	 * 可选，格式化时间
	 */
	date?: string;
}

/**
 * 网络请求日志项
 */
export interface DevToolsNetworkLog {
	/**
	 * 请求唯一ID
	 */
	id: string;
	/**
	 * 请求类型（0:请求中 1:成功 2:失败）
	 */
	type: number;
	/**
	 * 请求发起时间戳
	 */
	sendTime: number;
	/**
	 * 响应时间戳
	 */
	responseTime: number;
	/**
	 * 请求耗时（秒，字符串）
	 */
	useTime: string;
	/**
	 * 请求地址
	 */
	url: string;
	/**
	 * 请求头
	 */
	header?: Record<string, any>;
	/**
	 * 请求方法
	 */
	method: string;
	/**
	 * 请求参数
	 */
	data: any;
	/**
	 * 响应主体内容
	 */
	responseBody: string;
	/**
	 * 响应头
	 */
	responseHeader: string;
	/**
	 * 响应状态码
	 */
	responseStatus: string;
	/**
	 * 响应错误信息
	 */
	responseMsg: string;
	/**
	 * 可选，格式化时间
	 */
	date?: string;
}

/**
 * 页面统计信息
 */
export interface DevToolsPageCount {
	/**
	 * 页面路由
	 */
	route: string;
	/**
	 * 活跃时间计数
	 */
	activeTimeCount: number;
}

/**
 * 当天在线统计
 */
export interface DevToolsDayOnline {
	/**
	 * 日期字符串
	 */
	date: string;
	/**
	 * 总活跃时间
	 */
	activeTimeCount: number;
	/**
	 * 页面活跃明细
	 */
	page: {
		/**
		 * 页面路由
		 */
		r: string;
		/**
		 * 活跃时间
		 */
		t: number;
	}[];
}

/**
 * 普通日志项
 */
export interface DevToolsLog {
	/**
	 * 日志时间戳
	 */
	t: number;
	/**
	 * 日志内容
	 */
	m: string;
	/**
	 * 可选，格式化时间
	 */
	date?: string;
}

/**
 * uniBus 事件日志项
 */
export interface DevToolsUniBusLog {
	/**
	 * 日志时间戳
	 */
	t: number;
	/**
	 * 事件内容
	 */
	e: string;
	/**
	 * 可选，格式化时间
	 */
	date?: string;
}

/**
 * uniBus 事件统计
 */
export interface DevToolsBusCount {
	/**
	 * 事件名
	 */
	e: string;
	/**
	 * on调用次数
	 */
	on: number;
	/**
	 * off调用次数
	 */
	off: number;
	/**
	 * emit调用次数
	 */
	emit: number;
	/**
	 * once调用次数
	 */
	once: number;
}

/**
 * 页面路由映射
 */
export interface DevToolsPageRouteMap {
	/**
	 * 路由key:出现次数
	 */
	[key: string]: number;
}

/**
 * 页面路由Key映射
 */
export interface DevToolsPageRouteKeyMap {
	/**
	 * 路由路径:唯一key
	 */
	[key: string]: number;
}

/**
 * 本地存储内容
 */
export interface DevToolsStorage {
	/**
	 * 存储键值对
	 */
	[key: string]: any;
}

/**
 * Pinia 状态内容
 */
export interface DevToolsPinia {
	/**
	 * store名:状态对象
	 */
	[store: string]: any;
}

/**
 * 全局数据内容
 */
export interface DevToolsGlobalData {
	/**
	 * 全局数据键值对
	 */
	[key: string]: any;
}

/**
 * DevTools 日志主结构
 */
export interface DevToolsLogData {
	/**
	 * 导出配置选项
	 */
	exportOptions: DevToolsExportOptions;
	/**
	 * 错误日志数组
	 */
	error: DevToolsErrorLog[];
	/**
	 * 控制台日志数组
	 */
	console: DevToolsConsoleLog[];
	/**
	 * 网络请求日志数组
	 */
	network: DevToolsNetworkLog[];
	/**
	 * 页面统计数组
	 */
	pageCount: DevToolsPageCount[];
	/**
	 * 当天在线统计数组
	 */
	dayOnline: DevToolsDayOnline[];
	/**
	 * 运行日志数组
	 */
	logs: DevToolsLog[];
	/**
	 * uniBus事件日志数组
	 */
	uniBus: DevToolsUniBusLog[];
	/**
	 * uniBus事件统计数组
	 */
	busCount: DevToolsBusCount[];
	/**
	 * 页面路由映射
	 */
	pageRouteMap: DevToolsPageRouteMap;
	/**
	 * 页面路由Key映射
	 */
	pageRouteKeyMap: DevToolsPageRouteKeyMap;
	/**
	 * localStorage内容
	 */
	storage: DevToolsStorage;
	/**
	 * sessionStorage内容
	 */
	sessionStorage: DevToolsStorage;
	/**
	 * cookie内容
	 */
	cookie: DevToolsStorage;
	/**
	 * Pinia状态内容
	 */
	pinia: DevToolsPinia;
	vuex: DevToolsPinia;
	/**
	 * 全局数据内容
	 */
	globalData: DevToolsGlobalData;
}