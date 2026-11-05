// Accepted for local independent review only. Production activation is not authorized.
export default [
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0301",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Types, casting & comparisons",
    "subtopic": "octal-literal-decimal-numeric-string",
    "objective": {
      "id": "octal-literal-decimal-numeric-string",
      "text": "Distinguish an octal source literal from a decimal numeric string in arithmetic."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply two different numeric interpretation rules to visibly similar text."
    },
    "prerequisites": [
      "Integer literals",
      "Numeric strings",
      "Addition"
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
          "source": "<?php\n\n$literal = 010;\n$text = '010';\n\necho json_encode([$literal, $text + 1]);\n"
        }
      ]
    },
    "stem": "What JSON pair is printed? The first value is a source-code integer literal; the second is a quoted string.",
    "options": [
      {
        "id": "decimal",
        "text": "[10,11]",
        "rationale": "The leading zero on the source literal denotes octal, so it is not decimal 10.",
        "misconception": "Treating leading-zero integer literals as ordinary decimal integers."
      },
      {
        "id": "both-octal",
        "text": "[8,9]",
        "rationale": "A numeric string used in arithmetic is not parsed as an octal source literal.",
        "misconception": "Applying source-literal base notation to a runtime decimal string."
      },
      {
        "id": "different",
        "text": "[8,11]",
        "rationale": "010 is octal eight; numeric string 010 has decimal value ten before addition.",
        "misconception": null
      },
      {
        "id": "text",
        "text": "[8,\"0101\"]",
        "rationale": "The + operator performs numeric addition, not string concatenation.",
        "misconception": "Assuming a quoted operand makes + concatenate."
      }
    ],
    "correctOptionId": "different",
    "explanation": {
      "summary": "PHP source literals with a leading zero use octal notation. Numeric strings in arithmetic follow decimal numeric-string rules instead.",
      "trace": "The literal is 8. The string contributes decimal 10 to addition, producing integer 11."
    },
    "validation": {
      "kind": "output",
      "stdout": "[8,11]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.integer.php",
      "https://www.php.net/manual/en/language.types.numeric-strings.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0302",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Operators & expressions",
    "subtopic": "coalescing-assignment-once-side-effect",
    "objective": {
      "id": "coalescing-assignment-once-side-effect",
      "text": "Trace conditional assignment and whether its right-hand expression runs."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Follow state across repeated coalescing assignments with a visible side-effect counter."
    },
    "prerequisites": [
      "Null coalescing assignment",
      "Pre-increment",
      "Array entries"
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
          "source": "<?php\n\n$values = ['ready' => false, 'count' => null];\n$calls = 0;\n\n$values['ready'] ??= ++$calls;\n$values['count'] ??= ++$calls;\n$values['count'] ??= ++$calls;\n\necho json_encode([$values, $calls]);\n"
        }
      ]
    },
    "stem": "What JSON is printed after these three coalescing assignments?",
    "options": [
      {
        "id": "conditional",
        "text": "[{\"ready\":false,\"count\":1},1]",
        "rationale": "false is retained, null triggers one assignment, and the now-nonnull count skips the later increment.",
        "misconception": null
      },
      {
        "id": "falsey",
        "text": "[{\"ready\":1,\"count\":2},2]",
        "rationale": "Coalescing assignment does not replace a nonnull false value.",
        "misconception": "Treating ??= as assignment for every falsey value."
      },
      {
        "id": "eager",
        "text": "[{\"ready\":false,\"count\":2},3]",
        "rationale": "The right-hand increments are skipped when their left-hand entries are already nonnull.",
        "misconception": "Evaluating the right side before deciding whether assignment is needed."
      },
      {
        "id": "overwrite",
        "text": "[{\"ready\":false,\"count\":2},2]",
        "rationale": "The third statement preserves count=1 rather than assigning another increment.",
        "misconception": "Assuming an existing integer remains eligible for repeated coalescing assignment."
      }
    ],
    "correctOptionId": "conditional",
    "explanation": {
      "summary": "??= evaluates and assigns its right side only when the left side is missing or null. The assignment changes eligibility for subsequent statements.",
      "trace": "ready remains false. The first count assignment increments calls to 1; the later count assignment does nothing."
    },
    "validation": {
      "kind": "output",
      "stdout": "[{\"ready\":false,\"count\":1},1]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.assignment.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0303",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Control flow & pattern matching",
    "subtopic": "continue-outer-loop-level",
    "objective": {
      "id": "continue-outer-loop-level",
      "text": "Trace continue 2 across nested foreach loops."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Identify which remaining statements are skipped at each nesting level."
    },
    "prerequisites": [
      "Nested foreach",
      "continue with a level argument"
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
          "source": "<?php\n\nforeach ([1, 2] as $row) {\n    foreach (['a', 'b'] as $column) {\n        echo $row . $column;\n\n        if ($column === 'a') {\n            continue 2;\n        }\n    }\n\n    echo '|';\n}\n\necho 'done';\n"
        }
      ]
    },
    "stem": "What exact text is printed? continue 2 targets two enclosing loops.",
    "options": [
      {
        "id": "inner-only",
        "text": "1a1b|2a2b|done",
        "rationale": "That would continue only the inner loop and then execute the row footer.",
        "misconception": "Treating the level argument as if it were the default one."
      },
      {
        "id": "exit-all",
        "text": "1adone",
        "rationale": "continue advances the outer loop rather than terminating it.",
        "misconception": "Confusing continue 2 with break 2."
      },
      {
        "id": "footer",
        "text": "1a|2a|done",
        "rationale": "The outer-loop footer is skipped along with the rest of the current iteration.",
        "misconception": "Assuming an outer continue still executes the statements after the inner loop."
      },
      {
        "id": "outer",
        "text": "1a2adone",
        "rationale": "Each a entry continues the next outer iteration, skipping b and the footer.",
        "misconception": null
      }
    ],
    "correctOptionId": "outer",
    "explanation": {
      "summary": "continue 2 skips the remainder of the current outer iteration and advances that loop. It does not break out of both loops.",
      "trace": "Row 1 prints 1a and advances to row 2; row 2 prints 2a and finishes the loop. The final done is outside both loops."
    },
    "validation": {
      "kind": "output",
      "stdout": "1a2adone",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-06"
    },
    "references": [
      "https://www.php.net/manual/en/control-structures.continue.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0304",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "array-flip-duplicate-value-collision",
    "objective": {
      "id": "array-flip-duplicate-value-collision",
      "text": "Predict collision handling when array values become keys."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Recognize that the inverted mapping cannot retain two entries with the same resulting key."
    },
    "prerequisites": [
      "Associative arrays",
      "array_flip",
      "Unique array keys"
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
          "source": "<?php\n\n$roles = ['ada' => 'editor', 'lin' => 'reader', 'sam' => 'editor'];\n\necho json_encode(array_flip($roles));\n"
        }
      ]
    },
    "stem": "What JSON object is printed after the inversion?",
    "options": [
      {
        "id": "first",
        "text": "{\"editor\":\"ada\",\"reader\":\"lin\"}",
        "rationale": "The later source entry overwrites the earlier value for the same flipped key.",
        "misconception": "Assuming first occurrence wins when array_flip produces duplicate keys."
      },
      {
        "id": "last",
        "text": "{\"editor\":\"sam\",\"reader\":\"lin\"}",
        "rationale": "Both editor values become the same key, whose final value is the last source key sam.",
        "misconception": null
      },
      {
        "id": "grouped",
        "text": "{\"editor\":[\"ada\",\"sam\"],\"reader\":[\"lin\"]}",
        "rationale": "array_flip does not group all original keys into lists.",
        "misconception": "Treating inversion as a grouping operation."
      },
      {
        "id": "unchanged",
        "text": "{\"ada\":\"editor\",\"lin\":\"reader\",\"sam\":\"editor\"}",
        "rationale": "The function returns the inverted mapping, not the original input.",
        "misconception": "Assuming array_flip only mutates by reference and returns its input."
      }
    ],
    "correctOptionId": "last",
    "explanation": {
      "summary": "Array keys are unique. When several original values become one flipped key, the last corresponding original key becomes its value.",
      "trace": "editor is first assigned ada, reader is assigned lin, and editor is then replaced with sam."
    },
    "validation": {
      "kind": "output",
      "stdout": "{\"editor\":\"sam\",\"reader\":\"lin\"}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-flip.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0305",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Types, casting & comparisons",
    "subtopic": "division-result-type-exactness",
    "objective": {
      "id": "division-result-type-exactness",
      "text": "Distinguish exact integer division results from fractional division results under the slash operator."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Observe both value and runtime type rather than assuming every division has one fixed type."
    },
    "prerequisites": [
      "Division operator",
      "get_debug_type",
      "Integers and floats"
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
          "source": "<?php\n\n$exact = 6 / 3;\n$fractional = 7 / 2;\n\necho json_encode([\n    [get_debug_type($exact), $exact],\n    [get_debug_type($fractional), $fractional],\n]);\n"
        }
      ]
    },
    "stem": "What JSON is printed for these two divisions?",
    "options": [
      {
        "id": "float-both",
        "text": "[[\"float\",2],[\"float\",3.5]]",
        "rationale": "With integer operands and an exact quotient, PHP returns an integer for 6 / 3.",
        "misconception": "Assuming slash always returns a float as in some other languages."
      },
      {
        "id": "truncate",
        "text": "[[\"int\",2],[\"int\",3]]",
        "rationale": "The slash operator does not truncate a fractional quotient.",
        "misconception": "Applying intdiv behavior to ordinary division."
      },
      {
        "id": "mixed",
        "text": "[[\"int\",2],[\"float\",3.5]]",
        "rationale": "The exact division is integer 2; the nonintegral quotient is float 3.5.",
        "misconception": null
      },
      {
        "id": "reverse",
        "text": "[[\"float\",2],[\"int\",3]]",
        "rationale": "Neither the exact-division type nor the fractional-division result follows that rule.",
        "misconception": "Assuming exact results are promoted while fractional results are truncated."
      }
    ],
    "correctOptionId": "mixed",
    "explanation": {
      "summary": "With integer operands, PHP / returns an integer when the division is exact and a float otherwise. This differs from explicitly truncating division with intdiv.",
      "trace": "6 divides evenly by 3, yielding int 2. 7 divided by 2 yields float 3.5."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[\"int\",2],[\"float\",3.5]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.arithmetic.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0306",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Operators & expressions",
    "subtopic": "logical-short-circuit-side-effects",
    "objective": {
      "id": "logical-short-circuit-side-effects",
      "text": "Trace which operands of boolean operators are evaluated."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Count visible effects rather than evaluating every operand eagerly."
    },
    "prerequisites": [
      "Boolean AND and OR",
      "Short-circuit evaluation",
      "Pre-increment"
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
          "source": "<?php\n\n$calls = 0;\n$left = (false && ++$calls);\n$right = (true || ++$calls);\n$last = (true && ++$calls);\n\necho json_encode([$left, $right, $calls]);\n"
        }
      ]
    },
    "stem": "What JSON triple is printed? Parentheses make the assignments independent of logical-operator precedence.",
    "options": [
      {
        "id": "eager",
        "text": "[false,true,3]",
        "rationale": "The first two right-hand operands are not needed and are skipped.",
        "misconception": "Evaluating both sides of every boolean expression."
      },
      {
        "id": "one",
        "text": "[false,true,1]",
        "rationale": "Only the last expression needs its increment to determine the result.",
        "misconception": null
      },
      {
        "id": "none",
        "text": "[false,true,0]",
        "rationale": "true && still needs its right-hand operand.",
        "misconception": "Assuming a true left operand short-circuits AND as well as OR."
      },
      {
        "id": "two",
        "text": "[false,true,2]",
        "rationale": "Neither false && nor true || evaluates its right-hand increment.",
        "misconception": "Applying short-circuit behavior to only one of the two operators."
      }
    ],
    "correctOptionId": "one",
    "explanation": {
      "summary": "AND skips its right operand when the left is false; OR skips it when the left is true. The last AND must evaluate its right operand.",
      "trace": "The first two assignments leave calls at zero. The third increments it to one and produces a truthy boolean result."
    },
    "validation": {
      "kind": "output",
      "stdout": "[false,true,1]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.logical.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0307",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Closures, callbacks & callables",
    "subtopic": "value-capture-local-update-per-call",
    "objective": {
      "id": "value-capture-local-update-per-call",
      "text": "Predict local updates to a value-captured scalar across repeated closure calls."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate the captured starting value, each invocation’s local update and the outer variable."
    },
    "prerequisites": [
      "Anonymous functions",
      "Capture by value",
      "Prefix increment"
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
          "source": "<?php\n\n$count = 1;\n$next = function () use ($count): int {\n    return ++$count;\n};\n\n$first = $next();\n$second = $next();\n\necho json_encode([$first, $second, $count]);\n"
        }
      ]
    },
    "stem": "What JSON describes the two callback results and the outer count?",
    "options": [
      {
        "id": "persistent",
        "text": "[2,3,1]",
        "rationale": "The locally changed value is not retained as a static counter for the next invocation.",
        "misconception": "Treating a value-captured scalar as persistent mutable local storage."
      },
      {
        "id": "shared",
        "text": "[2,3,3]",
        "rationale": "The closure does not capture count by reference, so it cannot update the outer count.",
        "misconception": "Treating use by value as a shared variable binding."
      },
      {
        "id": "per-call",
        "text": "[2,2,1]",
        "rationale": "Each invocation increments its local copy of the captured starting value 1; the outer count stays 1.",
        "misconception": null
      },
      {
        "id": "before-increment",
        "text": "[1,1,1]",
        "rationale": "Prefix increment returns the incremented value, not the original value.",
        "misconception": "Confusing prefix increment with postfix increment."
      }
    ],
    "correctOptionId": "per-call",
    "explanation": {
      "summary": "A value-captured scalar is available as a local value on each invocation. Incrementing it locally does not turn it into a static variable or write through to the outer variable.",
      "trace": "Both invocations start with captured count 1 and return 2. The separate outer count remains 1."
    },
    "validation": {
      "kind": "output",
      "stdout": "[2,2,1]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/functions.anonymous.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0308",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "nested-array-value-copy",
    "objective": {
      "id": "nested-array-value-copy",
      "text": "Trace ordinary nested-array assignment without explicit references or objects."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply array value semantics through a nested update and a new appended entry."
    },
    "prerequisites": [
      "PHP array assignment",
      "Nested arrays",
      "Array append"
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
          "source": "<?php\n\n$original = ['counts' => [1, 2]];\n$copy = $original;\n$copy['counts'][0] = 9;\n$copy['counts'][] = 3;\n\necho json_encode([$original['counts'], $copy['counts']]);\n"
        }
      ]
    },
    "stem": "What JSON pair is printed? These arrays contain only arrays and integers; no references or objects are involved.",
    "options": [
      {
        "id": "values",
        "text": "[[1,2],[9,2,3]]",
        "rationale": "The nested mutations affect the copied array value, leaving the original unchanged.",
        "misconception": null
      },
      {
        "id": "shared",
        "text": "[[9,2,3],[9,2,3]]",
        "rationale": "Ordinary array assignment does not create an explicit reference between variables.",
        "misconception": "Applying object-handle sharing to plain arrays."
      },
      {
        "id": "inner-shared",
        "text": "[[9,2],[9,2,3]]",
        "rationale": "The nested array is also governed by value semantics here.",
        "misconception": "Assuming only the outer array is copied while nested arrays share mutable identity."
      },
      {
        "id": "discarded",
        "text": "[[1,2],[1,2]]",
        "rationale": "The copy is mutable, and its updates are not discarded.",
        "misconception": "Treating copied values as immutable snapshots that reject later mutation."
      }
    ],
    "correctOptionId": "values",
    "explanation": {
      "summary": "PHP arrays have value semantics, including nested arrays without embedded references or objects. Copy-on-write is an optimization that preserves these observable semantics.",
      "trace": "original keeps [1,2]. Updating and appending through copy yields [9,2,3] only in that variable."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[1,2],[9,2,3]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.array.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0309",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Syntax & execution model",
    "subtopic": "heredoc-nowdoc-indentation-interpolation",
    "objective": {
      "id": "heredoc-nowdoc-indentation-interpolation",
      "text": "Trace interpolation and indentation stripping in flexible heredoc and nowdoc strings."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine the closing-marker indentation rule with different interpolation behavior."
    },
    "prerequisites": [
      "Heredoc and nowdoc",
      "Variable interpolation",
      "PHP 7.3+ flexible string indentation"
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
          "source": "<?php\n\n$name = 'Ada';\n\n$expanded = <<<TEXT\n    Hello $name\n    TEXT;\n\n$literal = <<<'TEXT'\n    Hello $name\n    TEXT;\n\necho json_encode([$expanded, $literal]);\n"
        }
      ]
    },
    "stem": "What JSON pair is printed? Each content line and closing marker has exactly four leading spaces in the source.",
    "options": [
      {
        "id": "both-expand",
        "text": "[\"Hello Ada\",\"Hello Ada\"]",
        "rationale": "Nowdoc does not interpolate its variable-looking text.",
        "misconception": "Treating nowdoc as another spelling of interpolating heredoc."
      },
      {
        "id": "spaces",
        "text": "[\"    Hello Ada\",\"    Hello $name\"]",
        "rationale": "The shared indentation matching the closing markers is stripped.",
        "misconception": "Assuming all source indentation becomes part of the string."
      },
      {
        "id": "different",
        "text": "[\"Hello Ada\",\"Hello $name\"]",
        "rationale": "Both strings lose the four-space indentation, but only heredoc expands name.",
        "misconception": null
      },
      {
        "id": "both-literal",
        "text": "[\"Hello $name\",\"Hello $name\"]",
        "rationale": "Heredoc processes the variable interpolation.",
        "misconception": "Applying nowdoc literal behavior to both string forms."
      }
    ],
    "correctOptionId": "different",
    "explanation": {
      "summary": "Flexible heredoc/nowdoc closing-marker indentation strips matching leading indentation. Heredoc then interpolates like a double-quoted string; nowdoc remains literal.",
      "trace": "The content contains no leading spaces or terminal newline in these values. The first name expands to Ada and the second remains $name."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"Hello Ada\",\"Hello $name\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-01"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.string.php#language.types.string.syntax.heredoc"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0310",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Operators & expressions",
    "subtopic": "short-ternary-evaluation-count",
    "objective": {
      "id": "short-ternary-evaluation-count",
      "text": "Distinguish the shorthand ternary’s reused condition value from an explicit second function call."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track a stateful function across expressions with superficially similar ternary syntax."
    },
    "prerequisites": [
      "Ternary operator",
      "Static local variables",
      "Function side effects"
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
          "source": "<?php\n\nfunction nextNumber(): int\n{\n    static $number = 0;\n\n    return ++$number;\n}\n\n$short = nextNumber() ?: 99;\n$full = nextNumber() ? nextNumber() : 99;\n\necho json_encode([$short, $full, nextNumber()]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? nextNumber always returns a positive integer, so neither fallback value is selected.",
    "options": [
      {
        "id": "both-once",
        "text": "[1,2,3]",
        "rationale": "The full ternary contains a second call in its selected true branch.",
        "misconception": "Treating repeated source expressions as automatically reused values."
      },
      {
        "id": "different",
        "text": "[1,3,4]",
        "rationale": "The shorthand uses its first result; the full form calls once for its condition and again for its result.",
        "misconception": null
      },
      {
        "id": "both-twice",
        "text": "[2,4,5]",
        "rationale": "The shorthand does not evaluate its condition a second time.",
        "misconception": "Expanding ?: into a duplicated evaluation rather than a reused value."
      },
      {
        "id": "no-state",
        "text": "[1,1,1]",
        "rationale": "The static local persists across calls in the same process.",
        "misconception": "Assuming the local initializer runs on every invocation."
      }
    ],
    "correctOptionId": "different",
    "explanation": {
      "summary": "The shorthand ternary evaluates its left expression once and returns that value when truthy. A full ternary can explicitly perform a different evaluation in the selected branch.",
      "trace": "The shorthand consumes 1. The full condition consumes 2 and its true branch returns 3. The final call returns 4."
    },
    "validation": {
      "kind": "output",
      "stdout": "[1,3,4]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.comparison.php#language.operators.comparison.ternary"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0311",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "debug-info-versus-json-representation",
    "objective": {
      "id": "debug-info-versus-json-representation",
      "text": "Distinguish a diagnostic display hook from JSON serialization policy."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace two consumers of the same object that use different representation mechanisms."
    },
    "prerequisites": [
      "__debugInfo",
      "var_dump",
      "JSON encoding of public properties"
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
          "source": "<?php\n\nclass CredentialView\n{\n    public string $token = 'dummy-secret';\n\n    public function __debugInfo(): array\n    {\n        return ['token' => '[redacted]'];\n    }\n}\n\n$value = new CredentialView();\nob_start();\nvar_dump($value);\n$debug = ob_get_clean();\n$json = json_encode($value);\n\necho json_encode([\n    str_contains($debug, 'dummy-secret'),\n    str_contains($json, 'dummy-secret'),\n]);\n"
        }
      ]
    },
    "stem": "What JSON pair is printed? The token is a fixed dummy fixture, and no log or network request is made.",
    "options": [
      {
        "id": "both-hidden",
        "text": "[false,false]",
        "rationale": "__debugInfo customizes var_dump, not the default JSON representation.",
        "misconception": "Assuming one display hook redacts every serialization channel."
      },
      {
        "id": "both-visible",
        "text": "[true,true]",
        "rationale": "var_dump uses the shown debug hook, which returns the redacted value.",
        "misconception": "Ignoring the diagnostic hook when inspecting objects."
      },
      {
        "id": "opposite",
        "text": "[true,false]",
        "rationale": "The hook applies to the diagnostic dump rather than JSON encoding.",
        "misconception": "Reversing the consumers governed by __debugInfo."
      },
      {
        "id": "different",
        "text": "[false,true]",
        "rationale": "The dump is redacted, while JSON includes the public token property.",
        "misconception": null
      }
    ],
    "correctOptionId": "different",
    "explanation": {
      "summary": "__debugInfo supplies properties for diagnostic dumping. JSON encoding without JsonSerializable follows its own public-property representation and does not consult that hook.",
      "trace": "The captured dump contains [redacted]. The JSON string contains the public token value dummy-secret."
    },
    "validation": {
      "kind": "output",
      "stdout": "[false,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.magic.php#object.debuginfo",
      "https://www.php.net/manual/en/function.json-encode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0312",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Errors & exceptions",
    "subtopic": "stringification-throw-expression-output",
    "objective": {
      "id": "stringification-throw-expression-output",
      "text": "Trace a throwing string conversion before an echo expression is completed."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate side effects during expression evaluation from output of the completed expression."
    },
    "prerequisites": [
      "__toString",
      "Concatenation",
      "Exception propagation",
      "echo"
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
          "source": "<?php\n\nclass BrokenLabel\n{\n    public function __toString(): string\n    {\n        echo 'convert|';\n\n        throw new RuntimeException('unavailable');\n    }\n}\n\necho 'before|';\n\ntry {\n    echo 'label=' . new BrokenLabel();\n} catch (RuntimeException $failure) {\n    echo 'caught';\n}\n"
        }
      ]
    },
    "stem": "What exact text is printed when constructing the concatenated echo argument fails?",
    "options": [
      {
        "id": "evaluated",
        "text": "before|convert|caught",
        "rationale": "The conversion emits its own side effect, then throws before the concatenated echo value exists.",
        "misconception": null
      },
      {
        "id": "partial",
        "text": "before|label=convert|caught",
        "rationale": "The concatenated expression must be evaluated before echo prints it.",
        "misconception": "Treating concatenation as a sequence of separately emitted echo arguments."
      },
      {
        "id": "silent",
        "text": "before|caught",
        "rationale": "The side effect inside __toString occurs before the exception.",
        "misconception": "Assuming a failed expression rolls back output already produced by a function."
      },
      {
        "id": "uncaught",
        "text": "before|convert| followed by an uncaught Error",
        "rationale": "On these PHP versions, an exception thrown by __toString can be caught normally.",
        "misconception": "Applying obsolete restrictions on exceptions during string conversion."
      }
    ],
    "correctOptionId": "evaluated",
    "explanation": {
      "summary": "A failed expression has no completed value for its enclosing echo, but side effects performed while evaluating it remain. PHP 8 permits exceptions from __toString.",
      "trace": "before is printed first. Conversion prints convert, throws RuntimeException, and the catch prints caught. The label prefix was never emitted."
    },
    "validation": {
      "kind": "output",
      "stdout": "before|convert|caught",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.magic.php#object.tostring",
      "https://www.php.net/manual/en/function.echo.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0313",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "variadic-reference-unpacked-array-mutation",
    "objective": {
      "id": "variadic-reference-unpacked-array-mutation",
      "text": "Trace by-reference variadic parameters when arguments come from array unpacking."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Follow the reference bindings from unpacked array elements through a variadic parameter array."
    },
    "prerequisites": [
      "Variadic parameters",
      "Reference parameters",
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
          "source": "<?php\n\nfunction increase(int &...$values): void\n{\n    foreach ($values as &$value) {\n        $value += 10;\n    }\n\n    unset($value);\n}\n\n$numbers = [1, 2];\nincrease(...$numbers);\n\necho json_encode($numbers);\n"
        }
      ]
    },
    "stem": "What JSON is printed after the call? The loop reference is explicitly cleared at the end of the function.",
    "options": [
      {
        "id": "copies",
        "text": "[1,2]",
        "rationale": "Unpacking an array into reference parameters binds its elements for this call.",
        "misconception": "Assuming argument unpacking always copies values even for reference parameters."
      },
      {
        "id": "referenced",
        "text": "[11,12]",
        "rationale": "Each variadic reference is bound to the corresponding source array element.",
        "misconception": null
      },
      {
        "id": "last-only",
        "text": "[1,12]",
        "rationale": "The loop visits and updates both reference-bound elements.",
        "misconception": "Assuming only the last variadic element can remain bound to its argument."
      },
      {
        "id": "shared",
        "text": "[12,12]",
        "rationale": "The two arguments refer to distinct array elements, not one shared variable.",
        "misconception": "Confusing separate reference parameters with aliases of a single storage slot."
      }
    ],
    "correctOptionId": "referenced",
    "explanation": {
      "summary": "The & before the variadic parameter makes each supplied argument a reference parameter. Array unpacking can bind those parameters to the original array elements.",
      "trace": "The first element is incremented from 1 to 11 and the second from 2 to 12. Clearing the local loop reference does not undo those writes."
    },
    "validation": {
      "kind": "output",
      "stdout": "[11,12]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/functions.arguments.php#functions.variable-arg-list"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0314",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "strtok-shared-parser-state",
    "objective": {
      "id": "strtok-shared-parser-state",
      "text": "Track the shared continuation state of interleaved strtok calls."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Recognize that a second initial call replaces the continuation source used by the first parser."
    },
    "prerequisites": [
      "strtok initial and continuation forms",
      "Function-level parsing state"
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
          "source": "<?php\n\n$first = strtok('red,green', ',');\n$other = strtok('up:down', ':');\n$next = strtok(',');\n$last = strtok(':');\n\necho json_encode([$first, $other, $next, $last]);\n"
        }
      ]
    },
    "stem": "What JSON array is printed?",
    "options": [
      {
        "id": "independent",
        "text": "[\"red\",\"up\",\"green\",\"down\"]",
        "rationale": "strtok does not maintain a separate continuation cursor for each delimiter or caller.",
        "misconception": "Assuming delimiter choice identifies an independent parser session."
      },
      {
        "id": "restart",
        "text": "[\"red\",\"up\",\"up:down\",false]",
        "rationale": "The second initial call has already consumed up and its separator.",
        "misconception": "Assuming continuation restarts from the beginning of the most recent string."
      },
      {
        "id": "shared",
        "text": "[\"red\",\"up\",\"down\",false]",
        "rationale": "The up:down initialization replaces the earlier state; the next call consumes its remaining down.",
        "misconception": null
      },
      {
        "id": "delimiter-cache",
        "text": "[\"red\",\"up\",false,\"down\"]",
        "rationale": "A continuation may use a new delimiter and still reads the remaining source.",
        "misconception": "Assuming a changed delimiter rejects or pauses the stored sequence."
      }
    ],
    "correctOptionId": "shared",
    "explanation": {
      "summary": "strtok stores one continuation position for its active string. A new two-argument call resets that state; subsequent one-argument calls do not know about the earlier string.",
      "trace": "The second initialization consumes up. The comma continuation sees the remaining down as one token, leaving no token for the final call."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"red\",\"up\",\"down\",false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.strtok.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0315",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "sscanf-partial-conversion-results",
    "objective": {
      "id": "sscanf-partial-conversion-results",
      "text": "Distinguish partial formatted scanning from validation of an entire input record."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track successful and failed conversions within one format without assuming all-or-nothing parsing."
    },
    "prerequisites": [
      "sscanf",
      "Integer conversion formats",
      "Partial format matching"
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
          "source": "<?php\n\n$parts = sscanf('12:xx', '%d:%d');\n\necho json_encode($parts);\n"
        }
      ]
    },
    "stem": "What JSON is printed by the array-returning form of sscanf for this partial match?",
    "options": [
      {
        "id": "zero",
        "text": "[12,0]",
        "rationale": "A failed conversion does not synthesize integer zero.",
        "misconception": "Treating an unparsed integer as a numeric zero value."
      },
      {
        "id": "all-fail",
        "text": "null",
        "rationale": "The first integer conversion succeeds and remains in the returned array.",
        "misconception": "Assuming one failed field invalidates every earlier conversion."
      },
      {
        "id": "strings",
        "text": "[\"12\",\"xx\"]",
        "rationale": "%d requests integer conversion rather than delimiter-based string splitting.",
        "misconception": "Treating sscanf as an explode-like text splitter."
      },
      {
        "id": "partial",
        "text": "[12,null]",
        "rationale": "The first conversion returns 12 and the unassigned second conversion remains null.",
        "misconception": null
      }
    ],
    "correctOptionId": "partial",
    "explanation": {
      "summary": "The array-returning form reports the values assigned by the format. A failed later conversion can leave a null entry even after earlier fields were parsed.",
      "trace": "%d consumes 12, the literal colon matches, and the next %d cannot parse xx. This is not proof that the entire record is valid."
    },
    "validation": {
      "kind": "output",
      "stdout": "[12,null]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.sscanf.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0316",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Iterators, generators & fibers",
    "subtopic": "date-period-explicit-boundaries",
    "objective": {
      "id": "date-period-explicit-boundaries",
      "text": "Apply DatePeriod start and end inclusion flags to a daily iteration."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine interval stepping with two independently configured endpoint rules."
    },
    "prerequisites": [
      "DatePeriod",
      "DateInterval",
      "UTC dates",
      "Bitwise flag combination"
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
          "source": "<?php\n\n$period = new DatePeriod(\n    new DateTimeImmutable('2025-01-01'),\n    new DateInterval('P1D'),\n    new DateTimeImmutable('2025-01-03'),\n    DatePeriod::EXCLUDE_START_DATE | DatePeriod::INCLUDE_END_DATE\n);\n\n$days = [];\n\nforeach ($period as $day) {\n    $days[] = $day->format('Y-m-d');\n}\n\necho json_encode($days);\n"
        }
      ]
    },
    "stem": "Which JSON list is produced by the period? All timestamps are midnight UTC.",
    "options": [
      {
        "id": "defaults",
        "text": "[\"2025-01-01\",\"2025-01-02\"]",
        "rationale": "Those are the default inclusive-start, exclusive-end boundaries, which the flags change.",
        "misconception": "Ignoring the explicitly configured endpoint options."
      },
      {
        "id": "neither",
        "text": "[\"2025-01-02\"]",
        "rationale": "INCLUDE_END_DATE adds the matching endpoint January 3.",
        "misconception": "Applying only the start-exclusion flag."
      },
      {
        "id": "configured",
        "text": "[\"2025-01-02\",\"2025-01-03\"]",
        "rationale": "January 1 is excluded and January 3 is included, with one-day steps.",
        "misconception": null
      },
      {
        "id": "both",
        "text": "[\"2025-01-01\",\"2025-01-02\",\"2025-01-03\"]",
        "rationale": "EXCLUDE_START_DATE removes January 1.",
        "misconception": "Applying only the end-inclusion flag."
      }
    ],
    "correctOptionId": "configured",
    "explanation": {
      "summary": "The options independently control inclusion of the initial date and a date that lands exactly on the endpoint. The displayed flags exclude the first and include the last.",
      "trace": "The daily steps are January 1, 2 and 3. Filtering the boundaries leaves January 2 and 3."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"2025-01-02\",\"2025-01-03\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/dateperiod.construct.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0317",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Iterators, generators & fibers",
    "subtopic": "priority-queue-destructive-iteration",
    "objective": {
      "id": "priority-queue-destructive-iteration",
      "text": "Trace maximum-priority extraction and the consuming nature of SplPriorityQueue iteration."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Observe both order and the collection state after traversal."
    },
    "prerequisites": [
      "SplPriorityQueue",
      "Unique numeric priorities",
      "Iterator consumption"
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
          "source": "<?php\n\n$queue = new SplPriorityQueue();\n$queue->insert('routine', 1);\n$queue->insert('urgent', 9);\n$queue->insert('normal', 4);\n\n$seen = [];\n\nforeach ($queue as $value) {\n    $seen[] = $value;\n}\n\necho json_encode([$seen, $queue->count()]);\n"
        }
      ]
    },
    "stem": "What JSON is printed after foreach finishes? Priorities are unique, so no equal-priority ordering rule is needed.",
    "options": [
      {
        "id": "max-consuming",
        "text": "[[\"urgent\",\"normal\",\"routine\"],0]",
        "rationale": "Higher priorities are extracted first, and iteration removes every visited entry.",
        "misconception": null
      },
      {
        "id": "min-consuming",
        "text": "[[\"routine\",\"normal\",\"urgent\"],0]",
        "rationale": "SplPriorityQueue is a maximum-priority heap, not a minimum-priority queue.",
        "misconception": "Assuming smaller numeric priorities are processed first by this class."
      },
      {
        "id": "max-retained",
        "text": "[[\"urgent\",\"normal\",\"routine\"],3]",
        "rationale": "Iteration extracts entries rather than preserving the original heap contents.",
        "misconception": "Assuming every foreach traversal leaves its iterable unchanged."
      },
      {
        "id": "insertion",
        "text": "[[\"routine\",\"urgent\",\"normal\"],3]",
        "rationale": "Neither insertion order nor retained contents matches the queue’s iteration behavior.",
        "misconception": "Treating a priority queue as an ordinary insertion-ordered array."
      }
    ],
    "correctOptionId": "max-consuming",
    "explanation": {
      "summary": "SplPriorityQueue yields data in descending priority order by default. Its iterator extracts elements, so a completed traversal empties the queue.",
      "trace": "Priorities 9, 4 and 1 yield urgent, normal and routine. Three extractions leave count zero."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[\"urgent\",\"normal\",\"routine\"],0]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/class.splpriorityqueue.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0318",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "magic-call-inaccessible-method-scope",
    "objective": {
      "id": "magic-call-inaccessible-method-scope",
      "text": "Trace magic dispatch for an inaccessible method separately from an in-class call."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "The same method name resolves differently according to the caller’s visibility scope."
    },
    "prerequisites": [
      "Private method visibility",
      "__call",
      "Instance method calls"
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
          "source": "<?php\n\nclass Runner\n{\n    private function run(): string\n    {\n        return 'real';\n    }\n\n    public function inside(): string\n    {\n        return $this->run();\n    }\n\n    public function __call(string $name, array $arguments): string\n    {\n        return 'magic:' . $name;\n    }\n}\n\n$runner = new Runner();\n\necho json_encode([$runner->run(), $runner->inside()]);\n"
        }
      ]
    },
    "stem": "What JSON pair is printed for the external call and the call made inside the object?",
    "options": [
      {
        "id": "both-real",
        "text": "[\"real\",\"real\"]",
        "rationale": "The external caller cannot directly invoke the private declaration.",
        "misconception": "Assuming a method’s existence makes its visibility irrelevant."
      },
      {
        "id": "both-magic",
        "text": "[\"magic:run\",\"magic:run\"]",
        "rationale": "The in-class call has access to the private method and needs no magic fallback.",
        "misconception": "Treating __call as an interceptor for every method invocation."
      },
      {
        "id": "error",
        "text": "An uncaught Error on the external run call",
        "rationale": "The defined __call handles this inaccessible method invocation.",
        "misconception": "Assuming __call handles only nonexistent names, never inaccessible methods."
      },
      {
        "id": "scoped",
        "text": "[\"magic:run\",\"real\"]",
        "rationale": "External access uses __call; the internal caller can invoke the actual private method.",
        "misconception": null
      }
    ],
    "correctOptionId": "scoped",
    "explanation": {
      "summary": "__call is invoked for inaccessible or nonexistent methods in an object context. An accessible method call is dispatched normally.",
      "trace": "The external run name is handled by __call. inside executes in Runner scope and reaches its private run body."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"magic:run\",\"real\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.overloading.php#object.call"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0319",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Enums, attributes & reflection",
    "subtopic": "promoted-attribute-target-instantiation",
    "objective": {
      "id": "promoted-attribute-target-instantiation",
      "text": "Trace attribute propagation on promoted parameters and deferred target validation."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Distinguish discoverable metadata from permission to instantiate it on a particular reflected target."
    },
    "prerequisites": [
      "Constructor property promotion",
      "Attribute target flags (advanced)",
      "ReflectionAttribute::newInstance"
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
          "source": "<?php\n\n#[Attribute(Attribute::TARGET_PROPERTY)]\nclass Field\n{\n}\n\nclass Input\n{\n    public function __construct(#[Field] public string $name)\n    {\n    }\n}\n\n$class = new ReflectionClass(Input::class);\n$propertyAttributes = $class->getProperty('name')->getAttributes(Field::class);\n$parameterAttributes = $class->getConstructor()->getParameters()[0]->getAttributes(Field::class);\n$propertyInstance = $propertyAttributes[0]->newInstance();\n\ntry {\n    $parameterAttributes[0]->newInstance();\n    $parameterResult = 'created';\n} catch (Error $failure) {\n    $parameterResult = 'Error';\n}\n\necho json_encode([\n    count($propertyAttributes),\n    count($parameterAttributes),\n    $propertyInstance instanceof Field,\n    $parameterResult,\n]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? The same promoted declaration is inspected as a property and as a constructor parameter.",
    "options": [
      {
        "id": "both-valid",
        "text": "[1,1,true,\"created\"]",
        "rationale": "The promoted parameter carries metadata, but TARGET_PROPERTY does not authorize parameter instantiation.",
        "misconception": "Assuming propagation of an attribute also expands its permitted targets."
      },
      {
        "id": "deferred",
        "text": "[1,1,true,\"Error\"]",
        "rationale": "Promotion copies metadata to both targets; newInstance validates the parameter target and rejects it.",
        "misconception": null
      },
      {
        "id": "property-only",
        "text": "[1,0,true,\"Error\"]",
        "rationale": "The promoted parameter’s reflection also exposes the attribute declaration.",
        "misconception": "Assuming a property-only target flag filters the metadata returned by getAttributes."
      },
      {
        "id": "parameter-only",
        "text": "[0,1,false,\"created\"]",
        "rationale": "Promotion also places the attribute on the property, where its target is valid.",
        "misconception": "Assuming the constructor syntax attaches metadata only to the parameter."
      }
    ],
    "correctOptionId": "deferred",
    "explanation": {
      "summary": "Attributes on promoted declarations appear on both the parameter and property. Attribute target restrictions are checked when an instance is requested, not by filtering discovery results.",
      "trace": "Both reflection queries find one attribute. The property instance is valid; instantiating the parameter’s Field metadata raises Error."
    },
    "validation": {
      "kind": "output",
      "stdout": "[1,1,true,\"Error\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/language.attributes.classes.php",
      "https://wiki.php.net/rfc/constructor_promotion#attributes"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0320",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Types, casting & comparisons",
    "subtopic": "strict-argument-return-file-boundaries",
    "objective": {
      "id": "strict-argument-return-file-boundaries",
      "text": "Distinguish the file controlling argument coercion from the file controlling return coercion."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace opposite directions across a strict caller and a weakly typed function definition file."
    },
    "prerequisites": [
      "strict_types per file",
      "Scalar parameter coercion",
      "Scalar return coercion",
      "Multiple PHP files"
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
          "source": "<?php\n\ndeclare(strict_types=1);\n\nrequire __DIR__ . '/helpers.php';\n\n$value = fromHelper();\n\ntry {\n    acceptInteger('7');\n    $argument = 'accepted';\n} catch (TypeError $failure) {\n    $argument = 'TypeError';\n}\n\necho json_encode([get_debug_type($value), $value, $argument]);\n"
        },
        {
          "path": "helpers.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction fromHelper(): int\n{\n    return '7';\n}\n\nfunction acceptInteger(int $value): int\n{\n    return $value;\n}\n"
        }
      ]
    },
    "stem": "What JSON is printed by main.php? The two files are shown separately and helpers.php deliberately has no strict_types declaration.",
    "options": [
      {
        "id": "all-strict",
        "text": "An uncaught TypeError when fromHelper returns",
        "rationale": "Return-value coercion follows the defining file, which is weak here.",
        "misconception": "Applying the caller’s strict setting to the callee’s return statement."
      },
      {
        "id": "all-weak",
        "text": "[\"int\",7,\"accepted\"]",
        "rationale": "The strict caller rejects its string argument to acceptInteger before that body runs.",
        "misconception": "Applying the callee’s weak setting to arguments passed by a strict caller."
      },
      {
        "id": "split",
        "text": "[\"int\",7,\"TypeError\"]",
        "rationale": "The weak helper coerces its return to int, but the strict main file does not coerce the later argument.",
        "misconception": null
      },
      {
        "id": "string-return",
        "text": "[\"string\",\"7\",\"TypeError\"]",
        "rationale": "The int return declaration still coerces a valid numeric string in the weak helper.",
        "misconception": "Assuming weak typing disables declared return types entirely."
      }
    ],
    "correctOptionId": "split",
    "explanation": {
      "summary": "Scalar argument strictness is selected at the call site. Return-value enforcement follows the file defining the returning function. These two boundaries can therefore use different coercion policies.",
      "trace": "helpers.php converts its returned string to integer 7. main.php then passes string 7 to an int parameter under strict_types=1, causing the caught TypeError."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"int\",7,\"TypeError\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
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
    "id": "PHP-E26-0321",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Iterators, generators & fibers",
    "subtopic": "generator-rewind-first-yield-boundary",
    "objective": {
      "id": "generator-rewind-first-yield-boundary",
      "text": "Trace the state-dependent limit of Generator::rewind."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish an idempotent rewind at the first suspension from an invalid rewind after advancement."
    },
    "prerequisites": [
      "Generator lifecycle",
      "current, next and rewind",
      "Side effects before yield"
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
          "source": "<?php\n\nfunction sequence(): Generator\n{\n    echo 'boot|';\n    yield 'A';\n    yield 'B';\n}\n\n$generator = sequence();\n$generator->rewind();\necho $generator->current() . '|';\n$generator->rewind();\necho $generator->current() . '|';\n$generator->next();\necho $generator->current() . '|';\n\ntry {\n    $generator->rewind();\n    echo 'rewound';\n} catch (Exception $failure) {\n    echo 'Exception';\n}\n"
        }
      ]
    },
    "stem": "What exact text is printed? The generator stays suspended at its second yield when the final rewind is attempted.",
    "options": [
      {
        "id": "restart",
        "text": "boot|A|boot|A|B|boot|rewound",
        "rationale": "rewind does not rerun a generator function from the beginning.",
        "misconception": "Treating a generator like a resettable iterator factory."
      },
      {
        "id": "first-fails",
        "text": "boot|A| followed by an uncaught Exception",
        "rationale": "Rewinding while still at the first yield is permitted and has no effect.",
        "misconception": "Assuming every second rewind fails even without advancement."
      },
      {
        "id": "late-succeeds",
        "text": "boot|A|A|B|rewound",
        "rationale": "After advancing beyond the first yield, the generator cannot rewind.",
        "misconception": "Assuming the first-yield no-op applies to all suspended states."
      },
      {
        "id": "boundary",
        "text": "boot|A|A|B|Exception",
        "rationale": "The first rewind starts execution, the next is a no-op, and the final one fails after advancement.",
        "misconception": null
      }
    ],
    "correctOptionId": "boundary",
    "explanation": {
      "summary": "Generator::rewind starts an unstarted generator or does nothing at its first yield. Once execution advances beyond that first yield, rewinding raises an exception.",
      "trace": "boot runs once. Both first-yield reads return A, next advances to B, and the later rewind enters the catch."
    },
    "validation": {
      "kind": "output",
      "stdout": "boot|A|A|B|Exception",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/generator.rewind.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0322",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Performance, processes & servers",
    "subtopic": "unreachable-cycle-explicit-collection",
    "objective": {
      "id": "unreachable-cycle-explicit-collection",
      "text": "Distinguish reference-count retention of a cycle from its eventual cyclic collection."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine an internal strong cycle, a weak observer and explicit garbage-collector control."
    },
    "prerequisites": [
      "Reference counting and cyclic GC (advanced)",
      "WeakReference",
      "gc_disable and gc_collect_cycles"
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
        "Automatic cyclic collection is disabled by the shown call. There are no destructors, external references or callbacks that resurrect the object. The explicit collection call is permitted."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\ngc_disable();\n\n$node = new stdClass();\n$node->self = $node;\n$weak = WeakReference::create($node);\nunset($node);\n\n$before = $weak->get() !== null;\ngc_collect_cycles();\n$after = $weak->get() !== null;\n\necho json_encode([$before, $after]);\n"
        }
      ]
    },
    "stem": "What JSON pair is printed around the explicit cycle collection?",
    "options": [
      {
        "id": "cycle-collected",
        "text": "[true,false]",
        "rationale": "The self-reference retains the unreachable object until cyclic collection removes it; the weak observer does not keep it alive.",
        "misconception": null
      },
      {
        "id": "immediate",
        "text": "[false,false]",
        "rationale": "Unsetting the external variable does not remove the object’s internal self-reference by reference counting alone.",
        "misconception": "Assuming zero external owners implies an immediate zero reference count."
      },
      {
        "id": "weak-strong",
        "text": "[true,true]",
        "rationale": "WeakReference does not make the unreachable cycle reachable for collection.",
        "misconception": "Treating a weak observer as a strong owner, or assuming gc_disable forbids explicit collection."
      },
      {
        "id": "resurrected",
        "text": "[false,true]",
        "rationale": "Collection does not recreate the object, and no resurrection callback exists.",
        "misconception": "Assuming the collector restores objects that still have weak observers."
      }
    ],
    "correctOptionId": "cycle-collected",
    "explanation": {
      "summary": "Reference counting alone cannot free this self-cycle. Explicit cyclic collection identifies it as unreachable even with automatic collection disabled, and the weak reference then yields null.",
      "trace": "Before collection, the internal self-reference remains. After collection, no object is available through the weak observer."
    },
    "validation": {
      "kind": "output",
      "stdout": "[true,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://www.php.net/manual/en/features.gc.collecting-cycles.php",
      "https://www.php.net/manual/en/function.gc-collect-cycles.php",
      "https://www.php.net/manual/en/class.weakreference.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0323",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Types, casting & comparisons",
    "subtopic": "integer-identifier-float-collapse",
    "objective": {
      "id": "integer-identifier-float-collapse",
      "text": "Detect distinct 64-bit integer identifiers collapsing through binary64 conversion."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Follow exact integer storage, lossy float conversion and formatting that cannot restore lost information."
    },
    "prerequisites": [
      "64-bit PHP integers",
      "IEEE-754 binary64 precision (advanced)",
      "Strict comparison",
      "sprintf formatting"
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
        "The runtime uses 64-bit integers and IEEE-754 binary64 floats with round-to-nearest, ties-to-even."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$first = 9007199254740992;\n$second = $first + 1;\n\n$firstFloat = (float) $first;\n$secondFloat = (float) $second;\n\necho json_encode([\n    $first === $second,\n    $firstFloat === $secondFloat,\n    sprintf('%.0f', $firstFloat) === sprintf('%.0f', $secondFloat),\n]);\n"
        }
      ]
    },
    "stem": "What JSON triple is printed for these adjacent identifiers?",
    "options": [
      {
        "id": "integer-collapse",
        "text": "[true,true,true]",
        "rationale": "Both integers are well within the exact range of 64-bit PHP integer storage.",
        "misconception": "Applying the binary64 precision limit to PHP integer arithmetic."
      },
      {
        "id": "all-distinct",
        "text": "[false,false,false]",
        "rationale": "The adjacent second integer rounds to the same binary64 value as the first.",
        "misconception": "Assuming casting a valid 64-bit integer to float is always exact."
      },
      {
        "id": "float-collapse",
        "text": "[false,true,true]",
        "rationale": "The integers differ, but the float cast loses the one-unit distinction and both formatted floats remain identical.",
        "misconception": null
      },
      {
        "id": "format-recovers",
        "text": "[false,true,false]",
        "rationale": "Formatting identical float values cannot recover the original integers.",
        "misconception": "Treating decimal formatting as a reversal of lossy float conversion."
      }
    ],
    "correctOptionId": "float-collapse",
    "explanation": {
      "summary": "The integers are distinct in PHP integer storage. The second lies halfway between two representable floats and rounds to the first under the stated mode; later formatting cannot recover discarded precision.",
      "trace": "9007199254740993 becomes the same float as 9007199254740992. Strict comparison of the original integers remains false."
    },
    "validation": {
      "kind": "output",
      "stdout": "[false,true,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.float.php",
      "https://www.php.net/manual/en/language.types.integer.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0324",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Enums, attributes & reflection",
    "subtopic": "promoted-default-parameter-versus-storage",
    "objective": {
      "id": "promoted-default-parameter-versus-storage",
      "text": "Distinguish a promoted parameter default from a declared property default during constructor-free allocation."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine promotion metadata, readonly initialization and reflection-based object construction."
    },
    "prerequisites": [
      "Promoted readonly properties",
      "Reflection parameter/property metadata",
      "newInstanceWithoutConstructor"
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
          "source": "<?php\n\nclass Quantity\n{\n    public function __construct(public readonly int $value = 1)\n    {\n    }\n}\n\n$class = new ReflectionClass(Quantity::class);\n$parameter = $class->getConstructor()->getParameters()[0];\n$property = $class->getProperty('value');\n$unconstructed = $class->newInstanceWithoutConstructor();\n\necho json_encode([\n    $parameter->getDefaultValue(),\n    $property->hasDefaultValue(),\n    $property->isInitialized($unconstructed),\n]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? The reflection allocation deliberately bypasses the constructor; it does not call it with omitted arguments.",
    "options": [
      {
        "id": "all-defaulted",
        "text": "[1,true,true]",
        "rationale": "The promotion syntax attaches the default to the parameter, not to readonly property storage.",
        "misconception": "Assuming a promoted parameter default is also a property declaration default."
      },
      {
        "id": "parameter-only",
        "text": "[1,false,false]",
        "rationale": "The parameter defaults to 1, but the promoted property has no default and remains uninitialized without construction.",
        "misconception": null
      },
      {
        "id": "initialized-without-default",
        "text": "[1,false,true]",
        "rationale": "No constructor assignment runs during newInstanceWithoutConstructor.",
        "misconception": "Assuming reflection allocation applies constructor parameter defaults automatically."
      },
      {
        "id": "no-default",
        "text": "[null,false,false]",
        "rationale": "The constructor parameter has an explicit default value of 1.",
        "misconception": "Discarding the parameter default because the property itself cannot have one."
      }
    ],
    "correctOptionId": "parameter-only",
    "explanation": {
      "summary": "Promotion generates a property plus a constructor assignment. Its default belongs to the parameter. Bypassing construction skips that assignment, leaving the typed readonly property uninitialized.",
      "trace": "Reflection sees parameter default 1, property hasDefaultValue=false, and isInitialized=false on the constructor-free instance."
    },
    "validation": {
      "kind": "output",
      "stdout": "[1,false,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://wiki.php.net/rfc/constructor_promotion#desugaring",
      "https://www.php.net/manual/en/reflectionclass.newinstancewithoutconstructor.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0325",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Validation & web security",
    "subtopic": "deserialization-hook-before-type-gate",
    "objective": {
      "id": "deserialization-hook-before-type-gate",
      "text": "Trace deserialization hooks before a caller’s post-deserialization type check."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Identify a validation boundary that runs after object reconstruction has already invoked user code."
    },
    "prerequisites": [
      "PHP object serialization",
      "__wakeup",
      "instanceof validation",
      "Side-effect timing"
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
        "The payload is generated locally from the displayed fixture solely to observe ordering. No external serialized data, files or services are used. No allowed_classes restriction is supplied."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass AcceptedMessage\n{\n}\n\nclass OtherMessage\n{\n    public function __wakeup(): void\n    {\n        echo 'hook|';\n    }\n}\n\n$payload = serialize(new OtherMessage());\n$value = unserialize($payload);\n\nif (!$value instanceof AcceptedMessage) {\n    echo 'rejected';\n} else {\n    echo 'accepted';\n}\n"
        }
      ]
    },
    "stem": "What text is printed? The caller intends to reject objects that are not AcceptedMessage.",
    "options": [
      {
        "id": "gate-first",
        "text": "rejected",
        "rationale": "The type gate runs only after unserialize has reconstructed the object and invoked its hook.",
        "misconception": "Assuming a later caller check prevents earlier deserialization effects."
      },
      {
        "id": "accepted",
        "text": "hook|accepted",
        "rationale": "The reconstructed class is OtherMessage, not AcceptedMessage.",
        "misconception": "Assuming successful deserialization implies the caller’s expected type."
      },
      {
        "id": "late-hook",
        "text": "rejectedhook|",
        "rationale": "__wakeup runs during unserialize rather than after the caller’s subsequent branch.",
        "misconception": "Deferring reconstruction callbacks until the object is later used or discarded."
      },
      {
        "id": "hook-first",
        "text": "hook|rejected",
        "rationale": "The reconstruction hook emits output before the caller rejects the resulting object.",
        "misconception": null
      }
    ],
    "correctOptionId": "hook-first",
    "explanation": {
      "summary": "A post-deserialization instanceof check cannot undo or prevent hooks already run during reconstruction. Successful type rejection is therefore not evidence that deserialization was side-effect-free.",
      "trace": "unserialize creates OtherMessage and invokes __wakeup, producing hook|. The later check rejects that object and prints rejected."
    },
    "validation": {
      "kind": "output",
      "stdout": "hook|rejected",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.unserialize.php",
      "https://www.php.net/manual/en/language.oop5.magic.php#object.wakeup"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0326",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "string-transform-return-value",
    "objective": {
      "id": "string-transform-return-value",
      "text": "Repair code that discards the result of a nonmutating string transformation."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish returning a transformed string from changing an argument in place."
    },
    "prerequisites": [
      "strtolower",
      "Function return values",
      "Variable assignment"
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
          "source": "<?php\n\nfunction normalize(string $input): string\n{\n    strtolower($input);\n\n    return $input;\n}\n\necho json_encode([normalize('AbC'), normalize(' D ') ]);\n"
        }
      ]
    },
    "stem": "normalize must return lowercase ASCII text without trimming or otherwise changing it. Which statement replaces the discarded call and produces the displayed target for both inputs?",
    "options": [
      {
        "id": "uppercase",
        "text": "$input = strtoupper($input);",
        "rationale": "This stores a result, but changes text in the wrong direction.",
        "misconception": "Confusing the two case-conversion functions."
      },
      {
        "id": "stored",
        "text": "$input = strtolower($input);",
        "rationale": "The returned lowercase string is assigned to the variable that the function later returns.",
        "misconception": null
      },
      {
        "id": "trimmed",
        "text": "$input = strtolower(trim($input));",
        "rationale": "The second input loses meaningful surrounding spaces.",
        "misconception": "Adding normalization beyond the stated lowercase-only contract."
      },
      {
        "id": "ignored",
        "text": "strtolower($input);",
        "rationale": "The transformation result is still discarded.",
        "misconception": "Assuming strtolower mutates its string argument by reference."
      }
    ],
    "correctOptionId": "stored",
    "explanation": {
      "summary": "strtolower returns a new string value. Assign or return that value; calling it without using its result does not update the local variable.",
      "trace": "The corrected function returns abc and preserves the spaces around the lowercased d."
    },
    "validation": {
      "kind": "patch",
      "marker": "strtolower($input);",
      "stdout": "[\"abc\",\" d \"]",
      "original": {
        "stdout": "[\"AbC\",\" D \"]"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.strtolower.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0327",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Arrays & destructuring",
    "subtopic": "pop-last-entry-sparse-keys",
    "objective": {
      "id": "pop-last-entry-sparse-keys",
      "text": "Remove and return the last array entry without deriving its key from count."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Treat iteration order separately from sparse numeric identifiers."
    },
    "prerequisites": [
      "Array removal",
      "Iteration order",
      "Sparse integer keys"
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
          "source": "<?php\n\n$items = [4 => 'first', 9 => 'last'];\n\n$removed = array_shift($items);\n\necho json_encode([$removed, $items]);\n"
        }
      ]
    },
    "stem": "The last entry must be removed and returned, leaving the first entry intact. Which replacement statement produces [\"last\",{\"4\":\"first\"}] for this sparse-key fixture?",
    "options": [
      {
        "id": "pop",
        "text": "$removed = array_pop($items);",
        "rationale": "array_pop removes the last entry and retains the key of the remaining entry.",
        "misconception": null
      },
      {
        "id": "peek",
        "text": "$removed = end($items);",
        "rationale": "end reads the last value without removing its entry.",
        "misconception": "Confusing moving the internal pointer with mutation of the array."
      },
      {
        "id": "shift",
        "text": "$removed = array_shift($items);",
        "rationale": "This removes the first entry and renumbers remaining numeric keys.",
        "misconception": "Selecting the queue-front operation for a stack-tail requirement."
      },
      {
        "id": "count-key",
        "text": "$removed = $items[count($items) - 1] ?? null;",
        "rationale": "There is no key 1, and the expression removes nothing.",
        "misconception": "Assuming array count determines the last key in a sparse map."
      }
    ],
    "correctOptionId": "pop",
    "explanation": {
      "summary": "array_pop addresses the last entry by array order. count minus one is only a positional index for a consecutive list and does not remove an entry by itself.",
      "trace": "The entry keyed 9 is returned as last and removed; key 4 remains associated with first."
    },
    "validation": {
      "kind": "patch",
      "marker": "$removed = array_shift($items);",
      "stdout": "[\"last\",{\"4\":\"first\"}]",
      "original": {
        "stdout": "[\"first\",[\"last\"]]"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-pop.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0328",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "final-filename-extension-component",
    "objective": {
      "id": "final-filename-extension-component",
      "text": "Extract the final extension instead of assuming a filename has only one dot."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Use a multi-dot filename to expose a fixed-position split."
    },
    "prerequisites": [
      "pathinfo",
      "Filename components",
      "explode"
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
        "Inputs are plain ASCII display filenames with at least one dot, no path separators and no trailing dot. This extracts a label only; it does not validate file content or authorize an upload."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction extension(string $filename): string\n{\n    return explode('.', $filename)[1];\n}\n\necho json_encode([extension('report.csv'), extension('backup.tar.gz')]);\n"
        }
      ]
    },
    "stem": "extension must return the text after the final dot. Which expression repairs both displayed cases?",
    "options": [
      {
        "id": "first-suffix",
        "text": "explode('.', $filename, 2)[1]",
        "rationale": "Limiting the split leaves tar.gz as one suffix instead of selecting gz.",
        "misconception": "Treating everything after the first dot as the final extension."
      },
      {
        "id": "stem",
        "text": "pathinfo($filename, PATHINFO_FILENAME)",
        "rationale": "This returns the filename without its final extension.",
        "misconception": "Confusing the stem component with the extension component."
      },
      {
        "id": "last-extension",
        "text": "pathinfo($filename, PATHINFO_EXTENSION)",
        "rationale": "PATHINFO_EXTENSION selects the final extension component for these filenames.",
        "misconception": null
      },
      {
        "id": "whole-name",
        "text": "pathinfo($filename, PATHINFO_BASENAME)",
        "rationale": "The basename includes the extension and is the whole input for these plain filenames.",
        "misconception": "Assuming basename means the extension after the last dot."
      }
    ],
    "correctOptionId": "last-extension",
    "explanation": {
      "summary": "The final extension and the suffix after the first dot are different for multi-dot filenames. pathinfo exposes the required final component directly.",
      "trace": "report.csv yields csv and backup.tar.gz yields gz. Neither result establishes anything about the file’s actual format."
    },
    "validation": {
      "kind": "patch",
      "marker": "explode('.', $filename)[1]",
      "stdout": "[\"csv\",\"gz\"]",
      "original": {
        "stdout": "[\"csv\",\"tar\"]"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.pathinfo.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0329",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Variables, scope & constants",
    "subtopic": "reference-alias-clear-versus-unset",
    "objective": {
      "id": "reference-alias-clear-versus-unset",
      "text": "Clear a shared array value rather than merely removing one variable name."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish a reference binding from the value stored through that binding."
    },
    "prerequisites": [
      "Reference assignment",
      "unset",
      "Array assignment"
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
          "source": "<?php\n\n$items = [1, 2];\n$alias =& $items;\n\nunset($items);\n\necho json_encode([\n    isset($items),\n    isset($alias),\n    $items ?? null,\n    $alias ?? null,\n]);\n"
        }
      ]
    },
    "stem": "Both variable names must still exist and refer to an empty array after cleanup. Which replacement achieves [true,true,[],[]]?",
    "options": [
      {
        "id": "unset-both",
        "text": "unset($items, $alias);",
        "rationale": "Both names become absent, contrary to the requirement that they remain usable.",
        "misconception": "Equating removing bindings with clearing their shared value."
      },
      {
        "id": "detach-alias",
        "text": "unset($alias);\n$items = [];",
        "rationale": "items becomes empty but alias no longer exists.",
        "misconception": "Discarding one of the required reference names."
      },
      {
        "id": "local-unset",
        "text": "unset($items);",
        "rationale": "alias continues to hold the original array after items is removed.",
        "misconception": "Assuming unset clears every alias of the referenced value."
      },
      {
        "id": "assign-empty",
        "text": "$items = [];",
        "rationale": "Assignment through the reference updates the shared value while preserving both names.",
        "misconception": null
      }
    ],
    "correctOptionId": "assign-empty",
    "explanation": {
      "summary": "unset removes a variable binding. Assigning an empty array through either reference name changes the shared value and keeps both names bound.",
      "trace": "After the assignment, isset is true for both names and both read the same empty array."
    },
    "validation": {
      "kind": "patch",
      "marker": "unset($items);",
      "stdout": "[true,true,[],[]]",
      "original": {
        "stdout": "[false,true,null,[1,2]]"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-02"
    },
    "references": [
      "https://www.php.net/manual/en/language.references.unset.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0330",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Control flow & pattern matching",
    "subtopic": "return-match-expression-value",
    "objective": {
      "id": "return-match-expression-value",
      "text": "Return a match expression’s value from a declared string-returning function."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate evaluating an expression from returning its result to the caller."
    },
    "prerequisites": [
      "match expressions",
      "Return statements",
      "Declared return types"
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
          "source": "<?php\n\nfunction label(bool $enabled): string\n{\n    /* prefix */ match ($enabled) {\n        true => 'yes',\n        false => 'no',\n    };\n}\n\ntry {\n    echo json_encode([label(true), label(false)]);\n} catch (TypeError $failure) {\n    echo 'TypeError';\n}\n"
        }
      ]
    },
    "stem": "label must return the selected string without emitting output itself. Which replacement for the marked prefix produces the JSON array [\"yes\",\"no\"]?",
    "options": [
      {
        "id": "echo",
        "text": "echo",
        "rationale": "The function prints the selected value but still fails to return a string.",
        "misconception": "Treating output as a function return value."
      },
      {
        "id": "return",
        "text": "return",
        "rationale": "Returning the match result satisfies the declared function contract without printing inside it.",
        "misconception": null
      },
      {
        "id": "assign",
        "text": "$result =",
        "rationale": "Assignment stores the result locally, but no return statement follows.",
        "misconception": "Assuming a local variable named result is returned implicitly."
      },
      {
        "id": "print-result",
        "text": "return print",
        "rationale": "print emits the text and returns integer 1, which is not the selected label.",
        "misconception": "Confusing print’s success return value with the string that it prints."
      }
    ],
    "correctOptionId": "return",
    "explanation": {
      "summary": "match produces a value, but an ordinary function needs an explicit return statement to deliver it. Reaching the end of a function declared to return string raises TypeError.",
      "trace": "With return, each call yields its selected string to json_encode. echo and local assignment do not return the required value. return print emits the label and returns 1, which weak return coercion converts to the string \"1\" rather than the selected label."
    },
    "validation": {
      "kind": "patch",
      "marker": "/* prefix */",
      "stdout": "[\"yes\",\"no\"]",
      "original": {
        "stdout": "TypeError"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-06"
    },
    "references": [
      "https://www.php.net/manual/en/control-structures.match.php",
      "https://www.php.net/manual/en/functions.returning-values.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0331",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Includes, autoloading & paths",
    "subtopic": "include-path-current-directory-independent",
    "objective": {
      "id": "include-path-current-directory-independent",
      "text": "Resolve an application-owned include relative to its defining file instead of mutable working-directory state."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace a directory change before evaluating several superficially similar path expressions."
    },
    "prerequisites": [
      "__DIR__ and __FILE__",
      "getcwd",
      "require",
      "Current working directory"
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
        "main.php and settings.php are in the same directory. That directory is initially current, and the displayed mkdir and chdir calls succeed in an isolated fixture. No include_path entry supplies settings.php."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$warnings = [];\nset_error_handler(static function (int $severity, string $message) use (&$warnings): bool {\n    $warnings[] = $message;\n\n    return true;\n});\n\nmkdir(__DIR__ . '/work');\nchdir(__DIR__ . '/work');\n\ntry {\n    $settings = require getcwd() . '/settings.php';\n    $result = $settings['limit'];\n} catch (Error $failure) {\n    $result = 'load-failed';\n}\n\nrestore_error_handler();\necho json_encode([$result, count($warnings)]);\n"
        },
        {
          "path": "settings.php",
          "kind": "complete-file",
          "source": "<?php\n\nreturn ['limit' => 7];\n"
        }
      ]
    },
    "stem": "The settings file must load successfully even after chdir, producing [7,0]. Which path expression replaces the current one? The handler records failed-load warnings so candidate failures remain observable without diagnostic noise.",
    "options": [
      {
        "id": "file-path",
        "text": "__FILE__ . '/settings.php'",
        "rationale": "__FILE__ includes main.php, so this attempts to use a file as a directory.",
        "misconception": "Treating a full source filename as its containing directory."
      },
      {
        "id": "source-directory",
        "text": "__DIR__ . '/settings.php'",
        "rationale": "__DIR__ remains the directory containing main.php regardless of chdir.",
        "misconception": null
      },
      {
        "id": "working-directory",
        "text": "getcwd() . '/settings.php'",
        "rationale": "The working directory is now work, where settings.php does not exist.",
        "misconception": "Assuming the current directory always follows the source file."
      },
      {
        "id": "relative",
        "text": "'./settings.php'",
        "rationale": "The explicit relative path resolves from the changed working directory.",
        "misconception": "Assuming ./ is relative to the file containing the require expression."
      }
    ],
    "correctOptionId": "source-directory",
    "explanation": {
      "summary": "__DIR__ identifies the source file’s directory. Relative paths and getcwd follow process working-directory state, which chdir changes.",
      "trace": "The correct path reaches the sibling settings.php, reads limit 7 and records no warnings."
    },
    "validation": {
      "kind": "patch",
      "marker": "getcwd() . '/settings.php'",
      "stdout": "[7,0]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-09"
    },
    "references": [
      "https://www.php.net/manual/en/language.constants.magic.php",
      "https://www.php.net/manual/en/function.include.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0332",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Forms & file uploads",
    "subtopic": "post-body-limit-empty-upload-arrays",
    "objective": {
      "id": "post-body-limit-empty-upload-arrays",
      "text": "Diagnose an oversized multipart body that prevents PHP from populating either form or upload arrays."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish whole-request body limits from per-file upload status entries."
    },
    "prerequisites": [
      "post_max_size",
      "upload_max_filesize",
      "POST and FILES population"
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
        "PHP 8.4/8.5 receives a multipart POST with a web-server-confirmed Content-Length of 2,000,000 bytes. post_max_size is 1,000,000 bytes, upload_max_filesize is 5,000,000 bytes, and no other proxy or server limit rejects the request first. The endpoint sees empty POST and FILES arrays. It must report the oversized request rather than claim the user selected no file."
      ],
      "files": []
    },
    "stem": "Which diagnostic change addresses the actual missing boundary?",
    "options": [
      {
        "id": "file-error",
        "text": "Read the missing FILES entry’s error code and expect UPLOAD_ERR_INI_SIZE.",
        "rationale": "The whole POST exceeded its limit, so a per-file entry need not exist to carry that error.",
        "misconception": "Assuming every rejected request produces an individual upload status record."
      },
      {
        "id": "raise-file",
        "text": "Raise upload_max_filesize while leaving post_max_size unchanged.",
        "rationale": "The request already fits the per-file limit; the smaller whole-body limit still rejects population.",
        "misconception": "Treating upload_max_filesize as the only size constraint."
      },
      {
        "id": "body-limit",
        "text": "Check the confirmed body length against the POST limit before interpreting empty arrays as no selection.",
        "rationale": "The 2,000,000-byte request exceeds the 1,000,000-byte body limit, explaining both empty arrays.",
        "misconception": null
      },
      {
        "id": "success-empty",
        "text": "Compare the confirmed body length only with upload_max_filesize before deciding whether empty FILES means no selection.",
        "rationale": "The request fits upload_max_filesize but exceeds post_max_size; checking only the per-file threshold misses the binding whole-request limit.",
        "misconception": "Using the per-file upload limit to diagnose whole-request parsing."
      }
    ],
    "correctOptionId": "body-limit",
    "explanation": {
      "summary": "post_max_size applies to the entire request body. Exceeding it can leave both POST and FILES empty, so per-file error inspection alone cannot diagnose this case.",
      "trace": "The body is larger than the POST limit but smaller than the file limit. The endpoint must classify the whole-request size failure before treating missing upload metadata as user input."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP documents empty POST and FILES when posted data exceeds post_max_size; the supplied confirmed lengths identify that condition.",
      "optionAudit": {
        "file-error": "No per-file entry is available to inspect.",
        "raise-file": "The binding constraint remains post_max_size.",
        "body-limit": "Recognizes the whole-body boundary before interpreting empty parsed data.",
        "success-empty": "The confirmed length fits the file limit but violates the smaller POST limit."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-12"
    },
    "references": [
      "https://www.php.net/manual/en/ini.core.php#ini.post-max-size",
      "https://www.php.net/manual/en/features.file-upload.common-pitfalls.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0333",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Cookies & sessions",
    "subtopic": "session-id-rotation-old-storage-removal",
    "objective": {
      "id": "session-id-rotation-old-storage-removal",
      "text": "Rotate a session identifier while preserving current data and deleting the old persisted record."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish identifier regeneration, old-record retention and destruction of the active session."
    },
    "prerequisites": [
      "PHP file session handler",
      "session_regenerate_id",
      "Session lifecycle"
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
        "The standard files session handler stores data only in the fixture directory. Cookies and cache headers are disabled for this CLI demonstration. There are no concurrent requests. The old session record has been written before rotation; all storage operations succeed."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nsession_start([\n    'save_path' => __DIR__,\n    'use_cookies' => 0,\n    'cache_limiter' => '',\n]);\n\n$_SESSION['user'] = 7;\n$oldId = session_id();\n$oldPath = __DIR__ . '/sess_' . $oldId;\nsession_write_close();\nsession_start();\n\nsession_regenerate_id(false);\n\n$changed = session_status() === PHP_SESSION_ACTIVE\n    && session_id() !== ''\n    && session_id() !== $oldId;\n$authenticated = ($_SESSION['user'] ?? null) === 7;\nsession_write_close();\n\necho json_encode([$changed, $authenticated, is_file($oldPath)]);\n"
        }
      ]
    },
    "stem": "The rotation must leave an active session with a new nonempty ID, retain user 7, and remove the old session file. Which statement replaces the current regeneration call and produces [true,true,false]?",
    "options": [
      {
        "id": "retain-old",
        "text": "session_regenerate_id(false);",
        "rationale": "This changes the ID and preserves current data but deliberately retains the old persisted record.",
        "misconception": "Ignoring the old-record deletion argument."
      },
      {
        "id": "destroy",
        "text": "session_destroy();",
        "rationale": "Destruction removes stored data but does not regenerate a new session identifier.",
        "misconception": "Treating destruction as equivalent to identifier rotation."
      },
      {
        "id": "reload",
        "text": "session_reset();",
        "rationale": "Reloading the active session does not change its ID or remove the old file.",
        "misconception": "Confusing reinitializing current variables with replacing session identity."
      },
      {
        "id": "rotate-delete",
        "text": "session_regenerate_id(true);",
        "rationale": "The new identifier keeps the active session data and the true argument deletes old storage.",
        "misconception": null
      }
    ],
    "correctOptionId": "rotate-delete",
    "explanation": {
      "summary": "session_regenerate_id changes the active ID while retaining current session variables. Its delete_old_session argument controls whether the old storage record remains.",
      "trace": "With true, the ID differs, user remains 7, and the old session file is absent. Concurrent-request migration policy is intentionally outside this isolated contract."
    },
    "validation": {
      "kind": "patch",
      "marker": "session_regenerate_id(false);",
      "stdout": "[true,true,false]",
      "original": {
        "stdout": "[true,true,true]"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-13"
    },
    "references": [
      "https://www.php.net/manual/en/function.session-regenerate-id.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0334",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "PDO & database access",
    "subtopic": "native-pdo-distinct-placeholder-occurrences",
    "objective": {
      "id": "native-pdo-distinct-placeholder-occurrences",
      "text": "Repair repeated named parameter occurrences under native PDO MySQL prepares."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate a bound value from the parameter-marker occurrences the driver must represent."
    },
    "prerequisites": [
      "PDO MySQL native prepares",
      "Named placeholders",
      "execute parameter maps"
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
        "PDO MySQL uses native prepares with ATTR_EMULATE_PREPARES=false and must retain that setting. The SQL is SELECT id FROM staff WHERE id = :who OR manager_id = :who. Both conditions must compare with integer 7. The repeated placeholder fails with HY093 in this configuration. No database connection is executed in this question."
      ],
      "files": []
    },
    "stem": "Which repair keeps native prepares and applies the value to both predicates?",
    "options": [
      {
        "id": "separate",
        "text": "Use :employee and :manager, then bind both names to integer 7.",
        "rationale": "Each marker occurrence has its own name while both receive the intended value.",
        "misconception": null
      },
      {
        "id": "bind-twice",
        "text": "Keep both :who markers and call bindValue for who twice with integer 7.",
        "rationale": "Repeated binding updates one named parameter; it does not create separate marker occurrences.",
        "misconception": "Assuming each bindValue call assigns the next occurrence of a repeated name."
      },
      {
        "id": "array-value",
        "text": "Keep :who and pass the array [7, 7] as its single bound value.",
        "rationale": "A scalar placeholder does not expand an array into multiple parameter occurrences.",
        "misconception": "Treating one bound value as a positional list for repeated named markers."
      },
      {
        "id": "quote-one",
        "text": "Change the second predicate to manager_id = ':who' and bind who to 7.",
        "rationale": "The quoted text is a SQL string literal, not a marker that receives integer 7.",
        "misconception": "Assuming placeholder substitution occurs inside quoted SQL literals."
      }
    ],
    "correctOptionId": "separate",
    "explanation": {
      "summary": "With this native-prepare configuration, repeated occurrences require distinct named markers. Binding the same scalar separately preserves the intended predicate without changing preparation mode.",
      "trace": "The query becomes id = :employee OR manager_id = :manager, with employee=7 and manager=7."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PDO prepare documentation requires a unique parameter marker for each value occurrence unless emulation is enabled; this scenario explicitly retains native MySQL prepares.",
      "optionAudit": {
        "separate": "Two distinct markers are each assigned 7.",
        "bind-twice": "Reassigns one named binding without fixing repeated markers.",
        "array-value": "A marker represents one scalar value, not an array expansion.",
        "quote-one": "The quoted marker becomes literal SQL text."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdo.prepare.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0335",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "recursive-argument-postdecrement-state",
    "objective": {
      "id": "recursive-argument-postdecrement-state",
      "text": "Repair a recursive argument without mutating the current frame’s multiplier."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish the value passed to a child call from changes to the parent frame’s local variable."
    },
    "prerequisites": [
      "Recursion",
      "Pre- and post-decrement",
      "Local variables per call"
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
        "The budget is a fixture guard preventing runaway recursion; it is large enough for the correct factorial calculations. Inputs are nonnegative integers."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction factorial(int $number, int $budget = 10): int\n{\n    if ($number <= 1) {\n        return 1;\n    }\n\n    if ($budget === 0) {\n        throw new LogicException('budget');\n    }\n\n    $child = factorial($number--, $budget - 1);\n\n    return $number * $child;\n}\n\n$results = [];\n\nforeach ([3, 4] as $input) {\n    try {\n        $results[] = factorial($input);\n    } catch (LogicException $failure) {\n        $results[] = $failure->getMessage();\n    }\n}\n\necho json_encode($results);\n"
        }
      ]
    },
    "stem": "factorial must return 6 and 24 for inputs 3 and 4. Which child-argument expression repairs both nontermination and parent-frame multiplication?",
    "options": [
      {
        "id": "pre-decrement",
        "text": "--$number",
        "rationale": "The child decreases, but the parent multiplier is also decreased before its return.",
        "misconception": "Fixing recursive progress while accidentally changing the value needed after recursion."
      },
      {
        "id": "difference",
        "text": "$number - 1",
        "rationale": "The child receives one less while the parent keeps its original multiplier.",
        "misconception": null
      },
      {
        "id": "post-decrement",
        "text": "$number--",
        "rationale": "The child receives the old number, so recursion does not approach its base case.",
        "misconception": "Assuming post-decrement passes the decremented value."
      },
      {
        "id": "skip-two",
        "text": "$number - 2",
        "rationale": "This skips factors rather than visiting every positive integer down to one.",
        "misconception": "Using a larger decrement to terminate without preserving the recurrence."
      }
    ],
    "correctOptionId": "difference",
    "explanation": {
      "summary": "The factorial recurrence multiplies the current number by the factorial of one less. A nonmutating subtraction preserves both parts; either decrement operator changes the parent variable too.",
      "trace": "For 4, the correct frames multiply 4 × 3 × 2 × 1. Post-decrement repeatedly passes 4 until the guard rejects it; pre-decrement loses the original multiplier."
    },
    "validation": {
      "kind": "patch",
      "marker": "$number--",
      "stdout": "[6,24]",
      "original": {
        "stdout": "[\"budget\",\"budget\"]"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.increment.php",
      "https://www.php.net/manual/en/functions.user-defined.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0336",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "create-without-truncation-file-mode",
    "objective": {
      "id": "create-without-truncation-file-mode",
      "text": "Choose a file mode that creates missing files while retaining existing content and honoring positioned writes."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "One mode must satisfy creation, nontruncation and nonappend behavior across two fixtures."
    },
    "prerequisites": [
      "File-opening modes",
      "File creation",
      "Truncation and append behavior"
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
        "The fixture owns both paths. existing.txt starts with abcd and new.txt does not exist. All operations succeed when the selected mode permits them. The handler records no output for an expected failed open; that failure becomes the explicit open-failed result."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction replaceFirst(string $path): array\n{\n    $handle = fopen($path, 'w+b');\n\n    if ($handle === false) {\n        return ['open-failed'];\n    }\n\n    $before = stream_get_contents($handle);\n    rewind($handle);\n    fwrite($handle, 'X');\n    rewind($handle);\n    $after = stream_get_contents($handle);\n    fclose($handle);\n\n    return [$before, $after];\n}\n\nfile_put_contents(__DIR__ . '/existing.txt', 'abcd');\nset_error_handler(static function (): bool {\n    return true;\n});\n\n$existing = replaceFirst(__DIR__ . '/existing.txt');\n$created = replaceFirst(__DIR__ . '/new.txt');\nrestore_error_handler();\n\necho json_encode([$existing, $created]);\n"
        }
      ]
    },
    "stem": "The function must read the original content, replace its first byte with X, and preserve any remaining bytes. Missing files must be created. Which mode yields [[\"abcd\",\"Xbcd\"],[\"\",\"X\"]]?",
    "options": [
      {
        "id": "truncate",
        "text": "'w+b'",
        "rationale": "w+ truncates existing.txt before the function can read or preserve its old bytes.",
        "misconception": "Using a create-capable mode without accounting for truncation."
      },
      {
        "id": "existing",
        "text": "'r+b'",
        "rationale": "r+ preserves the existing file but cannot create new.txt.",
        "misconception": "Assuming read/write mode always creates a missing file."
      },
      {
        "id": "append",
        "text": "'a+b'",
        "rationale": "Append mode forces the write to the end even after rewind.",
        "misconception": "Assuming repositioning overrides append-mode write semantics."
      },
      {
        "id": "create-preserve",
        "text": "'c+b'",
        "rationale": "c+ creates if needed without truncating and allows the positioned write at offset zero.",
        "misconception": null
      }
    ],
    "correctOptionId": "create-preserve",
    "explanation": {
      "summary": "c+ combines creation with nontruncating read/write access. w+ destroys old content, r+ requires an existing file, and a+ forces writes to append.",
      "trace": "The existing fixture is read as abcd and becomes Xbcd; the absent fixture is created empty and becomes X."
    },
    "validation": {
      "kind": "patch",
      "marker": "'w+b'",
      "stdout": "[[\"abcd\",\"Xbcd\"],[\"\",\"X\"]]",
      "original": {
        "stdout": "[[\"\",\"X\"],[\"\",\"X\"]]"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.fopen.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0337",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "truncate-does-not-rewind-cursor",
    "objective": {
      "id": "truncate-does-not-rewind-cursor",
      "text": "Repair a rewrite that truncates a file but leaves its write cursor beyond the new end."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track file size and stream position as independent state variables."
    },
    "prerequisites": [
      "ftruncate",
      "Stream positions",
      "rewind",
      "Binary byte inspection"
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
        "The regular file is an isolated owned fixture. All I/O succeeds. Binary mode is used, and no other process accesses the file."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$handle = fopen(__DIR__ . '/rewrite.bin', 'w+b');\nfwrite($handle, 'abc');\nftruncate($handle, 0);\n\nfflush($handle);\n\nfwrite($handle, 'X');\nrewind($handle);\n$contents = stream_get_contents($handle);\nfclose($handle);\n\necho bin2hex($contents);\n"
        }
      ]
    },
    "stem": "The rewritten file must contain exactly the single byte X, whose hexadecimal encoding is 58. Which statement replaces the current flush between truncation and writing?",
    "options": [
      {
        "id": "rewind",
        "text": "rewind($handle);",
        "rationale": "Rewinding moves the retained offset from 3 to 0 before writing.",
        "misconception": null
      },
      {
        "id": "flush",
        "text": "fflush($handle);",
        "rationale": "Flushing buffered data does not reset the stream position.",
        "misconception": "Confusing buffer synchronization with cursor movement."
      },
      {
        "id": "relative-zero",
        "text": "fseek($handle, 0, SEEK_CUR);",
        "rationale": "A zero relative seek leaves the current offset unchanged.",
        "misconception": "Treating a zero offset as absolute without considering its origin."
      },
      {
        "id": "truncate-again",
        "text": "ftruncate($handle, 0);",
        "rationale": "Repeating truncation changes size, not the retained file position.",
        "misconception": "Assuming making a file empty also seeks to its beginning."
      }
    ],
    "correctOptionId": "rewind",
    "explanation": {
      "summary": "ftruncate changes the file length but does not reposition the stream. Writing from the retained offset creates a gap; explicitly rewinding starts the replacement at byte zero.",
      "trace": "After writing abc, the cursor is 3. Truncation leaves it at 3, so the faulty write creates three zero bytes before X. Rewinding makes the file exactly X."
    },
    "validation": {
      "kind": "patch",
      "marker": "fflush($handle);",
      "stdout": "58",
      "original": {
        "stdout": "00000058"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.ftruncate.php",
      "https://www.php.net/manual/en/function.rewind.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0338",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "file-precheck-time-of-use-failure",
    "objective": {
      "id": "file-precheck-time-of-use-failure",
      "text": "Handle a file-open result even after a successful earlier readability check."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Recognize that a precheck cannot reserve filesystem state across a concurrent change."
    },
    "prerequisites": [
      "is_readable",
      "fopen false return",
      "Concurrent filesystem changes"
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
        "A PHP process checks is_readable($path), which returns true. A second authorized process deletes that file before the first calls fopen($path, \"rb\"). The open returns false. The application must report a controlled read failure and must not recreate the file or operate on another path."
      ],
      "files": []
    },
    "stem": "The code currently passes the failed open result to fread because the earlier check succeeded. Which repair addresses this schedule?",
    "options": [
      {
        "id": "clear-cache",
        "text": "Clear the stat cache before is_readable, then assume the later fopen succeeds.",
        "rationale": "The file can still disappear after the fresh check.",
        "misconception": "Confusing fresh metadata with a guarantee about a later operation."
      },
      {
        "id": "check-open",
        "text": "Check the actual fopen result and take the failure path when it is false.",
        "rationale": "The open result describes the operation that actually failed, regardless of any earlier check.",
        "misconception": null
      },
      {
        "id": "repeat-check",
        "text": "Call is_readable twice before fopen and proceed only if both calls return true.",
        "rationale": "The deletion can occur after the second check as well.",
        "misconception": "Assuming repeated prechecks close the time-of-check/time-of-use window."
      },
      {
        "id": "create-mode",
        "text": "Change rb to c+b so a missing file can be recreated automatically.",
        "rationale": "This changes the read-only contract and creates an empty replacement instead of reporting failure.",
        "misconception": "Repairing an open failure by silently changing the required operation."
      }
    ],
    "correctOptionId": "check-open",
    "explanation": {
      "summary": "A filesystem precheck is only an observation at one moment. The actual open can still fail, so its return value must control whether reads are attempted.",
      "trace": "In the stated interleaving, both an earlier true check and a later false open are valid. Detecting false at the open boundary prevents fread from receiving an invalid handle."
    },
    "validation": {
      "kind": "document-review",
      "rule": "The supplied schedule changes filesystem state between check and open; only the open result determines whether a usable stream exists.",
      "optionAudit": {
        "clear-cache": "A fresh precheck still precedes the deletion.",
        "check-open": "Handles the actual failed operation.",
        "repeat-check": "Deletion can follow the final check.",
        "create-mode": "Violates the no-recreation requirement."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.fopen.php",
      "https://www.php.net/manual/en/function.is-readable.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0339",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Transactions, migrations & ORM",
    "subtopic": "pdo-mysql-ddl-implicit-commit",
    "objective": {
      "id": "pdo-mysql-ddl-implicit-commit",
      "text": "Remove implicit-commit DDL from a PHP business transaction that promises rollback of its writes."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Recognize that a PHP transaction wrapper cannot override the database statement’s commit semantics."
    },
    "prerequisites": [
      "MySQL schema operations",
      "Transaction boundaries",
      "PDO transaction control"
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
        "PDO connects to MySQL 8.4 with InnoDB tables. A handler begins a transaction, inserts an order, executes a successful ALTER TABLE on that table, then encounters a business validation failure and attempts rollback. The schema alteration is a deployment concern, not a per-order requirement. A rejected order must leave no inserted row. No SQL is executed during validation of this question."
      ],
      "files": []
    },
    "stem": "The order row remains despite the attempted rollback. Which repair addresses the transaction boundary that caused this result?",
    "options": [
      {
        "id": "catch-earlier",
        "text": "Catch the business exception before calling rollBack, keeping ALTER TABLE in the transaction.",
        "rationale": "Catching the PHP exception does not undo a commit already caused by ALTER TABLE.",
        "misconception": "Assuming exception timing controls the database’s implicit commit."
      },
      {
        "id": "autocommit-off",
        "text": "Set autocommit to zero before the same sequence and keep the ALTER TABLE statement.",
        "rationale": "MySQL DDL implicit-commit behavior is not disabled by that autocommit setting.",
        "misconception": "Treating autocommit configuration as permission to roll back every SQL statement."
      },
      {
        "id": "separate-schema",
        "text": "Apply the schema change separately; keep only the business writes and validation in this transaction.",
        "rationale": "Removing implicit-commit DDL lets a failed business operation roll back its InnoDB writes.",
        "misconception": null
      },
      {
        "id": "rollback-twice",
        "text": "Call rollBack twice after the validation failure to undo both the insert and ALTER TABLE.",
        "rationale": "Repeated rollback calls cannot reverse an already committed insert.",
        "misconception": "Treating rollback as an undo stack for completed transactions."
      }
    ],
    "correctOptionId": "separate-schema",
    "explanation": {
      "summary": "ALTER TABLE causes an implicit commit in the stated MySQL configuration. The earlier insert is therefore no longer protected by the application’s later rollback attempt.",
      "trace": "Separating deployment DDL from the order unit of work leaves the insert pending until business validation succeeds or the transaction is rolled back."
    },
    "validation": {
      "kind": "document-review",
      "rule": "MySQL 8.4 ALTER TABLE causes implicit commits; ordinary InnoDB business writes can be rolled back only while their transaction remains uncommitted.",
      "optionAudit": {
        "catch-earlier": "Does not reverse the DDL-triggered commit.",
        "autocommit-off": "Does not disable implicit commits for ALTER TABLE.",
        "separate-schema": "Removes the committing statement from the business unit of work.",
        "rollback-twice": "Cannot undo a completed commit."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-16"
    },
    "references": [
      "https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html",
      "https://www.php.net/manual/en/pdo.transactions.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0340",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Errors & exceptions",
    "subtopic": "error-handler-default-propagation-return",
    "objective": {
      "id": "error-handler-default-propagation-return",
      "text": "Mark a user warning as handled without throwing or invoking PHP’s default diagnostic handler."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a handler’s boolean protocol from severity classification and exception conversion."
    },
    "prerequisites": [
      "set_error_handler return contract",
      "E_USER_WARNING versus E_WARNING",
      "ErrorException"
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
          "source": "<?php\n\n$events = [];\n\nset_error_handler(static function (int $severity, string $message) use (&$events): bool {\n    $events[] = 'handled';\n\n    return false;\n});\n\ntry {\n    trigger_error('fixture warning', E_USER_WARNING);\n    $events[] = 'after';\n} catch (ErrorException $failure) {\n    $events[] = 'caught';\n} finally {\n    restore_error_handler();\n}\n\necho json_encode($events);\n"
        }
      ]
    },
    "stem": "The handler must record handled, let execution append after, and emit no default warning. Which replacement for its return statement produces [\"handled\",\"after\"] with no diagnostic?",
    "options": [
      {
        "id": "handled",
        "text": "return true;",
        "rationale": "A true return tells PHP the warning was handled and allows ordinary execution to continue.",
        "misconception": null
      },
      {
        "id": "default",
        "text": "return false;",
        "rationale": "False delegates to PHP’s default handler, which emits the warning.",
        "misconception": "Assuming false means the error itself was false or dismissed."
      },
      {
        "id": "exception",
        "text": "throw new ErrorException($message, 0, $severity);",
        "rationale": "Throwing transfers control to the catch, so after is not appended.",
        "misconception": "Equating handled diagnostics with exception-based control flow."
      },
      {
        "id": "wrong-severity",
        "text": "return $severity === E_WARNING;",
        "rationale": "trigger_error supplies E_USER_WARNING, so this comparison returns false and delegates.",
        "misconception": "Treating user-generated warnings as the same constant as engine warnings."
      }
    ],
    "correctOptionId": "handled",
    "explanation": {
      "summary": "The handler’s false return means the standard error handler should run. Returning true marks this warning as handled while preserving normal control flow.",
      "trace": "The callback appends handled and returns true; trigger_error then returns and the caller appends after. Throwing would select caught instead."
    },
    "validation": {
      "kind": "patch",
      "marker": "return false;",
      "stdout": "[\"handled\",\"after\"]",
      "original": {
        "stdout": "[\"handled\",\"after\"]",
        "error": {
          "message": "fixture warning",
          "exitCode": 0
        }
      },
      "errors": {
        "default": {
          "message": "fixture warning",
          "exitCode": 0
        },
        "wrong-severity": {
          "message": "fixture warning",
          "exitCode": 0
        }
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/function.set-error-handler.php",
      "https://www.php.net/manual/en/function.trigger-error.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0341",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "base64-stream-filter-chunk-state",
    "objective": {
      "id": "base64-stream-filter-chunk-state",
      "text": "Preserve base64 encoder state across arbitrary input chunks when writing an encoded file."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Account for encoding block boundaries, filter direction and final flush without buffering the entire input."
    },
    "prerequisites": [
      "PHP stream filters (advanced)",
      "Base64 groups and padding",
      "Filter flush/removal",
      "Chunked writes"
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
        "The chunks form one logical byte sequence and may split base64 groups anywhere. The function must write one continuous base64 encoding to the underlying regular file without concatenating all chunks in memory. All local I/O and filter operations succeed. The final read opens the file independently, without any filter."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$chunks = ['A', 'BC', 'D'];\n$path = __DIR__ . '/encoded.txt';\n$handle = fopen($path, 'w+b');\n\nforeach ($chunks as $chunk) {\n    fwrite($handle, base64_encode($chunk));\n}\n\nfclose($handle);\necho file_get_contents($path);\n"
        }
      ]
    },
    "stem": "The existing per-chunk encoding inserts padding in the middle of the stored data. Which replacement block stores QUJDRA== for the chunks A, BC and D?",
    "options": [
      {
        "id": "per-chunk",
        "text": "foreach ($chunks as $chunk) {\n    fwrite($handle, base64_encode($chunk));\n}",
        "rationale": "Each call finalizes and pads its own independent encoding.",
        "misconception": "Assuming concatenating independently padded encodings equals encoding the concatenated input."
      },
      {
        "id": "reset-filter",
        "text": "foreach ($chunks as $chunk) {\n    $filter = stream_filter_append($handle, 'convert.base64-encode', STREAM_FILTER_WRITE);\n    fwrite($handle, $chunk);\n    stream_filter_remove($filter);\n}",
        "rationale": "Removing the filter after every chunk flushes and pads each separate sequence.",
        "misconception": "Assuming changing to a filter helps even when its state is reset at every chunk."
      },
      {
        "id": "read-filter",
        "text": "$filter = stream_filter_append($handle, 'convert.base64-encode', STREAM_FILTER_READ);\n\nforeach ($chunks as $chunk) {\n    fwrite($handle, $chunk);\n}\n\nstream_filter_remove($filter);",
        "rationale": "A read filter does not encode writes, and the later independent file read has no filter.",
        "misconception": "Applying the transformation to the wrong direction of the stream."
      },
      {
        "id": "continuous-filter",
        "text": "$filter = stream_filter_append($handle, 'convert.base64-encode', STREAM_FILTER_WRITE);\n\nforeach ($chunks as $chunk) {\n    fwrite($handle, $chunk);\n}\n\nstream_filter_remove($filter);",
        "rationale": "One write filter carries partial groups across chunks and flushes its final padding only when removed.",
        "misconception": null
      }
    ],
    "correctOptionId": "continuous-filter",
    "explanation": {
      "summary": "Base64 encoding has cross-chunk state. A single write filter retains incomplete groups between writes; final removal flushes the last group into the underlying file.",
      "trace": "The filter processes ABC as a complete group and D as the final padded group, storing QUJDRA==. Resetting the encoder per chunk produces separate padded segments."
    },
    "validation": {
      "kind": "patch",
      "marker": "foreach ($chunks as $chunk) {\n    fwrite($handle, base64_encode($chunk));\n}",
      "stdout": "QUJDRA==",
      "original": {
        "stdout": "QQ==QkM=RA=="
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/filters.convert.php",
      "https://www.php.net/manual/en/function.stream-filter-remove.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0342",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Validation & web security",
    "subtopic": "archive-canonical-destination-collision",
    "objective": {
      "id": "archive-canonical-destination-collision",
      "text": "Detect archive entries that map to the same destination despite distinct original names."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Apply a destination normalization policy without over-rejecting valid internal parent segments or distinct directories."
    },
    "prerequisites": [
      "Archive manifest preflight",
      "Lexical path normalization",
      "Collision detection",
      "Write-before-validation hazards"
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
        "A custom PHP archive importer uses forward-slash relative entry names. It lexically collapses . and internal .. segments before writing. Escapes above the root, absolute paths and symlinks are already rejected. Valid internal .. segments are allowed. No extraction occurs until every name is validated. Case-sensitive destination names are used. No filesystem race or I/O failure is involved."
      ],
      "files": []
    },
    "stem": "The raw-name duplicate check allows src/../readme.txt and readme.txt to overwrite one destination. It must reject that pair, accept a single src/../readme.txt entry, and accept the pair a/report.txt and b/report.txt. Which repair satisfies all three cases?",
    "options": [
      {
        "id": "reject-parent",
        "text": "Reject every entry whose original name contains a .. segment.",
        "rationale": "This prevents the collision but wrongly rejects the explicitly allowed single internal-parent path.",
        "misconception": "Replacing canonicalization with a stricter policy that contradicts valid inputs."
      },
      {
        "id": "basename",
        "text": "Compare only each entry’s final basename when checking duplicates.",
        "rationale": "The two report.txt entries in different directories would be wrongly rejected.",
        "misconception": "Flattening destination identity to a basename."
      },
      {
        "id": "canonical",
        "text": "Check uniqueness of each complete normalized destination path before any writes.",
        "rationale": "The colliding pair normalizes to one path, while the single path and distinct directories remain valid.",
        "misconception": null
      },
      {
        "id": "raw-case",
        "text": "Compare case-folded raw names instead of their original spelling.",
        "rationale": "Case folding does not collapse src/.., so the actual destination collision remains.",
        "misconception": "Treating case normalization as sufficient path canonicalization."
      }
    ],
    "correctOptionId": "canonical",
    "explanation": {
      "summary": "Uniqueness must be checked in the same destination namespace used for writing. Raw names can differ while normalizing to one path; basenames can match while full destinations remain distinct.",
      "trace": "Both names in the rejected pair normalize to readme.txt. The two report.txt names retain their distinct a and b directory prefixes."
    },
    "validation": {
      "kind": "document-review",
      "rule": "The importer’s stated normalization determines destination identity; uniqueness must be checked over those complete normalized paths before extraction.",
      "optionAudit": {
        "reject-parent": "Rejects the required valid single-entry case.",
        "basename": "Rejects two valid different-directory destinations.",
        "canonical": "Rejects exactly the collision while preserving both valid cases.",
        "raw-case": "Leaves the internal-parent alias unresolved."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://owasp.org/www-community/attacks/Path_Traversal",
      "https://www.php.net/manual/en/class.ziparchive.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0343",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Validation & web security",
    "subtopic": "webhook-mac-exact-body-representation",
    "objective": {
      "id": "webhook-mac-exact-body-representation",
      "text": "Repair signature verification that changes a request body before authenticating its bytes."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish semantic JSON equivalence from the exact byte sequence covered by a message authentication code."
    },
    "prerequisites": [
      "HMAC verification",
      "Raw HTTP request bodies",
      "JSON representation",
      "hash_equals"
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
        "The sender signs the exact UTF-8 body bytes, including surrounding whitespace, using HMAC-SHA-256. The shared key and received MAC are trusted fixture values; replay and key-management policy are outside this question. No real HTTP request or external secret is used."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$key = 'local-fixture-key';\n$raw = ' {\"b\":2, \"a\":1}' . chr(10);\n$receivedMac = 'ca0cf89004a76ddb5ab3e01512049e368838d28cf0c1bbf898e60b6f54711877';\n\n$signedBytes = json_encode(json_decode($raw, true, 512, JSON_THROW_ON_ERROR), JSON_THROW_ON_ERROR);\n$computedMac = hash_hmac('sha256', $signedBytes, $key);\n\necho json_encode(hash_equals($receivedMac, $computedMac));\n"
        }
      ]
    },
    "stem": "This valid fixture fails verification because the receiver transforms the body. Which bytes should replace the signedBytes assignment to respect the sender’s stated protocol?",
    "options": [
      {
        "id": "trimmed",
        "text": "The raw body after trimming its leading and trailing whitespace bytes.",
        "rationale": "Those bytes are explicitly covered by the sender’s MAC and cannot be removed.",
        "misconception": "Assuming JSON-insignificant surrounding whitespace is also insignificant to HMAC."
      },
      {
        "id": "raw",
        "text": "The exact raw body as received, including its surrounding whitespace.",
        "rationale": "This is the same byte sequence the sender authenticated.",
        "misconception": null
      },
      {
        "id": "json",
        "text": "The decoded JSON value encoded again with PHP’s default compact formatting.",
        "rationale": "Re-encoding changes spacing and may change other representational details while retaining the same data.",
        "misconception": "Assuming semantically equivalent JSON necessarily has an identical MAC."
      },
      {
        "id": "serialized",
        "text": "The decoded JSON value converted to PHP’s native serialized representation.",
        "rationale": "PHP serialization is a different wire representation from the sender’s JSON body.",
        "misconception": "Treating an unambiguous local serialization as interchangeable with the signed protocol bytes."
      }
    ],
    "correctOptionId": "raw",
    "explanation": {
      "summary": "A MAC authenticates bytes, not an abstract JSON value. Verification must use the sender’s exact representation; parsing may occur afterward for application processing.",
      "trace": "The fixture body contains a leading space, an internal space and a terminal newline. Passing raw unchanged verifies; trimming or serializing changes the authenticated bytes."
    },
    "validation": {
      "kind": "patch",
      "marker": "json_encode(json_decode($raw, true, 512, JSON_THROW_ON_ERROR), JSON_THROW_ON_ERROR)",
      "candidates": {
        "trimmed": "trim($raw)",
        "raw": "$raw",
        "json": "json_encode(json_decode($raw, true, 512, JSON_THROW_ON_ERROR), JSON_THROW_ON_ERROR)",
        "serialized": "serialize(json_decode($raw, true, 512, JSON_THROW_ON_ERROR))"
      },
      "stdout": "true",
      "original": {
        "stdout": "false"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.hash-hmac.php",
      "https://www.php.net/manual/en/function.hash-equals.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0344",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Performance, processes & servers",
    "subtopic": "monotonic-budget-clock-and-unit",
    "objective": {
      "id": "monotonic-budget-clock-and-unit",
      "text": "Compute a remaining elapsed-time budget from monotonic nanoseconds rather than adjustable wall-clock time."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine clock semantics, unit conversion and nonnegative deadline handling."
    },
    "prerequisites": [
      "microtime versus hrtime",
      "Monotonic elapsed time",
      "Nanoseconds and milliseconds",
      "Integer division"
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
        "The caller measures both elapsed wall-clock seconds with microtime(true) and elapsed monotonic nanoseconds with hrtime(true). The fixtures provide exact whole-millisecond monotonic durations, so rounding policy is irrelevant. Remaining budgets must be clamped at zero."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction remaining(int $budget, float $wallSeconds, int $monotonicNanoseconds): int\n{\n    return max(0, $budget - (int) ($wallSeconds * 1000));\n}\n\necho json_encode([\n    remaining(200, -5.0, 75_000_000),\n    remaining(200, 0.25, 250_000_000),\n]);\n"
        }
      ]
    },
    "stem": "The first operation consumed 75 ms while the wall clock moved backward; the second consumed 250 ms. Which expression repairs the two 200 ms budgets to produce [125,0]?",
    "options": [
      {
        "id": "wall",
        "text": "max(0, $budget - (int) ($wallSeconds * 1000))",
        "rationale": "A backward clock adjustment increases the apparent remaining budget.",
        "misconception": "Using wall-clock differences as elapsed-time measurements."
      },
      {
        "id": "wall-cap",
        "text": "max(0, min($budget, $budget - (int) ($wallSeconds * 1000)))",
        "rationale": "Capping the result at the original budget still forgets the 75 ms already consumed.",
        "misconception": "Assuming bounds checking can repair a measurement from the wrong clock."
      },
      {
        "id": "micro-units",
        "text": "max(0, $budget - intdiv($monotonicNanoseconds, 1_000))",
        "rationale": "Dividing by 1,000 produces microseconds, which cannot be subtracted from a millisecond budget.",
        "misconception": "Choosing the correct clock but mixing duration units."
      },
      {
        "id": "monotonic",
        "text": "max(0, $budget - intdiv($monotonicNanoseconds, 1_000_000))",
        "rationale": "The monotonic elapsed duration is converted to milliseconds and subtracted before clamping.",
        "misconception": null
      }
    ],
    "correctOptionId": "monotonic",
    "explanation": {
      "summary": "Elapsed deadlines require a monotonic measurement. Converting nanoseconds to milliseconds uses 1,000,000 nanoseconds per millisecond; clamping then prevents negative remaining time.",
      "trace": "75,000,000 ns is 75 ms, leaving 125. 250,000,000 ns exceeds the 200 ms budget, leaving zero."
    },
    "validation": {
      "kind": "patch",
      "marker": "max(0, $budget - (int) ($wallSeconds * 1000))",
      "stdout": "[125,0]",
      "original": {
        "stdout": "[5200,0]"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://www.php.net/manual/en/function.hrtime.php",
      "https://www.php.net/manual/en/function.microtime.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0345",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Types, casting & comparisons",
    "subtopic": "pcre-offset-byte-character-boundary",
    "objective": {
      "id": "pcre-offset-byte-character-boundary",
      "text": "Use a regex capture offset with an API that interprets the same byte units."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace a Unicode-aware match whose reported offset remains a byte offset and can be misused as a character count."
    },
    "prerequisites": [
      "UTF-8 variable-width encoding",
      "PREG_OFFSET_CAPTURE",
      "PCRE Unicode mode",
      "Byte versus character slicing"
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
        "The displayed source is UTF-8. Every input is valid UTF-8 and contains tag exactly once. The function must return the original bytes before that match. JSON_THROW_ON_ERROR exposes invalid UTF-8 created by an incorrect slice."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction prefixBeforeTag(string $text): string\n{\n    preg_match('/tag/u', $text, $matches, PREG_OFFSET_CAPTURE);\n    $offset = $matches[0][1];\n\n    return implode('', array_slice(preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY), 0, $offset));\n}\n\ntry {\n    echo json_encode([\n        prefixBeforeTag('😀tag!'),\n        prefixBeforeTag('é😀tag!'),\n    ], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);\n} catch (JsonException $failure) {\n    echo 'invalid-utf8';\n}\n"
        }
      ]
    },
    "stem": "Which return expression produces the JSON pair containing only the prefixes 😀 and é😀, without a decoding error?",
    "options": [
      {
        "id": "bytes",
        "text": "substr($text, 0, $offset)",
        "rationale": "The captured offset is measured in bytes, matching substr’s length unit.",
        "misconception": null
      },
      {
        "id": "characters",
        "text": "implode('', array_slice(preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY), 0, $offset))",
        "rationale": "This treats byte counts 4 and 6 as numbers of Unicode characters and includes text beyond the match boundary.",
        "misconception": "Assuming /u makes PREG_OFFSET_CAPTURE report character positions."
      },
      {
        "id": "suffix",
        "text": "substr($text, $offset)",
        "rationale": "This starts at the match and returns the suffix rather than the preceding bytes.",
        "misconception": "Using the offset as a starting position instead of a prefix length."
      },
      {
        "id": "match-length",
        "text": "substr($text, 0, strlen($matches[0][0]))",
        "rationale": "The three-byte match length is unrelated to the prefix length and cuts a multibyte character.",
        "misconception": "Confusing the captured text’s length with its starting offset."
      }
    ],
    "correctOptionId": "bytes",
    "explanation": {
      "summary": "PREG_OFFSET_CAPTURE returns byte offsets even with the u modifier. Passing that offset as a byte length to substr preserves the exact prefix boundary.",
      "trace": "The emoji occupies four UTF-8 bytes; é plus the emoji occupies six. Those are the two reported offsets, and substr returns complete prefixes at those byte boundaries."
    },
    "validation": {
      "kind": "patch",
      "marker": "implode('', array_slice(preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY), 0, $offset))",
      "stdout": "[\"😀\",\"é😀\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/function.preg-match.php",
      "https://www.php.net/manual/en/function.substr.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0346",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Classes & object lifecycle",
    "subtopic": "countable-object-empty-semantics",
    "objective": {
      "id": "countable-object-empty-semantics",
      "text": "Review an object emptiness check that is incorrectly assumed to call Countable::count."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish object truthiness from a collection’s explicit size API."
    },
    "prerequisites": [
      "Countable",
      "empty",
      "Object boolean conversion"
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
          "source": "<?php\n\nclass EmptyItems implements Countable\n{\n    public function count(): int\n    {\n        return 0;\n    }\n}\n\n$items = new EmptyItems();\n\necho json_encode([count($items) === 0, empty($items)]);\n"
        }
      ]
    },
    "stem": "A reviewer proposes replacing count($items) === 0 with empty($items). Which assessment matches the displayed zero-item collection?",
    "options": [
      {
        "id": "equivalent",
        "text": "Both checks return true because empty calls the Countable method.",
        "rationale": "empty does not delegate to Countable::count.",
        "misconception": "Assuming a collection size interface changes boolean conversion."
      },
      {
        "id": "count-fails",
        "text": "count throws TypeError because the value is an object rather than an array.",
        "rationale": "The class implements Countable, which count explicitly supports.",
        "misconception": "Ignoring the object protocol accepted by count."
      },
      {
        "id": "different",
        "text": "The count check is true, but empty is false because this object is truthy.",
        "rationale": "The explicit size is zero while the object itself remains a truthy value.",
        "misconception": null
      },
      {
        "id": "both-false",
        "text": "The count check is true, but empty raises TypeError because it accepts arrays and strings rather than objects.",
        "rationale": "empty accepts object expressions. It applies truthiness rather than Countable and returns false here without a TypeError.",
        "misconception": "Restricting the accepted operand types of empty to container-like built-in values."
      }
    ],
    "correctOptionId": "different",
    "explanation": {
      "summary": "Countable controls the count function, not empty or ordinary boolean conversion. For this user-defined object, size zero does not make the object falsey.",
      "trace": "count invokes the method and returns zero; empty evaluates the object’s truthiness and returns false."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[true,false]",
      "keyEvidence": "The same instance reports zero through Countable but remains truthy.",
      "counterexamples": {
        "equivalent": "The observed empty result is false.",
        "count-fails": "The Countable object is accepted and returns zero.",
        "both-false": "empty accepts the object and returns false; execution completes normally."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/class.countable.php",
      "https://www.php.net/manual/en/function.empty.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0347",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Arrays & destructuring",
    "subtopic": "foreach-append-value-versus-reference",
    "objective": {
      "id": "foreach-append-value-versus-reference",
      "text": "Review a foreach reference change that alters whether newly appended entries are visited."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace structural mutation during iteration rather than only the value of the loop variable."
    },
    "prerequisites": [
      "foreach by value and by reference",
      "Array append",
      "Loop reference cleanup"
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
          "source": "<?php\n\n$items = [1, 2];\n$seen = [];\n\nforeach ($items as $value) {\n    $seen[] = $value;\n\n    if ($value === 1) {\n        $items[] = 3;\n    }\n}\n\nunset($value);\necho json_encode([$seen, $items]);\n"
        }
      ]
    },
    "stem": "A reviewer adds & before value in foreach as a performance-only change. Which assessment matches this fixture? The explicit unset remains in both versions.",
    "options": [
      {
        "id": "same",
        "text": "Both versions visit [1,2] and leave items as [1,2,3].",
        "rationale": "The by-reference traversal also reaches the appended entry.",
        "misconception": "Assuming reference iteration changes only copying cost."
      },
      {
        "id": "changed",
        "text": "The shown loop visits [1,2]; the reference version also visits the appended 3.",
        "rationale": "By-value traversal does not extend to this appended entry, while by-reference traversal does.",
        "misconception": null
      },
      {
        "id": "both-append",
        "text": "Both versions visit [1,2,3] because the append changes the same array variable.",
        "rationale": "The shown by-value traversal retains its iteration sequence.",
        "misconception": "Assuming every structural change to the variable changes an active by-value traversal."
      },
      {
        "id": "append-lost",
        "text": "The shown loop leaves items as [1,2], while the reference version appends 3.",
        "rationale": "The append to items occurs in both versions even if the new entry is not visited.",
        "misconception": "Confusing whether a mutation occurs with whether iteration visits its result."
      }
    ],
    "correctOptionId": "changed",
    "explanation": {
      "summary": "By-reference foreach can visit entries appended during traversal. That is an observable behavioral change from this by-value loop, even when the final lingering reference is cleared.",
      "trace": "Both versions append 3 while processing 1. The shown loop records only 1 and 2; the reference contrast records 1, 2 and 3."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[[1,2],[1,2,3]]",
      "keyEvidence": "The controlled by-reference contrast visits the appended element.",
      "counterexamples": {
        "same": "The contrast records an extra visited value.",
        "both-append": "The original observed seen array omits 3.",
        "append-lost": "The original items array contains 3."
      },
      "contrasts": [
        {
          "name": "reference-iteration",
          "marker": "foreach ($items as $value)",
          "replacement": "foreach ($items as &$value)",
          "stdout": "[[1,2,3],[1,2,3]]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/control-structures.foreach.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0348",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Classes & object lifecycle",
    "subtopic": "class-constant-versus-instance-property",
    "objective": {
      "id": "class-constant-versus-instance-property",
      "text": "Review an operator change that confuses a class constant with an instance property."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Identify the member namespace selected by double-colon and arrow access."
    },
    "prerequisites": [
      "Class constants",
      "Instance properties",
      "Object-based scope resolution"
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
          "source": "<?php\n\nclass Limits\n{\n    public const RETRIES = 3;\n}\n\n$limits = new Limits();\n$warnings = 0;\n\nset_error_handler(static function () use (&$warnings): bool {\n    $warnings++;\n\n    return true;\n});\n\n$value = $limits::RETRIES;\nrestore_error_handler();\n\necho json_encode([$value, $warnings]);\n"
        }
      ]
    },
    "stem": "A review replaces $limits::RETRIES with $limits->RETRIES because limits holds an object. Which assessment describes that change? The handler counts any undefined-property warning.",
    "options": [
      {
        "id": "same",
        "text": "Both forms read the public class constant and produce [3,0].",
        "rationale": "The arrow form looks for an instance property, not a constant.",
        "misconception": "Assuming public visibility makes all member-access operators interchangeable."
      },
      {
        "id": "constant-error",
        "text": "The double-colon form fails because constants can only be read using a literal class name.",
        "rationale": "PHP permits scope resolution through an object variable.",
        "misconception": "Rejecting object-based class scope resolution."
      },
      {
        "id": "dynamic-copy",
        "text": "The arrow form copies the constant into a new dynamic property and produces [3,0].",
        "rationale": "Reading an absent property does not create a constant-backed property.",
        "misconception": "Assuming constant lookup falls back to dynamic property creation."
      },
      {
        "id": "property-miss",
        "text": "The shown form produces [3,0]; the arrow replacement reads an absent property and produces [null,1].",
        "rationale": "Constants and instance properties use different access mechanisms and storage.",
        "misconception": null
      }
    ],
    "correctOptionId": "property-miss",
    "explanation": {
      "summary": ":: resolves a class constant even when the class is identified by an object. -> selects an instance property; no RETRIES property is declared here.",
      "trace": "The original constant access returns 3 without warnings. The controlled arrow-access contrast returns null and records one warning."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[3,0]",
      "keyEvidence": "The arrow-access contrast yields null and one warning.",
      "counterexamples": {
        "same": "The contrast does not return the constant.",
        "constant-error": "The original object-based :: expression succeeds.",
        "dynamic-copy": "The read yields null and a warning rather than creating a constant copy."
      },
      "contrasts": [
        {
          "name": "arrow-property",
          "marker": "$value = $limits::RETRIES;",
          "replacement": "$value = $limits->RETRIES;",
          "stdout": "[null,1]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.constants.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0349",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "HTTP & superglobals",
    "subtopic": "boolean-output-json-contract",
    "objective": {
      "id": "boolean-output-json-contract",
      "text": "Review direct boolean output at an endpoint that promises a JSON boolean."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish PHP’s string conversion for echo from JSON serialization."
    },
    "prerequisites": [
      "echo boolean conversion",
      "JSON boolean literals"
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
          "source": "<?php\n\n$valid = false;\n\nob_start();\necho $valid;\n$direct = ob_get_clean();\n$encoded = json_encode($valid);\n\necho json_encode([$direct, $encoded]);\n"
        }
      ]
    },
    "stem": "A JSON endpoint proposes replacing json_encode($valid) with echo $valid directly. For valid=false, which assessment matches the captured strings below?",
    "options": [
      {
        "id": "equivalent",
        "text": "Both forms produce the JSON text false, so the replacement preserves the response.",
        "rationale": "echo converts false to an empty string rather than the JSON literal false.",
        "misconception": "Assuming PHP scalar output automatically uses JSON syntax."
      },
      {
        "id": "invalid-empty",
        "text": "Direct echo produces an empty string; json_encode produces false, so the replacement breaks the JSON body.",
        "rationale": "An empty body is not a JSON boolean value.",
        "misconception": null
      },
      {
        "id": "numeric-zero",
        "text": "Direct echo produces 0, which is the same JSON boolean as false.",
        "rationale": "echo false is empty, and JSON number zero is not JSON boolean false.",
        "misconception": "Applying numeric boolean conversion to echo and conflating JSON number and boolean types."
      },
      {
        "id": "quoted-false",
        "text": "json_encode produces a quoted string false, while echo produces an unquoted boolean.",
        "rationale": "The input is a boolean, so JSON encoding produces the unquoted boolean literal.",
        "misconception": "Confusing encoding a boolean with encoding the string containing its name."
      }
    ],
    "correctOptionId": "invalid-empty",
    "explanation": {
      "summary": "echo follows PHP’s string conversion rules, under which false becomes an empty string. JSON serialization emits the token false for a boolean input.",
      "trace": "The captured direct output is empty; the encoded value is the five-byte text false. The outer diagnostic JSON is [\"\",\"false\"]."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"\",\"false\"]",
      "keyEvidence": "The direct body is empty and the serialized body is the JSON false token.",
      "counterexamples": {
        "equivalent": "The two captured strings differ.",
        "numeric-zero": "No zero byte is printed by echo false.",
        "quoted-false": "The encoded body has no JSON string quotes around false."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/function.echo.php",
      "https://www.php.net/manual/en/function.json-encode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0350",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "concrete-child-abstract-template-method",
    "objective": {
      "id": "concrete-child-abstract-template-method",
      "text": "Review whether a concrete child satisfies an abstract method while inheriting concrete behavior."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Follow a template method’s call into the child implementation without confusing abstract ancestry with abstract child status."
    },
    "prerequisites": [
      "Abstract classes",
      "Protected abstract methods",
      "Inheritance"
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
          "source": "<?php\n\nabstract class Label\n{\n    abstract protected function text(): string;\n\n    public function render(): string\n    {\n        return '[' . $this->text() . ']';\n    }\n}\n\nclass Badge extends Label\n{\n    protected function text(): string\n    {\n        return 'Ada';\n    }\n}\n\necho (new Badge())->render();\n"
        }
      ]
    },
    "stem": "A review claims Badge cannot be instantiated because Label is abstract. Which assessment matches the complete class definitions?",
    "options": [
      {
        "id": "inherited-abstract",
        "text": "Badge remains abstract because every subclass of an abstract class is abstract.",
        "rationale": "A child can be concrete when it implements all inherited abstract requirements.",
        "misconception": "Treating abstract status as automatically inherited even after requirements are implemented."
      },
      {
        "id": "duplicate-render",
        "text": "Badge must redeclare render before it can be instantiated.",
        "rationale": "The concrete public render method is inherited normally.",
        "misconception": "Assuming abstract classes cannot contribute reusable concrete method bodies."
      },
      {
        "id": "concrete",
        "text": "Badge is concrete; inherited render calls its protected text implementation and prints [Ada].",
        "rationale": "The child supplies the required method with compatible visibility and return type.",
        "misconception": null
      },
      {
        "id": "visibility-error",
        "text": "Instantiation succeeds, but render cannot call the protected text method.",
        "rationale": "The inherited method executes in the class hierarchy’s permitted scope.",
        "misconception": "Applying external-call visibility restrictions to a method call within the hierarchy."
      }
    ],
    "correctOptionId": "concrete",
    "explanation": {
      "summary": "An abstract class may provide concrete behavior and require selected methods from its children. Badge implements the sole abstract method, so the inherited render can use that implementation.",
      "trace": "Badge is instantiated. Label::render invokes the overridden text method through this and wraps Ada in brackets."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[Ada]",
      "keyEvidence": "Instantiation and the inherited template call both succeed.",
      "counterexamples": {
        "inherited-abstract": "The child implements the required method and is concrete.",
        "duplicate-render": "The existing concrete method is inherited without redeclaration.",
        "visibility-error": "The protected call is allowed within the hierarchy."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.abstract.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0351",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Classes & object lifecycle",
    "subtopic": "nullsafe-each-nullable-hop",
    "objective": {
      "id": "nullsafe-each-nullable-hop",
      "text": "Review null safety when a nonnull receiver’s method returns null."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish short-circuiting on the receiver from protecting later nullable values."
    },
    "prerequisites": [
      "Nullsafe operator",
      "Nullable method results",
      "Method-call chaining"
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
          "source": "<?php\n\nclass Item\n{\n    public function label(): string\n    {\n        return 'item';\n    }\n}\n\nclass Provider\n{\n    public function find(): ?Item\n    {\n        return null;\n    }\n}\n\n$provider = new Provider();\n\ntry {\n    $label = $provider?->find()->label();\n    echo json_encode($label);\n} catch (Error $failure) {\n    echo 'Error';\n}\n"
        }
      ]
    },
    "stem": "A review claims the first ?-> makes the whole expression safe whenever find returns null. Which assessment matches this nonnull provider?",
    "options": [
      {
        "id": "whole-chain",
        "text": "The expression returns null because any null anywhere in a chain is protected by its first ?->.",
        "rationale": "The first receiver is nonnull, and the later ordinary arrow is applied to find’s null result.",
        "misconception": "Treating one nullsafe operator as a global policy for every later nullable hop."
      },
      {
        "id": "getter-skipped",
        "text": "find is not called because its declared return type is nullable.",
        "rationale": "Nullsafe dispatch tests the receiver value, not whether a return type permits null.",
        "misconception": "Confusing nullable metadata with an actual null receiver."
      },
      {
        "id": "later-hop",
        "text": "The ordinary label call raises Error; changing it to ?->label() also protects find’s nullable result.",
        "rationale": "The second nullable boundary needs its own nullsafe operator.",
        "misconception": null
      },
      {
        "id": "default-object",
        "text": "The file has a syntax error because ?-> and -> cannot appear in the same call chain.",
        "rationale": "PHP permits mixed nullsafe and ordinary arrows. The file parses, but the ordinary second hop calls a method on null.",
        "misconception": "Mistaking an unsafe nullable hop for invalid chain syntax."
      }
    ],
    "correctOptionId": "later-hop",
    "explanation": {
      "summary": "Nullsafe short-circuiting occurs when the receiver of a ?-> operation is null. Here the provider exists, so find runs and returns null to an unprotected ordinary method call.",
      "trace": "The original prints Error. A second ?-> at the result boundary instead makes the expression evaluate to null."
    },
    "validation": {
      "kind": "contract",
      "stdout": "Error",
      "keyEvidence": "The second-hop contrast returns null without an Error.",
      "counterexamples": {
        "whole-chain": "The original reaches the catch.",
        "getter-skipped": "The existing provider invokes find normally.",
        "default-object": "The complete file parses and its runtime Error is caught; this is not a parse failure."
      },
      "contrasts": [
        {
          "name": "protect-second-hop",
          "marker": "$provider?->find()->label()",
          "replacement": "$provider?->find()?->label()",
          "stdout": "null"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.basic.php#language.oop5.basic.nullsafe"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0352",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Arrays & destructuring",
    "subtopic": "recursive-merge-scalar-collision-shape",
    "objective": {
      "id": "recursive-merge-scalar-collision-shape",
      "text": "Review a recursive merge that changes a scalar configuration field into an array."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace type shape at a string-key collision rather than assuming all merge APIs implement overriding."
    },
    "prerequisites": [
      "array_merge_recursive",
      "Nested associative arrays",
      "Scalar versus array configuration"
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
          "source": "<?php\n\n$base = ['network' => ['timeout' => 10, 'retries' => 2]];\n$override = ['network' => ['timeout' => 20]];\n$result = array_merge_recursive($base, $override);\n\necho json_encode($result);\n"
        }
      ]
    },
    "stem": "A review says array_merge_recursive implements latest-value-wins for the nested timeout setting. Which assessment matches this result?",
    "options": [
      {
        "id": "latest",
        "text": "timeout becomes integer 20 while retries remains integer 2.",
        "rationale": "That describes recursive replacement, not this recursive merging operation.",
        "misconception": "Assuming merge_recursive overwrites scalar string-key collisions."
      },
      {
        "id": "first",
        "text": "timeout stays integer 10 because the base array is on the left.",
        "rationale": "Recursive merge combines the colliding values rather than preserving only the left scalar.",
        "misconception": "Applying array union’s left-precedence behavior to recursive merge."
      },
      {
        "id": "top-list",
        "text": "network becomes a two-entry list containing the complete original network arrays.",
        "rationale": "The function recurses into the shared network key and merges its fields.",
        "misconception": "Assuming a nested collision always wraps the complete parent arrays."
      },
      {
        "id": "combined",
        "text": "timeout becomes [10,20] while retries stays 2, violating a scalar-timeout contract.",
        "rationale": "The colliding scalar values at the string key are combined into an array.",
        "misconception": null
      }
    ],
    "correctOptionId": "combined",
    "explanation": {
      "summary": "array_merge_recursive combines values at colliding string keys. It can therefore change a scalar leaf into an array, which differs from overriding configuration values.",
      "trace": "network is merged recursively; timeout collects 10 and 20, while the noncolliding retries field remains 2."
    },
    "validation": {
      "kind": "contract",
      "stdout": "{\"network\":{\"timeout\":[10,20],\"retries\":2}}",
      "keyEvidence": "The timeout leaf is an array containing both scalar values.",
      "counterexamples": {
        "latest": "The observed timeout is not scalar 20.",
        "first": "Both timeout values are retained.",
        "top-list": "The network object retains named fields rather than becoming a parent list."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-merge-recursive.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0353",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Arrays & destructuring",
    "subtopic": "array-walk-key-rename-assumption",
    "objective": {
      "id": "array-walk-key-rename-assumption",
      "text": "Review a callback that changes its local key parameter without renaming source array keys."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish the by-reference value parameter from the key value supplied to a callback."
    },
    "prerequisites": [
      "array_walk callback parameters",
      "Reference parameters",
      "Associative array keys"
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
          "source": "<?php\n\n$scores = ['ADA' => 1, 'LIN' => 2];\n\narray_walk($scores, static function (int &$value, string $key): void {\n    $value++;\n    $key = strtolower($key);\n});\n\necho json_encode($scores);\n"
        }
      ]
    },
    "stem": "A review claims this callback both increments values and lowercases the source keys. Which assessment matches the actual array?",
    "options": [
      {
        "id": "value-only",
        "text": "The values increase, but keys remain ADA and LIN; assigning the local key does not rename entries.",
        "rationale": "Only the value parameter is bound to source storage in this callback.",
        "misconception": null
      },
      {
        "id": "both",
        "text": "The result is {\"ada\":2,\"lin\":3} because both callback arguments identify source entries.",
        "rationale": "The key parameter is a local value, not a writable key binding.",
        "misconception": "Assuming access to a key argument implies in-place renaming support."
      },
      {
        "id": "neither",
        "text": "Neither keys nor values change because callback parameters are always copies.",
        "rationale": "The explicit value reference permits the increments to change the source array.",
        "misconception": "Ignoring the by-reference value parameter."
      },
      {
        "id": "key-only",
        "text": "Keys become lowercase, but the increments affect only local integers.",
        "rationale": "This reverses the actual reference behavior: values are referenced and keys are not.",
        "misconception": "Assigning mutability to the identifying key rather than to the declared reference parameter."
      }
    ],
    "correctOptionId": "value-only",
    "explanation": {
      "summary": "array_walk permits in-place value changes through a reference parameter. Its key argument tells the callback which entry it is visiting; assigning that local variable does not rename the entry.",
      "trace": "The values become 2 and 3. The source keys are still ADA and LIN, so key transformation would require an explicit rebuilt mapping."
    },
    "validation": {
      "kind": "contract",
      "stdout": "{\"ADA\":2,\"LIN\":3}",
      "keyEvidence": "The output has incremented values under unchanged uppercase keys.",
      "counterexamples": {
        "both": "The uppercase keys remain.",
        "neither": "Both source values changed.",
        "key-only": "The actual changes are the opposite: values change, keys do not."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-walk.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0354",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "namespace-imports-local-to-file",
    "objective": {
      "id": "namespace-imports-local-to-file",
      "text": "Review an imported alias incorrectly assumed to be shared by files declaring the same namespace."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate namespace membership from the lexical import table of each source file."
    },
    "prerequisites": [
      "Namespaces",
      "use aliases",
      "Included PHP files"
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
          "source": "<?php\n\nnamespace App;\n\nuse DateTimeImmutable as Clock;\n\nrequire __DIR__ . '/dates.php';\n\ntry {\n    echo makeDate()->format('Y-m-d');\n} catch (\\Error $failure) {\n    echo 'Error';\n}\n"
        },
        {
          "path": "dates.php",
          "kind": "complete-file",
          "source": "<?php\n\nnamespace App;\n\nfunction makeDate(): object\n{\n    return new Clock('2025-01-01');\n}\n"
        }
      ]
    },
    "stem": "A review says dates.php can use Clock because main.php imported it and both files declare App. Which assessment matches the program?",
    "options": [
      {
        "id": "shared",
        "text": "The import applies to every file in App, so the program prints 2025-01-01.",
        "rationale": "Import aliases are local to the file where they are declared.",
        "misconception": "Treating a namespace as a shared mutable import registry."
      },
      {
        "id": "include-inherits",
        "text": "The included file inherits the caller’s imports because require executes at that location.",
        "rationale": "Inclusion does not transfer the caller’s lexical name-resolution table.",
        "misconception": "Confusing include execution scope with compile-time import scope."
      },
      {
        "id": "file-local",
        "text": "dates.php resolves App\\Clock and raises Error; it needs its own import or a qualified class name.",
        "rationale": "The helper file has no Clock alias, despite sharing the namespace name.",
        "misconception": null
      },
      {
        "id": "global-fallback",
        "text": "Class lookup falls back from App\\Clock to the global DateTimeImmutable alias automatically.",
        "rationale": "Class lookup does not search another file’s alias table or infer its alias target.",
        "misconception": "Applying function-style fallback or cross-file alias lookup to class names."
      }
    ],
    "correctOptionId": "file-local",
    "explanation": {
      "summary": "Namespace imports are lexical declarations within a source file. Declaring the same namespace in another file does not share its use statements.",
      "trace": "The helper tries App\\Clock, which is undefined. Adding the same import inside dates.php lets the controlled contrast print the expected date."
    },
    "validation": {
      "kind": "contract",
      "stdout": "Error",
      "keyEvidence": "The helper-local import contrast succeeds while the original fails.",
      "counterexamples": {
        "shared": "The original has no usable Clock alias in dates.php.",
        "include-inherits": "Requiring the file does not copy imports.",
        "global-fallback": "No fallback maps Clock to DateTimeImmutable."
      },
      "contrasts": [
        {
          "name": "helper-import",
          "marker": "namespace App;\n\nfunction makeDate",
          "replacement": "namespace App;\n\nuse DateTimeImmutable as Clock;\n\nfunction makeDate",
          "stdout": "2025-01-01"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://www.php.net/manual/en/language.namespaces.importing.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0355",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "HTTP & superglobals",
    "subtopic": "redirect-method-preservation-review",
    "objective": {
      "id": "redirect-method-preservation-review",
      "text": "Review a redirect status against a requirement to preserve the original POST method and body."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish preserving a request’s method and body from redirecting to retrieval of a result resource."
    },
    "prerequisites": [
      "HTTP 303 and 307",
      "Location header",
      "POST/Redirect/GET"
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
        "A PHP endpoint has successfully processed a POST. It sends Location: /receipt with status 307. The browser follows redirects normally. The intended follow-up is retrieval of the receipt, not repeating the POST and its body at /receipt. No HTTP response is sent during question validation."
      ],
      "files": []
    },
    "stem": "A review calls 307 a safe implementation of the intended redirect flow. Which assessment follows the status-code semantics?",
    "options": [
      {
        "id": "always-get",
        "text": "307 converts POST to GET, so the receipt receives a retrieval request.",
        "rationale": "307 preserves the request method and body on automatic redirection.",
        "misconception": "Treating every redirect as a method-changing redirect."
      },
      {
        "id": "see-other",
        "text": "307 preserves POST; use 303 See Other for the intended retrieval of the receipt.",
        "rationale": "303 directs the client to retrieve another resource instead of replaying the original POST.",
        "misconception": null
      },
      {
        "id": "drop-body",
        "text": "307 keeps the POST method but removes its body, which is equivalent to GET for this flow.",
        "rationale": "307 does not define that body-dropping conversion, and POST without a body is still POST.",
        "misconception": "Equating an empty body with safe-method semantics."
      },
      {
        "id": "permanent",
        "text": "Changing 307 to 308 would convert the follow-up to GET while preserving the same target.",
        "rationale": "308 also preserves the method; its permanent status does not supply the desired method change.",
        "misconception": "Confusing permanence with request-method conversion."
      }
    ],
    "correctOptionId": "see-other",
    "explanation": {
      "summary": "307 is a method-preserving redirect. A successful POST that should lead to viewing a separate receipt uses the retrieval semantics of 303 See Other.",
      "trace": "With 307, the follow-up remains POST /receipt with its body. With the intended 303 flow, the browser retrieves /receipt instead."
    },
    "validation": {
      "kind": "document-review",
      "rule": "RFC 9110 defines 307 method preservation and 303 retrieval of another resource following the original request.",
      "optionAudit": {
        "always-get": "Contradicts 307 method preservation.",
        "see-other": "Selects the retrieval redirect semantics required by the scenario.",
        "drop-body": "Invents a body-dropping POST conversion.",
        "permanent": "308 does not change POST into GET."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc9110.html#section-15.4.4",
      "https://www.rfc-editor.org/rfc/rfc9110.html#section-15.4.8"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0356",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Arrays & destructuring",
    "subtopic": "recursive-walk-does-not-visit-containers",
    "objective": {
      "id": "recursive-walk-does-not-visit-containers",
      "text": "Review validation that assumes array_walk_recursive invokes its callback on array containers."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish visiting scalar leaves from visiting every node in a nested structure."
    },
    "prerequisites": [
      "array_walk_recursive",
      "Nested arrays",
      "Container validation"
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
          "source": "<?php\n\n$tree = [\n    'empty' => [],\n    'person' => ['name' => 'Ada'],\n];\n$violations = [];\n\narray_walk_recursive($tree, static function (mixed $value, string $key) use (&$violations): void {\n    if (is_array($value) && $value === []) {\n        $violations[] = $key;\n    }\n});\n\necho json_encode($violations);\n"
        }
      ]
    },
    "stem": "A review says this callback detects every empty array in the input tree. Which assessment matches the returned violations list?",
    "options": [
      {
        "id": "empty-detected",
        "text": "The callback receives the empty array and records empty as a violation.",
        "rationale": "Recursive walking does not invoke the callback for array containers, including empty arrays.",
        "misconception": "Assuming recursive means every container is passed to the callback."
      },
      {
        "id": "all-containers",
        "text": "Both empty and person are recorded because each is an array container.",
        "rationale": "Neither array container is passed, and person would not satisfy the empty test anyway.",
        "misconception": "Treating a recursive leaf walk as a container enumeration."
      },
      {
        "id": "null-container",
        "text": "The empty array is converted to null, so is_array rejects a value that was visited.",
        "rationale": "No callback invocation is made for that empty container; there is no null conversion.",
        "misconception": "Inventing a placeholder leaf for an empty array."
      },
      {
        "id": "leaves-only",
        "text": "The list is empty; the callback visits Ada but no array containers, so container checks need another traversal.",
        "rationale": "The only visited value is the scalar leaf, which cannot satisfy the array predicate.",
        "misconception": null
      }
    ],
    "correctOptionId": "leaves-only",
    "explanation": {
      "summary": "array_walk_recursive descends into nested arrays and applies the callback to their non-array entries. It is not a visitor for the array containers themselves.",
      "trace": "The empty branch has no leaf to visit. The name leaf contains Ada, so the is_array test is false and no violation is recorded."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[]",
      "keyEvidence": "The callback never receives the empty array container.",
      "counterexamples": {
        "empty-detected": "No empty key is recorded.",
        "all-containers": "Array containers are not callback values.",
        "null-container": "There is no callback value for the empty branch."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-walk-recursive.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0357",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "PDO & database access",
    "subtopic": "pdo-select-rowcount-not-result-count",
    "objective": {
      "id": "pdo-select-rowcount-not-result-count",
      "text": "Review a SELECT emptiness check based on PDOStatement::rowCount."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate affected-row reporting from the number of rows available in a result set."
    },
    "prerequisites": [
      "PDOStatement::rowCount",
      "SELECT results",
      "Driver-specific behavior"
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
        "The fixture uses PDO SQLite in memory. No other connection exists. The broader application supports multiple PDO drivers."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n$pdo->exec('CREATE TABLE entries (id INTEGER PRIMARY KEY)');\n$pdo->exec('INSERT INTO entries (id) VALUES (1), (2)');\n\n$statement = $pdo->query('SELECT id FROM entries ORDER BY id');\n$reported = $statement->rowCount();\n$rows = $statement->fetchAll(PDO::FETCH_COLUMN);\n\necho json_encode([$reported, $rows]);\n"
        }
      ]
    },
    "stem": "A review says rows can be skipped whenever rowCount returns zero after SELECT. Which assessment matches this fixture and the PDO contract?",
    "options": [
      {
        "id": "reliable",
        "text": "rowCount reports 2, so this check is a portable way to count SELECT results.",
        "rationale": "SELECT rowCount behavior is not guaranteed across PDO drivers; this SQLite fixture reports zero.",
        "misconception": "Extending affected-row guarantees to every result-producing statement."
      },
      {
        "id": "empty-result",
        "text": "rowCount zero means fetchAll must return an empty array.",
        "rationale": "The fixture still fetches IDs 1 and 2 despite the zero report.",
        "misconception": "Using an unsupported result-count interpretation to discard valid rows."
      },
      {
        "id": "not-portable",
        "text": "The fixture reports zero but fetches [1,2]; inspect fetched results or issue a suitable COUNT query.",
        "rationale": "SELECT rowCount cannot be used as the claimed portable emptiness guarantee.",
        "misconception": null
      },
      {
        "id": "consumed",
        "text": "rowCount consumes both rows, so fetchAll returns no rows afterward.",
        "rationale": "rowCount is not a fetch operation and does not consume this result.",
        "misconception": "Explaining a driver-specific count by inventing cursor consumption."
      }
    ],
    "correctOptionId": "not-portable",
    "explanation": {
      "summary": "PDO documents rowCount for affected rows from modifying statements. SELECT behavior is driver-dependent, so code must use result fetching or an explicit count query according to its needs.",
      "trace": "The SQLite statement reports zero, then fetchAll retrieves the two stored IDs."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[0,[1,2]]",
      "keyEvidence": "The observed zero count coexists with a nonempty fetched result.",
      "counterexamples": {
        "reliable": "The observed report is zero, and PDO does not guarantee SELECT portability.",
        "empty-result": "The fetched IDs are [1,2].",
        "consumed": "Both rows remain available to fetch."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdostatement.rowcount.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0358",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "PDO & database access",
    "subtopic": "pdo-integer-binding-not-input-validation",
    "objective": {
      "id": "pdo-integer-binding-not-input-validation",
      "text": "Review integer parameter binding that is mistaken for validation of the original submitted text."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace coercion at a database binding boundary separately from SQL syntax safety."
    },
    "prerequisites": [
      "PDO::PARAM_INT",
      "Input validation versus coercion",
      "SQLite bound parameters"
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
        "The fixture uses PDO SQLite with the two displayed rows. The submitted identifier is required to be decimal integer text; not-an-id is invalid and should be rejected before querying. No external database is accessed."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n$pdo->exec('CREATE TABLE users (id INTEGER PRIMARY KEY, label TEXT NOT NULL)');\n$pdo->exec(\"INSERT INTO users VALUES (0, 'zero-record'), (1, 'one-record')\");\n\n$input = 'not-an-id';\n$statement = $pdo->prepare('SELECT label FROM users WHERE id = :id');\n$statement->bindValue(':id', $input, PDO::PARAM_INT);\n$statement->execute();\n\necho json_encode($statement->fetchColumn());\n"
        }
      ]
    },
    "stem": "A review claims PARAM_INT rejects the invalid submitted text automatically. Which assessment matches this query?",
    "options": [
      {
        "id": "type-error",
        "text": "bindValue throws TypeError because its value argument must already be an integer.",
        "rationale": "The API accepts a mixed value and the selected binding type can convert it.",
        "misconception": "Assuming a PDO binding flag is a PHP parameter type declaration."
      },
      {
        "id": "validation-error",
        "text": "execute rejects the input as invalid decimal text before SQL evaluation.",
        "rationale": "The integer binding converts this value to zero rather than enforcing the application’s textual format.",
        "misconception": "Treating binding type selection as an input-validation policy."
      },
      {
        "id": "literal-search",
        "text": "The query searches for the original string not-an-id and therefore returns false.",
        "rationale": "PARAM_INT causes integer conversion in the stated driver instead of binding the original text.",
        "misconception": "Ignoring the effect of the selected binding type."
      },
      {
        "id": "coerced",
        "text": "The query finds zero-record; validate the original text separately before integer binding.",
        "rationale": "The invalid string is bound as zero, which matches the displayed row.",
        "misconception": null
      }
    ],
    "correctOptionId": "coerced",
    "explanation": {
      "summary": "Parameterized SQL protects the syntax boundary, but a binding type does not prove the original input meets a business format. Here conversion loses the invalid-text distinction.",
      "trace": "not-an-id becomes integer zero for this binding, so the row with ID zero is returned rather than a validation error."
    },
    "validation": {
      "kind": "contract",
      "stdout": "\"zero-record\"",
      "keyEvidence": "The invalid textual identifier selects the zero-valued row.",
      "counterexamples": {
        "type-error": "Binding and execution complete without a PHP TypeError.",
        "validation-error": "The zero row is returned.",
        "literal-search": "The original string is not the bound integer value."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdostatement.bindvalue.php",
      "https://www.php.net/manual/en/pdo.constants.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0359",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Forms & file uploads",
    "subtopic": "upload-registry-not-superglobal-fixture",
    "objective": {
      "id": "upload-registry-not-superglobal-fixture",
      "text": "Review a CLI upload fixture that supplies metadata without establishing HTTP upload provenance."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate userland array values and file existence from PHP’s internal upload registry."
    },
    "prerequisites": [
      "FILES metadata",
      "is_uploaded_file",
      "CLI versus HTTP upload handling"
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
          "source": "<?php\n\n$path = __DIR__ . '/fixture.txt';\nfile_put_contents($path, 'fixture');\n\n$_FILES['document'] = [\n    'name' => 'document.txt',\n    'tmp_name' => $path,\n    'error' => UPLOAD_ERR_OK,\n    'size' => 7,\n];\n\necho json_encode([\n    is_file($path),\n    $_FILES['document']['error'] === UPLOAD_ERR_OK,\n    is_uploaded_file($path),\n]);\n"
        }
      ]
    },
    "stem": "A review claims that filling FILES and creating the temporary path makes is_uploaded_file true. Which assessment matches this CLI fixture?",
    "options": [
      {
        "id": "metadata-enough",
        "text": "All three checks are true because FILES identifies the path as an accepted upload.",
        "rationale": "Userland assignment does not register a path as an HTTP-uploaded file.",
        "misconception": "Treating mutable request metadata as the source of upload provenance."
      },
      {
        "id": "registry",
        "text": "File existence and the assigned status are true, but upload provenance is false in this CLI fixture.",
        "rationale": "The path was created by application code, not by PHP’s HTTP upload handling.",
        "misconception": null
      },
      {
        "id": "missing-file",
        "text": "UPLOAD_ERR_OK authenticates the temporary path, so comparing that value can replace is_uploaded_file.",
        "rationale": "The status in this fixture was assigned by userland code. It does not establish provenance in PHP’s HTTP upload registry.",
        "misconception": "Treating a successful-looking status value as independent proof of upload provenance."
      },
      {
        "id": "size-enough",
        "text": "is_file and is_uploaded_file are equivalent for regular files; they differ only for directories.",
        "rationale": "An ordinary regular file can exist without being registered as an HTTP upload, as this fixture demonstrates.",
        "misconception": "Confusing filesystem entry type with the origin of the file."
      }
    ],
    "correctOptionId": "registry",
    "explanation": {
      "summary": "is_uploaded_file checks whether PHP received the path through its HTTP upload mechanism. Creating a file and assigning FILES entries cannot synthesize that internal provenance.",
      "trace": "The ordinary fixture exists and the assigned status equals UPLOAD_ERR_OK. The third check remains false; an integration test of actual upload handling needs a real multipart request."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[true,true,false]",
      "keyEvidence": "Mutable metadata and real file existence do not make the upload registry check true.",
      "counterexamples": {
        "metadata-enough": "The third observed check is false.",
        "missing-file": "The assigned status comparison is true while is_uploaded_file is false.",
        "size-enough": "The regular file makes is_file true but is_uploaded_file false."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-12"
    },
    "references": [
      "https://www.php.net/manual/en/function.is-uploaded-file.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0360",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Files & structured data",
    "subtopic": "json-numeric-check-identifier-loss",
    "objective": {
      "id": "json-numeric-check-identifier-loss",
      "text": "Review numeric-string conversion applied to identifiers that must retain their original representation."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish number-like text from data whose leading characters and string type are part of its meaning."
    },
    "prerequisites": [
      "JSON_NUMERIC_CHECK",
      "String identifiers",
      "Numeric-string conversion"
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
          "source": "<?php\n\n$contact = [\n    'phone' => '+33123456789',\n    'postal' => '00123',\n];\n\necho json_encode($contact, JSON_NUMERIC_CHECK | JSON_THROW_ON_ERROR);\n"
        }
      ]
    },
    "stem": "A review calls JSON_NUMERIC_CHECK a harmless formatting option for this contact payload. Which assessment matches the encoded data?",
    "options": [
      {
        "id": "numbers",
        "text": "Both values become JSON numbers, losing the plus sign and leading zeros; omit this conversion for these identifiers.",
        "rationale": "The flag converts numeric strings rather than merely changing whitespace.",
        "misconception": null
      },
      {
        "id": "strings",
        "text": "Both remain strings because the PHP array contains string values.",
        "rationale": "JSON_NUMERIC_CHECK explicitly requests conversion of numeric strings.",
        "misconception": "Assuming source runtime types override an encoding flag that changes representation."
      },
      {
        "id": "phone-only",
        "text": "Only phone becomes numeric because a leading zero makes postal nonnumeric.",
        "rationale": "The postal string is also recognized as numeric text and becomes 123.",
        "misconception": "Applying array-key canonicalization rules to JSON numeric-string conversion."
      },
      {
        "id": "postal-only",
        "text": "Only postal becomes numeric because a leading plus prevents phone from being numeric.",
        "rationale": "A leading plus is accepted in a numeric string.",
        "misconception": "Treating a numeric sign as arbitrary nonnumeric punctuation."
      }
    ],
    "correctOptionId": "numbers",
    "explanation": {
      "summary": "JSON_NUMERIC_CHECK converts strings recognized as numeric into JSON numbers. That is a data transformation, which can destroy meaningful identifier spelling and string type.",
      "trace": "The output contains phone 33123456789 and postal 123 as numbers. Without the conversion flag, the original plus sign and leading zeros remain in JSON strings."
    },
    "validation": {
      "kind": "contract",
      "stdout": "{\"phone\":33123456789,\"postal\":123}",
      "keyEvidence": "Both source strings are emitted as numeric JSON values.",
      "counterexamples": {
        "strings": "The observed values are unquoted numbers.",
        "phone-only": "postal is also converted to 123.",
        "postal-only": "phone is also converted and loses its plus sign."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/json.constants.php",
      "https://www.php.net/manual/en/function.json-encode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0361",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "get-only-interface-property-covariance",
    "objective": {
      "id": "get-only-interface-property-covariance",
      "text": "Review covariance when implementing a PHP 8.4 get-only interface property."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Distinguish a read-only property requirement from invariant read/write property contracts."
    },
    "prerequisites": [
      "PHP 8.4 interface properties (advanced)",
      "Covariance",
      "Readonly properties",
      "Subtype relationships"
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
          "source": "<?php\n\nclass Animal\n{\n}\n\nclass Dog extends Animal\n{\n}\n\ninterface HasPet\n{\n    public Animal $pet {\n        get;\n    }\n}\n\nclass Kennel implements HasPet\n{\n    public function __construct(public readonly Dog $pet)\n    {\n    }\n}\n\n$kennel = new Kennel(new Dog());\necho get_class($kennel->pet);\n"
        }
      ]
    },
    "stem": "A review rejects Kennel because its Dog property is narrower than the interface’s Animal property. Which assessment matches PHP 8.4 and 8.5?",
    "options": [
      {
        "id": "invariant",
        "text": "The implementation is invalid because every PHP property type is invariant, including get-only requirements.",
        "rationale": "PHP 8.4 permits covariance for a property requirement that only promises reading.",
        "misconception": "Applying read/write property invariance to a purely readable interface contract."
      },
      {
        "id": "setter-required",
        "text": "The implementation must add a public setter accepting any Animal.",
        "rationale": "The interface requires only get access and does not promise a setter.",
        "misconception": "Inventing a write requirement that would change the variance constraints."
      },
      {
        "id": "covariant",
        "text": "The implementation is valid: reading a Dog satisfies the get-only promise of an Animal.",
        "rationale": "The interface’s consumer is promised an Animal value, and every Dog meets that promise.",
        "misconception": null
      },
      {
        "id": "readonly-invalid",
        "text": "The narrower type is allowed, but readonly is forbidden when implementing an interface property.",
        "rationale": "A readonly property can satisfy this get-only requirement.",
        "misconception": "Assuming interface properties must always be mutable."
      }
    ],
    "correctOptionId": "covariant",
    "explanation": {
      "summary": "A purely readable property requirement permits a covariant, more specific value type. The readonly Dog property satisfies the Animal read contract without promising writes of arbitrary Animals.",
      "trace": "Both runtimes accept the declarations and the property read returns a Dog instance."
    },
    "validation": {
      "kind": "contract",
      "stdout": "Dog",
      "keyEvidence": "The complete interface and readonly implementation compile and execute on both specified runtimes.",
      "counterexamples": {
        "invariant": "Get-only interface requirements support covariance.",
        "setter-required": "The interface contains no set hook requirement.",
        "readonly-invalid": "The readonly implementation is accepted."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.variance.php#language.oop5.variance.property",
      "https://www.php.net/manual/en/language.oop5.interfaces.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0362",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Enums, attributes & reflection",
    "subtopic": "reflection-property-write-coercive-boundary",
    "objective": {
      "id": "reflection-property-write-coercive-boundary",
      "text": "Review whether strict_types guarantees identical coercion policy for direct and reflection property writes."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a strict userland assignment from the internal Reflection API’s assignment boundary."
    },
    "prerequisites": [
      "Typed properties",
      "strict_types",
      "ReflectionProperty::setValue",
      "Internal coercion boundaries"
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
          "source": "<?php\n\ndeclare(strict_types=1);\n\nclass Counter\n{\n    public int $value = 0;\n}\n\n$counter = new Counter();\n\ntry {\n    $counter->value = '12';\n    $direct = 'accepted';\n} catch (TypeError $failure) {\n    $direct = 'TypeError';\n}\n\n$property = new ReflectionProperty(Counter::class, 'value');\n$property->setValue($counter, '12');\n\necho json_encode([$direct, get_debug_type($counter->value), $counter->value]);\n"
        }
      ]
    },
    "stem": "A review claims replacing direct hydration assignments with ReflectionProperty::setValue preserves rejection of numeric strings under strict_types. Which assessment matches this program?",
    "options": [
      {
        "id": "both-reject",
        "text": "Both assignments throw TypeError because the file is strict.",
        "rationale": "The reflected assignment is performed through the internal API and coerces this numeric string.",
        "misconception": "Assuming a strict declaration propagates into every internal assignment mechanism."
      },
      {
        "id": "coercive",
        "text": "The direct assignment fails, but the reflected assignment stores integer 12; validate the original input policy separately.",
        "rationale": "The reflected write preserves the property’s int type while accepting a coercible source string.",
        "misconception": null
      },
      {
        "id": "both-accept",
        "text": "Both assignments accept the string because property types always coerce.",
        "rationale": "The direct assignment occurs in strict userland code and rejects the string.",
        "misconception": "Ignoring strictness at direct property assignment."
      },
      {
        "id": "type-bypass",
        "text": "The direct assignment fails, but reflection stores the unchanged string by bypassing the property type.",
        "rationale": "Reflection still enforces the property type, producing an integer rather than storing a string.",
        "misconception": "Confusing coercive enforcement with no type enforcement."
      }
    ],
    "correctOptionId": "coercive",
    "explanation": {
      "summary": "The strict direct assignment and the Reflection API do not use the same coercion boundary. Reflection can coerce a compatible numeric string while still guaranteeing that stored property data has type int.",
      "trace": "The first operation is caught as TypeError. Reflection then stores integer 12, showing why runtime property type alone does not prove the source input was an integer."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"TypeError\",\"int\",12]",
      "keyEvidence": "Both runtimes distinguish the failed direct assignment from the successful coercive reflected write.",
      "counterexamples": {
        "both-reject": "The reflected write completes.",
        "both-accept": "The direct write raises TypeError.",
        "type-bypass": "The stored value has type int, not string."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/reflectionproperty.setvalue.php",
      "https://wiki.php.net/rfc/typed_properties_v2#strict_and_coercive_typing_modes"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0363",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Validation & web security",
    "subtopic": "ssrf-redirect-destination-policy",
    "objective": {
      "id": "ssrf-redirect-destination-policy",
      "text": "Review an outbound destination allowlist that validates only the first URL in a redirect chain."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace a trust boundary across automatic network actions taken after the validated request."
    },
    "prerequisites": [
      "cURL redirect following",
      "SSRF defenses",
      "URL allowlists",
      "HTTP Location"
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
        "A PHP cURL client accepts only https://api.example.test as an outbound origin. It validates the initial URL, enables CURLOPT_FOLLOWLOCATION and permits HTTP/HTTPS redirects. The allowed server returns a 302 Location pointing to http://127.0.0.1:8080/admin. No custom redirect guard exists, and DNS behavior is outside this example. No network connection is made during question validation."
      ],
      "files": []
    },
    "stem": "A review says validating the initial origin guarantees every resulting request stays on that origin. Which assessment addresses the shown redirect?",
    "options": [
      {
        "id": "initial-sufficient",
        "text": "The initial allowlist check also authorizes redirects because they came from the allowed server.",
        "rationale": "The redirected destination is a separate outbound target outside the policy.",
        "misconception": "Delegating destination authorization to a remote response."
      },
      {
        "id": "https-protects",
        "text": "Starting with HTTPS prevents cURL from following a redirect to an HTTP loopback URL.",
        "rationale": "The stated redirect protocol configuration explicitly permits HTTP, and no target policy is enforced.",
        "misconception": "Assuming the initial transport scheme constrains every later destination automatically."
      },
      {
        "id": "revalidate",
        "text": "The redirect can leave the allowlist; disable automatic following or validate each target before connecting.",
        "rationale": "The origin policy must govern every outbound request, including redirect hops.",
        "misconception": null
      },
      {
        "id": "same-host-default",
        "text": "CURLOPT_FOLLOWLOCATION follows only same-host redirects unless a second option enables other hosts.",
        "rationale": "Automatic following is not a same-origin allowlist.",
        "misconception": "Assuming browser-origin-style restrictions are implicit in server-side cURL redirects."
      }
    ],
    "correctOptionId": "revalidate",
    "explanation": {
      "summary": "An initial URL check does not validate destinations supplied by later Location responses. Automatic redirects can cross that boundary unless the application controls and checks each hop.",
      "trace": "The first request is allowed, but its 302 target is loopback HTTP and must be rejected by the stated origin policy before any connection to it."
    },
    "validation": {
      "kind": "document-review",
      "rule": "cURL follows Location targets when configured to do so; the application’s origin allowlist must apply to redirected requests as well.",
      "optionAudit": {
        "initial-sufficient": "Allows a remote response to choose an unauthorized origin.",
        "https-protects": "The premise allows HTTP redirect targets.",
        "revalidate": "Checks or prevents the additional outbound action.",
        "same-host-default": "Invents an implicit same-origin restriction."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://curl.se/libcurl/c/CURLOPT_FOLLOWLOCATION.html",
      "https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0364",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Validation & web security",
    "subtopic": "bcrypt-password-suffix-truncation-boundary",
    "objective": {
      "id": "bcrypt-password-suffix-truncation-boundary",
      "text": "Review a password policy that assumes bcrypt distinguishes bytes beyond its input limit."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate string inequality from the byte prefix processed by the selected password algorithm."
    },
    "prerequisites": [
      "bcrypt input limit",
      "password_verify",
      "Byte lengths versus character counts"
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
        "All fixture characters are single-byte ASCII. PASSWORD_BCRYPT is explicitly selected; this is not an assumption about every PASSWORD_DEFAULT algorithm. The low cost is only for a local deterministic behavior fixture, not a production cost recommendation."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$prefix = str_repeat('a', 72);\n$hash = password_hash($prefix, PASSWORD_BCRYPT, ['cost' => 4]);\n\n$first = $prefix . 'X';\n$second = $prefix . 'Y';\n\necho json_encode([\n    password_verify($first, $hash),\n    password_verify($second, $hash),\n]);\n"
        }
      ]
    },
    "stem": "A review claims both suffix-bearing candidates must fail because neither equals the original 72-byte password. Which assessment matches the verifier?",
    "options": [
      {
        "id": "different-suffixes",
        "text": "Both fail because password_verify compares every byte of the submitted string.",
        "rationale": "For bcrypt, bytes after the 72-byte input limit do not distinguish these candidates.",
        "misconception": "Assuming the wrapper removes the selected algorithm’s input limit."
      },
      {
        "id": "salt-separates",
        "text": "Exactly one succeeds depending on the stored random salt.",
        "rationale": "The stored salt applies identically to verification of both effective 72-byte prefixes.",
        "misconception": "Treating salt randomness as selection among suffixes outside the processed input."
      },
      {
        "id": "length-rejects",
        "text": "Both fail because password_verify rejects every input longer than 72 bytes before bcrypt.",
        "rationale": "The fixture verifies both suffix-bearing strings under the stated runtimes.",
        "misconception": "Assuming an automatic length-validation policy that this API does not enforce here."
      },
      {
        "id": "same-prefix",
        "text": "Both succeed because bcrypt processes the same first 72 bytes; the application’s policy must account for that limit.",
        "rationale": "The differing suffixes are beyond the algorithm’s effective input boundary.",
        "misconception": null
      }
    ],
    "correctOptionId": "same-prefix",
    "explanation": {
      "summary": "Bcrypt’s input boundary is 72 bytes. Distinct longer strings sharing that prefix can verify against the same bcrypt hash; an application must not promise suffix distinctions the algorithm does not provide.",
      "trace": "Both candidates begin with the exact 72-byte password used for hashing. Their final X or Y does not change the effective bcrypt input."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[true,true]",
      "keyEvidence": "Both suffix-bearing candidates verify against the same stored bcrypt hash.",
      "counterexamples": {
        "different-suffixes": "Both observed results are true.",
        "salt-separates": "The same salt and effective input apply to both candidates.",
        "length-rejects": "Neither call rejects the longer string in this fixture."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.password-hash.php",
      "https://www.php.net/manual/en/function.password-verify.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0365",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Testing, style & static analysis",
    "subtopic": "roundtrip-test-independent-protocol-oracle",
    "objective": {
      "id": "roundtrip-test-independent-protocol-oracle",
      "text": "Review a round-trip test whose encoder and decoder share the same nonstandard alphabet."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish mutual inversion from conformance to an independently specified wire protocol."
    },
    "prerequisites": [
      "Base64url alphabet",
      "Round-trip properties",
      "Protocol conformance",
      "Binary fixtures"
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
        "The protocol requires unpadded RFC 4648 base64url, whose replacements for + and / are - and _. The two-byte fixture FB FF must encode as -_8."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction encodeLocal(string $bytes): string\n{\n    return strtr(rtrim(base64_encode($bytes), '='), ['+' => '.', '/' => ',']);\n}\n\nfunction decodeLocal(string $text): string\n{\n    return base64_decode(strtr($text, ['.' => '+', ',' => '/']), true);\n}\n\n$fixture = \"\\xfb\\xff\";\n$wire = encodeLocal($fixture);\n$roundTrip = decodeLocal($wire) === $fixture;\n\necho json_encode([$wire, $roundTrip]);\n"
        }
      ]
    },
    "stem": "A review treats the successful round trip as proof of protocol compatibility. Which assessment follows from this code?",
    "options": [
      {
        "id": "sufficient",
        "text": "The round trip proves compatibility because any reversible alphabet is valid base64url.",
        "rationale": "Reversibility does not establish the alphabet required by the external protocol.",
        "misconception": "Treating an internal bijection as conformance to a specified encoding."
      },
      {
        "id": "independent-vector",
        "text": "The helpers agree on their own alphabet; add an independent expected-wire assertion such as FB FF mapping to -_8.",
        "rationale": "A shared defect can survive round-trip testing but fails the protocol’s known vector.",
        "misconception": null
      },
      {
        "id": "more-roundtrips",
        "text": "More random round-trip inputs alone will necessarily detect the wrong alphabet.",
        "rationale": "Consistently inverse wrong alphabets can round-trip every input while remaining noncompliant.",
        "misconception": "Assuming broader input sampling repairs an oracle that checks the wrong property."
      },
      {
        "id": "same-oracle",
        "text": "Build expected output with encodeLocal again, then compare it with the production encoder.",
        "rationale": "That expectation repeats the same implementation and preserves its alphabet error.",
        "misconception": "Using the implementation under test to define its own conformance oracle."
      }
    ],
    "correctOptionId": "independent-vector",
    "explanation": {
      "summary": "Round-trip tests check agreement between two operations. They do not establish that either operation matches an external format when both share the same mistake.",
      "trace": "The code emits the three-character wire text .,8 and successfully decodes it locally. The independent required value is -_8, so conformance fails despite the true round-trip result."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\".,8\",true]",
      "keyEvidence": "The known protocol vector differs from the observed wire string even though local round-trip equality is true.",
      "counterexamples": {
        "sufficient": "The emitted alphabet violates the stated protocol.",
        "more-roundtrips": "A consistently inverse nonstandard alphabet can pass every round trip.",
        "same-oracle": "Calling the same encoder again reproduces its defect."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc4648.html#section-5",
      "https://www.php.net/manual/en/function.base64-encode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0366",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Functions & arguments",
    "subtopic": "left-pad-text-minimum-width",
    "objective": {
      "id": "left-pad-text-minimum-width",
      "text": "Pad a textual label to a minimum width without numeric conversion or truncation."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose a string operation that handles nonnumeric and already-wide inputs."
    },
    "prerequisites": [
      "str_pad",
      "String widths",
      "ASCII labels"
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
          "source": "<?php\n\nfunction displayLabel(string $label): string\n{\n    return str_pad($label, 3, '0', STR_PAD_RIGHT);\n}\n\necho json_encode([\n    displayLabel('Q7'),\n    displayLabel('7'),\n    displayLabel('1234'),\n]);\n"
        }
      ]
    },
    "stem": "displayLabel must add leading zero characters until an ASCII label is at least three characters wide. Longer labels stay unchanged. Which expression produces [\"0Q7\",\"007\",\"1234\"]?",
    "options": [
      {
        "id": "right",
        "text": "str_pad($label, 3, '0', STR_PAD_RIGHT)",
        "rationale": "This adds zeros after short labels, not before them.",
        "misconception": "Using the default-style padding direction for a leading-padding requirement."
      },
      {
        "id": "numeric",
        "text": "sprintf('%03d', $label)",
        "rationale": "The integer format converts the nonnumeric label Q7 rather than preserving it as text.",
        "misconception": "Treating a textual identifier as an integer merely because its padding uses zeros."
      },
      {
        "id": "left",
        "text": "str_pad($label, 3, '0', STR_PAD_LEFT)",
        "rationale": "Left padding adds the needed characters and does not shorten labels already wider than three.",
        "misconception": null
      },
      {
        "id": "truncate",
        "text": "substr('000' . $label, -3)",
        "rationale": "Taking the last three bytes truncates 1234 to 234.",
        "misconception": "Confusing a minimum width with an exact-width truncating operation."
      }
    ],
    "correctOptionId": "left",
    "explanation": {
      "summary": "str_pad treats the input as text and its length argument as a minimum. STR_PAD_LEFT chooses the side without changing existing content.",
      "trace": "Q7 needs one zero, 7 needs two, and 1234 already exceeds the minimum width."
    },
    "validation": {
      "kind": "patch",
      "marker": "str_pad($label, 3, '0', STR_PAD_RIGHT)",
      "stdout": "[\"0Q7\",\"007\",\"1234\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.str-pad.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0367",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Arrays & destructuring",
    "subtopic": "parallel-lists-to-key-value-map",
    "objective": {
      "id": "parallel-lists-to-key-value-map",
      "text": "Build an associative map by pairing a supplied key list with a supplied value list."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish pairing arrays from concatenating, replacing or repeating them."
    },
    "prerequisites": [
      "Associative arrays",
      "Parallel lists",
      "Equal-length lists"
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
        "The key list contains unique nonnumeric strings and has the same length as the value list."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$names = ['Ada', 'Lin'];\n$scores = [4, 9];\n$result = array_merge($names, $scores);\n\necho json_encode($result);\n"
        }
      ]
    },
    "stem": "Each name must map to the score at the same position. Which expression produces {\"Ada\":4,\"Lin\":9}?",
    "options": [
      {
        "id": "fill",
        "text": "array_fill_keys($names, $scores)",
        "rationale": "This assigns the entire score array as the value of each name.",
        "misconception": "Treating the repeated fill value as a parallel list of per-key values."
      },
      {
        "id": "pair",
        "text": "array_combine($names, $scores)",
        "rationale": "Each names entry becomes a key paired with the corresponding scores entry.",
        "misconception": null
      },
      {
        "id": "merge",
        "text": "array_merge($names, $scores)",
        "rationale": "This concatenates the two numeric-keyed lists instead of pairing their contents.",
        "misconception": "Assuming merge connects entries at equal positions."
      },
      {
        "id": "replace",
        "text": "array_replace($names, $scores)",
        "rationale": "The numeric positions are replaced by scores, leaving a numeric list without name keys.",
        "misconception": "Confusing replacement by existing keys with turning values into new keys."
      }
    ],
    "correctOptionId": "pair",
    "explanation": {
      "summary": "array_combine takes keys from its first array and corresponding values from its second. The stated equal-length and unique-key conditions make the pairing unambiguous.",
      "trace": "Ada pairs with 4 and Lin with 9; neither list is concatenated into the result."
    },
    "validation": {
      "kind": "patch",
      "marker": "array_merge($names, $scores)",
      "stdout": "{\"Ada\":4,\"Lin\":9}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-combine.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0368",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Types, casting & comparisons",
    "subtopic": "scalar-type-admission-predicate",
    "objective": {
      "id": "scalar-type-admission-predicate",
      "text": "Accept PHP scalar types without confusing scalar, numeric and merely nonnull values."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Classify boolean and text values alongside numbers while rejecting containers and null."
    },
    "prerequisites": [
      "PHP scalar types",
      "Runtime type predicates",
      "Input validation"
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
          "source": "<?php\n\nfunction allowed(mixed $value): bool\n{\n    return is_numeric($value);\n}\n\n$values = ['label', 7, 1.5, false, null, [], new stdClass()];\necho json_encode(array_map('allowed', $values));\n"
        }
      ]
    },
    "stem": "allowed must accept integers, floats, strings and booleans, including false. It must reject null, arrays and objects. Which predicate satisfies the displayed cases?",
    "options": [
      {
        "id": "numeric",
        "text": "is_numeric($value)",
        "rationale": "Nonnumeric text and boolean false are still valid scalars under the requirement.",
        "misconception": "Equating scalar data with numeric data."
      },
      {
        "id": "present",
        "text": "isset($value)",
        "rationale": "Nonnull arrays and objects pass isset even though the contract rejects them.",
        "misconception": "Treating presence as a type-category check."
      },
      {
        "id": "string-or-number",
        "text": "is_string($value) || is_numeric($value)",
        "rationale": "This still excludes the allowed boolean false value.",
        "misconception": "Leaving booleans out of the scalar category."
      },
      {
        "id": "scalar",
        "text": "is_scalar($value)",
        "rationale": "PHP scalar types are bool, int, float and string; null and containers are excluded.",
        "misconception": null
      }
    ],
    "correctOptionId": "scalar",
    "explanation": {
      "summary": "is_scalar tests precisely the specified PHP type category. Numeric validation and null presence answer different questions.",
      "trace": "The first four values pass. Null, the array and the object fail, producing four true results followed by three false results."
    },
    "validation": {
      "kind": "patch",
      "marker": "is_numeric($value)",
      "stdout": "[true,true,true,true,false,false,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/function.is-scalar.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0369",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Functions & arguments",
    "subtopic": "datetime-format-month-minute-offset",
    "objective": {
      "id": "datetime-format-month-minute-offset",
      "text": "Format a timestamp with distinct month and minute tokens and a colonized UTC offset."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply PHP’s format-token meanings to an explicitly specified wire string."
    },
    "prerequisites": [
      "DateTimeImmutable::format",
      "Date and time components",
      "Timezone offsets"
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
          "source": "<?php\n\n$time = new DateTimeImmutable('2025-04-03 16:05:06+02:00');\n\necho $time->format('Y-m-d\\TH:m:sP');\n"
        }
      ]
    },
    "stem": "Which format string produces exactly 2025-04-03T16:05:06+02:00 for this timestamp?",
    "options": [
      {
        "id": "month-for-minute",
        "text": "'Y-m-d\\TH:m:sP'",
        "rationale": "The second m prints month 04 where minute 05 is required.",
        "misconception": "Using the same letter for month and minute in PHP’s format language."
      },
      {
        "id": "twelve-hour",
        "text": "'Y-m-d\\Th:i:sP'",
        "rationale": "Lowercase h uses a 12-hour clock and prints 04 rather than 16.",
        "misconception": "Assuming hour format letters differ only in padding."
      },
      {
        "id": "rfc-shape",
        "text": "'Y-m-d\\TH:i:sP'",
        "rationale": "The tokens produce the required date, literal T, 24-hour time and colonized offset.",
        "misconception": null
      },
      {
        "id": "compact-offset",
        "text": "'Y-m-d\\TH:i:sO'",
        "rationale": "O produces +0200 without the required offset colon.",
        "misconception": "Treating the two numeric UTC-offset tokens as identical."
      }
    ],
    "correctOptionId": "rfc-shape",
    "explanation": {
      "summary": "PHP’s date-format tokens are case-sensitive: m is month, i is minute, H is 24-hour time and P includes a colon in the numeric offset. The escaped T is literal text.",
      "trace": "The selected tokens print year 2025, month 04, day 03, hour 16, minute 05, second 06 and offset +02:00."
    },
    "validation": {
      "kind": "patch",
      "marker": "'Y-m-d\\TH:m:sP'",
      "stdout": "2025-04-03T16:05:06+02:00",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/datetime.format.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0370",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Syntax & execution model",
    "subtopic": "lf-record-delimiter-string-literal",
    "objective": {
      "id": "lf-record-delimiter-string-literal",
      "text": "Represent a single LF byte in PHP rather than a literal escape-looking string or another line ending."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish string-literal interpretation from text that merely resembles an escape."
    },
    "prerequisites": [
      "Single- versus double-quoted strings",
      "LF and CR bytes"
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
        "The record protocol requires exactly one LF byte after each record on every operating system. CR and CRLF are not valid delimiters for this protocol."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$delimiter = '\\n';\n$records = ['one', 'two'];\n\necho implode($delimiter, $records) . $delimiter;\n"
        }
      ]
    },
    "stem": "Which delimiter expression makes the output contain one LF after one and one LF after two?",
    "options": [
      {
        "id": "literal",
        "text": "'\\n'",
        "rationale": "Single quotes preserve this backslash and n as two literal characters.",
        "misconception": "Assuming every PHP string form expands newline escapes."
      },
      {
        "id": "lf",
        "text": "\"\\n\"",
        "rationale": "A double-quoted newline escape represents one LF byte.",
        "misconception": null
      },
      {
        "id": "crlf",
        "text": "\"\\r\\n\"",
        "rationale": "This emits two bytes, CR followed by LF, rather than the required single LF.",
        "misconception": "Substituting a different platform convention for the explicit wire delimiter."
      },
      {
        "id": "cr",
        "text": "\"\\r\"",
        "rationale": "A carriage return is a different control byte from LF.",
        "misconception": "Treating CR and LF as interchangeable newline bytes."
      }
    ],
    "correctOptionId": "lf",
    "explanation": {
      "summary": "Double-quoted PHP strings interpret the newline escape. Single quotes do not expand it, while carriage-return escapes represent a different protocol delimiter.",
      "trace": "The correct bytes are one, LF, two, LF, with no literal backslash and no carriage return."
    },
    "validation": {
      "kind": "patch",
      "marker": "'\\n'",
      "stdout": "one\ntwo\n",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-01"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.string.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0371",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Arrays & destructuring",
    "subtopic": "inclusive-ascending-range-empty-reversal",
    "objective": {
      "id": "inclusive-ascending-range-empty-reversal",
      "text": "Build an inclusive ascending integer sequence while rejecting reversed bounds as empty."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Handle ordinary, singleton and reversed bounds without accidentally requesting a descending range."
    },
    "prerequisites": [
      "range",
      "Inclusive endpoints",
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
          "source": "<?php\n\nfunction numbers(int $start, int $end): array\n{\n    return $start > $end ? [] : range($start, $end - 1);\n}\n\necho json_encode([numbers(2, 4), numbers(4, 2), numbers(3, 3)]);\n"
        }
      ]
    },
    "stem": "numbers must include both endpoints when start is at most end, and return an empty list otherwise. Which expression produces [[2,3,4],[],[3]]?",
    "options": [
      {
        "id": "closed",
        "text": "$start > $end ? [] : range($start, $end)",
        "rationale": "The guard prevents descending output and range includes both valid endpoints.",
        "misconception": null
      },
      {
        "id": "exclude-end",
        "text": "$start > $end ? [] : range($start, $end - 1)",
        "rationale": "This omits the requested final endpoint and produces an unintended descending singleton case.",
        "misconception": "Applying an exclusive-end convention to PHP’s inclusive range API."
      },
      {
        "id": "exclude-start",
        "text": "$start > $end ? [] : range($start + 1, $end)",
        "rationale": "This omits the requested first endpoint.",
        "misconception": "Treating the first bound as a position before the sequence."
      },
      {
        "id": "repeat-start",
        "text": "$start > $end ? [] : array_fill(0, $end - $start + 1, $start)",
        "rationale": "The count is right, but each element repeats start instead of advancing.",
        "misconception": "Confusing a filled array of a certain size with a numeric progression."
      }
    ],
    "correctOptionId": "closed",
    "explanation": {
      "summary": "range includes its endpoints and can generate descending sequences. The explicit guard supplies the application’s different policy for reversed bounds.",
      "trace": "The valid span 2 to 4 yields three integers, reversed 4 to 2 is rejected as empty, and equal bounds yield one integer."
    },
    "validation": {
      "kind": "patch",
      "marker": "$start > $end ? [] : range($start, $end - 1)",
      "stdout": "[[2,3,4],[],[3]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.range.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0372",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Arrays & destructuring",
    "subtopic": "random-array-key-to-value-selection",
    "objective": {
      "id": "random-array-key-to-value-selection",
      "text": "Select a random value from an associative array using an API that returns a key."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish keys, values and numeric positions without assuming consecutive indices."
    },
    "prerequisites": [
      "array_rand",
      "Associative lookup",
      "array_search"
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
        "This is a nonsecurity display choice; cryptographic randomness is not required. The map is nonempty, and its keys are distinct from all its values. The test checks value membership without assuming which random choice occurs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$items = ['red' => 'R', 'blue' => 'B'];\n$choice = array_rand($items);\n\necho json_encode(in_array($choice, ['R', 'B'], true));\n"
        }
      ]
    },
    "stem": "choice must be either R or B from the map. Which expression guarantees that the final strict membership check prints true?",
    "options": [
      {
        "id": "key",
        "text": "array_rand($items)",
        "rationale": "This returns red or blue, which are keys rather than the requested values.",
        "misconception": "Assuming array_rand returns the randomly selected value."
      },
      {
        "id": "position",
        "text": "array_rand(array_values($items))",
        "rationale": "Reindexing changes the returned key to 0 or 1, still not R or B.",
        "misconception": "Assuming reindexing changes array_rand’s return contract."
      },
      {
        "id": "value",
        "text": "$items[array_rand($items)]",
        "rationale": "The chosen key is used to read its associated value.",
        "misconception": null
      },
      {
        "id": "reverse-search",
        "text": "array_search(array_rand($items), $items, true)",
        "rationale": "The chosen key is not among the values, so the reverse search returns false.",
        "misconception": "Searching values for a key instead of indexing by that key."
      }
    ],
    "correctOptionId": "value",
    "explanation": {
      "summary": "array_rand returns an existing key. Reading the array at that key obtains the corresponding randomly selected value, regardless of the map’s key naming.",
      "trace": "The selected key is red or blue; looking it up yields R or B. The other expressions always produce a key, an index or false in this fixture."
    },
    "validation": {
      "kind": "patch",
      "marker": "$choice = array_rand($items);",
      "candidates": {
        "key": "$choice = array_rand($items);",
        "position": "$choice = array_rand(array_values($items));",
        "value": "$choice = $items[array_rand($items)];",
        "reverse-search": "$choice = array_search(array_rand($items), $items, true);"
      },
      "stdout": "true",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-rand.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0373",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Classes & object lifecycle",
    "subtopic": "identifier-value-equality-not-object-identity",
    "objective": {
      "id": "identifier-value-equality-not-object-identity",
      "text": "Compare value objects by exact identifier text rather than object identity or loose numeric-string equivalence."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish three equality relations using equal text in separate objects and unequal numeric-looking strings."
    },
    "prerequisites": [
      "Object identity versus equality",
      "Strict string comparison",
      "Readonly string properties"
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
          "source": "<?php\n\nclass Identifier\n{\n    public function __construct(public readonly string $text)\n    {\n    }\n}\n\nfunction sameId(Identifier $left, Identifier $right): bool\n{\n    return $left === $right;\n}\n\necho json_encode([\n    sameId(new Identifier('01'), new Identifier('01')),\n    sameId(new Identifier('01'), new Identifier('1')),\n]);\n"
        }
      ]
    },
    "stem": "sameId must compare the exact stored identifier text. Separate objects with the same text are equal, but 01 and 1 are distinct identifiers. Which expression produces [true,false]?",
    "options": [
      {
        "id": "object-loose",
        "text": "$left == $right",
        "rationale": "Object equality compares these string properties loosely, so numeric-looking 01 and 1 compare equal.",
        "misconception": "Assuming object value comparison automatically uses strict comparison for every property."
      },
      {
        "id": "text-strict",
        "text": "$left->text === $right->text",
        "rationale": "The stored strings are compared exactly, independently of whether their owner objects are the same instance.",
        "misconception": null
      },
      {
        "id": "identity",
        "text": "$left === $right",
        "rationale": "Separate objects fail identity even when their identifier text matches.",
        "misconception": "Treating value equality as reference identity."
      },
      {
        "id": "text-loose",
        "text": "$left->text == $right->text",
        "rationale": "Loose comparison treats the two numeric strings as equivalent numbers.",
        "misconception": "Allowing numeric coercion in an identifier equality rule."
      }
    ],
    "correctOptionId": "text-strict",
    "explanation": {
      "summary": "The contract defines equality by exact string content. Strict property comparison implements that rule while object identity and loose equality implement different relations.",
      "trace": "The first pair contains identical strings and passes. The second differs by a leading zero and fails despite numeric equivalence."
    },
    "validation": {
      "kind": "patch",
      "marker": "$left === $right",
      "stdout": "[true,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.object-comparison.php",
      "https://www.php.net/manual/en/language.operators.comparison.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0374",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "curl-connect-total-timeout-budgets",
    "objective": {
      "id": "curl-connect-total-timeout-budgets",
      "text": "Configure separate connection and overall cURL budgets using the correct units and scope."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a phase limit from a total limit that already includes the connection phase."
    },
    "prerequisites": [
      "PHP cURL timeout options",
      "Milliseconds versus seconds",
      "Overall request deadlines"
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
        "The PHP cURL client must use a 300 ms connection timeout and a 1000 ms overall operation timeout, including connection time. These are the intended configured limits, not exact real-time scheduling guarantees. No transfer is performed during question validation."
      ],
      "files": []
    },
    "stem": "Which option map expresses both budgets without adding the connection allowance to the overall deadline?",
    "options": [
      {
        "id": "seconds-connect",
        "text": "[CURLOPT_CONNECTTIMEOUT => 300, CURLOPT_TIMEOUT_MS => 1000]",
        "rationale": "CONNECTTIMEOUT uses seconds, so its configured connection allowance is 300 seconds rather than 300 ms.",
        "misconception": "Mixing seconds and milliseconds while preserving the same numeric values."
      },
      {
        "id": "add-phases",
        "text": "[CURLOPT_CONNECTTIMEOUT_MS => 300, CURLOPT_TIMEOUT_MS => 1300]",
        "rationale": "The overall timeout already includes the connection phase; adding 300 grants more total time than required.",
        "misconception": "Treating the total timeout as a separate post-connection allowance."
      },
      {
        "id": "both-ms",
        "text": "[CURLOPT_CONNECTTIMEOUT_MS => 300, CURLOPT_TIMEOUT_MS => 1000]",
        "rationale": "Both options use milliseconds, and the total includes time spent connecting.",
        "misconception": null
      },
      {
        "id": "connection-only",
        "text": "[CURLOPT_CONNECTTIMEOUT_MS => 300, CURLOPT_TIMEOUT_MS => 0]",
        "rationale": "A zero total timeout permits an unbounded overall transfer after connection.",
        "misconception": "Assuming the connection timeout also bounds the full response transfer."
      }
    ],
    "correctOptionId": "both-ms",
    "explanation": {
      "summary": "The connection timeout limits establishment, while the total timeout covers the whole operation including establishment. Millisecond option names avoid interpreting 300 as seconds.",
      "trace": "A connection can use up to its configured 300 ms allowance, but the complete operation still shares the 1000 ms total budget."
    },
    "validation": {
      "kind": "document-review",
      "rule": "libcurl defines CONNECTTIMEOUT_MS in milliseconds and TIMEOUT_MS as the maximum time for the whole transfer, including connection time.",
      "optionAudit": {
        "seconds-connect": "Sets the connection option in seconds.",
        "add-phases": "Extends the total to 1300 ms.",
        "both-ms": "Sets exactly the two required budgets.",
        "connection-only": "Removes the overall timeout."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://curl.se/libcurl/c/CURLOPT_CONNECTTIMEOUT_MS.html",
      "https://curl.se/libcurl/c/CURLOPT_TIMEOUT_MS.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0375",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Errors & exceptions",
    "subtopic": "local-recovery-versus-global-exception-handler",
    "objective": {
      "id": "local-recovery-versus-global-exception-handler",
      "text": "Recover a failed operation inside its call boundary while preserving a successful return value."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a local catch from an uncaught-exception handler and an overriding finally return."
    },
    "prerequisites": [
      "Local try/catch",
      "set_exception_handler",
      "finally return behavior",
      "RuntimeException versus Error"
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
          "source": "<?php\n\nfunction loadOrDefault(Closure $load): string\n{\n    /* recovery */ return $load();\n}\n\n$loaders = [\n    static function (): string {\n        return 'ok';\n    },\n    static function (): string {\n        throw new RuntimeException('unavailable');\n    },\n];\n$results = [];\n\nforeach ($loaders as $load) {\n    try {\n        $results[] = loadOrDefault($load);\n    } catch (RuntimeException $failure) {\n        $results[] = 'escaped';\n    } finally {\n        restore_exception_handler();\n    }\n}\n\necho json_encode($results);\n"
        }
      ]
    },
    "stem": "loadOrDefault must return ok on success and default on RuntimeException, allowing its caller to continue. Which replacement body produces [\"ok\",\"default\"]? The outer catch is a test guard that reports any failure escaping the function.",
    "options": [
      {
        "id": "global-handler",
        "text": "set_exception_handler(static function (Throwable $failure): string {\n    return 'default';\n});\n\nreturn $load();",
        "rationale": "An uncaught-exception handler does not return a replacement value to the interrupted call; here the outer guard catches the escaping exception first.",
        "misconception": "Treating a global exception handler as a resumable fallback for the current expression."
      },
      {
        "id": "finally-value",
        "text": "try {\n    return $load();\n} finally {\n    return 'default';\n}",
        "rationale": "The finally return also overrides a successful ok result.",
        "misconception": "Using unconditional cleanup control flow for conditional error recovery."
      },
      {
        "id": "engine-errors",
        "text": "try {\n    return $load();\n} catch (Error $failure) {\n    return 'default';\n}",
        "rationale": "RuntimeException is not an Error, so the specified failure escapes.",
        "misconception": "Confusing the two branches of PHP’s Throwable hierarchy."
      },
      {
        "id": "local-catch",
        "text": "try {\n    return $load();\n} catch (RuntimeException $failure) {\n    return 'default';\n}",
        "rationale": "The successful value is returned unchanged and the specified exception is converted locally to the fallback.",
        "misconception": null
      }
    ],
    "correctOptionId": "local-catch",
    "explanation": {
      "summary": "A catch around the operation can supply a return value and let the caller continue. A global handler deals with uncaught termination rather than resuming an interrupted expression; finally runs on both success and failure.",
      "trace": "The first loader returns ok through the try. The second throws RuntimeException, which the local catch converts to default before it can reach the outer guard."
    },
    "validation": {
      "kind": "patch",
      "marker": "/* recovery */ return $load();",
      "stdout": "[\"ok\",\"default\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/function.set-exception-handler.php",
      "https://www.php.net/manual/en/language.exceptions.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0376",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "ini-raw-scanner-literal-values",
    "objective": {
      "id": "ini-raw-scanner-literal-values",
      "text": "Parse INI values as literal strings when reserved words and leading zeros are meaningful data."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Choose scanner semantics separately from section processing and typed conversion."
    },
    "prerequisites": [
      "parse_ini_string",
      "INI scanner modes",
      "String-preserving configuration"
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
        "The displayed INI text is a trusted local fixture. Every resulting value must retain its literal textual representation; words such as off and null are labels for this consumer, not booleans or null values."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$text = \"enabled = off\ncode = 00123\nlabel = null\n\";\n$settings = parse_ini_string($text, false, INI_SCANNER_NORMAL);\n\necho json_encode([$settings['enabled'], $settings['code'], $settings['label']]);\n"
        }
      ]
    },
    "stem": "Which parser call produces [\"off\",\"00123\",\"null\"] without special conversion of the reserved words?",
    "options": [
      {
        "id": "typed",
        "text": "parse_ini_string($text, false, INI_SCANNER_TYPED)",
        "rationale": "Typed scanning interprets reserved words and numeric values instead of preserving the required strings.",
        "misconception": "Assuming typed configuration parsing preserves every original spelling."
      },
      {
        "id": "normal",
        "text": "parse_ini_string($text, false, INI_SCANNER_NORMAL)",
        "rationale": "Normal scanning also interprets reserved boolean/null words.",
        "misconception": "Assuming only the typed scanner performs special-value interpretation."
      },
      {
        "id": "raw",
        "text": "parse_ini_string($text, false, INI_SCANNER_RAW)",
        "rationale": "Raw scanning leaves these option values as their literal strings.",
        "misconception": null
      },
      {
        "id": "wrong-slot",
        "text": "parse_ini_string($text, INI_SCANNER_RAW)",
        "rationale": "The second parameter controls section processing, so the default scanner remains normal.",
        "misconception": "Passing a scanner constant in the process_sections argument position."
      }
    ],
    "correctOptionId": "raw",
    "explanation": {
      "summary": "The scanner_mode argument controls value interpretation. INI_SCANNER_RAW preserves the text needed by this consumer; process_sections is an independent second argument.",
      "trace": "Raw mode returns off, 00123 and null as strings, rather than interpreting the reserved words or converting the code."
    },
    "validation": {
      "kind": "patch",
      "marker": "parse_ini_string($text, false, INI_SCANNER_NORMAL)",
      "stdout": "[\"off\",\"00123\",\"null\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.parse-ini-string.php",
      "https://www.php.net/manual/en/function.parse-ini-file.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0377",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Errors & exceptions",
    "subtopic": "psr3-original-exception-context",
    "objective": {
      "id": "psr3-original-exception-context",
      "text": "Preserve the original caught Throwable in the conventional PSR-3 exception context entry."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a diagnostic object with its cause chain from message text, a cause alone or an unrecognized context key."
    },
    "prerequisites": [
      "PSR-3 exception context convention",
      "Exception chaining",
      "Structured logging"
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
        "CaptureLogger is a local test double that records arguments without I/O. The intended PSR-3-compatible adapter extracts exception details from context[exception]. The requirement is to pass the original outer DomainException, preserving its context and previous exception, with job ID 17."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass CaptureLogger\n{\n    public string $message = '';\n    public array $context = [];\n\n    public function error(string $message, array $context): void\n    {\n        $this->message = $message;\n        $this->context = $context;\n    }\n}\n\n$logger = new CaptureLogger();\n\ntry {\n    throw new DomainException('bad record', 0, new RuntimeException('source'));\n} catch (DomainException $failure) {\n    $logger->error('Import failed', ['exception' => $failure->getMessage(), 'job' => 17]);\n    $same = ($logger->context['exception'] ?? null) === $failure;\n}\n\necho json_encode([$logger->message, $same, $logger->context['job']]);\n"
        }
      ]
    },
    "stem": "Which call produces [\"Import failed\",true,17] while retaining the actual caught exception object?",
    "options": [
      {
        "id": "original",
        "text": "$logger->error('Import failed', ['exception' => $failure, 'job' => 17]);",
        "rationale": "The reserved entry contains the original object, including its outer context and previous cause.",
        "misconception": null
      },
      {
        "id": "message",
        "text": "$logger->error('Import failed', ['exception' => $failure->getMessage(), 'job' => 17]);",
        "rationale": "A message string loses the Throwable object, trace and chained cause.",
        "misconception": "Replacing structured exception diagnostics with message text."
      },
      {
        "id": "cause",
        "text": "$logger->error('Import failed', ['exception' => $failure->getPrevious(), 'job' => 17]);",
        "rationale": "This passes only the inner RuntimeException and loses the caught outer failure’s context.",
        "misconception": "Assuming the deepest cause can replace the full caught exception chain."
      },
      {
        "id": "different-key",
        "text": "$logger->error('Import failed', ['error' => $failure, 'job' => 17]);",
        "rationale": "The object is present under a different key that the stated adapter does not use for exception extraction.",
        "misconception": "Treating arbitrary context keys as equivalent to the PSR-3 exception convention."
      }
    ],
    "correctOptionId": "original",
    "explanation": {
      "summary": "The conventional exception context entry carries the Throwable object, not merely its message. Passing the outer caught object retains both its own diagnostics and its previous chain.",
      "trace": "The test double records the exact DomainException instance under exception, so identity is true and job remains 17."
    },
    "validation": {
      "kind": "patch",
      "marker": "$logger->error('Import failed', ['exception' => $failure->getMessage(), 'job' => 17]);",
      "stdout": "[\"Import failed\",true,17]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php-fig.org/psr/psr-3/#13-context"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0378",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Enums, attributes & reflection",
    "subtopic": "reflection-positional-values-from-labeled-map",
    "objective": {
      "id": "reflection-positional-values-from-labeled-map",
      "text": "Adapt an ordered argument-value map to positional ReflectionMethod invocation on PHP 8."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish UI field labels from method parameter names at a metaprogramming boundary."
    },
    "prerequisites": [
      "ReflectionMethod::invokeArgs",
      "PHP 8 named argument keys",
      "Array iteration order"
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
        "The adapter contract says map values are already in method-parameter order. Map keys are UI labels, not PHP parameter names. This method has no reference parameters, and the adapter must not rename its public parameters."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Formatter\n{\n    public function fullName(string $given, string $family): string\n    {\n        return $given . ' ' . $family;\n    }\n}\n\n$formatter = new Formatter();\n$method = new ReflectionMethod(Formatter::class, 'fullName');\n$values = ['first_field' => 'Ada', 'last_field' => 'Lin'];\n\ntry {\n    echo $method->invokeArgs($formatter, $values);\n} catch (Throwable $failure) {\n    echo get_class($failure);\n}\n"
        }
      ]
    },
    "stem": "Which invocation supplies the map values positionally and returns Ada Lin?",
    "options": [
      {
        "id": "labeled",
        "text": "$method->invokeArgs($formatter, $values)",
        "rationale": "String keys are interpreted as named arguments, so first_field is not a recognized parameter.",
        "misconception": "Assuming invokeArgs ignores string keys as older PHP versions did."
      },
      {
        "id": "one-array",
        "text": "$method->invoke($formatter, $values)",
        "rationale": "invoke receives the complete array as one argument rather than two string arguments.",
        "misconception": "Confusing the variadic invoke API with the array-taking invokeArgs API."
      },
      {
        "id": "reindex",
        "text": "$method->invokeArgs($formatter, array_values($values))",
        "rationale": "Reindexing preserves value order while removing UI labels, creating positional arguments.",
        "misconception": null
      },
      {
        "id": "spread",
        "text": "$method->invoke($formatter, ...$values)",
        "rationale": "Unpacking the associative map still supplies named arguments from its string keys.",
        "misconception": "Assuming changing from invokeArgs to unpacking automatically discards labels."
      }
    ],
    "correctOptionId": "reindex",
    "explanation": {
      "summary": "On PHP 8, invokeArgs honors string argument keys as names. A positional adapter must explicitly discard labels while retaining the defined value order.",
      "trace": "array_values creates [Ada, Lin], which binds to given and family in declaration order and returns Ada Lin."
    },
    "validation": {
      "kind": "patch",
      "marker": "$method->invokeArgs($formatter, $values)",
      "stdout": "Ada Lin",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/reflectionmethod.invokeargs.php",
      "https://www.php.net/manual/en/reflectionmethod.invoke.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0379",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Validation & web security",
    "subtopic": "expanded-stream-cumulative-output-limit",
    "objective": {
      "id": "expanded-stream-cumulative-output-limit",
      "text": "Enforce an expanded-output budget before writing the chunk that would cross it."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish per-chunk size, already-written size and cumulative next-write size at a decompression boundary."
    },
    "prerequisites": [
      "Decompression resource limits",
      "Chunked stream consumption",
      "Cumulative byte accounting",
      "Pre-write validation"
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
        "A decoder yields already-expanded chunks of at most six bytes. The code below tests only the consuming limit, not the decoder. The output stream is owned by the fixture and all writes complete fully. At most limit bytes may be written; exact equality is permitted. Rejection may leave earlier accepted chunks, but must not write any part of the rejected chunk."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction copyExpanded(iterable $chunks, int $limit): array\n{\n    $output = fopen('php://memory', 'w+b');\n    $written = 0;\n    $complete = true;\n\n    foreach ($chunks as $chunk) {\n        if (strlen($chunk) > $limit) {\n            $complete = false;\n            break;\n        }\n\n        fwrite($output, $chunk);\n        $written += strlen($chunk);\n    }\n\n    $size = ftell($output);\n    fclose($output);\n\n    return [$complete, $size];\n}\n\necho json_encode([\n    copyExpanded(['AAAAAA', 'BBBBBB'], 10),\n    copyExpanded(['AAAAAA', 'BBBB'], 10),\n]);\n"
        }
      ]
    },
    "stem": "Which condition enforces the 10-byte budget for both a 6+6-byte input and a 6+4-byte input, producing [[false,6],[true,10]]?",
    "options": [
      {
        "id": "chunk-only",
        "text": "strlen($chunk) > $limit",
        "rationale": "Every individual chunk fits, but their combined expanded size can exceed the budget.",
        "misconception": "Applying a whole-output limit independently to each chunk."
      },
      {
        "id": "previous-total",
        "text": "$written > $limit",
        "rationale": "The check happens before the next write but omits that write’s size, allowing the first overrun.",
        "misconception": "Checking only bytes already accepted instead of the projected next total."
      },
      {
        "id": "reject-equality",
        "text": "$written + strlen($chunk) >= $limit",
        "rationale": "This rejects the valid exact-10-byte input.",
        "misconception": "Treating the permitted maximum as an exclusive upper bound."
      },
      {
        "id": "next-total",
        "text": "$written + strlen($chunk) > $limit",
        "rationale": "The next chunk is accepted only when the resulting cumulative byte count remains within the inclusive limit.",
        "misconception": null
      }
    ],
    "correctOptionId": "next-total",
    "explanation": {
      "summary": "An expanded-data limit applies to the cumulative output, not compressed input size or one chunk at a time. Check the projected total before the write that could exceed it.",
      "trace": "After six bytes, another six would reach twelve and is rejected before writing. Another four reaches exactly ten and is accepted."
    },
    "validation": {
      "kind": "patch",
      "marker": "strlen($chunk) > $limit",
      "stdout": "[[false,6],[true,10]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html#upload-and-download-limits",
      "https://www.php.net/manual/en/function.fwrite.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0380",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "composer-real-platform-release-gate",
    "objective": {
      "id": "composer-real-platform-release-gate",
      "text": "Verify the target PHP runtime against installed production requirements despite Composer platform emulation."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate dependency-solver assumptions from capabilities of the process that will actually run the application."
    },
    "prerequisites": [
      "Composer config.platform",
      "Extension requirements",
      "Production dependency graph",
      "Deployment validation"
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
        "Composer 2 installed a locked production dependency graph requiring ext-intl. config.platform pretends that ext-intl exists for dependency resolution. The target PHP 8.4 runtime lacks that extension. The runtime used for the check is the same one used by the application. No installation or deployment is performed during question validation."
      ],
      "files": []
    },
    "stem": "Which check should fail on the real target before release instead of trusting the emulated platform configuration?",
    "options": [
      {
        "id": "actual-platform",
        "text": "composer check-platform-reqs --no-dev",
        "rationale": "This command checks real PHP and extension capabilities against installed requirements, ignoring config.platform overrides.",
        "misconception": null
      },
      {
        "id": "manifest",
        "text": "composer validate --strict",
        "rationale": "Manifest and lock validation do not establish that the target process has every required extension.",
        "misconception": "Treating a valid dependency manifest as proof of runtime capability."
      },
      {
        "id": "autoload",
        "text": "composer dump-autoload --optimize",
        "rationale": "Regenerating class lookup metadata does not install or verify the missing extension as the requested gate.",
        "misconception": "Confusing autoload optimization with platform requirement checking."
      },
      {
        "id": "ignore",
        "text": "composer install --no-dev --ignore-platform-reqs",
        "rationale": "Ignoring platform requirements explicitly removes the check that must detect the missing extension.",
        "misconception": "Treating a successful forced installation as evidence of runtime compatibility."
      }
    ],
    "correctOptionId": "actual-platform",
    "explanation": {
      "summary": "config.platform can emulate capabilities for solving dependencies. check-platform-reqs intentionally tests the actual runtime against installed requirements, so the missing production extension is detected.",
      "trace": "The configured fake extension cannot satisfy this check; the real target has no intl extension and the gate reports the unmet requirement."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Composer check-platform-reqs checks the real platform and ignores config.platform; --no-dev restricts the check to production requirements.",
      "optionAudit": {
        "actual-platform": "Detects the real missing ext-intl requirement.",
        "manifest": "Validates metadata, not the requested runtime capability gate.",
        "autoload": "Builds lookup metadata rather than checking the real platform.",
        "ignore": "Suppresses the relevant requirement check."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://getcomposer.org/doc/03-cli.md#check-platform-reqs",
      "https://getcomposer.org/doc/06-config.md#platform"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0381",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Functions & arguments",
    "subtopic": "prefix-comparison-length-regression",
    "objective": {
      "id": "prefix-comparison-length-regression",
      "text": "Select a test that detects comparing only the candidate’s length when checking a required prefix."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "A shorter candidate can match the beginning of the required prefix without containing the whole prefix."
    },
    "prerequisites": [
      "strncmp",
      "Byte lengths",
      "Prefix contracts"
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
        "Both arguments are nonempty ASCII strings. startsWith must report whether value begins with the entire prefix."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction startsWith(string $value, string $prefix): bool\n{\n    return strncmp($value, $prefix, strlen($value)) === 0;\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed implementation?",
    "options": [
      {
        "id": "equal",
        "text": "startsWith('abc', 'abc') === true",
        "rationale": "Equal strings match under either comparison length.",
        "misconception": "Using identical strings cannot expose which argument controls the length."
      },
      {
        "id": "shorter",
        "text": "startsWith('ab', 'abc') === false",
        "rationale": "Only two bytes are compared, so the implementation wrongly accepts a candidate shorter than its required prefix.",
        "misconception": null
      },
      {
        "id": "different",
        "text": "startsWith('xyz', 'abc') === false",
        "rationale": "The first byte differs, so both lengths reject the match.",
        "misconception": "Choosing an early mismatch that does not exercise the boundary."
      },
      {
        "id": "long-different",
        "text": "startsWith('abcdef', 'xyz') === false",
        "rationale": "The strings differ immediately and are correctly rejected.",
        "misconception": "Testing unequal lengths without a shared initial segment."
      }
    ],
    "correctOptionId": "shorter",
    "explanation": {
      "summary": "The comparison must cover the full prefix length. Using the candidate length can accept only a fragment of the requested prefix and can also mishandle longer valid candidates.",
      "trace": "Comparing ab with the first two bytes of abc returns equality. Comparing all three prefix bytes rejects it."
    },
    "validation": {
      "kind": "tests",
      "marker": "strlen($value)",
      "repair": "strlen($prefix)",
      "cases": [
        {
          "option": "equal",
          "probe": "echo json_encode(startsWith('abc', 'abc'));",
          "expected": "true"
        },
        {
          "option": "shorter",
          "probe": "echo json_encode(startsWith('ab', 'abc'));",
          "expected": "false"
        },
        {
          "option": "different",
          "probe": "echo json_encode(startsWith('xyz', 'abc'));",
          "expected": "false"
        },
        {
          "option": "long-different",
          "probe": "echo json_encode(startsWith('abcdef', 'xyz'));",
          "expected": "false"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.strncmp.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0382",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Functions & arguments",
    "subtopic": "overlapping-substring-count-test",
    "objective": {
      "id": "overlapping-substring-count-test",
      "text": "Test overlapping occurrences rather than only nonoverlapping substring matches."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Choose repeated text where one valid match begins inside another."
    },
    "prerequisites": [
      "substr_count",
      "strpos offsets",
      "Overlapping matches"
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
        "Inputs are ASCII and needle is nonempty. The required count includes every starting position where the entire needle matches, including overlaps."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction occurrences(string $text, string $needle): int\n{\n    return substr_count($text, $needle);\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed implementation?",
    "options": [
      {
        "id": "single",
        "text": "occurrences('abc', 'b') === 1",
        "rationale": "There is one isolated occurrence under either rule.",
        "misconception": "Using a single match cannot distinguish overlap policy."
      },
      {
        "id": "missing",
        "text": "occurrences('abc', 'x') === 0",
        "rationale": "Neither method finds a match.",
        "misconception": "Testing absence instead of the overlap boundary."
      },
      {
        "id": "separated",
        "text": "occurrences('ab--ab', 'ab') === 2",
        "rationale": "The two matches are separated and are counted by substr_count.",
        "misconception": "Assuming multiple matches necessarily overlap."
      },
      {
        "id": "overlap",
        "text": "occurrences('aaaa', 'aa') === 3",
        "rationale": "The required starts are 0, 1 and 2, but substr_count counts only the nonoverlapping starts 0 and 2.",
        "misconception": null
      }
    ],
    "correctOptionId": "overlap",
    "explanation": {
      "summary": "substr_count counts nonoverlapping occurrences. An overlapping scan must advance its next search by one position after each match rather than skipping the matched needle.",
      "trace": "For aaaa and aa, the repaired scan finds starts 0, 1 and 2. The original function returns two."
    },
    "validation": {
      "kind": "tests",
      "marker": "return substr_count($text, $needle);",
      "repair": "$count = 0;\n    $offset = 0;\n\n    while (($position = strpos($text, $needle, $offset)) !== false) {\n        $count++;\n        $offset = $position + 1;\n    }\n\n    return $count;",
      "cases": [
        {
          "option": "single",
          "probe": "echo occurrences('abc', 'b');",
          "expected": "1"
        },
        {
          "option": "missing",
          "probe": "echo occurrences('abc', 'x');",
          "expected": "0"
        },
        {
          "option": "separated",
          "probe": "echo occurrences('ab--ab', 'ab');",
          "expected": "2"
        },
        {
          "option": "overlap",
          "probe": "echo occurrences('aaaa', 'aa');",
          "expected": "3"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.substr-count.php",
      "https://www.php.net/manual/en/function.strpos.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0383",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Arrays & destructuring",
    "subtopic": "unordered-map-strict-value-test",
    "objective": {
      "id": "unordered-map-strict-value-test",
      "text": "Test map equality that ignores insertion order while preserving strict value equality."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate PHP array order identity from the application’s unordered-map contract."
    },
    "prerequisites": [
      "Strict array comparison",
      "String keys",
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
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "Inputs are flat maps with nonnumeric string keys and scalar values. Map equality ignores key insertion order but requires matching keys and strictly equal values."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction sameMap(array $left, array $right): bool\n{\n    return $left === $right;\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed implementation?",
    "options": [
      {
        "id": "reordered",
        "text": "sameMap(['a' => 1, 'b' => 2], ['b' => 2, 'a' => 1]) === true",
        "rationale": "Strict array identity includes key order, so equivalent maps inserted in different orders are rejected.",
        "misconception": null
      },
      {
        "id": "identical",
        "text": "sameMap(['a' => 1], ['a' => 1]) === true",
        "rationale": "The same insertion order and values already satisfy strict array identity.",
        "misconception": "Testing only identical representation cannot reveal an unwanted order constraint."
      },
      {
        "id": "different-value",
        "text": "sameMap(['a' => 1], ['a' => 2]) === false",
        "rationale": "Different values are correctly rejected by both contracts.",
        "misconception": "Using a value difference instead of an order-only difference."
      },
      {
        "id": "different-type",
        "text": "sameMap(['a' => 1], ['a' => '1']) === false",
        "rationale": "Strict value typing is required and already enforced.",
        "misconception": "Mistaking the desired strict value comparison for the unwanted order comparison."
      }
    ],
    "correctOptionId": "reordered",
    "explanation": {
      "summary": "PHP === for arrays requires the same keys in the same order as well as strict values. Sorting both key sets before comparison removes only the unwanted order dependence.",
      "trace": "The repair canonicalizes key order with ksort and retains ===, so reordered maps match without accepting integer/string value coercion."
    },
    "validation": {
      "kind": "tests",
      "marker": "return $left === $right;",
      "repair": "ksort($left);\n    ksort($right);\n\n    return $left === $right;",
      "cases": [
        {
          "option": "reordered",
          "probe": "echo json_encode(sameMap(['a' => 1, 'b' => 2], ['b' => 2, 'a' => 1]));",
          "expected": "true"
        },
        {
          "option": "identical",
          "probe": "echo json_encode(sameMap(['a' => 1], ['a' => 1]));",
          "expected": "true"
        },
        {
          "option": "different-value",
          "probe": "echo json_encode(sameMap(['a' => 1], ['a' => 2]));",
          "expected": "false"
        },
        {
          "option": "different-type",
          "probe": "echo json_encode(sameMap(['a' => 1], ['a' => '1']));",
          "expected": "false"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.array.php",
      "https://www.php.net/manual/en/function.ksort.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0384",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Types, casting & comparisons",
    "subtopic": "half-even-rounding-midpoint-test",
    "objective": {
      "id": "half-even-rounding-midpoint-test",
      "text": "Select a midpoint case that distinguishes half-to-even rounding from PHP’s default halfway rule."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "A tie with an even lower neighbor separates the two otherwise similar policies."
    },
    "prerequisites": [
      "round modes",
      "Nearest-integer rounding",
      "Even integer ties"
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
        "The required rule rounds to the nearest integer, resolving exact halves toward the even neighbor. The fixture values are exactly representable or are used only away from a rounding boundary."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction roundEven(float $number): float\n{\n    return round($number);\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed implementation?",
    "options": [
      {
        "id": "odd-lower",
        "text": "roundEven(1.5) === 2.0",
        "rationale": "Both half-away-from-zero and half-even select 2 for this tie.",
        "misconception": "Assuming every half value distinguishes the rounding policies."
      },
      {
        "id": "ordinary",
        "text": "roundEven(2.4) === 2.0",
        "rationale": "This is not a tie and both rules select the nearest integer 2.",
        "misconception": "Testing ordinary rounding rather than its tie-breaking rule."
      },
      {
        "id": "even-lower",
        "text": "roundEven(2.5) === 2.0",
        "rationale": "The default rounds this positive tie to 3, while the required even neighbor is 2.",
        "misconception": null
      },
      {
        "id": "negative",
        "text": "roundEven(-1.5) === -2.0",
        "rationale": "Both rules select -2 for this particular negative tie.",
        "misconception": "Assuming the sign alone guarantees a different tie result."
      }
    ],
    "correctOptionId": "even-lower",
    "explanation": {
      "summary": "The default halfway rule rounds away from zero. PHP_ROUND_HALF_EVEN chooses the even integer at an exact midpoint, so the parity of the adjacent integers matters.",
      "trace": "2.5 becomes 3 by default but 2 with half-even. The other three supplied assertions already pass under the default."
    },
    "validation": {
      "kind": "tests",
      "marker": "round($number)",
      "repair": "round($number, 0, PHP_ROUND_HALF_EVEN)",
      "cases": [
        {
          "option": "odd-lower",
          "probe": "echo json_encode(roundEven(1.5) === 2.0);",
          "expected": "true"
        },
        {
          "option": "ordinary",
          "probe": "echo json_encode(roundEven(2.4) === 2.0);",
          "expected": "true"
        },
        {
          "option": "even-lower",
          "probe": "echo json_encode(roundEven(2.5) === 2.0);",
          "expected": "true"
        },
        {
          "option": "negative",
          "probe": "echo json_encode(roundEven(-1.5) === -2.0);",
          "expected": "true"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/function.round.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0385",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "HTTP & superglobals",
    "subtopic": "http-method-case-sensitive-test",
    "objective": {
      "id": "http-method-case-sensitive-test",
      "text": "Test that HTTP method names are compared case-sensitively rather than normalized as header field names."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose an input whose method token changes meaning when uppercased."
    },
    "prerequisites": [
      "HTTP method token case sensitivity",
      "Strict string comparison",
      "strtoupper"
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
        "The pure helper receives a raw method token and authorizes exactly the uppercase token GET. It must not reinterpret other spellings as GET. This tests the helper’s contract without relying on a particular server’s request parser."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction permits(string $method): bool\n{\n    return strtoupper($method) === 'GET';\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed implementation?",
    "options": [
      {
        "id": "post",
        "text": "permits('POST') === false",
        "rationale": "Uppercasing POST leaves a different method and already rejects it.",
        "misconception": "Testing a different uppercase method misses case normalization."
      },
      {
        "id": "lowercase",
        "text": "permits('get') === false",
        "rationale": "The implementation turns this distinct token into GET and accepts it.",
        "misconception": null
      },
      {
        "id": "get",
        "text": "permits('GET') === true",
        "rationale": "The authorized exact token is accepted with or without normalization.",
        "misconception": "Testing only the permitted spelling cannot detect broadened admission."
      },
      {
        "id": "head",
        "text": "permits('HEAD') === false",
        "rationale": "The stated contract permits only GET, so HEAD is correctly rejected.",
        "misconception": "Assuming another retrieval method exercises case sensitivity."
      }
    ],
    "correctOptionId": "lowercase",
    "explanation": {
      "summary": "HTTP method tokens are case-sensitive. This differs from HTTP field names; a helper that must accept only GET should compare the original token.",
      "trace": "The repair removes strtoupper. Exact GET still passes, while get no longer becomes an authorized token."
    },
    "validation": {
      "kind": "tests",
      "marker": "strtoupper($method)",
      "repair": "$method",
      "cases": [
        {
          "option": "post",
          "probe": "echo json_encode(permits('POST'));",
          "expected": "false"
        },
        {
          "option": "lowercase",
          "probe": "echo json_encode(permits('get'));",
          "expected": "false"
        },
        {
          "option": "get",
          "probe": "echo json_encode(permits('GET'));",
          "expected": "true"
        },
        {
          "option": "head",
          "probe": "echo json_encode(permits('HEAD'));",
          "expected": "false"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc9110.html#section-9.1"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0386",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Classes & object lifecycle",
    "subtopic": "readonly-promotion-normalization-test",
    "objective": {
      "id": "readonly-promotion-normalization-test",
      "text": "Test normalization that attempts a second assignment to an already promoted readonly property."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Choose an input that enters the normalization branch after promotion has initialized the property."
    },
    "prerequisites": [
      "Constructor property promotion",
      "Readonly initialization",
      "trim"
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
        "All strings, including an empty string, are accepted. Construction must store trim(input). The wrapper returns error only when construction throws Error."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass NameValue\n{\n    public function __construct(public readonly string $name)\n    {\n        if ($name !== trim($name)) {\n            $this->name = trim($name);\n        }\n    }\n}\n\nfunction normalizedName(string $input): string\n{\n    try {\n        return (new NameValue($input))->name;\n    } catch (Error $failure) {\n        return 'error';\n    }\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed implementation?",
    "options": [
      {
        "id": "plain",
        "text": "normalizedName('Ada') === 'Ada'",
        "rationale": "No second assignment is attempted because the input is already trimmed.",
        "misconception": "Testing only already-normalized input leaves the bad branch unexecuted."
      },
      {
        "id": "empty",
        "text": "normalizedName('') === ''",
        "rationale": "The empty string is already equal to its trimmed value and is explicitly allowed.",
        "misconception": "Assuming emptiness itself triggers normalization or validation here."
      },
      {
        "id": "other",
        "text": "normalizedName('Lin') === 'Lin'",
        "rationale": "A different already-trimmed name follows the same successful branch.",
        "misconception": "Changing a name without changing the control-flow condition."
      },
      {
        "id": "spaces",
        "text": "normalizedName(' Ada ') === 'Ada'",
        "rationale": "Promotion initializes the readonly property first, so the attempted normalized reassignment throws Error.",
        "misconception": null
      }
    ],
    "correctOptionId": "spaces",
    "explanation": {
      "summary": "A promoted property is assigned before the constructor body runs. To initialize readonly storage with a normalized value, declare the property separately and assign it once after normalization.",
      "trace": "The padded input reaches the second write and returns error through the wrapper. The repaired constructor performs its first and only property write with Ada."
    },
    "validation": {
      "kind": "tests",
      "marker": "class NameValue\n{\n    public function __construct(public readonly string $name)\n    {\n        if ($name !== trim($name)) {\n            $this->name = trim($name);\n        }\n    }\n}",
      "repair": "class NameValue\n{\n    public readonly string $name;\n\n    public function __construct(string $name)\n    {\n        $this->name = trim($name);\n    }\n}",
      "cases": [
        {
          "option": "plain",
          "probe": "echo normalizedName('Ada');",
          "expected": "Ada"
        },
        {
          "option": "empty",
          "probe": "echo normalizedName('');",
          "expected": ""
        },
        {
          "option": "other",
          "probe": "echo normalizedName('Lin');",
          "expected": "Lin"
        },
        {
          "option": "spaces",
          "probe": "echo normalizedName(' Ada ');",
          "expected": "Ada"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.decon.php#language.oop5.decon.constructor.promotion",
      "https://www.php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0387",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Arrays & destructuring",
    "subtopic": "natural-digit-run-sort-test",
    "objective": {
      "id": "natural-digit-run-sort-test",
      "text": "Select a label set that distinguishes lexical ordering from natural numeric-run ordering."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "A multi-digit suffix changes relative order under the two comparison policies."
    },
    "prerequisites": [
      "sort flags",
      "SORT_STRING versus SORT_NATURAL",
      "ASCII labels"
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
        "Labels use lowercase ASCII letters and decimal digit runs without leading zeros. The required natural order compares digit runs by their numeric magnitude; duplicate labels remain present."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction ordered(array $labels): array\n{\n    sort($labels, SORT_STRING);\n\n    return $labels;\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed implementation?",
    "options": [
      {
        "id": "multi-digit",
        "text": "ordered(['item10', 'item2']) === ['item2', 'item10']",
        "rationale": "Lexical comparison places item10 first, while natural ordering compares 2 before 10.",
        "misconception": null
      },
      {
        "id": "single-digit",
        "text": "ordered(['item2', 'item1']) === ['item1', 'item2']",
        "rationale": "Single-digit suffixes have the same relative order under both modes.",
        "misconception": "Testing only equal-width one-digit runs misses the distinction."
      },
      {
        "id": "letters",
        "text": "ordered(['b', 'a']) === ['a', 'b']",
        "rationale": "There are no digit runs to compare differently.",
        "misconception": "Using plain letters cannot distinguish numeric-run handling."
      },
      {
        "id": "duplicates",
        "text": "ordered(['item2', 'item2']) === ['item2', 'item2']",
        "rationale": "Both sorting modes preserve the two equal entries.",
        "misconception": "Assuming duplicate retention depends on the selected comparison mode."
      }
    ],
    "correctOptionId": "multi-digit",
    "explanation": {
      "summary": "SORT_STRING compares character sequences, while SORT_NATURAL treats digit runs in a human-oriented numeric order. Different digit lengths expose the distinction.",
      "trace": "The repair selects SORT_NATURAL. item2 then precedes item10, while the other three expected results remain unchanged."
    },
    "validation": {
      "kind": "tests",
      "marker": "SORT_STRING",
      "repair": "SORT_NATURAL",
      "cases": [
        {
          "option": "multi-digit",
          "probe": "echo json_encode(ordered(['item10', 'item2']));",
          "expected": "[\"item2\",\"item10\"]"
        },
        {
          "option": "single-digit",
          "probe": "echo json_encode(ordered(['item2', 'item1']));",
          "expected": "[\"item1\",\"item2\"]"
        },
        {
          "option": "letters",
          "probe": "echo json_encode(ordered(['b', 'a']));",
          "expected": "[\"a\",\"b\"]"
        },
        {
          "option": "duplicates",
          "probe": "echo json_encode(ordered(['item2', 'item2']));",
          "expected": "[\"item2\",\"item2\"]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.sort.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0388",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "PDO & database access",
    "subtopic": "sqlite-foreign-key-enforcement-test",
    "objective": {
      "id": "sqlite-foreign-key-enforcement-test",
      "text": "Select a fixture that verifies foreign-key enforcement on a newly configured PDO SQLite connection."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Valid inserts can pass even when the declared constraint is not being enforced."
    },
    "prerequisites": [
      "PDO SQLite",
      "PRAGMA foreign_keys",
      "Nullable foreign keys",
      "PDO exceptions"
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
        "The SQLite library supports foreign keys. Each new connection in this fixture starts with foreign_keys disabled; no transaction is active while configuring it. A null parent is allowed, but every nonnull parent must exist."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction insertAllowed(?int $parent): bool\n{\n    $pdo = new PDO('sqlite::memory:');\n    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n    /* configure constraints */\n    $pdo->exec('CREATE TABLE parents (id INTEGER PRIMARY KEY)');\n    $pdo->exec('INSERT INTO parents VALUES (1), (2)');\n    $pdo->exec('CREATE TABLE children (parent_id INTEGER REFERENCES parents(id))');\n\n    try {\n        $statement = $pdo->prepare('INSERT INTO children (parent_id) VALUES (?)');\n        $statement->execute([$parent]);\n\n        return true;\n    } catch (PDOException $failure) {\n        return false;\n    }\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed implementation?",
    "options": [
      {
        "id": "first-parent",
        "text": "insertAllowed(1) === true",
        "rationale": "The referenced parent exists, so this insert succeeds with or without enforcement.",
        "misconception": "Using only valid references cannot prove the constraint is active."
      },
      {
        "id": "null-parent",
        "text": "insertAllowed(null) === true",
        "rationale": "The nullable foreign key permits null even when enforcement is enabled.",
        "misconception": "Assuming null must violate every foreign-key declaration."
      },
      {
        "id": "missing-parent",
        "text": "insertAllowed(99) === false",
        "rationale": "With enforcement disabled, the missing parent is not rejected and the function returns true.",
        "misconception": null
      },
      {
        "id": "second-parent",
        "text": "insertAllowed(2) === true",
        "rationale": "Another existing parent is also a valid reference under either setting.",
        "misconception": "Adding another valid example does not test rejection of invalid references."
      }
    ],
    "correctOptionId": "missing-parent",
    "explanation": {
      "summary": "Declaring a foreign key and enabling its enforcement are separate concerns on the stated SQLite connection. A nonexistent nonnull parent is the case that distinguishes them.",
      "trace": "Enabling PRAGMA foreign_keys=ON before the schema operations makes parent 99 raise PDOException, while parents 1, 2 and null remain accepted."
    },
    "validation": {
      "kind": "tests",
      "marker": "/* configure constraints */",
      "repair": "$pdo->exec('PRAGMA foreign_keys = ON');",
      "cases": [
        {
          "option": "first-parent",
          "probe": "echo json_encode(insertAllowed(1));",
          "expected": "true"
        },
        {
          "option": "null-parent",
          "probe": "echo json_encode(insertAllowed(null));",
          "expected": "true"
        },
        {
          "option": "missing-parent",
          "probe": "echo json_encode(insertAllowed(99));",
          "expected": "false"
        },
        {
          "option": "second-parent",
          "probe": "echo json_encode(insertAllowed(2));",
          "expected": "true"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.sqlite.org/foreignkeys.html#fk_enable"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0389",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "PDO & database access",
    "subtopic": "pdo-in-list-single-placeholder-test",
    "objective": {
      "id": "pdo-in-list-single-placeholder-test",
      "text": "Select a query test that detects binding a comma-separated list as one scalar parameter."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Singleton lists can hide the missing expansion into separate value placeholders."
    },
    "prerequisites": [
      "PDO placeholders",
      "SQL IN lists",
      "SQLite parameter affinity"
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
        "The argument is a list of distinct integer IDs. The function must count stored IDs belonging to that list; an empty list returns zero. Only the displayed two rows exist."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction matchingCount(array $ids): int\n{\n    if ($ids === []) {\n        return 0;\n    }\n\n    $pdo = new PDO('sqlite::memory:');\n    $pdo->exec('CREATE TABLE entries (id INTEGER PRIMARY KEY)');\n    $pdo->exec('INSERT INTO entries VALUES (1), (2)');\n    $statement = $pdo->prepare('SELECT COUNT(*) FROM entries WHERE id IN (:ids)');\n    $statement->execute(['ids' => implode(',', $ids)]);\n\n    return (int) $statement->fetchColumn();\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed implementation?",
    "options": [
      {
        "id": "one",
        "text": "matchingCount([1]) === 1",
        "rationale": "The single bound string 1 matches the stored integer through SQLite’s affinity rules.",
        "misconception": "A singleton list does not distinguish one scalar from multiple parameters."
      },
      {
        "id": "two-values",
        "text": "matchingCount([1, 2]) === 2",
        "rationale": "The bound value is one string 1,2, not two SQL list elements, so neither row matches.",
        "misconception": null
      },
      {
        "id": "other-one",
        "text": "matchingCount([2]) === 1",
        "rationale": "The second singleton is also represented by one matching scalar.",
        "misconception": "Changing the singleton value does not exercise expansion."
      },
      {
        "id": "empty",
        "text": "matchingCount([]) === 0",
        "rationale": "The explicit early return already handles the empty list.",
        "misconception": "Testing a path that never prepares or binds the SQL."
      }
    ],
    "correctOptionId": "two-values",
    "explanation": {
      "summary": "A placeholder represents one value. A comma inside a bound string remains data; it does not become SQL list syntax. Generate one placeholder per value and bind the values separately.",
      "trace": "The repair creates IN (?,?) for the two-element case and binds 1 and 2 independently. The placeholder text is generated from count, not from raw values."
    },
    "validation": {
      "kind": "tests",
      "marker": "$statement = $pdo->prepare('SELECT COUNT(*) FROM entries WHERE id IN (:ids)');\n    $statement->execute(['ids' => implode(',', $ids)]);",
      "repair": "$placeholders = implode(',', array_fill(0, count($ids), '?'));\n    $statement = $pdo->prepare('SELECT COUNT(*) FROM entries WHERE id IN (' . $placeholders . ')');\n    $statement->execute($ids);",
      "cases": [
        {
          "option": "one",
          "probe": "echo matchingCount([1]);",
          "expected": "1"
        },
        {
          "option": "two-values",
          "probe": "echo matchingCount([1, 2]);",
          "expected": "2"
        },
        {
          "option": "other-one",
          "probe": "echo matchingCount([2]);",
          "expected": "1"
        },
        {
          "option": "empty",
          "probe": "echo matchingCount([]);",
          "expected": "0"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdo.prepare.php",
      "https://www.sqlite.org/datatype3.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0390",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Functions & arguments",
    "subtopic": "decimal-wire-thousands-separator-test",
    "objective": {
      "id": "decimal-wire-thousands-separator-test",
      "text": "Choose a numeric formatting test that exposes unwanted grouping separators in a wire format."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "A value crossing the first grouping boundary differs from smaller values under the same formatting call."
    },
    "prerequisites": [
      "number_format arguments",
      "Fixed decimal strings",
      "Grouping separators"
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
        "The record format requires a decimal point, exactly two fractional digits and no thousands separator. The chosen inputs avoid ambiguous floating-point midpoint cases. This is text formatting, not a numeric return API."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction decimalText(float $value): string\n{\n    return number_format($value, 2);\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed implementation?",
    "options": [
      {
        "id": "fraction",
        "text": "decimalText(1.5) === '1.50'",
        "rationale": "This value receives two fractional digits but needs no grouping separator.",
        "misconception": "Testing fractional padding does not exercise thousands grouping."
      },
      {
        "id": "zero",
        "text": "decimalText(0.0) === '0.00'",
        "rationale": "Zero also has no group boundary.",
        "misconception": "Assuming a zero case covers every formatting option."
      },
      {
        "id": "negative",
        "text": "decimalText(-2.5) === '-2.50'",
        "rationale": "The sign and two decimal digits are already correct for this small magnitude.",
        "misconception": "Using negativity instead of a grouping-size boundary."
      },
      {
        "id": "thousand",
        "text": "decimalText(1000.0) === '1000.00'",
        "rationale": "The default thousands separator makes the implementation return 1,000.00.",
        "misconception": null
      }
    ],
    "correctOptionId": "thousand",
    "explanation": {
      "summary": "number_format uses a comma thousands separator by default. Supplying an empty fourth argument removes grouping while retaining the explicit decimal point and precision.",
      "trace": "The repaired call number_format(value, 2, dot, empty) returns 1000.00, and the smaller control values keep their expected representations."
    },
    "validation": {
      "kind": "tests",
      "marker": "number_format($value, 2)",
      "repair": "number_format($value, 2, '.', '')",
      "cases": [
        {
          "option": "fraction",
          "probe": "echo decimalText(1.5);",
          "expected": "1.50"
        },
        {
          "option": "zero",
          "probe": "echo decimalText(0.0);",
          "expected": "0.00"
        },
        {
          "option": "negative",
          "probe": "echo decimalText(-2.5);",
          "expected": "-2.50"
        },
        {
          "option": "thousand",
          "probe": "echo decimalText(1000.0);",
          "expected": "1000.00"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.number-format.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0391",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Classes & object lifecycle",
    "subtopic": "deep-copy-shared-node-identity-test",
    "objective": {
      "id": "deep-copy-shared-node-identity-test",
      "text": "Test preservation of alias relationships within a deep-copied object graph."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "A copy can preserve values and avoid original objects while still duplicating a node that should remain shared inside the copy."
    },
    "prerequisites": [
      "Object graph identity",
      "Recursive copying",
      "Memoized graph traversal"
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
        "The graph-copy contract requires one new node per distinct original node. Repeated references to an original node must refer to the same corresponding copied node. The displayed graph is acyclic; the question tests sharing, not recursion termination."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Node\n{\n    public function __construct(public string $name, public array $children = [])\n    {\n    }\n}\n\nfunction copyGraph(Node $node): Node\n{\n    $copy = new Node($node->name);\n\n    foreach ($node->children as $child) {\n        $copy->children[] = copyGraph($child);\n    }\n\n    return $copy;\n}\n\n$leaf = new Node('leaf');\n$root = new Node('root', [$leaf, $leaf]);\n$copy = copyGraph($root);\n"
        }
      ]
    },
    "stem": "Which assertion fails against the displayed copy operation?",
    "options": [
      {
        "id": "root-distinct",
        "text": "$copy !== $root",
        "rationale": "The implementation already creates a new root object.",
        "misconception": "Testing separation from the original does not prove sharing within the copy."
      },
      {
        "id": "leaf-distinct",
        "text": "$copy->children[0] !== $leaf",
        "rationale": "The first copied child is also distinct from the original leaf.",
        "misconception": "Checking only that no original leaf is reused misses duplicated copies."
      },
      {
        "id": "value-preserved",
        "text": "$copy->children[0]->name === 'leaf'",
        "rationale": "The scalar name is copied correctly.",
        "misconception": "Using value equality to verify an object-identity relation."
      },
      {
        "id": "alias-preserved",
        "text": "$copy->children[0] === $copy->children[1]",
        "rationale": "The two recursive visits create different copies of the same original leaf.",
        "misconception": null
      }
    ],
    "correctOptionId": "alias-preserved",
    "explanation": {
      "summary": "Deep copying a graph requires preserving its internal reference relationships as well as its values. A visited-object map reuses the one copy already made for each original node.",
      "trace": "The original root points twice to the same leaf. The faulty copy creates two leaves; memoization makes both copied edges point to one new leaf."
    },
    "validation": {
      "kind": "tests",
      "marker": "function copyGraph(Node $node): Node\n{\n    $copy = new Node($node->name);\n\n    foreach ($node->children as $child) {\n        $copy->children[] = copyGraph($child);\n    }\n\n    return $copy;\n}",
      "repair": "function copyGraph(Node $node, array &$seen = []): Node\n{\n    $identity = spl_object_id($node);\n\n    if (isset($seen[$identity])) {\n        return $seen[$identity];\n    }\n\n    $copy = new Node($node->name);\n    $seen[$identity] = $copy;\n\n    foreach ($node->children as $child) {\n        $copy->children[] = copyGraph($child, $seen);\n    }\n\n    return $copy;\n}",
      "cases": [
        {
          "option": "root-distinct",
          "probe": "echo json_encode($copy !== $root);",
          "expected": "true"
        },
        {
          "option": "leaf-distinct",
          "probe": "echo json_encode($copy->children[0] !== $leaf);",
          "expected": "true"
        },
        {
          "option": "value-preserved",
          "probe": "echo json_encode($copy->children[0]->name === 'leaf');",
          "expected": "true"
        },
        {
          "option": "alias-preserved",
          "probe": "echo json_encode($copy->children[0] === $copy->children[1]);",
          "expected": "true"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.object-comparison.php",
      "https://www.php.net/manual/en/function.spl-object-id.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0392",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Iterators, generators & fibers",
    "subtopic": "fiber-interleaving-single-use-claim-test",
    "objective": {
      "id": "fiber-interleaving-single-use-claim-test",
      "text": "Select a deterministic overlapping schedule that exposes a check-then-mark race in a single-use gate."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Sequential replay tests can pass while two suspended callers both observe an unused token."
    },
    "prerequisites": [
      "PHP Fibers",
      "Cooperative scheduling",
      "Check-then-act races",
      "Single-use claims"
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
        "All calls share one Gate in one PHP process. Execution can switch Fibers only at the shown suspension. Tokens A and B are valid and may each succeed once; unknown tokens fail. This in-process fixture does not claim to implement a distributed or persistent token store."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Gate\n{\n    private array $used = [];\n\n    public function consume(string $token): bool\n    {\n        if (!in_array($token, ['A', 'B'], true) || isset($this->used[$token])) {\n            return false;\n        }\n\n        Fiber::suspend();\n        $this->used[$token] = true;\n\n        return true;\n    }\n}\n\nfunction finish(Fiber $fiber): bool\n{\n    if (!$fiber->isStarted()) {\n        $fiber->start();\n    }\n\n    if ($fiber->isSuspended()) {\n        $fiber->resume();\n    }\n\n    return $fiber->getReturn();\n}\n"
        }
      ]
    },
    "stem": "Which test schedule violates the single-use contract in the current implementation?",
    "options": [
      {
        "id": "sequential",
        "text": "Complete consume(A), then complete consume(A) again; expect [true,false].",
        "rationale": "The first call marks A before the second begins, so the original passes this schedule.",
        "misconception": "Assuming a sequential replay test covers overlapping claims."
      },
      {
        "id": "different",
        "text": "Complete consume(A), then complete consume(B); expect [true,true].",
        "rationale": "Different valid tokens do not compete for the same used entry.",
        "misconception": "Testing concurrency policy only with independent keys."
      },
      {
        "id": "overlap",
        "text": "Start two consume(A) Fibers before finishing either; expect [true,false].",
        "rationale": "Both original calls pass the unused check before either marks A, so both return true.",
        "misconception": null
      },
      {
        "id": "unknown",
        "text": "Complete consume(missing); expect false.",
        "rationale": "The validity guard rejects the token before suspension.",
        "misconception": "Choosing a path that never reaches the race window."
      }
    ],
    "correctOptionId": "overlap",
    "explanation": {
      "summary": "The suspension separates the unused check from the claim. In this cooperative model, marking before that suspension makes the check and claim indivisible with respect to other Fibers.",
      "trace": "Originally both A calls suspend after observing unused and later succeed. With marking moved before suspension, the second start sees A already used and returns false immediately."
    },
    "validation": {
      "kind": "tests",
      "marker": "Fiber::suspend();\n        $this->used[$token] = true;",
      "repair": "$this->used[$token] = true;\n        Fiber::suspend();",
      "cases": [
        {
          "option": "sequential",
          "probe": "$gate = new Gate();\necho json_encode([finish(new Fiber(fn () => $gate->consume('A'))), finish(new Fiber(fn () => $gate->consume('A')))]);",
          "expected": "[true,false]"
        },
        {
          "option": "different",
          "probe": "$gate = new Gate();\necho json_encode([finish(new Fiber(fn () => $gate->consume('A'))), finish(new Fiber(fn () => $gate->consume('B')))]);",
          "expected": "[true,true]"
        },
        {
          "option": "overlap",
          "probe": "$gate = new Gate();\n$first = new Fiber(fn () => $gate->consume('A'));\n$second = new Fiber(fn () => $gate->consume('A'));\n$first->start();\n$second->start();\necho json_encode([finish($first), finish($second)]);",
          "expected": "[true,false]"
        },
        {
          "option": "unknown",
          "probe": "$gate = new Gate();\necho json_encode(finish(new Fiber(fn () => $gate->consume('missing'))));",
          "expected": "false"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/language.fibers.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0393",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "PDO & database access",
    "subtopic": "read-after-write-replica-routing",
    "objective": {
      "id": "read-after-write-replica-routing",
      "text": "Preserve read-after-write behavior when a PHP service routes reads to asynchronous replicas."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a confirmed primary commit from immediate visibility on another connection’s replica."
    },
    "prerequisites": [
      "Primary and asynchronous read replicas",
      "PDO connection routing",
      "Read-after-write consistency"
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
        "A PHP request inserts an order on the primary and receives a confirmed successful commit. It must then read database-generated fields for that order before responding. Replication lag is variable and has no fixed upper bound in this scenario. The primary remains available. No database operation is performed during question validation."
      ],
      "files": []
    },
    "stem": "The generic read router sometimes reports the new order missing because it chooses a replica. Which routing policy meets the immediate confirmation requirement?",
    "options": [
      {
        "id": "primary-confirmation",
        "text": "Route this confirmation read to the primary that accepted the write.",
        "rationale": "The confirmed write is visible on that primary without waiting for asynchronous replication.",
        "misconception": null
      },
      {
        "id": "fixed-sleep",
        "text": "Wait a fixed 100 ms, then use any replica for the confirmation read.",
        "rationale": "The stated lag has no bound ensuring a replica catches up within 100 ms.",
        "misconception": "Treating a typical replication delay as a consistency guarantee."
      },
      {
        "id": "replica-isolation",
        "text": "Use a higher transaction isolation level on the replica for the read.",
        "rationale": "Isolation of the replica’s local snapshot does not make missing replication records arrive.",
        "misconception": "Confusing snapshot isolation with replication freshness."
      },
      {
        "id": "submitted-copy",
        "text": "Build the response solely from submitted fields without reading stored values.",
        "rationale": "The response must include database-generated fields, which are absent from the submitted data.",
        "misconception": "Replacing a required post-write database observation with the request payload."
      }
    ],
    "correctOptionId": "primary-confirmation",
    "explanation": {
      "summary": "A successful primary commit does not imply immediate replica visibility. A read that must observe that write needs a source with the required consistency, which the available primary provides here.",
      "trace": "The confirmation uses the primary connection path; unrelated reads can still use replicas according to their own freshness requirements."
    },
    "validation": {
      "kind": "document-review",
      "rule": "The scenario defines asynchronous replication with unbounded lag and a confirmed available primary; only the primary route guarantees this immediate observation.",
      "optionAudit": {
        "primary-confirmation": "Reads from the node with the confirmed committed row.",
        "fixed-sleep": "No stated lag bound justifies the delay.",
        "replica-isolation": "Does not advance replication.",
        "submitted-copy": "Cannot supply required database-generated fields."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.postgresql.org/docs/18/warm-standby.html",
      "https://www.php.net/manual/en/pdo.connections.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0394",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "HTTP & superglobals",
    "subtopic": "partial-update-presence-value-separation",
    "objective": {
      "id": "partial-update-presence-value-separation",
      "text": "Preserve field presence independently of a nullable value in a partial-update boundary."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "The API has three operations that cannot be represented by one nullable value alone."
    },
    "prerequisites": [
      "Partial-update contracts",
      "PHP array_key_exists",
      "Nullable fields",
      "Input DTO design"
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
        "This application defines its own partial-update contract for name: an absent key leaves the stored name unchanged, a present null clears it, and a present string replaces it, including an empty string. These are explicit application rules, not a claim that every PATCH format uses them."
      ],
      "files": []
    },
    "stem": "Which request representation preserves all three operations through validation and into the use case?",
    "options": [
      {
        "id": "null-to-absent",
        "text": "Drop every null-valued key, then pass the remaining values to the use case.",
        "rationale": "An explicit clear operation becomes indistinguishable from leaving the field unchanged.",
        "misconception": "Treating null as absence even when the contract assigns it an operation."
      },
      {
        "id": "defaults-null",
        "text": "Fill every absent optional key with null before constructing the request object.",
        "rationale": "An omitted field becomes a clear operation.",
        "misconception": "Treating a nullable default as a lossless representation of field absence."
      },
      {
        "id": "presence-and-value",
        "text": "Carry a presence flag or key membership separately from the nullable name value.",
        "rationale": "The use case can distinguish keep, clear and replacement without coercing their representations.",
        "misconception": null
      },
      {
        "id": "string-cast",
        "text": "Cast every supplied name to string and use an empty string as the absent marker.",
        "rationale": "Null, an explicit empty string and absence cannot retain their distinct meanings.",
        "misconception": "Using one convenient scalar sentinel for several valid states."
      }
    ],
    "correctOptionId": "presence-and-value",
    "explanation": {
      "summary": "A nullable value can represent a string or null, but not whether the caller supplied the field. Preserving presence as separate information keeps the application’s three operations distinguishable.",
      "trace": "No key means keep; present plus null means clear; present plus a string means replace. array_key_exists can observe presence even when the value is null."
    },
    "validation": {
      "kind": "document-review",
      "rule": "The stated API assigns different operations to absent, present-null and present-string inputs; a representation must preserve all three states.",
      "optionAudit": {
        "null-to-absent": "Collapses clear into keep.",
        "defaults-null": "Collapses keep into clear.",
        "presence-and-value": "Preserves all three operations.",
        "string-cast": "Collapses meaningful null/empty/absent states."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-key-exists.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0395",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Validation & web security",
    "subtopic": "queued-action-current-authorization",
    "objective": {
      "id": "queued-action-current-authorization",
      "text": "Authorize a delayed action using the actor’s permissions at execution time when revocation must take effect."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate integrity of a queued instruction from freshness of the authority to execute it."
    },
    "prerequisites": [
      "Background job payloads",
      "Authorization revocation",
      "Signed messages",
      "Execution-time checks"
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
        "A queued export is signed and cannot be tampered with. The actor was allowed to export when it was queued, but permission can be revoked before a worker starts. Policy requires the worker to honor any revocation committed before execution starts. The current authorization store is available to the worker."
      ],
      "files": []
    },
    "stem": "Which worker policy satisfies that revocation requirement?",
    "options": [
      {
        "id": "signed-decision",
        "text": "Store allowed=true in the signed payload and trust that value during execution.",
        "rationale": "The signature preserves an earlier decision but does not make it current after revocation.",
        "misconception": "Equating message integrity with authorization freshness."
      },
      {
        "id": "current-policy",
        "text": "Use the actor ID to load current authorization and check the export operation when the worker executes it.",
        "rationale": "The decision is made against the permission state required by the policy.",
        "misconception": null
      },
      {
        "id": "role-snapshot",
        "text": "Store the actor’s complete role list at enqueue time and evaluate that snapshot in the worker.",
        "rationale": "A detailed stale snapshot still contains revoked authority.",
        "misconception": "Assuming more authorization detail removes the time gap."
      },
      {
        "id": "signature-again",
        "text": "Reverify the queue signature immediately before exporting, without reading authorization state.",
        "rationale": "The unchanged signed job remains authentic even after its actor loses permission.",
        "misconception": "Using authenticity verification as a replacement for current access control."
      }
    ],
    "correctOptionId": "current-policy",
    "explanation": {
      "summary": "A valid signature proves that the queued message was not altered; it does not prove the actor still has permission. The policy explicitly chooses execution-time authority.",
      "trace": "The worker loads the actor’s current permissions before starting the export and rejects the job if export permission has been revoked."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Revocations committed before execution must apply; enqueue-time decisions and snapshots are insufficient even when authentic.",
      "optionAudit": {
        "signed-decision": "Preserves a stale decision.",
        "current-policy": "Observes the required current authorization state.",
        "role-snapshot": "Evaluates stale permissions.",
        "signature-again": "Checks integrity without freshness of authority."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0396",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Performance, processes & servers",
    "subtopic": "rolling-release-cache-schema-namespace",
    "objective": {
      "id": "rolling-release-cache-schema-namespace",
      "text": "Separate incompatible cache representations while two application versions run concurrently."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Account for old writers continuing to repopulate a shared cache during a rolling deployment."
    },
    "prerequisites": [
      "Cache key design",
      "Schema versioning",
      "Rolling releases",
      "Disposable cached data"
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
        "A shared cache stores disposable computed data. Version 1 and version 2 PHP workers run concurrently during rollout. Their payload formats are incompatible, and the version 1 reader cannot be changed to understand version 2. Both versions can recompute their own cache misses. Source records remain compatible and unchanged."
      ],
      "files": []
    },
    "stem": "Which cache strategy allows both worker versions to operate without reading the other version’s incompatible payloads?",
    "options": [
      {
        "id": "flush-once",
        "text": "Flush the shared keys once before starting version 2, then keep the same keys.",
        "rationale": "Version 1 workers can immediately repopulate those keys with version 1 payloads.",
        "misconception": "Assuming a one-time purge separates representations during concurrent writes."
      },
      {
        "id": "short-ttl",
        "text": "Keep shared keys but reduce the TTL to one second during rollout.",
        "rationale": "Either version can still read the other payload within that second.",
        "misconception": "Treating a short exposure window as a compatibility guarantee."
      },
      {
        "id": "writer-timestamp",
        "text": "Keep shared keys and attach a write timestamp to each payload.",
        "rationale": "A newer timestamp does not tell an old reader how to interpret the incompatible new structure.",
        "misconception": "Using freshness metadata as a substitute for representation compatibility."
      },
      {
        "id": "versioned-keys",
        "text": "Use separate schema-version namespaces for cache keys and let each version rebuild its misses.",
        "rationale": "Each reader and writer uses only the representation it understands.",
        "misconception": null
      }
    ],
    "correctOptionId": "versioned-keys",
    "explanation": {
      "summary": "Concurrent incompatible writers need distinct cache identities or compatible readers. Because the old reader cannot change, versioned key namespaces provide the required separation.",
      "trace": "Version 1 continues using its namespace while version 2 populates a new one. Old entries can expire or be removed after the old workers are retired."
    },
    "validation": {
      "kind": "document-review",
      "rule": "The scenario permits recomputation but forbids cross-version payload interpretation; key namespaces must separate concurrent incompatible formats.",
      "optionAudit": {
        "flush-once": "Old workers repopulate shared keys after the purge.",
        "short-ttl": "Still permits incompatible reads before expiration.",
        "writer-timestamp": "Does not supply a compatible representation.",
        "versioned-keys": "Separates both readers and writers by schema version."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://www.php-fig.org/psr/16/#12-definitions"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0397",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "plugin-contract-with-existing-inheritance",
    "objective": {
      "id": "plugin-contract-with-existing-inheritance",
      "text": "Choose a nominal plugin contract without replacing existing parent classes."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate type contracts from inherited implementation and trait code reuse."
    },
    "prerequisites": [
      "Interfaces",
      "Single class inheritance",
      "Traits",
      "Parameter type declarations"
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
        "Plugin classes already extend different third-party base classes and must keep those parents. The plugin classes can be edited to add a shared contract. Every plugin must expose id(): string and run(): void. register must use one PHP parameter type that enforces that contract."
      ],
      "files": []
    },
    "stem": "Which design satisfies the contract while preserving each plugin’s existing inheritance?",
    "options": [
      {
        "id": "interface",
        "text": "Define a Plugin interface with id and run, implement it on each class, and type register as Plugin.",
        "rationale": "An interface supplies the nominal method contract without replacing an existing parent class.",
        "misconception": null
      },
      {
        "id": "base-class",
        "text": "Create an abstract Plugin base class and make each existing plugin extend it as an additional parent.",
        "rationale": "PHP classes cannot extend two classes, so this conflicts with keeping the existing parent.",
        "misconception": "Using multiple class inheritance to add a shared contract."
      },
      {
        "id": "trait-type",
        "text": "Put id and run in a trait and use that trait name as register’s parameter type.",
        "rationale": "Traits provide reusable code but are not nominal types that objects implement.",
        "misconception": "Treating a trait as an interface in type declarations."
      },
      {
        "id": "method-names",
        "text": "Type register as object and check method_exists for id and run.",
        "rationale": "The object type does not enforce the required method signatures as a shared PHP contract.",
        "misconception": "Equating method-name presence with a nominal, signature-checked interface."
      }
    ],
    "correctOptionId": "interface",
    "explanation": {
      "summary": "A class can implement interfaces while extending its required parent. Traits can share implementation, but an interface is the appropriate type-level promise for these two methods.",
      "trace": "Each plugin retains its parent and declares implements Plugin. register(Plugin $plugin) then accepts any conforming implementation."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP supports one parent class and multiple implemented interfaces; traits are not object types for parameter contracts.",
      "optionAudit": {
        "interface": "Adds the required method contract without changing class ancestry.",
        "base-class": "Requires unsupported additional class inheritance.",
        "trait-type": "Cannot establish the requested nominal type.",
        "method-names": "Does not make the object parameter enforce the signatures."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.interfaces.php",
      "https://www.php.net/manual/en/language.oop5.traits.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0398",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Performance, processes & servers",
    "subtopic": "provider-concurrency-capacity-isolation",
    "objective": {
      "id": "provider-concurrency-capacity-isolation",
      "text": "Reserve execution capacity for one integration when another can occupy all shared workers."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate time limits and failure detection from admission control during the interval before any timeout occurs."
    },
    "prerequisites": [
      "Worker concurrency",
      "Timeouts",
      "Circuit breakers",
      "Capacity isolation"
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
        "A PHP worker service has 100 concurrent execution slots. Provider A can hang until its timeout, and a burst can occupy all shared slots. Provider B must retain at least 20 usable slots even before any A call times out. B itself is healthy; the requirement concerns slot availability, not a bound on B response time."
      ],
      "files": []
    },
    "stem": "Which design guarantees the required capacity isolation?",
    "options": [
      {
        "id": "shorter-timeout",
        "text": "Keep the shared queue and shorten A’s timeout so blocked slots are released sooner.",
        "rationale": "A can still occupy all slots during the interval before its timeout.",
        "misconception": "Treating a shorter occupancy period as a reserved concurrency budget."
      },
      {
        "id": "failure-breaker",
        "text": "Keep the shared queue and open A’s circuit after several timeout failures.",
        "rationale": "Before the first timeout failures are recorded, A can already occupy every slot.",
        "misconception": "Assuming failure-triggered admission control guarantees capacity before failure detection."
      },
      {
        "id": "reserved-capacity",
        "text": "Use separate admission budgets: cap A at 80 concurrent calls and reserve at least 20 slots for B.",
        "rationale": "The concurrency limit prevents A from consuming the capacity reserved for B.",
        "misconception": null
      },
      {
        "id": "retry-jitter",
        "text": "Keep the shared queue and add randomized delays before retrying A failures.",
        "rationale": "Jitter changes retry timing but does not constrain the first burst’s slot use.",
        "misconception": "Using retry smoothing to guarantee isolation of initial concurrent requests."
      }
    ],
    "correctOptionId": "reserved-capacity",
    "explanation": {
      "summary": "The stated guarantee is about concurrent occupancy before timeouts or failure counts exist. A per-provider admission limit with reserved B capacity directly enforces that invariant.",
      "trace": "Even with 80 blocked A calls, 20 slots remain available to B. Timeouts, breakers and jitter can complement this design but do not supply that reservation by themselves."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Under the stated 100-slot model, a hard A cap of 80 plus a B reservation prevents A from exhausting B capacity before failure detection.",
      "optionAudit": {
        "shorter-timeout": "Allows full occupancy until the shorter timeout.",
        "failure-breaker": "Requires observations that may not yet exist.",
        "reserved-capacity": "Enforces the specified concurrent allocation.",
        "retry-jitter": "Does not limit the initial burst."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://www.php.net/manual/en/features.commandline.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0399",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Transactions, migrations & ORM",
    "subtopic": "serialization-retry-recomputes-transaction",
    "objective": {
      "id": "serialization-retry-recomputes-transaction",
      "text": "Choose the correct retry boundary after a confirmed PostgreSQL serialization failure."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Recompute decisions from fresh transactional reads instead of replaying a failed statement or stale chosen values."
    },
    "prerequisites": [
      "PostgreSQL serializable transactions (advanced)",
      "PDO rollback",
      "SQLSTATE 40001",
      "Retry boundaries"
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
        "A PostgreSQL 18 transaction reads inventory, decides quantities and performs several writes through PDO. A statement raises SQLSTATE 40001, and the transaction is now aborted with no writes committed. No external side effects occurred. Other transactions can change inventory. The application allows a bounded number of retries and can report failure after exhaustion."
      ],
      "files": []
    },
    "stem": "Which retry design preserves the operation’s inventory rules?",
    "options": [
      {
        "id": "whole-operation",
        "text": "Roll back, start a new transaction, and rerun the reads, decisions and writes within the retry budget.",
        "rationale": "A fresh attempt bases all decisions on the new transaction’s observations.",
        "misconception": null
      },
      {
        "id": "failed-statement",
        "text": "Roll back, start a new transaction, and run only the statement that reported the failure.",
        "rationale": "Earlier writes and the decisions that justified them are missing from the new transaction.",
        "misconception": "Treating a transaction failure as an isolated failed statement."
      },
      {
        "id": "same-transaction",
        "text": "Catch the exception and rerun the whole operation on the same still-open transaction.",
        "rationale": "The aborted transaction cannot continue normal statements until rollback.",
        "misconception": "Assuming catching a PDO exception resets the database transaction state."
      },
      {
        "id": "cached-decisions",
        "text": "Roll back and replay the previously chosen write values in a new transaction without repeating reads.",
        "rationale": "Inventory may have changed, so the earlier decision can violate the rules in the new attempt.",
        "misconception": "Retrying SQL while retaining decisions derived from an obsolete snapshot."
      }
    ],
    "correctOptionId": "whole-operation",
    "explanation": {
      "summary": "A serialization retry must encompass the entire transaction, including application logic that determines which writes to issue. A confirmed aborted attempt can be retried after rollback; a new attempt must make fresh decisions.",
      "trace": "Rollback clears the aborted state. The next transaction rereads inventory and computes its writes again. This scenario does not concern an ambiguous commit or external side effects."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PostgreSQL documents SQLSTATE 40001 and requires retrying the complete transaction, including logic that chooses statements and values.",
      "optionAudit": {
        "whole-operation": "Recreates a coherent transactional attempt from fresh observations.",
        "failed-statement": "Omits prior work and its decision context.",
        "same-transaction": "Retains an aborted transaction.",
        "cached-decisions": "Reuses possibly invalid prior decisions."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-16"
    },
    "references": [
      "https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html",
      "https://www.php.net/manual/en/pdo.rollback.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0400",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "composer-build-code-trust-boundary",
    "objective": {
      "id": "composer-build-code-trust-boundary",
      "text": "Place necessary Composer build hooks behind an isolation boundary that excludes deployment credentials."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Reason about lockfile reproducibility, executable plugin/script channels and privileges as separate properties."
    },
    "prerequisites": [
      "Composer plugins and scripts",
      "Build isolation",
      "Supply-chain trust",
      "Credential separation"
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
        "A reviewed lockfile pins package versions, but some package build hooks are not yet trusted. The build needs both Composer plugins and project scripts to produce an artifact. Policy permits those hooks only in a disposable build environment without deployment credentials or access to production systems. Artifact review is a separate required stage."
      ],
      "files": []
    },
    "stem": "Which build design meets that policy while still allowing the required hooks?",
    "options": [
      {
        "id": "lockfile-on-deployer",
        "text": "Use a disposable builder with no secrets or production access; enable plugins, disable project scripts, then review its artifact.",
        "rationale": "The isolation meets policy, but disabling scripts prevents the explicitly required build hooks from completing.",
        "misconception": "Treating plugin execution as a substitute for required project scripts."
      },
      {
        "id": "scripts-only-off",
        "text": "Run both kinds of hooks in a disposable builder with read-only deployment credentials and no production network, then review its artifact.",
        "rationale": "Read-only credentials can still be read and copied by the hooks, contrary to the no-deployment-credentials policy.",
        "misconception": "Treating protection from modifying credentials as protection from reading them."
      },
      {
        "id": "ordinary-user",
        "text": "Run both kinds of hooks as non-root in a disposable builder with no credentials but production network access, then review its artifact.",
        "rationale": "The hooks retain access to production systems even without root or deployment credentials, which the policy excludes.",
        "misconception": "Equating non-root execution and missing credentials with complete production isolation."
      },
      {
        "id": "isolated-builder",
        "text": "Run the hooks in a disposable restricted builder with no deployment secrets or production access, then review its artifact before promotion.",
        "rationale": "The required code can run inside the policy’s trust boundary, while artifact promotion remains a separate decision.",
        "misconception": null
      }
    ],
    "correctOptionId": "isolated-builder",
    "explanation": {
      "summary": "Composer plugins and scripts execute code with the invoking account’s access. A lockfile and a non-root account do not establish the required isolation; the builder’s accessible credentials, network and filesystem must match the policy.",
      "trace": "The builder receives only necessary inputs. Its artifact is reviewed before promotion, and deployment credentials are introduced only outside the untrusted build stage."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Composer documents both plugin and script execution and recommends sandboxing untrusted dependencies; the scenario explicitly requires hooks and separates artifact approval.",
      "optionAudit": {
        "lockfile-on-deployer": "Required project scripts cannot run.",
        "scripts-only-off": "Read-only deployment credentials are still exposed to reads.",
        "ordinary-user": "Production access remains available despite the explicit prohibition.",
        "isolated-builder": "Permits hooks within the stated isolation and promotion boundaries."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 4
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://getcomposer.org/doc/faqs/how-to-install-untrusted-packages-safely.md"
    ]
  }
];
