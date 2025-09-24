# `require` with CommonJS/VanillaJS and `import` after ES6

The difference between **`require`** and **`import`** in Node.js

## 1. `require` (CommonJS)

### Overview

* **Module system:** CommonJS
* **Default in:** Older versions of Node.js (pre–ES modules).
* **Synchronous:** Loads modules at runtime.

### Syntax

```js
// Import entire module
const fs = require('fs');

// Import specific export from a custom file
const math = require('./math');
const sum = math.add(2, 3);
```

### Exporting

```js
// math.js
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
```

### Key Points

* Executes at runtime, so you can use it conditionally:

  ```js
  if (condition) {
    const special = require('./special');
  }
  ```
* Works in all Node versions without extra configuration.

---

## 2. `import` (ES Modules)

### Overview

* **Module system:** ES Modules (ESM).

* **Default in:** Modern JavaScript and supported in Node.js when you:

  * Use `.mjs` file extension, **or**
  * Set `"type": "module"` in `package.json`.

* **Static:** Resolved at compile time.

### Syntax

```js
// Import named exports
import { add } from './math.js';

// Import default export
import subtract from './subtract.js';

// Import everything
import * as math from './math.js';
```

### Exporting

```js
// math.js
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }

// Or default export
export default function multiply(a, b) { return a * b; }
```

### Key Points

* **Top-level only:** You cannot conditionally `import` inside blocks without using dynamic `import()`.
* Better support for **tree-shaking** (removing unused code during bundling).
* Aligns with modern JavaScript standards (browser and Node).

---

## 3. Side-by-Side Comparison

| Feature             | `require` (CommonJS)             | `import` (ES Modules)                  |
| ------------------- | -------------------------------- | -------------------------------------- |
| Module type         | CommonJS                         | ES Modules                             |
| File extension      | `.js` (default)                  | `.mjs` or `.js` with `"type":"module"` |
| Loading time        | Runtime (synchronous)            | Compile time (static)                  |
| Conditional loading | Allowed                          | Not directly (use `import()` function) |
| Exports syntax      | `module.exports` / `exports.foo` | `export` / `export default`            |
| Tree-shaking        | Not supported                    | Supported                              |
| Standard            | Node-specific (legacy)           | ECMAScript standard                    |

---

## 4. Dynamic `import()`

ES Modules also support **dynamic import**, which behaves like `require`:

```js
const module = await import('./math.js');
console.log(module.add(2, 3));
```

* Returns a promise.
* Useful for conditional or lazy loading.

---

## Practical Recommendation

* **New projects:** Prefer `import` (ESM) for future compatibility and modern tooling.
* **Existing CommonJS projects:** Continue with `require` unless you plan to migrate.

---

### Quick Example in the Same Project

**package.json**

```json
{
  "type": "module"
}
```

**math.js**

```js
export function add(a, b) { return a + b; }
```

**index.js**

```js
import { add } from './math.js';
console.log(add(2, 3));
```

Run:

```bash
node index.js
```

This uses ES Modules (`import`) instead of CommonJS (`require`).

