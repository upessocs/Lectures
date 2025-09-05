
### Lecture Hour 4: Filters*

**Objective:** Use filters to format data in the view without changing the underlying model.

**1. Basic Usage of Filters**
- Filters format the value of an expression for display to the user. They can be used in templates, controllers, or services.
- Syntax: `{{ expression | filterName:argument1:argument2... }}`
- **Common Built-in Filters:**
    *   **`currency`:** Format a number as a currency. `{{ 123.456 | currency }}` -> `$123.46`
    *   **`date`:** Format a date to a string. `{{ today | date:'fullDate' }}`
    *   **`filter`:** Select a subset of items from an array. Powerful for search functionality.
    *   **`json`:** Format an object as a JSON string. Great for debugging.
    *   **`limitTo`:** Limits an array/string to a specified number of elements/characters.
    *   **`lowercase` / `uppercase`**
    *   **`orderBy`:** Orders an array by an expression. `item in items | orderBy:'price'`

**2. Chaining Filters**
You can chain multiple filters together.
```html
<!-- Search for items, then order them by price, then format the price -->
<li ng-repeat="item in items | filter:searchText | orderBy:'price'">
    {{ item.name }} - {{ item.price | currency }}
</li>
<input type="text" ng-model="searchText" placeholder="Search items...">
```

---

Got it. Your notes are solid — I’ll refine them, make them more structured, and add a **summary table of AngularJS filters with use cases** for quick reference.

---



* **Definition:** Filters take input data and return a **formatted output** for display.
* **Where to use:** Templates (most common), Controllers, Services.
* **Syntax:**

  ```html
  {{ expression | filterName:arg1:arg2... }}
  ```

---

Common Built-in Filters (with Examples)

| **Filter**  | **Purpose**            | **Example**                | **Output / Use Case**                                        |
| ----------- | ----------------------- | -------------------------- | --------------------------------------------- |
| `currency`  | Format a number as currency                | \`{{ 123.456               \| currency }}\`         | `$123.46` (default USD, customizable) |
| `date`      | Format a date as string                    | \`{{ today                 \| date:'fullDate' }}\`  | `Tuesday, September 5, 2025`          |
| `filter`    | Returns subset of items (search/filter)    | \`ng-repeat="item in items \| filter\:searchText"\` | Live search bar functionality         |
| `json`      | Converts object to JSON string (debugging) | \`{{ obj                   \| json }}\`             | Pretty-printed object                 |
| `limitTo`   | Limits array/string length                 | \`{{ 'AngularJS'           \| limitTo:4 }}\`        | `Angu`                                |
| `lowercase` | Converts string to lowercase               | \`{{ 'HELLO'               \| lowercase }}\`        | `hello`                               |
| `uppercase` | Converts string to uppercase               | \`{{ 'hello'               \| uppercase }}\`        | `HELLO`                               |
| `number`    | Formats a number with fixed decimals       | \`{{ 1234.567              \| number:2 }}\`         | `1,234.57`                            |
| `orderBy`   | Sorts array by expression                  | \`item in items            \| orderBy:'price'\`     | Items ordered by price                |

---

## 3. Chaining Filters

Multiple filters can be combined to refine output.

```html
<!-- Search for items, order them by price, then format price -->
<li ng-repeat="item in items | filter:searchText | orderBy:'price'">
  {{ item.name }} - {{ item.price | currency }}
</li>

<input type="text" ng-model="searchText" placeholder="Search items...">
```

**Explanation:**

1. `filter:searchText` → filters items based on input.
2. `orderBy:'price'` → sorts the results.
3. `currency` → formats price.

---

## 4. Use Cases

* **Currency & number:** Showing prices, financial dashboards.
* **Date:** Displaying timestamps in readable formats.
* **Filter & orderBy:** Implementing search + sort in lists/tables.
* **JSON:** Debugging complex objects during development.
* **LimitTo:** Pagination, trimming text for previews.
* **Uppercase/lowercase:** Consistent formatting for names, tags, etc.



