#!/usr/bin/env node
/**
 * Builds the Zed theme extension in zed/ from the VS Code themes in themes/.
 *
 *   node scripts/build-zed-theme.js
 *
 * The VS Code themes are the source of truth: edit those, then re-run this
 * script. Every theme listed in package.json "contributes.themes" becomes one
 * entry in zed/themes/neutralflow.json. Don't edit the files in zed/ by hand.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ZED_DIR = path.join(ROOT, 'zed');
const EXTENSION_ID = 'neutralflow-theme';
const FAMILY_NAME = 'NeutralFlow';
const AUTHOR = 'JenuelDev';
const SCHEMA = 'https://zed.dev/schema/themes/v0.2.0.json';

// Zed syntax capture -> where to find its color in the VS Code theme.
// `tm` lists TextMate scope stacks (outermost scope first) and the first one
// that resolves wins; `sem` is a semanticTokenColors selector that overrides it,
// the same way semantic highlighting overrides TextMate colors in VS Code.
// A plain array is shorthand for { tm: [...] }. Captures left out here fall back
// to their parent in Zed (e.g. `variable.builtin` uses `variable`).
const SYNTAX_MAP = {
    'attribute': ['entity.other.attribute-name'],
    'boolean': ['constant.language.boolean'],
    'comment': ['comment.line'],
    'comment.doc': ['comment.block.documentation'],
    'constant': { sem: 'variable.readonly', tm: ['variable.other.constant'] },
    'constant.builtin': ['constant.language'],
    'constructor': ['entity.name.type.class'],
    'diff.minus': ['markup.deleted'],
    'diff.plus': ['markup.inserted'],
    'emphasis': ['text.html.markdown markup.italic.markdown'],
    'emphasis.strong': ['text.html.markdown markup.bold.markdown'],
    'enum': ['entity.name.type.enum'],
    'function': { sem: 'function', tm: ['entity.name.function'] },
    'function.builtin': ['support.function'],
    'function.macro': { sem: 'macro', tm: ['entity.name.function.macro'] },
    'function.method': { sem: 'method', tm: ['entity.name.function.member', 'entity.name.function'] },
    'function.special': { sem: 'macro', tm: ['entity.name.function.macro'] },
    'keyword': ['storage.type', 'keyword.other'],
    'keyword.control': { sem: 'keyword.controlFlow', tm: ['keyword.control.flow', 'keyword.control'] },
    'keyword.import': ['keyword.control.import'],
    'keyword.modifier': ['storage.modifier'],
    'keyword.operator': ['keyword.operator.expression'],
    'label': ['entity.name.label'],
    'lifetime': ['entity.name.type.lifetime.rust'],
    'link_text': ['text.html.markdown string.other.link.title.markdown'],
    'link_uri': ['text.html.markdown markup.underline.link.markdown'],
    'module': ['entity.name.type.module'],
    'namespace': ['entity.name.namespace'],
    'number': ['constant.numeric'],
    'operator': { sem: 'operator', tm: ['keyword.operator'] },
    'preproc': ['meta.preprocessor', 'keyword.control.directive'],
    'property': ['variable.other.property'],
    'property.json_key': ['source.json meta.structure.dictionary.json support.type.property-name.json'],
    'punctuation': ['punctuation'],
    'punctuation.bracket': ['meta.brace.round', 'punctuation.section'],
    'punctuation.delimiter': ['punctuation.separator.comma', 'punctuation.separator'],
    'punctuation.list_marker': ['text.html.markdown markup.list.unnumbered.markdown punctuation.definition.list.begin.markdown'],
    'punctuation.markup': ['text.html.markdown markup.heading.markdown punctuation.definition.heading.markdown'],
    'punctuation.special': ['punctuation.definition.template-expression.begin', 'punctuation.section.embedded'],
    'selector': ['source.css meta.selector.css entity.other.attribute-name.class.css'],
    'selector.pseudo': ['source.css meta.selector.css entity.other.attribute-name.pseudo-class.css'],
    'string': ['string.quoted'],
    'string.escape': ['constant.character.escape'],
    'string.regex': ['string.regexp'],
    'string.special.symbol': ['constant.other.symbol'],
    'tag': ['text.html.basic meta.tag.structure.any.html entity.name.tag.html'],
    'tag.component.jsx': ['source.tsx meta.tag.tsx support.class.component.tsx'],
    'tag.jsx': ['source.tsx meta.tag.tsx entity.name.tag.tsx'],
    'text.literal': ['text.html.markdown markup.inline.raw.string.markdown'],
    'title': ['text.html.markdown markup.heading.markdown entity.name.section.markdown'],
    'type': ['entity.name.type'],
    'type.builtin': ['support.type.primitive'],
    'variable': { sem: 'variable', tm: ['variable.other.readwrite', 'variable'] },
    'variable.parameter': { sem: 'parameter', tm: ['variable.parameter'] },
    'variable.special': ['variable.language'],
    'variant': ['variable.other.enummember'],
};

const ANSI_COLORS = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
const TRANSPARENT = '#00000000';

// --- Colors -----------------------------------------------------------------

function parseColor(value) {
    const match = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(String(value).trim());
    if (!match) throw new Error(`Unsupported color: ${value}`);
    let hex = match[1];
    if (hex.length <= 4) hex = [...hex].map((c) => c + c).join('');
    if (hex.length === 6) hex += 'ff';
    return [0, 2, 4, 6].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function formatColor([r, g, b, a]) {
    const channels = a === 255 ? [r, g, b] : [r, g, b, a];
    return '#' + channels.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('').toUpperCase();
}

const normalize = (color) => formatColor(parseColor(color));

const withAlpha = (color, alpha) => {
    const [r, g, b] = parseColor(color);
    return formatColor([r, g, b, alpha * 255]);
};

// Opaque blend: t = 0 gives `from`, t = 1 gives `to`.
const mix = (from, to, t) => {
    const a = parseColor(from);
    const b = parseColor(to);
    return formatColor([0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t).concat(255));
};

function luminance(color) {
    const [r, g, b] = parseColor(color)
        .slice(0, 3)
        .map((n) => n / 255)
        .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
    const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (lighter + 0.05) / (darker + 0.05);
}

// Blends `text` toward `to` by up to `maxT`, stopping short of anything that
// would drop below WCAG AA (4.5:1) on one of `backgrounds`.
function dimText(text, to, maxT, backgrounds) {
    for (let t = maxT; t > 0; t -= 0.01) {
        const color = mix(text, to, t);
        if (backgrounds.every((bg) => contrast(color, bg) >= 4.5)) return color;
    }
    return text;
}

// --- TextMate scope resolution -----------------------------------------------

const scopeMatches = (selector, scope) => scope === selector || scope.startsWith(selector + '.');

function compileRules(tokenColors) {
    const rules = [];
    tokenColors.forEach((rule, order) => {
        const selectors = typeof rule.scope === 'string' ? rule.scope.split(',') : rule.scope || [];
        for (const selector of selectors) {
            const parts = selector.trim().split(/\s+/);
            // Skip global rules (no scope) and wildcard selectors like "*url*", which TextMate never matches.
            if (!parts[0] || parts.some((part) => part.includes('*'))) continue;
            rules.push({ leaf: parts.pop(), parents: parts, settings: rule.settings || {}, order });
        }
    });
    return rules;
}

function parentsMatch(parents, ancestors) {
    let i = ancestors.length - 1;
    for (let p = parents.length - 1; p >= 0; p--) {
        while (i >= 0 && !scopeMatches(parents[p], ancestors[i])) i--;
        if (i < 0) return false;
        i--;
    }
    return true;
}

function compareScores(a, b) {
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return 0;
}

// Resolves one attribute the way VS Code does: the innermost scope with a
// matching rule wins; among rules for that scope the more specific selector
// (longer leaf, then more parent scopes) wins, and later rules break ties.
function resolveAttribute(rules, scopes, attribute) {
    for (let depth = scopes.length - 1; depth >= 0; depth--) {
        let best = null;
        for (const rule of rules) {
            if (rule.settings[attribute] === undefined) continue;
            if (!scopeMatches(rule.leaf, scopes[depth])) continue;
            if (!parentsMatch(rule.parents, scopes.slice(0, depth))) continue;
            const score = [rule.leaf.split('.').length, rule.parents.length, rule.order];
            if (!best || compareScores(score, best.score) > 0) best = { score, value: rule.settings[attribute] };
        }
        if (best) return best.value;
    }
    return undefined;
}

function textMateStyle(rules, stack) {
    const scopes = stack.split(/\s+/);
    return {
        foreground: resolveAttribute(rules, scopes, 'foreground'),
        fontStyle: resolveAttribute(rules, scopes, 'fontStyle'),
    };
}

function semanticStyle(semanticTokenColors, selector) {
    const value = (semanticTokenColors || {})[selector];
    if (!value) return null;
    if (typeof value === 'string') return { foreground: value };
    const flags = ['bold', 'italic', 'underline'].filter((flag) => value[flag]);
    return {
        foreground: value.foreground,
        fontStyle: value.fontStyle !== undefined ? value.fontStyle : flags.length ? flags.join(' ') : undefined,
    };
}

function toHighlight(style) {
    const highlight = {};
    if (style.foreground) highlight.color = normalize(style.foreground);
    const fontStyle = (style.fontStyle || '').split(/\s+/);
    if (fontStyle.includes('italic')) highlight.font_style = 'italic';
    if (fontStyle.includes('bold')) highlight.font_weight = 700;
    return Object.keys(highlight).length ? highlight : null;
}

function buildSyntax(theme) {
    const rules = compileRules(theme.tokenColors || []);
    const syntax = {};
    for (const [capture, entry] of Object.entries(SYNTAX_MAP)) {
        const { sem, tm = [] } = Array.isArray(entry) ? { tm: entry } : entry;
        let style = {};
        for (const stack of tm) {
            const candidate = textMateStyle(rules, stack);
            if (candidate.foreground !== undefined || candidate.fontStyle !== undefined) {
                style = candidate;
                break;
            }
        }
        const semantic = sem && semanticStyle(theme.semanticTokenColors, sem);
        if (semantic) {
            style = {
                foreground: semantic.foreground !== undefined ? semantic.foreground : style.foreground,
                fontStyle: semantic.fontStyle !== undefined ? semantic.fontStyle : style.fontStyle,
            };
        }
        const highlight = toHighlight(style);
        if (highlight) syntax[capture] = highlight;
    }
    return syntax;
}

// --- UI colors ---------------------------------------------------------------

function buildStyle(theme) {
    const colors = theme.colors || {};
    const pick = (...keys) => {
        for (const key of keys) if (colors[key]) return normalize(colors[key]);
        return null;
    };

    const syntax = buildSyntax(theme);

    const editorBg = pick('editor.background');
    const editorFg = pick('editor.foreground');
    if (!editorBg || !editorFg) throw new Error(`${theme.name}: editor.background and editor.foreground are required`);

    const frameBg = pick('editorGroupHeader.tabsBackground', 'statusBar.background') || editorBg;
    const panelBg = pick('sideBar.background') || editorBg;
    const border = pick('editorGroup.border', 'panel.border', 'sideBar.border') || frameBg;
    const focusBorder = pick('focusBorder') || border;

    const elevatedBg = pick('editorHoverWidget.background', 'editorWidget.background') || panelBg;
    const statusBarBg = pick('statusBar.background') || frameBg;
    const titleBarBg = pick('titleBar.activeBackground') || frameBg;
    const tabBarBg = pick('editorGroupHeader.tabsBackground') || frameBg;
    const inactiveTabBg = pick('tab.inactiveBackground') || frameBg;
    const activeTabBg = pick('tab.activeBackground') || editorBg;
    const hover = pick('list.hoverBackground', 'list.activeSelectionBackground') || editorBg;
    const selected = pick('list.activeSelectionBackground', 'list.hoverBackground') || hover;
    const selection = pick('editor.selectionBackground') || selected;

    // VS Code has no "muted text" color, so dim the main text, but only as far
    // as it stays readable on every surface Zed draws secondary labels on.
    const text = pick('foreground', 'sideBar.foreground') || editorFg;
    const surfaces = [editorBg, panelBg, elevatedBg, statusBarBg, titleBarBg, tabBarBg, inactiveTabBg, activeTabBg, hover, selected];
    const textMuted = dimText(text, editorBg, 0.3, surfaces);
    const textPlaceholder = pick('input.placeholderForeground') || mix(text, editorBg, 0.5);
    const textDisabled = pick('disabledForeground') || mix(text, editorBg, 0.6);
    const textAccent = pick('list.highlightForeground', 'textLink.foreground') || focusBorder;
    const cursor = pick('editorCursor.foreground') || editorFg;
    const comment = (syntax.comment && syntax.comment.color) || textMuted;

    const lineNumber = pick('editorLineNumber.foreground') || textDisabled;
    const scrollbarThumb = pick('scrollbarSlider.background') || withAlpha(text, 0.3);
    const scrollbarHover = pick('scrollbarSlider.hoverBackground') || scrollbarThumb;
    const scrollbarActive = pick('scrollbarSlider.activeBackground') || scrollbarHover;

    // Zed can't outline the current search match like VS Code's findMatchBorder
    // does, so when both match backgrounds are the same, tint the current one
    // with the border color instead.
    const matchBg = pick('editor.findMatchHighlightBackground', 'editor.findMatchBackground') || selection;
    let activeMatchBg = pick('editor.findMatchBackground') || matchBg;
    const matchBorder = pick('editor.findMatchBorder');
    if (activeMatchBg === matchBg && matchBorder) activeMatchBg = withAlpha(matchBorder, 0.4);

    const added = pick('gitDecoration.addedResourceForeground', 'editorGutter.addedBackground', 'terminal.ansiGreen');
    const modified = pick('gitDecoration.modifiedResourceForeground', 'editorGutter.modifiedBackground', 'terminal.ansiYellow');
    const deleted = pick('gitDecoration.deletedResourceForeground', 'editorGutter.deletedBackground', 'terminal.ansiRed');
    const error = pick('editorError.foreground', 'errorForeground', 'terminal.ansiRed');
    const warning = pick('editorWarning.foreground', 'terminal.ansiYellow');
    const ignored = pick('gitDecoration.ignoredResourceForeground') || textDisabled;
    const hint = pick('editorHint.foreground', 'editorInlayHint.foreground') || comment;
    const predictive = pick('editorGhostText.foreground') || comment;

    const status = {
        conflict: pick('gitDecoration.conflictingResourceForeground') || warning,
        created: added,
        deleted,
        error,
        hidden: ignored,
        hint,
        ignored,
        info: pick('editorInfo.foreground', 'activityBarBadge.background', 'terminal.ansiBlue'),
        modified,
        predictive,
        renamed: pick('gitDecoration.renamedResourceForeground', 'terminal.ansiCyan'),
        success: added,
        unreachable: comment,
        warning,
    };

    const style = {
        'border': border,
        'border.variant': pick('sideBar.border', 'panel.border') || border,
        'border.focused': focusBorder,
        'border.selected': focusBorder,
        'border.transparent': TRANSPARENT,
        'border.disabled': border,
        'elevated_surface.background': elevatedBg,
        'surface.background': panelBg,
        'background': frameBg,
        'element.background': pick('button.background', 'input.background') || panelBg,
        'element.hover': hover,
        'element.active': selected,
        'element.selected': selected,
        'element.disabled': pick('input.background') || panelBg,
        'element.selection_background': selection,
        'drop_target.background': pick('list.dropBackground') || withAlpha(selection, 0.5),
        'drop_target.border': focusBorder,
        'ghost_element.background': TRANSPARENT,
        'ghost_element.hover': hover,
        'ghost_element.active': selected,
        'ghost_element.selected': selected,
        'ghost_element.disabled': TRANSPARENT,
        'text': text,
        'text.muted': textMuted,
        'text.placeholder': textPlaceholder,
        'text.disabled': textDisabled,
        'text.accent': textAccent,
        'icon': text,
        'icon.muted': textMuted,
        'icon.disabled': textDisabled,
        'icon.placeholder': textPlaceholder,
        'icon.accent': textAccent,
        'debugger.accent': pick('debugIcon.breakpointForeground') || error,
        'status_bar.background': statusBarBg,
        'title_bar.background': titleBarBg,
        'title_bar.inactive_background': pick('titleBar.inactiveBackground') || titleBarBg,
        'toolbar.background': pick('breadcrumb.background') || editorBg,
        'tab_bar.background': tabBarBg,
        'tab.inactive_background': inactiveTabBg,
        'tab.active_background': activeTabBg,
        'search.match_background': matchBg,
        'search.active_match_background': activeMatchBg,
        'panel.background': panelBg,
        'panel.focused_border': focusBorder,
        'panel.indent_guide': pick('tree.indentGuidesStroke', 'editorIndentGuide.background1', 'editorIndentGuide.background'),
        'panel.indent_guide_hover': pick('editorIndentGuide.activeBackground1', 'editorIndentGuide.activeBackground'),
        'panel.indent_guide_active': pick('editorIndentGuide.activeBackground1', 'editorIndentGuide.activeBackground'),
        'pane.focused_border': focusBorder,
        'pane_group.border': border,
        'scrollbar.thumb.background': scrollbarThumb,
        'scrollbar.thumb.hover_background': scrollbarHover,
        'scrollbar.thumb.active_background': scrollbarActive,
        'scrollbar.thumb.border': TRANSPARENT,
        'scrollbar.track.background': TRANSPARENT,
        'scrollbar.track.border': TRANSPARENT,
        'minimap.thumb.background': pick('minimapSlider.background') || scrollbarThumb,
        'minimap.thumb.hover_background': pick('minimapSlider.hoverBackground') || scrollbarHover,
        'minimap.thumb.active_background': pick('minimapSlider.activeBackground') || scrollbarActive,
        'minimap.thumb.border': TRANSPARENT,
        'editor.foreground': editorFg,
        'editor.background': editorBg,
        'editor.gutter.background': pick('editorGutter.background') || editorBg,
        'editor.subheader.background': pick('sideBarSectionHeader.background') || panelBg,
        'editor.active_line.background': pick('editor.lineHighlightBackground'),
        'editor.highlighted_line.background': pick('editor.rangeHighlightBackground', 'editor.lineHighlightBackground'),
        'editor.debugger_active_line.background': pick('editor.stackFrameHighlightBackground') || withAlpha(warning, 0.15),
        'editor.line_number': lineNumber,
        'editor.active_line_number': pick('editorLineNumber.activeForeground') || editorFg,
        'editor.hover_line_number': mix(lineNumber, editorFg, 0.5),
        'editor.invisible': pick('editorWhitespace.foreground', 'editorIndentGuide.activeBackground1', 'editorIndentGuide.activeBackground') || lineNumber,
        'editor.wrap_guide': pick('editorRuler.foreground'),
        'editor.active_wrap_guide': pick('editorRuler.foreground'),
        'editor.indent_guide': pick('editorIndentGuide.background1', 'editorIndentGuide.background'),
        'editor.indent_guide_active': pick('editorIndentGuide.activeBackground1', 'editorIndentGuide.activeBackground'),
        'editor.document_highlight.read_background': pick('editor.wordHighlightBackground'),
        'editor.document_highlight.write_background': pick('editor.wordHighlightStrongBackground', 'editor.wordHighlightBackground'),
        'editor.document_highlight.bracket_background': pick('editorBracketMatch.background'),
        'editor.code_lens.foreground': pick('editorCodeLens.foreground') || hint,
        'link_text.hover': pick('textLink.activeForeground', 'textLink.foreground') || textAccent,
        'version_control.added': added,
        'version_control.modified': modified,
        'version_control.deleted': deleted,
        'version_control.renamed': status.renamed,
        'version_control.conflict': status.conflict,
        'version_control.ignored': ignored,
        'version_control.word_added': added && withAlpha(added, 0.35),
        'version_control.word_deleted': deleted && withAlpha(deleted, 0.35),
        'version_control.conflict_marker.ours': added && withAlpha(added, 0.1),
        'version_control.conflict_marker.theirs': status.info && withAlpha(status.info, 0.1),
    };

    const terminalBg = pick('terminal.background') || editorBg;
    const terminalFg = pick('terminal.foreground') || editorFg;
    Object.assign(style, {
        'terminal.background': terminalBg,
        'terminal.foreground': terminalFg,
        'terminal.bright_foreground': pick('terminal.ansiBrightWhite') || terminalFg,
        'terminal.dim_foreground': mix(terminalFg, terminalBg, 0.4),
        'terminal.ansi.background': terminalBg,
    });
    for (const name of ANSI_COLORS) {
        const key = name[0].toUpperCase() + name.slice(1);
        const normal = pick(`terminal.ansi${key}`);
        if (!normal) continue;
        style[`terminal.ansi.${name}`] = normal;
        style[`terminal.ansi.bright_${name}`] = pick(`terminal.ansiBright${key}`) || normal;
        style[`terminal.ansi.dim_${name}`] = mix(normal, terminalBg, 0.35);
    }

    for (const [name, color] of Object.entries(status)) {
        if (!color) continue;
        style[name] = color;
        style[`${name}.background`] = withAlpha(color, 0.1);
        style[`${name}.border`] = mix(color, editorBg, 0.6);
    }
    style['hint.background'] = pick('editorInlayHint.background') || style['hint.background'];

    for (const [key, value] of Object.entries(style)) if (!value) delete style[key];

    // Rainbow brackets in Zed use the accent colors.
    const accents = [1, 2, 3, 4, 5, 6].map((n) => pick(`editorBracketHighlight.foreground${n}`)).filter(Boolean);
    if (accents.length) style.accents = accents;

    // The first player is the local user; the rest color collaborators' cursors.
    const collaborators = [...accents, pick('terminal.ansiCyan'), pick('terminal.ansiGreen')].filter(Boolean);
    style.players = [
        { cursor, background: cursor, selection },
        ...collaborators.slice(0, 7).map((color) => ({ cursor: color, background: color, selection: withAlpha(color, 0.24) })),
    ];

    syntax.hint = { color: hint };
    syntax.predictive = { color: predictive, font_style: 'italic' };
    syntax.primary = { color: editorFg };
    style.syntax = sortKeys(syntax);
    return style;
}

const sortKeys = (object) => Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)));

// --- Output ------------------------------------------------------------------

const APPEARANCE = { 'vs': 'light', 'hc-light': 'light', 'vs-dark': 'dark', 'hc-black': 'dark' };

function main() {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    const themes = pkg.contributes.themes.map((entry) => {
        const theme = JSON.parse(fs.readFileSync(path.join(ROOT, entry.path), 'utf8'));
        const appearance = APPEARANCE[entry.uiTheme];
        if (!appearance) throw new Error(`${entry.label}: unknown uiTheme "${entry.uiTheme}"`);
        return { name: entry.label, appearance, style: buildStyle(theme) };
    });

    const family = { $schema: SCHEMA, name: FAMILY_NAME, author: AUTHOR, themes };

    const manifest = [
        `id = ${JSON.stringify(EXTENSION_ID)}`,
        `name = ${JSON.stringify(FAMILY_NAME)}`,
        `version = ${JSON.stringify(pkg.version)}`,
        'schema_version = 1',
        `authors = [${JSON.stringify(AUTHOR)}]`,
        `description = ${JSON.stringify(pkg.description)}`,
        `repository = ${JSON.stringify(pkg.repository.url)}`,
        '',
    ].join('\n');

    fs.mkdirSync(path.join(ZED_DIR, 'themes'), { recursive: true });
    fs.writeFileSync(path.join(ZED_DIR, 'themes', 'neutralflow.json'), JSON.stringify(family, null, 4) + '\n');
    fs.writeFileSync(path.join(ZED_DIR, 'extension.toml'), manifest);
    // Zed's registry only accepts a license inside the extension directory itself.
    fs.copyFileSync(path.join(ROOT, 'LICENSE'), path.join(ZED_DIR, 'LICENSE'));

    for (const theme of themes) {
        const uiKeys = Object.keys(theme.style).filter((key) => !['syntax', 'players', 'accents'].includes(key));
        console.log(`${theme.name}: ${uiKeys.length} UI colors, ${Object.keys(theme.style.syntax).length} syntax styles`);
    }
    console.log(`Wrote ${path.relative(ROOT, ZED_DIR)}/ (extension v${pkg.version})`);
}

main();
