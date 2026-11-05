// Accepted for local independent review only. Production activation is not authorized.
export default [
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0201",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Operators & expressions",
    "subtopic": "concatenation-arithmetic-precedence-php8",
    "objective": {
      "id": "concatenation-arithmetic-precedence-php8",
      "text": "Apply PHP 8 precedence between arithmetic addition and string concatenation."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Group a single expression using the current language precedence rules."
    },
    "prerequisites": [
      "Addition",
      "String concatenation",
      "PHP 8 operator precedence"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$left = 2;\n$right = 3;\n\necho 'total=' . $left + $right;\n"
        }
      ]
    },
    "stem": "What text is printed on the stated PHP 8.4/8.5 runtimes?",
    "options": [
      {
        "id": "sum",
        "text": "total=5",
        "rationale": "Addition binds more tightly than concatenation, so the numeric sum is concatenated.",
        "misconception": null
      },
      {
        "id": "append",
        "text": "total=23",
        "rationale": "The plus operator still performs arithmetic rather than string concatenation.",
        "misconception": "Treating both operators as concatenation because the expression begins with a string."
      },
      {
        "id": "type-error",
        "text": "An uncaught TypeError",
        "rationale": "PHP 8 groups the addition before concatenating the label, so no nonnumeric string reaches +.",
        "misconception": "Applying the pre-PHP-8 left-associative grouping of concatenation and addition."
      },
      {
        "id": "numeric-only",
        "text": "5",
        "rationale": "The label is concatenated after the addition and is not discarded.",
        "misconception": "Assuming arithmetic determines the type of the entire unparenthesized expression."
      }
    ],
    "correctOptionId": "sum",
    "explanation": {
      "summary": "Since PHP 8, concatenation has lower precedence than addition. The expression groups as the label concatenated with ($left + $right).",
      "trace": "2 + 3 produces integer 5. Concatenating it with total= produces total=5."
    },
    "validation": {
      "kind": "output",
      "stdout": "total=5",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.precedence.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0202",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Control flow & pattern matching",
    "subtopic": "do-while-first-iteration",
    "objective": {
      "id": "do-while-first-iteration",
      "text": "Distinguish postcondition loops from precondition loops."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Compare where two loop forms perform their first condition check."
    },
    "prerequisites": [
      "while",
      "do while",
      "Increment",
      "Comparison"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$before = 0;\n$after = 0;\n\nwhile ($before < 0) {\n    $before++;\n}\n\ndo {\n    $after++;\n} while ($after < 0);\n\necho json_encode([$before, $after]);\n"
        }
      ]
    },
    "stem": "What JSON pair is printed by these loops with the same continuation condition?",
    "options": [
      {
        "id": "both-check-first",
        "text": "[0,0]",
        "rationale": "The do-while body runs before its first condition check.",
        "misconception": "Treating both forms as precondition loops."
      },
      {
        "id": "both-run-first",
        "text": "[1,1]",
        "rationale": "The while loop checks 0 < 0 before running and skips its body.",
        "misconception": "Assuming every loop executes at least once."
      },
      {
        "id": "different",
        "text": "[0,1]",
        "rationale": "while checks first and skips; do-while runs once and then stops.",
        "misconception": null
      },
      {
        "id": "reversed",
        "text": "[1,0]",
        "rationale": "The condition-check timing of the two loop forms is reversed in this result.",
        "misconception": "Confusing which loop places its condition before the body."
      }
    ],
    "correctOptionId": "different",
    "explanation": {
      "summary": "while evaluates its condition before the body. do-while evaluates after the body, so it executes once even when the continuation condition is initially false.",
      "trace": "before remains 0 because 0 < 0 is false. after increments to 1 before 1 < 0 is tested and rejected."
    },
    "validation": {
      "kind": "output",
      "stdout": "[0,1]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-06"
    },
    "references": [
      "https://www.php.net/manual/en/control-structures.do.while.php",
      "https://www.php.net/manual/en/control-structures.while.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0203",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Control flow & pattern matching",
    "subtopic": "switch-fallthrough-after-selected-case",
    "objective": {
      "id": "switch-fallthrough-after-selected-case",
      "text": "Trace switch fallthrough until a break statement."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Follow source-order execution after one exact matching case."
    },
    "prerequisites": [
      "switch",
      "break",
      "String concatenation"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$code = 1;\n$result = '';\n\nswitch ($code) {\n    case 1:\n        $result .= 'A';\n    case 2:\n        $result .= 'B';\n        break;\n    default:\n        $result .= 'D';\n}\n\necho $result;\n"
        }
      ]
    },
    "stem": "Which text is printed? The missing break after case 1 is intentional.",
    "options": [
      {
        "id": "selected-only",
        "text": "A",
        "rationale": "Execution continues into case 2 because case 1 has no break.",
        "misconception": "Assuming each switch case ends implicitly."
      },
      {
        "id": "fallthrough",
        "text": "AB",
        "rationale": "Case 1 appends A, then execution falls through to B and stops at break.",
        "misconception": null
      },
      {
        "id": "through-default",
        "text": "ABD",
        "rationale": "The break after B prevents execution of default.",
        "misconception": "Ignoring break after a fallthrough path."
      },
      {
        "id": "second-only",
        "text": "B",
        "rationale": "The initially selected case 1 executes before falling through.",
        "misconception": "Treating fallthrough as replacing the selected branch rather than continuing it."
      }
    ],
    "correctOptionId": "fallthrough",
    "explanation": {
      "summary": "After selecting a switch case, PHP executes subsequent statements until a break or the end of the switch. Later case labels do not re-test the subject during fallthrough.",
      "trace": "The subject matches case 1. A is appended, then B; break exits before default."
    },
    "validation": {
      "kind": "output",
      "stdout": "AB",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-06"
    },
    "references": [
      "https://www.php.net/manual/en/control-structures.switch.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0204",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "array-list-requires-key-iteration-order",
    "objective": {
      "id": "array-list-requires-key-iteration-order",
      "text": "Determine whether integer keys form a list in iteration order rather than merely as a set."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply the list-key definition before and after reordering existing keys."
    },
    "prerequisites": [
      "Array iteration order",
      "array_is_list",
      "ksort"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$items = [1 => 'second', 0 => 'first'];\n$before = array_is_list($items);\nksort($items);\n$after = array_is_list($items);\n\necho json_encode([$before, $after]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? The two integer keys are 0 and 1, but their initial insertion order is shown explicitly.",
    "options": [
      {
        "id": "key-set-only",
        "text": "[true,true]",
        "rationale": "Before sorting, the first iterated key is 1 rather than 0, so the array is not a list.",
        "misconception": "Checking only the set of integer keys and ignoring their order."
      },
      {
        "id": "no-reindex",
        "text": "[false,false]",
        "rationale": "ksort puts existing keys 0 and 1 in the required order; no renumbering is needed here.",
        "misconception": "Assuming only array_values can produce a list."
      },
      {
        "id": "reversed",
        "text": "[true,false]",
        "rationale": "Sorting these integer keys repairs their order rather than breaking a list.",
        "misconception": "Confusing insertion order with the permanent identity of a list."
      },
      {
        "id": "ordered-keys",
        "text": "[false,true]",
        "rationale": "The initial key order is 1,0; sorting changes it to the required 0,1.",
        "misconception": null
      }
    ],
    "correctOptionId": "ordered-keys",
    "explanation": {
      "summary": "array_is_list requires keys to occur as consecutive integers beginning at zero in iteration order. Merely containing the same key set is insufficient.",
      "trace": "The initial first key is 1, so before is false. ksort orders keys as 0 then 1, making after true without changing their values."
    },
    "validation": {
      "kind": "output",
      "stdout": "[false,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-is-list.php",
      "https://www.php.net/manual/en/function.ksort.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0205",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "object-parameter-local-rebinding",
    "objective": {
      "id": "object-parameter-local-rebinding",
      "text": "Distinguish mutating an object parameter from rebinding the local parameter variable."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Track one shared object followed by a local variable reassignment."
    },
    "prerequisites": [
      "Object handles",
      "Function parameters by value",
      "new"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Box\n{\n    public int $value = 1;\n}\n\nfunction updateBox(Box $box): void\n{\n    $box->value = 2;\n    $box = new Box();\n    $box->value = 3;\n}\n\n$original = new Box();\nupdateBox($original);\n\necho $original->value;\n"
        }
      ]
    },
    "stem": "What value remains in the caller’s object after updateBox returns?",
    "options": [
      {
        "id": "original-default",
        "text": "1",
        "rationale": "The first property write mutates the shared original object.",
        "misconception": "Assuming a by-value object parameter automatically clones the object."
      },
      {
        "id": "shared-write",
        "text": "2",
        "rationale": "The first write affects the original; later rebinding changes only the local parameter.",
        "misconception": null
      },
      {
        "id": "new-value",
        "text": "3",
        "rationale": "The final write targets the new object held only by the local parameter.",
        "misconception": "Assuming parameter rebinding also rebinds the caller’s variable."
      },
      {
        "id": "lost-object",
        "text": "An uncaught Error when the function assigns a new Box to its by-value parameter",
        "rationale": "A parameter variable may be reassigned to another compatible object. Passing by value limits which variable is rebound; it does not prohibit local assignment.",
        "misconception": "Confusing by-value argument passing with a read-only parameter binding."
      }
    ],
    "correctOptionId": "shared-write",
    "explanation": {
      "summary": "Passing an object by value copies its handle, so property mutation reaches the original. Assigning a different object to the local parameter does not assign the caller’s variable.",
      "trace": "The original reaches value 2. The local box then points to a new object whose value becomes 3; original still points to the first object."
    },
    "validation": {
      "kind": "output",
      "stdout": "2",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.references.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0206",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "unshift-renumbers-integer-keys",
    "objective": {
      "id": "unshift-renumbers-integer-keys",
      "text": "Predict integer-key renumbering and string-key preservation when prepending."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply the documented key rules of one array_unshift operation."
    },
    "prerequisites": [
      "Integer and string array keys",
      "array_unshift"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$items = [5 => 'old', 'tag' => 'keep'];\narray_unshift($items, 'new');\n\necho json_encode($items);\n"
        }
      ]
    },
    "stem": "What JSON is printed after prepending new?",
    "options": [
      {
        "id": "preserved-number",
        "text": "{\"0\":\"new\",\"5\":\"old\",\"tag\":\"keep\"}",
        "rationale": "array_unshift renumbers existing numeric keys rather than preserving key 5.",
        "misconception": "Applying string-key preservation to integer keys."
      },
      {
        "id": "all-list",
        "text": "[\"new\",\"old\",\"keep\"]",
        "rationale": "The string key tag is retained rather than converted to a numeric index.",
        "misconception": "Assuming prepending reindexes every kind of key."
      },
      {
        "id": "key-rules",
        "text": "{\"0\":\"new\",\"1\":\"old\",\"tag\":\"keep\"}",
        "rationale": "The new numeric entry and old numeric entry become 0 and 1; tag stays a string key.",
        "misconception": null
      },
      {
        "id": "append",
        "text": "{\"5\":\"old\",\"tag\":\"keep\",\"6\":\"new\"}",
        "rationale": "array_unshift prepends, whereas this result resembles an ordinary append.",
        "misconception": "Confusing insertion at the front with adding the next integer key."
      }
    ],
    "correctOptionId": "key-rules",
    "explanation": {
      "summary": "array_unshift prepends values and renumbers numeric keys from zero. Existing string keys remain unchanged.",
      "trace": "new becomes key 0, old is reindexed from 5 to 1, and tag remains associated with keep."
    },
    "validation": {
      "kind": "output",
      "stdout": "{\"0\":\"new\",\"1\":\"old\",\"tag\":\"keep\"}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-unshift.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0207",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Types, casting & comparisons",
    "subtopic": "contains-empty-needle-case-sensitive",
    "objective": {
      "id": "contains-empty-needle-case-sensitive",
      "text": "Apply str_contains semantics for an empty needle and case-sensitive text."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Evaluate two documented string-search cases without relying on truthiness of a position."
    },
    "prerequisites": [
      "str_contains",
      "Empty strings",
      "Case sensitivity"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\necho json_encode([\n    str_contains('PHP', ''),\n    str_contains('PHP', 'php'),\n]);\n"
        }
      ]
    },
    "stem": "What JSON pair is printed by these string containment checks?",
    "options": [
      {
        "id": "rules",
        "text": "[true,false]",
        "rationale": "Every string contains the empty string; the second search differs in case.",
        "misconception": null
      },
      {
        "id": "empty-false",
        "text": "[false,false]",
        "rationale": "An empty needle is considered contained, not an invalid or absent match.",
        "misconception": "Assuming an empty search term always means no match."
      },
      {
        "id": "case-insensitive",
        "text": "[true,true]",
        "rationale": "str_contains performs a case-sensitive search.",
        "misconception": "Applying case-insensitive behavior without requesting it."
      },
      {
        "id": "inverted",
        "text": "[false,true]",
        "rationale": "Both the empty-needle and case-sensitivity assumptions are reversed.",
        "misconception": "Treating an empty term as absent and ordinary text matching as case-insensitive."
      }
    ],
    "correctOptionId": "rules",
    "explanation": {
      "summary": "str_contains returns a boolean and uses case-sensitive matching. The empty string is contained in any string.",
      "trace": "The empty needle succeeds. Lowercase php is not present in uppercase PHP."
    },
    "validation": {
      "kind": "output",
      "stdout": "[true,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/function.str-contains.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0208",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "interface-instanceof-versus-exact-class",
    "objective": {
      "id": "interface-instanceof-versus-exact-class",
      "text": "Distinguish interface membership from an object’s concrete class name."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply one declared interface relationship to two introspection operations."
    },
    "prerequisites": [
      "Interfaces",
      "implements",
      "instanceof",
      "get_class"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\ninterface PrintableValue\n{\n    public function text(): string;\n}\n\nclass Ticket implements PrintableValue\n{\n    public function text(): string\n    {\n        return 'ticket';\n    }\n}\n\n$value = new Ticket();\n\necho json_encode([$value instanceof PrintableValue, get_class($value)]);\n"
        }
      ]
    },
    "stem": "What JSON is printed for the concrete object?",
    "options": [
      {
        "id": "interface-name",
        "text": "[true,\"PrintableValue\"]",
        "rationale": "get_class reports the concrete class, not an implemented interface.",
        "misconception": "Treating an interface as the runtime class name."
      },
      {
        "id": "exact-only",
        "text": "[false,\"Ticket\"]",
        "rationale": "instanceof accepts implemented interfaces, not only exact concrete class names.",
        "misconception": "Restricting instanceof to exact class equality."
      },
      {
        "id": "interface-both",
        "text": "[false,\"PrintableValue\"]",
        "rationale": "The object implements the interface and remains an instance of concrete class Ticket.",
        "misconception": "Confusing the declared contract with concrete identity in both checks."
      },
      {
        "id": "membership",
        "text": "[true,\"Ticket\"]",
        "rationale": "The object implements PrintableValue and its concrete class is Ticket.",
        "misconception": null
      }
    ],
    "correctOptionId": "membership",
    "explanation": {
      "summary": "An interface defines a contract that an implementing object satisfies. It does not replace the object’s concrete class identity.",
      "trace": "Ticket declares implements PrintableValue, so instanceof is true. get_class returns Ticket."
    },
    "validation": {
      "kind": "output",
      "stdout": "[true,\"Ticket\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.interfaces.php",
      "https://www.php.net/manual/en/function.get-class.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0209",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "recursive-unwind-output-order",
    "objective": {
      "id": "recursive-unwind-output-order",
      "text": "Trace output before a recursive call separately from output during unwinding."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Maintain the local argument of each active call while following entry and return order."
    },
    "prerequisites": [
      "Recursion",
      "Base cases",
      "Per-call local variables"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction visit(int $depth): void\n{\n    if ($depth === 0) {\n        echo 'X';\n\n        return;\n    }\n\n    echo $depth;\n    visit($depth - 1);\n    echo $depth;\n}\n\nvisit(2);\n"
        }
      ]
    },
    "stem": "What exact text is printed by the recursive call, including both sides of each recursive step?",
    "options": [
      {
        "id": "same-order",
        "text": "21X21",
        "rationale": "After the base case, the innermost pending call resumes first.",
        "misconception": "Replaying entry order rather than unwinding the call stack."
      },
      {
        "id": "base-first",
        "text": "X1221",
        "rationale": "The pre-call echo statements execute before reaching the base case.",
        "misconception": "Moving all output until after recursion finishes."
      },
      {
        "id": "entry-only",
        "text": "21X",
        "rationale": "Returning from the base case resumes the pending callers and their final echo statements.",
        "misconception": "Treating return from one recursive call as return from the entire recursion."
      },
      {
        "id": "unwind",
        "text": "21X12",
        "rationale": "Calls print 2 then 1 on entry, X at the base, then 1 and 2 while unwinding.",
        "misconception": null
      }
    ],
    "correctOptionId": "unwind",
    "explanation": {
      "summary": "Each recursive invocation keeps its own depth. The second echo runs only after that invocation’s recursive child returns.",
      "trace": "visit(2) prints 2, visit(1) prints 1, and visit(0) prints X. Returning resumes visit(1)’s final echo, then visit(2)’s."
    },
    "validation": {
      "kind": "output",
      "stdout": "21X12",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/language.functions.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0210",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Types, casting & comparisons",
    "subtopic": "sequential-replacement-versus-translation",
    "objective": {
      "id": "sequential-replacement-versus-translation",
      "text": "Distinguish cascading str_replace passes from strtr’s nonrecursive replacement."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track whether replacement output becomes input to a later replacement rule."
    },
    "prerequisites": [
      "str_replace",
      "strtr with an associative map"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$text = 'ab';\n\n$sequential = str_replace(['a', 'b'], ['b', 'c'], $text);\n$translated = strtr($text, ['a' => 'b', 'b' => 'c']);\n\necho json_encode([$sequential, $translated]);\n"
        }
      ]
    },
    "stem": "What JSON pair is printed? The replacement rule order is exactly as displayed.",
    "options": [
      {
        "id": "both-once",
        "text": "[\"bc\",\"bc\"]",
        "rationale": "str_replace applies the b-to-c pass to the output of the a-to-b pass.",
        "misconception": "Assuming every replacement API processes only original characters."
      },
      {
        "id": "different",
        "text": "[\"cc\",\"bc\"]",
        "rationale": "str_replace cascades to cc; strtr does not reprocess inserted b and produces bc.",
        "misconception": null
      },
      {
        "id": "both-cascade",
        "text": "[\"cc\",\"cc\"]",
        "rationale": "strtr does not recursively translate its own replacement output.",
        "misconception": "Applying sequential-pass behavior to strtr’s map."
      },
      {
        "id": "reverse",
        "text": "[\"bc\",\"cc\"]",
        "rationale": "The cascading and nonrecursive API behaviors are assigned to the wrong functions.",
        "misconception": "Reversing the two replacement models."
      }
    ],
    "correctOptionId": "different",
    "explanation": {
      "summary": "str_replace processes search entries sequentially, allowing a later pass to replace text inserted by an earlier pass. strtr with a map does not search its replacement text again.",
      "trace": "str_replace changes ab to bb and then cc. strtr replaces original a with b and original b with c, producing bc."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"cc\",\"bc\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/function.str-replace.php",
      "https://www.php.net/manual/en/function.strtr.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0211",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "foreach-independent-internal-array-pointer",
    "objective": {
      "id": "foreach-independent-internal-array-pointer",
      "text": "Distinguish foreach iteration state from an array’s internal pointer."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track a deliberately moved internal pointer alongside a complete foreach traversal."
    },
    "prerequisites": [
      "end",
      "current",
      "foreach"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$values = ['a', 'b', 'c'];\nend($values);\n$visited = '';\n\nforeach ($values as $value) {\n    $visited .= $value;\n}\n\necho json_encode([$visited, current($values)]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? No reset or next call occurs after end.",
    "options": [
      {
        "id": "shared-start",
        "text": "[\"c\",false]",
        "rationale": "foreach neither starts from the internal pointer nor advances it beyond the end.",
        "misconception": "Assuming foreach consumes the current/next pointer."
      },
      {
        "id": "foreach-exhausts",
        "text": "[\"abc\",false]",
        "rationale": "The foreach traversal does not move the internal pointer from c.",
        "misconception": "Assuming foreach resets the pointer and then exhausts it."
      },
      {
        "id": "independent",
        "text": "[\"abc\",\"c\"]",
        "rationale": "foreach visits every entry while the internal pointer stays on c.",
        "misconception": null
      },
      {
        "id": "foreach-resets",
        "text": "[\"abc\",\"a\"]",
        "rationale": "foreach does not reset the internal pointer to a.",
        "misconception": "Assuming iteration resets the pointer but leaves it at the beginning."
      }
    ],
    "correctOptionId": "independent",
    "explanation": {
      "summary": "foreach maintains its own iteration state. It does not modify the internal pointer used by current, next and end.",
      "trace": "end selects c for current. foreach independently builds abc, and current still returns c afterward."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"abc\",\"c\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/control-structures.foreach.php",
      "https://www.php.net/manual/en/function.current.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0212",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "multisort-secondary-array-order",
    "objective": {
      "id": "multisort-secondary-array-order",
      "text": "Trace primary and secondary sort criteria across parallel arrays."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Follow aligned rows through a primary tie and a secondary comparison."
    },
    "prerequisites": [
      "array_multisort",
      "SORT_ASC",
      "Parallel arrays"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$priority = [2, 1, 1];\n$name = ['Z', 'B', 'A'];\n\narray_multisort($priority, SORT_ASC, $name, SORT_ASC);\n\necho json_encode([$priority, $name]);\n"
        }
      ]
    },
    "stem": "What JSON pair is printed after sorting these aligned rows? All keys are ordinary consecutive integers.",
    "options": [
      {
        "id": "secondary",
        "text": "[[1,1,2],[\"A\",\"B\",\"Z\"]]",
        "rationale": "Priority sorts first; the tied priority-1 rows are ordered by name.",
        "misconception": null
      },
      {
        "id": "stable-primary",
        "text": "[[1,1,2],[\"B\",\"A\",\"Z\"]]",
        "rationale": "The second array supplies a secondary comparison, not merely a payload reordered stably by priority.",
        "misconception": "Ignoring the secondary sort criterion."
      },
      {
        "id": "independent-priority",
        "text": "[[2,1,1],[\"A\",\"B\",\"Z\"]]",
        "rationale": "Both arrays are reordered together; priority does not stay in original order.",
        "misconception": "Sorting only the final supplied array."
      },
      {
        "id": "priority-only",
        "text": "[[1,1,2],[\"Z\",\"B\",\"A\"]]",
        "rationale": "The name entries move with their aligned priority rows.",
        "misconception": "Sorting one parallel array without carrying the others along."
      }
    ],
    "correctOptionId": "secondary",
    "explanation": {
      "summary": "array_multisort treats the arrays as aligned row columns. Later arrays break ties in earlier arrays, and all supplied arrays are reordered together.",
      "trace": "The priority-1 rows move before priority 2. Within that tie, A precedes B, leaving Z aligned with priority 2."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[1,1,2],[\"A\",\"B\",\"Z\"]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-multisort.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0213",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Validation & web security",
    "subtopic": "boolean-filter-failure-null-distinction",
    "objective": {
      "id": "boolean-filter-failure-null-distinction",
      "text": "Distinguish parsed false values from invalid boolean text using FILTER_NULL_ON_FAILURE."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Apply parser vocabulary and preserve a separate validation-failure result."
    },
    "prerequisites": [
      "filter_var",
      "FILTER_VALIDATE_BOOLEAN",
      "null versus false"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$inputs = ['false', '0', 'yes', 'maybe'];\n$result = [];\n\nforeach ($inputs as $input) {\n    $result[] = filter_var($input, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);\n}\n\necho json_encode($result);\n"
        }
      ]
    },
    "stem": "What JSON is printed? This code parses boolean text rather than casting strings to bool.",
    "options": [
      {
        "id": "casts",
        "text": "[true,false,true,true]",
        "rationale": "Validation parses recognized words and rejects maybe, rather than applying PHP string truthiness.",
        "misconception": "Confusing filter parsing with a bool cast."
      },
      {
        "id": "false-on-invalid",
        "text": "[false,false,true,false]",
        "rationale": "FILTER_NULL_ON_FAILURE makes unrecognized text null rather than false.",
        "misconception": "Ignoring the flag that separates invalid input from a valid false value."
      },
      {
        "id": "only-digits",
        "text": "[null,false,null,null]",
        "rationale": "The boolean filter recognizes words such as false and yes.",
        "misconception": "Assuming only numeric boolean spellings are accepted."
      },
      {
        "id": "parsed",
        "text": "[false,false,true,null]",
        "rationale": "false and 0 parse as false, yes as true, and maybe is invalid.",
        "misconception": null
      }
    ],
    "correctOptionId": "parsed",
    "explanation": {
      "summary": "The boolean validation filter recognizes a documented set of textual values. FILTER_NULL_ON_FAILURE reserves null for text outside that set, preserving false as a valid parsed value.",
      "trace": "false and 0 are recognized false values, yes is recognized true, and maybe has no boolean meaning in this parser."
    },
    "validation": {
      "kind": "output",
      "stdout": "[false,false,true,null]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/filter.constants.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0214",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "default-constant-evaluated-at-call",
    "objective": {
      "id": "default-constant-evaluated-at-call",
      "text": "Determine when a constant used as a default argument must be defined."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate function declaration from evaluation of an omitted argument’s default expression."
    },
    "prerequisites": [
      "Default arguments",
      "define",
      "Function declaration and invocation"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction pageSize(int $size = DEFAULT_PAGE_SIZE): int\n{\n    return $size;\n}\n\ndefine('DEFAULT_PAGE_SIZE', 25);\n\necho pageSize();\n"
        }
      ]
    },
    "stem": "What text is printed? The function is declared before define, but called afterward.",
    "options": [
      {
        "id": "declaration-error",
        "text": "An uncaught Error when the function is declared",
        "rationale": "The default constant is resolved when the default value is needed for the call, after define has run.",
        "misconception": "Requiring a default-expression constant to exist at function declaration time."
      },
      {
        "id": "defined-value",
        "text": "25",
        "rationale": "The omitted argument uses the constant value available when pageSize is called.",
        "misconception": null
      },
      {
        "id": "literal-name",
        "text": "DEFAULT_PAGE_SIZE",
        "rationale": "An unquoted constant reference resolves a value; it is not a string literal name.",
        "misconception": "Applying legacy undefined-constant string fallback instead of resolving a defined constant."
      },
      {
        "id": "null-type-error",
        "text": "An uncaught TypeError because the default became null",
        "rationale": "PHP does not snapshot an unresolved default as null at declaration.",
        "misconception": "Treating an unavailable declaration-time value as a permanently stored null."
      }
    ],
    "correctOptionId": "defined-value",
    "explanation": {
      "summary": "A default argument expression is evaluated when the omitted argument needs that default. By the time this call occurs, the constant has been defined.",
      "trace": "Declaring pageSize does not invoke it. define installs 25, then pageSize() evaluates the default constant and returns 25."
    },
    "validation": {
      "kind": "output",
      "stdout": "25",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/functions.arguments.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0215",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Control flow & pattern matching",
    "subtopic": "match-condition-and-result-laziness",
    "objective": {
      "id": "match-condition-and-result-laziness",
      "text": "Trace evaluated match conditions separately from selected result expressions."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Follow side effects until the first identity match and skip later conditions and unused results."
    },
    "prerequisites": [
      "match",
      "Function side effects",
      "Strict arm comparison"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction mark(string $label, int $value): int\n{\n    echo $label;\n\n    return $value;\n}\n\n$result = match (2) {\n    mark('a', 1) => mark('x', 10),\n    mark('b', 2) => mark('y', 20),\n    mark('c', 3) => mark('z', 30),\n};\n\necho '|', $result;\n"
        }
      ]
    },
    "stem": "What exact text is printed? mark writes its label before returning the supplied value.",
    "options": [
      {
        "id": "all-results",
        "text": "axbycz|20",
        "rationale": "Results of unmatched arms are never evaluated.",
        "misconception": "Evaluating every condition and result before selecting an arm."
      },
      {
        "id": "all-conditions",
        "text": "abcy|20",
        "rationale": "Condition c is not evaluated after b matches.",
        "misconception": "Eagerly evaluating all arm conditions before choosing the first match."
      },
      {
        "id": "short-circuit",
        "text": "aby|20",
        "rationale": "Conditions a and b run; b matches, so only its result y runs.",
        "misconception": null
      },
      {
        "id": "selected-only",
        "text": "by|20",
        "rationale": "The first condition a must be evaluated to determine that it does not match.",
        "misconception": "Skipping unsuccessful conditions as if PHP knew their returned values without calling them."
      }
    ],
    "correctOptionId": "short-circuit",
    "explanation": {
      "summary": "match evaluates conditions in order until one matches identically. It evaluates only that arm’s result, then stops.",
      "trace": "a returns 1 and fails. b returns 2 and matches. y returns 20. Neither x, c nor z is evaluated."
    },
    "validation": {
      "kind": "output",
      "stdout": "aby|20",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-06"
    },
    "references": [
      "https://www.php.net/manual/en/control-structures.match.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0216",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Closures, callbacks & callables",
    "subtopic": "invokable-object-state-across-callbacks",
    "objective": {
      "id": "invokable-object-state-across-callbacks",
      "text": "Trace state retained by an invokable object passed as a callable."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine __invoke dispatch with reuse of one stateful object across callback invocations."
    },
    "prerequisites": [
      "__invoke",
      "callable",
      "Object properties",
      "array_map"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass RunningTotal\n{\n    private int $total = 0;\n\n    public function __invoke(int $value): int\n    {\n        $this->total += $value;\n\n        return $this->total;\n    }\n}\n\n$sum = new RunningTotal();\n$mapped = array_map($sum, [2, 3]);\n\necho json_encode([$mapped, $sum(4)]);\n"
        }
      ]
    },
    "stem": "What JSON is printed after array_map uses the same callable object for both entries?",
    "options": [
      {
        "id": "stateful",
        "text": "[[2,5],9]",
        "rationale": "Both map calls and the later direct invocation use one object’s total.",
        "misconception": null
      },
      {
        "id": "cloned-callback",
        "text": "[[2,3],4]",
        "rationale": "array_map does not clone or reconstruct the callable object for each element.",
        "misconception": "Assuming callback invocations receive independent object state."
      },
      {
        "id": "map-only-state",
        "text": "[[2,5],4]",
        "rationale": "The object retains the total accumulated during array_map for the later call.",
        "misconception": "Assuming a callback API restores the object’s state when it returns."
      },
      {
        "id": "argument-array",
        "text": "[[5],9]",
        "rationale": "array_map invokes the callable once per element, not once with the whole array.",
        "misconception": "Treating an invokable object as a reducer automatically."
      }
    ],
    "correctOptionId": "stateful",
    "explanation": {
      "summary": "An object with __invoke can be used as a callable. Passing it to array_map reuses that object; method calls mutate its retained properties normally.",
      "trace": "The first call stores 2, the second stores 5, and the later direct call adds 4 to reach 9."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[2,5],9]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.magic.php#object.invoke",
      "https://www.php.net/manual/en/function.array-map.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0217",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Types, casting & comparisons",
    "subtopic": "strict-string-parameter-versus-explicit-cast",
    "objective": {
      "id": "strict-string-parameter-versus-explicit-cast",
      "text": "Distinguish explicit Stringable conversion from a strict string parameter requirement."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate a legal explicit cast from implicit argument coercion under strict_types."
    },
    "prerequisites": [
      "strict_types",
      "__toString",
      "Stringable",
      "TypeError"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\ndeclare(strict_types=1);\n\nclass Label\n{\n    public function __toString(): string\n    {\n        return 'ready';\n    }\n}\n\nfunction show(string $text): string\n{\n    return $text;\n}\n\n$label = new Label();\necho (string) $label, '|';\n\ntry {\n    echo show($label);\n} catch (TypeError $error) {\n    echo 'TypeError';\n}\n"
        }
      ]
    },
    "stem": "What text is printed? The string cast and the function call are separate expressions.",
    "options": [
      {
        "id": "coerced",
        "text": "ready|ready",
        "rationale": "Strict argument checking does not implicitly accept a Stringable object for a string-only parameter.",
        "misconception": "Assuming __toString overrides strict scalar parameter checking."
      },
      {
        "id": "cast-rejected",
        "text": "TypeError before any output",
        "rationale": "An explicit string cast can invoke __toString even under strict_types.",
        "misconception": "Treating strict_types as a ban on explicit conversions."
      },
      {
        "id": "class-name",
        "text": "Label|TypeError",
        "rationale": "The explicit cast invokes __toString rather than printing the class name.",
        "misconception": "Confusing object class identity with its declared string representation."
      },
      {
        "id": "explicit-only",
        "text": "ready|TypeError",
        "rationale": "The cast succeeds, then the strict string parameter rejects the object.",
        "misconception": null
      }
    ],
    "correctOptionId": "explicit-only",
    "explanation": {
      "summary": "strict_types controls scalar argument coercion at the call site. It does not prevent explicit casts. Accepting Stringable objects in the API would require a suitable parameter type or an explicit cast before this call.",
      "trace": "The cast calls __toString and prints ready. show receives an object rather than a string, so its strict call throws TypeError."
    },
    "validation": {
      "kind": "output",
      "stdout": "ready|TypeError",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/class.stringable.php",
      "https://www.php.net/manual/en/language.types.declarations.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0218",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "arrayaccess-coalescing-dispatch-trace",
    "objective": {
      "id": "arrayaccess-coalescing-dispatch-trace",
      "text": "Trace ArrayAccess existence and read hooks used by null coalescing."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Apply the explicitly implemented offsetExists contract before deciding whether offsetGet runs."
    },
    "prerequisites": [
      "ArrayAccess (unmapped curriculum)",
      "Null coalescing",
      "Method dispatch"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Bag implements ArrayAccess\n{\n    public array $calls = [];\n\n    public function offsetExists(mixed $offset): bool\n    {\n        $this->calls[] = 'exists';\n\n        return false;\n    }\n\n    public function offsetGet(mixed $offset): mixed\n    {\n        $this->calls[] = 'get';\n\n        return 'stored';\n    }\n\n    public function offsetSet(mixed $offset, mixed $value): void\n    {\n    }\n\n    public function offsetUnset(mixed $offset): void\n    {\n    }\n}\n\n$bag = new Bag();\n$value = $bag['key'] ?? 'fallback';\n\necho json_encode([$value, $bag->calls]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? The custom offsetExists deliberately reports false even though offsetGet could return a value.",
    "options": [
      {
        "id": "get-first",
        "text": "[\"stored\",[\"get\"]]",
        "rationale": "Null coalescing checks existence through offsetExists before reading an overloaded offset.",
        "misconception": "Treating ?? as an unconditional offsetGet followed by a null test."
      },
      {
        "id": "exists-only",
        "text": "[\"fallback\",[\"exists\"]]",
        "rationale": "The false existence result selects the fallback without calling offsetGet.",
        "misconception": null
      },
      {
        "id": "both-fallback",
        "text": "[\"fallback\",[\"exists\",\"get\"]]",
        "rationale": "offsetGet is skipped when offsetExists reports false.",
        "misconception": "Assuming PHP still reads a value after deciding the offset is absent."
      },
      {
        "id": "both-stored",
        "text": "[\"stored\",[\"exists\",\"get\"]]",
        "rationale": "The false existence result prevents reading and returning stored.",
        "misconception": "Treating offsetExists as advisory rather than controlling the coalescing read."
      }
    ],
    "correctOptionId": "exists-only",
    "explanation": {
      "summary": "For ArrayAccess, the null-coalescing existence check uses offsetExists. A false result selects the fallback without invoking offsetGet.",
      "trace": "offsetExists appends exists and returns false. The fallback is chosen, leaving the call log with exactly one entry."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"fallback\",[\"exists\"]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/arrayaccess.offsetexists.php",
      "https://www.php.net/manual/en/language.operators.comparison.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0219",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Iterators, generators & fibers",
    "subtopic": "generator-send-implicit-start-and-return-channel",
    "objective": {
      "id": "generator-send-implicit-start-and-return-channel",
      "text": "Trace send on an unstarted generator and distinguish yielded values from its return value."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Coordinate implicit startup, injection at the first yield, termination and the separate return channel."
    },
    "prerequisites": [
      "Generators",
      "Generator::send",
      "Generator::getReturn"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction exchange(): Generator\n{\n    $received = yield 'ready';\n\n    return strtoupper($received);\n}\n\n$generator = exchange();\n$sentResult = $generator->send('go');\n\necho json_encode([$sentResult, $generator->valid(), $generator->getReturn()]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? No current, next or rewind call occurs before send.",
    "options": [
      {
        "id": "first-yield",
        "text": "[\"ready\",true,null]",
        "rationale": "send first advances to the initial yield and sends into it; it does not merely report that initial yielded value.",
        "misconception": "Treating send on a new generator as current without value injection."
      },
      {
        "id": "return-from-send",
        "text": "[\"GO\",false,\"GO\"]",
        "rationale": "send returns the next yielded value or null on termination, not the generator’s return value.",
        "misconception": "Conflating the yield channel with the final return channel."
      },
      {
        "id": "auto-start",
        "text": "[null,false,\"GO\"]",
        "rationale": "send starts the generator, injects go at the yield, and runs to return; getReturn retrieves GO.",
        "misconception": null
      },
      {
        "id": "missing-start",
        "text": "An uncaught Error because the generator was not started",
        "rationale": "send is allowed on an unstarted generator and performs the startup itself.",
        "misconception": "Requiring an explicit current call before every send."
      }
    ],
    "correctOptionId": "auto-start",
    "explanation": {
      "summary": "send on an unstarted generator first advances it to the initial yield, then supplies the sent value to that yield expression. This generator immediately returns afterward, so no next yielded value exists.",
      "trace": "received becomes go. strtoupper produces GO as the generator return value. send returns null, valid is false, and getReturn yields GO."
    },
    "validation": {
      "kind": "output",
      "stdout": "[null,false,\"GO\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/generator.send.php",
      "https://www.php.net/manual/en/generator.getreturn.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0220",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Iterators, generators & fibers",
    "subtopic": "yield-from-exception-delegation-and-recovery",
    "objective": {
      "id": "yield-from-exception-delegation-and-recovery",
      "text": "Trace an exception injected through yield from into an inner generator that recovers by yielding."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Follow delegated suspension, injected exception handling, resumption and inner return propagation."
    },
    "prerequisites": [
      "Generator::throw (advanced)",
      "yield from",
      "catch and finally",
      "Generator return values"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction inner(): Generator\n{\n    try {\n        yield 'ready';\n    } catch (RuntimeException $error) {\n        yield 'recovered';\n    } finally {\n        echo 'F';\n    }\n\n    return 'done';\n}\n\nfunction outer(): Generator\n{\n    return yield from inner();\n}\n\n$generator = outer();\necho $generator->current(), '|';\necho $generator->throw(new RuntimeException('retry')), '|';\n$generator->next();\necho '|', $generator->getReturn();\n"
        }
      ]
    },
    "stem": "What exact text is printed? The exception is injected through the outer generator while it delegates to inner.",
    "options": [
      {
        "id": "delegated",
        "text": "ready|recovered|F|done",
        "rationale": "The injected exception reaches inner’s catch, which yields recovered; the next resume runs finally and returns done.",
        "misconception": null
      },
      {
        "id": "finally-before-yield",
        "text": "ready|Frecovered||done",
        "rationale": "The catch suspends at its yield before control reaches finally.",
        "misconception": "Assuming entering catch immediately runs the associated finally before a yielded recovery value."
      },
      {
        "id": "outer-only",
        "text": "ready| followed by an uncaught RuntimeException",
        "rationale": "yield from forwards the injected exception into the delegated generator at its suspension point.",
        "misconception": "Assuming Generator::throw affects only the outer frame and cannot reach the inner catch."
      },
      {
        "id": "return-lost",
        "text": "ready|recovered|F|null",
        "rationale": "The return yield from expression forwards the delegated generator’s return value.",
        "misconception": "Assuming yield from transmits yielded values but always discards the inner return value."
      }
    ],
    "correctOptionId": "delegated",
    "explanation": {
      "summary": "yield from delegates both yielded values and generator control operations. The inner generator catches the injected exception and suspends again at its recovery yield; cleanup waits until it resumes.",
      "trace": "current returns ready. throw reaches inner’s catch and returns recovered. next resumes after that yield, prints F in finally, and propagates done through return yield from."
    },
    "validation": {
      "kind": "output",
      "stdout": "ready|recovered|F|done",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/generator.throw.php",
      "https://www.php.net/manual/en/language.generators.syntax.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0221",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "lazy-proxy-distinct-identity-shared-backing-state",
    "objective": {
      "id": "lazy-proxy-distinct-identity-shared-backing-state",
      "text": "Distinguish a lazy proxy’s identity from the backing object whose state it forwards."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine deferred factory initialization, proxy identity and writes through both object handles."
    },
    "prerequisites": [
      "PHP 8.4 lazy proxies",
      "ReflectionClass::newLazyProxy",
      "Strict object identity"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Meter\n{\n    public int $value = 1;\n}\n\n$backing = new Meter();\n$reflection = new ReflectionClass(Meter::class);\n$proxy = $reflection->newLazyProxy(fn (Meter $unused): Meter => $backing);\n\n$proxy->value = 7;\n$backing->value++;\n\necho json_encode([$proxy === $backing, $proxy->value, $backing->value]);\n"
        }
      ]
    },
    "stem": "What JSON is printed after the first proxy write initializes it? The factory returns the already created backing object.",
    "options": [
      {
        "id": "same-object",
        "text": "[true,8,8]",
        "rationale": "The proxy forwards state but remains a distinct object identity from its backing instance.",
        "misconception": "Equating transparent state forwarding with strict object identity."
      },
      {
        "id": "proxy-copy",
        "text": "[false,7,2]",
        "rationale": "Initialization does not copy the backing state into an independent ordinary object.",
        "misconception": "Treating a lazy proxy factory result as a one-time snapshot."
      },
      {
        "id": "backing-only",
        "text": "[false,1,8]",
        "rationale": "Reading the initialized proxy forwards to the backing state rather than its original default.",
        "misconception": "Assuming proxy reads still use an independent default property slot."
      },
      {
        "id": "forwarded-state",
        "text": "[false,8,8]",
        "rationale": "The identities differ, but both handles observe the backing value after the write and increment.",
        "misconception": null
      }
    ],
    "correctOptionId": "forwarded-state",
    "explanation": {
      "summary": "A lazy proxy initializes by obtaining a backing object. Its property operations forward to that object, while strict identity still distinguishes the proxy from the backing instance.",
      "trace": "The first proxy write initializes and sets backing.value to 7. Incrementing backing makes it 8, which the proxy also reads. The === comparison remains false."
    },
    "validation": {
      "kind": "output",
      "stdout": "[false,8,8]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/reflectionclass.newlazyproxy.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0222",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "inherited-method-static-local-shared-storage",
    "objective": {
      "id": "inherited-method-static-local-shared-storage",
      "text": "Track method-local static storage across inherited calls and a distinct overriding method."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate called-class identity from the identity of the method body that owns a static local."
    },
    "prerequisites": [
      "Static local variables",
      "Method inheritance",
      "PHP 8.1+ inherited static-local behavior"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass BaseCounter\n{\n    public static function next(): int\n    {\n        static $value = 0;\n\n        return ++$value;\n    }\n}\n\nclass Shared extends BaseCounter\n{\n}\n\nclass Separate extends BaseCounter\n{\n    public static function next(): int\n    {\n        static $value = 0;\n\n        return ++$value;\n    }\n}\n\necho json_encode([\n    BaseCounter::next(),\n    Shared::next(),\n    Separate::next(),\n    BaseCounter::next(),\n    Shared::next(),\n]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? Shared inherits the method unchanged; Separate declares a different method body.",
    "options": [
      {
        "id": "per-class",
        "text": "[1,1,1,2,2]",
        "rationale": "Shared uses the inherited method’s static local storage on these PHP versions.",
        "misconception": "Allocating a separate method-local static for each called class."
      },
      {
        "id": "method-owned",
        "text": "[1,2,1,3,4]",
        "rationale": "BaseCounter and Shared execute one inherited method body; Separate owns a separate static local.",
        "misconception": null
      },
      {
        "id": "all-shared",
        "text": "[1,2,3,4,5]",
        "rationale": "Separate redeclares the method and therefore has its own local static.",
        "misconception": "Sharing same-named static locals across distinct overriding method bodies."
      },
      {
        "id": "all-reset",
        "text": "[1,1,1,1,1]",
        "rationale": "Static locals persist between calls instead of resetting on every invocation.",
        "misconception": "Treating a static local like an ordinary initialized local variable."
      }
    ],
    "correctOptionId": "method-owned",
    "explanation": {
      "summary": "On PHP 8.4 and 8.5, an inherited method that is not overridden shares its static local with the parent method. A separately declared override has a different static local.",
      "trace": "BaseCounter and Shared advance the shared counter through 1, 2, 3 and 4. Separate advances its own counter from 0 to 1."
    },
    "validation": {
      "kind": "output",
      "stdout": "[1,2,1,3,4]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.variables.scope.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0223",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Enums, attributes & reflection",
    "subtopic": "serialization-cycle-and-enum-singleton-identity",
    "objective": {
      "id": "serialization-cycle-and-enum-singleton-identity",
      "text": "Distinguish reconstructed object-graph identity from enum case identity after serialization."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Track an ordinary object, a self-reference and a singleton enum case through one round trip."
    },
    "prerequisites": [
      "PHP serialization (advanced)",
      "Cyclic object graphs",
      "Enum case singleton identity"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nenum State\n{\n    case Ready;\n}\n\nclass Node\n{\n    public ?Node $next = null;\n    public State $state = State::Ready;\n}\n\n$original = new Node();\n$original->next = $original;\n$restored = unserialize(serialize($original));\n\necho json_encode([\n    $restored !== $original,\n    $restored->next === $restored,\n    $restored->state === $original->state,\n]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? The payload is produced locally from the displayed object; no external serialized data is read.",
    "options": [
      {
        "id": "enum-copied",
        "text": "[true,true,false]",
        "rationale": "An enum case is a singleton; unserialization restores the existing case rather than creating a new one.",
        "misconception": "Applying ordinary object reconstruction identity to enum cases."
      },
      {
        "id": "cycle-original",
        "text": "[true,false,true]",
        "rationale": "The serialized self-reference resolves inside the reconstructed graph, not back to the original object.",
        "misconception": "Assuming a serialized reference retains a live pointer into the original graph."
      },
      {
        "id": "identity-rules",
        "text": "[true,true,true]",
        "rationale": "Node is reconstructed, its self-loop points to the reconstruction, and State::Ready remains the same enum case.",
        "misconception": null
      },
      {
        "id": "all-original",
        "text": "[false,true,true]",
        "rationale": "An ordinary Node is reconstructed as a new object rather than returning the original instance.",
        "misconception": "Treating serialization as an identity-preserving in-process alias operation."
      }
    ],
    "correctOptionId": "identity-rules",
    "explanation": {
      "summary": "PHP serialization represents repeated object references within the serialized graph, allowing the self-loop to be restored. Ordinary objects are reconstructed, while enum cases resolve to their singleton case objects.",
      "trace": "restored is a new Node. Its next reference targets that same new Node. Both state properties refer to State::Ready."
    },
    "validation": {
      "kind": "output",
      "stdout": "[true,true,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/function.serialize.php",
      "https://www.php.net/manual/en/language.enumerations.serialization.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0224",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Enums, attributes & reflection",
    "subtopic": "reflection-raw-property-hook-bypass",
    "objective": {
      "id": "reflection-raw-property-hook-bypass",
      "text": "Trace raw reflection writes that bypass set hooks while ordinary reads still invoke get hooks."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate backed storage from transformed access and identify which operations bypass invariants."
    },
    "prerequisites": [
      "PHP 8.4 property hooks",
      "ReflectionProperty::setRawValue",
      "ReflectionProperty::getRawValue"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Gauge\n{\n    public int $level = 0 {\n        get {\n            return $this->level * 2;\n        }\n        set {\n            $this->level = max(0, $value);\n        }\n    }\n}\n\n$gauge = new Gauge();\n$gauge->level = 5;\n$before = $gauge->level;\n$property = new ReflectionProperty(Gauge::class, 'level');\n$property->setRawValue($gauge, -3);\n\necho json_encode([$before, $gauge->level, $property->getRawValue($gauge)]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? The property is backed, and the reflected write intentionally uses the raw-value API.",
    "options": [
      {
        "id": "raw-bypass",
        "text": "[10,-6,-3]",
        "rationale": "The ordinary read doubles stored 5; the raw write stores -3 without clamping, and only the ordinary later read doubles it.",
        "misconception": null
      },
      {
        "id": "setter-runs",
        "text": "[10,0,0]",
        "rationale": "setRawValue bypasses the set hook, so max(0, -3) is not applied.",
        "misconception": "Assuming reflection raw writes enforce the same normalization as ordinary assignment."
      },
      {
        "id": "getter-bypassed-everywhere",
        "text": "[5,-3,-3]",
        "rationale": "Ordinary property reads still invoke the get hook and double the backed value.",
        "misconception": "Assuming raw reflection access disables hooks for all later accesses."
      },
      {
        "id": "raw-read-transformed",
        "text": "[10,-6,-6]",
        "rationale": "getRawValue reads backed storage without invoking the get hook.",
        "misconception": "Treating a raw read as ordinary transformed property access."
      }
    ],
    "correctOptionId": "raw-bypass",
    "explanation": {
      "summary": "Raw reflection APIs operate on backed storage without invoking the corresponding property hooks. Ordinary reads and writes retain their normal hook behavior.",
      "trace": "Normal assignment stores max(0, 5) = 5, then a normal read returns 10. The raw write stores -3; a normal read returns -6 while the raw read returns -3."
    },
    "validation": {
      "kind": "output",
      "stdout": "[10,-6,-3]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/reflectionproperty.setrawvalue.php",
      "https://www.php.net/manual/en/reflectionproperty.getrawvalue.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0225",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "dynamic-static-initializer-failure-retry",
    "objective": {
      "id": "dynamic-static-initializer-failure-retry",
      "text": "Trace a dynamic static initializer that throws before successfully initializing persistent local state."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine failed initialization, retried expression evaluation and later persistent mutation."
    },
    "prerequisites": [
      "PHP 8.3 dynamic static initializers (advanced)",
      "Exceptions",
      "Static local lifetime"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$attempts = 0;\n\nfunction seed(): int\n{\n    global $attempts;\n    $attempts++;\n\n    if ($attempts === 1) {\n        throw new RuntimeException('not ready');\n    }\n\n    return 5;\n}\n\nfunction nextValue(): int\n{\n    static $value = seed();\n\n    return ++$value;\n}\n\n$results = [];\n\nfor ($i = 0; $i < 3; $i++) {\n    try {\n        $results[] = nextValue();\n    } catch (RuntimeException $error) {\n        $results[] = 'retry';\n    }\n}\n\necho json_encode([$results, $attempts]);\n"
        }
      ]
    },
    "stem": "What JSON is printed after three calls? The seed function fails only on its first invocation.",
    "options": [
      {
        "id": "every-call",
        "text": "[[\"retry\",6,6],3]",
        "rationale": "After the initializer succeeds, later calls reuse the static local rather than invoking seed again.",
        "misconception": "Treating a dynamic static initializer as an ordinary assignment on every call."
      },
      {
        "id": "failure-cached",
        "text": "[[\"retry\",\"retry\",\"retry\"],1]",
        "rationale": "A thrown initializer does not cache the exception as the static variable’s value.",
        "misconception": "Assuming failed initialization permanently memoizes the failure."
      },
      {
        "id": "null-after-failure",
        "text": "[[\"retry\",1,2],1]",
        "rationale": "The failed initializer is retried rather than leaving a successfully initialized null value.",
        "misconception": "Treating an aborted initializer as completed initialization to null."
      },
      {
        "id": "retry-then-persist",
        "text": "[[\"retry\",6,7],2]",
        "rationale": "The first initializer throws, the second succeeds with 5, and the third call increments the retained 6 to 7.",
        "misconception": null
      }
    ],
    "correctOptionId": "retry-then-persist",
    "explanation": {
      "summary": "A static variable is not successfully initialized when evaluating its initializer throws. A later call retries initialization; once it succeeds, subsequent calls reuse the stored local value.",
      "trace": "Call one invokes seed and records retry. Call two invokes seed again, initializes 5 and returns 6. Call three skips seed and returns 7. attempts is 2."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[\"retry\",6,7],2]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/language.variables.scope.php",
      "https://wiki.php.net/rfc/arbitrary_static_variable_initializers"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0226",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "empty-max-input-contract",
    "objective": {
      "id": "empty-max-input-contract",
      "text": "Handle an empty numeric collection before invoking max."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply one explicit empty-input rule while preserving ordinary maximum behavior."
    },
    "prerequisites": [
      "max",
      "Empty arrays",
      "Conditional expressions"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction largest(array $numbers): ?int\n{\n    return max($numbers);\n}\n\ntry {\n    echo json_encode([largest([]), largest([-7, -2]), largest([0])]);\n} catch (ValueError $error) {\n    echo 'ValueError';\n}\n"
        }
      ]
    },
    "stem": "largest must return null for an empty list and otherwise return its greatest integer, including when all integers are negative. Which return expression satisfies the three displayed calls?",
    "options": [
      {
        "id": "zero-default",
        "text": "max([0, ...$numbers])",
        "rationale": "Adding zero changes an all-negative maximum and returns zero for an empty input.",
        "misconception": "Treating zero as a neutral identity for every integer maximum."
      },
      {
        "id": "coalesce-after",
        "text": "max($numbers) ?? null",
        "rationale": "max throws on an empty array before null coalescing can choose a fallback.",
        "misconception": "Assuming ?? catches errors from evaluating its left operand."
      },
      {
        "id": "guard-empty",
        "text": "$numbers === [] ? null : max($numbers)",
        "rationale": "The empty input is handled before max, and nonempty lists retain their true maximum.",
        "misconception": null
      },
      {
        "id": "falsy-fallback",
        "text": "$numbers === [] ? null : (max($numbers) ?: null)",
        "rationale": "The valid maximum zero becomes null under the truthiness fallback.",
        "misconception": "Treating a zero result as absence."
      }
    ],
    "correctOptionId": "guard-empty",
    "explanation": {
      "summary": "max requires a nonempty array. Guard the input before calling it and preserve every valid integer result, including zero and negative maxima.",
      "trace": "The empty list returns null, [-7, -2] returns -2, and [0] returns 0."
    },
    "validation": {
      "kind": "patch",
      "marker": "max($numbers)",
      "stdout": "[null,-2,0]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.max.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0227",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Types, casting & comparisons",
    "subtopic": "strict-value-whitelist-membership",
    "objective": {
      "id": "strict-value-whitelist-membership",
      "text": "Reject a numeric-looking string when an allowlist admits only listed integer values."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish type-sensitive membership from coercive equality."
    },
    "prerequisites": [
      "in_array",
      "Strict comparison",
      "String and integer types"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction allowed(mixed $value): bool\n{\n    return in_array($value, [0, 1]);\n}\n\necho json_encode([allowed(0), allowed('0'), allowed(2)]);\n"
        }
      ]
    },
    "stem": "allowed must accept integer 0 but reject string \"0\" and integer 2. Which replacement enforces membership without coercing the input?",
    "options": [
      {
        "id": "strict",
        "text": "in_array($value, [0, 1], true)",
        "rationale": "The strict flag compares both value and type.",
        "misconception": null
      },
      {
        "id": "loose",
        "text": "in_array($value, [0, 1], false)",
        "rationale": "The string 0 loosely matches integer 0.",
        "misconception": "Assuming the default comparison already preserves scalar types."
      },
      {
        "id": "cast-first",
        "text": "in_array((int) $value, [0, 1], true)",
        "rationale": "Casting changes the forbidden string into an allowed integer before comparison.",
        "misconception": "Using normalization when the requirement is to reject a different input type."
      },
      {
        "id": "key-presence",
        "text": "array_key_exists($value, [0, 1])",
        "rationale": "The numeric string 0 is accepted as an integer array key.",
        "misconception": "Confusing value membership with key lookup and its key-conversion rules."
      }
    ],
    "correctOptionId": "strict",
    "explanation": {
      "summary": "The third argument of in_array selects strict comparison. An explicit strict flag checks the original input type instead of normalizing it.",
      "trace": "Integer 0 matches integer 0, string 0 does not, and integer 2 is absent."
    },
    "validation": {
      "kind": "patch",
      "marker": "in_array($value, [0, 1])",
      "stdout": "[true,false,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/function.in-array.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0228",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Types, casting & comparisons",
    "subtopic": "literal-prefix-removal-not-character-mask",
    "objective": {
      "id": "literal-prefix-removal-not-character-mask",
      "text": "Remove exactly one leading prefix without trimming a set of characters."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish a literal substring boundary from ltrim’s character-mask semantics."
    },
    "prerequisites": [
      "ltrim",
      "str_starts_with",
      "substr",
      "strlen"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction stripPrefix(string $value, string $prefix): string\n{\n    return ltrim($value, $prefix);\n}\n\necho json_encode([\n    stripPrefix('prepress', 'pre'),\n    stripPrefix('xpre', 'pre'),\n    stripPrefix('plain', 'pre'),\n]);\n"
        }
      ]
    },
    "stem": "stripPrefix must remove one leading copy of the nonempty prefix and otherwise leave the value unchanged. Which replacement returns the stated results without removing interior occurrences?",
    "options": [
      {
        "id": "replace-all",
        "text": "str_starts_with($value, $prefix) ? str_replace($prefix, '', $value) : $value",
        "rationale": "For prepress, global replacement removes both copies of pre rather than only the leading copy.",
        "misconception": "Treating a guarded global replacement as removal of one occurrence."
      },
      {
        "id": "trim-mask",
        "text": "str_starts_with($value, $prefix) ? ltrim($value, $prefix) : $value",
        "rationale": "Even after verifying the prefix, ltrim consumes the whole leading run of p, r and e characters.",
        "misconception": "Assuming the prefix guard changes ltrim’s character-mask semantics."
      },
      {
        "id": "contains-check",
        "text": "str_contains($value, $prefix) ? substr($value, strlen($prefix)) : $value",
        "rationale": "xpre contains the prefix internally, so this incorrectly removes bytes from its beginning.",
        "misconception": "Checking substring presence instead of a leading-prefix boundary."
      },
      {
        "id": "prefix-check",
        "text": "str_starts_with($value, $prefix) ? substr($value, strlen($prefix)) : $value",
        "rationale": "The prefix is checked literally and exactly one prefix-length segment is removed.",
        "misconception": null
      }
    ],
    "correctOptionId": "prefix-check",
    "explanation": {
      "summary": "ltrim treats its second argument as a set of removable characters. Literal prefix removal requires checking the prefix and then slicing off exactly its byte length.",
      "trace": "prepress becomes press after removing one pre. xpre and plain do not start with pre and remain unchanged."
    },
    "validation": {
      "kind": "patch",
      "marker": "ltrim($value, $prefix)",
      "stdout": "[\"press\",\"xpre\",\"plain\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/function.ltrim.php",
      "https://www.php.net/manual/en/function.str-starts-with.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0229",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "implode-separator-argument-order",
    "objective": {
      "id": "implode-separator-argument-order",
      "text": "Use implode’s current signature to join text labels with the required separator."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Match argument roles to the supported PHP 8 signature and exact output format."
    },
    "prerequisites": [
      "implode",
      "Arrays of strings",
      "TypeError"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$names = ['Ada', 'Lin'];\n\ntry {\n    echo implode($names, ', ');\n} catch (TypeError $error) {\n    echo 'TypeError';\n}\n"
        }
      ]
    },
    "stem": "The result must be exactly Ada, Lin, using comma-space between the two names. Which replacement fixes this PHP 8 call?",
    "options": [
      {
        "id": "no-separator",
        "text": "implode('', $names)",
        "rationale": "This joins the names without the required comma-space.",
        "misconception": "Correcting argument types while dropping the output separator."
      },
      {
        "id": "separator-first",
        "text": "implode(', ', $names)",
        "rationale": "The separator precedes the array in the supported two-argument signature.",
        "misconception": null
      },
      {
        "id": "old-order",
        "text": "implode($names, ', ')",
        "rationale": "The historical reversed order is not supported on PHP 8.",
        "misconception": "Assuming the legacy argument order is still accepted."
      },
      {
        "id": "json",
        "text": "json_encode($names)",
        "rationale": "JSON adds brackets and quotes rather than producing the requested joined label.",
        "misconception": "Using structured serialization when a plain separator-joined string is required."
      }
    ],
    "correctOptionId": "separator-first",
    "explanation": {
      "summary": "The two-argument implode signature takes the separator first and the array second. PHP 8 no longer accepts the legacy reversed order.",
      "trace": "implode inserts comma-space between Ada and Lin without adding quotes or brackets."
    },
    "validation": {
      "kind": "patch",
      "marker": "implode($names, ', ')",
      "stdout": "Ada, Lin",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.implode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0230",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Variables, scope & constants",
    "subtopic": "global-variable-explicit-function-binding",
    "objective": {
      "id": "global-variable-explicit-function-binding",
      "text": "Bind a function’s local name to an existing global counter when that is the stated contract."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish local assignment from explicitly importing global storage."
    },
    "prerequisites": [
      "Function scope",
      "global",
      "Increment"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$count = 10;\n\nfunction countOne(): void\n{\n    $count = 0;\n    $count++;\n}\n\ncountOne();\ncountOne();\n\necho $count;\n"
        }
      ]
    },
    "stem": "This legacy function is required to increment the displayed global counter. Replace only its first statement so two calls leave that counter at 12. Which statement supplies the missing binding?",
    "options": [
      {
        "id": "copy-global",
        "text": "$count = $GLOBALS['count'];",
        "rationale": "This copies the global value into a local variable; incrementing that local does not update global storage.",
        "misconception": "Equating a value copy with importing the global variable binding."
      },
      {
        "id": "static-local",
        "text": "static $count = 10;",
        "rationale": "The static local persists between calls but is still separate from the displayed global counter.",
        "misconception": "Confusing persistent local lifetime with global scope."
      },
      {
        "id": "global-binding",
        "text": "global $count;",
        "rationale": "global binds the local name to the existing global variable, so both increments affect it.",
        "misconception": null
      },
      {
        "id": "unset-local",
        "text": "unset($count);\n$count = 10;",
        "rationale": "The subsequent assignment creates a local variable, which remains separate from the global.",
        "misconception": "Assuming removing a local variable makes later assignment resolve to global scope."
      }
    ],
    "correctOptionId": "global-binding",
    "explanation": {
      "summary": "Functions have their own variable scope. global explicitly binds the function’s local name to the global variable, allowing the following increment to update that storage.",
      "trace": "The first call changes global count from 10 to 11 and the second changes it to 12. This answers the explicit legacy contract, not a recommendation to prefer globals for new designs."
    },
    "validation": {
      "kind": "patch",
      "marker": "$count = 0;",
      "stdout": "12",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-02"
    },
    "references": [
      "https://www.php.net/manual/en/language.variables.scope.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0231",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Cookies & sessions",
    "subtopic": "cookie-deletion-path-identity",
    "objective": {
      "id": "cookie-deletion-path-identity",
      "text": "Repair an expired deletion cookie so it targets the original cookie’s path."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate a cookie’s stored identity from attributes that only govern transport or script access."
    },
    "prerequisites": [
      "setcookie",
      "Cookie path and domain",
      "Expiration"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "The browser stores one cookie named preference with Domain=example.test and Path=/account. An HTTPS response from example.test sends an expired cookie with the same name and domain but Path=/. No browser policy blocks this response. The original /account cookie remains."
      ],
      "files": []
    },
    "stem": "Which change to the expired setcookie response targets the cookie that the application intended to delete?",
    "options": [
      {
        "id": "earlier-expiry",
        "text": "Keep Path=/ and use an expiration date further in the past.",
        "rationale": "The deletion is already expired; an earlier date does not change which stored path it targets.",
        "misconception": "Treating expiration strength as a substitute for matching cookie identity."
      },
      {
        "id": "match-path",
        "text": "Change the expired cookie’s path option from / to /account.",
        "rationale": "The name, domain and path then match the stored cookie that must be expired.",
        "misconception": null
      },
      {
        "id": "clear-httponly",
        "text": "Keep Path=/ and set the httponly option to false.",
        "rationale": "HttpOnly controls script access, not the path component of the cookie’s identity.",
        "misconception": "Assuming access flags determine which stored cookie a deletion replaces."
      },
      {
        "id": "clear-secure",
        "text": "Keep Path=/ and set the secure option to false.",
        "rationale": "Changing transport restrictions does not target the /account cookie instead of /.",
        "misconception": "Assuming transport flags override cookie path matching."
      }
    ],
    "correctOptionId": "match-path",
    "explanation": {
      "summary": "A deletion response expires the cookie identified by its name, domain and path. Expiring the same name at a different path leaves the original cookie untouched.",
      "trace": "The current response targets preference at /, while the stored cookie is preference at /account. Matching /account directs the expired replacement to the intended cookie."
    },
    "validation": {
      "kind": "document-review",
      "rule": "RFC 6265 cookie storage/replacement uses matching name, domain and path; PHP setcookie exposes those attributes.",
      "optionAudit": {
        "earlier-expiry": "Still targets the wrong path.",
        "match-path": "Matches the stored cookie identity.",
        "clear-httponly": "Changes access policy but not path identity.",
        "clear-secure": "Changes transport policy but not path identity."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-13"
    },
    "references": [
      "https://www.php.net/manual/en/function.setcookie.php",
      "https://www.rfc-editor.org/rfc/rfc6265#section-5.3"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0232",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Cookies & sessions",
    "subtopic": "session-destroy-current-memory-clear",
    "objective": {
      "id": "session-destroy-current-memory-clear",
      "text": "Clear current-request session variables after destroying their persisted session data."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish session storage destruction, session identifier and the already populated superglobal."
    },
    "prerequisites": [
      "session_start",
      "session_destroy",
      "$_SESSION",
      "Request-local state"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "This CLI fixture disables cookies and uses an isolated writable temporary directory as its session store. All session operations succeed. The required observation concerns only current-process $_SESSION, not browser cookie deletion."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nsession_save_path(__DIR__);\nsession_id('fixture-session');\nsession_start(['use_cookies' => false, 'cache_limiter' => '']);\n$_SESSION['user'] = 'Ada';\nsession_destroy();\n\n// Clear current-request session data here.\n\necho json_encode($_SESSION);\n"
        }
      ]
    },
    "stem": "After session_destroy, the program must print an empty session array. Replace the marked statement. Which operation clears the in-memory variables at this point?",
    "options": [
      {
        "id": "unset-session",
        "text": "session_unset();",
        "rationale": "session_unset operates on an active session; the session has already been destroyed.",
        "misconception": "Assuming the active-session clearing helper still clears data after the session is inactive."
      },
      {
        "id": "empty-id",
        "text": "session_id('');",
        "rationale": "Changing the identifier does not empty the already populated $_SESSION array.",
        "misconception": "Equating the session identifier with the request’s session variable storage."
      },
      {
        "id": "cookie-only",
        "text": "unset($_COOKIE[session_name()]);",
        "rationale": "Changing the cookie superglobal does not change $_SESSION.",
        "misconception": "Treating the session cookie and loaded session data as the same storage."
      },
      {
        "id": "empty-array",
        "text": "$_SESSION = [];",
        "rationale": "Explicitly replacing the request-local array clears its remaining values.",
        "misconception": null
      }
    ],
    "correctOptionId": "empty-array",
    "explanation": {
      "summary": "session_destroy removes persisted session data but does not unset current-request session variables. After destruction, explicitly clearing $_SESSION removes the values that remain in memory.",
      "trace": "The user entry remains after session_destroy. Assigning an empty array makes the final JSON []; the other operations address inactive session helpers, identifiers or cookies."
    },
    "validation": {
      "kind": "patch",
      "marker": "// Clear current-request session data here.",
      "stdout": "[]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-13"
    },
    "references": [
      "https://www.php.net/manual/en/function.session-destroy.php",
      "https://www.php.net/manual/en/function.session-unset.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0233",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Forms & file uploads",
    "subtopic": "multiple-upload-parallel-array-indexing",
    "objective": {
      "id": "multiple-upload-parallel-array-indexing",
      "text": "Select successful upload names using matching indices across PHP’s parallel upload metadata arrays."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate each file’s error code from its array index and retain metadata alignment."
    },
    "prerequisites": [
      "$_FILES multiple uploads",
      "UPLOAD_ERR_OK",
      "foreach key/value pairs"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$uploads = [\n    'name' => ['first.txt', 'missing.txt', 'third.txt'],\n    'error' => [UPLOAD_ERR_OK, UPLOAD_ERR_NO_FILE, UPLOAD_ERR_OK],\n];\n$acceptedNames = [];\n\nforeach ($uploads['error'] as $index => $error) {\n    if ($error === UPLOAD_ERR_OK) {\n        $acceptedNames[] = $uploads['name'][0];\n    }\n}\n\necho json_encode($acceptedNames);\n"
        }
      ]
    },
    "stem": "acceptedNames must contain only the original names whose corresponding error is UPLOAD_ERR_OK. The supplied array is a fixed fixture; no file is opened or uploaded. Which expression repairs the name lookup?",
    "options": [
      {
        "id": "matching-index",
        "text": "$uploads['name'][$index]",
        "rationale": "The index identifies the same file across the name and error arrays.",
        "misconception": null
      },
      {
        "id": "error-index",
        "text": "$uploads['name'][$error]",
        "rationale": "Successful error codes are all zero, so both successes select first.txt.",
        "misconception": "Using an outcome code as though it identified the file’s position."
      },
      {
        "id": "accepted-count",
        "text": "$uploads['name'][count($acceptedNames)]",
        "rationale": "After skipping the failed upload, the number accepted no longer equals the current file index.",
        "misconception": "Using filtered output position to index the original unfiltered metadata."
      },
      {
        "id": "current-pointer",
        "text": "current($uploads['name'])",
        "rationale": "Nothing advances the name array’s internal pointer, so it keeps returning first.txt.",
        "misconception": "Assuming iteration over the error array advances the name array’s pointer."
      }
    ],
    "correctOptionId": "matching-index",
    "explanation": {
      "summary": "Multiple upload metadata is arranged in parallel arrays under each metadata field. A file’s original index connects its name, error and other fields even when some uploads are skipped.",
      "trace": "Indices 0 and 2 succeed and select first.txt and third.txt. The failed index 1 is skipped without renumbering the source arrays."
    },
    "validation": {
      "kind": "patch",
      "marker": "$uploads['name'][0]",
      "stdout": "[\"first.txt\",\"third.txt\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-12"
    },
    "references": [
      "https://www.php.net/manual/en/features.file-upload.multiple.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0234",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "csv-blank-line-versus-empty-field",
    "objective": {
      "id": "csv-blank-line-versus-empty-field",
      "text": "Skip a physical blank CSV line while retaining an explicitly quoted empty field."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish fgetcsv’s blank-line representation from a valid one-field empty record and string zero."
    },
    "prerequisites": [
      "fgetcsv",
      "Strict array comparison",
      "Stream loops"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The CSV dialect uses comma, double-quote enclosure and an empty escape parameter. The fixture contains a zero field, a physical blank line and a quoted empty field, in that order."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$handle = fopen('php://memory', 'w+');\nfwrite($handle, \"0\\n\\n\\\"\\\"\\n\");\nrewind($handle);\n$rows = [];\n\nwhile (($row = fgetcsv($handle, null, ',', '\"', '')) !== false) {\n    if (empty($row[0])) {\n        continue;\n    }\n\n    $rows[] = $row;\n}\n\nfclose($handle);\necho json_encode($rows);\n"
        }
      ]
    },
    "stem": "Keep the zero and quoted-empty records but skip the physical blank line. Which replacement for the if condition produces the required JSON?",
    "options": [
      {
        "id": "empty-field",
        "text": "$row === ['']",
        "rationale": "This skips the explicitly quoted empty record while retaining the physical blank line.",
        "misconception": "Equating an empty parsed string field with a physical blank line."
      },
      {
        "id": "empty-value",
        "text": "empty($row[0])",
        "rationale": "This also rejects the valid string zero and the quoted empty field.",
        "misconception": "Using PHP truthiness to classify physical CSV line structure."
      },
      {
        "id": "null-record",
        "text": "$row === [null]",
        "rationale": "fgetcsv represents a physical blank line as a one-element array containing null.",
        "misconception": null
      },
      {
        "id": "false-record",
        "text": "$row === false",
        "rationale": "The while condition already excludes false; a blank line is an array, so it would remain.",
        "misconception": "Treating a blank line as the same sentinel as end of file."
      }
    ],
    "correctOptionId": "null-record",
    "explanation": {
      "summary": "fgetcsv returns [null] for a blank line. A quoted empty field is an empty string, and a zero field is the string 0; both must remain under this contract.",
      "trace": "The three parsed records are [\"0\"], [null] and [\"\"]. Strict comparison to [null] removes only the middle record."
    },
    "validation": {
      "kind": "patch",
      "marker": "empty($row[0])",
      "stdout": "[[\"0\"],[\"\"]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.fgetcsv.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0235",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "nonblocking-empty-read-not-eof",
    "objective": {
      "id": "nonblocking-empty-read-not-eof",
      "text": "Repair premature termination when a nonblocking stream has no data available yet."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish temporary lack of bytes from end-of-stream and avoid a busy retry loop."
    },
    "prerequisites": [
      "Nonblocking streams (unmapped curriculum)",
      "fread",
      "feof",
      "Readiness notification"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "A PHP event-loop client reads from an already-open nonblocking stream. fread returns an empty string, feof is false, and no read error occurred. More data may arrive later. The client has a working readiness notifier and a fixed deadline. It must preserve accumulated bytes and must not busy-spin."
      ],
      "files": []
    },
    "stem": "The client currently treats every empty fread result as completion and returns a truncated message. Which state transition repairs this case?",
    "options": [
      {
        "id": "complete",
        "text": "Return the accumulated bytes as a complete message because fread returned no bytes.",
        "rationale": "An empty nonblocking read with feof false does not establish stream completion.",
        "misconception": "Equating temporarily unavailable data with end-of-stream."
      },
      {
        "id": "spin",
        "text": "Retry fread immediately until it returns a nonempty string, without yielding to the event loop.",
        "rationale": "This can busy-spin while the peer has not sent more data.",
        "misconception": "Treating retry as sufficient without waiting for readiness."
      },
      {
        "id": "wait",
        "text": "Keep the partial buffer and wait for readability or the existing deadline before another read.",
        "rationale": "This preserves progress and distinguishes readiness from EOF without spinning.",
        "misconception": null
      },
      {
        "id": "reconnect",
        "text": "Discard the partial buffer and reopen the connection before reading the remaining message.",
        "rationale": "Reconnecting loses the current stream position and may restart a different message exchange.",
        "misconception": "Treating temporary unavailability as a broken connection requiring a fresh stream."
      }
    ],
    "correctOptionId": "wait",
    "explanation": {
      "summary": "A nonblocking read may return an empty string because no bytes are currently available. With EOF and errors explicitly excluded, the reader should keep its state and wait through its event-loop readiness mechanism.",
      "trace": "The empty read supplies no new bytes but does not complete the message. Readiness resumes reading; the deadline supplies the separate timeout path."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Apply nonblocking stream behavior together with the explicit no-EOF/no-error and no-busy-spin requirements.",
      "optionAudit": {
        "complete": "Prematurely marks an incomplete stream as complete.",
        "spin": "Violates the no-busy-spin requirement.",
        "wait": "Retains partial state and uses readiness/deadline control.",
        "reconnect": "Discards the existing stream’s progress without evidence of a broken connection."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.stream-set-blocking.php",
      "https://www.php.net/manual/en/function.fread.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0236",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Types, casting & comparisons",
    "subtopic": "regex-replacement-backreference-followed-digit",
    "objective": {
      "id": "regex-replacement-backreference-followed-digit",
      "text": "Disambiguate a capture backreference followed by a literal digit in preg_replace."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate PHP string concatenation from the regex replacement parser’s later group-number interpretation."
    },
    "prerequisites": [
      "preg_replace",
      "Capture groups",
      "Single-quoted strings"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$text = 'ab';\n\necho preg_replace('/(ab)/', '$10', $text);\n"
        }
      ]
    },
    "stem": "The replacement must emit capture group 1 followed by the literal digit 0, producing ab0. Which replacement expression prevents the digit from becoming part of the backreference number?",
    "options": [
      {
        "id": "group-ten",
        "text": "'$10'",
        "rationale": "The replacement parser reads this as group 10, which does not exist in the pattern.",
        "misconception": "Assuming a backreference consumes only one digit."
      },
      {
        "id": "braced-group",
        "text": "'${1}0'",
        "rationale": "Braces delimit group 1, leaving the following 0 as literal output.",
        "misconception": null
      },
      {
        "id": "php-concatenation",
        "text": "'$1' . '0'",
        "rationale": "PHP concatenates these strings into $10 before preg_replace parses the replacement.",
        "misconception": "Assuming PHP string-expression boundaries remain visible to the replacement parser."
      },
      {
        "id": "whole-match-one",
        "text": "'$0' . '1'",
        "rationale": "This becomes $01, which refers to group 1 rather than appending the required literal 0.",
        "misconception": "Swapping group-zero and literal-one roles instead of delimiting group 1."
      }
    ],
    "correctOptionId": "braced-group",
    "explanation": {
      "summary": "The replacement string has its own backreference syntax. When a literal digit follows a capture reference, the braced form ${1} separates the reference from that digit.",
      "trace": "The correct string is ${1}0, so group 1 contributes ab and the final character contributes 0. Concatenating PHP strings $1 and 0 still produces the ambiguous replacement $10."
    },
    "validation": {
      "kind": "patch",
      "marker": "'$10'",
      "stdout": "ab0",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/function.preg-replace.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0237",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Arrays & destructuring",
    "subtopic": "value-sort-preserve-business-identifiers",
    "objective": {
      "id": "value-sort-preserve-business-identifiers",
      "text": "Sort values ascending while preserving their original integer identifiers."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Satisfy both ordering and key-retention requirements rather than checking sorted values alone."
    },
    "prerequisites": [
      "Array value sorting",
      "Key preservation",
      "Integer array keys",
      "Comparison callbacks"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$scores = [10 => 3, 20 => 1, 30 => 2];\nusort($scores, fn (int $a, int $b): int => $a <=> $b);\n\necho json_encode($scores);\n"
        }
      ]
    },
    "stem": "The integer keys are business identifiers, not list positions. Sort the scores ascending while retaining each identifier. Which complete sorting statement repairs the output?",
    "options": [
      {
        "id": "key-sort",
        "text": "ksort($scores);",
        "rationale": "This orders identifiers 10, 20, 30 rather than scores 1, 2, 3.",
        "misconception": "Sorting the business key instead of the associated score."
      },
      {
        "id": "descending",
        "text": "arsort($scores);",
        "rationale": "Keys remain attached, but scores are ordered descending.",
        "misconception": "Meeting key preservation while reversing the requested value order."
      },
      {
        "id": "reindex",
        "text": "usort($scores, fn (int $a, int $b): int => $a <=> $b);",
        "rationale": "usort discards the original keys and reindexes the sorted values.",
        "misconception": "Assuming a custom comparator implies preservation of original identifiers."
      },
      {
        "id": "preserve",
        "text": "uasort($scores, fn (int $a, int $b): int => $a <=> $b);",
        "rationale": "uasort applies the value comparator and preserves the original key associations.",
        "misconception": null
      }
    ],
    "correctOptionId": "preserve",
    "explanation": {
      "summary": "usort sorts values but reindexes their keys. uasort performs a user-defined value sort while keeping key-to-value associations intact.",
      "trace": "Score 1 with identifier 20 comes first, then score 2 with identifier 30, then score 3 with identifier 10."
    },
    "validation": {
      "kind": "patch",
      "marker": "usort($scores, fn (int $a, int $b): int => $a <=> $b);",
      "stdout": "{\"20\":1,\"30\":2,\"10\":3}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.uasort.php",
      "https://www.php.net/manual/en/function.usort.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0238",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "trait-conflict-resolution-and-secondary-alias",
    "objective": {
      "id": "trait-conflict-resolution-and-secondary-alias",
      "text": "Resolve a trait method collision while retaining the excluded implementation under an alias."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Coordinate conflict selection with aliasing rather than treating aliases as conflict resolution."
    },
    "prerequisites": [
      "Traits",
      "insteadof",
      "Trait aliases"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\ntrait FirstTransport\n{\n    public function send(): string\n    {\n        return 'first';\n    }\n}\n\ntrait SecondTransport\n{\n    public function send(): string\n    {\n        return 'second';\n    }\n}\n\nclass Sender\n{\n    use FirstTransport, SecondTransport {\n        FirstTransport::send as sendBackup;\n    }\n}\n\n$sender = new Sender();\n\necho json_encode([$sender->send(), $sender->sendBackup()]);\n"
        }
      ]
    },
    "stem": "Both traits define send. Use FirstTransport for send and retain SecondTransport as sendBackup. Which two adaptations replace the current alias and make the final JSON [\"first\",\"second\"]?",
    "options": [
      {
        "id": "select-and-alias",
        "text": "FirstTransport::send insteadof SecondTransport;\nSecondTransport::send as sendBackup;",
        "rationale": "insteadof selects the primary method, while as adds an alias for the other implementation.",
        "misconception": null
      },
      {
        "id": "alias-only",
        "text": "FirstTransport::send as sendPrimary;\nSecondTransport::send as sendBackup;",
        "rationale": "Both original send methods still collide; aliases do not remove their original names.",
        "misconception": "Assuming assigning aliases automatically resolves an original method-name collision."
      },
      {
        "id": "reverse-selection",
        "text": "SecondTransport::send insteadof FirstTransport;\nFirstTransport::send as sendBackup;",
        "rationale": "This produces second as the primary and first as the backup, reversing the requirement.",
        "misconception": "Resolving the collision but selecting the wrong trait for each role."
      },
      {
        "id": "same-implementation",
        "text": "FirstTransport::send insteadof SecondTransport;\nFirstTransport::send as sendBackup;",
        "rationale": "Both exposed methods execute FirstTransport, so the second implementation is not retained.",
        "misconception": "Assuming an alias name alone implies the alternate trait implementation."
      }
    ],
    "correctOptionId": "select-and-alias",
    "explanation": {
      "summary": "insteadof resolves the collision for the original method name. An as adaptation can still expose the excluded trait method under another name.",
      "trace": "send resolves to FirstTransport::send and returns first. sendBackup aliases SecondTransport::send and returns second."
    },
    "validation": {
      "kind": "patch",
      "marker": "FirstTransport::send as sendBackup;",
      "stdout": "[\"first\",\"second\"]",
      "errors": {
        "alias-only": "has not been applied"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.traits.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0239",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "import-alias-class-string-resolution",
    "objective": {
      "id": "import-alias-class-string-resolution",
      "text": "Construct a class-name string using a lexical import alias rather than assuming runtime string rewriting."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish compile-time name resolution from dynamic class instantiation."
    },
    "prerequisites": [
      "Namespaces",
      "use aliases",
      "::class",
      "Dynamic new"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nnamespace Vendor {\n    class Widget\n    {\n    }\n}\n\nnamespace App {\n    use Vendor\\Widget as LocalWidget;\n\n    try {\n        $class = 'LocalWidget';\n        echo get_class(new $class());\n    } catch (\\Throwable $error) {\n        echo get_class($error);\n    }\n}\n"
        }
      ]
    },
    "stem": "The dynamic instantiation must create Vendor\\Widget using the imported LocalWidget alias. Which expression should replace the assigned class-name string?",
    "options": [
      {
        "id": "literal-alias",
        "text": "'LocalWidget'",
        "rationale": "A runtime string is not resolved through the file’s use alias table.",
        "misconception": "Assuming import aliases rewrite arbitrary class-name strings."
      },
      {
        "id": "current-namespace",
        "text": "__NAMESPACE__ . '\\LocalWidget'",
        "rationale": "This names App\\LocalWidget, a class that was never declared.",
        "misconception": "Treating an imported alias as a class declared in the importing namespace."
      },
      {
        "id": "resolved-class",
        "text": "LocalWidget::class",
        "rationale": "The class-name constant resolves the import alias to Vendor\\Widget at compile time.",
        "misconception": null
      },
      {
        "id": "get-class-string",
        "text": "get_class(LocalWidget::class)",
        "rationale": "get_class expects an object here, while ::class already returns the needed string.",
        "misconception": "Applying object introspection to an already resolved class-name string."
      }
    ],
    "correctOptionId": "resolved-class",
    "explanation": {
      "summary": "use aliases participate in lexical name resolution. The ::class expression produces the resolved class-name string; a quoted alias remains just that literal text at runtime.",
      "trace": "LocalWidget::class resolves to Vendor\\Widget. Dynamic new uses that string to create the declared class, which get_class reports."
    },
    "validation": {
      "kind": "patch",
      "marker": "'LocalWidget'",
      "stdout": "Vendor\\Widget",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://www.php.net/manual/en/language.namespaces.dynamic.php",
      "https://www.php.net/manual/en/language.namespaces.importing.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0240",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Enums, attributes & reflection",
    "subtopic": "backed-enum-invalid-input-fallback",
    "objective": {
      "id": "backed-enum-invalid-input-fallback",
      "text": "Use tryFrom’s nullable result to apply a fallback for an unknown backing value."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a throwing conversion from a nullable conversion before coalescing."
    },
    "prerequisites": [
      "String-backed enums",
      "from versus tryFrom",
      "Null coalescing"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nenum Mode: string\n{\n    case Live = 'live';\n    case Draft = 'draft';\n}\n\n$names = [];\n\nforeach (['live', 'unknown'] as $value) {\n    try {\n        $mode = Mode::from($value) ?? Mode::Draft;\n        $names[] = $mode?->name;\n    } catch (ValueError $error) {\n        $names[] = 'ValueError';\n    }\n}\n\necho json_encode($names);\n"
        }
      ]
    },
    "stem": "Known backing values must retain their case; unknown strings must map to Draft. Which expression repairs the conversion so the two names are [\"Live\",\"Draft\"]?",
    "options": [
      {
        "id": "throwing-coalesce",
        "text": "Mode::from($value) ?? Mode::Draft",
        "rationale": "from throws for unknown instead of returning null, so the fallback is not reached.",
        "misconception": "Assuming null coalescing handles a failed throwing conversion."
      },
      {
        "id": "nullable-fallback",
        "text": "Mode::tryFrom($value) ?? Mode::Draft",
        "rationale": "Known values return their case; null from an unknown value selects Draft.",
        "misconception": null
      },
      {
        "id": "nullable-only",
        "text": "Mode::tryFrom($value)",
        "rationale": "Unknown values remain null, producing a null name rather than Draft.",
        "misconception": "Fixing the exception without implementing the required fallback."
      },
      {
        "id": "reversed-test",
        "text": "Mode::tryFrom($value) ? Mode::Draft : Mode::Live",
        "rationale": "A known case selects Draft while an unknown value selects Live, reversing the intended behavior.",
        "misconception": "Using the nullable result as a condition but assigning the branches backward."
      }
    ],
    "correctOptionId": "nullable-fallback",
    "explanation": {
      "summary": "from reports an unknown backing value by throwing ValueError. tryFrom returns null instead, allowing ?? to supply the specified fallback without changing valid cases.",
      "trace": "live resolves to Mode::Live. unknown yields null from tryFrom and is replaced by Mode::Draft."
    },
    "validation": {
      "kind": "patch",
      "marker": "Mode::from($value) ?? Mode::Draft",
      "stdout": "[\"Live\",\"Draft\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/language.enumerations.backed.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0241",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "authoritative-classmap-runtime-generated-class",
    "objective": {
      "id": "authoritative-classmap-runtime-generated-class",
      "text": "Restore PSR-4 discovery for classes generated after Composer’s optimized class map is built."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish optimized class-map acceleration from authoritative exclusion of unmapped classes."
    },
    "prerequisites": [
      "Composer 2 autoload optimization",
      "PSR-4",
      "Runtime code generation"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Composer 2 has an existing correct PSR-4 mapping for Generated\\. At build time an authoritative optimized class map is produced. Before a fresh PHP worker starts, a new Generated\\Report class file is created at its correct mapped path. It was absent during the build. No APCu autoloader is enabled and no lookup has yet occurred in that worker. The build pipeline must retain an optimized map while allowing these later files."
      ],
      "files": []
    },
    "stem": "The fresh worker cannot autoload Report even though its PSR-4 path is correct. Which build configuration change addresses the reason for this failure?",
    "options": [
      {
        "id": "more-classmap",
        "text": "Keep classmap-authoritative enabled and add the Generated directory to the build-time classmap scan.",
        "rationale": "A build-time scan still cannot include a file that does not exist until after that scan.",
        "misconception": "Assuming broader build-time scanning discovers future files."
      },
      {
        "id": "apcu-plus-authority",
        "text": "Keep classmap-authoritative enabled and enable APCu autoload caching.",
        "rationale": "APCu does not restore PSR-4 fallback that authoritative mode has disabled.",
        "misconception": "Treating a cache layer as an override for authoritative negative decisions."
      },
      {
        "id": "optimized-fallback",
        "text": "Disable classmap-authoritative, retain optimize-autoloader, and rebuild the generated autoloader configuration.",
        "rationale": "The optimized map handles known classes while absent entries may fall back to the existing PSR-4 mapping.",
        "misconception": null
      },
      {
        "id": "repeat-authoritative-build",
        "text": "Run another authoritative dump during the same build stage, before Report is generated.",
        "rationale": "Repeating the scan before the file exists produces the same missing class-map entry.",
        "misconception": "Treating regeneration timing as irrelevant to class discovery."
      }
    ],
    "correctOptionId": "optimized-fallback",
    "explanation": {
      "summary": "An optimized map can coexist with PSR-4 fallback. Authoritative mode instead declares classes absent from the map nonexistent, which conflicts with the stated post-build generation lifecycle.",
      "trace": "Report is not in the build-time map. With authority disabled, its first lookup in the fresh worker falls back to the correct Generated mapping and finds the later file."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Composer optimized class maps allow PSR-4 fallback for misses; authoritative maps do not. The file is explicitly created after every stated build-time scan.",
      "optionAudit": {
        "more-classmap": "The future file remains absent from the scan.",
        "apcu-plus-authority": "Caching does not reverse authoritative class-map semantics.",
        "optimized-fallback": "Keeps level-one optimization and restores the required fallback.",
        "repeat-authoritative-build": "The repeated scan still occurs too early."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://getcomposer.org/doc/articles/autoloader-optimization.md"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0242",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Enums, attributes & reflection",
    "subtopic": "enum-jsonserializable-recursive-self-reference",
    "objective": {
      "id": "enum-jsonserializable-recursive-self-reference",
      "text": "Repair recursive JSON serialization of a backed enum that overrides its default representation."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine enum backing values, JsonSerializable precedence and recursion through the serializer’s own result."
    },
    "prerequisites": [
      "Backed enums",
      "JsonSerializable",
      "JSON_THROW_ON_ERROR",
      "Recursive object graphs"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nenum DeliveryState: string implements JsonSerializable\n{\n    case Ready = 'ready';\n\n    public function jsonSerialize(): mixed\n    {\n        return ['state' => $this];\n    }\n}\n\ntry {\n    echo json_encode(DeliveryState::Ready, JSON_THROW_ON_ERROR);\n} catch (JsonException $error) {\n    echo 'JsonException';\n}\n"
        }
      ]
    },
    "stem": "The enum must encode as an object containing its lowercase wire value: {\"state\":\"ready\"}. Which return expression in jsonSerialize removes the recursion and meets that exact contract?",
    "options": [
      {
        "id": "case-name",
        "text": "['state' => $this->name]",
        "rationale": "This encodes Ready rather than the required lowercase backing value ready.",
        "misconception": "Using the PHP case identifier as the external wire value."
      },
      {
        "id": "lookup-case",
        "text": "['state' => self::from($this->value)]",
        "rationale": "from returns the same enum case, so the result still refers recursively to the object being serialized.",
        "misconception": "Assuming a backing-value lookup returns a scalar rather than an enum object."
      },
      {
        "id": "self-value",
        "text": "['state' => $this]",
        "rationale": "JsonSerializable overrides default backed-enum encoding; returning the case inside its own representation creates recursion.",
        "misconception": "Assuming nested enum values bypass the enum’s custom serializer."
      },
      {
        "id": "backing-scalar",
        "text": "['state' => $this->value]",
        "rationale": "The backing scalar completes the required object shape without reintroducing the enum instance.",
        "misconception": null
      }
    ],
    "correctOptionId": "backing-scalar",
    "explanation": {
      "summary": "A JsonSerializable implementation controls an enum’s JSON representation. Its returned structure must not recursively contain the same custom-serialized case; the backing scalar provides the required wire value.",
      "trace": "The correct return value is an ordinary array with state mapped to ready. The encoder produces the required JSON object without invoking jsonSerialize recursively."
    },
    "validation": {
      "kind": "patch",
      "marker": "['state' => $this]",
      "stdout": "{\"state\":\"ready\"}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/language.enumerations.serialization.php",
      "https://www.php.net/manual/en/jsonserializable.jsonserialize.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0243",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Transactions, migrations & ORM",
    "subtopic": "deferred-constraint-failed-commit-rollback",
    "objective": {
      "id": "deferred-constraint-failed-commit-rollback",
      "text": "Restore a PDO SQLite connection to a clean transaction state after a deferred constraint rejects commit."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a failed commit attempt from an ended transaction and remove its pending writes."
    },
    "prerequisites": [
      "PDO exception mode",
      "SQLite deferred foreign keys",
      "inTransaction",
      "Rollback"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "PDO",
        "pdo_sqlite"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "SQLite supports foreign keys and the PRAGMA succeeds. No external connection or application data is used. The failed unit of work must be discarded, not repaired by creating a missing parent."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n$pdo->exec('PRAGMA foreign_keys = ON');\n$pdo->exec('CREATE TABLE parents (id INTEGER PRIMARY KEY)');\n$pdo->exec('CREATE TABLE children (\n    id INTEGER PRIMARY KEY,\n    parent_id INTEGER REFERENCES parents(id) DEFERRABLE INITIALLY DEFERRED\n)');\n$pdo->beginTransaction();\n$pdo->exec('INSERT INTO children VALUES (1, 99)');\n\ntry {\n    $pdo->commit();\n} catch (PDOException $error) {\n    // Discard the failed unit of work here.\n}\n\necho json_encode([\n    $pdo->inTransaction(),\n    (int) $pdo->query('SELECT COUNT(*) FROM children')->fetchColumn(),\n]);\n"
        }
      ]
    },
    "stem": "The insert succeeds initially, but commit fails because the foreign key is deferred. Which catch-body replacement leaves no transaction active and no child row, producing [false,0]?",
    "options": [
      {
        "id": "rollback",
        "text": "if ($pdo->inTransaction()) {\n    $pdo->rollBack();\n}",
        "rationale": "The deferred failure leaves the transaction active; rollback removes its pending child insert.",
        "misconception": null
      },
      {
        "id": "wrong-state",
        "text": "if (!$pdo->inTransaction()) {\n    $pdo->rollBack();\n}",
        "rationale": "The transaction is still active, so the inverted guard skips the required rollback.",
        "misconception": "Assuming a failed commit means rollback should run only after the connection reports no active transaction."
      },
      {
        "id": "retry-commit",
        "text": "$pdo->commit();",
        "rationale": "The missing parent still makes the deferred constraint fail.",
        "misconception": "Retrying a deterministic constraint failure without changing or discarding the unit of work."
      },
      {
        "id": "delete-only",
        "text": "$pdo->exec('DELETE FROM children');",
        "rationale": "This removes the row inside the still-active transaction but does not end that transaction.",
        "misconception": "Equating undoing a visible row with completing the transaction boundary."
      }
    ],
    "correctOptionId": "rollback",
    "explanation": {
      "summary": "For this SQLite deferred foreign-key failure, COMMIT is rejected while the transaction remains open. Discarding the unit of work requires rollback, not merely catching the PDO exception.",
      "trace": "Before cleanup, the current transaction still contains the invalid child. rollback ends it and removes the insert; inTransaction is false and the child count is zero."
    },
    "validation": {
      "kind": "patch",
      "marker": "// Discard the failed unit of work here.",
      "stdout": "[false,0]",
      "errors": {
        "retry-commit": "FOREIGN KEY constraint failed"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-16"
    },
    "references": [
      "https://www.sqlite.org/foreignkeys.html#fk_deferred",
      "https://www.php.net/manual/en/pdo.intransaction.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0244",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Closures, callbacks & callables",
    "subtopic": "cloned-object-bound-closure-rebinding",
    "objective": {
      "id": "cloned-object-bound-closure-rebinding",
      "text": "Rebind a stored closure when cloning an object so the clone reads its own private state."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track a shallow-copied closure’s bound this separately from the cloned owner’s identity."
    },
    "prerequisites": [
      "Object cloning",
      "Stored closure binding",
      "Private property scope",
      "Stored arrow functions"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Reader\n{\n    private Closure $read;\n\n    public function __construct(private int $value)\n    {\n        $this->read = fn (): int => $this->value;\n    }\n\n    public function __clone(): void\n    {\n        $this->read = clone $this->read;\n    }\n\n    public function set(int $value): void\n    {\n        $this->value = $value;\n    }\n\n    public function get(): int\n    {\n        return ($this->read)();\n    }\n}\n\n$original = new Reader(1);\n$copy = clone $original;\n$copy->set(2);\n\necho json_encode([$original->get(), $copy->get()]);\n"
        }
      ]
    },
    "stem": "After cloning, each object’s stored reader must observe that object’s private value. Replace the clone-hook assignment so the final JSON is [1,2]. Which repair preserves the closure body and rebinds it to the clone?",
    "options": [
      {
        "id": "clone-closure",
        "text": "$this->read = clone $this->read;",
        "rationale": "Cloning a Closure object preserves its existing bound object, which is the original Reader.",
        "misconception": "Assuming cloning the closure automatically rebinds this to the new owner."
      },
      {
        "id": "rebind",
        "text": "$this->read = $this->read->bindTo($this, self::class);",
        "rationale": "The new closure binds this to the cloned Reader and retains access to Reader’s private property.",
        "misconception": null
      },
      {
        "id": "call-once",
        "text": "$this->read = $this->read->call($this);",
        "rationale": "call executes the closure and returns an integer, which cannot be stored in the Closure-typed property.",
        "misconception": "Confusing temporary invocation binding with creation of a rebound closure."
      },
      {
        "id": "capture-original",
        "text": "$this->read = Closure::fromCallable($this->read);",
        "rationale": "Converting the already-callable closure does not substitute a new bound object.",
        "misconception": "Assuming callable normalization changes closure ownership."
      }
    ],
    "correctOptionId": "rebind",
    "explanation": {
      "summary": "Object cloning is shallow, so the stored closure still has the original bound this. Cloning or normalizing the closure does not rebind it; bindTo creates the needed closure bound to the clone.",
      "trace": "The original reader remains bound to original and reads 1. The clone hook creates a reader bound to copy, which reads its later value 2."
    },
    "validation": {
      "kind": "patch",
      "marker": "$this->read = clone $this->read;",
      "stdout": "[1,2]",
      "errors": {
        "call-once": "Cannot assign int to property Reader::$read of type Closure"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/closure.bindto.php",
      "https://www.php.net/manual/en/language.oop5.cloning.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0245",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "PDO & database access",
    "subtopic": "pdo-class-constructor-before-hydration",
    "objective": {
      "id": "pdo-class-constructor-before-hydration",
      "text": "Select PDO class hydration that constructs each row object before assigning database columns."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Coordinate constructor timing, per-row identity and preservation of fetched values."
    },
    "prerequisites": [
      "PDO::FETCH_CLASS",
      "Hydration order",
      "Object construction"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "PDO",
        "pdo_sqlite"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Row\n{\n    public static array $seen = [];\n    public int $quantity = 0;\n\n    public function __construct()\n    {\n        self::$seen[] = $this->quantity;\n        $this->quantity = 99;\n    }\n}\n\n$pdo = new PDO('sqlite::memory:');\n$statement = $pdo->query('SELECT 10 AS quantity UNION ALL SELECT 20 AS quantity');\n$statement->setFetchMode(PDO::FETCH_CLASS, Row::class);\n$rows = [];\n\nwhile (($row = $statement->fetch()) !== false) {\n    $rows[] = $row;\n}\n\necho json_encode([\n    $rows[0] instanceof Row && $rows[1] instanceof Row && $rows[0] !== $rows[1],\n    [$rows[0]->quantity, $rows[1]->quantity],\n    Row::$seen,\n]);\n"
        }
      ]
    },
    "stem": "Each row must create a fresh Row, run its constructor while quantity is still its default 0, and then assign the fetched quantity. Which setFetchMode statement yields [true,[10,20],[0,0]]?",
    "options": [
      {
        "id": "default-class",
        "text": "$statement->setFetchMode(PDO::FETCH_CLASS, Row::class);",
        "rationale": "Default FETCH_CLASS assigns fetched properties before invoking the constructor, so it sees 10 and 20 and overwrites both with 99.",
        "misconception": "Assuming class hydration always follows ordinary constructor-first ordering."
      },
      {
        "id": "generic-objects",
        "text": "$statement->setFetchMode(PDO::FETCH_OBJ);",
        "rationale": "This produces stdClass objects without Row construction or its required initialization trace.",
        "misconception": "Treating object-shaped rows as equivalent to instances of the specified class."
      },
      {
        "id": "reuse-instance",
        "text": "$statement->setFetchMode(PDO::FETCH_INTO, new Row());",
        "rationale": "Both fetches populate the same Row instance; it is constructed only once and both retained references end at quantity 20.",
        "misconception": "Using FETCH_INTO when distinct per-row objects are required."
      },
      {
        "id": "props-late",
        "text": "$statement->setFetchMode(PDO::FETCH_CLASS | PDO::FETCH_PROPS_LATE, Row::class);",
        "rationale": "The constructor runs before properties are assigned, and FETCH_CLASS creates a separate object for each row.",
        "misconception": null
      }
    ],
    "correctOptionId": "props-late",
    "explanation": {
      "summary": "PDO::FETCH_PROPS_LATE changes FETCH_CLASS ordering so construction occurs before assigning fetched properties. FETCH_INTO instead reuses an existing object and cannot satisfy per-row identity.",
      "trace": "Each constructor records default quantity 0 and temporarily stores 99. Hydration then writes 10 or 20 into its distinct Row, leaving the constructor log [0,0]."
    },
    "validation": {
      "kind": "patch",
      "marker": "$statement->setFetchMode(PDO::FETCH_CLASS, Row::class);",
      "stdout": "[true,[10,20],[0,0]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdostatement.fetch.php",
      "https://www.php.net/manual/en/pdostatement.setfetchmode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0246",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Control flow & pattern matching",
    "subtopic": "early-loop-stop-retain-function-footer",
    "objective": {
      "id": "early-loop-stop-retain-function-footer",
      "text": "Refactor a function-level early return into a loop-level stop while retaining accumulated work."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish the control-flow boundaries of return, break and continue."
    },
    "prerequisites": [
      "foreach",
      "return",
      "break",
      "continue"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction countAllowed(array $flags, array &$log): int\n{\n    $count = 0;\n\n    foreach ($flags as $flag) {\n        if (!$flag) {\n            return $count;\n        }\n\n        $count++;\n    }\n\n    $log[] = 'finished';\n\n    return $count;\n}\n\n$log = [];\n$result = countAllowed([true, false, true], $log);\n\necho json_encode([$result, $log]);\n"
        }
      ]
    },
    "stem": "A review adds a requirement: stop at the first false flag, retain the count already accumulated, and always append finished afterward. Which replacement for the early return meets that requirement?",
    "options": [
      {
        "id": "skip-item",
        "text": "continue;",
        "rationale": "This skips only the false item and counts the later true item, producing 2.",
        "misconception": "Treating continue as termination of the whole loop."
      },
      {
        "id": "return-unchanged",
        "text": "return $count;",
        "rationale": "This exits the function before its logging footer.",
        "misconception": "Treating function return as a loop-only control operation."
      },
      {
        "id": "discard-count",
        "text": "$count = 0;\nbreak;",
        "rationale": "The footer runs, but resetting count discards the already accepted first item.",
        "misconception": "Interpreting the first false flag as invalidating prior work rather than stopping further work."
      },
      {
        "id": "stop-loop",
        "text": "break;",
        "rationale": "The loop stops with count 1; the footer runs before the final return.",
        "misconception": null
      }
    ],
    "correctOptionId": "stop-loop",
    "explanation": {
      "summary": "break exits the current loop while leaving the function active. The accumulated count remains intact and the function continues into its footer.",
      "trace": "The first true flag makes count 1. The false flag breaks the loop, finished is appended, and the final return yields 1."
    },
    "validation": {
      "kind": "patch",
      "marker": "            return $count;",
      "candidates": {
        "skip-item": "            continue;",
        "return-unchanged": "            return $count;",
        "discard-count": "            $count = 0;\n            break;",
        "stop-loop": "            break;"
      },
      "stdout": "[1,[\"finished\"]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-06"
    },
    "references": [
      "https://www.php.net/manual/en/control-structures.break.php",
      "https://www.php.net/manual/en/function.return.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0247",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Includes, autoloading & paths",
    "subtopic": "require-versus-include-missing-file-flow",
    "objective": {
      "id": "require-versus-include-missing-file-flow",
      "text": "Review how changing require to include changes missing-file control flow."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate handled warnings from the Error raised by a failed required inclusion."
    },
    "prerequisites": [
      "include",
      "require",
      "Error",
      "Custom error handlers"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "missing.php does not exist in the isolated directory. The displayed error handler handles warnings and produces no output; it does not convert them into exceptions."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nset_error_handler(static fn (): bool => true);\n\nfunction loadMissing(bool $required): string\n{\n    try {\n        if ($required) {\n            require __DIR__ . '/missing.php';\n        } else {\n            include __DIR__ . '/missing.php';\n        }\n\n        return 'after';\n    } catch (Error $error) {\n        return 'caught';\n    }\n}\n\n$result = [loadMissing(true), loadMissing(false)];\nrestore_error_handler();\n\necho json_encode($result);\n"
        }
      ]
    },
    "stem": "A reviewer proposes replacing require with include because the same Error catch surrounds both. Which assessment matches these two paths?",
    "options": [
      {
        "id": "same-caught",
        "text": "Both paths return caught because the handler converts every warning into Error.",
        "rationale": "The handler returns true; it does not throw. include does not produce the require-specific Error.",
        "misconception": "Assuming any custom error handler automatically converts warnings to exceptions."
      },
      {
        "id": "different-flow",
        "text": "require returns caught; include returns after, so the replacement changes failure control flow.",
        "rationale": "Failed require raises Error, while handled include warnings allow execution to continue.",
        "misconception": null
      },
      {
        "id": "same-after",
        "text": "Both paths return after because the warning handler suppresses the require failure too.",
        "rationale": "Handling warnings does not prevent the additional Error raised by a failed require.",
        "misconception": "Treating warning handling as suppression of an engine Error."
      },
      {
        "id": "reverse-flow",
        "text": "require returns after; include returns caught because include is the stricter operation.",
        "rationale": "The stricter missing-file behavior belongs to require.",
        "misconception": "Reversing the guarantees of the two inclusion constructs."
      }
    ],
    "correctOptionId": "different-flow",
    "explanation": {
      "summary": "A missing include warns and evaluates to false, allowing later statements to run if execution is not otherwise interrupted. A failed require raises Error in addition to its warning behavior on these PHP versions.",
      "trace": "The handler consumes the warnings in both paths. require reaches the Error catch; include reaches the after return."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"caught\",\"after\"]",
      "keyEvidence": "The same handler and catch surround both constructs, isolating their different failure behavior.",
      "counterexamples": {
        "same-caught": "The include result is after; no warning-to-exception conversion exists.",
        "same-after": "The require result is caught despite the warning handler.",
        "reverse-flow": "Observed order is caught,after rather than after,caught."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-09"
    },
    "references": [
      "https://www.php.net/manual/en/function.require.php",
      "https://www.php.net/manual/en/function.include.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0248",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "HTTP & superglobals",
    "subtopic": "http-safe-method-versus-idempotent-mutation",
    "objective": {
      "id": "http-safe-method-versus-idempotent-mutation",
      "text": "Distinguish a safe GET operation from an idempotent state-changing action."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply HTTP method semantics to a deliberate business mutation rather than infer safety from repeatability."
    },
    "prerequisites": [
      "HTTP GET",
      "Safe methods",
      "Idempotency"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "A PHP route GET /archive?id=7 deliberately marks record 7 archived. Repeating it leaves the same archived state. The route is authenticated and performs no other operation. Archiving is the requested business effect, not incidental access logging."
      ],
      "files": []
    },
    "stem": "A review calls this GET route safe because repeated requests do not change the final state again. Which assessment is correct?",
    "options": [
      {
        "id": "repeat-safe",
        "text": "The route is safe because an idempotent effect also satisfies GET’s read-only semantics.",
        "rationale": "Idempotency concerns repeated effects; safety concerns whether the client requested a state change at all.",
        "misconception": "Equating idempotency with safety."
      },
      {
        "id": "query-decides",
        "text": "The route is safe because id appears in the query string instead of a request body.",
        "rationale": "Parameter placement does not make a deliberate archival mutation read-only.",
        "misconception": "Deriving method safety from where inputs are carried."
      },
      {
        "id": "unsafe-action",
        "text": "The action is idempotent but not safe; deliberate archiving does not fit GET’s safe semantics.",
        "rationale": "A repeated mutation can be idempotent while still being a requested state change.",
        "misconception": null
      },
      {
        "id": "auth-decides",
        "text": "The route is safe because authentication limits who can request the archival change.",
        "rationale": "Authentication controls callers, not the semantic meaning of a safe method.",
        "misconception": "Treating authorized state changes as read-only operations."
      }
    ],
    "correctOptionId": "unsafe-action",
    "explanation": {
      "summary": "Safe HTTP methods are intended for essentially read-only requested actions. Idempotency is a separate property: repeating an operation has the same intended effect as performing it once.",
      "trace": "The first request deliberately changes record 7 from active to archived. Later identical requests add no further change, making the action idempotent but still unsafe in the HTTP sense."
    },
    "validation": {
      "kind": "document-review",
      "rule": "RFC 9110 distinguishes safe methods from idempotent methods; GET is safe while a deliberate archival mutation is not.",
      "optionAudit": {
        "repeat-safe": "Conflates two independent method properties.",
        "query-decides": "Input placement does not determine safety.",
        "unsafe-action": "Preserves the distinction between requested mutation and repeated effect.",
        "auth-decides": "Authorization does not change method semantics."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc9110#section-9.2.1",
      "https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0249",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Files & structured data",
    "subtopic": "append-and-lock-independent-write-flags",
    "objective": {
      "id": "append-and-lock-independent-write-flags",
      "text": "Combine append behavior with an exclusive lock when reviewing file_put_contents flags."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish write placement from locking and combine independent bit flags correctly."
    },
    "prerequisites": [
      "file_put_contents",
      "FILE_APPEND",
      "LOCK_EX",
      "Bitwise OR"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The owned local file is writable and all I/O succeeds. Cooperating writers use the same locking protocol. The requirement is to append without truncating and request LOCK_EX in this call; crash durability is outside this question."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$path = __DIR__ . '/log.txt';\nfile_put_contents($path, \"first\\n\");\n$flags = LOCK_EX;\nfile_put_contents($path, \"second\\n\", $flags);\n\necho json_encode([\n    file_get_contents($path),\n    ($flags & LOCK_EX) === LOCK_EX,\n]);\n"
        }
      ]
    },
    "stem": "The current LOCK_EX call still replaces the old content. Which flags assignment preserves first, appends second, and requests the exclusive lock?",
    "options": [
      {
        "id": "lock-only",
        "text": "$flags = LOCK_EX;",
        "rationale": "An exclusive lock does not itself request append behavior.",
        "misconception": "Assuming locking implies preservation of previous file contents."
      },
      {
        "id": "combined",
        "text": "$flags = FILE_APPEND | LOCK_EX;",
        "rationale": "Bitwise OR enables both independent flags.",
        "misconception": null
      },
      {
        "id": "append-only",
        "text": "$flags = FILE_APPEND;",
        "rationale": "This preserves content but does not request the required exclusive lock.",
        "misconception": "Treating append mode as an implicit locking guarantee."
      },
      {
        "id": "intersection",
        "text": "$flags = FILE_APPEND & LOCK_EX;",
        "rationale": "The distinct flag bits have no shared bit, so their AND does not enable either behavior.",
        "misconception": "Using bitwise intersection to combine independent options."
      }
    ],
    "correctOptionId": "combined",
    "explanation": {
      "summary": "FILE_APPEND controls whether new bytes are appended rather than replacing content. LOCK_EX separately requests an exclusive lock during the write. Bitwise OR enables both.",
      "trace": "The resulting file contains first followed by second on separate lines, and the flags contain the LOCK_EX bit."
    },
    "validation": {
      "kind": "patch",
      "marker": "$flags = LOCK_EX;",
      "stdout": "[\"first\\nsecond\\n\",true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.file-put-contents.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0250",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Arrays & destructuring",
    "subtopic": "missing-key-destructuring-warning-and-null",
    "objective": {
      "id": "missing-key-destructuring-warning-and-null",
      "text": "Review the diagnostic and assigned value when keyed destructuring requests a missing entry."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate a missing-key warning from the null value assigned after the handled warning."
    },
    "prerequisites": [
      "Keyed array destructuring",
      "E_WARNING",
      "Custom error handlers"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$warnings = 0;\nset_error_handler(function (int $severity) use (&$warnings): bool {\n    if ($severity === E_WARNING) {\n        $warnings++;\n    }\n\n    return true;\n});\n\n['email' => $email] = ['name' => 'Ada'];\nrestore_error_handler();\n\necho json_encode([$email, $warnings]);\n"
        }
      ]
    },
    "stem": "A review says keyed destructuring silently supplies null for a missing email field. Which assessment matches this program with its explicit warning handler?",
    "options": [
      {
        "id": "silent-null",
        "text": "email becomes null and the warning count stays zero.",
        "rationale": "The missing key produces E_WARNING even though the resulting assigned value is null.",
        "misconception": "Treating the assigned fallback value as evidence that no diagnostic occurred."
      },
      {
        "id": "positional-name",
        "text": "email becomes Ada and the warning count stays zero.",
        "rationale": "The email key is explicit; destructuring does not substitute the first available array entry.",
        "misconception": "Ignoring named destructuring keys and selecting by position."
      },
      {
        "id": "fatal-missing",
        "text": "An uncaught Error prevents email from being assigned.",
        "rationale": "The missing key produces a handled warning, not an uncaught Error in this example.",
        "misconception": "Treating every missing array key as a fatal engine failure."
      },
      {
        "id": "warn-and-null",
        "text": "email becomes null and the warning count becomes one.",
        "rationale": "PHP reports the missing key and then assigns null; the handler records the warning.",
        "misconception": null
      }
    ],
    "correctOptionId": "warn-and-null",
    "explanation": {
      "summary": "Requesting an undefined array key during destructuring raises a warning on PHP 8 and assigns null. The explicit handler handles that warning but does not make the original operation diagnostically silent.",
      "trace": "The array has name but no email. The handler records one E_WARNING, email receives null, and the final JSON is [null,1]."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[null,1]",
      "keyEvidence": "The program observes both the assigned value and the warning count.",
      "counterexamples": {
        "silent-null": "The observed warning count is one.",
        "positional-name": "The assigned value is null, not Ada.",
        "fatal-missing": "Execution reaches the final JSON after the handler handles the warning."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.array.php",
      "https://www.php.net/manual/en/function.set-error-handler.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0251",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Classes & object lifecycle",
    "subtopic": "unset-typed-property-magic-lazy-initialization",
    "objective": {
      "id": "unset-typed-property-magic-lazy-initialization",
      "text": "Review explicit unsetting of a typed property used to trigger magic lazy initialization."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish the ordinary uninitialized typed-property state from an explicitly unset property with a getter."
    },
    "prerequisites": [
      "Typed properties",
      "unset",
      "__get",
      "Property initialization"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass LazyNumber\n{\n    public int $number;\n    public int $loads = 0;\n\n    public function __construct()\n    {\n        unset($this->number);\n    }\n\n    public function __get(string $name): mixed\n    {\n        if ($name !== 'number') {\n            throw new LogicException('unknown property');\n        }\n\n        $this->loads++;\n        $this->number = 42;\n\n        return $this->number;\n    }\n}\n\n$value = new LazyNumber();\necho json_encode([$value->number, $value->number, $value->loads]);\n"
        }
      ]
    },
    "stem": "A reviewer removes unset from the constructor because the typed property already has no default. Which assessment describes the effect on the first read?",
    "options": [
      {
        "id": "equivalent",
        "text": "Removing unset preserves both reads and the one-time load because all uninitialized typed properties invoke __get.",
        "rationale": "An ordinary uninitialized typed property raises Error on read; explicit unsetting enables this magic-access pattern.",
        "misconception": "Equating the two property states for magic dispatch."
      },
      {
        "id": "repeat-load",
        "text": "Keeping unset makes every later read invoke __get, even after the getter assigns number.",
        "rationale": "The getter assigns the declared property, so the second read accesses its initialized value directly.",
        "misconception": "Assuming unsetting permanently redirects every access through magic."
      },
      {
        "id": "required-unset",
        "text": "Keeping unset permits the first magic load; removing it makes the first read fail before the lazy getter can initialize number.",
        "rationale": "The explicit unset is what establishes the magic lazy-access behavior; the getter’s assignment then initializes the property.",
        "misconception": null
      },
      {
        "id": "dynamic-property",
        "text": "The getter creates an unrelated dynamic property, so the declared typed number remains unreadable.",
        "rationale": "Assigning the declared name initializes that declared property, not a new dynamic property.",
        "misconception": "Treating magic getter assignment as creation of separate storage."
      }
    ],
    "correctOptionId": "required-unset",
    "explanation": {
      "summary": "An explicitly unset typed property can invoke __get, supporting lazy initialization. Simply leaving a declared typed property uninitialized does not provide the same access behavior.",
      "trace": "With unset, the first read calls __get, stores 42 and increments loads. The second read uses the initialized property, giving [42,42,1]. Without unset, the initial typed-property read raises Error."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[42,42,1]",
      "contrasts": [
        {
          "name": "remove-unset",
          "marker": "unset($this->number);",
          "replacement": "",
          "stdout": "",
          "error": "Typed property LazyNumber::$number must not be accessed before initialization"
        }
      ],
      "keyEvidence": "The original witness proves one magic load followed by a direct read; the removal is separately checked as a reviewed contrast.",
      "counterexamples": {
        "equivalent": "Removing unset leaves an ordinary uninitialized typed property; a direct read raises Error.",
        "repeat-load": "The observed loads count is one across two reads.",
        "dynamic-property": "The declared property is initialized and both reads return 42."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://wiki.php.net/rfc/typed_properties_v2#overloaded_properties",
      "https://www.php.net/manual/en/language.oop5.overloading.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0252",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Files & structured data",
    "subtopic": "json-throw-mode-does-not-reset-legacy-error-state",
    "objective": {
      "id": "json-throw-mode-does-not-reset-legacy-error-state",
      "text": "Review stale json_last_error state when JSON_THROW_ON_ERROR is used for a later operation."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate exception-based error reporting from the legacy process-local JSON error status."
    },
    "prerequisites": [
      "json_decode",
      "JSON_THROW_ON_ERROR",
      "json_last_error"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\njson_decode('{broken');\n$value = json_decode('{\"ok\":true}', true, 512, JSON_THROW_ON_ERROR);\n$legacyStillReportsSyntax = json_last_error() === JSON_ERROR_SYNTAX;\n\necho json_encode([$value, $legacyStillReportsSyntax]);\n"
        }
      ]
    },
    "stem": "A review interprets the final true flag as evidence that the second decode failed. Which assessment matches this code?",
    "options": [
      {
        "id": "stale-status",
        "text": "The second decode succeeds; the true flag is the legacy error left by the first decode.",
        "rationale": "Throwing-mode operations do not update the legacy global JSON error state.",
        "misconception": null
      },
      {
        "id": "second-failed",
        "text": "The second decode returns null because an earlier JSON error prevents later decoding.",
        "rationale": "The successful second result is the decoded ok field; earlier errors do not poison future decodes.",
        "misconception": "Treating the legacy error flag as a sticky execution-failure state."
      },
      {
        "id": "must-clear",
        "text": "The second decode throws JsonException until json_last_error is explicitly cleared.",
        "rationale": "JSON_THROW_ON_ERROR reacts to the current operation’s errors, not a prior legacy status.",
        "misconception": "Assuming stale status itself triggers a new exception."
      },
      {
        "id": "flag-false",
        "text": "The final flag must be false because every successful JSON operation resets legacy error state.",
        "rationale": "The second operation uses JSON_THROW_ON_ERROR, which leaves that legacy state unchanged.",
        "misconception": "Applying non-throwing API error-state behavior to throwing mode."
      }
    ],
    "correctOptionId": "stale-status",
    "explanation": {
      "summary": "JSON_THROW_ON_ERROR reports errors through exceptions and does not alter json_last_error’s legacy state. Inspecting that state after a throwing-mode call can therefore report an unrelated earlier operation.",
      "trace": "The first decode sets JSON_ERROR_SYNTAX. The second valid decode returns an array without changing that status. The saved boolean is true before the final output encoding."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[{\"ok\":true},true]",
      "keyEvidence": "Both the successfully decoded data and the retained legacy flag are observed before output encoding.",
      "counterexamples": {
        "second-failed": "The observed value contains ok=true, not null.",
        "must-clear": "No JsonException interrupts the successful second decode.",
        "flag-false": "The saved legacy-status comparison is true."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.json-last-error.php",
      "https://www.php.net/manual/en/json.constants.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0253",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Errors & exceptions",
    "subtopic": "restore-error-handler-stack-not-reinstall",
    "objective": {
      "id": "restore-error-handler-stack-not-reinstall",
      "text": "Restore the previous error-handler stack state rather than push another copy of a prior handler."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace nested installations and a later caller restoration to expose stack imbalance."
    },
    "prerequisites": [
      "set_error_handler",
      "restore_error_handler",
      "Nested cleanup ownership"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$log = [];\n$base = function () use (&$log): bool {\n    $log[] = 'base';\n\n    return true;\n};\n$outer = function () use (&$log): bool {\n    $log[] = 'outer';\n\n    return true;\n};\n$inner = function () use (&$log): bool {\n    $log[] = 'inner';\n\n    return true;\n};\n\nset_error_handler($base);\nset_error_handler($outer);\nset_error_handler($inner);\ntrigger_error('inside library', E_USER_WARNING);\n\n// Restore the library caller here.\n\ntrigger_error('inside caller', E_USER_WARNING);\nrestore_error_handler();\ntrigger_error('after caller', E_USER_WARNING);\nrestore_error_handler();\nrestore_error_handler();\n\necho json_encode($log);\n"
        }
      ]
    },
    "stem": "A library is done with its inner handler. Its cleanup must restore the caller’s handler and leave the stack balanced for the caller’s later restoration. Which replacement produces [\"inner\",\"outer\",\"base\"]?",
    "options": [
      {
        "id": "push-outer",
        "text": "set_error_handler($outer);",
        "rationale": "The next warning reaches outer, but the caller’s restore pops back to inner rather than base.",
        "misconception": "Equating reinstallation of the same callback with removal of the current stack frame."
      },
      {
        "id": "push-base",
        "text": "set_error_handler($base);",
        "rationale": "This skips the caller’s outer handler and also adds another stack entry.",
        "misconception": "Restoring the bottom handler instead of the immediate caller’s handler."
      },
      {
        "id": "keep-inner",
        "text": "set_error_handler($inner);",
        "rationale": "This installs another inner handler, so the caller’s warning is still handled by inner.",
        "misconception": "Assuming installing the current handler clears the nested registration."
      },
      {
        "id": "pop-inner",
        "text": "restore_error_handler();",
        "rationale": "This pops the library’s handler, allowing the caller’s later pop to reach base.",
        "misconception": null
      }
    ],
    "correctOptionId": "pop-inner",
    "explanation": {
      "summary": "set_error_handler installs a handler and changes the restoration stack. restore_error_handler removes the most recent installation, preserving the nesting expected by callers.",
      "trace": "The first warning reaches inner. Popping once restores outer; the caller’s next pop restores base. Reinstalling outer would leave inner underneath it."
    },
    "validation": {
      "kind": "patch",
      "marker": "// Restore the library caller here.",
      "stdout": "[\"inner\",\"outer\",\"base\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/function.restore-error-handler.php",
      "https://www.php.net/manual/en/function.set-error-handler.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0254",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Types, casting & comparisons",
    "subtopic": "calendar-day-versus-elapsed-day-dst",
    "objective": {
      "id": "calendar-day-versus-elapsed-day-dst",
      "text": "Review calendar-day arithmetic separately from adding an elapsed 24-hour interval."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Account for a stated timezone offset change while comparing two date arithmetic APIs."
    },
    "prerequisites": [
      "DateTimeImmutable",
      "DateInterval",
      "Timezone offsets",
      "Calendar versus elapsed duration"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "Europe/Zurich changes from UTC+01:00 to UTC+02:00 during the displayed interval in March 2025. The starting local time is noon on the day before that change."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$zone = new DateTimeZone('Europe/Zurich');\n$start = new DateTimeImmutable('2025-03-29 12:00:00', $zone);\n$calendar = $start->modify('+1 day');\n$elapsed = $start->add(new DateInterval('PT24H'));\n\necho json_encode([\n    $calendar->format('H:i'),\n    $elapsed->format('H:i'),\n    $calendar->getTimestamp() - $start->getTimestamp(),\n    $elapsed->getTimestamp() - $start->getTimestamp(),\n]);\n"
        }
      ]
    },
    "stem": "A review claims that modify(\"+1 day\") and add(new DateInterval(\"PT24H\")) are interchangeable here. Which assessment matches the resulting local times?",
    "options": [
      {
        "id": "both-noon",
        "text": "Both results are 12:00 because every day interval preserves local clock time.",
        "rationale": "The elapsed PT24H interval crosses the offset increase and lands at 13:00.",
        "misconception": "Treating elapsed hours as a calendar-day adjustment."
      },
      {
        "id": "calendar-versus-elapsed",
        "text": "The calendar result is 12:00 after 23 elapsed hours; the PT24H result is 13:00 after 24 hours.",
        "rationale": "The offset increase shortens the local calendar day while the elapsed interval remains 86400 seconds.",
        "misconception": null
      },
      {
        "id": "both-thirteen",
        "text": "Both results are 13:00 because +1 day always means exactly 86400 seconds.",
        "rationale": "The calendar-day modification preserves the local noon across this transition.",
        "misconception": "Treating every calendar day as a fixed elapsed duration."
      },
      {
        "id": "reversed",
        "text": "The calendar result is 13:00 and the PT24H result is 12:00.",
        "rationale": "This assigns elapsed-hour behavior to the calendar modification and vice versa.",
        "misconception": "Reversing the semantics of the two arithmetic operations."
      }
    ],
    "correctOptionId": "calendar-versus-elapsed",
    "explanation": {
      "summary": "Calendar arithmetic follows local date transitions, which can span fewer or more than 24 elapsed hours. An elapsed 24-hour interval advances the instant by 86400 seconds even when the local offset changes.",
      "trace": "Next-day noon is 23 elapsed hours later because the offset increases by one hour. Adding 24 elapsed hours therefore reaches 13:00 local time."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"12:00\",\"13:00\",82800,86400]",
      "keyEvidence": "The witness observes both local clock values and timestamp differences.",
      "counterexamples": {
        "both-noon": "The elapsed result is 13:00.",
        "both-thirteen": "The calendar result is 12:00 with an 82800-second difference.",
        "reversed": "The observed order is 12:00 then 13:00."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/datetime.examples-arithmetic.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0255",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Validation & web security",
    "subtopic": "password-rehash-only-after-verification",
    "objective": {
      "id": "password-rehash-only-after-verification",
      "text": "Identify authentication bypass caused by replacing a stored hash before checking the supplied password."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace credential state mutation across a rehash policy check and subsequent verification."
    },
    "prerequisites": [
      "password_verify",
      "password_needs_rehash",
      "Password hash migration"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$stored = password_hash('correct-password', PASSWORD_BCRYPT, ['cost' => 4]);\n$before = $stored;\n$input = 'wrong-password';\n\nif (password_needs_rehash($stored, PASSWORD_BCRYPT, ['cost' => 5])) {\n    $stored = password_hash($input, PASSWORD_BCRYPT, ['cost' => 5]);\n}\n\n$accepted = password_verify($input, $stored);\n\necho json_encode([$accepted, $stored === $before]);\n"
        }
      ]
    },
    "stem": "A review proposes upgrading old bcrypt cost settings during login using this code. The supplied password is wrong. Which assessment identifies the resulting authentication behavior?",
    "options": [
      {
        "id": "old-secret-preserved",
        "text": "The cost changes but the original password remains the verification secret, so the wrong password is rejected.",
        "rationale": "password_hash hashes the supplied input, not the secret associated with the previous stored hash.",
        "misconception": "Assuming rehashing a new input automatically preserves the old credential’s secret."
      },
      {
        "id": "snapshot-verification",
        "text": "The stored hash changes, but password_verify still compares against its earlier value and rejects the input.",
        "rationale": "The variable now contains the new hash when password_verify is called.",
        "misconception": "Assuming password verification uses an implicit snapshot of the old stored hash."
      },
      {
        "id": "salt-dependent",
        "text": "The wrong password is accepted only if the new random salt happens to match the old salt.",
        "rationale": "The new hash contains its own salt, and verification checks the input against that new hash.",
        "misconception": "Treating agreement with an earlier hash’s salt as necessary for verifying a newly generated hash."
      },
      {
        "id": "bypass",
        "text": "The wrong password is accepted when rehashing occurs; verify against the old hash before changing it.",
        "rationale": "The code first hashes the wrong input and then successfully verifies that same input against its new hash.",
        "misconception": null
      }
    ],
    "correctOptionId": "bypass",
    "explanation": {
      "summary": "A rehash policy check says the stored hash uses outdated parameters; it does not authenticate the supplied password. Replacing the hash first makes the later verification compare the candidate with a hash of itself.",
      "trace": "The cost-4 hash needs a cost-5 upgrade. The code replaces it with a hash of wrong-password, then accepts wrong-password. Verifying first would reject it and leave the original hash intact."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[true,false]",
      "contrasts": [
        {
          "name": "verify-before-rehash",
          "marker": "if (password_needs_rehash($stored, PASSWORD_BCRYPT, ['cost' => 5])) {\n    $stored = password_hash($input, PASSWORD_BCRYPT, ['cost' => 5]);\n}\n\n$accepted = password_verify($input, $stored);",
          "replacement": "$accepted = password_verify($input, $stored);\n\nif ($accepted && password_needs_rehash($stored, PASSWORD_BCRYPT, ['cost' => 5])) {\n    $stored = password_hash($input, PASSWORD_BCRYPT, ['cost' => 5]);\n}",
          "stdout": "[false,true]"
        }
      ],
      "keyEvidence": "The original accepts the wrong input and changes the hash; the repaired ordering rejects it and retains the old hash.",
      "counterexamples": {
        "old-secret-preserved": "The replacement hashes input, not the previous secret.",
        "snapshot-verification": "The call reads the reassigned stored variable.",
        "salt-dependent": "Verification succeeds using the salt embedded in the newly generated hash."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.password-needs-rehash.php",
      "https://www.php.net/manual/en/function.password-verify.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0256",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Validation & web security",
    "subtopic": "hashing-unique-id-does-not-create-entropy",
    "objective": {
      "id": "hashing-unique-id-does-not-create-entropy",
      "text": "Review whether hashing a uniqueness-oriented identifier provides an unpredictable authentication token."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish output formatting and apparent complexity from cryptographically secure input entropy."
    },
    "prerequisites": [
      "uniqid",
      "Hash functions",
      "Entropy sources and encoding",
      "Bearer-token unpredictability"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "A PHP application uses md5(uniqid(\"\", true)) as a 32-character password-reset token. Tokens must be unpredictable to an attacker who can estimate request timing. The application already stores only a token hash and enforces expiration; this review concerns token generation alone."
      ],
      "files": []
    },
    "stem": "Which review assessment addresses the missing generation guarantee?",
    "options": [
      {
        "id": "hash-hardness",
        "text": "MD5 makes the timed identifier unpredictable because reversing a hash is harder than reading a timestamp.",
        "rationale": "An attacker can enumerate plausible inputs and hash them; hashing does not create missing entropy.",
        "misconception": "Confusing one-way hashing with unpredictability of a small or predictable input space."
      },
      {
        "id": "secure-source",
        "text": "Use bin2hex(random_bytes(16)); the random source supplies unpredictability and hex supplies the 32-character representation.",
        "rationale": "random_bytes is intended for cryptographically secure random bytes, unlike uniqid.",
        "misconception": null
      },
      {
        "id": "longer-hash",
        "text": "Replace MD5 with SHA-256 and truncate to 32 characters; changing the hash alone supplies the missing randomness.",
        "rationale": "A stronger hash still receives the same predictability-limited input.",
        "misconception": "Treating a stronger digest algorithm as a source of fresh entropy."
      },
      {
        "id": "unique-guarantee",
        "text": "The more_entropy argument makes uniqid suitable because a sufficiently unique token must also be unpredictable.",
        "rationale": "Uniqueness and unpredictability are separate properties; uniqid is not a cryptographic random generator.",
        "misconception": "Equating low collision risk with resistance to prediction."
      }
    ],
    "correctOptionId": "secure-source",
    "explanation": {
      "summary": "Hashing changes the representation of an input but cannot make a predictable input source cryptographically random. Token generation should obtain entropy from a cryptographically secure generator before encoding it for transport.",
      "trace": "Sixteen random bytes contain 128 random bits; hex encoding represents them as 32 characters without adding or removing those bits. Expiration and hashed storage remain separate controls."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP documents uniqid as unsuitable for cryptographic purposes and random_bytes as a cryptographically secure byte source.",
      "optionAudit": {
        "hash-hardness": "Candidate inputs can be generated and hashed without inverting a digest.",
        "secure-source": "Uses the documented cryptographic source and a reversible textual encoding.",
        "longer-hash": "Digest choice does not improve input entropy.",
        "unique-guarantee": "Uniqueness does not imply unpredictability."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.uniqid.php",
      "https://www.php.net/manual/en/function.random-bytes.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0257",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "HTTP & superglobals",
    "subtopic": "redirect-helper-return-does-not-stop-caller",
    "objective": {
      "id": "redirect-helper-return-does-not-stop-caller",
      "text": "Review request control flow when a redirect helper returns to a caller that continues rendering."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate response headers, a helper’s return boundary and termination of the request handler."
    },
    "prerequisites": [
      "header",
      "Location response header",
      "Function return",
      "Request control flow"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "No output precedes header. In an HTTP request the response can accept the Location header. The CLI validation observes only PHP control flow; the literal private-view is a harmless fixture string."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction redirectToLogin(): void\n{\n    header('Location: /login', true, 302);\n\n    return;\n}\n\nredirectToLogin();\necho 'private-view';\n"
        }
      ]
    },
    "stem": "A reviewer claims that returning from redirectToLogin prevents the caller from rendering afterward. Which assessment matches this program?",
    "options": [
      {
        "id": "caller-continues",
        "text": "The caller still prints private-view; the helper’s return and Location header do not terminate the caller.",
        "rationale": "return exits only redirectToLogin, and header does not stop PHP execution.",
        "misconception": null
      },
      {
        "id": "header-stops",
        "text": "The caller prints nothing because setting Location immediately ends PHP execution.",
        "rationale": "header changes response metadata; execution continues unless code explicitly stops it.",
        "misconception": "Treating a redirect header as an execution-control statement."
      },
      {
        "id": "return-stops",
        "text": "The caller prints nothing because any return after header ends the entire request.",
        "rationale": "A return inside a function returns to its caller regardless of previously set headers.",
        "misconception": "Expanding a helper’s return boundary to the whole request."
      },
      {
        "id": "body-replaced",
        "text": "The caller prints /login because Location replaces all later response-body output.",
        "rationale": "The header specifies a redirect target; it does not rewrite echo arguments.",
        "misconception": "Confusing a response header value with the response body."
      }
    ],
    "correctOptionId": "caller-continues",
    "explanation": {
      "summary": "A redirect header and PHP execution are separate concerns. A helper return resumes its caller, so the request handler must explicitly stop rendering or the helper must deliberately terminate execution according to the application’s design.",
      "trace": "header sets response metadata, return exits the helper, and the caller reaches echo. The local control-flow witness prints private-view."
    },
    "validation": {
      "kind": "contract",
      "stdout": "private-view",
      "keyEvidence": "The literal output proves that control reaches the caller’s echo after the helper returns; HTTP header delivery is not claimed by the CLI test.",
      "counterexamples": {
        "header-stops": "The observed echo still runs.",
        "return-stops": "The helper returns to the calling script.",
        "body-replaced": "The observed body literal remains private-view rather than the Location target."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/function.header.php",
      "https://www.php.net/manual/en/function.return.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0258",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Classes & object lifecycle",
    "subtopic": "public-property-bypasses-magic-setter",
    "objective": {
      "id": "public-property-bypasses-magic-setter",
      "text": "Review whether __set enforces a range invariant on an accessible declared property."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish magic access interception from ordinary typed-property assignment."
    },
    "prerequisites": [
      "Public and private visibility",
      "__set",
      "Typed properties",
      "Range validation"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Person\n{\n    public int $age = 0;\n    public int $setterCalls = 0;\n\n    public function __set(string $name, mixed $value): void\n    {\n        $this->setterCalls++;\n\n        if ($name !== 'age' || !is_int($value) || $value < 0) {\n            throw new InvalidArgumentException('invalid age');\n        }\n\n        $this->age = $value;\n    }\n\n    public function getAge(): int\n    {\n        return $this->age;\n    }\n}\n\n$person = new Person();\n$caught = false;\n\ntry {\n    $person->age = -1;\n} catch (InvalidArgumentException $error) {\n    $caught = true;\n}\n\necho json_encode([$person->getAge(), $person->setterCalls, $caught]);\n"
        }
      ]
    },
    "stem": "A reviewer claims __set guarantees that age cannot become negative. Which assessment matches this assignment and the relevant dispatch rule?",
    "options": [
      {
        "id": "always-before",
        "text": "__set runs before every property write, so it rejects -1 before changing age.",
        "rationale": "Accessible declared properties are written directly without invoking __set.",
        "misconception": "Treating __set as a universal before-write interceptor."
      },
      {
        "id": "type-fallback",
        "text": "__set is skipped here only because -1 already has type int; an invalid scalar type would be routed to __set.",
        "rationale": "Public typed-property type failures do not route writes through __set either.",
        "misconception": "Treating __set as a fallback for typed-property conversion errors."
      },
      {
        "id": "accessible-bypass",
        "text": "The public property is assigned directly, bypassing __set; its int type permits negative integers.",
        "rationale": "Visibility makes the property directly writable, so the custom range check never runs.",
        "misconception": null
      },
      {
        "id": "always-after",
        "text": "__set runs after the write, so age becomes -1 and then the range exception is thrown.",
        "rationale": "The method is not invoked at all for this accessible property assignment.",
        "misconception": "Treating __set as an after-write observer rather than inaccessible-property handling."
      }
    ],
    "correctOptionId": "accessible-bypass",
    "explanation": {
      "summary": "__set handles writes to inaccessible or nonexistent properties. It does not intercept ordinary assignments to a public declared property, and an int type alone has no nonnegative-range constraint.",
      "trace": "The direct write stores -1, setterCalls remains 0 and no exception is caught. Making age private routes the outside write through __set, which rejects it before changing the stored value."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[-1,0,false]",
      "contrasts": [
        {
          "name": "private-property-guard",
          "marker": "public int $age = 0;",
          "replacement": "private int $age = 0;",
          "stdout": "[0,1,true]"
        }
      ],
      "keyEvidence": "The public witness bypasses the setter; the private contrast invokes it and preserves the valid initial value.",
      "counterexamples": {
        "always-before": "The public witness records zero setter calls.",
        "type-fallback": "Magic setter dispatch depends on accessibility/existence, not recovery from type failure.",
        "always-after": "No setter call or caught range exception occurs."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.overloading.php",
      "https://www.php.net/manual/en/language.oop5.properties.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0259",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "HTTP & superglobals",
    "subtopic": "filter-input-original-sapi-snapshot",
    "objective": {
      "id": "filter-input-original-sapi-snapshot",
      "text": "Review whether filter_input validates a value subsequently assigned into $_GET by application code."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate the original SAPI input snapshot from mutations to a superglobal array."
    },
    "prerequisites": [
      "$_GET",
      "filter_input",
      "SAPI input handling",
      "Validation of mutable input arrays"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "In a web request, the original query string is page=1. Application code then assigns the string 2 to $_GET[\"page\"]. No other input mutation occurs. The review concerns PHP 8.4/8.5 filter_input behavior, not a CLI request simulation."
      ],
      "files": []
    },
    "stem": "The next statement calls filter_input(INPUT_GET, \"page\", FILTER_VALIDATE_INT). A review claims it validates the newly assigned 2. Which assessment is correct?",
    "options": [
      {
        "id": "current-array",
        "text": "It returns integer 2 because filter_input reads the current contents of $_GET.",
        "rationale": "filter_input reads the original SAPI-provided value, not the later superglobal mutation.",
        "misconception": "Treating filter_input as shorthand for filter_var on the current array entry."
      },
      {
        "id": "input-removed",
        "text": "It returns null because changing $_GET removes that field from the SAPI input snapshot.",
        "rationale": "Changing the userland array does not delete the original SAPI input value.",
        "misconception": "Assuming writes to a superglobal rewrite the original request snapshot."
      },
      {
        "id": "untrusted-mutation",
        "text": "It returns false because filter_input detects that application code modified the field.",
        "rationale": "There is no mutation-detection rejection here; the original valid integer text is still available.",
        "misconception": "Assuming input filtering tracks a tamper flag on userland assignments."
      },
      {
        "id": "original-snapshot",
        "text": "It returns integer 1; use filter_var on the current array entry to validate the assigned 2.",
        "rationale": "The API reads original input, whereas filter_var can validate the supplied current value.",
        "misconception": null
      }
    ],
    "correctOptionId": "original-snapshot",
    "explanation": {
      "summary": "filter_input accesses the original input supplied by the SAPI, independently of later changes to $_GET. To validate a normalized or replaced userland value, pass that value to filter_var.",
      "trace": "The original request snapshot contains page=1. The array now contains page=2, but filter_input still parses the snapshot’s 1. This is document-backed web behavior and is not claimed as a CLI execution test."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP documents filter_input as reading original raw input supplied by the SAPI before userland changes to superglobals.",
      "optionAudit": {
        "current-array": "Confuses original request data with the current userland array.",
        "input-removed": "Array assignment does not remove the original input.",
        "untrusted-mutation": "No such mutation-detection failure is specified.",
        "original-snapshot": "Uses the original 1; filter_var is the appropriate API for the current 2."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/function.filter-input.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0260",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "HTTP & superglobals",
    "subtopic": "server-http-host-reset-link-origin-trust",
    "objective": {
      "id": "server-http-host-reset-link-origin-trust",
      "text": "Review the provenance of HTTP_HOST when constructing a security-sensitive absolute URL."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish server-created container variables from client-originated values stored inside that container."
    },
    "prerequisites": [
      "$_SERVER",
      "HTTP Host header",
      "Absolute URLs",
      "Configured application origin"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "A PHP endpoint builds emailed password-reset links using \"https://\" . $_SERVER[\"HTTP_HOST\"] as the origin. The web-server configuration does not reject unrecognized Host values or replace the header with one canonical configured host. The application has a trusted configured public origin available."
      ],
      "files": []
    },
    "stem": "A review says the generated origin is trustworthy because the value is inside $_SERVER. Which assessment identifies the missing boundary?",
    "options": [
      {
        "id": "server-container",
        "text": "The value is trustworthy because PHP populated $_SERVER rather than reading a form field.",
        "rationale": "The container name does not make every entry server-authored; HTTP_HOST derives from the request Host header.",
        "misconception": "Treating all $_SERVER entries as trusted server configuration."
      },
      {
        "id": "host-provenance",
        "text": "HTTP_HOST reflects request input; use the trusted configured origin or an explicit allowed-origin mapping for reset links.",
        "rationale": "The origin needs application-level trust, not merely placement in the server superglobal.",
        "misconception": null
      },
      {
        "id": "tls-guarantee",
        "text": "HTTPS makes every Host value received by the endpoint a verified application origin.",
        "rationale": "TLS does not supply the missing application Host allowlist in the stated server configuration.",
        "misconception": "Assuming transport security authorizes arbitrary request-host values for generated links."
      },
      {
        "id": "syntax-sufficient",
        "text": "A syntactically valid hostname is sufficient because hostname validation also proves application ownership.",
        "rationale": "Syntax validation does not prove that a host is an authorized public origin for this application.",
        "misconception": "Equating valid hostname syntax with origin authorization."
      }
    ],
    "correctOptionId": "host-provenance",
    "explanation": {
      "summary": "$_SERVER contains both server information and values derived from request headers. HTTP_HOST is not a substitute for a configured trusted origin when generating security-sensitive absolute links.",
      "trace": "An unrecognized Host can reach the endpoint under the stated configuration and be copied into a reset URL. A configured origin or explicit trusted mapping prevents that header from choosing the link destination."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP identifies HTTP_ entries as request-header-derived server variables; the scenario explicitly lacks a server Host allowlist.",
      "optionAudit": {
        "server-container": "Provenance depends on the entry, not the superglobal name.",
        "host-provenance": "Uses an application-trusted origin boundary.",
        "tls-guarantee": "TLS does not provide the absent application Host policy.",
        "syntax-sufficient": "A well-formed attacker-selected hostname remains unauthorized."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/reserved.variables.server.php",
      "https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0261",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Validation & web security",
    "subtopic": "gcm-tag-length-protocol-validation",
    "objective": {
      "id": "gcm-tag-length-protocol-validation",
      "text": "Review whether successful GCM decryption proves compliance with a protocol’s required authentication-tag length."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Separate cryptographic API acceptance from a stricter framing and tag-length contract."
    },
    "prerequisites": [
      "Authenticated encryption (advanced)",
      "AES-GCM tags",
      "openssl_decrypt",
      "Binary byte lengths"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "openssl"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The application protocol requires exactly 16 tag bytes. This is one deterministic local test vector with fixed dummy key and IV, not a production nonce-generation example. The tag passed to decryption is intentionally shortened to its first 8 bytes."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$key = str_repeat('K', 16);\n$iv = str_repeat('I', 12);\n$plaintext = 'fixture';\n$tag = '';\n$ciphertext = openssl_encrypt(\n    $plaintext,\n    'aes-128-gcm',\n    $key,\n    OPENSSL_RAW_DATA,\n    $iv,\n    $tag,\n    '',\n    16,\n);\n$shortTag = substr($tag, 0, 8);\n$decoded = openssl_decrypt(\n    $ciphertext,\n    'aes-128-gcm',\n    $key,\n    OPENSSL_RAW_DATA,\n    $iv,\n    $shortTag,\n);\n\necho json_encode([strlen($tag), strlen($shortTag), $decoded === $plaintext]);\n"
        }
      ]
    },
    "stem": "A review claims openssl_decrypt will reject every tag shorter than the protocol’s 16-byte requirement. Which assessment matches this fixture and the API boundary?",
    "options": [
      {
        "id": "fixed-api-length",
        "text": "The API always requires 16 tag bytes, so decryption returns false before authenticating this input.",
        "rationale": "The API does not enforce the application’s original tag length; this matching shorter prefix can be accepted.",
        "misconception": "Assuming the API remembers or enforces the sender’s protocol tag length."
      },
      {
        "id": "ciphertext-length",
        "text": "The ciphertext encodes the tag length, so the shorter argument is automatically expanded back to 16 bytes.",
        "rationale": "The GCM tag is passed separately and the omitted bytes are not recovered from this ciphertext.",
        "misconception": "Assuming authentication metadata is embedded in the raw ciphertext automatically."
      },
      {
        "id": "caller-length-check",
        "text": "This shortened matching tag can decrypt successfully; the caller must enforce the required 16-byte length before decryption.",
        "rationale": "Successful API authentication with the supplied tag does not establish compliance with the stricter protocol length.",
        "misconception": null
      },
      {
        "id": "ignored-tag",
        "text": "The plaintext is returned because OPENSSL_RAW_DATA disables authentication and ignores the supplied tag.",
        "rationale": "OPENSSL_RAW_DATA controls data encoding, not GCM authentication.",
        "misconception": "Confusing raw binary output with unauthenticated decryption."
      }
    ],
    "correctOptionId": "caller-length-check",
    "explanation": {
      "summary": "The PHP API does not enforce that a supplied GCM tag has the same length as the tag originally generated. The application must validate its required tag length explicitly; raw-data mode does not disable authentication.",
      "trace": "The original tag is 16 bytes. Its matching 8-byte prefix is accepted in this fixture, yielding [16,8,true]. A protocol requiring 16 bytes should reject that framing before calling decrypt."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[16,8,true]",
      "keyEvidence": "The local test demonstrates acceptance of a matching short tag, while the documented API assigns length validation to the caller.",
      "counterexamples": {
        "fixed-api-length": "The fixture successfully decrypts with 8 supplied tag bytes.",
        "ciphertext-length": "strlen(shortTag) remains 8 and the omitted bytes are not supplied.",
        "ignored-tag": "RAW_DATA affects encoding; GCM still verifies the supplied tag."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.openssl-decrypt.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0262",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Files & structured data",
    "subtopic": "duplicate-json-members-parser-disagreement",
    "objective": {
      "id": "duplicate-json-members-parser-disagreement",
      "text": "Detect authorization-relevant disagreement between a first-match text scan and PHP JSON decoding."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace two interpretations of duplicate object members and distinguish syntax validation from unambiguous application semantics."
    },
    "prerequisites": [
      "JSON object member names",
      "preg_match first match",
      "JSON_THROW_ON_ERROR",
      "Parser disagreement"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$body = '{\"role\":\"user\",\"role\":\"admin\"}';\npreg_match('/\"role\":\"([^\"]+)\"/', $body, $match);\n$gateAllows = $match[1] === 'user';\n$decoded = json_decode($body, true, 512, JSON_THROW_ON_ERROR);\n\necho json_encode([$gateAllows, $decoded['role']]);\n"
        }
      ]
    },
    "stem": "A review claims JSON_THROW_ON_ERROR makes this first-role gate agree with the later decoded role. Which assessment matches the fixed local payload?",
    "options": [
      {
        "id": "throw-duplicates",
        "text": "Decoding throws JsonException because JSON_THROW_ON_ERROR rejects duplicate member names.",
        "rationale": "PHP accepts this JSON and keeps the later value; the flag does not add duplicate-name rejection.",
        "misconception": "Treating exception-based reporting as a stricter semantic uniqueness validator."
      },
      {
        "id": "different-roles",
        "text": "The gate allows user while PHP decodes admin; the two stages disagree despite the throwing flag.",
        "rationale": "The regex finds the first role occurrence, while decoding retains the later value.",
        "misconception": null
      },
      {
        "id": "first-wins",
        "text": "Both stages use user because PHP keeps the first value of a duplicate member.",
        "rationale": "PHP’s decoded array contains the later admin value for role.",
        "misconception": "Assuming the decoder uses first-wins semantics matching the text scan."
      },
      {
        "id": "regex-last",
        "text": "Both stages use admin because preg_match returns the last occurrence of the capture.",
        "rationale": "A single preg_match finds the first matching occurrence in this payload.",
        "misconception": "Confusing one match with collection of all matches followed by selection of the last."
      }
    ],
    "correctOptionId": "different-roles",
    "explanation": {
      "summary": "Duplicate JSON member names are not rejected by JSON_THROW_ON_ERROR in PHP. A text scan and the JSON parser can therefore select different values; authorization should operate on one deliberately validated representation instead of an independent regex interpretation.",
      "trace": "preg_match captures user and the gate allows it. json_decode stores the later role value admin, so the final JSON is [true,\"admin\"]."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[true,\"admin\"]",
      "keyEvidence": "Both stages consume the identical fixed string and visibly select different role values.",
      "counterexamples": {
        "throw-duplicates": "The program completes rather than throwing JsonException.",
        "first-wins": "The decoded role is admin.",
        "regex-last": "The gate is true because the regex captured user."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.json-decode.php",
      "https://www.rfc-editor.org/rfc/rfc8259#section-4"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0263",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Transactions, migrations & ORM",
    "subtopic": "fiber-shared-pdo-transaction-ownership",
    "objective": {
      "id": "fiber-shared-pdo-transaction-ownership",
      "text": "Review transaction isolation assumptions when two Fibers reuse the same PDO connection."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Follow connection-owned transaction state across cooperative suspension and another task’s write."
    },
    "prerequisites": [
      "Fibers",
      "PDO connection lifetime",
      "Transaction ownership",
      "Rollback"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "PDO",
        "pdo_sqlite"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec('CREATE TABLE events (label TEXT)');\n\n$a = new Fiber(function () use ($pdo): void {\n    $pdo->beginTransaction();\n    $pdo->exec(\"INSERT INTO events VALUES ('A')\");\n    Fiber::suspend();\n    $pdo->rollBack();\n});\n$b = new Fiber(function () use ($pdo): void {\n    $pdo->exec(\"INSERT INTO events VALUES ('B')\");\n});\n\n$a->start();\n$b->start();\n$a->resume();\n\necho json_encode($pdo->query('SELECT label FROM events ORDER BY label')->fetchAll(PDO::FETCH_COLUMN));\n"
        }
      ]
    },
    "stem": "A review claims B’s insert is independent because B never called beginTransaction. What does this shared-connection schedule imply?",
    "options": [
      {
        "id": "fiber-local",
        "text": "B remains because each Fiber automatically receives a separate transaction on a shared PDO object.",
        "rationale": "Fiber scheduling does not create another database connection or transaction context.",
        "misconception": "Treating execution context as automatic database isolation."
      },
      {
        "id": "implicit-commit",
        "text": "B remains because executing a statement outside B’s own beginTransaction call automatically commits it.",
        "rationale": "The connection is already inside A’s transaction when B executes.",
        "misconception": "Determining transaction membership from the current callback’s call history rather than connection state."
      },
      {
        "id": "fiber-rejected",
        "text": "B’s start throws FiberError because PDO forbids access while another Fiber has an open transaction.",
        "rationale": "PDO does not enforce this per-Fiber ownership rule in the shown SQLite fixture.",
        "misconception": "Assuming the driver supplies a scheduler-aware ownership guard."
      },
      {
        "id": "connection-owned",
        "text": "Neither row remains; B used the same connection’s active transaction and A rolled both writes back.",
        "rationale": "Transaction state belongs to the shared connection, so B’s insert joins the active transaction.",
        "misconception": null
      }
    ],
    "correctOptionId": "connection-owned",
    "explanation": {
      "summary": "A PDO transaction belongs to its connection, not to the Fiber that started it. Sharing that connection across overlapping task lifetimes allows one task’s writes to enter another task’s transaction.",
      "trace": "A begins and inserts A, then suspends. B inserts using the still-active connection transaction. A resumes and rolls back both inserts, leaving an empty result."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[]",
      "keyEvidence": "The deterministic Fiber schedule leaves no rows after the shared connection rollback.",
      "counterexamples": {
        "fiber-local": "Both Fibers close over the exact same PDO object.",
        "implicit-commit": "The connection remains in the transaction until A rolls it back.",
        "fiber-rejected": "Both starts and resume complete without FiberError."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-16"
    },
    "references": [
      "https://www.php.net/manual/en/pdo.transactions.php",
      "https://www.php.net/manual/en/language.fibers.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0264",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Validation & web security",
    "subtopic": "decode-after-validation-reintroduces-traversal",
    "objective": {
      "id": "decode-after-validation-reintroduces-traversal",
      "text": "Review a validation boundary that is invalidated by a second URL-decoding step."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track representation changes across validation and later path consumption without performing filesystem access."
    },
    "prerequisites": [
      "rawurldecode",
      "Percent encoding",
      "Canonical representation",
      "Path traversal validation"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The fixed string is a local test fixture. No path is opened. The application’s intended rule rejects any decoded parent-directory segment, and the shown downstream consumer performs the second decode before using a path."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$input = '%252e%252e%252fprivate.txt';\n$checked = rawurldecode($input);\n$passes = !str_contains($checked, '..');\n$used = rawurldecode($checked);\n\necho json_encode([$passes, $used], JSON_UNESCAPED_SLASHES);\n"
        }
      ]
    },
    "stem": "A review says the parent-directory check is sufficient because it runs after decoding. Which assessment matches the two-stage pipeline?",
    "options": [
      {
        "id": "representation-gap",
        "text": "The check passes, but the later decode creates ../private.txt; validation must cover the representation actually consumed.",
        "rationale": "The first decode leaves encoded dot and slash sequences that the second decode turns into traversal syntax.",
        "misconception": null
      },
      {
        "id": "recursive-first",
        "text": "The first rawurldecode resolves every encoding layer, so the check already rejects the parent segment.",
        "rationale": "rawurldecode performs one decoding pass, not recursive decoding until no escapes remain.",
        "misconception": "Assuming one call fully canonicalizes arbitrarily repeated encoding."
      },
      {
        "id": "idempotent-decode",
        "text": "The second rawurldecode cannot change the checked value because URL decoding is always idempotent.",
        "rationale": "The first pass can create new percent-encoded sequences, making a second pass change the string again.",
        "misconception": "Treating decoding as idempotent for all inputs."
      },
      {
        "id": "slash-preserved",
        "text": "The check passes, but rawurldecode never decodes an encoded slash, so no parent-directory path appears.",
        "rationale": "rawurldecode decodes %2f to slash along with the encoded dots.",
        "misconception": "Assuming path separators are excluded from ordinary raw URL decoding."
      }
    ],
    "correctOptionId": "representation-gap",
    "explanation": {
      "summary": "Validating one representation does not validate a different representation created afterward. The decoding policy and the consumer must agree, and traversal checks must apply to the exact form used for path lookup.",
      "trace": "The first pass produces %2e%2e%2fprivate.txt, which contains no literal double dot. The second pass produces ../private.txt, after the check has already passed."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[true,\"../private.txt\"]",
      "keyEvidence": "The fixture observes both the validation result and the later decoded representation without accessing any file.",
      "counterexamples": {
        "recursive-first": "passes is true after only one decoding pass.",
        "idempotent-decode": "The checked and used representations differ.",
        "slash-preserved": "The final string contains a literal slash following the parent segment."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.rawurldecode.php",
      "https://owasp.org/www-community/Double_Encoding"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0265",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Iterators, generators & fibers",
    "subtopic": "by-reference-generator-yield-contract",
    "objective": {
      "id": "by-reference-generator-yield-contract",
      "text": "Review the declaration required for a generator to expose references during foreach iteration."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Coordinate a referenced source array, by-reference generator yields and the consumer’s reference iteration."
    },
    "prerequisites": [
      "By-reference generators (advanced)",
      "Reference parameters",
      "foreach by reference",
      "Generator return type"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction &slots(array &$values): Generator\n{\n    foreach ($values as &$value) {\n        yield $value;\n    }\n}\n\n$values = [2, 3];\n$generator = slots($values);\n\nforeach ($generator as &$slot) {\n    $slot *= 2;\n}\n\nunset($slot);\necho json_encode($values);\n"
        }
      ]
    },
    "stem": "A reviewer proposes removing the ampersand before slots because the function returns a Generator object. Which assessment matches the existing code and that proposed change?",
    "options": [
      {
        "id": "object-reference-only",
        "text": "The ampersand affects only the Generator object returned, so the yielded integers stay copies and values remains unchanged.",
        "rationale": "For a generator declaration, the ampersand enables reference yielding; the consumer changes the referenced source elements.",
        "misconception": "Applying ordinary return-reference intuition without the generator’s yield contract."
      },
      {
        "id": "silent-copy-fallback",
        "text": "The current code doubles values; removing the declaration ampersand silently changes the foreach to value copies.",
        "rationale": "PHP rejects by-reference iteration of a generator not declared to yield by reference; it does not silently downgrade the loop.",
        "misconception": "Assuming incompatible iteration mode is converted into a copy operation."
      },
      {
        "id": "required-yield-reference",
        "text": "The current code doubles values; removing that ampersand makes this by-reference foreach throw an exception.",
        "rationale": "The declaration enables reference yielding, which the consumer explicitly requires.",
        "misconception": null
      },
      {
        "id": "automatic-object-support",
        "text": "The current code doubles values and remains equivalent without the ampersand because all Generator objects allow reference iteration.",
        "rationale": "Generator reference iteration depends on the generator function’s declaration.",
        "misconception": "Assuming the common Generator object type alone guarantees reference-yield capability."
      }
    ],
    "correctOptionId": "required-yield-reference",
    "explanation": {
      "summary": "A generator function declared with & can yield references. The consumer’s by-reference foreach requires that capability; returning a Generator object does not provide it automatically.",
      "trace": "The source parameter refers to values, the producer loops over its elements by reference, and the consumer doubles those yielded references to [4,6]. Removing the function’s & causes reference iteration to fail."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[4,6]",
      "contrasts": [
        {
          "name": "remove-reference-yield-declaration",
          "marker": "function &slots(",
          "replacement": "function slots(",
          "stdout": "",
          "error": "You can only iterate a generator by-reference if it declared that it yields by-reference"
        }
      ],
      "keyEvidence": "The original mutates the source array; the declaration-removal contrast produces the documented reference-iteration exception.",
      "counterexamples": {
        "object-reference-only": "The observed source array changes to [4,6].",
        "silent-copy-fallback": "The contrast throws instead of copying silently.",
        "automatic-object-support": "The same Generator return type remains, yet the contrast fails without &."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/language.generators.syntax.php#control-structures.yield.byref"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0266",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Functions & arguments",
    "subtopic": "named-argument-skip-defaulted-parameters",
    "objective": {
      "id": "named-argument-skip-defaulted-parameters",
      "text": "Set a later optional parameter while leaving earlier optional parameters at their declared defaults."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Use named binding rather than positional placement or placeholder values."
    },
    "prerequisites": [
      "Named arguments",
      "Default parameters",
      "strict_types"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\ndeclare(strict_types=1);\n\nfunction settings(string $target = 'all', int $retries = 3, bool $urgent = false): array\n{\n    return [$target, $retries, $urgent];\n}\n\ntry {\n    echo json_encode(settings());\n} catch (TypeError $error) {\n    echo 'TypeError';\n}\n"
        }
      ]
    },
    "stem": "The call must enable urgent while keeping target and retries at their declared defaults, producing [\"all\",3,true]. Which call should replace the current one?",
    "options": [
      {
        "id": "first-position",
        "text": "settings(true)",
        "rationale": "The first positional argument binds to target, which requires a string under strict types.",
        "misconception": "Assuming a boolean argument automatically selects the boolean parameter."
      },
      {
        "id": "zero-placeholder",
        "text": "settings('all', 0, true)",
        "rationale": "Zero explicitly replaces the retries default; it does not mean skip this parameter.",
        "misconception": "Using a zero placeholder to request a default value."
      },
      {
        "id": "named-later",
        "text": "settings(urgent: true)",
        "rationale": "The named argument binds directly to urgent and omitted earlier parameters retain their defaults.",
        "misconception": null
      },
      {
        "id": "second-position",
        "text": "settings('all', true)",
        "rationale": "The boolean is supplied for retries, not urgent, and is rejected by the strict integer parameter.",
        "misconception": "Skipping an optional positional parameter based on the argument’s type."
      }
    ],
    "correctOptionId": "named-later",
    "explanation": {
      "summary": "Named arguments bind by parameter name, allowing earlier optional parameters to be omitted. Positional arguments cannot skip a parameter merely because another parameter has a matching type.",
      "trace": "urgent is explicitly true. target and retries are omitted, so their defaults all and 3 are used."
    },
    "validation": {
      "kind": "patch",
      "marker": "json_encode(settings())",
      "candidates": {
        "first-position": "json_encode(settings(true))",
        "zero-placeholder": "json_encode(settings('all', 0, true))",
        "named-later": "json_encode(settings(urgent: true))",
        "second-position": "json_encode(settings('all', true))"
      },
      "stdout": "[\"all\",3,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0267",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Arrays & destructuring",
    "subtopic": "first-array-key-independent-of-pointer",
    "objective": {
      "id": "first-array-key-independent-of-pointer",
      "text": "Retrieve the first key without confusing it with a value or the current internal pointer position."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose a key API that handles an empty array with the required null sentinel."
    },
    "prerequisites": [
      "Array keys",
      "Internal pointer",
      "Iteration order",
      "Empty arrays"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction firstId(array $items): mixed\n{\n    return key($items);\n}\n\n$jobs = [7 => 'first', 2 => 'second'];\nend($jobs);\n\necho json_encode([firstId($jobs), firstId([]), firstId(['alpha' => false])]);\n"
        }
      ]
    },
    "stem": "firstId must return the first key in iteration order, regardless of the internal pointer, and null for an empty array. Which expression meets all three displayed cases?",
    "options": [
      {
        "id": "first-key",
        "text": "array_key_first($items)",
        "rationale": "This returns the first key without depending on the pointer and returns null for an empty array.",
        "misconception": null
      },
      {
        "id": "current-key",
        "text": "key($items)",
        "rationale": "The jobs pointer was moved to key 2, so current key is not the first key.",
        "misconception": "Equating the first array entry with the internal pointer’s current position."
      },
      {
        "id": "first-value",
        "text": "reset($items)",
        "rationale": "reset returns the first value, not its key; it also uses false for an empty array.",
        "misconception": "Using a pointer-reset function as a key lookup."
      },
      {
        "id": "search-first-value",
        "text": "array_search(reset($items), $items, true)",
        "rationale": "The empty array produces false from array_search rather than the required null.",
        "misconception": "Building a key lookup through a value search without handling its empty-result sentinel."
      }
    ],
    "correctOptionId": "first-key",
    "explanation": {
      "summary": "array_key_first reports the first key directly and does not consult or change the internal pointer. Its empty-array result is null.",
      "trace": "The first jobs key is 7 despite the pointer being at 2. The empty array yields null, and the false-valued entry still has key alpha."
    },
    "validation": {
      "kind": "patch",
      "marker": "key($items)",
      "stdout": "[7,null,\"alpha\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-key-first.php",
      "https://www.php.net/manual/en/function.key.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0268",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Arrays & destructuring",
    "subtopic": "tail-slice-preserve-keys-and-source",
    "objective": {
      "id": "tail-slice-preserve-keys-and-source",
      "text": "Select the last entries while preserving their keys and leaving the source array intact."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Combine a negative slice offset with explicit key preservation and a nonmutating operation."
    },
    "prerequisites": [
      "array_slice",
      "array_splice",
      "Negative offsets",
      "Array keys"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$items = [9 => 'a', 4 => 'b', 7 => 'c'];\n$tail = array_slice($items, 2);\n\necho json_encode([$tail, $items]);\n"
        }
      ]
    },
    "stem": "tail must contain the last two entries with keys 4 and 7, and items must keep all three entries. Which expression should replace the current slice?",
    "options": [
      {
        "id": "positive-offset",
        "text": "array_slice($items, 2, null, true)",
        "rationale": "Offset 2 starts at the third entry, returning only c.",
        "misconception": "Reading a positive offset as a count measured backward from the end."
      },
      {
        "id": "splice-tail",
        "text": "array_splice($items, -2)",
        "rationale": "This removes the tail from items and renumbers the returned numeric keys.",
        "misconception": "Using a destructive extraction operation for a nonmutating selection."
      },
      {
        "id": "reindexed-tail",
        "text": "array_slice($items, -2)",
        "rationale": "The last two values are selected, but their numeric keys are reindexed.",
        "misconception": "Assuming slicing preserves integer keys without its preserve_keys argument."
      },
      {
        "id": "preserved-tail",
        "text": "array_slice($items, -2, null, true)",
        "rationale": "The negative offset selects the last two entries, true preserves keys, and slicing leaves items unchanged.",
        "misconception": null
      }
    ],
    "correctOptionId": "preserved-tail",
    "explanation": {
      "summary": "array_slice selects entries without changing its input. A negative offset counts from the end, and preserve_keys=true retains numeric identifiers.",
      "trace": "The result tail is {4:b,7:c}; the source still contains keys 9,4,7 and their original values."
    },
    "validation": {
      "kind": "patch",
      "marker": "array_slice($items, 2)",
      "stdout": "[{\"4\":\"b\",\"7\":\"c\"},{\"9\":\"a\",\"4\":\"b\",\"7\":\"c\"}]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-slice.php",
      "https://www.php.net/manual/en/function.array-splice.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0269",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Operators & expressions",
    "subtopic": "clear-bit-idempotently-with-complement",
    "objective": {
      "id": "clear-bit-idempotently-with-complement",
      "text": "Clear one permission bit without toggling it on when it was already absent."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose a bit operation that preserves unrelated flags and is idempotent."
    },
    "prerequisites": [
      "Bitwise AND",
      "Bitwise complement",
      "Bit masks"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nconst WRITE = 2;\n\nfunction disableWrite(int $flags): int\n{\n    return $flags ^ WRITE;\n}\n\necho json_encode([disableWrite(7), disableWrite(5)]);\n"
        }
      ]
    },
    "stem": "disableWrite must remove WRITE while preserving all other bits. It must also leave a mask unchanged when WRITE is already absent. Which expression satisfies both calls?",
    "options": [
      {
        "id": "toggle",
        "text": "$flags ^ WRITE",
        "rationale": "XOR clears a present bit but sets an absent bit, changing 5 into 7.",
        "misconception": "Using a toggle when the operation must always clear a bit."
      },
      {
        "id": "clear",
        "text": "$flags & ~WRITE",
        "rationale": "Complementing the target mask and ANDing preserves every other bit while clearing WRITE.",
        "misconception": null
      },
      {
        "id": "set",
        "text": "$flags | WRITE",
        "rationale": "OR enables WRITE, including when it was absent.",
        "misconception": "Using a set operation for a removal requirement."
      },
      {
        "id": "retain-only",
        "text": "$flags & WRITE",
        "rationale": "This keeps only WRITE and discards the unrelated flags.",
        "misconception": "Confusing extracting a bit with removing that bit."
      }
    ],
    "correctOptionId": "clear",
    "explanation": {
      "summary": "AND with the complement of WRITE forces that bit to zero and leaves other bits unchanged. Applying it again has no additional effect.",
      "trace": "7 has WRITE set and becomes 5. 5 already lacks WRITE and remains 5."
    },
    "validation": {
      "kind": "patch",
      "marker": "$flags ^ WRITE",
      "stdout": "[5,5]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.bitwise.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0270",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Control flow & pattern matching",
    "subtopic": "match-true-range-predicates",
    "objective": {
      "id": "match-true-range-predicates",
      "text": "Select the match subject appropriate for boolean range conditions."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Use match identity comparisons with conditions that evaluate to booleans rather than age values."
    },
    "prerequisites": [
      "match",
      "Boolean comparisons",
      "Strict identity"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction group(int $age): string\n{\n    return match ($age) {\n        $age < 18 => 'minor',\n        $age < 65 => 'adult',\n        default => 'senior',\n    };\n}\n\necho json_encode([group(0), group(18), group(65)]);\n"
        }
      ]
    },
    "stem": "group must classify nonnegative ages as minor below 18, adult below 65, and senior otherwise. Which subject should replace age in match for the displayed range predicates?",
    "options": [
      {
        "id": "age",
        "text": "$age",
        "rationale": "An integer age does not strictly match boolean arm conditions.",
        "misconception": "Assuming match performs loose comparison between an integer subject and boolean conditions."
      },
      {
        "id": "one",
        "text": "1",
        "rationale": "Integer 1 is not identical to boolean true.",
        "misconception": "Treating a truthy integer as interchangeable with true in match."
      },
      {
        "id": "boolean-age",
        "text": "(bool) $age",
        "rationale": "Age zero becomes false and can match a false condition rather than the first true range predicate.",
        "misconception": "Deriving the desired predicate truth value from the input’s truthiness."
      },
      {
        "id": "true",
        "text": "true",
        "rationale": "The first condition that evaluates to true selects the intended range.",
        "misconception": null
      }
    ],
    "correctOptionId": "true",
    "explanation": {
      "summary": "These arm conditions return booleans. Matching the literal true selects the first satisfied predicate; matching an integer or the input’s own truthiness does not implement that rule.",
      "trace": "At age 0 the first predicate is true; at 18 only the second is true; at 65 neither is true and default selects senior."
    },
    "validation": {
      "kind": "patch",
      "marker": "match ($age)",
      "candidates": {
        "age": "match ($age)",
        "one": "match (1)",
        "boolean-age": "match ((bool) $age)",
        "true": "match (true)"
      },
      "stdout": "[\"minor\",\"adult\",\"senior\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-06"
    },
    "references": [
      "https://www.php.net/manual/en/control-structures.match.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0271",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Closures, callbacks & callables",
    "subtopic": "first-class-callable-creation-versus-invocation",
    "objective": {
      "id": "first-class-callable-creation-versus-invocation",
      "text": "Create a Closure for a named function without invoking that function immediately."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish first-class callable syntax from argument unpacking, ordinary invocation and a callable string."
    },
    "prerequisites": [
      "Closure",
      "First-class callable syntax",
      "Argument unpacking"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction build(): Closure\n{\n    return strtoupper(...['php']);\n}\n\ntry {\n    $callback = build();\n    echo $callback('php');\n} catch (Throwable $error) {\n    echo get_class($error);\n}\n"
        }
      ]
    },
    "stem": "build must return a Closure that uppercases a later input. Which return expression supplies it? The three dots in the options are literal PHP syntax, not omitted code.",
    "options": [
      {
        "id": "callable-syntax",
        "text": "strtoupper(...)",
        "rationale": "The standalone ellipsis creates a first-class callable Closure without invoking strtoupper.",
        "misconception": null
      },
      {
        "id": "callable-string",
        "text": "'strtoupper'",
        "rationale": "The string can be callable in suitable contexts but is not a Closure object satisfying this return type.",
        "misconception": "Equating every callable representation with the concrete Closure type."
      },
      {
        "id": "empty-call",
        "text": "strtoupper()",
        "rationale": "This invokes the function immediately without its required string argument.",
        "misconception": "Treating empty parentheses as creation of a deferred function reference."
      },
      {
        "id": "unpacked-call",
        "text": "strtoupper(...['php'])",
        "rationale": "An ellipsis followed by an argument array unpacks and invokes the function, returning a string.",
        "misconception": "Confusing first-class callable syntax with argument unpacking."
      }
    ],
    "correctOptionId": "callable-syntax",
    "explanation": {
      "summary": "A function name followed by (...) creates a Closure in PHP’s first-class callable syntax. An ellipsis followed by an expression instead unpacks arguments into a call.",
      "trace": "build returns the Closure without transforming any input. The later callback invocation uppercases php and prints PHP."
    },
    "validation": {
      "kind": "patch",
      "marker": "strtoupper(...['php'])",
      "stdout": "PHP",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/functions.first_class_callable_syntax.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0272",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "explicit-parent-implementation-call",
    "objective": {
      "id": "explicit-parent-implementation-call",
      "text": "Invoke an overridden parent method’s implementation from the child class."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish choosing the parent method body from normal dispatch to the child override."
    },
    "prerequisites": [
      "Inheritance",
      "Protected methods",
      "parent::",
      "Method overriding"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass BaseRenderer\n{\n    protected function label(): string\n    {\n        return 'base';\n    }\n}\n\nclass Renderer extends BaseRenderer\n{\n    protected function label(): string\n    {\n        return 'custom';\n    }\n\n    public function render(): string\n    {\n        return $this->label();\n    }\n}\n\necho (new Renderer())->render();\n"
        }
      ]
    },
    "stem": "render must deliberately use the parent label implementation and return base, even though this class overrides label. Which call should replace the current expression?",
    "options": [
      {
        "id": "self",
        "text": "self::label()",
        "rationale": "self refers to Renderer here, whose label method is the override.",
        "misconception": "Assuming self means the parent implementation when used inside a child class."
      },
      {
        "id": "late-static",
        "text": "static::label()",
        "rationale": "The called class is Renderer, so late-static lookup selects its override.",
        "misconception": "Using late-static dispatch to bypass an override."
      },
      {
        "id": "parent",
        "text": "parent::label()",
        "rationale": "parent explicitly selects BaseRenderer’s implementation, which is accessible from the child.",
        "misconception": null
      },
      {
        "id": "instance",
        "text": "$this->label()",
        "rationale": "Normal instance dispatch selects Renderer’s overridden label.",
        "misconception": "Expecting a call from render to ignore the receiver’s override."
      }
    ],
    "correctOptionId": "parent",
    "explanation": {
      "summary": "parent:: explicitly accesses an inherited parent implementation from child scope. self, static and ordinary instance dispatch in this example all resolve to the child’s label method.",
      "trace": "The parent implementation returns base. Its protected visibility permits the call from Renderer."
    },
    "validation": {
      "kind": "patch",
      "marker": "$this->label()",
      "stdout": "base",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.paamayim-nekudotayim.php",
      "https://www.php.net/manual/en/language.oop5.inheritance.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0273",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "PDO & database access",
    "subtopic": "like-literal-prefix-escape-metacharacters",
    "objective": {
      "id": "like-literal-prefix-escape-metacharacters",
      "text": "Construct a bound SQL LIKE pattern that treats user prefix characters literally."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate SQL parameterization from the pattern language interpreted inside a bound value."
    },
    "prerequisites": [
      "PDO parameters",
      "SQL LIKE wildcards",
      "Explicit ESCAPE character",
      "strtr"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "PDO",
        "pdo_sqlite"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec('CREATE TABLE tags (name TEXT)');\n$insert = $pdo->prepare('INSERT INTO tags VALUES (?)');\n\nforeach (['user_one', 'user%two', 'user!three', 'userXfour'] as $name) {\n    $insert->execute([$name]);\n}\n\n$search = $pdo->prepare(\"SELECT name FROM tags WHERE name LIKE :pattern ESCAPE '!' ORDER BY name\");\n$results = [];\n\nforeach (['user_', 'user%', 'user!'] as $prefix) {\n    $pattern = $prefix . '%';\n    $search->execute(['pattern' => $pattern]);\n    $results[] = $search->fetchAll(PDO::FETCH_COLUMN);\n}\n\necho json_encode($results);\n"
        }
      ]
    },
    "stem": "Each search must match a literal prefix: user_, user%, or user!. The query uses ! as its LIKE escape character. Which assignment preserves those literal characters and adds only the final prefix wildcard?",
    "options": [
      {
        "id": "sql-quotes",
        "text": "$pattern = addslashes($prefix) . '%';",
        "rationale": "SQL string quoting is not LIKE-pattern escaping, and parameter binding already separates the value from SQL syntax.",
        "misconception": "Assuming escaping quotes also neutralizes wildcard metacharacters."
      },
      {
        "id": "escape-introduced-last",
        "text": "$pattern = str_replace(['%', '_', '!'], ['!%', '!_', '!!'], $prefix) . '%';",
        "rationale": "The final replacement doubles escape markers inserted by earlier replacements, changing their intended meaning.",
        "misconception": "Escaping the escape character after introducing new escape markers."
      },
      {
        "id": "literal-prefix",
        "text": "$pattern = strtr($prefix, ['!' => '!!', '%' => '!%', '_' => '!_']) . '%';",
        "rationale": "The map escapes each original special character without reprocessing inserted markers, then adds the one intended wildcard.",
        "misconception": null
      },
      {
        "id": "suffix-pattern",
        "text": "$pattern = '%' . strtr($prefix, ['!' => '!!', '%' => '!%', '_' => '!_']);",
        "rationale": "This places the wildcard before the literal text and searches for a suffix rather than a prefix.",
        "misconception": "Reversing the placement of the intentional wildcard."
      }
    ],
    "correctOptionId": "literal-prefix",
    "explanation": {
      "summary": "A bound parameter is still interpreted as a LIKE pattern. Escape the pattern’s %, _ and escape character itself, then append the single wildcard required for prefix matching.",
      "trace": "The patterns user!_%, user!%% and user!!% match only user_one, user%two and user!three respectively."
    },
    "validation": {
      "kind": "patch",
      "marker": "$pattern = $prefix . '%';",
      "stdout": "[[\"user_one\"],[\"user%two\"],[\"user!three\"]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.sqlite.org/lang_expr.html#like",
      "https://www.php.net/manual/en/pdo.prepare.php",
      "https://www.php.net/manual/en/function.strtr.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0274",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "csv-logical-record-spans-physical-lines",
    "objective": {
      "id": "csv-logical-record-spans-physical-lines",
      "text": "Read CSV records whose quoted fields contain embedded newlines."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Choose a stream-aware record parser instead of splitting input into physical lines before parsing."
    },
    "prerequisites": [
      "CSV quoting",
      "fgetcsv",
      "fgets",
      "str_getcsv"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$handle = fopen('php://memory', 'w+');\nfwrite($handle, \"1,\\\"two\\nlines\\\"\\n2,plain\\n\");\nrewind($handle);\n$rows = [];\n\nfor ($i = 0; $i < 2; $i++) {\n    $rows[] = str_getcsv(fgets($handle), ',', '\"', '');\n}\n\nfclose($handle);\necho json_encode($rows);\n"
        }
      ]
    },
    "stem": "The first CSV record contains a newline inside its quoted second field. Which reader expression returns the two complete logical records in the two loop iterations?",
    "options": [
      {
        "id": "stream-parser",
        "text": "fgetcsv($handle, null, ',', '\"', '')",
        "rationale": "The stream parser continues through quoted newlines until the logical CSV record is complete.",
        "misconception": null
      },
      {
        "id": "line-then-parse",
        "text": "str_getcsv(fgets($handle), ',', '\"', '')",
        "rationale": "fgets stops at the embedded newline before str_getcsv receives the complete record.",
        "misconception": "Assuming one physical line always equals one CSV record."
      },
      {
        "id": "line-split",
        "text": "explode(',', fgets($handle))",
        "rationale": "This ignores both quote semantics and the embedded newline boundary.",
        "misconception": "Treating CSV as delimiter-separated physical lines without a quoting grammar."
      },
      {
        "id": "wrong-delimiter",
        "text": "fgetcsv($handle, null, ';', '\"', '')",
        "rationale": "The fixture is comma-delimited, so this does not produce the required two-field records.",
        "misconception": "Choosing the stream parser but configuring the wrong CSV dialect."
      }
    ],
    "correctOptionId": "stream-parser",
    "explanation": {
      "summary": "CSV quoting can place a newline inside one field. fgetcsv reads from the stream until it has a complete logical record, while fgets truncates the input at a physical line boundary before str_getcsv can parse the rest.",
      "trace": "The first call returns [1, \"two newline lines\"] as two string fields. The second returns [2, \"plain\"]. The newline remains inside the first record’s second field."
    },
    "validation": {
      "kind": "patch",
      "marker": "str_getcsv(fgets($handle), ',', '\"', '')",
      "stdout": "[[\"1\",\"two\\nlines\"],[\"2\",\"plain\"]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.fgetcsv.php",
      "https://www.php.net/manual/en/function.str-getcsv.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0275",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Cookies & sessions",
    "subtopic": "cross-site-cookie-samesite-none-secure",
    "objective": {
      "id": "cross-site-cookie-samesite-none-secure",
      "text": "Choose cookie attributes that permit an HTTPS cross-site subresource request while withholding script access."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine SameSite delivery rules with Secure and HttpOnly under explicit browser policy assumptions."
    },
    "prerequisites": [
      "setcookie options",
      "SameSite",
      "Secure",
      "HttpOnly"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "A modern browser permits third-party cookies for this test and implements standard SameSite handling. The cookie is set over HTTPS and is later needed on an HTTPS cross-site subresource request, not a top-level navigation. Domain and path already match. JavaScript must not read the cookie. Other cookie options are identical and valid."
      ],
      "files": []
    },
    "stem": "Which setcookie options satisfy the required cross-site delivery and script-access restrictions under these assumptions?",
    "options": [
      {
        "id": "lax",
        "text": "['samesite' => 'Lax', 'secure' => true, 'httponly' => true]",
        "rationale": "Lax does not admit this cross-site subresource request, even though it may allow certain top-level navigations.",
        "misconception": "Applying a top-level-navigation exception to a subresource request."
      },
      {
        "id": "strict",
        "text": "['samesite' => 'Strict', 'secure' => true, 'httponly' => true]",
        "rationale": "Strict excludes cross-site delivery for the stated request.",
        "misconception": "Assuming stronger SameSite isolation can still satisfy required cross-site use."
      },
      {
        "id": "none-insecure",
        "text": "['samesite' => 'None', 'secure' => false, 'httponly' => true]",
        "rationale": "The assumed browser requires Secure with SameSite=None and would reject this configuration.",
        "misconception": "Treating an HTTPS setting response as a substitute for the cookie’s Secure attribute."
      },
      {
        "id": "none-secure",
        "text": "['samesite' => 'None', 'secure' => true, 'httponly' => true]",
        "rationale": "None permits the stated cross-site context, Secure meets its browser requirement, and HttpOnly restricts script access.",
        "misconception": null
      }
    ],
    "correctOptionId": "none-secure",
    "explanation": {
      "summary": "SameSite=None permits cross-site cookie use subject to browser policy, and modern implementations require Secure with it. HttpOnly separately prevents ordinary script access. The premise explicitly excludes a third-party-cookie policy block.",
      "trace": "The request is a cross-site subresource, so Lax and Strict are unsuitable. None with Secure is admissible under the stated policy, while HttpOnly remains enabled."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Apply the stated modern-browser SameSite policy and PHP setcookie attribute meanings; no real cookie is sent.",
      "optionAudit": {
        "lax": "Top-level exceptions do not cover this subresource request.",
        "strict": "Blocks the required cross-site context.",
        "none-insecure": "Fails the required Secure attribute rule.",
        "none-secure": "Meets all stated delivery and script-access requirements."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-13"
    },
    "references": [
      "https://www.php.net/manual/en/function.setcookie.php",
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0276",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Validation & web security",
    "subtopic": "literal-regex-input-delimiter-aware-quoting",
    "objective": {
      "id": "literal-regex-input-delimiter-aware-quoting",
      "text": "Quote a literal search value for both regex metacharacters and the chosen pattern delimiter."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate regex-language escaping from SQL-style slash escaping and delimiter-only handling."
    },
    "prerequisites": [
      "preg_quote",
      "Regex delimiters",
      "Literal versus pattern input"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$needle = 'foo/bar.c+';\n$quoted = preg_quote($needle);\n$pattern = '/\\A' . $quoted . '\\z/';\n$warnings = 0;\n\nset_error_handler(function () use (&$warnings): bool {\n    $warnings++;\n\n    return true;\n});\n\n$matches = [\n    preg_match($pattern, $needle),\n    preg_match($pattern, 'foo/barXccc'),\n];\nrestore_error_handler();\n\necho json_encode([$matches, $warnings]);\n"
        }
      ]
    },
    "stem": "The pattern must match the exact needle and reject the lookalike, with no warnings. Which quoting expression supplies a literal-safe fragment for this slash-delimited regex?",
    "options": [
      {
        "id": "default-quote",
        "text": "preg_quote($needle)",
        "rationale": "Without the delimiter argument, the slash inside the needle remains unescaped for this pattern delimiter.",
        "misconception": "Assuming preg_quote guesses the delimiter used by the surrounding pattern."
      },
      {
        "id": "generic-slashes",
        "text": "addslashes($needle)",
        "rationale": "This does not quote the slash delimiter, dot or plus for the regex grammar.",
        "misconception": "Treating generic quote/backslash escaping as context-specific regex quoting."
      },
      {
        "id": "delimiter-only",
        "text": "str_replace('/', '\\/', $needle)",
        "rationale": "Escaping only slash leaves dot and plus active as regex metacharacters.",
        "misconception": "Handling the enclosing delimiter but not the pattern language inside it."
      },
      {
        "id": "delimiter-aware",
        "text": "preg_quote($needle, '/')",
        "rationale": "preg_quote escapes regex metacharacters and the explicitly supplied slash delimiter.",
        "misconception": null
      }
    ],
    "correctOptionId": "delimiter-aware",
    "explanation": {
      "summary": "A literal inserted into a regex must be quoted for that regex grammar and its delimiter. preg_quote’s second argument supplies the delimiter that must also be escaped.",
      "trace": "The quoted dot and plus match literal characters, and the escaped slash stays inside the pattern. The exact needle matches, the lookalike does not, and no warning occurs."
    },
    "validation": {
      "kind": "patch",
      "marker": "preg_quote($needle)",
      "stdout": "[[1,0],0]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.preg-quote.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0277",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Closures, callbacks & callables",
    "subtopic": "static-arrow-avoid-implicit-owner-retention",
    "objective": {
      "id": "static-arrow-avoid-implicit-owner-retention",
      "text": "Create a callback that captures a scalar prefix without retaining its creating object."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish scalar capture from the implicit this binding of a nonstatic closure created in a method."
    },
    "prerequisites": [
      "Arrow functions",
      "Static closures",
      "Object lifetime",
      "WeakReference fixture: get returns null after collection"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Prefixer\n{\n    public function __construct(private string $prefix)\n    {\n    }\n\n    public function format(string $value): string\n    {\n        return $this->prefix . $value;\n    }\n\n    public function build(): Closure\n    {\n        $prefix = $this->prefix;\n\n        return fn (string $value): string => $prefix . $value;\n    }\n}\n\n$owner = new Prefixer('X');\n$weak = WeakReference::create($owner);\n$callback = $owner->build();\nunset($owner);\n\ntry {\n    $result = $callback('a');\n} catch (Error $error) {\n    $result = 'Error';\n}\n\necho json_encode([$result, $weak->get() === null]);\n"
        }
      ]
    },
    "stem": "The callback must still return Xa after the owner is unset, while allowing that owner to be collected. Which return expression makes the output [\"Xa\",true]?",
    "options": [
      {
        "id": "static-capture",
        "text": "static fn (string $value): string => $prefix . $value",
        "rationale": "The static arrow captures the scalar prefix but has no bound this retaining the owner.",
        "misconception": null
      },
      {
        "id": "implicit-owner",
        "text": "fn (string $value): string => $prefix . $value",
        "rationale": "Created in an instance method without static, the closure retains a bound this even though its body only uses prefix.",
        "misconception": "Assuming an unused this binding is absent from every nonstatic closure."
      },
      {
        "id": "static-this",
        "text": "static fn (string $value): string => $this->prefix . $value",
        "rationale": "A static closure has no this, so invoking this expression raises Error.",
        "misconception": "Removing object binding while still reading an instance property through this."
      },
      {
        "id": "bound-method",
        "text": "$this->format(...)",
        "rationale": "The first-class instance-method callable remains bound to the owner.",
        "misconception": "Assuming a first-class callable drops the target instance after creation."
      }
    ],
    "correctOptionId": "static-capture",
    "explanation": {
      "summary": "A nonstatic closure created in instance context can retain its bound object. A static arrow avoids that binding while still automatically capturing the local scalar prefix by value.",
      "trace": "The static arrow keeps X independently. Unsetting owner removes its last strong reference, so the weak reference becomes null, while the callback still produces Xa."
    },
    "validation": {
      "kind": "patch",
      "marker": "fn (string $value): string => $prefix . $value",
      "stdout": "[\"Xa\",true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/functions.anonymous.php",
      "https://www.php.net/manual/en/functions.arrow.php",
      "https://www.php.net/manual/en/class.weakreference.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0278",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "HTTP & superglobals",
    "subtopic": "trusted-proxy-chain-rightmost-untrusted-peer",
    "objective": {
      "id": "trusted-proxy-chain-rightmost-untrusted-peer",
      "text": "Select the client-facing untrusted peer from a forwarding chain with a trusted proxy suffix."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Apply deployment trust boundaries rather than accept a client-supplied leftmost forwarding value."
    },
    "prerequisites": [
      "Reverse proxy forwarding (advanced)",
      "$_SERVER remote peer",
      "Trusted proxy allowlist",
      "Ordered header chains"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "Exactly two trusted proxies, 10.0.0.1 and 10.0.0.2, append their observed peer address to any existing X-Forwarded-For list. They preserve a client-supplied prefix. The application’s immediate peer is 10.0.0.2. The trusted list is complete. Addresses are already parsed as valid IP strings; malformed headers are outside this fixture."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$trusted = ['10.0.0.1', '10.0.0.2'];\n$forwarded = ['203.0.113.99', '198.51.100.7', '10.0.0.1'];\n$remote = '10.0.0.2';\n$hops = [...$forwarded, $remote];\n$selected = $hops[0];\n\necho $selected;\n"
        }
      ]
    },
    "stem": "The current selection can accept a spoofed client-supplied prefix. Which algorithm attributes the request to a client through the stated trusted proxies?",
    "options": [
      {
        "id": "left-untrusted",
        "text": "Walk left to right and choose the first address outside the trusted proxy list.",
        "rationale": "This chooses the preserved client-supplied prefix 203.0.113.99 before reaching the observed peer.",
        "misconception": "Trusting the left edge of a header that can contain a spoofed prefix."
      },
      {
        "id": "right-boundary",
        "text": "Walk right to left through the combined chain, skip trusted proxies, and select the first untrusted address.",
        "rationale": "This removes the trusted suffix and stops at the peer observed by the earliest trusted proxy.",
        "misconception": null
      },
      {
        "id": "header-rightmost",
        "text": "Choose the rightmost X-Forwarded-For entry because it was most recently appended by a trusted proxy.",
        "rationale": "That entry is 10.0.0.1, another trusted proxy rather than its untrusted peer.",
        "misconception": "Confusing a trustworthy report of a proxy hop with the desired client-facing hop."
      },
      {
        "id": "remote-only",
        "text": "Choose REMOTE_ADDR after verifying that it is in the trusted proxy list.",
        "rationale": "The verified immediate peer is 10.0.0.2, which is still a proxy.",
        "misconception": "Using the trust check as the final client-address selection instead of permission to inspect the chain."
      }
    ],
    "correctOptionId": "right-boundary",
    "explanation": {
      "summary": "Under the stated append-only proxy contract, the right-hand suffix consists of trusted infrastructure. Walking left from the immediate peer and stopping at the first untrusted address identifies the boundary without trusting earlier client-supplied entries.",
      "trace": "Skip remote 10.0.0.2, then 10.0.0.1. Stop at 198.51.100.7; the earlier 203.0.113.99 is beyond the trusted observation boundary and is not used."
    },
    "validation": {
      "kind": "contract",
      "stdout": "203.0.113.99",
      "contrasts": [
        {
          "name": "trusted-suffix-selection",
          "marker": "$selected = $hops[0];",
          "replacement": "$selected = 'unknown';\n\nfor ($i = count($hops) - 1; $i >= 0; $i--) {\n    if (!in_array($hops[$i], $trusted, true)) {\n        $selected = $hops[$i];\n        break;\n    }\n}",
          "stdout": "198.51.100.7"
        }
      ],
      "keyEvidence": "The original selects the spoofable prefix; the reviewed contrast walks the explicitly trusted suffix and produces the required peer.",
      "counterexamples": {
        "left-untrusted": "Selects 203.0.113.99 from the untrusted prefix.",
        "header-rightmost": "Selects trusted proxy 10.0.0.1.",
        "remote-only": "Selects trusted proxy 10.0.0.2."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc7239#section-8.1",
      "https://www.php.net/manual/en/reserved.variables.server.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0279",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Transactions, migrations & ORM",
    "subtopic": "idempotency-claim-rowcount-in-transaction",
    "objective": {
      "id": "idempotency-claim-rowcount-in-transaction",
      "text": "Apply a database effect only when an atomic unique-key claim was newly inserted."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine duplicate detection, statement outcome and transaction ownership so a replay does not apply the effect twice."
    },
    "prerequisites": [
      "Idempotency keys",
      "SQLite ON CONFLICT DO NOTHING",
      "PDO rowCount",
      "Atomic claim and effect transaction"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "PDO",
        "pdo_sqlite"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "Each operation always increments the same counter by 10; there is no varying payload. The unique operation key identifies retries of that operation. Every commit in the fixture succeeds. The claim and counter update must remain in the same transaction."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction applyOnce(PDO $pdo, string $key): string\n{\n    $pdo->beginTransaction();\n\n    try {\n        $claim = $pdo->prepare('INSERT INTO claims (operation_key) VALUES (?) ON CONFLICT DO NOTHING');\n        $claim->execute([$key]);\n\n        if ($claim->errorCode() === '00000') {\n            $pdo->exec('UPDATE counters SET value = value + 10 WHERE id = 1');\n            $result = 'applied';\n        } else {\n            $result = 'duplicate';\n        }\n\n        $pdo->commit();\n\n        return $result;\n    } catch (Throwable $error) {\n        if ($pdo->inTransaction()) {\n            $pdo->rollBack();\n        }\n\n        throw $error;\n    }\n}\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec('CREATE TABLE claims (id INTEGER PRIMARY KEY, operation_key TEXT UNIQUE)');\n$pdo->exec('CREATE TABLE counters (id INTEGER PRIMARY KEY, value INTEGER)');\n$pdo->exec('INSERT INTO counters VALUES (1, 0)');\n$results = [applyOnce($pdo, 'request-1'), applyOnce($pdo, 'request-1')];\n\necho json_encode([$results, (int) $pdo->query('SELECT value FROM counters WHERE id = 1')->fetchColumn()]);\n"
        }
      ]
    },
    "stem": "The first key occurrence must return applied and its replay duplicate, leaving value 10. Which condition identifies a newly inserted claim rather than merely a successful SQL execution?",
    "options": [
      {
        "id": "sql-success",
        "text": "$claim->errorCode() === '00000'",
        "rationale": "A conflict handled by DO NOTHING is also successful SQL, so both calls would apply the effect.",
        "misconception": "Equating successful execution with insertion of a new claim."
      },
      {
        "id": "last-id",
        "text": "$pdo->lastInsertId() !== '0'",
        "rationale": "The connection can retain the previous inserted ID when the duplicate inserts no row.",
        "misconception": "Using connection-level last-insert state as a per-statement insertion indicator."
      },
      {
        "id": "new-row",
        "text": "$claim->rowCount() === 1",
        "rationale": "A new claim inserts one row; a duplicate handled by DO NOTHING inserts zero.",
        "misconception": null
      },
      {
        "id": "no-row",
        "text": "$claim->rowCount() === 0",
        "rationale": "This applies the effect on the replay instead of on the first claim.",
        "misconception": "Reversing the meaning of the affected-row count."
      }
    ],
    "correctOptionId": "new-row",
    "explanation": {
      "summary": "The unique constraint makes claiming atomic. DO NOTHING can complete successfully without inserting, so the affected-row count distinguishes a new claim from a replay. Keeping the effect in the same transaction avoids committing a claim without its effect.",
      "trace": "The first insert affects one row and increments the counter. The replay affects zero rows and returns duplicate. The counter remains 10."
    },
    "validation": {
      "kind": "patch",
      "marker": "$claim->errorCode() === '00000'",
      "stdout": "[[\"applied\",\"duplicate\"],10]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-16"
    },
    "references": [
      "https://www.sqlite.org/lang_upsert.html",
      "https://www.php.net/manual/en/pdostatement.rowcount.php",
      "https://www.php.net/manual/en/pdo.transactions.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0280",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Types, casting & comparisons",
    "subtopic": "weak-caller-union-coercion-before-callee-guard",
    "objective": {
      "id": "weak-caller-union-coercion-before-callee-guard",
      "text": "Preserve original input types at a numeric API boundary even when the caller uses weak scalar coercion."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate call-site coercion from callee strictness and validate original input before it can be normalized by a union parameter."
    },
    "prerequisites": [
      "strict_types call-site rule",
      "Scalar union coercion",
      "mixed parameters",
      "Explicit type predicates"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nrequire __DIR__ . '/types.php';\n$results = [];\n\nforeach ([7, 2.5, '7', true] as $input) {\n    try {\n        $value = amount($input);\n        $results[] = [get_debug_type($value), $value];\n    } catch (InvalidArgumentException $error) {\n        $results[] = 'rejected';\n    } catch (TypeError $error) {\n        $results[] = 'TypeError';\n    }\n}\n\necho json_encode($results);\n"
        },
        {
          "path": "types.php",
          "kind": "complete-file",
          "source": "<?php\n\ndeclare(strict_types=1);\n\nfunction amount(int|float $value): int|float\n{\n    if (!is_int($value) && !is_float($value)) {\n        throw new InvalidArgumentException('numeric type required');\n    }\n\n    return $value;\n}\n"
        }
      ]
    },
    "stem": "amount must return integers and floats unchanged, and throw InvalidArgumentException for strings or booleans. The caller is intentionally weak even though types.php is strict. Which complete replacement function preserves this contract?",
    "options": [
      {
        "id": "guard-after-union",
        "text": "function amount(int|float $value): int|float\n{\n    if (!is_int($value) && !is_float($value)) {\n        throw new InvalidArgumentException('numeric type required');\n    }\n\n    return $value;\n}",
        "rationale": "The weak caller can coerce a string or boolean before the body sees it, so the guard cannot recover the original type.",
        "misconception": "Assuming strict_types in the defining file prevents weak caller argument coercion."
      },
      {
        "id": "numeric-text",
        "text": "function amount(mixed $value): int|float\n{\n    if (!is_numeric($value)) {\n        throw new InvalidArgumentException('numeric type required');\n    }\n\n    return +$value;\n}",
        "rationale": "is_numeric accepts the string 7, and unary plus converts it into an accepted number.",
        "misconception": "Using numeric-text validation when only existing numeric PHP types are permitted."
      },
      {
        "id": "float-only",
        "text": "function amount(mixed $value): int|float\n{\n    if (!is_float($value)) {\n        throw new InvalidArgumentException('numeric type required');\n    }\n\n    return $value;\n}",
        "rationale": "This rejects the valid integer input 7 as well as the forbidden types.",
        "misconception": "Treating a numeric API as float-only despite its integer requirement."
      },
      {
        "id": "preserve-input",
        "text": "function amount(mixed $value): int|float\n{\n    if (!is_int($value) && !is_float($value)) {\n        throw new InvalidArgumentException('numeric type required');\n    }\n\n    return $value;\n}",
        "rationale": "mixed preserves the original argument type, allowing the explicit guard to reject strings and booleans before returning the numeric value.",
        "misconception": null
      }
    ],
    "correctOptionId": "preserve-input",
    "explanation": {
      "summary": "Scalar argument coercion is determined by the caller’s strictness. A union parameter can therefore receive an already-coerced value before the strict callee body runs. mixed avoids that conversion, so explicit type predicates can enforce the API’s original-type contract.",
      "trace": "The accepted inputs remain integer 7 and float 2.5. String 7 and boolean true reach the mixed parameter unchanged and are rejected with the required exception."
    },
    "validation": {
      "kind": "patch",
      "marker": "function amount(int|float $value): int|float\n{\n    if (!is_int($value) && !is_float($value)) {\n        throw new InvalidArgumentException('numeric type required');\n    }\n\n    return $value;\n}",
      "stdout": "[[\"int\",7],[\"float\",2.5],\"rejected\",\"rejected\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0281",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Validation & web security",
    "subtopic": "regex-absolute-end-regression",
    "objective": {
      "id": "regex-absolute-end-regression",
      "text": "Test complete input consumption rather than a regex end anchor that permits a final newline."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Choose an input that separates two plausible interpretations of end-of-string."
    },
    "prerequisites": [
      "preg_match",
      "PCRE anchors",
      "Escaped newline bytes"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction validCode(string $input): bool\n{\n    return preg_match('/^[A-Z]{3}$/', $input) === 1;\n}\n"
        }
      ]
    },
    "stem": "validCode must accept exactly three uppercase ASCII letters and no other bytes. Which assertion exposes the defect? The double-quoted escape in an option denotes an actual newline.",
    "options": [
      {
        "id": "lower",
        "text": "validCode('AbC') === false",
        "rationale": "The character class already excludes lowercase letters.",
        "misconception": "Testing case rules instead of complete input consumption."
      },
      {
        "id": "newline",
        "text": "validCode(\"ABC\\n\") === false",
        "rationale": "The $ anchor permits a position before a final newline, so this invalid four-byte input matches.",
        "misconception": null
      },
      {
        "id": "four",
        "text": "validCode('ABCD') === false",
        "rationale": "The extra letter prevents the end anchor from matching.",
        "misconception": "Assuming an arbitrary fourth byte behaves like a terminal newline."
      },
      {
        "id": "three",
        "text": "validCode('ABC') === true",
        "rationale": "The valid three-letter input matches both the faulty and repaired patterns.",
        "misconception": "Using a valid example to test rejection at the boundary."
      }
    ],
    "correctOptionId": "newline",
    "explanation": {
      "summary": "PCRE $ normally matches at the end or immediately before a final newline. The absolute end anchor \\z enforces the stated byte-level contract.",
      "trace": "ABC followed by LF matches the faulty pattern; replacing $ with \\z rejects it while retaining the three-letter case."
    },
    "validation": {
      "kind": "tests",
      "marker": "'/^[A-Z]{3}$/'",
      "repair": "'/\\A[A-Z]{3}\\z/'",
      "cases": [
        {
          "option": "lower",
          "probe": "echo json_encode(validCode('AbC'));",
          "expected": "false"
        },
        {
          "option": "newline",
          "probe": "echo json_encode(validCode(\"ABC\\n\"));",
          "expected": "false"
        },
        {
          "option": "four",
          "probe": "echo json_encode(validCode('ABCD'));",
          "expected": "false"
        },
        {
          "option": "three",
          "probe": "echo json_encode(validCode('ABC'));",
          "expected": "true"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/regexp.reference.anchors.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0282",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Files & structured data",
    "subtopic": "bounded-fgets-record-truncation-test",
    "objective": {
      "id": "bounded-fgets-record-truncation-test",
      "text": "Select a file fixture that exposes a byte limit mistaken for a complete line read."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Relate fgets length minus one to a record that exceeds the chosen buffer size."
    },
    "prerequisites": [
      "fgets",
      "Memory streams",
      "Line terminators"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "Each input is one newline-terminated record. All memory-stream operations succeed; the function owns the stream."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction firstRecord(string $input): string\n{\n    $stream = fopen('php://memory', 'w+b');\n    fwrite($stream, $input);\n    rewind($stream);\n    $record = fgets($stream, 5);\n    fclose($stream);\n\n    return $record;\n}\n"
        }
      ]
    },
    "stem": "firstRecord must return all bytes of the first record, including its newline. Which assertion fails?",
    "options": [
      {
        "id": "empty",
        "text": "firstRecord(\"\\n\") === \"\\n\"",
        "rationale": "The newline fits within the four-byte read limit.",
        "misconception": "Treating an empty record as a zero-byte read."
      },
      {
        "id": "one",
        "text": "firstRecord(\"A\\n\") === \"A\\n\"",
        "rationale": "Both bytes fit and the read stops at the newline.",
        "misconception": "Assuming a length argument always adds padding."
      },
      {
        "id": "edge",
        "text": "firstRecord(\"ABC\\n\") === \"ABC\\n\"",
        "rationale": "The four-byte record exactly fits length minus one.",
        "misconception": "Treating the length parameter as a count of data bytes excluding the newline."
      },
      {
        "id": "beyond",
        "text": "firstRecord(\"ABCD\\n\") === \"ABCD\\n\"",
        "rationale": "Only ABCD is returned; the newline remains unread.",
        "misconception": null
      }
    ],
    "correctOptionId": "beyond",
    "explanation": {
      "summary": "fgets stops after at most length minus one bytes, at a newline, or at EOF. Removing the length bound allows this function to read the entire record.",
      "trace": "The five-byte record is split after four bytes by fgets($stream, 5). The repaired unbounded call includes its newline."
    },
    "validation": {
      "kind": "tests",
      "marker": "fgets($stream, 5)",
      "repair": "fgets($stream)",
      "cases": [
        {
          "option": "empty",
          "probe": "echo json_encode(firstRecord(\"\\n\"));",
          "expected": "\"\\n\""
        },
        {
          "option": "one",
          "probe": "echo json_encode(firstRecord(\"A\\n\"));",
          "expected": "\"A\\n\""
        },
        {
          "option": "edge",
          "probe": "echo json_encode(firstRecord(\"ABC\\n\"));",
          "expected": "\"ABC\\n\""
        },
        {
          "option": "beyond",
          "probe": "echo json_encode(firstRecord(\"ABCD\\n\"));",
          "expected": "\"ABCD\\n\""
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.fgets.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0283",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "base-class-admission-regression",
    "objective": {
      "id": "base-class-admission-regression",
      "text": "Test whether a type admission check accepts the base class itself as well as descendants."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish strict subclass membership from an is-a relationship."
    },
    "prerequisites": [
      "Class inheritance",
      "is_subclass_of",
      "is_a"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Message\n{\n}\n\nclass Email extends Message\n{\n}\n\nclass Sms extends Message\n{\n}\n\nfunction accepts(object $value): bool\n{\n    return is_subclass_of($value, Message::class);\n}\n"
        }
      ]
    },
    "stem": "accepts must return true for any Message instance, including an instance of Message itself. Which assertion fails?",
    "options": [
      {
        "id": "base",
        "text": "accepts(new Message()) === true",
        "rationale": "An object of the named class is not a subclass of that same class.",
        "misconception": null
      },
      {
        "id": "email",
        "text": "accepts(new Email()) === true",
        "rationale": "Email is a proper subclass and is already accepted.",
        "misconception": "Checking only a derived class misses exact-type rejection."
      },
      {
        "id": "sms",
        "text": "accepts(new Sms()) === true",
        "rationale": "Sms has the same valid inheritance relation as Email.",
        "misconception": "Assuming a second descendant exercises the base-class boundary."
      },
      {
        "id": "unrelated",
        "text": "accepts(new stdClass()) === false",
        "rationale": "The unrelated object is rejected by both predicates.",
        "misconception": "Testing exclusion without testing all permitted members."
      }
    ],
    "correctOptionId": "base",
    "explanation": {
      "summary": "is_subclass_of excludes the named class itself. is_a, or instanceof with Message, includes both the base type and its descendants.",
      "trace": "The direct Message instance yields false with is_subclass_of and true with is_a. Both descendants and the unrelated object retain their expected results."
    },
    "validation": {
      "kind": "tests",
      "marker": "is_subclass_of($value, Message::class)",
      "repair": "is_a($value, Message::class)",
      "cases": [
        {
          "option": "base",
          "probe": "echo json_encode(accepts(new Message()));",
          "expected": "true"
        },
        {
          "option": "email",
          "probe": "echo json_encode(accepts(new Email()));",
          "expected": "true"
        },
        {
          "option": "sms",
          "probe": "echo json_encode(accepts(new Sms()));",
          "expected": "true"
        },
        {
          "option": "unrelated",
          "probe": "echo json_encode(accepts(new stdClass()));",
          "expected": "false"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/function.is-subclass-of.php",
      "https://www.php.net/manual/en/function.is-a.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0284",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Files & structured data",
    "subtopic": "json-integral-float-wire-test",
    "objective": {
      "id": "json-integral-float-wire-test",
      "text": "Select an exact-wire assertion that detects loss of a float’s fractional marker."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish numerically equivalent JSON values from an explicit serialization-format contract."
    },
    "prerequisites": [
      "JSON encoding",
      "Integer versus float",
      "Exact string assertions"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The protocol requires PHP floats with integral value to retain a .0 fractional marker. Integer values must remain integers in the JSON text. This is an exact wire-format requirement, not a claim that JSON has separate integer and float types."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction wireNumber(int|float $number): string\n{\n    return json_encode($number, JSON_THROW_ON_ERROR);\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed serializer?",
    "options": [
      {
        "id": "fraction",
        "text": "wireNumber(2.5) === '2.5'",
        "rationale": "A nonzero fractional part is preserved without the extra flag.",
        "misconception": "Using a fractional value to test integral-float formatting."
      },
      {
        "id": "integer",
        "text": "wireNumber(2) === '2'",
        "rationale": "An integer should remain 2, and already does.",
        "misconception": "Assuming the repair must append .0 to every numeric value."
      },
      {
        "id": "whole-float",
        "text": "wireNumber(2.0) === '2.0'",
        "rationale": "The current flags produce 2, omitting the required fractional marker.",
        "misconception": null
      },
      {
        "id": "negative",
        "text": "wireNumber(-3.5) === '-3.5'",
        "rationale": "The sign does not cause loss of the nonzero fractional part.",
        "misconception": "Treating negative numbers as the missing serialization boundary."
      }
    ],
    "correctOptionId": "whole-float",
    "explanation": {
      "summary": "JSON_PRESERVE_ZERO_FRACTION retains a fractional marker for integral PHP floats. It does not convert integer arguments into floats.",
      "trace": "2.0 is a PHP float but normally encodes as 2. Adding the flag changes that result to 2.0 and leaves the other three expectations unchanged."
    },
    "validation": {
      "kind": "tests",
      "marker": "JSON_THROW_ON_ERROR",
      "repair": "JSON_THROW_ON_ERROR | JSON_PRESERVE_ZERO_FRACTION",
      "cases": [
        {
          "option": "fraction",
          "probe": "echo wireNumber(2.5);",
          "expected": "2.5"
        },
        {
          "option": "integer",
          "probe": "echo wireNumber(2);",
          "expected": "2"
        },
        {
          "option": "whole-float",
          "probe": "echo wireNumber(2.0);",
          "expected": "2.0"
        },
        {
          "option": "negative",
          "probe": "echo wireNumber(-3.5);",
          "expected": "-3.5"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/json.constants.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0285",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "date-difference-direction-regression",
    "objective": {
      "id": "date-difference-direction-regression",
      "text": "Test the sign of a calendar-date difference instead of only its magnitude."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Use a reversed date pair to exercise DateInterval direction metadata."
    },
    "prerequisites": [
      "DateTimeImmutable::diff",
      "DateInterval::days",
      "DateInterval::invert"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "Inputs are valid YYYY-MM-DD dates at midnight UTC. signedDays must be positive when the second date is later and negative when it is earlier."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction signedDays(string $from, string $to): int\n{\n    $interval = (new DateTimeImmutable($from))->diff(new DateTimeImmutable($to));\n\n    return $interval->days;\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed implementation?",
    "options": [
      {
        "id": "same",
        "text": "signedDays('2025-04-02', '2025-04-02') === 0",
        "rationale": "The magnitude of a zero interval already matches its signed value.",
        "misconception": "Expecting an equal-date case to exercise direction."
      },
      {
        "id": "backwards",
        "text": "signedDays('2025-04-02', '2025-04-01') === -1",
        "rationale": "days is 1 and invert is 1; the implementation ignores invert.",
        "misconception": null
      },
      {
        "id": "forward",
        "text": "signedDays('2025-04-01', '2025-04-02') === 1",
        "rationale": "The positive magnitude is already the required answer.",
        "misconception": "Checking only forward movement cannot reveal a lost sign."
      },
      {
        "id": "leap",
        "text": "signedDays('2024-02-28', '2024-03-01') === 2",
        "rationale": "The date library correctly includes leap day in the positive magnitude.",
        "misconception": "Choosing calendar complexity that does not test the missing direction bit."
      }
    ],
    "correctOptionId": "backwards",
    "explanation": {
      "summary": "For an interval returned by diff, days is the total day magnitude and invert indicates reversed direction. Applying that direction produces a signed result.",
      "trace": "The backwards interval has days=1 and invert=1, so the repaired expression returns -1."
    },
    "validation": {
      "kind": "tests",
      "marker": "return $interval->days;",
      "repair": "return $interval->invert ? -$interval->days : $interval->days;",
      "cases": [
        {
          "option": "same",
          "probe": "echo signedDays('2025-04-02', '2025-04-02');",
          "expected": "0"
        },
        {
          "option": "backwards",
          "probe": "echo signedDays('2025-04-02', '2025-04-01');",
          "expected": "-1"
        },
        {
          "option": "forward",
          "probe": "echo signedDays('2025-04-01', '2025-04-02');",
          "expected": "1"
        },
        {
          "option": "leap",
          "probe": "echo signedDays('2024-02-28', '2024-03-01');",
          "expected": "2"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.php.net/manual/en/class.dateinterval.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0286",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "external-method-callability-test",
    "objective": {
      "id": "external-method-callability-test",
      "text": "Test method availability from the caller’s visibility scope."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish declaring a method from allowing an external call to it."
    },
    "prerequisites": [
      "Public and private methods",
      "method_exists",
      "is_callable"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass PublicWorker\n{\n    public function run(): void\n    {\n    }\n}\n\nclass PrivateWorker\n{\n    private function run(): void\n    {\n    }\n}\n\nclass ChildWorker extends PublicWorker\n{\n}\n\nfunction canRun(object $worker): bool\n{\n    return method_exists($worker, 'run');\n}\n"
        }
      ]
    },
    "stem": "canRun is called outside these classes and must report whether $worker->run() is callable there. None of the classes implements __call. Which assertion fails?",
    "options": [
      {
        "id": "inherited",
        "text": "canRun(new ChildWorker()) === true",
        "rationale": "The inherited public method is visible and exists.",
        "misconception": "Assuming inherited methods are absent from method_exists."
      },
      {
        "id": "missing",
        "text": "canRun(new stdClass()) === false",
        "rationale": "There is no run method or magic dispatcher.",
        "misconception": "Testing method absence rather than visibility."
      },
      {
        "id": "private",
        "text": "canRun(new PrivateWorker()) === false",
        "rationale": "method_exists sees the private declaration even though this external caller cannot invoke it.",
        "misconception": null
      },
      {
        "id": "public",
        "text": "canRun(new PublicWorker()) === true",
        "rationale": "The public declaration is callable and already accepted.",
        "misconception": "Using only a public method cannot expose the visibility defect."
      }
    ],
    "correctOptionId": "private",
    "explanation": {
      "summary": "method_exists answers a declaration question. is_callable checks whether this scope can call the method, including its visibility.",
      "trace": "The private method exists but the external [object, run] callable is invalid. The other three cases have the same result under both checks."
    },
    "validation": {
      "kind": "tests",
      "marker": "method_exists($worker, 'run')",
      "repair": "is_callable([$worker, 'run'])",
      "cases": [
        {
          "option": "inherited",
          "probe": "echo json_encode(canRun(new ChildWorker()));",
          "expected": "true"
        },
        {
          "option": "missing",
          "probe": "echo json_encode(canRun(new stdClass()));",
          "expected": "false"
        },
        {
          "option": "private",
          "probe": "echo json_encode(canRun(new PrivateWorker()));",
          "expected": "false"
        },
        {
          "option": "public",
          "probe": "echo json_encode(canRun(new PublicWorker()));",
          "expected": "true"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/function.method-exists.php",
      "https://www.php.net/manual/en/function.is-callable.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0287",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "HTTP & superglobals",
    "subtopic": "http-field-name-case-test",
    "objective": {
      "id": "http-field-name-case-test",
      "text": "Test HTTP field-name case insensitivity in a PHP associative-array adapter."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate protocol name equivalence from PHP’s case-sensitive string keys."
    },
    "prerequisites": [
      "HTTP fields",
      "PHP array keys",
      "array_change_key_case"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The input is an already parsed map with at most one spelling of each HTTP field name. Names contain ASCII characters only. Values must remain byte-for-byte unchanged."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction contentType(array $fields): ?string\n{\n    return $fields['Content-Type'] ?? null;\n}\n"
        }
      ]
    },
    "stem": "contentType must find the field regardless of its name’s letter case, or return null if absent. Which assertion fails?",
    "options": [
      {
        "id": "absent",
        "text": "contentType([]) === null",
        "rationale": "The missing key already produces null.",
        "misconception": "Testing absence without name normalization."
      },
      {
        "id": "lower",
        "text": "contentType(['content-type' => 'Text/Plain']) === 'Text/Plain'",
        "rationale": "The lowercase key is a valid spelling of the field but the current lookup misses it.",
        "misconception": null
      },
      {
        "id": "canonical",
        "text": "contentType(['Content-Type' => 'Text/Plain']) === 'Text/Plain'",
        "rationale": "This is the one spelling the implementation already recognizes.",
        "misconception": "Assuming a canonical-spelling test establishes case insensitivity."
      },
      {
        "id": "unrelated",
        "text": "contentType(['Accept' => 'text/plain']) === null",
        "rationale": "Accept is a different field, regardless of its value.",
        "misconception": "Confusing media-type values with the name of the field being requested."
      }
    ],
    "correctOptionId": "lower",
    "explanation": {
      "summary": "HTTP field names are case-insensitive, whereas string array keys are not. Normalizing names permits a lowercase lookup without altering field values.",
      "trace": "array_change_key_case with CASE_LOWER changes Content-Type to content-type but leaves Text/Plain untouched."
    },
    "validation": {
      "kind": "tests",
      "marker": "return $fields['Content-Type'] ?? null;",
      "repair": "return array_change_key_case($fields, CASE_LOWER)['content-type'] ?? null;",
      "cases": [
        {
          "option": "absent",
          "probe": "echo json_encode(contentType([]));",
          "expected": "null"
        },
        {
          "option": "lower",
          "probe": "echo json_encode(contentType(['content-type' => 'Text/Plain']), JSON_UNESCAPED_SLASHES);",
          "expected": "\"Text/Plain\""
        },
        {
          "option": "canonical",
          "probe": "echo json_encode(contentType(['Content-Type' => 'Text/Plain']), JSON_UNESCAPED_SLASHES);",
          "expected": "\"Text/Plain\""
        },
        {
          "option": "unrelated",
          "probe": "echo json_encode(contentType(['Accept' => 'text/plain']));",
          "expected": "null"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc9110.html#section-5.1",
      "https://www.php.net/manual/en/function.array-change-key-case.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0288",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Errors & exceptions",
    "subtopic": "exception-rethrow-identity-test",
    "objective": {
      "id": "exception-rethrow-identity-test",
      "text": "Verify that a pass-through boundary preserves the original exception object."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose an assertion that detects reconstruction despite matching class and message."
    },
    "prerequisites": [
      "Exception identity",
      "Catch and throw",
      "Object comparison"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction passThrough(RuntimeException $failure): never\n{\n    try {\n        throw $failure;\n    } catch (RuntimeException $caught) {\n        throw new RuntimeException($caught->getMessage());\n    }\n}\n\n$original = new RuntimeException('failure');\n\ntry {\n    passThrough($original);\n} catch (RuntimeException $caught) {\n    $result = $caught;\n}\n"
        }
      ]
    },
    "stem": "passThrough must rethrow the same exception object it receives. The test creates a RuntimeException with message failure and default code 0. Which assertion fails for the caught result?",
    "options": [
      {
        "id": "identity",
        "text": "$result === $original",
        "rationale": "Reconstructing a RuntimeException creates a different object, violating the explicit identity contract.",
        "misconception": null
      },
      {
        "id": "message",
        "text": "$result->getMessage() === 'failure'",
        "rationale": "The new exception copies the message.",
        "misconception": "Equating matching diagnostic text with preserved object identity."
      },
      {
        "id": "type",
        "text": "$result instanceof RuntimeException",
        "rationale": "The replacement has the same class as the original.",
        "misconception": "Checking type alone cannot distinguish replacement from rethrow."
      },
      {
        "id": "code",
        "text": "$result->getCode() === 0",
        "rationale": "Both constructors use the default zero code in this fixture.",
        "misconception": "Relying on a default metadata value to detect reconstruction."
      }
    ],
    "correctOptionId": "identity",
    "explanation": {
      "summary": "throw $caught preserves the object that crossed the boundary. Constructing another exception, even with the same message and type, does not.",
      "trace": "The faulty boundary produces a new object with matching message, class and code. The repair rethrows $caught, making strict object identity true."
    },
    "validation": {
      "kind": "tests",
      "marker": "throw new RuntimeException($caught->getMessage());",
      "repair": "throw $caught;",
      "cases": [
        {
          "option": "identity",
          "probe": "echo json_encode($result === $original);",
          "expected": "true"
        },
        {
          "option": "message",
          "probe": "echo json_encode($result->getMessage() === 'failure');",
          "expected": "true"
        },
        {
          "option": "type",
          "probe": "echo json_encode($result instanceof RuntimeException);",
          "expected": "true"
        },
        {
          "option": "code",
          "probe": "echo json_encode($result->getCode() === 0);",
          "expected": "true"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/language.exceptions.php",
      "https://www.php.net/manual/en/language.oop5.object-comparison.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0289",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Classes & object lifecycle",
    "subtopic": "derived-cache-invalidation-test",
    "objective": {
      "id": "derived-cache-invalidation-test",
      "text": "Choose an operation sequence that tests invalidation of cached derived state."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "The failure requires a read before a mutation and another read afterward."
    },
    "prerequisites": [
      "Private object state",
      "Null coalescing assignment",
      "Cache invalidation"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "ini": {
        "zend.assertions": 1
      },
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The shown assertions run with zend.assertions=1 and assert.exception=1."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Basket\n{\n    private array $prices = [];\n    private ?int $cachedTotal = null;\n\n    public function add(int $price): void\n    {\n        $this->prices[] = $price;\n    }\n\n    public function total(): int\n    {\n        return $this->cachedTotal ??= array_sum($this->prices);\n    }\n}\n"
        }
      ]
    },
    "stem": "Basket::total must always equal the sum of all added prices. Which test sequence fails against the implementation? Each option starts with a fresh Basket.",
    "options": [
      {
        "id": "before-read",
        "text": "$basket->add(4);\n$basket->add(3);\nassert($basket->total() === 7);",
        "rationale": "The first total is computed after both mutations.",
        "misconception": "Testing mutations only before the cache is populated."
      },
      {
        "id": "empty",
        "text": "assert($basket->total() === 0);\nassert($basket->total() === 0);",
        "rationale": "Repeated reads without a mutation legitimately reuse zero.",
        "misconception": "Treating cache reuse itself as the defect."
      },
      {
        "id": "repeat",
        "text": "$basket->add(4);\nassert($basket->total() === 4);\nassert($basket->total() === 4);",
        "rationale": "The underlying prices do not change between reads.",
        "misconception": "Checking repeated reads without invalidating state."
      },
      {
        "id": "read-mutate-read",
        "text": "$basket->add(4);\n$basket->total();\n$basket->add(3);\nassert($basket->total() === 7);",
        "rationale": "The first read caches 4; add(3) fails to clear it, so the final read still returns 4.",
        "misconception": null
      }
    ],
    "correctOptionId": "read-mutate-read",
    "explanation": {
      "summary": "A cached value derived from mutable state must be invalidated when that state changes. The decisive sequence primes the cache before changing a dependency.",
      "trace": "Clearing cachedTotal in add forces the next total call to recompute 4 + 3."
    },
    "validation": {
      "kind": "tests",
      "ini": {
        "zend.assertions": 1
      },
      "marker": "$this->prices[] = $price;",
      "repair": "$this->prices[] = $price;\n        $this->cachedTotal = null;",
      "cases": [
        {
          "option": "before-read",
          "probe": "$basket = new Basket();\n$basket->add(4);\n$basket->add(3);\necho $basket->total();",
          "expected": "7"
        },
        {
          "option": "empty",
          "probe": "$basket = new Basket();\n$basket->total();\necho $basket->total();",
          "expected": "0"
        },
        {
          "option": "repeat",
          "probe": "$basket = new Basket();\n$basket->add(4);\n$basket->total();\necho $basket->total();",
          "expected": "4"
        },
        {
          "option": "read-mutate-read",
          "probe": "$basket = new Basket();\n$basket->add(4);\n$basket->total();\n$basket->add(3);\necho $basket->total();",
          "expected": "7"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.php",
      "https://www.php.net/manual/en/language.operators.assignment.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0290",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Arrays & destructuring",
    "subtopic": "multiset-removal-regression",
    "objective": {
      "id": "multiset-removal-regression",
      "text": "Distinguish removing one occurrence from removing every matching value."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Use a repeated-value input to test multiplicity, not just membership."
    },
    "prerequisites": [
      "array_diff",
      "array_search",
      "array_splice"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "Inputs are lists of integers. removeOne must remove only the first occurrence of the requested integer, preserve the other values in order and return a list."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction removeOne(array $items, int $value): array\n{\n    return array_values(array_diff($items, [$value]));\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed implementation?",
    "options": [
      {
        "id": "once",
        "text": "removeOne([2, 3], 2) === [3]",
        "rationale": "Only one matching occurrence exists, so removing all matches has the same result.",
        "misconception": "Testing only a unique value hides multiplicity."
      },
      {
        "id": "absent",
        "text": "removeOne([2, 3], 4) === [2, 3]",
        "rationale": "No occurrence is removed under either algorithm.",
        "misconception": "Testing absence cannot distinguish one removal from all removals."
      },
      {
        "id": "repeated",
        "text": "removeOne([2, 3, 2], 2) === [3, 2]",
        "rationale": "array_diff removes both 2 values, returning only [3].",
        "misconception": null
      },
      {
        "id": "empty",
        "text": "removeOne([], 2) === []",
        "rationale": "The empty list remains empty.",
        "misconception": "Treating a base case as evidence for duplicate handling."
      }
    ],
    "correctOptionId": "repeated",
    "explanation": {
      "summary": "array_diff excludes every element whose value occurs in the comparison array. A one-occurrence operation instead finds a position and removes just that entry.",
      "trace": "Finding the first 2 at index 0 and splicing one entry leaves [3, 2]. The other three cases produce the same output as the original."
    },
    "validation": {
      "kind": "tests",
      "marker": "return array_values(array_diff($items, [$value]));",
      "repair": "$index = array_search($value, $items, true);\n\n    if ($index !== false) {\n        array_splice($items, $index, 1);\n    }\n\n    return $items;",
      "cases": [
        {
          "option": "once",
          "probe": "echo json_encode(removeOne([2, 3], 2));",
          "expected": "[3]"
        },
        {
          "option": "absent",
          "probe": "echo json_encode(removeOne([2, 3], 4));",
          "expected": "[2,3]"
        },
        {
          "option": "repeated",
          "probe": "echo json_encode(removeOne([2, 3, 2], 2));",
          "expected": "[3,2]"
        },
        {
          "option": "empty",
          "probe": "echo json_encode(removeOne([], 2));",
          "expected": "[]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-diff.php",
      "https://www.php.net/manual/en/function.array-splice.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0291",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Files & structured data",
    "subtopic": "partial-json-overrides-throw-test",
    "objective": {
      "id": "partial-json-overrides-throw-test",
      "text": "Test interacting JSON error flags when data loss must abort serialization."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "The presence of JSON_THROW_ON_ERROR is insufficient when a higher-priority flag permits substitution."
    },
    "prerequisites": [
      "JSON encoder error flags",
      "Non-finite floats",
      "Exception-based failure contracts"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The serializer must return exact valid JSON for supported values and return rejected if any value cannot be represented. Substituting a different value is forbidden."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction encodeStrictly(mixed $value): string\n{\n    try {\n        return json_encode($value, JSON_THROW_ON_ERROR | JSON_PARTIAL_OUTPUT_ON_ERROR);\n    } catch (JsonException $failure) {\n        return 'rejected';\n    }\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed serializer?",
    "options": [
      {
        "id": "finite",
        "text": "encodeStrictly([1.5]) === '[1.5]'",
        "rationale": "Finite numbers encode normally with either flag configuration.",
        "misconception": "Using a supported number does not exercise substitution."
      },
      {
        "id": "null",
        "text": "encodeStrictly([null]) === '[null]'",
        "rationale": "An explicit null is valid JSON data, not an encoding error.",
        "misconception": "Confusing an original null with a substituted error marker."
      },
      {
        "id": "empty",
        "text": "encodeStrictly([]) === '[]'",
        "rationale": "An empty list is supported and requires no replacement.",
        "misconception": "Treating an empty collection as an encoding failure."
      },
      {
        "id": "infinite",
        "text": "encodeStrictly([INF]) === 'rejected'",
        "rationale": "Partial output takes precedence and replaces INF with 0, returning [0] instead of throwing.",
        "misconception": null
      }
    ],
    "correctOptionId": "infinite",
    "explanation": {
      "summary": "JSON_PARTIAL_OUTPUT_ON_ERROR takes precedence over JSON_THROW_ON_ERROR. For INF it permits a numeric zero replacement, violating the no-substitution contract.",
      "trace": "Removing the partial-output flag causes JsonException for INF and reaches the rejection path. All supported fixtures keep their exact output."
    },
    "validation": {
      "kind": "tests",
      "marker": "JSON_THROW_ON_ERROR | JSON_PARTIAL_OUTPUT_ON_ERROR",
      "repair": "JSON_THROW_ON_ERROR",
      "cases": [
        {
          "option": "finite",
          "probe": "echo encodeStrictly([1.5]);",
          "expected": "[1.5]"
        },
        {
          "option": "null",
          "probe": "echo encodeStrictly([null]);",
          "expected": "[null]"
        },
        {
          "option": "empty",
          "probe": "echo encodeStrictly([]);",
          "expected": "[]"
        },
        {
          "option": "infinite",
          "probe": "echo encodeStrictly([INF]);",
          "expected": "rejected"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/json.constants.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0292",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Enums, attributes & reflection",
    "subtopic": "reflection-union-string-membership-test",
    "objective": {
      "id": "reflection-union-string-membership-test",
      "text": "Test union-aware reflection without treating every return type as ReflectionNamedType."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine nullable named types, union metadata and a tool’s failure fallback."
    },
    "prerequisites": [
      "ReflectionFunction",
      "ReflectionNamedType and ReflectionUnionType",
      "Nullable types"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The fixtures have either a named return type or a union of named return types. acceptsString reports whether string is explicitly admitted; mixed, intersections and untyped functions are outside this tool’s current contract."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction acceptsString(Closure $callable): bool\n{\n    $type = (new ReflectionFunction($callable))->getReturnType();\n\n    try {\n        return $type->getName() === 'string';\n    } catch (Error $failure) {\n        return false;\n    }\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed reflection helper?",
    "options": [
      {
        "id": "plain",
        "text": "acceptsString(fn (): string => 'x') === true",
        "rationale": "A named string return type exposes getName and is accepted.",
        "misconception": "Testing only a named type misses union metadata."
      },
      {
        "id": "union",
        "text": "acceptsString(fn (): int|string => 1) === true",
        "rationale": "ReflectionUnionType has no getName method; the caught Error incorrectly becomes false.",
        "misconception": null
      },
      {
        "id": "nullable",
        "text": "acceptsString(fn (): ?string => null) === true",
        "rationale": "A nullable string is represented as a named string type with allowsNull, so this case already passes.",
        "misconception": "Assuming every nullable declaration is represented as a union object."
      },
      {
        "id": "integer",
        "text": "acceptsString(fn (): int => 1) === false",
        "rationale": "The named integer type does not admit strings.",
        "misconception": "Selecting a correctly rejected named type cannot expose the fallback defect."
      }
    ],
    "correctOptionId": "union",
    "explanation": {
      "summary": "ReflectionType has multiple concrete forms. Union members must be inspected through getTypes; named types can be inspected directly. Catching a method-call Error obscures that distinction.",
      "trace": "The union fixture fails only because the helper calls a named-type method on a union. The repair checks every named member and accepts the string member."
    },
    "validation": {
      "kind": "tests",
      "marker": "return $type->getName() === 'string';",
      "repair": "$members = $type instanceof ReflectionUnionType ? $type->getTypes() : [$type];\n\n        foreach ($members as $member) {\n            if ($member->getName() === 'string') {\n                return true;\n            }\n        }\n\n        return false;",
      "cases": [
        {
          "option": "plain",
          "probe": "echo json_encode(acceptsString(fn (): string => 'x'));",
          "expected": "true"
        },
        {
          "option": "union",
          "probe": "echo json_encode(acceptsString(fn (): int|string => 1));",
          "expected": "true"
        },
        {
          "option": "nullable",
          "probe": "echo json_encode(acceptsString(fn (): ?string => null));",
          "expected": "true"
        },
        {
          "option": "integer",
          "probe": "echo json_encode(acceptsString(fn (): int => 1));",
          "expected": "false"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/reflectionuniontype.gettypes.php",
      "https://www.php.net/manual/en/reflectionnamedtype.getname.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0293",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Forms & file uploads",
    "subtopic": "upload-quarantine-publication-boundary",
    "objective": {
      "id": "upload-quarantine-publication-boundary",
      "text": "Place an upload’s public availability after its required validation decision."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Identify a race between publication and asynchronous scanning rather than only choosing a file check."
    },
    "prerequisites": [
      "PHP upload handling",
      "Public web roots",
      "Asynchronous scanning"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "A PHP service accepts PDFs. A trusted asynchronous scanner may take several minutes and can reject a file. Files must never be downloadable before that scanner accepts them. A private storage area is inaccessible through both static hosting and download routes; public storage is immediately accessible. File type checks alone do not satisfy the scanner policy."
      ],
      "files": []
    },
    "stem": "Which storage lifecycle satisfies the publication requirement?",
    "options": [
      {
        "id": "publish-delete",
        "text": "Store in public storage with a random name; delete it if scanning rejects it.",
        "rationale": "The file is public during the scan, even if the name is difficult to guess.",
        "misconception": "Treating an unpredictable URL as an authorization boundary."
      },
      {
        "id": "quarantine",
        "text": "Store privately; publish only after the scanner records acceptance.",
        "rationale": "The unaccepted file never enters the public serving path.",
        "misconception": null
      },
      {
        "id": "extension",
        "text": "Store publicly with a .pending extension; rename after acceptance.",
        "rationale": "The stated public storage serves the pending filename too.",
        "misconception": "Assuming a filename suffix prevents downloads."
      },
      {
        "id": "mime-first",
        "text": "Check the PDF signature; publish immediately and scan in the background.",
        "rationale": "The signature check does not replace the required scanner decision.",
        "misconception": "Substituting a preliminary format check for a later mandatory acceptance gate."
      }
    ],
    "correctOptionId": "quarantine",
    "explanation": {
      "summary": "The decisive boundary is whether the serving path can reach unaccepted bytes. Private quarantine makes scan acceptance a prerequisite for publication.",
      "trace": "Before acceptance the private file is unreachable. A rejection leaves it private or deletes it; only acceptance moves or copies it into public serving storage."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Unaccepted bytes must have no public serving path; scanning is asynchronous and mandatory.",
      "optionAudit": {
        "publish-delete": "Has an exposure window before rejection.",
        "quarantine": "No public path exists until acceptance.",
        "extension": "Public storage serves the pending filename.",
        "mime-first": "Format checking is not scanner acceptance."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-12"
    },
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0294",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "composer-runtime-dependency-scope",
    "objective": {
      "id": "composer-runtime-dependency-scope",
      "text": "Declare a package used by production code in Composer’s runtime dependency set."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace a clean --no-dev installation rather than relying on a developer’s populated vendor directory."
    },
    "prerequisites": [
      "Composer require versus require-dev",
      "Dependency locks",
      "Clean production installs"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Composer 2 installs the application root with composer install --no-dev. A newly added runtime adapter directly instantiates Acme\\Codec\\Decoder from package acme/codec. No other required package depends on acme/codec. The application and its lock file must declare everything needed at runtime."
      ],
      "files": []
    },
    "stem": "Where should acme/codec be declared so a clean production installation provides the adapter’s dependency?",
    "options": [
      {
        "id": "dev",
        "text": "In require-dev, because tests also exercise the adapter.",
        "rationale": "--no-dev omits the only dependency path that would install the package.",
        "misconception": "Classifying a runtime dependency by its use in tests."
      },
      {
        "id": "suggest",
        "text": "In suggest, because the adapter can describe the missing package.",
        "rationale": "Suggestions are informational and do not install required runtime code.",
        "misconception": "Treating suggested packages as automatically installed dependencies."
      },
      {
        "id": "autoload",
        "text": "In autoload.psr-4, with a path under vendor/acme/codec.",
        "rationale": "An autoload rule does not download or resolve a package dependency.",
        "misconception": "Confusing class discovery with dependency installation."
      },
      {
        "id": "require",
        "text": "In require, followed by a matching reviewed lock-file update.",
        "rationale": "The package becomes part of the production dependency graph and reproducible installation.",
        "misconception": null
      }
    ],
    "correctOptionId": "require",
    "explanation": {
      "summary": "require declares runtime dependencies. require-dev is reserved for development-only requirements and is excluded by --no-dev; autoload settings solve a different problem.",
      "trace": "A clean production install resolves the locked require graph, installs acme/codec and generates its autoload rules."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Composer --no-dev skips require-dev; require dependencies remain installed.",
      "optionAudit": {
        "dev": "Excluded by the specified install mode.",
        "suggest": "Not an installation requirement.",
        "autoload": "Does not acquire the package.",
        "require": "Declares and locks the runtime dependency."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://getcomposer.org/doc/04-schema.md#require",
      "https://getcomposer.org/doc/03-cli.md#install-i"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0295",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Performance, processes & servers",
    "subtopic": "bounded-memory-export-pipeline",
    "objective": {
      "id": "bounded-memory-export-pipeline",
      "text": "Keep an export pipeline’s retained data independent of total row count."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Evaluate where apparently streaming code still materializes the complete result."
    },
    "prerequisites": [
      "PDO fetch loops",
      "Generators",
      "Memory complexity",
      "Synchronous stream writes"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "A PDO driver is configured for unbuffered row retrieval. Each row is at most 4 KB, the output sink writes synchronously without retaining prior writes, and all writes succeed. The export contains millions of rows. The application must retain only a bounded number of rows and emit them in query order."
      ],
      "files": []
    },
    "stem": "Which pipeline meets the stated memory constraint?",
    "options": [
      {
        "id": "incremental",
        "text": "Fetch one row, encode it, write it, then fetch the next row.",
        "rationale": "With the stated driver and sink, only the current row and its encoding need to remain live.",
        "misconception": null
      },
      {
        "id": "fetch-all",
        "text": "Call fetchAll, then yield each fetched row from a generator.",
        "rationale": "The generator wraps an already materialized array containing every row.",
        "misconception": "Assuming a generator can undo memory already retained by fetchAll."
      },
      {
        "id": "collect-lines",
        "text": "Fetch rows individually, append encoded lines to an array, then write the array.",
        "rationale": "The accumulated output grows with the total row count.",
        "misconception": "Measuring input buffering while ignoring retained output."
      },
      {
        "id": "materialize-generator",
        "text": "Yield rows directly from PDO, then call iterator_to_array before writing.",
        "rationale": "Materialization retains the complete generated sequence.",
        "misconception": "Treating a lazy source as sufficient even when its consumer eagerly collects it."
      }
    ],
    "correctOptionId": "incremental",
    "explanation": {
      "summary": "Bounded memory is an end-to-end property of the pipeline. A streaming producer does not help if an intermediate or consumer retains all rows or encoded output.",
      "trace": "The incremental pipeline releases each row before the next iteration; the other pipelines contain an explicit collection proportional to total records."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Unbuffered input and a nonretaining synchronous sink permit bounded retention only if intermediate stages do not collect the whole export.",
      "optionAudit": {
        "incremental": "At most current row and encoding are retained.",
        "fetch-all": "The complete input array remains retained.",
        "collect-lines": "The complete encoded output array grows.",
        "materialize-generator": "iterator_to_array stores every yielded row."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://www.php.net/manual/en/pdostatement.fetch.php",
      "https://www.php.net/manual/en/pdostatement.fetchall.php",
      "https://www.php.net/manual/en/function.iterator-to-array.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0296",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Errors & exceptions",
    "subtopic": "request-log-allowlist-boundary",
    "objective": {
      "id": "request-log-allowlist-boundary",
      "text": "Design request logging that excludes credentials even when new request fields are introduced."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Evaluate default inclusion versus default exclusion at a sensitive data boundary."
    },
    "prerequisites": [
      "Structured logging",
      "Request metadata",
      "Allowlist versus denylist"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "The service may receive passwords, cookies and bearer tokens in headers or bodies. Request schemas can gain new sensitive fields without a logging-code update. Logs need only a server-generated request ID, the validated HTTP method and a router-owned static route template. These three values contain no request credentials."
      ],
      "files": []
    },
    "stem": "Which logging policy meets that requirement as request schemas evolve?",
    "options": [
      {
        "id": "blacklist",
        "text": "Serialize the request after deleting password, Cookie and Authorization fields.",
        "rationale": "A newly introduced credential field will still be included by default.",
        "misconception": "Assuming a fixed list of current secret names covers future request schemas."
      },
      {
        "id": "digest",
        "text": "Serialize the request but replace every scalar value with its SHA-256 digest.",
        "rationale": "This still records credential-derived data and permits guessing low-entropy values.",
        "misconception": "Treating unsalted hashing of all request values as equivalent to excluding credentials."
      },
      {
        "id": "allowlist",
        "text": "Construct a log record from request ID, method and route template only.",
        "rationale": "Only the three explicitly permitted metadata values enter the log.",
        "misconception": null
      },
      {
        "id": "failure-only",
        "text": "Serialize full requests only when the response status is 400 or greater.",
        "rationale": "Failed authentication and validation requests can contain the same secrets.",
        "misconception": "Treating an error response as permission to log sensitive inputs."
      }
    ],
    "correctOptionId": "allowlist",
    "explanation": {
      "summary": "Building a separate metadata record prevents new request fields from entering logs automatically. A denylist must anticipate every new sensitive field, which the requirements explicitly do not allow.",
      "trace": "The logging input contains only the server-owned identifier and the two approved routing values; headers and bodies never cross that boundary."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Only the three specified nonsensitive metadata values are required; future request fields must be excluded by default.",
      "optionAudit": {
        "blacklist": "New sensitive fields remain included.",
        "digest": "Credential-derived values are still recorded and may be guessable.",
        "allowlist": "Only permitted metadata is constructed.",
        "failure-only": "Failure status does not remove secrets."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0297",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "PDO & database access",
    "subtopic": "append-only-keyset-pagination",
    "objective": {
      "id": "append-only-keyset-pagination",
      "text": "Continue descending pagination without duplicates when new rows are prepended."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Use a stable key boundary instead of a position that moves as records are inserted."
    },
    "prerequisites": [
      "SQL ORDER BY and WHERE",
      "Pagination cursors",
      "PDO parameters"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "An append-only table has unique increasing integer IDs; existing rows are never updated or deleted. Pages are ordered by id DESC. New inserts always have IDs greater than every existing ID. A client should continue through the rows present on its first page without repeats; newer rows can wait for a fresh traversal. All query parameters are safely bound."
      ],
      "files": []
    },
    "stem": "After a page ends at ID 120, which continuation rule remains correct if new rows are inserted before the next request?",
    "options": [
      {
        "id": "offset",
        "text": "Keep the same ORDER BY and use OFFSET equal to the number already returned.",
        "rationale": "New higher IDs shift old rows to later positions, so the offset can repeat them.",
        "misconception": "Assuming row positions remain fixed when rows are prepended."
      },
      {
        "id": "keyset",
        "text": "Use WHERE id < 120, ORDER BY id DESC, and the same page limit.",
        "rationale": "The strict boundary excludes the prior page and new higher IDs while preserving the remaining order.",
        "misconception": null
      },
      {
        "id": "inclusive",
        "text": "Use WHERE id <= 120, ORDER BY id DESC, and the same page limit.",
        "rationale": "The final row of the previous page is included again.",
        "misconception": "Using an inclusive cursor boundary when the cursor row has already been delivered."
      },
      {
        "id": "newest",
        "text": "Use WHERE id > 120, ORDER BY id DESC, and the same page limit.",
        "rationale": "This selects previously seen higher IDs and newer inserts instead of the remaining older rows.",
        "misconception": "Reversing the cursor direction for a descending traversal."
      }
    ],
    "correctOptionId": "keyset",
    "explanation": {
      "summary": "A cursor based on the last delivered immutable key is stable under the stated append-only model. Offset pagination tracks positions, which change when new high IDs appear.",
      "trace": "Every remaining old row has id below 120. Newly inserted rows have larger IDs, so they cannot enter the continuation query."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Unique immutable IDs ordered descending; new rows receive only higher IDs; continuation must exclude the delivered cursor row.",
      "optionAudit": {
        "offset": "Prepending shifts offsets and repeats old rows.",
        "keyset": "Strictly smaller IDs are exactly the remaining range.",
        "inclusive": "Repeats ID 120.",
        "newest": "Selects the wrong side of the cursor."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.sqlite.org/lang_select.html",
      "https://www.php.net/manual/en/pdo.prepare.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0298",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Validation & web security",
    "subtopic": "jwt-algorithm-policy-key-binding",
    "objective": {
      "id": "jwt-algorithm-policy-key-binding",
      "text": "Separate untrusted token metadata from the verifier’s trusted algorithm and key policy."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Analyze a verifier boundary where the attacker controls algorithm claims but must not control verification policy."
    },
    "prerequisites": [
      "JWT signature verification (advanced)",
      "Asymmetric versus symmetric keys",
      "Issuer and audience validation"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "A PHP API accepts JWTs from one configured issuer, using RS256 and a pinned RSA public key. A maintained JWT library supports many algorithms, including HS256. The token header is untrusted until verified. Issuer, audience and expiry checks are already mandatory; the question concerns signature configuration only."
      ],
      "files": []
    },
    "stem": "Which verifier configuration preserves the issuer’s signature policy?",
    "options": [
      {
        "id": "header-select",
        "text": "Select any library-supported algorithm from the token header and pass the pinned key.",
        "rationale": "The token would choose a verification mode outside the issuer policy, including a different key interpretation.",
        "misconception": "Equating library support with permission for this issuer."
      },
      {
        "id": "decode-first",
        "text": "Decode the payload; require the configured issuer before accepting the token as signed.",
        "rationale": "An unverified payload can claim the configured issuer without a valid signature.",
        "misconception": "Treating a signed-looking claim as evidence that its signature was checked."
      },
      {
        "id": "fixed-policy",
        "text": "Require RS256 and an RSA verification key bound to the configured issuer.",
        "rationale": "The trusted configuration controls the permitted algorithm and matching key type.",
        "misconception": null
      },
      {
        "id": "family",
        "text": "Allow RS256 or HS256 when the header names the same configured key ID.",
        "rationale": "A key ID does not authorize changing an RSA verification key into an HMAC secret.",
        "misconception": "Treating key identification as an algorithm authorization decision."
      }
    ],
    "correctOptionId": "fixed-policy",
    "explanation": {
      "summary": "The verifier must enforce a trusted algorithm allowlist and compatible keys for the issuer. Token metadata may identify a permitted configuration, but cannot expand that policy.",
      "trace": "A header requesting HS256 is rejected before it can cause reinterpretation of the pinned RSA key. Payload claim checks follow successful signature verification."
    },
    "validation": {
      "kind": "document-review",
      "rule": "RFC 8725 requires algorithm verification and appropriate key use; this issuer permits only RS256 with its pinned RSA verification key.",
      "optionAudit": {
        "header-select": "Lets an attacker expand the permitted algorithms.",
        "decode-first": "Does not verify the signature.",
        "fixed-policy": "Enforces the configured algorithm and key association.",
        "family": "Key ID equality does not make a different algorithm valid."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc8725.html#section-3.1"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0299",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Performance, processes & servers",
    "subtopic": "long-running-worker-code-replacement",
    "objective": {
      "id": "long-running-worker-code-replacement",
      "text": "Separate bytecode cache invalidation from replacing class definitions in a running worker."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Account for process lifetime, existing objects and safe job boundaries during code rollout."
    },
    "prerequisites": [
      "Long-running PHP CLI workers",
      "Class declaration lifetime",
      "OPcache"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "A worker loads Processor once, constructs one instance and handles many jobs in the same PHP process. A new release changes Processor methods without changing its fully qualified class name. No runtime class-patching extension is installed. In-flight jobs must finish on their original release; later jobs must use the new release. Immutable release directories are available."
      ],
      "files": []
    },
    "stem": "Which rollout mechanism satisfies those process-lifetime requirements?",
    "options": [
      {
        "id": "replace-workers",
        "text": "Drain old workers after their current jobs; start new workers from the new release.",
        "rationale": "Fresh processes load the new class definitions while old jobs finish with their existing code.",
        "misconception": null
      },
      {
        "id": "invalidate",
        "text": "Call opcache_invalidate for Processor.php and keep dispatching through the existing object.",
        "rationale": "Invalidating cached bytecode does not replace methods of an already loaded class or existing object.",
        "misconception": "Treating the bytecode cache as the running process’s mutable class table."
      },
      {
        "id": "require-again",
        "text": "Require the new Processor.php after each job in the same worker process.",
        "rationale": "Redeclaring the same class name is not a supported replacement mechanism.",
        "misconception": "Assuming require can overwrite an existing class declaration."
      },
      {
        "id": "reconstruct",
        "text": "Unset the Processor instance and instantiate Processor again in the same process.",
        "rationale": "The class definition remains loaded even after its instances are released.",
        "misconception": "Confusing object lifetime with class-definition lifetime."
      }
    ],
    "correctOptionId": "replace-workers",
    "explanation": {
      "summary": "A loaded class definition belongs to the running process. Replacing processes at job boundaries changes code without attempting to redefine classes underneath in-flight work.",
      "trace": "Old processes finish and exit. New processes load the new release’s Processor definition before constructing their instances."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Without a class-patching extension, loading the same fully qualified class again does not replace it; OPcache invalidation concerns cached script bytecode.",
      "optionAudit": {
        "replace-workers": "New process obtains new definitions at a safe boundary.",
        "invalidate": "Existing objects and loaded definitions are unchanged.",
        "require-again": "Attempts a duplicate class declaration.",
        "reconstruct": "Creates an object of the still-loaded old definition."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://www.php.net/manual/en/function.opcache-invalidate.php",
      "https://www.php.net/manual/en/language.oop5.basic.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0300",
    "revision": 3,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Files & structured data",
    "subtopic": "rename-stable-lock-identity",
    "objective": {
      "id": "rename-stable-lock-identity",
      "text": "Choose a lock identity that remains shared when data files are atomically replaced."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Trace coordination across pathname replacement and already-open file handles."
    },
    "prerequisites": [
      "flock advisory locking (advanced)",
      "Atomic rename",
      "Open file handles",
      "Read-modify-write critical sections"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "The writers run as separate PHP processes on one local POSIX filesystem with flock support. Same-directory rename atomically replaces a pathname. All writers cooperate and may create auxiliary files in the application-owned directory; no other process changes those files. All I/O succeeds, and crash durability is outside scope. Each update must read the latest committed state and serialize its entire read-modify-replace operation."
      ],
      "files": []
    },
    "stem": "Writers publish state.json by renaming a temporary file over it. Waiting writers may already have opened their chosen lock target. Which protocol keeps updates serialized across repeated publications?",
    "options": [
      {
        "id": "data-lock",
        "text": "Lock the opened state.json before reading it; write a temporary replacement, rename it over state.json, then unlock.",
        "rationale": "A waiter can retain an open handle to the old data file while another writer opens the replacement. Those handles no longer coordinate access to one lock target.",
        "misconception": "Assuming an acquired lock follows the data pathname when that pathname is replaced."
      },
      {
        "id": "release-before-publish",
        "text": "Open state.lock with c+, lock it, read and compute the next state, then unlock before writing and renaming the replacement.",
        "rationale": "The second writer can read the same committed state after unlock but before publication, so both updates can overwrite one another.",
        "misconception": "Protecting the read and computation while leaving publication outside the critical section."
      },
      {
        "id": "unlink-after-unlock",
        "text": "Open state.lock with c+, lock it through reading and replacement, then unlock and unlink state.lock after each update.",
        "rationale": "A waiting writer may acquire the old open lock file while a later writer creates and locks a new file at the same pathname. Cleanup splits coordination into two file objects.",
        "misconception": "Treating an unlocked lock file as safe to delete even when another writer already has it open."
      },
      {
        "id": "stable-lock",
        "text": "Open state.lock with c+, lock it before reading state.json, keep the lock through replacement, then unlock without unlinking state.lock.",
        "rationale": "Every writer contends on the same retained file, and the entire read-modify-replace operation occurs while that lock is held.",
        "misconception": null
      }
    ],
    "correctOptionId": "stable-lock",
    "explanation": {
      "summary": "The lock target must remain shared across publications and across waiting writers. Keeping a separate lock file in place and holding its lock through publication satisfies both requirements; deleting that file can recreate the identity problem.",
      "trace": "With the retained sidecar, B waits until A publishes, then reads A’s committed state. If the sidecar is unlinked, B may already hold the old file open while C creates a new sidecar and acquires an independent lock. Locking the replaceable data file has the same identity risk."
    },
    "validation": {
      "kind": "document-review",
      "rule": "On the stated local POSIX flock filesystem, locks refer to open files; rename/unlink can separate old open objects from later opens of the same pathname. Publication must remain within one shared critical section.",
      "optionAudit": {
        "data-lock": "A waiter on the old data object and a new opener of the replacement can acquire different locks.",
        "release-before-publish": "Schedule B’s read between A’s unlock and rename: B computes from stale state.",
        "unlink-after-unlock": "B opens the old sidecar before A unlocks/unlinks; C creates a new sidecar, permitting independent locks.",
        "stable-lock": "A and B share one retained sidecar and each publishes before releasing it."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 3
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/ref.filesystem.php",
      "https://www.php.net/manual/en/function.flock.php",
      "https://man7.org/linux/man-pages/man2/flock.2.html",
      "https://www.php.net/manual/en/function.rename.php"
    ]
  }
];
