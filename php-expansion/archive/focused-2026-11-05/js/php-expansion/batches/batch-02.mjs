// Accepted for local independent review only. Production activation is not authorized.
export default [
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0101",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Operators & expressions",
    "subtopic": "and-versus-double-ampersand-assignment",
    "objective": {
      "id": "and-versus-double-ampersand-assignment",
      "text": "Predict how assignment groups with and versus &&."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply two documented precedence levels to otherwise identical boolean expressions."
    },
    "prerequisites": [
      "Boolean operators",
      "Assignment precedence"
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
          "source": "<?php\n\n$first = true && false;\n$second = true and false;\n\necho json_encode([$first, $second]);\n"
        }
      ]
    },
    "stem": "What JSON is printed after the two assignments?",
    "options": [
      {
        "id": "both-false",
        "text": "[false,false]",
        "rationale": "and has lower precedence than assignment, so the second assignment happens before the and expression.",
        "misconception": "Assuming synonymous boolean operators have identical precedence."
      },
      {
        "id": "different",
        "text": "[false,true]",
        "rationale": "&& groups before assignment; assignment groups before and.",
        "misconception": null
      },
      {
        "id": "both-true",
        "text": "[true,true]",
        "rationale": "The first assignment receives the complete false result of true && false.",
        "misconception": "Assuming assignment always binds before boolean operators."
      },
      {
        "id": "reversed",
        "text": "[true,false]",
        "rationale": "This reverses the precedence relationship of the two operators.",
        "misconception": "Attributing the lower precedence to && instead of and."
      }
    ],
    "correctOptionId": "different",
    "explanation": {
      "summary": "The first statement assigns the result of true && false. In the second, true is assigned to second before the and expression is evaluated.",
      "trace": "first becomes false. second becomes true; the false result of the following and expression is unused."
    },
    "validation": {
      "kind": "output",
      "stdout": "[false,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
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
    "id": "PHP-E26-0102",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Operators & expressions",
    "subtopic": "exponentiation-before-unary-minus",
    "objective": {
      "id": "exponentiation-before-unary-minus",
      "text": "Distinguish a negated power from a power of a negative base."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Use explicit parentheses to identify which operation the unary minus applies to."
    },
    "prerequisites": [
      "Exponentiation",
      "Unary minus",
      "Parentheses"
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
          "source": "<?php\n\n$left = -2 ** 2;\n$right = (-2) ** 2;\n\necho json_encode([$left, $right]);\n"
        }
      ]
    },
    "stem": "What pair of integers is printed?",
    "options": [
      {
        "id": "both-positive",
        "text": "[4,4]",
        "rationale": "Without parentheses, exponentiation binds before unary minus.",
        "misconception": "Assuming the leading minus is always part of the exponentiation base."
      },
      {
        "id": "both-negative",
        "text": "[-4,-4]",
        "rationale": "The parenthesized negative base squared produces positive four.",
        "misconception": "Applying the outer-negation interpretation despite explicit parentheses."
      },
      {
        "id": "reversed",
        "text": "[4,-4]",
        "rationale": "This reverses which expression has a negative base and which negates a result.",
        "misconception": "Reading parentheses as changing the exponent rather than the base."
      },
      {
        "id": "grouping",
        "text": "[-4,4]",
        "rationale": "The first expression is -(2 ** 2); the second squares -2.",
        "misconception": null
      }
    ],
    "correctOptionId": "grouping",
    "explanation": {
      "summary": "Exponentiation has higher precedence than unary minus. Parentheses make the minus part of the base in the second expression.",
      "trace": "left is -4. right multiplies -2 by -2 and is 4."
    },
    "validation": {
      "kind": "output",
      "stdout": "[-4,4]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
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
    "id": "PHP-E26-0103",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Control flow & pattern matching",
    "subtopic": "switch-loose-versus-match-strict-selection",
    "objective": {
      "id": "switch-loose-versus-match-strict-selection",
      "text": "Compare switch and match selection for a string zero against boolean and integer alternatives."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply the different comparison rules to the same subject and ordered alternatives."
    },
    "prerequisites": [
      "switch",
      "match",
      "Loose and strict comparisons"
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
          "source": "<?php\n\n$value = '0';\n\nswitch ($value) {\n    case false:\n        $fromSwitch = 'boolean';\n        break;\n    case 0:\n        $fromSwitch = 'integer';\n        break;\n    default:\n        $fromSwitch = 'string';\n}\n\n$fromMatch = match ($value) {\n    false => 'boolean',\n    0 => 'integer',\n    '0' => 'string',\n};\n\necho json_encode([$fromSwitch, $fromMatch]);\n"
        }
      ]
    },
    "stem": "What JSON pair is printed? Each switch case has an explicit break.",
    "options": [
      {
        "id": "different",
        "text": "[\"boolean\",\"string\"]",
        "rationale": "switch uses loose comparison and selects false first; match requires the string arm.",
        "misconception": null
      },
      {
        "id": "integer-string",
        "text": "[\"integer\",\"string\"]",
        "rationale": "The earlier false case already matches the string zero loosely.",
        "misconception": "Assuming switch prefers numeric comparison over an earlier matching boolean case."
      },
      {
        "id": "both-string",
        "text": "[\"string\",\"string\"]",
        "rationale": "switch does not use match’s strict comparison rule.",
        "misconception": "Treating switch and match as equivalent selectors."
      },
      {
        "id": "both-boolean",
        "text": "[\"boolean\",\"boolean\"]",
        "rationale": "match does not coerce the string zero to a boolean.",
        "misconception": "Extending switch’s loose comparison rule to match."
      }
    ],
    "correctOptionId": "different",
    "explanation": {
      "summary": "switch compares cases loosely and stops at the first matching case. match compares both type and value strictly.",
      "trace": "The string zero is falsy for the first switch comparison. In match it is neither false nor integer zero, so the string arm is selected."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"boolean\",\"string\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-06"
    },
    "references": [
      "https://www.php.net/manual/en/control-structures.switch.php",
      "https://www.php.net/manual/en/control-structures.match.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0104",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "foreach-value-variable-assignment",
    "objective": {
      "id": "foreach-value-variable-assignment",
      "text": "Distinguish assigning the by-value foreach variable from changing array elements."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Track the iteration variable and source array as separate values."
    },
    "prerequisites": [
      "foreach by value",
      "Arrays",
      "Assignment"
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
          "source": "<?php\n\n$values = [2, 3];\n\nforeach ($values as $value) {\n    $value *= 10;\n}\n\necho json_encode([$values, $value]);\n"
        }
      ]
    },
    "stem": "What JSON describes values and the final iteration variable after this loop?",
    "options": [
      {
        "id": "mutated",
        "text": "[[20,30],30]",
        "rationale": "The loop does not bind value by reference, so its assignments do not update the array.",
        "misconception": "Assuming foreach variables are always aliases to source elements."
      },
      {
        "id": "last-original",
        "text": "[[2,3],3]",
        "rationale": "The local iteration variable is multiplied during the final iteration and remains 30 afterward.",
        "misconception": "Assuming the iteration variable reverts to its source value after the body."
      },
      {
        "id": "separate",
        "text": "[[2,3],30]",
        "rationale": "The array stays unchanged while the last copied iteration value becomes 30.",
        "misconception": null
      },
      {
        "id": "last-only",
        "text": "[[2,30],30]",
        "rationale": "Neither source element is assigned through a reference or an indexed write.",
        "misconception": "Assuming only the final foreach variable is linked back to the array."
      }
    ],
    "correctOptionId": "separate",
    "explanation": {
      "summary": "A by-value foreach assigns each element’s value to the loop variable. Modifying that variable changes the copy, and the variable remains defined after the loop.",
      "trace": "The copied values become 20 and then 30 in successive iterations. The original array remains [2,3]."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[2,3],30]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
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
    "id": "PHP-E26-0105",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "keyed-array-destructuring-order",
    "objective": {
      "id": "keyed-array-destructuring-order",
      "text": "Read explicitly keyed array destructuring independently of target order."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Resolve two requested keys rather than consuming successive source positions."
    },
    "prerequisites": [
      "Array destructuring",
      "Integer keys"
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
          "source": "<?php\n\n$values = [10, 20, 30];\n\n[2 => $last, 0 => $first] = $values;\n\necho json_encode([$last, $first]);\n"
        }
      ]
    },
    "stem": "What JSON is printed by these explicitly keyed destructuring assignments?",
    "options": [
      {
        "id": "sequential",
        "text": "[10,20]",
        "rationale": "Explicit keys select positions 2 and 0, not the next two values in sequence.",
        "misconception": "Ignoring keys on the destructuring side."
      },
      {
        "id": "selected",
        "text": "[30,10]",
        "rationale": "last receives key 2 and first receives key 0.",
        "misconception": null
      },
      {
        "id": "source-order",
        "text": "[10,30]",
        "rationale": "The echo order is last then first, so selected values are not reordered into source order.",
        "misconception": "Reordering targets according to source positions."
      },
      {
        "id": "one-based",
        "text": "[20,null]",
        "rationale": "PHP’s list keys are zero-based, and key 0 exists with value 10.",
        "misconception": "Applying one-based indexing to keyed destructuring."
      }
    ],
    "correctOptionId": "selected",
    "explanation": {
      "summary": "Keys on the left side of destructuring explicitly identify which source entries to assign. Target order does not change those lookups.",
      "trace": "last becomes 30 from key 2, and first becomes 10 from key 0."
    },
    "validation": {
      "kind": "output",
      "stdout": "[30,10]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.array.php#language.types.array.syntax.destructuring"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0106",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "array-default-independent-function-calls",
    "objective": {
      "id": "array-default-independent-function-calls",
      "text": "Predict independent array default values across ordinary function calls."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate a parameter’s default array from persistent static storage."
    },
    "prerequisites": [
      "Default arguments",
      "Array value semantics"
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
          "source": "<?php\n\nfunction appendItem(array $items = []): array\n{\n    $items[] = 'x';\n\n    return $items;\n}\n\necho json_encode([appendItem(), appendItem()]);\n"
        }
      ]
    },
    "stem": "What JSON is printed after the two calls that omit items?",
    "options": [
      {
        "id": "accumulate",
        "text": "[[\"x\"],[\"x\",\"x\"]]",
        "rationale": "Mutating the first call’s local array does not change the default for later calls.",
        "misconception": "Importing persistent mutable-default behavior from another language."
      },
      {
        "id": "both-final",
        "text": "[[\"x\",\"x\"],[\"x\",\"x\"]]",
        "rationale": "The returned arrays are separate values and no shared reference connects them.",
        "misconception": "Assuming both calls return aliases to one shared default array."
      },
      {
        "id": "empty",
        "text": "[[],[]]",
        "rationale": "Each function call appends x to its own parameter value before returning.",
        "misconception": "Assuming a default argument cannot be modified inside the function."
      },
      {
        "id": "fresh",
        "text": "[[\"x\"],[\"x\"]]",
        "rationale": "Each omitted argument starts from an empty array and each local append produces one element.",
        "misconception": null
      }
    ],
    "correctOptionId": "fresh",
    "explanation": {
      "summary": "An ordinary array default does not accumulate modifications across calls. Persistent state would need an explicit mechanism such as a static local variable or shared reference.",
      "trace": "Each call receives [], appends x locally and returns [x]."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[\"x\"],[\"x\"]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/functions.arguments.php#functions.arguments.default"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0107",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "func-get-args-named-parameter-order",
    "objective": {
      "id": "func-get-args-named-parameter-order",
      "text": "Identify the order exposed by func_get_args after named argument binding."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish call-site named order from declaration-order parameter binding."
    },
    "prerequisites": [
      "Named arguments",
      "func_get_args"
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
          "source": "<?php\n\nfunction inspect(int $first, int $second): void\n{\n    echo json_encode(func_get_args());\n}\n\ninspect(second: 20, first: 10);\n"
        }
      ]
    },
    "stem": "What JSON does inspect print for this named-argument call?",
    "options": [
      {
        "id": "parameters",
        "text": "[10,20]",
        "rationale": "Named arguments bind to parameters, and func_get_args exposes the resulting declaration order.",
        "misconception": null
      },
      {
        "id": "call-order",
        "text": "[20,10]",
        "rationale": "The named call order does not reorder the function’s declared parameters.",
        "misconception": "Treating func_get_args as a token-level record of call-site order."
      },
      {
        "id": "named-map",
        "text": "{\"second\":20,\"first\":10}",
        "rationale": "func_get_args returns a positional array here, not the named variadic argument map.",
        "misconception": "Applying unmatched variadic-key preservation to declared parameters."
      },
      {
        "id": "declaration-map",
        "text": "{\"first\":10,\"second\":20}",
        "rationale": "The values follow declaration order, but the array uses numeric keys rather than parameter names.",
        "misconception": "Assuming reflection-style parameter names become func_get_args keys."
      }
    ],
    "correctOptionId": "parameters",
    "explanation": {
      "summary": "Named arguments are resolved to their declared parameters before the body executes. func_get_args reports the resulting positional argument sequence for these parameters.",
      "trace": "first is bound to 10 and second to 20, producing [10,20]."
    },
    "validation": {
      "kind": "output",
      "stdout": "[10,20]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.func-get-args.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0108",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Variables, scope & constants",
    "subtopic": "constant-visibility-versus-local-variable-scope",
    "objective": {
      "id": "constant-visibility-versus-local-variable-scope",
      "text": "Distinguish a globally declared constant from a same-purpose local variable."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Track constant lookup, a function-local assignment and the unchanged top-level variable."
    },
    "prerequisites": [
      "Constants",
      "Function variable scope"
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
          "source": "<?php\n\nconst LIMIT = 3;\n$limit = 7;\n\nfunction readLimit(): array\n{\n    $limit = 2;\n\n    return [LIMIT, $limit];\n}\n\necho json_encode([readLimit(), $limit]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? The function has no global declaration.",
    "options": [
      {
        "id": "global-mutated",
        "text": "[[3,2],2]",
        "rationale": "The function-local limit is not linked to the top-level variable.",
        "misconception": "Assuming matching variable names share storage across function scope."
      },
      {
        "id": "global-read",
        "text": "[[3,7],7]",
        "rationale": "The function explicitly assigns its own local limit to 2.",
        "misconception": "Ignoring the function-local assignment in favor of a global value."
      },
      {
        "id": "separate-scopes",
        "text": "[[3,2],7]",
        "rationale": "LIMIT is accessible as a constant; the function’s local limit is 2 and the global variable stays 7.",
        "misconception": null
      },
      {
        "id": "constant-local",
        "text": "[[2,2],7]",
        "rationale": "Assigning limit does not redefine the distinct constant LIMIT.",
        "misconception": "Treating a variable assignment as modification of a similarly named constant."
      }
    ],
    "correctOptionId": "separate-scopes",
    "explanation": {
      "summary": "Constants and variables use different lookup rules. The constant is accessible in the function, while its local variable is separate from the top-level variable unless explicitly connected.",
      "trace": "readLimit returns [3,2]. The top-level limit remains 7."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[3,2],7]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-02"
    },
    "references": [
      "https://www.php.net/manual/en/language.constants.php",
      "https://www.php.net/manual/en/language.variables.scope.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0109",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "coercive-reference-parameter-updates-caller-type",
    "objective": {
      "id": "coercive-reference-parameter-updates-caller-type",
      "text": "Track scalar coercion of a by-reference parameter back into the caller’s variable."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine weak scalar argument conversion with reference aliasing and mutation."
    },
    "prerequisites": [
      "Scalar type declarations",
      "References",
      "Coercive calls"
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
          "source": "<?php\n\nfunction increment(int &$number): void\n{\n    $number++;\n}\n\n$value = '7';\nincrement($value);\n\necho get_debug_type($value), '|', $value;\n"
        }
      ]
    },
    "stem": "This file does not declare strict_types. What type and value are printed after the call?",
    "options": [
      {
        "id": "string-mutated",
        "text": "string|8",
        "rationale": "The int parameter coerces the numeric string, and the reference makes that coerced value visible to the caller.",
        "misconception": "Assuming coercion occurs only in a separate local parameter copy."
      },
      {
        "id": "unchanged",
        "text": "string|7",
        "rationale": "Both the binding conversion and increment affect the referenced caller variable.",
        "misconception": "Treating a by-reference parameter as an isolated value."
      },
      {
        "id": "coerced-reference",
        "text": "int|8",
        "rationale": "Binding coerces the shared variable to int, and the body increments it to 8.",
        "misconception": null
      },
      {
        "id": "strict-error",
        "text": "An uncaught TypeError",
        "rationale": "The call originates in a coercive file and the string is a valid integer representation.",
        "misconception": "Assuming a scalar type declaration always rejects numeric strings."
      }
    ],
    "correctOptionId": "coerced-reference",
    "explanation": {
      "summary": "In a coercive call, a numeric string can satisfy an int parameter through conversion. Because the parameter is a reference, the caller’s variable receives the converted integer and subsequent mutation.",
      "trace": "value changes from string 7 to integer 7 during binding, then to integer 8 in the function."
    },
    "validation": {
      "kind": "output",
      "stdout": "int|8",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict",
      "https://www.php.net/manual/en/language.references.pass.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0110",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "reference-return-requires-reference-assignment",
    "objective": {
      "id": "reference-return-requires-reference-assignment",
      "text": "Distinguish copying a reference-returning function’s value from binding to its storage."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track a persistent local through ordinary assignment and explicit reference assignment."
    },
    "prerequisites": [
      "Returning references",
      "Static local variables",
      "Assignment"
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
          "source": "<?php\n\nfunction &slot(): int\n{\n    static $value = 1;\n\n    return $value;\n}\n\n$copy = slot();\n$alias =& slot();\n$alias = 5;\n\necho json_encode([$copy, slot()]);\n"
        }
      ]
    },
    "stem": "What JSON is printed after assigning through alias?",
    "options": [
      {
        "id": "both-alias",
        "text": "[5,5]",
        "rationale": "The ordinary assignment to copy takes a value, not a reference binding.",
        "misconception": "Assuming a reference-returning function forces every caller to retain an alias."
      },
      {
        "id": "explicit-alias",
        "text": "[1,5]",
        "rationale": "copy keeps 1, while alias is bound to slot’s persistent storage and changes it to 5.",
        "misconception": null
      },
      {
        "id": "neither-alias",
        "text": "[1,1]",
        "rationale": "The explicit =& assignment does bind to the function’s returned reference.",
        "misconception": "Ignoring reference binding at the receiving assignment."
      },
      {
        "id": "copy-only",
        "text": "[5,1]",
        "rationale": "This reverses which assignment creates an alias and which creates a value copy.",
        "misconception": "Treating the reference marker as a copy instruction."
      }
    ],
    "correctOptionId": "explicit-alias",
    "explanation": {
      "summary": "Returning by reference makes storage available for binding, but the caller must also use reference assignment to retain that alias. Ordinary assignment copies the current value.",
      "trace": "copy receives integer 1. alias links to the static value. Assigning 5 through alias changes later slot reads but leaves copy unchanged."
    },
    "validation": {
      "kind": "output",
      "stdout": "[1,5]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/language.references.return.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0111",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Closures, callbacks & callables",
    "subtopic": "closure-static-state-per-closure-instance",
    "objective": {
      "id": "closure-static-state-per-closure-instance",
      "text": "Track static local state shared by aliases of one Closure but separate in another Closure instance."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine closure construction identity, object aliasing and persistent local storage."
    },
    "prerequisites": [
      "Closures",
      "Static local variables",
      "Object assignment"
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
          "source": "<?php\n\nfunction counter(): Closure\n{\n    return function (): int {\n        static $count = 0;\n\n        return ++$count;\n    };\n}\n\n$first = counter();\n$alias = $first;\n$second = counter();\n\necho json_encode([$first(), $alias(), $second()]);\n"
        }
      ]
    },
    "stem": "What JSON is printed by the three callback invocations?",
    "options": [
      {
        "id": "all-shared",
        "text": "[1,2,3]",
        "rationale": "The separately constructed Closure has its own static local storage.",
        "misconception": "Assuming every Closure created from one source expression shares one static counter."
      },
      {
        "id": "all-reset",
        "text": "[1,1,1]",
        "rationale": "Calls through first and alias target the same Closure, whose static local persists.",
        "misconception": "Treating static local state as an ordinary per-call local."
      },
      {
        "id": "construction-count",
        "text": "[2,3,2]",
        "rationale": "Creating the Closure does not execute its body or increment its counter.",
        "misconception": "Counting callback construction as callback invocation."
      },
      {
        "id": "per-instance",
        "text": "[1,2,1]",
        "rationale": "first and alias share one Closure; second is a distinct Closure with its own counter.",
        "misconception": null
      }
    ],
    "correctOptionId": "per-instance",
    "explanation": {
      "summary": "Each created Closure has its own static local state. Assigning the Closure object to another variable shares that same Closure rather than creating a new one.",
      "trace": "The first Closure advances to 1 and then 2. The separately created second Closure advances from 0 to 1."
    },
    "validation": {
      "kind": "output",
      "stdout": "[1,2,1]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/language.variables.scope.php#language.variables.scope.static",
      "https://www.php.net/manual/en/functions.anonymous.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0112",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "recursive-array-replacement-list-indexes",
    "objective": {
      "id": "recursive-array-replacement-list-indexes",
      "text": "Predict recursive replacement of indexed entries and explicit null values."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Apply replacement by key at multiple nesting levels rather than concatenating or replacing an entire list."
    },
    "prerequisites": [
      "Nested arrays",
      "array_replace_recursive",
      "Null values"
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
          "source": "<?php\n\n$defaults = [\n    'ports' => [80, 443],\n    'meta' => ['mode' => 'safe', 'tries' => 2],\n];\n$patch = [\n    'ports' => [8080],\n    'meta' => ['tries' => null],\n];\n\necho json_encode(array_replace_recursive($defaults, $patch));\n"
        }
      ]
    },
    "stem": "What JSON is printed by this recursive replacement?",
    "options": [
      {
        "id": "key-replacement",
        "text": "{\"ports\":[8080,443],\"meta\":{\"mode\":\"safe\",\"tries\":null}}",
        "rationale": "Index 0 is replaced, index 1 remains, and explicit null replaces tries.",
        "misconception": null
      },
      {
        "id": "whole-list",
        "text": "{\"ports\":[8080],\"meta\":{\"mode\":\"safe\",\"tries\":null}}",
        "rationale": "Recursive replacement operates by keys and leaves the unmatched index 1.",
        "misconception": "Assuming a nested list is replaced as one indivisible value."
      },
      {
        "id": "append-list",
        "text": "{\"ports\":[80,443,8080],\"meta\":{\"mode\":\"safe\",\"tries\":null}}",
        "rationale": "The numeric index is replaced rather than appended.",
        "misconception": "Applying array_merge-style numeric appending to replacement."
      },
      {
        "id": "skip-null",
        "text": "{\"ports\":[8080,443],\"meta\":{\"mode\":\"safe\",\"tries\":2}}",
        "rationale": "Explicit null is a replacement value, not a signal to ignore the patch entry.",
        "misconception": "Treating null as absence during recursive replacement."
      }
    ],
    "correctOptionId": "key-replacement",
    "explanation": {
      "summary": "array_replace_recursive replaces entries at matching keys and recursively handles arrays. Keys absent from the replacement remain, and null is an explicit value.",
      "trace": "ports[0] becomes 8080 while ports[1] stays 443. meta.mode stays safe and meta.tries becomes null."
    },
    "validation": {
      "kind": "output",
      "stdout": "{\"ports\":[8080,443],\"meta\":{\"mode\":\"safe\",\"tries\":null}}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-replace-recursive.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0113",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "array-intersect-string-representation-equality",
    "objective": {
      "id": "array-intersect-string-representation-equality",
      "text": "Apply array_intersect’s string-representation comparison while preserving original values and keys."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish this API’s equality rule from strict identity and general loose comparison."
    },
    "prerequisites": [
      "array_intersect",
      "Scalar string conversion",
      "JSON array keys"
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
          "source": "<?php\n\n$left = [1, '01', true, 1.0];\n$right = ['1'];\n\necho json_encode(array_intersect($left, $right));\n"
        }
      ]
    },
    "stem": "What JSON is printed? The left array contains an integer, a leading-zero string, a boolean and a float.",
    "options": [
      {
        "id": "strict",
        "text": "[]",
        "rationale": "array_intersect does not require the original operand types to be identical.",
        "misconception": "Applying strict identity to this API."
      },
      {
        "id": "loose",
        "text": "[1,\"01\",true,1]",
        "rationale": "The string 01 does not have the same string representation as 1.",
        "misconception": "Applying general numeric loose comparison instead of the API’s string comparison rule."
      },
      {
        "id": "representations",
        "text": "{\"0\":1,\"2\":true,\"3\":1}",
        "rationale": "Integer 1, true and float 1.0 each convert to the string 1; their original keys and values survive.",
        "misconception": null
      },
      {
        "id": "converted",
        "text": "{\"0\":\"1\",\"2\":\"1\",\"3\":\"1\"}",
        "rationale": "String conversion is used for comparison, but the returned values keep their original types.",
        "misconception": "Assuming comparison normalization also transforms the returned values."
      }
    ],
    "correctOptionId": "representations",
    "explanation": {
      "summary": "array_intersect considers values equal when their string representations are identical. It returns the original left-side values under their original keys.",
      "trace": "Keys 0, 2 and 3 match the string 1. Key 1 contains 01 and is excluded, so JSON uses object form for the remaining nonsequential keys."
    },
    "validation": {
      "kind": "output",
      "stdout": "{\"0\":1,\"2\":true,\"3\":1}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-intersect.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0114",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Closures, callbacks & callables",
    "subtopic": "null-array-map-zips-and-pads",
    "objective": {
      "id": "null-array-map-zips-and-pads",
      "text": "Predict array_map with a null callback and unequal input lengths."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track row-wise grouping and missing-value padding across multiple input arrays."
    },
    "prerequisites": [
      "array_map",
      "Multiple input arrays",
      "Null callback behavior"
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
          "source": "<?php\n\n$letters = ['a', 'b'];\n$numbers = [1];\n\necho json_encode(array_map(null, $letters, $numbers));\n"
        }
      ]
    },
    "stem": "What JSON is printed by this null-callback mapping?",
    "options": [
      {
        "id": "shortest",
        "text": "[[\"a\",1]]",
        "rationale": "The result continues to the longest input, rather than stopping at the shortest.",
        "misconception": "Assuming zip truncates to the shortest array."
      },
      {
        "id": "padded",
        "text": "[[\"a\",1],[\"b\",null]]",
        "rationale": "A null callback groups corresponding values, padding the missing second number with null.",
        "misconception": null
      },
      {
        "id": "flat",
        "text": "[\"a\",\"b\",1]",
        "rationale": "Null callback mapping groups corresponding positions; it does not concatenate the arrays.",
        "misconception": "Treating a missing callback as a merge request."
      },
      {
        "id": "repeat",
        "text": "[[\"a\",1],[\"b\",1]]",
        "rationale": "A shorter input is padded with null, not its final value.",
        "misconception": "Assuming the last available input value is reused."
      }
    ],
    "correctOptionId": "padded",
    "explanation": {
      "summary": "With null as callback, array_map groups values at corresponding positions. Multiple-array mapping continues through the longest input and supplies null for missing values.",
      "trace": "The first group is a and 1. The second group is b and a missing number, represented by null."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[\"a\",1],[\"b\",null]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-map.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0115",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "array-splice-positional-removal-and-reindexing",
    "objective": {
      "id": "array-splice-positional-removal-and-reindexing",
      "text": "Track both the mutated array and removed entries from a positional splice."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine insertion order, positional offsets, replacement-key handling and numeric-key reindexing."
    },
    "prerequisites": [
      "array_splice",
      "Mixed array keys",
      "Mutation and return values"
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
          "source": "<?php\n\n$values = ['a' => 1, 5 => 2, 'b' => 3, 9 => 4];\n$removed = array_splice($values, 1, 2, ['x' => 8]);\n\necho json_encode([$values, $removed]);\n"
        }
      ]
    },
    "stem": "What JSON does the displayed splice operation print?",
    "options": [
      {
        "id": "preserve-all",
        "text": "[{\"a\":1,\"x\":8,\"9\":4},{\"5\":2,\"b\":3}]",
        "rationale": "Numeric keys are reindexed and the replacement’s x key is not preserved.",
        "misconception": "Assuming splice retains every original and replacement key."
      },
      {
        "id": "remove-by-key",
        "text": "[{\"a\":1,\"5\":2,\"b\":3,\"9\":4},[]]",
        "rationale": "Offset 1 selects the second position even though key 1 is absent.",
        "misconception": "Treating the offset as a key lookup."
      },
      {
        "id": "return-mutated",
        "text": "[{\"a\":1,\"0\":8,\"1\":4},{\"a\":1,\"0\":8,\"1\":4}]",
        "rationale": "The return contains removed entries, not a copy of the updated input.",
        "misconception": "Confusing the in-place mutation with the function’s return value."
      },
      {
        "id": "splice-rules",
        "text": "[{\"a\":1,\"0\":8,\"1\":4},{\"0\":2,\"b\":3}]",
        "rationale": "The second and third entries are removed; numeric keys are reindexed and x is discarded.",
        "misconception": null
      }
    ],
    "correctOptionId": "splice-rules",
    "explanation": {
      "summary": "array_splice addresses positions, modifies the input and returns the removed entries. Numeric keys are renumbered, string keys of existing entries are retained, and replacement keys are not preserved.",
      "trace": "Values 2 and 3 are removed. Value 8 is inserted in their place. The remaining numeric values receive keys 0 and 1, and the removed numeric value receives key 0."
    },
    "validation": {
      "kind": "output",
      "stdout": "[{\"a\":1,\"0\":8,\"1\":4},{\"0\":2,\"b\":3}]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-splice.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0116",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "HTTP & superglobals",
    "subtopic": "parse-str-normalized-name-collision",
    "objective": {
      "id": "parse-str-normalized-name-collision",
      "text": "Predict query parsing when normalized field names collide and bracket syntax builds a list."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine PHP name normalization, later-value replacement and array input notation."
    },
    "prerequisites": [
      "Query strings",
      "parse_str",
      "Bracketed field names"
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
          "source": "<?php\n\nparse_str('a.b=first&a_b=second&items[]=x&items[]=y', $values);\n\necho json_encode($values);\n"
        }
      ]
    },
    "stem": "What JSON is printed by parsing this fixed query string? No external request data is used.",
    "options": [
      {
        "id": "normalized",
        "text": "{\"a_b\":\"second\",\"items\":[\"x\",\"y\"]}",
        "rationale": "The dot normalizes to an underscore, the later scalar replaces the same key, and brackets build a list.",
        "misconception": null
      },
      {
        "id": "distinct-names",
        "text": "{\"a.b\":\"first\",\"a_b\":\"second\",\"items\":[\"x\",\"y\"]}",
        "rationale": "parse_str normalizes dots in field names to underscores.",
        "misconception": "Assuming query field names are preserved byte-for-byte."
      },
      {
        "id": "scalar-array",
        "text": "{\"a_b\":[\"first\",\"second\"],\"items\":[\"x\",\"y\"]}",
        "rationale": "Repeated scalar keys do not automatically collect into an array without bracket notation.",
        "misconception": "Applying bracket-array accumulation to ordinary duplicate keys."
      },
      {
        "id": "last-item",
        "text": "{\"a_b\":\"second\",\"items\":\"y\"}",
        "rationale": "The explicit [] notation accumulates both item values into an array.",
        "misconception": "Treating bracketed fields as ordinary repeated scalar fields."
      }
    ],
    "correctOptionId": "normalized",
    "explanation": {
      "summary": "PHP query parsing normalizes dots and spaces in names to underscores. A later scalar assignment to the normalized key replaces the earlier one, while [] explicitly appends array elements.",
      "trace": "a.b becomes a_b and is then overwritten by second. The two items[] fields append x and y."
    },
    "validation": {
      "kind": "output",
      "stdout": "{\"a_b\":\"second\",\"items\":[\"x\",\"y\"]}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/function.parse-str.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0117",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Variables, scope & constants",
    "subtopic": "extract-skip-existing-variable-count",
    "objective": {
      "id": "extract-skip-existing-variable-count",
      "text": "Track EXTR_SKIP imports and extract’s count without overwriting an existing local variable."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish imported entries from skipped collisions in the current symbol table."
    },
    "prerequisites": [
      "Variable scope",
      "extract flags",
      "Import counts"
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
          "source": "<?php\n\n$name = 'local';\n$loaded = extract(['name' => 'input', 'other' => 'extra'], EXTR_SKIP);\n\necho json_encode([$name, $other, $loaded]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? The array is a fixed local fixture, not untrusted input.",
    "options": [
      {
        "id": "overwrite",
        "text": "[\"input\",\"extra\",2]",
        "rationale": "EXTR_SKIP prevents overwriting the existing name variable.",
        "misconception": "Applying the default overwrite behavior despite the explicit flag."
      },
      {
        "id": "count-attempts",
        "text": "[\"local\",\"extra\",2]",
        "rationale": "The count includes successfully imported variables, not skipped input entries.",
        "misconception": "Counting attempted imports rather than completed imports."
      },
      {
        "id": "skip-collision",
        "text": "[\"local\",\"extra\",1]",
        "rationale": "name is skipped, other is imported and the successful import count is 1.",
        "misconception": null
      },
      {
        "id": "skip-all",
        "text": "[\"local\",null,0]",
        "rationale": "A collision on one entry does not cancel imports of the other entries.",
        "misconception": "Treating EXTR_SKIP as an all-or-nothing import policy."
      }
    ],
    "correctOptionId": "skip-collision",
    "explanation": {
      "summary": "extract with EXTR_SKIP leaves existing variable names unchanged and imports noncolliding names. Its return count reflects successful imports only.",
      "trace": "name remains local. other is created as extra. Exactly one variable was imported."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"local\",\"extra\",1]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-02"
    },
    "references": [
      "https://www.php.net/manual/en/function.extract.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0118",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "HTTP & superglobals",
    "subtopic": "http-query-rfc3986-null-boolean-array-encoding",
    "objective": {
      "id": "http-query-rfc3986-null-boolean-array-encoding",
      "text": "Predict explicit RFC 3986 query encoding for null, boolean and array values."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine omission, scalar normalization, bracketed indices and percent encoding under stated flags."
    },
    "prerequisites": [
      "http_build_query",
      "RFC 3986 encoding",
      "PHP arrays"
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
          "source": "<?php\n\n$query = [\n    'q' => 'a b',\n    'flag' => false,\n    'missing' => null,\n    'tags' => ['x/y'],\n];\n\necho http_build_query($query, '', '&', PHP_QUERY_RFC3986);\n"
        }
      ]
    },
    "stem": "What exact query string is printed? The separator and RFC 3986 encoding mode are supplied explicitly.",
    "options": [
      {
        "id": "form-space",
        "text": "q=a+b&flag=0&tags%5B0%5D=x%2Fy",
        "rationale": "RFC 3986 mode encodes spaces as %20, not plus.",
        "misconception": "Applying the default form-style space encoding despite the explicit mode."
      },
      {
        "id": "rfc3986",
        "text": "q=a%20b&flag=0&tags%5B0%5D=x%2Fy",
        "rationale": "The space is %20, false becomes 0, null is omitted and the array index is bracket-encoded.",
        "misconception": null
      },
      {
        "id": "null-empty",
        "text": "q=a%20b&flag=0&missing=&tags%5B0%5D=x%2Fy",
        "rationale": "A null value is omitted rather than encoded as an empty string.",
        "misconception": "Equating null with an explicitly empty query value."
      },
      {
        "id": "boolean-word",
        "text": "q=a%20b&flag=false&tags%5B0%5D=x%2Fy",
        "rationale": "The boolean false is normalized to 0, not the word false.",
        "misconception": "Expecting JSON-like boolean spelling in PHP query construction."
      }
    ],
    "correctOptionId": "rfc3986",
    "explanation": {
      "summary": "http_build_query omits null entries, normalizes booleans to integers and recursively encodes array indices. RFC 3986 mode uses percent encoding for spaces.",
      "trace": "The retained fields are q, flag and tags[0] in insertion order. Their encoded values are a%20b, 0 and x%2Fy."
    },
    "validation": {
      "kind": "output",
      "stdout": "q=a%20b&flag=0&tags%5B0%5D=x%2Fy",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/function.http-build-query.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0119",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Types, casting & comparisons",
    "subtopic": "reference-binding-incompatible-typed-properties",
    "objective": {
      "id": "reference-binding-incompatible-typed-properties",
      "text": "Predict rejection of one reference container shared by incompatible typed properties."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine scalar coercion requirements, typed-property references and failure atomicity."
    },
    "prerequisites": [
      "Typed properties",
      "Reference containers (advanced)",
      "Scalar coercion"
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
          "source": "<?php\n\nclass Values\n{\n    public int $integer = 2;\n    public float $decimal = 0.0;\n}\n\n$values = new Values();\n$alias =& $values->integer;\n$status = 'linked';\n\ntry {\n    $values->decimal =& $alias;\n} catch (TypeError $error) {\n    $status = 'blocked';\n}\n\n$alias = 3;\n\necho json_encode([\n    $status,\n    get_debug_type($values->integer),\n    $values->integer,\n    get_debug_type($values->decimal),\n    $values->decimal,\n]);\n"
        }
      ]
    },
    "stem": "What JSON is printed after attempting to bind the float property to the integer property’s reference?",
    "options": [
      {
        "id": "both-int",
        "text": "[\"linked\",\"int\",3,\"float\",3]",
        "rationale": "A float property cannot retain the int-typed reference value without a conflicting conversion.",
        "misconception": "Assuming numeric compatibility permits one reference to violate a property’s concrete stored type."
      },
      {
        "id": "blocked",
        "text": "[\"blocked\",\"int\",3,\"float\",0]",
        "rationale": "The incompatible reference binding fails, leaving decimal unchanged while alias still updates integer.",
        "misconception": null
      },
      {
        "id": "both-float",
        "text": "[\"linked\",\"float\",3,\"float\",3]",
        "rationale": "Converting the shared storage to float would violate the integer property’s type.",
        "misconception": "Assuming the newest property’s type replaces earlier reference constraints."
      },
      {
        "id": "rollback-alias",
        "text": "[\"blocked\",\"int\",2,\"float\",0]",
        "rationale": "The failed second binding does not remove the existing alias to integer.",
        "misconception": "Assuming failure rolls back an earlier, already successful reference assignment."
      }
    ],
    "correctOptionId": "blocked",
    "explanation": {
      "summary": "A reference shared by typed properties must satisfy every attached property constraint. Binding this int storage to a float property would require an incompatible stored value, so PHP rejects the new binding.",
      "trace": "decimal remains 0.0. alias remains bound to integer, and assigning 3 through it changes integer to 3."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"blocked\",\"int\",3,\"float\",0]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.properties.php",
      "https://www.php.net/manual/en/language.references.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0120",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "anonymous-class-expression-identity",
    "objective": {
      "id": "anonymous-class-expression-identity",
      "text": "Distinguish repeated instances of one anonymous-class declaration from distinct anonymous classes."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track source-level class identity separately from object identity and shared static state."
    },
    "prerequisites": [
      "Anonymous classes",
      "Object identity",
      "Static properties"
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
          "source": "<?php\n\nfunction makeCounter(): object\n{\n    return new class {\n        private static int $created = 0;\n\n        public function __construct()\n        {\n            self::$created++;\n        }\n\n        public function created(): int\n        {\n            return self::$created;\n        }\n    };\n}\n\n$first = makeCounter();\n$second = makeCounter();\n\necho json_encode([\n    $first === $second,\n    get_class($first) === get_class($second),\n    $first->created(),\n]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? Both objects come from evaluating the same anonymous-class expression in makeCounter.",
    "options": [
      {
        "id": "per-evaluation-class",
        "text": "[false,false,1]",
        "rationale": "Reevaluating the same anonymous-class declaration creates another instance of the same class.",
        "misconception": "Assuming every evaluation creates a new class identity and static storage."
      },
      {
        "id": "singleton",
        "text": "[true,true,2]",
        "rationale": "Each new expression execution constructs a distinct object even though the class is shared.",
        "misconception": "Confusing one anonymous class declaration with one singleton object."
      },
      {
        "id": "instance-counter",
        "text": "[false,true,1]",
        "rationale": "created is static and is incremented by both constructors.",
        "misconception": "Treating a static property as per-instance storage."
      },
      {
        "id": "same-class",
        "text": "[false,true,2]",
        "rationale": "The objects differ, their class is the same and both constructors increment its static count.",
        "misconception": null
      }
    ],
    "correctOptionId": "same-class",
    "explanation": {
      "summary": "An anonymous-class declaration defines a class even without a source-level name. Repeated evaluation of that declaration constructs different instances sharing its static class state.",
      "trace": "The two new operations produce distinct objects. Their runtime class names match, and the shared created count reaches 2."
    },
    "validation": {
      "kind": "output",
      "stdout": "[false,true,2]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.anonymous.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0121",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Closures, callbacks & callables",
    "subtopic": "closure-binding-private-property-scope",
    "objective": {
      "id": "closure-binding-private-property-scope",
      "text": "Resolve same-named private properties using a bound Closure’s class scope."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Separate the bound object from the visibility scope controlling private property lookup."
    },
    "prerequisites": [
      "Closure::bind (advanced)",
      "Private property slots",
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
          "source": "<?php\n\nclass ParentLabel\n{\n    private string $label = 'parent';\n}\n\nclass ChildLabel extends ParentLabel\n{\n    private string $label = 'child';\n}\n\n$object = new ChildLabel();\n$read = function (): string {\n    return $this->label;\n};\n\n$asParent = Closure::bind($read, $object, ParentLabel::class);\n$asChild = Closure::bind($read, $object, ChildLabel::class);\n\necho json_encode([$asParent(), $asChild()]);\n"
        }
      ]
    },
    "stem": "What JSON is printed when the same object is read through Closures bound to two different class scopes?",
    "options": [
      {
        "id": "scope-slots",
        "text": "[\"parent\",\"child\"]",
        "rationale": "Each bound class scope selects its own private property slot on the same object.",
        "misconception": null
      },
      {
        "id": "runtime-class",
        "text": "[\"child\",\"child\"]",
        "rationale": "The object’s runtime class does not override the explicit parent visibility scope.",
        "misconception": "Assuming private property lookup always starts and ends at the most-derived class."
      },
      {
        "id": "parent-slot",
        "text": "[\"parent\",\"parent\"]",
        "rationale": "The child class has its own distinct private label slot accessible in child scope.",
        "misconception": "Assuming a child private declaration overwrites or aliases the parent’s private storage."
      },
      {
        "id": "outside-error",
        "text": "An uncaught Error for private property access",
        "rationale": "Closure::bind deliberately establishes the stated class scopes for these user-defined classes.",
        "misconception": "Ignoring the visibility scope assigned during binding."
      }
    ],
    "correctOptionId": "scope-slots",
    "explanation": {
      "summary": "Private properties declared separately in parent and child classes occupy distinct slots. Closure binding controls both this and the class scope used for private access.",
      "trace": "The parent-scoped Closure reads ParentLabel’s slot. The child-scoped Closure reads ChildLabel’s slot, although both use the same object."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"parent\",\"child\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/closure.bind.php",
      "https://www.php.net/manual/en/language.oop5.visibility.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0122",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "overloaded-property-array-versus-object-mutation",
    "objective": {
      "id": "overloaded-property-array-versus-object-mutation",
      "text": "Distinguish indirect mutation of a by-value overloaded array from mutation of a returned object."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine magic property access, array value semantics, object identity and handled diagnostics."
    },
    "prerequisites": [
      "__get (advanced)",
      "Indirect modification",
      "Array and object semantics",
      "Error handlers"
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
          "source": "<?php\n\nclass Bag\n{\n    private array $data;\n\n    public function __construct()\n    {\n        $this->data = [\n            'items' => [1],\n            'state' => (object) ['value' => 1],\n        ];\n    }\n\n    public function __get(string $name): mixed\n    {\n        return $this->data[$name];\n    }\n\n    public function snapshot(): array\n    {\n        return [$this->data['items'], $this->data['state']->value];\n    }\n}\n\n$diagnostics = 0;\nset_error_handler(function () use (&$diagnostics): bool {\n    $diagnostics++;\n\n    return true;\n});\n\n$bag = new Bag();\n$bag->items[] = 2;\n$bag->state->value = 2;\n\nrestore_error_handler();\n\necho json_encode([$bag->snapshot(), $diagnostics]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? The explicit handler counts and handles diagnostics; __get does not return by reference.",
    "options": [
      {
        "id": "both-mutate",
        "text": "[[[1,2],2],0]",
        "rationale": "The by-value array cannot be indirectly modified through this overloaded property.",
        "misconception": "Assuming __get automatically provides reference access to stored arrays."
      },
      {
        "id": "neither-mutate",
        "text": "[[[1],1],2]",
        "rationale": "The returned object identifier still points to the stored state object, so its property mutation succeeds.",
        "misconception": "Treating returned objects as deep value copies."
      },
      {
        "id": "different-values",
        "text": "[[[1],2],1]",
        "rationale": "The array append has no effect and emits one handled diagnostic; the object mutation succeeds.",
        "misconception": null
      },
      {
        "id": "array-only",
        "text": "[[[1,2],1],1]",
        "rationale": "This reverses the effect of array value semantics and object identity.",
        "misconception": "Assuming arrays are implicitly shared while returned objects are copied."
      }
    ],
    "correctOptionId": "different-values",
    "explanation": {
      "summary": "A by-value __get result does not provide writable access to the stored array, so the indirect append is ineffective. Returning an object still returns its identifier, allowing mutation of that same object.",
      "trace": "items remains [1], state.value becomes 2 and the attempted indirect array modification contributes one diagnostic."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[[1],2],1]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.overloading.php",
      "https://www.php.net/manual/en/language.oop5.references.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0123",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "forwarding-parent-versus-explicit-static-call",
    "objective": {
      "id": "forwarding-parent-versus-explicit-static-call",
      "text": "Track late static binding through a forwarding parent call and a non-forwarding explicit class call."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Follow the called-class context across two inherited static call chains."
    },
    "prerequisites": [
      "Late static binding (advanced)",
      "Forwarding calls",
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
          "source": "<?php\n\nclass BaseName\n{\n    public static function who(): string\n    {\n        return static::class;\n    }\n}\n\nclass MiddleName extends BaseName\n{\n    public static function viaParent(): string\n    {\n        return parent::who();\n    }\n\n    public static function viaName(): string\n    {\n        return BaseName::who();\n    }\n}\n\nclass LeafName extends MiddleName\n{\n}\n\necho json_encode([LeafName::viaParent(), LeafName::viaName()]);\n"
        }
      ]
    },
    "stem": "What JSON class-name pair is printed by these inherited calls?",
    "options": [
      {
        "id": "both-leaf",
        "text": "[\"LeafName\",\"LeafName\"]",
        "rationale": "The explicit BaseName call starts a non-forwarding call context and does not retain LeafName.",
        "misconception": "Assuming every nested static call forwards the original called class."
      },
      {
        "id": "forwarded",
        "text": "[\"LeafName\",\"BaseName\"]",
        "rationale": "parent:: forwards LeafName; naming BaseName explicitly resets the called-class context.",
        "misconception": null
      },
      {
        "id": "both-base",
        "text": "[\"BaseName\",\"BaseName\"]",
        "rationale": "parent:: locates the parent method but forwards the current called class for static::.",
        "misconception": "Confusing method lookup location with late-bound called-class identity."
      },
      {
        "id": "middle-base",
        "text": "[\"MiddleName\",\"BaseName\"]",
        "rationale": "The forwarding call retains LeafName, not the class that declares viaParent.",
        "misconception": "Replacing the called class with the intermediate method’s declaring class."
      }
    ],
    "correctOptionId": "forwarded",
    "explanation": {
      "summary": "parent:: is a forwarding static call: it selects the parent method while preserving late-bound called-class information. An explicit BaseName:: call is non-forwarding and establishes BaseName.",
      "trace": "who sees LeafName on the first chain and BaseName on the second."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"LeafName\",\"BaseName\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.late-static-bindings.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0124",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Enums, attributes & reflection",
    "subtopic": "lazy-ghost-nonlazy-property-and-initializer",
    "objective": {
      "id": "lazy-ghost-nonlazy-property-and-initializer",
      "text": "Trace a non-lazy property write and later initialization of the remaining lazy object."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Separate property-level laziness from object-level initialization and subsequent explicit writes."
    },
    "prerequisites": [
      "PHP 8.4 lazy objects (advanced)",
      "ReflectionProperty",
      "Lazy initializer lifecycle"
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
          "source": "<?php\n\nclass LazyUser\n{\n    public int $id;\n    public string $name;\n}\n\n$runs = 0;\n$class = new ReflectionClass(LazyUser::class);\n$user = $class->newLazyGhost(function (LazyUser $user) use (&$runs): void {\n    $runs++;\n    $user->id = 99;\n    $user->name = 'Ada';\n});\n\n$class->getProperty('id')->setRawValueWithoutLazyInitialization($user, 7);\n$before = [$runs, $user->id, $class->isUninitializedLazyObject($user)];\n$name = $user->name;\n\necho json_encode([$before, [$runs, $user->id, $name]]);\n"
        }
      ]
    },
    "stem": "What JSON is printed after reading id and then name from this lazy ghost? The initializer is shown in full.",
    "options": [
      {
        "id": "eager-write",
        "text": "[[1,7,false],[1,7,\"Ada\"]]",
        "rationale": "The raw write explicitly avoids initialization, so runs is still zero at the first snapshot.",
        "misconception": "Assuming every property write initializes a lazy object first."
      },
      {
        "id": "protected-seed",
        "text": "[[0,7,true],[1,7,\"Ada\"]]",
        "rationale": "The initializer explicitly assigns id = 99; a non-lazy mutable property is not protected from later writes.",
        "misconception": "Treating a seeded non-lazy property as immutable during initialization."
      },
      {
        "id": "uninitialized-error",
        "text": "An uncaught Error when name is read",
        "rationale": "Reading the still-lazy name triggers the initializer that assigns it.",
        "misconception": "Assuming making one property non-lazy cancels initialization of all remaining properties."
      },
      {
        "id": "property-then-object",
        "text": "[[0,7,true],[1,99,\"Ada\"]]",
        "rationale": "id is readable without initialization; reading name runs the initializer, which also changes id to 99.",
        "misconception": null
      }
    ],
    "correctOptionId": "property-then-object",
    "explanation": {
      "summary": "setRawValueWithoutLazyInitialization marks the property non-lazy without initializing the whole object. Accessing another lazy property still runs the initializer, whose ordinary assignments can update mutable properties.",
      "trace": "The first snapshot is 0 runs, id 7, object still lazy. Reading name invokes the initializer once, sets id 99 and name Ada, then returns Ada."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[0,7,true],[1,99,\"Ada\"]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/reflectionproperty.setrawvaluewithoutlazyinitialization.php",
      "https://www.php.net/manual/en/reflectionclass.newlazyghost.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0125",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "asymmetric-visibility-exported-reference",
    "objective": {
      "id": "asymmetric-visibility-exported-reference",
      "text": "Distinguish restricted property writes from mutations through a reference deliberately exported by an authorized method."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine PHP 8.4 setter visibility, reference acquisition scope and later indirect mutation."
    },
    "prerequisites": [
      "PHP 8.4 asymmetric visibility (advanced)",
      "Returning references",
      "Array mutation"
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
          "source": "<?php\n\nclass ListBox\n{\n    public private(set) array $items = [];\n\n    public function &itemsReference(): array\n    {\n        return $this->items;\n    }\n}\n\n$box = new ListBox();\n$alias =& $box->itemsReference();\n$alias[] = 'via-reference';\n$status = 'allowed';\n\ntry {\n    $box->items[] = 'direct';\n} catch (Error $error) {\n    $status = 'blocked';\n}\n\necho json_encode([$box->items, $status]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? The reference is acquired through the class’s public method before an outside direct property write is attempted.",
    "options": [
      {
        "id": "exported-alias",
        "text": "[[\"via-reference\"],\"blocked\"]",
        "rationale": "The method acquires and exports a writable reference in authorized scope; outside direct modification is still forbidden.",
        "misconception": null
      },
      {
        "id": "both-writes",
        "text": "[[\"via-reference\",\"direct\"],\"allowed\"]",
        "rationale": "Public read visibility does not permit the outside direct array-element modification.",
        "misconception": "Assuming array-element writes use only get visibility."
      },
      {
        "id": "copied-return",
        "text": "[[],\"blocked\"]",
        "rationale": "Both the method and receiving assignment explicitly use references, so alias is not a value copy.",
        "misconception": "Assuming private(set) forces all returned values to be detached copies."
      },
      {
        "id": "reference-error",
        "text": "An uncaught Error when itemsReference returns",
        "rationale": "The reference is acquired inside ListBox, where private setter access is permitted.",
        "misconception": "Applying the outside caller’s scope to the internal reference acquisition."
      }
    ],
    "correctOptionId": "exported-alias",
    "explanation": {
      "summary": "Setter visibility controls direct write and reference acquisition access. A method allowed to acquire a reference can deliberately expose that writable storage; it must preserve its own encapsulation contract.",
      "trace": "The exported alias appends via-reference. The direct outside append fails the private setter check and is caught, leaving only the first item."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[\"via-reference\"],\"blocked\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.visibility.php#language.oop5.visibility-members",
      "https://www.php.net/manual/en/language.references.return.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0126",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Arrays & destructuring",
    "subtopic": "nullable-array-count-empty-default",
    "objective": {
      "id": "nullable-array-count-empty-default",
      "text": "Repair counting an optional array without counting a placeholder as an element."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose an empty-array fallback for null while preserving real empty and nonempty arrays."
    },
    "prerequisites": [
      "Nullable parameters",
      "count",
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
          "source": "<?php\n\nfunction size(?array $items): int\n{\n    return count($items);\n}\n\necho json_encode([size(null), size([]), size(['x', 'y'])]);\n"
        }
      ]
    },
    "stem": "size must return zero for null or an empty array and the element count otherwise. Which replacement for count($items) repairs the null case without changing the other cases?",
    "options": [
      {
        "id": "wrap",
        "text": "count([$items])",
        "rationale": "Wrapping creates one outer element regardless of the contained value.",
        "misconception": "Confusing an array containing the input with the input array."
      },
      {
        "id": "null-element",
        "text": "count($items ?? [null])",
        "rationale": "The null fallback contains one element, so null returns 1.",
        "misconception": "Treating a null array element as no element."
      },
      {
        "id": "empty-default",
        "text": "count($items ?? [])",
        "rationale": "Null becomes an empty array; existing arrays retain their own elements.",
        "misconception": null
      },
      {
        "id": "truthy-placeholder",
        "text": "count($items ?: [null])",
        "rationale": "Both null and an empty array become a one-element placeholder.",
        "misconception": "Using truthiness fallback with a nonempty sentinel array."
      }
    ],
    "correctOptionId": "empty-default",
    "explanation": {
      "summary": "count requires an array or Countable here; null is not countable. The empty array is the correct zero-element default.",
      "trace": "The replacement counts [], [] and [x,y], producing 0, 0 and 2."
    },
    "validation": {
      "kind": "patch",
      "marker": "count($items)",
      "stdout": "[0,0,2]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.count.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0127",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Types, casting & comparisons",
    "subtopic": "last-byte-zero-based-string-index",
    "objective": {
      "id": "last-byte-zero-based-string-index",
      "text": "Repair an off-by-one index when reading the final byte of a nonempty ASCII string."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Relate byte length to the last valid zero-based offset."
    },
    "prerequisites": [
      "String offsets",
      "strlen",
      "Zero-based indexing"
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
          "source": "<?php\n\n$code = 'ABCD';\n$last = $code[strlen($code)];\n\necho $last;\n"
        }
      ]
    },
    "stem": "The string is nonempty ASCII. Replace the bracketed offset expression so last receives D rather than reading beyond the string.",
    "options": [
      {
        "id": "last-index",
        "text": "strlen($code) - 1",
        "rationale": "A four-byte string has valid offsets 0 through 3.",
        "misconception": null
      },
      {
        "id": "length",
        "text": "strlen($code)",
        "rationale": "The length is one past the final valid offset.",
        "misconception": "Treating length as a valid last index."
      },
      {
        "id": "previous",
        "text": "strlen($code) - 2",
        "rationale": "This selects C, the penultimate byte.",
        "misconception": "Subtracting twice for zero-based indexing."
      },
      {
        "id": "first",
        "text": "0",
        "rationale": "Zero selects A, not the final byte.",
        "misconception": "Applying the initial offset where the last offset is required."
      }
    ],
    "correctOptionId": "last-index",
    "explanation": {
      "summary": "String offsets are zero-based. For a nonempty byte string of length n, the final byte is at n − 1.",
      "trace": "strlen returns 4, so the valid final offset is 3 and the result is D."
    },
    "validation": {
      "kind": "patch",
      "marker": "strlen($code)",
      "stdout": "D",
      "errors": {
        "length": {
          "message": "Uninitialized string offset",
          "exitCode": 0
        }
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.string.php#language.types.string.substr"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0128",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Arrays & destructuring",
    "subtopic": "iterate-actual-gapped-array-keys",
    "objective": {
      "id": "iterate-actual-gapped-array-keys",
      "text": "Repair iteration that assumes an array’s keys are consecutive positions."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish an array’s size, values and actual keys after gaps are introduced."
    },
    "prerequisites": [
      "Array keys",
      "range",
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
          "source": "<?php\n\n$data = [2 => 10, 5 => 20];\n$seen = [];\n\nforeach (range(0, count($data) - 1) as $key) {\n    $seen[] = $data[$key] ?? 'missing';\n}\n\necho json_encode($seen);\n"
        }
      ]
    },
    "stem": "The loop must visit each stored value once, with no missing entries. Which expression should replace range(0, count($data) - 1)?",
    "options": [
      {
        "id": "values",
        "text": "array_values($data)",
        "rationale": "This iterates 10 and 20 as keys, which are absent.",
        "misconception": "Confusing data values with the keys used to retrieve them."
      },
      {
        "id": "key-range",
        "text": "range(min(array_keys($data)), max(array_keys($data)))",
        "rationale": "The full range includes absent keys 3 and 4.",
        "misconception": "Assuming every key between the minimum and maximum exists."
      },
      {
        "id": "one-based",
        "text": "range(1, count($data))",
        "rationale": "The count does not reveal the actual keys 2 and 5.",
        "misconception": "Replacing a zero-based positional assumption with a one-based one."
      },
      {
        "id": "actual-keys",
        "text": "array_keys($data)",
        "rationale": "This supplies exactly the existing keys, in iteration order.",
        "misconception": null
      }
    ],
    "correctOptionId": "actual-keys",
    "explanation": {
      "summary": "A PHP array can have gaps or arbitrary keys. count gives the number of entries, not an index range containing those entries.",
      "trace": "array_keys returns [2,5], and those lookups yield 10 and 20."
    },
    "validation": {
      "kind": "patch",
      "marker": "range(0, count($data) - 1)",
      "stdout": "[10,20]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-keys.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0129",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "literal-percent-in-format-string",
    "objective": {
      "id": "literal-percent-in-format-string",
      "text": "Repair a literal percent sign inside a sprintf format string."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish formatter escaping from PHP-string and HTML escaping."
    },
    "prerequisites": [
      "sprintf placeholders",
      "String escaping"
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
          "source": "<?php\n\ntry {\n    echo sprintf('Tax: 20% of %s', 'gross');\n} catch (Throwable $error) {\n    echo 'format error';\n}\n"
        }
      ]
    },
    "stem": "The formatter must return exactly Tax: 20% of gross. Replace only the format string with one option. Which choice keeps one %s argument and a literal percent sign?",
    "options": [
      {
        "id": "php-backslash",
        "text": "'Tax: 20\\% of %s'",
        "rationale": "A backslash does not escape the percent sign for sprintf.",
        "misconception": "Applying PHP-string escape conventions to the formatter’s own syntax."
      },
      {
        "id": "double-percent",
        "text": "'Tax: 20%% of %s'",
        "rationale": "%% emits a literal percent sign without consuming an argument.",
        "misconception": null
      },
      {
        "id": "html-entity",
        "text": "'Tax: 20&#37; of %s'",
        "rationale": "sprintf returns the entity text literally; it does not render HTML entities.",
        "misconception": "Using HTML escaping to produce plain text from a formatter."
      },
      {
        "id": "url-escape",
        "text": "'Tax: 20%25 of %s'",
        "rationale": "%25 is not a URL-decoding instruction to sprintf and is interpreted as format syntax.",
        "misconception": "Applying percent-encoding syntax inside a printf-style format."
      }
    ],
    "correctOptionId": "double-percent",
    "explanation": {
      "summary": "sprintf uses %% for a literal percent sign. Its formatting language is separate from both PHP string escaping and HTML or URL encoding.",
      "trace": "%% contributes %, while the single %s consumes gross."
    },
    "validation": {
      "kind": "patch",
      "marker": "'Tax: 20% of %s'",
      "stdout": "Tax: 20% of gross",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.sprintf.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0130",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "validated-input-cast-before-strict-call",
    "objective": {
      "id": "validated-input-cast-before-strict-call",
      "text": "Convert an already validated integer string at a strict function boundary."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose a conversion that produces the parameter’s required runtime type."
    },
    "prerequisites": [
      "strict_types",
      "Scalar casts",
      "Typed parameters"
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
        "An earlier boundary has already verified that input contains only decimal digits and fits in the PHP integer range. This question is about conversion after validation."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\ndeclare(strict_types=1);\n\nfunction doubleCount(int $count): int\n{\n    return $count * 2;\n}\n\n$input = '9';\n\necho doubleCount($input);\n"
        }
      ]
    },
    "stem": "The strict call currently rejects the string. Which replacement for $input at the call site supplies an integer without changing doubleCount?",
    "options": [
      {
        "id": "float",
        "text": "(float) $input",
        "rationale": "Strict int parameters reject float values even when they have no fractional part.",
        "misconception": "Assuming a mathematically integral float has runtime type int."
      },
      {
        "id": "boolean",
        "text": "(bool) $input",
        "rationale": "The boolean true is not accepted as an int in this strict call.",
        "misconception": "Relying on boolean-to-integer coercion despite strict_types."
      },
      {
        "id": "integer",
        "text": "(int) $input",
        "rationale": "The validated decimal string becomes the integer required by the parameter.",
        "misconception": null
      },
      {
        "id": "rounded",
        "text": "floor((float) $input)",
        "rationale": "floor returns a float, so the strict parameter still rejects it.",
        "misconception": "Assuming rounding changes a float’s runtime type to int."
      }
    ],
    "correctOptionId": "integer",
    "explanation": {
      "summary": "Validation and conversion are separate steps. Once the integer representation and range are established, an explicit int cast supplies the declared type at a strict call site.",
      "trace": "The cast yields integer 9, and doubleCount returns integer 18."
    },
    "validation": {
      "kind": "patch",
      "marker": "doubleCount($input)",
      "candidates": {
        "float": "doubleCount((float) $input)",
        "boolean": "doubleCount((bool) $input)",
        "integer": "doubleCount((int) $input)",
        "rounded": "doubleCount(floor((float) $input))"
      },
      "stdout": "18",
      "errors": {
        "float": "TypeError",
        "boolean": "TypeError",
        "rounded": "TypeError"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict",
      "https://www.php.net/manual/en/function.floor.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0131",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Validation & web security",
    "subtopic": "verify-password-against-stored-salted-hash",
    "objective": {
      "id": "verify-password-against-stored-salted-hash",
      "text": "Repair password verification that incorrectly compares newly salted hashes."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish hashing a new password from checking a password against an existing encoded hash."
    },
    "prerequisites": [
      "password_hash",
      "password_verify",
      "Salted password hashes"
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
          "source": "<?php\n\nfunction valid(string $input, string $stored): bool\n{\n    return password_hash($input, PASSWORD_BCRYPT, ['cost' => 4]) === $stored;\n}\n\n$stored = password_hash('correct', PASSWORD_BCRYPT, ['cost' => 4]);\n\necho json_encode([valid('correct', $stored), valid('wrong', $stored)]);\n"
        }
      ]
    },
    "stem": "The stored bcrypt hash was created from correct. Which replacement makes valid accept that password and reject wrong? Cost 4 is used only to keep this isolated fixture fast.",
    "options": [
      {
        "id": "compare-new",
        "text": "hash_equals($stored, password_hash($input, PASSWORD_BCRYPT, ['cost' => 4]))",
        "rationale": "A newly generated salt produces a different encoded hash; timing-safe comparison does not change that.",
        "misconception": "Treating the comparison function as the cause of the salted-hash mismatch."
      },
      {
        "id": "verify",
        "text": "password_verify($input, $stored)",
        "rationale": "password_verify uses the algorithm, salt and cost encoded in the stored hash.",
        "misconception": null
      },
      {
        "id": "reversed",
        "text": "password_verify($stored, $input)",
        "rationale": "The second argument must be the encoded hash, not the plaintext input.",
        "misconception": "Reversing password_verify’s password and hash arguments."
      },
      {
        "id": "double-hash",
        "text": "password_verify(password_hash($input, PASSWORD_BCRYPT, ['cost' => 4]), $stored)",
        "rationale": "This verifies an encoded hash string as the password rather than the original input.",
        "misconception": "Assuming the plaintext must be prehashed with password_hash before verification."
      }
    ],
    "correctOptionId": "verify",
    "explanation": {
      "summary": "password_hash creates a new encoded hash with its own salt. password_verify checks the original password using the parameters already contained in the stored hash.",
      "trace": "The accepted expression returns true for correct and false for wrong, regardless of the random salt chosen when the fixture hash is created."
    },
    "validation": {
      "kind": "patch",
      "marker": "password_hash($input, PASSWORD_BCRYPT, ['cost' => 4]) === $stored",
      "stdout": "[true,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.password-verify.php",
      "https://www.php.net/manual/en/function.password-hash.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0132",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Validation & web security",
    "subtopic": "base64-reject-invalid-alphabet-not-sanitize",
    "objective": {
      "id": "base64-reject-invalid-alphabet-not-sanitize",
      "text": "Reject Base64 input containing foreign alphabet characters instead of silently discarding them."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish strict decoding from sanitization and unrelated transport encoding."
    },
    "prerequisites": [
      "Base64 decoding",
      "Strict failure sentinels",
      "Encoding layers"
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
          "source": "<?php\n\nfunction decodeToken(string $raw): string\n{\n    $decoded = base64_decode($raw);\n\n    return $decoded === false ? 'invalid' : bin2hex($decoded);\n}\n\necho json_encode(array_map('decodeToken', ['YQ==', 'Y!Q==', '']));\n"
        }
      ]
    },
    "stem": "decodeToken must reject an exclamation mark rather than remove it. Empty input is valid and decodes to empty bytes. Which replacement for the decode call meets this policy?",
    "options": [
      {
        "id": "trim",
        "text": "base64_decode(trim($raw))",
        "rationale": "Trimming does not remove the embedded exclamation mark, and permissive decoding still ignores it.",
        "misconception": "Assuming whitespace trimming enables strict decoding."
      },
      {
        "id": "sanitize",
        "text": "base64_decode(preg_replace('~[^A-Za-z0-9+/=]~', '', $raw), true)",
        "rationale": "This removes the invalid character before checking, accepting input the policy requires rejecting.",
        "misconception": "Equating sanitizing an invalid token with validating it."
      },
      {
        "id": "url-first",
        "text": "base64_decode(rawurlencode($raw), true)",
        "rationale": "URL encoding introduces percent sequences that are not the original Base64 input and rejects the valid padded token.",
        "misconception": "Applying a transport encoder before a different decoder."
      },
      {
        "id": "strict",
        "text": "base64_decode($raw, true)",
        "rationale": "The strict flag returns false when the input contains a character outside the Base64 alphabet.",
        "misconception": null
      }
    ],
    "correctOptionId": "strict",
    "explanation": {
      "summary": "Permissive base64_decode can ignore foreign characters. Its strict flag rejects them; pre-cleaning would erase the evidence that the input was invalid.",
      "trace": "YQ== decodes to byte 61, Y!Q== is rejected and empty input decodes to an empty string."
    },
    "validation": {
      "kind": "patch",
      "marker": "base64_decode($raw)",
      "stdout": "[\"61\",\"invalid\",\"\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.base64-decode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0133",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "date-parse-rollover-and-canonical-roundtrip",
    "objective": {
      "id": "date-parse-rollover-and-canonical-roundtrip",
      "text": "Reject calendar rollover and noncanonical date spellings after parsing."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish successful object creation from an exact valid calendar representation."
    },
    "prerequisites": [
      "DateTimeImmutable::createFromFormat",
      "Calendar dates",
      "Date parsing and formatting"
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
          "source": "<?php\n\nfunction acceptsDate(string $input): bool\n{\n    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $input);\n\n    return $date !== false;\n}\n\necho json_encode(array_map('acceptsDate', [\n    '2026-02-28',\n    '2026-02-30',\n    '2026-2-3',\n    '2024-02-29',\n]));\n"
        }
      ]
    },
    "stem": "acceptsDate must accept only real calendar dates written exactly YYYY-MM-DD. Which predicate should replace $date !== false?",
    "options": [
      {
        "id": "roundtrip",
        "text": "$date !== false && $date->format('Y-m-d') === $input",
        "rationale": "A successful parse must reproduce the exact input, rejecting rollover and missing zero padding.",
        "misconception": null
      },
      {
        "id": "instance",
        "text": "$date instanceof DateTimeImmutable",
        "rationale": "The parser can return an object after normalizing an invalid calendar date.",
        "misconception": "Treating object creation as proof of semantic date validity."
      },
      {
        "id": "errors-only",
        "text": "$date !== false && (DateTimeImmutable::getLastErrors()['error_count'] ?? 0) === 0",
        "rationale": "Calendar rollover can produce warnings rather than errors, and this also omits canonical spelling validation.",
        "misconception": "Checking parse errors while ignoring warnings and representation requirements."
      },
      {
        "id": "shape-only",
        "text": "$date !== false && preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/', $input) === 1",
        "rationale": "February 30 has the right shape but is not a real date.",
        "misconception": "Combining lexical shape with permissive parsing without checking normalization."
      }
    ],
    "correctOptionId": "roundtrip",
    "explanation": {
      "summary": "The parser may normalize out-of-range dates or accept less-padded components. Formatting a successful result back to the exact required format detects both changes.",
      "trace": "February 30 normalizes to a different day, and 2026-2-3 formats with added zeros. The two valid canonical dates reproduce themselves."
    },
    "validation": {
      "kind": "patch",
      "marker": "$date !== false",
      "stdout": "[true,false,false,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/datetimeimmutable.createfromformat.php",
      "https://www.php.net/manual/en/datetimeimmutable.getlasterrors.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0134",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "HTTP & superglobals",
    "subtopic": "header-value-reject-each-line-break-byte",
    "objective": {
      "id": "header-value-reject-each-line-break-byte",
      "text": "Reject either CR or LF anywhere in a proposed header value."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish individual forbidden bytes from a specific two-byte sequence or edge whitespace."
    },
    "prerequisites": [
      "HTTP header values",
      "CR and LF",
      "String validation"
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
          "source": "<?php\n\nfunction safeHeader(string $value): bool\n{\n    return !str_contains($value, \"\\r\\n\");\n}\n\necho json_encode(array_map('safeHeader', [\n    'plain',\n    \"a\\rb\",\n    \"a\\nb\",\n    \"a\\r\\nb\",\n]));\n"
        }
      ]
    },
    "stem": "This pure validator must accept plain and reject any value containing CR or LF, without modifying it. No HTTP headers are actually sent. Which predicate repairs the current paired-sequence check?",
    "options": [
      {
        "id": "trim",
        "text": "trim($value) === $value",
        "rationale": "All displayed line breaks are internal, so trimming the edges does not reject them.",
        "misconception": "Treating trimming as validation of forbidden bytes anywhere in a string."
      },
      {
        "id": "lf-only",
        "text": "!str_contains($value, \"\\n\")",
        "rationale": "A lone CR remains accepted.",
        "misconception": "Assuming LF is the only line-break byte that matters."
      },
      {
        "id": "either",
        "text": "strpbrk($value, \"\\r\\n\") === false",
        "rationale": "strpbrk searches for either listed byte; false means neither occurs.",
        "misconception": null
      },
      {
        "id": "remove-pair",
        "text": "$value === str_replace(\"\\r\\n\", \"\", $value)",
        "rationale": "Removing the CRLF pair detects paired breaks but still misses lone CR or LF.",
        "misconception": "Reexpressing the same paired-sequence check as replacement."
      }
    ],
    "correctOptionId": "either",
    "explanation": {
      "summary": "The policy forbids either byte independently. A character-set search tests that policy directly, unlike substring search for the pair or trimming the ends.",
      "trace": "plain contains neither byte. Each other input contains at least one forbidden byte and is rejected."
    },
    "validation": {
      "kind": "patch",
      "marker": "!str_contains($value, \"\\r\\n\")",
      "stdout": "[true,false,false,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/function.strpbrk.php",
      "https://www.rfc-editor.org/rfc/rfc9110.html#section-5.5"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0135",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Forms & file uploads",
    "subtopic": "upload-error-codes-are-not-bit-flags",
    "objective": {
      "id": "upload-error-codes-are-not-bit-flags",
      "text": "Classify upload size failures using discrete error codes rather than bitwise membership."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish enumerated integer outcomes from combinable permission-style flags."
    },
    "prerequisites": [
      "PHP upload error constants",
      "Integer equality",
      "Bitwise operators"
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
          "source": "<?php\n\nfunction tooLarge(int $error): bool\n{\n    return ($error & UPLOAD_ERR_INI_SIZE) !== 0;\n}\n\necho json_encode(array_map('tooLarge', [\n    UPLOAD_ERR_INI_SIZE,\n    UPLOAD_ERR_FORM_SIZE,\n    UPLOAD_ERR_PARTIAL,\n    UPLOAD_ERR_OK,\n]));\n"
        }
      ]
    },
    "stem": "tooLarge must recognize only UPLOAD_ERR_INI_SIZE and UPLOAD_ERR_FORM_SIZE. Which replacement avoids incorrectly treating UPLOAD_ERR_PARTIAL as a size error?",
    "options": [
      {
        "id": "any-error",
        "text": "$error > UPLOAD_ERR_OK",
        "rationale": "This classifies every nonzero error, including a partial upload, as too large.",
        "misconception": "Treating all failed uploads as size failures."
      },
      {
        "id": "explicit-set",
        "text": "in_array($error, [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)",
        "rationale": "The predicate tests membership in the two specified discrete outcomes.",
        "misconception": null
      },
      {
        "id": "combined-mask",
        "text": "($error & (UPLOAD_ERR_INI_SIZE | UPLOAD_ERR_FORM_SIZE)) !== 0",
        "rationale": "The codes are 1, 2 and 3; the partial-upload code overlaps this invented bit mask.",
        "misconception": "Assuming upload error constants are independent bit flags."
      },
      {
        "id": "form-only",
        "text": "$error === UPLOAD_ERR_FORM_SIZE",
        "rationale": "This misses the server-configured upload size limit.",
        "misconception": "Handling only the form limit instead of both size-related outcomes."
      }
    ],
    "correctOptionId": "explicit-set",
    "explanation": {
      "summary": "Upload error values identify distinct outcomes; they are not a set of independent bits. Compare against the specific accepted error codes.",
      "trace": "The two size codes return true. Partial upload and successful upload return false."
    },
    "validation": {
      "kind": "patch",
      "marker": "($error & UPLOAD_ERR_INI_SIZE) !== 0",
      "stdout": "[true,true,false,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-12"
    },
    "references": [
      "https://www.php.net/manual/en/features.file-upload.errors.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0136",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "HTTP & superglobals",
    "subtopic": "json-request-body-versus-form-data",
    "objective": {
      "id": "json-request-body-versus-form-data",
      "text": "Decode an application/json request body instead of expecting form-populated POST values."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Keep the raw representation, media-type-specific parser and decoded shape aligned."
    },
    "prerequisites": [
      "HTTP request bodies",
      "$_POST form handling",
      "JSON decoding"
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
        "The request Content-Type is application/json. raw contains the complete body read by the boundary, and post is the empty form-data array supplied for that request. The shown JSON is syntactically valid."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction quantity(string $raw, array $post): ?int\n{\n    $data = $post;\n\n    return is_array($data) && isset($data['qty']) && is_int($data['qty'])\n        ? $data['qty']\n        : null;\n}\n\necho json_encode([\n    quantity('{\"qty\":2}', []),\n    quantity('{\"qty\":0}', []),\n]);\n"
        }
      ]
    },
    "stem": "Which replacement for $data = $post; makes quantity read the integer qty from the JSON body, including zero?",
    "options": [
      {
        "id": "form-parser",
        "text": "parse_str($raw, $data);",
        "rationale": "parse_str interprets form/query syntax, not a JSON object.",
        "misconception": "Using the form parser for every HTTP body representation."
      },
      {
        "id": "object-decode",
        "text": "$data = json_decode($raw, false, 512, JSON_THROW_ON_ERROR);",
        "rationale": "This returns stdClass, while the existing access code explicitly requires an array.",
        "misconception": "Selecting the right parser but the wrong decoded shape for the caller."
      },
      {
        "id": "post-roundtrip",
        "text": "$data = json_decode(json_encode($post), true, 512, JSON_THROW_ON_ERROR);",
        "rationale": "Round-tripping the empty form array never reads the supplied raw JSON body.",
        "misconception": "Assuming JSON encoding can recover data absent from $_POST."
      },
      {
        "id": "raw-json",
        "text": "$data = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);",
        "rationale": "This parses the raw JSON and produces the associative array expected by the remaining code.",
        "misconception": null
      }
    ],
    "correctOptionId": "raw-json",
    "explanation": {
      "summary": "PHP’s POST form array is not a general JSON body decoder. The boundary must parse the raw JSON and choose a decoded representation compatible with its access logic.",
      "trace": "The decoded arrays contain integer qty values 2 and 0; isset accepts both and the integer check preserves zero."
    },
    "validation": {
      "kind": "patch",
      "marker": "$data = $post;",
      "stdout": "[2,0]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/reserved.variables.post.php",
      "https://www.php.net/manual/en/function.json-decode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0137",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "dynamic-constant-name-requires-namespace-string",
    "objective": {
      "id": "dynamic-constant-name-requires-namespace-string",
      "text": "Repair a dynamic constant lookup that does not automatically apply lexical namespace resolution."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a constant expression in source from a runtime string naming a constant."
    },
    "prerequisites": [
      "Namespaces",
      "Constants",
      "constant"
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
          "source": "<?php\n\nnamespace App;\n\nconst MODE = 'app';\n\\define('MODE', 'global');\n$name = 'MODE';\n\ntry {\n    echo constant($name);\n} catch (\\Error $error) {\n    echo 'Error';\n}\n"
        }
      ]
    },
    "stem": "The lookup must return App’s MODE, not the global MODE. Which expression should replace constant($name)?",
    "options": [
      {
        "id": "qualified",
        "text": "constant(__NAMESPACE__ . '\\\\' . $name)",
        "rationale": "The runtime name explicitly identifies App\\MODE.",
        "misconception": null
      },
      {
        "id": "class-separator",
        "text": "constant(__NAMESPACE__ . '::' . $name)",
        "rationale": "The :: separator denotes a class constant, not a namespace constant.",
        "misconception": "Using class-member syntax to qualify a namespace-level constant."
      },
      {
        "id": "joined",
        "text": "constant(__NAMESPACE__ . $name)",
        "rationale": "This asks for AppMODE, not App\\MODE.",
        "misconception": "Concatenating a namespace without its separator."
      },
      {
        "id": "global-qualified",
        "text": "constant('\\\\' . $name)",
        "rationale": "A leading separator names the global MODE rather than App’s constant.",
        "misconception": "Assuming a leading backslash means the current namespace."
      }
    ],
    "correctOptionId": "qualified",
    "explanation": {
      "summary": "constant receives a runtime string. It does not prepend the current namespace as a source-level unqualified constant expression would.",
      "trace": "The qualified string App\\MODE resolves to app. The original plain MODE resolves to the global value."
    },
    "validation": {
      "kind": "patch",
      "marker": "constant($name)",
      "stdout": "app",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://www.php.net/manual/en/function.constant.php",
      "https://www.php.net/manual/en/language.namespaces.dynamic.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0138",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Includes, autoloading & paths",
    "subtopic": "cooperating-autoloaders-unknown-class-return",
    "objective": {
      "id": "cooperating-autoloaders-unknown-class-return",
      "text": "Repair an autoloader so unsupported names fall through without disabling future supported loads."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace a loader chain across two class requests and observe loading order."
    },
    "prerequisites": [
      "spl_autoload_register",
      "Multiple autoloaders",
      "Class loading side effects"
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
          "path": "first.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass FirstRecord\n{\n}\n\n$GLOBALS['trace'][] = 'first';\n"
        },
        {
          "path": "second.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass SecondRecord\n{\n}\n\n$GLOBALS['trace'][] = 'second';\n"
        },
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$GLOBALS['trace'] = [];\n\nfunction loadFirst(string $class): void\n{\n    if ($class !== FirstRecord::class) {\n        throw new RuntimeException('unsupported');\n    }\n\n    require __DIR__ . '/first.php';\n}\n\nspl_autoload_register('loadFirst');\nspl_autoload_register(function (string $class): void {\n    if ($class === SecondRecord::class) {\n        require __DIR__ . '/second.php';\n    }\n});\n\ntry {\n    $second = new SecondRecord();\n    $first = new FirstRecord();\n    echo json_encode($GLOBALS['trace']);\n} catch (Throwable $error) {\n    echo get_class($error);\n}\n"
        }
      ]
    },
    "stem": "Each loader should load only its requested supported class. SecondRecord is requested first, then FirstRecord. Replace the unsupported-class branch’s throw so both load in request order and the first loader remains available.",
    "options": [
      {
        "id": "different-exception",
        "text": "throw new LogicException('unsupported');",
        "rationale": "Changing exception type still aborts the loader chain before the later loader can handle the name.",
        "misconception": "Treating the exception class as the cause of autoload-chain failure."
      },
      {
        "id": "unregister",
        "text": "spl_autoload_unregister(__FUNCTION__);\nreturn;",
        "rationale": "The second class loads, but the later FirstRecord request has lost its loader.",
        "misconception": "Removing a loader permanently when it merely does not own one requested class."
      },
      {
        "id": "fall-through",
        "text": "return;",
        "rationale": "Returning without defining an unsupported class lets the next loader try while keeping this loader registered.",
        "misconception": null
      },
      {
        "id": "eager-first",
        "text": "require __DIR__ . '/first.php';\nreturn;",
        "rationale": "This loads FirstRecord during the SecondRecord request, violating the stated ownership and load order.",
        "misconception": "Using an unrelated eager include as an autoload fallback."
      }
    ],
    "correctOptionId": "fall-through",
    "explanation": {
      "summary": "Autoloaders cooperate by declining names they do not own. Throwing stops that cooperation, while unregistering discards future supported behavior.",
      "trace": "The first loader declines SecondRecord. The second loads it. The next FirstRecord request is handled by the still-registered first loader."
    },
    "validation": {
      "kind": "patch",
      "marker": "throw new RuntimeException('unsupported');",
      "stdout": "[\"second\",\"first\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-09"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.autoload.php",
      "https://www.php.net/manual/en/function.spl-autoload-register.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0139",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Includes, autoloading & paths",
    "subtopic": "repeated-config-return-versus-require-once-sentinel",
    "objective": {
      "id": "repeated-config-return-versus-require-once-sentinel",
      "text": "Repair repeated configuration reads that expect the file’s return value on every call."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish include-once suppression from caching a file’s returned data."
    },
    "prerequisites": [
      "require and require_once",
      "Included-file return values",
      "Typed returns"
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
        "config.php is trusted, contains only the displayed return statement and declares no functions or classes. Re-evaluating it is permitted."
      ],
      "files": [
        {
          "path": "config.php",
          "kind": "complete-file",
          "source": "<?php\n\nreturn ['mode' => 'safe'];\n"
        },
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction loadConfig(): array\n{\n    return require_once __DIR__ . '/config.php';\n}\n\ntry {\n    echo json_encode([loadConfig(), loadConfig()]);\n} catch (TypeError $error) {\n    echo 'TypeError';\n}\n"
        }
      ]
    },
    "stem": "loadConfig must return the configuration array on every call. Which replacement for the require_once expression satisfies both calls?",
    "options": [
      {
        "id": "include-once",
        "text": "include_once __DIR__ . '/config.php'",
        "rationale": "include_once also skips a previously included file and does not replay its returned array.",
        "misconception": "Assuming only require_once uses a once-only return sentinel."
      },
      {
        "id": "evaluate",
        "text": "require __DIR__ . '/config.php'",
        "rationale": "Each permitted evaluation executes the return statement and obtains the array.",
        "misconception": null
      },
      {
        "id": "cast-sentinel",
        "text": "(array) (require_once __DIR__ . '/config.php')",
        "rationale": "The second true sentinel becomes [true], not the required configuration array.",
        "misconception": "Repairing the declared return type while losing the returned data contract."
      },
      {
        "id": "read-text",
        "text": "file_get_contents(__DIR__ . '/config.php')",
        "rationale": "This reads PHP source text rather than evaluating its return statement.",
        "misconception": "Treating an executable configuration file as already decoded data."
      }
    ],
    "correctOptionId": "evaluate",
    "explanation": {
      "summary": "The once variants prevent repeated evaluation; they do not cache and replay a file’s original return value. This file may safely be evaluated again, so require supplies the array each time.",
      "trace": "Both calls execute return [mode => safe], and both results remain arrays with the same configuration."
    },
    "validation": {
      "kind": "patch",
      "marker": "require_once __DIR__ . '/config.php'",
      "stdout": "[{\"mode\":\"safe\"},{\"mode\":\"safe\"}]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-09"
    },
    "references": [
      "https://www.php.net/manual/en/function.require-once.php",
      "https://www.php.net/manual/en/function.include.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0140",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "json-big-integer-preserve-before-float-conversion",
    "objective": {
      "id": "json-big-integer-preserve-before-float-conversion",
      "text": "Preserve a JSON integer identifier exactly when it exceeds the PHP integer range."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Recognize that formatting or casting after float conversion cannot recover lost precision."
    },
    "prerequisites": [
      "64-bit integer limits",
      "JSON number decoding",
      "Floating-point precision"
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
          "source": "<?php\n\nfunction id(string $raw): string\n{\n    return (string) json_decode($raw, true, 512, JSON_THROW_ON_ERROR)['id'];\n}\n\necho id('{\"id\":9223372036854775809}');\n"
        }
      ]
    },
    "stem": "id must return the exact decimal identifier as a string. Which replacement prevents precision loss for this JSON number on 64-bit PHP?",
    "options": [
      {
        "id": "cast-after",
        "text": "(string) json_decode($raw, true, 512, JSON_THROW_ON_ERROR)['id']",
        "rationale": "The default decode has already converted the out-of-range integer to an imprecise float.",
        "misconception": "Assuming a later string cast can recover digits lost during decoding."
      },
      {
        "id": "format-after",
        "text": "number_format(json_decode($raw, true, 512, JSON_THROW_ON_ERROR)['id'], 0, '.', '')",
        "rationale": "Formatting removes scientific notation but formats the already rounded value.",
        "misconception": "Confusing decimal presentation with exact numeric preservation."
      },
      {
        "id": "reencode",
        "text": "json_encode(json_decode($raw, true, 512, JSON_THROW_ON_ERROR)['id'])",
        "rationale": "Re-encoding the float cannot reconstruct the original integer token.",
        "misconception": "Assuming a decode/encode round trip preserves every numeric representation."
      },
      {
        "id": "preserve-token",
        "text": "json_decode($raw, true, 512, JSON_THROW_ON_ERROR | JSON_BIGINT_AS_STRING)['id']",
        "rationale": "The decoder retains an out-of-range integer as its exact decimal string before float precision can be lost.",
        "misconception": null
      }
    ],
    "correctOptionId": "preserve-token",
    "explanation": {
      "summary": "JSON_BIGINT_AS_STRING preserves integers that cannot fit in PHP’s integer type. Casting or formatting a float after ordinary decoding is too late to recover the original digits.",
      "trace": "The flag retains 9223372036854775809 as a string. Default decoding rounds the numeric value before any later conversion."
    },
    "validation": {
      "kind": "patch",
      "marker": "(string) json_decode($raw, true, 512, JSON_THROW_ON_ERROR)['id']",
      "stdout": "9223372036854775809",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.json-decode.php",
      "https://www.php.net/manual/en/language.types.float.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0141",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Enums, attributes & reflection",
    "subtopic": "attribute-new-argument-repeated-evaluation",
    "objective": {
      "id": "attribute-new-argument-repeated-evaluation",
      "text": "Avoid reevaluating an attribute argument expression when two consumers must share its constructed object."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine lazy attribute argument evaluation, object construction and identity preservation."
    },
    "prerequisites": [
      "Attributes (advanced)",
      "New expressions in attribute arguments",
      "ReflectionAttribute"
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
          "source": "<?php\n\nclass Token\n{\n    public static int $created = 0;\n\n    public function __construct()\n    {\n        self::$created++;\n    }\n}\n\n#[Attribute(Attribute::TARGET_CLASS)]\nclass Wrap\n{\n    public function __construct(public Token $token)\n    {\n    }\n}\n\n#[Wrap(new Token())]\nclass Target\n{\n}\n\n$attribute = (new ReflectionClass(Target::class))->getAttributes(Wrap::class)[0];\n$first = $attribute->getArguments()[0];\n$second = $attribute->getArguments()[0];\n\necho json_encode([Token::$created, $first === $second]);\n"
        }
      ]
    },
    "stem": "Both consumers must receive the same Token object, and the argument expression must be evaluated once. Replace the two assignment statements. Which repair yields [1,true]?",
    "options": [
      {
        "id": "twice",
        "text": "$first = $attribute->getArguments()[0];\n$second = $attribute->getArguments()[0];",
        "rationale": "Each getArguments call evaluates the new expression again, creating two Token objects.",
        "misconception": "Assuming reflected argument objects are automatically memoized."
      },
      {
        "id": "cache-value",
        "text": "$arguments = $attribute->getArguments();\n$first = $arguments[0];\n$second = $arguments[0];",
        "rationale": "One evaluation creates one Token, and both consumers receive its same object identifier.",
        "misconception": null
      },
      {
        "id": "clone",
        "text": "$first = $attribute->getArguments()[0];\n$second = clone $first;",
        "rationale": "Only one constructor runs, but clone creates a second object identity, violating the sharing requirement.",
        "misconception": "Equating constructor count with object identity."
      },
      {
        "id": "instantiate-twice",
        "text": "$first = $attribute->newInstance()->token;\n$second = $attribute->newInstance()->token;",
        "rationale": "Each attribute instantiation evaluates its arguments and constructs another Token.",
        "misconception": "Assuming newInstance reuses previously evaluated argument objects."
      }
    ],
    "correctOptionId": "cache-value",
    "explanation": {
      "summary": "Object expressions in attribute arguments are evaluated when Reflection retrieves or instantiates them; repeated retrieval can create fresh objects. Cache the evaluated argument array when identity must be shared.",
      "trace": "One getArguments call increments created to 1. Assigning its object element to both variables preserves identity without cloning."
    },
    "validation": {
      "kind": "patch",
      "marker": "$first = $attribute->getArguments()[0];\n$second = $attribute->getArguments()[0];",
      "stdout": "[1,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/reflectionattribute.getarguments.php",
      "https://www.php.net/manual/en/language.attributes.syntax.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0142",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Enums, attributes & reflection",
    "subtopic": "durable-enum-case-identity-key",
    "objective": {
      "id": "durable-enum-case-identity-key",
      "text": "Repair enum cache keys that collide across enum types or change with backing-value revisions."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate enum type/case identity from wire values and process-local object identity."
    },
    "prerequisites": [
      "Backed enums",
      "Durable cache identifiers",
      "Object identity"
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
        "Keys persist across PHP processes and application releases. Enum class names and case names remain stable, but backing values may change under a separate data-format migration. Different enum types can use the same case name and backing value."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nenum OrderState: string\n{\n    case Open = 'open';\n}\n\nenum TicketState: string\n{\n    case Open = 'open';\n}\n\nfunction cacheKey(BackedEnum $state): string\n{\n    return $state->value;\n}\n\necho json_encode([cacheKey(OrderState::Open), cacheKey(TicketState::Open)]);\n"
        }
      ]
    },
    "stem": "The displayed cacheKey collides for two distinct states. Which replacement remains distinct by enum type and case under the stated persistence contract?",
    "options": [
      {
        "id": "case-name",
        "text": "$state->name",
        "rationale": "Both types have a case named Open, so this still collides.",
        "misconception": "Treating case names as globally unique."
      },
      {
        "id": "class-value",
        "text": "$state::class . '::' . $state->value",
        "rationale": "Type collisions are avoided, but changing a backing value changes the key despite the stable case identity.",
        "misconception": "Using a versioned wire value as a durable case identifier."
      },
      {
        "id": "object-id",
        "text": "(string) spl_object_id($state)",
        "rationale": "Object IDs identify live objects within one process and are not durable across processes.",
        "misconception": "Treating enum singleton identity as a globally persistent object number."
      },
      {
        "id": "class-case",
        "text": "$state::class . '::' . $state->name",
        "rationale": "The type and case name distinguish both states and use the two components declared stable.",
        "misconception": null
      }
    ],
    "correctOptionId": "class-case",
    "explanation": {
      "summary": "A durable enum identity should use the enum type and case identifier under this contract. Backing values represent a separately versioned external value, and object IDs are process-local.",
      "trace": "The current output contains open twice. Class/case keys become OrderState::Open and TicketState::Open and remain unchanged when only their backing values change."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"open\",\"open\"]",
      "keyEvidence": "The declared stable class and case names distinguish all permitted enum identities; the current witness shows the value collision.",
      "counterexamples": {
        "case-name": "Both cases are named Open",
        "class-value": "A permitted backing-value change changes this key",
        "object-id": "Object IDs are only unique for live objects within a process"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/language.enumerations.basics.php",
      "https://www.php.net/manual/en/language.enumerations.serialization.php",
      "https://www.php.net/manual/en/function.spl-object-id.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0143",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Transactions, migrations & ORM",
    "subtopic": "savepoint-rollback-preserve-outer-transaction",
    "objective": {
      "id": "savepoint-rollback-preserve-outer-transaction",
      "text": "Undo failed inner work while retaining the surrounding transaction and its successful writes."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Distinguish rollback-to-savepoint, savepoint release and full transaction rollback."
    },
    "prerequisites": [
      "PDO transactions",
      "SQLite savepoints (advanced)",
      "Nested failure boundaries"
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
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec('CREATE TABLE events (id INTEGER)');\n$pdo->beginTransaction();\n$pdo->exec('INSERT INTO events VALUES (1)');\n$pdo->exec('SAVEPOINT inner');\n\ntry {\n    $pdo->exec('INSERT INTO events VALUES (2)');\n    throw new RuntimeException('inner failed');\n} catch (RuntimeException $error) {\n    $pdo->exec('RELEASE SAVEPOINT inner');\n}\n\ntry {\n    $pdo->exec('INSERT INTO events VALUES (3)');\n    $pdo->commit();\n    echo json_encode($pdo->query('SELECT id FROM events ORDER BY id')->fetchAll(PDO::FETCH_COLUMN));\n} catch (PDOException $error) {\n    echo 'transaction lost';\n}\n"
        }
      ]
    },
    "stem": "The row inserted inside inner must be undone, while the outer rows 1 and 3 must commit together. Which replacement for RELEASE SAVEPOINT inner repairs the catch block?",
    "options": [
      {
        "id": "rollback-inner",
        "text": "$pdo->exec('ROLLBACK TO SAVEPOINT inner');\n$pdo->exec('RELEASE SAVEPOINT inner');",
        "rationale": "Rollback-to undoes inner writes while keeping the outer transaction active; release removes the savepoint.",
        "misconception": null
      },
      {
        "id": "release-only",
        "text": "$pdo->exec('RELEASE SAVEPOINT inner');",
        "rationale": "Releasing a savepoint retains its changes, so row 2 remains.",
        "misconception": "Treating release as rollback of the saved scope."
      },
      {
        "id": "rollback-all",
        "text": "$pdo->rollBack();",
        "rationale": "Full rollback discards row 1 and ends the transaction, so the later commit is no longer valid.",
        "misconception": "Using the outer transaction boundary to undo only inner work."
      },
      {
        "id": "rollback-then-all",
        "text": "$pdo->exec('ROLLBACK TO SAVEPOINT inner');\n$pdo->rollBack();",
        "rationale": "The second operation still discards the outer work and ends the transaction.",
        "misconception": "Assuming an outer rollback becomes limited after rolling back to a savepoint."
      }
    ],
    "correctOptionId": "rollback-inner",
    "explanation": {
      "summary": "Rollback-to-savepoint rewinds changes after that savepoint without ending the enclosing transaction. Releasing the savepoint then removes its marker; only the outer commit makes the remaining work durable.",
      "trace": "Row 2 is undone. Rows 1 and 3 remain within the same transaction and commit together."
    },
    "validation": {
      "kind": "patch",
      "marker": "$pdo->exec('RELEASE SAVEPOINT inner');",
      "stdout": "[1,3]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-16"
    },
    "references": [
      "https://www.sqlite.org/lang_savepoint.html",
      "https://www.php.net/manual/en/pdo.rollback.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0144",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Performance, processes & servers",
    "subtopic": "fiber-interleaving-output-buffer-stack",
    "objective": {
      "id": "fiber-interleaving-output-buffer-stack",
      "text": "Repair cross-contamination caused by output buffers shared across interleaved Fibers."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Trace a process-wide buffer stack across suspension and resume in a different order."
    },
    "prerequisites": [
      "Fibers (advanced)",
      "Output buffer stack",
      "Per-operation output ownership"
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
        "The starts and resumes must remain in the shown interleaved order. Each job must independently collect its own two output fragments."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction job(string $label): Fiber\n{\n    return new Fiber(function () use ($label): string {\n        ob_start();\n        echo $label . '1';\n        Fiber::suspend();\n        echo $label . '2';\n\n        return ob_get_clean();\n    });\n}\n\n$first = job('A');\n$second = job('B');\n$first->start();\n$second->start();\n$first->resume();\n$second->resume();\n\necho json_encode([$first->getReturn(), $second->getReturn()]);\n"
        }
      ]
    },
    "stem": "The buffers collect fragments from the wrong job. Which repair isolates each job’s output without changing the required schedule?",
    "options": [
      {
        "id": "buffer-level",
        "text": "Record ob_get_level at each start and assume later echo writes to that recorded level.",
        "rationale": "echo writes to the current top buffer; storing a level does not route output back to it.",
        "misconception": "Treating an output-buffer level as a selectable destination handle."
      },
      {
        "id": "unique-callback",
        "text": "Give each ob_start a different callback and keep the same echo calls.",
        "rationale": "Callbacks do not make the global buffer stack Fiber-local; fragments still enter the current top buffer.",
        "misconception": "Assuming a distinct output handler creates a distinct coroutine output context."
      },
      {
        "id": "local-writer",
        "text": "Replace echo and output buffering with a writer that appends to a string owned by that job’s closure.",
        "rationale": "Each closure retains its own destination across suspension, avoiding the shared output-buffer stack.",
        "misconception": null
      },
      {
        "id": "flush-return",
        "text": "Replace ob_get_clean with ob_get_flush while keeping the other operations.",
        "rationale": "Flushing also forwards mixed content to the next buffer and does not restore job ownership.",
        "misconception": "Using a different buffer-closing operation to solve cross-job routing."
      }
    ],
    "correctOptionId": "local-writer",
    "explanation": {
      "summary": "PHP output buffers form a shared stack. Interleaving Fibers can leave one job’s buffer on top while another job echoes or closes it. An explicit per-job writer avoids that shared routing state.",
      "trace": "B starts the top buffer after A suspends. A then writes A2 into B’s buffer and closes it, receiving B1A2. B later receives A1B2 from the remaining buffer."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"B1A2\",\"A1B2\"]",
      "keyEvidence": "The witnessed mixed returns follow the shared stack; an explicit closure-local destination has no shared stack edge.",
      "counterexamples": {
        "buffer-level": "A stored integer does not alter echo routing",
        "unique-callback": "Different callbacks still belong to one active buffer stack",
        "flush-return": "Flush forwards already mixed content rather than separating it"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://www.php.net/manual/en/book.outcontrol.php",
      "https://www.php.net/manual/en/language.fibers.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0145",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "final-trait-alias-with-overridable-original",
    "objective": {
      "id": "final-trait-alias-with-overridable-original",
      "text": "Seal a public trait alias while leaving the original method overridable in subclasses."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine trait aliasing, final adaptation and inheritance compatibility."
    },
    "prerequisites": [
      "Trait adaptation",
      "PHP 8.3+ final trait aliases (advanced)",
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
          "source": "<?php\n\ntrait Work\n{\n    public function run(): string\n    {\n        return 'trait';\n    }\n}\n\nclass BaseWorker\n{\n    use Work {\n        run as final;\n    }\n}\n\nclass ChildWorker extends BaseWorker\n{\n    public function run(): string\n    {\n        return 'child';\n    }\n}\n\n$worker = new ChildWorker();\n\necho json_encode([\n    $worker->run(),\n    $worker->sealed(),\n    (new ReflectionMethod(BaseWorker::class, 'sealed'))->isFinal(),\n]);\n"
        }
      ]
    },
    "stem": "sealed must be a public final alias of the trait implementation, while ChildWorker must still override run. The current adaptation makes the declaration fail. Which replacement satisfies all three requirements?",
    "options": [
      {
        "id": "nonfinal",
        "text": "run as final; run as sealed;",
        "rationale": "The first adaptation seals run itself, so ChildWorker cannot override it even though sealed is also created.",
        "misconception": "Sealing the original method while intending to seal only its alias."
      },
      {
        "id": "final-alias",
        "text": "run as final sealed;",
        "rationale": "The separate alias is final and retains public visibility; the original run remains overridable.",
        "misconception": null
      },
      {
        "id": "original-final",
        "text": "run as sealed; sealed as final;",
        "rationale": "Trait adaptations resolve methods from the trait; the newly introduced alias is not another trait method to adapt.",
        "misconception": "Treating alias adaptations as sequential statements that can adapt an earlier alias."
      },
      {
        "id": "protected-alias",
        "text": "run as sealed final;",
        "rationale": "The final modifier must precede the alias name; this adaptation is a syntax error.",
        "misconception": "Placing the final modifier after the new alias name."
      }
    ],
    "correctOptionId": "final-alias",
    "explanation": {
      "summary": "Trait adaptation can create a new final alias without changing the original method’s finality. Omitting a new visibility modifier preserves the trait method’s public visibility.",
      "trace": "ChildWorker::run returns child. sealed retains the trait implementation and returns trait, while Reflection confirms the alias is final."
    },
    "validation": {
      "kind": "patch",
      "marker": "run as final;",
      "stdout": "[\"child\",\"trait\",true]",
      "errors": {
        "nonfinal": "Cannot override final method",
        "original-final": "does not exist",
        "protected-alias": "syntax error"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.traits.php#language.oop5.traits.final-methods"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0146",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Variables, scope & constants",
    "subtopic": "function-name-case-versus-variable-case",
    "objective": {
      "id": "function-name-case-versus-variable-case",
      "text": "Review case changes without confusing function-name lookup with variable-name identity."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply PHP’s distinct case rules to a function call and two variables."
    },
    "prerequisites": [
      "Function calls",
      "Variable names",
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
          "source": "<?php\n\nfunction label(): string\n{\n    return 'function';\n}\n\n$value = 'lower';\n$Value = 'upper';\n\necho LABEL(), '|', $value, '|', $Value;\n"
        }
      ]
    },
    "stem": "A reviewer claims the uppercase function call fails and the two variable spellings refer to the same variable. Which assessment is correct?",
    "options": [
      {
        "id": "both-sensitive",
        "text": "The function call fails; the two variables are distinct.",
        "rationale": "User-defined function names are case-insensitive for this lookup.",
        "misconception": "Applying variable-name case rules to function calls."
      },
      {
        "id": "both-insensitive",
        "text": "The function call succeeds; both variable reads return upper.",
        "rationale": "Variable names are case-sensitive, so assigning Value does not overwrite value.",
        "misconception": "Applying function-name case tolerance to variables."
      },
      {
        "id": "different-rules",
        "text": "The function call succeeds; the variables retain lower and upper separately.",
        "rationale": "The function lookup is case-insensitive, while variable names are distinct by case.",
        "misconception": null
      },
      {
        "id": "reverse-rules",
        "text": "The function call fails; both variable reads return upper.",
        "rationale": "This reverses both applicable rules.",
        "misconception": "Assuming function names are stricter than variable names in the wrong direction."
      }
    ],
    "correctOptionId": "different-rules",
    "explanation": {
      "summary": "PHP function-name lookup is case-insensitive here, but variable names are case-sensitive. These are separate language rules.",
      "trace": "LABEL resolves to label. value remains lower and Value remains upper, producing function|lower|upper."
    },
    "validation": {
      "kind": "contract",
      "stdout": "function|lower|upper",
      "keyEvidence": "The successful call and both variable values are directly observed.",
      "counterexamples": {
        "both-sensitive": "The function call succeeds",
        "both-insensitive": "The lowercase variable remains lower",
        "reverse-rules": "Both claims conflict with the observed output"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-02"
    },
    "references": [
      "https://www.php.net/manual/en/functions.user-defined.php",
      "https://www.php.net/manual/en/language.variables.basics.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0147",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Syntax & execution model",
    "subtopic": "included-text-outside-php-emits-output",
    "objective": {
      "id": "included-text-outside-php-emits-output",
      "text": "Review unintended output from literal text after a PHP closing tag in an included helper file."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish declaring an unused function from evaluating the file’s non-PHP text."
    },
    "prerequisites": [
      "PHP opening and closing tags",
      "include output",
      "Function declarations"
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
          "path": "helper.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction message(): string\n{\n    return 'hello';\n}\n?>\nEXTRA\n"
        },
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nrequire __DIR__ . '/helper.php';\n\necho 'body';\n"
        }
      ]
    },
    "stem": "helper.php is intended to provide a function without sending output. Which review finding explains the extra text before body even though message is never called?",
    "options": [
      {
        "id": "outside-php",
        "text": "EXTRA is outside PHP mode and is emitted when the helper is included.",
        "rationale": "Literal text after the closing tag is sent as output during file evaluation.",
        "misconception": null
      },
      {
        "id": "function-return",
        "text": "Including the file automatically echoes message’s return value.",
        "rationale": "The function is only declared and never invoked; its return value does not produce EXTRA.",
        "misconception": "Treating function declaration as invocation."
      },
      {
        "id": "require-value",
        "text": "require echoes the file’s return value before evaluating the main file.",
        "rationale": "require does not automatically echo a return value; the literal text itself is output.",
        "misconception": "Confusing include return values with emitted text."
      },
      {
        "id": "ignored-text",
        "text": "The closing ?> delimiter itself is emitted before EXTRA and body.",
        "rationale": "The delimiter exits PHP mode but is not output; only the following literal text is emitted.",
        "misconception": "Treating the PHP closing delimiter as literal response text."
      }
    ],
    "correctOptionId": "outside-php",
    "explanation": {
      "summary": "Including a file evaluates its PHP segments and emits its literal non-PHP segments. A PHP-only helper should avoid unintended content outside PHP mode; omitting its closing tag prevents trailing source text from becoming output.",
      "trace": "The include emits EXTRA followed by the file’s final newline. The main file then emits body."
    },
    "validation": {
      "kind": "contract",
      "stdout": "EXTRA\nbody",
      "keyEvidence": "The output contains the literal suffix despite no function invocation.",
      "counterexamples": {
        "function-return": "message is never called and would return hello, not EXTRA",
        "require-value": "No echo of a require return value exists",
        "ignored-text": "The observed output starts with EXTRA, not the closing delimiter."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-01"
    },
    "references": [
      "https://www.php.net/manual/en/language.basic-syntax.phptags.php",
      "https://www.php.net/manual/en/function.include.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0148",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Closures, callbacks & callables",
    "subtopic": "arrow-counter-update-loses-reference-capture",
    "objective": {
      "id": "arrow-counter-update-loses-reference-capture",
      "text": "Review an arrow-function replacement for a closure that was intended to update an outer counter."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish a captured value’s local increment from mutation of the outer variable."
    },
    "prerequisites": [
      "Arrow functions",
      "Closure capture",
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
          "source": "<?php\n\n$count = 0;\n$tick = fn (): int => ++$count;\n$returned = $tick();\n\necho json_encode([$returned, $count]);\n"
        }
      ]
    },
    "stem": "The required callback increments the outer count. A refactor replaces a closure using use (&$count) with the displayed arrow function. Which assessment matches the replacement?",
    "options": [
      {
        "id": "shared-update",
        "text": "It returns 1 and leaves outer count at 1, preserving the reference update.",
        "rationale": "Arrow functions capture this scalar by value, not by reference.",
        "misconception": "Assuming automatic capture retains the old closure’s explicit reference semantics."
      },
      {
        "id": "no-increment",
        "text": "It returns 0 and leaves outer count at 0 because captured values cannot change.",
        "rationale": "The captured local value can be incremented; that does not mutate the outer variable.",
        "misconception": "Confusing value capture with an immutable local variable."
      },
      {
        "id": "outer-only",
        "text": "It returns 0 but changes outer count to 1 because increment is a side effect.",
        "rationale": "Preincrement returns the incremented local value and does not reach outer storage here.",
        "misconception": "Separating the expression result from the wrong storage location."
      },
      {
        "id": "local-update",
        "text": "It returns 1 but leaves outer count at 0, breaking the required shared-counter update.",
        "rationale": "The arrow increments its captured scalar value while the outer variable remains unchanged.",
        "misconception": null
      }
    ],
    "correctOptionId": "local-update",
    "explanation": {
      "summary": "Arrow functions capture used outer variables by value. Replacing an explicit reference capture therefore changes mutation behavior, even when the expression looks the same.",
      "trace": "The captured zero becomes one inside the invocation and is returned. The outer count remains zero."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[1,0]",
      "keyEvidence": "Both the returned value and outer state are observed independently.",
      "counterexamples": {
        "shared-update": "Outer count remains zero",
        "no-increment": "Returned value is one",
        "outer-only": "Both result and mutated-storage claims are reversed"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/functions.arrow.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0149",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "HTTP & superglobals",
    "subtopic": "path-segment-encoding-versus-form-space",
    "objective": {
      "id": "path-segment-encoding-versus-form-space",
      "text": "Review encoding of a single URL path segment without applying form-style plus decoding."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose the encoding whose space representation matches the stated path contract."
    },
    "prerequisites": [
      "URL path segments",
      "urlencode and rawurlencode"
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
        "The router percent-decodes this path segment once and treats a literal plus sign as plus, not as a space. The name is one segment, not an entire path."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$name = 'Ada Lovelace';\n\n$url = '/people/' . urlencode($name);\n\necho $url;\n"
        }
      ]
    },
    "stem": "The URL must identify the name Ada Lovelace under this router contract. Which replacement for urlencode($name) repairs the path segment?",
    "options": [
      {
        "id": "html",
        "text": "htmlspecialchars($name, ENT_QUOTES, \"UTF-8\")",
        "rationale": "HTML escaping leaves the space unchanged and is not URL-component encoding.",
        "misconception": "Applying HTML output encoding to URL path bytes."
      },
      {
        "id": "path",
        "text": "rawurlencode($name)",
        "rationale": "RFC 3986-style encoding represents the space as %20, which the router decodes to a space.",
        "misconception": null
      },
      {
        "id": "decode",
        "text": "rawurldecode($name)",
        "rationale": "The input is an unencoded name; decoding does not encode its space for a URL.",
        "misconception": "Using the inverse operation at the output boundary."
      },
      {
        "id": "form",
        "text": "urlencode($name)",
        "rationale": "This uses plus for a space, but the stated router preserves that plus literally.",
        "misconception": "Applying form/query-style space encoding to a path segment."
      }
    ],
    "correctOptionId": "path",
    "explanation": {
      "summary": "The encoding must match the component’s decoding rules. rawurlencode uses %20 for spaces, while urlencode uses the form-style plus representation.",
      "trace": "The repaired URL is /people/Ada%20Lovelace and its decoded segment is the intended name."
    },
    "validation": {
      "kind": "patch",
      "marker": "urlencode($name)",
      "stdout": "/people/Ada%20Lovelace",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/function.rawurlencode.php",
      "https://www.php.net/manual/en/function.urlencode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0150",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Validation & web security",
    "subtopic": "htmlspecialchars-text-context-and-nonascii",
    "objective": {
      "id": "htmlspecialchars-text-context-and-nonascii",
      "text": "Review HTML text escaping without confusing it with tag removal or all-character entity conversion."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Identify the changed syntax characters and unchanged valid UTF-8 text."
    },
    "prerequisites": [
      "HTML text context",
      "htmlspecialchars",
      "UTF-8"
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
          "source": "<?php\n\n$input = '<b>café & tea</b>';\n\necho htmlspecialchars($input, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');\n"
        }
      ]
    },
    "stem": "The result will be inserted into an HTML text node. Which statement accurately describes what this PHP call produces?",
    "options": [
      {
        "id": "strip-tags",
        "text": "The b tags are removed, leaving only café & tea as plain text.",
        "rationale": "htmlspecialchars escapes tag syntax; it does not remove the tags as strip_tags would.",
        "misconception": "Confusing escaping with tag stripping."
      },
      {
        "id": "active-tags",
        "text": "The b tags remain active markup because ENT_QUOTES only escapes quote characters.",
        "rationale": "ENT_QUOTES adds quote handling; angle brackets and ampersands are still escaped.",
        "misconception": "Treating a quote flag as disabling the function’s other required escapes."
      },
      {
        "id": "text-escaped",
        "text": "The tag syntax and ampersand are escaped; é remains valid UTF-8 text.",
        "rationale": "The output contains &lt; and &amp; sequences while leaving the valid non-ASCII character unchanged.",
        "misconception": null
      },
      {
        "id": "all-entities",
        "text": "The tag syntax is escaped and é is necessarily converted to &eacute;.",
        "rationale": "htmlspecialchars does not convert every character that has a named HTML entity.",
        "misconception": "Applying htmlentities-style broad conversion to htmlspecialchars."
      }
    ],
    "correctOptionId": "text-escaped",
    "explanation": {
      "summary": "htmlspecialchars escapes characters significant to HTML syntax, including angle brackets and ampersands. Valid UTF-8 characters such as é remain ordinary text.",
      "trace": "The emitted bytes are &lt;b&gt;café &amp; tea&lt;/b&gt;. In an HTML text node, the browser displays the tag characters literally instead of creating a b element."
    },
    "validation": {
      "kind": "contract",
      "stdout": "&lt;b&gt;café &amp; tea&lt;/b&gt;",
      "keyEvidence": "The exact escaped output preserves the UTF-8 accent and escapes markup delimiters.",
      "counterexamples": {
        "strip-tags": "The tag characters survive as entities",
        "active-tags": "Angle brackets are escaped",
        "all-entities": "The accented character remains UTF-8 rather than a named entity"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.htmlspecialchars.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0151",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Cookies & sessions",
    "subtopic": "httponly-cookie-does-not-prevent-script-requests",
    "objective": {
      "id": "httponly-cookie-does-not-prevent-script-requests",
      "text": "Review the protection boundary of HttpOnly without treating it as complete XSS or CSRF protection."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate script access to cookie bytes from browser attachment of cookies to requests."
    },
    "prerequisites": [
      "HttpOnly",
      "Secure",
      "SameSite",
      "Browser request behavior"
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
        "The PHP response sets an authentication cookie with HttpOnly=true, Secure=true and SameSite=None over HTTPS. The browser accepts and sends this cookie under its configured policy. The attacker’s script is executing in the application’s own origin."
      ],
      "files": []
    },
    "stem": "A review claims HttpOnly prevents the injected script from making authenticated requests. Which assessment is correct?",
    "options": [
      {
        "id": "blocks-fetch",
        "text": "HttpOnly blocks both document.cookie reads and all fetch requests that would use the cookie.",
        "rationale": "HttpOnly restricts script access to cookie bytes, not browser attachment of the cookie to requests.",
        "misconception": "Treating a cookie-read restriction as a network-request prohibition."
      },
      {
        "id": "same-origin-protection",
        "text": "SameSite=None blocks the injected same-origin script from using the cookie.",
        "rationale": "None does not impose that same-site restriction, and the script is already same-origin.",
        "misconception": "Using SameSite as an isolation boundary for code already executing in the origin."
      },
      {
        "id": "limited-boundary",
        "text": "HttpOnly prevents direct script reads of the cookie, but the browser can still attach it to authenticated requests.",
        "rationale": "The script need not read the cookie value to cause the browser to send it.",
        "misconception": null
      },
      {
        "id": "secure-encryption",
        "text": "Secure encrypts the cookie value against the application’s scripts, so injected requests become anonymous.",
        "rationale": "Secure limits transport to secure connections; it does not make same-origin requests anonymous.",
        "misconception": "Confusing secure transport with script isolation or request deauthentication."
      }
    ],
    "correctOptionId": "limited-boundary",
    "explanation": {
      "summary": "HttpOnly reduces direct cookie theft through script APIs. It does not stop an injected same-origin script from performing actions through requests that the browser authenticates with the cookie.",
      "trace": "The browser owns cookie attachment. An injected script can initiate a same-origin request without ever obtaining the cookie bytes."
    },
    "validation": {
      "kind": "document-review",
      "rule": "HttpOnly excludes cookie exposure to non-HTTP APIs but does not disable HTTP request cookie attachment; Secure controls transport.",
      "optionAudit": {
        "blocks-fetch": "Overstates HttpOnly as a request prohibition",
        "same-origin-protection": "Misstates SameSite=None and same-origin execution",
        "limited-boundary": "Separates script reads from browser request attachment",
        "secure-encryption": "Secure does not implement this claimed script isolation"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-13"
    },
    "references": [
      "https://www.php.net/manual/en/function.setcookie.php",
      "https://www.rfc-editor.org/rfc/rfc6265.html#section-4.1.2.6"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0152",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Errors & exceptions",
    "subtopic": "included-parse-error-catch-boundary",
    "objective": {
      "id": "included-parse-error-catch-boundary",
      "text": "Review catchability of a parse error in a file required after the main script has begun executing."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish parsing the main compilation unit from parsing a later included file."
    },
    "prerequisites": [
      "ParseError",
      "require",
      "Throwable hierarchy"
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
          "path": "broken.php",
          "kind": "complete-file",
          "source": "<?php\n\n$value = ;\n"
        },
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\ntry {\n    require __DIR__ . '/broken.php';\n    echo 'loaded';\n} catch (ParseError $error) {\n    echo 'caught';\n}\n\necho '|after';\n"
        }
      ]
    },
    "stem": "broken.php intentionally contains the shown syntax error. Which review statement describes the main file’s behavior on PHP 8.4/8.5?",
    "options": [
      {
        "id": "catchable-include",
        "text": "The require raises ParseError, the catch runs, and execution continues to the final echo.",
        "rationale": "The main file is already executing when PHP parses the required file, so the ParseError crosses this catch boundary.",
        "misconception": null
      },
      {
        "id": "preparse-all",
        "text": "The main file never starts because PHP parses every future require target before execution.",
        "rationale": "Ordinary require targets are evaluated and compiled when the statement executes.",
        "misconception": "Treating require as unconditional precompilation of every dependency."
      },
      {
        "id": "false-return",
        "text": "The require returns false for the syntax error and loaded is printed.",
        "rationale": "A parse error in the required file throws ParseError rather than becoming an ordinary false return.",
        "misconception": "Applying a missing-file-style return model to syntax failure."
      },
      {
        "id": "catch-then-stop",
        "text": "The catch prints caught, but a caught ParseError always terminates the process before after.",
        "rationale": "Once caught, this ParseError does not force termination of the enclosing valid script.",
        "misconception": "Treating a handled Error subtype as unconditionally fatal."
      }
    ],
    "correctOptionId": "catchable-include",
    "explanation": {
      "summary": "A parse error in the main file prevents it from starting. A parse error encountered while executing require is different: the already-running caller can catch the resulting ParseError.",
      "trace": "The invalid required file never reaches a statement. The caller prints caught, leaves the catch normally and prints |after."
    },
    "validation": {
      "kind": "contract",
      "stdout": "caught|after",
      "lintErrors": {
        "broken.php": "syntax error"
      },
      "keyEvidence": "The bad source has an expected lint failure, while executing the valid main file catches it and continues.",
      "counterexamples": {
        "preparse-all": "The caller does execute its catch",
        "false-return": "loaded is absent",
        "catch-then-stop": "The after marker is printed"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/class.parseerror.php",
      "https://www.php.net/manual/en/language.exceptions.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0153",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Errors & exceptions",
    "subtopic": "returned-object-mutated-by-finally",
    "objective": {
      "id": "returned-object-mutated-by-finally",
      "text": "Review whether a returned object reflects a mutation made in finally before the caller receives it."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine return-expression evaluation, object identity and finally execution order."
    },
    "prerequisites": [
      "try/finally",
      "Object identity",
      "Return evaluation"
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
          "source": "<?php\n\nfunction build(): object\n{\n    $result = (object) ['ready' => false];\n\n    try {\n        return $result;\n    } finally {\n        $result->ready = true;\n    }\n}\n\necho json_encode(build());\n"
        }
      ]
    },
    "stem": "A review claims that returning result from try freezes its properties before finally executes. Which assessment matches the returned object?",
    "options": [
      {
        "id": "snapshot",
        "text": "The caller receives ready=false because evaluating return snapshots all object properties.",
        "rationale": "Return captures the object identifier, not a deep copy of its properties.",
        "misconception": "Applying scalar snapshot intuition to a returned mutable object."
      },
      {
        "id": "after-caller",
        "text": "The caller first receives ready=false, and finally mutates it only after the caller finishes.",
        "rationale": "finally executes before control returns to the caller.",
        "misconception": "Placing cleanup after completion of the caller’s expression."
      },
      {
        "id": "return-cancelled",
        "text": "The property assignment in finally cancels the return and makes build return null.",
        "rationale": "An ordinary assignment in finally does not replace the pending return value.",
        "misconception": "Confusing any finally statement with a return or throw from finally."
      },
      {
        "id": "same-object",
        "text": "The caller receives ready=true because finally mutates the same object before the return completes.",
        "rationale": "The pending return still refers to result, and finally changes that object before the caller observes it.",
        "misconception": null
      }
    ],
    "correctOptionId": "same-object",
    "explanation": {
      "summary": "PHP evaluates the return expression, executes finally, then completes the return unless finally changes control flow. A returned object identifier continues to refer to the same mutable object.",
      "trace": "The pending result points to the object with ready=false. finally changes that object to ready=true, so JSON encodes true."
    },
    "validation": {
      "kind": "contract",
      "stdout": "{\"ready\":true}",
      "keyEvidence": "The returned object exposes the mutation performed before return completion.",
      "counterexamples": {
        "snapshot": "No object clone occurs",
        "after-caller": "finally runs before the caller receives the result",
        "return-cancelled": "The assignment does not alter return control flow"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/language.exceptions.php#language.exceptions.finally",
      "https://www.php.net/manual/en/language.oop5.references.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0154",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "static-return-factory-construction-mismatch",
    "objective": {
      "id": "static-return-factory-construction-mismatch",
      "text": "Preserve a late-bound factory return contract by constructing the called class."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Relate a static return type to lexical versus late-bound object construction."
    },
    "prerequisites": [
      "static return type",
      "Inherited factories",
      "Object construction"
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
          "source": "<?php\n\nclass Product\n{\n    public static function make(): static\n    {\n        return new self();\n    }\n}\n\nclass SpecialProduct extends Product\n{\n}\n\ntry {\n    echo json_encode([get_class(Product::make()), get_class(SpecialProduct::make())]);\n} catch (TypeError $error) {\n    echo 'TypeError';\n}\n"
        }
      ]
    },
    "stem": "make must construct exactly the class through which it is called, for current and future subclasses. Which replacement for new self() preserves that factory contract?",
    "options": [
      {
        "id": "base-explicit",
        "text": "new Product()",
        "rationale": "This always constructs Product, so SpecialProduct::make still violates its static return contract.",
        "misconception": "Treating the base class as sufficient for a called-class return type."
      },
      {
        "id": "late-construction",
        "text": "new static()",
        "rationale": "The construction uses the called class, matching the static return promise.",
        "misconception": null
      },
      {
        "id": "always-child",
        "text": "new SpecialProduct()",
        "rationale": "The Product call would produce SpecialProduct instead of the required exact called class in this factory contract.",
        "misconception": "Hardcoding one known child instead of preserving the general factory behavior."
      },
      {
        "id": "clone-base",
        "text": "clone (new Product())",
        "rationale": "Cloning a Product retains its class; it does not turn it into the late-bound subclass.",
        "misconception": "Using clone as a class conversion operation."
      }
    ],
    "correctOptionId": "late-construction",
    "explanation": {
      "summary": "A static return type requires a value compatible with the called class; this factory additionally promises the exact called class. new self uses the declaring class, while new static satisfies the stronger construction promise.",
      "trace": "Product::make creates Product, and SpecialProduct::make creates SpecialProduct."
    },
    "validation": {
      "kind": "patch",
      "marker": "new self()",
      "stdout": "[\"Product\",\"SpecialProduct\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.declarations.php",
      "https://www.php.net/manual/en/language.oop5.late-static-bindings.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0155",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Functions & arguments",
    "subtopic": "required-after-optional-named-api-repair",
    "objective": {
      "id": "required-after-optional-named-api-repair",
      "text": "Repair a required-after-optional declaration while preserving a named-call API with one required argument."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine default-argument rules, named binding and reflection of required arity."
    },
    "prerequisites": [
      "Default parameters",
      "Named arguments",
      "Required parameter counts"
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
          "source": "<?php\n\nfunction render(string $prefix = 'x', string $value): string\n{\n    return $prefix . $value;\n}\n\ntry {\n    echo json_encode([\n        render(value: 'A'),\n        (new ReflectionFunction('render'))->getNumberOfRequiredParameters(),\n    ]);\n} catch (ArgumentCountError $error) {\n    echo 'missing argument';\n}\n"
        }
      ]
    },
    "stem": "value must remain required and prefix optional with default x. All supported callers use parameter names. Which signature removes the declaration problem and preserves that contract?",
    "options": [
      {
        "id": "both-required",
        "text": "function render(string $prefix, string $value): string",
        "rationale": "This makes prefix required as well, so the shown named caller fails.",
        "misconception": "Removing the default without preserving optionality."
      },
      {
        "id": "both-optional",
        "text": "function render(string $prefix = 'x', string $value = ''): string",
        "rationale": "This also makes value optional, violating the one-required-argument contract.",
        "misconception": "Silencing the declaration issue by weakening the required input."
      },
      {
        "id": "required-first",
        "text": "function render(string $value, string $prefix = 'x'): string",
        "rationale": "The required parameter comes first; named callers still bind value by name and obtain the default prefix.",
        "misconception": null
      },
      {
        "id": "reordered-required",
        "text": "function render(string $value, string $prefix): string",
        "rationale": "Reordering alone does not preserve prefix’s default or optionality.",
        "misconception": "Treating parameter order as the only part of the public call contract."
      }
    ],
    "correctOptionId": "required-first",
    "explanation": {
      "summary": "A required parameter after an optional one prevents the earlier parameter from being meaningfully optional and produces a diagnostic here. With named-only callers, moving the required value first preserves names and the intended default.",
      "trace": "The corrected call returns xA and Reflection reports exactly one required parameter."
    },
    "validation": {
      "kind": "patch",
      "marker": "function render(string $prefix = 'x', string $value): string",
      "stdout": "[\"xA\",1]",
      "original": {
        "stdout": "missing argument",
        "error": {
          "message": "Optional parameter",
          "exitCode": 0
        }
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/functions.arguments.php#functions.arguments.default",
      "https://www.php.net/manual/en/reflectionfunctionabstract.getnumberofrequiredparameters.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0156",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Validation & web security",
    "subtopic": "javascript-value-in-html-script-context",
    "objective": {
      "id": "javascript-value-in-html-script-context",
      "text": "Choose a PHP encoding that produces a complete JavaScript string literal without exposing an HTML script-closing sequence."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Satisfy JavaScript string syntax and the surrounding HTML parser while preserving the original value."
    },
    "prerequisites": [
      "Contextual output encoding",
      "JavaScript string literals",
      "HTML script parsing"
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
        "The result is inserted directly after const message = inside an HTML script element, with no additional surrounding quotes. The input is valid UTF-8 and must be recovered as the same string value."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$text = \"</script>\\nO'Reilly\";\n\necho htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');\n"
        }
      ]
    },
    "stem": "Which replacement for htmlspecialchars produces the required complete string literal safely for this text?",
    "options": [
      {
        "id": "json-literal",
        "text": "json_encode($text, JSON_HEX_TAG | JSON_THROW_ON_ERROR)",
        "rationale": "JSON supplies the complete quoted string literal and escapes the angle brackets that could terminate the HTML script element.",
        "misconception": null
      },
      {
        "id": "html-text",
        "text": "htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')",
        "rationale": "HTML escaping does not produce the required JavaScript string literal, and script raw text does not decode those entities as HTML text would.",
        "misconception": "Applying HTML text-node encoding inside JavaScript source."
      },
      {
        "id": "slashes",
        "text": "\"'\" . addslashes($text) . \"'\"",
        "rationale": "addslashes does not remove the literal HTML closing-tag sequence or encode the actual newline as a JavaScript string escape.",
        "misconception": "Treating backslash quoting as sufficient for both language and HTML parser boundaries."
      },
      {
        "id": "url-string",
        "text": "\"'\" . rawurlencode($text) . \"'\"",
        "rationale": "The JavaScript value would be percent-encoded text rather than the original string.",
        "misconception": "Using URL encoding as if JavaScript automatically decodes it."
      }
    ],
    "correctOptionId": "json-literal",
    "explanation": {
      "summary": "The output crosses two parsers. JSON encoding provides a valid quoted string expression, and JSON_HEX_TAG prevents raw angle brackets from forming an HTML closing tag around that expression.",
      "trace": "The encoded literal contains escaped angle brackets and a newline escape. Decoding the JSON string recovers the original closing-tag text, newline and apostrophe without executing it."
    },
    "validation": {
      "kind": "patch",
      "marker": "htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')",
      "stdout": "\"\\u003C\\/script\\u003E\\nO'Reilly\"",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.json-encode.php",
      "https://www.php.net/manual/en/json.constants.php",
      "https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0157",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Validation & web security",
    "subtopic": "email-validation-without-identity-rewrite",
    "objective": {
      "id": "email-validation-without-identity-rewrite",
      "text": "Reject invalid ASCII email input rather than silently rewriting it into a different accepted address."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate validation from sanitization and preserve accepted input bytes."
    },
    "prerequisites": [
      "FILTER_VALIDATE_EMAIL",
      "FILTER_SANITIZE_EMAIL",
      "Validation contracts"
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
        "The accepted syntax is exactly PHP FILTER_VALIDATE_EMAIL for these ASCII inputs. Accepted strings must be returned byte-for-byte unchanged; invalid originals must return false. Deliverability is outside this function’s scope."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction email(string $raw): string|false\n{\n    return filter_var($raw, FILTER_SANITIZE_EMAIL);\n}\n\necho json_encode([\n    email('bad()@example.com'),\n    email('UPPER@example.com'),\n]);\n"
        }
      ]
    },
    "stem": "Which replacement for the filter expression satisfies both the rejection and preservation requirements?",
    "options": [
      {
        "id": "sanitize-validate",
        "text": "filter_var(filter_var($raw, FILTER_SANITIZE_EMAIL), FILTER_VALIDATE_EMAIL)",
        "rationale": "This validates the rewritten address rather than rejecting the invalid original.",
        "misconception": "Assuming validation after mutation proves the original input was valid."
      },
      {
        "id": "lowercase",
        "text": "filter_var(strtolower($raw), FILTER_VALIDATE_EMAIL)",
        "rationale": "The valid uppercase input is changed, violating byte-for-byte preservation.",
        "misconception": "Treating normalization as permitted when the contract requires preserving the accepted value."
      },
      {
        "id": "strip-controls",
        "text": "filter_var($raw, FILTER_SANITIZE_EMAIL, FILTER_FLAG_STRIP_LOW)",
        "rationale": "This remains a sanitization operation and still rewrites the invalid address.",
        "misconception": "Expecting an additional sanitization flag to turn sanitization into validation."
      },
      {
        "id": "validate-original",
        "text": "filter_var($raw, FILTER_VALIDATE_EMAIL)",
        "rationale": "This rejects the invalid original and returns the valid original string unchanged.",
        "misconception": null
      }
    ],
    "correctOptionId": "validate-original",
    "explanation": {
      "summary": "Sanitization changes input; validation accepts or rejects it. When an address identifies an account, silently changing an invalid input can select a different identity than the user supplied.",
      "trace": "The invalid parenthesized local part returns false. The valid uppercase address is returned with its original capitalization."
    },
    "validation": {
      "kind": "patch",
      "marker": "filter_var($raw, FILTER_SANITIZE_EMAIL)",
      "stdout": "[false,\"UPPER@example.com\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/filter.filters.validate.php",
      "https://www.php.net/manual/en/filter.filters.sanitize.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0158",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Forms & file uploads",
    "subtopic": "uploaded-mime-client-claim-versus-server-inspection",
    "objective": {
      "id": "uploaded-mime-client-claim-versus-server-inspection",
      "text": "Review whether client-supplied upload metadata proves the uploaded file’s content type."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish successful upload transport and filename claims from inspection of actual bytes."
    },
    "prerequisites": [
      "$_FILES metadata",
      "Upload validation",
      "Content inspection"
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
        "An upload handler accepts a file when its $_FILES entry reports type=image/png. The client controls the original filename and declared media type. Upload transport succeeds. The content-type decision must accept actual PNG content and reject other content even when declared image/png. Full image decoding and other upload controls are outside this review."
      ],
      "files": []
    },
    "stem": "Which review change addresses the missing evidence for the content-type decision?",
    "options": [
      {
        "id": "extension-agreement",
        "text": "Also require the original filename to end in .png, then trust the reported type.",
        "rationale": "Both filename and reported type are client-controlled claims.",
        "misconception": "Treating agreement between two attacker-controlled fields as independent validation."
      },
      {
        "id": "inspect-bytes",
        "text": "Detect the content type from the temporary file bytes on the server.",
        "rationale": "This obtains evidence from the uploaded contents rather than trusting the client’s declared type.",
        "misconception": null
      },
      {
        "id": "upload-success",
        "text": "Require UPLOAD_ERR_OK, then trust the reported type.",
        "rationale": "That confirms the upload outcome, not that the bytes are PNG.",
        "misconception": "Equating successful transport with content validation."
      },
      {
        "id": "move-success",
        "text": "Require move_uploaded_file to succeed, then trust the reported type.",
        "rationale": "The move checks upload provenance and relocation, not the image format.",
        "misconception": "Treating uploaded-file origin checks as MIME inspection."
      }
    ],
    "correctOptionId": "inspect-bytes",
    "explanation": {
      "summary": "The type field in $_FILES comes from the client and cannot establish the actual content type. Successful upload and move operations answer different questions from content inspection.",
      "trace": "The server should inspect its temporary file bytes for the required content decision. Format decoding, dimensions and resource limits may be additional requirements, not guarantees supplied by the client type field."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP upload documentation identifies the type field as client-supplied and not checked by PHP; server content inspection addresses a separate validation requirement.",
      "optionAudit": {
        "extension-agreement": "Both checked values are client-controlled",
        "inspect-bytes": "Uses the required server-side byte evidence",
        "upload-success": "Checks transport outcome, not format",
        "move-success": "Checks upload provenance/move, not format"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-12"
    },
    "references": [
      "https://www.php.net/manual/en/features.file-upload.post-method.php",
      "https://www.php.net/manual/en/function.move-uploaded-file.php",
      "https://www.php.net/manual/en/book.fileinfo.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0159",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Classes & object lifecycle",
    "subtopic": "unserialize-bypasses-constructor-validation",
    "objective": {
      "id": "unserialize-bypasses-constructor-validation",
      "text": "Review whether constructor validation protects objects restored through PHP serialization."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish normal construction from property hydration and locate the missing invariant boundary."
    },
    "prerequisites": [
      "Constructors",
      "Serialization lifecycle",
      "Object invariants"
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
          "source": "<?php\n\nclass Positive\n{\n    public int $amount;\n\n    public function __construct(int $amount)\n    {\n        if ($amount <= 0) {\n            throw new InvalidArgumentException('positive required');\n        }\n\n        $this->amount = $amount;\n    }\n}\n\n$restored = unserialize('O:8:\"Positive\":1:{s:6:\"amount\";i:-1;}');\n\necho $restored->amount;\n"
        }
      ]
    },
    "stem": "This fixed local payload is used only as a test fixture. Which review conclusion follows from restoring Positive with the displayed constructor?",
    "options": [
      {
        "id": "constructor-validates",
        "text": "The constructor receives -1 during restoration and throws before any object is returned.",
        "rationale": "unserialize restores the object without invoking this constructor.",
        "misconception": "Assuming every object creation path runs __construct."
      },
      {
        "id": "argument-required",
        "text": "Restoration fails because no constructor argument list was supplied to unserialize.",
        "rationale": "The serialized representation supplies property state, not constructor arguments.",
        "misconception": "Treating restoration as a normal new expression with missing parameters."
      },
      {
        "id": "separate-boundary",
        "text": "The object is restored with amount=-1; constructor checks alone do not enforce the invariant on restoration.",
        "rationale": "Typed int permits -1, and the constructor is bypassed; a trusted validated restoration strategy is a separate requirement.",
        "misconception": null
      },
      {
        "id": "stdclass-result",
        "text": "The payload restores as stdClass, so Positive’s invariant cannot apply to this result.",
        "rationale": "The defined class is permitted under the default options, so the result is Positive.",
        "misconception": "Assuming default unserialize converts declared class objects to generic objects."
      }
    ],
    "correctOptionId": "separate-boundary",
    "explanation": {
      "summary": "PHP deserialization is a distinct lifecycle path. It can hydrate typed properties without calling __construct, so constructor-only domain validation is insufficient for restored state.",
      "trace": "The payload’s integer -1 satisfies the int property type. With no restoration hook validating positivity, the returned Positive contains -1."
    },
    "validation": {
      "kind": "contract",
      "stdout": "-1",
      "keyEvidence": "The invalid domain value is observable in the restored Positive instance without a constructor exception.",
      "counterexamples": {
        "constructor-validates": "No constructor call occurs",
        "argument-required": "Property hydration does not require constructor arguments",
        "stdclass-result": "The known permitted class is restored as Positive"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/function.unserialize.php",
      "https://www.php.net/manual/en/language.oop5.magic.php#object.unserialize"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0160",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Classes & object lifecycle",
    "subtopic": "strong-object-identity-registry-choice",
    "objective": {
      "id": "strong-object-identity-registry-choice",
      "text": "Choose object-keyed storage that retains registered objects until explicit removal."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Match identity-based metadata storage with a required strong ownership policy."
    },
    "prerequisites": [
      "Object identity",
      "WeakMap",
      "Collection ownership and reachability"
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
          "source": "<?php\n\n$registry = new WeakMap();\n$object = new stdClass();\n$registry[$object] = 'seen';\n\nunset($object);\n\necho count($registry);\n"
        }
      ]
    },
    "stem": "The registry must keep each registered object alive until explicit removal and associate metadata with its exact identity. The current WeakMap loses the entry. Which replacement collection design meets the contract?",
    "options": [
      {
        "id": "strong-storage",
        "text": "Use SplObjectStorage with the object as key and its metadata as associated data.",
        "rationale": "SplObjectStorage supports identity keys and strongly retains attached objects.",
        "misconception": null
      },
      {
        "id": "hash-only",
        "text": "Use an array keyed by spl_object_hash, storing only the metadata string.",
        "rationale": "The string key and metadata do not retain the object, and object hashes can be reused after destruction.",
        "misconception": "Treating an identity-derived string as ownership of the original object."
      },
      {
        "id": "weak-references",
        "text": "Store WeakReference objects and metadata in an ordinary array.",
        "rationale": "WeakReference deliberately does not keep its referent alive.",
        "misconception": "Assuming retaining a weak-reference wrapper strongly retains its target."
      },
      {
        "id": "array-object",
        "text": "Use ArrayObject and use the original object directly as an array offset.",
        "rationale": "ArrayObject follows array-style offset constraints and is not an object-identity-keyed map.",
        "misconception": "Assuming an object wrapper around an array adds object keys."
      }
    ],
    "correctOptionId": "strong-storage",
    "explanation": {
      "summary": "A registry with explicit lifetime ownership needs strong references. SplObjectStorage directly provides object-identity keys and associated metadata; weak references or string identifiers do not supply that ownership.",
      "trace": "The WeakMap witness becomes empty when the external object variable is unset. Strong object storage would retain the object and its entry until removal."
    },
    "validation": {
      "kind": "contract",
      "stdout": "0",
      "keyEvidence": "The current weak lifetime contradicts the stated retention requirement; SplObjectStorage supplies identity-keyed strong storage.",
      "counterexamples": {
        "hash-only": "No object reference is retained and identifiers can be reused",
        "weak-references": "Weak wrappers do not own their targets",
        "array-object": "Array-style offsets do not accept arbitrary object keys"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/class.splobjectstorage.php",
      "https://www.php.net/manual/en/class.weakmap.php",
      "https://www.php.net/manual/en/function.spl-object-hash.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0161",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "trait-static-property-reuse-child-storage",
    "objective": {
      "id": "trait-static-property-reuse-child-storage",
      "text": "Review how reusing a trait in a child class affects static property storage on PHP 8.4/8.5."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Separate inherited static storage from a property contributed again by trait reuse under modern version rules."
    },
    "prerequisites": [
      "Traits",
      "Static inheritance",
      "PHP 8.3+ trait static-property behavior (advanced)"
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
          "source": "<?php\n\ntrait Hits\n{\n    public static int $hits = 0;\n\n    public static function increment(): void\n    {\n        self::$hits++;\n    }\n}\n\nclass BaseCounter\n{\n    use Hits;\n}\n\nclass ChildCounter extends BaseCounter\n{\n    use Hits;\n}\n\nBaseCounter::increment();\nChildCounter::increment();\n\necho json_encode([BaseCounter::$hits, ChildCounter::$hits]);\n"
        }
      ]
    },
    "stem": "A reviewer expects one shared hit count across BaseCounter and ChildCounter. Which assessment explains the result and the effect of removing only the child’s use statement?",
    "options": [
      {
        "id": "trait-global",
        "text": "The trait owns one global counter, so the two classes must both report 2 regardless of the child use statement.",
        "rationale": "Trait static state belongs to consuming classes under these rules, not a single trait-global storage location.",
        "misconception": "Treating a trait as a shared runtime instance that owns all imported state."
      },
      {
        "id": "reuse-ignored",
        "text": "The child use statement is ignored because its parent already uses Hits, so removing it changes nothing.",
        "rationale": "Reusing the trait in the child contributes distinct static property storage on the stated versions.",
        "misconception": "Assuming repeated trait use is deduplicated across an inheritance hierarchy."
      },
      {
        "id": "modern-reuse",
        "text": "The repeated child use creates separate storage; removing it leaves the child using the inherited shared property.",
        "rationale": "Since PHP 8.3, this child trait reuse produces a distinct static property rather than the inherited shared storage.",
        "misconception": null
      },
      {
        "id": "inheritance-copy",
        "text": "Inheritance always copies static storage into each child, so removing use still leaves two independent counters.",
        "rationale": "An inherited static property without a separate declaration can share the parent’s storage.",
        "misconception": "Assuming class inheritance always duplicates static property storage."
      }
    ],
    "correctOptionId": "modern-reuse",
    "explanation": {
      "summary": "On PHP 8.3 and later, reusing a trait in a child class gives its static property distinct storage. Without that repeated use, the child inherits the parent’s property and method instead.",
      "trace": "Each class increments its own imported hits property to 1. Removing the child use would make both operations reach the inherited shared counter, reaching 2."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[1,1]",
      "keyEvidence": "Distinct counts follow the modern trait-reuse rule; inherited-only storage differs from a newly contributed trait property.",
      "counterexamples": {
        "trait-global": "The current counts are 1 and 1, not 2",
        "reuse-ignored": "The repeated use is semantically significant",
        "inheritance-copy": "Inherited-only static properties can share storage"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.traits.php#language.oop5.traits.properties"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0162",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "constructor-signature-not-general-override-contract",
    "objective": {
      "id": "constructor-signature-not-general-override-contract",
      "text": "Review a late-bound factory when a child constructor has a different argument contract."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine constructor override rules, strict scalar calls and late-bound construction."
    },
    "prerequisites": [
      "Constructors and inheritance",
      "new static",
      "strict_types",
      "Factory contracts (advanced)"
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
          "source": "<?php\n\ndeclare(strict_types=1);\n\nclass Entity\n{\n    public function __construct(public int $id)\n    {\n    }\n\n    public static function make(int $id): static\n    {\n        return new static($id);\n    }\n}\n\nclass ChildEntity extends Entity\n{\n    public function __construct(public string $name)\n    {\n        parent::__construct(0);\n    }\n}\n\ntry {\n    ChildEntity::make(7);\n    echo 'created';\n} catch (TypeError $error) {\n    echo 'TypeError';\n}\n"
        }
      ]
    },
    "stem": "A review assumes inheritance guarantees that ChildEntity’s constructor accepts the integer passed by make. Which assessment matches the program?",
    "options": [
      {
        "id": "constructor-contract",
        "text": "The child declaration is allowed, but the strict factory call passes an int to its string constructor and throws TypeError.",
        "rationale": "Constructors are exempt from ordinary parent-method signature compatibility in this case; the late-bound call still enforces the actual constructor’s parameter type.",
        "misconception": null
      },
      {
        "id": "declaration-rejected",
        "text": "The file must fail at class declaration because all constructor overrides obey ordinary method variance.",
        "rationale": "This constructor override is allowed; the failure occurs when the factory invokes it.",
        "misconception": "Applying ordinary method override constraints to a constructor without a separate interface contract."
      },
      {
        "id": "base-constructor",
        "text": "new static creates ChildEntity but always invokes Entity’s constructor because make is declared in Entity.",
        "rationale": "Late-bound construction invokes the selected class’s constructor, not the factory’s declaring-class constructor.",
        "misconception": "Separating dynamic class selection from constructor dispatch."
      },
      {
        "id": "return-type-protects",
        "text": "The static return type guarantees constructor compatibility and converts 7 to a string automatically.",
        "rationale": "A return type neither validates constructor signature substitutability nor changes strict argument binding.",
        "misconception": "Using a result-type promise as an argument-adaptation mechanism."
      }
    ],
    "correctOptionId": "constructor-contract",
    "explanation": {
      "summary": "A child may change its constructor signature here, so a base factory cannot infer constructor compatibility solely from inheritance. The factory’s strict call is checked against the late-bound constructor it actually invokes.",
      "trace": "new static selects ChildEntity. Its string parameter rejects integer 7 before its body runs, and the outer catch prints TypeError."
    },
    "validation": {
      "kind": "contract",
      "stdout": "TypeError",
      "keyEvidence": "Class loading succeeds, while the actual factory invocation reaches the caught argument TypeError.",
      "counterexamples": {
        "declaration-rejected": "The catch executes, proving the main program started",
        "base-constructor": "The child constructor signature is checked",
        "return-type-protects": "The argument binding still throws"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.decon.php#language.oop5.decon.constructor",
      "https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0163",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Validation & web security",
    "subtopic": "sensitive-parameter-trace-redaction-not-message-sanitization",
    "objective": {
      "id": "sensitive-parameter-trace-redaction-not-message-sanitization",
      "text": "Review the boundary of SensitiveParameter redaction without assuming explicit exception messages are sanitized."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish trace argument representation, retained runtime values and manually constructed diagnostic text."
    },
    "prerequisites": [
      "SensitiveParameter",
      "Exception traces",
      "SensitiveParameterValue"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "ini": {
        "zend.exception_ignore_args": "0"
      },
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "zend.exception_ignore_args=0 is explicitly set for this isolated fixture so trace arguments are included. demo is a synthetic test value, not a real secret."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction fail(#[SensitiveParameter] string $token): never\n{\n    throw new RuntimeException('token=' . $token);\n}\n\ntry {\n    fail('demo');\n} catch (RuntimeException $error) {\n    $argument = $error->getTrace()[0]['args'][0];\n\n    echo json_encode([\n        get_debug_type($argument),\n        $argument->getValue(),\n        $error->getMessage(),\n    ]);\n}\n"
        }
      ]
    },
    "stem": "A review claims the attribute prevents the token from appearing anywhere in the exception. Which assessment matches the recorded values?",
    "options": [
      {
        "id": "message-redacted",
        "text": "The attribute replaces the token in both trace arguments and the explicit message with a redaction marker.",
        "rationale": "The manually constructed message still contains token=demo.",
        "misconception": "Assuming trace metadata redaction scans arbitrary strings for sensitive values."
      },
      {
        "id": "value-destroyed",
        "text": "The attribute permanently destroys the original argument value after binding, so getValue cannot recover it.",
        "rationale": "The wrapper still exposes its contained value through getValue, and the function used that value in its message.",
        "misconception": "Confusing diagnostic redaction with memory erasure."
      },
      {
        "id": "caller-attribute",
        "text": "No redaction occurs because the attribute must be placed on the caller’s argument expression.",
        "rationale": "The parameter attribute is the supported declaration that controls trace argument redaction.",
        "misconception": "Placing parameter metadata at a call-site syntax location."
      },
      {
        "id": "trace-boundary",
        "text": "The trace argument is wrapped, but its runtime value and the explicitly built message still contain demo.",
        "rationale": "SensitiveParameter changes trace representation; it does not sanitize messages or make the underlying value inaccessible.",
        "misconception": null
      }
    ],
    "correctOptionId": "trace-boundary",
    "explanation": {
      "summary": "SensitiveParameter replaces the trace argument representation with SensitiveParameterValue. It does not rewrite exception messages, erase the argument or prevent deliberate access through the wrapper.",
      "trace": "The trace contains a SensitiveParameterValue object. getValue returns demo, and the message remains token=demo."
    },
    "validation": {
      "kind": "contract",
      "ini": {
        "zend.exception_ignore_args": "0"
      },
      "stdout": "[\"SensitiveParameterValue\",\"demo\",\"token=demo\"]",
      "keyEvidence": "All three observed fields distinguish trace wrapping from value retention and explicit message content.",
      "counterexamples": {
        "message-redacted": "Message remains token=demo",
        "value-destroyed": "getValue returns demo",
        "caller-attribute": "The declared parameter produces the wrapper"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/class.sensitiveparameter.php",
      "https://www.php.net/manual/en/class.sensitiveparametervalue.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0164",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Errors & exceptions",
    "subtopic": "compiled-out-assertion-skips-validation-side-effect",
    "objective": {
      "id": "compiled-out-assertion-skips-validation-side-effect",
      "text": "Review validation placed inside an assertion expression when assertions are compiled out."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Connect compile-time assertion configuration with skipped function evaluation and the public validation contract."
    },
    "prerequisites": [
      "zend.assertions (advanced)",
      "assert",
      "Validation side effects"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "ini": {
        "zend.assertions": "-1"
      },
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The PHP process starts with zend.assertions=-1. The fixture sets this before compilation, as a production configuration may do. Every accepted amount must be positive."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction requirePositive(int $amount): bool\n{\n    if ($amount <= 0) {\n        throw new DomainException('positive required');\n    }\n\n    return true;\n}\n\nfunction accept(int $amount): int\n{\n    assert(requirePositive($amount));\n\n    return $amount;\n}\n\necho accept(-5);\n"
        }
      ]
    },
    "stem": "A review expects requirePositive to reject the negative amount even when assertion checking is disabled. Which assessment is correct for this configuration?",
    "options": [
      {
        "id": "evaluate-only",
        "text": "PHP still evaluates requirePositive but ignores only the assertion result, so DomainException is thrown.",
        "rationale": "With zend.assertions=-1, the assertion code is not generated and the expression is not evaluated.",
        "misconception": "Treating a compiled-out assertion as an ordinary function call whose result is merely ignored."
      },
      {
        "id": "ordinary-validation",
        "text": "The assertion expression is skipped and -5 is returned; required validation must use ordinary control flow.",
        "rationale": "Input validation cannot depend on an expression that the runtime configuration permits the compiler to omit.",
        "misconception": null
      },
      {
        "id": "exception-flag",
        "text": "Enabling assertion exceptions alone would force requirePositive to run despite zend.assertions=-1.",
        "rationale": "Exception handling settings do not restore assertion code omitted during compilation.",
        "misconception": "Confusing assertion failure handling with assertion code generation."
      },
      {
        "id": "int-restriction",
        "text": "The int parameter rejects negative values before assertion evaluation.",
        "rationale": "PHP int includes negative integers; the positivity rule is a domain condition.",
        "misconception": "Treating a signed scalar type as a positive-integer constraint."
      }
    ],
    "correctOptionId": "ordinary-validation",
    "explanation": {
      "summary": "Assertions are suitable for optional development checks, not required input validation with side effects. At zend.assertions=-1, the expression is omitted, so the validation function is never called.",
      "trace": "accept receives -5, skips the assertion expression and returns -5 unchanged."
    },
    "validation": {
      "kind": "contract",
      "ini": {
        "zend.assertions": "-1"
      },
      "stdout": "-5",
      "keyEvidence": "The domain-invalid value reaches the return because no validation call is generated.",
      "counterexamples": {
        "evaluate-only": "No DomainException is thrown",
        "exception-flag": "Failure-handling flags cannot recover omitted code",
        "int-restriction": "Negative values are valid ints"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/function.assert.php",
      "https://www.php.net/manual/en/ini.core.php#ini.zend.assertions"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0165",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "private-helper-not-polymorphic-extension-point",
    "objective": {
      "id": "private-helper-not-polymorphic-extension-point",
      "text": "Review a same-named child method that does not override a parent’s private helper."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine private method scope, signature compatibility exceptions and dispatch from an inherited public method."
    },
    "prerequisites": [
      "Private methods",
      "Inheritance",
      "Template method dispatch (advanced)"
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
          "source": "<?php\n\nclass BaseHook\n{\n    final public function run(): string\n    {\n        return $this->hook();\n    }\n\n    private function hook(): string\n    {\n        return 'base';\n    }\n}\n\nclass ChildHook extends BaseHook\n{\n    public function hook(int $value): int\n    {\n        return $value;\n    }\n}\n\n$object = new ChildHook();\n\necho json_encode([$object->run(), $object->hook(7)]);\n"
        }
      ]
    },
    "stem": "A reviewer expects the inherited run method to dispatch to ChildHook::hook and fail because no argument is supplied. Which assessment matches this code?",
    "options": [
      {
        "id": "variance-error",
        "text": "The class declaration fails because the child hook’s parameter and return types violate the parent signature.",
        "rationale": "The parent private method is not an overridden public/protected contract for the child method.",
        "misconception": "Applying ordinary override variance to an unrelated same-named private helper."
      },
      {
        "id": "child-dispatch",
        "text": "run calls the child hook and throws ArgumentCountError for its missing parameter.",
        "rationale": "The private call from BaseHook resolves to BaseHook’s own private method.",
        "misconception": "Treating a private helper as a polymorphic extension point."
      },
      {
        "id": "separate-methods",
        "text": "run uses the parent’s private hook; the direct public child hook call is a separate method and returns 7.",
        "rationale": "The same name does not make the private parent helper an overridden method.",
        "misconception": null
      },
      {
        "id": "final-controls-all",
        "text": "Because run is final, even the direct hook(7) call must use the parent’s private hook.",
        "rationale": "final restricts overriding run; it does not redirect unrelated public calls to private methods.",
        "misconception": "Extending a method’s finality to all methods it calls."
      }
    ],
    "correctOptionId": "separate-methods",
    "explanation": {
      "summary": "A private parent method belongs to that class’s scope and is not a child extension point. The child may declare its own same-named method with a different signature, while the parent’s internal private call remains separate.",
      "trace": "The inherited run calls BaseHook’s private hook and returns base. The outside call resolves to ChildHook’s public hook and returns integer 7."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"base\",7]",
      "keyEvidence": "Both observed calls distinguish the parent private dispatch from the separate child public method.",
      "counterexamples": {
        "variance-error": "The class declarations are accepted",
        "child-dispatch": "run returns base rather than throwing",
        "final-controls-all": "The direct child call returns 7"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.inheritance.php",
      "https://www.php.net/manual/en/language.oop5.visibility.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0166",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Types, casting & comparisons",
    "subtopic": "literal-dollar-label-and-interpolated-value",
    "objective": {
      "id": "literal-dollar-label-and-interpolated-value",
      "text": "Combine a literal variable-name label with the variable’s current value."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish single-quoted text, interpolation and concatenation."
    },
    "prerequisites": [
      "String quoting",
      "Concatenation",
      "Variables"
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
          "source": "<?php\n\n$total = 7;\n\necho '$total = $total';\n"
        }
      ]
    },
    "stem": "The output must be exactly $total = 7, including the literal dollar sign in the label. Which expression should replace the current string?",
    "options": [
      {
        "id": "interpolate-both",
        "text": "\"$total = $total\"",
        "rationale": "This interpolates both occurrences and prints 7 = 7.",
        "misconception": "Failing to distinguish the literal label from the value slot."
      },
      {
        "id": "literal-and-value",
        "text": "'$total = ' . $total",
        "rationale": "Single quotes preserve the label, and concatenation appends the numeric value.",
        "misconception": null
      },
      {
        "id": "literal-both",
        "text": "'$total = $total'",
        "rationale": "Both variable spellings remain literal in a single-quoted string.",
        "misconception": "Expecting selective interpolation inside single quotes."
      },
      {
        "id": "single-backslash",
        "text": "'\\$total = ' . $total",
        "rationale": "A backslash before dollar is retained in a single-quoted string, adding an unwanted byte.",
        "misconception": "Applying double-quoted dollar escaping to a single-quoted string."
      }
    ],
    "correctOptionId": "literal-and-value",
    "explanation": {
      "summary": "Single-quoted text preserves the literal dollar-name label. The value must be appended separately or interpolated in a correctly escaped double-quoted expression.",
      "trace": "The literal prefix is $total = and the appended value is 7, producing the required line."
    },
    "validation": {
      "kind": "patch",
      "marker": "'$total = $total'",
      "stdout": "$total = 7",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.string.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0167",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Operators & expressions",
    "subtopic": "page-count-round-up-partial-page",
    "objective": {
      "id": "page-count-round-up-partial-page",
      "text": "Count a partial final page without adding a page for an exact multiple."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose ceiling rather than truncation or nearest-integer rounding."
    },
    "prerequisites": [
      "Division",
      "Rounding",
      "Integer conversion"
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
        "total is a nonnegative integer and pageSize is a positive integer. The fixed test values are small enough to avoid numeric precision concerns."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction pages(int $total, int $pageSize): int\n{\n    return intdiv($total, $pageSize);\n}\n\necho json_encode([pages(0, 10), pages(20, 10), pages(21, 10)]);\n"
        }
      ]
    },
    "stem": "A partial page counts as one page, and zero items require zero pages. Which expression implements pages for all displayed cases?",
    "options": [
      {
        "id": "floor",
        "text": "(int) floor($total / $pageSize)",
        "rationale": "This drops the fractional final page for 21 items.",
        "misconception": "Using completed groups instead of required capacity."
      },
      {
        "id": "nearest",
        "text": "(int) round($total / $pageSize)",
        "rationale": "Rounding 2.1 to the nearest integer gives 2 rather than the required 3.",
        "misconception": "Using nearest rounding where every positive remainder needs another page."
      },
      {
        "id": "always-plus",
        "text": "intdiv($total, $pageSize) + 1",
        "rationale": "This adds a page for zero and exact multiples too.",
        "misconception": "Adding unconditionally instead of only for a remainder."
      },
      {
        "id": "ceiling",
        "text": "(int) ceil($total / $pageSize)",
        "rationale": "Ceiling preserves exact quotients and rounds any partial page upward.",
        "misconception": null
      }
    ],
    "correctOptionId": "ceiling",
    "explanation": {
      "summary": "The number of pages is the smallest integer whose capacity covers all items. Ceiling expresses that requirement, including zero and exact multiples.",
      "trace": "The quotients 0, 2 and 2.1 become page counts 0, 2 and 3."
    },
    "validation": {
      "kind": "patch",
      "marker": "intdiv($total, $pageSize)",
      "stdout": "[0,2,3]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/function.ceil.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0168",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Arrays & destructuring",
    "subtopic": "queue-front-removal-versus-pointer-read",
    "objective": {
      "id": "queue-front-removal-versus-pointer-read",
      "text": "Remove and return the first queued value rather than only reading it or removing the last value."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish array mutation from internal-pointer access."
    },
    "prerequisites": [
      "array_shift",
      "array_pop",
      "Array pointer functions"
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
          "source": "<?php\n\n$queue = ['first', 'second'];\n$next = array_pop($queue);\n\necho json_encode([$next, $queue]);\n"
        }
      ]
    },
    "stem": "The queue must return first and retain only second. Which expression performs both operations?",
    "options": [
      {
        "id": "dequeue",
        "text": "array_shift($queue)",
        "rationale": "array_shift returns and removes the first element, then reindexes remaining numeric keys.",
        "misconception": null
      },
      {
        "id": "pop",
        "text": "array_pop($queue)",
        "rationale": "array_pop removes the last element, so it returns second instead.",
        "misconception": "Using stack removal for a FIFO queue."
      },
      {
        "id": "reset",
        "text": "reset($queue)",
        "rationale": "reset reads the first element but leaves both values in the array.",
        "misconception": "Confusing pointer movement with removal."
      },
      {
        "id": "advance",
        "text": "next($queue)",
        "rationale": "next moves the pointer to second without removing either element.",
        "misconception": "Treating pointer advancement as consuming the queue entry."
      }
    ],
    "correctOptionId": "dequeue",
    "explanation": {
      "summary": "A FIFO queue consumes its front. array_shift mutates the array accordingly; pointer functions only change which value a pointer observes.",
      "trace": "first is returned, and the remaining array contains second at numeric key 0."
    },
    "validation": {
      "kind": "patch",
      "marker": "array_pop($queue)",
      "stdout": "[\"first\",[\"second\"]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-shift.php",
      "https://www.php.net/manual/en/function.next.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0169",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Arrays & destructuring",
    "subtopic": "allowlist-input-fields-by-key",
    "objective": {
      "id": "allowlist-input-fields-by-key",
      "text": "Select allowed fields by their names while retaining their submitted values."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Convert a list of allowed names into the key set required by key intersection."
    },
    "prerequisites": [
      "Associative arrays",
      "Field selection by key",
      "Key sets"
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
          "source": "<?php\n\n$input = ['name' => 'Ada', 'role' => 'reader', 'debug' => true];\n$allowed = ['name', 'role'];\n\n$selected = array_intersect($input, $allowed);\n\necho json_encode($selected);\n"
        }
      ]
    },
    "stem": "Keep only the name and role fields, preserving their values. Which expression should replace the current value intersection?",
    "options": [
      {
        "id": "values",
        "text": "array_intersect($input, $allowed)",
        "rationale": "This compares Ada, reader and true against the strings name and role.",
        "misconception": "Comparing submitted values with allowed field names."
      },
      {
        "id": "numeric-keys",
        "text": "array_intersect_key($input, $allowed)",
        "rationale": "The allowed list has numeric keys 0 and 1, not name and role.",
        "misconception": "Using a list as a key set without changing its shape."
      },
      {
        "id": "key-set",
        "text": "array_intersect_key($input, array_flip($allowed))",
        "rationale": "Flipping makes allowed names into keys, so key intersection retains the requested fields.",
        "misconception": null
      },
      {
        "id": "difference",
        "text": "array_diff_key($input, array_flip($allowed))",
        "rationale": "This retains disallowed fields such as debug instead of the allowed fields.",
        "misconception": "Reversing an allowlist into an exclusion operation."
      }
    ],
    "correctOptionId": "key-set",
    "explanation": {
      "summary": "The policy concerns field names, so compare keys. A simple list stores those names as values; array_flip turns them into a suitable key set.",
      "trace": "The accepted key set contains name and role, retaining Ada and reader while removing debug."
    },
    "validation": {
      "kind": "patch",
      "marker": "array_intersect($input, $allowed)",
      "stdout": "{\"name\":\"Ada\",\"role\":\"reader\"}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-intersect-key.php",
      "https://www.php.net/manual/en/function.array-flip.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0170",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Classes & object lifecycle",
    "subtopic": "initialized-nullable-string-property",
    "objective": {
      "id": "initialized-nullable-string-property",
      "text": "Declare an initialized nullable string property without widening its accepted type."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish nullability, initialization and mixed-type acceptance."
    },
    "prerequisites": [
      "Typed properties",
      "Nullable types",
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
          "source": "<?php\n\ndeclare(strict_types=1);\n\nclass Contact\n{\n    public ?string $name;\n}\n\n$contact = new Contact();\n$initial = $contact->name;\n$rejected = false;\n\ntry {\n    $contact->name = 7;\n} catch (TypeError $error) {\n    $rejected = true;\n}\n\necho json_encode([$initial, $rejected]);\n"
        }
      ]
    },
    "stem": "A new Contact must expose name as null, permit strings, and reject an integer assignment under this strict file. Which property declaration meets all three requirements?",
    "options": [
      {
        "id": "uninitialized",
        "text": "public ?string $name;",
        "rationale": "A nullable typed property without a default is still uninitialized.",
        "misconception": "Assuming nullable automatically means initialized to null."
      },
      {
        "id": "nullable-default",
        "text": "public ?string $name = null;",
        "rationale": "The property starts at null and its declared type remains string or null.",
        "misconception": null
      },
      {
        "id": "empty-string",
        "text": "public string $name = '';",
        "rationale": "This starts at an empty string rather than the required null.",
        "misconception": "Treating empty and absent values as interchangeable defaults."
      },
      {
        "id": "mixed",
        "text": "public mixed $name = null;",
        "rationale": "The default is correct, but mixed permits the integer assignment.",
        "misconception": "Widening the type to solve initialization while losing its input restriction."
      }
    ],
    "correctOptionId": "nullable-default",
    "explanation": {
      "summary": "Nullability specifies an allowed value, not an automatic initial value. An explicit null default and a nullable string type satisfy both initialization and type restrictions.",
      "trace": "The initial read returns null. Assigning integer 7 from the strict file throws TypeError and sets rejected to true."
    },
    "validation": {
      "kind": "patch",
      "marker": "public ?string $name;",
      "stdout": "[null,true]",
      "errors": {
        "uninitialized": "must not be accessed before initialization"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.properties.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0171",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Functions & arguments",
    "subtopic": "unpack-array-into-variadic-arguments",
    "objective": {
      "id": "unpack-array-into-variadic-arguments",
      "text": "Pass every array value as a separate variadic argument."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Preserve both the aggregate total and the number of supplied arguments."
    },
    "prerequisites": [
      "Variadics",
      "Argument unpacking",
      "Arrays"
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
          "source": "<?php\n\nfunction summarize(int ...$values): array\n{\n    return [array_sum($values), count($values)];\n}\n\n$values = [1, 2, 3];\n\necho json_encode(summarize($values));\n"
        }
      ]
    },
    "stem": "summarize must receive all three integers as separate arguments. Which call produces total 6 and argument count 3?",
    "options": [
      {
        "id": "sum-first",
        "text": "summarize(array_sum($values))",
        "rationale": "This supplies one argument with value 6, so the count is 1.",
        "misconception": "Pre-aggregating values when the callee needs each argument."
      },
      {
        "id": "count-first",
        "text": "summarize(count($values))",
        "rationale": "This supplies one argument with value 3 rather than the three values.",
        "misconception": "Passing collection size instead of collection contents."
      },
      {
        "id": "first-only",
        "text": "summarize($values[0])",
        "rationale": "Only the first integer reaches the function.",
        "misconception": "Assuming a first-element argument causes the rest of the array to follow."
      },
      {
        "id": "unpack",
        "text": "summarize(...$values)",
        "rationale": "Argument unpacking supplies 1, 2 and 3 as separate variadic arguments.",
        "misconception": null
      }
    ],
    "correctOptionId": "unpack",
    "explanation": {
      "summary": "A variadic parameter collects separately supplied arguments. The spread operator unpacks the input array into those separate arguments rather than passing the array itself.",
      "trace": "The collected values are [1,2,3], giving sum 6 and count 3."
    },
    "validation": {
      "kind": "patch",
      "marker": "summarize($values)",
      "stdout": "[6,3]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
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
    "id": "PHP-E26-0172",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "HTTP & superglobals",
    "subtopic": "method-membership-needs-two-comparisons",
    "objective": {
      "id": "method-membership-needs-two-comparisons",
      "text": "Accept exactly GET and HEAD without making a nonempty method-name literal a truthy condition."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish a comparison against each allowed value from boolean combination of strings."
    },
    "prerequisites": [
      "HTTP method names",
      "Boolean operators",
      "Set membership"
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
          "source": "<?php\n\nfunction allowsRead(array $server): bool\n{\n    $method = $server['REQUEST_METHOD'];\n\n    return $method === 'GET' || 'HEAD';\n}\n\necho json_encode([\n    allowsRead(['REQUEST_METHOD' => 'GET']),\n    allowsRead(['REQUEST_METHOD' => 'HEAD']),\n    allowsRead(['REQUEST_METHOD' => 'POST']),\n]);\n"
        }
      ]
    },
    "stem": "allowsRead must accept only GET and HEAD. Which predicate should replace the current expression?",
    "options": [
      {
        "id": "membership",
        "text": "in_array($method, ['GET', 'HEAD'], true)",
        "rationale": "Strict membership accepts either of the two method names and rejects POST.",
        "misconception": null
      },
      {
        "id": "truthy-literal",
        "text": "$method === 'GET' || 'HEAD'",
        "rationale": "The nonempty string HEAD is truthy, so this accepts every method.",
        "misconception": "Assuming the comparison’s left operand is implicitly reused after ||."
      },
      {
        "id": "both",
        "text": "$method === 'GET' && $method === 'HEAD'",
        "rationale": "One string cannot equal both distinct method names at once.",
        "misconception": "Using conjunction for an either-of-two policy."
      },
      {
        "id": "grouped-strings",
        "text": "$method === ('GET' || 'HEAD')",
        "rationale": "The parenthesized expression is boolean true, which is not identical to a method string.",
        "misconception": "Combining the allowed strings before comparing instead of testing membership."
      }
    ],
    "correctOptionId": "membership",
    "explanation": {
      "summary": "Each allowed value must participate in a comparison or membership test. A bare nonempty string in a boolean expression is a truthy value, not a second comparison.",
      "trace": "The repaired predicate returns true for GET and HEAD and false for POST."
    },
    "validation": {
      "kind": "patch",
      "marker": "$method === 'GET' || 'HEAD'",
      "stdout": "[true,true,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.logical.php",
      "https://www.php.net/manual/en/reserved.variables.server.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0173",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Validation & web security",
    "subtopic": "parsed-url-authority-exact-host-policy",
    "objective": {
      "id": "parsed-url-authority-exact-host-policy",
      "text": "Apply an exact HTTPS host policy to parsed URL components rather than the original string prefix."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish scheme, host, userinfo and deceptive suffixes in an absolute URL."
    },
    "prerequisites": [
      "parse_url",
      "URL authority",
      "Exact allowlists"
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
        "This is only a syntactic URL policy, not a complete SSRF defense. Inputs are valid absolute ASCII URLs with lowercase scheme and host. The allowed scheme is https and the only allowed host is example.test. No network request is performed."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction allowed(string $url): bool\n{\n    $parts = parse_url($url);\n\n    return str_starts_with($url, 'https://example.test');\n}\n\necho json_encode(array_map('allowed', [\n    'https://example.test/path',\n    'https://example.test.evil.test/path',\n    'https://example.test@evil.test/path',\n    'https://notexample.test/path',\n    'http://example.test/path',\n]));\n"
        }
      ]
    },
    "stem": "Which predicate accepts only the permitted scheme/host combination for all displayed inputs?",
    "options": [
      {
        "id": "raw-prefix",
        "text": "str_starts_with($url, 'https://example.test')",
        "rationale": "A textual prefix can be followed by a different hostname suffix or by userinfo syntax.",
        "misconception": "Treating URL prefix text as the parsed destination host."
      },
      {
        "id": "host-only",
        "text": "$parts['host'] === 'example.test'",
        "rationale": "This also accepts the http URL, violating the required scheme.",
        "misconception": "Checking destination identity while omitting the transport scheme constraint."
      },
      {
        "id": "parsed-exact",
        "text": "$parts['scheme'] === 'https' && $parts['host'] === 'example.test'",
        "rationale": "Both parsed components match the exact policy, excluding userinfo and hostname lookalikes.",
        "misconception": null
      },
      {
        "id": "suffix",
        "text": "$parts['scheme'] === 'https' && str_ends_with($parts['host'], 'example.test')",
        "rationale": "notexample.test shares the textual suffix but is not the allowed host.",
        "misconception": "Using suffix matching for an exact-host policy."
      }
    ],
    "correctOptionId": "parsed-exact",
    "explanation": {
      "summary": "The URL parser identifies the actual host separately from userinfo and path text. An exact-host policy should compare that component exactly and independently check the scheme.",
      "trace": "Only the first URL has both the allowed scheme and the exact allowed host."
    },
    "validation": {
      "kind": "patch",
      "marker": "str_starts_with($url, 'https://example.test')",
      "stdout": "[true,false,false,false,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.parse-url.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0174",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "csv-disable-proprietary-escape-roundtrip",
    "objective": {
      "id": "csv-disable-proprietary-escape-roundtrip",
      "text": "Write CSV using enclosure doubling without a proprietary escape character."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Preserve quotes preceded by different bytes under a reader that uses standard enclosure doubling."
    },
    "prerequisites": [
      "fputcsv and fgetcsv",
      "CSV enclosure doubling",
      "Escape parameter"
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
          "source": "<?php\n\n$row = ['x,y', 'a\"b', 'c\\\\\"d', 'e/\"f'];\n$stream = fopen('php://memory', 'w+');\n\nfputcsv($stream, $row, ',', '\"', '\\\\');\nrewind($stream);\n$decoded = fgetcsv($stream, 0, ',', '\"', '');\nfclose($stream);\n\necho $decoded === $row ? 'same' : 'changed';\n"
        }
      ]
    },
    "stem": "The reader uses comma separators, double-quote enclosures and no proprietary escape character. Which writer call preserves every displayed field under that same dialect?",
    "options": [
      {
        "id": "backslash",
        "text": "fputcsv($stream, $row, ',', '\"', '\\\\');",
        "rationale": "Backslash before an enclosure is treated specially by this writer but not by the stated reader.",
        "misconception": "Assuming PHP’s proprietary backslash escape is identical to enclosure doubling."
      },
      {
        "id": "none",
        "text": "fputcsv($stream, $row, ',', '\"', '');",
        "rationale": "An empty escape parameter disables the proprietary mechanism and uses doubled enclosures consistently.",
        "misconception": null
      },
      {
        "id": "slash",
        "text": "fputcsv($stream, $row, ',', '\"', '/');",
        "rationale": "The slash before a quote in the last field becomes a proprietary escape that the reader does not recognize.",
        "misconception": "Changing the proprietary escape character instead of disabling it."
      },
      {
        "id": "quote",
        "text": "fputcsv($stream, $row, ',', '\"', '\"');",
        "rationale": "Using the enclosure itself as a separate escape character does not express the reader’s empty-escape dialect.",
        "misconception": "Assuming an escape parameter equal to the enclosure is the way to request quote doubling."
      }
    ],
    "correctOptionId": "none",
    "explanation": {
      "summary": "The escape argument controls an additional PHP escape mechanism, not the ordinary doubling of CSV enclosures. Setting it to an empty string aligns writer and reader on enclosure doubling alone.",
      "trace": "Commas cause field enclosure and embedded double quotes are doubled. Backslashes and slashes remain ordinary field bytes, so the decoded row equals the original."
    },
    "validation": {
      "kind": "patch",
      "marker": "fputcsv($stream, $row, ',', '\"', '\\\\');",
      "stdout": "same",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.fputcsv.php",
      "https://www.php.net/manual/en/function.fgetcsv.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0175",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Types, casting & comparisons",
    "subtopic": "validated-decimal-cents-without-float-roundtrip",
    "objective": {
      "id": "validated-decimal-cents-without-float-roundtrip",
      "text": "Convert a fixed two-decimal representation to exact integer cents without passing through float."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Preserve decimal digits across both ordinary and beyond-double-exactness values."
    },
    "prerequisites": [
      "Integer range",
      "Floating-point precision",
      "Validated numeric representations"
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
        "Input has already been validated as nonnegative decimal digits, one dot and exactly two fractional digits. Removing the dot produces a value within the 64-bit PHP integer range."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction cents(string $input): int\n{\n    return (int) ((float) $input * 100);\n}\n\necho json_encode([\n    cents('19.99'),\n    cents('90071992547409.93'),\n]);\n"
        }
      ]
    },
    "stem": "Which expression converts both values to exact integer cents under the stated validated-input contract?",
    "options": [
      {
        "id": "truncate-float",
        "text": "(int) ((float) $input * 100)",
        "rationale": "Float conversion can lose decimal precision before truncation.",
        "misconception": "Assuming multiplying a decimal float by 100 always produces an exact integer."
      },
      {
        "id": "round-float",
        "text": "(int) round((float) $input * 100)",
        "rationale": "Rounding cannot recover digits already lost when the large input became a float.",
        "misconception": "Treating rounding as a cure for representation loss at any magnitude."
      },
      {
        "id": "whole-only",
        "text": "(int) $input * 100",
        "rationale": "Casting before multiplication discards the two fractional digits.",
        "misconception": "Converting only the whole-unit portion."
      },
      {
        "id": "decimal-digits",
        "text": "(int) str_replace('.', '', $input)",
        "rationale": "The validated fixed-scale representation can be converted directly to integer cents without a float intermediary.",
        "misconception": null
      }
    ],
    "correctOptionId": "decimal-digits",
    "explanation": {
      "summary": "With exactly two fractional digits and a validated integer-range result, removing the single decimal point preserves the cents digits exactly. Float conversion is unnecessary and can lose information.",
      "trace": "The strings become 1999 and 9007199254740993 before integer conversion. Both remain exact 64-bit integers."
    },
    "validation": {
      "kind": "patch",
      "marker": "(int) ((float) $input * 100)",
      "stdout": "[1999,9007199254740993]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
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
    "id": "PHP-E26-0176",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "timestamp-constructor-timezone-application",
    "objective": {
      "id": "timestamp-constructor-timezone-application",
      "text": "Apply a display timezone after constructing an instant from an @ timestamp."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish an absolute timestamp input from a local wall-clock interpretation."
    },
    "prerequisites": [
      "DateTimeImmutable",
      "Unix timestamp syntax",
      "Timezones"
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
          "source": "<?php\n\nfunction displayAtZone(int $timestamp, string $zone): string\n{\n    $date = new DateTimeImmutable('@' . $timestamp, new DateTimeZone($zone));\n\n    return $date->format('H:i');\n}\n\necho json_encode([displayAtZone(0, 'UTC'), displayAtZone(0, 'Asia/Tokyo')]);\n"
        }
      ]
    },
    "stem": "The same timestamp must be displayed in the requested timezone. Which replacement for the DateTimeImmutable construction makes timestamp zero display as 00:00 UTC and 09:00 Asia/Tokyo?",
    "options": [
      {
        "id": "convert-zone",
        "text": "(new DateTimeImmutable('@' . $timestamp))->setTimezone(new DateTimeZone($zone))",
        "rationale": "The timestamp establishes the instant; setTimezone changes how that instant is displayed.",
        "misconception": null
      },
      {
        "id": "constructor-zone",
        "text": "new DateTimeImmutable('@' . $timestamp, new DateTimeZone($zone))",
        "rationale": "The timezone argument is ignored for the @ timestamp form.",
        "misconception": "Assuming the timezone argument overrides timezone information inherent in the input form."
      },
      {
        "id": "format-u",
        "text": "DateTimeImmutable::createFromFormat('U', (string) $timestamp, new DateTimeZone($zone))",
        "rationale": "The U timestamp format also establishes UTC rather than applying this display timezone argument.",
        "misconception": "Expecting a different timestamp parser to apply the ignored timezone automatically."
      },
      {
        "id": "local-epoch",
        "text": "new DateTimeImmutable('1970-01-01 00:00:00', new DateTimeZone($zone))",
        "rationale": "This creates local midnight in each zone, which represents different instants rather than converting timestamp zero.",
        "misconception": "Confusing the epoch instant with the same wall-clock text in every timezone."
      }
    ],
    "correctOptionId": "convert-zone",
    "explanation": {
      "summary": "An @ timestamp represents an absolute instant with UTC interpretation. Apply setTimezone afterward to display that same instant in another zone.",
      "trace": "Timestamp zero is midnight UTC. The Tokyo representation of that instant is 09:00."
    },
    "validation": {
      "kind": "patch",
      "marker": "new DateTimeImmutable('@' . $timestamp, new DateTimeZone($zone))",
      "stdout": "[\"00:00\",\"09:00\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/datetimeimmutable.construct.php",
      "https://www.php.net/manual/en/datetimeimmutable.settimezone.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0177",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "PDO & database access",
    "subtopic": "pdo-order-identifier-allowlist",
    "objective": {
      "id": "pdo-order-identifier-allowlist",
      "text": "Implement a requested SQL sort identifier without treating a bound value as SQL syntax."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish parameterized data from identifiers and preserve a fixed allowlist boundary."
    },
    "prerequisites": [
      "PDO prepared statements",
      "SQL identifiers versus values",
      "Allowlists"
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
        "The only permitted sort choices are name and id. The application owns the exact SQL identifier text for each choice. User input must never be concatenated as an unchecked identifier."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec('CREATE TABLE people (id INTEGER, name TEXT)');\n$pdo->exec(\"INSERT INTO people VALUES (1, 'Z'), (2, 'A')\");\n$requested = 'name';\n$statement = $pdo->prepare('SELECT name FROM people ORDER BY :column, id');\n$statement->execute(['column' => $requested]);\n\necho json_encode($statement->fetchAll(PDO::FETCH_COLUMN));\n"
        }
      ]
    },
    "stem": "Binding column currently sorts by a constant, so the id tie-breaker determines the order. Which implementation change enables the requested name sort safely?",
    "options": [
      {
        "id": "bind-type",
        "text": "Bind column with PDO::PARAM_STR explicitly so the database treats it as a column name.",
        "rationale": "A string parameter remains a data value, regardless of its PDO binding type.",
        "misconception": "Using a parameter type to request SQL syntax interpretation."
      },
      {
        "id": "quote-value",
        "text": "Use PDO::quote on the requested name and place the result after ORDER BY.",
        "rationale": "PDO::quote produces a quoted string value, not an identifier selection.",
        "misconception": "Confusing string-literal quoting with identifier construction."
      },
      {
        "id": "allowlisted-syntax",
        "text": "Allowlist the choice to a fixed ORDER BY identifier; reject unknown choices.",
        "rationale": "Only known SQL syntax is selected by the request; data values elsewhere can remain bound parameters.",
        "misconception": null
      },
      {
        "id": "positional",
        "text": "Replace :column with a positional placeholder and pass name as its value.",
        "rationale": "Positional placeholders also represent values rather than identifiers.",
        "misconception": "Assuming placeholder naming style changes its SQL role."
      }
    ],
    "correctOptionId": "allowlisted-syntax",
    "explanation": {
      "summary": "A prepared-statement parameter represents a data value. A dynamic identifier must instead be chosen from application-owned syntax through an explicit allowlist.",
      "trace": "The original primary sort expression is the constant name, so id orders Z before A. Selecting the fixed name identifier makes the database sort by the name column."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"Z\",\"A\"]",
      "keyEvidence": "The deterministic id tie-breaker exposes that the bound primary expression is a constant; an allowlisted identifier changes the SQL expression itself.",
      "counterexamples": {
        "bind-type": "PARAM_STR still binds a value",
        "quote-value": "Quoted name is still a string literal",
        "positional": "A positional placeholder is still a value placeholder"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdo.prepare.php",
      "https://www.php.net/manual/en/pdo.quote.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0178",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Iterators, generators & fibers",
    "subtopic": "generator-take-avoid-one-item-overfetch",
    "objective": {
      "id": "generator-take-avoid-one-item-overfetch",
      "text": "Stop a limited generator traversal before advancing the source to an unnecessary next item."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Coordinate yield suspension, consumer resumption and foreach advancement to avoid hidden upstream work."
    },
    "prerequisites": [
      "Generators (advanced)",
      "foreach advancement",
      "Lazy source side effects"
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
          "source": "<?php\n\nfunction source(int &$fetched): Generator\n{\n    for ($value = 1; $value <= 4; $value++) {\n        $fetched++;\n        yield $value;\n    }\n}\n\nfunction take(Generator $source, int $limit): Generator\n{\n    if ($limit <= 0) {\n        return;\n    }\n\n    $count = 0;\n\n    foreach ($source as $value) {\n        if ($count++ >= $limit) {\n            return;\n        }\n\n        yield $value;\n    }\n}\n\n$fetched = 0;\n$values = iterator_to_array(take(source($fetched), 2), false);\n\necho json_encode([$values, $fetched]);\n"
        }
      ]
    },
    "stem": "take must yield two values while fetching exactly two source items. Replace the foreach body. Which implementation stops before fetching a third item?",
    "options": [
      {
        "id": "check-before",
        "text": "if (++$count > $limit) {\n    return;\n}\n\nyield $value;",
        "rationale": "The third source item has already been fetched before the top-of-body limit check can reject it.",
        "misconception": "Assuming a foreach body check runs before advancing to the next source item."
      },
      {
        "id": "stop-after-nth",
        "text": "yield $value;\n\nif (++$count === $limit) {\n    return;\n}",
        "rationale": "After the second yield resumes, the function returns before foreach advances the source again.",
        "misconception": null
      },
      {
        "id": "postincrement",
        "text": "yield $value;\n\nif ($count++ === $limit) {\n    return;\n}",
        "rationale": "The zero-based postincrement comparison allows a third value to be yielded.",
        "misconception": "Mixing the count before increment with a one-based limit."
      },
      {
        "id": "stop-before-nth",
        "text": "if (++$count === $limit) {\n    return;\n}\n\nyield $value;",
        "rationale": "The second item is fetched but never yielded, so only one value reaches the consumer.",
        "misconception": "Stopping before producing the final allowed item."
      }
    ],
    "correctOptionId": "stop-after-nth",
    "explanation": {
      "summary": "A foreach iteration fetches the current item before entering its body. To avoid one-item overfetch, stop immediately after the final allowed yield resumes and before the loop advances.",
      "trace": "The source fetches and yields 1, then 2. Resuming after the second yield hits return, leaving fetched equal to 2."
    },
    "validation": {
      "kind": "patch",
      "marker": "if ($count++ >= $limit) {\n            return;\n        }\n\n        yield $value;",
      "stdout": "[[1,2],2]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/language.generators.syntax.php",
      "https://www.php.net/manual/en/control-structures.foreach.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0179",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Enums, attributes & reflection",
    "subtopic": "reflection-zero-argument-construction-eligibility",
    "objective": {
      "id": "reflection-zero-argument-construction-eligibility",
      "text": "Select classes that can actually be instantiated without supplied constructor arguments."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine instantiability, constructor visibility, abstractness and required-versus-total parameter counts."
    },
    "prerequisites": [
      "ReflectionClass",
      "Constructor visibility",
      "Optional parameters"
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
          "source": "<?php\n\nclass Simple\n{\n}\n\nclass NeedsInput\n{\n    public function __construct(int $id)\n    {\n    }\n}\n\nclass PrivateInput\n{\n    private function __construct()\n    {\n    }\n}\n\nclass OptionalInput\n{\n    public function __construct(int $id = 7)\n    {\n    }\n}\n\nabstract class AbstractInput\n{\n}\n\n$made = [];\n\nforeach ([Simple::class, NeedsInput::class, PrivateInput::class, OptionalInput::class, AbstractInput::class] as $name) {\n    $class = new ReflectionClass($name);\n    $constructor = $class->getConstructor();\n\n    if ($class->isInstantiable()) {\n        try {\n            $made[] = get_class($class->newInstance());\n        } catch (Throwable $error) {\n            $made[] = 'error:' . $name;\n        }\n    }\n}\n\necho json_encode($made);\n"
        }
      ]
    },
    "stem": "The factory may instantiate only classes usable with zero arguments, including constructors whose parameters are all optional. Which predicate selects exactly Simple and OptionalInput?",
    "options": [
      {
        "id": "instantiable-only",
        "text": "$class->isInstantiable()",
        "rationale": "NeedsInput is instantiable in principle but still requires an argument.",
        "misconception": "Treating instantiability as a guarantee of zero-argument construction."
      },
      {
        "id": "no-abstract",
        "text": "!$class->isAbstract() && ($constructor?->getNumberOfRequiredParameters() ?? 0) === 0",
        "rationale": "PrivateInput is nonabstract with zero required parameters but has an inaccessible constructor.",
        "misconception": "Ignoring constructor visibility when checking concrete classes."
      },
      {
        "id": "no-parameters",
        "text": "$class->isInstantiable() && ($constructor?->getNumberOfParameters() ?? 0) === 0",
        "rationale": "This rejects OptionalInput even though its sole parameter has a default.",
        "misconception": "Counting all parameters instead of only required parameters."
      },
      {
        "id": "zero-required",
        "text": "$class->isInstantiable() && ($constructor?->getNumberOfRequiredParameters() ?? 0) === 0",
        "rationale": "The class can be instantiated and its constructor requires no supplied arguments.",
        "misconception": null
      }
    ],
    "correctOptionId": "zero-required",
    "explanation": {
      "summary": "isInstantiable rules out abstract classes and inaccessible constructors, but not required constructor arguments. The required-parameter count supplies the remaining zero-argument condition.",
      "trace": "Simple has no constructor. OptionalInput has zero required parameters. The other three classes fail one of the two checks."
    },
    "validation": {
      "kind": "patch",
      "marker": "$class->isInstantiable()",
      "stdout": "[\"Simple\",\"OptionalInput\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/reflectionclass.isinstantiable.php",
      "https://www.php.net/manual/en/reflectionfunctionabstract.getnumberofrequiredparameters.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0180",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Transactions, migrations & ORM",
    "subtopic": "atomic-optimistic-version-conditional-update",
    "objective": {
      "id": "atomic-optimistic-version-conditional-update",
      "text": "Reject a stale write through an atomic version predicate while advancing the successful version."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track two writers sharing an old snapshot and distinguish matched-row evidence from a later overwrite."
    },
    "prerequisites": [
      "PDO rowCount",
      "Optimistic concurrency",
      "Atomic conditional updates"
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
        "Both writers read version 0 before either save. Each save is one atomic UPDATE. A successful save increments the stored version; a stale save must affect zero rows."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec('CREATE TABLE documents (id INTEGER PRIMARY KEY, title TEXT, version INTEGER)');\n$pdo->exec(\"INSERT INTO documents VALUES (1, 'old', 0)\");\n$sql = 'UPDATE documents SET title = :title, version = :expected + 1 WHERE id = :id';\n$statement = $pdo->prepare($sql);\n$counts = [];\n\nforeach (['first', 'second'] as $title) {\n    $statement->execute(['title' => $title, 'expected' => 0, 'id' => 1]);\n    $counts[] = $statement->rowCount();\n}\n\n$stored = $pdo->query('SELECT title, version FROM documents WHERE id = 1')->fetch(PDO::FETCH_ASSOC);\n\necho json_encode([$counts, $stored]);\n"
        }
      ]
    },
    "stem": "Which UPDATE statement allows first to win and prevents second, still using expected version 0, from overwriting it?",
    "options": [
      {
        "id": "compare-version",
        "text": "'UPDATE documents SET title = :title, version = version + 1 WHERE id = :id AND version = :expected'",
        "rationale": "The first update matches version 0 and advances it; the second no longer matches.",
        "misconception": null
      },
      {
        "id": "at-least",
        "text": "'UPDATE documents SET title = :title, version = version + 1 WHERE id = :id AND version >= :expected'",
        "rationale": "After the first write, version 1 still satisfies >= 0, allowing the stale overwrite.",
        "misconception": "Treating any newer stored version as compatible with an old snapshot."
      },
      {
        "id": "different-version",
        "text": "'UPDATE documents SET title = :title, version = version + 1 WHERE id = :id AND version <> :expected'",
        "rationale": "The initial matching snapshot is rejected, reversing the concurrency condition.",
        "misconception": "Updating only when the stored version differs from the expected version."
      },
      {
        "id": "assign-version",
        "text": "'UPDATE documents SET title = :title, version = :expected + 1 WHERE id = :id'",
        "rationale": "Assigning a version does not check whether the old version still matches; both writes succeed.",
        "misconception": "Treating the version field as output metadata rather than part of the atomic precondition."
      }
    ],
    "correctOptionId": "compare-version",
    "explanation": {
      "summary": "Optimistic concurrency compares the expected version in the same atomic statement that writes and increments it. A separate version assignment without a predicate cannot reject stale snapshots.",
      "trace": "The first update affects one row and stores first/version 1. The second expected-0 update affects zero rows, leaving that state unchanged."
    },
    "validation": {
      "kind": "patch",
      "marker": "'UPDATE documents SET title = :title, version = :expected + 1 WHERE id = :id'",
      "stdout": "[[1,0],{\"title\":\"first\",\"version\":1}]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-16"
    },
    "references": [
      "https://www.php.net/manual/en/pdostatement.rowcount.php",
      "https://www.sqlite.org/lang_update.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0181",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Validation & web security",
    "subtopic": "csrf-missing-token-regression",
    "objective": {
      "id": "csrf-missing-token-regression",
      "text": "Select a regression case that distinguishes missing-token rejection from equality alone."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Analyze a security precondition and distinguish it from the comparison primitive."
    },
    "prerequisites": [
      "CSRF tokens (unmapped curriculum)",
      "hash_equals",
      "Empty strings"
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
          "source": "<?php\n\nfunction tokenMatches(string $stored, string $submitted): bool\n{\n    return hash_equals($stored, $submitted);\n}\n"
        }
      ]
    },
    "stem": "The token checker must reject an empty stored token or an empty submitted token, even if they compare equal. Which test fails against this implementation? Inputs shown are strings already extracted from the request.",
    "options": [
      {
        "id": "match",
        "text": "tokenMatches('abc', 'abc') === true",
        "rationale": "Two identical nonempty tokens satisfy the contract.",
        "misconception": "Assuming a valid equal pair detects missing-input handling."
      },
      {
        "id": "different",
        "text": "tokenMatches('abc', 'xyz') === false",
        "rationale": "The comparison already rejects these different tokens.",
        "misconception": "Testing token inequality without testing absence."
      },
      {
        "id": "both-empty",
        "text": "tokenMatches('', '') === false",
        "rationale": "Two empty strings compare equal, so the implementation incorrectly returns true.",
        "misconception": null
      },
      {
        "id": "one-empty",
        "text": "tokenMatches('abc', '') === false",
        "rationale": "Different lengths already produce false.",
        "misconception": "Assuming one missing token exercises the same path as two missing tokens."
      }
    ],
    "correctOptionId": "both-empty",
    "explanation": {
      "summary": "Constant-time equality is not a presence check. A missing stored token must be rejected before an equality result can authorize a request.",
      "trace": "hash_equals returns true for two empty strings. The repair adds explicit nonempty checks for both inputs."
    },
    "validation": {
      "kind": "tests",
      "marker": "return hash_equals($stored, $submitted);",
      "repair": "return $stored !== '' && $submitted !== '' && hash_equals($stored, $submitted);",
      "cases": [
        {
          "option": "match",
          "probe": "echo json_encode(tokenMatches('abc', 'abc'));",
          "expected": "true"
        },
        {
          "option": "different",
          "probe": "echo json_encode(tokenMatches('abc', 'xyz'));",
          "expected": "false"
        },
        {
          "option": "both-empty",
          "probe": "echo json_encode(tokenMatches('', ''));",
          "expected": "false"
        },
        {
          "option": "one-empty",
          "probe": "echo json_encode(tokenMatches('abc', ''));",
          "expected": "false"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.hash-equals.php",
      "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0182",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Functions & arguments",
    "subtopic": "recursive-leaf-count-test",
    "objective": {
      "id": "recursive-leaf-count-test",
      "text": "Construct a test that distinguishes immediate child count from recursive scalar leaf count."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace a recursive specification through a tree with unequal branching."
    },
    "prerequisites": [
      "Recursion",
      "Arrays",
      "is_array"
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
          "source": "<?php\n\nfunction leafCount(array $tree): int\n{\n    $total = 0;\n\n    foreach ($tree as $child) {\n        $total += is_array($child) ? count($child) : 1;\n    }\n\n    return $total;\n}\n"
        }
      ]
    },
    "stem": "A leaf is any non-array value; arrays, including empty arrays, are containers. leafCount must count all leaves at any depth. Which assertion exposes the bug?",
    "options": [
      {
        "id": "empty",
        "text": "leafCount([]) === 0",
        "rationale": "No children means zero in both implementations.",
        "misconception": "Treating a base-case test as evidence for recursive descent."
      },
      {
        "id": "nested",
        "text": "leafCount([[1, [2, 3]]]) === 3",
        "rationale": "The implementation counts the two immediate children of the inner array and misses the deeper third leaf.",
        "misconception": null
      },
      {
        "id": "flat",
        "text": "leafCount([1, 2, 3]) === 3",
        "rationale": "Each immediate scalar contributes one correctly.",
        "misconception": "Testing only a tree with no recursive branch."
      },
      {
        "id": "empty-child",
        "text": "leafCount([[], 7]) === 1",
        "rationale": "The empty container contributes zero and the scalar contributes one.",
        "misconception": "Assuming an empty nested array necessarily exposes the missing recursive call."
      }
    ],
    "correctOptionId": "nested",
    "explanation": {
      "summary": "count on a child array measures its immediate entries. A recursive leaf count must apply leafCount to that child instead.",
      "trace": "The nested example contains scalar leaves 1, 2 and 3; count([1, [2, 3]]) returns only 2."
    },
    "validation": {
      "kind": "tests",
      "marker": "count($child)",
      "repair": "leafCount($child)",
      "cases": [
        {
          "option": "empty",
          "probe": "echo leafCount([]);",
          "expected": "0"
        },
        {
          "option": "nested",
          "probe": "echo leafCount([[1, [2, 3]]]);",
          "expected": "3"
        },
        {
          "option": "flat",
          "probe": "echo leafCount([1, 2, 3]);",
          "expected": "3"
        },
        {
          "option": "empty-child",
          "probe": "echo leafCount([[], 7]);",
          "expected": "1"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/language.functions.php",
      "https://www.php.net/manual/en/ref.array.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0183",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "HTTP & superglobals",
    "subtopic": "query-value-delimiter-test",
    "objective": {
      "id": "query-value-delimiter-test",
      "text": "Choose input that reveals a missing query-component encoding boundary."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Connect a constructed query string with the receiving parser’s interpretation."
    },
    "prerequisites": [
      "Query strings",
      "parse_str",
      "rawurlencode"
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
          "source": "<?php\n\nfunction roundTrip(string $term): string\n{\n    $query = 'q=' . $term;\n    parse_str($query, $decoded);\n\n    return $decoded['q'];\n}\n"
        }
      ]
    },
    "stem": "roundTrip must return the original search term after constructing and parsing a query string. Which assertion fails? No HTTP request is made.",
    "options": [
      {
        "id": "word",
        "text": "roundTrip('books') === 'books'",
        "rationale": "Ordinary letters do not introduce query delimiters.",
        "misconception": "Choosing a value without query syntax characters."
      },
      {
        "id": "hyphen",
        "text": "roundTrip('red-blue') === 'red-blue'",
        "rationale": "A hyphen is safe in this query component.",
        "misconception": "Confusing unreserved punctuation with a query separator."
      },
      {
        "id": "digits",
        "text": "roundTrip('007') === '007'",
        "rationale": "parse_str keeps this value as a string, including its leading zeros.",
        "misconception": "Assuming the query parser converts digit values to integers."
      },
      {
        "id": "ampersand",
        "text": "roundTrip('a&b=2') === 'a&b=2'",
        "rationale": "The unencoded ampersand starts a second parameter, so q becomes only a.",
        "misconception": null
      }
    ],
    "correctOptionId": "ampersand",
    "explanation": {
      "summary": "A value must be encoded as a query component before joining it with query syntax. Otherwise characters inside the value become structural separators.",
      "trace": "The faulty query is q=a&b=2. Encoding the value yields q=a%26b%3D2 and restores the entire original string."
    },
    "validation": {
      "kind": "tests",
      "marker": "$query = 'q=' . $term;",
      "repair": "$query = 'q=' . rawurlencode($term);",
      "cases": [
        {
          "option": "word",
          "probe": "echo roundTrip('books');",
          "expected": "books"
        },
        {
          "option": "hyphen",
          "probe": "echo roundTrip('red-blue');",
          "expected": "red-blue"
        },
        {
          "option": "digits",
          "probe": "echo roundTrip('007');",
          "expected": "007"
        },
        {
          "option": "ampersand",
          "probe": "echo roundTrip('a&b=2');",
          "expected": "a&b=2"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/function.parse-str.php",
      "https://www.php.net/manual/en/function.rawurlencode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0184",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Files & structured data",
    "subtopic": "append-mode-seek-regression",
    "objective": {
      "id": "append-mode-seek-regression",
      "text": "Test whether a file mode honors overwriting at a seeked position."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish initial cursor placement from append-mode write semantics."
    },
    "prerequisites": [
      "fopen modes",
      "fseek",
      "File fixtures"
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
          "source": "<?php\n\nfunction writePrefix(string $initial, string $prefix): string\n{\n    $path = __DIR__ . '/fixture.txt';\n    file_put_contents($path, $initial);\n    $handle = fopen($path, 'a+b');\n    fseek($handle, 0);\n    fwrite($handle, $prefix);\n    fclose($handle);\n\n    return file_get_contents($path);\n}\n"
        }
      ]
    },
    "stem": "writePrefix must replace bytes from offset zero without truncating the remaining suffix. The fixture is a fresh local file, all I/O succeeds, and each call resets its contents. Which assertion fails against the implementation?",
    "options": [
      {
        "id": "existing",
        "text": "writePrefix('abcd', 'XY') === 'XYcd'",
        "rationale": "Append mode writes after abcd despite the seek, producing abcdXY.",
        "misconception": null
      },
      {
        "id": "empty-one",
        "text": "writePrefix('', 'X') === 'X'",
        "rationale": "Appending and overwriting are indistinguishable on an empty file.",
        "misconception": "Using an empty fixture to verify an overwrite requirement."
      },
      {
        "id": "empty-many",
        "text": "writePrefix('', 'XYZ') === 'XYZ'",
        "rationale": "Both modes write these bytes into the empty file.",
        "misconception": "Assuming a longer payload changes append semantics on an empty fixture."
      },
      {
        "id": "empty-write",
        "text": "writePrefix('abcd', '') === 'abcd'",
        "rationale": "Writing no bytes leaves the file intact in both modes.",
        "misconception": "Using a no-op write to distinguish cursor behavior."
      }
    ],
    "correctOptionId": "existing",
    "explanation": {
      "summary": "In append mode, writes go to the end even after fseek. r+b opens an existing file for reading and writing without truncating it and respects the selected position.",
      "trace": "The nonempty fixture exposes abcdXY versus XYcd. The other tests cannot distinguish appending from overwriting."
    },
    "validation": {
      "kind": "tests",
      "marker": "fopen($path, 'a+b')",
      "repair": "fopen($path, 'r+b')",
      "cases": [
        {
          "option": "existing",
          "probe": "echo writePrefix('abcd', 'XY');",
          "expected": "XYcd"
        },
        {
          "option": "empty-one",
          "probe": "echo writePrefix('', 'X');",
          "expected": "X"
        },
        {
          "option": "empty-many",
          "probe": "echo writePrefix('', 'XYZ');",
          "expected": "XYZ"
        },
        {
          "option": "empty-write",
          "probe": "echo writePrefix('abcd', '');",
          "expected": "abcd"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
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
    "id": "PHP-E26-0185",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "instant-versus-wall-clock-test",
    "objective": {
      "id": "instant-versus-wall-clock-test",
      "text": "Select a timezone-sensitive test of instant equality."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate displayed local clock fields from a timezone-independent instant."
    },
    "prerequisites": [
      "DateTimeImmutable",
      "UTC offsets",
      "Unix timestamps"
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
          "source": "<?php\n\nfunction sameInstant(string $left, string $right): bool\n{\n    $a = new DateTimeImmutable($left);\n    $b = new DateTimeImmutable($right);\n\n    return $a->format('Y-m-d H:i:s') === $b->format('Y-m-d H:i:s');\n}\n"
        }
      ]
    },
    "stem": "sameInstant must compare instants to whole-second precision. All inputs below have zero fractional seconds. Which assertion fails?",
    "options": [
      {
        "id": "identical",
        "text": "sameInstant('2025-01-01T10:00:00+00:00', '2025-01-01T10:00:00+00:00') === true",
        "rationale": "Identical clocks and offsets identify the same instant.",
        "misconception": "Testing only identical representations."
      },
      {
        "id": "different-clock",
        "text": "sameInstant('2025-01-01T10:00:00+00:00', '2025-01-01T11:00:00+00:00') === false",
        "rationale": "Different clock values with the same offset identify different instants.",
        "misconception": "Testing elapsed time without varying timezone interpretation."
      },
      {
        "id": "same-clock-offset",
        "text": "sameInstant('2025-01-01T10:00:00+00:00', '2025-01-01T10:00:00+01:00') === false",
        "rationale": "The formatted clocks match, but the second instant is one hour earlier.",
        "misconception": null
      },
      {
        "id": "different-date",
        "text": "sameInstant('2025-01-01T10:00:00+00:00', '2025-01-02T10:00:00+00:00') === false",
        "rationale": "The formatted dates already distinguish these instants.",
        "misconception": "Using a date change to test omitted timezone information."
      }
    ],
    "correctOptionId": "same-clock-offset",
    "explanation": {
      "summary": "Formatting without an offset discards information needed to identify an instant. Comparing timestamps meets the stated whole-second contract.",
      "trace": "10:00 at +01:00 is 09:00 UTC, while 10:00 at +00:00 is 10:00 UTC."
    },
    "validation": {
      "kind": "tests",
      "marker": "$a->format('Y-m-d H:i:s') === $b->format('Y-m-d H:i:s')",
      "repair": "$a->getTimestamp() === $b->getTimestamp()",
      "cases": [
        {
          "option": "identical",
          "probe": "echo json_encode(sameInstant('2025-01-01T10:00:00+00:00', '2025-01-01T10:00:00+00:00'));",
          "expected": "true"
        },
        {
          "option": "different-clock",
          "probe": "echo json_encode(sameInstant('2025-01-01T10:00:00+00:00', '2025-01-01T11:00:00+00:00'));",
          "expected": "false"
        },
        {
          "option": "same-clock-offset",
          "probe": "echo json_encode(sameInstant('2025-01-01T10:00:00+00:00', '2025-01-01T10:00:00+01:00'));",
          "expected": "false"
        },
        {
          "option": "different-date",
          "probe": "echo json_encode(sameInstant('2025-01-01T10:00:00+00:00', '2025-01-02T10:00:00+00:00'));",
          "expected": "false"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.php.net/manual/en/book.datetime.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0186",
    "revision": 3,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "regex-optional-capture-null-test",
    "objective": {
      "id": "regex-optional-capture-null-test",
      "text": "Select a test that distinguishes an unmatched optional capture from a captured empty string."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace optional named captures and the interaction between match flags and null coalescing."
    },
    "prerequisites": [
      "preg_match named captures",
      "Optional capture groups",
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
          "source": "<?php\n\nfunction codeOf(string $input): string\n{\n    $pattern = '/\\A(?:(?<code>[A-Z]+):)?(?<body>[a-z]+)\\z/';\n\n    if (preg_match($pattern, $input, $matches) !== 1) {\n        return 'invalid';\n    }\n\n    return $matches['code'] ?? 'none';\n}\n"
        }
      ]
    },
    "stem": "codeOf must return the uppercase code when present, none for a valid body with no code, and invalid for a nonmatching input. Which assertion fails against the implementation?",
    "options": [
      {
        "id": "with-code",
        "text": "codeOf('ABC:note') === 'ABC'",
        "rationale": "A matched optional group contains its captured code as required.",
        "misconception": "Testing only inputs where the optional capture participates."
      },
      {
        "id": "without-code",
        "text": "codeOf('note') === 'none'",
        "rationale": "The unmatched group is an empty string by default, so ?? does not choose none.",
        "misconception": null
      },
      {
        "id": "invalid",
        "text": "codeOf('bad!') === 'invalid'",
        "rationale": "The whole-pattern failure returns invalid before inspecting captures.",
        "misconception": "Testing overall rejection rather than an unmatched group inside a successful match."
      },
      {
        "id": "short-code",
        "text": "codeOf('X:a') === 'X'",
        "rationale": "The one-character code is still a participating capture.",
        "misconception": "Assuming a short capture exercises the same condition as an absent capture."
      }
    ],
    "correctOptionId": "without-code",
    "explanation": {
      "summary": "A successful preg_match can populate an unmatched optional group with an empty string. Null coalescing does not replace an empty string. PREG_UNMATCHED_AS_NULL gives the absent group the null representation expected by this implementation.",
      "trace": "note matches the body but not code. Without the flag, matches[code] is an empty string; with the flag it is null and the fallback becomes none."
    },
    "validation": {
      "kind": "tests",
      "marker": "preg_match($pattern, $input, $matches)",
      "repair": "preg_match($pattern, $input, $matches, PREG_UNMATCHED_AS_NULL)",
      "cases": [
        {
          "option": "with-code",
          "probe": "echo codeOf('ABC:note');",
          "expected": "ABC"
        },
        {
          "option": "without-code",
          "probe": "echo codeOf('note');",
          "expected": "none"
        },
        {
          "option": "invalid",
          "probe": "echo codeOf('bad!');",
          "expected": "invalid"
        },
        {
          "option": "short-code",
          "probe": "echo codeOf('X:a');",
          "expected": "X"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.php.net/manual/en/function.preg-match.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0187",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Arrays & destructuring",
    "subtopic": "unique-scalar-type-test",
    "objective": {
      "id": "unique-scalar-type-test",
      "text": "Test type-preserving deduplication rather than string-based uniqueness."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Find a mixed-type input whose values share a string representation."
    },
    "prerequisites": [
      "Strict comparison",
      "array_unique",
      "array_values"
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
          "source": "<?php\n\nfunction uniqueScalars(array $values): array\n{\n    return array_values(array_unique($values));\n}\n"
        }
      ]
    },
    "stem": "uniqueScalars must retain the first occurrence of each strictly distinct int or string, preserving order and returning a list. Which assertion exposes its defect?",
    "options": [
      {
        "id": "ints",
        "text": "uniqueScalars([2, 2, 3]) === [2, 3]",
        "rationale": "Repeated integer values are removed as required.",
        "misconception": "Testing homogeneous values only."
      },
      {
        "id": "strings",
        "text": "uniqueScalars(['a', 'a', 'b']) === ['a', 'b']",
        "rationale": "Identical strings are removed as required.",
        "misconception": "Assuming duplicate text tests type preservation."
      },
      {
        "id": "leading-zero",
        "text": "uniqueScalars(['01', '1']) === ['01', '1']",
        "rationale": "Default string comparison keeps these distinct representations.",
        "misconception": "Assuming array_unique defaults to numeric comparison."
      },
      {
        "id": "mixed",
        "text": "uniqueScalars([1, '1']) === [1, '1']",
        "rationale": "Default string comparison treats integer 1 and string 1 as equal, losing the string.",
        "misconception": null
      }
    ],
    "correctOptionId": "mixed",
    "explanation": {
      "summary": "array_unique defaults to SORT_STRING. The contract instead requires strict identity, which can be implemented with an explicit strict membership check.",
      "trace": "The integer and string both compare as the string 1 under the current algorithm. Strict in_array keeps both."
    },
    "validation": {
      "kind": "tests",
      "marker": "return array_values(array_unique($values));",
      "repair": "$result = [];\n\n    foreach ($values as $value) {\n        if (!in_array($value, $result, true)) {\n            $result[] = $value;\n        }\n    }\n\n    return $result;",
      "cases": [
        {
          "option": "ints",
          "probe": "echo json_encode(uniqueScalars([2, 2, 3]));",
          "expected": "[2,3]"
        },
        {
          "option": "strings",
          "probe": "echo json_encode(uniqueScalars(['a', 'a', 'b']));",
          "expected": "[\"a\",\"b\"]"
        },
        {
          "option": "leading-zero",
          "probe": "echo json_encode(uniqueScalars(['01', '1']));",
          "expected": "[\"01\",\"1\"]"
        },
        {
          "option": "mixed",
          "probe": "echo json_encode(uniqueScalars([1, '1']));",
          "expected": "[1,\"1\"]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-unique.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0188",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Files & structured data",
    "subtopic": "portable-display-filename-test",
    "objective": {
      "id": "portable-display-filename-test",
      "text": "Test filename display extraction under explicitly mixed path separators."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish host filesystem path rules from an input-format requirement."
    },
    "prerequisites": [
      "String replacement",
      "basename",
      "Platform-specific separators"
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
        "The runtime is POSIX. Inputs are display labels, never paths used for opening files. The display format treats both / and backslash as separators."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction displayName(string $label): string\n{\n    return basename($label);\n}\n"
        }
      ]
    },
    "stem": "displayName must return the last component using either separator in the input format. Which assertion fails on the stated runtime?",
    "options": [
      {
        "id": "windows",
        "text": "displayName('C:\\reports\\item.txt') === 'item.txt'",
        "rationale": "POSIX basename does not interpret backslash as a directory separator.",
        "misconception": null
      },
      {
        "id": "posix",
        "text": "displayName('/reports/item.txt') === 'item.txt'",
        "rationale": "A forward slash is a POSIX separator.",
        "misconception": "Testing only the runtime’s native path format."
      },
      {
        "id": "plain",
        "text": "displayName('item.txt') === 'item.txt'",
        "rationale": "A label with no separator already is its final component.",
        "misconception": "Using a separator-free input to test separator normalization."
      },
      {
        "id": "relative",
        "text": "displayName('reports/item.txt') === 'item.txt'",
        "rationale": "Relative forward-slash paths also work with basename.",
        "misconception": "Assuming only absolute native paths are recognized."
      }
    ],
    "correctOptionId": "windows",
    "explanation": {
      "summary": "basename follows platform path rules. This display-only contract explicitly accepts both separators, so the input must normalize backslashes before basename.",
      "trace": "On POSIX the backslashes remain ordinary characters. Replacing them with forward slashes lets basename find item.txt. This is not a filesystem authorization or sanitization algorithm."
    },
    "validation": {
      "kind": "tests",
      "marker": "basename($label)",
      "repair": "basename(str_replace('\\\\', '/', $label))",
      "cases": [
        {
          "option": "windows",
          "probe": "echo displayName('C:\\reports\\item.txt');",
          "expected": "item.txt"
        },
        {
          "option": "posix",
          "probe": "echo displayName('/reports/item.txt');",
          "expected": "item.txt"
        },
        {
          "option": "plain",
          "probe": "echo displayName('item.txt');",
          "expected": "item.txt"
        },
        {
          "option": "relative",
          "probe": "echo displayName('reports/item.txt');",
          "expected": "item.txt"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.basename.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0189",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Files & structured data",
    "subtopic": "exact-record-terminator-test",
    "objective": {
      "id": "exact-record-terminator-test",
      "text": "Distinguish removing one delimiter from trimming a character set."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace loss of meaningful trailing payload bytes at a framing boundary."
    },
    "prerequisites": [
      "rtrim",
      "substr",
      "Escaped string bytes"
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
        "Every record ends with exactly one framing CRLF sequence. Bytes before that sequence are payload and may include CR or LF."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction payload(string $record): string\n{\n    return rtrim($record, \"\\r\\n\");\n}\n"
        }
      ]
    },
    "stem": "payload must remove only the final framing CRLF. Which assertion fails? Escape sequences in the options denote actual bytes.",
    "options": [
      {
        "id": "plain",
        "text": "payload(\"abc\\r\\n\") === 'abc'",
        "rationale": "The plain payload has no trailing trim characters.",
        "misconception": "Testing only payloads disjoint from the delimiter bytes."
      },
      {
        "id": "empty",
        "text": "payload(\"\\r\\n\") === ''",
        "rationale": "Removing the only delimiter produces the empty payload in both versions.",
        "misconception": "Assuming the empty payload distinguishes trimming from fixed-length removal."
      },
      {
        "id": "payload-lf",
        "text": "payload(\"abc\\n\\r\\n\") === \"abc\\n\"",
        "rationale": "rtrim also removes the LF belonging to the payload.",
        "misconception": null
      },
      {
        "id": "embedded",
        "text": "payload(\"a\\nb\\r\\n\") === \"a\\nb\"",
        "rationale": "The embedded LF is protected by the later b byte.",
        "misconception": "Confusing trailing-character trimming with removal throughout a string."
      }
    ],
    "correctOptionId": "payload-lf",
    "explanation": {
      "summary": "rtrim interprets its second argument as a set of removable trailing characters, not a single suffix. Given the guaranteed framing, removing exactly two bytes preserves payload line breaks.",
      "trace": "For abc LF CR LF, rtrim removes all three trailing control bytes; substr with length -2 removes only the framing CR LF."
    },
    "validation": {
      "kind": "tests",
      "marker": "rtrim($record, \"\\r\\n\")",
      "repair": "substr($record, 0, -2)",
      "cases": [
        {
          "option": "plain",
          "probe": "echo json_encode(payload(\"abc\\r\\n\"));",
          "expected": "\"abc\""
        },
        {
          "option": "empty",
          "probe": "echo json_encode(payload(\"\\r\\n\"));",
          "expected": "\"\""
        },
        {
          "option": "payload-lf",
          "probe": "echo json_encode(payload(\"abc\\n\\r\\n\"));",
          "expected": "\"abc\\n\""
        },
        {
          "option": "embedded",
          "probe": "echo json_encode(payload(\"a\\nb\\r\\n\"));",
          "expected": "\"a\\nb\""
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.rtrim.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0190",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "spy-verifies-side-effect-arguments",
    "objective": {
      "id": "spy-verifies-side-effect-arguments",
      "text": "Choose a test observation that verifies the payload sent to a dependency."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate return-value correctness from an externally visible collaborator call."
    },
    "prerequisites": [
      "Dependency injection",
      "Test spies",
      "JSON encoding"
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
          "source": "<?php\n\nfunction publish(array $data, callable $send): string\n{\n    return $send(json_encode([]));\n}\n\n$calls = [];\n$receipt = publish(['event' => 'ready'], function (string $body) use (&$calls): string {\n    $calls[] = $body;\n\n    return 'receipt-1';\n});\n"
        }
      ]
    },
    "stem": "publish must pass JSON for the supplied data to the sender exactly once and return its receipt. The sender here is a local spy. Which assertion fails after this call?",
    "options": [
      {
        "id": "return",
        "text": "$receipt === 'receipt-1'",
        "rationale": "The sender’s receipt is returned even though its argument is wrong.",
        "misconception": "Treating the returned receipt as evidence that the correct payload was sent."
      },
      {
        "id": "payload",
        "text": "$calls === ['{\"event\":\"ready\"}']",
        "rationale": "The spy recorded [] instead of the supplied event object.",
        "misconception": null
      },
      {
        "id": "count",
        "text": "count($calls) === 1",
        "rationale": "The defect changes the argument, not the number of calls.",
        "misconception": "Testing invocation count without observing the transmitted data."
      },
      {
        "id": "type",
        "text": "is_string($calls[0]) === true",
        "rationale": "The wrong JSON payload is still a string.",
        "misconception": "Using a broad type assertion to verify specific payload contents."
      }
    ],
    "correctOptionId": "payload",
    "explanation": {
      "summary": "A spy exposes collaborator arguments. A return-value assertion or call-count assertion cannot detect sending the wrong JSON body.",
      "trace": "The function encodes an empty array and calls the spy once. Changing json_encode([]) to json_encode($data) preserves the receipt and count while correcting the body."
    },
    "validation": {
      "kind": "tests",
      "marker": "json_encode([])",
      "repair": "json_encode($data)",
      "cases": [
        {
          "option": "return",
          "probe": "echo $receipt;",
          "expected": "receipt-1"
        },
        {
          "option": "payload",
          "probe": "echo json_encode($calls);",
          "expected": "[\"{\\\"event\\\":\\\"ready\\\"}\"]"
        },
        {
          "option": "count",
          "probe": "echo count($calls);",
          "expected": "1"
        },
        {
          "option": "type",
          "probe": "echo json_encode(is_string($calls[0]));",
          "expected": "true"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://docs.phpunit.de/en/12.5/writing-tests-for-phpunit.html",
      "https://www.php.net/manual/en/ref.json.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0191",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Classes & object lifecycle",
    "subtopic": "property-hook-assignment-result-test",
    "objective": {
      "id": "property-hook-assignment-result-test",
      "text": "Test the distinction between an assignment expression and the value stored by a set hook."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine PHP 8.4 property hooks with expression evaluation and normalization."
    },
    "prerequisites": [
      "PHP 8.4 property hooks",
      "Assignment expression values"
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
          "source": "<?php\n\nclass Label\n{\n    public string $name = '' {\n        set {\n            $this->name = trim($value);\n        }\n    }\n}\n\nfunction renameLabel(string $input): string\n{\n    $label = new Label();\n\n    return $label->name = $input;\n}\n"
        }
      ]
    },
    "stem": "renameLabel must return the normalized name that the object now stores. Which assertion exposes the defect? The hook is the only normalization step.",
    "options": [
      {
        "id": "plain",
        "text": "renameLabel('Ada') === 'Ada'",
        "rationale": "Already normalized text equals both the input and stored value.",
        "misconception": "Testing only input unchanged by the hook."
      },
      {
        "id": "empty",
        "text": "renameLabel('') === ''",
        "rationale": "The empty input is unchanged by trim.",
        "misconception": "Assuming an empty value exercises a normalization difference."
      },
      {
        "id": "internal",
        "text": "renameLabel('Ada Lovelace') === 'Ada Lovelace'",
        "rationale": "trim leaves internal spaces intact.",
        "misconception": "Confusing trim with removal of all spaces."
      },
      {
        "id": "padded",
        "text": "renameLabel(' Ada ') === 'Ada'",
        "rationale": "The hook stores Ada, but the assignment expression evaluates to the original padded input.",
        "misconception": null
      }
    ],
    "correctOptionId": "padded",
    "explanation": {
      "summary": "A set hook can transform the stored value without changing the result of the assignment expression. Read the property after assignment when the API promises its normalized stored value.",
      "trace": "The hook stores trim($input). The return expression still returns $input; the repair assigns first and then reads $label->name."
    },
    "validation": {
      "kind": "tests",
      "marker": "return $label->name = $input;",
      "repair": "$label->name = $input;\n\n    return $label->name;",
      "cases": [
        {
          "option": "plain",
          "probe": "echo renameLabel('Ada');",
          "expected": "Ada"
        },
        {
          "option": "empty",
          "probe": "echo renameLabel('');",
          "expected": ""
        },
        {
          "option": "internal",
          "probe": "echo renameLabel('Ada Lovelace');",
          "expected": "Ada Lovelace"
        },
        {
          "option": "padded",
          "probe": "echo renameLabel(' Ada ');",
          "expected": "Ada"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.property-hooks.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0192",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Errors & exceptions",
    "subtopic": "retry-classification-permanent-cause-barrier",
    "objective": {
      "id": "retry-classification-permanent-cause-barrier",
      "text": "Test outward failure-policy overrides while retaining an exception’s diagnostic cause chain."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate causal history from retry authority across infrastructure and domain exception layers."
    },
    "prerequisites": [
      "Exception chaining",
      "Retry classification",
      "Infrastructure versus domain failure policy"
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
        "The explicit policy is to scan from the outermost exception inward. A PermanentFailure means the operation must not be retried, even if its cause was transient. A TransientFailure permits retry only if no outer PermanentFailure was encountered. Generic wrappers defer to their causes; no recognized classification means no retry."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass TransientFailure extends RuntimeException\n{\n}\n\nclass PermanentFailure extends RuntimeException\n{\n}\n\nfunction shouldRetry(Throwable $error): bool\n{\n    do {\n        // Classification boundary goes here.\n        if ($error instanceof TransientFailure) {\n            return true;\n        }\n\n        $error = $error->getPrevious();\n    } while ($error !== null);\n\n    return false;\n}\n"
        }
      ]
    },
    "stem": "Which assertion fails against the implementation and the stated retry policy? Constructors accept message, code and previous in the standard RuntimeException order.",
    "options": [
      {
        "id": "transient",
        "text": "shouldRetry(new TransientFailure('timeout')) === true",
        "rationale": "An outer transient classification permits retry in both implementations.",
        "misconception": "Testing the positive infrastructure signal without a domain override."
      },
      {
        "id": "permanent-wrap",
        "text": "shouldRetry(new PermanentFailure('cancelled', 0, new TransientFailure('timeout'))) === false",
        "rationale": "The current loop passes through the permanent override and incorrectly accepts its transient cause.",
        "misconception": null
      },
      {
        "id": "generic-wrap",
        "text": "shouldRetry(new RuntimeException('adapter', 0, new TransientFailure('timeout'))) === true",
        "rationale": "A generic wrapper is explicitly allowed to defer to its cause.",
        "misconception": "Treating every wrapper as a permanent retry barrier."
      },
      {
        "id": "unclassified",
        "text": "shouldRetry(new RuntimeException('unknown')) === false",
        "rationale": "The loop finds no transient signal and already returns false.",
        "misconception": "Using an unclassified failure to test precedence between conflicting classifications."
      }
    ],
    "correctOptionId": "permanent-wrap",
    "explanation": {
      "summary": "A diagnostic cause explains how an operation failed; it does not necessarily authorize retrying the outer operation. The stated domain policy makes an outer PermanentFailure a barrier before inner transient causes are examined.",
      "trace": "The failing case currently skips PermanentFailure and reaches TransientFailure, returning true. Checking for PermanentFailure before the transient test returns false at the outer layer without deleting the cause chain."
    },
    "validation": {
      "kind": "tests",
      "marker": "// Classification boundary goes here.",
      "repair": "if ($error instanceof PermanentFailure) {\n            return false;\n        }\n",
      "cases": [
        {
          "option": "transient",
          "probe": "echo json_encode(shouldRetry(new TransientFailure('timeout')));",
          "expected": "true"
        },
        {
          "option": "permanent-wrap",
          "probe": "echo json_encode(shouldRetry(new PermanentFailure('cancelled', 0, new TransientFailure('timeout'))));",
          "expected": "false"
        },
        {
          "option": "generic-wrap",
          "probe": "echo json_encode(shouldRetry(new RuntimeException('adapter', 0, new TransientFailure('timeout'))));",
          "expected": "true"
        },
        {
          "option": "unclassified",
          "probe": "echo json_encode(shouldRetry(new RuntimeException('unknown')));",
          "expected": "false"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/exception.getprevious.php",
      "https://www.php.net/manual/en/language.exceptions.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0193",
    "revision": 3,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "domain-outcome-transport-specific-mapping",
    "objective": {
      "id": "domain-outcome-transport-specific-mapping",
      "text": "Keep business outcomes reusable while HTTP and CLI adapters choose different transport representations."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate a domain decision from protocol status and process exit conventions."
    },
    "prerequisites": [
      "PHP service boundaries",
      "HTTP response status",
      "CLI exit codes"
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
        "A validation use case is shared by HTTP and CLI entry points. Invalid input must become HTTP status 422 in the HTTP adapter and process exit code 2 in the CLI adapter. The domain API must contain no HTTP or CLI concepts, and adding another transport must not change it."
      ],
      "files": []
    },
    "stem": "Which responsibility split preserves these boundaries while letting both entry points reuse the same validation decision?",
    "options": [
      {
        "id": "http-domain",
        "text": "Return an HTTP status from the domain use case and make every adapter interpret that status.",
        "rationale": "This makes the domain API and non-HTTP adapters depend on HTTP semantics.",
        "misconception": "Using one transport’s status vocabulary as the shared business result."
      },
      {
        "id": "sapi-branch",
        "text": "Have the domain use case inspect PHP_SAPI and choose the HTTP status or CLI exit code itself.",
        "rationale": "The domain now knows both transports and needs changes when another transport is added.",
        "misconception": "Treating runtime detection as separation of domain and transport concerns."
      },
      {
        "id": "domain-outcome",
        "text": "Return a transport-neutral validation outcome; each adapter maps it to its own status or exit code.",
        "rationale": "The domain decision stays unchanged while each adapter owns its transport representation.",
        "misconception": null
      },
      {
        "id": "paired-statuses",
        "text": "Return both an HTTP status and a CLI exit code from the domain result object.",
        "rationale": "The domain result explicitly contains transport concepts and must expand for a new transport.",
        "misconception": "Assuming packaging multiple transport details in a DTO removes the coupling."
      }
    ],
    "correctOptionId": "domain-outcome",
    "explanation": {
      "summary": "The validation decision is shared business information; HTTP response status and CLI exit status are adapter responsibilities. A neutral result lets those mappings differ without embedding transport policy in the domain API.",
      "trace": "The HTTP adapter maps an invalid result to 422; the CLI adapter maps it to exit code 2. A later adapter adds its own mapping without changing the validation decision or its domain representation."
    },
    "validation": {
      "kind": "document-review",
      "rule": "The stated domain API must express only the shared validation decision. Each entry point owns the required HTTP status or CLI exit code; adding a transport must not alter the domain API.",
      "optionAudit": {
        "http-domain": "HTTP status 422 becomes part of the shared API, making the CLI depend on HTTP semantics.",
        "sapi-branch": "Transport detection and per-transport branches move into the shared validation service.",
        "domain-outcome": "A neutral validation result is reusable; the entry points separately map it to 422 or 2.",
        "paired-statuses": "The domain result carries transport-specific fields and needs extension for another transport."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php.net/manual/en/language.enumerations.php",
      "https://www.php.net/manual/en/function.http-response-code.php",
      "https://www.php.net/manual/en/function.exit.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0194",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "composer-function-autoload-registration",
    "objective": {
      "id": "composer-function-autoload-registration",
      "text": "Choose an autoload mechanism for a package exposing standalone PHP functions."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish function availability from class-name-triggered autoloading."
    },
    "prerequisites": [
      "Composer autoload configuration (unmapped curriculum)",
      "Namespaced functions",
      "PSR-4"
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
        "Composer 2 generates vendor/autoload.php. The package exposes function Acme\\Text\\slug in src/functions.php. That file only declares functions and has no I/O or other initialization side effects. Consumers must be able to call the function immediately after requiring vendor/autoload.php."
      ],
      "files": []
    },
    "stem": "Which package configuration satisfies this function API without requiring consumers to instantiate a helper class first?",
    "options": [
      {
        "id": "files",
        "text": "List src/functions.php under autoload.files.",
        "rationale": "Composer includes files entries when its autoloader is included, making the functions available.",
        "misconception": null
      },
      {
        "id": "psr4",
        "text": "Map Acme\\Text\\ to src/ under autoload.psr-4.",
        "rationale": "PSR-4 class lookup does not trigger when an undefined function is called.",
        "misconception": "Assuming namespace-based function calls invoke the class autoloader."
      },
      {
        "id": "classmap",
        "text": "Add src/functions.php to autoload.classmap.",
        "rationale": "Classmap generation discovers classes, not a callable function-name loading map.",
        "misconception": "Treating classmaps as general symbol tables for functions."
      },
      {
        "id": "dev-files",
        "text": "List src/functions.php only under autoload-dev.files.",
        "rationale": "Root-only development autoload rules do not provide a dependency package’s public runtime API.",
        "misconception": "Making a required runtime function depend on development-only root configuration."
      }
    ],
    "correctOptionId": "files",
    "explanation": {
      "summary": "PHP class autoloading is not function autoloading. Composer files entries load function declarations eagerly when vendor/autoload.php is required.",
      "trace": "A consumer requires the generated autoloader. Its files loader includes functions.php before the consumer calls Acme\\Text\\slug."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Composer files autoloading includes declared files on autoloader inclusion; autoload-dev is root-only.",
      "optionAudit": {
        "files": "Includes the required declaration before the first function call.",
        "psr4": "No class lookup occurs at the function call.",
        "classmap": "Does not make standalone function calls trigger loading.",
        "dev-files": "A dependency cannot export its required API through its own root-only development configuration."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://getcomposer.org/doc/04-schema.md#files",
      "https://getcomposer.org/doc/04-schema.md#autoload-dev"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0195",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "HTTP & superglobals",
    "subtopic": "request-input-provenance-contract",
    "objective": {
      "id": "request-input-provenance-contract",
      "text": "Preserve a body-only field contract across PHP request-order configurations."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate input provenance from merged request convenience data."
    },
    "prerequisites": [
      "$_POST",
      "$_GET",
      "$_REQUEST",
      "Input validation"
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
        "The endpoint accepts only POST requests with application/x-www-form-urlencoded bodies. An action field is permitted only in that body. Query strings and cookies may contain an action key but must never supply or override the body value. PHP request_order may differ between deployments."
      ],
      "files": []
    },
    "stem": "Where should the request adapter obtain action before validating that it is one allowed scalar string?",
    "options": [
      {
        "id": "request",
        "text": "Read $_REQUEST['action']; request_order already defines one consistent source.",
        "rationale": "The merged source and precedence depend on configuration and do not establish body-only provenance.",
        "misconception": "Using deployment merge precedence as an API source contract."
      },
      {
        "id": "merge",
        "text": "Merge $_GET and $_POST with body values last, then read action.",
        "rationale": "When the body omits action, the query value still supplies it.",
        "misconception": "Treating body precedence as equivalent to requiring body presence."
      },
      {
        "id": "fallback",
        "text": "Read $_POST['action'] and fall back to $_REQUEST when it is absent.",
        "rationale": "The fallback explicitly admits a non-body value for a required body field.",
        "misconception": "Applying a convenience fallback across a trust or provenance boundary."
      },
      {
        "id": "post",
        "text": "Read action directly from $_POST and reject a missing or non-scalar value.",
        "rationale": "This enforces the stated body source independently of merged request configuration.",
        "misconception": null
      }
    ],
    "correctOptionId": "post",
    "explanation": {
      "summary": "The adapter should enforce the API’s source contract before value validation. $_POST represents parsed form body fields under the stated content type; $_REQUEST is a configurable merge.",
      "trace": "If only ?action=delete is present, a body-only endpoint must reject the missing body field. Both merging and fallback would incorrectly admit it."
    },
    "validation": {
      "kind": "document-review",
      "rule": "$_REQUEST contents and ordering depend on request_order/variables_order; a body-only form contract must use the body source.",
      "optionAudit": {
        "request": "Cannot guarantee provenance across configuration changes.",
        "merge": "Admits query-only action when the body omits it.",
        "fallback": "Admits an alternate source precisely when the body field is missing.",
        "post": "Keeps body presence and scalar validation explicit."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/reserved.variables.request.php",
      "https://www.php.net/manual/en/reserved.variables.post.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0196",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Performance, processes & servers",
    "subtopic": "cache-miss-coalescing-lock-recheck",
    "objective": {
      "id": "cache-miss-coalescing-lock-recheck",
      "text": "Design cache regeneration that avoids duplicate work by waiting contenders."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace two workers through a cache miss and serialized lock acquisition."
    },
    "prerequisites": [
      "Shared cache",
      "Mutual exclusion",
      "Waiting worker schedules"
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
        "Two PHP workers share a cache and a reliable per-key exclusive mutex. Cache writes become visible before unlock. Values do not expire during this scenario. Loading the source is expensive but has no side effects. Both workers initially observe a miss."
      ],
      "files": []
    },
    "stem": "Worker A acquires the mutex, loads the value, writes the cache and releases the mutex. Worker B then acquires it. Which miss-handling design prevents B from needlessly loading the same source again while still returning a value?",
    "options": [
      {
        "id": "lock-load",
        "text": "On an initial miss, acquire the mutex, load the source, cache it, and unlock.",
        "rationale": "B serializes behind A but still loads unconditionally after acquiring the lock.",
        "misconception": "Assuming serialization alone coalesces repeated work."
      },
      {
        "id": "recheck",
        "text": "On an initial miss, acquire the mutex, re-read the cache, load only if still absent, and unlock.",
        "rationale": "B observes A’s cached result after waiting and skips the duplicate load.",
        "misconception": null
      },
      {
        "id": "preload",
        "text": "On an initial miss, load the source first, then acquire the mutex only for the cache write.",
        "rationale": "Both workers perform the expensive load before the write is serialized.",
        "misconception": "Protecting publication while leaving the expensive work duplicated."
      },
      {
        "id": "skip-wait",
        "text": "On an initial miss, try the mutex once and return null if another worker holds it.",
        "rationale": "A contender receives no value, contrary to the requirement that it return the result.",
        "misconception": "Trading away the response contract instead of waiting for shared work."
      }
    ],
    "correctOptionId": "recheck",
    "explanation": {
      "summary": "The initial miss may become stale while a worker waits for the mutex. Rechecking under the lock distinguishes a still-missing value from work completed by the previous holder.",
      "trace": "A publishes the value before unlock. B’s second cache read sees it and returns it without loading again, then releases the mutex."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Apply the explicit mutex and visibility assumptions to the stated two-worker schedule.",
      "optionAudit": {
        "lock-load": "B always reloads after A.",
        "recheck": "B reads the newly published value under the lock.",
        "preload": "Both loads precede serialized writes.",
        "skip-wait": "A waiting contender can return null instead of a value."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://www.php.net/manual/en/language.exceptions.php",
      "https://www.php.net/manual/en/function.flock.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0197",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "configuration-composition-boundary",
    "objective": {
      "id": "configuration-composition-boundary",
      "text": "Place deployment configuration parsing outside reusable domain services."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Choose a boundary that supports per-instance policy values and early validation."
    },
    "prerequisites": [
      "Service configuration",
      "Object lifetime",
      "Value validation"
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
        "A PHP service calculates shipping using a nonnegative integer free-shipping threshold. HTTP and CLI entry points share it. One process may use two service instances with different thresholds. Invalid deployment configuration must fail before either instance handles an order."
      ],
      "files": []
    },
    "stem": "Which design satisfies these lifecycle requirements?",
    "options": [
      {
        "id": "method-env",
        "text": "Read and validate the environment variable inside calculate() for each order.",
        "rationale": "Invalid configuration is discovered while handling an order, and both instances read the same process setting.",
        "misconception": "Treating request-time configuration access as startup validation and instance isolation."
      },
      {
        "id": "static-cache",
        "text": "Parse the environment variable on the first calculation and cache it in a static property.",
        "rationale": "The first order triggers validation, and the cached value is shared across instances.",
        "misconception": "Using lazy global caching for an instance-specific policy."
      },
      {
        "id": "constructor-value",
        "text": "Parse configuration in each entry point’s composition code, then pass a validated threshold into each service constructor.",
        "rationale": "Configuration fails before use and each service receives its own explicit policy value.",
        "misconception": null
      },
      {
        "id": "global-constant",
        "text": "Define one process-wide threshold constant in the bootstrap and have every service read it.",
        "rationale": "Startup validation is possible, but two instances cannot use different thresholds.",
        "misconception": "Confusing immutable process configuration with independently configurable instances."
      }
    ],
    "correctOptionId": "constructor-value",
    "explanation": {
      "summary": "Composition code adapts deployment configuration into validated service inputs. The domain service then depends on an explicit per-instance value, not a process-wide lookup.",
      "trace": "Bootstrap parsing rejects invalid values before constructing services. Two constructor calls can supply distinct validated thresholds within the same process."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Evaluate each design against both early failure and two simultaneous instance values.",
      "optionAudit": {
        "method-env": "Fails the pre-order validation and independent-instance requirements.",
        "static-cache": "Fails early validation and shares one value.",
        "constructor-value": "Meets both requirements through explicit validated construction.",
        "global-constant": "Meets early validation but cannot represent two instance values."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.php",
      "https://www.php.net/manual/en/language.constants.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0198",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Performance, processes & servers",
    "subtopic": "expired-lease-fencing-writes",
    "objective": {
      "id": "expired-lease-fencing-writes",
      "text": "Reject writes from a resumed worker whose exclusive lease has expired."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Distinguish lease ownership at acquisition from authority at a later external write."
    },
    "prerequisites": [
      "Distributed leases (advanced)",
      "Increasing lease tokens",
      "Atomic storage preconditions"
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
        "A PHP worker A obtains lease token 7 and pauses. Its lease expires; worker B obtains token 8 and writes successfully. A then resumes and sends its old write. Tokens are strictly increasing. The protected storage supports atomic conditional writes and per-resource metadata."
      ],
      "files": []
    },
    "stem": "Which design prevents A’s delayed write from overwriting B’s result even if A cannot detect that it was paused?",
    "options": [
      {
        "id": "fence",
        "text": "Send the lease token with every write; storage rejects tokens lower than the largest accepted token.",
        "rationale": "After accepting token 8, storage rejects A’s token 7 regardless of A’s local state.",
        "misconception": null
      },
      {
        "id": "long-lease",
        "text": "Increase the lease duration so ordinary source reads finish before expiry.",
        "rationale": "The stated pause can still outlast the lease; duration does not reject the delayed write.",
        "misconception": "Treating a timing estimate as a correctness guarantee."
      },
      {
        "id": "local-check",
        "text": "Check lease expiry immediately before building the outgoing write request.",
        "rationale": "The worker can pause again between the check and the storage applying the write.",
        "misconception": "Assuming a local check and remote mutation form one atomic operation."
      },
      {
        "id": "unlock-check",
        "text": "Verify ownership before releasing the lease after the write.",
        "rationale": "The stale overwrite has already happened before this check.",
        "misconception": "Applying ownership validation only to cleanup after the protected action."
      }
    ],
    "correctOptionId": "fence",
    "explanation": {
      "summary": "The protected resource must reject stale authority at the point of mutation. A monotonic fencing token lets storage make that decision atomically even when the worker is delayed.",
      "trace": "Storage records token 8 with B’s successful write. A later submits token 7, which is lower and is rejected without altering B’s result."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Use the stated monotonic token and atomic storage comparison contract; no real distributed service is contacted.",
      "optionAudit": {
        "fence": "Token 7 is rejected after token 8.",
        "long-lease": "A longer finite pause still defeats the timing assumption.",
        "local-check": "A pause after the check preserves the race.",
        "unlock-check": "The check occurs after the harmful mutation."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://www.usenix.org/legacy/event/osdi06/tech/full_papers/burrows/burrows_html/"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0199",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "ordered-event-gap-recovery",
    "objective": {
      "id": "ordered-event-gap-recovery",
      "text": "Preserve per-entity transition order when an at-least-once transport delivers events out of order."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine duplicate suppression, sequence validation and recovery of missing transitions."
    },
    "prerequisites": [
      "At-least-once delivery (advanced)",
      "Per-entity versions",
      "Transactional consumer state"
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
        "A PHP projection has applied entity version 4. Events carry consecutive versions and noncommutative transitions; applying 6 before 5 is invalid. Version 6 arrives first, then 5, and any event may be redelivered. A durable store can atomically update the projection and applied version. Missing events can be fetched from an authoritative log."
      ],
      "files": []
    },
    "stem": "Which consumer strategy preserves the required order without permanently losing version 6?",
    "options": [
      {
        "id": "id-only",
        "text": "Deduplicate event IDs and apply unseen events in arrival order in one projection transaction; acknowledge after commit.",
        "rationale": "Unique event IDs do not make version 6 valid before version 5.",
        "misconception": "Treating duplicate suppression as an ordering guarantee."
      },
      {
        "id": "highest",
        "text": "Atomically apply any newer version and store its number; acknowledge after commit and acknowledge older deliveries without applying them.",
        "rationale": "Applying 6 skips transition 5 and later discards it as older.",
        "misconception": "Treating a high-water mark as proof that all earlier transitions were applied."
      },
      {
        "id": "drop-gap",
        "text": "Atomically apply only the next version; acknowledge other deliveries without retaining them, relying on redelivery after a gap is filled.",
        "rationale": "Version 6 is lost when first acknowledged, even if version 5 arrives later.",
        "misconception": "Checking order without preserving or recovering deferred work."
      },
      {
        "id": "recover-gap",
        "text": "Apply stored version + 1 atomically; ignore already applied versions, and durably defer gaps while recovering missing versions.",
        "rationale": "The gap is retained or recovered, so 5 can be applied before 6 while redeliveries remain harmless.",
        "misconception": null
      }
    ],
    "correctOptionId": "recover-gap",
    "explanation": {
      "summary": "Sequence checks prevent invalid transitions, but gaps also require a recovery path. Atomic projection/version updates distinguish already applied events from the next event and from future events.",
      "trace": "Version 6 is deferred when the stored version is 4. After version 5 is applied, version 6 becomes the next admissible transition; repeated versions at or below the applied version do not apply again."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Evaluate the provided 6-before-5 schedule with atomic applied-version updates and durable gap recovery.",
      "optionAudit": {
        "id-only": "Applies a distinct but premature version 6.",
        "highest": "Skips version 5 permanently.",
        "drop-gap": "Acknowledges version 6 without preserving it.",
        "recover-gap": "Preserves order and retains a route to eventual application."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.enterpriseintegrationpatterns.com/patterns/messaging/Resequencer.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0200",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "PDO & database access",
    "subtopic": "pooled-tenant-setting-transaction-scope",
    "objective": {
      "id": "pooled-tenant-setting-transaction-scope",
      "text": "Scope tenant context to a transaction when PHP workers reuse database connections."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Connect persistent session state, transaction boundaries and a row-security policy."
    },
    "prerequisites": [
      "PDO connection reuse (advanced)",
      "PostgreSQL session and transaction settings",
      "Row-level security",
      "Transactions"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "Requirements scenario; no executable PHP source",
      "extensions": [
        "PDO",
        "pdo_pgsql (scenario only; not executed)"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "A long-lived PHP worker must reuse a PostgreSQL 18 connection across tenants. The reusable connection starts with no session-level app.tenant_id value. An existing row-security policy reads a custom app.tenant_id setting; unset or empty context denies all rows. The worker has no row-security bypass privilege. Each job’s queries must run in one explicit transaction, and failed rollback makes the connection unusable and discarded."
      ],
      "files": []
    },
    "stem": "Which context design prevents a completed job’s tenant setting from becoming the next job’s context while preserving the required connection reuse?",
    "options": [
      {
        "id": "session-once",
        "text": "Use session-level SET app.tenant_id once when the reusable connection is created.",
        "rationale": "The setting persists across later jobs, which may belong to different tenants.",
        "misconception": "Assigning per-job identity at connection lifetime scope."
      },
      {
        "id": "local-every-job",
        "text": "Begin each job transaction, set app.tenant_id locally for that transaction, then commit or roll back before reuse.",
        "rationale": "SET LOCAL ends with the transaction, so tenant context does not persist into the next job.",
        "misconception": null
      },
      {
        "id": "set-if-empty",
        "text": "Before a job, set app.tenant_id only if the session currently has no value.",
        "rationale": "A prior tenant’s nonempty session value would be reused for a different tenant.",
        "misconception": "Treating existing context as valid without binding it to the current job."
      },
      {
        "id": "after-success",
        "text": "Before BEGIN, use session-level SET for each job; clear it only after a successful commit.",
        "rationale": "The SET made before BEGIN survives rollback, and failure skips the success-only cleanup.",
        "misconception": "Limiting context cleanup to the success path."
      }
    ],
    "correctOptionId": "local-every-job",
    "explanation": {
      "summary": "A tenant identity is job-scoped state. PostgreSQL SET LOCAL ties it to the current transaction rather than the reusable connection session; the stated transaction completion and discard rules close the failure path.",
      "trace": "The job begins a transaction and installs its local tenant value before queries. Commit or rollback ends that local setting. The next job must install its own context in a new transaction."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PostgreSQL SET LOCAL lasts only for the current transaction; apply the explicit connection lifecycle and fail-closed policy premises.",
      "optionAudit": {
        "session-once": "Leaks connection-lifetime identity into later tenants.",
        "local-every-job": "Context expires with each successfully ended transaction.",
        "set-if-empty": "Reuses another tenant’s nonempty setting.",
        "after-success": "The session SET occurs before BEGIN, so rollback does not undo it and failure skips cleanup."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 2
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.postgresql.org/docs/18/sql-set.html",
      "https://www.php.net/manual/en/features.persistent-connections.php"
    ]
  }
];
