let http = require('http')
let fs = require('fs')
let url = require('url')
/**
读取本地文件
*/
function read(filePath, cb) {
	fs.readFile(filePath, 'utf8', function(err, data) {
		if (err || data.length == 0) {
			cb([]); //如果有错误 或者文件没长度 就是空数组
		} else {
			cb(JSON.parse(data)) //将读出来的内容转为数组
		}
	})
}

http.createServer((req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("X-Powered-By",' 3.2.1')
    // if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    let pathname = url.parse(req.url).pathname
    let query = url.parse(req.url, true).query
  
	
	if (pathname == '/v1/cities/') {

		//获取当前城市
		if (query.type == 'current') {
			res.setHeader('Content-type', 'application/json;charset=utf8')
			res.end(JSON.stringify({"currentCity": "南宁"}))
		}


		//获取热门城市
		if (query.type == 'hot') {
			read('./tempdata/hotCitys.json', (data) => {
				res.setHeader('Content-type', 'application/json;charset=utf8')
				res.end(JSON.stringify(data))
			})
		}

		//获取所有城市列表
		if (query.type == 'all')  {
			read('./tempdata/allCitys.json', (data) => {
				res.setHeader('Content-type', 'application/json;charset=utf8')
				res.end(JSON.stringify(data))
			})	
		}
	}

}).listen(1337, () => console.log('Server running at http://127.0.0.1:1337/') );