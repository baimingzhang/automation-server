function sendAjax(_index) {

	var page = _index;
	if (window.XMLHttpRequest) {
		// for firefox, opera and safari browswers
		var xhttp = new XMLHttpRequest();
	}
	if (typeof xhttp == "undefined")
		xhttp = function() {
			try {
				return new ActiveXObject("Msxml2.XMLHTTP.6.0");
			} catch (e) {
			}
			try {
				return new ActiveXObject("Msxml2.XMLHTTP.3.0");
			} catch (e) {
			}
			try {
				return new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
			}
			// Microsoft.XMLHTTP points to Msxml2.XMLHTTP.3.0 and is redundant
			throw new Error("This browser does not support XMLHttpRequest.");
		};
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			obj = JSON.parse(this.responseText);
			console.log("resultcount is " + obj.resultCount);

			for (i = 0; i < obj.testResult.length; i++) {
				appendRow(obj.testResult[i].id, obj.testResult[i].caseName,
						obj.testResult[i].startTime, obj.testResult[i].endTime,
						obj.testResult[i].duration,
						obj.testResult[i].testResult, obj.testResult[i].testLog);
			}
			if (_index == 'init') {
				appendPagination(obj.resultCount);
			}
		}
	};
	if (page == 'init') {
		page = '1';
	}
	xhttp.open("GET",
			'http://localhost:8080/GPSWebSite/servlet/MyServlet?page=' + page
					+ '&size=20', true);
	xhttp.send();
}

function appendRow(_id, _caseName, _startTime, _endTime, _duration,
		_testResult, _log) {
	var row = document.createElement("tr");
	var id = document.createElement("td");
	id.setAttribute("id", "RunID");
	var id_value = document.createTextNode(_id);
	var caseName = document.createElement("td");
	var caseName_value = document.createTextNode(_caseName);
	var start_time = document.createElement("td");
	var start_time_value = document.createTextNode(_startTime);
	var end_time = document.createElement("td");
	var end_time_value = document.createTextNode(_endTime);
	var duration = document.createElement("td");
	var duration_value = document.createTextNode(_duration);
	var testResult = document.createElement("td");
	if (_testResult == "Pass") {
		testResult.setAttribute("class", "success");
	} else {
		testResult.setAttribute("class", "fail");
	}
	var testResult_value = document.createTextNode(_testResult);
	var log = document.createElement("td");
	var log_value = document.createTextNode(_log);
	var log_link = document.createElement("a");
	id.appendChild(id_value);
	caseName.appendChild(caseName_value);
	start_time.appendChild(start_time_value);
	end_time.appendChild(end_time_value);
	duration.appendChild(duration_value);
	testResult.appendChild(testResult_value);
	log.appendChild(log_link);
	log_link.setAttribute('class', "btn btn-lg btn-primary");
	log_link.setAttribute('href',
			"/GPSWebSite/log_summary.html?action=getLogList&runid=" + _id);
	log_link.innerHTML = "See Log";
	sessionStorage.setItem(_id, _log);
	console.log("set session "+_id+" : "+_log);
	var browserVersion = getBrowserVersion();
	console.log(browserVersion);
	if (browserVersion.indexOf("IE") > 0) {
		log_link.setAttribute('target', "_explorer.exe");
	} else {
		log_link.setAttribute('target', "_blank");
	}

	row.appendChild(id);
	row.appendChild(caseName);
	row.appendChild(start_time);
	row.appendChild(end_time);
	row.appendChild(duration);
	row.appendChild(testResult);
	row.appendChild(log);
	var table = document.getElementById("tableTemplate");
	table.appendChild(row);
}

