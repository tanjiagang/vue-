/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */

let baseUrl = ''; 
let routerMode = 'hash';
let imgBaseUrl = 'https://fuss10.elemecdn.com';

//开发环境
if (process.env.NODE_ENV == 'development') {
	baseUrl = '//elm.cangdu.org';
    imgBaseUrl = '//elm.cangdu.org/img/';
}else if(process.env.NODE_ENV == 'production'){
	//线上环境（生产环境）
	baseUrl = '//elm.cangdu.org';
    imgBaseUrl = '//elm.cangdu.org/img/';
 	// baseUrl = 'http://localhost:1337';
 	// imgBaseUrl = 'http://localhost:8000/img/';
}

export {
	baseUrl,
	routerMode,
	imgBaseUrl,
}