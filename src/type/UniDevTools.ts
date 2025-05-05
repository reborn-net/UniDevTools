/**
 * 导出选项配置
 */
export interface ExportOptions {
	/**
	 * 版本号
	 */
	version: number;
	/**
	 * DevTools配置
	 */
	config: DevToolsConfig;
	/**
	 * 导出时间
	 */
	exportTime: number;
	/**
	 * 平台
	 */
	platform: string;
}

/**
 * DevTools配置
 */
export interface DevToolsConfig {
	/**
	 * 版本号
	 */
	version: number;
	/**
	 * 状态
	 */
	status: boolean;
	/**
	 * 路由
	 */
	route: string;
	/**
	 * 气泡配置
	 */
	bubble: {
		/**
		 * 状态
		 */
		status: boolean;
		/**
		 * 文本
		 */
		text: string;
		/**
		 * 颜色
		 */
		color: string;
		/**
		 * 背景颜色
		 */
		bgColor: string;
	};
	/**
	 * 控制台配置
	 */
	console: {
		/**
		 * 状态
		 */
		status: boolean;
		/**
		 * 是否输出
		 */
		isOutput: boolean;
		/**
		 * 缓存配置
		 */
		cache: CacheConfig;
	};
	/**
	 * 错误配置
	 */
	error: {
		/**
		 * 状态
		 */
		status: boolean;
		/**
		 * 缓存配置
		 */
		cache: CacheConfig;
	};
	/**
	 * 网络配置
	 */
	network: {
		/**
		 * 状态
		 */
		status: boolean;
		/**
		 * 缓存配置
		 */
		cache: CacheConfig;
	};
	/**
	 * 日志配置
	 */
	logs: {
		/**
		 * 状态
		 */
		status: boolean;
		/**
		 * 缓存配置
		 */
		cache: CacheConfig;
	};
	/**
	 * 页面统计配置
	 */
	pageStatistics: {
		/**
		 * 状态
		 */
		status: boolean;
		/**
		 * 大小
		 */
		size: number;
		/**
		 * 每日在线最大行数
		 */
		dayOnlineRowMax: number;
	};
	/**
	 * UniBus配置
	 */
	uniBus: {
		/**
		 * 状态
		 */
		status: boolean;
		/**
		 * 缓存配置
		 */
		cache: {
			/**
			 * 状态
			 */
			status: boolean;
			/**
			 * 大小
			 */
			size: number;
			/**
			 * 行大小
			 */
			rowSize: number;
			/**
			 * 最大计数大小
			 */
			countMaxSize: number;
		};
	};
	/**
	 * 开发路由
	 */
	devRoute: string;
}

/**
 * 缓存配置
 */
export interface CacheConfig {
	/**
	 * 状态
	 */
	status: boolean;
	/**
	 * 大小
	 */
	size: number;
	/**
	 * 行大小
	 */
	rowSize: number;
}

/**
 * 错误日志
 */
export interface ErrorLog {
	/**
	 * 时间戳
	 */
	t: number;
	/**
	 * 错误信息
	 */
	m: string;
	/**
	 * 堆栈跟踪
	 */
	tr: string;
	/**
	 * 页面路径
	 */
	p: string;
	/**
	 * 错误类型
	 */
	type: string;
}

/**
 * 控制台日志
 */
export interface ConsoleLog {
	/**
	 * 日志内容
	 */
	list: any[];
	/**
	 * 时间戳
	 */
	time: number;
	/**
	 * 页面路径
	 */
	page: string;
	/**
	 * 日志类型: log|warn|error|info
	 */
	type: string;
}

/**
 * 网络请求日志
 */
