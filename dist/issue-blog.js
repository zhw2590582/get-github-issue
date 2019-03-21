/*!
 * issue-blog.js v1.0.0
 * Github: https://github.com/zhw2590582/issue-blog#readme
 * (c) 2017-2019 Harvey Zack
 * Released under the MIT License.
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self)["issue-blog"]={})}(this,function(t){"use strict";var o=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")};function c(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var e=function(t,e,n){return e&&c(t.prototype,e),n&&c(t,n),t};function i(e){return Object.keys(e).map(function(t){return"".concat(t,"=").concat(encodeURIComponent(e[t]||""))}).join("&")}var n=function(){function n(){var e=this,t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};o(this,n),this.cache=new Map,this.option=Object.assign({},n.DEFAULTS,t),Object.keys(n.DEFAULTS).forEach(function(t){if(""===e.option[t])throw new TypeError("option.".concat(t," can not be empty."))})}return e(n,[{key:"getUrl",value:function(t){var e="https://api.github.com/repos/".concat(this.option.owner,"/").concat(this.option.repo,"/issues"),n={t:Date.now(),client_id:this.option.clientID,client_secret:this.option.clientSecret};return"number"==typeof t?"".concat(e,"/").concat(t,"?").concat(i(n)):"".concat(e,"?").concat(i(Object.assign(n,t)))}},{key:"getRequest",value:function(t){var e=this;return this.option.loadFn(!0),fetch(t,{headers:{"Content-Type":"application/json",Accept:"application/vnd.github.v3.full+json"}}).then(function(t){return e.option.loadFn(!1),404===t.status?Promise.reject(new Error("Unauthorized")):t.json()}).catch(function(t){throw e.option.loadFn(!1),t})}},{key:"byPage",value:function(t){var n=this,e=t.page,o=void 0===e?1:e,c=t.labels,i=void 0===c?"":c,r=t.isPage,a=void 0!==r&&r,s="page=".concat(o,"&labels=").concat(i,"&isPage=").concat(a);if(this.option.cache&&this.cache.has(s))return Promise.resolve(this.cache.get(s));var u=this.getUrl({page:o,per_page:this.option.pageSize,labels:"".concat(a?this.option.pageLabel:this.option.postLabel,",").concat(i)});return this.getRequest(u).then(function(t){var e=t.map(function(t){return n.format(t)});return n.cache.set(s,e),e})}},{key:"byId",value:function(t){var n=this,o="id=".concat(t);if(this.option.cache&&this.cache.has(o))return Promise.resolve(this.cache.get(o));var e=this.getUrl(Number(t));return this.getRequest(e).then(function(t){var e=n.format(t);return n.cache.set(o,e),e})}},{key:"format",value:function(t){var e=this,n={title:t.title,html:t.body_html,created_at:t.created_at,updated_at:t.updated_at,comments:t.comments,tags:t.labels.filter(function(t){return t.name!==e.option.postLabel}).map(function(t){return t.name}),url:t.url,id:t.number};try{n.excerpt=function(t,e){return t.length>e?"".concat(t.slice(0,3<e?e-3:e),"..."):t}(t.body_text.replace(/[\r\n]/g,""),this.option.excerpt)}catch(t){n.excerpt=""}try{n.poster=/src=[\'\"]?([^\'\"]*)[\'\"]?/i.exec(/<img.*?(?:>|\/>)/.exec(t.body_html)[0])[1]}catch(t){n.poster="poster.png"}return n}}],[{key:"version",get:function(){return"1.0.0"}},{key:"env",get:function(){return'"production"'}},{key:"DEFAULTS",get:function(){return{owner:"",repo:"",clientID:"",clientSecret:"",cache:!0,excerpt:120,pageSize:10,postLabel:"post",pageLabel:"page",loadFn:function(t){return t}}}}]),n}();window.IssueBlog=n,t.default=n,Object.defineProperty(t,"__esModule",{value:!0})});
