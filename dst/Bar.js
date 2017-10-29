"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var magik = magikcraft.io;
exports.version = '0.0.4';
/**
 *
 * new ComponentBuilder( "Hello " ).color( ChatColor.RED ).bold( true ).append( "world" ).color( ChatColor.BLUE ).append( "!" ).color( ChatColor.RED ).create();
 */
var ComponentBuilderClass = Java.type('net.md_5.bungee.api.chat.ComponentBuilder');
exports.ComponentBuilder = function (msg) { return new ComponentBuilderClass(msg); };
var _ChatColor = Java.type('net.md_5.bungee.api.ChatColor');
var ChatColor;
(function (ChatColor) {
    ChatColor[ChatColor["AQUA"] = _ChatColor.AQUA] = "AQUA";
    ChatColor[ChatColor["BLACK"] = _ChatColor.BLACK] = "BLACK";
    ChatColor[ChatColor["BLUE"] = _ChatColor.BLUE] = "BLUE";
    ChatColor[ChatColor["BOLD"] = _ChatColor.BOLD] = "BOLD";
    ChatColor[ChatColor["DARK_AQUA"] = _ChatColor.DARK_AQUA] = "DARK_AQUA";
    ChatColor[ChatColor["DARK_BLUE"] = _ChatColor.DARK_BLUE] = "DARK_BLUE";
    ChatColor[ChatColor["DARK_GRAY"] = _ChatColor.DARK_GRAY] = "DARK_GRAY";
    ChatColor[ChatColor["DARK_GREEN"] = _ChatColor.DARK_GREEN] = "DARK_GREEN";
    ChatColor[ChatColor["DARK_PURPLE"] = _ChatColor.DARK_PURPLE] = "DARK_PURPLE";
    ChatColor[ChatColor["DARK_RED"] = _ChatColor.DARK_RED] = "DARK_RED";
    ChatColor[ChatColor["GOLD"] = _ChatColor.GOLD] = "GOLD";
    ChatColor[ChatColor["GRAY"] = _ChatColor.GRAY] = "GRAY";
    ChatColor[ChatColor["GREEN"] = _ChatColor.GREEN] = "GREEN";
    ChatColor[ChatColor["ITALIC"] = _ChatColor.ITALIC] = "ITALIC";
    ChatColor[ChatColor["LIGHT_PURPLE"] = _ChatColor.LIGHT_PURPLE] = "LIGHT_PURPLE";
    ChatColor[ChatColor["MAGIC"] = _ChatColor.MAGIC] = "MAGIC";
    ChatColor[ChatColor["RED"] = _ChatColor.RED] = "RED";
    ChatColor[ChatColor["RESET"] = _ChatColor.RESET] = "RESET";
    ChatColor[ChatColor["STRIKETHROUGH"] = _ChatColor.STRIKETHROUGH] = "STRIKETHROUGH";
    ChatColor[ChatColor["UNDERLINE"] = _ChatColor.UNDERLINE] = "UNDERLINE";
    ChatColor[ChatColor["WHITE"] = _ChatColor.WHITE] = "WHITE";
    ChatColor[ChatColor["YELLOW"] = _ChatColor.YELLOW] = "YELLOW";
})(ChatColor = exports.ChatColor || (exports.ChatColor = {}));
var Color = magik.Bars.Color;
var color;
(function (color) {
    color[color["BLUE"] = magik.Bars.Color.BLUE] = "BLUE";
    color[color["GREEN"] = magik.Bars.Color.GREEN] = "GREEN";
    color[color["PINK"] = magik.Bars.Color.PINK] = "PINK";
    color[color["PURPLE"] = magik.Bars.Color.PURPLE] = "PURPLE";
    color[color["RED"] = magik.Bars.Color.RED] = "RED";
    color[color["WHITE"] = magik.Bars.Color.WHITE] = "WHITE";
    color[color["YELLOW"] = magik.Bars.Color.YELLOW] = "YELLOW";
})(color = exports.color || (exports.color = {}));
var Style = magik.Bars.Style;
var style;
(function (style) {
    style[style["NOTCHED_10"] = magik.Bars.Style.NOTCHED_10] = "NOTCHED_10";
    style[style["NOTCHED_12"] = magik.Bars.Style.NOTCHED_12] = "NOTCHED_12";
    style[style["NOTCHED_20"] = magik.Bars.Style.NOTCHED_20] = "NOTCHED_20";
})(style = exports.style || (exports.style = {}));
function bar(_msg, player) {
    if (_msg === void 0) { _msg = ""; }
    if (player === void 0) { player = magik.getSender(); }
    var _bar, _color, _style;
    var Bar = {
        _bar: _bar,
        _msg: _msg,
        _color: magik.Bars.Color.RED,
        _progress: 0.5,
        _style: magik.Bars.Style.NOTCHED_20,
        _init: false,
        _textComponent: undefined,
        _hasTextComponent: false,
        player: player
    };
    Bar.show = function () {
        if (Bar._init) {
            return Bar;
        }
        var textComponent = (Bar._hasTextComponent) ? magik.TextComponent(Bar._textComponent) : magik.TextComponent(Bar._msg + "");
        Bar._bar = magik.Bars.addBar(player, textComponent, Bar._color, Bar._style, Bar._progress // Progress (0.0 - 1.0)
        );
        Bar._init = true;
        return Bar;
    };
    Bar.color = function (color) {
        Bar._color = magik.Bars.Color[color];
        if (Bar._init) {
            Bar._bar.setColor(Bar._color);
        }
        return Bar;
    };
    Bar.style = function (style) {
        Bar._style = magik.Bars.Style[style];
        return Bar;
    };
    Bar.textComponent = function (msg) {
        Bar._textComponent = msg;
        Bar._hasTextComponent = true;
        Bar._msg = null;
        if (Bar._init) {
            Bar.destroy();
            Bar.show();
        }
        return Bar;
    };
    Bar.text = function (msg) {
        Bar._msg = msg + '';
        Bar._textComponent = null;
        Bar._hasTextComponent = false;
        if (Bar._init) {
            Bar.destroy();
            Bar.show();
        }
        return Bar;
    };
    Bar.progress = function (progress) {
        if (progress === void 0) { progress = 50; }
        Bar._progress = Math.min(progress / 100, 0.99);
        if (Bar._init) {
            Bar._bar.setProgress(progress);
        }
        return Bar;
    };
    Bar.addPlayer = function (player) {
        if (Bar._init) {
            Bar._bar.addPlayer(player);
        }
        return Bar;
    };
    Bar.removePlayer = function (player) {
        if (Bar._init) {
            Bar._bar.removePlayer(player);
        }
        return Bar;
    };
    Bar.destroy = function () {
        if (Bar._init) {
            Bar.removePlayer(player);
            Bar._init = false;
        }
        return undefined;
    };
    return Bar;
}
exports.bar = bar;
/**
 *
 * In this function we return a partially bound version of bar that can be loaded as a lore at boot time. This means that users can use magikcraft.io.lore.sitapati.bar and get a bar in the UI.
 *
 * @param {*} canon
 * @returns
 */
function barWithClosure(canon) {
    var player = canon.sender;
    return function (msg, _player) {
        _player = (_player) ? _player : player;
        return bar(msg, _player);
    };
}
exports._lore = {
    namespace: 'sitapati',
    loreToLoad: [
        {
            name: 'bar',
            code: barWithClosure,
            cost: 0
        }
    ]
};
