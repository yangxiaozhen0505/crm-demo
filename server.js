let http = require('http');
let url = require('url');
let fs = require('fs');
let mime = require('mime');
const FILE_NAME = './data.json';
let listener = function (req, res) {
    let {pathname, query} = url.parse(req.url, true);
    if (pathname == '/') {
        let result = fs.readFileSync('./index.html');
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.end(result);
    }
    let result = fs.readFileSync(FILE_NAME, 'UTF8');
    result = result.length == 0 ? [] : JSON.parse(result);
    let final = {code: 0, msg: '成功', data: ''};
    if (pathname == '/getList') {
        final.data = result;
        final.msg = '亲，查询成功了';
        res.setHeader('Content-Type', 'text/json;charset=utf-8');
        res.end(JSON.stringify(final));
        return;
    }
    if (pathname == '/removeInfo') {
        let id = query.id;
        final.msg = '删除失败';
        final.code = 1;
        for (var i = 0; i < result.length; i++) {
            var data = result[i];
            if (data.id == id) {
                result.splice(i, 1);
                fs.writeFileSync(FILE_NAME, JSON.stringify(result));
                final.msg = '删除成功';
                final.code = 0;
                break;
            }
        }
        res.setHeader('Content-Type', 'text/json;charset=utf-8');
        res.end(JSON.stringify(final));
        return;
    }
    if (pathname == '/addInfo') {
        var str = '';
        req.on('data', function (data) {
            str += data;
        });
        req.on('end', function () {
            let u = JSON.parse(str);
            u.id = result.length == 0 ? 1 : result[result.length - 1].id + 1;
            result.push(u);
            fs.writeFileSync(FILE_NAME, JSON.stringify(result));
            res.setHeader('Content-Type', 'text/json;charset=utf-8');
            final.msg = '增加成功';
            res.end(JSON.stringify(final));
        });
        return;
    }
    if (pathname == '/getInfo') {
        let id = query.id;
        final.code = 1;
        final.msg = '用户不存在';
        for (var i = 0; i < result.length; i++) {
            var current = result[i];
            if (current.id == id) {
                final.code = 0;
                final.msg = '修改成功';
                final.data = current;
                break;
            }
        }
        res.setHeader('Content-Type', 'text/json;charset=utf-8');
        res.end(JSON.stringify(final));
    }
    if (pathname == '/updateInfo') {
        let id = query.id;
        let str = '';
        req.on('data', function (data) {
            str += data;
        });
        req.on('end', function () {
            let u = JSON.parse(str);
            final.code = 1;
            final.msg = '更新失败';
            for (var i = 0; i < result.length; i++) {
                var cur = result[i];
                if (cur.id == id) {
                    result[i] = u;
                    final.code = 0;
                    final.msg = '修改成功';
                    fs.writeFileSync(FILE_NAME, JSON.stringify(result));
                    break;
                }
            }
            res.setHeader('Content-Type', 'text/json;charset=utf-8');
            res.end(JSON.stringify(final))
        });
        return;
    }
    try {
        res.setHeader('Content-Type', mime.lookup(pathname) + ';charset=utf-8');
        let result = fs.readFileSync('.' + pathname);
        res.end(result)
    } catch (e) {
        res.statusCode = 404;
        res.end('Not found~')

    }
};
http.createServer(listener).listen(3000, function () {
    console.log('listen port 3000 successful')
});