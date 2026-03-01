// @ts-check

import { toMathML } from "./math-expr-renderer";

/**
 * Renders a complete exercise to HTML.
 *
 * @param {import("./exercise").Exercise} exercise
 * @returns {string} HTML markup
 */
export function renderExercise(exercise) {
  const instructionHTML = renderInstruction(exercise.instruction);

  let html = `<div class="exercise">
    <div class="instruction">${instructionHTML}</div>`;

  if (exercise.primaryExpr) {
    const mathML = toMathML(exercise.primaryExpr);
    html += `<div class="primary-expr"><math display="block"><mrow>${mathML}</mrow></math></div>`;
  }

  html += `</div>`;
  return html;
}

/**
 * Renders an exercise instruction (mixed text and math) to HTML.
 *
 * @param {import("./exercise").ContentSegment[]} instruction - Array of content segments
 * @returns {string} HTML markup
 *
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
