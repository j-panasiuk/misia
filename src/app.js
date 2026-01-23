// @ts-check

// -- DEFINE EXERCISES --

/**
 * Exercise number followed by exercise letter
 * @typedef {`${number}${string}`} Exercise
 * @example "5a", "12c"
 */

/**
 * Check if input matches exercise format ("5a" etc)
 * @param {unknown} val
 * @returns {val is Exercise}
 */
function isExercise(val) {
  return typeof val === "string" && /^[0-9]+[a-z]$/.test(val);
}

/**
 * Attribute to track current exercise. Same for:
 * - DOM attributes
 * - URL search param
 */
const EXERCISE = "exercise";

/**
 *
 * @type {Map<Exercise, HTMLTemplateElement>}
 */
const templates = new Map();

// Load all exercise templates into global cache
for (const el of document.querySelectorAll("template")) {
  const ex = el.getAttribute(EXERCISE);

  if (!ex) throw new Error(`missing exercise attr: ${ex}`);
  if (!isExercise(ex)) throw new Error(`invalid exercise attr: ${ex}`);
  if (templates.has(ex)) throw new Error(`duplicate exercise attr: ${ex}`);

  templates.set(ex, el);
}

// -- DEFINE PROGRESSION --

/**
 * Define order of exercises
 * @type {Exercise[]}
 */
const progression = Array.from(templates.keys()).sort();
if (!progression.length) throw new Error(`no exercises found: ${progression}`);

// -- SETUP  --

class MathExercises extends HTMLElement {
  constructor() {
    super();
    this.handleKeyUp = this.#handleKeyUp.bind(this);
  }

  connectedCallback() {
    console.log("connected", this);
    this.#render();
    window.addEventListener("keypress", this.handleKeyUp);
  }

  disconnectedCallback() {
    window.removeEventListener("keypress", this.handleKeyUp);
  }

  #handleKeyUp(/** @type {KeyboardEvent} */ evt) {
    console.log("keyup", evt.key);
    if (evt.key === " ") {
      this.#render();
    }
  }

  #render() {
    const searchParams = new URLSearchParams(location.search);
    const exercise = searchParams.get(EXERCISE);

    if (!exercise) {
      const firstExercise = /** @type {Exercise} */ (progression[0]);
      console.log("setting default exercise", firstExercise);
      let url = new URL(location.href);
      url.searchParams.set(EXERCISE, firstExercise);
      return location.replace(url);
    }

    if (!isExercise(exercise)) {
      throw new Error(`invalid exercise search param: ${exercise}`);
    }
    if (!progression.includes(exercise)) {
      throw new Error(
        `unknown exercise: ${exercise} (not matching any template)`,
      );
    }

    this.#renderExercise(exercise);
    this.#renderHeader(exercise);
    this.#renderFooter(exercise);
  }

  #renderExercise(/** @type {Exercise} */ exercise) {
    const template = templates.get(exercise);
    if (!(template instanceof HTMLTemplateElement))
      throw new Error(
        `unexpected template ${template} for exercise ${exercise} (expected HTMLTemplateElement)`,
      );

    const node = /** @type {Element} */ (template.content.cloneNode(true));

    for (const mn of node.querySelectorAll("mn")) {
      mn.textContent = String(Math.ceil(12 * Math.random()));
    }

    this.$("main").replaceChildren(node);
  }

  #renderHeader(/** @type {Exercise} */ currentExercise) {
    const links = progression.map((ex) => {
      let url = new URL(location.href);
      url.searchParams.set(EXERCISE, ex);

      let link = document.createElement("a");
      link.innerText = ex;
      link.href = url.href;
      if (ex === currentExercise) link.setAttribute("aria-current", "page");
      return link;
    });

    this.$("header > nav").replaceChildren(...links);
  }

  #renderFooter(/** @type {Exercise} */ currentExercise) {
    const actions = [-1, 1].map((step) => {
      const targetIndex = progression.indexOf(currentExercise) + step;
      const targetExercise = progression[targetIndex];
      if (!targetExercise) return;

      let url = new URL(location.href);
      url.searchParams.set(EXERCISE, targetExercise);

      let link = document.createElement("a");
      link.innerText = step < 0 ? "←" : "→";
      link.href = url.href;
      return link;
    });

    this.$("footer > nav").replaceChildren(
      ...actions.filter((el) => el instanceof HTMLAnchorElement),
    );
  }

  // -- HELPERS --

  /**
   * @param {"main" | "header > nav" | "footer > nav"} selector
   * @returns element matching selector
   * @throws when element not found
   */
  $(selector) {
    const el = this.querySelector(selector);
    if (!el) throw new Error(`"${selector}" element is missing!`);
    return el;
  }
}

customElements.define("math-exercises", MathExercises);
