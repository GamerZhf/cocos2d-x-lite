require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AudioMgr":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'd2df2LGO/FCOJQCrG5T+a4t', 'AudioMgr');
// Scripts\Manager\AudioMgr.js

"use strict";

//音乐管理器
var M = cc.Class({

    properties: {
        bgmVolume: 1.0,
        sfxVolume: 1.0
    },

    // use this for initialization
    init: function init() {
        var t = cc.sys.localStorage.getItem("gbmVolume");
        if (t != null) {
            this.setBGMVolume(t);
        } else {
            this.setBGMVolume(1.0);
        }

        var t = cc.sys.localStorage.getItem("sfxVolume");
        if (t != null) {
            this.setSFXVolume(t);
        } else {
            this.setSFXVolume(1.0);
        }

        var self = this;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("cc.audioEngine.pauseAll");
            self.save();
            cc.audioEngine.pauseAll();
        });

        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    },

    play: function play(clipName, name, loop) {
        var clipname = "_" + clipName;
        if (!this[clipname]) {
            var self = this;
            cc.loader.loadRes('Sound/' + clipName, cc.AudioClip, function (err, clip) {
                self[clipname] = clip;
                cc.audioEngine[name](self[clipname], loop);
            });
        } else {
            cc.audioEngine[name](this[clipname], loop);
        }
    },

    playBGM: function playBGM(clipName) {
        if (this.bgmName != clipName) {
            this.bgmName = clipName;
            this.play(clipName, "playMusic", true);
        }
    },

    playSFX: function playSFX(clipName) {
        if (this.sfxVolume > 0) {
            this.play(clipName, "playEffect", false);
        }
    },

    setBGMVolume: function setBGMVolume(value) {
        this.bgmVolume = value;
        cc.audioEngine.setMusicVolume(value);
    },

    getBGMVolume: function getBGMVolume() {
        return this.bgmVolume;
    },

    setSFXVolume: function setSFXVolume(value) {
        this.sfxVolume = value;
        cc.audioEngine.setEffectsVolume(value);
    },

    getSFXVolume: function getSFXVolume() {
        return this.sfxVolume;
    },

    pauseAll: function pauseAll() {
        cc.audioEngine.pauseAll();
    },

    resumeAll: function resumeAll() {
        cc.audioEngine.resumeAll();
    },

    save: function save() {
        cc.sys.localStorage.setItem("gbmVolume", this.bgmVolume);
        cc.sys.localStorage.setItem("sfxVolume", this.sfxVolume);
    }

});

cc.audiomanager = new M();

cc._RF.pop();
},{}],1:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"CardMoveEvent":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'e54abXhmzNCsJ+pA9pty28+', 'CardMoveEvent');
// Scripts\Gui\CardMoveEvent.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        parentNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {},

    onAnimCompleted: function onAnimCompleted(num) {
        this.parentNode.getComponent("UIPokerGame").onAnimCompleted(num);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{}],"ChatBubble":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'fb85fG/wFtIZ6gsoDziwHyw', 'ChatBubble');
// Scripts\Gui\Widget\ChatBubble.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
        face: cc.Animation
    },

    // use this for initialization
    onLoad: function onLoad() {},

    showText: function showText(msg) {
        this.text.node.active = true;
        this.face.node.active = false;
        this.text.string = msg;
        cc.log('test:' + msg);
    },
    showFace: function showFace(id) {
        this.text.node.active = false;
        this.face.node.active = true;
        this.face.play("face_" + id);
        // this.face.spriteFrame = cc.gamemanager.createFace(id)
        // cc.log('this.face.spriteFrame:' + this.face.spriteFrame)
    },
    showVoice: function showVoice(url) {
        cc.immanager.im.playFromUrl(url);
    }
});

cc._RF.pop();
},{}],"ConfigManager":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'd4e15rene1Jw5lBLEELzsz9', 'ConfigManager');
// Scripts\Manager\ConfigManager.js

"use strict";

//保存一些客户端配置

var M = cc.Class({

    ctor: function ctor() {
        if (cc.sys.isMobile) {
            this.serverIP = "119.23.71.237"; //"119.23.71.237" 
        } else {
            this.serverIP = "10.173.32.52"; //"119.23.71.237" 
        }
        this.serverPort = 7000;

        this.nickName1 = ["上官", "欧阳", "东方", "端木", "独孤", "司马", "南宫", "夏侯", "诸葛", "皇甫", "长孙", "宇文", "轩辕", "东郭", "子车", "东阳", "子言"];

        this.nickName2 = ["雀圣", "赌侠", "赌圣", "稳赢", "不输", "好运", "自摸", "有钱", "土豪"];

        this.wndScale = cc.view.getFrameSize().height / 720;

        cc.log("getFrameSize: ", cc.view.getFrameSize().width, cc.view.getFrameSize().height);

        //房间头像位置(从自己开始逆时针方向，除自己外最多五名玩家)
        var scale = this.wndScale;
        var sx = cc.view.getFrameSize().width / 2;
        this.headIconPos = [[cc.v2(0, 188)], //2人
        [cc.v2(300 / scale, 160), cc.v2(-300 / scale, 160)], //3人
        [cc.v2((sx - 50) / scale, -40), cc.v2(0, 188), cc.v2((-sx + 50) / scale, -40)], //4人
        [cc.v2((sx - 50) / scale, -40), cc.v2(300 / scale, 150), cc.v2(-300 / scale, 150), cc.v2((-sx + 50) / scale, -40)] //5人
        ];

        this.yunyin_sdk_id = 1001664;

        //牌型图片配置
        this.pokerFlopCfg = [{ "name": "乌龙", "sound_male": "M_乌龙", "sound_female": "F_乌龙", "texres": "Textures/PokerStyle/wulong" }, { "name": "对子", "sound_male": "M_对子", "sound_female": "F_对子", "texres": "Textures/PokerStyle/duizi" }, { "name": "两对", "sound_male": "M_两对", "sound_female": "F_两对", "texres": "Textures/PokerStyle/liangdui" }, { "name": "三条", "sound_male": "M_三条", "sound_female": "F_三条", "texres": "Textures/PokerStyle/santiao" }, { "name": "顺子", "sound_male": "M_顺子", "sound_female": "F_顺子", "texres": "Textures/PokerStyle/shunzi" }, { "name": "同花", "sound_male": "M_同花", "sound_female": "F_同花", "texres": "Textures/PokerStyle/tonghua" }, { "name": "葫芦", "sound_male": "M_葫芦", "sound_female": "F_葫芦", "texres": "Textures/PokerStyle/hulu" }, { "name": "铁支", "sound_male": "M_铁支", "sound_female": "F_铁支", "texres": "Textures/PokerStyle/tiezhi" }, { "name": "同花顺", "sound_male": "M_同花顺", "sound_female": "F_同花顺", "texres": "Textures/PokerStyle/tonghuashun" }, { "name": "五同", "sound_male": "M_五同", "sound_female": "F_五同", "texres": "Textures/PokerStyle/wutong" }];

        this.upercaseFigure = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

        this.summarypos = [[cc.v2(-130, 58), cc.v2(130, 58)], [cc.v2(-260, 58), cc.v2(0, 58), cc.v2(260, 58)], [cc.v2(-390, 58), cc.v2(-130, 58), cc.v2(130, 58), cc.v2(390, 58)], [cc.v2(-510, 58), cc.v2(-255, 58), cc.v2(0, 58), cc.v2(255, 58), cc.v2(510, 58)]];

        //牌型名字（2,3墩5张牌)
        this.t5Name = ["五同", "同花顺", "铁支", "葫芦", "同花", "顺子", "三条", "两对", "对子", "乌龙"];
        this.t3Name = ["三条", "对子", "乌龙"];
    }
});

cc.configmanager = new M();

cc._RF.pop();
},{}],"DataManager":[function(require,module,exports){
"use strict";
cc._RF.push(module, '2307bIa+iBNorYNK5W+/1D1', 'DataManager');
// Scripts\Manager\DataManager.js

"use strict";

//数据管理器，存储全局数据
var M = cc.Class({

    ctor: function ctor() {
        this.nickName1 = ["上官", "欧阳", "东方", "端木", "独孤", "司马", "南宫", "夏侯", "诸葛", "皇甫", "长孙", "宇文", "轩辕", "东郭", "子车", "东阳", "子言"];

        this.nickName2 = ["雀圣", "赌侠", "赌圣", "稳赢", "不输", "好运", "自摸", "有钱", "土豪"];

        //主人物基本数据
        this.mainPlayerData = {};
        this.mainPlayerData.cuid = 0, this.mainPlayerData.nick_name = "", this.mainPlayerData.penid = "";
        this.notice = [];
        this.gmNotice = null;
    },

    dispachMsg: function dispachMsg(name, data) {
        if (typeof this[name] == 'function') {
            this[name](data);
        }
    },

    PublicProto_S_Notice: function PublicProto_S_Notice(data) {
        if (data.type == 1) {
            cc.guimanager.msgBox(data.text);
        } else if (data.type == 2) {
            this.gmNotice = data.text;
        } else if (data.type == 3) {
            this.notice.push(data.text);
        }
    },

    saveRoomSetting: function saveRoomSetting(setting) {
        this.roomSetting = setting;
    },
    getRoomSetting: function getRoomSetting() {
        return this.roomSetting;
    },

    getUserOpenId: function getUserOpenId() {
        var id = cc.sys.localStorage.getItem("userOpenId");
        if (id == null) {
            var num = Math.floor(Math.random() * 1000000000);
            id = num.toString();
            cc.sys.localStorage.setItem("userOpenId", id);
        }
        return id;
    },

    getNickName: function getNickName() {
        var nickname = cc.sys.localStorage.getItem("userNickName");
        if (nickname == null) {
            var nickName1 = cc.configmanager.nickName1;
            var nickName2 = cc.configmanager.nickName2;
            nickname = nickName1[Math.floor(Math.random() * 15)] + nickName2[Math.floor(Math.random() * 9)];
            cc.sys.localStorage.setItem("userNickName", nickname);
        }
        return nickname;
    },

    copyToClipboard: function copyToClipboard(strText) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "copyToClipboard", "(Ljava/lang/String;)I", strText);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AppController", "copyToClipboard:", strText);
        } else {
            cc.log('该平台不支持复制:' + strText);
        }
    }
});

cc.datamanager = new M();

cc._RF.pop();
},{}],"GameManager":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'ba526NcqlNN2qgcNxBxFSq7', 'GameManager');
// Scripts\Manager\GameManager.js

"use strict";

//游戏管理器，进入房间后的数据和逻辑管理
var M = cc.Class({

    ctor: function ctor() {
        this._players = []; //房间玩家信息，包括自己

        this.initDefaultPokers();

        this._currentMatchIdx = 0; //当前是第几局，0代表测试数据

        this._currentRounds = 0; //服务器发来的当前第几局
    },

    initDefaultPokers: function initDefaultPokers() {
        this._myPokerValues = [];
        this._myPokerValues.push([18, 42, 8, 7, 6, 5, 38, 26, 17, 25, 37, 21, 19]); //我手上的十三张牌, 第0局测试数据
    },

    dispachMsg: function dispachMsg(name, data) {
        if (typeof this[name] == 'function') {
            this[name](data);
        }
    },

    //创建或加入房间返回成功
    PublicProto_S_G13_RoomAttr: function PublicProto_S_G13_RoomAttr(msg) {
        if (msg.room_code != 0) {
            this.room_info = msg;
            this.gameStart();
        }
    },

    //刷新房间玩家数据
    PublicProto_S_G13_PlayersInRoom: function PublicProto_S_G13_PlayersInRoom(msg) {
        cc.log("收到加入房间消息 size =" + msg.players.length);
        this._players = msg.players;
        /*
        for(var i = 0; i < msg.players.length; ++i){
            var data = {}
            data.cuid = msg.players[i].cuid;
            data.status = msg.players[i].status;
            data.name = msg.players[i].name;
            this._players.push(data);
        }
        */
        //this._currentRounds = msg.rounds 这个rounds不准
        cc.guimanager.dispachMsg("onPlayerInRoom", this._players);
    },

    getPlayer: function getPlayer(id) {
        cc.log("this._players.length:" + this._players.length);
        if (this._players) {
            for (var i = 0; i < this._players.length; ++i) {
                if (this._players[i].cuid.eq(id)) {
                    return this._players[i];
                }
            }
        }
        return null;
    },

    mainPlayer: function mainPlayer() {
        return this.getPlayer(cc.datamanager.mainPlayerData.cuid);
    },

    //游戏开始调用
    gameStart: function gameStart() {
        if (this.room_info && cc.director.getScene().name == "Main") {
            cc.scenemanager.loadPokerGameScene();

            // this._faces = []
            // var self = this
            // for (var i = 1; i <= 15; ++i)
            // {
            //     (function(){
            //     var index = i
            //     var s = self
            //     var func = function(err,sf){
            //         s._faces[index - 1] = sf
            //     }
            //     cc.loader.loadRes('Textures/expression' + index,cc.SpriteFrame,func)
            //     })()
            // }
        }
    },

    //游戏结束调用
    gameOver: function gameOver() {

        cc.log("gameOver调用！！gameOver调用！！gameOver调用！！gameOver调用！！");

        this.room_info = null;
        this._players = [];
        this._currentMatchIdx = 0;
        this._currentRounds = 0;
        this.initDefaultPokers();
        this.allRoundsData = [];
        // for (var i = 0; i < this._faces.length; ++i)
        // {
        //     if (this._faces[i])
        //     {
        //         cc.loader.releaseAsset(this._faces[i])
        //     }
        // }
        // this._faces = null
    },

    // createFace:function(faceid){
    //     if (this._faces && faceid <= this._faces.length)
    //     {
    //         var prefab = this._faces[faceid - 1]
    //         cc.log('prefab:' + prefab)
    //         return cc.instantiate(prefab)
    //     }
    //     return null
    // },

    //获取当前局的13张牌
    getCurMathPokers: function getCurMathPokers() {
        if (this._myPokerValues.length > this._currentMatchIdx) {
            return this._myPokerValues[this._currentMatchIdx];
        }
        return [];
    },

    //收到发牌消息
    PublicProto_S_G13_HandOfMine: function PublicProto_S_G13_HandOfMine(msg) {
        cc.log("收到发牌消息, 牌数量 = " + msg.cards.length);

        if (msg.cards.length != 13) {
            cc.log("牌数据不对！");
            return;
        }

        this._myPokerValues.push(msg.cards);
        this._currentMatchIdx++;

        if (this._currentMatchIdx == 1) {
            //开始第一把
            this._currentRounds = 1;
            cc.guimanager.dispachMsg("newMatchStart");
        } else {
            //第二把数据已经过来，先存储等待第一把客户端动画结束

        }
    },

    //收到总结算消息
    PublicProto_S_G13_AllRounds: function PublicProto_S_G13_AllRounds(msg) {
        cc.log("收到总结算消息");

        this.allRoundsData = msg.players;
    },

    //新的一局
    nextMatch: function nextMatch() {
        if (this._currentRounds > this.room_info.attr.rounds) {
            cc.guimanager.msgBox("牌局结束");
            return;
        }
        this._currentRounds++;
        var root = cc.find("UIPokerGame");
        root.getComponent("UIPokerGame").newMatchStart();
    },

    //投票协议
    PublicProto_S_G13_AbortGameOrNot: function PublicProto_S_G13_AbortGameOrNot(msg) {
        this.voteInfo = msg;
        cc.guimanager.showOrOpenUI('UIVote');
    },

    //投票失败
    PublicProto_S_G13_VoteFailed: function PublicProto_S_G13_VoteFailed(msg) {
        cc.guimanager.closeByName('UIVote');
        var name = cc.gamemanager.getPlayer(msg.opponent).name;
        cc.guimanager.msgBox('玩家:'.concat(name, ',不同意,投票未通过,游戏继续。'));
    },

    giveup: function giveup(event) {
        var msg = cc.netmanager.msg("PublicProto.C_G13_GiveUp");
        cc.netmanager.send(msg);
    }

});

cc.gamemanager = new M();

cc._RF.pop();
},{}],"GameResult":[function(require,module,exports){
"use strict";
cc._RF.push(module, '0819cPL4HJGvYNThxflGW47', 'GameResult');
// Scripts\Gui\GameResult.js

"use strict";

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        time: cc.Label,
        count: cc.Label,
        bigJsPanel: cc.Prefab,
        timecd: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {

        this.cd = 120;
        this.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1.0), cc.callFunc(function (target, param) {
            param.cd = param.cd - 1;

            var roomAttr = cc.gamemanager.room_info.attr;
            param.timecd.string = param.cd.toString() + "秒后自动离开";
            if (param.cd == 0) {
                param.close();
            }
        }, this, this))));
    },

    initializeGameResult: function initializeGameResult(data) {

        var playerNum = cc.gamemanager.room_info.attr.player_size;
        this.count.string = cc.gamemanager.room_info.attr.rounds.toString() + "局";

        if (!data) {
            return;
        }

        var biggestScore = -10000;
        var smallSocre = 10000;
        var panelList = [];

        var container = this.node.getChildByName("container");
        var poses = cc.configmanager.summarypos[playerNum - 2];
        for (var i = 0; i < playerNum; ++i) {
            var node = cc.instantiate(this.bigJsPanel);
            var com = node.getComponent("bigJsPanel");
            com.init(data[i]);

            node.position = cc.v2(0, 0);
            node.parent = container;
            //node.position = poses[i]
            panelList.push(com);

            var rank = data[i].rank;
            if (rank > biggestScore) {
                biggestScore = rank;
            }
            if (rank < smallSocre) {
                smallSocre = rank;
            }
        }

        //curwidth = frameheight/720*1280
        //sacle = framewidth/curwidth = framewidth/(1280*frameheigth/720)
        var scale = cc.view.getFrameSize().width / (1.8 * cc.view.getFrameSize().height);
        container.scale = scale;

        for (var i = 0; i < playerNum; ++i) {
            panelList[i].setState(false, false);
            if (data[i].rank == biggestScore && biggestScore > 0) {
                panelList[i].setState(true, false);
            }
            if (data[i].rank == smallSocre && smallSocre < 0) {
                panelList[i].setState(false, true);
            }
        }

        this.time.string = this.getNowFormatDate().toString();
    },

    share: function share() {},

    close: function close() {
        this.node.destroy();
        cc.scenemanager.loadMainScene();

        var msg = cc.netmanager.msg("PublicProto.C_G13_GiveUp");
        cc.netmanager.send(msg);
    },

    getNowFormatDate: function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        return currentdate;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"GuiManager":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'bc58aNIfmBAPaAtobwrO1iF', 'GuiManager');
// Scripts\Manager\GuiManager.js

'use strict';

var M = cc.Class({

    ctor: function ctor() {
        this.panels = {};
    },

    dispachMsg: function dispachMsg(name, msgdata) {
        for (var key in this.panels) {
            var list = this.panels[key];
            if (list) {
                for (var i = 0; i < list.length; ++i) {
                    var p = list[i];
                    if (typeof p[name] == 'function') {
                        p[name](msgdata);
                    }
                }
            }
        }
    },

    open: function open(name, call, bvisible) {
        var self = this;

        cc.loader.loadRes('Gui/' + name, function (err, prefab) {
            if (prefab != null) {
                cc.log("prefab load success ", prefab);
                var obj = cc.instantiate(prefab);
                obj.parent = cc.director.getScene();
                var panel = obj.getComponent(cc.uipanel);
                var list = self.panels[name];
                cc.log('open list:' + list);
                if (!list) {
                    cc.log('add list:' + name);
                    list = [];
                    self.panels[name] = list;
                }

                panel.onCreate();
                if (bvisible == undefined) panel.setVisible(true);else {
                    panel.setVisible(bvisible);
                }

                list.push(panel);

                if (call != null) //放在self.panels add之后，目的为了callback内可以dispatch message
                    call(panel);

                return panel;
            } else {
                cc.log('open panel fail:' + name);
            }
        });
    },

    showOrOpenUI: function showOrOpenUI(name) {
        var panel = this.getByName(name);
        if (panel) {
            panel.setVisible(true);
        } else {
            this.open(name, null, true);
        }
    },

    msgBox: function msgBox(msg, func) {
        this.open('UIMessageBox', function (panel) {
            panel.setMessage(msg);
            panel.setCall(func);
        });
    },

    wait: function wait(msg) {
        cc.log(msg);
        this.open('UIWaiting', function (panel) {
            panel.setMessage(msg);
        });
    },

    closeWait: function closeWait() {
        this.closeByName('UIWaiting');
    },

    destroyPanel: function destroyPanel(panel) {
        if (panel && panel.node) {
            panel.onClose();
            panel.node.destroy();

            cc.log("destroyPanel destroyPanel destroyPanel");
        }
    },

    close: function close(panel) {
        cc.log("close close ", panel.node.name);
        for (var key in this.panels) {
            var list = this.panels[key];
            if (list) {
                for (var i = list.length - 1; i >= 0; --i) {
                    if (list[i] == panel) {
                        this.destroyPanel(panel);
                        cc.log("after destroy panel", list, list.leng);
                        cc.log('list.count:' + list.length);
                        list.splice(i, 1);
                        cc.log('splice list.count:' + list.length);
                        this.panels[key] = list;
                        return;
                    }
                }
            }
        }
    },

    getByName: function getByName(panelName) {
        var list = this.panels[panelName];
        cc.log('getByName');
        if (list) {
            if (list.length > 0) {
                return list[0];
            }
        }
        return null;
    },

    closeByName: function closeByName(panelName) {
        var list = this.panels[panelName];
        cc.log('begin closeByname:' + panelName);
        if (list) {
            for (var i = 0; i < list.length; ++i) {
                this.destroyPanel(list[i]);
            }
            this.panels[panelName] = [];
        }
    },

    closeAll: function closeAll() {
        if (this.panels) {
            for (var key in this.panels) {
                cc.log('key:' + key);
                var list = this.panels[key];
                cc.log('list:' + list);
                if (list) {
                    cc.log('list.length:' + list.length);
                    for (var i = 0; i < list.length; ++i) {
                        cc.log('destroyPanel:' + list.length);
                        this.destroyPanel(list[i]);
                    }
                }
            }
            this.panels = {};
        }
        cc.log('out!');
    }
});
cc.guimanager = new M();

cc._RF.pop();
},{}],"IMManager":[function(require,module,exports){
"use strict";
cc._RF.push(module, '547ddsUQMJPQYDrIA5KcdTB', 'IMManager');
// Scripts\Manager\IMManager.js

"use strict";

var M = cc.Class({

    properties: {},

    init: function init() {
        var me = cc.datamanager.mainPlayerData;
        this.im = yunvasdk.IMDispatchMsgNode.getInstance();
        this.im.initSDK(cc.configmanager.yunyin_sdk_id);
        this.im.cpLogin(me.nick_name, me.cuid);
        this.im.setListener(this.onMessage, this);

        this._onUpload = function (data) {
            //上传成功
            var msg = cc.netmanager.msg("PublicProto.C_SendChat");
            msg.type = 2;
            msg.data_text = data.url;
            cc.netmanager.send(msg);

            cc.immanager.im.playRecord();
        };
    },

    onMessage: function onMessage(data) {
        var self = this;
        cc.info('收到语音消息:' + data);
        var rsp = JSON.parse(data);
        switch (rsp.name) {
            case "YVSDK_UPLOAD_COMPLETED":
                //上传成功
                {
                    if (self._onUpload) self._onUpload(rsp);
                }
                break;
            case "YVSDK_STOP_RECORD":
                {
                    if (self._onStopRecord) self._onStopRecord(rsp);
                }
                break;
        }
    },

    setCall: function setCall(onUpload, onStopRecord) {
        this._onUpload = onUpload;
        this._onStopRecord = onStopRecord;
    }
});

cc.immanager = new M();

cc._RF.pop();
},{}],"MainGame":[function(require,module,exports){
"use strict";
cc._RF.push(module, '0975fZx1UJEDqmd0lBtMyYs', 'MainGame');
// Scripts\Gui\MainGame.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc._RF.pop();
},{}],"NetManager - 副本":[function(require,module,exports){
"use strict";
cc._RF.push(module, '9e407fPWcxEyb5BCWs2bQc3', 'NetManager - 副本');
// Scripts\Manager\NetManager - 副本.js

'use strict';

var M = cc.Class({
  ctor: function ctor() {
    require('long');
    require('bytebuffer');
    this.ProtoBuf = require('protobuf');
    this.handler = [];
    this.firstLogin = true;
  },

  init: function init() {

    if (cc.sys.isMobile) {
      var agent = anysdk.agentManager;
      this.user_plugin = agent.getUserPlugin();
      this.user_plugin.setListener(this.onUserResult, this);

      this.share_plugin = agent.getSharePlugin();
      this.share_plugin.setListener(this.onShareResult, this);
    }

    this.messages = {};
    var self = this;
    this.loadProto('Proto/client', function (builder) {
      self.buildMessage(builder, 'PublicProto.C_Login');
      self.buildMessage(builder, 'PublicProto.S_LoginRet');
      self.buildMessage(builder, 'PublicProto.S_Notice');
      self.buildMessage(builder, 'PublicProto.C_SendChat');
      self.buildMessage(builder, 'PublicProto.S_Chat');
      self.buildMessage(builder, 'PublicProto.C_G13_JionGame');
      self.buildMessage(builder, 'PublicProto.C_G13_CreateGame');
      self.buildMessage(builder, 'PublicProto.S_G13_PlayersInRoom');
      self.buildMessage(builder, 'PublicProto.S_G13_RoomAttr');
      self.buildMessage(builder, 'PublicProto.C_G13_GiveUp');
      self.buildMessage(builder, 'PublicProto.S_G13_VoteFailed');
      self.buildMessage(builder, 'PublicProto.S_G13_AbortGameOrNot');
      self.buildMessage(builder, 'PublicProto.C_G13_VoteFoAbortGame');
      self.buildMessage(builder, 'PublicProto.S_G13_PlayerQuited');
      self.buildMessage(builder, 'PublicProto.C_G13_ReadyFlag');
      self.buildMessage(builder, 'PublicProto.S_G13_PlayersInRoom');
      self.buildMessage(builder, 'PublicProto.S_G13_HandOfMine');
      self.buildMessage(builder, 'PublicProto.C_G13_BringOut');
      self.buildMessage(builder, 'PublicProto.S_G13_AllHands');
    });
    this.loadProtoID();
  },

  onUserResult: function onUserResult(code, msg) {
    switch (code) {
      case anysdk.UserActionResultCode.kInitSuccess:
        //初始化成功
        cc.guimanager.msgBox("kInitSuccess");
        this.user_plugin_init_success = true;
        break;
      case anysdk.UserActionResultCode.kLoginSuccess:
        //登录成功
        this.loginSuccess = true;
        cc.guimanager.msgBox(msg);
        break;
      case anysdk.UserActionResultCode.kInitFail:
        //初始化 SDK 失败回调
        //SDK 初始化失败，游戏相关处理
        this.user_plugin_init_success = false;
        cc.guimanager.msgBox("kInitFail");
        break;
    }
  },

  // login:function(){

  // },

  logout: function logout() {
    if (this.user_plugin_init_success && this.loginSuccess) {
      this.user_plugin.logout();
    }
  },

  onShareResult: function onShareResult(code, msg) {},

  loadProto: function loadProto(path, call) {
    var self = this;
    cc.loader.loadRes(path, function (err, proto) {
      var builder = self.ProtoBuf.protoFromString(proto);
      call(builder);
    });
  },

  buildMessage: function buildMessage(builder, name) {
    this.messages[name] = builder.build(name);
  },

  loadProtoID: function loadProtoID() {
    var self = this;
    cc.loader.loadRes('Proto/protoid', function (err, protoid) {
      self.id_name_map = JSON.parse(protoid);
    });
  },

  id_name_convert: function id_name_convert(id_or_name) {
    return this.proto_id_name_map[id_or_name];
  },

  connect: function connect(ip, port, func) {
    if (this.jbsocket == null) this.jbsocket = new JBSocket();

    this.jbsocket.onopen = function () {
      func(true);
    };

    var self = this;
    this.jbsocket.onerror = function (data) {
      if (data.errorid == JBSocket.ConnectError) func(false);else {
        // self.dispach('dispachMsg','onNetError',data.errorid);
        cc.log('error:');
        self.close();
      }
    };
    this.jbsocket.onmessage = function (data) {
      cc.log('data.msgid:' + data.msgid);
      self.dispachMsg(data.msgid, data.msg);
    };
    this.jbsocket.connect(ip, port);

    this.serverIP = ip;
    this.serverPort = port;
  },

  reconnect: function reconnect() {
    var self = this;
    cc.guimanager.wait('正在连接,请稍后...');
    this.connect(this.serverIP, this.serverPort, function (isConnect) {
      cc.guimanager.closeWait();
      if (!isConnect) {
        cc.guimanager.msgBox('连接失败,点击确定重试!', function () {
          cc.netmanager.reconnect();
        });
      } else {
        //连接成功 ,准备登陆
        self.login(self.loginType);
      }
    });
  },

  //登陆返回
  PublicProto_S_LoginRet: function PublicProto_S_LoginRet(msg) {
    if (msg.ret_code == 1 && !this.firstLogin) {
      cc.log('重连成功!');
    }
    this.firstLogin = false;
  },

  login: function login(type) {
    if (cc.sys.isMobile) {
      if (this.user_plugin_init_success) {
        this.user_plugin.login();
      }
    } else {
      var msg = this.msg('PublicProto.C_Login');
      msg.login_type = type;
      msg.openid = cc.datamanager.getUserOpenId();
      cc.log("openid = " + msg.openid);
      msg.token = 'xxxxx';
      msg.nick_name = cc.datamanager.getNickName();
      cc.datamanager.mainPlayerData.nick_name = msg.nick_name;
      cc.datamanager.mainPlayerData.openid = msg.openid;
      cc.log("openid = " + msg.openid + ", nickname = " + msg.nick_name);
      this.send(msg);
      this.loginType = type;
    }
  },

  onDisconnect: function onDisconnect() {
    //重连
    if (!this.firstLogin) {
      var self = this;
      cc.guimanager.msgBox('网络断开,点击确定尝试重连!', function () {
        cc.netmanager.reconnect();
      });
    }
  },

  //关闭网络
  close: function close() {
    if (this.jbsocket != null) {
      this.jbsocket.close();
      this.jbsocket = null;
      cc.log('onDisconnect');
      this.onDisconnect();
    }
  },

  //分发消息
  dispachMsg: function dispachMsg(msgid, msg) {
    var msgname = this.id_name_map[String(msgid)];
    var msgdata = this.messages[msgname].decode(msg);
    var msghandlername = msgname.replace('.', '_');

    cc.log('recv:' + msgname);
    if (typeof this[msghandlername] == 'function') {
      this[msghandlername](msgdata);
    }
    this.dispach("dispachMsg", msghandlername, msgdata);
  },

  dispach: function dispach(funcname, name, data) {
    for (var i = 0; i < this.handler.length; ++i) {
      this.handler[i][funcname](name, data);
    }
  },

  //申请一个 msg
  msg: function msg(msgname) {
    var message = this.messages[msgname];
    if (message) {
      var ret = new message();
      ret.__msgid = this.id_name_map[msgname];
      return ret;
    }
    return null;
  },

  //发送msg
  send: function send(msg) {
    if (this.jbsocket != null) {
      var id = msg.__msgid;
      this.jbsocket.send(id, new Uint8Array(msg.toBuffer()));
    }
  },

  registerHandler: function registerHandler(handler) {
    var self = this;
    if (handler != null && typeof handler.dispachMsg == 'function') {
      self.handler.push(handler);
    }
  }
});
cc.netmanager = new M();

cc._RF.pop();
},{"bytebuffer":"bytebuffer","long":"long","protobuf":"protobuf"}],"NetManager":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'ba6d9dJZGBATpJFt+e5rKLY', 'NetManager');
// Scripts\Manager\NetManager.js

'use strict';

var M = cc.Class({
  ctor: function ctor() {
    require('long');
    require('bytebuffer');
    this.ProtoBuf = require('protobuf');
    this.handler = [];
    this.firstLogin = true;
  },

  init: function init() {

    this.messages = {};
    var self = this;
    this.loadProto('Proto/client', function (builder) {
      self.buildMessage(builder, 'PublicProto.C_Login');
      self.buildMessage(builder, 'PublicProto.S_LoginRet');
      self.buildMessage(builder, 'PublicProto.S_Notice');
      self.buildMessage(builder, 'PublicProto.C_SendChat');
      self.buildMessage(builder, 'PublicProto.S_Chat');
      self.buildMessage(builder, 'PublicProto.C_G13_JionGame');
      self.buildMessage(builder, 'PublicProto.C_G13_CreateGame');
      self.buildMessage(builder, 'PublicProto.S_G13_PlayersInRoom');
      self.buildMessage(builder, 'PublicProto.S_G13_RoomAttr');
      self.buildMessage(builder, 'PublicProto.C_G13_GiveUp');
      self.buildMessage(builder, 'PublicProto.S_G13_VoteFailed');
      self.buildMessage(builder, 'PublicProto.S_G13_AbortGameOrNot');
      self.buildMessage(builder, 'PublicProto.C_G13_VoteFoAbortGame');
      self.buildMessage(builder, 'PublicProto.S_G13_PlayerQuited');
      self.buildMessage(builder, 'PublicProto.C_G13_ReadyFlag');
      self.buildMessage(builder, 'PublicProto.S_G13_PlayersInRoom');
      self.buildMessage(builder, 'PublicProto.S_G13_HandOfMine');
      self.buildMessage(builder, 'PublicProto.C_G13_BringOut');
      self.buildMessage(builder, 'PublicProto.S_G13_AllHands');
      self.buildMessage(builder, 'PublicProto.S_G13_AllRounds');
      self.buildMessage(builder, 'PublicProto.C_G13_ReqGameHistoryCount');
      self.buildMessage(builder, 'PublicProto.S_G13_GameHistoryCount');
      self.buildMessage(builder, 'PublicProto.C_G13_ReqGameHistoryDetial');
      self.buildMessage(builder, 'PublicProto.S_G13_GameHistoryDetial');
    });
    this.loadProtoID();
  },

  loadProto: function loadProto(path, call) {
    var self = this;
    cc.loader.loadRes(path, function (err, proto) {
      var builder = self.ProtoBuf.protoFromString(proto);
      call(builder);
    });
  },

  buildMessage: function buildMessage(builder, name) {
    this.messages[name] = builder.build(name);
  },

  loadProtoID: function loadProtoID() {
    var self = this;
    cc.loader.loadRes('Proto/protoid', function (err, protoid) {
      self.id_name_map = JSON.parse(protoid);
    });
  },

  id_name_convert: function id_name_convert(id_or_name) {
    return this.proto_id_name_map[id_or_name];
  },

  connect: function connect(ip, port, func) {
    if (this.jbsocket == null) this.jbsocket = new JBSocket();

    this.jbsocket.onopen = function () {
      func(true);
    };

    var self = this;
    this.jbsocket.onerror = function (data) {
      if (data.errorid == JBSocket.ConnectError) func(false);else {
        // self.dispach('dispachMsg','onNetError',data.errorid);
        cc.log('error:');
        self.close();
      }
    };
    this.jbsocket.onmessage = function (data) {
      cc.log('data.msgid:' + data.msgid);
      self.dispachMsg(data.msgid, data.msg);
    };
    this.jbsocket.connect(ip, port);

    this.serverIP = ip;
    this.serverPort = port;
  },

  reconnect: function reconnect() {
    var self = this;
    cc.guimanager.wait('正在连接,请稍后...');
    this.connect(this.serverIP, this.serverPort, function (isConnect) {
      cc.guimanager.closeWait();
      if (!isConnect) {
        cc.guimanager.msgBox('连接失败,点击确定重试!', function () {
          cc.netmanager.reconnect();
        });
      } else {
        //连接成功 ,准备登陆
        self.login(self.loginType);
      }
    });
  },

  //登陆返回
  PublicProto_S_LoginRet: function PublicProto_S_LoginRet(msg) {
    if (msg.ret_code == 1 && !this.firstLogin) {
      cc.log('重连成功!');
    }
    this.firstLogin = false;
    cc.datamanager.mainData = msg;
  },

  login: function login(type) {
    var msg = this.msg('PublicProto.C_Login');
    msg.login_type = type;
    msg.openid = cc.datamanager.getUserOpenId();
    cc.log("openid = " + msg.openid);
    msg.token = 'xxxxx';
    msg.nick_name = cc.datamanager.getNickName();
    cc.datamanager.mainPlayerData.nick_name = msg.nick_name;
    cc.datamanager.mainPlayerData.openid = msg.openid;
    cc.log("openid = " + msg.openid + ", nickname = " + msg.nick_name);
    this.send(msg);
    this.loginType = type;
  },

  onDisconnect: function onDisconnect() {
    //重连
    if (!this.firstLogin) {
      var self = this;
      cc.guimanager.msgBox('网络断开,点击确定尝试重连!', function () {
        cc.netmanager.reconnect();
      });
    }
  },

  //关闭网络
  close: function close() {
    if (this.jbsocket != null) {
      this.jbsocket.close();
      this.jbsocket = null;
      cc.log('onDisconnect');
      this.onDisconnect();
    }
  },

  //分发消息
  dispachMsg: function dispachMsg(msgid, msg) {
    var msgname = this.id_name_map[String(msgid)];
    var msgdata = this.messages[msgname].decode(msg);
    var msghandlername = msgname.replace('.', '_');

    cc.log('recv:' + msgname);
    if (typeof this[msghandlername] == 'function') {
      this[msghandlername](msgdata);
    }
    this.dispach("dispachMsg", msghandlername, msgdata);
  },

  dispach: function dispach(funcname, name, data) {
    for (var i = 0; i < this.handler.length; ++i) {
      this.handler[i][funcname](name, data);
    }
  },

  //申请一个 msg
  msg: function msg(msgname) {
    var message = this.messages[msgname];
    if (message) {
      var ret = new message();
      ret.__msgid = this.id_name_map[msgname];
      return ret;
    }
    return null;
  },

  //发送msg
  send: function send(msg) {
    if (this.jbsocket != null) {
      var id = msg.__msgid;
      cc.log('id:' + id);
      this.jbsocket.send(id, new Uint8Array(msg.toBuffer()));
    }
  },

  registerHandler: function registerHandler(handler) {
    var self = this;
    if (handler != null && typeof handler.dispachMsg == 'function') {
      self.handler.push(handler);
    }
  }
});
cc.netmanager = new M();

cc._RF.pop();
},{"bytebuffer":"bytebuffer","long":"long","protobuf":"protobuf"}],"PokerFlop":[function(require,module,exports){
"use strict";
cc._RF.push(module, '4aa02SHwA5J/YHD3/WAPCTa', 'PokerFlop');
// Scripts\Gui\PokerFlop.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        topNode: cc.Node,
        middleNode: cc.Node,
        bottomNode: cc.Node,
        styleNode: cc.Node,

        dankongNode: cc.Node,
        shouqiangNode: cc.Node,
        jgqNode: cc.Node,

        _pokerData: null //13张牌(1,2,3墩顺序)
    },

    // use this for initialization
    onLoad: function onLoad() {
        //this._allPokerValues = [52,51,50,49,48,47,46,45,44,43,42,41,40]
    },

    //data来自S_G13_AllHands消息
    initPokerValues: function initPokerValues(data) {
        this._pokerData = data;
    },

    resetState: function resetState() {
        for (var i = 0; i < this.topNode.childrenCount; ++i) {
            var nd = this.topNode.children[i];
            cc.PokerUtil.replacePokerSprite("back", nd);
        }
        for (var i = 0; i < this.middleNode.childrenCount; ++i) {
            var nd = this.middleNode.children[i];
            cc.PokerUtil.replacePokerSprite("back", nd);
        }
        for (var i = 0; i < this.bottomNode.childrenCount; ++i) {
            var nd = this.bottomNode.children[i];
            cc.PokerUtil.replacePokerSprite("back", nd);
        }
        this.styleNode.active = false;
    },

    //翻第一墩牌
    topFlopAction: function topFlopAction(param) {
        return cc.sequence(cc.callFunc(function (target, param) {
            for (var i = 0; i < param.topNode.childrenCount; ++i) {
                var pokerVal = param._pokerData.cards[i];
                cc.PokerUtil.replacePokerSprite(pokerVal, param.topNode.children[i]);
            }
            var cfg = cc.configmanager.pokerFlopCfg[param._pokerData.dun0.brand];
            param.styleNode.active = true;
            cc.PokerUtil.replaceSprite(cfg.texres, param.styleNode);
            cc.audiomanager.playSFX(cfg.sound_male);
        }, this, param), cc.delayTime(1.2));
    },

    //翻第二墩牌
    middleFlopAction: function middleFlopAction(param) {
        return cc.sequence(cc.callFunc(function (target, param) {
            for (var i = 0; i < param.middleNode.childrenCount; ++i) {
                var pokerVal = param._pokerData.cards[i + 3];
                cc.PokerUtil.replacePokerSprite(pokerVal, param.middleNode.children[i]);
            }

            var cfg = cc.configmanager.pokerFlopCfg[param._pokerData.dun1.brand];
            param.styleNode.active = true;

            if (param._pokerData.dun1.brand == 6) {
                //中墩葫芦
                cc.PokerUtil.replaceSprite("Textures/PokerStyle/zhongdunhulu", param.styleNode);
                cc.audiomanager.playSFX("M_中墩葫芦");
            } else {
                cc.PokerUtil.replaceSprite(cfg.texres, param.styleNode);
                cc.audiomanager.playSFX(cfg.sound_male);
            }
        }, this, param), cc.delayTime(1.2));
    },

    //翻第三墩牌
    bottomFlopAction: function bottomFlopAction(param) {
        return cc.sequence(cc.callFunc(function (target, param) {
            for (var i = 0; i < param.bottomNode.childrenCount; ++i) {
                var pokerVal = param._pokerData.cards[i + 8];
                cc.PokerUtil.replacePokerSprite(pokerVal, param.bottomNode.children[i]);
            }

            var cfg = cc.configmanager.pokerFlopCfg[param._pokerData.dun2.brand];
            param.styleNode.active = true;
            cc.PokerUtil.replaceSprite(cfg.texres, param.styleNode);
            cc.audiomanager.playSFX(cfg.sound_male);
        }, this, param), cc.delayTime(1.2));
    },

    //播放弹孔动画
    startDanKongAnim: function startDanKongAnim() {
        this.dankongNode.active = true;
        this.dankongNode.getComponent(cc.Animation).play();
    },

    endDanKongAnim: function endDanKongAnim() {
        this.dankongNode.active = false;
    },

    //播放打枪动画
    startDaQiangAnim: function startDaQiangAnim() {
        this.shouqiangNode.active = true;
        this.shouqiangNode.getComponent(cc.Animation).play();
    },

    endDaQiangAnim: function endDaQiangAnim() {
        this.shouqiangNode.active = false;
    }
});

cc._RF.pop();
},{}],"PokerList":[function(require,module,exports){
"use strict";
cc._RF.push(module, '4b7307CmeVHsZbpKkNZL3la', 'PokerList');
// Scripts\Gui\PokerList.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},

    resetState: function resetState() {
        for (var i = 0; i < this.node.childrenCount; ++i) {
            var nd = this.node.children[i];
            nd.active = false;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{}],"PokerSelectHandler":[function(require,module,exports){
"use strict";
cc._RF.push(module, '9d716g4wEJIZpBXwjMuOp28', 'PokerSelectHandler');
// Scripts\Gui\PokerSelectHandler.js

"use strict";

//处理滑动选择
if (cc.PokerSelectHandler == undefined) {
    cc.PokerSelectHandler = cc.Class({

        ctor: function ctor() {
            this._clear();
        },

        _clear: function _clear() {
            this.startNode = null;
            this.endNode = null;
            this.selectNodes = [];

            this.lastFocusNode = null;
        },

        touchStart: function touchStart(node) {
            this.lastFocusNode = node;
        },

        touchMove: function touchMove(node) {
            if (node == this.lastFocusNode) {
                return;
            }
        },

        touchEnd: function touchEnd(node) {
            this.endNode = node;
        }

    });
}

cc._RF.pop();
},{}],"PokerSelect":[function(require,module,exports){
"use strict";
cc._RF.push(module, '3b47a4kgtxMBrjGDVwvwKDi', 'PokerSelect');
// Scripts\Gui\PokerSelect.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _isSelected: false,
        _pokerVal: 0,
        _pokerIndex: -1
    },

    // use this for initialization
    onLoad: function onLoad() {
        /*
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS){
            this.node.on(cc.Node.EventType.TOUCH_START, this._onSelect);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onMove);
             this.node.on(cc.Node.EventType.TOUCH_END, this._onMoveEnd);
        }else{
            this.node.on(cc.Node.EventType.MOUSE_DOWN, this._onSelect);
            this.node.on(cc.Node.EventType.MOUSE_MOVE, this._onMove);
            this.node.on(cc.Node.EventType.MOUSE_UP, this._onMoveEnd);
        }
        */
    },

    _onSelect: function _onSelect(event) {
        var component = event.currentTarget.getComponent("PokerSelect");
        var pokerSort = cc.find("UIPokerGame/PokerSort").getComponent("PokerSort");
        if (!component._isSelected) {
            component.moveOut(event.currentTarget);
            pokerSort.selectCard(component._pokerVal);
        } else {
            component.moveBack(event.currentTarget);
            pokerSort.unselectCard(component._pokerVal);
        }
        pokerSort._lastFocusPoker = event.currentTarget;
        pokerSort._focusBegin = true;

        pokerSort.log.string = "_onSelect " + pokerSort._focusBegin.toString() + " " + component._pokerIndex.toString();
    },

    _onMove: function _onMove(event) {

        var pokerSort = cc.find("UIPokerGame/PokerSort").getComponent("PokerSort");
        if (pokerSort._focusBegin == false) {
            return;
        }

        var target = pokerSort._selectPoker(event.getLocation());

        if (target != null) {
            var component = target.getComponent("PokerSelect");
            pokerSort.log.string = "_onMove " + pokerSort._focusBegin.toString() + " " + component._pokerIndex.toString();

            if (target == pokerSort._lastFocusPoker) {
                return;
            }

            pokerSort._lastFocusPoker = target;

            if (!component._isSelected) {
                component.moveOut(target);
                pokerSort.selectCard(component._pokerVal);
            } else {
                component.moveBack(target);
                pokerSort.unselectCard(component._pokerVal);
            }
        }
    },

    _onMoveEnd: function _onMoveEnd(event) {
        var component = event.currentTarget.getComponent("PokerSelect");
        var pokerSort = cc.find("UIPokerGame/PokerSort").getComponent("PokerSort");
        pokerSort._focusBegin = false;

        pokerSort.log.string = "_onMoveEnd " + pokerSort._focusBegin.toString() + " " + component._pokerIndex.toString();
    },

    moveOut: function moveOut(node) {
        this._isSelected = true;
        node.runAction(cc.moveBy(0.06, cc.p(0, 20)));
    },

    moveBack: function moveBack(node) {
        this._isSelected = false;
        node.runAction(cc.moveBy(0.06, cc.p(0, -20)));
    },

    setPokerValue: function setPokerValue(val) {
        this._pokerVal = val;
        cc.PokerUtil.replacePokerSprite(val, this.node);
        /*
        var sprite = this.node.getComponent(cc.Sprite);
        var url = cc.PokerUtil.getPokerSpritePath(val);
        cc.log(url);
        cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame){
            cc.log(url, spriteFrame, sprite)
            sprite.spriteFrame = spriteFrame;
        })
        */
    },

    setPokerIndex: function setPokerIndex(idx) {
        this._pokerIndex = idx;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{}],"PokerSort":[function(require,module,exports){
"use strict";
cc._RF.push(module, '60027OfYfZM9aft31kToOk+', 'PokerSort');
// Scripts\Gui\PokerSort.js

"use strict";

require('UIPanel');
require("PokerSelectHandler");
cc.Class({
    extends: cc.uipanel,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        pokerSelectPrefab: cc.Prefab,
        sortTypeLabel: cc.Label,
        topBtnLabel: cc.Label,
        middleBtnLabel: cc.Label,
        bottomBtnLabel: cc.Label,
        cardList: cc.Node,
        confirmBtn: cc.Node,
        autoTypeContainer: cc.Node,
        freeBtn: cc.Node,
        recommandBtn: cc.Node,
        specialBtn: cc.Node,
        log: cc.Label,
        resetAllBtn: cc.Node,

        _top: [],
        _middle: [],
        _bottom: [],
        _pokerList: null,
        _currentSortType: 1, //默认按大小排序

        _freePoker: null,

        //_pokerSelectHandler: null,

        _lastFocusPoker: null, //当前抽出的牌
        _focusBegin: false, //是否滑动开始

        _curOpType: 1 },

    // use this for initialization
    onLoad: function onLoad() {
        this.initPokers();
        this.initFreeSort();
        //this._pokerSelectHandler = new cc.PokerSelectHandler();

        if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) {
            this.cardList.on(cc.Node.EventType.TOUCH_START, function (event) {
                this._onTouchBegin(event);
            }.bind(this));
            this.cardList.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                this._onTouchMove(event);
            }.bind(this));
            this.cardList.on(cc.Node.EventType.TOUCH_END, function (event) {
                this._onTouchEnd(event);
            }.bind(this));
        } else {
            this.cardList.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
                this._onTouchBegin(event);
            }.bind(this));
            this.cardList.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
                this._onTouchMove(event);
            }.bind(this));
            this.cardList.on(cc.Node.EventType.MOUSE_UP, function (event) {
                this._onTouchEnd(event);
            }.bind(this));
        }
    },

    /*
        _onMoveEnd: function(event){
             var pokerSort = cc.find("UIPokerGame/PokerSort").getComponent("PokerSort")
             pokerSort._focusBegin = false
    
             pokerSort.log.string = "_onMoveEnd"
        },
    */
    initPokers: function initPokers() {
        this._pokerList = [];
        this._unselectPoker = cc.gamemanager.getCurMathPokers(); //未放入的13张牌
        this._selectedPoker = []; //选择准备放入的牌

        //var width = cc.configmanager.wndScale * 60
        this._currentSortType = 1;
        cc.PokerUtil.sortPoker(this._currentSortType, this._unselectPoker);
        //var totalSize = (this._unselectPoker.length - 1) * 60 / 2;
        for (var i = 0; i < this._unselectPoker.length; ++i) {
            //var selectPoker = cc.instantiate(this.pokerSelectPrefab);
            var selectPoker = this.cardList.children[i];
            selectPoker.active = true;
            var script = selectPoker.getComponent("PokerSelect");

            var pokerVal = this._unselectPoker[i];
            script.setPokerValue(pokerVal);
            script.setPokerIndex(i);

            //selectPoker.parent = this.cardList;
            //selectPoker.position = cc.v2(-totalSize+i*60, 0);
            this._pokerList.push(selectPoker);
        }
        //var scale = cc.configmanager.wndScale
        //this.cardList.setScale(scale, scale)

        //检测是否有特殊牌型

        var curPokers = cc.gamemanager.getCurMathPokers();
        for (var i = 0; i < cc.PokerUtil.specialGroup.length; ++i) {
            var ret = cc.PokerUtil.specialGroup[i](curPokers);
            if (ret != null) {
                cc.log("检测到有特殊牌型!!! type= ", i);
                this._specialCard = ret;
                this.specialBtn.active = true;
            }
        }
    },

    //将留下的牌重新排序
    _resetPokers: function _resetPokers() {
        this._resetPokersState();
        var index = 0;
        cc.PokerUtil.sortPoker(this._currentSortType, this._unselectPoker);
        for (var i = 0; i < this._unselectPoker.length; ++i) {
            var pokerVal = this._unselectPoker[i];
            if (pokerVal != 0) {
                var node = this._pokerList[index];
                index = index + 1;
                node.active = true;
                var script = node.getComponent("PokerSelect");
                script.setPokerValue(pokerVal);
            }
        }
        for (var i = index; i < this._pokerList.length; ++i) {
            this._pokerList[i].active = false;
        }
    },

    //把牌设回初始位置
    _resetPokersState: function _resetPokersState() {
        for (var i = 0; i < this._pokerList.length; ++i) {
            var node = this._pokerList[i];
            var script = node.getComponent("PokerSelect");
            if (script._isSelected == true) {
                script.moveBack(node);
            }
        }
    },

    //将牌放入墩中
    //type:1,2,3 代表三顿
    //cards代表要放入的牌
    _putdownPoker: function _putdownPoker(type, cards) {
        var number = cards.length;
        if (type == 1 && number > 3 - this._top.length || type == 2 && number > 5 - this._middle.length || type == 3 && number > 5 - this._bottom.length) {
            cc.log("选择的牌数量太多!" + number);
            return;
        }

        for (var i = 0; i < number; ++i) {
            var pokerVal = cards[i];
            if (type == 1) {
                var path = "UIPokerGame/PokerSort/top/cards/card" + (this._top.length + 1);
                var node = cc.find(path);
                cc.PokerUtil.replacePokerSprite(pokerVal, node);
                this._top.push(pokerVal);
            } else if (type == 2) {
                var node = cc.find("UIPokerGame/PokerSort/middle/cards/card" + (this._middle.length + 1));
                cc.PokerUtil.replacePokerSprite(pokerVal, node);
                this._middle.push(pokerVal);
            } else if (type == 3) {
                var node = cc.find("UIPokerGame/PokerSort/bottom/cards/card" + (this._bottom.length + 1));
                cc.PokerUtil.replacePokerSprite(pokerVal, node);
                this._bottom.push(pokerVal);
            }
        }

        this.topBtnLabel.string = "放入";
        if (this._top.length == 3) {
            this.topBtnLabel.string = "清除";
        }

        this.middleBtnLabel.string = "放入";
        if (this._middle.length == 5) {
            this.middleBtnLabel.string = "清除";
        }

        this.bottomBtnLabel.string = "放入";
        if (this._bottom.length == 5) {
            this.bottomBtnLabel.string = "清除";
        }

        this.onPutdownCard();
        this._resetPokers();
    },

    //清除各墩牌
    //type: 1,2,3 代表三墩
    clearPokerHole: function clearPokerHole(event, type) {

        var path = "";
        var number = 0;

        if (type == 1 && this._top.length == 0 || type == 2 && this._middle.length == 0 || type == 3 && this._bottom.length == 0) {
            return;
        }

        if (type == 1) {
            this.onFallbackCard(this._top);
            this._top = [];
            path = "UIPokerGame/PokerSort/top/cards/card";
            number = 3;
            this.topBtnLabel.string = "放入";
        } else if (type == 2) {
            this.onFallbackCard(this._middle);
            this._middle = [];
            path = "UIPokerGame/PokerSort/middle/cards/card";
            number = 5;
            this.middleBtnLabel.string = "放入";
        } else {
            this.onFallbackCard(this._bottom);
            this._bottom = [];
            path = "UIPokerGame/PokerSort/bottom/cards/card";
            number = 5;
            this.bottomBtnLabel.string = "放入";
        }

        var url = "Textures/headBG";
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            for (var i = 1; i <= number; ++i) {
                var node = cc.find(path + i);
                var sprite = node.getComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
            }
        });
        this._resetPokers();
        this._refreshState();
        this._reCalculateFreeSort();
    },

    _refreshState: function _refreshState() {
        var visible = this._top.length == 3 && this._middle.length == 5 && this._bottom.length == 5;
        this.confirmBtn.active = visible;
        this.resetAllBtn.active = visible;
    },

    onClick_PutTop: function onClick_PutTop() {
        if (this._top.length < 3) {
            this._putdownPoker(1, this._selectedPoker);
        } else {
            //切换回自由摆拍模式
            //if(this._curOpType == 2){
            //    this._curOpType = 1
            //}
            this.clearPokerHole(null, 1);
        }
        this._refreshState();
        this._reCalculateFreeSort();
    },

    onClick_PutMiddle: function onClick_PutMiddle() {
        if (this._middle.length < 5) {
            this._putdownPoker(2, this._selectedPoker);
            this._refreshState();
            this._reCalculateFreeSort();
        } else {
            //切换回自由摆拍模式
            // if(this._curOpType == 2){
            //    this._curOpType = 1
            //}
            this.clearPokerHole(null, 2);
        }
    },

    onClick_PutBottom: function onClick_PutBottom() {
        if (this._bottom.length < 5) {
            this._putdownPoker(3, this._selectedPoker);
            this._refreshState();
            this._reCalculateFreeSort();
        } else {
            //切换回自由摆拍模式
            //if(this._curOpType == 2){
            //     this._curOpType = 1
            // }
            this.clearPokerHole(null, 3);
        }
    },

    _reCalculateFreeSort: function _reCalculateFreeSort() {

        if (this._curOpType == 1) {
            this.initFreeSort();
        }
    },

    onClick_Sort: function onClick_Sort() {
        if (this._currentSortType == 1) {
            this._currentSortType = 2;
            this.sortTypeLabel.string = "大小排序";
        } else {
            this._currentSortType = 1;
            this.sortTypeLabel.string = "花色排序";
        }
        this.clearSelectPoker();
        this._resetPokers();
    },

    //发送选择好的牌
    onClick_Confirm: function onClick_Confirm(event) {

        //判断相公
        if (cc.PokerUtil.isMessire(this._top, this._middle, this._bottom)) {
            cc.guimanager.msgBox("相公啦！请重新选牌");
            return;
        }

        var msg = cc.netmanager.msg("PublicProto.C_G13_BringOut");
        var cards = [];
        for (var i = 0; i < this._top.length; ++i) {
            cards.push(this._top[i]);
        }
        for (var i = 0; i < this._middle.length; ++i) {
            cards.push(this._middle[i]);
        }
        for (var i = 0; i < this._bottom.length; ++i) {
            cards.push(this._bottom[i]);
        }
        msg.cards = cards;
        cc.netmanager.send(msg);

        var pg = this.node.parent.getComponent("UIPokerGame").showWaitState();

        this.node.destroy();
    },

    //初始化自由摆牌
    initFreeSort: function initFreeSort(event) {

        if (this._curOpType == 2) {
            //先清除上面三墩牌
            this.clearPokerHole(null, 1);
            this.clearPokerHole(null, 2);
            this.clearPokerHole(null, 3);
        }

        this._curOpType = 1;

        this.cardList.active = true;

        this.recommandBtn.active = true;
        this.freeBtn.active = false;
        this._recommandPoker = null;

        //上次选中的牌型
        this._lastSelCardType = -1;
        this._lastSelCardIdx = -1;

        this._freePoker = cc.PokerUtil.getFreeStylePokerSet(this.getLeftCard());
        var idx = 0;
        for (var i = 0; i < this._freePoker.length; ++i) {
            var data = this._freePoker[i];
            if (data.value.length > 0) {
                this.autoTypeContainer.children[idx].active = true;
                this.autoTypeContainer.children[idx].children[0].getComponent(cc.Label).string = data.name;
                idx++;
            }
        }

        for (var i = idx; i < this.autoTypeContainer.childrenCount; ++i) {
            this.autoTypeContainer.children[i].children[0].getComponent(cc.Label).string = "";
            this.autoTypeContainer.children[i].active = false;
        }
    },

    //一键摆牌
    onClick_RecommendPokerBtn: function onClick_RecommendPokerBtn(event) {

        function printArr(a, name) {
            var str = name;
            for (var i = 0; i < a.length; ++i) {
                str += a[i] + ", ";
            }
            cc.log(str);
        }

        function printArr2(a) {
            var str = "";
            for (var i = 0; i < a.length; ++i) {
                str += "t:" + a[i].type + " v:" + a[i].value + "  , ";
            }
            cc.log(str);
        }

        this.recommandBtn.active = false;
        this.freeBtn.active = true;
        this._freePoker = null;

        //先清除上面三墩牌
        //if(this._curOpType == 1){
        this.clearPokerHole(null, 1);
        this.clearPokerHole(null, 2);
        this.clearPokerHole(null, 3);
        //}
        this._curOpType = 2;

        var ret = cc.PokerUtil.getRecommendPokerSet(this.getLeftCard());
        cc.log("一键摆盘一键摆盘 ", ret.length);
        for (var i = 0; i < ret.length; ++i) {
            var config = cc.configmanager.pokerFlopCfg;
            cc.log(ret[i].top.type, ret[i].middle.type, ret[i].bottom.type);
            printArr2(ret[i].top.card);
            printArr2(ret[i].middle.card);
            printArr2(ret[i].bottom.card);
        }

        this._recommandPoker = [];
        this._recSelIdx = -1;
        var t5Name = cc.configmanager.t5Name;
        var t3Name = cc.configmanager.t3Name;

        var idx = 0;
        for (var i = 0; i < ret.length; ++i) {
            var data = ret[i];

            if (data.top.type != -1 && data.middle.type != -1 && data.bottom.type != -1) {
                this._recommandPoker.push(data);
                var strname = t3Name[data.top.type] + " " + t5Name[data.middle.type] + " " + t5Name[data.bottom.type];
                this.autoTypeContainer.children[idx].active = true;
                this.autoTypeContainer.children[idx].children[0].getComponent(cc.Label).string = strname;
                idx++;
            }
        }

        for (var i = idx; i < this.autoTypeContainer.childrenCount; ++i) {
            this.autoTypeContainer.children[i].children[0].getComponent(cc.Label).string = "";
            this.autoTypeContainer.children[i].active = false;
        }
    },

    //自由选牌按钮点击
    onClick_FreeSelectBtn: function onClick_FreeSelectBtn(event, index) {

        this.clearSelectPoker();
        this._resetPokersState();

        if (this._curOpType == 1) {
            if (index < 0 || index >= this._freePoker.length) {
                cc.log("click _freePoker data error!");
                return;
            }

            if (this._lastSelCardType == index) {
                ++this._lastSelCardIdx;
                if (this._lastSelCardIdx >= this._freePoker[index].value.length) {
                    this._lastSelCardIdx = 0;
                }
            } else {
                this._lastSelCardType = index;
                this._lastSelCardIdx = 0;
            }

            if (this._freePoker.length > index) {
                var freePk = this._freePoker[index].value[this._lastSelCardIdx];
                cc.log(freePk.length);
                for (var i = 0; i < freePk.length; ++i) {
                    var pv = freePk[i];
                    cc.log("pv.type", pv.type, "pv.value", pv.value);
                    for (var j = 0; j < this._pokerList.length; ++j) {
                        var node = this._pokerList[j];
                        var script = node.getComponent("PokerSelect");
                        if (script._pokerVal == pv.type * 13 + pv.value && !script._isSelected) {
                            script.moveOut(node);
                            this.selectCard(script._pokerVal);
                            break;
                        }
                    }
                }
            }
        } else if (this._recommandPoker != null) {
            if (index < 0 || index >= this._recommandPoker.length) {
                cc.log("click _recommandPoker data error!");
                return;
            }

            cc.log("选中recommend ", index, this._recommandPoker.length);

            if (this._recSelIdx == index) {
                return;
            }

            this._recSelIdx = index;
            var dat = this._recommandPoker[index];

            //先清除上面三墩牌
            //this.clearPokerHole(null, 1);
            //this.clearPokerHole(null, 2);
            //this.clearPokerHole(null, 3);

            this._top = [];
            this._middle = [];
            this._bottom = [];

            var top = cc.PokerUtil.cardsEncode(dat.top.card);
            cc.log("select top size = ", top.length);
            this._selectedPoker = top.slice();
            this._putdownPoker(1, top);

            var mid = cc.PokerUtil.cardsEncode(dat.middle.card);
            cc.log("select mid size = ", mid.length);
            this._selectedPoker = mid.slice();
            this._putdownPoker(2, mid);

            var bot = cc.PokerUtil.cardsEncode(dat.bottom.card);
            cc.log("select bottom size = ", bot.length);
            this._selectedPoker = bot.slice();
            this._putdownPoker(3, bot);

            this._selectedPoker = [];
            this._refreshState();
        }
    },

    //选择特殊牌型
    selSpecialCard: function selSpecialCard(event) {
        if (this._specialCard == null) {
            return;
        }

        var msg = cc.netmanager.msg("PublicProto.C_G13_BringOut");
        var cards = [];

        if (this._specialCard.top != null) {
            if (this._specialCard.top.length != 3 || this._specialCard.middle.length != 5 || this._specialCard.bottom.length != 5) {
                cc.log("特殊牌型判断错误！！！");
                return;
            }
            cards = cards.concat(this._specialCard.top, this._specialCard.middle, this._specialCard.bottom);
        } else {
            cards = cc.gamemanager.getCurMathPokers().slice();
        }
        msg.cards = cards;
        cc.netmanager.send(msg);
        cc.log("发送特殊牌型!!!!!");
        this.node.destroy();
    },

    //重置三墩牌
    resetThreeDun: function resetThreeDun() {
        if (this._curOpType == 2) {
            this.onClick_RecommendPokerBtn();
        } else {
            this.onClick_PutTop();
            this.onClick_PutMiddle();
            this.onClick_PutBottom();
        }
    },

    selectCard: function selectCard(val) {
        cc.log("select: " + val);
        this._selectedPoker.push(val);
    },

    unselectCard: function unselectCard(val) {
        for (var i = 0; i < this._selectedPoker.length; ++i) {
            if (this._selectedPoker[i] == val) {
                this._selectedPoker.splice(i, 1);
            }
        }
        cc.log("unselect: " + val + ", already unselect num: " + this._selectedPoker.length);
    },

    //清除选中的数字
    onPutdownCard: function onPutdownCard() {
        for (var i in this._unselectPoker) {
            var index = this._selectedPoker.indexOf(this._unselectPoker[i]);
            if (index != -1) {
                this._selectedPoker.splice(index, 1);
                this._unselectPoker[i] = 0;
            }
        }
        this._selectedPoker = [];
    },

    onFallbackCard: function onFallbackCard(cards) {
        for (var i = 0; i < cards.length; ++i) {
            for (var j = 0; j < this._unselectPoker.length; ++j) {
                if (this._unselectPoker[j] == 0) {
                    this._unselectPoker[j] = cards[i];
                    break;
                }
            }
        }
        this._selectedPoker = [];
    },

    getLeftCard: function getLeftCard() {
        var ret = [];
        for (var i = 0; i < this._unselectPoker.length; ++i) {
            if (this._unselectPoker[i] != 0) {
                ret.push(this._unselectPoker[i]);
            }
        }
        cc.log("getLeftCard size = ", ret.length);
        return ret;
    },

    clearSelectPoker: function clearSelectPoker() {
        this._selectedPoker = [];
    },

    //是否在target size区域内
    _isInTarget: function _isInTarget(target, point) {
        if (target == null) {
            return false;
        }

        var locationInNode = target.convertToNodeSpace(point);
        var size = target.getContentSize();
        var rect = new cc.rect(0, 0, size.width, size.height);

        //rect.x  =   -size.width/2
        //rect.y  =   -size.height/2

        if (cc.rectContainsPoint(rect, locationInNode)) {
            return true;
        }
        return false;
    },

    //选择牌
    _selectPoker: function _selectPoker(point) {
        for (var i = this._pokerList.length - 1; i >= 0; --i) {
            var target = this._pokerList[i];
            if (target.active && this._isInTarget(target, point)) {
                return target;
            }
        }
        return null;
    },

    _onTouchBegin: function _onTouchBegin(event) {
        if (this._focusBegin == true) {
            return;
        }

        var target = this._selectPoker(event.getLocation());
        if (target != null) {
            var component = target.getComponent("PokerSelect");
            if (!component._isSelected) {
                component.moveOut(target);
                this.selectCard(component._pokerVal);
            } else {
                component.moveBack(target);
                this.unselectCard(component._pokerVal);
            }
            this._lastFocusPoker = target;
            this._focusBegin = true;
        }
    },

    _onTouchMove: function _onTouchMove(event) {
        if (this._focusBegin == false) {
            return;
        }

        var target = this._selectPoker(event.getLocation());

        if (target != null) {
            var component = target.getComponent("PokerSelect");

            if (target == this._lastFocusPoker) {
                return;
            }

            this._lastFocusPoker = target;

            if (!component._isSelected) {
                component.moveOut(target);
                this.selectCard(component._pokerVal);
            } else {
                component.moveBack(target);
                this.unselectCard(component._pokerVal);
            }
        }
    },

    _onTouchEnd: function _onTouchEnd(event) {
        this._focusBegin = false;
        this._lastFocusPoker = null;
    }
});

cc._RF.pop();
},{"PokerSelectHandler":"PokerSelectHandler","UIPanel":"UIPanel"}],"PokerUtils":[function(require,module,exports){
"use strict";
cc._RF.push(module, '101ac+LJ2hPvIGflq7FJ34a', 'PokerUtils');
// Scripts\Manager\PokerUtils.js

"use strict";

var M = cc.Class({
	ctor: function ctor() {},

	/*
 扑克牌描述
     花色：  黑桃 3  、红桃 2 、 梅花 1 、方块 0
     牌点数： 2 ~ A == 1 ~ 13
     牌数值 = (花色 * 13 + 点数 - 1 )
 */

	_getPokerSpritePath: function _getPokerSpritePath(pokerVal) {
		return "Textures/Poker/" + pokerVal.toString();
	},

	//设置扑克牌图片
	replacePokerSprite: function replacePokerSprite(pokerVal, node) {
		var sprite = node.getComponent(cc.Sprite);
		var url = cc.PokerUtil._getPokerSpritePath(pokerVal);
		cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
			sprite.spriteFrame = spriteFrame;
		});
	},

	//设置扑克牌图片
	replaceSprite: function replaceSprite(path, node) {
		var sprite = node.getComponent(cc.Sprite);
		cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
			sprite.spriteFrame = spriteFrame;
		});
	},

	//返回牌花色和点数
	_getCardType: function _getCardType(x) {
		var ret = {};
		ret.x = (x - 1) / 13;
		ret.y = (x - 1) % 13;
		return ret;
	},

	//单张扑克解码
	singleCardsDecode: function singleCardsDecode(c) {
		var ret = {};
		ret.type = Math.floor((c - 1) / 13);
		ret.value = c - ret.type * 13;
		return ret;
	},

	//单张扑克编码
	singleCardsEncode: function singleCardsEncode(o) {
		return o.type * 13 + o.value;
	},

	//扑克解码
	cardsDecode: function cardsDecode(cArr) {
		var arr = [];
		for (var i = 0; i < cArr.length; ++i) {
			var c = {};
			c.type = Math.floor((cArr[i] - 1) / 13);
			c.value = cArr[i] - c.type * 13;
			arr.push(c);
		}
		return arr;
	},

	//扑克编码
	cardsEncode: function cardsEncode(cArr) {
		var arr = [];
		for (var i = 0; i < cArr.length; ++i) {
			var c = cArr[i];
			arr.push(c.type * 13 + c.value);
		}
		return arr;
	},

	_copyArray: function _copyArray(arr) {
		var ret = [];
		for (var i = 0; i < arr.length; ++i) {
			ret.push(arr[i]);
		}return ret;
	},

	//删除扑克: a, b中删除同样的元素
	_delCards: function _delCards(src, del) {
		var a = cc.PokerUtil._copyArray(src);
		var b = cc.PokerUtil._copyArray(del);

		if (b.length == 0) {
			return a;
		}
		for (var i = a.length - 1; i >= 0; --i) {
			for (var j = 0; j < b.length; ++j) {
				if (a[i] == b[j]) {
					a.splice(i, 1);
					b.splice(j, 1);
				}
			}
		}
		return a;
	},

	//获取普通组合牌型 cArr: 传入未解码的牌数值数组
	getGroupCards: function getGroupCards(cArr) {
		var tmpArr = cc.PokerUtil._copyArray(cArr);
		cc.PokerUtil.sortPoker(1, tmpArr);
		var decodeArr = cc.PokerUtil.cardsDecode(tmpArr);

		var wlArr = [],
		    dzArr = [],
		    stArr = [],
		    tzArr = [],
		    wtArr = [],
		    sArr = [],
		    szArr = [];
		var sz_n = 0;
		var num = decodeArr.length;

		var same = [];
		var notsame = [];

		var alldz = [];

		for (var i = num - 1; i >= 0;) {
			var last = decodeArr[i];

			--i;
			var find = false;
			while (i >= 0 && last.value == decodeArr[i].value) {
				find = true;
				same.push(last);
				last = decodeArr[i];
				--i;
			}
			if (find) {
				same.push(last);

				if (same.length > 1) {
					if (same.length == 2) dzArr.push([same[1], same[0]]);
					if (same.length == 3) stArr.push([same[2], same[1], same[0]]);
					if (same.length == 4) tzArr.push([same[3], same[2], same[1], same[0]]);
					if (same.length == 5) wtArr.push([same[4], same[3], same[2], same[1], same[0]]);
				}

				for (var idx = 0; idx < same.length; ++idx) {
					alldz.push(same[idx]);
				}

				same = [];
			}
			notsame.push(last);
		}

		if (notsame.length > 0) {
			for (var i = notsame.length - 1; i >= 0;) {
				var last = notsame[i];

				--i;
				var tmp = [];
				while (i >= 0 && last.value == notsame[i].value + 1) {
					tmp.push(last);
					last = notsame[i];
					--i;
				}
				tmp.push(last);
				if (tmp.length >= 5) {
					szArr.push(tmp);
				} else {
					for (var j = 0; j < tmp.length; ++j) {
						var ele = tmp[j];
						var fnd = false;
						for (var m = 0; m < alldz.length; ++m) {
							if (alldz[m].type == ele.type && alldz[m].value == ele.value) {
								fnd = true;
								break;
							}
						}
						if (fnd == false) {
							wlArr.push(tmp[j]);
						}
					}
				}
			}
		}

		//dzArr.reverse()
		//stArr.reverse()
		//tzArr.reverse()
		//wtArr.reverse()
		wlArr.reverse();

		var ret = [];
		ret.push(wlArr, dzArr, stArr, tzArr, szArr, decodeArr, wtArr);
		return ret;
	},

	//乌龙（三张）
	wulongThree: function wulongThree(cards) {
		var cArr = cc.PokerUtil.getGroupCards(cards);
		var wlArr = cArr[0],
		    cardsArr = [];
		for (var i = wlArr.length - 1; i >= 2; --i) {
			cardsArr.push([wlArr[i], wlArr[i - 1], wlArr[i - 2]]);
		}
		return cardsArr;
	},

	//一对（三张）
	yiduiThree: function yiduiThree(cards) {
		var cardsArr = [];
		if (cards.length < 3) return cardsArr;

		var cArr = cc.PokerUtil.getGroupCards(cards);
		var wlArr = cArr[0],
		    dzArr = cArr[1];
		if (dzArr.length > 0 && wlArr.length > 0) {
			for (var i = dzArr.length - 1; i >= 0; --i) {
				cardsArr.push([dzArr[i][0], dzArr[i][1], wlArr[0]]);
			}
		}
		return cardsArr;
	},

	//三条(三张)
	santiao: function santiao(cards) {
		var cardsArr = [];
		if (cards.length < 3) return cardsArr;

		var cArr = cc.PokerUtil.getGroupCards(cards);
		var stArr = cArr[2];
		for (var i = stArr.length - 1; i >= 0; --i) {
			cardsArr.push(stArr[i]);
		}
		return cardsArr;
	},

	//乌龙(五张)
	wulongFive: function wulongFive(cards) {
		var cardsArr = [];
		if (cards.length < 5) return cardsArr;

		var cArr = cc.PokerUtil.getGroupCards(cards);
		var wlArr = cArr[0];
		if (wlArr.length > 4) {
			for (var i = wlArr.length - 1; i >= 4; --i) {
				var arr = [wlArr[i], wlArr[3], wlArr[2], wlArr[1], wlArr[0]];
				var cflag = false;
				for (var j = 1; j < arr.length; ++j) {
					if (arr[j].type != arr[j - 1].type) {
						//看乌龙花色是否一样,排除清一色
						cflag = true;
						break;
					}
				}
				if (cflag) {
					//不是同花色
					cflag = false;
					for (var j = 1; j < arr.length; ++j) {
						if (arr[j].value != arr[j - 1].value + 1) {
							cflag = true; //看是否是顺子
							break;
						}
					}
					//A2345
					if (cflag && arr[0].value == 13 && arr[1].value == 4 && arr[2].value == 3 && arr[3].value == 2 && arr[4].value == 1) cflag = false;

					if (cflag) {
						cardsArr.push(arr);
					}
				}
			}
		}
		return cardsArr;
	},

	//一对（五张）
	yiduiFive: function yiduiFive(cards) {
		var cardsArr = [];
		if (cards.length < 5) return cardsArr;

		var cArr = cc.PokerUtil.getGroupCards(cards);
		var wlArr = cArr[0],
		    dzArr = cArr[1];
		if (dzArr.length > 0) {
			if (wlArr.length > 2) {
				for (var i = dzArr.length - 1; i >= 0; --i) {
					cardsArr.push([dzArr[i][0], dzArr[i][1], wlArr[2], wlArr[1], wlArr[0]]);
				}
			} else if (dzArr.length > 3) {
				//乌龙不够，拆对子
				for (var i = dzArr.length - 1; i >= 3; --i) {
					cardsArr.push([dzArr[i][1], dzArr[i][0], dzArr[2][1], dzArr[1][1], dzArr[0][1]]);
				}
			}
		}
		return cardsArr;
	},

	//两对（五张)
	liangdui: function liangdui(cards) {
		var cardsArr = [];
		if (cards.length < 5) return cardsArr;
		var cArr = cc.PokerUtil.getGroupCards(cards);
		var wlArr = cArr[0],
		    dzArr = cArr[1];
		if (dzArr.length > 1 && wlArr.length > 0 || dzArr.length > 2) {
			var i = dzArr.length;
			var condition = 1;
			if (wlArr.length == 0) {
				condition = 2; //没有乌龙要拆一对
			}
			for (var j = dzArr.length - 1; j >= condition; --j) {
				if (wlArr.length == 0) {
					cardsArr.push([dzArr[j][0], dzArr[j][1], dzArr[0][0], dzArr[0][1], dzArr[1][0]]);
				} else {
					cardsArr.push([dzArr[j][0], dzArr[j][1], dzArr[0][0], dzArr[0][1], wlArr[0]]);
				}
			}
		}
		return cardsArr;
	},

	//三条（五张）：三条+两单张
	santiaoFive: function santiaoFive(cards) {
		var cardsArr = [];
		if (cards.length < 5) return cardsArr;
		var cArr = cc.PokerUtil.getGroupCards(cards);
		var wlArr = cArr[0],
		    dzArr = cArr[1],
		    stArr = cArr[2];
		if (stArr.length > 0) {
			if (wlArr.length > 1) {
				for (var i = stArr.length - 1; i >= 0; --i) {
					//三条+乌龙
					cardsArr.push([stArr[i][0], stArr[i][1], stArr[i][2], wlArr[1], wlArr[0]]);
				}
			} else if (dzArr.length > 1) {
				//三条+拆对子(三条+对子=葫芦  不属于三条)
				for (var i = stArr.length - 1; i >= 0; --i) {
					cardsArr.push([stArr[i][0], stArr[i][1], stArr[i][2], dzArr[1][0], dzArr[0][0]]);
				}
			} else if (stArr.length > 2) {
				//只有三条，要拆两个三条当俩单张
				for (var i = stArr.length - 1; i >= 2; --i) {
					cardsArr.push([stArr[i][0], stArr[i][1], stArr[i][2], stArr[1][0], stArr[0][0]]);
				}
			}
		}
		return cardsArr;
	},

	//顺子（五张）: 花色不同的顺子
	shunzi: function shunzi(cards) {
		var cardsArr = [];
		if (cards.length < 5) return cardsArr;
		var cArr = cc.PokerUtil.getGroupCards(cards);
		var wlArr = cArr[0],
		    dzArr = cArr[1],
		    szArr = cArr[4],
		    decodeArr = cArr[5];
		var szCards = [],
		    vCards = [];

		for (var i = decodeArr.length - 1; i >= 0; --i) {
			var o = decodeArr[i];
			if (i > 0 && o.value == decodeArr[i - 1].value || szCards.length > 0 && szCards[szCards.length - 1].value == decodeArr[i].value) {} else {
				szCards.push(o);
				vCards[o.value] = i;
			}
		}
		//A2345
		if (szArr.length > 0) {
			var i = szArr.length - 1;
			while (i >= 0) {
				var l = szArr[i].length - 1;
				while (l > 3) {
					var sArr = [szArr[i][l], szArr[i][l - 1], szArr[i][l - 2], szArr[i][l - 3], szArr[i][l - 4]];
					var cflag = false;
					for (var n = 1; n < sArr.length; ++n) {
						if (sArr[n].type != sArr[n - 1].type) {
							cflag = true;
							break;
						}
					}
					if (cflag) {
						sArr.reverse();
						cardsArr.push(sArr);
					}
					l--;
				}
				i--;
			}
		}
		cardsArr.reverse();
		return cardsArr;
	},

	//葫芦：三张相同+一对
	hulu: function hulu(cards) {
		var cardsArr = [];
		if (cards.length < 5) return cardsArr;
		var cArr = cc.PokerUtil.getGroupCards(cards);
		var dzArr = cArr[1],
		    stArr = cArr[2];
		if (stArr.length > 0) {
			if (dzArr.length > 0) {
				for (var i = stArr.length - 1; i >= 0; --i) {
					cardsArr.push([stArr[i][0], stArr[i][1], stArr[i][2], dzArr[0][0], dzArr[0][1]]);
				}
			} else {
				//没有对子  拆对子
				for (var i = stArr.length - 1; i >= 0; --i) {
					for (var l = 0; l < stArr.length; ++l) {
						if (l >= i) break;

						cardsArr.push([stArr[i][0], stArr[i][1], stArr[i][2], stArr[l][0], stArr[l][1]]);
					}
				}
			}
		}
		return cardsArr;
	},

	//铁支：四带一
	tiezhi: function tiezhi(cards) {
		var cardsArr = [];
		if (cards.length < 5) return cardsArr;

		var cArr = cc.PokerUtil.getGroupCards(cards);
		var wlArr = cArr[0],
		    dzArr = cArr[1],
		    stArr = cArr[2],
		    tzArr = cArr[3];
		if (tzArr.length > 0) {
			if (wlArr.length > 0) {
				for (var i = tzArr.length - 1; i >= 0; --i) {
					cardsArr.push([tzArr[i][0], tzArr[i][1], tzArr[i][2], tzArr[i][3], wlArr[0]]);
				}
			} else if (dzArr.length > 0) {
				for (var i = tzArr.length - 1; i >= 0; --i) {
					cardsArr.push([tzArr[i][0], tzArr[i][1], tzArr[i][2], tzArr[i][3], dzArr[0][0]]);
				}
			} else if (stArr.length > 0) {
				for (var i = tzArr.length - 1; i >= 0; --i) {
					cardsArr.push([tzArr[i][0], tzArr[i][1], tzArr[i][2], tzArr[i][3], stArr[0][0]]);
				}
			} else if (tzArr.length > 1) {
				for (var i = tzArr.length - 1; i >= 1; --i) {
					cardsArr.push([tzArr[i][0], tzArr[i][1], tzArr[i][2], tzArr[i][3], tzArr[0][0]]);
				}
			}
		}
		return cardsArr;
	},

	//五同
	wutong: function wutong(cards) {
		var cardsArr = [];
		if (cards.length < 5) return cardsArr;

		var cArr = cc.PokerUtil.getGroupCards(cards);
		var wtArr = cArr[6];
		if (wtArr.length > 0) {
			for (var i = wtArr.length - 1; i >= 0; --i) {
				cardsArr.push(wtArr[i]);
			}
		}
		return cardsArr;
	},

	//获取花色
	getSuit: function getSuit(cards) {
		var arr = [[], [], [], []];
		for (var i = 0; i < cards.length; ++i) {
			var suit = cards[i].type;
			arr[suit].push(cards[i]);
		}
		return arr;
	},

	//删除相同点数
	delSamePoint: function delSamePoint(cArr) {
		var arr = [],
		    cardsArr = [];
		for (var i = 0; i < cArr.length; ++i) {
			if (arr[cArr[i].value] == null) {
				arr[cArr[i].value] = true;
				cardsArr.push(cArr[i]);
			}
		}
		return cardsArr;
	},

	//同花顺
	tonghuashun: function tonghuashun(cards) {
		var cardsArr = [];
		if (cards.length < 5) return cardsArr;
		var cArr = cc.PokerUtil.getGroupCards(cards);
		var suitArr = cc.PokerUtil.getSuit(cArr[5]);

		for (var i = 3; i >= 0; --i) {
			var sArr = cc.PokerUtil.delSamePoint(suitArr[i]);
			if (sArr.length > 4) {
				//cc.PokerUtil.sortPoker(1, sArr)

				if (sArr[0].value == 13 && sArr[1].value == 12 && sArr[2].value == 11 && sArr[3].value == 10 && sArr[4].value == 9) {
					//A K Q J 10
					cardsArr.push([sArr[0], sArr[1], sArr[2], sArr[3], sArr[4]]);
				}
				var len = sArr.length;
				if (sArr[0].value == 13 && sArr[len - 4].value == 4 && sArr[len - 3].value == 3 && sArr[len - 2].value == 2 && sArr[len - 1].value == 1) {
					//A 2 3 4 5
					cardsArr.push([sArr[0], sArr[len - 1], sArr[len - 2], sArr[len - 3], sArr[len - 4]]);
				}
				for (var j = 0; j < sArr.length - 4; ++j) {
					if (sArr[j].value == sArr[j + 1].value + 1 && sArr[j + 1].value == sArr[j + 2].value + 1 && sArr[j + 2].value == sArr[j + 3].value + 1 && sArr[j + 3].value == sArr[j + 4].value + 1) {
						cardsArr.push([sArr[j], sArr[j + 1], sArr[j + 2], sArr[j + 3], sArr[j + 4]]);
					}
				}
			}
		}
		return cardsArr;
	},

	//同花
	tonghua: function tonghua(cards) {
		var cardsArr = [];
		if (cards.length < 5) {
			return cardsArr;
		}

		//cc.log("比较同花顺")
		var cArr = cc.PokerUtil.getGroupCards(cards);
		var suitArr = cc.PokerUtil.getSuit(cArr[5]);
		for (var i = 3; i >= 0; --i) {
			var sArr = suitArr[i];
			//cc.log("size = " + sArr.length)
			if (sArr.length > 4) {
				for (var l = 0; l < sArr.length - 4; ++l) {
					var len = sArr.length;
					cardsArr.push([sArr[l], sArr[len - 4], sArr[len - 3], sArr[len - 2], sArr[len - 1]]);
				}
			}
		}
		return cardsArr;
	},

	//给牌排序 sorttype: 1 大小排序 2 花色排序(牌值排序)
	sortPoker: function sortPoker(sorttype, cardlist) {
		//cc.log("========================================", sorttype)
		if (sorttype == 2) {
			cardlist.sort(function (x, y) {
				//数字越大在前
				if (x < y) return 1;
				if (x > y) return -1;
				return 0;
			});
		} else if (sorttype == 1) {
			cardlist.sort(function (x, y) {
				//var xcard = [ (x-1)/13, (x-1)%13 ];
				//var ycard = [ (y-1)/13, (y-1)%13 ];
				var xcard = cc.PokerUtil.singleCardsDecode(x);
				var ycard = cc.PokerUtil.singleCardsDecode(y);

				if (xcard.value < ycard.value) return 1;
				if (xcard.value > ycard.value) return -1;

				if (xcard.type < ycard.type) return 1;
				if (xcard.type > ycard.type) return -1;
				return 0;
			});
		}
	},

	//比较指定牌型i下：第二墩 和 第一墩 是否相公 : 是相公了 返回true
	//i: 第二墩牌型数字(0-10), a: 第二墩牌
	//b: 第一墩牌 
	//j: 表示第二墩牌的牌型(有可能第二墩有多种牌型，一般默认第一个牌型最大，所以j一般选0)

	isMessireThree: function isMessireThree(i, a, b, j) {

		//三条Five 和 三条three 比较
		if (i == 6) {
			if (a[2].value < b[2].value) {
				return true;
			}
		}

		//一对Five 和 一对three 比较
		if (i == 8) {
			if (a[0].value == b[0].value) {
				if (a[2].value < b[2].value) {
					return true;
				}
			} else if (a[0].value < b[0].value) {
				return true;
			}
		}

		//乌龙Five 和 乌龙three  比较
		if (i == 9) {
			if (a[0].value == b[0].value) {
				if (a[1].value == b[1].value) {
					if (a[2].value < b[2].value) {
						return true;
					}
				} else if (a[1].value < b[1].value) {
					return true;
				}
			} else if (a[0].value < b[0].value) {
				return true;
			}
		}
		return false;
	},

	//牌型一样情况下
	//比较指定牌型i下：第三墩 和 第二墩 是否相公  是相公返回true
	//i: 第三墩牌型(0-10)， 比较当前i牌型下a,b是否相公
	//a: 第三墩牌
	//b: 第二墩牌
	isMessireFive: function isMessireFive(i, a, b) {
		var v = [],
		    s = [];
		for (var q = 0; q < 5; ++q) {
			v.push(a[q].value);
			s.push(b[q].value);
		}
		v.sort(function (x, y) {
			return x < y;
		});
		s.sort(function (x, y) {
			return x < y;
		});

		if (i == 0 || i == 2) //五同或者四带一(铁支)
			{
				return v[2] < s[2];
			} else if (i == 3) //葫芦(三带二)
			{
				if (v[2] == s[2]) {
					if (v[0] == v[2] && s[0] == s[2]) {
						//三个都在前
						return v[3] < s[3];
					}
					if (v[0] == v[2] && s[2] == s[4]) {
						//三个在前段， 三个在后端
						return v[3] < s[0];
					}
					if (v[2] == v[4] && s[0] == s[2]) {
						return v[0] < s[3];
					}
					if (v[2] == v[4] && s[2] == s[4]) {
						return v[0] < s[0];
					}
				}
				return v[2] < s[2];
			} else if (i == 1 || i == 4 || i == 5 || i == 9) //同花顺、同花、顺子、乌龙
			{
				for (var j = 0; j < 5; ++j) {
					if (v[j] == s[j]) {
						continue;
					}
					return v[j] < s[j];
				}
			} else if (i == 6 || i == 7 || i == 8) //三条、两对、一对
			{
				var dz_1 = [],
				    dz_2 = [],
				    wl_1 = [],
				    wl_2 = [];
				for (var j = 0; j < 5; ++j) {
					if (j < 4 && v[j] == v[j + 1] || v[j] == dz_1[dz_1.length - 1]) {
						dz_1.push(v[j]);
					} else {
						wl_1.push(v[j]);
					}

					if (j < 4 && s[j] == s[j + 1] || s[j] == dz_2[dz_2.length - 1]) {
						dz_2.push(s[j]);
					} else {
						wl_2.push(s[j]);
					}
				}

				//最大的对子相同
				if (dz_1[0] == dz_2[0]) {
					if (i == 6) //santiao
						{
							if (wl_1[0] == wl_2[0]) {
								return wl_1[1] < wl_2[1];
							} else {
								return wl_1[0] < wl_2[0];
							}
						} else if (i == 7) {
						//liangdui
						if (dz_1[2] == dz_2[2]) {
							return wl_1[0] < wl_2[0];
						} else {
							return dz_1[2] < dz_2[2];
						}
					} else if (i == 8) {
						//yidui
						for (var m = 2; m < 5; ++m) {
							if (wl_1[m] < wl_2[m]) {
								return true;
							}
						}
					}
				} else if (dz_1.length > 0 && dz_2.length > 0) {
					cc.log("dz_1[0] =" + dz_1[0], "  dz_2[0] = " + dz_2[0]);
					return dz_1[0] < dz_2[0];
				}
			}
		return false;
	},

	//获取自由摆牌组合
	getFreeStylePokerSet: function getFreeStylePokerSet(cardsArr) {
		var cArr = cc.PokerUtil.getGroupCards(cardsArr);

		//顺子
		var szArr = cc.PokerUtil.shunzi(cardsArr);

		//同花顺
		var thsArr = cc.PokerUtil.tonghuashun(cardsArr);

		//同花
		var thArr = cc.PokerUtil.tonghua(cardsArr);

		//葫芦
		var hlArr = cc.PokerUtil.hulu(cardsArr);

		//wutong
		var wtArr = cc.PokerUtil.wutong(cardsArr);

		var names = ["五同", "同花顺", "铁支", "葫芦", "同花", "顺子", "三条", "对子"];
		var cardtype = [wtArr, thsArr, cArr[3], hlArr, thArr, szArr, cArr[2], cArr[1].reverse()];
		var ret = [];

		for (var i = 0; i < cardtype.length; ++i) {
			if (cardtype[i].length > 0) {
				var dt = {};
				dt.name = names[i];
				dt.value = cardtype[i];
				ret.push(dt);
			}
		}
		return ret;
	},

	//获取推荐三墩牌组合
	getRecommendPokerSet: function getRecommendPokerSet(cardsArr) {
		function printArr(a, name) {
			var str = name;
			for (var i = 0; i < a.length; ++i) {
				str += a[i] + ", ";
			}
			cc.log(str);
		}
		var t5Group = cc.PokerUtil.t5Group;
		var t3Group = cc.PokerUtil.t3Group;
		var cArr = [],
		    existArr = [],
		    cNameArr = [];

		printArr(cardsArr, "总牌：");
		for (var i = 0; i < t5Group.length - 1; ++i) //不检查乌龙，先找第一个5张组合，从大往小
		{
			var ccArr = cc.PokerUtil._copyArray(cardsArr);
			var cards_1 = t5Group[i](ccArr); //第三墩5张牌

			for (var l = 0; l < cards_1.length; ++l) {
				cc.log("cards_1  cards_1 cards_1 length ", i, cards_1.length);
				var breakfor = false;
				for (var n = 0; n < t5Group.length; ++n) {
					var tmpCards_1 = cc.PokerUtil.cardsEncode(cards_1[l]);
					printArr(tmpCards_1, "encode牌：");
					var sArr = cc.PokerUtil._delCards(ccArr, tmpCards_1);
					printArr(sArr, "剩下牌： ");
					var cards_2 = t5Group[n](sArr); //第二墩5张牌

					if (cards_2.length > 0) {
						cc.log("cards_2 cards_2 cards_2 cards_2 length ", n, cards_2.length);
						if (n < i) {
							breakfor = true;
							break;
						}
						for (var j = 0; j < cards_2.length; ++j) {
							var cflag = false;
							if (i == n) {
								//2,3墩牌型一样
								cflag = cc.PokerUtil.isMessireFive(i, cards_1[l], cards_2[j]);
							}
							if (!cflag) {
								var tmpCards_2 = cc.PokerUtil.cardsEncode(cards_2[j]);
								var tArr = cc.PokerUtil._delCards(sArr, tmpCards_2); //第一墩3张牌
								cc.log(tArr, "第二次剩下牌：");
								for (var k = 0; k < cc.PokerUtil.t3Group.length; ++k) {
									var cards_3 = cc.PokerUtil.t3Group[k](tArr);
									var cflag2 = false;

									if (cards_3.length > 0) {
										if (k == 0 && n < 6 || k == 1 && n < 8 || k == 2 && n < 9) {
											cflag2 = true;
										}
										if (k == 0 && n == 6 || k == 1 && n == 8 || k == 2 && n == 9) {
											var fl = cc.PokerUtil.isMessireThree(k, cards_2[j], cards_3[0], 0);
											cflag2 = fl == false;
										}
									}

									if (cflag2) {
										if (existArr[1000 * i + 100 * n + k] == null) {
											var cardres = { "top": { "card": [], "type": -1 }, "middle": { "card": [], "type": -1 }, "bottom": { "card": [], "type": -1 } };
											cardres.top.card = cards_3[0].slice();
											cardres.top.type = k;
											cardres.middle.card = cards_2[j].slice();
											cardres.middle.type = n;
											cardres.bottom.card = cards_1[l].slice();
											cardres.bottom.type = i;
											cArr.push(cardres);
											existArr[1000 * i + 100 * n + k] = true;

											//只找五个吧
											if (cArr.length >= 5) {
												return cArr;
											}
										}
									}
								}
							}
						}
					}
				}
				if (breakfor) {
					break;
				}
			}
		}
		return cArr;
	},

	//计算得分
	//allhands: S_G13_AllHands消息
	calculateScore: function calculateScore(allhands) {

		//是否是特殊牌型
		function isSpecial(card) {
			if (card.spec.brand == 0) {
				return false;
			}
			return true;
		}

		//算牌型得分，还没算打枪和全垒打
		//cars: 当前墩牌S_G13_AllHands.BrandInfo
		//idx: 第几墩
		//isSpecial: 是否是特殊牌型
		function getScore(cards, idx, isSpecial) {
			var score = 1;
			if (!isSpecial) {
				if (idx == 1 && cards.brand == 3) {
					//冲三
					score += 2;
				}
				if (idx == 2 && cards.brand == 6) {
					//中墩葫芦
					score += 1;
				}
				if (cards.brand == 9) {
					if (idx == 2) {
						score += 19;
					} //中墩五同
					if (idx == 3) {
						score += 9;
					} //尾墩五同	
				}
				if (cards.brand == 8) {
					if (idx == 2) {
						score += 9;
					} //中墩同花顺
					if (idx == 3) {
						score += 4;
					} //尾墩同花顺
				}
				if (cards.brand == 7) {
					if (idx == 2) {
						score += 7;
					} //中墩铁支
					if (idx == 3) {
						score += 3;
					} //尾墩铁支
				}
			} else {
				if (cards.brand == 13) {
					score += 104;
				} //青龙
				if (cards.brand == 12) {
					score += 52;
				} //一条龙
				if (cards.brand == 11) {
					score += 26;
				} //十二皇子
				if (cards.brand == 10) {
					score += 26;
				} //三同花顺
				if (cards.brand == 9) {
					score += 26;
				} //三炸弹
				if (cards.brand >= 1 && cards.brand <= 8) {
					score += 6;
				} //其他特殊牌型
			}
			return score;
		}

		//比较两墩牌
		//card1: 牌型和点数 spe1:是否是特殊牌型
		//card2: 牌型和点数 spe2:是否是特殊牌型
		function compareCard(card1, spe1, card2, spe2) {
			if (spe1 && !spe2) {
				return 1;
			}
			if (!spe1 && !spe2) {
				if (card1.brand > card2.brand) {
					return 1;
				} else if (card1.brand == card2.brand) {
					if (card1.point > card2.point) {
						return 1;
					} else if (card1.point == card2.point) {
						return 0;
					}
				}
			} else if (spe1 && spe2) {
				var a = card1.brand % 10;
				var b = card2.brand % 10;
				if (a > b) {
					return 1;
				} else if (a == b) {
					return 0;
				} else {
					return -1;
				}
			}
			return -1;
		}

		function newBrandInfo(cuid) {
			var brand = {};
			brand.cuid = cuid;
			brand.score = { "top": 0, "middle": 0, "bottom": 0, "spe": 0 };
			brand.daqianglist = [];
			brand.quanleida = false;
			return brand;
		}

		var ret = [];
		for (var i = 0; i < allhands.players.length; ++i) {
			//每个玩家一个newBrandInfo数组，保存自己赢的数据
			ret.push(newBrandInfo(allhands.players[i].cuid));
		}

		//保存胜利的玩家id

		var players = allhands.players;
		for (var i = 0; i < players.length; ++i) {
			var data1 = players[i];
			var spe1 = isSpecial(data1);

			var large = [];
			for (var j = 0; j < players.length; ++j) {
				var data2 = players[j];
				var spe2 = isSpecial(data2);

				if (i == j) {
					continue;
				}

				//特殊牌型大
				var la = {};
				var cmp = compareCard(data1.spec, spe1, data2.spec, spe2);
				if (spe1 && cmp == 1) {
					var sc = getScore(data1.spec, 0, true);
					ret[i].score.spe += sc * 2; //三墩都大
					ret[j].score.spe -= sc * 2;
					la.idx = j;
					la.score = sc * 2;
					large.push(la);
					continue;
				}

				//一般牌型
				var tmb = 0;
				var tbmScore = 0;
				cmp = compareCard(data1.dun0, spe1, data2.dun0, spe2);
				if (cmp == 1) {
					var sc = getScore(data1.dun0, 1, spe1);
					ret[i].score.top += sc;
					ret[j].score.top -= sc;
					tmb++;
					tbmScore += sc;
				}

				cmp = compareCard(data1.dun1, spe1, data2.dun1, spe2);
				if (cmp == 1) {
					var sc = getScore(data1.dun1, 2, spe1);
					ret[i].score.middle += sc;
					ret[j].score.middle -= sc;
					tmb++;
					tbmScore += sc;
				}

				cmp = compareCard(data1.dun2, spe1, data2.dun2, spe2);
				if (cmp == 1) {
					var sc = getScore(data1.dun2, 3, spe1);
					ret[i].score.bottom += sc;
					ret[j].score.bottom -= sc;
					tmb++;
					tbmScore += sc;
				}

				if (tmb == 3) {
					la.idx = j;
					la.score = tbmScore;
					large.push(la);
				}
			}

			//全垒打(两人以上才能全垒打)
			if (large.length == players.length - 1 && players.length > 2) {
				ret[i].quanleida = true;
				for (var m = 0; m < large.length; ++m) {
					ret[m].score.spe += large[m].score * 2;
					ret[large[m].idx].score.spe -= large[m].score * 2;
				}
			} else {
				//打枪
				for (var n = 0; n < large.length; ++n) {
					ret[i].score.spe += large[n].score;
					ret[large[n].idx].score.spe -= large[n].score;
					ret[i].daqianglist.push(players[large[n].idx].cuid);
				}
			}
		}

		return ret;
	},

	//判断是否相公
	isMessire: function isMessire(top, middle, bottom) {
		var toptype = -1,
		    midtype = -1,
		    bottype = -1;
		var toparr, midarr, botarr;

		for (var i = 0; i < cc.PokerUtil.t3Group.length; ++i) {
			var arr = cc.PokerUtil.t3Group[i](top);
			if (arr && arr.length > 0) {
				toptype = i;
				toparr = arr[0];
				break;
			}
		}

		for (var i = 0; i < cc.PokerUtil.t5Group.length; ++i) {
			var arr = cc.PokerUtil.t5Group[i](middle);
			if (arr && arr.length > 0 && midtype == -1) {
				midtype = i;
				midarr = arr[0];
			}

			var brr = cc.PokerUtil.t5Group[i](bottom);
			if (brr && brr.length > 0 && bottype == -1) {
				bottype = i;
				botarr = brr[0];
			}

			if (midtype != -1 && bottype != -1) {
				break;
			}
		}

		function printArr(a, s) {
			var str = s;
			for (var i = 0; i < a.length; ++i) {
				str += a[i].type.toString() + " - " + a[i].value.toString() + ", ";
			}
			cc.log(str);
		}

		cc.log("三墩牌所属的类型：", toptype, midtype, bottype);
		printArr(toparr, "第一墩牌：");
		printArr(midarr, "第二墩牌：");
		printArr(botarr, "第三墩牌：");

		if (toptype == 0 && midtype > 6 || toptype == 1 && midtype > 8) {
			cc.log("1,2墩相公");
			return true;
		}
		if (toptype == 0 && midtype == 6 || toptype == 1 && midtype == 8 || toptype == 2 && midtype == 9) {
			if (cc.PokerUtil.isMessireThree(midtype, midarr, toparr, 0)) {
				cc.log("1,2相公", midtype);
				return true;
			}
		}

		//compare 2dun and 3dun
		if (midtype < bottype) {
			cc.log("2,3相公", midtype, bottype);
			return true;
		} else if (midtype == bottype) {
			if (cc.PokerUtil.isMessireFive(bottype, botarr, midarr)) {
				cc.log("2,3墩相公", bottype);
				return true;
			}
		}
		return false;
	},

	////////////////////////////////////////////////////////////////////////////
	//特殊牌型判断  

	//14.	三同花：中墩、尾墩为同花，头墩为三张同花色的牌
	isSanTongHua: function isSanTongHua(cards) {
		var tmp = cc.PokerUtil._copyArray(cards);
		var thArr = cc.PokerUtil.tonghua(tmp);
		for (var i = 0; i < thArr.length; ++i) {
			var a = cc.PokerUtil.cardsEncode(thArr[i]);
			var b = cc.PokerUtil._delCards(tmp, a);

			var thArr2 = cc.PokerUtil.tonghua(b);
			for (var j = 0; j < thArr2.length; ++j) {
				var c = cc.PokerUtil.cardsEncode(thArr2[j]);
				var d = cc.PokerUtil._delCards(b, c);

				var suit = cc.PokerUtil.getSuit(cc.PokerUtil.cardsDecode(d));
				for (var m = 0; m < 4; ++m) {
					if (suit[m].length == 3) {
						var ret = {};
						ret.top = d.slice();
						ret.middle = c.slice();
						ret.bottom = a.slice();
						return ret;
					}
				}
			}
		}
		return null;
	},

	//13.	三顺子：中墩、尾墩为顺子，头墩为三张连续的牌
	isSanShunZi: function isSanShunZi(cards) {
		var tmp = cc.PokerUtil._copyArray(cards);
		var thArr = cc.PokerUtil.tonghua(tmp);
		for (var i = 0; i < thArr.length; ++i) {
			var a = cc.PokerUtil.cardsEncode(thArr[i]);
			var b = cc.PokerUtil._delCards(tmp, a);

			var thArr2 = cc.PokerUtil.tonghua(b);
			for (var j = 0; j < thArr2.length; ++j) {
				var c = cc.PokerUtil.cardsEncode(thArr2[j]);
				var d = cc.PokerUtil._delCards(b, c);

				var e = cc.PokerUtil.cardsDecode(d);
				if (e[0].value == e[1].value + 1 && v[1].value == v[2].value + 1) {
					var ret = {};
					ret.top = d.slice();
					ret.middle = c.slice();
					ret.bottom = a.slice();
					return ret;
				}
			}
		}
		return null;
	},

	//12.	六对半：十三张牌由六个对子加一张其他单牌组成。
	isLiuDuiBan: function isLiuDuiBan(cards) {
		var tmp = cc.PokerUtil.getGroupCards(cards);
		if (tmp[1].length == 6) {
			return {};
		}
		return null;
	},

	//11.	五对三条：十三张牌由五个对子加一组三条组成
	isWuDuiSanTiao: function isWuDuiSanTiao(cards) {
		var tmp = cc.PokerUtil.getGroupCards(cards);
		if (tmp[1].length == 5 && tmp[2].length == 1) {
			return {};
		}
		return null;
	},

	//10.	四套三条：十三张牌由四组三条组成加一张单牌
	isSiSanTiao: function isSiSanTiao(cards) {
		var tmp = cc.PokerUtil.getGroupCards(cards);
		if (tmp[2].length == 4) {
			return {};
		}
		return null;
	},

	//9.	凑一色：十三张牌花色均为红色或者黑色
	isCouYiCe: function isCouYiCe(cards) {
		var a = cc.PokerUtil.cardsDecode(cards);
		var s = cc.PokerUtil.getSuit(a);
		if (s[2].length + s[3].length == cards.length) {
			return {};
		}
		return null;
	},

	//8.	全小：十三张牌都是2、3、4、5、6、7、8，不论花色
	isQuanXiao: function isQuanXiao(cards) {
		var a = cc.PokerUtil.cardsDecode(cards);
		for (var i = 0; i < a.length; ++i) {
			if (a[i].value < 0 || a[i].value > 7) {
				return null;
			}
		}
		return {};
	},

	//7.	全大：十三张牌都是8、9、10、J、Q、K、A，不论花色
	isQuanDa: function isQuanDa(cards) {
		var a = cc.PokerUtil.cardsDecode(cards);
		for (var i = 0; i < a.length; ++i) {
			if (a[i].value < 7 || a[i].value > 13) {
				return null;
			}
		}
		return {};
	},

	//6.	三套炸弹：共三组铁支和任意1张其他单牌组成的牌
	isSanZhaDan: function isSanZhaDan(cards) {
		var a = cc.PokerUtil.getGroupCards(cards);
		if (a[3].length == 3) {
			return {};
		}
		return null;
	},

	//5.	三同花顺：中墩、尾墩均为同花顺，头墩为三张花色相同且连续的牌
	isSanTongHuaShun: function isSanTongHuaShun(cards) {
		var tmp = cc.PokerUtil._copyArray(cards);
		var thArr = cc.PokerUtil.tonghuashun(tmp);
		for (var i = 0; i < thArr.length; ++i) {
			var a = cc.PokerUtil.cardsEncode(thArr[i]);
			var b = cc.PokerUtil._delCards(tmp, a);

			var thArr2 = cc.PokerUtil.tonghuashun(b);
			for (var j = 0; j < thArr2.length; ++j) {
				var c = cc.PokerUtil.cardsEncode(thArr2[j]);
				var d = cc.PokerUtil._delCards(b, c);

				cc.PokerUtil.sortPoker(1, d);
				var e = cc.PokerUtil.cardsDecode(d);
				if (e[0].type == e[1].type && e[1].type == e[2].type && e[0].value == e[1].value + 1 && e[1].value == e[2].value + 1) {
					var ret = {};
					ret.top = d.slice();
					ret.middle = c.slice();
					ret.bottom = a.slice();
					return ret;
				}
			}
		}
		return null;
	},

	//4.	十二皇族：十三张牌均是AKQJ
	isShierHuangzu: function isShierHuangzu(cards) {
		var a = cc.PokerUtil.cardsDecode(cards);
		for (var i = 0; i < a.length; ++i) {
			var b = a[i].value;
			if (b != 13 && b != 12 && b != 11 && b != 10) {
				return null;
			}
		}
		return {};
	},

	//3.	一条龙：不同花色，A到K各一张的十三张牌
	isYiTiaoLong: function isYiTiaoLong(cards) {
		var a = cc.PokerUtil.cardsDecode(cards);
		var sign = [];
		for (var i = 0; i < a.length; ++i) {
			var v = a[i].value;
			if (sign[v] == true) {
				return null;
			}
			sign[v] = true;
		}
		return {};
	},

	//2.	清龙：同一种花色，A到K各一张的十三张牌
	isQingLong: function isQingLong(cards) {
		var a = cc.PokerUtil.cardsDecode(cards);
		var sign = [];
		var typenum = 0,
		    lasttype = -1;
		for (var i = 0; i < a.length; ++i) {
			var v = a[i].value;
			if (sign[v] == true) {
				return null;
			}
			sign[v] = true;
			if (lasttype == -1) {
				lasttype = a[i].type;
			} else if (a[i].type != lasttype) {
				return null;
			}
		}
		return {};
	}
});

cc.PokerUtil = new M();

//第二墩、第三墩比较规则(5张牌)
cc.PokerUtil.t5Group = [];

cc.PokerUtil.t5Group[0] = cc.PokerUtil.wutong;
cc.PokerUtil.t5Group[1] = cc.PokerUtil.tonghuashun;
cc.PokerUtil.t5Group[2] = cc.PokerUtil.tiezhi;
cc.PokerUtil.t5Group[3] = cc.PokerUtil.hulu;
cc.PokerUtil.t5Group[4] = cc.PokerUtil.tonghua;
cc.PokerUtil.t5Group[5] = cc.PokerUtil.shunzi;
cc.PokerUtil.t5Group[6] = cc.PokerUtil.santiaoFive;
cc.PokerUtil.t5Group[7] = cc.PokerUtil.liangdui;
cc.PokerUtil.t5Group[8] = cc.PokerUtil.yiduiFive;
cc.PokerUtil.t5Group[9] = cc.PokerUtil.wulongFive;

//第一墩比较规则(3张牌)
cc.PokerUtil.t3Group = [];
cc.PokerUtil.t3Group[0] = cc.PokerUtil.santiao;
cc.PokerUtil.t3Group[1] = cc.PokerUtil.yiduiThree;
cc.PokerUtil.t3Group[2] = cc.PokerUtil.wulongThree;

//特殊牌型判断
cc.PokerUtil.specialGroup = [];
cc.PokerUtil.specialGroup[0] = cc.PokerUtil.isQingLong;
cc.PokerUtil.specialGroup[1] = cc.PokerUtil.isYiTiaoLong;
cc.PokerUtil.specialGroup[2] = cc.PokerUtil.isShierHuangzu;
cc.PokerUtil.specialGroup[3] = cc.PokerUtil.isSanZhaDan;
cc.PokerUtil.specialGroup[4] = cc.PokerUtil.isQuanDa;
cc.PokerUtil.specialGroup[5] = cc.PokerUtil.isQuanXiao;
cc.PokerUtil.specialGroup[6] = cc.PokerUtil.isCouYiCe;
cc.PokerUtil.specialGroup[7] = cc.PokerUtil.isWuDuiSanTiao;
cc.PokerUtil.specialGroup[8] = cc.PokerUtil.isLiuDuiBan;

cc._RF.pop();
},{}],"RecordItem":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'ac4e8kDqfZOy5gNHmkkHDcu', 'RecordItem');
// Scripts\Gui\RecordItem.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        spriteS: cc.SpriteFrame,
        spriteY: cc.SpriteFrame,
        spriteP: cc.SpriteFrame,
        icon: cc.Sprite,
        roomid: cc.Label,
        myScore: cc.Label,
        player_1: cc.Label,
        player_2: cc.Label,
        player_3: cc.Label,
        player_4: cc.Label,
        time: cc.Label
    },

    setData: function setData(data) {
        if (data) {
            this.node.active = true;
            this.roomid.string = data.roomid.toString();
            if (data.rank == 0) {
                this.myScore.node.color = cc.Color.WHITE;
                this.icon.spriteFrame = this.spriteP;
            } else if (data.rank > 0) {
                this.myScore.node.color = cc.Color.YELLOW;
                this.icon.spriteFrame = this.spriteY;
            } else {
                this.myScore.node.color = cc.Color.RED;
                this.icon.spriteFrame = this.spriteS;
            }
            this.myScore.string = data.rank;
            for (var i = 1; i < 4; ++i) {
                if (data.opps.length >= i) {
                    var op = data.opps[i - 1];
                    this["player_" + i.toString()].string = op.name.concat('\n', op.rank.toString());
                } else {
                    this["player_" + i.toString()].string = "无";
                }
            }
            this.time.string = new Date(data.time).Format("yyyy-MM-dd\nhh:mm:ss");
        } else {
            this.node.active = false;
        }
    }
});

cc._RF.pop();
},{}],"SceneManager":[function(require,module,exports){
"use strict";
cc._RF.push(module, '5c8f0oxxLpE/6xiGrgxAiIh', 'SceneManager');
// Scripts\Manager\SceneManager.js

'use strict';

var M = cc.Class({

    isPokerGameScene: function isPokerGameScene() {
        return this.currentScene == "PokerGame";
    },

    loadScene: function loadScene(name, call) {
        cc.guimanager.closeAll();
        cc.director.loadScene(name, call);
        this.currentScene = name;
    },

    loadMainScene: function loadMainScene() {
        this.loadScene('Main', function () {
            cc.log('loadMainScene');
            if (cc.scenemanager.room_info) {
                cc.gamemanager.gameStart();
            } else {
                cc.log("open UIMain");
                cc.guimanager.open('UIMain');
            }
        });
    },

    loadLoginScene: function loadLoginScene() {
        cc.log('loadlogin');
        this.loadScene('Login', function () {
            cc.guimanager.open('UILogin');
        });
    },

    loadPokerGameScene: function loadPokerGameScene() {
        cc.log("LoadPokerGameScene");
        this.loadScene("PokerGame", function () {
            cc.guimanager.open("UIPokerGame");
        });
    }
});

cc.scenemanager = new M();

cc._RF.pop();
},{}],"ScoreSummary":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'd2465wQtiFL5YRCYWgpAWqG', 'ScoreSummary');
// Scripts\Gui\ScoreSummary.js

"use strict";

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        scoreLabel: cc.Label,
        smJsPanel: cc.Prefab,
        label: cc.Label,
        timecd: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.scoreLabel.string = this.getNowFormatDate().toString();

        this.cd = 30;

        this.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1.0), cc.callFunc(function (target, param) {
            param.cd = param.cd - 1;

            var roomAttr = cc.gamemanager.room_info.attr;
            if (cc.gamemanager._currentRounds >= roomAttr.rounds) {
                param.timecd.string = param.cd.toString() + "秒后显示总结算";
            } else {
                param.timecd.string = param.cd.toString() + "秒后自动开始下一局";
            }
            if (param.cd == 0) {
                param.nextMatch();
            }
        }, this, this))));
    },

    getNowFormatDate: function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        return currentdate;
    },

    initialize: function initialize(indata) {

        var AllHandsData = indata.serverdata;
        var scoreSummary = indata.clientdata;

        var container = this.node.getChildByName("container");
        var playerNum = cc.gamemanager.room_info.attr.player_size;
        //var poses = cc.configmanager.summarypos[playerNum-2]
        for (var i = 0; i < playerNum; ++i) {
            var node = cc.instantiate(this.smJsPanel);
            node.position = cc.v2(0, 0);
            node.getComponent("smJsPanel").initCard(AllHandsData[i], scoreSummary[i]);
            node.parent = container;
            //node.position = poses[i]
        }

        var scale = cc.view.getFrameSize().width / (1.8 * cc.view.getFrameSize().height);
        container.scale = scale;

        if (cc.gamemanager._currentRounds >= cc.gamemanager.room_info.attr.rounds) {
            this.label.string = "总结算";
        }
    },

    share: function share() {},

    nextMatch: function nextMatch() {
        var roomAttr = cc.gamemanager.room_info.attr;
        var pgame = cc.find("UIPokerGame").getComponent("UIPokerGame");

        if (cc.gamemanager._currentRounds >= roomAttr.rounds) {
            this.node.destroy();
            pgame.showGameResult();
        } else {
            this.node.destroy();
            cc.gamemanager.nextMatch();
        }
    },

    setScore: function setScore(score) {}
    //this.scoreLabel.getComponent(cc.Label).string = score.toString()


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"ShopItem":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'c53e83gER1EiKyRDpugV92f', 'ShopItem');
// Scripts\Gui\Widget\ShopItem.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        discount: cc.Node,
        discountText: cc.Label,
        img: cc.Sprite,
        moneyText: cc.Label,
        diamondText: cc.Label
    },

    //diamon discount price id image
    setData: function setData(data) {
        this.itemData = data;
        this.diamondText.string = String(data.diamond);
        if (data.discount > 0) {
            this.discount.active = true;
            this.discountText.string = '内赠{0}%'.format(data.discount);
        } else {
            data.discount.active = false;
        }
        this.moneyText.string = String(data.price);
        cc.loader.loadRes('Textures/' + data.image, cc.SpriteFrame, function (err, spriteFrame) {
            this.img.spriteFrame = spriteFrame;
        });
    },

    buy: function buy() {
        /// this.itemData.id
        //TODO:购买
    }
});

cc._RF.pop();
},{}],"UIChat":[function(require,module,exports){
"use strict";
cc._RF.push(module, '5b754Of9BtJELRQHB13mt6Z', 'UIChat');
// Scripts\Gui\UIChat.js

'use strict';

require('UIPanel');

cc.Class({
    extends: cc.uipanel,

    properties: {
        chatPage: cc.Node,
        facePage: cc.Node,
        chatBack: cc.Node,
        editBox: cc.EditBox,
        chatContent: cc.Node
    },

    onTouchBg: function onTouchBg() {
        this.setVisible(false);
    },

    onCreate: function onCreate() {
        var self = this;
        this.chatBack.on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagationImmediate();
        });
        var self = this;
        cc.loader.loadRes('Gui/Widget/ChatSplit', function (err, splitPrefab) {
            self.splitPrefab = splitPrefab;
            cc.loader.loadRes('Gui/Widget/ChatItem', function (err, chatItemPrefab) {
                self.chatItemPrefab = chatItemPrefab;
            });
        });
        this._super();
    },

    onClose: function onClose() {
        if (this.splitPrefab) cc.loader.releaseAsset(this.splitPrefab);
        if (this.chatItemPrefab) cc.loader.releaseAsset(this.chatItemPrefab);
        this._super();
    },

    isReady: function isReady() {
        return this.splitPrefab && this.chatItemPrefab;
    },

    onChackChatpage: function onChackChatpage() {
        this.chatPage.active = true;
        this.facePage.active = false;
    },
    onCheckFacepage: function onCheckFacepage() {
        this.chatPage.active = false;
        this.facePage.active = true;
    },

    popBullet: function popBullet(msg) {
        var panel = cc.guimanager.getByName('UIPokerGame');
        if (panel) {
            cc.log('test');
            panel.showChat(cc.datamanager.mainPlayerData.cuid, msg);
        }
        this.setVisible(false);
    },
    sendChat: function sendChat() {
        var str = this.editBox.string;
        if (str.length > 0) {
            var msg = cc.netmanager.msg("PublicProto.C_SendChat");
            msg.type = 0;
            msg.data_text = str;
            cc.netmanager.send(msg);

            this.addChat(cc.gamemanager.mainPlayer(), str);
            this.editBox.string = "";
            this.popBullet(msg);
        }
    },

    addChat: function addChat(player, text) {
        if (player && this.isReady()) {
            //添加到聊天列表
            var split = cc.instantiate(this.splitPrefab);
            var item = cc.instantiate(this.chatItemPrefab);
            var str = '<color=#00ff00>'.concat(player.name, ':</c><color=#ffefbe>', text, '</c>');
            item.getComponent(cc.RichText).string = str;
            item.parent = this.chatContent;
            item.position = cc.p(11, 12);

            split.parent = this.chatContent;
            split.position = cc.p(219, 1);
        }
    },

    PublicProto_S_Chat: function PublicProto_S_Chat(msg) {
        if (msg.content.type == 0) {
            var player = cc.gamemanager.getPlayer(msg.cuid);
            if (player) {
                this.addChat(player, msg.content.data_text);
            }
        }
    },

    sendFace: function sendFace(event, id) {
        var msg = cc.netmanager.msg("PublicProto.C_SendChat");
        msg.type = 1;
        msg.data_int = parseInt(id);
        cc.netmanager.send(msg);

        this.popBullet(msg);
    }
});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UICreateRoom":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'b4589LqpfVHLZMcyKcdxlFe', 'UICreateRoom');
// Scripts\Gui\UICreateRoom.js

"use strict";

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        createBtn: cc.Button,
        quanleidaToggle: cc.Toggle,
        fivePlayer: cc.Toggle,
        gameLabel: cc.Label
    },

    onCreate: function onCreate() {
        this.init();
        this._super();
    },

    init: function init() {
        var setting = cc.datamanager.getRoomSetting();
        if (!setting) {
            //默认设置
            setting = {
                isQuanLeiDa: false,
                checks: [["0", "0", "52"], ["1", "0", "8"], ["2", "0", "10"], ["3", "0", "1"], ["4", "0", "1"], ["5", "1", "4"]]
            };
            cc.log('param:test');
        }
        this.roomSetting = setting;
        var groups = this.node.getComponentsInChildren(cc.ToggleGroup);
        for (var i = 0; i < groups.length; ++i) {
            var items = groups[i].toggleItems;
            var index = parseInt(setting.checks[i][1]);

            for (var j = 0; j < items.length; ++j) {
                var check = items[j].node.name == 'toggle' + (index + 1);
                items[j].isChecked = check;
            }
        }
        this.quanleidaToggle.isChecked = setting.isQuanLeiDa;
        this.onGameTypeChange(this.roomSetting.checks[0][1] == 1);
    },

    activeFivePlayer: function activeFivePlayer(bActive) {
        this.fivePlayer.node.active = bActive;
    },

    onGameTypeChange: function onGameTypeChange(special) {
        this.activeFivePlayer(special);
        if (!special && this.roomSetting.checks[5][1] == 0) {
            this.roomSetting.checks[5][1] = 1;
            this.roomSetting.checks[5][2] = 4;
        }
        if (!special) {
            this.gameLabel.string = '52张牌（4色A-K十三张）';
        } else {
            this.gameLabel.string = '65张牌 (4色牌加1色黑桃牌A-K)';
        }
    },

    onCheck: function onCheck(toggle, param) {
        var items = toggle.toggleGroup.toggleItems;
        for (var i = 0; i < items.length; ++i) {
            toggle = items[i];
            if (toggle.isChecked) {
                var strs = param.split(',');
                var row = parseInt(strs[0]);
                this.roomSetting.checks[row] = strs;
                var index = parseInt(strs[1]);
                if (row == 0) {
                    this.onGameTypeChange(index == 1);
                } else if (row == 5) {
                    if (index == 3) this.onCheckQuanLeiDa(this.quanleidaToggle);
                }
            }
            var label = toggle.node.getChildByName('label').getComponent(cc.RichText);
            var str = label.string.replace(/\#[0-9A-Fa-f]*/, toggle.isChecked ? '#FFFFFF' : '#88A2C3');
            label.string = str;
        }
    },

    onCheckQuanLeiDa: function onCheckQuanLeiDa(toggle) {
        if (this.roomSetting.checks[5][1] == 3) toggle.isChecked = false;
        this.roomSetting.isQuanLeiDa = toggle.isChecked;
    },

    onCreateRoom: function onCreateRoom() {
        var msg = cc.netmanager.msg('PublicProto.C_G13_CreateGame');
        msg.play_type = parseInt(this.roomSetting.checks[0][2]);
        msg.rounds = parseInt(this.roomSetting.checks[1][2]);
        msg.payor = parseInt(this.roomSetting.checks[2][2]);
        msg.da_qiang = parseInt(this.roomSetting.checks[3][2]);
        msg.yi_tiao_long = parseInt(this.roomSetting.checks[4][2]);
        msg.player_size = parseInt(this.roomSetting.checks[5][2]);
        msg.quan_lei_da = this.roomSetting.isQuanLeiDa;

        cc.log("msg.play_type:" + msg.play_type);
        cc.log("msg.yi_tiao_long:" + msg.yi_tiao_long);
        cc.log("msg.quan_lei_da:" + msg.quan_lei_da);

        cc.log('param:this.roomSetting.checks[0]:' + this.roomSetting.checks[0]);
        cc.netmanager.send(msg);
        cc.datamanager.saveRoomSetting(this.roomSetting);
        this.close();
    },

    PublicProto_S_G13_RoomAttr: function PublicProto_S_G13_RoomAttr(msg) {
        if (msg.room_code == 0) {
            //TODO:创建失败

        }
    }

});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UIGm":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'ee2bcBGKcpEK6aY/VoAACCG', 'UIGm');
// Scripts\Gui\UIGm.js

'use strict';

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        weixinLabel_0: cc.Label,
        weixinLabel_1: cc.Label,
        weixinLabel_2: cc.Label
    },

    onCreate: function onCreate() {

        this.weixinLabels = [this.weixinLabel_0, this.weixinLabel_1, this.weixinLabel_2];
        this.weixinNums = [cc.datamanager.mainData.wechat1, cc.datamanager.mainData.wechat2, cc.datamanager.mainData.wechat3];

        for (var i = 0; i < this.weixinLabels.length; ++i) {
            this.weixinLabels[i].string = this.weixinNums[i];
        }
        this._super();
    },

    copy: function copy(event, strId) {
        cc.datamanager.copyToClipboard(this.weixinNums[parseInt(strId)]);
    }
});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UIHelp":[function(require,module,exports){
"use strict";
cc._RF.push(module, '1e7e4wIuVBNJJMWAE51Zwze', 'UIHelp');
// Scripts\Gui\UIHelp.js

'use strict';

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {}

});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UIJoinRoom":[function(require,module,exports){
"use strict";
cc._RF.push(module, '973adVbE99DMqXsT6KyvjKG', 'UIJoinRoom');
// Scripts\Gui\UIJoinRoom.js

'use strict';

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        btnClose: cc.Button,
        btnComfire: cc.Button,
        spCursor: cc.Node,
        curIndex: 0
    },

    updateCursor: function updateCursor() {
        if (this.curIndex < 0) this.curIndex = 0;
        if (this.curIndex < 6) {
            var room = this.node.getChildByName('roomid');
            this.spCursor.parent = room.children[this.curIndex];
            this.spCursor.position = cc.p(0, 0);
        }

        this.btnClose.interactable = this.isfull();
    },

    getValue: function getValue(node) {
        return node.getChildByName('num').getComponent(cc.Label).string;
    },

    getRoomID: function getRoomID() {
        var room = this.node.getChildByName('roomid');
        var cs = room.children;
        var ids = [];
        for (var i = 0; i < room.childrenCount; ++i) {
            ids[i] = this.getValue(cs[i]);
        }
        return parseInt(ids.join(""));
    },

    setValue: function setValue(node, str) {
        node.getChildByName('num').getComponent(cc.Label).string = str;
    },

    setCurIndexValue: function setCurIndexValue(str) {
        if (!this.isfull()) {
            var room = this.node.getChildByName('roomid');
            this.setValue(room.children[this.curIndex], str);
        }
    },

    isfull: function isfull() {
        return this.curIndex == 6;
    },

    resetValue: function resetValue() {
        var room = this.node.getChildByName('roomid');
        var cs = room.children;
        for (var i = 0; i < this.curIndex; ++i) {
            this.setValue(cs[i], "");
        }
        this.curIndex = 0;
        this.updateCursor();
    },

    deleteValue: function deleteValue() {
        if (this.curIndex >= 0) {
            --this.curIndex;
            if (this.curIndex < 0) this.curIndex = 0;
            this.setCurIndexValue("");
            this.updateCursor();
        }
    },

    inputValue: function inputValue(num) {
        if (!this.isfull()) {
            this.setCurIndexValue(num);
            ++this.curIndex;
            this.updateCursor();
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        var keyboard = this.node.getChildByName('keyboard');
        var cs = keyboard.children;
        for (var i = 0; i < keyboard.childrenCount; ++i) {
            var btn = cs[i].getComponent(cc.Button);
            var self = this;
            btn.node.on('click', function (event) {
                var node = event.target;
                if (node.name == "btn_reset") {
                    self.resetValue();
                } else if (node.name == "btn_delete") {
                    self.deleteValue();
                } else {
                    self.inputValue(node.getChildByName('num').getComponent(cc.Label).string);
                }
            });
        }
        this.btnClose.interactable = this.isfull();
    },

    onClick_btnClose: function onClick_btnClose() {
        this.close();
    },

    onclick_btnComfire: function onclick_btnComfire() {
        var msg = cc.netmanager.msg('PublicProto.C_G13_JionGame');
        msg.room_id = this.getRoomID();
        cc.netmanager.send(msg);
        console.log('require join room:' + msg.room_id);
        this.close();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UILogin":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'fe480vPekNN7KUEzU8UAhgP', 'UILogin');
// Scripts\Gui\UILogin.js

'use strict';

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        btnWXLogin: cc.Button,
        btnGuestLogin: cc.Button,

        prefabSummary: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.audiomanager.playBGM('Hall_Bg');

        /*
                var node = cc.instantiate(this.prefabSummary)
                node.parent = this.node
                node.position = cc.v2(0, 0); 
        
        
                var com = node.getComponent("ScoreSummary")
                var container = node.getChildByName("container")
        
                for(var i = 0; i < 4; ++i)
                {
                    cc.log(i)
                    var nd = cc.instantiate(com.smJsPanel)
                    
                    nd.position = cc.v2(0,0)
                    //nd.getComponent("smJsPanel").initCard(AllHandsData[i], scoreSummary[i])
                    nd.parent = container
        
                    cc.log("========", com.smJsPanel, nd, nd.parent)
                   // nd.position = poses[i]
                }
        
                cc.log("cc.view.getFrameSize().width = ", cc.view.getFrameSize().width)
                var scale = cc.view.getFrameSize().width / (1.8*cc.view.getFrameSize().height)
                container.scale = scale
        */
    },

    setIP: function setIP(event) {
        var ip = event.string;
        if (ip != "") {
            cc.configmanager.serverIP = ip;
            cc.log('IP:' + ip);
        }
    },

    lockUI: function lockUI(bLock) {
        var interactable = !bLock;
        this.btnWXLogin.interactable = interactable;
        this.btnGuestLogin.interactable = interactable;

        //TO:转菊花 
    },

    login: function login(type) {
        this.lockUI(true);
        var self = this;
        cc.netmanager.connect(cc.configmanager.serverIP, cc.configmanager.serverPort, function (ok) {
            if (ok) {
                cc.log('connected!');
                cc.netmanager.login(type);
            } else {
                self.lockUI(false);
                cc.log('connect fail!');
            }
        });
    },

    //wechat login
    onClick_btnWXLogin: function onClick_btnWXLogin(event) {

        this.login(1);
    },

    //返回协议 
    PublicProto_S_LoginRet: function PublicProto_S_LoginRet(msg) {
        this.lockUI(false);
        if (msg.ret_code == 1) {
            cc.log('cc.sys.platform:' + cc.sys.MACOS);
            if (cc.sys.platform != cc.sys.MACOS) cc.immanager.init();

            cc.datamanager.mainPlayerData.cuid = msg.cuid;
            cc.scenemanager.loadMainScene();
        } else {
            cc.log('login fail!');
        }
    },

    onMessageError: function onMessageError(errorid) {
        this.lockUI(false);
    },

    //guest login
    onClick_btnGuestLogin: function onClick_btnGuestLogin() {
        this.login(1);
    },

    //xieyi 
    onClick_Xieyi: function onClick_Xieyi() {}

});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UIMain":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'bcb68jCR6NKyZZhF+bNoMrU', 'UIMain');
// Scripts\Gui\UIMain.js

"use strict";

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        funcNode: cc.Node,
        nameLabel: cc.Label,
        noticeNode: cc.Node,
        noticeMask: cc.Node,
        noticeText: cc.Label,
        openidText: cc.Label,
        moveSpeed: 20
    },

    // use this for initialization
    onCreate: function onCreate() {
        cc.log("name = " + cc.datamanager.mainPlayerData.nick_name);
        this.nameLabel.string = cc.datamanager.mainPlayerData.nick_name;
        this.openidText.string = "ID: " + cc.datamanager.mainPlayerData.cuid.toString();
        cc.audiomanager.playBGM('Hall_Bg');
        this._super();
        cc.gamemanager.gameStart();
    },

    update: function update(dt) {
        this.funcNode.scaleY = this.funcNode.width / 840.0;
        if (!this.curNotice) {
            var notice = cc.datamanager.notice;
            if (notice.length > 0) {
                this.curNotice = notice.shift();
                this.noticeNode.active = true;
                this.noticeText = this.curNotice;
                this.noticeText.position = cc.Vec2(this.noticeMask.getContentSize().width + 20, 0);
            }
        }

        if (this.curNotice) {
            var xPos = this.noticeText.position.x - dt * this.moveSpeed;
            this.noticeText.position = cc.Vec2(xPos, 0);
            if (xPos <= -this.noticeText.getContentSize().width) {
                this.curNotice = null;
                if (notice.length == 0) {
                    this.noticeNode.active = false;
                }
            }
        }
    },

    log: function log(str) {
        cc.log(str);
    },

    openLianxiRoom: function openLianxiRoom() {
        /*
        var action1 = cc.sequence(cc.delayTime(1), cc.callFunc(function(target,param){this.log("1秒后显示")}))
        var action2 = cc.sequence(cc.delayTime(2), cc.callFunc(function(target,param){this.log("2秒后显示")}))
        var action3 = cc.sequence(cc.delayTime(3), cc.callFunc(function(target,param){this.log("3秒后显示")}))
        */
        var act = cc.sequence(cc.delayTime(1), cc.callFunc(function (target, data) {
            cc.log(target.name, data.name);
        }, this.node, this.node.parent));
        this.node.runAction(act);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UIMessageBox":[function(require,module,exports){
"use strict";
cc._RF.push(module, '0b815ePDI1Gx46kTYrIvfWD', 'UIMessageBox');
// Scripts\Gui\UIMessageBox.js

'use strict';

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        msgText: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},

    setMessage: function setMessage(msg) {
        this.msgText.string = msg;
    },

    setCall: function setCall(call) {
        this.call = call;
    },

    onOkey: function onOkey() {
        if (this.call) {
            if (!this.call()) {
                this.close();
            }
        } else {
            this.close();
        }
    }
});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UINotice":[function(require,module,exports){
"use strict";
cc._RF.push(module, '4ef4dTBL2VHV5Z7HFbNfVNc', 'UINotice');
// Scripts\Gui\UINotice.js

'use strict';

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        webview: cc.RichText
    },

    onCreate: function onCreate() {
        //发送请求公告的消息
        this._super();
    },

    onBtnCloseClicked: function onBtnCloseClicked() {
        this.close();
    },

    PublicProto_S_Notice: function PublicProto_S_Notice(msg) {
        if (msg.type == 2) {
            this.webview.string = msg.text;
        }
    }

});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UIPanel":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'f6431fstrhNK5MN2iz1NYLe', 'UIPanel');
// Scripts\Gui\UIPanel.js

'use strict';

if (cc.uipanel == undefined) {
    cc.log('uipanel init');
    cc.uipanel = cc.Class({
        extends: cc.Component,
        properties: {
            bgOpaque: 200
        },
        ctor: function ctor() {
            this.isModel = true;
        },
        setVisible: function setVisible(bVisible) {
            this.node.active = bVisible;
            if (bVisible) {
                this.onShow();
            } else {
                this.onHide();
            }
        },

        onCreate: function onCreate() {
            if (this.isModel) {
                var self = this;
                cc.loader.loadRes('Gui/ModalBg', function (err, prefab) {
                    self.bg = cc.instantiate(prefab);
                    self.bg.parent = self.node;
                    self.bg.setSiblingIndex(0);
                    cc.log('self.bg.opacity:' + self.bg.opacity);
                    self.bg.opacity = self.bgOpaque;
                    cc.log('self.bg.opacity:' + self.bg.opacity);

                    self.bg.on(cc.Node.EventType.TOUCH_START, function (event) {
                        self.onTouchBg();
                        event.stopPropagationImmediate();
                    });
                });
            }
        },

        onTouchBg: function onTouchBg() {},

        onClose: function onClose() {
            if (this.bg) {
                this.bg.off(cc.Node.EventType.TOUCH_START);
            }
        },

        onShow: function onShow() {},

        onHide: function onHide() {},

        close: function close() {
            cc.log("close");
            cc.guimanager.close(this);
        },

        openUI: function openUI(event, name) {
            cc.guimanager.open(name);
        },
        showOrOpenUI: function showOrOpenUI(event, name) {
            cc.guimanager.showOrOpenUI(name);
        },
        select: function select(parentNode, index) {
            var count = parentNode.childrenCount;
            var cs = parentNode.children;
            for (var i = 0; i < count; ++i) {
                cs[i].active = i == index;
            }
        },
        showComingSoonDlg: function showComingSoonDlg(event) {
            cc.guimanager.msgBox('功能暂未开放，敬请期待！');
        }
    });
}

cc._RF.pop();
},{}],"UIPokerGame":[function(require,module,exports){
"use strict";
cc._RF.push(module, '663f4GkXdFOZILOqkauFXod', 'UIPokerGame');
// Scripts\Gui\UIPokerGame.js

"use strict";

cc.Class({
    extends: cc.uipanel,

    properties: {
        originPoker: cc.Node,
        movePoker: cc.Node,
        prefabHeadIcon: cc.Prefab,
        prefabPokerSort: cc.Prefab,
        prefabPokerList: cc.Prefab,
        prefabPokerFlop: cc.Prefab,
        roomNum: cc.Label,
        myHeadIcon: cc.Node,
        startAnimation: cc.Node,
        recordBtn: cc.Node,
        recordPanel: cc.Node,

        prefabJiesuan: cc.Prefab,
        prefabBigJiesuan: cc.Prefab,
        prefabWaitMatch: cc.Prefab,

        prefabPlayer2: cc.Prefab,
        prefabPlayer3: cc.Prefab,
        prefabPlayer4: cc.Prefab,
        prefabPlayer5: cc.Prefab,

        jiesuanTop: cc.Node,
        jiesuanMidel: cc.Node,
        jiesuanBotttom: cc.Node,
        jiesuanDaqiang: cc.Node,

        quanleidaNode: cc.Node,

        _pokerList: null,
        _headIcons: null,
        _pokerFlops: null,
        _curShuffleIdx: 0,
        _playerHeads: null,
        _kaishibipai: null,
        _matchPointLabel: null,
        _optionLabel: null
    },

    // use this for initialization
    onCreate: function onCreate() {
        this._pokerList = [];

        var self = this;
        this.bubblePrefab = cc.loader.loadRes('Gui/Widget/ChatBubble', function (err, prefab) {
            self.bubblePrefab = prefab;
        });

        this.recordBtn.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.onStartRecord();
        });
        this.recordBtn.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            self.onCancelRecord();
        });
        this.recordBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.onStopRecord();
        });

        this._kaishibipai = cc.find("UIPokerGame/kaishibipai");
        this._matchPointLabel = cc.find("UIPokerGame/title/matchPoint");
        this._optionLabel = cc.find("UIPokerGame/title/option");
        this._prefabPlayers = [this.prefabPlayer2, this.prefabPlayer3, this.prefabPlayer4, this.prefabPlayer5];

        this.roomNum.string = cc.gamemanager.room_info.room_id;
        this.initRoom(cc.gamemanager.room_info.attr.player_size);
        this.onPlayerInRoom(cc.gamemanager._players);
        cc.audiomanager.playBGM('Game_Bg');
        this._super();
    },

    onClose: function onClose() {
        if (this.bubblePrefab) cc.loader.releaseAsset(this.bubblePrefab);
        cc.gamemanager.gameOver();
        this._super();
    },

    initRoom: function initRoom(playerNum) {
        if (playerNum == null) return;
        if (playerNum == 1) playerNum = 2;

        cc.log("init room, palyer number = " + playerNum);
        if (playerNum <= 1 || playerNum > 5) {
            return;
        }

        var obj = cc.instantiate(this._prefabPlayers[playerNum - 2]);
        obj.parent = this.node;

        //玩家头像
        this._playerHeads = obj.getChildByName("heads").children;
        cc.log("this._playerHeads size = " + this._playerHeads.length);

        //发牌图片
        this._pokerList = [];
        var parentNode = cc.find("UIPokerGame/Pokers");
        this._pokerList.push(parentNode.children[0]);
        var playersNode = obj.getChildByName("Pokers");
        for (var i = 0; i < playersNode.childrenCount; ++i) {
            this._pokerList.push(playersNode.children[i]);
        }
        cc.log("this._pokerList size = " + this._pokerList.length);

        //比牌
        this._pokerFlops = []; //该数组包括自己
        var flopParent = cc.find("UIPokerGame/PokerFlops");
        this._pokerFlops.push(flopParent.children[0]); //自己的
        var flopNode = obj.getChildByName("PokerFlops");
        for (var i = 0; i < flopNode.childrenCount; ++i) {
            this._pokerFlops.push(flopNode.children[i]);
        }
        cc.log("this._pokerFlops size = " + this._pokerFlops.length);
        this.refreshNewMatchState();
        /*
                //玩家头像
                this._playerHeads = [];
                var pos = cc.configmanager.headIconPos[playerNum-2];
                for(var i = 0; i < playerNum-1; ++i){
                    var head = cc.instantiate(this.prefabHeadIcon);
                    head.parent = this.node;
                    head.position = cc.v2(pos[i].x+200, pos[i].y);
                    //head.position = pos[i];
                    //head.active = false;
                    this._playerHeads.push(head);
                }
        
                //发牌图片
                this._pokerList = [];
                var parentNode = cc.find("UIPokerGame/Pokers")
                this._pokerList.push(parentNode.children[0])
                pos = cc.configmanager.headIconPos[playerNum-2];
                for(var i = 0; i < playerNum-1; ++i){
                    var pokerlist = cc.instantiate(this.prefabPokerList)
                    pokerlist.parent = parentNode
                    pokerlist.position = cc.v2(pos[i].x-150, pos[i].y)
                    this._pokerList.push(pokerlist)
                }
        
                //比牌
                this._pokerFlops = [] //该数组包括自己
                var flopParent = cc.find("UIPokerGame/PokerFlops")
                this._pokerFlops.push(flopParent.children[0])   //自己的
                pos = cc.configmanager.headIconPos[playerNum-2];
                for(var i = 0; i < playerNum-1; ++i){
                    var pokerFlop = cc.instantiate(this.prefabPokerFlop)
                    pokerFlop.parent = flopParent
                    pokerFlop.position = cc.v2(pos[i].x, pos[i].y+200)
                    this._pokerFlops.push(pokerFlop)
                }
        
                this.refreshNewMatchState()
        */
    },

    setPokerListShow: function setPokerListShow(visible) {
        for (var i = 0; i < this._pokerList.length; ++i) {
            this._pokerList[i].active = visible;
        }
    },

    setPokerFlopShow: function setPokerFlopShow(visible) {
        for (var i = 0; i < this._pokerFlops.length; ++i) {
            this._pokerFlops[i].active = visible;
        }
    },

    //新的一局开始刷新数据
    refreshNewMatchState: function refreshNewMatchState() {
        for (var i = 0; i < this._pokerList.length; ++i) {
            var node = this._pokerList[i];
            node.getComponent("PokerList").resetState();
        }

        for (var i = 0; i < this._pokerFlops.length; ++i) {
            var node = this._pokerFlops[i];
            node.getComponent("PokerFlop").resetState();
        }
        this.setPokerListShow(false);
        this.setPokerFlopShow(false);
        this._curShuffleIdx = 0;

        var roomAttr = cc.gamemanager.room_info.attr;
        var ptLabel = cc.gamemanager._currentRounds + "/" + roomAttr.rounds;
        this._matchPointLabel.getComponent(cc.Label).string = ptLabel;

        var optionLabel = cc.configmanager.upercaseFigure[roomAttr.player_size] + "人游戏 打枪+" + roomAttr.da_qiang + "道 一条龙(" + roomAttr.yi_tiao_long + "倍)";
        this._optionLabel.getComponent(cc.Label).string = optionLabel;
    },

    _refreshHeadInfo: function _refreshHeadInfo(node, data) {
        if (node == null) return;

        var icon = node.getChildByName("icon");
        var deficon = node.getChildByName("default");

        if (data == null || parseInt(data.cuid) == 0) {
            icon.active = false;
            deficon.active = true;
        } else {
            icon.active = true;
            deficon.active = false;

            node.cuid = data.cuid;

            var label = icon.getChildByName("name");
            if (label != null) {
                label.getComponent(cc.Label).string = data.name;
            }
            var coin = icon.getChildByName("coinnum");
            if (coin != null) {
                if (data.money == null) {
                    coin.getComponent(cc.Label).string = 0;
                } else {
                    coin.getComponent(cc.Label).string = data.money.toString();
                }
            }
            var prepare = icon.getChildByName("yizhunbei");
            if (prepare != null) {
                //prepare.active = (data.status == 2);
                if (data.status == 2) {
                    prepare.active = true;
                    cc.PokerUtil.replaceSprite("Textures/Fight/yizhunbeiTXT", prepare);
                } else if (data.status == 3) {
                    prepare.active = true;
                    cc.PokerUtil.replaceSprite("Textures/lipaizhongTXT", prepare);
                } else {
                    prepare.active = false;
                }
            }
            //玩家头像
            var icon = icon.getChildByName("headICON");
            if (icon != null) {}
        }
    },

    getHeader: function getHeader(cuid) {
        if (this.myHeadIcon.cuid && cuid.eq(this.myHeadIcon.cuid)) return this.myHeadIcon;
        for (var i = 0; i < this._playerHeads.length; ++i) {
            var header = this._playerHeads[i];
            if (header && header.cuid && cuid.eq(header.cuid)) {
                return header;
            }
        }
        cc.guimanager.msgBox("数据错误getHeader" + cuid.toString() + " - " + this._playerHeads.length);
        return null;
    },

    getFlop: function getFlop(cuid) {
        for (var i = 0; i < this._pokerFlops.length; ++i) {
            var flop = this._pokerFlops[i];
            if (flop && flop.cuid && cuid.eq(flop.cuid)) {
                return flop;
            }
        }

        cc.guimanager.msgBox("数据错误getFlop" + cuid.toString() + " - " + this._pokerFlops.length);
        return null;
    },

    showWaitState: function showWaitState() {
        if (this.waitStateNode == null) {
            this.waitStateNode = cc.instantiate(this.prefabWaitMatch);
            this.waitStateNode.parent = this.node;
            this.waitStateNode.position = cc.v2(0, 0);
        }
    },

    onPlayerInRoom: function onPlayerInRoom(playersdata) {

        //有时候会出现进入房间，initRoom还未调用
        if (this._playerHeads == null) {
            this.initRoom(cc.gamemanager.room_info.attr.player_size);
        }

        cc.log("onPlayerInRoom length = " + playersdata.length);
        if (playersdata.length == 0) {
            return;
        }

        var sortdata = [];
        var selfIdx = 0;
        var selfData = cc.datamanager.mainPlayerData;
        for (var i = 0; i < playersdata.length; ++i) {
            if (parseInt(playersdata[i].cuid) == parseInt(selfData.cuid)) {
                selfIdx = i;
                //cc.find("UIPokerGame/startBtn").active = (playersdata[i].status == 0);
                cc.log("我的状态： " + playersdata[i].status);
                var startBtn = cc.find("UIPokerGame/startBtn");
                startBtn.active = playersdata[i].status < 2;
                this._refreshHeadInfo(this.myHeadIcon, playersdata[i]);
                this._pokerFlops[0].cuid = playersdata[i].cuid;
                break;
            }
        }
        for (var i = selfIdx + 1; i < playersdata.length; ++i) {
            sortdata.push(playersdata[i]);
        }
        for (var i = 0; i < selfIdx; ++i) {
            sortdata.push(playersdata[i]);
        }

        var i = 0;
        for (; i < sortdata.length; ++i) {
            var node = this._playerHeads[i];
            this._refreshHeadInfo(node, sortdata[i]);
            this._pokerFlops[i + 1].cuid = sortdata[i].cuid;
        }

        for (; i < this._playerHeads.length; ++i) {
            var node = this._playerHeads[i];
            this._refreshHeadInfo(node, null);
            this._pokerFlops[i + 1].cuid = 0;
        }
    },

    showChat: function showChat(cuid, content) {
        cc.log(cuid);
        var header = this.getHeader(cuid);
        if (header) {
            cc.log("this.bubblePrefab:" + this.bubblePrefab);
            if (!header.bubble && this.bubblePrefab) {
                header.bubble = cc.instantiate(this.bubblePrefab);
                header.bubble.parent = cc.director.getScene();

                header.bubble.position = header.convertToWorldSpace(cc.p(0, 0));
            }
            if (header.bubble) {
                var buller = header.bubble.getComponent("ChatBubble");
                if (content.type == 0) {
                    buller.showText(content.data_text);
                } else if (content.type == 1) {
                    buller.showFace(content.data_int);
                } else if (content.type == 2) {
                    cc.log('url:' + content.data_text);
                    // buller.showVoice(content.data_text)
                    cc.immanager.im.playFromUrl(content.data_text);
                }
                var scheduler = cc.director.getScheduler();
                scheduler.unscheduleAllForTarget(buller);
                scheduler.schedule(function () {
                    if (buller) {
                        buller.node.destroy();
                        header.bubble = null;
                    }
                }, buller, 0, 0, 3, false);
            }
        }
    },

    //聊天消息
    PublicProto_S_Chat: function PublicProto_S_Chat(msg) {
        this.showChat(msg.cuid, msg.content);
    },

    giveup: function giveup(event) {
        cc.gamemanager.giveup();
    },

    PublicProto_S_G13_PlayerQuited: function PublicProto_S_G13_PlayerQuited(msg) {
        cc.scenemanager.loadMainScene();
    },

    //开始新的一局
    newMatchStart: function newMatchStart() {

        this.refreshNewMatchState();

        var action = cc.sequence(cc.delayTime(3), cc.callFunc(function (target, param) {
            var self = target.getComponent("UIPokerGame");
            self.startAnimation.active = false;
            self.fapai();
        }, this));

        this._kaishibipai.active = false;
        this.startAnimation.active = true;
        this.node.runAction(action);
    },

    clickStartBtn: function clickStartBtn() {
        //        this.newMatchStart()
        /*
                var actions = []
                for(var i = 0; i < this._pokerFlops.length; ++i)
                {
                    var node = this._pokerFlops[i]
                    var componet = node.getComponent("PokerFlop")
                    actions.push(componet.topFlopAction(componet))
                }
        
                for(var i = 0; i < this._pokerFlops.length; ++i)
                {
                    var node = this._pokerFlops[i]
                    var componet = node.getComponent("PokerFlop")
                    actions.push(componet.middleFlopAction(componet))
                }
        
                 for(var i = 0; i < this._pokerFlops.length; ++i)
                {
                    var node = this._pokerFlops[i]
                    var componet = node.getComponent("PokerFlop")
                    actions.push(componet.bottomFlopAction(componet))
                }
        
                this.node.runAction(cc.sequence(actions))
        */
        /*
        
                    //打开选牌界面
                    var pokerSort = cc.instantiate(this.prefabPokerSort);
                    pokerSort.parent = this.node;
                    pokerSort.position = cc.v2(0, 0); 
                    */

        //发送准备消息
        cc.find("UIPokerGame/startBtn").active = false;
        var msg = cc.netmanager.msg('PublicProto.C_G13_ReadyFlag');
        msg.ready = true;
        cc.netmanager.send(msg);

        cc.audiomanager.playSFX('GAME_START');
    },

    fapai: function fapai() {
        this.setPokerListShow(true);
        this.originPoker.active = true;
        this.movePoker.active = true;
        var aniName = "ac_cardmove" + cc.gamemanager.room_info.attr.player_size;
        cc.log("播放动画： ", aniName);
        this.movePoker.getComponent(cc.Animation).play(aniName);

        var cardlist = this._pokerList[0];
        var pokers = cc.gamemanager.getCurMathPokers();
        cc.log("cardlist.childrenCount = " + cardlist.childrenCount);
        for (var i = 0; i < cardlist.childrenCount; ++i) {
            var card = cardlist.children[i];
            var val = pokers[i];
            //cc.log("poker value  " + val)
            cc.PokerUtil.replacePokerSprite(val, card);
        }
    },

    //发牌event结束打开PokerSort选牌界面
    onAnimCompleted: function onAnimCompleted(index) {
        if (index < 1 || index > 5) {
            return;
        }
        cc.audiomanager.playSFX('fapai');
        //console.log([index, this._curShuffleIdx, this._pokerList[index-1].childrenCount ]);
        this._pokerList[index - 1].children[this._curShuffleIdx].active = true;

        if (index == cc.gamemanager.room_info.attr.player_size) {
            this._curShuffleIdx++;
            var aniName = "ac_cardmove" + cc.gamemanager.room_info.attr.player_size;
            this.movePoker.getComponent(cc.Animation).play(aniName);
        }
        if (this._curShuffleIdx >= 12) {
            this.movePoker.getComponent(cc.Animation).stop();
            this.movePoker.active = false;
            this.originPoker.active = false;

            //打开选牌界面
            var pokerSort = cc.instantiate(this.prefabPokerSort);
            //var pokerSort = cc.guimanager.open("PokerSort")
            pokerSort.parent = this.node;
            pokerSort.position = cc.v2(0, 0);

            //this._pokerList[0].active = false;
            this.setPokerListShow(false);
            this.setPokerFlopShow(true);
        }
    },

    beginFlop: function beginFlop(target, param) {

        cc.PokerUtil.replaceSprite("Textures/Fight/toudunbpTXT", param._kaishibipai);
        cc.audiomanager.playSFX("M_开始比牌铃声");
        //cc.find("UIPokerGame/jiesuan").active = true

        this.myHeadIcon.getChildByName("icon").getChildByName("yizhunbei").active = false;
        for (var i = 0; i < this._playerHeads.length; ++i) {
            var node = this._playerHeads[i];
            node.getChildByName("icon").getChildByName("yizhunbei").active = false;
        }
    },

    //显示总结算页面
    showGameResult: function showGameResult() {
        var node = cc.instantiate(this.prefabBigJiesuan);
        node.parent = this.node;
        node.position = cc.v2(0, 0);
        node.getComponent("GameResult").initializeGameResult(cc.gamemanager.allRoundsData);
    },

    endFlop: function endFlop(target, param) {
        param._kaishibipai.active = false;
        //cc.find("UIPokerGame/jiesuan").active = false
        cc.PokerUtil.replaceSprite("Textures/Fight/kaishibipaiTXT", param._kaishibipai);

        param.jiesuanTop.active = false;
        param.jiesuanMidel.active = false;
        param.jiesuanBotttom.active = false;
        param.jiesuanDaqiang.active = false;

        //打开结算页面

        var roomAttr = cc.gamemanager.room_info.attr;
        var mycuid = cc.datamanager.mainPlayerData.cuid;
        var com = cc.find("UIPokerGame").getComponent("UIPokerGame");

        /*
                if(cc.gamemanager._currentRounds >= roomAttr.rounds)
                {
                    var node = cc.instantiate(this.prefabBigJiesuan)
                    node.parent = this.node
                    node.position = cc.v2(0, 0); 
                    node.getComponent("GameResult").initializeGameResult(cc.gamemanager.allRoundsData)
                }
                else
        */
        {
            var node = cc.instantiate(this.prefabJiesuan);
            node.parent = com.node;
            node.position = cc.v2(0, 0);

            var alldata = {};
            alldata.serverdata = com._AllHandsData;
            alldata.clientdata = com._curScoreSummary;

            node.getComponent("ScoreSummary").initialize(alldata);

            for (var i = 0; i < com._AllHandsData.length; ++i) {
                if (mycuid.eq(com._AllHandsData[i].cuid)) {
                    node.getComponent("ScoreSummary").setScore(com._AllHandsData[i].rank);
                    break;
                }
            }
            /*
                        cc.guimanager.open("ScoreSummary", function(panel){  
                            cc.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", com, com._curScoreSummary)
                           
                            cc.guimanager.dispachMsg("initialize", alldata)
                            cc.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                            for(var i = 0; i < com._AllHandsData.length; ++i){
                            if(mycuid.eq(com._AllHandsData[i].cuid)){
                                cc.guimanager.dispachMsg("setScore", com._AllHandsData[i].rank)
                                break
                            }
                        }   
                    })
            */
        }
    },

    //第一墩比完事件
    topFlopEnd: function topFlopEnd(target, param) {
        cc.PokerUtil.replaceSprite("Textures/Fight/zhongdunbpTXT", param._kaishibipai);
        param.jiesuanTop.active = true;
    },

    //第二墩比完事件
    middleFlopEnd: function middleFlopEnd(target, param) {
        cc.PokerUtil.replaceSprite("Textures/Fight/weidunbpTXT", param._kaishibipai);
        param.jiesuanMidel.active = true;
    },

    //第三墩比完事件 
    bottomFlopEnd: function bottomFlopEnd(target, param) {
        param.jiesuanBotttom.active = true;
        param.jiesuanDaqiang.active = true;
    },

    _scoreStr: function _scoreStr(num) {
        if (num < 0) {
            return num.toString();
        } else if (num > 0) {
            return "+" + num.toString();
        } else {
            return "0";
        }
    },

    _refreshDunScore: function _refreshDunScore(datalist) {
        var selfData = cc.datamanager.mainPlayerData;
        for (var i = 0; i < datalist.length; ++i) {
            var data = datalist[i];
            if (selfData.cuid.eq(data.cuid)) {
                this.jiesuanTop.getChildByName("score").getComponent(cc.Label).string = this._scoreStr(data.score.top);
                this.jiesuanMidel.getChildByName("score").getComponent(cc.Label).string = this._scoreStr(data.score.middle);
                this.jiesuanBotttom.getChildByName("score").getComponent(cc.Label).string = this._scoreStr(data.score.bottom);
                this.jiesuanDaqiang.getChildByName("score").getComponent(cc.Label).string = this._scoreStr(data.score.spe);
            }
        }
    },

    //全垒打action
    _quanleidaFunc: function _quanleidaFunc(target, param) {
        cc.audiomanager.playSFX("打枪_子弹");

        param.quanleidaNode.active = true;
        param.quanleidaNode.getComponent(cc.Animation).play();

        for (var i = 0; i < param._pokerFlops.length; ++i) {
            var flop = param._pokerFlops[i];
            if (flop) {
                flop.getComponent("PokerFlop").startDanKongAnim();
            }
        }
    },

    //打枪
    _daqiangFunc: function _daqiangFunc(target, param) {
        var self = param[0];
        var scuid = param[1];
        var dcuid = param[2];
        cc.audiomanager.playSFX("打枪_子弹");
        for (var i = 0; i < self._pokerFlops.length; ++i) {
            var flop = self._pokerFlops[i];
            if (flop && flop.cuid && scuid.eq(flop.cuid)) {
                flop.getComponent("PokerFlop").startDaQiangAnim();
            }

            if (flop && flop.cuid && dcuid.eq(flop.cuid)) {
                flop.getComponent("PokerFlop").startDanKongAnim();
            }
        }
    },

    //打枪结束
    _daqangEnd: function _daqangEnd(target, param) {
        for (var i = 0; i < param._pokerFlops.length; ++i) {
            var flop = param._pokerFlops[i];
            if (flop) {
                flop.getComponent("PokerFlop").endDanKongAnim();
                flop.getComponent("PokerFlop").endDaQiangAnim();
            }
        }
    },

    //收到结算牌消息，开始走比牌流程
    PublicProto_S_G13_AllHands: function PublicProto_S_G13_AllHands(msg) {
        if (msg.players.length != cc.gamemanager.room_info.attr.player_size) {
            cc.log("收到结算牌数据错误");
            return;
        }

        function CopyActionArray(dstArr, srcArr) {
            for (var i = 0; i < srcArr.length; ++i) {
                dstArr.push(srcArr[i]);
            }
        }

        if (this.waitStateNode != null) {
            this.waitStateNode.destroy();
            this.waitStateNode = null;
        }

        cc.log("开始计算得分");
        var ret = cc.PokerUtil.calculateScore(msg);
        this._curScoreSummary = ret;

        this._refreshDunScore(this._curScoreSummary);

        for (var i = 0; i < ret.length; ++i) {
            cc.log(ret[i].score.top, ret[i].score.middle, ret[i].score.bottom, ret[i].score.spe);
        }

        cc.log("结束计算比分");

        cc.audiomanager.playSFX("M_开始比牌");

        this._AllHandsData = msg.players;

        var actions = [],
            action1 = [],
            action2 = [],
            action3 = [];

        actions.push(cc.sequence(cc.delayTime(1), cc.callFunc(this.beginFlop, this, this)));

        for (var i = 0; i < msg.players.length; ++i) {
            var playerdata = msg.players[i];
            var node = this.getFlop(playerdata.cuid);
            if (node && node.getComponent("PokerFlop")) {
                var compoent = node.getComponent("PokerFlop");
                compoent.initPokerValues(playerdata);
                action1.push(compoent.topFlopAction(compoent));
                action2.push(compoent.middleFlopAction(compoent));
                action3.push(compoent.bottomFlopAction(compoent));
            }
        }

        CopyActionArray(actions, action1);
        actions.push(cc.sequence(cc.callFunc(this.topFlopEnd, this, this), cc.delayTime(1.5)));

        CopyActionArray(actions, action2);
        actions.push(cc.sequence(cc.callFunc(this.middleFlopEnd, this, this), cc.delayTime(1.5)));

        CopyActionArray(actions, action3);
        actions.push(cc.sequence(cc.callFunc(this.bottomFlopEnd, this, this), cc.delayTime(1.5)));

        //开始打枪动画
        var quanleidaAct = null;
        var daqiangAct = [];
        for (var j = 0; j < ret.length; ++j) {
            var brand = ret[j];
            if (brand.quanleida == true) {
                if (quanleidaAct == null) {
                    quanleidaAct = cc.sequence(cc.callFunc(function () {
                        cc.audiomanager.playSFX("M_打枪");
                    }, this), cc.delayTime(0.5), cc.callFunc(this._quanleidaFunc, this, this), cc.delayTime(1.5), cc.callFunc(function (target, param) {
                        param.quanleidaNode.active = false;
                        param.quanleidaNode.getComponent(cc.Animation).stop();
                    }, this, this));
                } else {
                    cc.log("出错了，怎么会有多个全垒打~~~");
                }
            }
            if (brand.daqianglist.length > 0) {
                for (var m = 0; m < brand.daqianglist.length; ++m) {
                    cc.log("===============", this, brand.cuid, brand.daqianglist[m]);
                    daqiangAct.push(cc.sequence(cc.callFunc(function () {
                        cc.audiomanager.playSFX("M_打枪");
                    }, this), cc.delayTime(0.5), cc.callFunc(this._daqiangFunc, this, [this, brand.cuid, brand.daqianglist[m]]), cc.delayTime(1.5), cc.callFunc(this._daqangEnd, this, this)));
                }
            }
        }

        if (quanleidaAct != null) {
            actions.push(quanleidaAct);
        }

        if (daqiangAct.length > 0) {
            CopyActionArray(actions, daqiangAct);
        }

        actions.push(cc.callFunc(this.endFlop, this, this));
        this._kaishibipai.active = true;
        cc.log("开始播放动画");
        this.node.runAction(cc.sequence(actions));
    },

    stopRecord: function stopRecord() {
        cc.log('结束录音...');
        if (this.isStartRecord) {
            this.recordPanel.active = false;
            this.isStartRecord = false;
            cc.immanager.im.stopRecord();
        }
    },

    onStartRecord: function onStartRecord() {
        this.recordPanel.active = true;
        this.isStartRecord = true;

        cc.log('开始录音...');
        cc.immanager.im.startRecord();
        cc.immanager.setCall(function (data) {
            //上传成功
            var msg = cc.netmanager.msg("PublicProto.C_SendChat");
            msg.type = 2;
            msg.data_text = data.url;
            cc.netmanager.send(msg);

            var msgdata = cc.netmanager.messages["PublicProto.C_SendChat"].decode(msg.toBuffer());
            cc.log('msgdata:' + msgdata.data_text);
            cc.immanager.im.playFromUrl(data.url);
        }, function () {
            //停止录制
            cc.immanager.im.playRecord();
        });
    },

    onCancelRecord: function onCancelRecord() {
        // this.stopRecord()
    },

    onStopRecord: function onStopRecord() {
        this.stopRecord();
    }
});

cc._RF.pop();
},{}],"UIRecord":[function(require,module,exports){
"use strict";
cc._RF.push(module, '0fa48+gsWRPraSKV6NQ9PXE', 'UIRecord');
// Scripts\Gui\UIRecord.js

"use strict";

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        pageID: 0,
        items: cc.Node,
        totalLabel: cc.Label,
        winRateLabel: cc.Label,
        winLabel: cc.Label,
        loseLabel: cc.Label,
        btnUp: cc.Button,
        btnDown: cc.Button
    },

    onCreate: function onCreate() {
        var msg = cc.netmanager.msg("PublicProto.C_G13_ReqGameHistoryCount");
        cc.netmanager.send(msg);

        //请求排名
        this._super();
    },

    requirePage: function requirePage(event, page) {
        this.lockButton(true);
        var msg = cc.netmanager.msg("PublicProto.C_G13_ReqGameHistoryDetial");
        msg.page = this.page + parseInt(page);
        cc.netmanager.send(msg);
    },

    PublicProto_S_G13_GameHistoryCount: function PublicProto_S_G13_GameHistoryCount(msg) {
        // msg.total
        this.totalLabel.string = String(msg.total);
        var total = msg.win + msg.lose;
        if (total > 0) this.winRateLabel.string = String(msg.win / total) + "%";else this.winRateLabel.string = "0%";

        this.winLabel.string = String(msg.win);
        this.loseLabel.string = String(msg.lose);

        this.msgData = msg;

        this.maxPage = math.ceil(msg.total / 5);
        if (this.maxPage > 0) {
            this.page = 0;
            this.requirePage(null, 0);
        }
    },

    lockButton: function lockButton(lock) {
        if (lock) {
            this.btnUp.interactable = false;
            this.btnDown.interactable = false;
        } else {
            if (this.page < this.maxPage - 1) {
                this.btnDown.interactable = true;
            } else if (this.page > 0) {
                this.btnUp.interactable = true;
            }
        }
    },

    PublicProto_S_G13_GameHistoryDetial: function PublicProto_S_G13_GameHistoryDetial(msg) {
        for (var i = 0; i < 5; ++i) {
            var child = this.items.getChildByName(i.toString());
            if (child) {
                var item = child.getComponent('RecordItem');
                if (item) {
                    item.setData(msg.items[i]); //msg.history[i])
                }
            }
        }
        this.lockButton(false);
    }
});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UISetting":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'f67d7lo/1dD4IGPp1qXvxwc', 'UISetting');
// Scripts\Gui\UISetting.js

"use strict";

cc.Class({
    extends: cc.uipanel,

    properties: {
        musicBar: cc.ProgressBar,
        effectBar: cc.ProgressBar,
        musicSlider: cc.Slider,
        effectSlider: cc.Slider,
        musicIcon: cc.Node,
        effectIcon: cc.Node,
        btnLabel: cc.Label
    },

    onCreate: function onCreate() {
        var bgValue = cc.audiomanager.getBGMVolume();
        this.setMusicPer(bgValue);
        this.upateMusic(bgValue);

        var efValue = cc.audiomanager.getSFXVolume();
        this.setEffectPer(efValue);
        this.upateEffect(efValue);

        if (cc.scenemanager.isPokerGameScene()) {
            this.btnLabel.string = "退出房间";
        } else {
            this.btnLabel.string = "切换账号";
        }

        this._super();
    },

    onClose: function onClose() {
        cc.audiomanager.save();
        this._super();
    },

    updateIcon: function updateIcon(iconNode, value) {
        this.select(iconNode, value);
    },

    upateMusic: function upateMusic(progress) {
        this.musicBar.progress = progress;
        if (progress == 0) {
            this.updateIcon(this.musicIcon, 0);
        } else {
            this.updateIcon(this.musicIcon, 1);
        }
    },

    upateEffect: function upateEffect(progress) {
        this.effectBar.progress = progress;
        if (progress == 0) {
            this.updateIcon(this.effectIcon, 0);
        } else {
            this.updateIcon(this.effectIcon, 1);
        }
    },

    onMusicChange: function onMusicChange(target) {
        var progress = target.progress;
        this.upateMusic(progress);
        cc.audiomanager.setBGMVolume(progress);
    },

    onEffectChange: function onEffectChange(target) {
        var progress = target.progress;
        this.upateEffect(progress);
        cc.audiomanager.setSFXVolume(progress);
    },

    onChangeUID: function onChangeUID() {
        if (cc.scenemanager.isPokerGameScene()) {
            cc.gamemanager.giveup();
        } else {
            //TODO:切换账号
        }
        this.close();
    },

    setMusicPer: function setMusicPer(value) {
        value = Math.min(1, Math.max(value, 0));
        this.musicSlider.progress = value;
        // this.musicBar.progress = value
        // cc.log('setMusicPer:' + value)
    },

    setEffectPer: function setEffectPer(value) {
        value = Math.min(1, Math.max(value, 0));
        this.effectSlider.progress = value;
        // this.effectBar.progress = value
        // cc.log('setEffectPer:' + value)
    }

});

cc._RF.pop();
},{}],"UIShop":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'd175d8u1JVLZKSO/fFIu6nv', 'UIShop');
// Scripts\Gui\UIShop.js

'use strict';

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UIVote":[function(require,module,exports){
"use strict";
cc._RF.push(module, '6cccdKTYeNItrfjbosiV8kz', 'UIVote');
// Scripts\Gui\UIVote.js

'use strict';

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        tip: cc.RichText,
        btns: cc.Node,
        voteItems: cc.Node
    },

    onShow: function onShow() {
        var info = cc.gamemanager.voteInfo;
        this.remain_seconds = info.remain_seconds;
        var d = new Date();
        this.update_start_time = d.getTime() / 1000;
        this.voteSponsorName = cc.gamemanager.getPlayer(info.sponsor).name;
        if (!this.isSchedule) {
            this.updateTime();
            var s = cc.director.getScheduler();
            var self = this;
            s.schedule(function () {
                self.updateTime();
            }, this.node, 1, this.remain_seconds, 1, false);
            this.isSchedule = true;
        }

        this.updateVote(info);
    },

    onClose: function onClose() {
        this.stopUpdateTime();
        this._super();
    },

    updateTime: function updateTime() {
        var d = new Date();
        cc.log('this.remain_seconds:' + this.remain_seconds);
        var time = Math.max(0, Math.floor(this.remain_seconds - (d.getTime() / 1000 - this.update_start_time)));

        this.tip.string = '<color=#00ff00>玩家<color=#0fffff>'.concat(this.voteSponsorName, '</color>申请解散房间 (剩余<color=#0fffff>', String(time), '</color>秒,超时未同意默认同意)</c>');
        if (time == 0) {
            this.stopUpdateTime();
        }
    },

    stopUpdateTime: function stopUpdateTime() {
        if (this.isSchedule) {
            var s = cc.director.getScheduler();
            s.unscheduleAllForTarget(this.node);
            this.isSchedule = null;
        }
    },

    updateVote: function updateVote(info) {
        //更新投票
        var count = this.voteItems.childrenCount;
        var cs = this.voteItems.children;
        var myuid = cc.datamanager.mainPlayerData.cuid;
        for (var i = 0; i < count; ++i) {
            if (i < info.votes.length) {
                if (myuid.eq(info.votes[i].cuid)) {
                    this.btns.active = info.votes[i].vote == 0;
                }
                this.updateVoteItem(cs[i], info.votes[i]);
                cs[i].active = true;
            } else {
                cs[i].active = false;
            }
        }
    },

    voteToString: function voteToString(vote) {
        if (vote == 0) {
            return '<color=#598BD0>等待投票</c>';
        } else if (vote == 1) {
            return '<color=#6ED901>同意</c>';
        } else if (vate == 2) {
            return '<color=#ff0000>拒绝</c>';
        }
    },

    updateVoteItem: function updateVoteItem(item, info) {
        var nameNode = item.getChildByName('name');
        var stateNode = item.getChildByName('state');
        var stateLabel = stateNode.getComponent(cc.RichText);
        nameNode.getComponent(cc.Label).string = cc.gamemanager.getPlayer(info.cuid).name;
        stateLabel.string = this.voteToString(info.vote);
    },

    refuse: function refuse() {
        //拒绝
        var msg = cc.netmanager.msg('PublicProto.C_G13_VoteFoAbortGame');
        msg.vote = 2;
        cc.netmanager.send(msg);
        this.btns.active = false;
    },

    agree: function agree() {
        var msg = cc.netmanager.msg('PublicProto.C_G13_VoteFoAbortGame');
        msg.vote = 1;
        cc.netmanager.send(msg);
        this.btns.active = false;
    }

});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"UIWaiting":[function(require,module,exports){
"use strict";
cc._RF.push(module, '40765Z24V9DG58uVcxGqysf', 'UIWaiting');
// Scripts\Gui\UIWaiting.js

'use strict';

require('UIPanel');
cc.Class({
    extends: cc.uipanel,

    properties: {
        waitLabel: cc.Label
    },

    setMessage: function setMessage(msg) {
        this.waitLabel.string = msg;
    }
});

cc._RF.pop();
},{"UIPanel":"UIPanel"}],"bigJsPanel":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'e0d6dCFZxRA9oqbc4pKXxl7', 'bigJsPanel');
// Scripts\Gui\Widget\bigJsPanel.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        username: cc.Label,
        winnum: cc.Label,
        daqiangnum: cc.Label,
        quanleidanum: cc.Label,
        zongfen: cc.Label,
        winstate: cc.Node,
        losestate: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {},

    init: function init(data) {
        var player = cc.gamemanager.getPlayer(data.cuid);
        if (player != null) {
            this.username.string = player.name;
        }
        this.winnum.string = data.win.toString();
        this.daqiangnum.string = data.daqiang.toString();
        this.quanleidanum.string = data.quanleida.toString();
        this.zongfen.string = data.rank.toString();
    },

    setState: function setState(win, lose) {
        this.winstate.active = win;
        this.losestate.active = lose;
    }
});

cc._RF.pop();
},{}],"bytebuffer":[function(require,module,exports){
"use strict";
cc._RF.push(module, '370a1Icrw1Ltpqrh3NzRfir', 'bytebuffer');
// Scripts\Lib\bytebuffer.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 bytebuffer.js (c) 2015 Daniel Wirtz <dcode@dcode.io>
 Backing buffer: ArrayBuffer, Accessor: Uint8Array
 Released under the Apache License, Version 2.0
 see: https://github.com/dcodeIO/bytebuffer.js for details
*/
(function (k, m) {
  if ("function" === typeof define && define.amd) define(["long"], m);else if ("function" === typeof require && "object" === (typeof module === "undefined" ? "undefined" : _typeof(module)) && module && module.exports) {
    var r = module,
        s;try {
      s = require("long");
    } catch (u) {}s = m(s);r.exports = s;
  } else (k.dcodeIO = k.dcodeIO || {}).ByteBuffer = m(k.dcodeIO.Long);
})(undefined, function (k) {
  function m(a) {
    var b = 0;return function () {
      return b < a.length ? a.charCodeAt(b++) : null;
    };
  }function r() {
    var a = [],
        b = [];return function () {
      if (0 === arguments.length) return b.join("") + w.apply(String, a);1024 < a.length + arguments.length && (b.push(w.apply(String, a)), a.length = 0);Array.prototype.push.apply(a, arguments);
    };
  }function s(a, b, c, d, f) {
    var l;l = 8 * f - d - 1;var g = (1 << l) - 1,
        e = g >> 1,
        h = -7;f = c ? f - 1 : 0;var k = c ? -1 : 1,
        p = a[b + f];f += k;c = p & (1 << -h) - 1;p >>= -h;for (h += l; 0 < h; c = 256 * c + a[b + f], f += k, h -= 8) {}l = c & (1 << -h) - 1;c >>= -h;for (h += d; 0 < h; l = 256 * l + a[b + f], f += k, h -= 8) {}if (0 === c) c = 1 - e;else {
      if (c === g) return l ? NaN : Infinity * (p ? -1 : 1);l += Math.pow(2, d);c -= e;
    }return (p ? -1 : 1) * l * Math.pow(2, c - d);
  }function u(a, b, c, d, f, l) {
    var g,
        e = 8 * l - f - 1,
        h = (1 << e) - 1,
        k = h >> 1,
        p = 23 === f ? Math.pow(2, -24) - Math.pow(2, -77) : 0;l = d ? 0 : l - 1;var m = d ? 1 : -1,
        n = 0 > b || 0 === b && 0 > 1 / b ? 1 : 0;b = Math.abs(b);isNaN(b) || Infinity === b ? (b = isNaN(b) ? 1 : 0, d = h) : (d = Math.floor(Math.log(b) / Math.LN2), 1 > b * (g = Math.pow(2, -d)) && (d--, g *= 2), b = 1 <= d + k ? b + p / g : b + p * Math.pow(2, 1 - k), 2 <= b * g && (d++, g /= 2), d + k >= h ? (b = 0, d = h) : 1 <= d + k ? (b = (b * g - 1) * Math.pow(2, f), d += k) : (b = b * Math.pow(2, k - 1) * Math.pow(2, f), d = 0));for (; 8 <= f; a[c + l] = b & 255, l += m, b /= 256, f -= 8) {}d = d << f | b;for (e += f; 0 < e; a[c + l] = d & 255, l += m, d /= 256, e -= 8) {}a[c + l - m] |= 128 * n;
  }var h = function h(a, b, c) {
    "undefined" === typeof a && (a = h.DEFAULT_CAPACITY);"undefined" === typeof b && (b = h.DEFAULT_ENDIAN);"undefined" === typeof c && (c = h.DEFAULT_NOASSERT);if (!c) {
      a |= 0;if (0 > a) throw RangeError("Illegal capacity");b = !!b;c = !!c;
    }this.buffer = 0 === a ? v : new ArrayBuffer(a);this.view = 0 === a ? null : new Uint8Array(this.buffer);this.offset = 0;this.markedOffset = -1;this.limit = a;this.littleEndian = b;this.noAssert = c;
  };h.VERSION = "5.0.1";h.LITTLE_ENDIAN = !0;h.BIG_ENDIAN = !1;h.DEFAULT_CAPACITY = 16;h.DEFAULT_ENDIAN = h.BIG_ENDIAN;h.DEFAULT_NOASSERT = !1;h.Long = k || null;var e = h.prototype;Object.defineProperty(e, "__isByteBuffer__", { value: !0, enumerable: !1, configurable: !1 });var v = new ArrayBuffer(0),
      w = String.fromCharCode;h.accessor = function () {
    return Uint8Array;
  };h.allocate = function (a, b, c) {
    return new h(a, b, c);
  };h.concat = function (a, b, c, d) {
    if ("boolean" === typeof b || "string" !== typeof b) d = c, c = b, b = void 0;for (var f = 0, l = 0, g = a.length, e; l < g; ++l) {
      h.isByteBuffer(a[l]) || (a[l] = h.wrap(a[l], b)), e = a[l].limit - a[l].offset, 0 < e && (f += e);
    }if (0 === f) return new h(0, c, d);b = new h(f, c, d);for (l = 0; l < g;) {
      c = a[l++], e = c.limit - c.offset, 0 >= e || (b.view.set(c.view.subarray(c.offset, c.limit), b.offset), b.offset += e);
    }b.limit = b.offset;b.offset = 0;return b;
  };h.isByteBuffer = function (a) {
    return !0 === (a && a.__isByteBuffer__);
  };h.type = function () {
    return ArrayBuffer;
  };h.wrap = function (a, b, c, d) {
    "string" !== typeof b && (d = c, c = b, b = void 0);if ("string" === typeof a) switch ("undefined" === typeof b && (b = "utf8"), b) {case "base64":
        return h.fromBase64(a, c);case "hex":
        return h.fromHex(a, c);case "binary":
        return h.fromBinary(a, c);case "utf8":
        return h.fromUTF8(a, c);case "debug":
        return h.fromDebug(a, c);default:
        throw Error("Unsupported encoding: " + b);}if (null === a || "object" !== (typeof a === "undefined" ? "undefined" : _typeof(a))) throw TypeError("Illegal buffer");if (h.isByteBuffer(a)) return b = e.clone.call(a), b.markedOffset = -1, b;if (a instanceof Uint8Array) b = new h(0, c, d), 0 < a.length && (b.buffer = a.buffer, b.offset = a.byteOffset, b.limit = a.byteOffset + a.byteLength, b.view = new Uint8Array(a.buffer));else if (a instanceof ArrayBuffer) b = new h(0, c, d), 0 < a.byteLength && (b.buffer = a, b.offset = 0, b.limit = a.byteLength, b.view = 0 < a.byteLength ? new Uint8Array(a) : null);else if ("[object Array]" === Object.prototype.toString.call(a)) for (b = new h(a.length, c, d), b.limit = a.length, c = 0; c < a.length; ++c) {
      b.view[c] = a[c];
    } else throw TypeError("Illegal buffer");return b;
  };e.writeBitSet = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if (!(a instanceof Array)) throw TypeError("Illegal BitSet: Not an array");if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }var d = b,
        f = a.length,
        e = f >> 3,
        g = 0,
        h;for (b += this.writeVarint32(f, b); e--;) {
      h = !!a[g++] & 1 | (!!a[g++] & 1) << 1 | (!!a[g++] & 1) << 2 | (!!a[g++] & 1) << 3 | (!!a[g++] & 1) << 4 | (!!a[g++] & 1) << 5 | (!!a[g++] & 1) << 6 | (!!a[g++] & 1) << 7, this.writeByte(h, b++);
    }if (g < f) {
      for (h = e = 0; g < f;) {
        h |= (!!a[g++] & 1) << e++;
      }this.writeByte(h, b++);
    }return c ? (this.offset = b, this) : b - d;
  };e.readBitSet = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);var c = this.readVarint32(a),
        d = c.value,
        f = d >> 3,
        e = 0,
        g = [];for (a += c.length; f--;) {
      c = this.readByte(a++), g[e++] = !!(c & 1), g[e++] = !!(c & 2), g[e++] = !!(c & 4), g[e++] = !!(c & 8), g[e++] = !!(c & 16), g[e++] = !!(c & 32), g[e++] = !!(c & 64), g[e++] = !!(c & 128);
    }if (e < d) for (f = 0, c = this.readByte(a++); e < d;) {
      g[e++] = !!(c >> f++ & 1);
    }b && (this.offset = a);return g;
  };e.readBytes = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + a > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+" + a + ") <= " + this.buffer.byteLength);
    }var d = this.slice(b, b + a);c && (this.offset += a);return d;
  };e.writeBytes = e.append;e.writeInt8 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a |= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 1;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);this.view[b - 1] = a;c && (this.offset += 1);return this;
  };e.writeByte = e.writeInt8;e.readInt8 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
    }a = this.view[a];128 === (a & 128) && (a = -(255 - a + 1));b && (this.offset += 1);return a;
  };e.readByte = e.readInt8;e.writeUint8 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 1;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);
    this.view[b - 1] = a;c && (this.offset += 1);return this;
  };e.writeUInt8 = e.writeUint8;e.readUint8 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
    }a = this.view[a];b && (this.offset += 1);return a;
  };e.readUInt8 = e.readUint8;e.writeInt16 = function (a, b) {
    var c = "undefined" === typeof b;
    c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a |= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 2;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);b -= 2;this.littleEndian ? (this.view[b + 1] = (a & 65280) >>> 8, this.view[b] = a & 255) : (this.view[b] = (a & 65280) >>> 8, this.view[b + 1] = a & 255);c && (this.offset += 2);return this;
  };e.writeShort = e.writeInt16;e.readInt16 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 2 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+2) <= " + this.buffer.byteLength);
    }var c = 0;this.littleEndian ? (c = this.view[a], c |= this.view[a + 1] << 8) : (c = this.view[a] << 8, c |= this.view[a + 1]);32768 === (c & 32768) && (c = -(65535 - c + 1));b && (this.offset += 2);return c;
  };e.readShort = e.readInt16;e.writeUint16 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 2;var d = this.buffer.byteLength;
    b > d && this.resize((d *= 2) > b ? d : b);b -= 2;this.littleEndian ? (this.view[b + 1] = (a & 65280) >>> 8, this.view[b] = a & 255) : (this.view[b] = (a & 65280) >>> 8, this.view[b + 1] = a & 255);c && (this.offset += 2);return this;
  };e.writeUInt16 = e.writeUint16;e.readUint16 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 2 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+2) <= " + this.buffer.byteLength);
    }var c = 0;this.littleEndian ? (c = this.view[a], c |= this.view[a + 1] << 8) : (c = this.view[a] << 8, c |= this.view[a + 1]);b && (this.offset += 2);return c;
  };e.readUInt16 = e.readUint16;e.writeInt32 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a |= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 4;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);b -= 4;this.littleEndian ? (this.view[b + 3] = a >>> 24 & 255, this.view[b + 2] = a >>> 16 & 255, this.view[b + 1] = a >>> 8 & 255, this.view[b] = a & 255) : (this.view[b] = a >>> 24 & 255, this.view[b + 1] = a >>> 16 & 255, this.view[b + 2] = a >>> 8 & 255, this.view[b + 3] = a & 255);c && (this.offset += 4);return this;
  };e.writeInt = e.writeInt32;e.readInt32 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
    }var c = 0;this.littleEndian ? (c = this.view[a + 2] << 16, c |= this.view[a + 1] << 8, c |= this.view[a], c += this.view[a + 3] << 24 >>> 0) : (c = this.view[a + 1] << 16, c |= this.view[a + 2] << 8, c |= this.view[a + 3], c += this.view[a] << 24 >>> 0);b && (this.offset += 4);return c | 0;
  };e.readInt = e.readInt32;e.writeUint32 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);
    if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 4;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);b -= 4;this.littleEndian ? (this.view[b + 3] = a >>> 24 & 255, this.view[b + 2] = a >>> 16 & 255, this.view[b + 1] = a >>> 8 & 255, this.view[b] = a & 255) : (this.view[b] = a >>> 24 & 255, this.view[b + 1] = a >>> 16 & 255, this.view[b + 2] = a >>> 8 & 255, this.view[b + 3] = a & 255);c && (this.offset += 4);return this;
  };e.writeUInt32 = e.writeUint32;e.readUint32 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
    }var c = 0;this.littleEndian ? (c = this.view[a + 2] << 16, c |= this.view[a + 1] << 8, c |= this.view[a], c += this.view[a + 3] << 24 >>> 0) : (c = this.view[a + 1] << 16, c |= this.view[a + 2] << 8, c |= this.view[a + 3], c += this.view[a] << 24 >>> 0);b && (this.offset += 4);return c;
  };e.readUInt32 = e.readUint32;k && (e.writeInt64 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" === typeof a) a = k.fromNumber(a);else if ("string" === typeof a) a = k.fromString(a);else if (!(a && a instanceof k)) throw TypeError("Illegal value: " + a + " (not an integer or Long)");if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }"number" === typeof a ? a = k.fromNumber(a) : "string" === typeof a && (a = k.fromString(a));b += 8;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);b -= 8;var d = a.low,
        f = a.high;this.littleEndian ? (this.view[b + 3] = d >>> 24 & 255, this.view[b + 2] = d >>> 16 & 255, this.view[b + 1] = d >>> 8 & 255, this.view[b] = d & 255, b += 4, this.view[b + 3] = f >>> 24 & 255, this.view[b + 2] = f >>> 16 & 255, this.view[b + 1] = f >>> 8 & 255, this.view[b] = f & 255) : (this.view[b] = f >>> 24 & 255, this.view[b + 1] = f >>> 16 & 255, this.view[b + 2] = f >>> 8 & 255, this.view[b + 3] = f & 255, b += 4, this.view[b] = d >>> 24 & 255, this.view[b + 1] = d >>> 16 & 255, this.view[b + 2] = d >>> 8 & 255, this.view[b + 3] = d & 255);c && (this.offset += 8);return this;
  }, e.writeLong = e.writeInt64, e.readInt64 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");
      a >>>= 0;if (0 > a || a + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength);
    }var c = 0,
        d = 0;this.littleEndian ? (c = this.view[a + 2] << 16, c |= this.view[a + 1] << 8, c |= this.view[a], c += this.view[a + 3] << 24 >>> 0, a += 4, d = this.view[a + 2] << 16, d |= this.view[a + 1] << 8, d |= this.view[a], d += this.view[a + 3] << 24 >>> 0) : (d = this.view[a + 1] << 16, d |= this.view[a + 2] << 8, d |= this.view[a + 3], d += this.view[a] << 24 >>> 0, a += 4, c = this.view[a + 1] << 16, c |= this.view[a + 2] << 8, c |= this.view[a + 3], c += this.view[a] << 24 >>> 0);
    a = new k(c, d, !1);b && (this.offset += 8);return a;
  }, e.readLong = e.readInt64, e.writeUint64 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" === typeof a) a = k.fromNumber(a);else if ("string" === typeof a) a = k.fromString(a);else if (!(a && a instanceof k)) throw TypeError("Illegal value: " + a + " (not an integer or Long)");if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }"number" === typeof a ? a = k.fromNumber(a) : "string" === typeof a && (a = k.fromString(a));b += 8;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);b -= 8;var d = a.low,
        f = a.high;this.littleEndian ? (this.view[b + 3] = d >>> 24 & 255, this.view[b + 2] = d >>> 16 & 255, this.view[b + 1] = d >>> 8 & 255, this.view[b] = d & 255, b += 4, this.view[b + 3] = f >>> 24 & 255, this.view[b + 2] = f >>> 16 & 255, this.view[b + 1] = f >>> 8 & 255, this.view[b] = f & 255) : (this.view[b] = f >>> 24 & 255, this.view[b + 1] = f >>> 16 & 255, this.view[b + 2] = f >>> 8 & 255, this.view[b + 3] = f & 255, b += 4, this.view[b] = d >>> 24 & 255, this.view[b + 1] = d >>> 16 & 255, this.view[b + 2] = d >>> 8 & 255, this.view[b + 3] = d & 255);c && (this.offset += 8);return this;
  }, e.writeUInt64 = e.writeUint64, e.readUint64 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength);
    }var c = 0,
        d = 0;this.littleEndian ? (c = this.view[a + 2] << 16, c |= this.view[a + 1] << 8, c |= this.view[a], c += this.view[a + 3] << 24 >>> 0, a += 4, d = this.view[a + 2] << 16, d |= this.view[a + 1] << 8, d |= this.view[a], d += this.view[a + 3] << 24 >>> 0) : (d = this.view[a + 1] << 16, d |= this.view[a + 2] << 8, d |= this.view[a + 3], d += this.view[a] << 24 >>> 0, a += 4, c = this.view[a + 1] << 16, c |= this.view[a + 2] << 8, c |= this.view[a + 3], c += this.view[a] << 24 >>> 0);a = new k(c, d, !0);b && (this.offset += 8);return a;
  }, e.readUInt64 = e.readUint64);e.writeFloat32 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a) throw TypeError("Illegal value: " + a + " (not a number)");if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 4;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);u(this.view, a, b - 4, this.littleEndian, 23, 4);c && (this.offset += 4);return this;
  };e.writeFloat = e.writeFloat32;e.readFloat32 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
    }a = s(this.view, a, this.littleEndian, 23, 4);b && (this.offset += 4);return a;
  };e.readFloat = e.readFloat32;e.writeFloat64 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a) throw TypeError("Illegal value: " + a + " (not a number)");
      if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }b += 8;var d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);u(this.view, a, b - 8, this.littleEndian, 52, 8);c && (this.offset += 8);return this;
  };e.writeDouble = e.writeFloat64;e.readFloat64 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 8 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+8) <= " + this.buffer.byteLength);
    }a = s(this.view, a, this.littleEndian, 52, 8);b && (this.offset += 8);return a;
  };e.readDouble = e.readFloat64;h.MAX_VARINT32_BYTES = 5;h.calculateVarint32 = function (a) {
    a >>>= 0;return 128 > a ? 1 : 16384 > a ? 2 : 2097152 > a ? 3 : 268435456 > a ? 4 : 5;
  };h.zigZagEncode32 = function (a) {
    return ((a |= 0) << 1 ^ a >> 31) >>> 0;
  };h.zigZagDecode32 = function (a) {
    return a >>> 1 ^ -(a & 1) | 0;
  };e.writeVarint32 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a |= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }var d = h.calculateVarint32(a),
        f;b += d;f = this.buffer.byteLength;b > f && this.resize((f *= 2) > b ? f : b);
    b -= d;for (a >>>= 0; 128 <= a;) {
      f = a & 127 | 128, this.view[b++] = f, a >>>= 7;
    }this.view[b++] = a;return c ? (this.offset = b, this) : d;
  };e.writeVarint32ZigZag = function (a, b) {
    return this.writeVarint32(h.zigZagEncode32(a), b);
  };e.readVarint32 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
    }var c = 0,
        d = 0,
        f;do {
      if (!this.noAssert && a > this.limit) throw a = Error("Truncated"), a.truncated = !0, a;f = this.view[a++];5 > c && (d |= (f & 127) << 7 * c);++c;
    } while (0 !== (f & 128));d |= 0;return b ? (this.offset = a, d) : { value: d, length: c };
  };e.readVarint32ZigZag = function (a) {
    a = this.readVarint32(a);"object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) ? a.value = h.zigZagDecode32(a.value) : a = h.zigZagDecode32(a);return a;
  };k && (h.MAX_VARINT64_BYTES = 10, h.calculateVarint64 = function (a) {
    "number" === typeof a ? a = k.fromNumber(a) : "string" === typeof a && (a = k.fromString(a));var b = a.toInt() >>> 0,
        c = a.shiftRightUnsigned(28).toInt() >>> 0;a = a.shiftRightUnsigned(56).toInt() >>> 0;return 0 == a ? 0 == c ? 16384 > b ? 128 > b ? 1 : 2 : 2097152 > b ? 3 : 4 : 16384 > c ? 128 > c ? 5 : 6 : 2097152 > c ? 7 : 8 : 128 > a ? 9 : 10;
  }, h.zigZagEncode64 = function (a) {
    "number" === typeof a ? a = k.fromNumber(a, !1) : "string" === typeof a ? a = k.fromString(a, !1) : !1 !== a.unsigned && (a = a.toSigned());return a.shiftLeft(1).xor(a.shiftRight(63)).toUnsigned();
  }, h.zigZagDecode64 = function (a) {
    "number" === typeof a ? a = k.fromNumber(a, !1) : "string" === typeof a ? a = k.fromString(a, !1) : !1 !== a.unsigned && (a = a.toSigned());return a.shiftRightUnsigned(1).xor(a.and(k.ONE).toSigned().negate()).toSigned();
  }, e.writeVarint64 = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" === typeof a) a = k.fromNumber(a);else if ("string" === typeof a) a = k.fromString(a);else if (!(a && a instanceof k)) throw TypeError("Illegal value: " + a + " (not an integer or Long)");if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }"number" === typeof a ? a = k.fromNumber(a, !1) : "string" === typeof a ? a = k.fromString(a, !1) : !1 !== a.unsigned && (a = a.toSigned());var d = h.calculateVarint64(a),
        f = a.toInt() >>> 0,
        e = a.shiftRightUnsigned(28).toInt() >>> 0,
        g = a.shiftRightUnsigned(56).toInt() >>> 0;b += d;var t = this.buffer.byteLength;b > t && this.resize((t *= 2) > b ? t : b);b -= d;switch (d) {case 10:
        this.view[b + 9] = g >>> 7 & 1;case 9:
        this.view[b + 8] = 9 !== d ? g | 128 : g & 127;case 8:
        this.view[b + 7] = 8 !== d ? e >>> 21 | 128 : e >>> 21 & 127;case 7:
        this.view[b + 6] = 7 !== d ? e >>> 14 | 128 : e >>> 14 & 127;case 6:
        this.view[b + 5] = 6 !== d ? e >>> 7 | 128 : e >>> 7 & 127;case 5:
        this.view[b + 4] = 5 !== d ? e | 128 : e & 127;case 4:
        this.view[b + 3] = 4 !== d ? f >>> 21 | 128 : f >>> 21 & 127;case 3:
        this.view[b + 2] = 3 !== d ? f >>> 14 | 128 : f >>> 14 & 127;case 2:
        this.view[b + 1] = 2 !== d ? f >>> 7 | 128 : f >>> 7 & 127;case 1:
        this.view[b] = 1 !== d ? f | 128 : f & 127;}return c ? (this.offset += d, this) : d;
  }, e.writeVarint64ZigZag = function (a, b) {
    return this.writeVarint64(h.zigZagEncode64(a), b);
  }, e.readVarint64 = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
    }var c = a,
        d = 0,
        f = 0,
        e = 0,
        g = 0,
        g = this.view[a++],
        d = g & 127;if (g & 128 && (g = this.view[a++], d |= (g & 127) << 7, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], d |= (g & 127) << 14, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], d |= (g & 127) << 21, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], f = g & 127, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], f |= (g & 127) << 7, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], f |= (g & 127) << 14, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], f |= (g & 127) << 21, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], e = g & 127, g & 128 || this.noAssert && "undefined" === typeof g) && (g = this.view[a++], e |= (g & 127) << 7, g & 128 || this.noAssert && "undefined" === typeof g)) throw Error("Buffer overrun");d = k.fromBits(d | f << 28, f >>> 4 | e << 24, !1);return b ? (this.offset = a, d) : { value: d, length: a - c };
  }, e.readVarint64ZigZag = function (a) {
    (a = this.readVarint64(a)) && a.value instanceof k ? a.value = h.zigZagDecode64(a.value) : a = h.zigZagDecode64(a);return a;
  });e.writeCString = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);var d,
        f = a.length;if (!this.noAssert) {
      if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");for (d = 0; d < f; ++d) {
        if (0 === a.charCodeAt(d)) throw RangeError("Illegal str: Contains NULL-characters");
      }if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }f = n.calculateUTF16asUTF8(m(a))[1];b += f + 1;d = this.buffer.byteLength;b > d && this.resize((d *= 2) > b ? d : b);b -= f + 1;n.encodeUTF16toUTF8(m(a), function (a) {
      this.view[b++] = a;
    }.bind(this));this.view[b++] = 0;return c ? (this.offset = b, this) : f;
  };e.readCString = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
    }var c = a,
        d,
        f = -1;n.decodeUTF8toUTF16(function () {
      if (0 === f) return null;if (a >= this.limit) throw RangeError("Illegal range: Truncated data, " + a + " < " + this.limit);f = this.view[a++];return 0 === f ? null : f;
    }.bind(this), d = r(), !0);return b ? (this.offset = a, d()) : { string: d(), length: a - c };
  };e.writeIString = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }var d = b,
        f;f = n.calculateUTF16asUTF8(m(a), this.noAssert)[1];b += 4 + f;var e = this.buffer.byteLength;b > e && this.resize((e *= 2) > b ? e : b);b -= 4 + f;this.littleEndian ? (this.view[b + 3] = f >>> 24 & 255, this.view[b + 2] = f >>> 16 & 255, this.view[b + 1] = f >>> 8 & 255, this.view[b] = f & 255) : (this.view[b] = f >>> 24 & 255, this.view[b + 1] = f >>> 16 & 255, this.view[b + 2] = f >>> 8 & 255, this.view[b + 3] = f & 255);b += 4;n.encodeUTF16toUTF8(m(a), function (a) {
      this.view[b++] = a;
    }.bind(this));if (b !== d + 4 + f) throw RangeError("Illegal range: Truncated data, " + b + " == " + (b + 4 + f));return c ? (this.offset = b, this) : b - d;
  };e.readIString = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 4 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+4) <= " + this.buffer.byteLength);
    }var c = a,
        d = this.readUint32(a),
        d = this.readUTF8String(d, h.METRICS_BYTES, a += 4);a += d.length;return b ? (this.offset = a, d.string) : { string: d.string, length: a - c };
  };h.METRICS_CHARS = "c";h.METRICS_BYTES = "b";e.writeUTF8String = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }var d,
        f = b;d = n.calculateUTF16asUTF8(m(a))[1];b += d;var e = this.buffer.byteLength;b > e && this.resize((e *= 2) > b ? e : b);b -= d;n.encodeUTF16toUTF8(m(a), function (a) {
      this.view[b++] = a;
    }.bind(this));return c ? (this.offset = b, this) : b - f;
  };e.writeString = e.writeUTF8String;h.calculateUTF8Chars = function (a) {
    return n.calculateUTF16asUTF8(m(a))[0];
  };h.calculateUTF8Bytes = function (a) {
    return n.calculateUTF16asUTF8(m(a))[1];
  };
  h.calculateString = h.calculateUTF8Bytes;e.readUTF8String = function (a, b, c) {
    "number" === typeof b && (c = b, b = void 0);var d = "undefined" === typeof c;d && (c = this.offset);"undefined" === typeof b && (b = h.METRICS_CHARS);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal length: " + a + " (not an integer)");a |= 0;if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");c >>>= 0;if (0 > c || c + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength);
    }var f = 0,
        e = c,
        g;if (b === h.METRICS_CHARS) {
      g = r();n.decodeUTF8(function () {
        return f < a && c < this.limit ? this.view[c++] : null;
      }.bind(this), function (a) {
        ++f;n.UTF8toUTF16(a, g);
      });if (f !== a) throw RangeError("Illegal range: Truncated data, " + f + " == " + a);return d ? (this.offset = c, g()) : { string: g(), length: c - e };
    }if (b === h.METRICS_BYTES) {
      if (!this.noAssert) {
        if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");c >>>= 0;if (0 > c || c + a > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+" + a + ") <= " + this.buffer.byteLength);
      }var k = c + a;n.decodeUTF8toUTF16(function () {
        return c < k ? this.view[c++] : null;
      }.bind(this), g = r(), this.noAssert);if (c !== k) throw RangeError("Illegal range: Truncated data, " + c + " == " + k);return d ? (this.offset = c, g()) : { string: g(), length: c - e };
    }throw TypeError("Unsupported metrics: " + b);
  };e.readString = e.readUTF8String;e.writeVString = function (a, b) {
    var c = "undefined" === typeof b;c && (b = this.offset);if (!this.noAssert) {
      if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");
      if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: " + b + " (not an integer)");b >>>= 0;if (0 > b || b + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + b + " (+0) <= " + this.buffer.byteLength);
    }var d = b,
        f,
        e;f = n.calculateUTF16asUTF8(m(a), this.noAssert)[1];e = h.calculateVarint32(f);b += e + f;var g = this.buffer.byteLength;b > g && this.resize((g *= 2) > b ? g : b);b -= e + f;b += this.writeVarint32(f, b);n.encodeUTF16toUTF8(m(a), function (a) {
      this.view[b++] = a;
    }.bind(this));if (b !== d + f + e) throw RangeError("Illegal range: Truncated data, " + b + " == " + (b + f + e));return c ? (this.offset = b, this) : b - d;
  };e.readVString = function (a) {
    var b = "undefined" === typeof a;b && (a = this.offset);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 1 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+1) <= " + this.buffer.byteLength);
    }var c = a,
        d = this.readVarint32(a),
        d = this.readUTF8String(d.value, h.METRICS_BYTES, a += d.length);a += d.length;return b ? (this.offset = a, d.string) : { string: d.string,
      length: a - c };
  };e.append = function (a, b, c) {
    if ("number" === typeof b || "string" !== typeof b) c = b, b = void 0;var d = "undefined" === typeof c;d && (c = this.offset);if (!this.noAssert) {
      if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");c >>>= 0;if (0 > c || c + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength);
    }a instanceof h || (a = h.wrap(a, b));b = a.limit - a.offset;if (0 >= b) return this;c += b;var f = this.buffer.byteLength;c > f && this.resize((f *= 2) > c ? f : c);c -= b;this.view.set(a.view.subarray(a.offset, a.limit), c);a.offset += b;d && (this.offset += b);return this;
  };e.appendTo = function (a, b) {
    a.append(this, b);return this;
  };e.assert = function (a) {
    this.noAssert = !a;return this;
  };e.capacity = function () {
    return this.buffer.byteLength;
  };e.clear = function () {
    this.offset = 0;this.limit = this.buffer.byteLength;this.markedOffset = -1;return this;
  };e.clone = function (a) {
    var b = new h(0, this.littleEndian, this.noAssert);a ? (b.buffer = new ArrayBuffer(this.buffer.byteLength), b.view = new Uint8Array(b.buffer)) : (b.buffer = this.buffer, b.view = this.view);b.offset = this.offset;b.markedOffset = this.markedOffset;b.limit = this.limit;return b;
  };e.compact = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");b >>>= 0;if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
    }if (0 === a && b === this.buffer.byteLength) return this;var c = b - a;if (0 === c) return this.buffer = v, this.view = null, 0 <= this.markedOffset && (this.markedOffset -= a), this.limit = this.offset = 0, this;var d = new ArrayBuffer(c),
        f = new Uint8Array(d);f.set(this.view.subarray(a, b));this.buffer = d;this.view = f;0 <= this.markedOffset && (this.markedOffset -= a);this.offset = 0;this.limit = c;return this;
  };e.copy = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");b >>>= 0;if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
    }if (a === b) return new h(0, this.littleEndian, this.noAssert);var c = b - a,
        d = new h(c, this.littleEndian, this.noAssert);d.offset = 0;d.limit = c;0 <= d.markedOffset && (d.markedOffset -= a);this.copyTo(d, 0, a, b);return d;
  };e.copyTo = function (a, b, c, d) {
    var f, e;if (!this.noAssert && !h.isByteBuffer(a)) throw TypeError("Illegal target: Not a ByteBuffer");b = (e = "undefined" === typeof b) ? a.offset : b | 0;c = (f = "undefined" === typeof c) ? this.offset : c | 0;d = "undefined" === typeof d ? this.limit : d | 0;if (0 > b || b > a.buffer.byteLength) throw RangeError("Illegal target range: 0 <= " + b + " <= " + a.buffer.byteLength);if (0 > c || d > this.buffer.byteLength) throw RangeError("Illegal source range: 0 <= " + c + " <= " + this.buffer.byteLength);var g = d - c;if (0 === g) return a;a.ensureCapacity(b + g);
    a.view.set(this.view.subarray(c, d), b);f && (this.offset += g);e && (a.offset += g);return this;
  };e.ensureCapacity = function (a) {
    var b = this.buffer.byteLength;return b < a ? this.resize((b *= 2) > a ? b : a) : this;
  };e.fill = function (a, b, c) {
    var d = "undefined" === typeof b;d && (b = this.offset);"string" === typeof a && 0 < a.length && (a = a.charCodeAt(0));"undefined" === typeof b && (b = this.offset);"undefined" === typeof c && (c = this.limit);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal value: " + a + " (not an integer)");a |= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal begin: Not an integer");b >>>= 0;if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal end: Not an integer");c >>>= 0;if (0 > b || b > c || c > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + b + " <= " + c + " <= " + this.buffer.byteLength);
    }if (b >= c) return this;for (; b < c;) {
      this.view[b++] = a;
    }d && (this.offset = b);return this;
  };e.flip = function () {
    this.limit = this.offset;this.offset = 0;return this;
  };e.mark = function (a) {
    a = "undefined" === typeof a ? this.offset : a;
    if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal offset: " + a + " (not an integer)");a >>>= 0;if (0 > a || a + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + a + " (+0) <= " + this.buffer.byteLength);
    }this.markedOffset = a;return this;
  };e.order = function (a) {
    if (!this.noAssert && "boolean" !== typeof a) throw TypeError("Illegal littleEndian: Not a boolean");this.littleEndian = !!a;return this;
  };e.LE = function (a) {
    this.littleEndian = "undefined" !== typeof a ? !!a : !0;return this;
  };e.BE = function (a) {
    this.littleEndian = "undefined" !== typeof a ? !a : !1;return this;
  };e.prepend = function (a, b, c) {
    if ("number" === typeof b || "string" !== typeof b) c = b, b = void 0;var d = "undefined" === typeof c;d && (c = this.offset);if (!this.noAssert) {
      if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal offset: " + c + " (not an integer)");c >>>= 0;if (0 > c || c + 0 > this.buffer.byteLength) throw RangeError("Illegal offset: 0 <= " + c + " (+0) <= " + this.buffer.byteLength);
    }a instanceof h || (a = h.wrap(a, b));b = a.limit - a.offset;if (0 >= b) return this;var f = b - c;if (0 < f) {
      var e = new ArrayBuffer(this.buffer.byteLength + f),
          g = new Uint8Array(e);g.set(this.view.subarray(c, this.buffer.byteLength), b);this.buffer = e;this.view = g;this.offset += f;0 <= this.markedOffset && (this.markedOffset += f);this.limit += f;c += f;
    } else new Uint8Array(this.buffer);this.view.set(a.view.subarray(a.offset, a.limit), c - b);a.offset = a.limit;d && (this.offset -= b);return this;
  };e.prependTo = function (a, b) {
    a.prepend(this, b);return this;
  };e.printDebug = function (a) {
    "function" !== typeof a && (a = console.log.bind(console));a(this.toString() + "\n-------------------------------------------------------------------\n" + this.toDebug(!0));
  };e.remaining = function () {
    return this.limit - this.offset;
  };e.reset = function () {
    0 <= this.markedOffset ? (this.offset = this.markedOffset, this.markedOffset = -1) : this.offset = 0;return this;
  };e.resize = function (a) {
    if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal capacity: " + a + " (not an integer)");a |= 0;if (0 > a) throw RangeError("Illegal capacity: 0 <= " + a);
    }if (this.buffer.byteLength < a) {
      a = new ArrayBuffer(a);var b = new Uint8Array(a);b.set(this.view);this.buffer = a;this.view = b;
    }return this;
  };
  e.reverse = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");b >>>= 0;if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
    }if (a === b) return this;Array.prototype.reverse.call(this.view.subarray(a, b));return this;
  };
  e.skip = function (a) {
    if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal length: " + a + " (not an integer)");a |= 0;
    }var b = this.offset + a;if (!this.noAssert && (0 > b || b > this.buffer.byteLength)) throw RangeError("Illegal length: 0 <= " + this.offset + " + " + a + " <= " + this.buffer.byteLength);this.offset = b;return this;
  };e.slice = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");
      a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");b >>>= 0;if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
    }var c = this.clone();c.offset = a;c.limit = b;return c;
  };e.toBuffer = function (a) {
    var b = this.offset,
        c = this.limit;if (!this.noAssert) {
      if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal offset: Not an integer");b >>>= 0;if ("number" !== typeof c || 0 !== c % 1) throw TypeError("Illegal limit: Not an integer");
      c >>>= 0;if (0 > b || b > c || c > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + b + " <= " + c + " <= " + this.buffer.byteLength);
    }if (!a && 0 === b && c === this.buffer.byteLength) return this.buffer;if (b === c) return v;a = new ArrayBuffer(c - b);new Uint8Array(a).set(new Uint8Array(this.buffer).subarray(b, c), 0);return a;
  };e.toArrayBuffer = e.toBuffer;e.toString = function (a, b, c) {
    if ("undefined" === typeof a) return "ByteBufferAB(offset=" + this.offset + ",markedOffset=" + this.markedOffset + ",limit=" + this.limit + ",capacity=" + this.capacity() + ")";"number" === typeof a && (c = b = a = "utf8");switch (a) {case "utf8":
        return this.toUTF8(b, c);case "base64":
        return this.toBase64(b, c);case "hex":
        return this.toHex(b, c);case "binary":
        return this.toBinary(b, c);case "debug":
        return this.toDebug();case "columns":
        return this.toColumns();default:
        throw Error("Unsupported encoding: " + a);}
  };var x = function () {
    for (var a = {}, b = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47], c = [], d = 0, f = b.length; d < f; ++d) {
      c[b[d]] = d;
    }a.encode = function (a, c) {
      for (var d, f; null !== (d = a());) {
        c(b[d >> 2 & 63]), f = (d & 3) << 4, null !== (d = a()) ? (f |= d >> 4 & 15, c(b[(f | d >> 4 & 15) & 63]), f = (d & 15) << 2, null !== (d = a()) ? (c(b[(f | d >> 6 & 3) & 63]), c(b[d & 63])) : (c(b[f & 63]), c(61))) : (c(b[f & 63]), c(61), c(61));
      }
    };a.decode = function (a, b) {
      function d(a) {
        throw Error("Illegal character code: " + a);
      }for (var f, e, h; null !== (f = a());) {
        if (e = c[f], "undefined" === typeof e && d(f), null !== (f = a()) && (h = c[f], "undefined" === typeof h && d(f), b(e << 2 >>> 0 | (h & 48) >> 4), null !== (f = a()))) {
          e = c[f];if ("undefined" === typeof e) if (61 === f) break;else d(f);b((h & 15) << 4 >>> 0 | (e & 60) >> 2);if (null !== (f = a())) {
            h = c[f];if ("undefined" === typeof h) if (61 === f) break;else d(f);b((e & 3) << 6 >>> 0 | h);
          }
        }
      }
    };a.test = function (a) {
      return (/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(a)
      );
    };return a;
  }();e.toBase64 = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);a |= 0;b |= 0;if (0 > a || b > this.capacity || a > b) throw RangeError("begin, end");var c;x.encode(function () {
      return a < b ? this.view[a++] : null;
    }.bind(this), c = r());return c();
  };h.fromBase64 = function (a, b) {
    if ("string" !== typeof a) throw TypeError("str");var c = new h(a.length / 4 * 3, b),
        d = 0;x.decode(m(a), function (a) {
      c.view[d++] = a;
    });c.limit = d;return c;
  };h.btoa = function (a) {
    return h.fromBinary(a).toBase64();
  };h.atob = function (a) {
    return h.fromBase64(a).toBinary();
  };e.toBinary = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);
    a |= 0;b |= 0;if (0 > a || b > this.capacity() || a > b) throw RangeError("begin, end");if (a === b) return "";for (var c = [], d = []; a < b;) {
      c.push(this.view[a++]), 1024 <= c.length && (d.push(String.fromCharCode.apply(String, c)), c = []);
    }return d.join("") + String.fromCharCode.apply(String, c);
  };h.fromBinary = function (a, b) {
    if ("string" !== typeof a) throw TypeError("str");for (var c = 0, d = a.length, f, e = new h(d, b); c < d;) {
      f = a.charCodeAt(c);if (255 < f) throw RangeError("illegal char code: " + f);e.view[c++] = f;
    }e.limit = d;return e;
  };e.toDebug = function (a) {
    for (var b = -1, c = this.buffer.byteLength, d, f = "", e = "", g = ""; b < c;) {
      -1 !== b && (d = this.view[b], f = 16 > d ? f + ("0" + d.toString(16).toUpperCase()) : f + d.toString(16).toUpperCase(), a && (e += 32 < d && 127 > d ? String.fromCharCode(d) : "."));++b;if (a && 0 < b && 0 === b % 16 && b !== c) {
        for (; 51 > f.length;) {
          f += " ";
        }g += f + e + "\n";f = e = "";
      }f = b === this.offset && b === this.limit ? f + (b === this.markedOffset ? "!" : "|") : b === this.offset ? f + (b === this.markedOffset ? "[" : "<") : b === this.limit ? f + (b === this.markedOffset ? "]" : ">") : f + (b === this.markedOffset ? "'" : a || 0 !== b && b !== c ? " " : "");
    }if (a && " " !== f) {
      for (; 51 > f.length;) {
        f += " ";
      }g += f + e + "\n";
    }return a ? g : f;
  };h.fromDebug = function (a, b, c) {
    var d = a.length;b = new h((d + 1) / 3 | 0, b, c);for (var f = 0, e = 0, g, k = !1, m = !1, n = !1, p = !1, q = !1; f < d;) {
      switch (g = a.charAt(f++)) {case "!":
          if (!c) {
            if (m || n || p) {
              q = !0;break;
            }m = n = p = !0;
          }b.offset = b.markedOffset = b.limit = e;k = !1;break;case "|":
          if (!c) {
            if (m || p) {
              q = !0;break;
            }m = p = !0;
          }b.offset = b.limit = e;k = !1;break;case "[":
          if (!c) {
            if (m || n) {
              q = !0;break;
            }m = n = !0;
          }b.offset = b.markedOffset = e;k = !1;break;case "<":
          if (!c) {
            if (m) {
              q = !0;break;
            }m = !0;
          }b.offset = e;k = !1;break;case "]":
          if (!c) {
            if (p || n) {
              q = !0;break;
            }p = n = !0;
          }b.limit = b.markedOffset = e;k = !1;break;case ">":
          if (!c) {
            if (p) {
              q = !0;break;
            }p = !0;
          }b.limit = e;k = !1;break;case "'":
          if (!c) {
            if (n) {
              q = !0;break;
            }n = !0;
          }b.markedOffset = e;k = !1;break;case " ":
          k = !1;break;default:
          if (!c && k) {
            q = !0;break;
          }g = parseInt(g + a.charAt(f++), 16);if (!c && (isNaN(g) || 0 > g || 255 < g)) throw TypeError("Illegal str: Not a debug encoded string");b.view[e++] = g;k = !0;}if (q) throw TypeError("Illegal str: Invalid symbol at " + f);
    }if (!c) {
      if (!m || !p) throw TypeError("Illegal str: Missing offset or limit");
      if (e < b.buffer.byteLength) throw TypeError("Illegal str: Not a debug encoded string (is it hex?) " + e + " < " + d);
    }return b;
  };e.toHex = function (a, b) {
    a = "undefined" === typeof a ? this.offset : a;b = "undefined" === typeof b ? this.limit : b;if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");b >>>= 0;if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
    }for (var c = Array(b - a), d; a < b;) {
      d = this.view[a++], 16 > d ? c.push("0", d.toString(16)) : c.push(d.toString(16));
    }return c.join("");
  };h.fromHex = function (a, b, c) {
    if (!c) {
      if ("string" !== typeof a) throw TypeError("Illegal str: Not a string");if (0 !== a.length % 2) throw TypeError("Illegal str: Length not a multiple of 2");
    }var d = a.length;b = new h(d / 2 | 0, b);for (var f, e = 0, g = 0; e < d; e += 2) {
      f = parseInt(a.substring(e, e + 2), 16);if (!c && (!isFinite(f) || 0 > f || 255 < f)) throw TypeError("Illegal str: Contains non-hex characters");
      b.view[g++] = f;
    }b.limit = g;return b;
  };var n = function () {
    var a = { MAX_CODEPOINT: 1114111, encodeUTF8: function encodeUTF8(a, c) {
        var d = null;"number" === typeof a && (d = a, a = function a() {
          return null;
        });for (; null !== d || null !== (d = a());) {
          128 > d ? c(d & 127) : (2048 > d ? c(d >> 6 & 31 | 192) : (65536 > d ? c(d >> 12 & 15 | 224) : (c(d >> 18 & 7 | 240), c(d >> 12 & 63 | 128)), c(d >> 6 & 63 | 128)), c(d & 63 | 128)), d = null;
        }
      }, decodeUTF8: function decodeUTF8(a, c) {
        for (var d, f, e, g, h = function h(a) {
          a = a.slice(0, a.indexOf(null));var b = Error(a.toString());b.name = "TruncatedError";b.bytes = a;throw b;
        }; null !== (d = a());) {
          if (0 === (d & 128)) c(d);else if (192 === (d & 224)) null === (f = a()) && h([d, f]), c((d & 31) << 6 | f & 63);else if (224 === (d & 240)) null !== (f = a()) && null !== (e = a()) || h([d, f, e]), c((d & 15) << 12 | (f & 63) << 6 | e & 63);else if (240 === (d & 248)) null !== (f = a()) && null !== (e = a()) && null !== (g = a()) || h([d, f, e, g]), c((d & 7) << 18 | (f & 63) << 12 | (e & 63) << 6 | g & 63);else throw RangeError("Illegal starting byte: " + d);
        }
      }, UTF16toUTF8: function UTF16toUTF8(a, c) {
        for (var d, e = null; null !== (d = null !== e ? e : a());) {
          55296 <= d && 57343 >= d && null !== (e = a()) && 56320 <= e && 57343 >= e ? (c(1024 * (d - 55296) + e - 56320 + 65536), e = null) : c(d);
        }null !== e && c(e);
      }, UTF8toUTF16: function UTF8toUTF16(a, c) {
        var d = null;"number" === typeof a && (d = a, a = function a() {
          return null;
        });for (; null !== d || null !== (d = a());) {
          65535 >= d ? c(d) : (d -= 65536, c((d >> 10) + 55296), c(d % 1024 + 56320)), d = null;
        }
      }, encodeUTF16toUTF8: function encodeUTF16toUTF8(b, c) {
        a.UTF16toUTF8(b, function (b) {
          a.encodeUTF8(b, c);
        });
      }, decodeUTF8toUTF16: function decodeUTF8toUTF16(b, c) {
        a.decodeUTF8(b, function (b) {
          a.UTF8toUTF16(b, c);
        });
      }, calculateCodePoint: function calculateCodePoint(a) {
        return 128 > a ? 1 : 2048 > a ? 2 : 65536 > a ? 3 : 4;
      }, calculateUTF8: function calculateUTF8(a) {
        for (var c, d = 0; null !== (c = a());) {
          d += 128 > c ? 1 : 2048 > c ? 2 : 65536 > c ? 3 : 4;
        }return d;
      }, calculateUTF16asUTF8: function calculateUTF16asUTF8(b) {
        var c = 0,
            d = 0;a.UTF16toUTF8(b, function (a) {
          ++c;d += 128 > a ? 1 : 2048 > a ? 2 : 65536 > a ? 3 : 4;
        });return [c, d];
      } };return a;
  }();e.toUTF8 = function (a, b) {
    "undefined" === typeof a && (a = this.offset);"undefined" === typeof b && (b = this.limit);if (!this.noAssert) {
      if ("number" !== typeof a || 0 !== a % 1) throw TypeError("Illegal begin: Not an integer");a >>>= 0;if ("number" !== typeof b || 0 !== b % 1) throw TypeError("Illegal end: Not an integer");b >>>= 0;if (0 > a || a > b || b > this.buffer.byteLength) throw RangeError("Illegal range: 0 <= " + a + " <= " + b + " <= " + this.buffer.byteLength);
    }var c;try {
      n.decodeUTF8toUTF16(function () {
        return a < b ? this.view[a++] : null;
      }.bind(this), c = r());
    } catch (d) {
      if (a !== b) throw RangeError("Illegal range: Truncated data, " + a + " != " + b);
    }return c();
  };h.fromUTF8 = function (a, b, c) {
    if (!c && "string" !== typeof a) throw TypeError("Illegal str: Not a string");var d = new h(n.calculateUTF16asUTF8(m(a), !0)[1], b, c),
        e = 0;n.encodeUTF16toUTF8(m(a), function (a) {
      d.view[e++] = a;
    });d.limit = e;return d;
  };return h;
});

cc._RF.pop();
},{"long":"long"}],"init":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'b5713OFGZhA+Jt7gBxhwNe/', 'init');
// Scripts\init.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.log("onload begin");

        Date.prototype.Format = function (fmt) {
            //author: meizz   
            var o = {
                "M+": this.getMonth() + 1, //月份   
                "d+": this.getDate(), //日   
                "h+": this.getHours(), //小时   
                "m+": this.getMinutes(), //分   
                "s+": this.getSeconds(), //秒   
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
                "S": this.getMilliseconds() //毫秒   
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }return fmt;
        };
        cc.netmanager.init();
        cc.netmanager.registerHandler(cc.datamanager);
        cc.netmanager.registerHandler(cc.gamemanager);
        cc.netmanager.registerHandler(cc.guimanager);

        cc.audiomanager.init();

        cc.scenemanager.loadLoginScene();
        cc.log('onload');
    }

});

cc._RF.pop();
},{}],"long":[function(require,module,exports){
"use strict";
cc._RF.push(module, '2c847wd+iJEZZInKRIzLwWs', 'long');
// Scripts\Lib\long.js

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 Copyright 2013 Daniel Wirtz <dcode@dcode.io>
 Copyright 2009 The Closure Library Authors. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS-IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * @license long.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/long.js for details
 */
(function (global, factory) {

    /* AMD */if (typeof define === 'function' && define["amd"]) define([], factory);
    /* CommonJS */else if (typeof require === 'function' && (typeof module === 'undefined' ? 'undefined' : _typeof(module)) === "object" && module && module["exports"]) module["exports"] = factory();
        /* Global */else (global["dcodeIO"] = global["dcodeIO"] || {})["Long"] = factory();
})(undefined, function () {
    "use strict";

    /**
     * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
     *  See the from* functions below for more convenient ways of constructing Longs.
     * @exports Long
     * @class A Long class for representing a 64 bit two's-complement integer value.
     * @param {number} low The low (signed) 32 bits of the long
     * @param {number} high The high (signed) 32 bits of the long
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @constructor
     */

    function Long(low, high, unsigned) {

        /**
         * The low 32 bits as a signed value.
         * @type {number}
         * @expose
         */
        this.low = low | 0;

        /**
         * The high 32 bits as a signed value.
         * @type {number}
         * @expose
         */
        this.high = high | 0;

        /**
         * Whether unsigned or not.
         * @type {boolean}
         * @expose
         */
        this.unsigned = !!unsigned;
    }

    // The internal representation of a long is the two given signed, 32-bit values.
    // We use 32-bit pieces because these are the size of integers on which
    // Javascript performs bit-operations.  For operations like addition and
    // multiplication, we split each number into 16 bit pieces, which can easily be
    // multiplied within Javascript's floating-point representation without overflow
    // or change in sign.
    //
    // In the algorithms below, we frequently reduce the negative case to the
    // positive case by negating the input(s) and then post-processing the result.
    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
    // a positive number, it overflows back into a negative).  Not handling this
    // case would often result in infinite recursion.
    //
    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
    // methods on which they depend.

    /**
     * An indicator used to reliably determine if an object is a Long or not.
     * @type {boolean}
     * @const
     * @expose
     * @private
     */
    Long.prototype.__isLong__;

    Object.defineProperty(Long.prototype, "__isLong__", {
        value: true,
        enumerable: false,
        configurable: false
    });

    /**
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     * @inner
     */
    function isLong(obj) {
        return (obj && obj["__isLong__"]) === true;
    }

    /**
     * Tests if the specified object is a Long.
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     * @expose
     */
    Long.isLong = isLong;

    /**
     * A cache of the Long representations of small integer values.
     * @type {!Object}
     * @inner
     */
    var INT_CACHE = {};

    /**
     * A cache of the Long representations of small unsigned integer values.
     * @type {!Object}
     * @inner
     */
    var UINT_CACHE = {};

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromInt(value, unsigned) {
        var obj, cachedObj, cache;
        if (unsigned) {
            value >>>= 0;
            if (cache = 0 <= value && value < 256) {
                cachedObj = UINT_CACHE[value];
                if (cachedObj) return cachedObj;
            }
            obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
            if (cache) UINT_CACHE[value] = obj;
            return obj;
        } else {
            value |= 0;
            if (cache = -128 <= value && value < 128) {
                cachedObj = INT_CACHE[value];
                if (cachedObj) return cachedObj;
            }
            obj = fromBits(value, value < 0 ? -1 : 0, false);
            if (cache) INT_CACHE[value] = obj;
            return obj;
        }
    }

    /**
     * Returns a Long representing the given 32 bit integer value.
     * @function
     * @param {number} value The 32 bit integer in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     * @expose
     */
    Long.fromInt = fromInt;

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromNumber(value, unsigned) {
        if (isNaN(value) || !isFinite(value)) return unsigned ? UZERO : ZERO;
        if (unsigned) {
            if (value < 0) return UZERO;
            if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
        } else {
            if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
            if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
        }
        if (value < 0) return fromNumber(-value, unsigned).neg();
        return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
    }

    /**
     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
     * @function
     * @param {number} value The number in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     * @expose
     */
    Long.fromNumber = fromNumber;

    /**
     * @param {number} lowBits
     * @param {number} highBits
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromBits(lowBits, highBits, unsigned) {
        return new Long(lowBits, highBits, unsigned);
    }

    /**
     * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
     *  assumed to use 32 bits.
     * @function
     * @param {number} lowBits The low 32 bits
     * @param {number} highBits The high 32 bits
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     * @expose
     */
    Long.fromBits = fromBits;

    /**
     * @function
     * @param {number} base
     * @param {number} exponent
     * @returns {number}
     * @inner
     */
    var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

    /**
     * @param {string} str
     * @param {(boolean|number)=} unsigned
     * @param {number=} radix
     * @returns {!Long}
     * @inner
     */
    function fromString(str, unsigned, radix) {
        if (str.length === 0) throw Error('empty string');
        if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity") return ZERO;
        if (typeof unsigned === 'number') {
            // For goog.math.long compatibility
            radix = unsigned, unsigned = false;
        } else {
            unsigned = !!unsigned;
        }
        radix = radix || 10;
        if (radix < 2 || 36 < radix) throw RangeError('radix');

        var p;
        if ((p = str.indexOf('-')) > 0) throw Error('interior hyphen');else if (p === 0) {
            return fromString(str.substring(1), unsigned, radix).neg();
        }

        // Do several (8) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 8));

        var result = ZERO;
        for (var i = 0; i < str.length; i += 8) {
            var size = Math.min(8, str.length - i),
                value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
                var power = fromNumber(pow_dbl(radix, size));
                result = result.mul(power).add(fromNumber(value));
            } else {
                result = result.mul(radixToPower);
                result = result.add(fromNumber(value));
            }
        }
        result.unsigned = unsigned;
        return result;
    }

    /**
     * Returns a Long representation of the given string, written using the specified radix.
     * @function
     * @param {string} str The textual representation of the Long
     * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
     * @returns {!Long} The corresponding Long value
     * @expose
     */
    Long.fromString = fromString;

    /**
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
     * @returns {!Long}
     * @inner
     */
    function fromValue(val) {
        if (val /* is compatible */ instanceof Long) return val;
        if (typeof val === 'number') return fromNumber(val);
        if (typeof val === 'string') return fromString(val);
        // Throws for non-objects, converts non-instanceof Long:
        return fromBits(val.low, val.high, val.unsigned);
    }

    /**
     * Converts the specified value to a Long.
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
     * @returns {!Long}
     * @expose
     */
    Long.fromValue = fromValue;

    // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
    // no runtime penalty for these.

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_16_DBL = 1 << 16;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_24_DBL = 1 << 24;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

    /**
     * @type {!Long}
     * @const
     * @inner
     */
    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

    /**
     * @type {!Long}
     * @inner
     */
    var ZERO = fromInt(0);

    /**
     * Signed zero.
     * @type {!Long}
     * @expose
     */
    Long.ZERO = ZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var UZERO = fromInt(0, true);

    /**
     * Unsigned zero.
     * @type {!Long}
     * @expose
     */
    Long.UZERO = UZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var ONE = fromInt(1);

    /**
     * Signed one.
     * @type {!Long}
     * @expose
     */
    Long.ONE = ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var UONE = fromInt(1, true);

    /**
     * Unsigned one.
     * @type {!Long}
     * @expose
     */
    Long.UONE = UONE;

    /**
     * @type {!Long}
     * @inner
     */
    var NEG_ONE = fromInt(-1);

    /**
     * Signed negative one.
     * @type {!Long}
     * @expose
     */
    Long.NEG_ONE = NEG_ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_VALUE = fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0, false);

    /**
     * Maximum signed value.
     * @type {!Long}
     * @expose
     */
    Long.MAX_VALUE = MAX_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF | 0, 0xFFFFFFFF | 0, true);

    /**
     * Maximum unsigned value.
     * @type {!Long}
     * @expose
     */
    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MIN_VALUE = fromBits(0, 0x80000000 | 0, false);

    /**
     * Minimum signed value.
     * @type {!Long}
     * @expose
     */
    Long.MIN_VALUE = MIN_VALUE;

    /**
     * @alias Long.prototype
     * @inner
     */
    var LongPrototype = Long.prototype;

    /**
     * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
     * @returns {number}
     * @expose
     */
    LongPrototype.toInt = function toInt() {
        return this.unsigned ? this.low >>> 0 : this.low;
    };

    /**
     * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
     * @returns {number}
     * @expose
     */
    LongPrototype.toNumber = function toNumber() {
        if (this.unsigned) return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };

    /**
     * Converts the Long to a string written in the specified radix.
     * @param {number=} radix Radix (2-36), defaults to 10
     * @returns {string}
     * @override
     * @throws {RangeError} If `radix` is out of range
     * @expose
     */
    LongPrototype.toString = function toString(radix) {
        radix = radix || 10;
        if (radix < 2 || 36 < radix) throw RangeError('radix');
        if (this.isZero()) return '0';
        if (this.isNegative()) {
            // Unsigned Longs are never negative
            if (this.eq(MIN_VALUE)) {
                // We need to change the Long value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                var radixLong = fromNumber(radix),
                    div = this.div(radixLong),
                    rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
            } else return '-' + this.neg().toString(radix);
        }

        // Do several (6) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
            rem = this;
        var result = '';
        while (true) {
            var remDiv = rem.div(radixToPower),
                intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
                digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero()) return digits + result;else {
                while (digits.length < 6) {
                    digits = '0' + digits;
                }result = '' + digits + result;
            }
        }
    };

    /**
     * Gets the high 32 bits as a signed integer.
     * @returns {number} Signed high bits
     * @expose
     */
    LongPrototype.getHighBits = function getHighBits() {
        return this.high;
    };

    /**
     * Gets the high 32 bits as an unsigned integer.
     * @returns {number} Unsigned high bits
     * @expose
     */
    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
        return this.high >>> 0;
    };

    /**
     * Gets the low 32 bits as a signed integer.
     * @returns {number} Signed low bits
     * @expose
     */
    LongPrototype.getLowBits = function getLowBits() {
        return this.low;
    };

    /**
     * Gets the low 32 bits as an unsigned integer.
     * @returns {number} Unsigned low bits
     * @expose
     */
    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
        return this.low >>> 0;
    };

    /**
     * Gets the number of bits needed to represent the absolute value of this Long.
     * @returns {number}
     * @expose
     */
    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
        if (this.isNegative()) // Unsigned Longs are never negative
            return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
        var val = this.high != 0 ? this.high : this.low;
        for (var bit = 31; bit > 0; bit--) {
            if ((val & 1 << bit) != 0) break;
        }return this.high != 0 ? bit + 33 : bit + 1;
    };

    /**
     * Tests if this Long's value equals zero.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isZero = function isZero() {
        return this.high === 0 && this.low === 0;
    };

    /**
     * Tests if this Long's value is negative.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isNegative = function isNegative() {
        return !this.unsigned && this.high < 0;
    };

    /**
     * Tests if this Long's value is positive.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isPositive = function isPositive() {
        return this.unsigned || this.high >= 0;
    };

    /**
     * Tests if this Long's value is odd.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isOdd = function isOdd() {
        return (this.low & 1) === 1;
    };

    /**
     * Tests if this Long's value is even.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isEven = function isEven() {
        return (this.low & 1) === 0;
    };

    /**
     * Tests if this Long's value equals the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.equals = function equals(other) {
        if (!isLong(other)) other = fromValue(other);
        if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1) return false;
        return this.high === other.high && this.low === other.low;
    };

    /**
     * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.eq = LongPrototype.equals;

    /**
     * Tests if this Long's value differs from the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.notEquals = function notEquals(other) {
        return !this.eq( /* validates */other);
    };

    /**
     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.neq = LongPrototype.notEquals;

    /**
     * Tests if this Long's value is less than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.lessThan = function lessThan(other) {
        return this.comp( /* validates */other) < 0;
    };

    /**
     * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.lt = LongPrototype.lessThan;

    /**
     * Tests if this Long's value is less than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
        return this.comp( /* validates */other) <= 0;
    };

    /**
     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.lte = LongPrototype.lessThanOrEqual;

    /**
     * Tests if this Long's value is greater than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.greaterThan = function greaterThan(other) {
        return this.comp( /* validates */other) > 0;
    };

    /**
     * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.gt = LongPrototype.greaterThan;

    /**
     * Tests if this Long's value is greater than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
        return this.comp( /* validates */other) >= 0;
    };

    /**
     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.gte = LongPrototype.greaterThanOrEqual;

    /**
     * Compares this Long's value with the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     * @expose
     */
    LongPrototype.compare = function compare(other) {
        if (!isLong(other)) other = fromValue(other);
        if (this.eq(other)) return 0;
        var thisNeg = this.isNegative(),
            otherNeg = other.isNegative();
        if (thisNeg && !otherNeg) return -1;
        if (!thisNeg && otherNeg) return 1;
        // At this point the sign bits are the same
        if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
        // Both are positive if at least one is unsigned
        return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
    };

    /**
     * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     * @expose
     */
    LongPrototype.comp = LongPrototype.compare;

    /**
     * Negates this Long's value.
     * @returns {!Long} Negated Long
     * @expose
     */
    LongPrototype.negate = function negate() {
        if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
        return this.not().add(ONE);
    };

    /**
     * Negates this Long's value. This is an alias of {@link Long#negate}.
     * @function
     * @returns {!Long} Negated Long
     * @expose
     */
    LongPrototype.neg = LongPrototype.negate;

    /**
     * Returns the sum of this and the specified Long.
     * @param {!Long|number|string} addend Addend
     * @returns {!Long} Sum
     * @expose
     */
    LongPrototype.add = function add(addend) {
        if (!isLong(addend)) addend = fromValue(addend);

        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;

        var b48 = addend.high >>> 16;
        var b32 = addend.high & 0xFFFF;
        var b16 = addend.low >>> 16;
        var b00 = addend.low & 0xFFFF;

        var c48 = 0,
            c32 = 0,
            c16 = 0,
            c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 + b48;
        c48 &= 0xFFFF;
        return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };

    /**
     * Returns the difference of this and the specified Long.
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     * @expose
     */
    LongPrototype.subtract = function subtract(subtrahend) {
        if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
        return this.add(subtrahend.neg());
    };

    /**
     * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
     * @function
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     * @expose
     */
    LongPrototype.sub = LongPrototype.subtract;

    /**
     * Returns the product of this and the specified Long.
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     * @expose
     */
    LongPrototype.multiply = function multiply(multiplier) {
        if (this.isZero()) return ZERO;
        if (!isLong(multiplier)) multiplier = fromValue(multiplier);
        if (multiplier.isZero()) return ZERO;
        if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
        if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;

        if (this.isNegative()) {
            if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());else return this.neg().mul(multiplier).neg();
        } else if (multiplier.isNegative()) return this.mul(multiplier.neg()).neg();

        // If both longs are small, use float multiplication
        if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24)) return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.

        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;

        var b48 = multiplier.high >>> 16;
        var b32 = multiplier.high & 0xFFFF;
        var b16 = multiplier.low >>> 16;
        var b00 = multiplier.low & 0xFFFF;

        var c48 = 0,
            c32 = 0,
            c16 = 0,
            c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xFFFF;
        return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
    };

    /**
     * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
     * @function
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     * @expose
     */
    LongPrototype.mul = LongPrototype.multiply;

    /**
     * Returns this Long divided by the specified. The result is signed if this Long is signed or
     *  unsigned if this Long is unsigned.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     * @expose
     */
    LongPrototype.divide = function divide(divisor) {
        if (!isLong(divisor)) divisor = fromValue(divisor);
        if (divisor.isZero()) throw Error('division by zero');
        if (this.isZero()) return this.unsigned ? UZERO : ZERO;
        var approx, rem, res;
        if (!this.unsigned) {
            // This section is only relevant for signed longs and is derived from the
            // closure library as a whole.
            if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE)) return MIN_VALUE; // recall that -MIN_VALUE == MIN_VALUE
                else if (divisor.eq(MIN_VALUE)) return ONE;else {
                        // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                        var halfThis = this.shr(1);
                        approx = halfThis.div(divisor).shl(1);
                        if (approx.eq(ZERO)) {
                            return divisor.isNegative() ? ONE : NEG_ONE;
                        } else {
                            rem = this.sub(divisor.mul(approx));
                            res = approx.add(rem.div(divisor));
                            return res;
                        }
                    }
            } else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
            if (this.isNegative()) {
                if (divisor.isNegative()) return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
            } else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
            res = ZERO;
        } else {
            // The algorithm below has not been made for unsigned longs. It's therefore
            // required to take special care of the MSB prior to running it.
            if (!divisor.unsigned) divisor = divisor.toUnsigned();
            if (divisor.gt(this)) return UZERO;
            if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
                return UONE;
            res = UZERO;
        }

        // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        rem = this;
        while (rem.gte(divisor)) {
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

            // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            var log2 = Math.ceil(Math.log(approx) / Math.LN2),
                delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48),


            // Decrease the approximation until it is smaller than the remainder.  Note
            // that if it is too large, the product overflows and is negative.
            approxRes = fromNumber(approx),
                approxRem = approxRes.mul(divisor);
            while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta;
                approxRes = fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
            }

            // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero()) approxRes = ONE;

            res = res.add(approxRes);
            rem = rem.sub(approxRem);
        }
        return res;
    };

    /**
     * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     * @expose
     */
    LongPrototype.div = LongPrototype.divide;

    /**
     * Returns this Long modulo the specified.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     * @expose
     */
    LongPrototype.modulo = function modulo(divisor) {
        if (!isLong(divisor)) divisor = fromValue(divisor);
        return this.sub(this.div(divisor).mul(divisor));
    };

    /**
     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     * @expose
     */
    LongPrototype.mod = LongPrototype.modulo;

    /**
     * Returns the bitwise NOT of this Long.
     * @returns {!Long}
     * @expose
     */
    LongPrototype.not = function not() {
        return fromBits(~this.low, ~this.high, this.unsigned);
    };

    /**
     * Returns the bitwise AND of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     * @expose
     */
    LongPrototype.and = function and(other) {
        if (!isLong(other)) other = fromValue(other);
        return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };

    /**
     * Returns the bitwise OR of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     * @expose
     */
    LongPrototype.or = function or(other) {
        if (!isLong(other)) other = fromValue(other);
        return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };

    /**
     * Returns the bitwise XOR of this Long and the given one.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     * @expose
     */
    LongPrototype.xor = function xor(other) {
        if (!isLong(other)) other = fromValue(other);
        return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shiftLeft = function shiftLeft(numBits) {
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;else if (numBits < 32) return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);else return fromBits(0, this.low << numBits - 32, this.unsigned);
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shl = LongPrototype.shiftLeft;

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shiftRight = function shiftRight(numBits) {
        if (isLong(numBits)) numBits = numBits.toInt();
        if ((numBits &= 63) === 0) return this;else if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);else return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
    };

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shr = LongPrototype.shiftRight;

    /**
     * Returns this Long with bits logically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
        if (isLong(numBits)) numBits = numBits.toInt();
        numBits &= 63;
        if (numBits === 0) return this;else {
            var high = this.high;
            if (numBits < 32) {
                var low = this.low;
                return fromBits(low >>> numBits | high << 32 - numBits, high >>> numBits, this.unsigned);
            } else if (numBits === 32) return fromBits(high, 0, this.unsigned);else return fromBits(high >>> numBits - 32, 0, this.unsigned);
        }
    };

    /**
     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shru = LongPrototype.shiftRightUnsigned;

    /**
     * Converts this Long to signed.
     * @returns {!Long} Signed long
     * @expose
     */
    LongPrototype.toSigned = function toSigned() {
        if (!this.unsigned) return this;
        return fromBits(this.low, this.high, false);
    };

    /**
     * Converts this Long to unsigned.
     * @returns {!Long} Unsigned long
     * @expose
     */
    LongPrototype.toUnsigned = function toUnsigned() {
        if (this.unsigned) return this;
        return fromBits(this.low, this.high, true);
    };

    return Long;
});

cc._RF.pop();
},{}],"protobuf":[function(require,module,exports){
(function (process){
"use strict";
cc._RF.push(module, 'e6691hW/mRNZZdi3yfy4y8r', 'protobuf');
// Scripts\Lib\protobuf.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 Copyright 2013 Daniel Wirtz <dcode@dcode.io>

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * @license protobuf.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/protobuf.js for details
 */
(function (global, factory) {

    /* AMD */if (typeof define === 'function' && define["amd"]) define(["bytebuffer"], factory);
    /* CommonJS */else if (typeof require === "function" && (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && module && module["exports"]) module["exports"] = factory(require("bytebuffer"), true);
        /* Global */else (global["dcodeIO"] = global["dcodeIO"] || {})["ProtoBuf"] = factory(global["dcodeIO"]["ByteBuffer"]);
})(undefined, function (ByteBuffer, isCommonJS) {
    "use strict";

    /**
     * The ProtoBuf namespace.
     * @exports ProtoBuf
     * @namespace
     * @expose
     */

    var ProtoBuf = {};

    /**
     * @type {!function(new: ByteBuffer, ...[*])}
     * @expose
     */
    ProtoBuf.ByteBuffer = ByteBuffer;

    /**
     * @type {?function(new: Long, ...[*])}
     * @expose
     */
    ProtoBuf.Long = ByteBuffer.Long || null;

    /**
     * ProtoBuf.js version.
     * @type {string}
     * @const
     * @expose
     */
    ProtoBuf.VERSION = "5.0.1";

    /**
     * Wire types.
     * @type {Object.<string,number>}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES = {};

    /**
     * Varint wire type.
     * @type {number}
     * @expose
     */
    ProtoBuf.WIRE_TYPES.VARINT = 0;

    /**
     * Fixed 64 bits wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.BITS64 = 1;

    /**
     * Length delimited wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.LDELIM = 2;

    /**
     * Start group wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.STARTGROUP = 3;

    /**
     * End group wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.ENDGROUP = 4;

    /**
     * Fixed 32 bits wire type.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.WIRE_TYPES.BITS32 = 5;

    /**
     * Packable wire types.
     * @type {!Array.<number>}
     * @const
     * @expose
     */
    ProtoBuf.PACKABLE_WIRE_TYPES = [ProtoBuf.WIRE_TYPES.VARINT, ProtoBuf.WIRE_TYPES.BITS64, ProtoBuf.WIRE_TYPES.BITS32];

    /**
     * Types.
     * @dict
     * @type {!Object.<string,{name: string, wireType: number, defaultValue: *}>}
     * @const
     * @expose
     */
    ProtoBuf.TYPES = {
        // According to the protobuf spec.
        "int32": {
            name: "int32",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        "uint32": {
            name: "uint32",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        "sint32": {
            name: "sint32",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        "int64": {
            name: "int64",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
        },
        "uint64": {
            name: "uint64",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.UZERO : undefined
        },
        "sint64": {
            name: "sint64",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
        },
        "bool": {
            name: "bool",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: false
        },
        "double": {
            name: "double",
            wireType: ProtoBuf.WIRE_TYPES.BITS64,
            defaultValue: 0
        },
        "string": {
            name: "string",
            wireType: ProtoBuf.WIRE_TYPES.LDELIM,
            defaultValue: ""
        },
        "bytes": {
            name: "bytes",
            wireType: ProtoBuf.WIRE_TYPES.LDELIM,
            defaultValue: null // overridden in the code, must be a unique instance
        },
        "fixed32": {
            name: "fixed32",
            wireType: ProtoBuf.WIRE_TYPES.BITS32,
            defaultValue: 0
        },
        "sfixed32": {
            name: "sfixed32",
            wireType: ProtoBuf.WIRE_TYPES.BITS32,
            defaultValue: 0
        },
        "fixed64": {
            name: "fixed64",
            wireType: ProtoBuf.WIRE_TYPES.BITS64,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.UZERO : undefined
        },
        "sfixed64": {
            name: "sfixed64",
            wireType: ProtoBuf.WIRE_TYPES.BITS64,
            defaultValue: ProtoBuf.Long ? ProtoBuf.Long.ZERO : undefined
        },
        "float": {
            name: "float",
            wireType: ProtoBuf.WIRE_TYPES.BITS32,
            defaultValue: 0
        },
        "enum": {
            name: "enum",
            wireType: ProtoBuf.WIRE_TYPES.VARINT,
            defaultValue: 0
        },
        "message": {
            name: "message",
            wireType: ProtoBuf.WIRE_TYPES.LDELIM,
            defaultValue: null
        },
        "group": {
            name: "group",
            wireType: ProtoBuf.WIRE_TYPES.STARTGROUP,
            defaultValue: null
        }
    };

    /**
     * Valid map key types.
     * @type {!Array.<!Object.<string,{name: string, wireType: number, defaultValue: *}>>}
     * @const
     * @expose
     */
    ProtoBuf.MAP_KEY_TYPES = [ProtoBuf.TYPES["int32"], ProtoBuf.TYPES["sint32"], ProtoBuf.TYPES["sfixed32"], ProtoBuf.TYPES["uint32"], ProtoBuf.TYPES["fixed32"], ProtoBuf.TYPES["int64"], ProtoBuf.TYPES["sint64"], ProtoBuf.TYPES["sfixed64"], ProtoBuf.TYPES["uint64"], ProtoBuf.TYPES["fixed64"], ProtoBuf.TYPES["bool"], ProtoBuf.TYPES["string"], ProtoBuf.TYPES["bytes"]];

    /**
     * Minimum field id.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.ID_MIN = 1;

    /**
     * Maximum field id.
     * @type {number}
     * @const
     * @expose
     */
    ProtoBuf.ID_MAX = 0x1FFFFFFF;

    /**
     * If set to `true`, field names will be converted from underscore notation to camel case. Defaults to `false`.
     *  Must be set prior to parsing.
     * @type {boolean}
     * @expose
     */
    ProtoBuf.convertFieldsToCamelCase = false;

    /**
     * By default, messages are populated with (setX, set_x) accessors for each field. This can be disabled by
     *  setting this to `false` prior to building messages.
     * @type {boolean}
     * @expose
     */
    ProtoBuf.populateAccessors = true;

    /**
     * By default, messages are populated with default values if a field is not present on the wire. To disable
     *  this behavior, set this setting to `false`.
     * @type {boolean}
     * @expose
     */
    ProtoBuf.populateDefaults = true;

    /**
     * @alias ProtoBuf.Util
     * @expose
     */
    ProtoBuf.Util = function () {
        "use strict";

        /**
         * ProtoBuf utilities.
         * @exports ProtoBuf.Util
         * @namespace
         */

        var Util = {};

        /**
         * Flag if running in node or not.
         * @type {boolean}
         * @const
         * @expose
         */
        Util.IS_NODE = !!((typeof process === "undefined" ? "undefined" : _typeof(process)) === 'object' && process + '' === '[object process]' && !process['browser']);

        /**
         * Constructs a XMLHttpRequest object.
         * @return {XMLHttpRequest}
         * @throws {Error} If XMLHttpRequest is not supported
         * @expose
         */
        Util.XHR = function () {
            // No dependencies please, ref: http://www.quirksmode.org/js/xmlhttp.html
            var XMLHttpFactories = [function () {
                return new XMLHttpRequest();
            }, function () {
                return new ActiveXObject("Msxml2.XMLHTTP");
            }, function () {
                return new ActiveXObject("Msxml3.XMLHTTP");
            }, function () {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }];
            /** @type {?XMLHttpRequest} */
            var xhr = null;
            for (var i = 0; i < XMLHttpFactories.length; i++) {
                try {
                    xhr = XMLHttpFactories[i]();
                } catch (e) {
                    continue;
                }
                break;
            }
            if (!xhr) throw Error("XMLHttpRequest is not supported");
            return xhr;
        };

        /**
         * Fetches a resource.
         * @param {string} path Resource path
         * @param {function(?string)=} callback Callback receiving the resource's contents. If omitted the resource will
         *   be fetched synchronously. If the request failed, contents will be null.
         * @return {?string|undefined} Resource contents if callback is omitted (null if the request failed), else undefined.
         * @expose
         */
        Util.fetch = function (path, callback) {
            if (callback && typeof callback != 'function') callback = null;
            if (Util.IS_NODE) {
                var fs = require("fs");
                if (callback) {
                    fs.readFile(path, function (err, data) {
                        if (err) callback(null);else callback("" + data);
                    });
                } else try {
                    return fs.readFileSync(path);
                } catch (e) {
                    return null;
                }
            } else {
                var xhr = Util.XHR();
                xhr.open('GET', path, callback ? true : false);
                // xhr.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
                xhr.setRequestHeader('Accept', 'text/plain');
                if (typeof xhr.overrideMimeType === 'function') xhr.overrideMimeType('text/plain');
                if (callback) {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState != 4) return;
                        if ( /* remote */xhr.status == 200 || /* local */xhr.status == 0 && typeof xhr.responseText === 'string') callback(xhr.responseText);else callback(null);
                    };
                    if (xhr.readyState == 4) return;
                    xhr.send(null);
                } else {
                    xhr.send(null);
                    if ( /* remote */xhr.status == 200 || /* local */xhr.status == 0 && typeof xhr.responseText === 'string') return xhr.responseText;
                    return null;
                }
            }
        };

        /**
         * Converts a string to camel case.
         * @param {string} str
         * @returns {string}
         * @expose
         */
        Util.toCamelCase = function (str) {
            return str.replace(/_([a-zA-Z])/g, function ($0, $1) {
                return $1.toUpperCase();
            });
        };

        return Util;
    }();

    /**
     * Language expressions.
     * @type {!Object.<string,!RegExp>}
     * @expose
     */
    ProtoBuf.Lang = {

        // Characters always ending a statement
        DELIM: /[\s\{\}=;:\[\],'"\(\)<>]/g,

        // Field rules
        RULE: /^(?:required|optional|repeated|map)$/,

        // Field types
        TYPE: /^(?:double|float|int32|uint32|sint32|int64|uint64|sint64|fixed32|sfixed32|fixed64|sfixed64|bool|string|bytes)$/,

        // Names
        NAME: /^[a-zA-Z_][a-zA-Z_0-9]*$/,

        // Type definitions
        TYPEDEF: /^[a-zA-Z][a-zA-Z_0-9]*$/,

        // Type references
        TYPEREF: /^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/,

        // Fully qualified type references
        FQTYPEREF: /^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/,

        // All numbers
        NUMBER: /^-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+|([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?)|inf|nan)$/,

        // Decimal numbers
        NUMBER_DEC: /^(?:[1-9][0-9]*|0)$/,

        // Hexadecimal numbers
        NUMBER_HEX: /^0[xX][0-9a-fA-F]+$/,

        // Octal numbers
        NUMBER_OCT: /^0[0-7]+$/,

        // Floating point numbers
        NUMBER_FLT: /^([0-9]*(\.[0-9]*)?([Ee][+-]?[0-9]+)?|inf|nan)$/,

        // Booleans
        BOOL: /^(?:true|false)$/i,

        // Id numbers
        ID: /^(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,

        // Negative id numbers (enum values)
        NEGID: /^\-?(?:[1-9][0-9]*|0|0[xX][0-9a-fA-F]+|0[0-7]+)$/,

        // Whitespaces
        WHITESPACE: /\s/,

        // All strings
        STRING: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")|(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,

        // Double quoted strings
        STRING_DQ: /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,

        // Single quoted strings
        STRING_SQ: /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g
    };

    /**
     * @alias ProtoBuf.DotProto
     * @expose
     */
    ProtoBuf.DotProto = function (ProtoBuf, Lang) {
        "use strict";

        /**
         * Utilities to parse .proto files.
         * @exports ProtoBuf.DotProto
         * @namespace
         */

        var DotProto = {};

        /**
         * Constructs a new Tokenizer.
         * @exports ProtoBuf.DotProto.Tokenizer
         * @class prototype tokenizer
         * @param {string} proto Proto to tokenize
         * @constructor
         */
        var Tokenizer = function Tokenizer(proto) {

            /**
             * Source to parse.
             * @type {string}
             * @expose
             */
            this.source = proto + "";

            /**
             * Current index.
             * @type {number}
             * @expose
             */
            this.index = 0;

            /**
             * Current line.
             * @type {number}
             * @expose
             */
            this.line = 1;

            /**
             * Token stack.
             * @type {!Array.<string>}
             * @expose
             */
            this.stack = [];

            /**
             * Opening character of the current string read, if any.
             * @type {?string}
             * @private
             */
            this._stringOpen = null;
        };

        /**
         * @alias ProtoBuf.DotProto.Tokenizer.prototype
         * @inner
         */
        var TokenizerPrototype = Tokenizer.prototype;

        /**
         * Reads a string beginning at the current index.
         * @return {string}
         * @private
         */
        TokenizerPrototype._readString = function () {
            var re = this._stringOpen === '"' ? Lang.STRING_DQ : Lang.STRING_SQ;
            re.lastIndex = this.index - 1; // Include the open quote
            var match = re.exec(this.source);
            if (!match) throw Error("unterminated string");
            this.index = re.lastIndex;
            this.stack.push(this._stringOpen);
            this._stringOpen = null;
            return match[1];
        };

        /**
         * Gets the next token and advances by one.
         * @return {?string} Token or `null` on EOF
         * @expose
         */
        TokenizerPrototype.next = function () {
            if (this.stack.length > 0) return this.stack.shift();
            if (this.index >= this.source.length) return null;
            if (this._stringOpen !== null) return this._readString();

            var repeat, prev, next;
            do {
                repeat = false;

                // Strip white spaces
                while (Lang.WHITESPACE.test(next = this.source.charAt(this.index))) {
                    if (next === '\n') ++this.line;
                    if (++this.index === this.source.length) return null;
                }

                // Strip comments
                if (this.source.charAt(this.index) === '/') {
                    ++this.index;
                    if (this.source.charAt(this.index) === '/') {
                        // Line
                        while (this.source.charAt(++this.index) !== '\n') {
                            if (this.index == this.source.length) return null;
                        }++this.index;
                        ++this.line;
                        repeat = true;
                    } else if ((next = this.source.charAt(this.index)) === '*') {
                        /* Block */
                        do {
                            if (next === '\n') ++this.line;
                            if (++this.index === this.source.length) return null;
                            prev = next;
                            next = this.source.charAt(this.index);
                        } while (prev !== '*' || next !== '/');
                        ++this.index;
                        repeat = true;
                    } else return '/';
                }
            } while (repeat);

            if (this.index === this.source.length) return null;

            // Read the next token
            var end = this.index;
            Lang.DELIM.lastIndex = 0;
            var delim = Lang.DELIM.test(this.source.charAt(end++));
            if (!delim) while (end < this.source.length && !Lang.DELIM.test(this.source.charAt(end))) {
                ++end;
            }var token = this.source.substring(this.index, this.index = end);
            if (token === '"' || token === "'") this._stringOpen = token;
            return token;
        };

        /**
         * Peeks for the next token.
         * @return {?string} Token or `null` on EOF
         * @expose
         */
        TokenizerPrototype.peek = function () {
            if (this.stack.length === 0) {
                var token = this.next();
                if (token === null) return null;
                this.stack.push(token);
            }
            return this.stack[0];
        };

        /**
         * Skips a specific token and throws if it differs.
         * @param {string} expected Expected token
         * @throws {Error} If the actual token differs
         */
        TokenizerPrototype.skip = function (expected) {
            var actual = this.next();
            if (actual !== expected) throw Error("illegal '" + actual + "', '" + expected + "' expected");
        };

        /**
         * Omits an optional token.
         * @param {string} expected Expected optional token
         * @returns {boolean} `true` if the token exists
         */
        TokenizerPrototype.omit = function (expected) {
            if (this.peek() === expected) {
                this.next();
                return true;
            }
            return false;
        };

        /**
         * Returns a string representation of this object.
         * @return {string} String representation as of "Tokenizer(index/length)"
         * @expose
         */
        TokenizerPrototype.toString = function () {
            return "Tokenizer (" + this.index + "/" + this.source.length + " at line " + this.line + ")";
        };

        /**
         * @alias ProtoBuf.DotProto.Tokenizer
         * @expose
         */
        DotProto.Tokenizer = Tokenizer;

        /**
         * Constructs a new Parser.
         * @exports ProtoBuf.DotProto.Parser
         * @class prototype parser
         * @param {string} source Source
         * @constructor
         */
        var Parser = function Parser(source) {

            /**
             * Tokenizer.
             * @type {!ProtoBuf.DotProto.Tokenizer}
             * @expose
             */
            this.tn = new Tokenizer(source);

            /**
             * Whether parsing proto3 or not.
             * @type {boolean}
             */
            this.proto3 = false;
        };

        /**
         * @alias ProtoBuf.DotProto.Parser.prototype
         * @inner
         */
        var ParserPrototype = Parser.prototype;

        /**
         * Parses the source.
         * @returns {!Object}
         * @throws {Error} If the source cannot be parsed
         * @expose
         */
        ParserPrototype.parse = function () {
            var topLevel = {
                "name": "[ROOT]", // temporary
                "package": null,
                "messages": [],
                "enums": [],
                "imports": [],
                "options": {},
                "services": []
                // "syntax": undefined
            };
            var token,
                head = true,
                weak;
            try {
                while (token = this.tn.next()) {
                    switch (token) {
                        case 'package':
                            if (!head || topLevel["package"] !== null) throw Error("unexpected 'package'");
                            token = this.tn.next();
                            if (!Lang.TYPEREF.test(token)) throw Error("illegal package name: " + token);
                            this.tn.skip(";");
                            topLevel["package"] = token;
                            break;
                        case 'import':
                            if (!head) throw Error("unexpected 'import'");
                            token = this.tn.peek();
                            if (token === "public" || (weak = token === "weak")) // token ignored
                                this.tn.next();
                            token = this._readString();
                            this.tn.skip(";");
                            if (!weak) // import ignored
                                topLevel["imports"].push(token);
                            break;
                        case 'syntax':
                            if (!head) throw Error("unexpected 'syntax'");
                            this.tn.skip("=");
                            if ((topLevel["syntax"] = this._readString()) === "proto3") this.proto3 = true;
                            this.tn.skip(";");
                            break;
                        case 'message':
                            this._parseMessage(topLevel, null);
                            head = false;
                            break;
                        case 'enum':
                            this._parseEnum(topLevel);
                            head = false;
                            break;
                        case 'option':
                            this._parseOption(topLevel);
                            break;
                        case 'service':
                            this._parseService(topLevel);
                            break;
                        case 'extend':
                            this._parseExtend(topLevel);
                            break;
                        default:
                            throw Error("unexpected '" + token + "'");
                    }
                }
            } catch (e) {
                e.message = "Parse error at line " + this.tn.line + ": " + e.message;
                throw e;
            }
            delete topLevel["name"];
            return topLevel;
        };

        /**
         * Parses the specified source.
         * @returns {!Object}
         * @throws {Error} If the source cannot be parsed
         * @expose
         */
        Parser.parse = function (source) {
            return new Parser(source).parse();
        };

        // ----- Conversion ------

        /**
         * Converts a numerical string to an id.
         * @param {string} value
         * @param {boolean=} mayBeNegative
         * @returns {number}
         * @inner
         */
        function mkId(value, mayBeNegative) {
            var id = -1,
                sign = 1;
            if (value.charAt(0) == '-') {
                sign = -1;
                value = value.substring(1);
            }
            if (Lang.NUMBER_DEC.test(value)) id = parseInt(value);else if (Lang.NUMBER_HEX.test(value)) id = parseInt(value.substring(2), 16);else if (Lang.NUMBER_OCT.test(value)) id = parseInt(value.substring(1), 8);else throw Error("illegal id value: " + (sign < 0 ? '-' : '') + value);
            id = sign * id | 0; // Force to 32bit
            if (!mayBeNegative && id < 0) throw Error("illegal id value: " + (sign < 0 ? '-' : '') + value);
            return id;
        }

        /**
         * Converts a numerical string to a number.
         * @param {string} val
         * @returns {number}
         * @inner
         */
        function mkNumber(val) {
            var sign = 1;
            if (val.charAt(0) == '-') {
                sign = -1;
                val = val.substring(1);
            }
            if (Lang.NUMBER_DEC.test(val)) return sign * parseInt(val, 10);else if (Lang.NUMBER_HEX.test(val)) return sign * parseInt(val.substring(2), 16);else if (Lang.NUMBER_OCT.test(val)) return sign * parseInt(val.substring(1), 8);else if (val === 'inf') return sign * Infinity;else if (val === 'nan') return NaN;else if (Lang.NUMBER_FLT.test(val)) return sign * parseFloat(val);
            throw Error("illegal number value: " + (sign < 0 ? '-' : '') + val);
        }

        // ----- Reading ------

        /**
         * Reads a string.
         * @returns {string}
         * @private
         */
        ParserPrototype._readString = function () {
            var value = "",
                token,
                delim;
            do {
                delim = this.tn.next();
                if (delim !== "'" && delim !== '"') throw Error("illegal string delimiter: " + delim);
                value += this.tn.next();
                this.tn.skip(delim);
                token = this.tn.peek();
            } while (token === '"' || token === '"'); // multi line?
            return value;
        };

        /**
         * Reads a value.
         * @param {boolean=} mayBeTypeRef
         * @returns {number|boolean|string}
         * @private
         */
        ParserPrototype._readValue = function (mayBeTypeRef) {
            var token = this.tn.peek(),
                value;
            if (token === '"' || token === "'") return this._readString();
            this.tn.next();
            if (Lang.NUMBER.test(token)) return mkNumber(token);
            if (Lang.BOOL.test(token)) return token.toLowerCase() === 'true';
            if (mayBeTypeRef && Lang.TYPEREF.test(token)) return token;
            throw Error("illegal value: " + token);
        };

        // ----- Parsing constructs -----

        /**
         * Parses a namespace option.
         * @param {!Object} parent Parent definition
         * @param {boolean=} isList
         * @private
         */
        ParserPrototype._parseOption = function (parent, isList) {
            var token = this.tn.next(),
                custom = false;
            if (token === '(') {
                custom = true;
                token = this.tn.next();
            }
            if (!Lang.TYPEREF.test(token))
                // we can allow options of the form google.protobuf.* since they will just get ignored anyways
                // if (!/google\.protobuf\./.test(token)) // FIXME: Why should that not be a valid typeref?
                throw Error("illegal option name: " + token);
            var name = token;
            if (custom) {
                // (my_method_option).foo, (my_method_option), some_method_option, (foo.my_option).bar
                this.tn.skip(')');
                name = '(' + name + ')';
                token = this.tn.peek();
                if (Lang.FQTYPEREF.test(token)) {
                    name += token;
                    this.tn.next();
                }
            }
            this.tn.skip('=');
            this._parseOptionValue(parent, name);
            if (!isList) this.tn.skip(";");
        };

        /**
         * Sets an option on the specified options object.
         * @param {!Object.<string,*>} options
         * @param {string} name
         * @param {string|number|boolean} value
         * @inner
         */
        function setOption(options, name, value) {
            if (typeof options[name] === 'undefined') options[name] = value;else {
                if (!Array.isArray(options[name])) options[name] = [options[name]];
                options[name].push(value);
            }
        }

        /**
         * Parses an option value.
         * @param {!Object} parent
         * @param {string} name
         * @private
         */
        ParserPrototype._parseOptionValue = function (parent, name) {
            var token = this.tn.peek();
            if (token !== '{') {
                // Plain value
                setOption(parent["options"], name, this._readValue(true));
            } else {
                // Aggregate options
                this.tn.skip("{");
                while ((token = this.tn.next()) !== '}') {
                    if (!Lang.NAME.test(token)) throw Error("illegal option name: " + name + "." + token);
                    if (this.tn.omit(":")) setOption(parent["options"], name + "." + token, this._readValue(true));else this._parseOptionValue(parent, name + "." + token);
                }
            }
        };

        /**
         * Parses a service definition.
         * @param {!Object} parent Parent definition
         * @private
         */
        ParserPrototype._parseService = function (parent) {
            var token = this.tn.next();
            if (!Lang.NAME.test(token)) throw Error("illegal service name at line " + this.tn.line + ": " + token);
            var name = token;
            var svc = {
                "name": name,
                "rpc": {},
                "options": {}
            };
            this.tn.skip("{");
            while ((token = this.tn.next()) !== '}') {
                if (token === "option") this._parseOption(svc);else if (token === 'rpc') this._parseServiceRPC(svc);else throw Error("illegal service token: " + token);
            }
            this.tn.omit(";");
            parent["services"].push(svc);
        };

        /**
         * Parses a RPC service definition of the form ['rpc', name, (request), 'returns', (response)].
         * @param {!Object} svc Service definition
         * @private
         */
        ParserPrototype._parseServiceRPC = function (svc) {
            var type = "rpc",
                token = this.tn.next();
            if (!Lang.NAME.test(token)) throw Error("illegal rpc service method name: " + token);
            var name = token;
            var method = {
                "request": null,
                "response": null,
                "request_stream": false,
                "response_stream": false,
                "options": {}
            };
            this.tn.skip("(");
            token = this.tn.next();
            if (token.toLowerCase() === "stream") {
                method["request_stream"] = true;
                token = this.tn.next();
            }
            if (!Lang.TYPEREF.test(token)) throw Error("illegal rpc service request type: " + token);
            method["request"] = token;
            this.tn.skip(")");
            token = this.tn.next();
            if (token.toLowerCase() !== "returns") throw Error("illegal rpc service request type delimiter: " + token);
            this.tn.skip("(");
            token = this.tn.next();
            if (token.toLowerCase() === "stream") {
                method["response_stream"] = true;
                token = this.tn.next();
            }
            method["response"] = token;
            this.tn.skip(")");
            token = this.tn.peek();
            if (token === '{') {
                this.tn.next();
                while ((token = this.tn.next()) !== '}') {
                    if (token === 'option') this._parseOption(method);else throw Error("illegal rpc service token: " + token);
                }
                this.tn.omit(";");
            } else this.tn.skip(";");
            if (typeof svc[type] === 'undefined') svc[type] = {};
            svc[type][name] = method;
        };

        /**
         * Parses a message definition.
         * @param {!Object} parent Parent definition
         * @param {!Object=} fld Field definition if this is a group
         * @returns {!Object}
         * @private
         */
        ParserPrototype._parseMessage = function (parent, fld) {
            var isGroup = !!fld,
                token = this.tn.next();
            var msg = {
                "name": "",
                "fields": [],
                "enums": [],
                "messages": [],
                "options": {},
                "services": [],
                "oneofs": {}
                // "extensions": undefined
            };
            if (!Lang.NAME.test(token)) throw Error("illegal " + (isGroup ? "group" : "message") + " name: " + token);
            msg["name"] = token;
            if (isGroup) {
                this.tn.skip("=");
                fld["id"] = mkId(this.tn.next());
                msg["isGroup"] = true;
            }
            token = this.tn.peek();
            if (token === '[' && fld) this._parseFieldOptions(fld);
            this.tn.skip("{");
            while ((token = this.tn.next()) !== '}') {
                if (Lang.RULE.test(token)) this._parseMessageField(msg, token);else if (token === "oneof") this._parseMessageOneOf(msg);else if (token === "enum") this._parseEnum(msg);else if (token === "message") this._parseMessage(msg);else if (token === "option") this._parseOption(msg);else if (token === "service") this._parseService(msg);else if (token === "extensions") {
                    if (msg.hasOwnProperty("extensions")) {
                        msg["extensions"] = msg["extensions"].concat(this._parseExtensionRanges());
                    } else {
                        msg["extensions"] = this._parseExtensionRanges();
                    }
                } else if (token === "reserved") this._parseIgnored(); // TODO
                else if (token === "extend") this._parseExtend(msg);else if (Lang.TYPEREF.test(token)) {
                        if (!this.proto3) throw Error("illegal field rule: " + token);
                        this._parseMessageField(msg, "optional", token);
                    } else throw Error("illegal message token: " + token);
            }
            this.tn.omit(";");
            parent["messages"].push(msg);
            return msg;
        };

        /**
         * Parses an ignored statement.
         * @private
         */
        ParserPrototype._parseIgnored = function () {
            while (this.tn.peek() !== ';') {
                this.tn.next();
            }this.tn.skip(";");
        };

        /**
         * Parses a message field.
         * @param {!Object} msg Message definition
         * @param {string} rule Field rule
         * @param {string=} type Field type if already known (never known for maps)
         * @returns {!Object} Field descriptor
         * @private
         */
        ParserPrototype._parseMessageField = function (msg, rule, type) {
            if (!Lang.RULE.test(rule)) throw Error("illegal message field rule: " + rule);
            var fld = {
                "rule": rule,
                "type": "",
                "name": "",
                "options": {},
                "id": 0
            };
            var token;
            if (rule === "map") {

                if (type) throw Error("illegal type: " + type);
                this.tn.skip('<');
                token = this.tn.next();
                if (!Lang.TYPE.test(token) && !Lang.TYPEREF.test(token)) throw Error("illegal message field type: " + token);
                fld["keytype"] = token;
                this.tn.skip(',');
                token = this.tn.next();
                if (!Lang.TYPE.test(token) && !Lang.TYPEREF.test(token)) throw Error("illegal message field: " + token);
                fld["type"] = token;
                this.tn.skip('>');
                token = this.tn.next();
                if (!Lang.NAME.test(token)) throw Error("illegal message field name: " + token);
                fld["name"] = token;
                this.tn.skip("=");
                fld["id"] = mkId(this.tn.next());
                token = this.tn.peek();
                if (token === '[') this._parseFieldOptions(fld);
                this.tn.skip(";");
            } else {

                type = typeof type !== 'undefined' ? type : this.tn.next();

                if (type === "group") {

                    // "A [legacy] group simply combines a nested message type and a field into a single declaration. In your
                    // code, you can treat this message just as if it had a Result type field called result (the latter name is
                    // converted to lower-case so that it does not conflict with the former)."
                    var grp = this._parseMessage(msg, fld);
                    if (!/^[A-Z]/.test(grp["name"])) throw Error('illegal group name: ' + grp["name"]);
                    fld["type"] = grp["name"];
                    fld["name"] = grp["name"].toLowerCase();
                    this.tn.omit(";");
                } else {

                    if (!Lang.TYPE.test(type) && !Lang.TYPEREF.test(type)) throw Error("illegal message field type: " + type);
                    fld["type"] = type;
                    token = this.tn.next();
                    if (!Lang.NAME.test(token)) throw Error("illegal message field name: " + token);
                    fld["name"] = token;
                    this.tn.skip("=");
                    fld["id"] = mkId(this.tn.next());
                    token = this.tn.peek();
                    if (token === "[") this._parseFieldOptions(fld);
                    this.tn.skip(";");
                }
            }
            msg["fields"].push(fld);
            return fld;
        };

        /**
         * Parses a message oneof.
         * @param {!Object} msg Message definition
         * @private
         */
        ParserPrototype._parseMessageOneOf = function (msg) {
            var token = this.tn.next();
            if (!Lang.NAME.test(token)) throw Error("illegal oneof name: " + token);
            var name = token,
                fld;
            var fields = [];
            this.tn.skip("{");
            while ((token = this.tn.next()) !== "}") {
                fld = this._parseMessageField(msg, "optional", token);
                fld["oneof"] = name;
                fields.push(fld["id"]);
            }
            this.tn.omit(";");
            msg["oneofs"][name] = fields;
        };

        /**
         * Parses a set of field option definitions.
         * @param {!Object} fld Field definition
         * @private
         */
        ParserPrototype._parseFieldOptions = function (fld) {
            this.tn.skip("[");
            var token,
                first = true;
            while ((token = this.tn.peek()) !== ']') {
                if (!first) this.tn.skip(",");
                this._parseOption(fld, true);
                first = false;
            }
            this.tn.next();
        };

        /**
         * Parses an enum.
         * @param {!Object} msg Message definition
         * @private
         */
        ParserPrototype._parseEnum = function (msg) {
            var enm = {
                "name": "",
                "values": [],
                "options": {}
            };
            var token = this.tn.next();
            if (!Lang.NAME.test(token)) throw Error("illegal name: " + token);
            enm["name"] = token;
            this.tn.skip("{");
            while ((token = this.tn.next()) !== '}') {
                if (token === "option") this._parseOption(enm);else {
                    if (!Lang.NAME.test(token)) throw Error("illegal name: " + token);
                    this.tn.skip("=");
                    var val = {
                        "name": token,
                        "id": mkId(this.tn.next(), true)
                    };
                    token = this.tn.peek();
                    if (token === "[") this._parseFieldOptions({ "options": {} });
                    this.tn.skip(";");
                    enm["values"].push(val);
                }
            }
            this.tn.omit(";");
            msg["enums"].push(enm);
        };

        /**
         * Parses extension / reserved ranges.
         * @returns {!Array.<!Array.<number>>}
         * @private
         */
        ParserPrototype._parseExtensionRanges = function () {
            var ranges = [];
            var token, range, value;
            do {
                range = [];
                while (true) {
                    token = this.tn.next();
                    switch (token) {
                        case "min":
                            value = ProtoBuf.ID_MIN;
                            break;
                        case "max":
                            value = ProtoBuf.ID_MAX;
                            break;
                        default:
                            value = mkNumber(token);
                            break;
                    }
                    range.push(value);
                    if (range.length === 2) break;
                    if (this.tn.peek() !== "to") {
                        range.push(value);
                        break;
                    }
                    this.tn.next();
                }
                ranges.push(range);
            } while (this.tn.omit(","));
            this.tn.skip(";");
            return ranges;
        };

        /**
         * Parses an extend block.
         * @param {!Object} parent Parent object
         * @private
         */
        ParserPrototype._parseExtend = function (parent) {
            var token = this.tn.next();
            if (!Lang.TYPEREF.test(token)) throw Error("illegal extend reference: " + token);
            var ext = {
                "ref": token,
                "fields": []
            };
            this.tn.skip("{");
            while ((token = this.tn.next()) !== '}') {
                if (Lang.RULE.test(token)) this._parseMessageField(ext, token);else if (Lang.TYPEREF.test(token)) {
                    if (!this.proto3) throw Error("illegal field rule: " + token);
                    this._parseMessageField(ext, "optional", token);
                } else throw Error("illegal extend token: " + token);
            }
            this.tn.omit(";");
            parent["messages"].push(ext);
            return ext;
        };

        // ----- General -----

        /**
         * Returns a string representation of this parser.
         * @returns {string}
         */
        ParserPrototype.toString = function () {
            return "Parser at line " + this.tn.line;
        };

        /**
         * @alias ProtoBuf.DotProto.Parser
         * @expose
         */
        DotProto.Parser = Parser;

        return DotProto;
    }(ProtoBuf, ProtoBuf.Lang);

    /**
     * @alias ProtoBuf.Reflect
     * @expose
     */
    ProtoBuf.Reflect = function (ProtoBuf) {
        "use strict";

        /**
         * Reflection types.
         * @exports ProtoBuf.Reflect
         * @namespace
         */

        var Reflect = {};

        /**
         * Constructs a Reflect base class.
         * @exports ProtoBuf.Reflect.T
         * @constructor
         * @abstract
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {?ProtoBuf.Reflect.T} parent Parent object
         * @param {string} name Object name
         */
        var T = function T(builder, parent, name) {

            /**
             * Builder reference.
             * @type {!ProtoBuf.Builder}
             * @expose
             */
            this.builder = builder;

            /**
             * Parent object.
             * @type {?ProtoBuf.Reflect.T}
             * @expose
             */
            this.parent = parent;

            /**
             * Object name in namespace.
             * @type {string}
             * @expose
             */
            this.name = name;

            /**
             * Fully qualified class name
             * @type {string}
             * @expose
             */
            this.className;
        };

        /**
         * @alias ProtoBuf.Reflect.T.prototype
         * @inner
         */
        var TPrototype = T.prototype;

        /**
         * Returns the fully qualified name of this object.
         * @returns {string} Fully qualified name as of ".PATH.TO.THIS"
         * @expose
         */
        TPrototype.fqn = function () {
            var name = this.name,
                ptr = this;
            do {
                ptr = ptr.parent;
                if (ptr == null) break;
                name = ptr.name + "." + name;
            } while (true);
            return name;
        };

        /**
         * Returns a string representation of this Reflect object (its fully qualified name).
         * @param {boolean=} includeClass Set to true to include the class name. Defaults to false.
         * @return String representation
         * @expose
         */
        TPrototype.toString = function (includeClass) {
            return (includeClass ? this.className + " " : "") + this.fqn();
        };

        /**
         * Builds this type.
         * @throws {Error} If this type cannot be built directly
         * @expose
         */
        TPrototype.build = function () {
            throw Error(this.toString(true) + " cannot be built directly");
        };

        /**
         * @alias ProtoBuf.Reflect.T
         * @expose
         */
        Reflect.T = T;

        /**
         * Constructs a new Namespace.
         * @exports ProtoBuf.Reflect.Namespace
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {?ProtoBuf.Reflect.Namespace} parent Namespace parent
         * @param {string} name Namespace name
         * @param {Object.<string,*>=} options Namespace options
         * @param {string?} syntax The syntax level of this definition (e.g., proto3)
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var Namespace = function Namespace(builder, parent, name, options, syntax) {
            T.call(this, builder, parent, name);

            /**
             * @override
             */
            this.className = "Namespace";

            /**
             * Children inside the namespace.
             * @type {!Array.<ProtoBuf.Reflect.T>}
             */
            this.children = [];

            /**
             * Options.
             * @type {!Object.<string, *>}
             */
            this.options = options || {};

            /**
             * Syntax level (e.g., proto2 or proto3).
             * @type {!string}
             */
            this.syntax = syntax || "proto2";
        };

        /**
         * @alias ProtoBuf.Reflect.Namespace.prototype
         * @inner
         */
        var NamespacePrototype = Namespace.prototype = Object.create(T.prototype);

        /**
         * Returns an array of the namespace's children.
         * @param {ProtoBuf.Reflect.T=} type Filter type (returns instances of this type only). Defaults to null (all children).
         * @return {Array.<ProtoBuf.Reflect.T>}
         * @expose
         */
        NamespacePrototype.getChildren = function (type) {
            type = type || null;
            if (type == null) return this.children.slice();
            var children = [];
            for (var i = 0, k = this.children.length; i < k; ++i) {
                if (this.children[i] instanceof type) children.push(this.children[i]);
            }return children;
        };

        /**
         * Adds a child to the namespace.
         * @param {ProtoBuf.Reflect.T} child Child
         * @throws {Error} If the child cannot be added (duplicate)
         * @expose
         */
        NamespacePrototype.addChild = function (child) {
            var other;
            if (other = this.getChild(child.name)) {
                // Try to revert camelcase transformation on collision
                if (other instanceof Message.Field && other.name !== other.originalName && this.getChild(other.originalName) === null) other.name = other.originalName; // Revert previous first (effectively keeps both originals)
                else if (child instanceof Message.Field && child.name !== child.originalName && this.getChild(child.originalName) === null) child.name = child.originalName;else throw Error("Duplicate name in namespace " + this.toString(true) + ": " + child.name);
            }
            this.children.push(child);
        };

        /**
         * Gets a child by its name or id.
         * @param {string|number} nameOrId Child name or id
         * @return {?ProtoBuf.Reflect.T} The child or null if not found
         * @expose
         */
        NamespacePrototype.getChild = function (nameOrId) {
            var key = typeof nameOrId === 'number' ? 'id' : 'name';
            for (var i = 0, k = this.children.length; i < k; ++i) {
                if (this.children[i][key] === nameOrId) return this.children[i];
            }return null;
        };

        /**
         * Resolves a reflect object inside of this namespace.
         * @param {string|!Array.<string>} qn Qualified name to resolve
         * @param {boolean=} excludeNonNamespace Excludes non-namespace types, defaults to `false`
         * @return {?ProtoBuf.Reflect.Namespace} The resolved type or null if not found
         * @expose
         */
        NamespacePrototype.resolve = function (qn, excludeNonNamespace) {
            var part = typeof qn === 'string' ? qn.split(".") : qn,
                ptr = this,
                i = 0;
            if (part[i] === "") {
                // Fully qualified name, e.g. ".My.Message'
                while (ptr.parent !== null) {
                    ptr = ptr.parent;
                }i++;
            }
            var child;
            do {
                do {
                    if (!(ptr instanceof Reflect.Namespace)) {
                        ptr = null;
                        break;
                    }
                    child = ptr.getChild(part[i]);
                    if (!child || !(child instanceof Reflect.T) || excludeNonNamespace && !(child instanceof Reflect.Namespace)) {
                        ptr = null;
                        break;
                    }
                    ptr = child;i++;
                } while (i < part.length);
                if (ptr != null) break; // Found
                // Else search the parent
                if (this.parent !== null) return this.parent.resolve(qn, excludeNonNamespace);
            } while (ptr != null);
            return ptr;
        };

        /**
         * Determines the shortest qualified name of the specified type, if any, relative to this namespace.
         * @param {!ProtoBuf.Reflect.T} t Reflection type
         * @returns {string} The shortest qualified name or, if there is none, the fqn
         * @expose
         */
        NamespacePrototype.qn = function (t) {
            var part = [],
                ptr = t;
            do {
                part.unshift(ptr.name);
                ptr = ptr.parent;
            } while (ptr !== null);
            for (var len = 1; len <= part.length; len++) {
                var qn = part.slice(part.length - len);
                if (t === this.resolve(qn, t instanceof Reflect.Namespace)) return qn.join(".");
            }
            return t.fqn();
        };

        /**
         * Builds the namespace and returns the runtime counterpart.
         * @return {Object.<string,Function|Object>} Runtime namespace
         * @expose
         */
        NamespacePrototype.build = function () {
            /** @dict */
            var ns = {};
            var children = this.children;
            for (var i = 0, k = children.length, child; i < k; ++i) {
                child = children[i];
                if (child instanceof Namespace) ns[child.name] = child.build();
            }
            if (Object.defineProperty) Object.defineProperty(ns, "$options", { "value": this.buildOpt() });
            return ns;
        };

        /**
         * Builds the namespace's '$options' property.
         * @return {Object.<string,*>}
         */
        NamespacePrototype.buildOpt = function () {
            var opt = {},
                keys = Object.keys(this.options);
            for (var i = 0, k = keys.length; i < k; ++i) {
                var key = keys[i],
                    val = this.options[keys[i]];
                // TODO: Options are not resolved, yet.
                // if (val instanceof Namespace) {
                //     opt[key] = val.build();
                // } else {
                opt[key] = val;
                // }
            }
            return opt;
        };

        /**
         * Gets the value assigned to the option with the specified name.
         * @param {string=} name Returns the option value if specified, otherwise all options are returned.
         * @return {*|Object.<string,*>}null} Option value or NULL if there is no such option
         */
        NamespacePrototype.getOption = function (name) {
            if (typeof name === 'undefined') return this.options;
            return typeof this.options[name] !== 'undefined' ? this.options[name] : null;
        };

        /**
         * @alias ProtoBuf.Reflect.Namespace
         * @expose
         */
        Reflect.Namespace = Namespace;

        /**
         * Constructs a new Element implementation that checks and converts values for a
         * particular field type, as appropriate.
         *
         * An Element represents a single value: either the value of a singular field,
         * or a value contained in one entry of a repeated field or map field. This
         * class does not implement these higher-level concepts; it only encapsulates
         * the low-level typechecking and conversion.
         *
         * @exports ProtoBuf.Reflect.Element
         * @param {{name: string, wireType: number}} type Resolved data type
         * @param {ProtoBuf.Reflect.T|null} resolvedType Resolved type, if relevant
         * (e.g. submessage field).
         * @param {boolean} isMapKey Is this element a Map key? The value will be
         * converted to string form if so.
         * @param {string} syntax Syntax level of defining message type, e.g.,
         * proto2 or proto3.
         * @param {string} name Name of the field containing this element (for error
         * messages)
         * @constructor
         */
        var Element = function Element(type, resolvedType, isMapKey, syntax, name) {

            /**
             * Element type, as a string (e.g., int32).
             * @type {{name: string, wireType: number}}
             */
            this.type = type;

            /**
             * Element type reference to submessage or enum definition, if needed.
             * @type {ProtoBuf.Reflect.T|null}
             */
            this.resolvedType = resolvedType;

            /**
             * Element is a map key.
             * @type {boolean}
             */
            this.isMapKey = isMapKey;

            /**
             * Syntax level of defining message type, e.g., proto2 or proto3.
             * @type {string}
             */
            this.syntax = syntax;

            /**
             * Name of the field containing this element (for error messages)
             * @type {string}
             */
            this.name = name;

            if (isMapKey && ProtoBuf.MAP_KEY_TYPES.indexOf(type) < 0) throw Error("Invalid map key type: " + type.name);
        };

        var ElementPrototype = Element.prototype;

        /**
         * Obtains a (new) default value for the specified type.
         * @param type {string|{name: string, wireType: number}} Field type
         * @returns {*} Default value
         * @inner
         */
        function mkDefault(type) {
            if (typeof type === 'string') type = ProtoBuf.TYPES[type];
            if (typeof type.defaultValue === 'undefined') throw Error("default value for type " + type.name + " is not supported");
            if (type == ProtoBuf.TYPES["bytes"]) return new ByteBuffer(0);
            return type.defaultValue;
        }

        /**
         * Returns the default value for this field in proto3.
         * @function
         * @param type {string|{name: string, wireType: number}} the field type
         * @returns {*} Default value
         */
        Element.defaultFieldValue = mkDefault;

        /**
         * Makes a Long from a value.
         * @param {{low: number, high: number, unsigned: boolean}|string|number} value Value
         * @param {boolean=} unsigned Whether unsigned or not, defaults to reuse it from Long-like objects or to signed for
         *  strings and numbers
         * @returns {!Long}
         * @throws {Error} If the value cannot be converted to a Long
         * @inner
         */
        function mkLong(value, unsigned) {
            if (value && typeof value.low === 'number' && typeof value.high === 'number' && typeof value.unsigned === 'boolean' && value.low === value.low && value.high === value.high) return new ProtoBuf.Long(value.low, value.high, typeof unsigned === 'undefined' ? value.unsigned : unsigned);
            if (typeof value === 'string') return ProtoBuf.Long.fromString(value, unsigned || false, 10);
            if (typeof value === 'number') return ProtoBuf.Long.fromNumber(value, unsigned || false);
            throw Error("not convertible to Long");
        }

        ElementPrototype.toString = function () {
            return (this.name || '') + (this.isMapKey ? 'map' : 'value') + ' element';
        };

        /**
         * Checks if the given value can be set for an element of this type (singular
         * field or one element of a repeated field or map).
         * @param {*} value Value to check
         * @return {*} Verified, maybe adjusted, value
         * @throws {Error} If the value cannot be verified for this element slot
         * @expose
         */
        ElementPrototype.verifyValue = function (value) {
            var self = this;
            function fail(val, msg) {
                throw Error("Illegal value for " + self.toString(true) + " of type " + self.type.name + ": " + val + " (" + msg + ")");
            }
            switch (this.type) {
                // Signed 32bit
                case ProtoBuf.TYPES["int32"]:
                case ProtoBuf.TYPES["sint32"]:
                case ProtoBuf.TYPES["sfixed32"]:
                    // Account for !NaN: value === value
                    if (typeof value !== 'number' || value === value && value % 1 !== 0) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not an integer");
                    return value > 4294967295 ? value | 0 : value;

                // Unsigned 32bit
                case ProtoBuf.TYPES["uint32"]:
                case ProtoBuf.TYPES["fixed32"]:
                    if (typeof value !== 'number' || value === value && value % 1 !== 0) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not an integer");
                    return value < 0 ? value >>> 0 : value;

                // Signed 64bit
                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["sint64"]:
                case ProtoBuf.TYPES["sfixed64"]:
                    {
                        if (ProtoBuf.Long) try {
                            return mkLong(value, false);
                        } catch (e) {
                            fail(typeof value === "undefined" ? "undefined" : _typeof(value), e.message);
                        } else fail(typeof value === "undefined" ? "undefined" : _typeof(value), "requires Long.js");
                    }

                // Unsigned 64bit
                case ProtoBuf.TYPES["uint64"]:
                case ProtoBuf.TYPES["fixed64"]:
                    {
                        if (ProtoBuf.Long) try {
                            return mkLong(value, true);
                        } catch (e) {
                            fail(typeof value === "undefined" ? "undefined" : _typeof(value), e.message);
                        } else fail(typeof value === "undefined" ? "undefined" : _typeof(value), "requires Long.js");
                    }

                // Bool
                case ProtoBuf.TYPES["bool"]:
                    if (typeof value !== 'boolean') fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not a boolean");
                    return value;

                // Float
                case ProtoBuf.TYPES["float"]:
                case ProtoBuf.TYPES["double"]:
                    if (typeof value !== 'number') fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not a number");
                    return value;

                // Length-delimited string
                case ProtoBuf.TYPES["string"]:
                    if (typeof value !== 'string' && !(value && value instanceof String)) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not a string");
                    return "" + value; // Convert String object to string

                // Length-delimited bytes
                case ProtoBuf.TYPES["bytes"]:
                    if (ByteBuffer.isByteBuffer(value)) return value;
                    return ByteBuffer.wrap(value, "base64");

                // Constant enum value
                case ProtoBuf.TYPES["enum"]:
                    {
                        var values = this.resolvedType.getChildren(ProtoBuf.Reflect.Enum.Value);
                        for (i = 0; i < values.length; i++) {
                            if (values[i].name == value) return values[i].id;else if (values[i].id == value) return values[i].id;
                        }if (this.syntax === 'proto3') {
                            // proto3: just make sure it's an integer.
                            if (typeof value !== 'number' || value === value && value % 1 !== 0) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not an integer");
                            if (value > 4294967295 || value < 0) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "not in range for uint32");
                            return value;
                        } else {
                            // proto2 requires enum values to be valid.
                            fail(value, "not a valid enum value");
                        }
                    }
                // Embedded message
                case ProtoBuf.TYPES["group"]:
                case ProtoBuf.TYPES["message"]:
                    {
                        if (!value || (typeof value === "undefined" ? "undefined" : _typeof(value)) !== 'object') fail(typeof value === "undefined" ? "undefined" : _typeof(value), "object expected");
                        if (value instanceof this.resolvedType.clazz) return value;
                        if (value instanceof ProtoBuf.Builder.Message) {
                            // Mismatched type: Convert to object (see: https://github.com/dcodeIO/ProtoBuf.js/issues/180)
                            var obj = {};
                            for (var i in value) {
                                if (value.hasOwnProperty(i)) obj[i] = value[i];
                            }value = obj;
                        }
                        // Else let's try to construct one from a key-value object
                        return new this.resolvedType.clazz(value); // May throw for a hundred of reasons
                    }
            }

            // We should never end here
            throw Error("[INTERNAL] Illegal value for " + this.toString(true) + ": " + value + " (undefined type " + this.type + ")");
        };

        /**
         * Calculates the byte length of an element on the wire.
         * @param {number} id Field number
         * @param {*} value Field value
         * @returns {number} Byte length
         * @throws {Error} If the value cannot be calculated
         * @expose
         */
        ElementPrototype.calculateLength = function (id, value) {
            if (value === null) return 0; // Nothing to encode
            // Tag has already been written
            var n;
            switch (this.type) {
                case ProtoBuf.TYPES["int32"]:
                    return value < 0 ? ByteBuffer.calculateVarint64(value) : ByteBuffer.calculateVarint32(value);
                case ProtoBuf.TYPES["uint32"]:
                    return ByteBuffer.calculateVarint32(value);
                case ProtoBuf.TYPES["sint32"]:
                    return ByteBuffer.calculateVarint32(ByteBuffer.zigZagEncode32(value));
                case ProtoBuf.TYPES["fixed32"]:
                case ProtoBuf.TYPES["sfixed32"]:
                case ProtoBuf.TYPES["float"]:
                    return 4;
                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["uint64"]:
                    return ByteBuffer.calculateVarint64(value);
                case ProtoBuf.TYPES["sint64"]:
                    return ByteBuffer.calculateVarint64(ByteBuffer.zigZagEncode64(value));
                case ProtoBuf.TYPES["fixed64"]:
                case ProtoBuf.TYPES["sfixed64"]:
                    return 8;
                case ProtoBuf.TYPES["bool"]:
                    return 1;
                case ProtoBuf.TYPES["enum"]:
                    return ByteBuffer.calculateVarint32(value);
                case ProtoBuf.TYPES["double"]:
                    return 8;
                case ProtoBuf.TYPES["string"]:
                    n = ByteBuffer.calculateUTF8Bytes(value);
                    return ByteBuffer.calculateVarint32(n) + n;
                case ProtoBuf.TYPES["bytes"]:
                    if (value.remaining() < 0) throw Error("Illegal value for " + this.toString(true) + ": " + value.remaining() + " bytes remaining");
                    return ByteBuffer.calculateVarint32(value.remaining()) + value.remaining();
                case ProtoBuf.TYPES["message"]:
                    n = this.resolvedType.calculate(value);
                    return ByteBuffer.calculateVarint32(n) + n;
                case ProtoBuf.TYPES["group"]:
                    n = this.resolvedType.calculate(value);
                    return n + ByteBuffer.calculateVarint32(id << 3 | ProtoBuf.WIRE_TYPES.ENDGROUP);
            }
            // We should never end here
            throw Error("[INTERNAL] Illegal value to encode in " + this.toString(true) + ": " + value + " (unknown type)");
        };

        /**
         * Encodes a value to the specified buffer. Does not encode the key.
         * @param {number} id Field number
         * @param {*} value Field value
         * @param {ByteBuffer} buffer ByteBuffer to encode to
         * @return {ByteBuffer} The ByteBuffer for chaining
         * @throws {Error} If the value cannot be encoded
         * @expose
         */
        ElementPrototype.encodeValue = function (id, value, buffer) {
            if (value === null) return buffer; // Nothing to encode
            // Tag has already been written

            switch (this.type) {
                // 32bit signed varint
                case ProtoBuf.TYPES["int32"]:
                    // "If you use int32 or int64 as the type for a negative number, the resulting varint is always ten bytes
                    // long – it is, effectively, treated like a very large unsigned integer." (see #122)
                    if (value < 0) buffer.writeVarint64(value);else buffer.writeVarint32(value);
                    break;

                // 32bit unsigned varint
                case ProtoBuf.TYPES["uint32"]:
                    buffer.writeVarint32(value);
                    break;

                // 32bit varint zig-zag
                case ProtoBuf.TYPES["sint32"]:
                    buffer.writeVarint32ZigZag(value);
                    break;

                // Fixed unsigned 32bit
                case ProtoBuf.TYPES["fixed32"]:
                    buffer.writeUint32(value);
                    break;

                // Fixed signed 32bit
                case ProtoBuf.TYPES["sfixed32"]:
                    buffer.writeInt32(value);
                    break;

                // 64bit varint as-is
                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["uint64"]:
                    buffer.writeVarint64(value); // throws
                    break;

                // 64bit varint zig-zag
                case ProtoBuf.TYPES["sint64"]:
                    buffer.writeVarint64ZigZag(value); // throws
                    break;

                // Fixed unsigned 64bit
                case ProtoBuf.TYPES["fixed64"]:
                    buffer.writeUint64(value); // throws
                    break;

                // Fixed signed 64bit
                case ProtoBuf.TYPES["sfixed64"]:
                    buffer.writeInt64(value); // throws
                    break;

                // Bool
                case ProtoBuf.TYPES["bool"]:
                    if (typeof value === 'string') buffer.writeVarint32(value.toLowerCase() === 'false' ? 0 : !!value);else buffer.writeVarint32(value ? 1 : 0);
                    break;

                // Constant enum value
                case ProtoBuf.TYPES["enum"]:
                    buffer.writeVarint32(value);
                    break;

                // 32bit float
                case ProtoBuf.TYPES["float"]:
                    buffer.writeFloat32(value);
                    break;

                // 64bit float
                case ProtoBuf.TYPES["double"]:
                    buffer.writeFloat64(value);
                    break;

                // Length-delimited string
                case ProtoBuf.TYPES["string"]:
                    buffer.writeVString(value);
                    break;

                // Length-delimited bytes
                case ProtoBuf.TYPES["bytes"]:
                    if (value.remaining() < 0) throw Error("Illegal value for " + this.toString(true) + ": " + value.remaining() + " bytes remaining");
                    var prevOffset = value.offset;
                    buffer.writeVarint32(value.remaining());
                    buffer.append(value);
                    value.offset = prevOffset;
                    break;

                // Embedded message
                case ProtoBuf.TYPES["message"]:
                    var bb = new ByteBuffer().LE();
                    this.resolvedType.encode(value, bb);
                    buffer.writeVarint32(bb.offset);
                    buffer.append(bb.flip());
                    break;

                // Legacy group
                case ProtoBuf.TYPES["group"]:
                    this.resolvedType.encode(value, buffer);
                    buffer.writeVarint32(id << 3 | ProtoBuf.WIRE_TYPES.ENDGROUP);
                    break;

                default:
                    // We should never end here
                    throw Error("[INTERNAL] Illegal value to encode in " + this.toString(true) + ": " + value + " (unknown type)");
            }
            return buffer;
        };

        /**
         * Decode one element value from the specified buffer.
         * @param {ByteBuffer} buffer ByteBuffer to decode from
         * @param {number} wireType The field wire type
         * @param {number} id The field number
         * @return {*} Decoded value
         * @throws {Error} If the field cannot be decoded
         * @expose
         */
        ElementPrototype.decode = function (buffer, wireType, id) {
            if (wireType != this.type.wireType) throw Error("Unexpected wire type for element");

            var value, nBytes;
            switch (this.type) {
                // 32bit signed varint
                case ProtoBuf.TYPES["int32"]:
                    return buffer.readVarint32() | 0;

                // 32bit unsigned varint
                case ProtoBuf.TYPES["uint32"]:
                    return buffer.readVarint32() >>> 0;

                // 32bit signed varint zig-zag
                case ProtoBuf.TYPES["sint32"]:
                    return buffer.readVarint32ZigZag() | 0;

                // Fixed 32bit unsigned
                case ProtoBuf.TYPES["fixed32"]:
                    return buffer.readUint32() >>> 0;

                case ProtoBuf.TYPES["sfixed32"]:
                    return buffer.readInt32() | 0;

                // 64bit signed varint
                case ProtoBuf.TYPES["int64"]:
                    return buffer.readVarint64();

                // 64bit unsigned varint
                case ProtoBuf.TYPES["uint64"]:
                    return buffer.readVarint64().toUnsigned();

                // 64bit signed varint zig-zag
                case ProtoBuf.TYPES["sint64"]:
                    return buffer.readVarint64ZigZag();

                // Fixed 64bit unsigned
                case ProtoBuf.TYPES["fixed64"]:
                    return buffer.readUint64();

                // Fixed 64bit signed
                case ProtoBuf.TYPES["sfixed64"]:
                    return buffer.readInt64();

                // Bool varint
                case ProtoBuf.TYPES["bool"]:
                    return !!buffer.readVarint32();

                // Constant enum value (varint)
                case ProtoBuf.TYPES["enum"]:
                    // The following Builder.Message#set will already throw
                    return buffer.readVarint32();

                // 32bit float
                case ProtoBuf.TYPES["float"]:
                    return buffer.readFloat();

                // 64bit float
                case ProtoBuf.TYPES["double"]:
                    return buffer.readDouble();

                // Length-delimited string
                case ProtoBuf.TYPES["string"]:
                    return buffer.readVString();

                // Length-delimited bytes
                case ProtoBuf.TYPES["bytes"]:
                    {
                        nBytes = buffer.readVarint32();
                        if (buffer.remaining() < nBytes) throw Error("Illegal number of bytes for " + this.toString(true) + ": " + nBytes + " required but got only " + buffer.remaining());
                        value = buffer.clone(); // Offset already set
                        value.limit = value.offset + nBytes;
                        buffer.offset += nBytes;
                        return value;
                    }

                // Length-delimited embedded message
                case ProtoBuf.TYPES["message"]:
                    {
                        nBytes = buffer.readVarint32();
                        return this.resolvedType.decode(buffer, nBytes);
                    }

                // Legacy group
                case ProtoBuf.TYPES["group"]:
                    return this.resolvedType.decode(buffer, -1, id);
            }

            // We should never end here
            throw Error("[INTERNAL] Illegal decode type");
        };

        /**
         * Converts a value from a string to the canonical element type.
         *
         * Legal only when isMapKey is true.
         *
         * @param {string} str The string value
         * @returns {*} The value
         */
        ElementPrototype.valueFromString = function (str) {
            if (!this.isMapKey) {
                throw Error("valueFromString() called on non-map-key element");
            }

            switch (this.type) {
                case ProtoBuf.TYPES["int32"]:
                case ProtoBuf.TYPES["sint32"]:
                case ProtoBuf.TYPES["sfixed32"]:
                case ProtoBuf.TYPES["uint32"]:
                case ProtoBuf.TYPES["fixed32"]:
                    return this.verifyValue(parseInt(str));

                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["sint64"]:
                case ProtoBuf.TYPES["sfixed64"]:
                case ProtoBuf.TYPES["uint64"]:
                case ProtoBuf.TYPES["fixed64"]:
                    // Long-based fields support conversions from string already.
                    return this.verifyValue(str);

                case ProtoBuf.TYPES["bool"]:
                    return str === "true";

                case ProtoBuf.TYPES["string"]:
                    return this.verifyValue(str);

                case ProtoBuf.TYPES["bytes"]:
                    return ByteBuffer.fromBinary(str);
            }
        };

        /**
         * Converts a value from the canonical element type to a string.
         *
         * It should be the case that `valueFromString(valueToString(val))` returns
         * a value equivalent to `verifyValue(val)` for every legal value of `val`
         * according to this element type.
         *
         * This may be used when the element must be stored or used as a string,
         * e.g., as a map key on an Object.
         *
         * Legal only when isMapKey is true.
         *
         * @param {*} val The value
         * @returns {string} The string form of the value.
         */
        ElementPrototype.valueToString = function (value) {
            if (!this.isMapKey) {
                throw Error("valueToString() called on non-map-key element");
            }

            if (this.type === ProtoBuf.TYPES["bytes"]) {
                return value.toString("binary");
            } else {
                return value.toString();
            }
        };

        /**
         * @alias ProtoBuf.Reflect.Element
         * @expose
         */
        Reflect.Element = Element;

        /**
         * Constructs a new Message.
         * @exports ProtoBuf.Reflect.Message
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Namespace} parent Parent message or namespace
         * @param {string} name Message name
         * @param {Object.<string,*>=} options Message options
         * @param {boolean=} isGroup `true` if this is a legacy group
         * @param {string?} syntax The syntax level of this definition (e.g., proto3)
         * @constructor
         * @extends ProtoBuf.Reflect.Namespace
         */
        var Message = function Message(builder, parent, name, options, isGroup, syntax) {
            Namespace.call(this, builder, parent, name, options, syntax);

            /**
             * @override
             */
            this.className = "Message";

            /**
             * Extensions range.
             * @type {!Array.<number>|undefined}
             * @expose
             */
            this.extensions = undefined;

            /**
             * Runtime message class.
             * @type {?function(new:ProtoBuf.Builder.Message)}
             * @expose
             */
            this.clazz = null;

            /**
             * Whether this is a legacy group or not.
             * @type {boolean}
             * @expose
             */
            this.isGroup = !!isGroup;

            // The following cached collections are used to efficiently iterate over or look up fields when decoding.

            /**
             * Cached fields.
             * @type {?Array.<!ProtoBuf.Reflect.Message.Field>}
             * @private
             */
            this._fields = null;

            /**
             * Cached fields by id.
             * @type {?Object.<number,!ProtoBuf.Reflect.Message.Field>}
             * @private
             */
            this._fieldsById = null;

            /**
             * Cached fields by name.
             * @type {?Object.<string,!ProtoBuf.Reflect.Message.Field>}
             * @private
             */
            this._fieldsByName = null;
        };

        /**
         * @alias ProtoBuf.Reflect.Message.prototype
         * @inner
         */
        var MessagePrototype = Message.prototype = Object.create(Namespace.prototype);

        /**
         * Builds the message and returns the runtime counterpart, which is a fully functional class.
         * @see ProtoBuf.Builder.Message
         * @param {boolean=} rebuild Whether to rebuild or not, defaults to false
         * @return {ProtoBuf.Reflect.Message} Message class
         * @throws {Error} If the message cannot be built
         * @expose
         */
        MessagePrototype.build = function (rebuild) {
            if (this.clazz && !rebuild) return this.clazz;

            // Create the runtime Message class in its own scope
            var clazz = function (ProtoBuf, T) {

                var fields = T.getChildren(ProtoBuf.Reflect.Message.Field),
                    oneofs = T.getChildren(ProtoBuf.Reflect.Message.OneOf);

                /**
                 * Constructs a new runtime Message.
                 * @name ProtoBuf.Builder.Message
                 * @class Barebone of all runtime messages.
                 * @param {!Object.<string,*>|string} values Preset values
                 * @param {...string} var_args
                 * @constructor
                 * @throws {Error} If the message cannot be created
                 */
                var Message = function Message(values, var_args) {
                    ProtoBuf.Builder.Message.call(this);

                    // Create virtual oneof properties
                    for (var i = 0, k = oneofs.length; i < k; ++i) {
                        this[oneofs[i].name] = null;
                    } // Create fields and set default values
                    for (i = 0, k = fields.length; i < k; ++i) {
                        var field = fields[i];
                        this[field.name] = field.repeated ? [] : field.map ? new ProtoBuf.Map(field) : null;
                        if ((field.required || T.syntax === 'proto3') && field.defaultValue !== null) this[field.name] = field.defaultValue;
                    }

                    if (arguments.length > 0) {
                        var value;
                        // Set field values from a values object
                        if (arguments.length === 1 && values !== null && (typeof values === "undefined" ? "undefined" : _typeof(values)) === 'object' && (
                        /* not _another_ Message */typeof values.encode !== 'function' || values instanceof Message) &&
                        /* not a repeated field */!Array.isArray(values) &&
                        /* not a Map */!(values instanceof ProtoBuf.Map) &&
                        /* not a ByteBuffer */!ByteBuffer.isByteBuffer(values) &&
                        /* not an ArrayBuffer */!(values instanceof ArrayBuffer) &&
                        /* not a Long */!(ProtoBuf.Long && values instanceof ProtoBuf.Long)) {
                            this.$set(values);
                        } else // Set field values from arguments, in declaration order
                            for (i = 0, k = arguments.length; i < k; ++i) {
                                if (typeof (value = arguments[i]) !== 'undefined') this.$set(fields[i].name, value);
                            } // May throw
                    }
                };

                /**
                 * @alias ProtoBuf.Builder.Message.prototype
                 * @inner
                 */
                var MessagePrototype = Message.prototype = Object.create(ProtoBuf.Builder.Message.prototype);

                /**
                 * Adds a value to a repeated field.
                 * @name ProtoBuf.Builder.Message#add
                 * @function
                 * @param {string} key Field name
                 * @param {*} value Value to add
                 * @param {boolean=} noAssert Whether to assert the value or not (asserts by default)
                 * @returns {!ProtoBuf.Builder.Message} this
                 * @throws {Error} If the value cannot be added
                 * @expose
                 */
                MessagePrototype.add = function (key, value, noAssert) {
                    var field = T._fieldsByName[key];
                    if (!noAssert) {
                        if (!field) throw Error(this + "#" + key + " is undefined");
                        if (!(field instanceof ProtoBuf.Reflect.Message.Field)) throw Error(this + "#" + key + " is not a field: " + field.toString(true)); // May throw if it's an enum or embedded message
                        if (!field.repeated) throw Error(this + "#" + key + " is not a repeated field");
                        value = field.verifyValue(value, true);
                    }
                    if (this[key] === null) this[key] = [];
                    this[key].push(value);
                    return this;
                };

                /**
                 * Adds a value to a repeated field. This is an alias for {@link ProtoBuf.Builder.Message#add}.
                 * @name ProtoBuf.Builder.Message#$add
                 * @function
                 * @param {string} key Field name
                 * @param {*} value Value to add
                 * @param {boolean=} noAssert Whether to assert the value or not (asserts by default)
                 * @returns {!ProtoBuf.Builder.Message} this
                 * @throws {Error} If the value cannot be added
                 * @expose
                 */
                MessagePrototype.$add = MessagePrototype.add;

                /**
                 * Sets a field's value.
                 * @name ProtoBuf.Builder.Message#set
                 * @function
                 * @param {string|!Object.<string,*>} keyOrObj String key or plain object holding multiple values
                 * @param {(*|boolean)=} value Value to set if key is a string, otherwise omitted
                 * @param {boolean=} noAssert Whether to not assert for an actual field / proper value type, defaults to `false`
                 * @returns {!ProtoBuf.Builder.Message} this
                 * @throws {Error} If the value cannot be set
                 * @expose
                 */
                MessagePrototype.set = function (keyOrObj, value, noAssert) {
                    if (keyOrObj && (typeof keyOrObj === "undefined" ? "undefined" : _typeof(keyOrObj)) === 'object') {
                        noAssert = value;
                        for (var ikey in keyOrObj) {
                            if (keyOrObj.hasOwnProperty(ikey) && typeof (value = keyOrObj[ikey]) !== 'undefined') this.$set(ikey, value, noAssert);
                        }return this;
                    }
                    var field = T._fieldsByName[keyOrObj];
                    if (!noAssert) {
                        if (!field) throw Error(this + "#" + keyOrObj + " is not a field: undefined");
                        if (!(field instanceof ProtoBuf.Reflect.Message.Field)) throw Error(this + "#" + keyOrObj + " is not a field: " + field.toString(true));
                        this[field.name] = value = field.verifyValue(value); // May throw
                    } else this[keyOrObj] = value;
                    if (field && field.oneof) {
                        // Field is part of an OneOf (not a virtual OneOf field)
                        var currentField = this[field.oneof.name]; // Virtual field references currently set field
                        if (value !== null) {
                            if (currentField !== null && currentField !== field.name) this[currentField] = null; // Clear currently set field
                            this[field.oneof.name] = field.name; // Point virtual field at this field
                        } else if ( /* value === null && */currentField === keyOrObj) this[field.oneof.name] = null; // Clear virtual field (current field explicitly cleared)
                    }
                    return this;
                };

                /**
                 * Sets a field's value. This is an alias for [@link ProtoBuf.Builder.Message#set}.
                 * @name ProtoBuf.Builder.Message#$set
                 * @function
                 * @param {string|!Object.<string,*>} keyOrObj String key or plain object holding multiple values
                 * @param {(*|boolean)=} value Value to set if key is a string, otherwise omitted
                 * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
                 * @throws {Error} If the value cannot be set
                 * @expose
                 */
                MessagePrototype.$set = MessagePrototype.set;

                /**
                 * Gets a field's value.
                 * @name ProtoBuf.Builder.Message#get
                 * @function
                 * @param {string} key Key
                 * @param {boolean=} noAssert Whether to not assert for an actual field, defaults to `false`
                 * @return {*} Value
                 * @throws {Error} If there is no such field
                 * @expose
                 */
                MessagePrototype.get = function (key, noAssert) {
                    if (noAssert) return this[key];
                    var field = T._fieldsByName[key];
                    if (!field || !(field instanceof ProtoBuf.Reflect.Message.Field)) throw Error(this + "#" + key + " is not a field: undefined");
                    if (!(field instanceof ProtoBuf.Reflect.Message.Field)) throw Error(this + "#" + key + " is not a field: " + field.toString(true));
                    return this[field.name];
                };

                /**
                 * Gets a field's value. This is an alias for {@link ProtoBuf.Builder.Message#$get}.
                 * @name ProtoBuf.Builder.Message#$get
                 * @function
                 * @param {string} key Key
                 * @return {*} Value
                 * @throws {Error} If there is no such field
                 * @expose
                 */
                MessagePrototype.$get = MessagePrototype.get;

                // Getters and setters

                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    // no setters for extension fields as these are named by their fqn
                    if (field instanceof ProtoBuf.Reflect.Message.ExtensionField) continue;

                    if (T.builder.options['populateAccessors']) (function (field) {
                        // set/get[SomeValue]
                        var Name = field.originalName.replace(/(_[a-zA-Z])/g, function (match) {
                            return match.toUpperCase().replace('_', '');
                        });
                        Name = Name.substring(0, 1).toUpperCase() + Name.substring(1);

                        // set/get_[some_value] FIXME: Do we really need these?
                        var name = field.originalName.replace(/([A-Z])/g, function (match) {
                            return "_" + match;
                        });

                        /**
                         * The current field's unbound setter function.
                         * @function
                         * @param {*} value
                         * @param {boolean=} noAssert
                         * @returns {!ProtoBuf.Builder.Message}
                         * @inner
                         */
                        var setter = function setter(value, noAssert) {
                            this[field.name] = noAssert ? value : field.verifyValue(value);
                            return this;
                        };

                        /**
                         * The current field's unbound getter function.
                         * @function
                         * @returns {*}
                         * @inner
                         */
                        var getter = function getter() {
                            return this[field.name];
                        };

                        if (T.getChild("set" + Name) === null)
                            /**
                             * Sets a value. This method is present for each field, but only if there is no name conflict with
                             *  another field.
                             * @name ProtoBuf.Builder.Message#set[SomeField]
                             * @function
                             * @param {*} value Value to set
                             * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
                             * @returns {!ProtoBuf.Builder.Message} this
                             * @abstract
                             * @throws {Error} If the value cannot be set
                             */
                            MessagePrototype["set" + Name] = setter;

                        if (T.getChild("set_" + name) === null)
                            /**
                             * Sets a value. This method is present for each field, but only if there is no name conflict with
                             *  another field.
                             * @name ProtoBuf.Builder.Message#set_[some_field]
                             * @function
                             * @param {*} value Value to set
                             * @param {boolean=} noAssert Whether to not assert the value, defaults to `false`
                             * @returns {!ProtoBuf.Builder.Message} this
                             * @abstract
                             * @throws {Error} If the value cannot be set
                             */
                            MessagePrototype["set_" + name] = setter;

                        if (T.getChild("get" + Name) === null)
                            /**
                             * Gets a value. This method is present for each field, but only if there is no name conflict with
                             *  another field.
                             * @name ProtoBuf.Builder.Message#get[SomeField]
                             * @function
                             * @abstract
                             * @return {*} The value
                             */
                            MessagePrototype["get" + Name] = getter;

                        if (T.getChild("get_" + name) === null)
                            /**
                             * Gets a value. This method is present for each field, but only if there is no name conflict with
                             *  another field.
                             * @name ProtoBuf.Builder.Message#get_[some_field]
                             * @function
                             * @return {*} The value
                             * @abstract
                             */
                            MessagePrototype["get_" + name] = getter;
                    })(field);
                }

                // En-/decoding

                /**
                 * Encodes the message.
                 * @name ProtoBuf.Builder.Message#$encode
                 * @function
                 * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
                 * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
                 * @return {!ByteBuffer} Encoded message as a ByteBuffer
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded ByteBuffer in the `encoded` property on the error.
                 * @expose
                 * @see ProtoBuf.Builder.Message#encode64
                 * @see ProtoBuf.Builder.Message#encodeHex
                 * @see ProtoBuf.Builder.Message#encodeAB
                 */
                MessagePrototype.encode = function (buffer, noVerify) {
                    if (typeof buffer === 'boolean') noVerify = buffer, buffer = undefined;
                    var isNew = false;
                    if (!buffer) buffer = new ByteBuffer(), isNew = true;
                    var le = buffer.littleEndian;
                    try {
                        T.encode(this, buffer.LE(), noVerify);
                        return (isNew ? buffer.flip() : buffer).LE(le);
                    } catch (e) {
                        buffer.LE(le);
                        throw e;
                    }
                };

                /**
                 * Encodes a message using the specified data payload.
                 * @param {!Object.<string,*>} data Data payload
                 * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
                 * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
                 * @return {!ByteBuffer} Encoded message as a ByteBuffer
                 * @expose
                 */
                Message.encode = function (data, buffer, noVerify) {
                    return new Message(data).encode(buffer, noVerify);
                };

                /**
                 * Calculates the byte length of the message.
                 * @name ProtoBuf.Builder.Message#calculate
                 * @function
                 * @returns {number} Byte length
                 * @throws {Error} If the message cannot be calculated or if required fields are missing.
                 * @expose
                 */
                MessagePrototype.calculate = function () {
                    return T.calculate(this);
                };

                /**
                 * Encodes the varint32 length-delimited message.
                 * @name ProtoBuf.Builder.Message#encodeDelimited
                 * @function
                 * @param {(!ByteBuffer|boolean)=} buffer ByteBuffer to encode to. Will create a new one and flip it if omitted.
                 * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
                 * @return {!ByteBuffer} Encoded message as a ByteBuffer
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded ByteBuffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encodeDelimited = function (buffer, noVerify) {
                    var isNew = false;
                    if (!buffer) buffer = new ByteBuffer(), isNew = true;
                    var enc = new ByteBuffer().LE();
                    T.encode(this, enc, noVerify).flip();
                    buffer.writeVarint32(enc.remaining());
                    buffer.append(enc);
                    return isNew ? buffer.flip() : buffer;
                };

                /**
                 * Directly encodes the message to an ArrayBuffer.
                 * @name ProtoBuf.Builder.Message#encodeAB
                 * @function
                 * @return {ArrayBuffer} Encoded message as ArrayBuffer
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded ArrayBuffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encodeAB = function () {
                    try {
                        return this.encode().toArrayBuffer();
                    } catch (e) {
                        if (e["encoded"]) e["encoded"] = e["encoded"].toArrayBuffer();
                        throw e;
                    }
                };

                /**
                 * Returns the message as an ArrayBuffer. This is an alias for {@link ProtoBuf.Builder.Message#encodeAB}.
                 * @name ProtoBuf.Builder.Message#toArrayBuffer
                 * @function
                 * @return {ArrayBuffer} Encoded message as ArrayBuffer
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded ArrayBuffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.toArrayBuffer = MessagePrototype.encodeAB;

                /**
                 * Directly encodes the message to a node Buffer.
                 * @name ProtoBuf.Builder.Message#encodeNB
                 * @function
                 * @return {!Buffer}
                 * @throws {Error} If the message cannot be encoded, not running under node.js or if required fields are
                 *  missing. The later still returns the encoded node Buffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encodeNB = function () {
                    try {
                        return this.encode().toBuffer();
                    } catch (e) {
                        if (e["encoded"]) e["encoded"] = e["encoded"].toBuffer();
                        throw e;
                    }
                };

                /**
                 * Returns the message as a node Buffer. This is an alias for {@link ProtoBuf.Builder.Message#encodeNB}.
                 * @name ProtoBuf.Builder.Message#toBuffer
                 * @function
                 * @return {!Buffer}
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded node Buffer in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.toBuffer = MessagePrototype.encodeNB;

                /**
                 * Directly encodes the message to a base64 encoded string.
                 * @name ProtoBuf.Builder.Message#encode64
                 * @function
                 * @return {string} Base64 encoded string
                 * @throws {Error} If the underlying buffer cannot be encoded or if required fields are missing. The later
                 *  still returns the encoded base64 string in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encode64 = function () {
                    try {
                        return this.encode().toBase64();
                    } catch (e) {
                        if (e["encoded"]) e["encoded"] = e["encoded"].toBase64();
                        throw e;
                    }
                };

                /**
                 * Returns the message as a base64 encoded string. This is an alias for {@link ProtoBuf.Builder.Message#encode64}.
                 * @name ProtoBuf.Builder.Message#toBase64
                 * @function
                 * @return {string} Base64 encoded string
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded base64 string in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.toBase64 = MessagePrototype.encode64;

                /**
                 * Directly encodes the message to a hex encoded string.
                 * @name ProtoBuf.Builder.Message#encodeHex
                 * @function
                 * @return {string} Hex encoded string
                 * @throws {Error} If the underlying buffer cannot be encoded or if required fields are missing. The later
                 *  still returns the encoded hex string in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.encodeHex = function () {
                    try {
                        return this.encode().toHex();
                    } catch (e) {
                        if (e["encoded"]) e["encoded"] = e["encoded"].toHex();
                        throw e;
                    }
                };

                /**
                 * Returns the message as a hex encoded string. This is an alias for {@link ProtoBuf.Builder.Message#encodeHex}.
                 * @name ProtoBuf.Builder.Message#toHex
                 * @function
                 * @return {string} Hex encoded string
                 * @throws {Error} If the message cannot be encoded or if required fields are missing. The later still
                 *  returns the encoded hex string in the `encoded` property on the error.
                 * @expose
                 */
                MessagePrototype.toHex = MessagePrototype.encodeHex;

                /**
                 * Clones a message object or field value to a raw object.
                 * @param {*} obj Object to clone
                 * @param {boolean} binaryAsBase64 Whether to include binary data as base64 strings or as a buffer otherwise
                 * @param {boolean} longsAsStrings Whether to encode longs as strings
                 * @param {!ProtoBuf.Reflect.T=} resolvedType The resolved field type if a field
                 * @returns {*} Cloned object
                 * @inner
                 */
                function cloneRaw(obj, binaryAsBase64, longsAsStrings, resolvedType) {
                    if (obj === null || (typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== 'object') {
                        // Convert enum values to their respective names
                        if (resolvedType && resolvedType instanceof ProtoBuf.Reflect.Enum) {
                            var name = ProtoBuf.Reflect.Enum.getName(resolvedType.object, obj);
                            if (name !== null) return name;
                        }
                        // Pass-through string, number, boolean, null...
                        return obj;
                    }
                    // Convert ByteBuffers to raw buffer or strings
                    if (ByteBuffer.isByteBuffer(obj)) return binaryAsBase64 ? obj.toBase64() : obj.toBuffer();
                    // Convert Longs to proper objects or strings
                    if (ProtoBuf.Long.isLong(obj)) return longsAsStrings ? obj.toString() : ProtoBuf.Long.fromValue(obj);
                    var clone;
                    // Clone arrays
                    if (Array.isArray(obj)) {
                        clone = [];
                        obj.forEach(function (v, k) {
                            clone[k] = cloneRaw(v, binaryAsBase64, longsAsStrings, resolvedType);
                        });
                        return clone;
                    }
                    clone = {};
                    // Convert maps to objects
                    if (obj instanceof ProtoBuf.Map) {
                        var it = obj.entries();
                        for (var e = it.next(); !e.done; e = it.next()) {
                            clone[obj.keyElem.valueToString(e.value[0])] = cloneRaw(e.value[1], binaryAsBase64, longsAsStrings, obj.valueElem.resolvedType);
                        }return clone;
                    }
                    // Everything else is a non-null object
                    var type = obj.$type,
                        field = undefined;
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            if (type && (field = type.getChild(i))) clone[i] = cloneRaw(obj[i], binaryAsBase64, longsAsStrings, field.resolvedType);else clone[i] = cloneRaw(obj[i], binaryAsBase64, longsAsStrings);
                        }
                    }return clone;
                }

                /**
                 * Returns the message's raw payload.
                 * @param {boolean=} binaryAsBase64 Whether to include binary data as base64 strings instead of Buffers, defaults to `false`
                 * @param {boolean} longsAsStrings Whether to encode longs as strings
                 * @returns {Object.<string,*>} Raw payload
                 * @expose
                 */
                MessagePrototype.toRaw = function (binaryAsBase64, longsAsStrings) {
                    return cloneRaw(this, !!binaryAsBase64, !!longsAsStrings, this.$type);
                };

                /**
                 * Encodes a message to JSON.
                 * @returns {string} JSON string
                 * @expose
                 */
                MessagePrototype.encodeJSON = function () {
                    return JSON.stringify(cloneRaw(this,
                    /* binary-as-base64 */true,
                    /* longs-as-strings */true, this.$type));
                };

                /**
                 * Decodes a message from the specified buffer or string.
                 * @name ProtoBuf.Builder.Message.decode
                 * @function
                 * @param {!ByteBuffer|!ArrayBuffer|!Buffer|string} buffer Buffer to decode from
                 * @param {(number|string)=} length Message length. Defaults to decode all the remainig data.
                 * @param {string=} enc Encoding if buffer is a string: hex, utf8 (not recommended), defaults to base64
                 * @return {!ProtoBuf.Builder.Message} Decoded message
                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                 *  returns the decoded message with missing fields in the `decoded` property on the error.
                 * @expose
                 * @see ProtoBuf.Builder.Message.decode64
                 * @see ProtoBuf.Builder.Message.decodeHex
                 */
                Message.decode = function (buffer, length, enc) {
                    if (typeof length === 'string') enc = length, length = -1;
                    if (typeof buffer === 'string') buffer = ByteBuffer.wrap(buffer, enc ? enc : "base64");else if (!ByteBuffer.isByteBuffer(buffer)) buffer = ByteBuffer.wrap(buffer); // May throw
                    var le = buffer.littleEndian;
                    try {
                        var msg = T.decode(buffer.LE(), length);
                        buffer.LE(le);
                        return msg;
                    } catch (e) {
                        buffer.LE(le);
                        throw e;
                    }
                };

                /**
                 * Decodes a varint32 length-delimited message from the specified buffer or string.
                 * @name ProtoBuf.Builder.Message.decodeDelimited
                 * @function
                 * @param {!ByteBuffer|!ArrayBuffer|!Buffer|string} buffer Buffer to decode from
                 * @param {string=} enc Encoding if buffer is a string: hex, utf8 (not recommended), defaults to base64
                 * @return {ProtoBuf.Builder.Message} Decoded message or `null` if not enough bytes are available yet
                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                 *  returns the decoded message with missing fields in the `decoded` property on the error.
                 * @expose
                 */
                Message.decodeDelimited = function (buffer, enc) {
                    if (typeof buffer === 'string') buffer = ByteBuffer.wrap(buffer, enc ? enc : "base64");else if (!ByteBuffer.isByteBuffer(buffer)) buffer = ByteBuffer.wrap(buffer); // May throw
                    if (buffer.remaining() < 1) return null;
                    var off = buffer.offset,
                        len = buffer.readVarint32();
                    if (buffer.remaining() < len) {
                        buffer.offset = off;
                        return null;
                    }
                    try {
                        var msg = T.decode(buffer.slice(buffer.offset, buffer.offset + len).LE());
                        buffer.offset += len;
                        return msg;
                    } catch (err) {
                        buffer.offset += len;
                        throw err;
                    }
                };

                /**
                 * Decodes the message from the specified base64 encoded string.
                 * @name ProtoBuf.Builder.Message.decode64
                 * @function
                 * @param {string} str String to decode from
                 * @return {!ProtoBuf.Builder.Message} Decoded message
                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                 *  returns the decoded message with missing fields in the `decoded` property on the error.
                 * @expose
                 */
                Message.decode64 = function (str) {
                    return Message.decode(str, "base64");
                };

                /**
                 * Decodes the message from the specified hex encoded string.
                 * @name ProtoBuf.Builder.Message.decodeHex
                 * @function
                 * @param {string} str String to decode from
                 * @return {!ProtoBuf.Builder.Message} Decoded message
                 * @throws {Error} If the message cannot be decoded or if required fields are missing. The later still
                 *  returns the decoded message with missing fields in the `decoded` property on the error.
                 * @expose
                 */
                Message.decodeHex = function (str) {
                    return Message.decode(str, "hex");
                };

                /**
                 * Decodes the message from a JSON string.
                 * @name ProtoBuf.Builder.Message.decodeJSON
                 * @function
                 * @param {string} str String to decode from
                 * @return {!ProtoBuf.Builder.Message} Decoded message
                 * @throws {Error} If the message cannot be decoded or if required fields are
                 * missing.
                 * @expose
                 */
                Message.decodeJSON = function (str) {
                    return new Message(JSON.parse(str));
                };

                // Utility

                /**
                 * Returns a string representation of this Message.
                 * @name ProtoBuf.Builder.Message#toString
                 * @function
                 * @return {string} String representation as of ".Fully.Qualified.MessageName"
                 * @expose
                 */
                MessagePrototype.toString = function () {
                    return T.toString();
                };

                // Properties

                /**
                 * Message options.
                 * @name ProtoBuf.Builder.Message.$options
                 * @type {Object.<string,*>}
                 * @expose
                 */
                var $optionsS; // cc needs this

                /**
                 * Message options.
                 * @name ProtoBuf.Builder.Message#$options
                 * @type {Object.<string,*>}
                 * @expose
                 */
                var $options;

                /**
                 * Reflection type.
                 * @name ProtoBuf.Builder.Message.$type
                 * @type {!ProtoBuf.Reflect.Message}
                 * @expose
                 */
                var $typeS;

                /**
                 * Reflection type.
                 * @name ProtoBuf.Builder.Message#$type
                 * @type {!ProtoBuf.Reflect.Message}
                 * @expose
                 */
                var $type;

                if (Object.defineProperty) Object.defineProperty(Message, '$options', { "value": T.buildOpt() }), Object.defineProperty(MessagePrototype, "$options", { "value": Message["$options"] }), Object.defineProperty(Message, "$type", { "value": T }), Object.defineProperty(MessagePrototype, "$type", { "value": T });

                return Message;
            }(ProtoBuf, this);

            // Static enums and prototyped sub-messages / cached collections
            this._fields = [];
            this._fieldsById = {};
            this._fieldsByName = {};
            for (var i = 0, k = this.children.length, child; i < k; i++) {
                child = this.children[i];
                if (child instanceof Enum || child instanceof Message || child instanceof Service) {
                    if (clazz.hasOwnProperty(child.name)) throw Error("Illegal reflect child of " + this.toString(true) + ": " + child.toString(true) + " cannot override static property '" + child.name + "'");
                    clazz[child.name] = child.build();
                } else if (child instanceof Message.Field) child.build(), this._fields.push(child), this._fieldsById[child.id] = child, this._fieldsByName[child.name] = child;else if (!(child instanceof Message.OneOf) && !(child instanceof Extension)) // Not built
                    throw Error("Illegal reflect child of " + this.toString(true) + ": " + this.children[i].toString(true));
            }

            return this.clazz = clazz;
        };

        /**
         * Encodes a runtime message's contents to the specified buffer.
         * @param {!ProtoBuf.Builder.Message} message Runtime message to encode
         * @param {ByteBuffer} buffer ByteBuffer to write to
         * @param {boolean=} noVerify Whether to not verify field values, defaults to `false`
         * @return {ByteBuffer} The ByteBuffer for chaining
         * @throws {Error} If required fields are missing or the message cannot be encoded for another reason
         * @expose
         */
        MessagePrototype.encode = function (message, buffer, noVerify) {
            var fieldMissing = null,
                field;
            for (var i = 0, k = this._fields.length, val; i < k; ++i) {
                field = this._fields[i];
                val = message[field.name];
                if (field.required && val === null) {
                    if (fieldMissing === null) fieldMissing = field;
                } else field.encode(noVerify ? val : field.verifyValue(val), buffer, message);
            }
            if (fieldMissing !== null) {
                var err = Error("Missing at least one required field for " + this.toString(true) + ": " + fieldMissing);
                err["encoded"] = buffer; // Still expose what we got
                throw err;
            }
            return buffer;
        };

        /**
         * Calculates a runtime message's byte length.
         * @param {!ProtoBuf.Builder.Message} message Runtime message to encode
         * @returns {number} Byte length
         * @throws {Error} If required fields are missing or the message cannot be calculated for another reason
         * @expose
         */
        MessagePrototype.calculate = function (message) {
            for (var n = 0, i = 0, k = this._fields.length, field, val; i < k; ++i) {
                field = this._fields[i];
                val = message[field.name];
                if (field.required && val === null) throw Error("Missing at least one required field for " + this.toString(true) + ": " + field);else n += field.calculate(val, message);
            }
            return n;
        };

        /**
         * Skips all data until the end of the specified group has been reached.
         * @param {number} expectedId Expected GROUPEND id
         * @param {!ByteBuffer} buf ByteBuffer
         * @returns {boolean} `true` if a value as been skipped, `false` if the end has been reached
         * @throws {Error} If it wasn't possible to find the end of the group (buffer overrun or end tag mismatch)
         * @inner
         */
        function skipTillGroupEnd(expectedId, buf) {
            var tag = buf.readVarint32(),
                // Throws on OOB
            wireType = tag & 0x07,
                id = tag >>> 3;
            switch (wireType) {
                case ProtoBuf.WIRE_TYPES.VARINT:
                    do {
                        tag = buf.readUint8();
                    } while ((tag & 0x80) === 0x80);
                    break;
                case ProtoBuf.WIRE_TYPES.BITS64:
                    buf.offset += 8;
                    break;
                case ProtoBuf.WIRE_TYPES.LDELIM:
                    tag = buf.readVarint32(); // reads the varint
                    buf.offset += tag; // skips n bytes
                    break;
                case ProtoBuf.WIRE_TYPES.STARTGROUP:
                    skipTillGroupEnd(id, buf);
                    break;
                case ProtoBuf.WIRE_TYPES.ENDGROUP:
                    if (id === expectedId) return false;else throw Error("Illegal GROUPEND after unknown group: " + id + " (" + expectedId + " expected)");
                case ProtoBuf.WIRE_TYPES.BITS32:
                    buf.offset += 4;
                    break;
                default:
                    throw Error("Illegal wire type in unknown group " + expectedId + ": " + wireType);
            }
            return true;
        }

        /**
         * Decodes an encoded message and returns the decoded message.
         * @param {ByteBuffer} buffer ByteBuffer to decode from
         * @param {number=} length Message length. Defaults to decode all remaining data.
         * @param {number=} expectedGroupEndId Expected GROUPEND id if this is a legacy group
         * @return {ProtoBuf.Builder.Message} Decoded message
         * @throws {Error} If the message cannot be decoded
         * @expose
         */
        MessagePrototype.decode = function (buffer, length, expectedGroupEndId) {
            if (typeof length !== 'number') length = -1;
            var start = buffer.offset,
                msg = new this.clazz(),
                tag,
                wireType,
                id,
                field;
            while (buffer.offset < start + length || length === -1 && buffer.remaining() > 0) {
                tag = buffer.readVarint32();
                wireType = tag & 0x07;
                id = tag >>> 3;
                if (wireType === ProtoBuf.WIRE_TYPES.ENDGROUP) {
                    if (id !== expectedGroupEndId) throw Error("Illegal group end indicator for " + this.toString(true) + ": " + id + " (" + (expectedGroupEndId ? expectedGroupEndId + " expected" : "not a group") + ")");
                    break;
                }
                if (!(field = this._fieldsById[id])) {
                    // "messages created by your new code can be parsed by your old code: old binaries simply ignore the new field when parsing."
                    switch (wireType) {
                        case ProtoBuf.WIRE_TYPES.VARINT:
                            buffer.readVarint32();
                            break;
                        case ProtoBuf.WIRE_TYPES.BITS32:
                            buffer.offset += 4;
                            break;
                        case ProtoBuf.WIRE_TYPES.BITS64:
                            buffer.offset += 8;
                            break;
                        case ProtoBuf.WIRE_TYPES.LDELIM:
                            var len = buffer.readVarint32();
                            buffer.offset += len;
                            break;
                        case ProtoBuf.WIRE_TYPES.STARTGROUP:
                            while (skipTillGroupEnd(id, buffer)) {}
                            break;
                        default:
                            throw Error("Illegal wire type for unknown field " + id + " in " + this.toString(true) + "#decode: " + wireType);
                    }
                    continue;
                }
                if (field.repeated && !field.options["packed"]) {
                    msg[field.name].push(field.decode(wireType, buffer));
                } else if (field.map) {
                    var keyval = field.decode(wireType, buffer);
                    msg[field.name].set(keyval[0], keyval[1]);
                } else {
                    msg[field.name] = field.decode(wireType, buffer);
                    if (field.oneof) {
                        // Field is part of an OneOf (not a virtual OneOf field)
                        var currentField = msg[field.oneof.name]; // Virtual field references currently set field
                        if (currentField !== null && currentField !== field.name) msg[currentField] = null; // Clear currently set field
                        msg[field.oneof.name] = field.name; // Point virtual field at this field
                    }
                }
            }

            // Check if all required fields are present and set default values for optional fields that are not
            for (var i = 0, k = this._fields.length; i < k; ++i) {
                field = this._fields[i];
                if (msg[field.name] === null) {
                    if (this.syntax === "proto3") {
                        // Proto3 sets default values by specification
                        msg[field.name] = field.defaultValue;
                    } else if (field.required) {
                        var err = Error("Missing at least one required field for " + this.toString(true) + ": " + field.name);
                        err["decoded"] = msg; // Still expose what we got
                        throw err;
                    } else if (ProtoBuf.populateDefaults && field.defaultValue !== null) msg[field.name] = field.defaultValue;
                }
            }
            return msg;
        };

        /**
         * @alias ProtoBuf.Reflect.Message
         * @expose
         */
        Reflect.Message = Message;

        /**
         * Constructs a new Message Field.
         * @exports ProtoBuf.Reflect.Message.Field
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Message} message Message reference
         * @param {string} rule Rule, one of requried, optional, repeated
         * @param {string?} keytype Key data type, if any.
         * @param {string} type Data type, e.g. int32
         * @param {string} name Field name
         * @param {number} id Unique field id
         * @param {Object.<string,*>=} options Options
         * @param {!ProtoBuf.Reflect.Message.OneOf=} oneof Enclosing OneOf
         * @param {string?} syntax The syntax level of this definition (e.g., proto3)
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var Field = function Field(builder, message, rule, keytype, type, name, id, options, oneof, syntax) {
            T.call(this, builder, message, name);

            /**
             * @override
             */
            this.className = "Message.Field";

            /**
             * Message field required flag.
             * @type {boolean}
             * @expose
             */
            this.required = rule === "required";

            /**
             * Message field repeated flag.
             * @type {boolean}
             * @expose
             */
            this.repeated = rule === "repeated";

            /**
             * Message field map flag.
             * @type {boolean}
             * @expose
             */
            this.map = rule === "map";

            /**
             * Message field key type. Type reference string if unresolved, protobuf
             * type if resolved. Valid only if this.map === true, null otherwise.
             * @type {string|{name: string, wireType: number}|null}
             * @expose
             */
            this.keyType = keytype || null;

            /**
             * Message field type. Type reference string if unresolved, protobuf type if
             * resolved. In a map field, this is the value type.
             * @type {string|{name: string, wireType: number}}
             * @expose
             */
            this.type = type;

            /**
             * Resolved type reference inside the global namespace.
             * @type {ProtoBuf.Reflect.T|null}
             * @expose
             */
            this.resolvedType = null;

            /**
             * Unique message field id.
             * @type {number}
             * @expose
             */
            this.id = id;

            /**
             * Message field options.
             * @type {!Object.<string,*>}
             * @dict
             * @expose
             */
            this.options = options || {};

            /**
             * Default value.
             * @type {*}
             * @expose
             */
            this.defaultValue = null;

            /**
             * Enclosing OneOf.
             * @type {?ProtoBuf.Reflect.Message.OneOf}
             * @expose
             */
            this.oneof = oneof || null;

            /**
             * Syntax level of this definition (e.g., proto3).
             * @type {string}
             * @expose
             */
            this.syntax = syntax || 'proto2';

            /**
             * Original field name.
             * @type {string}
             * @expose
             */
            this.originalName = this.name; // Used to revert camelcase transformation on naming collisions

            /**
             * Element implementation. Created in build() after types are resolved.
             * @type {ProtoBuf.Element}
             * @expose
             */
            this.element = null;

            /**
             * Key element implementation, for map fields. Created in build() after
             * types are resolved.
             * @type {ProtoBuf.Element}
             * @expose
             */
            this.keyElement = null;

            // Convert field names to camel case notation if the override is set
            if (this.builder.options['convertFieldsToCamelCase'] && !(this instanceof Message.ExtensionField)) this.name = ProtoBuf.Util.toCamelCase(this.name);
        };

        /**
         * @alias ProtoBuf.Reflect.Message.Field.prototype
         * @inner
         */
        var FieldPrototype = Field.prototype = Object.create(T.prototype);

        /**
         * Builds the field.
         * @override
         * @expose
         */
        FieldPrototype.build = function () {
            this.element = new Element(this.type, this.resolvedType, false, this.syntax, this.name);
            if (this.map) this.keyElement = new Element(this.keyType, undefined, true, this.syntax, this.name);

            // In proto3, fields do not have field presence, and every field is set to
            // its type's default value ("", 0, 0.0, or false).
            if (this.syntax === 'proto3' && !this.repeated && !this.map) this.defaultValue = Element.defaultFieldValue(this.type);

            // Otherwise, default values are present when explicitly specified
            else if (typeof this.options['default'] !== 'undefined') this.defaultValue = this.verifyValue(this.options['default']);
        };

        /**
         * Checks if the given value can be set for this field.
         * @param {*} value Value to check
         * @param {boolean=} skipRepeated Whether to skip the repeated value check or not. Defaults to false.
         * @return {*} Verified, maybe adjusted, value
         * @throws {Error} If the value cannot be set for this field
         * @expose
         */
        FieldPrototype.verifyValue = function (value, skipRepeated) {
            skipRepeated = skipRepeated || false;
            var self = this;
            function fail(val, msg) {
                throw Error("Illegal value for " + self.toString(true) + " of type " + self.type.name + ": " + val + " (" + msg + ")");
            }
            if (value === null) {
                // NULL values for optional fields
                if (this.required) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "required");
                if (this.syntax === 'proto3' && this.type !== ProtoBuf.TYPES["message"]) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "proto3 field without field presence cannot be null");
                return null;
            }
            var i;
            if (this.repeated && !skipRepeated) {
                // Repeated values as arrays
                if (!Array.isArray(value)) value = [value];
                var res = [];
                for (i = 0; i < value.length; i++) {
                    res.push(this.element.verifyValue(value[i]));
                }return res;
            }
            if (this.map && !skipRepeated) {
                // Map values as objects
                if (!(value instanceof ProtoBuf.Map)) {
                    // If not already a Map, attempt to convert.
                    if (!(value instanceof Object)) {
                        fail(typeof value === "undefined" ? "undefined" : _typeof(value), "expected ProtoBuf.Map or raw object for map field");
                    }
                    return new ProtoBuf.Map(this, value);
                } else {
                    return value;
                }
            }
            // All non-repeated fields expect no array
            if (!this.repeated && Array.isArray(value)) fail(typeof value === "undefined" ? "undefined" : _typeof(value), "no array expected");

            return this.element.verifyValue(value);
        };

        /**
         * Determines whether the field will have a presence on the wire given its
         * value.
         * @param {*} value Verified field value
         * @param {!ProtoBuf.Builder.Message} message Runtime message
         * @return {boolean} Whether the field will be present on the wire
         */
        FieldPrototype.hasWirePresence = function (value, message) {
            if (this.syntax !== 'proto3') return value !== null;
            if (this.oneof && message[this.oneof.name] === this.name) return true;
            switch (this.type) {
                case ProtoBuf.TYPES["int32"]:
                case ProtoBuf.TYPES["sint32"]:
                case ProtoBuf.TYPES["sfixed32"]:
                case ProtoBuf.TYPES["uint32"]:
                case ProtoBuf.TYPES["fixed32"]:
                    return value !== 0;

                case ProtoBuf.TYPES["int64"]:
                case ProtoBuf.TYPES["sint64"]:
                case ProtoBuf.TYPES["sfixed64"]:
                case ProtoBuf.TYPES["uint64"]:
                case ProtoBuf.TYPES["fixed64"]:
                    return value.low !== 0 || value.high !== 0;

                case ProtoBuf.TYPES["bool"]:
                    return value;

                case ProtoBuf.TYPES["float"]:
                case ProtoBuf.TYPES["double"]:
                    return value !== 0.0;

                case ProtoBuf.TYPES["string"]:
                    return value.length > 0;

                case ProtoBuf.TYPES["bytes"]:
                    return value.remaining() > 0;

                case ProtoBuf.TYPES["enum"]:
                    return value !== 0;

                case ProtoBuf.TYPES["message"]:
                    return value !== null;
                default:
                    return true;
            }
        };

        /**
         * Encodes the specified field value to the specified buffer.
         * @param {*} value Verified field value
         * @param {ByteBuffer} buffer ByteBuffer to encode to
         * @param {!ProtoBuf.Builder.Message} message Runtime message
         * @return {ByteBuffer} The ByteBuffer for chaining
         * @throws {Error} If the field cannot be encoded
         * @expose
         */
        FieldPrototype.encode = function (value, buffer, message) {
            if (this.type === null || _typeof(this.type) !== 'object') throw Error("[INTERNAL] Unresolved type in " + this.toString(true) + ": " + this.type);
            if (value === null || this.repeated && value.length == 0) return buffer; // Optional omitted
            try {
                if (this.repeated) {
                    var i;
                    // "Only repeated fields of primitive numeric types (types which use the varint, 32-bit, or 64-bit wire
                    // types) can be declared 'packed'."
                    if (this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                        // "All of the elements of the field are packed into a single key-value pair with wire type 2
                        // (length-delimited). Each element is encoded the same way it would be normally, except without a
                        // tag preceding it."
                        buffer.writeVarint32(this.id << 3 | ProtoBuf.WIRE_TYPES.LDELIM);
                        buffer.ensureCapacity(buffer.offset += 1); // We do not know the length yet, so let's assume a varint of length 1
                        var start = buffer.offset; // Remember where the contents begin
                        for (i = 0; i < value.length; i++) {
                            this.element.encodeValue(this.id, value[i], buffer);
                        }var len = buffer.offset - start,
                            varintLen = ByteBuffer.calculateVarint32(len);
                        if (varintLen > 1) {
                            // We need to move the contents
                            var contents = buffer.slice(start, buffer.offset);
                            start += varintLen - 1;
                            buffer.offset = start;
                            buffer.append(contents);
                        }
                        buffer.writeVarint32(len, start - varintLen);
                    } else {
                        // "If your message definition has repeated elements (without the [packed=true] option), the encoded
                        // message has zero or more key-value pairs with the same tag number"
                        for (i = 0; i < value.length; i++) {
                            buffer.writeVarint32(this.id << 3 | this.type.wireType), this.element.encodeValue(this.id, value[i], buffer);
                        }
                    }
                } else if (this.map) {
                    // Write out each map entry as a submessage.
                    value.forEach(function (val, key, m) {
                        // Compute the length of the submessage (key, val) pair.
                        var length = ByteBuffer.calculateVarint32(1 << 3 | this.keyType.wireType) + this.keyElement.calculateLength(1, key) + ByteBuffer.calculateVarint32(2 << 3 | this.type.wireType) + this.element.calculateLength(2, val);

                        // Submessage with wire type of length-delimited.
                        buffer.writeVarint32(this.id << 3 | ProtoBuf.WIRE_TYPES.LDELIM);
                        buffer.writeVarint32(length);

                        // Write out the key and val.
                        buffer.writeVarint32(1 << 3 | this.keyType.wireType);
                        this.keyElement.encodeValue(1, key, buffer);
                        buffer.writeVarint32(2 << 3 | this.type.wireType);
                        this.element.encodeValue(2, val, buffer);
                    }, this);
                } else {
                    if (this.hasWirePresence(value, message)) {
                        buffer.writeVarint32(this.id << 3 | this.type.wireType);
                        this.element.encodeValue(this.id, value, buffer);
                    }
                }
            } catch (e) {
                throw Error("Illegal value for " + this.toString(true) + ": " + value + " (" + e + ")");
            }
            return buffer;
        };

        /**
         * Calculates the length of this field's value on the network level.
         * @param {*} value Field value
         * @param {!ProtoBuf.Builder.Message} message Runtime message
         * @returns {number} Byte length
         * @expose
         */
        FieldPrototype.calculate = function (value, message) {
            value = this.verifyValue(value); // May throw
            if (this.type === null || _typeof(this.type) !== 'object') throw Error("[INTERNAL] Unresolved type in " + this.toString(true) + ": " + this.type);
            if (value === null || this.repeated && value.length == 0) return 0; // Optional omitted
            var n = 0;
            try {
                if (this.repeated) {
                    var i, ni;
                    if (this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                        n += ByteBuffer.calculateVarint32(this.id << 3 | ProtoBuf.WIRE_TYPES.LDELIM);
                        ni = 0;
                        for (i = 0; i < value.length; i++) {
                            ni += this.element.calculateLength(this.id, value[i]);
                        }n += ByteBuffer.calculateVarint32(ni);
                        n += ni;
                    } else {
                        for (i = 0; i < value.length; i++) {
                            n += ByteBuffer.calculateVarint32(this.id << 3 | this.type.wireType), n += this.element.calculateLength(this.id, value[i]);
                        }
                    }
                } else if (this.map) {
                    // Each map entry becomes a submessage.
                    value.forEach(function (val, key, m) {
                        // Compute the length of the submessage (key, val) pair.
                        var length = ByteBuffer.calculateVarint32(1 << 3 | this.keyType.wireType) + this.keyElement.calculateLength(1, key) + ByteBuffer.calculateVarint32(2 << 3 | this.type.wireType) + this.element.calculateLength(2, val);

                        n += ByteBuffer.calculateVarint32(this.id << 3 | ProtoBuf.WIRE_TYPES.LDELIM);
                        n += ByteBuffer.calculateVarint32(length);
                        n += length;
                    }, this);
                } else {
                    if (this.hasWirePresence(value, message)) {
                        n += ByteBuffer.calculateVarint32(this.id << 3 | this.type.wireType);
                        n += this.element.calculateLength(this.id, value);
                    }
                }
            } catch (e) {
                throw Error("Illegal value for " + this.toString(true) + ": " + value + " (" + e + ")");
            }
            return n;
        };

        /**
         * Decode the field value from the specified buffer.
         * @param {number} wireType Leading wire type
         * @param {ByteBuffer} buffer ByteBuffer to decode from
         * @param {boolean=} skipRepeated Whether to skip the repeated check or not. Defaults to false.
         * @return {*} Decoded value: array for packed repeated fields, [key, value] for
         *             map fields, or an individual value otherwise.
         * @throws {Error} If the field cannot be decoded
         * @expose
         */
        FieldPrototype.decode = function (wireType, buffer, skipRepeated) {
            var value, nBytes;

            // We expect wireType to match the underlying type's wireType unless we see
            // a packed repeated field, or unless this is a map field.
            var wireTypeOK = !this.map && wireType == this.type.wireType || !skipRepeated && this.repeated && this.options["packed"] && wireType == ProtoBuf.WIRE_TYPES.LDELIM || this.map && wireType == ProtoBuf.WIRE_TYPES.LDELIM;
            if (!wireTypeOK) throw Error("Illegal wire type for field " + this.toString(true) + ": " + wireType + " (" + this.type.wireType + " expected)");

            // Handle packed repeated fields.
            if (wireType == ProtoBuf.WIRE_TYPES.LDELIM && this.repeated && this.options["packed"] && ProtoBuf.PACKABLE_WIRE_TYPES.indexOf(this.type.wireType) >= 0) {
                if (!skipRepeated) {
                    nBytes = buffer.readVarint32();
                    nBytes = buffer.offset + nBytes; // Limit
                    var values = [];
                    while (buffer.offset < nBytes) {
                        values.push(this.decode(this.type.wireType, buffer, true));
                    }return values;
                }
                // Read the next value otherwise...
            }

            // Handle maps.
            if (this.map) {
                // Read one (key, value) submessage, and return [key, value]
                var key = Element.defaultFieldValue(this.keyType);
                value = Element.defaultFieldValue(this.type);

                // Read the length
                nBytes = buffer.readVarint32();
                if (buffer.remaining() < nBytes) throw Error("Illegal number of bytes for " + this.toString(true) + ": " + nBytes + " required but got only " + buffer.remaining());

                // Get a sub-buffer of this key/value submessage
                var msgbuf = buffer.clone();
                msgbuf.limit = msgbuf.offset + nBytes;
                buffer.offset += nBytes;

                while (msgbuf.remaining() > 0) {
                    var tag = msgbuf.readVarint32();
                    wireType = tag & 0x07;
                    var id = tag >>> 3;
                    if (id === 1) {
                        key = this.keyElement.decode(msgbuf, wireType, id);
                    } else if (id === 2) {
                        value = this.element.decode(msgbuf, wireType, id);
                    } else {
                        throw Error("Unexpected tag in map field key/value submessage");
                    }
                }

                return [key, value];
            }

            // Handle singular and non-packed repeated field values.
            return this.element.decode(buffer, wireType, this.id);
        };

        /**
         * @alias ProtoBuf.Reflect.Message.Field
         * @expose
         */
        Reflect.Message.Field = Field;

        /**
         * Constructs a new Message ExtensionField.
         * @exports ProtoBuf.Reflect.Message.ExtensionField
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Message} message Message reference
         * @param {string} rule Rule, one of requried, optional, repeated
         * @param {string} type Data type, e.g. int32
         * @param {string} name Field name
         * @param {number} id Unique field id
         * @param {!Object.<string,*>=} options Options
         * @constructor
         * @extends ProtoBuf.Reflect.Message.Field
         */
        var ExtensionField = function ExtensionField(builder, message, rule, type, name, id, options) {
            Field.call(this, builder, message, rule, /* keytype = */null, type, name, id, options);

            /**
             * Extension reference.
             * @type {!ProtoBuf.Reflect.Extension}
             * @expose
             */
            this.extension;
        };

        // Extends Field
        ExtensionField.prototype = Object.create(Field.prototype);

        /**
         * @alias ProtoBuf.Reflect.Message.ExtensionField
         * @expose
         */
        Reflect.Message.ExtensionField = ExtensionField;

        /**
         * Constructs a new Message OneOf.
         * @exports ProtoBuf.Reflect.Message.OneOf
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Message} message Message reference
         * @param {string} name OneOf name
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var OneOf = function OneOf(builder, message, name) {
            T.call(this, builder, message, name);

            /**
             * Enclosed fields.
             * @type {!Array.<!ProtoBuf.Reflect.Message.Field>}
             * @expose
             */
            this.fields = [];
        };

        /**
         * @alias ProtoBuf.Reflect.Message.OneOf
         * @expose
         */
        Reflect.Message.OneOf = OneOf;

        /**
         * Constructs a new Enum.
         * @exports ProtoBuf.Reflect.Enum
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.T} parent Parent Reflect object
         * @param {string} name Enum name
         * @param {Object.<string,*>=} options Enum options
         * @param {string?} syntax The syntax level (e.g., proto3)
         * @constructor
         * @extends ProtoBuf.Reflect.Namespace
         */
        var Enum = function Enum(builder, parent, name, options, syntax) {
            Namespace.call(this, builder, parent, name, options, syntax);

            /**
             * @override
             */
            this.className = "Enum";

            /**
             * Runtime enum object.
             * @type {Object.<string,number>|null}
             * @expose
             */
            this.object = null;
        };

        /**
         * Gets the string name of an enum value.
         * @param {!ProtoBuf.Builder.Enum} enm Runtime enum
         * @param {number} value Enum value
         * @returns {?string} Name or `null` if not present
         * @expose
         */
        Enum.getName = function (enm, value) {
            var keys = Object.keys(enm);
            for (var i = 0, key; i < keys.length; ++i) {
                if (enm[key = keys[i]] === value) return key;
            }return null;
        };

        /**
         * @alias ProtoBuf.Reflect.Enum.prototype
         * @inner
         */
        var EnumPrototype = Enum.prototype = Object.create(Namespace.prototype);

        /**
         * Builds this enum and returns the runtime counterpart.
         * @param {boolean} rebuild Whether to rebuild or not, defaults to false
         * @returns {!Object.<string,number>}
         * @expose
         */
        EnumPrototype.build = function (rebuild) {
            if (this.object && !rebuild) return this.object;
            var enm = new ProtoBuf.Builder.Enum(),
                values = this.getChildren(Enum.Value);
            for (var i = 0, k = values.length; i < k; ++i) {
                enm[values[i]['name']] = values[i]['id'];
            }if (Object.defineProperty) Object.defineProperty(enm, '$options', {
                "value": this.buildOpt(),
                "enumerable": false
            });
            return this.object = enm;
        };

        /**
         * @alias ProtoBuf.Reflect.Enum
         * @expose
         */
        Reflect.Enum = Enum;

        /**
         * Constructs a new Enum Value.
         * @exports ProtoBuf.Reflect.Enum.Value
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Enum} enm Enum reference
         * @param {string} name Field name
         * @param {number} id Unique field id
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var Value = function Value(builder, enm, name, id) {
            T.call(this, builder, enm, name);

            /**
             * @override
             */
            this.className = "Enum.Value";

            /**
             * Unique enum value id.
             * @type {number}
             * @expose
             */
            this.id = id;
        };

        // Extends T
        Value.prototype = Object.create(T.prototype);

        /**
         * @alias ProtoBuf.Reflect.Enum.Value
         * @expose
         */
        Reflect.Enum.Value = Value;

        /**
         * An extension (field).
         * @exports ProtoBuf.Reflect.Extension
         * @constructor
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.T} parent Parent object
         * @param {string} name Object name
         * @param {!ProtoBuf.Reflect.Message.Field} field Extension field
         */
        var Extension = function Extension(builder, parent, name, field) {
            T.call(this, builder, parent, name);

            /**
             * Extended message field.
             * @type {!ProtoBuf.Reflect.Message.Field}
             * @expose
             */
            this.field = field;
        };

        // Extends T
        Extension.prototype = Object.create(T.prototype);

        /**
         * @alias ProtoBuf.Reflect.Extension
         * @expose
         */
        Reflect.Extension = Extension;

        /**
         * Constructs a new Service.
         * @exports ProtoBuf.Reflect.Service
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Namespace} root Root
         * @param {string} name Service name
         * @param {Object.<string,*>=} options Options
         * @constructor
         * @extends ProtoBuf.Reflect.Namespace
         */
        var Service = function Service(builder, root, name, options) {
            Namespace.call(this, builder, root, name, options);

            /**
             * @override
             */
            this.className = "Service";

            /**
             * Built runtime service class.
             * @type {?function(new:ProtoBuf.Builder.Service)}
             */
            this.clazz = null;
        };

        /**
         * @alias ProtoBuf.Reflect.Service.prototype
         * @inner
         */
        var ServicePrototype = Service.prototype = Object.create(Namespace.prototype);

        /**
         * Builds the service and returns the runtime counterpart, which is a fully functional class.
         * @see ProtoBuf.Builder.Service
         * @param {boolean=} rebuild Whether to rebuild or not
         * @return {Function} Service class
         * @throws {Error} If the message cannot be built
         * @expose
         */
        ServicePrototype.build = function (rebuild) {
            if (this.clazz && !rebuild) return this.clazz;

            // Create the runtime Service class in its own scope
            return this.clazz = function (ProtoBuf, T) {

                /**
                 * Constructs a new runtime Service.
                 * @name ProtoBuf.Builder.Service
                 * @param {function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))=} rpcImpl RPC implementation receiving the method name and the message
                 * @class Barebone of all runtime services.
                 * @constructor
                 * @throws {Error} If the service cannot be created
                 */
                var Service = function Service(rpcImpl) {
                    ProtoBuf.Builder.Service.call(this);

                    /**
                     * Service implementation.
                     * @name ProtoBuf.Builder.Service#rpcImpl
                     * @type {!function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))}
                     * @expose
                     */
                    this.rpcImpl = rpcImpl || function (name, msg, callback) {
                        // This is what a user has to implement: A function receiving the method name, the actual message to
                        // send (type checked) and the callback that's either provided with the error as its first
                        // argument or null and the actual response message.
                        setTimeout(callback.bind(this, Error("Not implemented, see: https://github.com/dcodeIO/ProtoBuf.js/wiki/Services")), 0); // Must be async!
                    };
                };

                /**
                 * @alias ProtoBuf.Builder.Service.prototype
                 * @inner
                 */
                var ServicePrototype = Service.prototype = Object.create(ProtoBuf.Builder.Service.prototype);

                /**
                 * Asynchronously performs an RPC call using the given RPC implementation.
                 * @name ProtoBuf.Builder.Service.[Method]
                 * @function
                 * @param {!function(string, ProtoBuf.Builder.Message, function(Error, ProtoBuf.Builder.Message=))} rpcImpl RPC implementation
                 * @param {ProtoBuf.Builder.Message} req Request
                 * @param {function(Error, (ProtoBuf.Builder.Message|ByteBuffer|Buffer|string)=)} callback Callback receiving
                 *  the error if any and the response either as a pre-parsed message or as its raw bytes
                 * @abstract
                 */

                /**
                 * Asynchronously performs an RPC call using the instance's RPC implementation.
                 * @name ProtoBuf.Builder.Service#[Method]
                 * @function
                 * @param {ProtoBuf.Builder.Message} req Request
                 * @param {function(Error, (ProtoBuf.Builder.Message|ByteBuffer|Buffer|string)=)} callback Callback receiving
                 *  the error if any and the response either as a pre-parsed message or as its raw bytes
                 * @abstract
                 */

                var rpc = T.getChildren(ProtoBuf.Reflect.Service.RPCMethod);
                for (var i = 0; i < rpc.length; i++) {
                    (function (method) {

                        // service#Method(message, callback)
                        ServicePrototype[method.name] = function (req, callback) {
                            try {
                                try {
                                    // If given as a buffer, decode the request. Will throw a TypeError if not a valid buffer.
                                    req = method.resolvedRequestType.clazz.decode(ByteBuffer.wrap(req));
                                } catch (err) {
                                    if (!(err instanceof TypeError)) throw err;
                                }
                                if (req === null || (typeof req === "undefined" ? "undefined" : _typeof(req)) !== 'object') throw Error("Illegal arguments");
                                if (!(req instanceof method.resolvedRequestType.clazz)) req = new method.resolvedRequestType.clazz(req);
                                this.rpcImpl(method.fqn(), req, function (err, res) {
                                    // Assumes that this is properly async
                                    if (err) {
                                        callback(err);
                                        return;
                                    }
                                    // Coalesce to empty string when service response has empty content
                                    if (res === null) res = '';
                                    try {
                                        res = method.resolvedResponseType.clazz.decode(res);
                                    } catch (notABuffer) {}
                                    if (!res || !(res instanceof method.resolvedResponseType.clazz)) {
                                        callback(Error("Illegal response type received in service method " + T.name + "#" + method.name));
                                        return;
                                    }
                                    callback(null, res);
                                });
                            } catch (err) {
                                setTimeout(callback.bind(this, err), 0);
                            }
                        };

                        // Service.Method(rpcImpl, message, callback)
                        Service[method.name] = function (rpcImpl, req, callback) {
                            new Service(rpcImpl)[method.name](req, callback);
                        };

                        if (Object.defineProperty) Object.defineProperty(Service[method.name], "$options", { "value": method.buildOpt() }), Object.defineProperty(ServicePrototype[method.name], "$options", { "value": Service[method.name]["$options"] });
                    })(rpc[i]);
                }

                // Properties

                /**
                 * Service options.
                 * @name ProtoBuf.Builder.Service.$options
                 * @type {Object.<string,*>}
                 * @expose
                 */
                var $optionsS; // cc needs this

                /**
                 * Service options.
                 * @name ProtoBuf.Builder.Service#$options
                 * @type {Object.<string,*>}
                 * @expose
                 */
                var $options;

                /**
                 * Reflection type.
                 * @name ProtoBuf.Builder.Service.$type
                 * @type {!ProtoBuf.Reflect.Service}
                 * @expose
                 */
                var $typeS;

                /**
                 * Reflection type.
                 * @name ProtoBuf.Builder.Service#$type
                 * @type {!ProtoBuf.Reflect.Service}
                 * @expose
                 */
                var $type;

                if (Object.defineProperty) Object.defineProperty(Service, "$options", { "value": T.buildOpt() }), Object.defineProperty(ServicePrototype, "$options", { "value": Service["$options"] }), Object.defineProperty(Service, "$type", { "value": T }), Object.defineProperty(ServicePrototype, "$type", { "value": T });

                return Service;
            }(ProtoBuf, this);
        };

        /**
         * @alias ProtoBuf.Reflect.Service
         * @expose
         */
        Reflect.Service = Service;

        /**
         * Abstract service method.
         * @exports ProtoBuf.Reflect.Service.Method
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Service} svc Service
         * @param {string} name Method name
         * @param {Object.<string,*>=} options Options
         * @constructor
         * @extends ProtoBuf.Reflect.T
         */
        var Method = function Method(builder, svc, name, options) {
            T.call(this, builder, svc, name);

            /**
             * @override
             */
            this.className = "Service.Method";

            /**
             * Options.
             * @type {Object.<string, *>}
             * @expose
             */
            this.options = options || {};
        };

        /**
         * @alias ProtoBuf.Reflect.Service.Method.prototype
         * @inner
         */
        var MethodPrototype = Method.prototype = Object.create(T.prototype);

        /**
         * Builds the method's '$options' property.
         * @name ProtoBuf.Reflect.Service.Method#buildOpt
         * @function
         * @return {Object.<string,*>}
         */
        MethodPrototype.buildOpt = NamespacePrototype.buildOpt;

        /**
         * @alias ProtoBuf.Reflect.Service.Method
         * @expose
         */
        Reflect.Service.Method = Method;

        /**
         * RPC service method.
         * @exports ProtoBuf.Reflect.Service.RPCMethod
         * @param {!ProtoBuf.Builder} builder Builder reference
         * @param {!ProtoBuf.Reflect.Service} svc Service
         * @param {string} name Method name
         * @param {string} request Request message name
         * @param {string} response Response message name
         * @param {boolean} request_stream Whether requests are streamed
         * @param {boolean} response_stream Whether responses are streamed
         * @param {Object.<string,*>=} options Options
         * @constructor
         * @extends ProtoBuf.Reflect.Service.Method
         */
        var RPCMethod = function RPCMethod(builder, svc, name, request, response, request_stream, response_stream, options) {
            Method.call(this, builder, svc, name, options);

            /**
             * @override
             */
            this.className = "Service.RPCMethod";

            /**
             * Request message name.
             * @type {string}
             * @expose
             */
            this.requestName = request;

            /**
             * Response message name.
             * @type {string}
             * @expose
             */
            this.responseName = response;

            /**
             * Whether requests are streamed
             * @type {bool}
             * @expose
             */
            this.requestStream = request_stream;

            /**
             * Whether responses are streamed
             * @type {bool}
             * @expose
             */
            this.responseStream = response_stream;

            /**
             * Resolved request message type.
             * @type {ProtoBuf.Reflect.Message}
             * @expose
             */
            this.resolvedRequestType = null;

            /**
             * Resolved response message type.
             * @type {ProtoBuf.Reflect.Message}
             * @expose
             */
            this.resolvedResponseType = null;
        };

        // Extends Method
        RPCMethod.prototype = Object.create(Method.prototype);

        /**
         * @alias ProtoBuf.Reflect.Service.RPCMethod
         * @expose
         */
        Reflect.Service.RPCMethod = RPCMethod;

        return Reflect;
    }(ProtoBuf);

    /**
     * @alias ProtoBuf.Builder
     * @expose
     */
    ProtoBuf.Builder = function (ProtoBuf, Lang, Reflect) {
        "use strict";

        /**
         * Constructs a new Builder.
         * @exports ProtoBuf.Builder
         * @class Provides the functionality to build protocol messages.
         * @param {Object.<string,*>=} options Options
         * @constructor
         */

        var Builder = function Builder(options) {

            /**
             * Namespace.
             * @type {ProtoBuf.Reflect.Namespace}
             * @expose
             */
            this.ns = new Reflect.Namespace(this, null, ""); // Global namespace

            /**
             * Namespace pointer.
             * @type {ProtoBuf.Reflect.T}
             * @expose
             */
            this.ptr = this.ns;

            /**
             * Resolved flag.
             * @type {boolean}
             * @expose
             */
            this.resolved = false;

            /**
             * The current building result.
             * @type {Object.<string,ProtoBuf.Builder.Message|Object>|null}
             * @expose
             */
            this.result = null;

            /**
             * Imported files.
             * @type {Array.<string>}
             * @expose
             */
            this.files = {};

            /**
             * Import root override.
             * @type {?string}
             * @expose
             */
            this.importRoot = null;

            /**
             * Options.
             * @type {!Object.<string, *>}
             * @expose
             */
            this.options = options || {};
        };

        /**
         * @alias ProtoBuf.Builder.prototype
         * @inner
         */
        var BuilderPrototype = Builder.prototype;

        // ----- Definition tests -----

        /**
         * Tests if a definition most likely describes a message.
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isMessage = function (def) {
            // Messages require a string name
            if (typeof def["name"] !== 'string') return false;
            // Messages do not contain values (enum) or rpc methods (service)
            if (typeof def["values"] !== 'undefined' || typeof def["rpc"] !== 'undefined') return false;
            return true;
        };

        /**
         * Tests if a definition most likely describes a message field.
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isMessageField = function (def) {
            // Message fields require a string rule, name and type and an id
            if (typeof def["rule"] !== 'string' || typeof def["name"] !== 'string' || typeof def["type"] !== 'string' || typeof def["id"] === 'undefined') return false;
            return true;
        };

        /**
         * Tests if a definition most likely describes an enum.
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isEnum = function (def) {
            // Enums require a string name
            if (typeof def["name"] !== 'string') return false;
            // Enums require at least one value
            if (typeof def["values"] === 'undefined' || !Array.isArray(def["values"]) || def["values"].length === 0) return false;
            return true;
        };

        /**
         * Tests if a definition most likely describes a service.
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isService = function (def) {
            // Services require a string name and an rpc object
            if (typeof def["name"] !== 'string' || _typeof(def["rpc"]) !== 'object' || !def["rpc"]) return false;
            return true;
        };

        /**
         * Tests if a definition most likely describes an extended message
         * @param {!Object} def
         * @returns {boolean}
         * @expose
         */
        Builder.isExtend = function (def) {
            // Extends rquire a string ref
            if (typeof def["ref"] !== 'string') return false;
            return true;
        };

        // ----- Building -----

        /**
         * Resets the pointer to the root namespace.
         * @returns {!ProtoBuf.Builder} this
         * @expose
         */
        BuilderPrototype.reset = function () {
            this.ptr = this.ns;
            return this;
        };

        /**
         * Defines a namespace on top of the current pointer position and places the pointer on it.
         * @param {string} namespace
         * @return {!ProtoBuf.Builder} this
         * @expose
         */
        BuilderPrototype.define = function (namespace) {
            if (typeof namespace !== 'string' || !Lang.TYPEREF.test(namespace)) throw Error("illegal namespace: " + namespace);
            namespace.split(".").forEach(function (part) {
                var ns = this.ptr.getChild(part);
                if (ns === null) // Keep existing
                    this.ptr.addChild(ns = new Reflect.Namespace(this, this.ptr, part));
                this.ptr = ns;
            }, this);
            return this;
        };

        /**
         * Creates the specified definitions at the current pointer position.
         * @param {!Array.<!Object>} defs Messages, enums or services to create
         * @returns {!ProtoBuf.Builder} this
         * @throws {Error} If a message definition is invalid
         * @expose
         */
        BuilderPrototype.create = function (defs) {
            if (!defs) return this; // Nothing to create
            if (!Array.isArray(defs)) defs = [defs];else {
                if (defs.length === 0) return this;
                defs = defs.slice();
            }

            // It's quite hard to keep track of scopes and memory here, so let's do this iteratively.
            var stack = [defs];
            while (stack.length > 0) {
                defs = stack.pop();

                if (!Array.isArray(defs)) // Stack always contains entire namespaces
                    throw Error("not a valid namespace: " + JSON.stringify(defs));

                while (defs.length > 0) {
                    var def = defs.shift(); // Namespaces always contain an array of messages, enums and services

                    if (Builder.isMessage(def)) {
                        var obj = new Reflect.Message(this, this.ptr, def["name"], def["options"], def["isGroup"], def["syntax"]);

                        // Create OneOfs
                        var oneofs = {};
                        if (def["oneofs"]) Object.keys(def["oneofs"]).forEach(function (name) {
                            obj.addChild(oneofs[name] = new Reflect.Message.OneOf(this, obj, name));
                        }, this);

                        // Create fields
                        if (def["fields"]) def["fields"].forEach(function (fld) {
                            if (obj.getChild(fld["id"] | 0) !== null) throw Error("duplicate or invalid field id in " + obj.name + ": " + fld['id']);
                            if (fld["options"] && _typeof(fld["options"]) !== 'object') throw Error("illegal field options in " + obj.name + "#" + fld["name"]);
                            var oneof = null;
                            if (typeof fld["oneof"] === 'string' && !(oneof = oneofs[fld["oneof"]])) throw Error("illegal oneof in " + obj.name + "#" + fld["name"] + ": " + fld["oneof"]);
                            fld = new Reflect.Message.Field(this, obj, fld["rule"], fld["keytype"], fld["type"], fld["name"], fld["id"], fld["options"], oneof, def["syntax"]);
                            if (oneof) oneof.fields.push(fld);
                            obj.addChild(fld);
                        }, this);

                        // Push children to stack
                        var subObj = [];
                        if (def["enums"]) def["enums"].forEach(function (enm) {
                            subObj.push(enm);
                        });
                        if (def["messages"]) def["messages"].forEach(function (msg) {
                            subObj.push(msg);
                        });
                        if (def["services"]) def["services"].forEach(function (svc) {
                            subObj.push(svc);
                        });

                        // Set extension ranges
                        if (def["extensions"]) {
                            if (typeof def["extensions"][0] === 'number') // pre 5.0.1
                                obj.extensions = [def["extensions"]];else obj.extensions = def["extensions"];
                        }

                        // Create on top of current namespace
                        this.ptr.addChild(obj);
                        if (subObj.length > 0) {
                            stack.push(defs); // Push the current level back
                            defs = subObj; // Continue processing sub level
                            subObj = null;
                            this.ptr = obj; // And move the pointer to this namespace
                            obj = null;
                            continue;
                        }
                        subObj = null;
                    } else if (Builder.isEnum(def)) {

                        obj = new Reflect.Enum(this, this.ptr, def["name"], def["options"], def["syntax"]);
                        def["values"].forEach(function (val) {
                            obj.addChild(new Reflect.Enum.Value(this, obj, val["name"], val["id"]));
                        }, this);
                        this.ptr.addChild(obj);
                    } else if (Builder.isService(def)) {

                        obj = new Reflect.Service(this, this.ptr, def["name"], def["options"]);
                        Object.keys(def["rpc"]).forEach(function (name) {
                            var mtd = def["rpc"][name];
                            obj.addChild(new Reflect.Service.RPCMethod(this, obj, name, mtd["request"], mtd["response"], !!mtd["request_stream"], !!mtd["response_stream"], mtd["options"]));
                        }, this);
                        this.ptr.addChild(obj);
                    } else if (Builder.isExtend(def)) {

                        obj = this.ptr.resolve(def["ref"], true);
                        if (obj) {
                            def["fields"].forEach(function (fld) {
                                if (obj.getChild(fld['id'] | 0) !== null) throw Error("duplicate extended field id in " + obj.name + ": " + fld['id']);
                                // Check if field id is allowed to be extended
                                if (obj.extensions) {
                                    var valid = false;
                                    obj.extensions.forEach(function (range) {
                                        if (fld["id"] >= range[0] && fld["id"] <= range[1]) valid = true;
                                    });
                                    if (!valid) throw Error("illegal extended field id in " + obj.name + ": " + fld['id'] + " (not within valid ranges)");
                                }
                                // Convert extension field names to camel case notation if the override is set
                                var name = fld["name"];
                                if (this.options['convertFieldsToCamelCase']) name = ProtoBuf.Util.toCamelCase(name);
                                // see #161: Extensions use their fully qualified name as their runtime key and...
                                var field = new Reflect.Message.ExtensionField(this, obj, fld["rule"], fld["type"], this.ptr.fqn() + '.' + name, fld["id"], fld["options"]);
                                // ...are added on top of the current namespace as an extension which is used for
                                // resolving their type later on (the extension always keeps the original name to
                                // prevent naming collisions)
                                var ext = new Reflect.Extension(this, this.ptr, fld["name"], field);
                                field.extension = ext;
                                this.ptr.addChild(ext);
                                obj.addChild(field);
                            }, this);
                        } else if (!/\.?google\.protobuf\./.test(def["ref"])) // Silently skip internal extensions
                            throw Error("extended message " + def["ref"] + " is not defined");
                    } else throw Error("not a valid definition: " + JSON.stringify(def));

                    def = null;
                    obj = null;
                }
                // Break goes here
                defs = null;
                this.ptr = this.ptr.parent; // Namespace done, continue at parent
            }
            this.resolved = false; // Require re-resolve
            this.result = null; // Require re-build
            return this;
        };

        /**
         * Propagates syntax to all children.
         * @param {!Object} parent
         * @inner
         */
        function propagateSyntax(parent) {
            if (parent['messages']) {
                parent['messages'].forEach(function (child) {
                    child["syntax"] = parent["syntax"];
                    propagateSyntax(child);
                });
            }
            if (parent['enums']) {
                parent['enums'].forEach(function (child) {
                    child["syntax"] = parent["syntax"];
                });
            }
        }

        /**
         * Imports another definition into this builder.
         * @param {Object.<string,*>} json Parsed import
         * @param {(string|{root: string, file: string})=} filename Imported file name
         * @returns {!ProtoBuf.Builder} this
         * @throws {Error} If the definition or file cannot be imported
         * @expose
         */
        BuilderPrototype["import"] = function (json, filename) {
            var delim = '/';

            // Make sure to skip duplicate imports

            if (typeof filename === 'string') {

                if (ProtoBuf.Util.IS_NODE) filename = require("path")['resolve'](filename);
                if (this.files[filename] === true) return this.reset();
                this.files[filename] = true;
            } else if ((typeof filename === "undefined" ? "undefined" : _typeof(filename)) === 'object') {
                // Object with root, file.

                var root = filename.root;
                if (ProtoBuf.Util.IS_NODE) root = require("path")['resolve'](root);
                if (root.indexOf("\\") >= 0 || filename.file.indexOf("\\") >= 0) delim = '\\';
                var fname = root + delim + filename.file;
                if (this.files[fname] === true) return this.reset();
                this.files[fname] = true;
            }

            // Import imports

            if (json['imports'] && json['imports'].length > 0) {
                var importRoot,
                    resetRoot = false;

                if ((typeof filename === "undefined" ? "undefined" : _typeof(filename)) === 'object') {
                    // If an import root is specified, override

                    this.importRoot = filename["root"];resetRoot = true; // ... and reset afterwards
                    importRoot = this.importRoot;
                    filename = filename["file"];
                    if (importRoot.indexOf("\\") >= 0 || filename.indexOf("\\") >= 0) delim = '\\';
                } else if (typeof filename === 'string') {

                    if (this.importRoot) // If import root is overridden, use it
                        importRoot = this.importRoot;else {
                        // Otherwise compute from filename
                        if (filename.indexOf("/") >= 0) {
                            // Unix
                            importRoot = filename.replace(/\/[^\/]*$/, "");
                            if ( /* /file.proto */importRoot === "") importRoot = "/";
                        } else if (filename.indexOf("\\") >= 0) {
                            // Windows
                            importRoot = filename.replace(/\\[^\\]*$/, "");
                            delim = '\\';
                        } else importRoot = ".";
                    }
                } else importRoot = null;

                for (var i = 0; i < json['imports'].length; i++) {
                    if (typeof json['imports'][i] === 'string') {
                        // Import file
                        if (!importRoot) throw Error("cannot determine import root");
                        var importFilename = json['imports'][i];
                        if (importFilename === "google/protobuf/descriptor.proto") continue; // Not needed and therefore not used
                        importFilename = importRoot + delim + importFilename;
                        if (this.files[importFilename] === true) continue; // Already imported
                        if (/\.proto$/i.test(importFilename) && !ProtoBuf.DotProto) // If this is a light build
                            importFilename = importFilename.replace(/\.proto$/, ".json"); // always load the JSON file
                        var contents = ProtoBuf.Util.fetch(importFilename);
                        if (contents === null) throw Error("failed to import '" + importFilename + "' in '" + filename + "': file not found");
                        if (/\.json$/i.test(importFilename)) // Always possible
                            this["import"](JSON.parse(contents + ""), importFilename); // May throw
                        else this["import"](ProtoBuf.DotProto.Parser.parse(contents), importFilename); // May throw
                    } else // Import structure
                        if (!filename) this["import"](json['imports'][i]);else if (/\.(\w+)$/.test(filename)) // With extension: Append _importN to the name portion to make it unique
                            this["import"](json['imports'][i], filename.replace(/^(.+)\.(\w+)$/, function ($0, $1, $2) {
                                return $1 + "_import" + i + "." + $2;
                            }));else // Without extension: Append _importN to make it unique
                            this["import"](json['imports'][i], filename + "_import" + i);
                }
                if (resetRoot) // Reset import root override when all imports are done
                    this.importRoot = null;
            }

            // Import structures

            if (json['package']) this.define(json['package']);
            if (json['syntax']) propagateSyntax(json);
            var base = this.ptr;
            if (json['options']) Object.keys(json['options']).forEach(function (key) {
                base.options[key] = json['options'][key];
            });
            if (json['messages']) this.create(json['messages']), this.ptr = base;
            if (json['enums']) this.create(json['enums']), this.ptr = base;
            if (json['services']) this.create(json['services']), this.ptr = base;
            if (json['extends']) this.create(json['extends']);

            return this.reset();
        };

        /**
         * Resolves all namespace objects.
         * @throws {Error} If a type cannot be resolved
         * @returns {!ProtoBuf.Builder} this
         * @expose
         */
        BuilderPrototype.resolveAll = function () {
            // Resolve all reflected objects
            var res;
            if (this.ptr == null || _typeof(this.ptr.type) === 'object') return this; // Done (already resolved)

            if (this.ptr instanceof Reflect.Namespace) {
                // Resolve children

                this.ptr.children.forEach(function (child) {
                    this.ptr = child;
                    this.resolveAll();
                }, this);
            } else if (this.ptr instanceof Reflect.Message.Field) {
                // Resolve type

                if (!Lang.TYPE.test(this.ptr.type)) {
                    if (!Lang.TYPEREF.test(this.ptr.type)) throw Error("illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.type);
                    res = (this.ptr instanceof Reflect.Message.ExtensionField ? this.ptr.extension.parent : this.ptr.parent).resolve(this.ptr.type, true);
                    if (!res) throw Error("unresolvable type reference in " + this.ptr.toString(true) + ": " + this.ptr.type);
                    this.ptr.resolvedType = res;
                    if (res instanceof Reflect.Enum) {
                        this.ptr.type = ProtoBuf.TYPES["enum"];
                        if (this.ptr.syntax === 'proto3' && res.syntax !== 'proto3') throw Error("proto3 message cannot reference proto2 enum");
                    } else if (res instanceof Reflect.Message) this.ptr.type = res.isGroup ? ProtoBuf.TYPES["group"] : ProtoBuf.TYPES["message"];else throw Error("illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.type);
                } else this.ptr.type = ProtoBuf.TYPES[this.ptr.type];

                // If it's a map field, also resolve the key type. The key type can be only a numeric, string, or bool type
                // (i.e., no enums or messages), so we don't need to resolve against the current namespace.
                if (this.ptr.map) {
                    if (!Lang.TYPE.test(this.ptr.keyType)) throw Error("illegal key type for map field in " + this.ptr.toString(true) + ": " + this.ptr.keyType);
                    this.ptr.keyType = ProtoBuf.TYPES[this.ptr.keyType];
                }
            } else if (this.ptr instanceof ProtoBuf.Reflect.Service.Method) {

                if (this.ptr instanceof ProtoBuf.Reflect.Service.RPCMethod) {
                    res = this.ptr.parent.resolve(this.ptr.requestName, true);
                    if (!res || !(res instanceof ProtoBuf.Reflect.Message)) throw Error("Illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.requestName);
                    this.ptr.resolvedRequestType = res;
                    res = this.ptr.parent.resolve(this.ptr.responseName, true);
                    if (!res || !(res instanceof ProtoBuf.Reflect.Message)) throw Error("Illegal type reference in " + this.ptr.toString(true) + ": " + this.ptr.responseName);
                    this.ptr.resolvedResponseType = res;
                } else // Should not happen as nothing else is implemented
                    throw Error("illegal service type in " + this.ptr.toString(true));
            } else if (!(this.ptr instanceof ProtoBuf.Reflect.Message.OneOf) && // Not built
            !(this.ptr instanceof ProtoBuf.Reflect.Extension) && // Not built
            !(this.ptr instanceof ProtoBuf.Reflect.Enum.Value) // Built in enum
            ) throw Error("illegal object in namespace: " + _typeof(this.ptr) + ": " + this.ptr);

            return this.reset();
        };

        /**
         * Builds the protocol. This will first try to resolve all definitions and, if this has been successful,
         * return the built package.
         * @param {(string|Array.<string>)=} path Specifies what to return. If omitted, the entire namespace will be returned.
         * @returns {!ProtoBuf.Builder.Message|!Object.<string,*>}
         * @throws {Error} If a type could not be resolved
         * @expose
         */
        BuilderPrototype.build = function (path) {
            this.reset();
            if (!this.resolved) this.resolveAll(), this.resolved = true, this.result = null; // Require re-build
            if (this.result === null) // (Re-)Build
                this.result = this.ns.build();
            if (!path) return this.result;
            var part = typeof path === 'string' ? path.split(".") : path,
                ptr = this.result; // Build namespace pointer (no hasChild etc.)
            for (var i = 0; i < part.length; i++) {
                if (ptr[part[i]]) ptr = ptr[part[i]];else {
                    ptr = null;
                    break;
                }
            }return ptr;
        };

        /**
         * Similar to {@link ProtoBuf.Builder#build}, but looks up the internal reflection descriptor.
         * @param {string=} path Specifies what to return. If omitted, the entire namespace wiil be returned.
         * @param {boolean=} excludeNonNamespace Excludes non-namespace types like fields, defaults to `false`
         * @returns {?ProtoBuf.Reflect.T} Reflection descriptor or `null` if not found
         */
        BuilderPrototype.lookup = function (path, excludeNonNamespace) {
            return path ? this.ns.resolve(path, excludeNonNamespace) : this.ns;
        };

        /**
         * Returns a string representation of this object.
         * @return {string} String representation as of "Builder"
         * @expose
         */
        BuilderPrototype.toString = function () {
            return "Builder";
        };

        // ----- Base classes -----
        // Exist for the sole purpose of being able to "... instanceof ProtoBuf.Builder.Message" etc.

        /**
         * @alias ProtoBuf.Builder.Message
         */
        Builder.Message = function () {};

        /**
         * @alias ProtoBuf.Builder.Enum
         */
        Builder.Enum = function () {};

        /**
         * @alias ProtoBuf.Builder.Message
         */
        Builder.Service = function () {};

        return Builder;
    }(ProtoBuf, ProtoBuf.Lang, ProtoBuf.Reflect);

    /**
     * @alias ProtoBuf.Map
     * @expose
     */
    ProtoBuf.Map = function (ProtoBuf, Reflect) {
        "use strict";

        /**
         * Constructs a new Map. A Map is a container that is used to implement map
         * fields on message objects. It closely follows the ES6 Map API; however,
         * it is distinct because we do not want to depend on external polyfills or
         * on ES6 itself.
         *
         * @exports ProtoBuf.Map
         * @param {!ProtoBuf.Reflect.Field} field Map field
         * @param {Object.<string,*>=} contents Initial contents
         * @constructor
         */

        var Map = function Map(field, contents) {
            if (!field.map) throw Error("field is not a map");

            /**
             * The field corresponding to this map.
             * @type {!ProtoBuf.Reflect.Field}
             */
            this.field = field;

            /**
             * Element instance corresponding to key type.
             * @type {!ProtoBuf.Reflect.Element}
             */
            this.keyElem = new Reflect.Element(field.keyType, null, true, field.syntax);

            /**
             * Element instance corresponding to value type.
             * @type {!ProtoBuf.Reflect.Element}
             */
            this.valueElem = new Reflect.Element(field.type, field.resolvedType, false, field.syntax);

            /**
             * Internal map: stores mapping of (string form of key) -> (key, value)
             * pair.
             *
             * We provide map semantics for arbitrary key types, but we build on top
             * of an Object, which has only string keys. In order to avoid the need
             * to convert a string key back to its native type in many situations,
             * we store the native key value alongside the value. Thus, we only need
             * a one-way mapping from a key type to its string form that guarantees
             * uniqueness and equality (i.e., str(K1) === str(K2) if and only if K1
             * === K2).
             *
             * @type {!Object<string, {key: *, value: *}>}
             */
            this.map = {};

            /**
             * Returns the number of elements in the map.
             */
            Object.defineProperty(this, "size", {
                get: function get() {
                    return Object.keys(this.map).length;
                }
            });

            // Fill initial contents from a raw object.
            if (contents) {
                var keys = Object.keys(contents);
                for (var i = 0; i < keys.length; i++) {
                    var key = this.keyElem.valueFromString(keys[i]);
                    var val = this.valueElem.verifyValue(contents[keys[i]]);
                    this.map[this.keyElem.valueToString(key)] = { key: key, value: val };
                }
            }
        };

        var MapPrototype = Map.prototype;

        /**
         * Helper: return an iterator over an array.
         * @param {!Array<*>} arr the array
         * @returns {!Object} an iterator
         * @inner
         */
        function arrayIterator(arr) {
            var idx = 0;
            return {
                next: function next() {
                    if (idx < arr.length) return { done: false, value: arr[idx++] };
                    return { done: true };
                }
            };
        }

        /**
         * Clears the map.
         */
        MapPrototype.clear = function () {
            this.map = {};
        };

        /**
         * Deletes a particular key from the map.
         * @returns {boolean} Whether any entry with this key was deleted.
         */
        MapPrototype["delete"] = function (key) {
            var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
            var hadKey = keyValue in this.map;
            delete this.map[keyValue];
            return hadKey;
        };

        /**
         * Returns an iterator over [key, value] pairs in the map.
         * @returns {Object} The iterator
         */
        MapPrototype.entries = function () {
            var entries = [];
            var strKeys = Object.keys(this.map);
            for (var i = 0, entry; i < strKeys.length; i++) {
                entries.push([(entry = this.map[strKeys[i]]).key, entry.value]);
            }return arrayIterator(entries);
        };

        /**
         * Returns an iterator over keys in the map.
         * @returns {Object} The iterator
         */
        MapPrototype.keys = function () {
            var keys = [];
            var strKeys = Object.keys(this.map);
            for (var i = 0; i < strKeys.length; i++) {
                keys.push(this.map[strKeys[i]].key);
            }return arrayIterator(keys);
        };

        /**
         * Returns an iterator over values in the map.
         * @returns {!Object} The iterator
         */
        MapPrototype.values = function () {
            var values = [];
            var strKeys = Object.keys(this.map);
            for (var i = 0; i < strKeys.length; i++) {
                values.push(this.map[strKeys[i]].value);
            }return arrayIterator(values);
        };

        /**
         * Iterates over entries in the map, calling a function on each.
         * @param {function(this:*, *, *, *)} cb The callback to invoke with value, key, and map arguments.
         * @param {Object=} thisArg The `this` value for the callback
         */
        MapPrototype.forEach = function (cb, thisArg) {
            var strKeys = Object.keys(this.map);
            for (var i = 0, entry; i < strKeys.length; i++) {
                cb.call(thisArg, (entry = this.map[strKeys[i]]).value, entry.key, this);
            }
        };

        /**
         * Sets a key in the map to the given value.
         * @param {*} key The key
         * @param {*} value The value
         * @returns {!ProtoBuf.Map} The map instance
         */
        MapPrototype.set = function (key, value) {
            var keyValue = this.keyElem.verifyValue(key);
            var valValue = this.valueElem.verifyValue(value);
            this.map[this.keyElem.valueToString(keyValue)] = { key: keyValue, value: valValue };
            return this;
        };

        /**
         * Gets the value corresponding to a key in the map.
         * @param {*} key The key
         * @returns {*|undefined} The value, or `undefined` if key not present
         */
        MapPrototype.get = function (key) {
            var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
            if (!(keyValue in this.map)) return undefined;
            return this.map[keyValue].value;
        };

        /**
         * Determines whether the given key is present in the map.
         * @param {*} key The key
         * @returns {boolean} `true` if the key is present
         */
        MapPrototype.has = function (key) {
            var keyValue = this.keyElem.valueToString(this.keyElem.verifyValue(key));
            return keyValue in this.map;
        };

        return Map;
    }(ProtoBuf, ProtoBuf.Reflect);

    /**
     * Loads a .proto string and returns the Builder.
     * @param {string} proto .proto file contents
     * @param {(ProtoBuf.Builder|string|{root: string, file: string})=} builder Builder to append to. Will create a new one if omitted.
     * @param {(string|{root: string, file: string})=} filename The corresponding file name if known. Must be specified for imports.
     * @return {ProtoBuf.Builder} Builder to create new messages
     * @throws {Error} If the definition cannot be parsed or built
     * @expose
     */
    ProtoBuf.loadProto = function (proto, builder, filename) {
        if (typeof builder === 'string' || builder && typeof builder["file"] === 'string' && typeof builder["root"] === 'string') filename = builder, builder = undefined;
        return ProtoBuf.loadJson(ProtoBuf.DotProto.Parser.parse(proto), builder, filename);
    };

    /**
     * Loads a .proto string and returns the Builder. This is an alias of {@link ProtoBuf.loadProto}.
     * @function
     * @param {string} proto .proto file contents
     * @param {(ProtoBuf.Builder|string)=} builder Builder to append to. Will create a new one if omitted.
     * @param {(string|{root: string, file: string})=} filename The corresponding file name if known. Must be specified for imports.
     * @return {ProtoBuf.Builder} Builder to create new messages
     * @throws {Error} If the definition cannot be parsed or built
     * @expose
     */
    ProtoBuf.protoFromString = ProtoBuf.loadProto; // Legacy

    /**
     * Loads a .proto file and returns the Builder.
     * @param {string|{root: string, file: string}} filename Path to proto file or an object specifying 'file' with
     *  an overridden 'root' path for all imported files.
     * @param {function(?Error, !ProtoBuf.Builder=)=} callback Callback that will receive `null` as the first and
     *  the Builder as its second argument on success, otherwise the error as its first argument. If omitted, the
     *  file will be read synchronously and this function will return the Builder.
     * @param {ProtoBuf.Builder=} builder Builder to append to. Will create a new one if omitted.
     * @return {?ProtoBuf.Builder|undefined} The Builder if synchronous (no callback specified, will be NULL if the
     *   request has failed), else undefined
     * @expose
     */
    ProtoBuf.loadProtoFile = function (filename, callback, builder) {
        if (callback && (typeof callback === "undefined" ? "undefined" : _typeof(callback)) === 'object') builder = callback, callback = null;else if (!callback || typeof callback !== 'function') callback = null;
        if (callback) return ProtoBuf.Util.fetch(typeof filename === 'string' ? filename : filename["root"] + "/" + filename["file"], function (contents) {
            if (contents === null) {
                callback(Error("Failed to fetch file"));
                return;
            }
            try {
                callback(null, ProtoBuf.loadProto(contents, builder, filename));
            } catch (e) {
                callback(e);
            }
        });
        var contents = ProtoBuf.Util.fetch((typeof filename === "undefined" ? "undefined" : _typeof(filename)) === 'object' ? filename["root"] + "/" + filename["file"] : filename);
        return contents === null ? null : ProtoBuf.loadProto(contents, builder, filename);
    };

    /**
     * Loads a .proto file and returns the Builder. This is an alias of {@link ProtoBuf.loadProtoFile}.
     * @function
     * @param {string|{root: string, file: string}} filename Path to proto file or an object specifying 'file' with
     *  an overridden 'root' path for all imported files.
     * @param {function(?Error, !ProtoBuf.Builder=)=} callback Callback that will receive `null` as the first and
     *  the Builder as its second argument on success, otherwise the error as its first argument. If omitted, the
     *  file will be read synchronously and this function will return the Builder.
     * @param {ProtoBuf.Builder=} builder Builder to append to. Will create a new one if omitted.
     * @return {!ProtoBuf.Builder|undefined} The Builder if synchronous (no callback specified, will be NULL if the
     *   request has failed), else undefined
     * @expose
     */
    ProtoBuf.protoFromFile = ProtoBuf.loadProtoFile; // Legacy


    /**
     * Constructs a new empty Builder.
     * @param {Object.<string,*>=} options Builder options, defaults to global options set on ProtoBuf
     * @return {!ProtoBuf.Builder} Builder
     * @expose
     */
    ProtoBuf.newBuilder = function (options) {
        options = options || {};
        if (typeof options['convertFieldsToCamelCase'] === 'undefined') options['convertFieldsToCamelCase'] = ProtoBuf.convertFieldsToCamelCase;
        if (typeof options['populateAccessors'] === 'undefined') options['populateAccessors'] = ProtoBuf.populateAccessors;
        return new ProtoBuf.Builder(options);
    };

    /**
     * Loads a .json definition and returns the Builder.
     * @param {!*|string} json JSON definition
     * @param {(ProtoBuf.Builder|string|{root: string, file: string})=} builder Builder to append to. Will create a new one if omitted.
     * @param {(string|{root: string, file: string})=} filename The corresponding file name if known. Must be specified for imports.
     * @return {ProtoBuf.Builder} Builder to create new messages
     * @throws {Error} If the definition cannot be parsed or built
     * @expose
     */
    ProtoBuf.loadJson = function (json, builder, filename) {
        if (typeof builder === 'string' || builder && typeof builder["file"] === 'string' && typeof builder["root"] === 'string') filename = builder, builder = null;
        if (!builder || (typeof builder === "undefined" ? "undefined" : _typeof(builder)) !== 'object') builder = ProtoBuf.newBuilder();
        if (typeof json === 'string') json = JSON.parse(json);
        builder["import"](json, filename);
        builder.resolveAll();
        return builder;
    };

    /**
     * Loads a .json file and returns the Builder.
     * @param {string|!{root: string, file: string}} filename Path to json file or an object specifying 'file' with
     *  an overridden 'root' path for all imported files.
     * @param {function(?Error, !ProtoBuf.Builder=)=} callback Callback that will receive `null` as the first and
     *  the Builder as its second argument on success, otherwise the error as its first argument. If omitted, the
     *  file will be read synchronously and this function will return the Builder.
     * @param {ProtoBuf.Builder=} builder Builder to append to. Will create a new one if omitted.
     * @return {?ProtoBuf.Builder|undefined} The Builder if synchronous (no callback specified, will be NULL if the
     *   request has failed), else undefined
     * @expose
     */
    ProtoBuf.loadJsonFile = function (filename, callback, builder) {
        if (callback && (typeof callback === "undefined" ? "undefined" : _typeof(callback)) === 'object') builder = callback, callback = null;else if (!callback || typeof callback !== 'function') callback = null;
        if (callback) return ProtoBuf.Util.fetch(typeof filename === 'string' ? filename : filename["root"] + "/" + filename["file"], function (contents) {
            if (contents === null) {
                callback(Error("Failed to fetch file"));
                return;
            }
            try {
                callback(null, ProtoBuf.loadJson(JSON.parse(contents), builder, filename));
            } catch (e) {
                callback(e);
            }
        });
        var contents = ProtoBuf.Util.fetch((typeof filename === "undefined" ? "undefined" : _typeof(filename)) === 'object' ? filename["root"] + "/" + filename["file"] : filename);
        return contents === null ? null : ProtoBuf.loadJson(JSON.parse(contents), builder, filename);
    };

    return ProtoBuf;
});

cc._RF.pop();
}).call(this,require('_process'))

},{"_process":2,"bytebuffer":"bytebuffer","fs":undefined,"path":1}],"smJsPanel":[function(require,module,exports){
"use strict";
cc._RF.push(module, '8428cNCtRBIg4y0u+OGG49L', 'smJsPanel');
// Scripts\Gui\Widget\smJsPanel.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        topcard: cc.Node,
        middlecard: cc.Node,
        bottomcard: cc.Node,
        zongfen: cc.Label,
        daqiang: cc.Label,
        username: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},

    _scoreStr: function _scoreStr(num) {

        if (num < 0) {
            return num.toString();
        } else if (num > 0) {
            return "+" + num.toString();
        } else {
            return "0";
        }
    },

    initCard: function initCard(carddata, score) {
        var tc = this.topcard.getChildByName("card");
        for (var i = 0; i < tc.childrenCount; ++i) {
            var node = tc.children[i];
            cc.PokerUtil.replacePokerSprite(carddata.cards[i], node);
        }
        var st1 = cc.configmanager.pokerFlopCfg[carddata.dun0.brand];
        this.topcard.getChildByName("name").getComponent(cc.Label).string = st1.name;

        var mc = this.middlecard.getChildByName("card");
        for (var i = 0; i < mc.childrenCount; ++i) {
            var node = mc.children[i];
            cc.PokerUtil.replacePokerSprite(carddata.cards[i + 3], node);
        }
        var st2 = cc.configmanager.pokerFlopCfg[carddata.dun1.brand];
        this.middlecard.getChildByName("name").getComponent(cc.Label).string = st2.name;

        var bc = this.bottomcard.getChildByName("card");
        for (var i = 0; i < bc.childrenCount; ++i) {
            var node = bc.children[i];
            cc.PokerUtil.replacePokerSprite(carddata.cards[i + 8], node);
        }
        var st3 = cc.configmanager.pokerFlopCfg[carddata.dun2.brand];
        this.bottomcard.getChildByName("name").getComponent(cc.Label).string = st3.name;

        this.daqiang.string = "0";
        this.zongfen.string = carddata.rank;

        var player = cc.gamemanager.getPlayer(carddata.cuid);
        if (player != null) {
            this.username.string = player.name;
        }

        this.topcard.getChildByName("score").getComponent(cc.Label).string = this._scoreStr(score.score.top);
        this.middlecard.getChildByName("score").getComponent(cc.Label).string = this._scoreStr(score.score.middle);
        this.bottomcard.getChildByName("score").getComponent(cc.Label).string = this._scoreStr(score.score.bottom);
        this.daqiang.string = this._scoreStr(score.score.spe);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RF.pop();
},{}],"waitformatch":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'd91dfbe7ThOMqQ74Gu08IJY', 'waitformatch');
// Scripts\Gui\Widget\waitformatch.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        actNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._index = 0;

        var action = cc.repeatForever(cc.sequence(cc.callFunc(function (target, param) {
            var i = 0;
            for (; i < param._index; ++i) {
                param.actNode.children[i].active = true;
            }
            for (; i < param.actNode.childrenCount; ++i) {
                param.actNode.children[i].active = false;
            }

            ++param._index;
            if (param._index > param.actNode.childrenCount) {
                param._index = 0;
            }
        }, this, this), cc.delayTime(0.3)));

        this.actNode.runAction(action);
    }

});

cc._RF.pop();
},{}]},{},["CardMoveEvent","GameResult","MainGame","PokerFlop","PokerList","PokerSelect","PokerSelectHandler","PokerSort","RecordItem","ScoreSummary","UIChat","UICreateRoom","UIGm","UIHelp","UIJoinRoom","UILogin","UIMain","UIMessageBox","UINotice","UIPanel","UIPokerGame","UIRecord","UISetting","UIShop","UIVote","UIWaiting","ChatBubble","ShopItem","bigJsPanel","smJsPanel","waitformatch","bytebuffer","long","protobuf","AudioMgr","ConfigManager","DataManager","GameManager","GuiManager","IMManager","NetManager - 副本","NetManager","PokerUtils","SceneManager","init"])
