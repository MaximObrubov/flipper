var Flipper=function(){"use strict";var t=function(e,i){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])},t(e,i)};function e(e,i){if("function"!=typeof i&&null!==i)throw new TypeError("Class extends value "+String(i)+" is not a constructor or null");function n(){this.constructor=e}t(e,i),e.prototype=null===i?Object.create(i):(n.prototype=i.prototype,new n)}var i=function(){return i=Object.assign||function(t){for(var e,i=1,n=arguments.length;i<n;i++)for(var o in e=arguments[i])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t},i.apply(this,arguments)},n=function(){function t(){this.THROTTLE_PERIOD=3,this.DRAGGING_ZI=2967,this.isDragged=!1,this.coordinates={start:{x:0,y:0},current:{x:0,y:0}}}return Object.defineProperty(t.prototype,"HTMLNode",{get:function(){return this._HTMLNode},set:function(t){this._HTMLNode=t},enumerable:!1,configurable:!0}),t.prototype.subscribe=function(t,e,i){this.HTMLNode.addEventListener(t,e,i||!1)},t.prototype.unsubscribe=function(t,e){this.HTMLNode.removeEventListener(t,e)},t.prototype.subscribeDrag=function(){this.subscribe("pointerdown",this.onDragStart.bind(this))},t.prototype.triggerEvent=function(t){this.HTMLNode.dispatchEvent(new Event(t))},t.prototype.resetCoordinates=function(){this.coordinates={start:{x:0,y:0},current:{x:0,y:0}}},t.prototype.coordDiff=function(t){var e="left"===t?"x":"y";return this.coordinates.start[e]-this.coordinates.current[e]},t.prototype.onDragMove=function(t){},t.prototype.onDragEnd=function(t){this.triggerEvent("draggable:end")},t.prototype.onDragStart=function(t){var e=this;t.preventDefault(),t.stopPropagation(),this.resetCoordinates();var i=this.HTMLNode.style.zIndex;this.HTMLNode.style.zIndex=this.DRAGGING_ZI+"",this.isDragged=!0,this.triggerEvent("draggable:start");var n=this._onDragMove.bind(this),o=function(s){document.body.removeEventListener("pointermove",n),document.body.removeEventListener("pointerup",o),clearTimeout(e.throttleTimeout),e.throttleTimeout=void 0,e.HTMLNode.style.zIndex=i,e.isDragged=!1,e.onDragEnd(t)};document.body.addEventListener("pointermove",n),document.body.addEventListener("pointerup",o)},t.prototype._onDragMove=function(t){var e=this;t.preventDefault(),t.stopPropagation(),this.throttleTimeout||(this.throttleTimeout=window.setTimeout((function(){e.coordinates.start.x||e.coordinates.start.y||e.updateCoords(t,"start"),e.updateCoords(t),e.throttleTimeout=void 0,e.onDragMove(t)}),this.THROTTLE_PERIOD))},t.prototype.updateCoords=function(t,e){void 0===e&&(e="current");var i=t instanceof TouchEvent?t.touches[0]:t;this.coordinates[e]={x:i.clientX,y:i.clientY}},t}();function o(t,e,i,n,o){var s;return new Promise((function(r,p){var a=function(p){s||(s=p);var h="function"==typeof o&&o(),l=p-s,c=l/i;n(t+(e-t)*Math.min(c,1)),l<i&&!h?requestAnimationFrame(a):r()};requestAnimationFrame(a)}))}var s=function(t){function i(e,i,n,o,s){var r=t.call(this)||this;if(r.flipped=!1,r.shadow=null,r.isLast=!1,r.isFirst=!1,r.sites={front:null,back:null},r.currentHoverAngle=0,r.CLICK_TRESHOLD=3,r._isProcessing=!1,r._onTop=!1,r._angle=0,r._hoverAngle=0,r._scale=1,!s.klass)throw new Error("CSS class should be passed to page component");return r.options=s,r._flipper=i,r.id=e,r.HTMLNode=r.createNode(r.options),r.HTMLNode.classList.add(s.klass),r.HTMLNode.classList.add(r._flipper.isTouch?r.cssKlasses.touch:r.cssKlasses.desktop),s.shadow&&r.HTMLNode.classList.add(r.cssKlasses.shadowed),s.shadow&&(r.shadow=r.createNode(r.options),r.shadow.classList.add(r.cssKlasses.shadow),r.HTMLNode.appendChild(r.shadow)),r.addSubscriptions(),r.addContent(o),n.appendChild(r.HTMLNode),r}return e(i,t),Object.defineProperty(i.prototype,"cssKlasses",{get:function(){return{flipped:"".concat(this.options.klass,"--flipped"),front:"".concat(this.options.klass,"--front"),back:"".concat(this.options.klass,"--back"),blank:"".concat(this.options.klass,"--blank"),processing:"".concat(this.options.klass,"--processing"),shadowed:"".concat(this.options.klass,"--shadowed"),shadow:"".concat(this.options.klass,"--shadow"),top:"".concat(this.options.klass,"--top"),touch:"".concat(this.options.klass,"--touch"),desktop:"".concat(this.options.klass,"--desktop"),hover:"hover"}},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"zIndex",{get:function(){return this._zIndex},set:function(t){this._zIndex=t,this.HTMLNode.style.zIndex=this._zIndex+""},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"isProcessing",{get:function(){return this._isProcessing},set:function(t){this._isProcessing=t,t?this.HTMLNode.classList.add(this.cssKlasses.processing):this.HTMLNode.classList.remove(this.cssKlasses.processing)},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"onTop",{get:function(){return this._onTop},set:function(t){this._onTop=t,this.HTMLNode.classList.toggle(this.cssKlasses.top,t)},enumerable:!1,configurable:!0}),Object.defineProperty(i.prototype,"scale",{get:function(){return this._scale},set:function(t){this._scale=t,this.applyTransformation({scale:this._scale,angle:this._angle})},enumerable:!1,configurable:!0}),i.prototype.flip=function(t){var e=this;this.HTMLNode.classList.toggle(this.cssKlasses.flipped),this.isProcessing=!0;var i={left:this.flipped?0:-180,up:this.flipped?0:180};o(this._angle,i[this.options.direction],this.options.duration,(function(t){e.setAngle(t)})).then((function(){e.isProcessing=!1,e.flipped=!e.flipped,"function"==typeof t&&t()}))},i.prototype.onDragStart=function(e){this.isLast&&"single"===this._flipper.options.fill||this._flipper.bounceTimeout||t.prototype.onDragStart.call(this,e)},i.prototype.onDragMove=function(e){e.stopPropagation(),e.preventDefault(),t.prototype.onDragMove.call(this,e),this.setAngle(this.getDynamicAngle())},i.prototype.setAngle=function(t){this.applyTransformation({angle:t,scale:this.scale}),this._angle=t,(this.isFirst||this.isLast)&&this._flipper.root.dispatchEvent(new CustomEvent("flipper:page:angle",{detail:{angle:this._angle,page:this}})),this.shadow&&(this.shadow.style.opacity=1-Math.abs(90-Math.abs(t))/90+"")},i.prototype.onDragEnd=function(t){var e=Math.abs(this.coordDiff(this.options.direction))<this.CLICK_TRESHOLD;this.triggerEvent(e?"draggable:click":"draggable:end")},i.prototype.getAngle=function(){return this.isHorisontal()?this._getAngle(this.options.width,"x"):this._getAngle(this.options.height,"y")},i.prototype.getDynamicAngle=function(){var t=this.getAngle();return this.flipped?(t>-1&&(t=-1),t<-179&&(t=-179)):(t<1&&(t=1),t>179&&(t=179)),{left:this.flipped?-180-t:-1*t,up:this.flipped?180+t:t}[this.options.direction]},i.prototype.returnBack=function(t){var e=this,i={left:this.flipped?-180:0,up:this.flipped?180:0};o(this._angle,i[this.options.direction],this.options.duration/3,(function(t){e.options.hover&&(e._hoverAngle=t),e.setAngle(t)})).then((function(){"function"==typeof t&&t()}))},i.prototype._getAngle=function(t,e){var i=90*(this.coordinates.start[e]-this.coordinates.current[e])/this.scale/t;return this._hoverAngle?{left:i-((this.flipped?180:0)+this._hoverAngle),up:i+(this.flipped?-180+this._hoverAngle:this._hoverAngle)}[this.options.direction]:i},i.prototype.onMouseEnter=function(){var t=this;if((!this.isLast||"single"!==this._flipper.options.fill)&&!this._flipper.pages.some((function(t){return t.isDragged}))&&!this.isProcessing&&this.onTop&&!this.isDragged){this.subscribe("mouseleave",this.onMouseLeave.bind(this),{once:!0});var e={left:this.flipped?-180+this.options.tilt:-1*this.options.tilt,up:this.flipped?180-this.options.tilt:this.options.tilt};o(this._angle,e[this.options.direction],this.options.duration/3,(function(e){t.options.hover&&(t._hoverAngle=e),t.setAngle(e)}),(function(){return t.isDragged})).then((function(){}))}},i.prototype.onMouseLeave=function(){this.isProcessing||this.isDragged||this.returnBack()},i.prototype.createNode=function(t,e){void 0===e&&(e=!1);var i=document.createElement("div");return e?(i.style.height=t.height-2*t.offset[0]+"px",i.style.width=t.width-t.offset[1]*(this._flipper.options.spread?1:2)+"px"):(i.style.height=t.height+"px",i.style.width=t.width+"px"),i},i.prototype.addImage=function(t,e){t.appendChild(this.generateImageNode(e))},i.prototype.generateImageNode=function(t){var e=document.createElement("img");return e.src=t,e},i.prototype.addContent=function(t){var e=this;Object.keys(this.sites).forEach((function(t){e.sites[t]=e.createNode(e.options,!0),e.sites[t].classList.add(e.cssKlasses[t]),e.sites[t].style.top="".concat(e.options.offset[0],"px"),e.sites[t].style.left="".concat(e._flipper.options.spread?0:e.options.offset[1],"px")})),"object"==typeof t?(this.fillNode(this.sites.front,t.front),this.fillNode(this.sites.back,t.back)):(this.fillNode(this.sites.front,t),this.sites.back.classList.add(this.cssKlasses.blank)),this.HTMLNode.appendChild(this.sites.front),this.HTMLNode.appendChild(this.sites.back)},i.prototype.fillNode=function(t,e){this.isLink(e)?this.addImage(t,e):t.innerHTML=e},i.prototype.addSubscriptions=function(){this.options.hover&&this.subscribe("mouseenter",this.onMouseEnter.bind(this)),t.prototype.subscribeDrag.call(this)},i.prototype.isLink=function(t){return/^https?:\/\//.test(t)},i.prototype.applyStyles=function(t,e){Object.assign(t.style,e)},i.prototype.isHorisontal=function(){return"left"===this.options.direction},i.prototype.applyTransformation=function(t){var e=[];t.angle&&e.push("rotate".concat(this.isHorisontal()?"Y":"X","(").concat(t.angle,"deg)")),t.scale&&e.push("scale(".concat(t.scale,")")),e.push("translateZ(0)"),this.HTMLNode.style.transform=e.join(" ")},i}(n),r=function(){function t(){this._initials={width:void 0,height:void 0}}return Object.defineProperty(t.prototype,"width",{get:function(){return this._width},enumerable:!1,configurable:!0}),t.prototype.setWidth=function(t,e){void 0===e&&(e=!1),t<0||(this._initials.width||(this._initials.width=t),this._width=t,e&&(this._height=this._width/this.proportion))},Object.defineProperty(t.prototype,"height",{get:function(){return this._height},enumerable:!1,configurable:!0}),t.prototype.setHeight=function(t,e){void 0===e&&(e=!1),t<0||(this._initials.height||(this._initials.height=t),this._height=t,e&&(this._width=this._height*this.proportion))},t.prototype.updateInitials=function(t){this.proportion,this._initials=t},Object.defineProperty(t.prototype,"proportion",{get:function(){var t=this._initials,e=t.width,i=t.height;if(e&&i)return e/i},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"scale",{get:function(){return this._width/this._initials.width},enumerable:!1,configurable:!0}),t}(),p={pages:[],direction:"left",fill:"both",time:1200,spread:!1,adaptive:!1,perspective:4e3,singleFilledOffset:40,page:{width:300,height:300,shadow:!0,hover:!0,offset:[0,0]}},a=[],h=[];!function(t,e){if(t&&"undefined"!=typeof document){var i,n=!0===e.prepend?"prepend":"append",o=!0===e.singleTag,s="string"==typeof e.container?document.querySelector(e.container):document.getElementsByTagName("head")[0];if(o){var r=a.indexOf(s);-1===r&&(r=a.push(s)-1,h[r]={}),i=h[r]&&h[r][n]?h[r][n]:h[r][n]=p()}else i=p();65279===t.charCodeAt(0)&&(t=t.substring(1)),i.styleSheet?i.styleSheet.cssText+=t:i.appendChild(document.createTextNode(t))}function p(){var t=document.createElement("style");if(t.setAttribute("type","text/css"),e.attributes)for(var i=Object.keys(e.attributes),o=0;o<i.length;o++)t.setAttribute(i[o],e.attributes[i[o]]);var r="prepend"===n?"afterbegin":"beforeend";return s.insertAdjacentElement(r,t),t}}(':root {\n  --flipper-primary-color: #234;\n  --flipper-secondary-color: #eacd50;\n  --flipper-border-color: #999;\n  --flipper-page-bg: white;\n  --flipper-font-size: 15px;\n  --flipper-font-color: #333;\n}\n\n.flipper {\n  position: relative;\n  padding: 0em;\n  font-size: var(--flipper-font-size);\n  color: var(--flipper-font-color);\n  box-sizing: content-box;\n}\n.flipper__page {\n  position: absolute;\n  width: 50%;\n  transition-timing-function: linear;\n  transform-origin: 0 0%;\n  transform-style: preserve-3d;\n  perspective: 500px;\n  background-color: #fff;\n  background-color: var(--flipper-page-bg);\n  user-select: none;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n  touch-action: none;\n}\n.flipper__page--processing {\n  pointer-events: none;\n}\n.flipper__page--shadow {\n  position: absolute;\n  z-index: 2;\n  background-color: rgba(0, 0, 0, 0.5);\n  opacity: 0;\n}\n.flipper__page--front, .flipper__page--back {\n  position: absolute;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n  -webkit-backface-visibility: hidden; /* Safari */\n  backface-visibility: hidden;\n}\n.flipper__page--front img, .flipper__page--back img {\n  width: 100%;\n  user-select: none;\n}\n.flipper--direction-left {\n  transition-property: width, padding;\n}\n.flipper--direction-left .flipper__page {\n  left: 0;\n  transform: rotateY(0deg);\n  transform-origin: 0 0;\n}\n.flipper--direction-left .flipper__page--shadowed::after {\n  content: "";\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 1;\n  opacity: 0;\n  transition: opacity 800ms;\n}\n.flipper--direction-left .flipper__page--shadowed::after {\n  background: rgba(0, 0, 0, 0.15);\n}\n.flipper--direction-left .flipper__page:not(.flipper__page--top) {\n  pointer-events: none;\n}\n.flipper--direction-left .flipper__page:not(.flipper__page--top)::after {\n  opacity: 1;\n}\n.flipper--direction-left .flipper__page--processing {\n  pointer-events: none;\n}\n.flipper--direction-left .flipper__page--back {\n  transform: rotateY(180deg);\n}\n.flipper--direction-left .flipper__page--blank {\n  background-color: #fff;\n}\n.flipper--direction-up {\n  transition-property: height, padding;\n}\n.flipper--direction-up .flipper__page {\n  top: 0;\n  transform: rotateX(0deg);\n  transform-origin: 100% 0;\n}\n.flipper--direction-up .flipper__page--shadowed::after {\n  content: "";\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 1;\n  opacity: 0;\n  transition: opacity 800ms;\n}\n.flipper--direction-up .flipper__page--shadowed::after {\n  background: rgba(0, 0, 0, 0.15);\n}\n.flipper--direction-up .flipper__page:not(.flipper__page--top) {\n  pointer-events: none;\n}\n.flipper--direction-up .flipper__page:not(.flipper__page--top)::after {\n  opacity: 1;\n}\n.flipper--direction-up .flipper__page--processing {\n  pointer-events: none;\n}\n.flipper--direction-up .flipper__page--back {\n  transform: rotateX(180deg);\n}\n.flipper--direction-up .flipper__page--blank {\n  background-color: #fff;\n}\n.flipper--shadowed {\n  --shadow-color: rgba(0,0,0,0.2);\n  --shadow-size: 1em;\n}\n.flipper--shadowed::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: var(--shadow-color);\n  filter: blur(var(--shadow-size));\n}\n.flipper__inner {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.flipper__page-halfer {\n  box-sizing: border-box;\n  overflow: hidden;\n}\n.flipper__page-halfer--odd {\n  margin-right: -100%;\n}\n.flipper__page-halfer--even {\n  margin-left: -100%;\n}',{});var l=function(t){function n(e,i){var n=t.call(this)||this;return n.BASE_KLASS="flipper",n.DEFAULT=p,n.piles={flipped:[],initial:[]},n.PAGE_KLASS="".concat(n.BASE_KLASS,"__page"),n.flipped=!1,n.maxZIndex=0,n.isTouch=!1,n.root=e,n.isTouch="ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0,n.fillOptions(i),n}return e(n,t),n.prototype.init=function(){var t=this;this.root.classList.add(this.BASE_KLASS),this.root.classList.add("".concat(this.BASE_KLASS,"--direction-").concat(this.options.direction)),this.root.classList.add("".concat(this.BASE_KLASS,"--fill-").concat(this.options.fill)),this.options.page.shadow&&this.root.classList.add("".concat(this.BASE_KLASS,"--shadowed")),this.addInner(),this.createPages(),this.waitImgLoad(),this.options.adaptive&&this.watchParentSize(),this.root.addEventListener("flipper:update",(function(e){t.reinit(e.detail)})),"both"===this.options.fill&&this.root.addEventListener("flipper:page:angle",this.onPageAngle.bind(this))},n.prototype.reinit=function(t){t&&this.fillOptions(t);var e=this.options.page,i=e.width,n=e.height;this.updateInitials({width:i,height:n}),this.piles={flipped:[],initial:[]},this.inner.innerHTML="",this.createPages(),this.checkPiles(),this.waitImgLoad()},n.prototype.next=function(){this.rotatePage("forth")},n.prototype.prev=function(){this.rotatePage("back")},Object.defineProperty(n.prototype,"pagesCount",{get:function(){return{flipped:this.piles.flipped.length,all:this.pages.length}},enumerable:!1,configurable:!0}),n.prototype.rotatePage=function(t){if(!this.bounceTimeout){var e=("back"===t?this.piles.flipped:this.piles.initial).slice(-1)[0];e&&(e.isProcessing||(this.flipPage(e),this.setDebounceTimeout()))}},n.prototype.addInner=function(){this.inner=document.createElement("div"),this.inner.classList.add("".concat(this.BASE_KLASS,"__inner")),this.inner.style.perspective=this.options.perspective+"px"},n.prototype.fillOptions=function(t){this.options?this.options=i(i(i({},this.options),t),{page:i(i({},this.options.page),t.page)}):this.options=i(i(i({},this.DEFAULT),t),{page:i(i({},this.DEFAULT.page),t.page)}),this.isTouch&&(this.options.page.hover=!1),this.setWidth(this.options.page.width),this.setHeight(this.options.page.height)},n.prototype.createPages=function(){var t=this,e=this.root.querySelectorAll(".".concat(this.PAGE_KLASS)),i=Array.from(e).map((function(t){return t.innerHTML})),n=this.composeContent(i.length?i:this.options.pages);i.length&&(this.root.innerHTML=""),this.root.appendChild(this.inner),this.pages=n.reverse().map((function(e,i){var o=new s(i,t,t.inner,e,{klass:t.PAGE_KLASS,width:t.options.page.width,height:t.options.page.height,shadow:t.options.page.shadow,duration:t.options.time,tilt:t.options.page.tilt||25,direction:t.options.direction,hover:t.options.page.hover,offset:t.options.page.offset}),r=0===i,p=i===n.length-1;return o.subscribe("draggable:click",t.onPageClick.bind(t,o)),o.subscribe("draggable:end",t.onPageDragEnd.bind(t,o)),o.isLast=r,o.isFirst=p,t.piles.initial.push(o),o})),this.checkPiles()},n.prototype.waitImgLoad=function(){var t=this,e=Array.from(this.root.querySelectorAll("img")),i=e.map((function(t){return new Promise((function(e,i){t.onload=e,t.onerror=i}))}));Promise.allSettled(i).then((function(){t.emit("loaded",{images:e})}))},n.prototype.emit=function(t,e){document.dispatchEvent(new CustomEvent("flipper:".concat(t),{detail:{flipper:this,data:e}}))},n.prototype.onPageClick=function(t,e){this.bounceTimeout||(this.flipPage.call(this,t),this.setDebounceTimeout())},n.prototype.onPageAngle=function(t){var e=t.detail,i=e.page,n=e.angle,o=0===this.piles.flipped.length&&t.detail.page===this.piles.initial[this.piles.initial.length-1],s=1===this.piles.flipped.length&&t.detail.page===this.piles.flipped[0],r=this.piles.flipped.length===this.pages.length-1&&i===this.piles.initial[0],p=this.piles.flipped.length===this.pages.length&&i===this.piles.flipped[this.piles.flipped.length-1],a="left"===this.options.direction?this.options.page.width:this.options.page.height;if(s||o){var h=a*Math.cos((180+n)/180*Math.PI)*this.scale;h="".concat(Math.min(h>0?h:0,a),"px"),"left"===this.options.direction?this.root.style.paddingLeft=h:this.root.style.paddingTop=h}if(r||p){h=a*Math.cos(-n/180*Math.PI)*this.scale;h="".concat(Math.min(h>0?h:0,a),"px"),"left"===this.options.direction?this.root.style.width=h:this.root.style.height=h}},n.prototype.setDebounceTimeout=function(){var t=this;this.bounceTimeout=window.setTimeout((function(){t.bounceTimeout=void 0}),this.options.time/2)},n.prototype.onPageDragEnd=function(t){(t.flipped?-1:1)*t.getAngle()>90?this.flipPage(t):t.returnBack()},n.prototype.flipPage=function(t){this.isTheTopOfThePile(t)&&(t===this.piles.initial[0]&&"single"===this.options.fill||(t.zIndex=this.maxZIndex+1,this.maxZIndex=t.zIndex,t.flipped?(this.piles.initial.push(t),this.piles.flipped.pop()):(this.piles.flipped.push(t),this.piles.initial.pop()),this.checkPiles(),t.flip(),this.emit("flipped",this.pagesCount)))},n.prototype.composeContent=function(t){var e=this;if("single"===this.options.fill)return t;var i,n={front:null,back:null},o=t.reduce((function(t,o,s){return e.isLink(o)&&(o=e.generateImageNode(o).outerHTML),e.options.spread?s?(n.back=e.wrapInHalfer(o,!0),t.push(n),n={front:e.wrapInHalfer(o,!1),back:i}):(n.front=e.wrapInHalfer(o,!1),i=e.wrapInHalfer(o,!0)):s%2==0?n.front=o:(n.back=o,t.push(n),n={front:null,back:null}),t}),[]);return n.front&&o.push(n),o},n.prototype.wrapInHalfer=function(t,e){var i=document.createElement("div"),n=this.BASE_KLASS+"__page-halfer";return i.classList.add(n,n+(e?"--odd":"--even")),i.innerHTML=t,i.outerHTML},n.prototype.isTheTopOfThePile=function(t){return t==this.piles.flipped.slice(-1)[0]||t==this.piles.initial.slice(-1)[0]},n.prototype.resetPileTops=function(){var t=this;this.pages.forEach((function(e){e.onTop=t.isTheTopOfThePile(e)}))},n.prototype.checkPiles=function(){var t=this.BASE_KLASS+"--closed",e=this.BASE_KLASS+"--flipped";this.resetPileTops(),this.piles.flipped.length?this.piles.initial.length?(this.root.classList.remove(e),this.flipped=!1,this.root.classList.remove(t)):(this.root.classList.add(t),this.root.classList.add(e),this.flipped=!0,this.adjust(!0),this.resetZIndex(!1)):(this.root.classList.add(t),this.flipped=!1,this.adjust(!0),this.resetZIndex(!0))},n.prototype.resetZIndex=function(t){var e=this.pages.length;this.pages.forEach((function(i,n){return i.zIndex=t?n+1:e-n})),this.maxZIndex=e},n.prototype.adjust=function(t){var e=this;void 0===t&&(t=!1),{left:function(){t?e.flipped?(e.root.style.paddingLeft=e.width+"px",e.root.style.width="0px"):(e.root.style.paddingLeft="0px",e.root.style.width=e.width+"px"):(e.root.style.paddingLeft=e.width+"px",e.root.style.width=e.width+"px"),e.root.style.height=e.height+"px"},up:function(){t?e.flipped?(e.root.style.paddingTop=e.height+"px",e.root.style.height="0"):(e.root.style.paddingTop="0",e.root.style.height=e.height+"px"):(e.root.style.height=e.height+"px",e.root.style.paddingTop=e.height+"px"),e.root.style.width=e.width+"px"}}[this.options.direction]()},n.prototype.isLink=function(t){return/^https?:\/\//.test(t)},n.prototype.generateImageNode=function(t){var e=document.createElement("img");return e.src=t,e},n.prototype.watchParentSize=function(){var t=this;new ResizeObserver((function(e){var i,n,o=null===(n=null===(i=e[0])||void 0===i?void 0:i.contentBoxSize[0])||void 0===n?void 0:n.inlineSize;o<t.options.page.width*("left"===t.options.direction?2:1)&&(t.setWidth(o/2,!0),t.adjust(0===t.piles.flipped.length),t.pages.forEach((function(e){return e.scale=t.scale})))})).observe(this.root.parentElement)},n}(r);return l}();
//# sourceMappingURL=flipper.min.js.map