function appendPagination(_total) {
	var pageNumber = parseInt(_total) / 20;
	pageNumber = getPageNumber(pageNumber);
	document.cookie = "max_page=" + pageNumber;
	console.log("record total is " + _total);
	console.log("max number is " + pageNumber);

	var panel = document.createElement("ul");
	panel.setAttribute('class', "pagination");
	var previous = document.createElement("li");
	var previous_link = document.createElement("a");
	previous_link.setAttribute('id', "pagination_previous");
	previous_link.innerHTML = "«";
	previous.appendChild(previous_link);
	panel.appendChild(previous);

	for (i = 0; i < pageNumber; i++) {
		var page = document.createElement("li");
		var link = document.createElement("a");
		link.setAttribute('onclick', "goToPage('" + (i + 1) + "')");
		link.setAttribute('id', "pagination_" + (i + 1));
		if (i == 0) {
			link.setAttribute('class', "active");
			document.cookie = "current_page=1"
		}
		link.innerHTML = i + 1;
		page.appendChild(link);
		panel.appendChild(page);
		if (i > 7) {
			break;
		}
	}

	var next = document.createElement("li");
	var next_link = document.createElement("a");
	next_link.setAttribute('onclick', "goToPage('next')");
	next_link.setAttribute('id', "pagination_next");
	next_link.innerHTML = "»";
	next.appendChild(next_link);
	panel.appendChild(next);
	var page_root = document.getElementById("pagination");
	page_root.appendChild(panel);
	page_root.setAttribute("style", "display:block");
}

function getCookie(c_name) {
	var i, x, y, ARRcookies = document.cookie.split(";");
	for (i = 0; i < ARRcookies.length; i++) {
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, "");
		if (x == c_name) {
			return unescape(y);
		}
	}
}

function getBrowserVersion() {
	var ua = navigator.userAgent, tem, M = ua
			.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)
			|| [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE ' + (tem[1] || '');
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
		if (tem != null)
			return tem.slice(1).join(' ').replace('OPR', 'Opera');
	}
	M = M[2] ? [ M[1], M[2] ]
			: [ navigator.appName, navigator.appVersion, '-?' ];
	if ((tem = ua.match(/version\/(\d+)/i)) != null)
		M.splice(1, 1, tem[1]);
	return M.join(' ');
}
function goToPage(param) {
	var _pageNumber = 0;
	var old_page = getCookie("current_page");
	console.log("current page is : " + old_page);
	var old_pagination = document.getElementById("pagination_" + old_page);
	old_pagination.removeAttribute("class")
	if (param == "previous") {
		_pageNumber = parseInt(getCookie("current_page")) - 1;
	} else if (param == "next") {
		_pageNumber = parseInt(getCookie("current_page")) + 1;
	} else {
		_pageNumber = parseInt(param);
	}
	console.log("active page will be " + _pageNumber);
	var new_pagination = document.getElementById("pagination_" + _pageNumber);
	new_pagination.setAttribute('class', "active");
	document.cookie = "current_page=" + _pageNumber;
	var table = document.getElementById("tableTemplate");
	while (table.firstChild) {
		table.removeChild(table.firstChild);
	}
	sendAjax(_pageNumber);
	if (parseInt(getCookie("current_page")) > 1
			&& parseInt(getCookie("current_page")) < parseInt(getCookie("max_page"))) {
		var previous_pagination = document
				.getElementById("pagination_previous");
		if (previous_pagination.getAttribute("onclick") === null) {
			previous_pagination.setAttribute('onclick', "goToPage('previous')");
		}
		var next_pagination = document.getElementById("pagination_next");
		if (next_pagination.getAttribute("onclick") === null) {
			next_pagination.setAttribute('onclick', "goToPage('next')");
		}
	} else if (getCookie("current_page") === '1') {
		var previous_pagination = document
				.getElementById("pagination_previous");
		previous_pagination.removeAttribute("onclick");
	} else if (getCookie("current_page") === getCookie("max_page")) {
		var next_pagination = document.getElementById("pagination_next");
		next_pagination.removeAttribute("onclick");
	}
}

function getPageNumber(_pageNumber) {
	var pageNumber = parseFloat(_pageNumber);
	if (pageNumber % 1 === 0) {
		return pageNumber;
	} else {
		return parseInt(pageNumber) + 1;
	}
}

