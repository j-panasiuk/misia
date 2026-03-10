// @ts-check

import { toMathML } from "./math-expr-renderer.js";

/**
 * Renders an exercise instruction (mixed text and math) to HTML.
 * @param {ContentSegment[]} instruction - Array of content segments
 * @returns {string} HTML markup
 * @example
 * renderInstruction([
 *   { type: "text", content: "Calculate " },
 *   { type: "math", expr: { type: "num", value: 5 } }
 * ])
 * // Returns: "Calculate <math><mn>5</mn></math>"
 */
export function renderInstruction(instruction) {
  return instruction
    .map((segment) => {
      if (typeof segment === "string") {
        return segment;
      } else if (segment.type === "math") {
        const mathML = toMathML(segment.expr);
        const display = segment.display ? 'display="block"' : "";
        return `<math ${display}><mrow>${mathML}</mrow></math>`;
      }
    })
    .join("");
}

/**
 * Renders mathematical expression to HTML.
 * @param {MathExpr} expr
 * @param {'='|undefined} [trailing]
 * @returns {string} HTML markup
 */
export function renderExpression(expr, trailing) {
  let html = `<math display="block"><mrow>`;
  html += toMathML(expr) + (trailing ? `<mo>${trailing}</mo>` : "");
  html += `</mrow></math>`;
  return html;
}

/**
 * Renders intermediate exercise steps to HTML.
 * @param {Exclude<Exercise['steps'], undefined>} steps
 * @returns {string} HTML markup
 */
export function renderSteps(steps) {
  return steps
    .map((step) => {
      let html = `<step>`;
      html += renderExpression(step, "=");
      html += `</step>`;
      return html;
    })
    .join("");
}

/**
 * Renders exercise answer to HTML.
 * @param {Exercise['answer']} answer
 * @returns {string} HTML markup
 */
export function renderAnswer(answer) {
  return typeof answer === "object"
    ? `<math display="block"><mrow>${toMathML(answer)}</mrow>`
    : String(answer);
}
