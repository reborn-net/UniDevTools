var chartDom = null;
window.mychart = null;
window.echart_createDom = function (w, h) {
    w = Number(w);
    h = Number(h);
    chartDom = document.createElement("div");
    chartDom.style.width = w + 'px';
    chartDom.style.height = h + 'px';
    chartDom.style.display = 'block';
    document.body.appendChild(chartDom);
    document.all.addEventListener('touchmove', function(evt) {
    	evt.preventDefault();
    });
	
    return chartDom;
}
window.echart_createChart = function (opts) {
    if (!opts) {
        opts =  {}
    }
    window.mychart = echarts.init(chartDom, undefined, opts)
    return window.mychart;
}

/**
 * 将传入echart配置中的函数从字符类型还原为函数类型
 * @param {*} opt 
 */
function recoverEchartCBFn(opt) {
    for (let key in opt) {
        if (opt.hasOwnProperty(key)) {
            const curr = opt[key]
            if (typeof curr === 'string' && curr.includes('echartCbFn')) {
                const fnObj = JSON.parse(curr);
                tempFn = new Function(`return (${fnObj.fnString})`)();
                opt[key] = function(...params) {
                    try {
                        return tempFn(...params)
                    } catch (error) {
                        return error.toString()
                    }
                }
            }

            if (typeof curr === "object" && curr !== null) {
                recoverEchartCBFn(curr);
            }
        }
    }
}

window.echart_setOption= function (opts,ops) {
	recoverEchartCBFn(opts)
    window.mychart.setOption(opts,ops)
}