export interface NetworkLog {
	/**
	 * ID
	 */
	id: string;
	/**
	 * 类型
	 */
	type: number;
	/**
	 * 发送时间
	 */
	sendTime: number;
	/**
	 * 响应时间
	 */
	responseTime: number;
	/**
	 * 使用时间
	 */
	useTime: string;
	/**
	 * URL
	 */
	url: string;
	/**
	 * 请求头
	 */
	header?: Record<string, string>;
	/**
	 * 请求方法
	 */
	method: string;
	/**
	 * 请求数据
	 */
	data: Record<string, any>;
	/**
	 * 响应体
	 */
	responseBody: string;
	/**
	 * 响应头
	 */
	responseHeader: string;
	/**
	 * 响应状态
	 */
	responseStatus: string;
	/**
	 * 响应消息
	 */
	responseMsg: string;
	/**
	 * 日期
	 */
	date?: string;
}

/**
 * 页面统计
 */
export interface PageCount {
	/**
	 * 路由
	 */
	route: string;
	/**
	 * 活跃时间计数
	 */
	activeTimeCount: number;
}

/**
 * 每日在线统计
 */
export interface DayOnline {
	/**
	 * 日期
	 */
	date: string;
	/**
	 * 活跃时间计数
	 */
	activeTimeCount: number;
	/**
	 * 页面统计
	 */
	page: Array<{
		/**
		 * 路由
		 */
		r: string;
		/**
		 * 次数
		 */
		t: number;
	}>;
}

/**
 * App日志
 */
export interface AppLog {
	/**
	 * 时间戳
	 */
	t: number;
	/**
	 * 日志信息
	 */
	m: string;
}

/**
 * 系统信息
 */
export interface SystemInfo {
	/**
	 * 系统信息
	 */
	"系统信息": Record<string, any>;
	/**
	 * 设备基础信息
	 */
	"设备基础信息": Record<string, any>;
	/**
	 * 窗口信息
	 */
	"窗口信息": Record<string, any>;
	/**
	 * APP基础信息
	 */
	"APP基础信息": Record<string, any>;
	/**
	 * APP授权设置
	 */
	"APP授权设置": any;
	/**
	 * 设备设置
	 */
	"设备设置": any;
	/**
	 * 网络状态
	 */
	"网络状态": string;
	/**
	 * 启动参数
	 */
	"启动参数": {
		/**
		 * 路径
		 */
		path: string;
		/**
		 * 查询参数
		 */
		query: Record<string, any>;
		/**
		 * 场景
		 */
		scene: number;
		/**
		 * 引荐信息
		 */
		referrerInfo: {
			/**
			 * 应用ID
			 */
			appId: string;
			/**
			 * 额外数据
			 */
			extraData: Record<string, any>;
		};
	};
}

/**
 * UniBus事件日志
 */
export interface UniBusLog {
	/**
	 * 时间戳
	 */
	t: number;
	/**
	 * 事件信息
	 */
	e: string;
	/**
	 * 日期
	 */
	date?: string;
}

/**
 * UniBus事件计数
 */
export interface BusCount {
	/**
	 * 事件名称
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
 * 完整的DevTools日志
 */
export interface DevToolsLog {
	/**
	 * 导出选项
	 */
	exportOptions: ExportOptions;
	/**
	 * 错误日志
	 */
	error: ErrorLog[];
	/**
	 * 控制台日志
	 */
	console: ConsoleLog[];
	/**
	 * 网络日志
	 */
	network: NetworkLog[];
	/**
	 * 页面统计
	 */
	pageCount: PageCount[];
	/**
	 * 每日在线统计
	 */
	dayOnline: DayOnline[];
	/**
	 * 应用日志
	 */
	logs: AppLog[];
	/**
	 * 系统信息
	 */
	info: SystemInfo;
	/**
	 * UniBus日志
	 */
	uniBus: UniBusLog[];
	/**
	 * 事件计数
	 */
	busCount: BusCount[];
	/**
	 * 存储
	 */
	storage: Record<string, any>;
	/**
	 * 会话存储
	 */
	sessionStorage: Record<string, any>;
	/**
	 * Cookie
	 */
	cookie: Record<string, string>;
	/**
	 * Pinia状态
	 */
	pinia: Record<string, any>;
	/**
	 * 全局数据
	 */
	globalData: Record<string, any>;
}