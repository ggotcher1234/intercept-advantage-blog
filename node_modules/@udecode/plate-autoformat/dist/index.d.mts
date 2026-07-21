import { A as AutoformatConfig, a as AutoformatRule, b as AutoformatBlockRule, c as AutoformatMarkRule, d as AutoformatTextRule, M as MatchRange } from './BaseAutoformatPlugin-Cn7eN8JL.mjs';
export { e as AutoformatCommonRule, f as AutoformatQueryOptions, B as BaseAutoformatPlugin, G as GetMatchPointsReturnType, g as getMatchPoints } from './BaseAutoformatPlugin-Cn7eN8JL.mjs';
import { OverrideEditor, SlateEditor, Editor, TLocation } from '@udecode/plate';
import '@udecode/plate-core';

/**
 * Enables support for autoformatting actions. Once a match rule is validated,
 * it does not check the following rules.
 */
declare const withAutoformat: OverrideEditor<AutoformatConfig>;

declare const autoformatArrow: AutoformatRule[];

declare const autoformatLegal: AutoformatRule[];
declare const autoformatLegalHtml: AutoformatRule[];

declare const autoformatPunctuation: AutoformatRule[];

declare const autoformatSmartQuotes: AutoformatRule[];

declare const autoformatComparison: AutoformatRule[];

declare const autoformatEquality: AutoformatRule[];

declare const autoformatFraction: AutoformatRule[];

declare const autoformatMath: AutoformatRule[];

declare const autoformatDivision: AutoformatRule[];
declare const autoformatOperation: AutoformatRule[];

declare const autoformatSubscriptNumbers: AutoformatRule[];
declare const autoformatSubscriptSymbols: AutoformatRule[];

declare const autoformatSuperscriptNumbers: AutoformatRule[];
declare const autoformatSuperscriptSymbols: AutoformatRule[];

interface AutoformatBlockOptions extends AutoformatBlockRule {
    text: string;
}
declare const autoformatBlock: (editor: SlateEditor, { allowSameTypeAbove, format, match: _match, matchByRegex, preFormat, text, trigger, triggerAtBlockStart, type, }: AutoformatBlockOptions) => boolean;

interface AutoformatMarkOptions extends AutoformatMarkRule {
    text: string;
}
declare const autoformatMark: (editor: Editor, { ignoreTrim, match: _match, text, trigger, type }: AutoformatMarkOptions) => boolean;

interface AutoformatTextOptions extends AutoformatTextRule {
    text: string;
}
declare const autoformatText: (editor: SlateEditor, { format, match: _match, text, trigger }: AutoformatTextOptions) => boolean;

declare const getMatchRange: ({ match, trigger, }: {
    match: MatchRange | string;
    trigger: AutoformatRule["trigger"];
}) => {
    end: string;
    start: string;
    triggers: string[];
};

declare const isPreviousCharacterEmpty: (editor: Editor, at: TLocation) => boolean;

export { type AutoformatBlockOptions, AutoformatBlockRule, AutoformatConfig, type AutoformatMarkOptions, AutoformatMarkRule, AutoformatRule, type AutoformatTextOptions, AutoformatTextRule, MatchRange, autoformatArrow, autoformatBlock, autoformatComparison, autoformatDivision, autoformatEquality, autoformatFraction, autoformatLegal, autoformatLegalHtml, autoformatMark, autoformatMath, autoformatOperation, autoformatPunctuation, autoformatSmartQuotes, autoformatSubscriptNumbers, autoformatSubscriptSymbols, autoformatSuperscriptNumbers, autoformatSuperscriptSymbols, autoformatText, getMatchRange, isPreviousCharacterEmpty, withAutoformat };
