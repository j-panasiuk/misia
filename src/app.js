// @ts-check

/**
 * @type {Map<string, HTMLTemplateElement>}
 */
const templates = new Map();

for (const el of document.querySelectorAll("template")) {
  if (!el.id) throw new Error(`missing template id: ${el.id}`);
  if (templates.has(el.id)) throw new Error(`duplicate template id: ${el.id}`);
  templates.set(el.id, el);
}

customElements.define(
  "math-exercise",
  class extends HTMLElement {
    static observedAttributes = ["exercise"];

    connectedCallback() {
      const exercise = this.#exercise;
      console.log("connected", this);
      this.#render(exercise);
    }

    /**
     * @param {string} name
     * @param {string | null} oldValue
     * @param {string | null} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
      console.log("changed", name, oldValue, newValue);
      if (name !== "exercise") return;
      this.#render(newValue);
    }

    /**
     * @returns {string | null}
     */
    get #exercise() {
      // const val = this.getAttribute("exercise");
      const lastId = Array.from(templates.keys()).at(-1);
      const val = lastId ?? null;
      return val;
    }

    /**
     * @param {string} exercise
     * @returns {HTMLTemplateElement | undefined}
     */
    #template(exercise) {
      const el = templates.get(exercise);
      return el;
    }

    /**
     * @param {string | null} exercise
     */
    #render(exercise) {
      if (!exercise) return;

      const template = this.#template(exercise);
      if (!(template instanceof HTMLTemplateElement)) return;

      const el = template.content.cloneNode(true);
      this.replaceChildren(el);
    }
  },
);