function initLogSummary(_action) {
	var v1 = getParameterFromURL("runid");
	var runID = document.getElementById("RunID");
	runID.innerHTML = "RunID : " + v1;
	if (window.XMLHttpRequest) {
		// for firefox, opera and safari browswers
		var xhttp = new XMLHttpRequest();
	}
	if (typeof xhttp == "undefined")
		xhttp = function() {
			try {
				return new ActiveXObject("Msxml2.XMLHTTP.6.0");
			} catch (e) {
			}
			try {
				return new ActiveXObject("Msxml2.XMLHTTP.3.0");
			} catch (e) {
			}
			try {
				return new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
			}
			// Microsoft.XMLHTTP points to Msxml2.XMLHTTP.3.0 and is redundant
			throw new Error("This browser does not support XMLHttpRequest.");
		};
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log("responseType is :" + this.responseType);
			if (_action == "init") {
				obj = JSON.parse(this.responseText);
				console.log(obj);
				for (i = 0; i < obj.length; i++) {
					console.log(obj[i]);
					appendLogFile(obj[i]);
				}
			} else if (_action.indexOf("getFile") > -1) {
				console.log("===getFile=====");
				if (getCookie("log_type") == "text") {
					sessionStorage.setItem('log_text', this.responseText);
					openPage("/GPSWebSite/log_detail.html");
				} else if (getCookie("log_type") == "image") {
					
					var blob = new Blob([this.response], {type: "image/png"});
			        var objectUrl = URL.createObjectURL(blob);
			        window.open(objectUrl)

				} else if (getCookie("log_type") == "excel") {
					var blob = new Blob([this.response], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
			        var objectUrl = URL.createObjectURL(blob);
			        window.open(objectUrl)
					
					var arrayBuffer = this.response;
					if (arrayBuffer) {
						var byteArray = new Uint8Array(arrayBuffer);
						sessionStorage.setItem('log_excel', byteArray);
					}
				}
				
			}
		}
	};
	var server = "http://localhost:8080/GPSWebSite/servlet/LogServlet?";
	var parameter;
	console.log("=== Action is " + _action);
	if (_action == "init") {
		parameter = 'action=getLogList&runid=' + v1;
		var log_path= sessionStorage.getItem(v1);
		var root = document.getElementById("log_path");
		root.innerHTML="Log Path : "+log_path;
		
	} else if (_action.indexOf("getFile") > -1) {
		var filename = _action.substring(_action.indexOf("&") + 1,
				_action.length);
		console.log("filename: " + filename + "  run id: " + v1);
		if (getFileExtension(filename) == "txt") {
			document.cookie = "log_type=text";
		} else if (getFileExtension(filename) == "png") {
			document.cookie = "log_type=image";
			xhttp.responseType = "arraybuffer"
		} else if (getFileExtension(filename) == "xlsx") {
			document.cookie = "log_type=excel";
			xhttp.responseType = "arraybuffer"
		}
		parameter = 'action=getLogFile&runid=' + v1 + '&filename=' + filename;
	}

	xhttp.open("GET", server + parameter, true);
	xhttp.send();
}

function openPage(_URL) {
	window.open(_URL, '_blank');
}

function appendLogFile(_logFileName) {
	var row = document.createElement("footer");
	var hr = document.createElement("hr");
	var link = document.createElement("button");
	row.appendChild(link);
	link.setAttribute('onclick', "getFile(this)");
	link.setAttribute('type', "button");
	link.setAttribute('class', "btn btn-info");
	link.innerHTML = _logFileName;
	var root = document.getElementById("log_list");
	root.appendChild(row);
	root.appendChild(hr);
}
function getParameterFromURL(_URL) {
	var s1 = parent.document.URL.substring(parent.document.URL.indexOf(_URL)
			+ _URL.length + 1, parent.document.URL.length);
	if (s1.indexOf("&") > 0) {
		var s2 = s1.substring(0, s1.indexOf("&"));
		return s2;
	} else {
		return s1;
	}
}

function getFile(link) {
	initLogSummary('getFile&' + link.innerHTML);
}

function initLogDetail() {
	var log_type = getCookie("log_type");
	if (log_type == "text") {
		var log_text = sessionStorage.getItem('log_text');
		console.log("current text is : " + log_text);
		var root = document.getElementById("log_text");
		root.innerHTML = log_text;
	} else if (log_type == "image") {
		// var log_image = sessionStorage.getItem('log_image');
		var log_image = sessionStorage.getItem('log_image');
		var root = document.getElementById("log_image");
		root.src = "data:image/png;base64," + log_image;
	}

}

function sleep(delay) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay)
		;
}

function getFileExtension(_filename) {
	return _filename.split('.').pop();
}