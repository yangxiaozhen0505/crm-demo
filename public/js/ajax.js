(function () {
    function getXhr() {
        var ary = [
            function () {
                return new XMLHttpRequest;
            },
            function () {
                return new ActiveXObject('MicroSoft.XMLHTTP')
            },
            function () {
                return new ActiveXObject('Msxml2.XMLHTTP')
            },
            function () {
                return new ActiveXObject('Msxml3.XMLHTTP')
            }
        ];
        var xhr = '';
        for (var i = 0; i < ary.length; i++) {
            var curFn = ary[i];
            try {
                xhr = curFn();
                getXhr = curFn;
                break;
            } catch (e) {
            }
        }
        if (xhr == '') {
            throw Error('浏览器不支持ajax')
        }
        return xhr;
    }

    function ajax(options) {
        var _defaultOptions = {
            url: '',
            data: null,
            type: 'get',
            dataType: 'text',
            async: true,
            success: function (data){
            },
            cache: true
        };

        for (var attr in options) {
            if (options.hasOwnProperty(attr)) {
                _defaultOptions[attr] = options[attr]
            }
        }
        var xhr = getXhr();
        if (_defaultOptions.type.toUpperCase() == 'GET' && !_defaultOptions.cache) {
            if (_defaultOptions.url.indexOf('?') > -1) {
                _defaultOptions.url += '&_ran=' + Math.random();
            } else {
                _defaultOptions.url += '?_ran=' + Math.random();
            }
        }
        xhr.open(_defaultOptions.type, _defaultOptions.url, _defaultOptions.async);
        xhr.responseType = _defaultOptions.dataType;
        xhr.onreadystatechange = function () {
            if(this.readyState == 4 && /2\d{2}/.test(this.status)) {
                _defaultOptions.success.call(this,this.response)
            }
        };
        xhr.send(_defaultOptions.data)
    }

    window.ajax = ajax;
})();
