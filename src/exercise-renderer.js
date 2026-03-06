// @ts-check

import { toMathML } from "./math-expr-renderer";

/**
 * Renders a complete exercise to HTML.
 * @param {Exercise} exercise
 * @param {Solved|undefined} [solved]
 * @returns {string} HTML markup
 */
export function renderExercise(exercise, solved) {
  const instructionHTML = renderInstruction(exercise.instruction);

  let html = `<exercise>
    <instruction>${instructionHTML}</instruction>`;

  if (exercise.primaryExpr) {
    const mathML = toMathML(exercise.primaryExpr);
    html += `<expression><math display="block"><mrow>${mathML}</mrow></math></expression>`;
  }

  if (solved) {
    const answer =
      typeof exercise.answer === "object"
        ? `<math display="block"><mrow>${toMathML(exercise.answer)}</mrow>`
        : exercise.answer;
    html += `<answer style="font-size: 2rem">${answer}</answer>`;
  }

  html += `</exercise>`;
  return html;
}

/**
 * Renders mathematical expression to HTML.
 * @param {MathExpr} expr
 * @returns {string} HTML markup
 */
export function renderExpression(expr) {
  return `<math display="block"><mrow>${toMathML(expr)}</mrow></math>`;
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
function renderInstruction(instruction) {
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
