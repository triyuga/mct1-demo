const magik = magikcraft.io;

export const version = '0.0.4';
/**
 *
 * new ComponentBuilder( "Hello " ).color( ChatColor.RED ).bold( true ).append( "world" ).color( ChatColor.BLUE ).append( "!" ).color( ChatColor.RED ).create();
 */
const ComponentBuilderClass = Java.type('net.md_5.bungee.api.chat.ComponentBuilder')
export const ComponentBuilder = (msg: string): IComponentBuilder => new (ComponentBuilderClass as any)(msg);

const _ChatColor = Java.type('net.md_5.bungee.api.ChatColor');

export enum ChatColor {
    'AQUA' = _ChatColor.AQUA,
    'BLACK' = _ChatColor.BLACK,
    'BLUE' = _ChatColor.BLUE,
    'BOLD' = _ChatColor.BOLD,
    'DARK_AQUA' = _ChatColor.DARK_AQUA,
    'DARK_BLUE' = _ChatColor.DARK_BLUE,
    'DARK_GRAY' = _ChatColor.DARK_GRAY,
    'DARK_GREEN' = _ChatColor.DARK_GREEN,
    'DARK_PURPLE' = _ChatColor.DARK_PURPLE,
    'DARK_RED' = _ChatColor.DARK_RED,
    'GOLD' = _ChatColor.GOLD,
    'GRAY' = _ChatColor.GRAY,
    'GREEN' = _ChatColor.GREEN,
    'ITALIC' = _ChatColor.ITALIC,
    'LIGHT_PURPLE' = _ChatColor.LIGHT_PURPLE,
    'MAGIC' = _ChatColor.MAGIC,
    'RED' = _ChatColor.RED,
    'RESET' = _ChatColor.RESET,
    'STRIKETHROUGH' = _ChatColor.STRIKETHROUGH,
    'UNDERLINE' = _ChatColor.UNDERLINE,
    'WHITE' = _ChatColor.WHITE,
    'YELLOW' = _ChatColor.YELLOW
}
export interface IComponentBuilder {
    (text: string): IComponentBuilder;
    append(msg: string): IComponentBuilder;
    bold(bold: boolean): IComponentBuilder;
    color(color: ChatColor): IComponentBuilder;
    create(): TextComponent;
    italic(italic: boolean): IComponentBuilder;
    strikethrough(strikethrough: boolean): IComponentBuilder;
    underlined(underlined: boolean): IComponentBuilder;
}

const Color = magik.Bars.Color;
export enum color {
    'BLUE' = magik.Bars.Color.BLUE,
    'GREEN' = magik.Bars.Color.GREEN,
    'PINK' = magik.Bars.Color.PINK,
    'PURPLE' = magik.Bars.Color.PURPLE,
    'RED' = magik.Bars.Color.RED,
    'WHITE' = magik.Bars.Color.WHITE,
    'YELLOW' = magik.Bars.Color.YELLOW
}

const Style = magik.Bars.Style;
export enum style {
    'NOTCHED_10' = magik.Bars.Style.NOTCHED_10,
    'NOTCHED_12' = magik.Bars.Style.NOTCHED_12,
    'NOTCHED_20' = magik.Bars.Style.NOTCHED_20
}
export interface IBar {
    show(): IBar;
    text(msg: string): IBar;
    textComponent(textComponent: TextComponent): IBar;
    color(color: color): IBar;
    style(style: style): IBar;
    progress(percentage: number): IBar;
    addPlayer(player: BukkitPlayer): IBar;
    removePlayer(player: BukkitPlayer): IBar;
    destroy(): void;
}

interface _IBar extends IBar {
    _bar: BossBar;
    _msg: string | null;
    _color: BarsColor;
    _progress: number;
    _style: BarsStyle;
    _init: boolean;
    _textComponent: TextComponent | null;
    _hasTextComponent: boolean;
}

export function bar(_msg = "", player = magik.getSender()): IBar {
    let _bar, _color, _style;
    let Bar: _IBar = {
        _bar,
        _msg,
        _color: magik.Bars.Color.RED,
        _progress: 0.5,
        _style: magik.Bars.Style.NOTCHED_20,
        _init: false,
        _textComponent: undefined,
        _hasTextComponent: false,
        player
	} as any;
	
    Bar.show = function () {
        if (Bar._init) {
            return Bar;
        }
        const textComponent = (Bar._hasTextComponent) ? magik.TextComponent(Bar._textComponent) : magik.TextComponent(Bar._msg + "");
        Bar._bar = magik.Bars.addBar(player,
            textComponent,
            Bar._color,
            Bar._style,
            Bar._progress // Progress (0.0 - 1.0)
        );
        Bar._init = true;
        return Bar;
    }
    Bar.color = function (color: color) {
        Bar._color = (magik.Bars.Color as any)[color];
        if (Bar._init) {
            Bar._bar.setColor(Bar._color);
        }
        return Bar;
    };
    Bar.style = function (style: style) {
        Bar._style = (magik.Bars.Style as any)[style];
        return Bar;
    };
    Bar.textComponent = function (msg: TextComponent) {
        Bar._textComponent = msg;
        Bar._hasTextComponent = true;
        Bar._msg = null;
        if (Bar._init) {
            Bar.destroy();
            Bar.show();
        }
        return Bar;
    }
    Bar.text = function (msg: string) {
        Bar._msg = msg + '';
        Bar._textComponent = null;
        Bar._hasTextComponent = false;
        if (Bar._init) {
            Bar.destroy();
            Bar.show();
        }
        return Bar;
    }
    Bar.progress = function (progress: number = 50) {
        Bar._progress = Math.min(progress / 100, 0.99);
        if (Bar._init) {
            Bar._bar.setProgress(progress);
        }
        return Bar;
    };
    Bar.addPlayer = function (player: BukkitPlayer) {
        if (Bar._init) {
            Bar._bar.addPlayer(player);
        }
        return Bar;
    };
    Bar.removePlayer = function (player: BukkitPlayer) {
        if (Bar._init) {
            Bar._bar.removePlayer(player);
        }
        return Bar;
    }
    Bar.destroy = function () {
        if (Bar._init) {
            Bar.removePlayer(player);
            Bar._init = false;
        }
        return undefined;
    }
    return Bar;
}

/**
 *
 * In this function we return a partially bound version of bar that can be loaded as a lore at boot time. This means that users can use magikcraft.io.lore.sitapati.bar and get a bar in the UI.
 *
 * @param {*} canon
 * @returns
 */
function barWithClosure(canon: any) {
    const player = canon.sender;
    return function (msg: string, _player: BukkitPlayer) {
        _player = (_player)? _player: player;
        return bar(msg, _player);
    }
}

export const _lore = {
    namespace: 'sitapati',
    loreToLoad: [
        {
            name: 'bar',
            code: barWithClosure,
            cost: 0
        }
    ]
}
