import devCache from "./devCache"

export default {
	pageRouteMap: [],
	pageRouteKeyMap: {},
	/**
	 * 安装路径分析插件
	 */
	install() {

		let allRoutes = this.getAllRoutes();

		let pageRouteKeyMap = devCache.get("pageRouteKeyMap")
		try {
			pageRouteKeyMap = JSON.parse(pageRouteKeyMap)
		} catch (error) {
			pageRouteKeyMap = {}
		}

		let lastNo = 0;
		Object.keys(pageRouteKeyMap).forEach((key) => {
			let item = Number(pageRouteKeyMap[key])
			if (item > lastNo) {
				lastNo = item;
			}
		})

		allRoutes.forEach(item => {
			if (!pageRouteKeyMap[item.path]) {
				pageRouteKeyMap[item.path] = lastNo + 1;
				lastNo = lastNo + 1;
			}
		})

		devCache.set("pageRouteKeyMap", JSON.stringify(pageRouteKeyMap))
		this.pageRouteKeyMap = pageRouteKeyMap;


		let pageRouteMap = devCache.get("pageRouteMap");
		try {
			pageRouteMap = JSON.parse(pageRouteMap)
		} catch (error) {
			pageRouteMap = {}
		}

		Object.keys(pageRouteMap).forEach((key) => {
			try {
				let n = Number(pageRouteMap[key]);
				if (!Number.isInteger(n) || n < 0) {
					pageRouteMap[key] = 1;
				}
			} catch (error) { }
		})
		this.pageRouteMap = pageRouteMap;

		this.saveData()

	},
	/**
	 * 获取APP注册的所有路由
	 * @returns {{path: string}[]} 返回路由列表
	 */
	getAllRoutes() {
		let pages = [];
		// #ifdef H5 || APP-PLUS
		try {
			pages = __uniRoutes.map((item) => {
				if (item.alias) {
					item.path = item.alias;
				}
				return item;
			});
		} catch (error) {
			pages = [];
		}
		// #endif
		// #ifdef MP-WEIXIN
		try {
			let wxPages = __wxConfig.pages;
			pages = wxPages.map((item) => {
				return {
					path: "/" + item,
				};
			});
		} catch (error) {
			pages = [];
		}
		// #endif
		return pages;
	},
	/**
	 * 写入路由列表
	 */
	pushPageRouteMap(list = []) {
		if (!list || list.length == 0) {
			list = getCurrentPages()
		}
		let key = ""
		list.forEach((item) => {
			let path = item.route.indexOf("/") == 0 ? item.route : "/" + item.route;
			let keyItem = this.pageRouteKeyMap[path];
			if (!keyItem) {
				keyItem = path;
			}
			if (key == "") {
				key = keyItem + ""
			} else {
				key = key + "," + keyItem
			}
		})

		if (this.pageRouteMap[key]) {
			this.pageRouteMap[key] = this.pageRouteMap[key] + 1;
		} else {
			this.pageRouteMap[key] = 1;
		}

	},
	/**
	 * 保存路由缓存
	 */
	saveData() {
		let that = this;
		setTimeout(() => {
			devCache.set("pageRouteMap", JSON.stringify(that.pageRouteMap))
			setTimeout(() => {
				that.saveData()
			}, 500);
		}, Math.round(Math.random() * 3 * 1000) + 2000);
	},
}