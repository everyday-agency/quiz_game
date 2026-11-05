// Accepted for local independent review only. Production activation is not authorized.
export default [
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0501",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Syntax & execution model",
    "subtopic": "nowdoc-literal-variable-text-without-final-newline",
    "objective": {
      "id": "nowdoc-literal-variable-text-without-final-newline",
      "text": "Predict literal variable-looking text in a nowdoc string without adding the delimiter line’s newline."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish a nowdoc literal from interpolating string syntax."
    },
    "prerequisites": [
      "Nowdoc syntax",
      "String interpolation",
      "strlen for ASCII"
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
          "source": "<?php\n\n$name = 'Ada';\n$text = <<<'MESSAGE'\nHi $name\nMESSAGE;\n\necho json_encode([$text, strlen($text)]);\n"
        }
      ]
    },
    "stem": "What JSON pair contains the nowdoc text and its byte length?",
    "options": [
      {
        "id": "interpolated",
        "text": "[\"Hi Ada\",6]",
        "rationale": "The quoted nowdoc delimiter disables variable interpolation.",
        "misconception": "Treating nowdoc as interpolating heredoc."
      },
      {
        "id": "literal-text",
        "text": "[\"Hi $name\",8]",
        "rationale": "The variable-looking characters remain literal, and the newline before the closing delimiter is not included.",
        "misconception": null
      },
      {
        "id": "final-newline",
        "text": "[\"Hi $name\\n\",9]",
        "rationale": "The delimiter line’s preceding newline is not part of the string content.",
        "misconception": "Counting the syntax boundary newline as literal content."
      },
      {
        "id": "empty-variable",
        "text": "[\"Hi \",3]",
        "rationale": "No variable lookup occurs; the literal text is not removed.",
        "misconception": "Assuming a noninterpolating literal discards variable-looking text."
      }
    ],
    "correctOptionId": "literal-text",
    "explanation": {
      "summary": "A nowdoc uses a single-quoted opening identifier and preserves its body literally. Its closing-delimiter boundary does not add a final newline to this one-line value.",
      "trace": "The eight bytes are H, i, space, $, n, a, m, e. The separate name variable is not read."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"Hi $name\",8]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-01"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.string.php#language.types.string.syntax.nowdoc"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0502",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Operators & expressions",
    "subtopic": "spaceship-three-way-comparison-results",
    "objective": {
      "id": "spaceship-three-way-comparison-results",
      "text": "Interpret the spaceship operator as a signed three-way comparison rather than a boolean or arithmetic difference."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish less-than, equality and greater-than outcomes across three integer pairs."
    },
    "prerequisites": [
      "Integer ordering",
      "Spaceship operator",
      "JSON numeric values"
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
          "source": "<?php\n\necho json_encode([\n    2 <=> 9,\n    4 <=> 4,\n    12 <=> 3,\n]);\n"
        }
      ]
    },
    "stem": "Which JSON list contains the results of these three-way comparisons?",
    "options": [
      {
        "id": "boolean-comparisons",
        "text": "[true,false,false]",
        "rationale": "These are less-than predicate results, not the spaceship operator’s signed outcomes.",
        "misconception": "Reading <=> as a boolean less-than comparison."
      },
      {
        "id": "numeric-differences",
        "text": "[-7,0,9]",
        "rationale": "Spaceship reports ordering with -1, 0 or 1, not the distance between operands.",
        "misconception": "Substituting subtraction for a three-way ordering result."
      },
      {
        "id": "reversed-signs",
        "text": "[1,0,-1]",
        "rationale": "The sign is negative when the left operand is smaller, not when it is larger.",
        "misconception": "Reversing the comparator’s ordering convention."
      },
      {
        "id": "three-way",
        "text": "[-1,0,1]",
        "rationale": "The first left operand is smaller, the second pair is equal and the third left operand is larger.",
        "misconception": null
      }
    ],
    "correctOptionId": "three-way",
    "explanation": {
      "summary": "The spaceship operator returns -1, 0 or 1 for less than, equal to or greater than. It does not encode the magnitude of the difference.",
      "trace": "2 is below 9, 4 equals 4, and 12 exceeds 3, yielding -1, 0 and 1 in that order."
    },
    "validation": {
      "kind": "output",
      "stdout": "[-1,0,1]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.comparison.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0503",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "explode-negative-limit-omits-final-components",
    "objective": {
      "id": "explode-negative-limit-omits-final-components",
      "text": "Interpret a negative explode limit as removing trailing components rather than limiting the number of splits."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish negative-limit behavior from positive-limit remainder grouping."
    },
    "prerequisites": [
      "explode delimiter splitting",
      "Signed limit parameter",
      "Array order"
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
          "source": "<?php\n\n$parts = explode(':', 'a:b:c:d', -2);\n\necho json_encode($parts);\n"
        }
      ]
    },
    "stem": "What JSON is returned for this negative explode limit?",
    "options": [
      {
        "id": "drop-last-two",
        "text": "[\"a\",\"b\"]",
        "rationale": "A negative limit omits that many components from the end of the fully split result.",
        "misconception": null
      },
      {
        "id": "positive-two",
        "text": "[\"a\",\"b:c:d\"]",
        "rationale": "That remainder grouping corresponds to a positive limit of 2, not -2.",
        "misconception": "Applying positive-limit semantics after ignoring the sign."
      },
      {
        "id": "last-two",
        "text": "[\"c\",\"d\"]",
        "rationale": "The negative limit removes the last two components; it does not select them.",
        "misconception": "Treating a negative limit like a negative array-slice offset."
      },
      {
        "id": "two-splits",
        "text": "[\"a\",\"b\",\"c:d\"]",
        "rationale": "This treats the magnitude as a count of splits and retains a remainder, which is not the negative-limit contract.",
        "misconception": "Confusing the count of separators processed with omitted trailing fields."
      }
    ],
    "correctOptionId": "drop-last-two",
    "explanation": {
      "summary": "For a negative limit, explode first conceptually obtains the delimiter-separated components and returns all except the specified number at the end.",
      "trace": "The components are a, b, c and d. Omitting the final two leaves a and b."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"a\",\"b\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.explode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0504",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Syntax & execution model",
    "subtopic": "integer-literal-digit-separator",
    "objective": {
      "id": "integer-literal-digit-separator",
      "text": "Interpret an underscore inside an integer source literal as a digit separator, not data or a parse boundary."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish PHP source-literal syntax from a quoted numeric-looking string."
    },
    "prerequisites": [
      "Integer literals",
      "Digit separators",
      "is_int"
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
          "source": "<?php\n\n$value = 12_345;\n\necho json_encode([$value, is_int($value)]);\n"
        }
      ]
    },
    "stem": "What JSON shows the value and type check for this PHP integer literal?",
    "options": [
      {
        "id": "separator-is-text",
        "text": "[\"12_345\",false]",
        "rationale": "The source is not quoted; an allowed separator inside an integer literal does not create a string.",
        "misconception": "Treating a source digit separator as a character stored in text."
      },
      {
        "id": "stops-at-underscore",
        "text": "[12,true]",
        "rationale": "PHP parses the entire separated integer literal rather than stopping at the underscore.",
        "misconception": "Applying numeric-string prefix parsing to source-literal tokenization."
      },
      {
        "id": "integer-literal",
        "text": "[12345,true]",
        "rationale": "The underscore improves source readability and contributes no character or arithmetic operation to the integer value.",
        "misconception": null
      },
      {
        "id": "parse-error",
        "text": "A ParseError before any JSON output",
        "rationale": "Numeric digit separators are valid in the stated PHP versions.",
        "misconception": "Assuming underscores are forbidden inside modern PHP numeric literals."
      }
    ],
    "correctOptionId": "integer-literal",
    "explanation": {
      "summary": "PHP permits digit separators in numeric literals. The underscore separates digits for readability; the runtime value is the integer 12345.",
      "trace": "The assignment stores an int, and is_int returns true. JSON encodes the numeric value without the source separator."
    },
    "validation": {
      "kind": "output",
      "stdout": "[12345,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-01"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.integer.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0505",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Types, casting & comparisons",
    "subtopic": "negative-floor-ceil-versus-integer-truncation",
    "objective": {
      "id": "negative-floor-ceil-versus-integer-truncation",
      "text": "Distinguish directional rounding from truncation toward zero for a negative fractional value."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply floor, ceil and integer conversion without importing positive-number intuition."
    },
    "prerequisites": [
      "Negative numbers",
      "floor and ceil",
      "Float-to-int conversion"
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
          "source": "<?php\n\n$value = -1.2;\n\necho json_encode([floor($value), ceil($value), (int) $value]);\n"
        }
      ]
    },
    "stem": "What JSON contains floor, ceil and the integer cast of the same negative value?",
    "options": [
      {
        "id": "reversed-rounding",
        "text": "[-1,-2,-1]",
        "rationale": "Floor moves toward negative infinity and ceil toward positive infinity, the reverse of the first two proposed values.",
        "misconception": "Interpreting down and up as reducing or increasing absolute magnitude."
      },
      {
        "id": "direction-and-truncation",
        "text": "[-2,-1,-1]",
        "rationale": "Floor is -2, ceil is -1, and the cast discards the fractional part toward zero.",
        "misconception": null
      },
      {
        "id": "all-truncate",
        "text": "[-1,-1,-1]",
        "rationale": "The cast truncates toward zero, but floor must choose the integer no greater than -1.2.",
        "misconception": "Assuming all three operations simply discard fractional digits."
      },
      {
        "id": "cast-floors",
        "text": "[-2,-1,-2]",
        "rationale": "The integer cast truncates toward zero rather than applying floor.",
        "misconception": "Equating conversion to an integer with mathematical flooring."
      }
    ],
    "correctOptionId": "direction-and-truncation",
    "explanation": {
      "summary": "Floor and ceil select integers by order, while an int cast truncates the fraction toward zero. These rules coincide in some positive cases but differ for negative fractions.",
      "trace": "-2 is the greatest integer not above -1.2. -1 is the least integer not below it, and truncation also yields -1."
    },
    "validation": {
      "kind": "output",
      "stdout": "[-2,-1,-1]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/function.floor.php",
      "https://www.php.net/manual/en/function.ceil.php",
      "https://www.php.net/manual/en/language.types.integer.php#language.types.integer.casting"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0506",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "new-object-default-argument-evaluated-per-omission",
    "objective": {
      "id": "new-object-default-argument-evaluated-per-omission",
      "text": "Trace fresh object construction for omitted new-expression defaults separately from reuse of an explicitly supplied object."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Track object identity across repeated calls without treating a default object expression as static shared storage."
    },
    "prerequisites": [
      "Object parameters",
      "Default new expressions",
      "Property mutation"
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
          "source": "<?php\n\nclass Counter\n{\n    public int $value = 0;\n}\n\nfunction bump(Counter $counter = new Counter()): int\n{\n    return ++$counter->value;\n}\n\n$shared = new Counter();\n\necho json_encode([bump(), bump(), bump($shared), bump($shared)]);\n"
        }
      ]
    },
    "stem": "What JSON counter sequence results from two omitted arguments followed by two calls sharing the same explicit object?",
    "options": [
      {
        "id": "fresh-default-shared-explicit",
        "text": "[1,1,1,2]",
        "rationale": "Each omitted call evaluates new Counter independently; the two explicit calls mutate the same shared object.",
        "misconception": null
      },
      {
        "id": "shared-default",
        "text": "[1,2,1,2]",
        "rationale": "The default new expression is evaluated for each omitted argument, not once as shared static state.",
        "misconception": "Assuming an object default behaves like a single persistent default object."
      },
      {
        "id": "all-copied",
        "text": "[1,1,1,1]",
        "rationale": "Passing the explicit object does not clone it, so its second call observes the first mutation.",
        "misconception": "Assuming function parameters automatically copy object state."
      },
      {
        "id": "one-global-counter",
        "text": "[1,2,3,4]",
        "rationale": "The explicit shared object is separate from either freshly created default object.",
        "misconception": "Merging all instances of the same class into one property store."
      }
    ],
    "correctOptionId": "fresh-default-shared-explicit",
    "explanation": {
      "summary": "A new expression used as an argument default runs when that argument is omitted. Explicitly passing one object twice instead preserves its identity and accumulated state.",
      "trace": "Each default object starts at zero and returns 1. The explicit object starts at zero, then advances to 1 and 2 across its two calls."
    },
    "validation": {
      "kind": "output",
      "stdout": "[1,1,1,2]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/functions.arguments.php#functions.arguments.default"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0507",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Files & structured data",
    "subtopic": "closed-resource-variable-versus-live-resource",
    "objective": {
      "id": "closed-resource-variable-versus-live-resource",
      "text": "Distinguish a variable that still holds a closed resource handle from a currently usable resource."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Track handle lifetime without assuming fclose unsets or nulls the caller’s variable."
    },
    "prerequisites": [
      "Stream resources",
      "fclose",
      "is_resource",
      "get_debug_type"
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
        "The memory stream opens successfully and fclose succeeds. No operation attempts to read the closed handle."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$handle = fopen('php://memory', 'w+');\n$before = is_resource($handle);\nfclose($handle);\n\n$after = is_resource($handle);\necho json_encode([$before, $after, get_debug_type($handle)]);\n"
        }
      ]
    },
    "stem": "What JSON shows the resource checks before and after closing, followed by the remaining variable’s debug type?",
    "options": [
      {
        "id": "still-live",
        "text": "[true,true,\"resource (stream)\"]",
        "rationale": "Closing the handle ends its live-resource state, even though the variable remains assigned.",
        "misconception": "Treating a retained handle variable as proof the resource is still open."
      },
      {
        "id": "becomes-null",
        "text": "[true,false,\"null\"]",
        "rationale": "fclose does not replace the caller’s variable with null.",
        "misconception": "Assuming closing a resource also rewrites every variable referring to it."
      },
      {
        "id": "closed-handle",
        "text": "[true,false,\"resource (closed)\"]",
        "rationale": "The stream was live before fclose; afterward is_resource is false and the retained handle is identified as closed.",
        "misconception": null
      },
      {
        "id": "becomes-result",
        "text": "[true,false,\"bool\"]",
        "rationale": "The success boolean returned by fclose was not assigned to handle.",
        "misconception": "Confusing an API return value with an implicit assignment to its argument."
      }
    ],
    "correctOptionId": "closed-handle",
    "explanation": {
      "summary": "fclose changes the resource’s lifetime state rather than unsetting the variable. is_resource recognizes only a live resource, while get_debug_type can identify the closed handle left in the variable.",
      "trace": "The first check sees an open stream. After closure, the check is false and the debug label is resource (closed)."
    },
    "validation": {
      "kind": "output",
      "stdout": "[true,false,\"resource (closed)\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.is-resource.php",
      "https://www.php.net/manual/en/function.get-debug-type.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0508",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Variables, scope & constants",
    "subtopic": "constant-name-case-sensitive-lookup",
    "objective": {
      "id": "constant-name-case-sensitive-lookup",
      "text": "Apply case-sensitive lookup to a user-defined constant name."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Keep constant-name identity separate from PHP’s case-insensitive function and class-name lookup rules."
    },
    "prerequisites": [
      "const declarations",
      "defined",
      "constant name strings"
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
          "source": "<?php\n\nconst Mode = 'safe';\n\necho json_encode([defined('Mode'), defined('MODE'), constant('Mode')]);\n"
        }
      ]
    },
    "stem": "What JSON is printed by these constant lookups? Only the displayed user constant is declared.",
    "options": [
      {
        "id": "case-insensitive",
        "text": "[true,true,\"safe\"]",
        "rationale": "User-defined constant names are case-sensitive, so MODE is not the declared Mode.",
        "misconception": "Applying function-name case insensitivity to constants."
      },
      {
        "id": "uppercase-required",
        "text": "[false,true,\"safe\"]",
        "rationale": "Uppercase spelling is a convention, not an automatic renaming performed by const.",
        "misconception": "Assuming PHP normalizes constant declarations to uppercase."
      },
      {
        "id": "invalid-case",
        "text": "An Error before any JSON output",
        "rationale": "The mixed-case constant name is valid, and the actual value lookup uses that exact spelling.",
        "misconception": "Treating an uppercase style convention as a syntax or runtime requirement."
      },
      {
        "id": "exact-name",
        "text": "[true,false,\"safe\"]",
        "rationale": "Mode exists, MODE does not, and the exact-name constant lookup returns safe.",
        "misconception": null
      }
    ],
    "correctOptionId": "exact-name",
    "explanation": {
      "summary": "PHP retains the declared constant name and looks it up case-sensitively. A style convention such as uppercase constants does not change the language’s valid names or lookup behavior.",
      "trace": "defined reports true for Mode and false for MODE; constant(\"Mode\") retrieves the stored string."
    },
    "validation": {
      "kind": "output",
      "stdout": "[true,false,\"safe\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-02"
    },
    "references": [
      "https://www.php.net/manual/en/language.constants.php",
      "https://www.php.net/manual/en/function.constant.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0509",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Operators & expressions",
    "subtopic": "bitwise-string-operators-byte-results-and-lengths",
    "objective": {
      "id": "bitwise-string-operators-byte-results-and-lengths",
      "text": "Trace bytewise string XOR, OR and AND, including their different result lengths for unequal operands."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Apply string-mode bitwise operations without converting the operands to integers or assuming identical length policies."
    },
    "prerequisites": [
      "Bitwise operators on two strings",
      "ASCII byte values",
      "bin2hex",
      "Hexadecimal escape sequences"
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
          "source": "<?php\n\n$left = 'AZ';\n$right = \"\\x20\";\n\necho json_encode([\n    bin2hex($left ^ $right),\n    bin2hex($left | $right),\n    bin2hex($left & $right),\n]);\n"
        }
      ]
    },
    "stem": "What JSON hexadecimal strings result? A is byte 0x41, Z is 0x5a and the second operand contains one byte 0x20.",
    "options": [
      {
        "id": "all-short",
        "text": "[\"61\",\"61\",\"00\"]",
        "rationale": "OR retains the unmatched byte from the longer operand; its result is not restricted to the shorter length.",
        "misconception": "Applying XOR and AND length behavior to OR."
      },
      {
        "id": "string-byte-rules",
        "text": "[\"61\",\"615a\",\"00\"]",
        "rationale": "XOR and AND use the shared one-byte span, while OR also retains the longer operand’s trailing Z byte.",
        "misconception": null
      },
      {
        "id": "all-long",
        "text": "[\"615a\",\"615a\",\"005a\"]",
        "rationale": "XOR and AND do not both carry through the unmatched trailing byte.",
        "misconception": "Padding both operands and applying one common length rule to every bitwise operator."
      },
      {
        "id": "numeric-conversion",
        "text": "[\"30\",\"30\",\"30\"]",
        "rationale": "With two string operands these operators act on bytes; they do not first convert the nonnumeric strings to numeric zero text.",
        "misconception": "Using numeric coercion rules for string-mode bitwise operators."
      }
    ],
    "correctOptionId": "string-byte-rules",
    "explanation": {
      "summary": "When both operands are strings, bitwise operators work on corresponding bytes. XOR and AND stop at the shorter length; OR preserves the longer result span.",
      "trace": "0x41 XOR 0x20 and 0x41 OR 0x20 both yield 0x61, while AND yields 0x00. Only OR retains the unmatched trailing 0x5a."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"61\",\"615a\",\"00\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
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
    "id": "PHP-E26-0510",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Iterators, generators & fibers",
    "subtopic": "yield-from-expression-uses-delegated-return",
    "objective": {
      "id": "yield-from-expression-uses-delegated-return",
      "text": "Trace the value of a yield-from expression separately from the values it forwards and the outer generator’s return."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Follow three distinct channels: inner yields, the delegated return and the outer return."
    },
    "prerequisites": [
      "Generator yields and returns",
      "yield from expression",
      "iterator_to_array",
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
          "source": "<?php\n\nfunction innerValues(): Generator\n{\n    yield 'a';\n\n    return 7;\n}\n\nfunction outerValues(): Generator\n{\n    $result = yield from innerValues();\n    yield $result;\n\n    return 9;\n}\n\n$outer = outerValues();\n$values = iterator_to_array($outer, false);\n\necho json_encode([$values, $outer->getReturn()]);\n"
        }
      ]
    },
    "stem": "What JSON contains the collected yielded values followed by the outer generator’s return value?",
    "options": [
      {
        "id": "inner-return-lost",
        "text": "[[\"a\",null],9]",
        "rationale": "Delegation to a generator makes its return available as the yield-from expression’s value; it is not discarded as null.",
        "misconception": "Treating all delegated iterables as having no useful return value."
      },
      {
        "id": "last-yield-result",
        "text": "[[\"a\",\"a\"],9]",
        "rationale": "The expression produces the inner return 7, not the last value yielded by the inner generator.",
        "misconception": "Confusing the delegated return channel with its final yielded item."
      },
      {
        "id": "separate-channels",
        "text": "[[\"a\",7],9]",
        "rationale": "The inner yield is forwarded, its return becomes result and is explicitly yielded, and the outer return is retrieved separately.",
        "misconception": null
      },
      {
        "id": "every-return-yielded",
        "text": "[[\"a\",7,9],null]",
        "rationale": "The outer return 9 is not an additional yielded item; it remains available through getReturn.",
        "misconception": "Treating a generator return as an implicit final yield."
      }
    ],
    "correctOptionId": "separate-channels",
    "explanation": {
      "summary": "yield from forwards the delegated generator’s yielded values and evaluates to its return value once delegation completes. The outer generator can then use that value and still have its own independent return.",
      "trace": "a is forwarded. The inner return sets result to 7, which the outer generator yields explicitly. After traversal, getReturn retrieves 9."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[\"a\",7],9]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/language.generators.syntax.php#control-structures.yield.from"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0511",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Closures, callbacks & callables",
    "subtopic": "closure-call-temporary-object-binding",
    "objective": {
      "id": "closure-call-temporary-object-binding",
      "text": "Trace Closure::call’s temporary object binding without assuming it permanently rewrites the closure’s original binding."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Compare ordinary invocation before and after a one-call rebinding to another instance."
    },
    "prerequisites": [
      "Closure binding",
      "Closure::call",
      "Private property scope",
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
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Box\n{\n    public function __construct(private string $label)\n    {\n    }\n\n    public function reader(): Closure\n    {\n        return function (): string {\n            return $this->label;\n        };\n    }\n}\n\n$first = new Box('A');\n$second = new Box('B');\n$read = $first->reader();\n\necho json_encode([$read(), $read->call($second), $read()]);\n"
        }
      ]
    },
    "stem": "What JSON records the ordinary call, temporarily rebound call and subsequent ordinary call?",
    "options": [
      {
        "id": "temporary-binding",
        "text": "[\"A\",\"B\",\"A\"]",
        "rationale": "call uses second for that invocation only; the closure remains ordinarily bound to first.",
        "misconception": null
      },
      {
        "id": "permanent-binding",
        "text": "[\"A\",\"B\",\"B\"]",
        "rationale": "Closure::call does not permanently replace the closure’s stored object binding.",
        "misconception": "Treating call as an in-place bind operation."
      },
      {
        "id": "original-only",
        "text": "[\"A\",\"A\",\"A\"]",
        "rationale": "The explicit call binding does change this invocation’s receiver, so the middle result is B.",
        "misconception": "Assuming a closure created in an object method cannot temporarily use another receiver."
      },
      {
        "id": "private-error",
        "text": "An Error with no JSON output because the middle invocation cannot read a private property",
        "rationale": "The temporary binding also supplies the new object’s class scope; both instances are Box objects.",
        "misconception": "Assuming temporary rebinding changes the object but leaves private-property access unauthorized."
      }
    ],
    "correctOptionId": "temporary-binding",
    "explanation": {
      "summary": "Closure::call binds the receiver for the duration of one invocation. It does not alter the closure’s normal binding for later direct calls.",
      "trace": "The ordinary receiver is first and yields A. The middle call uses second and yields B. The final ordinary call returns to first and yields A."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"A\",\"B\",\"A\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/closure.call.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0512",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Includes, autoloading & paths",
    "subtopic": "included-function-declaration-versus-variable-scope",
    "objective": {
      "id": "included-function-declaration-versus-variable-scope",
      "text": "Separate local variable scope inherited by an included file from the scope of a named function it declares."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track two kinds of symbol introduced by the same include inside a function."
    },
    "prerequisites": [
      "Include scope",
      "Named function declarations",
      "Global namespace",
      "isset"
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
        "Both files are in the global namespace. loadModule is called once, includedHelper is initially undefined, and there is no global token variable. The files are shown separately and require succeeds."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction loadModule(): string\n{\n    require __DIR__ . '/module.php';\n\n    return $token;\n}\n\n$loaded = loadModule();\necho json_encode([$loaded, includedHelper(), isset($token)]);\n"
        },
        {
          "path": "module.php",
          "kind": "complete-file",
          "source": "<?php\n\n$token = 'local';\n\nfunction includedHelper(): string\n{\n    return 'helper';\n}\n"
        }
      ]
    },
    "stem": "What JSON is printed after the include inside loadModule?",
    "options": [
      {
        "id": "function-local",
        "text": "An Error because includedHelper is unavailable after loadModule returns",
        "rationale": "The named function declaration is not a local variable scoped to loadModule.",
        "misconception": "Treating a declared function as if it inherited the include’s local variable lifetime."
      },
      {
        "id": "all-global",
        "text": "[\"local\",\"helper\",true]",
        "rationale": "The token assignment uses loadModule’s variable scope and does not create the stated absent global variable.",
        "misconception": "Assuming global function declaration behavior also applies to ordinary included variables."
      },
      {
        "id": "nested-forbidden",
        "text": "A ParseError because a required file cannot declare a function from within another function call",
        "rationale": "PHP permits this declaration when the include executes; the one-call premise avoids redeclaration.",
        "misconception": "Assuming named function declarations are syntactically forbidden in this execution context."
      },
      {
        "id": "different-symbol-scopes",
        "text": "[\"local\",\"helper\",false]",
        "rationale": "The included variable belongs to loadModule’s scope, while the named helper is available in the global function namespace.",
        "misconception": null
      }
    ],
    "correctOptionId": "different-symbol-scopes",
    "explanation": {
      "summary": "An included file uses the variable scope of its inclusion point. Its named function declaration follows function declaration rules, so it remains callable after loadModule completes.",
      "trace": "loadModule reads its local token and returns local. includedHelper returns helper. The separate global token remains unset."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"local\",\"helper\",false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-09"
    },
    "references": [
      "https://www.php.net/manual/en/function.include.php",
      "https://www.php.net/manual/en/functions.user-defined.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0513",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "magic-get-without-magic-isset",
    "objective": {
      "id": "magic-get-without-magic-isset",
      "text": "Distinguish a virtual property’s direct read from its existence check when only __get is implemented."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace which magic hook is available for direct access, isset and null coalescing."
    },
    "prerequisites": [
      "Property overloading",
      "__get",
      "__isset",
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
          "source": "<?php\n\nclass VirtualLabel\n{\n    public function __get(string $name): string\n    {\n        return 'visible';\n    }\n}\n\n$label = new VirtualLabel();\n\necho json_encode([\n    $label->title,\n    isset($label->title),\n    $label->title ?? 'fallback',\n]);\n"
        }
      ]
    },
    "stem": "What JSON is printed for this undeclared virtual title property? The class implements no __isset method.",
    "options": [
      {
        "id": "read-implies-exists",
        "text": "[\"visible\",true,\"visible\"]",
        "rationale": "A direct __get result does not by itself make isset report an undeclared property as present.",
        "misconception": "Assuming the read hook automatically implements the existence hook."
      },
      {
        "id": "coalesce-reads-get",
        "text": "[\"visible\",false,\"visible\"]",
        "rationale": "isset does not call __get, but with no __isset defined the coalescing read can obtain the nonnull value from __get.",
        "misconception": null
      },
      {
        "id": "no-virtual-read",
        "text": "[null,false,\"fallback\"]",
        "rationale": "Direct property access does invoke the available __get method, which returns visible.",
        "misconception": "Treating an undeclared property as unreadable even when a read hook exists."
      },
      {
        "id": "coalesce-fallback",
        "text": "[\"visible\",false,\"fallback\"]",
        "rationale": "Without an __isset override, the coalescing read invokes __get and receives visible rather than taking the fallback.",
        "misconception": "Assuming null coalescing is mechanically equivalent to a separate isset check in every overloaded-property case."
      }
    ],
    "correctOptionId": "coalesce-reads-get",
    "explanation": {
      "summary": "The direct read and this null-coalescing read can invoke __get. A separate isset call does not invoke __get and reports false for the undeclared property when __isset is absent.",
      "trace": "The first expression obtains visible. isset is false. With no __isset override, the coalescing read obtains visible from __get, so its fallback is unused."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"visible\",false,\"visible\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.overloading.php#object.get"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0514",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "iso-week-numbering-year-versus-calendar-year",
    "objective": {
      "id": "iso-week-numbering-year-versus-calendar-year",
      "text": "Distinguish the ISO week-numbering year from the calendar year near a year boundary."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Apply the different Y and o date-format fields to a date whose ISO week belongs to the preceding year."
    },
    "prerequisites": [
      "DateTimeImmutable formatting",
      "ISO week dates",
      "Calendar year versus week year"
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
        "ISO weeks start on Monday, and week 1 is the week containing January 4. January 1, 2021 is a Friday in the week that began December 28, 2020. UTC is used."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$date = new DateTimeImmutable('2021-01-01', new DateTimeZone('UTC'));\n\necho $date->format('Y|o|W');\n"
        }
      ]
    },
    "stem": "What string is produced by the calendar-year, ISO-week-year and week-number format fields?",
    "options": [
      {
        "id": "all-calendar",
        "text": "2021|2021|01",
        "rationale": "The displayed Friday is still in the final ISO week of 2020, not week 1 of 2021.",
        "misconception": "Assuming week numbering resets on January 1."
      },
      {
        "id": "week-year-distinct",
        "text": "2021|2020|53",
        "rationale": "Y follows the calendar date, while o and W identify the ISO week containing that date.",
        "misconception": null
      },
      {
        "id": "year-fields-reversed",
        "text": "2020|2021|53",
        "rationale": "The calendar year field remains 2021; the ISO week year is the field that can differ.",
        "misconception": "Reversing the roles of Y and o."
      },
      {
        "id": "iso-overrides-calendar",
        "text": "2020|2020|53",
        "rationale": "ISO week membership does not change the calendar year reported by Y.",
        "misconception": "Assuming selecting ISO week fields changes the date’s calendar-year field too."
      }
    ],
    "correctOptionId": "week-year-distinct",
    "explanation": {
      "summary": "Y formats the ordinary calendar year. o formats the year associated with the ISO week number W, which can differ around New Year.",
      "trace": "January 1 has calendar year 2021 but belongs to ISO week 53 of 2020, so the fields are 2021, 2020 and 53."
    },
    "validation": {
      "kind": "output",
      "stdout": "2021|2020|53",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
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
    "id": "PHP-E26-0515",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Enums, attributes & reflection",
    "subtopic": "pure-enum-default-json-serialization-rejected",
    "objective": {
      "id": "pure-enum-default-json-serialization-rejected",
      "text": "Recognize that a pure enum case has no default JSON value representation."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish pure enums from backed enums and ordinary object property serialization."
    },
    "prerequisites": [
      "Pure versus backed enums",
      "json_encode",
      "JSON_THROW_ON_ERROR",
      "JsonException"
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
          "source": "<?php\n\nenum Direction\n{\n    case North;\n}\n\ntry {\n    echo json_encode(Direction::North, JSON_THROW_ON_ERROR);\n} catch (JsonException $failure) {\n    echo 'unsupported';\n}\n"
        }
      ]
    },
    "stem": "What text is printed? Direction is a pure enum and does not implement JsonSerializable.",
    "options": [
      {
        "id": "case-name",
        "text": "\"North\"",
        "rationale": "PHP does not automatically choose a pure enum case’s name as its JSON representation.",
        "misconception": "Extending a guessed case-name encoding to pure enums."
      },
      {
        "id": "object-shape",
        "text": "{}",
        "rationale": "Pure enum cases are not encoded as empty ordinary objects by this default path.",
        "misconception": "Treating an enum case as a propertyless stdClass for JSON serialization."
      },
      {
        "id": "unsupported",
        "text": "unsupported",
        "rationale": "Encoding a pure enum case without a custom serialization policy fails, and JSON_THROW_ON_ERROR routes it to the catch.",
        "misconception": null
      },
      {
        "id": "null-value",
        "text": "null",
        "rationale": "There is no null backing value, and the error flag causes an exception rather than silent null output.",
        "misconception": "Treating absence of a backing scalar as an implicit null representation."
      }
    ],
    "correctOptionId": "unsupported",
    "explanation": {
      "summary": "Backed enums have a scalar representation for default JSON encoding. Pure enums need an explicit application representation or JsonSerializable implementation; the default encoder reports an unsupported non-backed enum.",
      "trace": "json_encode throws before echo receives a result. The catch prints unsupported."
    },
    "validation": {
      "kind": "output",
      "stdout": "unsupported",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/language.enumerations.serialization.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0516",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "magic-call-preserves-unknown-named-argument-keys",
    "objective": {
      "id": "magic-call-preserves-unknown-named-argument-keys",
      "text": "Trace named arguments delivered to __call when no concrete target method declares a parameter order."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish magic dispatch’s captured argument map from binding against an ordinary method signature."
    },
    "prerequisites": [
      "__call",
      "Named arguments",
      "Associative argument arrays"
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
          "source": "<?php\n\nclass Dispatcher\n{\n    public function __call(string $name, array $arguments): array\n    {\n        return [$name, array_keys($arguments), array_values($arguments)];\n    }\n}\n\n$dispatcher = new Dispatcher();\necho json_encode($dispatcher->route(second: 2, first: 1));\n"
        }
      ]
    },
    "stem": "What JSON does this call to an undeclared route method produce?",
    "options": [
      {
        "id": "names-preserved",
        "text": "[\"route\",[\"second\",\"first\"],[2,1]]",
        "rationale": "Magic dispatch receives the named keys in the supplied argument map; there is no declared route signature to reorder them.",
        "misconception": null
      },
      {
        "id": "positional-only",
        "text": "[\"route\",[0,1],[2,1]]",
        "rationale": "PHP preserves named keys when passing these arguments to __call rather than stripping them into positional indexes.",
        "misconception": "Assuming magic dispatch always receives a numerically indexed list."
      },
      {
        "id": "name-sorted",
        "text": "[\"route\",[\"first\",\"second\"],[1,2]]",
        "rationale": "The argument names are not alphabetically sorted, and no route declaration specifies another binding order.",
        "misconception": "Inventing an automatic order for unknown named parameters."
      },
      {
        "id": "unknown-name-error",
        "text": "An Error because second and first are not parameters of __call",
        "rationale": "The names belong to the intercepted route call; PHP supplies __call’s own name and arguments parameters through magic dispatch.",
        "misconception": "Binding the intercepted call’s named arguments directly against the magic handler signature."
      }
    ],
    "correctOptionId": "names-preserved",
    "explanation": {
      "summary": "__call receives the requested method name and an argument array. On PHP 8, named arguments in that intercepted call retain their string keys in the array.",
      "trace": "The requested name is route, and the captured map is second => 2 followed by first => 1. Keys and values preserve that order."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"route\",[\"second\",\"first\"],[2,1]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.overloading.php#object.call",
      "https://wiki.php.net/rfc/named_params"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0517",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "PDO & database access",
    "subtopic": "fetch-column-advances-whole-row-cursor",
    "objective": {
      "id": "fetch-column-advances-whole-row-cursor",
      "text": "Trace row-cursor advancement across repeated fetchColumn calls that select different columns."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish fetching one column from consuming one field of an otherwise retained current row."
    },
    "prerequisites": [
      "PDO result cursors",
      "fetchColumn column index",
      "Ordered query results"
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
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec('CREATE TABLE items (id INTEGER, label TEXT)');\n$pdo->exec(\"INSERT INTO items VALUES (1, 'A'), (2, 'B'), (3, 'C')\");\n$rows = $pdo->query('SELECT id, label FROM items ORDER BY id');\n\n$first = $rows->fetchColumn(0);\n$second = $rows->fetchColumn(0);\n$third = $rows->fetchColumn(1);\n\necho json_encode([$first, $second, $third]);\n"
        }
      ]
    },
    "stem": "What JSON results from these three fetchColumn calls on the same ordered result?",
    "options": [
      {
        "id": "field-cursor",
        "text": "[1,\"A\",2]",
        "rationale": "Each call fetches from the next row using its explicit column index; it does not walk consecutive fields of a flattened result.",
        "misconception": "Treating the result cursor as a sequence of individual columns."
      },
      {
        "id": "nonadvancing-read",
        "text": "[1,1,\"A\"]",
        "rationale": "fetchColumn advances the row cursor, so repeated calls do not keep reading the first row.",
        "misconception": "Treating fetchColumn as a peek at a retained current row."
      },
      {
        "id": "previous-row-other-column",
        "text": "[1,2,\"B\"]",
        "rationale": "Changing the column index does not return to the previously consumed second row.",
        "misconception": "Assuming a different requested column reuses the last fetched row."
      },
      {
        "id": "one-row-per-call",
        "text": "[1,2,\"C\"]",
        "rationale": "The calls consume rows 1, 2 and 3 respectively, selecting id, id and label from those rows.",
        "misconception": null
      }
    ],
    "correctOptionId": "one-row-per-call",
    "explanation": {
      "summary": "fetchColumn returns the requested column from the next result row. Every successful call advances past that row, regardless of which column was selected.",
      "trace": "The first two calls fetch IDs 1 and 2. The third call reaches row 3 and selects its second column, C."
    },
    "validation": {
      "kind": "output",
      "stdout": "[1,2,\"C\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdostatement.fetchcolumn.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0518",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Errors & exceptions",
    "subtopic": "uncaught-exception-handler-does-not-resume-script",
    "objective": {
      "id": "uncaught-exception-handler-does-not-resume-script",
      "text": "Trace termination after the global uncaught-exception handler returns."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish an exception handler invoked at the uncaught boundary from a catch that resumes at a surrounding control-flow point."
    },
    "prerequisites": [
      "set_exception_handler",
      "Uncaught exceptions",
      "Script termination"
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
          "source": "<?php\n\nset_exception_handler(static function (Throwable $failure): void {\n    echo 'handled;';\n});\n\necho 'before;';\nthrow new RuntimeException('stop');\necho 'after;';\n"
        }
      ]
    },
    "stem": "What exact text is emitted by this complete PHP CLI file?",
    "options": [
      {
        "id": "resumes-after-throw",
        "text": "before;handled;after;",
        "rationale": "Returning from the uncaught-exception handler does not resume execution after the throw.",
        "misconception": "Treating a global exception handler as a resumable catch around the failing statement."
      },
      {
        "id": "handler-then-termination",
        "text": "before;handled;",
        "rationale": "The first echo runs, the uncaught exception invokes the handler, and execution terminates after that handler returns.",
        "misconception": null
      },
      {
        "id": "handler-not-invoked",
        "text": "before;",
        "rationale": "The registered handler is invoked for this uncaught RuntimeException and emits its marker.",
        "misconception": "Assuming only explicitly caught exceptions can invoke user code."
      },
      {
        "id": "continues-without-handler",
        "text": "before;after;",
        "rationale": "The exception is not ignored; it invokes the registered handler and prevents reaching the final echo.",
        "misconception": "Assuming installing a handler disables exception propagation without running the callback."
      }
    ],
    "correctOptionId": "handler-then-termination",
    "explanation": {
      "summary": "set_exception_handler supplies the final handler for an otherwise uncaught exception. After that callback returns, the script terminates instead of continuing at the throw site.",
      "trace": "before; is emitted first. The RuntimeException reaches the global handler, which emits handled;. The after; statement is unreachable."
    },
    "validation": {
      "kind": "output",
      "stdout": "before;handled;",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/function.set-exception-handler.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0519",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "php84-readonly-child-initialization-versus-second-write",
    "objective": {
      "id": "php84-readonly-child-initialization-versus-second-write",
      "text": "Trace inherited readonly initialization under PHP 8.4’s default protected setter scope while retaining the one-assignment rule."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine the version-specific initialization scope with readonly state after initialization."
    },
    "prerequisites": [
      "Readonly properties (advanced)",
      "PHP 8.4 protected(set) default",
      "Inheritance scope",
      "Uninitialized versus initialized properties"
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
        "Use PHP 8.4 or 8.5 as specified. The property has no explicit private(set) modifier and no initial value. This question does not use cloning or reflection."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass BaseRecord\n{\n    public readonly int $id;\n}\n\nclass ChildRecord extends BaseRecord\n{\n    public function __construct()\n    {\n        $this->id = 7;\n    }\n\n    public function replaceId(): void\n    {\n        $this->id = 8;\n    }\n}\n\n$record = new ChildRecord();\n$failed = false;\n\ntry {\n    $record->replaceId();\n} catch (Error $failure) {\n    $failed = true;\n}\n\necho json_encode([$record->id, $failed]);\n"
        }
      ]
    },
    "stem": "What JSON records the inherited property value and whether the second child-method write failed?",
    "options": [
      {
        "id": "child-cannot-initialize",
        "text": "An uncaught Error during construction, before JSON output",
        "rationale": "In PHP 8.4 and 8.5, the default readonly setter scope permits this child-scope initialization.",
        "misconception": "Applying the earlier declaring-class-only initialization rule to the stated versions."
      },
      {
        "id": "readonly-limits-only-outsiders",
        "text": "[8,false]",
        "rationale": "Permitted initialization scope does not permit a second assignment to an initialized readonly property.",
        "misconception": "Treating readonly as only a restriction on callers outside the class hierarchy."
      },
      {
        "id": "initializer-only",
        "text": "[7,true]",
        "rationale": "The child initializes the property once; the later attempted reassignment raises Error and leaves 7 stored.",
        "misconception": null
      },
      {
        "id": "write-then-error",
        "text": "[8,true]",
        "rationale": "The prohibited second assignment fails before replacing the stored value.",
        "misconception": "Assuming readonly detects a write only after committing the replacement."
      }
    ],
    "correctOptionId": "initializer-only",
    "explanation": {
      "summary": "Since PHP 8.4, readonly properties have protected setter scope by default, allowing child initialization. The readonly one-assignment constraint still applies after initialization.",
      "trace": "The constructor stores 7. replaceId attempts a second write, which throws Error; the catch records failure and the value remains 7."
    },
    "validation": {
      "kind": "output",
      "stdout": "[7,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0520",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "backed-property-hook-self-access-bypasses-recursion",
    "objective": {
      "id": "backed-property-hook-self-access-bypasses-recursion",
      "text": "Trace a backed property hook’s direct access to its own storage without recursively invoking the same hook."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Separate stored normalization from read-time presentation and count actual external get invocations."
    },
    "prerequisites": [
      "PHP 8.4 backed property hooks (advanced)",
      "Self-access inside hooks",
      "Get versus set behavior"
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
          "source": "<?php\n\nclass DisplayLabel\n{\n    public int $reads = 0;\n\n    public string $name = 'Ada' {\n        get {\n            $this->reads++;\n\n            return strtoupper($this->name);\n        }\n        set {\n            $this->name = trim($value);\n        }\n    }\n}\n\n$label = new DisplayLabel();\n$first = $label->name;\n$label->name = ' bob ';\n$second = $label->name;\n\necho json_encode([$first, $second, $label->reads]);\n"
        }
      ]
    },
    "stem": "What JSON contains the two public reads and the get-hook count?",
    "options": [
      {
        "id": "stored-values-only",
        "text": "[\"Ada\",\"bob\",0]",
        "rationale": "External reads invoke the get hook, which uppercases the stored values and increments the counter.",
        "misconception": "Assuming a backed property’s hooks are skipped for ordinary reads."
      },
      {
        "id": "recursive-hook",
        "text": "The program recurses through the get hook instead of producing JSON",
        "rationale": "Direct self-access to this backed property from its own hook accesses the backing value rather than recursively invoking the same hook.",
        "misconception": "Treating hook self-access as an ordinary external property read."
      },
      {
        "id": "assignment-counts-read",
        "text": "[\"ADA\",\"BOB\",3]",
        "rationale": "The set hook writes backing storage directly and does not invoke the get hook, so only the two external reads are counted.",
        "misconception": "Assuming storing a hooked property necessarily reads it through get."
      },
      {
        "id": "backing-and-view",
        "text": "[\"ADA\",\"BOB\",2]",
        "rationale": "The setter stores trimmed bob; each of the two external reads applies uppercase presentation and increments reads once.",
        "misconception": null
      }
    ],
    "correctOptionId": "backing-and-view",
    "explanation": {
      "summary": "A backed property hook can access its own underlying value directly. Here the setter normalizes storage, while the getter provides a transformed view without calling itself again.",
      "trace": "The first get reads stored Ada as ADA. The set stores bob. The second get yields BOB, and the two external reads leave the counter at 2."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"ADA\",\"BOB\",2]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
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
    "id": "PHP-E26-0521",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Enums, attributes & reflection",
    "subtopic": "class-attributes-versus-inherited-method-declaration-metadata",
    "objective": {
      "id": "class-attributes-versus-inherited-method-declaration-metadata",
      "text": "Distinguish class attributes from metadata on a method declaration inherited by a child class."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Track the declaration reflected by a class lookup and by an inherited method lookup rather than assuming uniform attribute inheritance."
    },
    "prerequisites": [
      "Attributes (advanced)",
      "ReflectionClass and ReflectionMethod",
      "Inherited method declarations",
      "Attribute targets"
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
          "source": "<?php\n\n#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD)]\nclass Label\n{\n    public function __construct(public string $text)\n    {\n    }\n}\n\n#[Label('base class')]\nclass BaseHandler\n{\n    #[Label('base method')]\n    public function handle(): void\n    {\n    }\n}\n\nclass ChildHandler extends BaseHandler\n{\n}\n\n$class = new ReflectionClass(ChildHandler::class);\n$method = $class->getMethod('handle');\n\necho json_encode([\n    count($class->getAttributes(Label::class)),\n    count($method->getAttributes(Label::class)),\n    $method->getDeclaringClass()->getName(),\n]);\n"
        }
      ]
    },
    "stem": "What JSON contains the child class attribute count, inherited method attribute count and that method’s declaring class?",
    "options": [
      {
        "id": "class-copied",
        "text": "[1,1,\"ChildHandler\"]",
        "rationale": "The child class does not acquire the parent’s class attribute, and the inherited method remains declared by BaseHandler.",
        "misconception": "Assuming inheritance copies all declarations and attributes into the child."
      },
      {
        "id": "declaration-specific",
        "text": "[0,1,\"BaseHandler\"]",
        "rationale": "The child has no own class attribute; its inherited handle reflects the original attributed method declaration.",
        "misconception": null
      },
      {
        "id": "all-attributes-absent",
        "text": "[0,0,\"BaseHandler\"]",
        "rationale": "The method lookup still refers to the BaseHandler declaration that carries Label.",
        "misconception": "Discarding inherited method metadata because the child has no class attributes."
      },
      {
        "id": "class-inherits-method-does-not",
        "text": "[1,0,\"ChildHandler\"]",
        "rationale": "Neither the claimed class-attribute inheritance nor the loss and redeclaration of the method occurs.",
        "misconception": "Reversing how class metadata and inherited method declarations are reflected."
      }
    ],
    "correctOptionId": "declaration-specific",
    "explanation": {
      "summary": "A child ReflectionClass reports attributes declared on that class. An inherited method lookup can still reflect the parent’s actual method declaration, including its attributes.",
      "trace": "ChildHandler declares no Label. Its handle method is the one declared by BaseHandler, so that method has one Label and names BaseHandler as its declaring class."
    },
    "validation": {
      "kind": "output",
      "stdout": "[0,1,\"BaseHandler\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/reflectionclass.getattributes.php",
      "https://www.php.net/manual/en/reflectionmethod.getdeclaringclass.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0522",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "PDO & database access",
    "subtopic": "pdo-fetch-lazy-row-object-reuse-versus-scalar-snapshot",
    "objective": {
      "id": "pdo-fetch-lazy-row-object-reuse-versus-scalar-snapshot",
      "text": "Trace a reused PDORow view across later fetches while retaining a previously copied scalar value."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Separate a live lazy row object from a detached snapshot of one of its values."
    },
    "prerequisites": [
      "PDO FETCH_LAZY (advanced)",
      "PDORow reuse",
      "Object aliases versus scalar copies",
      "Result cursor advancement"
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
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec('CREATE TABLE items (id INTEGER)');\n$pdo->exec('INSERT INTO items VALUES (1), (2)');\n$statement = $pdo->query('SELECT id FROM items ORDER BY id');\n\n$first = $statement->fetch(PDO::FETCH_LAZY);\n$snapshot = $first->id;\n$second = $statement->fetch(PDO::FETCH_LAZY);\n\necho json_encode([\n    $first === $second,\n    $snapshot,\n    $first->id,\n    $second->id,\n]);\n"
        }
      ]
    },
    "stem": "What JSON records object identity, the saved first ID and the two lazy-row reads after the second fetch?",
    "options": [
      {
        "id": "separate-row-objects",
        "text": "[false,1,1,2]",
        "rationale": "FETCH_LAZY reuses a PDORow object for the statement rather than providing independent retained row objects.",
        "misconception": "Assuming lazy fetches have the same snapshot lifetime as ordinary detached row objects."
      },
      {
        "id": "shared-frozen-row",
        "text": "[true,1,1,1]",
        "rationale": "The shared view advances with the statement to the second row; identity reuse does not freeze its first values.",
        "misconception": "Combining reused identity with immutable first-row contents."
      },
      {
        "id": "snapshot-also-live",
        "text": "[true,2,2,2]",
        "rationale": "The already read integer snapshot is a scalar copy, not another live PDORow reference.",
        "misconception": "Assuming copying a field retains a live link to the lazy row."
      },
      {
        "id": "live-view-scalar-copy",
        "text": "[true,1,2,2]",
        "rationale": "Both variables refer to the reused lazy row now showing ID 2, while the earlier scalar snapshot remains 1.",
        "misconception": null
      }
    ],
    "correctOptionId": "live-view-scalar-copy",
    "explanation": {
      "summary": "FETCH_LAZY supplies a PDORow view associated with the statement. Subsequent fetches reuse that view, so retaining it does not preserve earlier row contents; copying a scalar field before advancing does.",
      "trace": "The first read copies integer 1 into snapshot. The second fetch updates the same row view to ID 2, observed through both object variables."
    },
    "validation": {
      "kind": "output",
      "stdout": "[true,1,2,2]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdostatement.fetch.php",
      "https://www.php.net/manual/en/pdo.constants.php#pdo.constants.fetch-lazy"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0523",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "typed-class-constant-covariant-narrowing",
    "objective": {
      "id": "typed-class-constant-covariant-narrowing",
      "text": "Apply covariant type narrowing when a child overrides a nonfinal typed class constant."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Separate an overridable constant’s type contract from exact type equality and inherited value reuse."
    },
    "prerequisites": [
      "PHP 8.3 typed class constants (advanced)",
      "Covariant constant types",
      "Union types",
      "ReflectionClassConstant"
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
          "source": "<?php\n\nclass BaseLimits\n{\n    public const int|float LIMIT = 10;\n}\n\nclass ChildLimits extends BaseLimits\n{\n    public const int LIMIT = 20;\n}\n\n$constant = new ReflectionClassConstant(ChildLimits::class, 'LIMIT');\necho json_encode([BaseLimits::LIMIT, ChildLimits::LIMIT, (string) $constant->getType()]);\n"
        }
      ]
    },
    "stem": "What is the outcome of these constant declarations and the reflected child type?",
    "options": [
      {
        "id": "narrowed-override",
        "text": "[10,20,\"int\"]",
        "rationale": "The child’s int type is a permitted narrowing of int|float, and its nonfinal constant may have its own compatible value.",
        "misconception": null
      },
      {
        "id": "exact-type-required",
        "text": "A fatal declaration error because the child type is not exactly int|float",
        "rationale": "Typed class constant overrides may narrow their type covariantly; exact spelling equality is not required.",
        "misconception": "Applying invariant property-type rules to class constants."
      },
      {
        "id": "typed-means-final",
        "text": "A fatal declaration error because any typed class constant is automatically final",
        "rationale": "A type declaration does not make a class constant final.",
        "misconception": "Confusing restrictions on a value’s type with a prohibition on overriding its declaration."
      },
      {
        "id": "inherited-value-wins",
        "text": "[10,10,\"int|float\"]",
        "rationale": "The valid child override supplies its own value and declared type.",
        "misconception": "Assuming a compatible override is ignored in favor of the parent declaration."
      }
    ],
    "correctOptionId": "narrowed-override",
    "explanation": {
      "summary": "Class constant types are covariant across compatible overrides. A nonfinal parent constant allowing int or float can be narrowed to int in the child while the parent keeps its own value.",
      "trace": "The parent lookup yields 10. The child lookup yields 20, and reflection reports the child’s declared int type."
    },
    "validation": {
      "kind": "output",
      "stdout": "[10,20,\"int\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://wiki.php.net/rfc/typed_class_constants",
      "https://www.php.net/manual/en/language.oop5.constants.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0524",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "widened-set-hook-input-versus-property-read-type",
    "objective": {
      "id": "widened-set-hook-input-versus-property-read-type",
      "text": "Distinguish a widened set-hook parameter contract from the property’s narrower read type under strict typing."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine contravariant setter input with explicit conversion and a virtual typed getter."
    },
    "prerequisites": [
      "PHP 8.4 set-hook parameter types (advanced)",
      "Virtual properties",
      "Contravariant input types",
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
          "source": "<?php\n\ndeclare(strict_types=1);\n\nclass Quantity\n{\n    private int $stored = 0;\n\n    public int $amount {\n        get {\n            return $this->stored;\n        }\n        set (int|string $value) {\n            $this->stored = (int) $value;\n        }\n    }\n}\n\n$quantity = new Quantity();\n$quantity->amount = '12';\n\necho json_encode([get_debug_type($quantity->amount), $quantity->amount]);\n"
        }
      ]
    },
    "stem": "What JSON is printed after the string assignment to this virtual int property?",
    "options": [
      {
        "id": "strict-rejects-setter-input",
        "text": "An uncaught TypeError at the assignment with no JSON output",
        "rationale": "The explicitly declared setter input includes string, so strict typing permits this argument to that hook.",
        "misconception": "Applying the property’s read type directly to an explicitly widened setter input."
      },
      {
        "id": "read-type-widens",
        "text": "[\"string\",\"12\"]",
        "rationale": "The setter converts into integer storage and the getter’s property contract remains int.",
        "misconception": "Assuming widening accepted input also widens the property’s returned value type."
      },
      {
        "id": "separate-input-and-read",
        "text": "[\"int\",12]",
        "rationale": "The set hook accepts the string and converts it; reads return the integer required by the property declaration.",
        "misconception": null
      },
      {
        "id": "invalid-setter-declaration",
        "text": "A fatal declaration error because a set hook cannot accept int|string for an int property",
        "rationale": "A set hook may accept a broader compatible input type than the property’s declared type.",
        "misconception": "Assuming setter parameter types must be invariant with the property type."
      }
    ],
    "correctOptionId": "separate-input-and-read",
    "explanation": {
      "summary": "A set hook can accept a wider type and normalize it to the property’s read contract. Strict typing still applies to the declared setter parameter, which explicitly permits string here.",
      "trace": "The setter receives string 12, casts it to integer storage, and the virtual getter returns that integer. Reading the property therefore reports int and 12."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"int\",12]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
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
    "id": "PHP-E26-0525",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Enums, attributes & reflection",
    "subtopic": "override-attribute-validation-during-required-class-loading",
    "objective": {
      "id": "override-attribute-validation-during-required-class-loading",
      "text": "Locate an Override attribute failure at class loading rather than method invocation or the start of the requiring file."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine an intentional method-name mismatch with separate-file loading and declaration validation timing."
    },
    "prerequisites": [
      "PHP Override attribute (advanced)",
      "Inheritance method matching",
      "require execution timing",
      "Declaration errors"
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
        "The spelling hnadle in child.php is intentional. That method is never invoked. Both complete files are shown separately, and child.php exists. The question concerns the resulting declaration failure, not a valid implementation to deploy."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass BaseHandler\n{\n    public function handle(): string\n    {\n        return 'base';\n    }\n}\n\necho 'before;';\nrequire __DIR__ . '/child.php';\necho 'after;';\n"
        },
        {
          "path": "child.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass ChildHandler extends BaseHandler\n{\n    #[Override]\n    public function hnadle(): string\n    {\n        return 'child';\n    }\n}\n"
        }
      ]
    },
    "stem": "What happens when main.php requires the child class file?",
    "options": [
      {
        "id": "metadata-only",
        "text": "before;after; is printed; Override is descriptive metadata only.",
        "rationale": "Override is an engine-validated attribute, so its missing parent-method match causes class loading to fail.",
        "misconception": "Treating every PHP attribute as inert application metadata."
      },
      {
        "id": "checked-before-main",
        "text": "No prefix is printed; the required file is validated before main.php starts.",
        "rationale": "The main file executes its first echo before reaching require and loading the child declaration.",
        "misconception": "Assuming a dynamically required file is validated before the requiring script begins execution."
      },
      {
        "id": "load-time-failure",
        "text": "before; is printed, then class loading fails because hnadle overrides no parent method.",
        "rationale": "The parent has handle, not hnadle; the Override requirement is checked while the child class is loaded.",
        "misconception": null
      },
      {
        "id": "invocation-time-check",
        "text": "before;after; is printed; the mismatch is checked only when hnadle is called.",
        "rationale": "The attribute is checked at declaration loading even if the marked method is never invoked.",
        "misconception": "Deferring a declaration contract until the first call."
      }
    ],
    "correctOptionId": "load-time-failure",
    "explanation": {
      "summary": "Override asserts that a method matches an inherited method contract. The typo fails that assertion when the child declaration is loaded by require; the earlier main-file output has already occurred.",
      "trace": "main.php emits before;. Requiring child.php attempts to load ChildHandler and reports the unmatched Override method. Execution does not reach after;."
    },
    "validation": {
      "kind": "contract",
      "stdout": "before;",
      "error": "has #[\\Override] attribute, but no matching parent method exists",
      "keyEvidence": "The child process exits unsuccessfully with the unmatched-Override diagnostic after emitting only the main-file prefix.",
      "counterexamples": {
        "metadata-only": "The runtime rejects the marked declaration.",
        "checked-before-main": "The captured stdout includes before;.",
        "invocation-time-check": "No method invocation occurs, yet class loading fails."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/class.override.php",
      "https://www.php.net/manual/en/function.require.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0526",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Control flow & pattern matching",
    "subtopic": "skip-current-loop-item-without-stopping-later-items",
    "objective": {
      "id": "skip-current-loop-item-without-stopping-later-items",
      "text": "Repair an invalid-item branch that stops a loop instead of skipping only the current item."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose the PHP control-flow statement that preserves later iterations and the final accumulated result."
    },
    "prerequisites": [
      "foreach",
      "break",
      "continue",
      "return"
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
          "source": "<?php\n\nfunction sumAccepted(array $values): int\n{\n    $total = 0;\n\n    foreach ($values as $value) {\n        if ($value < 0) {\n            break;\n        }\n\n        $total += $value;\n    }\n\n    return $total;\n}\n\necho sumAccepted([2, -1, 3]);\n"
        }
      ]
    },
    "stem": "Negative values must be ignored while later nonnegative values are still added. Which statement replaces break inside the if block?",
    "options": [
      {
        "id": "stop-loop",
        "text": "break;",
        "rationale": "This exits the entire foreach and leaves the later 3 unprocessed.",
        "misconception": "Treating loop termination as skipping one element."
      },
      {
        "id": "skip-current",
        "text": "continue;",
        "rationale": "This skips the remaining body for -1 and proceeds to the following element.",
        "misconception": null
      },
      {
        "id": "return-partial",
        "text": "return $total;",
        "rationale": "This leaves the function immediately with the partial total 2.",
        "misconception": "Confusing returning the current accumulation with continuing the scan."
      },
      {
        "id": "reject-input",
        "text": "throw new InvalidArgumentException('negative');",
        "rationale": "This rejects the input with an exception, while the contract requires ignoring only the negative entry.",
        "misconception": "Choosing whole-operation rejection for an explicitly skippable item."
      }
    ],
    "correctOptionId": "skip-current",
    "explanation": {
      "summary": "continue advances to the next loop iteration. break exits the loop, return exits the function and throw changes the operation into failure.",
      "trace": "The function adds 2, skips -1 and then adds 3, returning 5."
    },
    "validation": {
      "kind": "patch",
      "marker": "break;",
      "stdout": "5",
      "errors": {
        "reject-input": "negative"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
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
    "id": "PHP-E26-0527",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "variable-function-call-versus-literal-function-name",
    "objective": {
      "id": "variable-function-call-versus-literal-function-name",
      "text": "Invoke the function named by a string variable rather than a literal identifier or hard-coded substitute."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Follow the selected operation through two calls that require different built-in functions."
    },
    "prerequisites": [
      "Variable functions",
      "String function names",
      "strlen",
      "ord"
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
        "The operation names are the trusted fixed values strlen and ord shown below. The helper is not an interface for invoking arbitrary user-supplied function names. ord returns the ASCII byte value for A, which is 65."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction applyOperation(string $operation, string $text): int\n{\n    return operation($text);\n}\n\necho json_encode([\n    applyOperation('strlen', 'hello'),\n    applyOperation('ord', 'A'),\n]);\n"
        }
      ]
    },
    "stem": "Which expression replaces operation($text) so both selected operations run correctly?",
    "options": [
      {
        "id": "selected-function",
        "text": "$operation($text)",
        "rationale": "PHP resolves the string value of operation as the function name and passes text as its argument.",
        "misconception": null
      },
      {
        "id": "hard-coded-length",
        "text": "strlen($text)",
        "rationale": "This happens to satisfy the first call but ignores the selected ord operation in the second.",
        "misconception": "Replacing dynamic dispatch with the first observed operation."
      },
      {
        "id": "measure-name",
        "text": "strlen($operation)",
        "rationale": "This measures the function-name string itself, producing 6 and 3 instead of the requested operations.",
        "misconception": "Confusing the callable name with the argument to process."
      },
      {
        "id": "quoted-variable-name",
        "text": "call_user_func('operation', $text)",
        "rationale": "The quoted word operation names a function that does not exist; it does not read the variable’s value.",
        "misconception": "Quoting a variable name and expecting variable interpolation without the variable syntax."
      }
    ],
    "correctOptionId": "selected-function",
    "explanation": {
      "summary": "A string variable followed by call parentheses is a variable-function call. The stored name selects the function; an unprefixed or quoted literal operation does not refer to that variable.",
      "trace": "The first call invokes strlen on hello and yields 5. The second invokes ord on A and yields 65."
    },
    "validation": {
      "kind": "patch",
      "marker": "operation($text)",
      "stdout": "[5,65]",
      "original": {
        "stdout": "",
        "error": "Call to undefined function operation()"
      },
      "errors": {
        "quoted-variable-name": "must be a valid callback"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/functions.variable-functions.php",
      "https://www.php.net/manual/en/function.call-user-func.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0528",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "decode-json-object-to-associative-php-array",
    "objective": {
      "id": "decode-json-object-to-associative-php-array",
      "text": "Decode a known JSON object into the associative PHP array required by a function’s return contract."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish decoding to arrays from default object decoding, casting raw JSON text and encoding the text again."
    },
    "prerequisites": [
      "json_decode associative argument",
      "PHP array return type",
      "JSON text versus decoded values"
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
          "source": "<?php\n\nfunction decodeRecord(string $json): array\n{\n    return json_decode($json);\n}\n\n$record = decodeRecord('{\"name\":\"Ada\",\"active\":true}');\necho json_encode($record);\n"
        }
      ]
    },
    "stem": "Which return expression creates the required associative array for this known JSON object?",
    "options": [
      {
        "id": "default-object",
        "text": "json_decode($json)",
        "rationale": "The default decode yields a stdClass object, which cannot satisfy the declared array return type.",
        "misconception": "Assuming JSON object syntax automatically means a PHP associative array."
      },
      {
        "id": "raw-text-cast",
        "text": "(array) $json",
        "rationale": "Casting the raw text creates an indexed array containing that string; it does not parse its members.",
        "misconception": "Treating a PHP type cast as a JSON parser."
      },
      {
        "id": "encode-before-decode",
        "text": "json_decode(json_encode($json), true)",
        "rationale": "Encoding the existing text makes a JSON string; decoding it returns the original text string, not its object members.",
        "misconception": "Adding an encoding layer and assuming decoding it also parses the contained JSON text."
      },
      {
        "id": "associative-decode",
        "text": "json_decode($json, true)",
        "rationale": "The associative flag converts the JSON object members into the required PHP key/value array.",
        "misconception": null
      }
    ],
    "correctOptionId": "associative-decode",
    "explanation": {
      "summary": "json_decode’s associative flag controls the PHP representation of JSON objects. It parses the original JSON once and returns an array when true; a cast or extra encoding layer does something different.",
      "trace": "The resulting array contains name => Ada and active => true. It satisfies the return declaration and encodes back to the displayed object shape."
    },
    "validation": {
      "kind": "patch",
      "marker": "json_decode($json)",
      "stdout": "{\"name\":\"Ada\",\"active\":true}",
      "errors": {
        "default-object": "Return value must be of type array",
        "encode-before-decode": "Return value must be of type array"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.json-decode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0529",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "file-lines-strip-endings-retain-blank-records",
    "objective": {
      "id": "file-lines-strip-endings-retain-blank-records",
      "text": "Remove line-ending bytes from file’s returned lines while retaining physical blank lines as empty strings."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate line-ending removal from omission of empty records."
    },
    "prerequisites": [
      "file array result",
      "FILE_IGNORE_NEW_LINES",
      "FILE_SKIP_EMPTY_LINES",
      "LF line endings"
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
        "The owned fixture contains exactly the displayed ASCII bytes, and reading succeeds. Every physical blank line is a meaningful empty record that must remain in the result."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$path = __DIR__ . '/lines.txt';\nfile_put_contents($path, \"alpha\\n\\nbeta\\n\");\n\n$lines = file($path, FILE_SKIP_EMPTY_LINES);\necho json_encode($lines);\n"
        }
      ]
    },
    "stem": "Which flags argument replaces FILE_SKIP_EMPTY_LINES to produce [\"alpha\",\"\",\"beta\"]?",
    "options": [
      {
        "id": "no-flags",
        "text": "0",
        "rationale": "The empty line remains, but line-ending bytes remain in the strings too.",
        "misconception": "Assuming file always removes physical line endings."
      },
      {
        "id": "strip-and-skip",
        "text": "FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES",
        "rationale": "This strips endings but also removes the meaningful blank record.",
        "misconception": "Combining related flags without preserving the required empty-line behavior."
      },
      {
        "id": "strip-only",
        "text": "FILE_IGNORE_NEW_LINES",
        "rationale": "This removes each line ending while retaining the blank physical line as an empty string.",
        "misconception": null
      },
      {
        "id": "skip-only",
        "text": "FILE_SKIP_EMPTY_LINES",
        "rationale": "This discards the blank record and does not by itself remove the retained lines’ endings.",
        "misconception": "Treating empty-line removal as equivalent to trimming separators from every line."
      }
    ],
    "correctOptionId": "strip-only",
    "explanation": {
      "summary": "The two flags solve different problems. IGNORE_NEW_LINES changes each returned line’s representation; SKIP_EMPTY_LINES removes records, which this contract forbids.",
      "trace": "The three physical lines become alpha, an empty string and beta. The terminal newline is a separator, not an extra fourth line."
    },
    "validation": {
      "kind": "patch",
      "marker": "FILE_SKIP_EMPTY_LINES",
      "stdout": "[\"alpha\",\"\",\"beta\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.file.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0530",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Syntax & execution model",
    "subtopic": "short-echo-tag-independent-of-short-open-tag",
    "objective": {
      "id": "short-echo-tag-independent-of-short-open-tag",
      "text": "Use PHP’s short echo tag in a template when ordinary short opening tags are disabled."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish the always-available echo tag from ordinary short tags and a PHP expression that is never output."
    },
    "prerequisites": [
      "PHP template tags",
      "short_open_tag configuration",
      "echo versus evaluating an expression"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [],
      "ini": {
        "short_open_tag": 0
      },
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "short_open_tag is disabled for linting and execution. The name is the fixed trusted ASCII fixture Ada; HTML escaping policy is outside this syntax question. Replace the complete short-tag expression inside the paragraph, leaving the other source unchanged."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$name = 'Ada';\n?>\n<p><? echo $name; ?></p>\n"
        }
      ]
    },
    "stem": "Which replacement renders the paragraph containing Ada without changing PHP configuration?",
    "options": [
      {
        "id": "disabled-short-tag",
        "text": "<? $name; ?>",
        "rationale": "With ordinary short tags disabled, this is literal template text; it also lacks an echo operation.",
        "misconception": "Assuming removing echo converts an ordinary short tag into an enabled output tag."
      },
      {
        "id": "enabled-short-echo",
        "text": "<?= $name ?>",
        "rationale": "The short echo tag is available independently of short_open_tag and emits the expression’s value.",
        "misconception": null
      },
      {
        "id": "expression-without-output",
        "text": "<?php $name; ?>",
        "rationale": "This enters PHP successfully but merely evaluates the variable without printing it.",
        "misconception": "Treating expression evaluation in a template as implicit output."
      },
      {
        "id": "asp-style-tag",
        "text": "<%= $name %>",
        "rationale": "ASP-style PHP tags are not supported by the stated PHP versions.",
        "misconception": "Applying legacy or another template language’s output-tag syntax to modern PHP."
      }
    ],
    "correctOptionId": "enabled-short-echo",
    "explanation": {
      "summary": "The <?= tag is shorthand for an echo expression and is not disabled by short_open_tag=0. Ordinary <? tags and ASP-style tags do not provide that behavior in this configuration.",
      "trace": "The replacement emits the fixed name between the paragraph tags, producing <p>Ada</p> followed by the source’s final newline."
    },
    "validation": {
      "kind": "patch",
      "marker": "<? echo $name; ?>",
      "stdout": "<p>Ada</p>\n",
      "ini": {
        "short_open_tag": 0
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-01"
    },
    "references": [
      "https://www.php.net/manual/en/language.basic-syntax.phptags.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0531",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Types, casting & comparisons",
    "subtopic": "explicit-nullable-default-preserves-optional-string-contract",
    "objective": {
      "id": "explicit-nullable-default-preserves-optional-string-contract",
      "text": "Remove PHP 8.4’s implicit-nullability deprecation while retaining an optional string-or-null parameter contract."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Preserve both omission and explicit null without widening admitted values or making the parameter required."
    },
    "prerequisites": [
      "PHP 8.4 implicit-nullability deprecation",
      "Nullable types",
      "Optional arguments",
      "Argument type errors"
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
          "source": "<?php\n\nfunction classifyName(string $name = null): string\n{\n    return get_debug_type($name);\n}\n\n$results = [classifyName(), classifyName(null), classifyName('Ada')];\n\ntry {\n    $results[] = classifyName([]);\n} catch (TypeError $failure) {\n    $results[] = 'rejected';\n}\n\necho json_encode($results);\n"
        }
      ]
    },
    "stem": "Which parameter declaration replaces string $name = null, removing the deprecation while preserving all required calls and rejecting arrays?",
    "options": [
      {
        "id": "required-nullable",
        "text": "?string $name",
        "rationale": "This permits null but removes the default, so the omitted-argument call fails.",
        "misconception": "Fixing the admitted type while accidentally changing argument optionality."
      },
      {
        "id": "string-empty-default",
        "text": "string $name = ''",
        "rationale": "This changes the omitted value to an empty string and rejects the explicitly supplied null.",
        "misconception": "Replacing null with an empty default while assuming the public contract is unchanged."
      },
      {
        "id": "mixed-default",
        "text": "mixed $name = null",
        "rationale": "This removes the deprecation but also admits arrays, violating the required string-or-null boundary.",
        "misconception": "Using a broader type to silence a compatibility diagnostic."
      },
      {
        "id": "explicit-nullable",
        "text": "?string $name = null",
        "rationale": "This states nullability explicitly while retaining the omitted-argument default and excluding arrays.",
        "misconception": null
      }
    ],
    "correctOptionId": "explicit-nullable",
    "explanation": {
      "summary": "A null default no longer provides a nondeprecated implicit nullable declaration in PHP 8.4+. Explicit ?string retains the original admitted values, and keeping = null preserves optionality.",
      "trace": "Omission and explicit null report null, the string reports string, and an array is rejected by the parameter type."
    },
    "validation": {
      "kind": "patch",
      "marker": "string $name = null",
      "stdout": "[\"null\",\"null\",\"string\",\"rejected\"]",
      "original": {
        "stdout": "[\"null\",\"null\",\"string\",\"rejected\"]",
        "error": {
          "message": "Implicitly marking parameter $name as nullable is deprecated",
          "exitCode": 0
        }
      },
      "errors": {
        "required-nullable": "Too few arguments",
        "string-empty-default": "must be of type string, null given"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/migration84.deprecated.php",
      "https://www.php.net/manual/en/language.types.declarations.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0532",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "HTTP & superglobals",
    "subtopic": "front-controller-route-path-extraction-without-decoding",
    "objective": {
      "id": "front-controller-route-path-extraction-without-decoding",
      "text": "Extract the original request’s encoded path separately from its query string and the executing PHP script name."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish web-server request metadata from a front controller’s implementation path and from URL decoding."
    },
    "prerequisites": [
      "REQUEST_URI versus PHP_SELF",
      "Front controllers",
      "parse_url components",
      "Percent-encoded path data"
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
        "The fixture supplies the server values shown; no web server is contacted. REQUEST_URI uses origin-form path plus query. Routing requires the encoded path exactly as received, with the query removed and no percent-decoding at this stage."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$_SERVER = [\n    'REQUEST_URI' => '/products%2Fspecial?sort=name',\n    'PHP_SELF' => '/index.php',\n];\n\nfunction routePath(): string\n{\n    return $_SERVER['PHP_SELF'];\n}\n\necho routePath();\n"
        }
      ]
    },
    "stem": "Which expression replaces PHP_SELF so routePath returns /products%2Fspecial?",
    "options": [
      {
        "id": "script-path",
        "text": "$_SERVER['PHP_SELF']",
        "rationale": "This identifies the front-controller script, not the original requested route.",
        "misconception": "Confusing the executing PHP file path with the client’s routed path."
      },
      {
        "id": "decoded-request",
        "text": "rawurldecode($_SERVER['REQUEST_URI'])",
        "rationale": "This both changes the encoded slash into a path separator and leaves the query attached.",
        "misconception": "Treating decoding an entire request target as path extraction."
      },
      {
        "id": "path-component",
        "text": "parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)",
        "rationale": "This extracts the encoded path component without decoding its percent escapes.",
        "misconception": null
      },
      {
        "id": "query-component",
        "text": "parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY)",
        "rationale": "This returns sort=name, the component that routing needs to exclude.",
        "misconception": "Selecting the query component instead of the path component."
      }
    ],
    "correctOptionId": "path-component",
    "explanation": {
      "summary": "A front controller’s own filename is not the requested route. parse_url can separate the path and query while preserving encoded path bytes for a later routing-specific interpretation.",
      "trace": "The selected path is /products%2Fspecial. The query sort=name is excluded, and %2F remains encoded rather than becoming another slash."
    },
    "validation": {
      "kind": "patch",
      "marker": "$_SERVER['PHP_SELF']",
      "stdout": "/products%2Fspecial",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/reserved.variables.server.php",
      "https://www.php.net/manual/en/function.parse-url.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0533",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "path-entry-inventory-includes-dangling-symlink",
    "objective": {
      "id": "path-entry-inventory-includes-dangling-symlink",
      "text": "Recognize an occupied pathname even when its directory entry is a symlink whose target is missing."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine target-following existence checks with link-entry checks without treating accessibility as existence."
    },
    "prerequisites": [
      "Symbolic links",
      "file_exists target behavior",
      "is_link entry behavior",
      "Boolean combinations"
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
        "A read-only POSIX directory inventory contains only regular files, directories, symlinks and absent names. Existing regular entries can be unreadable and unwritable. The filesystem does not change during a check. Occupied means any of those directory entries exists, including a dangling symlink. This is inventory reporting, not an atomic file-creation or security-reservation guarantee. No filesystem fixture is executed."
      ],
      "files": []
    },
    "stem": "The current file_exists($path) check incorrectly labels dangling symlinks as unoccupied. Which condition satisfies the full inventory contract?",
    "options": [
      {
        "id": "exists-and-link",
        "text": "file_exists($path) && is_link($path)",
        "rationale": "This excludes ordinary files and directories, and also excludes a dangling link whose target does not exist.",
        "misconception": "Requiring both target existence and link identity instead of accepting either entry evidence."
      },
      {
        "id": "exists-or-link",
        "text": "file_exists($path) || is_link($path)",
        "rationale": "Resolved existing files/directories pass the first check; a dangling symlink still passes the entry-level link check.",
        "misconception": null
      },
      {
        "id": "resolved-type",
        "text": "is_file($path) || is_dir($path)",
        "rationale": "These type checks follow the link target, so neither identifies a dangling link as an occupied entry.",
        "misconception": "Assuming resolved target type covers the link’s own existence."
      },
      {
        "id": "accessible-entry",
        "text": "is_readable($path) || is_writable($path)",
        "rationale": "An occupied entry can lack both permissions, and a dangling link need not provide an accessible target.",
        "misconception": "Using access permissions as a substitute for directory-entry presence."
      }
    ],
    "correctOptionId": "exists-or-link",
    "explanation": {
      "summary": "file_exists follows symbolic links and reports false when the target is missing. is_link tests the entry itself, so combining the two with OR covers the stated ordinary entries and dangling links.",
      "trace": "A regular file or directory is occupied through file_exists. A dangling link is occupied through is_link. A truly absent pathname satisfies neither."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP documents file_exists returning false for symbolic links to nonexistent targets. is_link identifies the symbolic-link entry. The stated stable snapshot and entry types define the required boolean truth table.",
      "optionAudit": {
        "exists-and-link": "Rejects both nonlink entries and dangling links.",
        "exists-or-link": "Includes every stipulated entry category while excluding absent names.",
        "resolved-type": "Misses a link with no target type.",
        "accessible-entry": "Misses existing entries without the checked access permissions."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.file-exists.php",
      "https://www.php.net/manual/en/function.is-link.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0534",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "mkdir-requested-mode-versus-process-umask",
    "objective": {
      "id": "mkdir-requested-mode-versus-process-umask",
      "text": "Create a directory with owner-only permissions rather than mistaking the process umask for a private-directory mode."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine requested permission bits with the mask that can remove but cannot add permissions."
    },
    "prerequisites": [
      "POSIX permission modes",
      "Octal notation",
      "mkdir mode",
      "umask"
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
        "The isolated fixture runs on a POSIX filesystem without ACL adjustments. All operations succeed. The directory is new and must grant read, write and traversal to its owner and no permissions to group or others. The final chmod belongs only to test cleanup so every candidate’s directory can be removed."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\numask(0022);\n$directory = __DIR__ . '/private-data';\nmkdir($directory, 0777);\n\n$permissions = fileperms($directory) & 0777;\nchmod($directory, 0700);\necho sprintf('%04o', $permissions);\n"
        }
      ]
    },
    "stem": "Which requested mode replaces 0777 and produces the required 0700 after the displayed umask is applied?",
    "options": [
      {
        "id": "private-mode",
        "text": "0700",
        "rationale": "The requested mode grants only owner permissions, and the 0022 mask removes none of those bits.",
        "misconception": null
      },
      {
        "id": "public-read",
        "text": "0755",
        "rationale": "This still grants read and traversal to group and others; the mask does not remove those bits.",
        "misconception": "Assuming the common default mask makes a conventional public mode private."
      },
      {
        "id": "group-mode",
        "text": "0770",
        "rationale": "The mask removes group write but leaves group read and traversal, yielding 0750.",
        "misconception": "Assuming masking group write removes every group permission."
      },
      {
        "id": "mask-as-mode",
        "text": "0022",
        "rationale": "The mask removes the same write bits requested by this value, yielding no permissions rather than owner access.",
        "misconception": "Passing the mask itself as the creation mode."
      }
    ],
    "correctOptionId": "private-mode",
    "explanation": {
      "summary": "A umask clears bits from the requested mode; it does not transform a public requested mode into a full owner-only permission set. Requesting 0700 states the desired owner permissions directly.",
      "trace": "0700 AND NOT 0022 remains 0700. The observed mode is captured before the harness restores cleanup access."
    },
    "validation": {
      "kind": "patch",
      "marker": "mkdir($directory, 0777);",
      "candidates": {
        "private-mode": "mkdir($directory, 0700);",
        "public-read": "mkdir($directory, 0755);",
        "group-mode": "mkdir($directory, 0770);",
        "mask-as-mode": "mkdir($directory, 0022);"
      },
      "stdout": "0700",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.mkdir.php",
      "https://www.php.net/manual/en/function.umask.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0535",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Classes & object lifecycle",
    "subtopic": "invoke-nonstatic-method-on-configured-instance",
    "objective": {
      "id": "invoke-nonstatic-method-on-configured-instance",
      "text": "Call a nonstatic method on the configured object whose instance state the result requires."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish an instance call from class-style dispatch and from constructing a different object."
    },
    "prerequisites": [
      "Instance methods",
      "Static-call restrictions in PHP 8",
      "Constructor state",
      "$this"
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
          "source": "<?php\n\nclass PrefixFormatter\n{\n    public function __construct(private string $prefix)\n    {\n    }\n\n    public function format(string $text): string\n    {\n        return $this->prefix . $text;\n    }\n}\n\n$formatter = new PrefixFormatter('live:');\n$text = 'ok';\necho PrefixFormatter::format($text);\n"
        }
      ]
    },
    "stem": "Which expression replaces the failing class-style call and uses the existing formatter’s live: prefix?",
    "options": [
      {
        "id": "instance-method",
        "text": "$formatter->format($text)",
        "rationale": "This invokes the method with the configured formatter as this, preserving its live: prefix.",
        "misconception": null
      },
      {
        "id": "class-method",
        "text": "PrefixFormatter::format($text)",
        "rationale": "The method is nonstatic and requires instance state; PHP 8 rejects this static call.",
        "misconception": "Assuming a nonstatic method can be invoked through its class name without a receiver."
      },
      {
        "id": "object-class-dispatch",
        "text": "$formatter::format($text)",
        "rationale": "Using an object to select the class for :: does not turn this nonstatic method into an ordinary -> call.",
        "misconception": "Assuming an object before :: supplies this as an instance receiver."
      },
      {
        "id": "replacement-instance",
        "text": "(new PrefixFormatter('default:'))->format($text)",
        "rationale": "This is a valid instance call but uses a new object with the wrong configured prefix.",
        "misconception": "Fixing dispatch syntax while discarding the required instance’s state."
      }
    ],
    "correctOptionId": "instance-method",
    "explanation": {
      "summary": "The -> form invokes the method on the configured object. Class-style :: dispatch cannot supply this method’s required instance, and a different object need not share the required configuration.",
      "trace": "The existing formatter stores live:. Its instance method concatenates that prefix with ok and returns live:ok."
    },
    "validation": {
      "kind": "patch",
      "marker": "PrefixFormatter::format($text)",
      "stdout": "live:ok",
      "errors": {
        "class-method": "cannot be called statically",
        "object-class-dispatch": "cannot be called statically"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.static.php",
      "https://www.php.net/manual/en/language.oop5.basic.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0536",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "PDO & database access",
    "subtopic": "pdo-bound-value-must-not-be-prequoted",
    "objective": {
      "id": "pdo-bound-value-must-not-be-prequoted",
      "text": "Bind the original value rather than SQL-literal quoting syntax when using a prepared statement."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate a parameter value from text intended for interpolation into SQL source."
    },
    "prerequisites": [
      "PDO parameter binding",
      "PDO::quote return representation",
      "SQL string quoting",
      "Stored data versus query syntax"
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
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec('CREATE TABLE people (name TEXT)');\n$statement = $pdo->prepare('INSERT INTO people (name) VALUES (?)');\n$name = \"O'Reilly\";\n\n$statement->execute([$pdo->quote($name)]);\necho json_encode($pdo->query('SELECT name FROM people')->fetchColumn());\n"
        }
      ]
    },
    "stem": "Which expression replaces PDO::quote in the parameter array so the stored name remains exactly O'Reilly?",
    "options": [
      {
        "id": "quoted-literal",
        "text": "$pdo->quote($name)",
        "rationale": "The quote marks and doubled apostrophe become part of the bound data rather than SQL syntax.",
        "misconception": "Combining SQL-literal quoting with a parameter binding layer that already separates values."
      },
      {
        "id": "backslash-escaped",
        "text": "addslashes($name)",
        "rationale": "The added backslash is stored as a real data character; it is not needed to protect this placeholder value.",
        "misconception": "Applying generic text escaping before binding a database value."
      },
      {
        "id": "original-value",
        "text": "$name",
        "rationale": "The placeholder accepts the original value as data, including its apostrophe, without inserting it into the SQL source.",
        "misconception": null
      },
      {
        "id": "doubled-apostrophe",
        "text": "str_replace(\"'\", \"''\", $name)",
        "rationale": "Doubling is a SQL-literal convention; in a bound value both apostrophes become stored data.",
        "misconception": "Applying literal-syntax escaping to a value that is never parsed as a literal."
      }
    ],
    "correctOptionId": "original-value",
    "explanation": {
      "summary": "A bound parameter is already separate from the SQL text. PDO::quote is for constructing a quoted SQL literal, so using its result as a parameter adds unwanted quote syntax to the stored value.",
      "trace": "Binding the original name stores one apostrophe between O and Reilly. The selected row encodes to the JSON string \"O'Reilly\"."
    },
    "validation": {
      "kind": "patch",
      "marker": "$pdo->quote($name)",
      "stdout": "\"O'Reilly\"",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdo.quote.php",
      "https://www.php.net/manual/en/pdostatement.execute.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0537",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "partial-date-format-reset-before-time-fields",
    "objective": {
      "id": "partial-date-format-reset-before-time-fields",
      "text": "Reset unspecified date/time fields before parsing a time-only value so the result does not inherit current process time."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish the position of a reset format character from missing input fields and default current-time state."
    },
    "prerequisites": [
      "DateTimeImmutable::createFromFormat",
      "Reset format character !",
      "Unspecified date/time fields",
      "UTC"
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
        "The process’s current UTC date is not 1970-01-01. The required normalized result is 1970-01-01 12:34:00 for input 12:34; it must not depend on the current date or seconds."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$date = DateTimeImmutable::createFromFormat(\n    'H:i',\n    '12:34',\n    new DateTimeZone('UTC'),\n);\n\n$result = $date === false ? null : $date->format('Y-m-d H:i:s');\necho json_encode($result);\n"
        }
      ]
    },
    "stem": "Which format string replaces H:i to produce the required normalized timestamp?",
    "options": [
      {
        "id": "current-defaults",
        "text": "'H:i'",
        "rationale": "Unspecified fields inherit current date/time values, so the required epoch date is not established.",
        "misconception": "Assuming omitted fields default to the Unix epoch automatically."
      },
      {
        "id": "reset-first",
        "text": "'!H:i'",
        "rationale": "The initial reset establishes the epoch baseline, then the supplied hour and minute replace their fields.",
        "misconception": null
      },
      {
        "id": "reset-last",
        "text": "'H:i!'",
        "rationale": "The trailing reset also clears the hour and minute that were just parsed, leaving midnight rather than 12:34.",
        "misconception": "Assuming the reset affects only fields omitted from the input regardless of its position."
      },
      {
        "id": "require-seconds",
        "text": "'H:i:s'",
        "rationale": "The input has no seconds field, so the extra required input is missing and parsing fails.",
        "misconception": "Adding a seconds format token as though it supplied a default zero value."
      }
    ],
    "correctOptionId": "reset-first",
    "explanation": {
      "summary": "The ! format character resets the date/time fields at its position in parsing. Placing it first supplies a deterministic baseline before H and i assign the requested time.",
      "trace": "Reset gives 1970-01-01 00:00:00 UTC. Parsing 12:34 changes the hour and minute, retaining the reset date and zero seconds."
    },
    "validation": {
      "kind": "patch",
      "marker": "'H:i'",
      "stdout": "\"1970-01-01 12:34:00\"",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/datetimeimmutable.createfromformat.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0538",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "php-int-json-to-javascript-safe-identifier-string",
    "objective": {
      "id": "php-int-json-to-javascript-safe-identifier-string",
      "text": "Preserve a 64-bit PHP identifier across ordinary JavaScript JSON parsing without changing the response’s object shape."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate PHP integer precision from the receiving runtime’s binary64 number representation."
    },
    "prerequisites": [
      "64-bit PHP integers",
      "json_encode",
      "JavaScript JSON.parse number semantics",
      "Identifier wire representation"
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
        "The PHP process is 64-bit. The JavaScript client uses ordinary JSON.parse without a reviver, then reads data.id.toString(). JavaScript Number cannot exactly represent the integer 9007199254740993. The client must recover that exact decimal identifier and the response must remain an object with an id member."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$id = 9007199254740993;\n$payload = ['id' => $id];\n\necho json_encode($payload);\n"
        }
      ]
    },
    "stem": "Which payload assignment preserves the identifier at this client boundary?",
    "options": [
      {
        "id": "php-integer",
        "text": "[\"id\" => $id]",
        "rationale": "PHP emits the exact integer digits, but ordinary JavaScript parsing stores them as an inexact Number.",
        "misconception": "Assuming precision in the sender’s integer type guarantees precision in every JSON receiver."
      },
      {
        "id": "float-number",
        "text": "[\"id\" => (float) $id]",
        "rationale": "The conversion loses precision in PHP before the receiver even parses the numeric value.",
        "misconception": "Using a floating-point intermediary to transport a large exact identifier."
      },
      {
        "id": "scalar-string",
        "text": "(string) $id",
        "rationale": "The digits survive, but the response becomes a JSON string rather than the required object containing id.",
        "misconception": "Preserving the value while discarding the agreed response structure."
      },
      {
        "id": "member-string",
        "text": "[\"id\" => (string) $id]",
        "rationale": "The id member is encoded as decimal text, so JSON.parse preserves its digits and the client’s toString call returns them unchanged.",
        "misconception": null
      }
    ],
    "correctOptionId": "member-string",
    "explanation": {
      "summary": "JSON numeric text does not carry the sender’s integer precision guarantee into JavaScript Number. Encoding the identifier member as a string preserves its exact decimal representation while retaining the object contract.",
      "trace": "The response contains an id string equal to 9007199254740993. Ordinary JSON.parse leaves that string exact; emitting a numeric member instead rounds it to 9007199254740992 in the stated client."
    },
    "validation": {
      "kind": "patch",
      "marker": "['id' => $id]",
      "stdout": "{\"id\":\"9007199254740993\"}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.integer.php",
      "https://tc39.es/ecma262/#sec-number.max_safe_integer",
      "https://tc39.es/ecma262/#sec-json.parse"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0539",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Includes, autoloading & paths",
    "subtopic": "unregister-autoloader-using-original-closure-identity",
    "objective": {
      "id": "unregister-autoloader-using-original-closure-identity",
      "text": "Unregister the same Closure instance that was registered as an autoloader."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish callback identity retained by a registry from equivalent source code or a local variable name."
    },
    "prerequisites": [
      "spl_autoload_register",
      "spl_autoload_unregister",
      "Closure object identity",
      "Captured reference state"
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
        "The fresh process has no other autoloaders. Neither missing class exists, and the callback intentionally records requests without defining classes or reading files."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction makeLoader(array &$seen): Closure\n{\n    return static function (string $class) use (&$seen): void {\n        $seen[] = $class;\n    };\n}\n\n$seen = [];\n$loader = makeLoader($seen);\nspl_autoload_register($loader);\nclass_exists('MissingBefore539');\n\nspl_autoload_unregister(makeLoader($seen));\nclass_exists('MissingAfter539');\n\necho json_encode($seen);\n"
        }
      ]
    },
    "stem": "Which statement replaces the unregister call so the second missing-class lookup does not reach this loader?",
    "options": [
      {
        "id": "fresh-equivalent",
        "text": "spl_autoload_unregister(makeLoader($seen));",
        "rationale": "The fresh closure has the same implementation but is not the callback object stored in the registry.",
        "misconception": "Equating identical callback source with callback object identity."
      },
      {
        "id": "original-callback",
        "text": "spl_autoload_unregister($loader);",
        "rationale": "This supplies the actual registered Closure instance, removing its entry before the second lookup.",
        "misconception": null
      },
      {
        "id": "unset-variable",
        "text": "unset($loader);",
        "rationale": "The autoload registry still retains the callback object after the local variable is removed.",
        "misconception": "Assuming deleting one variable also removes a callback from a separate registry."
      },
      {
        "id": "register-again",
        "text": "spl_autoload_register($loader);",
        "rationale": "Registering an already registered callback does not unregister it.",
        "misconception": "Treating registration of the same callback as a toggle operation."
      }
    ],
    "correctOptionId": "original-callback",
    "explanation": {
      "summary": "The autoload registry stores a callable identity. A new closure with the same body is a different object, and dropping a local reference does not change the registry’s entry.",
      "trace": "MissingBefore539 is recorded while the loader is registered. Removing the original callback prevents MissingAfter539 from being appended."
    },
    "validation": {
      "kind": "patch",
      "marker": "spl_autoload_unregister(makeLoader($seen));",
      "stdout": "[\"MissingBefore539\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-09"
    },
    "references": [
      "https://www.php.net/manual/en/function.spl-autoload-unregister.php",
      "https://www.php.net/manual/en/function.spl-autoload-register.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0540",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Closures, callbacks & callables",
    "subtopic": "dynamic-call-argument-array-must-contain-reference",
    "objective": {
      "id": "dynamic-call-argument-array-must-contain-reference",
      "text": "Forward a by-reference argument through call_user_func_array so the original caller variable is mutated."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a value copied into an argument array from a reference element bound to the original variable."
    },
    "prerequisites": [
      "By-reference parameters",
      "call_user_func versus call_user_func_array",
      "References in arrays",
      "Caller-visible mutation"
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
        "The callback name is the trusted function shown. The required result is mutation of the existing value variable from 3 to 4, with no diagnostic."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction bumpValue(int &$number): void\n{\n    $number++;\n}\n\n$callback = 'bumpValue';\n$value = 3;\ncall_user_func($callback, $value);\n\necho $value;\n"
        }
      ]
    },
    "stem": "Which replacement forwards the required reference to the original variable?",
    "options": [
      {
        "id": "value-call",
        "text": "call_user_func($callback, $value);",
        "rationale": "This API call does not pass this argument by reference and reports the by-reference parameter diagnostic.",
        "misconception": "Assuming dynamic invocation automatically preserves a callee’s reference requirement."
      },
      {
        "id": "value-array",
        "text": "call_user_func_array($callback, [$value]);",
        "rationale": "The array contains a copied value, not a reference element bound to the caller variable.",
        "misconception": "Assuming changing the callback API alone creates references in its argument array."
      },
      {
        "id": "reference-element",
        "text": "call_user_func_array($callback, [&$value]);",
        "rationale": "The argument array element aliases value, so the callback’s increment updates the original variable.",
        "misconception": null
      },
      {
        "id": "reference-to-copy",
        "text": "$copy = $value;\ncall_user_func_array($callback, [&$copy]);",
        "rationale": "The callback receives a valid reference, but it points to copy rather than the required original value variable.",
        "misconception": "Satisfying the reference parameter with the wrong storage location."
      }
    ],
    "correctOptionId": "reference-element",
    "explanation": {
      "summary": "call_user_func_array can forward references when the supplied argument array actually contains reference elements. Creating a separate value or a reference to a copy cannot mutate the required original variable.",
      "trace": "The correct array element aliases value. bumpValue increments that storage to 4, which the final echo observes."
    },
    "validation": {
      "kind": "patch",
      "marker": "call_user_func($callback, $value);",
      "stdout": "4",
      "original": {
        "stdout": "3",
        "error": {
          "message": "must be passed by reference",
          "exitCode": 0
        }
      },
      "errors": {
        "value-call": {
          "message": "must be passed by reference",
          "exitCode": 0
        },
        "value-array": {
          "message": "must be passed by reference",
          "exitCode": 0
        }
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/function.call-user-func.php",
      "https://www.php.net/manual/en/function.call-user-func-array.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0541",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "psr18-http-error-status-is-returned-response",
    "objective": {
      "id": "psr18-http-error-status-is-returned-response",
      "text": "Diagnose a missing business failure branch when a PSR-18 client returns a well-formed HTTP error response."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Separate transport and message-processing failures from HTTP status semantics and domain error translation."
    },
    "prerequisites": [
      "PSR-18 client exception contracts (advanced)",
      "HTTP response status",
      "Domain exception translation"
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
        "A conforming PSR-18 client sends a valid request and receives a well-formed 404 response. There is no network, request construction or response parsing failure. The application must translate 404 into its own NotFound exception. It currently catches ClientExceptionInterface but otherwise returns the body as a successful lookup."
      ],
      "files": []
    },
    "stem": "Why does this lookup miss NotFound, and which repair matches the client contract?",
    "options": [
      {
        "id": "request-exception",
        "text": "Catch RequestExceptionInterface and translate it into NotFound.",
        "rationale": "That interface describes a request that could not be sent, not a valid HTTP response with status 404.",
        "misconception": "Confusing a request-processing failure with a resource not found response."
      },
      {
        "id": "inspect-status",
        "text": "Inspect the returned response status and translate 404 into NotFound.",
        "rationale": "PSR-18 returns well-formed 4xx and 5xx responses normally; application status policy must inspect the response.",
        "misconception": null
      },
      {
        "id": "network-exception",
        "text": "Catch NetworkExceptionInterface and translate it into NotFound.",
        "rationale": "A completed exchange with a well-formed response is not a network failure.",
        "misconception": "Equating an unsuccessful lookup with transport failure."
      },
      {
        "id": "returned-means-found",
        "text": "Treat any returned response as a found resource because sending succeeded.",
        "rationale": "Transport success does not establish that the resource lookup succeeded.",
        "misconception": "Collapsing HTTP status semantics into the client’s ability to complete the exchange."
      }
    ],
    "correctOptionId": "inspect-status",
    "explanation": {
      "summary": "PSR-18 separates failure to send or parse a message from the status carried by a successfully obtained response. A 404 is returned for the caller to interpret; catching client exceptions cannot implement this business mapping.",
      "trace": "The client returns the 404 response. The application reads its status and raises NotFound before accepting the body as a found resource."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PSR-18 error handling requires returning well-formed 4xx and 5xx responses without treating their status as a client exception.",
      "optionAudit": {
        "request-exception": "No request failure premise exists.",
        "inspect-status": "Maps the explicitly returned 404.",
        "network-exception": "No network failure premise exists.",
        "returned-means-found": "Fails the explicit NotFound contract."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php-fig.org/psr/psr-18/"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0542",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "interface-constructor-contract-overrides-parent-flexibility",
    "objective": {
      "id": "interface-constructor-contract-overrides-parent-flexibility",
      "text": "Repair a constructor declaration that must satisfy an interface even though parent constructor signatures normally permit variation."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine the special parent-constructor compatibility rule with an explicit interface contract and parent initialization."
    },
    "prerequisites": [
      "Constructor signature compatibility (advanced)",
      "Interfaces",
      "Public visibility",
      "Explicit parent constructor calls"
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
          "source": "<?php\n\ndeclare(strict_types=1);\n\ninterface HasId\n{\n    public function __construct(string $id);\n}\n\nclass Counted\n{\n    public function __construct(public int $count)\n    {\n    }\n}\n\nclass NamedCount extends Counted implements HasId\n{\n    public function __construct(int $id)\n    {\n        parent::__construct(strlen($id));\n    }\n}\n\necho (new NamedCount('AB'))->count;\n"
        }
      ]
    },
    "stem": "Which declaration replaces the child constructor declaration so this class satisfies HasId and prints 2?",
    "options": [
      {
        "id": "public-int",
        "text": "public function __construct(int $id)",
        "rationale": "Matching the parent’s int parameter does not satisfy HasId’s string input contract.",
        "misconception": "Applying parent constructor flexibility to an independent interface requirement."
      },
      {
        "id": "private-string",
        "text": "protected function __construct(string $id)",
        "rationale": "The interface requires public construction; narrowing visibility violates it.",
        "misconception": "Matching parameter types while overlooking interface visibility."
      },
      {
        "id": "public-string",
        "text": "public function __construct(string $id)",
        "rationale": "This satisfies the interface, and the body explicitly converts the identifier to the count required by the parent.",
        "misconception": null
      },
      {
        "id": "missing-parameter",
        "text": "public function __construct()",
        "rationale": "Removing the interface’s accepted argument is an incompatible implementation declaration.",
        "misconception": "Assuming a constructor may omit interface parameters because parent constructors are special."
      }
    ],
    "correctOptionId": "public-string",
    "explanation": {
      "summary": "The exception to ordinary parent constructor signature compatibility does not remove an interface’s constructor requirement. The child must expose the public string constructor, then explicitly initialize its parent with the derived integer.",
      "trace": "The valid declaration accepts AB, strlen yields 2, and the parent’s promoted count property stores 2."
    },
    "validation": {
      "kind": "patch",
      "marker": "public function __construct(int $id)",
      "stdout": "2",
      "errors": {
        "public-int": "must be compatible with HasId::__construct",
        "private-string": "must be public",
        "missing-parameter": "must be compatible with HasId::__construct"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.interfaces.php",
      "https://www.php.net/manual/en/language.oop5.decon.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0543",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Validation & web security",
    "subtopic": "path-check-open-race-requires-constrained-resolution",
    "objective": {
      "id": "path-check-open-race-requires-constrained-resolution",
      "text": "Repair a filesystem containment check whose checked directory path can change before the actual open."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Evaluate an adversarial check/use race against kernel-enforced path resolution rather than another string check."
    },
    "prerequisites": [
      "Filesystem TOCTOU races (advanced)",
      "Symlink path resolution",
      "Directory descriptors",
      "Linux openat2 constraints"
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
        "A Linux PHP service checks realpath of a parent directory beneath a trusted root, then creates a file through that path. An unprivileged attacker can rename directories and replace ancestors with symlinks between operations; hard-link and mount attacks are excluded. A reviewed native helper is available that holds the trusted root directory descriptor and calls openat2 with O_CREAT|O_EXCL and RESOLVE_BENEATH|RESOLVE_NO_SYMLINKS. Failures are rejected. The required guarantee concerns resolution during creation, not preventing later renames."
      ],
      "files": []
    },
    "stem": "Which repair prevents this check/open race under the stated capabilities?",
    "options": [
      {
        "id": "second-realpath",
        "text": "Repeat realpath and the root-prefix check immediately before file_put_contents.",
        "rationale": "Another user-space check still leaves a gap before path resolution by the write operation.",
        "misconception": "Assuming a shorter race window removes the race."
      },
      {
        "id": "exclusive-leaf",
        "text": "Use fopen with mode x after the existing parent-directory check.",
        "rationale": "Exclusive creation protects the final name from pre-existence; it does not constrain symlinks in ancestor resolution.",
        "misconception": "Extending a final-component exclusivity guarantee to all path components."
      },
      {
        "id": "walk-first",
        "text": "Use lstat on every ancestor, reject symlinks, then open the checked pathname.",
        "rationale": "An attacker may replace an ancestor after the inspection and before opening.",
        "misconception": "Treating a sequence of observations as an atomic resolution policy."
      },
      {
        "id": "constrained-open",
        "text": "Create through the supplied root-descriptor helper with the stated resolution constraints.",
        "rationale": "The kernel applies containment and no-symlink rules during the actual resolution instead of trusting an earlier pathname observation.",
        "misconception": null
      }
    ],
    "correctOptionId": "constrained-open",
    "explanation": {
      "summary": "The vulnerability is a change between checking names and using them. The supplied helper couples the actual open with kernel-enforced relative containment and symlink rejection; a second check or an exclusive leaf mode cannot provide that combined guarantee.",
      "trace": "The helper resolves relative to the retained root descriptor. Disallowed escape or symlink resolution fails before creation; the application rejects that failure."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Linux openat2 applies RESOLVE_BENEATH and RESOLVE_NO_SYMLINKS during resolution; pathname prechecks do not bind a later open.",
      "optionAudit": {
        "second-realpath": "Retains a check/use interval.",
        "exclusive-leaf": "Does not prohibit ancestor symlinks.",
        "walk-first": "Observations can become stale.",
        "constrained-open": "Enforces the required constraints at the operation."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://man7.org/linux/man-pages/man2/openat2.2.html",
      "https://www.php.net/manual/en/function.fopen.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0544",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Iterators, generators & fibers",
    "subtopic": "fiber-start-return-channel-versus-callback-result",
    "objective": {
      "id": "fiber-start-return-channel-versus-callback-result",
      "text": "Retrieve a normally terminated Fiber callback’s return value through getReturn rather than the control-transfer result of start."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Distinguish coroutine lifecycle states and the suspension/result channels when no suspension occurs."
    },
    "prerequisites": [
      "Fiber lifecycle (advanced)",
      "Fiber::start",
      "Fiber::getReturn",
      "FiberError"
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
        "The callback never suspends and returns normally. The caller must print its result, 42."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$fiber = new Fiber(static function (): int {\n    return 42;\n});\n\n$result = $fiber->start();\necho json_encode($result);\n"
        }
      ]
    },
    "stem": "Which replacement obtains the callback result without violating the Fiber lifecycle?",
    "options": [
      {
        "id": "start-result",
        "text": "$result = $fiber->start();",
        "rationale": "start returns a suspension value or null on normal termination, not the callback’s return value.",
        "misconception": "Equating the start control-transfer result with the callback result."
      },
      {
        "id": "return-after-start",
        "text": "$fiber->start();\n$result = $fiber->getReturn();",
        "rationale": "The callback has terminated normally, so getReturn retrieves its stored result.",
        "misconception": null
      },
      {
        "id": "resume-after-start",
        "text": "$fiber->start();\n$result = $fiber->resume();",
        "rationale": "The Fiber is terminated rather than suspended, so resume is invalid.",
        "misconception": "Assuming completion requires one more resumption to collect a result."
      },
      {
        "id": "return-before-start",
        "text": "$result = $fiber->getReturn();\n$fiber->start();",
        "rationale": "No callback return exists before the Fiber has run to completion.",
        "misconception": "Treating the result accessor as an operation that starts the callback."
      }
    ],
    "correctOptionId": "return-after-start",
    "explanation": {
      "summary": "start manages execution transfer; getReturn retrieves the callback result after normal termination. A Fiber that never suspends can finish during start, but start still does not return that final callback value.",
      "trace": "start executes the callback and marks the Fiber terminated. getReturn then yields integer 42."
    },
    "validation": {
      "kind": "patch",
      "marker": "$result = $fiber->start();",
      "stdout": "42",
      "errors": {
        "resume-after-start": "Cannot resume a fiber that is not suspended",
        "return-before-start": "has not been started"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/fiber.start.php",
      "https://www.php.net/manual/en/fiber.getreturn.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0545",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "PDO & database access",
    "subtopic": "sqlite-unconsumed-cursor-retains-schema-lock",
    "objective": {
      "id": "sqlite-unconsumed-cursor-retains-schema-lock",
      "text": "Release an active PDO SQLite result cursor before a schema operation that otherwise conflicts with its unfinished read."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Relate result consumption and statement lifecycle to connection-local SQLite schema locking."
    },
    "prerequisites": [
      "PDO SQLite cursor lifecycle (advanced)",
      "Unconsumed result rows",
      "Schema locks",
      "closeCursor"
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
        "This is an isolated in-memory SQLite database. The SELECT has three rows and only its first row has been fetched before the marked statement. The cursor is no longer needed."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n$pdo->exec('CREATE TABLE items (id INTEGER)');\n$pdo->exec('INSERT INTO items VALUES (1), (2), (3)');\n$cursor = $pdo->query('SELECT id FROM items');\n$cursor->fetchColumn();\n\n$cursor->rowCount();\n$pdo->exec('DROP TABLE items');\necho 'removed';\n"
        }
      ]
    },
    "stem": "Which replacement releases the active read so DROP TABLE succeeds?",
    "options": [
      {
        "id": "count-rows",
        "text": "$cursor->rowCount();",
        "rationale": "Reading a count does not finish or close the active SQLite read statement.",
        "misconception": "Assuming row-count inspection consumes a result."
      },
      {
        "id": "one-more-row",
        "text": "$cursor->fetchColumn();",
        "rationale": "One further fetch still leaves a row in this result and does not finish the read.",
        "misconception": "Assuming any additional fetch releases the statement’s resources."
      },
      {
        "id": "close-cursor",
        "text": "$cursor->closeCursor();",
        "rationale": "The cursor is explicitly released, allowing the schema operation to proceed.",
        "misconception": null
      },
      {
        "id": "change-mode",
        "text": "$cursor->setFetchMode(PDO::FETCH_NUM);",
        "rationale": "Changing future row representation does not close the active cursor.",
        "misconception": "Confusing result formatting with result lifecycle management."
      }
    ],
    "correctOptionId": "close-cursor",
    "explanation": {
      "summary": "An unfinished SQLite read statement can keep a table locked against DROP on the same connection. closeCursor ends the result lifecycle; counting, fetching only one more row or selecting a fetch mode does not.",
      "trace": "The first fetch leaves the SELECT active. Closing that cursor releases its read resources, and DROP TABLE then prints removed."
    },
    "validation": {
      "kind": "patch",
      "marker": "$cursor->rowCount();",
      "stdout": "removed",
      "errors": {
        "count-rows": "database table is locked",
        "one-more-row": "database table is locked",
        "change-mode": "database table is locked"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdostatement.closecursor.php",
      "https://www.sqlite.org/lang_droptable.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0546",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Operators & expressions",
    "subtopic": "postincrement-return-expression-keeps-old-value",
    "objective": {
      "id": "postincrement-return-expression-keeps-old-value",
      "text": "Review a return expression that increments local state but returns the pre-increment value."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate the value of a postfix expression from the state after its side effect."
    },
    "prerequisites": [
      "Postfix and prefix increment",
      "Return expressions"
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
          "source": "<?php\n\nfunction nextNumber(int $current): int\n{\n    $next = $current;\n\n    return $next++;\n}\n\necho json_encode([nextNumber(4), nextNumber(9)]);\n"
        }
      ]
    },
    "stem": "A reviewer proposes replacing return $next++ with return ++$next. Which assessment is correct for this helper?",
    "options": [
      {
        "id": "equivalent-increment",
        "text": "Both versions return the incremented value because increment completes before the caller resumes.",
        "rationale": "The postfix expression supplies the old value even though its side effect completes locally.",
        "misconception": "Confusing expression value with completed local mutation."
      },
      {
        "id": "changes-caller",
        "text": "The replacement also increments the caller’s argument by reference.",
        "rationale": "The parameter is passed by value and neither increment changes the caller’s variable.",
        "misconception": "Assuming prefix increment implies reference passing."
      },
      {
        "id": "returns-successor",
        "text": "The replacement returns each successor; the current version returns each original value.",
        "rationale": "Prefix increment produces the updated value, whereas postfix increment produces the previous value.",
        "misconception": null
      },
      {
        "id": "changes-only-second-call",
        "text": "Only later calls change because the local next variable persists between invocations.",
        "rationale": "The local variable is initialized on every invocation and is not static.",
        "misconception": "Assuming an ordinary local variable retains state between calls."
      }
    ],
    "correctOptionId": "returns-successor",
    "explanation": {
      "summary": "The value returned by postfix increment is the old value. Incrementing a local just before leaving the function does not make that returned value larger; prefix increment changes the expression’s result.",
      "trace": "The displayed version returns [4,9]. Replacing postfix with prefix returns [5,10]."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[4,9]",
      "keyEvidence": "The controlled prefix refactor returns both successors.",
      "counterexamples": {
        "equivalent-increment": "Original values are observed.",
        "changes-caller": "No reference parameter exists.",
        "changes-only-second-call": "Both independent calls change."
      },
      "contrasts": [
        {
          "name": "prefix-refactor",
          "marker": "return $next++;",
          "replacement": "return ++$next;",
          "stdout": "[5,10]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.increment.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0547",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Arrays & destructuring",
    "subtopic": "foreach-value-copy-does-not-rewrite-array-elements",
    "objective": {
      "id": "foreach-value-copy-does-not-rewrite-array-elements",
      "text": "Review a loop that changes its value variable without writing transformed values back into the array."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Trace a by-value foreach binding and identify the missing array assignment."
    },
    "prerequisites": [
      "foreach by value",
      "Array keys",
      "String transformation"
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
          "source": "<?php\n\n$names = ['a' => 'Ada', 'b' => 'Lin'];\n\nforeach ($names as $key => $name) {\n    $name = strtoupper($name);\n}\n\necho json_encode($names);\n"
        }
      ]
    },
    "stem": "The intended result is to uppercase every stored name. Which review comment explains the defect and a valid repair?",
    "options": [
      {
        "id": "write-back",
        "text": "Assign strtoupper($name) to $names[$key]; the loop value is currently a copy.",
        "rationale": "An explicit assignment updates the original element instead of just rebinding the local value variable.",
        "misconception": null
      },
      {
        "id": "uppercase-mutates",
        "text": "Keep the code: strtoupper changes the source array through the loop variable.",
        "rationale": "strtoupper returns text and the by-value loop variable does not alias the array element.",
        "misconception": "Treating value iteration as an alias to array storage."
      },
      {
        "id": "reindex-first",
        "text": "Call array_values first; associative keys prevent changes to loop values.",
        "rationale": "Numeric keys would not make a by-value loop variable write through to its source.",
        "misconception": "Attributing value-copy behavior to associative keys."
      },
      {
        "id": "rename-target",
        "text": "Rename name to names; matching the source variable name enables writeback.",
        "rationale": "Variable spelling does not establish an element reference, and overwriting the source name is harmful.",
        "misconception": "Assuming naming correspondence creates data binding."
      }
    ],
    "correctOptionId": "write-back",
    "explanation": {
      "summary": "By-value foreach assigns the current element value to the loop variable. Reassigning that variable does not replace the source element; write back through the key when the array must change.",
      "trace": "The displayed result remains Ada and Lin. The explicit keyed assignment stores ADA and LIN under the original keys."
    },
    "validation": {
      "kind": "contract",
      "stdout": "{\"a\":\"Ada\",\"b\":\"Lin\"}",
      "keyEvidence": "Keyed writeback changes both stored values.",
      "counterexamples": {
        "uppercase-mutates": "Original array values remain unchanged.",
        "reindex-first": "Key shape does not change by-value binding.",
        "rename-target": "Names do not create references."
      },
      "contrasts": [
        {
          "name": "keyed-writeback",
          "marker": "$name = strtoupper($name);",
          "replacement": "$names[$key] = strtoupper($name);",
          "stdout": "{\"a\":\"ADA\",\"b\":\"LIN\"}"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
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
    "id": "PHP-E26-0548",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "final-class-restricts-inheritance-not-state-mutation",
    "objective": {
      "id": "final-class-restricts-inheritance-not-state-mutation",
      "text": "Review a final class without interpreting final as an immutability or instantiation restriction."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate the class extension rule from ordinary object lifecycle and writable properties."
    },
    "prerequisites": [
      "Final classes",
      "Public properties",
      "Object instantiation",
      "Cloning"
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
          "source": "<?php\n\nfinal class Counter\n{\n    public int $value = 1;\n}\n\n$counter = new Counter();\n$counter->value++;\n$copy = clone $counter;\necho json_encode([$counter->value, $copy->value]);\n"
        }
      ]
    },
    "stem": "A reviewer claims final makes this counter immutable. Which assessment matches PHP?",
    "options": [
      {
        "id": "final-freezes-properties",
        "text": "final prevents the increment of a public property after construction.",
        "rationale": "final restricts extension of the class, not writes to its ordinary properties.",
        "misconception": "Confusing final with readonly state restrictions."
      },
      {
        "id": "final-blocks-new",
        "text": "final prevents constructing Counter directly, like abstract.",
        "rationale": "Final classes can be instantiated; the abstract modifier has the separate instantiation restriction.",
        "misconception": "Equating two unrelated class modifiers."
      },
      {
        "id": "final-blocks-clone",
        "text": "final permits mutation but prohibits cloning the object.",
        "rationale": "Final does not prohibit ordinary cloning.",
        "misconception": "Treating a restriction on subclasses as a restriction on new object copies."
      },
      {
        "id": "final-blocks-subclass",
        "text": "final prevents subclasses; this public property can still change and the object can be cloned.",
        "rationale": "The shown construction, mutation and clone are valid while extending Counter would be prohibited.",
        "misconception": null
      }
    ],
    "correctOptionId": "final-blocks-subclass",
    "explanation": {
      "summary": "final on a class controls inheritance. It neither freezes ordinary property values nor prevents instantiation or cloning.",
      "trace": "The public counter increments to 2. Cloning copies that scalar value, so both observed values are 2."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[2,2]",
      "keyEvidence": "The final class supports the displayed construction, mutation and cloning.",
      "counterexamples": {
        "final-freezes-properties": "The increment succeeds.",
        "final-blocks-new": "Construction succeeds.",
        "final-blocks-clone": "Cloning succeeds."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.final.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0549",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Functions & arguments",
    "subtopic": "empty-minimum-array-raises-valueerror",
    "objective": {
      "id": "empty-minimum-array-raises-valueerror",
      "text": "Review an empty-input path that assumes min returns a nullable sentinel."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply the built-in function’s empty-array failure contract to a nullable return declaration."
    },
    "prerequisites": [
      "min",
      "Empty arrays",
      "ValueError",
      "Nullable return types"
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
          "source": "<?php\n\nfunction lowestScore(array $scores): ?int\n{\n    return min($scores);\n}\n\ntry {\n    echo json_encode(lowestScore([]));\n} catch (ValueError $error) {\n    echo 'empty-error';\n}\n"
        }
      ]
    },
    "stem": "The helper promises null for an empty score list. Which review correctly evaluates its current implementation?",
    "options": [
      {
        "id": "nullable-converts-error",
        "text": "The nullable return type converts min’s empty-input error into null.",
        "rationale": "A return type does not catch or translate an exception raised while evaluating the return expression.",
        "misconception": "Treating a nullable declaration as automatic failure recovery."
      },
      {
        "id": "zero-identity",
        "text": "min returns zero for an empty array, so change the return type to int.",
        "rationale": "There is no zero identity for min over an empty PHP array; it raises ValueError.",
        "misconception": "Borrowing an empty-sum identity for a minimum operation."
      },
      {
        "id": "guard-empty",
        "text": "Return null explicitly for an empty list before calling min.",
        "rationale": "The guard implements the promised empty-input behavior and leaves nonempty minima unchanged.",
        "misconception": null
      },
      {
        "id": "cast-input",
        "text": "Cast scores to array before min so an empty list becomes an accepted value.",
        "rationale": "The value is already an array; its lack of elements remains the problem.",
        "misconception": "Confusing accepted argument type with a valid value within that type."
      }
    ],
    "correctOptionId": "guard-empty",
    "explanation": {
      "summary": "min on an empty array raises ValueError. A nullable return declaration permits returning null but does not manufacture it when evaluation fails.",
      "trace": "The current call prints empty-error. An explicit empty-list guard returns null instead."
    },
    "validation": {
      "kind": "contract",
      "stdout": "empty-error",
      "keyEvidence": "The guarded implementation returns null for the empty fixture.",
      "counterexamples": {
        "nullable-converts-error": "ValueError reaches the catch.",
        "zero-identity": "No zero is returned.",
        "cast-input": "The failing input already is an array."
      },
      "contrasts": [
        {
          "name": "empty-contract",
          "marker": "return min($scores);",
          "replacement": "return $scores === [] ? null : min($scores);",
          "stdout": "null"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.min.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0550",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Arrays & destructuring",
    "subtopic": "array-reverse-numeric-map-key-preservation",
    "objective": {
      "id": "array-reverse-numeric-map-key-preservation",
      "text": "Review reversing an integer-keyed map without changing the identifiers stored in its keys."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate entry order reversal from the default renumbering of integer keys."
    },
    "prerequisites": [
      "PHP array order",
      "Integer map keys",
      "array_reverse preserve_keys"
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
        "The integer keys are permanent record IDs, not list positions. The required order is ID 40 followed by ID 10, retaining those IDs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$records = [10 => 'Ada', 40 => 'Lin'];\n$reversed = array_reverse($records);\n\necho json_encode($reversed);\n"
        }
      ]
    },
    "stem": "Which review of array_reverse is correct for this record map?",
    "options": [
      {
        "id": "preserve-keys",
        "text": "Pass true as the second argument so reversing order retains integer record IDs.",
        "rationale": "The preserve_keys argument prevents renumbering numeric keys while reversing entries.",
        "misconception": null
      },
      {
        "id": "default-preserves-all",
        "text": "Keep the default call because reversal never changes keys.",
        "rationale": "By default array_reverse renumbers integer keys.",
        "misconception": "Generalizing string-key preservation to integer keys."
      },
      {
        "id": "sort-keys",
        "text": "Use ksort because ascending keys produce reversed insertion order.",
        "rationale": "ksort sorts keys ascending, which leaves ID 10 before ID 40 here.",
        "misconception": "Confusing order reversal with ascending key sorting."
      },
      {
        "id": "reverse-values-only",
        "text": "Apply array_values before reversing to preserve the original record IDs.",
        "rationale": "array_values discards those IDs before the reversal even occurs.",
        "misconception": "Treating reindexing as a way to preserve map identifiers."
      }
    ],
    "correctOptionId": "preserve-keys",
    "explanation": {
      "summary": "PHP arrays can use integer keys as identities, but array_reverse treats them as renumberable unless preserve_keys is true. The option is necessary when order and identity must be changed independently.",
      "trace": "The default result is the list [Lin,Ada]. Preserving keys produces the ordered map 40=>Lin,10=>Ada."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"Lin\",\"Ada\"]",
      "keyEvidence": "The preserve_keys variant retains 40 and 10 in reversed order.",
      "counterexamples": {
        "default-preserves-all": "The observed default keys are 0 and 1.",
        "sort-keys": "Ascending sort retains 10 then 40.",
        "reverse-values-only": "Reindexing removes the required IDs."
      },
      "contrasts": [
        {
          "name": "retain-map-identity",
          "marker": "array_reverse($records)",
          "replacement": "array_reverse($records, true)",
          "stdout": "{\"40\":\"Lin\",\"10\":\"Ada\"}"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-reverse.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0551",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "psr7-uri-replacement-host-preservation-policy",
    "objective": {
      "id": "psr7-uri-replacement-host-preservation-policy",
      "text": "Review whether changing a PSR-7 URI also updates an already populated Host header."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace the interaction of two related request representations under preserveHost."
    },
    "prerequisites": [
      "PSR-7 withUri",
      "URI authority",
      "Host header"
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
        "A conforming request has URI https://old.example/a and nonempty Host old.example. newUri is https://new.example/b. The returned request from withUri is assigned correctly. The upstream requires both the new URI host and Host header to be new.example."
      ],
      "files": []
    },
    "stem": "The refactor calls withUri($newUri, true). Which review is correct?",
    "options": [
      {
        "id": "true-syncs-host",
        "text": "true synchronizes the Host header with the new URI, satisfying the upstream.",
        "rationale": "true preserves an existing nonempty Host header rather than synchronizing it.",
        "misconception": "Reading preserveHost as preserve consistency instead of preserve the old header."
      },
      {
        "id": "uri-unchanged",
        "text": "true preserves the old URI as well as the Host header.",
        "rationale": "The method still replaces the URI; the flag controls Host handling.",
        "misconception": "Extending the flag’s scope to the whole request URI."
      },
      {
        "id": "use-default-false",
        "text": "Use false for preserveHost so the new URI host replaces the old Host header.",
        "rationale": "With a host in the new URI and preserveHost false, the returned request updates its Host header.",
        "misconception": null
      },
      {
        "id": "host-never-updated",
        "text": "withUri never changes headers, so changing the flag has no effect.",
        "rationale": "PSR-7 specifically defines Host synchronization as part of withUri.",
        "misconception": "Assuming URI replacement is isolated from the Host header contract."
      }
    ],
    "correctOptionId": "use-default-false",
    "explanation": {
      "summary": "withUri changes the URI in both cases. Its preserveHost flag decides whether an existing nonempty Host survives; false allows the new URI host to update it.",
      "trace": "true yields new.example in the URI but old.example in Host. false aligns both with new.example."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PSR-7 withUri updates Host from a nonempty URI host by default; preserveHost true retains an existing nonempty Host.",
      "optionAudit": {
        "true-syncs-host": "Reverses the flag meaning.",
        "uri-unchanged": "The URI is replaced.",
        "use-default-false": "Meets both host requirements.",
        "host-never-updated": "Contradicts the explicit Host contract."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php-fig.org/psr/psr-7/"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0552",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "psr7-message-copy-shares-mutable-body-stream",
    "objective": {
      "id": "psr7-message-copy-shares-mutable-body-stream",
      "text": "Review a PSR-7 message copy without assuming immutable headers imply independent body storage."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate message immutability from the explicitly mutable stream held by two messages."
    },
    "prerequisites": [
      "PSR-7 messages",
      "StreamInterface mutability",
      "Shared object identity"
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
        "A response body is a writable seekable StreamInterface. withHeader creates a response with the changed header and retains the same body instance. Both responses remain in use. A helper rewinds and writes replacement bytes through the new response’s body. The original body bytes must remain unchanged."
      ],
      "files": []
    },
    "stem": "Which review identifies the violated boundary and an appropriate repair?",
    "options": [
      {
        "id": "clone-protects-body",
        "text": "No repair is needed: withHeader guarantees a deep copy of every referenced object.",
        "rationale": "PSR-7 message immutability does not require cloning the mutable body stream.",
        "misconception": "Assuming immutable message operations imply deep ownership isolation."
      },
      {
        "id": "separate-stream",
        "text": "Attach an independent stream containing the desired bytes before modifying the new response body.",
        "rationale": "Separate storage prevents writes through one response from changing the other’s shared body.",
        "misconception": null
      },
      {
        "id": "rewind-original",
        "text": "Rewind the original response body after the write to restore its previous bytes.",
        "rationale": "Rewinding changes cursor position, not overwritten data.",
        "misconception": "Confusing stream position restoration with content restoration."
      },
      {
        "id": "new-header-name",
        "text": "Use withAddedHeader instead; its additive semantics isolate the body stream.",
        "rationale": "Header addition does not establish separate body storage either.",
        "misconception": "Inferring stream ownership from how header values are combined."
      }
    ],
    "correctOptionId": "separate-stream",
    "explanation": {
      "summary": "Message headers can be immutable while the StreamInterface they reference remains mutable. Under the stated shared-instance behavior, preserving the original requires independently owned body storage.",
      "trace": "Both bodies initially point to one stream. A write changes that stream for both; attaching independent bytes before the write removes the shared storage path."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PSR-7 explicitly excludes streams from message immutability and recommends a new stream when independent state is needed.",
      "optionAudit": {
        "clone-protects-body": "No deep-copy guarantee exists.",
        "separate-stream": "Separates mutable storage.",
        "rewind-original": "Restores position only.",
        "new-header-name": "Changes header semantics only."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php-fig.org/psr/psr-7/"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0553",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "HTTP & superglobals",
    "subtopic": "method-not-allowed-response-requires-allow-header",
    "objective": {
      "id": "method-not-allowed-response-requires-allow-header",
      "text": "Review an HTTP method rejection against the resource’s known supported methods."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish method availability from authentication failure and server-wide method recognition."
    },
    "prerequisites": [
      "HTTP 405",
      "Allow header",
      "401 versus 501"
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
        "A PHP endpoint exists and supports only GET and HEAD. Authentication and authorization have succeeded. The server understands POST, but POST is unsupported for this resource. The proposed response is 405 with no headers."
      ],
      "files": []
    },
    "stem": "Which review completes the response’s required protocol behavior?",
    "options": [
      {
        "id": "add-allow",
        "text": "Keep 405 and include Allow: GET, HEAD.",
        "rationale": "405 describes an unsupported method on this resource and requires the currently supported methods in Allow.",
        "misconception": null
      },
      {
        "id": "use-401",
        "text": "Use 401 and WWW-Authenticate because POST is not permitted.",
        "rationale": "The premise says authentication succeeded; method availability is not an authentication challenge.",
        "misconception": "Confusing a disallowed method with absent credentials."
      },
      {
        "id": "use-501",
        "text": "Use 501 because any unsupported resource method is unimplemented by the server.",
        "rationale": "The server understands POST; the restriction is specific to this resource.",
        "misconception": "Confusing resource support with server recognition of a method."
      },
      {
        "id": "use-cors-header",
        "text": "Keep 405 and replace Allow with Access-Control-Allow-Methods.",
        "rationale": "A CORS response field does not substitute for the HTTP Allow field required by 405.",
        "misconception": "Treating CORS policy metadata as the resource method contract."
      }
    ],
    "correctOptionId": "add-allow",
    "explanation": {
      "summary": "405 identifies a recognized method unavailable for this target resource. Allow communicates the permitted methods; authentication challenges and CORS policy fields serve different purposes.",
      "trace": "The router recognizes the resource, rejects POST and returns 405 with GET and HEAD in Allow."
    },
    "validation": {
      "kind": "document-review",
      "rule": "RFC 9110 section 15.5.6 requires an Allow field in a 405 response.",
      "optionAudit": {
        "add-allow": "Supplies the required resource method set.",
        "use-401": "Contradicts successful authentication.",
        "use-501": "Contradicts known server method support.",
        "use-cors-header": "Wrong protocol field."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc9110.html#name-405-method-not-allowed"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0554",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Cookies & sessions",
    "subtopic": "samesite-lax-navigation-does-not-protect-mutating-get",
    "objective": {
      "id": "samesite-lax-navigation-does-not-protect-mutating-get",
      "text": "Review a SameSite=Lax defense when an endpoint changes state on a top-level GET navigation."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Apply cookie delivery context rather than assuming every cross-site request loses its session cookie."
    },
    "prerequisites": [
      "SameSite=Lax",
      "Top-level navigation",
      "Safe methods",
      "CSRF"
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
        "A supported browser uses an explicitly SameSite=Lax, Secure session cookie over HTTPS. A cross-site page can cause a top-level GET navigation to /account/delete. The PHP endpoint deletes immediately when that session cookie authenticates the user, without another request-intent check. Assume the navigation meets the browser’s ordinary Lax safe top-level navigation conditions."
      ],
      "files": []
    },
    "stem": "Which review accurately describes the remaining problem?",
    "options": [
      {
        "id": "lax-blocks-every-cross-site",
        "text": "Lax blocks the cookie on all cross-site navigations, so this endpoint is protected.",
        "rationale": "Lax permits cookies on the stated safe top-level navigation.",
        "misconception": "Equating Lax with unconditional cross-site cookie exclusion."
      },
      {
        "id": "secure-authenticates-intent",
        "text": "Secure proves the navigation was initiated by the account owner.",
        "rationale": "Secure restricts transport; it does not establish who initiated the navigation.",
        "misconception": "Treating encrypted transport as request-intent authentication."
      },
      {
        "id": "httponly-repair",
        "text": "Adding HttpOnly prevents the browser from attaching the cookie to this navigation.",
        "rationale": "HttpOnly prevents script cookie reads, not automatic inclusion in qualifying requests.",
        "misconception": "Confusing script visibility with cookie transport."
      },
      {
        "id": "state-change-exposed",
        "text": "The cookie can accompany this GET; use a non-safe action flow with a validated request-intent defense.",
        "rationale": "The stated Lax exception lets authentication reach the mutating endpoint, so cookie attributes alone do not authorize the user’s intent.",
        "misconception": null
      }
    ],
    "correctOptionId": "state-change-exposed",
    "explanation": {
      "summary": "SameSite evaluates site and navigation context, not whether an application mistakenly mutates state during GET. Lax can send the session cookie on this navigation, allowing the unintended action.",
      "trace": "Cross-site navigation reaches the endpoint with the Lax session cookie. The current authenticated GET deletes; a safe GET must not perform that mutation."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Explicit SameSite=Lax permits safe top-level navigations; HTTP GET is intended to be safe.",
      "optionAudit": {
        "lax-blocks-every-cross-site": "Ignores the specified Lax exception.",
        "secure-authenticates-intent": "Transport is not intent.",
        "httponly-repair": "Does not prevent cookie delivery.",
        "state-change-exposed": "Applies the stated delivery condition to the mutating route."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-13"
    },
    "references": [
      "https://httpwg.org/http-extensions/draft-ietf-httpbis-rfc6265bis.html",
      "https://www.rfc-editor.org/rfc/rfc9110.html#name-safe-methods"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0555",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Validation & web security",
    "subtopic": "cors-origin-allowlist-is-not-api-client-authentication",
    "objective": {
      "id": "cors-origin-allowlist-is-not-api-client-authentication",
      "text": "Review a PHP API that treats an allowed Origin header as proof of caller identity."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate browser response-sharing enforcement from server authentication against arbitrary HTTP clients."
    },
    "prerequisites": [
      "CORS",
      "Origin header provenance",
      "Browser versus nonbrowser clients",
      "API authentication"
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
        "The PHP API returns private records whenever Origin equals https://portal.example. It performs no credential verification. Browsers enforce CORS, but a nonbrowser client can send any Origin value. Private records must be available only to authenticated authorized users."
      ],
      "files": []
    },
    "stem": "Which review addresses the actual trust-boundary failure?",
    "options": [
      {
        "id": "exact-origin-enough",
        "text": "Exact Origin equality authenticates the client because browsers control that header.",
        "rationale": "A nonbrowser client is not bound by browser header restrictions and can send that value.",
        "misconception": "Applying browser restrictions to every HTTP client."
      },
      {
        "id": "credentials-header-enough",
        "text": "Add Access-Control-Allow-Credentials: true to authenticate callers.",
        "rationale": "That response field controls browser exposure of credentialed responses; it does not verify credentials.",
        "misconception": "Treating a CORS response declaration as authentication."
      },
      {
        "id": "verify-user-credentials",
        "text": "Verify user credentials and authorization independently of the CORS sharing policy.",
        "rationale": "Server-side identity and permission checks remain necessary even when response sharing is restricted.",
        "misconception": null
      },
      {
        "id": "reject-no-origin-only",
        "text": "Reject requests without Origin while accepting every request with the allowed value.",
        "rationale": "An arbitrary client can supply the allowed value, so presence does not establish identity.",
        "misconception": "Using header presence as evidence of a trusted browser origin."
      }
    ],
    "correctOptionId": "verify-user-credentials",
    "explanation": {
      "summary": "CORS governs when browsers expose responses to scripts. It is not a proof that a request came from a particular application or authenticated user, especially for clients outside the browser security model.",
      "trace": "A nonbrowser client sends the allowed Origin without credentials and currently receives private records. Independent authentication and authorization reject that request."
    },
    "validation": {
      "kind": "document-review",
      "rule": "The Fetch CORS protocol controls cross-origin response sharing; it does not authenticate arbitrary HTTP clients.",
      "optionAudit": {
        "exact-origin-enough": "Spoofable under the premise.",
        "credentials-header-enough": "Does not verify credentials.",
        "verify-user-credentials": "Enforces the missing identity and permission checks.",
        "reject-no-origin-only": "Still accepts a forged allowed Origin."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://fetch.spec.whatwg.org/#http-cors-protocol"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0556",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Cookies & sessions",
    "subtopic": "setcookie-success-does-not-confirm-browser-storage",
    "objective": {
      "id": "setcookie-success-does-not-confirm-browser-storage",
      "text": "Review a server-side cookie success check without mistaking queued response headers for browser acknowledgement."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate response construction, current request state and a later browser decision."
    },
    "prerequisites": [
      "setcookie return value",
      "Request and response separation",
      "Browser cookie acceptance"
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
        "A PHP HTTP response calls setcookie before output and receives true. The current request had no preference cookie. The browser may reject cookies. The application currently reports that true proves the browser saved the preference."
      ],
      "files": []
    },
    "stem": "Which review correctly describes what this result establishes?",
    "options": [
      {
        "id": "confirmed-storage",
        "text": "true confirms that the browser stored the cookie and will return it next time.",
        "rationale": "The server cannot learn the browser’s later acceptance decision from this synchronous return value.",
        "misconception": "Treating header creation as remote acknowledgement."
      },
      {
        "id": "header-queued",
        "text": "true means PHP accepted the cookie header operation; later requests may provide evidence of browser storage.",
        "rationale": "The return value concerns response construction, while browser acceptance happens after delivery.",
        "misconception": null
      },
      {
        "id": "request-updated",
        "text": "true also inserts the new cookie into the current request’s COOKIE array.",
        "rationale": "The current request cookie data is not rewritten by setting a response cookie.",
        "misconception": "Conflating an outgoing cookie directive with incoming request data."
      },
      {
        "id": "cookie-script-readable",
        "text": "true confirms the cookie is readable by JavaScript regardless of its attributes.",
        "rationale": "Script access depends on attributes such as HttpOnly and browser policy, not this return value.",
        "misconception": "Inferring client visibility from server-side header success."
      }
    ],
    "correctOptionId": "header-queued",
    "explanation": {
      "summary": "setcookie prepares a response directive. Success does not acknowledge storage or script access, and it does not retroactively alter the cookies received in the current request.",
      "trace": "PHP accepts the header operation and returns true. The browser later applies its policy; only a subsequent request can carry the stored cookie back."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP setcookie reports header operation success, not client cookie acceptance; cookies become available on later requests.",
      "optionAudit": {
        "confirmed-storage": "No client acknowledgement exists.",
        "header-queued": "Matches the operation’s boundary.",
        "request-updated": "Incoming data stays unchanged.",
        "cookie-script-readable": "Attributes and browser rules govern access."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-13"
    },
    "references": [
      "https://www.php.net/manual/en/function.setcookie.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0557",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Cookies & sessions",
    "subtopic": "session-array-writes-after-close-not-persisted",
    "objective": {
      "id": "session-array-writes-after-close-not-persisted",
      "text": "Review mutations of the in-memory session array after session_write_close has ended the persistence lifecycle."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish retained PHP variables from an active session write operation."
    },
    "prerequisites": [
      "Session files handler",
      "session_write_close",
      "Session persistence versus local state"
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
        "All session operations succeed using the isolated files handler. Cookies and cache-limiter headers are disabled for this CLI fixture. Reopening reloads the saved session record."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$options = [\n    'save_handler' => 'files',\n    'save_path' => __DIR__,\n    'use_cookies' => 0,\n    'cache_limiter' => '',\n];\nsession_id('review557');\nsession_start($options);\n$_SESSION['stage'] = 'saved';\nsession_write_close();\n\n$_SESSION['stage'] = 'local-only';\nsession_start($options);\n$result = $_SESSION['stage'];\nsession_destroy();\necho $result;\n"
        }
      ]
    },
    "stem": "A refactor moves the final assignment after session_write_close. Which review is correct?",
    "options": [
      {
        "id": "array-still-writes",
        "text": "The assignment persists because SESSION remains available as an array.",
        "rationale": "The variable remains accessible, but the session write lifecycle has ended.",
        "misconception": "Equating an existing array with an active persistence channel."
      },
      {
        "id": "close-clears-array",
        "text": "The assignment fails because closing the session destroys the SESSION variable.",
        "rationale": "Closing writes and releases the session; it does not make the array assignment invalid.",
        "misconception": "Confusing closing persistence with deleting local variables."
      },
      {
        "id": "reopen-saves-local",
        "text": "Reopening first saves all local changes made while the session was closed.",
        "rationale": "Reopening reads persisted data; it is not a flush of the inactive local array.",
        "misconception": "Treating start as an implicit commit of unsaved local changes."
      },
      {
        "id": "move-before-close",
        "text": "Make persistent changes before closing, or reopen before changing them; this assignment is only local.",
        "rationale": "The saved record remains saved, which is loaded when the session starts again.",
        "misconception": null
      }
    ],
    "correctOptionId": "move-before-close",
    "explanation": {
      "summary": "session_write_close saves the active session and releases it. Subsequent array changes are ordinary local mutations until an active session lifecycle is established; reopening reloads the stored state.",
      "trace": "saved is written at close. local-only changes memory after close. Reopening loads saved, which is printed."
    },
    "validation": {
      "kind": "contract",
      "stdout": "saved",
      "keyEvidence": "The reopened state is the value written before close.",
      "counterexamples": {
        "array-still-writes": "The later local value is absent after reopen.",
        "close-clears-array": "The assignment executes without error.",
        "reopen-saves-local": "Reopen restores saved rather than local-only."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-13"
    },
    "references": [
      "https://www.php.net/manual/en/function.session-write-close.php",
      "https://www.php.net/manual/en/function.session-start.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0558",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Functions & arguments",
    "subtopic": "timezone-offset-must-be-evaluated-for-target-instant",
    "objective": {
      "id": "timezone-offset-must-be-evaluated-for-target-instant",
      "text": "Review replacing a named timezone with a fixed offset sampled at a different instant."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Apply seasonal offset rules to the target instant rather than caching a timezone as one permanent offset."
    },
    "prerequisites": [
      "Named timezones",
      "UTC offsets",
      "Daylight-saving transitions",
      "DateTimeZone::getOffset"
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
        "Use the installed Europe/Zurich timezone rules for 2024. The application renders a July instant but cached the zone offset from the displayed January instant. It must show the local time at the July instant."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$zone = new DateTimeZone('Europe/Zurich');\n$winter = new DateTimeImmutable('2024-01-15T12:00:00Z');\n$summer = new DateTimeImmutable('2024-07-15T12:00:00Z');\n$cachedOffset = $zone->getOffset($winter);\n\n$shifted = $summer->modify('+' . $cachedOffset . ' seconds');\necho json_encode([\n    $shifted->format('H:i'),\n    $summer->setTimezone($zone)->format('H:i'),\n]);\n"
        }
      ]
    },
    "stem": "Which review of this cached-offset calculation is correct?",
    "options": [
      {
        "id": "fixed-offset-equivalent",
        "text": "The cached offset is equivalent to Europe/Zurich for every date.",
        "rationale": "The zone uses different offsets in January and July under these rules.",
        "misconception": "Treating a named timezone as one permanent UTC displacement."
      },
      {
        "id": "target-zone-conversion",
        "text": "Convert the July instant with the named zone; January’s offset gives 13:00 instead of 14:00.",
        "rationale": "The named zone chooses the offset applicable to July, preserving the original instant.",
        "misconception": null
      },
      {
        "id": "add-offset-twice",
        "text": "Apply the January offset twice for every future date to account for daylight saving.",
        "rationale": "That happens to yield July’s wall time here but is not the zone’s date-dependent rule and changes the instant.",
        "misconception": "Replacing timezone rules with a fixed arithmetic adjustment."
      },
      {
        "id": "change-source-zone",
        "text": "Parse the Z timestamp as Zurich local time so no conversion is needed.",
        "rationale": "The Z explicitly identifies UTC; reinterpreting those clock fields would describe a different instant.",
        "misconception": "Confusing conversion of an instant with reinterpretation of its input clock fields."
      }
    ],
    "correctOptionId": "target-zone-conversion",
    "explanation": {
      "summary": "A named timezone selects an offset for each instant. Sampling it in winter and applying that offset arithmetically in summer loses the zone’s rules and also changes the instant rather than its representation.",
      "trace": "January offset is 3600 seconds, giving 13:00 through arithmetic. The July Zurich offset is 7200 seconds, so proper representation is 14:00."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"13:00\",\"14:00\"]",
      "keyEvidence": "The two calculations disagree for the stated dates.",
      "counterexamples": {
        "fixed-offset-equivalent": "July uses a different offset.",
        "add-offset-twice": "A fixed doubling cannot model winter and summer.",
        "change-source-zone": "Z identifies UTC and cannot be reinterpreted without changing the instant."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/datetimezone.getoffset.php",
      "https://www.php.net/manual/en/datetimeimmutable.settimezone.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0559",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Files & structured data",
    "subtopic": "posix-unlink-name-does-not-revoke-open-handle",
    "objective": {
      "id": "posix-unlink-name-does-not-revoke-open-handle",
      "text": "Review a deletion operation without assuming removing a pathname revokes an already open POSIX file handle."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish directory-entry lifetime from access through an existing descriptor."
    },
    "prerequisites": [
      "POSIX unlink",
      "Open file handles",
      "Pathnames versus file objects"
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
        "The fixture runs on a POSIX filesystem, all operations succeed, and no other process accesses the file. The handle is opened before unlink. This is not a claim about Windows file-sharing rules."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$path = __DIR__ . '/temporary.txt';\nfile_put_contents($path, 'payload');\n$handle = fopen($path, 'rb');\nunlink($path);\n\n$content = stream_get_contents($handle);\nfclose($handle);\necho json_encode([file_exists($path), $content]);\n"
        }
      ]
    },
    "stem": "A reviewer says unlink makes the already opened handle unreadable. Which assessment is correct?",
    "options": [
      {
        "id": "handle-survives",
        "text": "The name is gone, but the existing handle can still read payload until it is closed.",
        "rationale": "POSIX unlink removes the name; the open descriptor retains access to the file object.",
        "misconception": null
      },
      {
        "id": "handle-revoked",
        "text": "unlink closes all open handles to the file and the read must fail.",
        "rationale": "Removing the directory entry does not close already open descriptors.",
        "misconception": "Treating pathname deletion as handle revocation."
      },
      {
        "id": "name-retained",
        "text": "The pathname must remain visible until the last handle closes.",
        "rationale": "The pathname can disappear immediately even while an open descriptor retains the file.",
        "misconception": "Confusing storage lifetime with directory-entry visibility."
      },
      {
        "id": "content-cleared",
        "text": "The handle stays open but unlink truncates its contents to an empty string.",
        "rationale": "unlink removes a name and does not truncate the file object.",
        "misconception": "Confusing deletion of a name with truncation of data."
      }
    ],
    "correctOptionId": "handle-survives",
    "explanation": {
      "summary": "On POSIX systems a pathname and an open descriptor are different references. Removing the name prevents new opens through it, while an existing descriptor can retain the data until closed.",
      "trace": "file_exists is false after unlink, but the earlier handle reads payload successfully."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[false,\"payload\"]",
      "keyEvidence": "The owned POSIX fixture observes both name absence and readable old data.",
      "counterexamples": {
        "handle-revoked": "The read succeeds.",
        "name-retained": "file_exists is false.",
        "content-cleared": "The original bytes remain."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://pubs.opengroup.org/onlinepubs/9799919799/functions/unlink.html",
      "https://www.php.net/manual/en/function.unlink.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0560",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Files & structured data",
    "subtopic": "short-stream-read-does-not-prove-end-of-frame",
    "objective": {
      "id": "short-stream-read-does-not-prove-end-of-frame",
      "text": "Review a fixed-width frame reader that treats one short read as a truncated message."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a read-size maximum from a complete-frame guarantee and preserve partial progress."
    },
    "prerequisites": [
      "Short reads",
      "Fixed-width framing",
      "Remaining-byte accounting",
      "EOF distinction"
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
        "The supplied read callback returns at most the requested bytes, may return fewer before EOF, returns an empty string only at EOF and throws on failure. The displayed queue models three allowed short reads from one five-byte frame. No external stream is opened."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction readFrame(callable $read, int $width): string\n{\n    $data = $read($width);\n\n    if (strlen($data) !== $width) {\n        throw new RuntimeException('short');\n    }\n\n    return $data;\n}\n\n$chunks = ['AB', 'C', 'DE'];\n$read = static function (int $maximum) use (&$chunks): string {\n    return array_shift($chunks) ?? '';\n};\n\ntry {\n    echo readFrame($read, 5);\n} catch (RuntimeException $error) {\n    echo $error->getMessage();\n}\n"
        }
      ]
    },
    "stem": "Which review makes frame reading conform to this callback contract?",
    "options": [
      {
        "id": "short-proves-eof",
        "text": "Keep the rejection: fewer than width bytes in one read proves the frame has ended.",
        "rationale": "The callback explicitly permits short reads before EOF.",
        "misconception": "Treating an upper read bound as a full-frame delivery guarantee."
      },
      {
        "id": "restart-read",
        "text": "Discard partial bytes and retry reading the full width from the current stream position.",
        "rationale": "Discarding AB loses bytes already consumed from this frame.",
        "misconception": "Assuming a retry replays previously consumed stream data."
      },
      {
        "id": "accumulate-remainder",
        "text": "Accumulate bytes until width is reached, requesting only the remainder and rejecting EOF before completion.",
        "rationale": "This preserves partial progress while distinguishing temporary short delivery from actual truncation.",
        "misconception": null
      },
      {
        "id": "pad-to-width",
        "text": "Pad the first short result to width with zero bytes and return it.",
        "rationale": "Padding invents payload bytes instead of reading the remaining CDE.",
        "misconception": "Treating framing length as permission to synthesize missing data."
      }
    ],
    "correctOptionId": "accumulate-remainder",
    "explanation": {
      "summary": "A short read can be a partial delivery rather than EOF. The reader must keep received bytes and continue for the remaining width; an empty read before completion is the stated truncation signal.",
      "trace": "The displayed reader rejects after AB. The accumulation loop reads AB, C and DE and returns ABCDE."
    },
    "validation": {
      "kind": "contract",
      "stdout": "short",
      "keyEvidence": "The corrected accumulation loop preserves all three deliveries.",
      "counterexamples": {
        "short-proves-eof": "Two later nonempty chunks remain.",
        "restart-read": "Consumed AB would be discarded.",
        "pad-to-width": "Would manufacture zeros instead of CDE."
      },
      "contrasts": [
        {
          "name": "accumulate-frame",
          "marker": "$data = $read($width);\n\n    if (strlen($data) !== $width) {\n        throw new RuntimeException('short');\n    }",
          "replacement": "$data = '';\n\n    while (strlen($data) < $width) {\n        $chunk = $read($width - strlen($data));\n\n        if ($chunk === '') {\n            throw new RuntimeException('short');\n        }\n\n        $data .= $chunk;\n    }",
          "stdout": "ABCDE"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.fread.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0561",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "never-return-subtype-versus-void-override",
    "objective": {
      "id": "never-return-subtype-versus-void-override",
      "text": "Review a never-returning implementation of a value-returning interface without confusing never with void."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine return covariance, bottom-type semantics and exception flow across an interface boundary."
    },
    "prerequisites": [
      "never bottom type (advanced)",
      "Covariant returns",
      "Interface contracts",
      "Exception propagation"
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
          "source": "<?php\n\ninterface Reader\n{\n    public function read(): string;\n}\n\nclass DeniedReader implements Reader\n{\n    public function read(): never\n    {\n        throw new RuntimeException('denied');\n    }\n}\n\ntry {\n    (new DeniedReader())->read();\n} catch (RuntimeException $error) {\n    echo $error->getMessage();\n}\n"
        }
      ]
    },
    "stem": "A reviewer wants to change DeniedReader::read from never to void because it returns no value. Which assessment is correct?",
    "options": [
      {
        "id": "both-invalid",
        "text": "Both never and void violate the interface because every call must return a string.",
        "rationale": "The type contract governs normal returns; a method may throw instead, and never is a valid covariant return.",
        "misconception": "Assuming a return type prohibits exceptional termination."
      },
      {
        "id": "void-equivalent",
        "text": "void is equivalent to never here and is a compatible replacement.",
        "rationale": "void permits normal return without a value and is not a subtype of string.",
        "misconception": "Equating no normal return with normal return carrying no value."
      },
      {
        "id": "keep-never",
        "text": "Keep never: it is a subtype of string, whereas void is not a compatible override.",
        "rationale": "never promises no normal return and can narrow a value-returning contract.",
        "misconception": null
      },
      {
        "id": "use-nullable",
        "text": "Use ?string because throwing is represented as an implicit null return.",
        "rationale": "Throwing does not return null, and widening the return to nullable is incompatible with string.",
        "misconception": "Representing exceptions as nullable successful results."
      }
    ],
    "correctOptionId": "keep-never",
    "explanation": {
      "summary": "never is the bottom return type: a method that cannot return normally cannot return a value that violates string. void instead permits normal completion with no value and is not a valid replacement for this interface return.",
      "trace": "The declaration is valid and read throws denied, which the caller catches. No string return occurs."
    },
    "validation": {
      "kind": "contract",
      "stdout": "denied",
      "keyEvidence": "The never implementation loads and reaches the expected exception boundary.",
      "counterexamples": {
        "both-invalid": "The class loads successfully.",
        "void-equivalent": "void is not covariant with string.",
        "use-nullable": "Nullable widens the successful return set."
      },
      "contrasts": [
        {
          "name": "void-not-subtype",
          "marker": "public function read(): never",
          "replacement": "public function read(): void",
          "stdout": "",
          "error": "must be compatible with Reader::read(): string"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.never.php",
      "https://www.php.net/manual/en/language.types.declarations.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0562",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "trait-constant-composition-not-method-precedence",
    "objective": {
      "id": "trait-constant-composition-not-method-precedence",
      "text": "Review a conflicting trait constant without applying the class-over-trait rule for methods to constants."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Distinguish trait member composition compatibility from inherited constant overriding and method precedence."
    },
    "prerequisites": [
      "Trait constants (advanced)",
      "Composition-time compatibility",
      "Class constants",
      "Trait method precedence"
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
        "The proposal changes the class constant value from 3 to 5 while retaining the trait declaration. No inheritance is involved."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\ntrait RetryDefaults\n{\n    public const LIMIT = 3;\n}\n\nclass Retrier\n{\n    use RetryDefaults;\n\n    public const LIMIT = 3;\n}\n\necho Retrier::LIMIT;\n"
        }
      ]
    },
    "stem": "Does changing Retrier::LIMIT to 5 override the trait’s value in this composition?",
    "options": [
      {
        "id": "class-wins",
        "text": "Yes; the class declaration wins by the same precedence rule as a class method.",
        "rationale": "Trait constants with the same name must be compatible; different values cause a composition error.",
        "misconception": "Generalizing method precedence to constants."
      },
      {
        "id": "incompatible-value",
        "text": "No; the changed value conflicts with the trait constant and prevents composition.",
        "rationale": "The matching current value is compatible, but 5 is not compatible with the trait’s 3.",
        "misconception": null
      },
      {
        "id": "trait-wins",
        "text": "No; PHP silently keeps the trait value and ignores the class value.",
        "rationale": "PHP rejects the incompatible definitions rather than silently selecting one.",
        "misconception": "Assuming conflict resolution silently favors the trait."
      },
      {
        "id": "instance-only-change",
        "text": "Yes, but only object accesses see 5; Retrier::LIMIT remains 3.",
        "rationale": "There are not separate instance and class copies of this constant.",
        "misconception": "Treating one class constant as two access-dependent values."
      }
    ],
    "correctOptionId": "incompatible-value",
    "explanation": {
      "summary": "Trait constant composition requires compatible definitions, including equal values. It does not use the method-precedence rule to choose between conflicting values.",
      "trace": "The shown compatible composition prints 3. Changing only the class value to 5 causes a declaration-time composition failure."
    },
    "validation": {
      "kind": "contract",
      "stdout": "3",
      "keyEvidence": "The changed class value is rejected while equal definitions compose.",
      "counterexamples": {
        "class-wins": "The changed declaration fails.",
        "trait-wins": "No value is silently selected.",
        "instance-only-change": "The class fails to compose."
      },
      "contrasts": [
        {
          "name": "conflicting-constant",
          "marker": "use RetryDefaults;\n\n    public const LIMIT = 3;",
          "replacement": "use RetryDefaults;\n\n    public const LIMIT = 5;",
          "stdout": "",
          "error": "define the same constant (LIMIT)"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
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
    "id": "PHP-E26-0563",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Types, casting & comparisons",
    "subtopic": "weak-union-exact-string-member-prevents-numeric-coercion",
    "objective": {
      "id": "weak-union-exact-string-member-prevents-numeric-coercion",
      "text": "Review a union-type widening that changes the runtime representation of numeric-string arguments."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine exact-type admission with weak scalar union coercion and downstream type-sensitive behavior."
    },
    "prerequisites": [
      "Weak scalar union coercion (advanced)",
      "Exact union member matching",
      "Numeric strings",
      "Type-sensitive serialization"
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
        "The caller file has strict_types=0 as shown. Inputs are the displayed valid numeric strings. A downstream serializer distinguishes numeric values from text."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\ndeclare(strict_types=0);\n\nfunction normalize(int|float $value): array\n{\n    return [get_debug_type($value), $value];\n}\n\necho json_encode([normalize('12'), normalize('12.5')]);\n"
        }
      ]
    },
    "stem": "A refactor adds string to normalize’s int|float parameter. Which review correctly describes the effect on these inputs?",
    "options": [
      {
        "id": "only-admission-widens",
        "text": "Only previously rejected strings change; accepted numeric strings still normalize identically.",
        "rationale": "Adding an exact string member prevents coercion of these already accepted string inputs.",
        "misconception": "Assuming widening a type can change admission only, never representation."
      },
      {
        "id": "first-union-member",
        "text": "Both inputs become int because int is written first in the declaration.",
        "rationale": "Union coercion is not a left-to-right choice; numeric string semantics distinguish integer and decimal forms here.",
        "misconception": "Treating union declaration order as conversion priority."
      },
      {
        "id": "strictness-enables",
        "text": "Adding string makes strict_types apply to this function even though the file uses zero.",
        "rationale": "A union member does not change the file’s strictness setting.",
        "misconception": "Confusing a union’s accepted types with the coercion mode switch."
      },
      {
        "id": "exact-strings-retained",
        "text": "Both inputs remain strings after widening; the current declaration converts them to int and float.",
        "rationale": "An exact admitted string type is retained before numeric coercion is considered.",
        "misconception": null
      }
    ],
    "correctOptionId": "exact-strings-retained",
    "explanation": {
      "summary": "Weak coercion is needed only when the original type is not an accepted union member. int|float converts these numeric strings; int|float|string admits their existing string type and changes their downstream representation.",
      "trace": "Current output contains [int,12] and [float,12.5]. With string added, it contains [string,\"12\"] and [string,\"12.5\"]."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[[\"int\",12],[\"float\",12.5]]",
      "keyEvidence": "The controlled widened declaration retains both strings.",
      "counterexamples": {
        "only-admission-widens": "Already accepted inputs change representation.",
        "first-union-member": "The decimal input becomes float.",
        "strictness-enables": "The same weak-mode file executes both versions."
      },
      "contrasts": [
        {
          "name": "widened-union",
          "marker": "normalize(int|float $value)",
          "replacement": "normalize(int|float|string $value)",
          "stdout": "[[\"string\",\"12\"],[\"string\",\"12.5\"]]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.type-juggling.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0564",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Enums, attributes & reflection",
    "subtopic": "reflection-parent-private-slots-need-declaring-class-identity",
    "objective": {
      "id": "reflection-parent-private-slots-need-declaring-class-identity",
      "text": "Review a reflection-based storage inventory that misses parent-private slots and conflates same-named private properties."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine inheritance visibility with declaration identity when enumerating physical object state."
    },
    "prerequisites": [
      "ReflectionClass property enumeration (advanced)",
      "Private property slots",
      "Declaring class identity",
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
          "source": "<?php\n\nclass BaseRecord\n{\n    private int $id = 1;\n}\n\nclass ChildRecord extends BaseRecord\n{\n    private int $id = 2;\n}\n\n$reflection = new ReflectionClass(ChildRecord::class);\n$slots = [];\n\nforeach ($reflection->getProperties() as $property) {\n    $slots[] = $property->getDeclaringClass()->getName()\n        . '::' . $property->getName();\n}\n\necho json_encode($slots);\n"
        }
      ]
    },
    "stem": "An internal diagnostic must list both private id slots. Which review of this child-only reflection scan is correct?",
    "options": [
      {
        "id": "walk-declarations",
        "text": "Walk the class hierarchy and identify declared slots by declaring class plus property name.",
        "rationale": "Parent-private storage must be inspected through its declaring class, and the same short name can identify different slots.",
        "misconception": null
      },
      {
        "id": "name-only-map",
        "text": "Keep this scan and key by id; child storage replaces the parent-private slot.",
        "rationale": "Private declarations remain distinct slots, and the child scan does not expose the parent-private declaration.",
        "misconception": "Applying public overriding semantics to private storage identity."
      },
      {
        "id": "private-filter",
        "text": "Add ReflectionProperty::IS_PRIVATE to this child scan to include all ancestor-private properties.",
        "rationale": "A visibility filter narrows the returned set; it does not add excluded parent-private declarations.",
        "misconception": "Treating a filter as recursive hierarchy traversal."
      },
      {
        "id": "public-conversion",
        "text": "Call setAccessible(true) on the returned property to make it represent both private slots.",
        "rationale": "Accessibility does not merge declarations or enumerate the missing parent property.",
        "misconception": "Confusing access permissions with property identity."
      }
    ],
    "correctOptionId": "walk-declarations",
    "explanation": {
      "summary": "Private properties belong to their declaring class and may coexist under the same short name in parent and child. A complete internal inventory must traverse declarations and preserve that class-qualified identity.",
      "trace": "The displayed child scan lists only ChildRecord::id. Inspecting BaseRecord separately reveals BaseRecord::id as a different slot."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"ChildRecord::id\"]",
      "keyEvidence": "A separate parent scan exposes the missing distinct declaration.",
      "counterexamples": {
        "name-only-map": "The parent-private slot still exists separately.",
        "private-filter": "Filtering cannot add the omitted declaration.",
        "public-conversion": "Accessibility does not change declaration identity."
      },
      "contrasts": [
        {
          "name": "parent-declaration",
          "marker": "new ReflectionClass(ChildRecord::class)",
          "replacement": "new ReflectionClass(BaseRecord::class)",
          "stdout": "[\"BaseRecord::id\"]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/reflectionclass.getproperties.php",
      "https://www.php.net/manual/en/reflectionproperty.getdeclaringclass.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0565",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Errors & exceptions",
    "subtopic": "fiber-error-handler-stack-is-shared-not-task-local",
    "objective": {
      "id": "fiber-error-handler-stack-is-shared-not-task-local",
      "text": "Review per-Fiber error-handler installation when execution can suspend before the protected operation."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Trace interleaved tasks through process-shared handler state and restoration order."
    },
    "prerequisites": [
      "Fibers (advanced)",
      "Global error-handler stack",
      "Cooperative suspension",
      "Task-local versus process state"
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
        "There are no other error handlers. The two final restore calls are test cleanup after all callbacks have finished; the question concerns the warning emitted when A resumes."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$seen = [];\n$a = new Fiber(static function () use (&$seen): void {\n    set_error_handler(static function () use (&$seen): bool {\n        $seen[] = 'A';\n\n        return true;\n    });\n    Fiber::suspend();\n    trigger_error('from A', E_USER_WARNING);\n});\n$b = new Fiber(static function () use (&$seen): void {\n    set_error_handler(static function () use (&$seen): bool {\n        $seen[] = 'B';\n\n        return true;\n    });\n});\n\n$a->start();\n$b->start();\n$a->resume();\nrestore_error_handler();\nrestore_error_handler();\necho json_encode($seen);\n"
        }
      ]
    },
    "stem": "A reviewer claims each Fiber automatically retains its own current error handler. Which assessment matches this schedule?",
    "options": [
      {
        "id": "fiber-restores-handler",
        "text": "A’s handler runs because resuming a Fiber restores its handler stack.",
        "rationale": "Fiber resumption does not automatically restore a task-local error-handler stack.",
        "misconception": "Assuming every runtime global is Fiber-local."
      },
      {
        "id": "both-handlers",
        "text": "Both handlers run because warning delivery broadcasts to all installed handlers.",
        "rationale": "Only the current handler receives this warning; installations form a stack, not a broadcast list.",
        "misconception": "Treating stacked handlers as simultaneous subscribers."
      },
      {
        "id": "shared-current-handler",
        "text": "B’s handler runs because its installation changed the shared current error handler.",
        "rationale": "B replaces the process’s current handler before A emits its warning.",
        "misconception": null
      },
      {
        "id": "default-after-b",
        "text": "PHP’s default handler runs because B’s handler disappears when B terminates.",
        "rationale": "The installed handler remains until explicitly restored or replaced.",
        "misconception": "Assuming callback termination undoes a global handler installation."
      }
    ],
    "correctOptionId": "shared-current-handler",
    "explanation": {
      "summary": "Error-handler installation changes shared execution state. Fiber suspension does not scope that state to a task, and ending B does not uninstall its handler.",
      "trace": "A installs A and suspends. B installs B and ends. A resumes while B is current, so the observed handler is B."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"B\"]",
      "keyEvidence": "The deterministic interleaving routes A’s warning to B.",
      "counterexamples": {
        "fiber-restores-handler": "No A observation appears.",
        "both-handlers": "Only B is recorded.",
        "default-after-b": "The custom B handler handles the warning."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/function.set-error-handler.php",
      "https://www.php.net/manual/en/language.fibers.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0566",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Types, casting & comparisons",
    "subtopic": "finite-float-admission-excludes-infinity-and-nan",
    "objective": {
      "id": "finite-float-admission-excludes-infinity-and-nan",
      "text": "Accept finite floating-point measurements while rejecting infinities and NaN."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose a numeric predicate matching the complete stated value domain."
    },
    "prerequisites": [
      "Float values",
      "Infinity",
      "NaN",
      "is_finite"
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
          "source": "<?php\n\nfunction accepted(float $value): bool\n{\n    return false;\n}\n\necho json_encode(array_map('accepted', [0.0, -2.5, INF, -INF, NAN]));\n"
        }
      ]
    },
    "stem": "Which predicate admits finite positive, negative and zero floats, while rejecting INF, -INF and NAN?",
    "options": [
      {
        "id": "numeric",
        "text": "is_numeric($value)",
        "rationale": "All inputs are already numeric float values, including the special nonfinite values.",
        "misconception": "Confusing numeric type membership with finiteness."
      },
      {
        "id": "finite",
        "text": "is_finite($value)",
        "rationale": "This accepts exactly finite values, including zero and negatives.",
        "misconception": null
      },
      {
        "id": "not-nan",
        "text": "!is_nan($value)",
        "rationale": "This rejects NaN but still accepts both infinities.",
        "misconception": "Assuming NaN is the only nonfinite float."
      },
      {
        "id": "positive",
        "text": "$value > 0",
        "rationale": "This rejects valid zero and negative measurements and accepts positive infinity.",
        "misconception": "Using a sign constraint as a finiteness test."
      }
    ],
    "correctOptionId": "finite",
    "explanation": {
      "summary": "Finiteness is a separate property from being numeric or non-NaN. is_finite excludes both infinity directions and NaN without excluding ordinary negative or zero values.",
      "trace": "The five inputs yield true,true,false,false,false."
    },
    "validation": {
      "kind": "patch",
      "marker": "false;",
      "candidates": {
        "numeric": "is_numeric($value);",
        "finite": "is_finite($value);",
        "not-nan": "!is_nan($value);",
        "positive": "$value > 0;"
      },
      "stdout": "[true,true,false,false,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/function.is-finite.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0567",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Operators & expressions",
    "subtopic": "floating-remainder-without-integer-modulo-conversion",
    "objective": {
      "id": "floating-remainder-without-integer-modulo-conversion",
      "text": "Compute a floating-point remainder without truncating operands through integer modulo."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Select the arithmetic operation whose operand domain preserves fractional input."
    },
    "prerequisites": [
      "Modulo operator",
      "fmod",
      "Floating-point operands"
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
        "Inputs are finite positive values with nonzero divisor. The example values are exactly representable in binary floating point."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$value = 5.5;\n$divisor = 2.0;\n$result = 0;\n\necho json_encode($result);\n"
        }
      ]
    },
    "stem": "Which expression calculates the remainder of 5.5 divided by 2.0 as 1.5?",
    "options": [
      {
        "id": "integer-remainder",
        "text": "(int) $value % (int) $divisor",
        "rationale": "This deliberately truncates 5.5 to 5 and yields integer remainder 1.",
        "misconception": "Using integer modulo for fractional operands."
      },
      {
        "id": "fractional-quotient",
        "text": "$value / $divisor",
        "rationale": "This produces quotient 2.75, not the remainder.",
        "misconception": "Confusing quotient and remainder."
      },
      {
        "id": "rounded-modulo",
        "text": "(int) round($value) % (int) $divisor",
        "rationale": "Rounding gives 6 before modulo, producing zero.",
        "misconception": "Rounding away fractional information before the operation."
      },
      {
        "id": "float-remainder",
        "text": "fmod($value, $divisor)",
        "rationale": "fmod computes the floating-point remainder, retaining the fractional 1.5.",
        "misconception": null
      }
    ],
    "correctOptionId": "float-remainder",
    "explanation": {
      "summary": "The % operator operates on integer-converted operands. fmod is the floating-point remainder operation and preserves the fractional part needed here.",
      "trace": "Two whole divisors consume 4.0 from 5.5, leaving 1.5."
    },
    "validation": {
      "kind": "patch",
      "marker": "$result = 0;",
      "candidates": {
        "integer-remainder": "$result = (int) $value % (int) $divisor;",
        "fractional-quotient": "$result = $value / $divisor;",
        "rounded-modulo": "$result = (int) round($value) % (int) $divisor;",
        "float-remainder": "$result = fmod($value, $divisor);"
      },
      "stdout": "1.5",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/function.fmod.php",
      "https://www.php.net/manual/en/language.operators.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0568",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Functions & arguments",
    "subtopic": "strspn-prefix-length-not-total-membership-count",
    "objective": {
      "id": "strspn-prefix-length-not-total-membership-count",
      "text": "Measure only the initial run of allowed ASCII characters before the first disallowed byte."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish a leading span from whole-string filtering and delimiter position."
    },
    "prerequisites": [
      "ASCII strings",
      "strspn",
      "Character masks"
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
          "source": "<?php\n\nfunction digitPrefixLength(string $text): int\n{\n    return 0;\n}\n\necho json_encode([digitPrefixLength('123x45'), digitPrefixLength('x12')]);\n"
        }
      ]
    },
    "stem": "A scanner needs the length of the initial digit run, stopping at the first nondigit. Which expression fits both displayed inputs?",
    "options": [
      {
        "id": "leading-span",
        "text": "strspn($text, '0123456789')",
        "rationale": "strspn counts the leading bytes that belong to the supplied digit set, stopping at the first other byte.",
        "misconception": null
      },
      {
        "id": "all-digits",
        "text": "strlen(preg_replace('/[^0-9]/', '', $text))",
        "rationale": "This counts digits anywhere, including after the first nondigit.",
        "misconception": "Replacing prefix recognition with total membership counting."
      },
      {
        "id": "leading-nondigits",
        "text": "strcspn($text, '0123456789')",
        "rationale": "This counts the initial run of bytes outside the digit set, the opposite condition.",
        "misconception": "Confusing accepted-span and rejected-span APIs."
      },
      {
        "id": "whole-length",
        "text": "strlen($text)",
        "rationale": "This includes every byte, regardless of whether it belongs to the initial digit run.",
        "misconception": "Assuming all remaining input belongs to the token."
      }
    ],
    "correctOptionId": "leading-span",
    "explanation": {
      "summary": "strspn measures an initial span drawn from a character set. It does not remove disallowed characters and continue counting later digits.",
      "trace": "123x45 has a three-byte digit prefix; x12 has a zero-byte digit prefix."
    },
    "validation": {
      "kind": "patch",
      "marker": "return 0;",
      "candidates": {
        "leading-span": "return strspn($text, '0123456789');",
        "all-digits": "return strlen(preg_replace('/[^0-9]/', '', $text));",
        "leading-nondigits": "return strcspn($text, '0123456789');",
        "whole-length": "return strlen($text);"
      },
      "stdout": "[3,0]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.strspn.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0569",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Arrays & destructuring",
    "subtopic": "array-value-frequency-map",
    "objective": {
      "id": "array-value-frequency-map",
      "text": "Build a frequency map of repeated string values rather than a set or index lookup."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose an array operation that retains occurrence counts."
    },
    "prerequisites": [
      "Array values",
      "Associative frequency maps",
      "array_count_values"
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
        "Every input value is a nonnumeric string label. Counts must include all repeated occurrences."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$labels = ['red', 'red', 'blue'];\n$counts = [];\necho json_encode($counts);\n"
        }
      ]
    },
    "stem": "Which expression creates the required histogram {\"red\":2,\"blue\":1}?",
    "options": [
      {
        "id": "unique-values",
        "text": "array_unique($labels)",
        "rationale": "This retains one occurrence of each value, not the number of occurrences.",
        "misconception": "Confusing deduplication with counting."
      },
      {
        "id": "flipped-values",
        "text": "array_flip($labels)",
        "rationale": "This maps labels to their last original indexes, not their frequencies.",
        "misconception": "Treating an occurrence position as a count."
      },
      {
        "id": "frequency-map",
        "text": "array_count_values($labels)",
        "rationale": "This counts each string value and uses that value as the corresponding result key.",
        "misconception": null
      },
      {
        "id": "unit-counts",
        "text": "array_fill_keys($labels, 1)",
        "rationale": "This assigns one to each distinct key, losing repeated occurrences.",
        "misconception": "Creating a set-like marker and mistaking it for a frequency."
      }
    ],
    "correctOptionId": "frequency-map",
    "explanation": {
      "summary": "array_count_values accumulates the number of occurrences for each allowed value. Deduplication, flipping and assigning markers cannot recover those frequencies.",
      "trace": "red is encountered twice and blue once, producing counts 2 and 1."
    },
    "validation": {
      "kind": "patch",
      "marker": "$counts = [];",
      "candidates": {
        "unique-values": "$counts = array_unique($labels);",
        "flipped-values": "$counts = array_flip($labels);",
        "frequency-map": "$counts = array_count_values($labels);",
        "unit-counts": "$counts = array_fill_keys($labels, 1);"
      },
      "stdout": "{\"red\":2,\"blue\":1}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-count-values.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0570",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "csv-quoted-delimiter-requires-csv-parser",
    "objective": {
      "id": "csv-quoted-delimiter-requires-csv-parser",
      "text": "Parse a quoted comma inside a CSV field without splitting that field into separate values."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish structured CSV syntax from literal delimiter splitting."
    },
    "prerequisites": [
      "CSV quotes",
      "str_getcsv",
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
        "This is one valid CSV record with comma delimiter, double-quote enclosure and no proprietary escape character. The required fields are Ada, Lin as one field and 7 as the second."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$record = '\"Ada, Lin\",7';\n$fields = [];\necho json_encode($fields);\n"
        }
      ]
    },
    "stem": "Which expression parses this record into exactly the required two fields?",
    "options": [
      {
        "id": "literal-split",
        "text": "explode(',', $record)",
        "rationale": "Literal splitting treats the enclosed comma as another separator.",
        "misconception": "Ignoring enclosure syntax when splitting structured data."
      },
      {
        "id": "csv-parser",
        "text": "str_getcsv($record, ',', '\"', '')",
        "rationale": "The CSV parser recognizes the enclosure and retains the internal comma as field data.",
        "misconception": null
      },
      {
        "id": "strip-then-split",
        "text": "explode(',', str_replace('\"', '', $record))",
        "rationale": "Removing quotes erases the information that distinguishes the embedded comma.",
        "misconception": "Discarding syntax before interpreting its grouping role."
      },
      {
        "id": "split-limit",
        "text": "explode(',', $record, 2)",
        "rationale": "A split limit keeps two pieces but splits at the wrong comma inside the first field.",
        "misconception": "Assuming the required field count guarantees correct field boundaries."
      }
    ],
    "correctOptionId": "csv-parser",
    "explanation": {
      "summary": "CSV enclosure rules determine which commas are separators. A CSV parser consumes the quotes as syntax while retaining the comma inside the first field.",
      "trace": "The first field is Ada, Lin and the second is the string 7."
    },
    "validation": {
      "kind": "patch",
      "marker": "$fields = [];",
      "candidates": {
        "literal-split": "$fields = explode(',', $record);",
        "csv-parser": "$fields = str_getcsv($record, ',', '\"', '');",
        "strip-then-split": "$fields = explode(',', str_replace('\"', '', $record));",
        "split-limit": "$fields = explode(',', $record, 2);"
      },
      "stdout": "[\"Ada, Lin\",\"7\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.str-getcsv.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0571",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Functions & arguments",
    "subtopic": "replace-specific-byte-range-not-every-matching-text",
    "objective": {
      "id": "replace-specific-byte-range-not-every-matching-text",
      "text": "Replace a selected byte range while retaining identical text outside that range."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate positional editing from global text replacement and insertion."
    },
    "prerequisites": [
      "ASCII byte offsets",
      "substr_replace",
      "Replacement length"
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
          "source": "<?php\n\n$text = 'ab-ab-ab';\n$result = $text;\necho $result;\n"
        }
      ]
    },
    "stem": "Replace only the two bytes at offset 3 in ab-ab-ab with XY. Which expression produces ab-XY-ab?",
    "options": [
      {
        "id": "replace-all",
        "text": "str_replace('ab', 'XY', $text)",
        "rationale": "This replaces all three matching occurrences instead of the selected byte range.",
        "misconception": "Treating text identity as a positional selection."
      },
      {
        "id": "insert-only",
        "text": "substr_replace($text, 'XY', 3, 0)",
        "rationale": "A zero replacement length inserts XY without removing the middle ab.",
        "misconception": "Confusing insertion length with replacement length."
      },
      {
        "id": "replace-through-end",
        "text": "substr_replace($text, 'XY', 3)",
        "rationale": "Omitting length replaces the rest of the string and loses the trailing -ab.",
        "misconception": "Assuming omitted length means the replacement text’s length."
      },
      {
        "id": "replace-two-bytes",
        "text": "substr_replace($text, 'XY', 3, 2)",
        "rationale": "This removes exactly the two bytes at offset 3 and inserts XY, leaving both surrounding sections intact.",
        "misconception": null
      }
    ],
    "correctOptionId": "replace-two-bytes",
    "explanation": {
      "summary": "substr_replace accepts a start offset and the number of original bytes to replace. These parameters identify the middle occurrence without matching or changing the others.",
      "trace": "The prefix ab- and suffix -ab remain; the selected ab becomes XY."
    },
    "validation": {
      "kind": "patch",
      "marker": "$result = $text;",
      "candidates": {
        "replace-all": "$result = str_replace('ab', 'XY', $text);",
        "insert-only": "$result = substr_replace($text, 'XY', 3, 0);",
        "replace-through-end": "$result = substr_replace($text, 'XY', 3);",
        "replace-two-bytes": "$result = substr_replace($text, 'XY', 3, 2);"
      },
      "stdout": "ab-XY-ab",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.substr-replace.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0572",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Arrays & destructuring",
    "subtopic": "append-two-values-without-nested-array-or-return-reassignment",
    "objective": {
      "id": "append-two-values-without-nested-array-or-return-reassignment",
      "text": "Append two queue values as separate elements while retaining the existing queue."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish variadic append mutation, nested array insertion and the append function’s count result."
    },
    "prerequisites": [
      "array_push",
      "Array append syntax",
      "Mutating function return values"
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
          "source": "<?php\n\n$queue = ['first'];\n// APPEND\n\necho json_encode($queue);\n"
        }
      ]
    },
    "stem": "Which statement changes queue into the flat list [\"first\",\"second\",\"third\"]?",
    "options": [
      {
        "id": "append-separate",
        "text": "array_push($queue, 'second', 'third');",
        "rationale": "Each supplied value is appended as a separate element, and the queue variable remains the mutated array.",
        "misconception": null
      },
      {
        "id": "append-nested",
        "text": "$queue[] = ['second', 'third'];",
        "rationale": "This appends one nested array rather than two separate string values.",
        "misconception": "Equating one array-valued element with its contents."
      },
      {
        "id": "assign-count",
        "text": "$queue = array_push($queue, 'second', 'third');",
        "rationale": "array_push returns the new count, so this overwrites the array variable with 3.",
        "misconception": "Mistaking a mutator’s status/count result for the mutated collection."
      },
      {
        "id": "replace-list",
        "text": "$queue = ['second', 'third'];",
        "rationale": "This creates a replacement list and discards the existing first item.",
        "misconception": "Confusing append with replacement."
      }
    ],
    "correctOptionId": "append-separate",
    "explanation": {
      "summary": "array_push mutates the array with one new element per argument and returns the resulting count. The caller must retain the array rather than assign that count back to it.",
      "trace": "The original first item stays, followed by second and third as separate elements."
    },
    "validation": {
      "kind": "patch",
      "marker": "// APPEND",
      "stdout": "[\"first\",\"second\",\"third\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-push.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0573",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "known-source-encoding-transcode-before-json",
    "objective": {
      "id": "known-source-encoding-transcode-before-json",
      "text": "Transcode known Windows-1252 bytes into UTF-8 without substituting or reinterpreting their characters."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate source character encoding from JSON serialization and binary transport encodings."
    },
    "prerequisites": [
      "Windows-1252 versus UTF-8",
      "mb_convert_encoding",
      "JSON UTF-8 input"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "mbstring"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The external format specifies Windows-1252. Its byte 0x80 means the euro sign. The result must contain that character, not a replacement marker or an encoded binary blob."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$bytes = \"Price: \\x80\";\n$text = $bytes;\necho json_encode($text, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);\n"
        }
      ]
    },
    "stem": "Which expression produces valid UTF-8 for the required JSON text?",
    "options": [
      {
        "id": "latin1-source",
        "text": "mb_convert_encoding($bytes, 'UTF-8', 'ISO-8859-1')",
        "rationale": "ISO-8859-1 maps byte 0x80 differently and does not produce the euro sign.",
        "misconception": "Treating all single-byte Western encodings as interchangeable."
      },
      {
        "id": "utf8-source",
        "text": "mb_convert_encoding($bytes, 'UTF-8', 'UTF-8')",
        "rationale": "The source is not UTF-8, so this cannot recover the specified Windows-1252 character correctly.",
        "misconception": "Labeling bytes as the desired target encoding instead of transcoding their known source."
      },
      {
        "id": "specified-source",
        "text": "mb_convert_encoding($bytes, 'UTF-8', 'Windows-1252')",
        "rationale": "The source byte is decoded using its declared character mapping and then encoded as UTF-8.",
        "misconception": null
      },
      {
        "id": "base64-transport",
        "text": "base64_encode($bytes)",
        "rationale": "This preserves binary bytes as base64 text, but does not produce the required human-readable character string.",
        "misconception": "Substituting binary transport encoding for character transcoding."
      }
    ],
    "correctOptionId": "specified-source",
    "explanation": {
      "summary": "Correct transcoding needs both the source and target encodings. The declared Windows-1252 byte maps to a euro sign; JSON can then encode the resulting valid UTF-8 text.",
      "trace": "0x80 becomes UTF-8 E2 82 AC, and the JSON string reads Price: €."
    },
    "validation": {
      "kind": "patch",
      "marker": "$text = $bytes;",
      "candidates": {
        "latin1-source": "$text = mb_convert_encoding($bytes, 'UTF-8', 'ISO-8859-1');",
        "utf8-source": "$text = mb_convert_encoding($bytes, 'UTF-8', 'UTF-8');",
        "specified-source": "$text = mb_convert_encoding($bytes, 'UTF-8', 'Windows-1252');",
        "base64-transport": "$text = base64_encode($bytes);"
      },
      "stdout": "\"Price: €\"",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.mb-convert-encoding.php",
      "https://www.php.net/manual/en/ref.json.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0574",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Functions & arguments",
    "subtopic": "unicode-full-case-fold-versus-lowercase-display",
    "objective": {
      "id": "unicode-full-case-fold-versus-lowercase-display",
      "text": "Build a Unicode caseless comparison key that expands sharp s rather than merely lowercasing display text."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish full case folding from lowercasing and canonical normalization."
    },
    "prerequisites": [
      "Unicode case folding",
      "mb_convert_case",
      "Multi-character case mappings",
      "UTF-8"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "mbstring",
        "intl"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The application explicitly requires Unicode full default case folding for comparison keys, without locale tailoring. For these inputs the key must be strasse. Original display text is stored separately."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction comparisonKey(string $text): string\n{\n    return $text;\n}\n\necho json_encode([comparisonKey('Straße'), comparisonKey('STRASSE')]);\n"
        }
      ]
    },
    "stem": "Which expression implements the required comparison-key policy?",
    "options": [
      {
        "id": "lowercase",
        "text": "mb_strtolower($text, 'UTF-8')",
        "rationale": "Lowercasing leaves lowercase ß rather than expanding it to ss.",
        "misconception": "Treating display lowercase as full caseless equivalence."
      },
      {
        "id": "full-fold",
        "text": "mb_convert_case($text, MB_CASE_FOLD, 'UTF-8')",
        "rationale": "Full case folding produces strasse for both forms under the stated policy.",
        "misconception": null
      },
      {
        "id": "canonical-compose",
        "text": "Normalizer::normalize($text, Normalizer::FORM_C)",
        "rationale": "Canonical normalization does not perform the required case conversion or sharp-s expansion.",
        "misconception": "Confusing canonical character normalization with caseless comparison."
      },
      {
        "id": "simple-fold",
        "text": "mb_convert_case($text, MB_CASE_FOLD_SIMPLE, 'UTF-8')",
        "rationale": "Simple folding avoids the multi-character expansion needed for ß to ss.",
        "misconception": "Assuming simple and full folding have identical expansion behavior."
      }
    ],
    "correctOptionId": "full-fold",
    "explanation": {
      "summary": "Full case folding supports mappings to multiple code points for caseless comparison. Lowercase display conversion, simple folding and canonical normalization do not implement the specified sharp-s equivalence.",
      "trace": "Straße and STRASSE both become strasse only with the supplied full-fold operation."
    },
    "validation": {
      "kind": "patch",
      "marker": "return $text;",
      "candidates": {
        "lowercase": "return mb_strtolower($text, 'UTF-8');",
        "full-fold": "return mb_convert_case($text, MB_CASE_FOLD, 'UTF-8');",
        "canonical-compose": "return Normalizer::normalize($text, Normalizer::FORM_C);",
        "simple-fold": "return mb_convert_case($text, MB_CASE_FOLD_SIMPLE, 'UTF-8');"
      },
      "stdout": "[\"strasse\",\"strasse\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.mb-convert-case.php",
      "https://www.unicode.org/versions/latest/core-spec/chapter-3/"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0575",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "HTTP & superglobals",
    "subtopic": "retry-after-delay-seconds-not-milliseconds-or-epoch",
    "objective": {
      "id": "retry-after-delay-seconds-not-milliseconds-or-epoch",
      "text": "Encode a relative retry delay in the HTTP Retry-After field using its defined unit and grammar."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Translate an internal millisecond delay into a nonnegative integer seconds value without retrying too early."
    },
    "prerequisites": [
      "HTTP Retry-After",
      "Delay-seconds grammar",
      "Ceiling conversion",
      "Milliseconds versus seconds"
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
        "A PHP rate limiter returns remaining delay 1500 milliseconds. The response must use the relative delay-seconds form, rounded upward so a compliant client is not invited to retry before that interval. Clock skew and network delay are outside this encoding question."
      ],
      "files": []
    },
    "stem": "Which header value meets this contract?",
    "options": [
      {
        "id": "two-seconds",
        "text": "Retry-After: 2",
        "rationale": "The relative field uses integer seconds; ceiling 1500/1000 gives 2.",
        "misconception": null
      },
      {
        "id": "milliseconds",
        "text": "Retry-After: 1500",
        "rationale": "This tells a client to wait 1500 seconds, not 1500 milliseconds.",
        "misconception": "Copying an internal duration without converting its unit."
      },
      {
        "id": "fractional",
        "text": "Retry-After: 1.5",
        "rationale": "The delay-seconds grammar requires a nonnegative decimal integer, not a fraction.",
        "misconception": "Assuming the field accepts arbitrary numeric seconds."
      },
      {
        "id": "rounded-down",
        "text": "Retry-After: 1",
        "rationale": "One second is shorter than the required 1500 milliseconds.",
        "misconception": "Truncating a lower-bound delay rather than rounding it upward."
      }
    ],
    "correctOptionId": "two-seconds",
    "explanation": {
      "summary": "Retry-After can carry an HTTP date or a nonnegative integer number of seconds. The chosen relative form requires converting milliseconds and rounding upward for this contract.",
      "trace": "ceil(1500/1000) is 2, so the relative field contains 2."
    },
    "validation": {
      "kind": "document-review",
      "rule": "RFC 9110 Retry-After delay-seconds is a nonnegative decimal integer in seconds.",
      "optionAudit": {
        "two-seconds": "Valid grammar and conservative conversion.",
        "milliseconds": "Wrong unit.",
        "fractional": "Invalid delay-seconds grammar.",
        "rounded-down": "Invites retry too early."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc9110.html#name-retry-after"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0576",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "directory-dot-entries-versus-hidden-real-names",
    "objective": {
      "id": "directory-dot-entries-versus-hidden-real-names",
      "text": "Exclude only the synthetic dot directory entries while retaining real hidden files and directories."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Apply an exact name policy without substituting hidden-file or file-type filtering."
    },
    "prerequisites": [
      "scandir",
      "Dot directory entries",
      "Hidden filename conventions",
      "Array filtering"
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
        "All owned fixture operations succeed. Every real entry must be listed, including .env and the folder directory. Only . and .. must be omitted."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$directory = __DIR__ . '/listing';\nmkdir($directory);\nfile_put_contents($directory . '/.env', 'local');\nfile_put_contents($directory . '/readme.txt', 'text');\nmkdir($directory . '/folder');\n$names = scandir($directory);\n\n$selected = array_filter($names, static function (string $name) use ($directory): bool {\n    return false;\n});\necho json_encode(array_values($selected));\n"
        }
      ]
    },
    "stem": "Which predicate selects the required entries from scandir?",
    "options": [
      {
        "id": "exclude-hidden",
        "text": "!str_starts_with($name, '.')",
        "rationale": "This removes .env along with the synthetic dot entries.",
        "misconception": "Treating every dot-prefixed name as a traversal marker."
      },
      {
        "id": "files-only",
        "text": "is_file($directory . '/' . $name)",
        "rationale": "This excludes the real folder directory, which the listing must retain.",
        "misconception": "Replacing a name exclusion policy with a file-type filter."
      },
      {
        "id": "no-dots-anywhere",
        "text": "!str_contains($name, '.')",
        "rationale": "This also removes readme.txt and .env because their names contain dots.",
        "misconception": "Treating a punctuation character anywhere in a name as a special directory entry."
      },
      {
        "id": "exact-dot-entries",
        "text": "$name !== '.' && $name !== '..'",
        "rationale": "This excludes exactly the two synthetic entries while retaining all actual names.",
        "misconception": null
      }
    ],
    "correctOptionId": "exact-dot-entries",
    "explanation": {
      "summary": "The special entries are exact names, not a general dot-prefix or extension rule. Exact comparisons preserve hidden files and real directories.",
      "trace": "The selected names are .env, folder and readme.txt in scandir’s sorted order."
    },
    "validation": {
      "kind": "patch",
      "marker": "return false;",
      "candidates": {
        "exclude-hidden": "return !str_starts_with($name, '.');",
        "files-only": "return is_file($directory . '/' . $name);",
        "no-dots-anywhere": "return !str_contains($name, '.');",
        "exact-dot-entries": "return $name !== '.' && $name !== '..';"
      },
      "stdout": "[\".env\",\"folder\",\"readme.txt\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.scandir.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0577",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "incremental-hash-updates-original-bytes-in-order",
    "objective": {
      "id": "incremental-hash-updates-original-bytes-in-order",
      "text": "Compute a concatenated byte stream’s digest incrementally rather than combining per-chunk digests."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a hash’s streaming state from hashes of separately transformed chunks."
    },
    "prerequisites": [
      "hash_init",
      "hash_update",
      "hash_final",
      "Chunk boundaries versus message bytes"
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
        "The required SHA-256 digest is that of the original bytes abcdef in order. Chunk boundaries are transport artifacts and must not appear in the hashed message. Production input is streamed; this small array is a deterministic fixture."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$chunks = ['ab', 'c', 'def'];\n$context = hash_init('sha256');\n\nforeach ($chunks as $chunk) {\n    // UPDATE\n}\n\necho json_encode(hash_final($context) === hash('sha256', 'abcdef'));\n"
        }
      ]
    },
    "stem": "Which update statement makes the streaming digest equal to hash(\"sha256\", \"abcdef\")?",
    "options": [
      {
        "id": "chunk-digest",
        "text": "hash_update($context, hash('sha256', $chunk, true));",
        "rationale": "This hashes concatenated per-chunk digests rather than the original message bytes.",
        "misconception": "Assuming a digest of digests equals the digest of concatenated data."
      },
      {
        "id": "original-bytes",
        "text": "hash_update($context, $chunk);",
        "rationale": "Successive updates extend one hash state with the original bytes in their original order.",
        "misconception": null
      },
      {
        "id": "reset-per-chunk",
        "text": "$context = hash_init('sha256');\n    hash_update($context, $chunk);",
        "rationale": "Resetting discards the earlier chunks, leaving only the last chunk in the final digest.",
        "misconception": "Treating initialization as a per-update requirement."
      },
      {
        "id": "encoded-chunks",
        "text": "hash_update($context, bin2hex($chunk));",
        "rationale": "Hex text has different bytes from the original content.",
        "misconception": "Hashing a display representation instead of the required bytes."
      }
    ],
    "correctOptionId": "original-bytes",
    "explanation": {
      "summary": "An incremental hash context carries the running state between updates. Feeding each original chunk is equivalent to feeding their concatenation; hashing chunk digests, resetting state or encoding bytes changes the message.",
      "trace": "Updates ab, c and def contribute exactly abcdef to one context, so the digest comparison is true."
    },
    "validation": {
      "kind": "patch",
      "marker": "// UPDATE",
      "stdout": "true",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.hash-update.php",
      "https://www.php.net/manual/en/function.hash-final.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0578",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "composer-library-runtime-class-not-autoload-dev",
    "objective": {
      "id": "composer-library-runtime-class-not-autoload-dev",
      "text": "Publish a library’s runtime class through consumer-visible autoload rules rather than root-only development rules."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Distinguish a package’s own development installation from its role as a dependency and the scope of generated loaders."
    },
    "prerequisites": [
      "Composer root-only fields (advanced)",
      "autoload versus autoload-dev",
      "Library distribution",
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
        "A library puts Acme\\Codec\\Decoder in src/Decoder.php, but its Acme\\Codec\\ to src/ mapping exists only under autoload-dev. Tests pass in the library checkout. Consumers require Decoder during normal execution and include their generated vendor/autoload.php. File spelling and namespace declarations are otherwise correct."
      ],
      "files": []
    },
    "stem": "Which package change makes Decoder available to consumers through Composer’s normal contract?",
    "options": [
      {
        "id": "consumer-dev-mode",
        "text": "Ask consumers to install with development dependencies so the dependency’s autoload-dev is imported.",
        "rationale": "A dependency’s autoload-dev is root-only and is not imported merely by enabling the consumer’s development installation.",
        "misconception": "Assuming dev mode recursively activates every dependency’s development autoload rules."
      },
      {
        "id": "optimize-only",
        "text": "Keep the metadata and generate an optimized classmap in each consumer.",
        "rationale": "Optimization does not turn ignored dependency autoload-dev rules into published runtime rules.",
        "misconception": "Treating optimization as a repair for missing runtime metadata."
      },
      {
        "id": "publish-runtime-map",
        "text": "Move the runtime namespace mapping into autoload and regenerate the consumer’s installed loader.",
        "rationale": "autoload is the consumer-visible declaration for runtime classes; generated loader metadata must reflect that release.",
        "misconception": null
      },
      {
        "id": "require-dev-only",
        "text": "Move the library from the consumer’s require section into require-dev.",
        "rationale": "Changing installation scope does not make the dependency’s root-only autoload-dev part of its runtime contract.",
        "misconception": "Confusing dependency installation category with dependency autoload-rule scope."
      }
    ],
    "correctOptionId": "publish-runtime-map",
    "explanation": {
      "summary": "A library checkout is its own root package, so its autoload-dev can hide a packaging defect. Consumers see the dependency’s runtime autoload rules; required runtime classes must be declared there.",
      "trace": "The release publishes the PSR-4 mapping in autoload. A regenerated consumer loader can resolve Decoder without relying on the library’s local test environment."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Composer autoload-dev is root-only; autoload defines dependency runtime loading rules.",
      "optionAudit": {
        "consumer-dev-mode": "Does not import a dependency’s root-only field.",
        "optimize-only": "Cannot supply omitted runtime rules.",
        "publish-runtime-map": "Publishes the missing runtime contract.",
        "require-dev-only": "Changes installation scope, not field semantics."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://getcomposer.org/doc/04-schema.md#autoload-dev",
      "https://getcomposer.org/doc/04-schema.md#autoload"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0579",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Validation & web security",
    "subtopic": "gcm-counter-nonce-durable-reservation-before-use",
    "objective": {
      "id": "gcm-counter-nonce-durable-reservation-before-use",
      "text": "Allocate per-key GCM counter nonces without reuse across concurrent PHP workers and crashes."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine uniqueness, atomic allocation and durable ordering for a cryptographic state invariant."
    },
    "prerequisites": [
      "GCM nonce uniqueness (advanced)",
      "Atomic durable counters",
      "Crash recovery",
      "Per-key state"
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
        "A reviewed encryption service uses one fixed key and encodes a monotonic counter injectively into its nonce. Counter exhaustion stops encryption. A shared allocator can atomically reserve and durably commit disjoint ranges; committed state never rolls back and backups are never restored with the same key. Workers may crash at any point. Unused nonce gaps are acceptable. The task is choosing allocation order, not implementing cryptography."
      ],
      "files": []
    },
    "stem": "Which workflow prevents nonce reuse under these assumptions?",
    "options": [
      {
        "id": "commit-after-encrypt",
        "text": "Read the next counter, encrypt, then durably increment the allocator.",
        "rationale": "A crash after encryption but before increment permits the counter to be reused.",
        "misconception": "Persisting uniqueness state after the operation it protects."
      },
      {
        "id": "reserve-before-use",
        "text": "Atomically commit a disjoint counter range before using it; abandon unused values after a crash.",
        "rationale": "Every used nonce belongs to a previously durable reservation, and abandoned gaps cannot cause reuse.",
        "misconception": null
      },
      {
        "id": "local-counter-per-worker",
        "text": "Start each worker’s local counter at the last committed shared value and checkpoint periodically.",
        "rationale": "Workers may overlap immediately, and a crash can replay values since the last checkpoint.",
        "misconception": "Assuming local monotonicity guarantees global uniqueness."
      },
      {
        "id": "volatile-atomic-counter",
        "text": "Use a shared atomic in-memory increment and persist its value only during graceful shutdown.",
        "rationale": "Atomicity prevents concurrent overlap while running but a crash can restore an earlier counter.",
        "misconception": "Treating atomic allocation as durable allocation."
      }
    ],
    "correctOptionId": "reserve-before-use",
    "explanation": {
      "summary": "GCM nonce uniqueness is per key and must survive both concurrency and restart. Durable reservation before use supplies both properties; skipped unused values are harmless while reused values are not.",
      "trace": "The allocator commits a unique range. A worker uses values from it. If it crashes, the range remains consumed, so replacement workers receive different values."
    },
    "validation": {
      "kind": "document-review",
      "rule": "GCM requires per-key IV uniqueness; under the stated allocator contract, durable reserve-before-use prevents crash replay.",
      "optionAudit": {
        "commit-after-encrypt": "Crash window reuses an already used value.",
        "reserve-before-use": "Atomic disjointness plus durability precedes use.",
        "local-counter-per-worker": "Workers overlap and checkpoints replay.",
        "volatile-atomic-counter": "Crash loses allocation progress."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://csrc.nist.gov/pubs/sp/800/38/d/final"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0580",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "PDO & database access",
    "subtopic": "keyset-pagination-complete-order-tuple-after-insert",
    "objective": {
      "id": "keyset-pagination-complete-order-tuple-after-insert",
      "text": "Continue pagination after a complete ordering tuple without duplicating rows when an earlier row is inserted."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine tie-breaking order, cursor predicates and a changing dataset without claiming snapshot isolation."
    },
    "prerequisites": [
      "Keyset pagination (advanced)",
      "SQL tuple comparison",
      "Stable composite ordering",
      "PDO prepared statements"
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
        "The previous page ended at created=10,id=2. A new row id=5,created=5 was inserted before this next query. Existing rows and their ordering fields do not change. Return the next two rows strictly after that tuple; this is not a frozen snapshot guarantee for later inserts after the cursor."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec('CREATE TABLE events (id INTEGER PRIMARY KEY, created INTEGER NOT NULL)');\n$pdo->exec('INSERT INTO events VALUES (1,10), (2,10), (3,10), (4,20), (5,5)');\n$sql = 'SELECT id FROM events ORDER BY created, id LIMIT 2';\n\n$statement = $pdo->query($sql);\necho json_encode($statement->fetchAll(PDO::FETCH_COLUMN));\n"
        }
      ]
    },
    "stem": "Which query returns IDs 3 and 4 without repeating ID 2 or including the newly inserted earlier row?",
    "options": [
      {
        "id": "offset-page",
        "text": "SELECT id FROM events ORDER BY created, id LIMIT 2 OFFSET 2",
        "rationale": "The inserted earlier row shifts positions, so offset 2 begins with already-seen ID 2.",
        "misconception": "Assuming positional offsets remain stable under earlier inserts."
      },
      {
        "id": "timestamp-only",
        "text": "SELECT id FROM events WHERE created > 10 ORDER BY created, id LIMIT 2",
        "rationale": "This skips ID 3, which shares the cursor timestamp but follows it by ID.",
        "misconception": "Dropping the tie-breaker from the continuation predicate."
      },
      {
        "id": "id-only",
        "text": "SELECT id FROM events WHERE id > 2 ORDER BY created, id LIMIT 2",
        "rationale": "This admits ID 5 even though its created value sorts before the cursor tuple.",
        "misconception": "Using a tie-breaker alone as if it were the complete ordering."
      },
      {
        "id": "complete-tuple",
        "text": "SELECT id FROM events WHERE (created, id) > (10, 2) ORDER BY created, id LIMIT 2",
        "rationale": "The lexicographic predicate uses the same complete order as the query, retaining the timestamp tie and excluding earlier tuples.",
        "misconception": null
      }
    ],
    "correctOptionId": "complete-tuple",
    "explanation": {
      "summary": "The cursor must represent every component of the stable ORDER BY. Comparing the complete tuple preserves rows tied on created and is unaffected by insertion of a row before that tuple.",
      "trace": "ID 3 has tuple (10,3), then ID 4 has (20,4). ID 5 has (5,5), which is before the cursor despite its larger ID."
    },
    "validation": {
      "kind": "patch",
      "marker": "'SELECT id FROM events ORDER BY created, id LIMIT 2'",
      "candidates": {
        "offset-page": "'SELECT id FROM events ORDER BY created, id LIMIT 2 OFFSET 2'",
        "timestamp-only": "'SELECT id FROM events WHERE created > 10 ORDER BY created, id LIMIT 2'",
        "id-only": "'SELECT id FROM events WHERE id > 2 ORDER BY created, id LIMIT 2'",
        "complete-tuple": "'SELECT id FROM events WHERE (created, id) > (10, 2) ORDER BY created, id LIMIT 2'"
      },
      "stdout": "[3,4]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.sqlite.org/rowvalue.html#scrolling_window_queries",
      "https://www.php.net/manual/en/book.pdo.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0581",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "gregorian-leap-century-exception-regression",
    "objective": {
      "id": "gregorian-leap-century-exception-regression",
      "text": "Choose a calendar test that exposes an incomplete divisible-by-four leap-year rule."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Select the century exception that separates the simplified implementation from the Gregorian rule."
    },
    "prerequisites": [
      "Gregorian leap years",
      "Boolean tests",
      "checkdate"
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
        "The application uses the Gregorian calendar. Leap years are divisible by 4, except centuries not divisible by 400. The four test years are in checkdate’s supported range."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction isLeapYear(int $year): bool\n{\n    return $year % 4 === 0;\n}\n"
        }
      ]
    },
    "stem": "Which proposed test fails for this implementation and passes after replacing its rule with the stated calendar rule?",
    "options": [
      {
        "id": "ordinary-leap",
        "text": "isLeapYear(2024) must be true.",
        "rationale": "Both the incomplete rule and the Gregorian rule accept this ordinary leap year.",
        "misconception": "Testing the common path without the missing century exception."
      },
      {
        "id": "century-not-four-hundred",
        "text": "isLeapYear(1900) must be false.",
        "rationale": "1900 is divisible by 4 and 100 but not 400, exposing the incomplete rule.",
        "misconception": null
      },
      {
        "id": "four-hundred-century",
        "text": "isLeapYear(2000) must be true.",
        "rationale": "Both rules accept a century divisible by 400.",
        "misconception": "Choosing a century that does not exercise the rejecting exception."
      },
      {
        "id": "ordinary-common",
        "text": "isLeapYear(2023) must be false.",
        "rationale": "Both rules reject a year not divisible by 4.",
        "misconception": "Testing an already-correct rejection branch."
      }
    ],
    "correctOptionId": "century-not-four-hundred",
    "explanation": {
      "summary": "The defect affects centuries divisible by 100 but not 400. A test of 1900 distinguishes the simplified modulo rule from the actual calendar rule; the other years agree under both.",
      "trace": "The current implementation returns true for 1900. checkdate(2,29,1900) returns false."
    },
    "validation": {
      "kind": "tests",
      "marker": "$year % 4 === 0",
      "repair": "checkdate(2, 29, $year)",
      "cases": [
        {
          "option": "ordinary-leap",
          "probe": "echo json_encode(isLeapYear(2024));",
          "expected": "true"
        },
        {
          "option": "century-not-four-hundred",
          "probe": "echo json_encode(isLeapYear(1900));",
          "expected": "false"
        },
        {
          "option": "four-hundred-century",
          "probe": "echo json_encode(isLeapYear(2000));",
          "expected": "true"
        },
        {
          "option": "ordinary-common",
          "probe": "echo json_encode(isLeapYear(2023));",
          "expected": "false"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.php.net/manual/en/function.checkdate.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0582",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "HTTP & superglobals",
    "subtopic": "https-origin-default-port-equivalence-test",
    "objective": {
      "id": "https-origin-default-port-equivalence-test",
      "text": "Test origin equality when an omitted HTTPS port and explicit port 443 identify the same origin."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate textual URL representation from the scheme-host-effective-port origin tuple."
    },
    "prerequisites": [
      "URL origins",
      "Default HTTPS port",
      "parse_url",
      "Same-origin comparison"
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
        "Inputs are valid lowercase HTTPS URLs with the same host, no user information and no unusual host spellings. The helper compares only the port part; scheme and host equality have already been checked. Omitted HTTPS port means 443."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction sameHttpsPort(string $left, string $right): bool\n{\n    return parse_url($left, PHP_URL_PORT) === parse_url($right, PHP_URL_PORT);\n}\n"
        }
      ]
    },
    "stem": "Which test exposes the missing default-port normalization?",
    "options": [
      {
        "id": "both-omitted",
        "text": "https://a.example/x and https://a.example/y must compare true.",
        "rationale": "Both parse to null ports, so the defective comparison already passes.",
        "misconception": "Testing only identical absent representations."
      },
      {
        "id": "different-explicit",
        "text": "https://a.example:443/x and https://a.example:8443/x must compare false.",
        "rationale": "The explicit numeric ports differ under both rules.",
        "misconception": "Testing a distinction that does not require default normalization."
      },
      {
        "id": "both-explicit",
        "text": "https://a.example:443/x and https://a.example:443/y must compare true.",
        "rationale": "Both explicit ports are 443 under both implementations.",
        "misconception": "Testing only identical explicit representations."
      },
      {
        "id": "implicit-explicit-default",
        "text": "https://a.example/x and https://a.example:443/x must compare true.",
        "rationale": "The current code compares null with 443 even though both identify the default HTTPS port.",
        "misconception": null
      }
    ],
    "correctOptionId": "implicit-explicit-default",
    "explanation": {
      "summary": "Origin comparison uses an effective port, not whether the URL spelled it explicitly. The omitted-versus-explicit default case is the one that distinguishes the implementations.",
      "trace": "The failing pair yields null versus 443 before normalization and 443 versus 443 afterward."
    },
    "validation": {
      "kind": "tests",
      "marker": "parse_url($left, PHP_URL_PORT) === parse_url($right, PHP_URL_PORT)",
      "repair": "(parse_url($left, PHP_URL_PORT) ?? 443) === (parse_url($right, PHP_URL_PORT) ?? 443)",
      "cases": [
        {
          "option": "both-omitted",
          "probe": "echo json_encode(sameHttpsPort('https://a.example/x', 'https://a.example/y'));",
          "expected": "true"
        },
        {
          "option": "different-explicit",
          "probe": "echo json_encode(sameHttpsPort('https://a.example:443/x', 'https://a.example:8443/x'));",
          "expected": "false"
        },
        {
          "option": "both-explicit",
          "probe": "echo json_encode(sameHttpsPort('https://a.example:443/x', 'https://a.example:443/y'));",
          "expected": "true"
        },
        {
          "option": "implicit-explicit-default",
          "probe": "echo json_encode(sameHttpsPort('https://a.example/x', 'https://a.example:443/x'));",
          "expected": "true"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc6454.html#section-4",
      "https://www.php.net/manual/en/function.parse-url.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0583",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "strcmp-test-sign-contract-not-result-magnitude",
    "objective": {
      "id": "strcmp-test-sign-contract-not-result-magnitude",
      "text": "Assert a string comparator’s ordering contract without requiring an undocumented negative magnitude."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a comparator’s sign guarantee from an implementation-specific numeric result."
    },
    "prerequisites": [
      "strcmp",
      "Comparator sign contracts",
      "Assertion precision"
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
          "source": "<?php\n\n$result = strcmp('a', 'z');\necho json_encode([$result < 0, $result === -1]);\n"
        }
      ]
    },
    "stem": "A test must verify that a sorts before z using strcmp. Which assertion follows the documented contract across conforming PHP implementations?",
    "options": [
      {
        "id": "exact-minus-one",
        "text": "Assert that the result is exactly -1.",
        "rationale": "The contract promises a negative value, not this particular magnitude.",
        "misconception": "Over-specifying a comparator’s result as a normalized three-way value."
      },
      {
        "id": "negative-result",
        "text": "Assert that the result is less than 0.",
        "rationale": "Any negative result satisfies strcmp’s ordering contract for these strings.",
        "misconception": null
      },
      {
        "id": "length-result",
        "text": "Assert that the result equals the difference in string lengths.",
        "rationale": "Both strings have length one, but their contents compare differently.",
        "misconception": "Replacing lexical comparison with a length comparison."
      },
      {
        "id": "nonzero-only",
        "text": "Assert that the result is not 0.",
        "rationale": "That permits a positive result, which would reverse the required order.",
        "misconception": "Testing inequality without testing its required direction."
      }
    ],
    "correctOptionId": "negative-result",
    "explanation": {
      "summary": "strcmp defines ordering through the sign of its integer result. A correct ordering test must require the negative direction without demanding an exact negative number.",
      "trace": "For a versus z the comparison is negative. The observed result is not required to equal -1."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[true,false]",
      "keyEvidence": "The installed runtimes satisfy the negative contract without returning -1.",
      "counterexamples": {
        "exact-minus-one": "Fails a conforming negative result.",
        "length-result": "Equal lengths do not imply lexical equality.",
        "nonzero-only": "Would also accept reversed order."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.php.net/manual/en/function.strcmp.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0584",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "exact-exception-class-versus-subclass-expectation",
    "objective": {
      "id": "exact-exception-class-versus-subclass-expectation",
      "text": "Choose a test that enforces an exact exception class when accepting subclasses would violate the specified API contract."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish subclass-compatible exception expectations from exact runtime-class assertions."
    },
    "prerequisites": [
      "PHPUnit exception expectations",
      "Exception inheritance",
      "get_class",
      "Failure when no exception occurs"
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
        "Use PHPUnit 12.5. The API contract explicitly requires exactly InvalidArgumentException for this input; a subclass such as CustomInputFailure is considered a regression. The tested call is isolated from fixture construction. The test must also fail if the call returns normally."
      ],
      "files": []
    },
    "stem": "Which test strategy enforces that exact contract?",
    "options": [
      {
        "id": "parent-expectation",
        "text": "Use expectException(InvalidArgumentException::class) before the call.",
        "rationale": "PHPUnit accepts subclasses for this expectation, so it is weaker than the explicit exact-class requirement.",
        "misconception": "Assuming a class-based exception expectation requires exact identity."
      },
      {
        "id": "message-only",
        "text": "Catch Throwable and assert only the exception message.",
        "rationale": "An unrelated class or subclass can carry the same message.",
        "misconception": "Using message equality as a substitute for exception type policy."
      },
      {
        "id": "exact-class-and-no-return",
        "text": "Fail if no exception occurs; otherwise assert get_class($error) === InvalidArgumentException::class.",
        "rationale": "This rejects no-exception cases and checks the exact runtime class rather than subclass compatibility.",
        "misconception": null
      },
      {
        "id": "broad-expectation",
        "text": "Use expectException(Exception::class) and assert that the input was invalid.",
        "rationale": "This admits many unrelated exception types and subclasses.",
        "misconception": "Treating a broad exceptional outcome as the specified error taxonomy."
      }
    ],
    "correctOptionId": "exact-class-and-no-return",
    "explanation": {
      "summary": "PHPUnit’s exception class expectation follows inheritance. When exact class identity is explicitly part of a contract, a test needs both a no-exception failure path and an exact runtime-class comparison.",
      "trace": "The exact-class assertion accepts InvalidArgumentException itself, rejects CustomInputFailure and rejects normal completion."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHPUnit 12.5 expectException accepts instances of the expected class including subclasses; exact get_class equality is stricter.",
      "optionAudit": {
        "parent-expectation": "Allows the forbidden subclass.",
        "message-only": "Does not constrain class identity.",
        "exact-class-and-no-return": "Covers exact identity and absence.",
        "broad-expectation": "Allows unrelated Exception subclasses."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://docs.phpunit.de/en/12.5/writing-tests-for-phpunit.html#expecting-exceptions"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0585",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Validation & web security",
    "subtopic": "bearer-scheme-normalization-preserves-token-case-test",
    "objective": {
      "id": "bearer-scheme-normalization-preserves-token-case-test",
      "text": "Test that case-insensitive authentication-scheme matching does not alter case-sensitive credential bytes."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Choose a mixed-case token that separates header syntax normalization from credential preservation."
    },
    "prerequisites": [
      "HTTP authentication scheme names",
      "Opaque bearer tokens",
      "Case-sensitive credentials"
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
        "Inputs have exactly one space after the scheme and a valid nonempty token. Scheme matching is case-insensitive. The returned token must preserve its exact original bytes. Malformed-header handling is outside this fixture."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction bearerToken(string $header): string\n{\n    $parts = explode(' ', strtolower($header), 2);\n\n    return $parts[1];\n}\n"
        }
      ]
    },
    "stem": "Which test detects this parser’s credential corruption?",
    "options": [
      {
        "id": "lower-token",
        "text": "bearer abc123 must return abc123.",
        "rationale": "Lowercasing does not change this already lowercase token.",
        "misconception": "Testing only credentials unaffected by the normalization."
      },
      {
        "id": "upper-scheme",
        "text": "BEARER abc123 must return abc123.",
        "rationale": "The token is still lowercase, so this tests only scheme spelling.",
        "misconception": "Varying syntax case without varying credential case."
      },
      {
        "id": "numeric-token",
        "text": "Bearer 12345 must return 12345.",
        "rationale": "Digits are unchanged by lowercasing.",
        "misconception": "Testing a token alphabet without case distinctions."
      },
      {
        "id": "mixed-token",
        "text": "Bearer AbC123 must return AbC123.",
        "rationale": "The current code returns abc123, exposing alteration of the opaque token.",
        "misconception": null
      }
    ],
    "correctOptionId": "mixed-token",
    "explanation": {
      "summary": "An authentication scheme can be matched case-insensitively without transforming the credential that follows it. Lowercasing the entire header corrupts mixed-case tokens.",
      "trace": "The mixed token becomes abc123 in the current parser. Splitting the original header preserves AbC123 for return."
    },
    "validation": {
      "kind": "tests",
      "marker": "explode(' ', strtolower($header), 2)",
      "repair": "explode(' ', $header, 2)",
      "cases": [
        {
          "option": "lower-token",
          "probe": "echo bearerToken('bearer abc123');",
          "expected": "abc123"
        },
        {
          "option": "upper-scheme",
          "probe": "echo bearerToken('BEARER abc123');",
          "expected": "abc123"
        },
        {
          "option": "numeric-token",
          "probe": "echo bearerToken('Bearer 12345');",
          "expected": "12345"
        },
        {
          "option": "mixed-token",
          "probe": "echo bearerToken('Bearer AbC123');",
          "expected": "AbC123"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc9110.html#name-authentication-scheme",
      "https://www.rfc-editor.org/rfc/rfc6750.html#section-2.1"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0586",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "bcmath-comparison-scale-regression",
    "objective": {
      "id": "bcmath-comparison-scale-regression",
      "text": "Select a test that exposes loss of required decimal precision in a BCMath comparison."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Choose values differing below the configured comparison scale while other control cases remain valid."
    },
    "prerequisites": [
      "BCMath decimal strings",
      "bccomp scale",
      "Exact comparison precision"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "bcmath"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "Valid inputs have at most four fractional decimal digits. Equality must compare their numerical values at four-digit precision; trailing zeros do not matter."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction equalAmount(string $left, string $right): bool\n{\n    return bccomp($left, $right, 2) === 0;\n}\n"
        }
      ]
    },
    "stem": "Which test exposes the implementation’s insufficient scale?",
    "options": [
      {
        "id": "trailing-zero",
        "text": "equalAmount(\"1.23\", \"1.2300\") must be true.",
        "rationale": "Both scales treat these equivalent values as equal.",
        "misconception": "Testing representation differences without a value difference."
      },
      {
        "id": "fourth-place-difference",
        "text": "equalAmount(\"1.2345\", \"1.2346\") must be false.",
        "rationale": "At scale two both compare as 1.23, hiding the required fourth-place difference.",
        "misconception": null
      },
      {
        "id": "second-place-difference",
        "text": "equalAmount(\"1.23\", \"1.24\") must be false.",
        "rationale": "The difference is already visible at scale two.",
        "misconception": "Choosing a difference within the current precision."
      },
      {
        "id": "negative-equivalence",
        "text": "equalAmount(\"-1.23\", \"-1.2300\") must be true.",
        "rationale": "Both scales correctly compare these equal negative values.",
        "misconception": "Varying sign without exercising lost precision."
      }
    ],
    "correctOptionId": "fourth-place-difference",
    "explanation": {
      "summary": "bccomp compares at the supplied decimal scale. The test must place a meaningful difference beyond the current two digits but within the required four.",
      "trace": "The defective comparison returns true for 1.2345 versus 1.2346; scale four returns a nonzero comparison and therefore false."
    },
    "validation": {
      "kind": "tests",
      "marker": "bccomp($left, $right, 2)",
      "repair": "bccomp($left, $right, 4)",
      "cases": [
        {
          "option": "trailing-zero",
          "probe": "echo json_encode(equalAmount(\"1.23\", \"1.2300\"));",
          "expected": "true"
        },
        {
          "option": "fourth-place-difference",
          "probe": "echo json_encode(equalAmount(\"1.2345\", \"1.2346\"));",
          "expected": "false"
        },
        {
          "option": "second-place-difference",
          "probe": "echo json_encode(equalAmount(\"1.23\", \"1.24\"));",
          "expected": "false"
        },
        {
          "option": "negative-equivalence",
          "probe": "echo json_encode(equalAmount(\"-1.23\", \"-1.2300\"));",
          "expected": "true"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.php.net/manual/en/function.bccomp.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0587",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "PDO & database access",
    "subtopic": "pdo-duplicate-column-label-fixture-distinguishes-identities",
    "objective": {
      "id": "pdo-duplicate-column-label-fixture-distinguishes-identities",
      "text": "Choose a PDO result-mapping fixture that exposes two selected columns sharing the same associative label."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Make parent and child identities differ so a label collision cannot be hidden by equal fixture values."
    },
    "prerequisites": [
      "PDO FETCH_ASSOC",
      "SQL column aliases",
      "Result mapping",
      "Distinct entity identities"
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
        "Use PDO SQLite. The helper must return the parent identifier. Both bound inputs are integers; the query is a small isolated substitute for a join selecting two id columns."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction parentIdentifier(int $parent, int $child): int\n{\n    $pdo = new PDO('sqlite::memory:');\n    $statement = $pdo->prepare('SELECT :parent AS id, :child AS id');\n    $statement->bindValue(':parent', $parent, PDO::PARAM_INT);\n    $statement->bindValue(':child', $child, PDO::PARAM_INT);\n    $statement->execute();\n    $row = $statement->fetch(PDO::FETCH_ASSOC);\n\n    return $row['id'];\n}\n"
        }
      ]
    },
    "stem": "Which test exposes the result-column collision?",
    "options": [
      {
        "id": "equal-positive",
        "text": "parentIdentifier(1, 1) must return 1.",
        "rationale": "The wrong selected identity has the same value, hiding the collision.",
        "misconception": "Using identical fixture identities for distinct roles."
      },
      {
        "id": "both-zero",
        "text": "parentIdentifier(0, 0) must return 0.",
        "rationale": "Equal zero values also hide which column supplied the result.",
        "misconception": "Testing a boundary value without separating the two identities."
      },
      {
        "id": "different-identities",
        "text": "parentIdentifier(7, 9) must return 7.",
        "rationale": "The duplicate id label currently supplies 9, revealing that the parent column was overwritten.",
        "misconception": null
      },
      {
        "id": "another-equal-pair",
        "text": "parentIdentifier(3, 3) must return 3.",
        "rationale": "Changing both equal identifiers together still cannot distinguish their source columns.",
        "misconception": "Assuming new numbers alone create a discriminating fixture."
      }
    ],
    "correctOptionId": "different-identities",
    "explanation": {
      "summary": "An associative row cannot retain two values under one identical label. Distinct fixture IDs reveal which selected column survives; aliasing the child column preserves the parent id entry.",
      "trace": "The current SQLite associative fetch returns id=9 for the differing pair. Giving the child a distinct child_id alias leaves id=7."
    },
    "validation": {
      "kind": "tests",
      "marker": "SELECT :parent AS id, :child AS id",
      "repair": "SELECT :parent AS id, :child AS child_id",
      "cases": [
        {
          "option": "equal-positive",
          "probe": "echo parentIdentifier(1, 1);",
          "expected": "1"
        },
        {
          "option": "both-zero",
          "probe": "echo parentIdentifier(0, 0);",
          "expected": "0"
        },
        {
          "option": "different-identities",
          "probe": "echo parentIdentifier(7, 9);",
          "expected": "7"
        },
        {
          "option": "another-equal-pair",
          "probe": "echo parentIdentifier(3, 3);",
          "expected": "3"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdostatement.fetch.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0588",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "HTTP & superglobals",
    "subtopic": "if-none-match-get-uses-weak-etag-comparison-test",
    "objective": {
      "id": "if-none-match-get-uses-weak-etag-comparison-test",
      "text": "Test weak entity-tag comparison for a conditional GET without applying If-Match’s stronger comparison rule."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Select equivalent opaque tags whose weak/strong prefixes differ."
    },
    "prerequisites": [
      "HTTP entity tags",
      "If-None-Match",
      "Conditional GET",
      "Weak comparison"
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
        "This helper handles one entity tag or no header for GET only. Lists and wildcard syntax are outside this bounded fixture. Tags are valid quoted values optionally prefixed W/. Equal opaque values require 304 regardless of that weak prefix. Different opaque values require 200."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction conditionalStatus(?string $requested, string $current): int\n{\n    if ($requested === null) {\n        return 200;\n    }\n\n    return $requested === $current ? 304 : 200;\n}\n"
        }
      ]
    },
    "stem": "Which test exposes the byte-equality implementation’s incorrect comparison?",
    "options": [
      {
        "id": "weak-strong-equivalent",
        "text": "Request \"v1\" against current W/\"v1\" must return 304.",
        "rationale": "The opaque values match weakly, but byte equality rejects their different prefixes.",
        "misconception": null
      },
      {
        "id": "same-strong",
        "text": "Request \"v1\" against current \"v1\" must return 304.",
        "rationale": "Both byte equality and weak comparison match these identical strings.",
        "misconception": "Testing only identical validator representations."
      },
      {
        "id": "different-value",
        "text": "Request \"v1\" against current \"v2\" must return 200.",
        "rationale": "Both comparisons reject different opaque values.",
        "misconception": "Testing a value mismatch unrelated to strength prefixes."
      },
      {
        "id": "no-header",
        "text": "No If-None-Match header against current \"v1\" must return 200.",
        "rationale": "The explicit no-header branch already handles this case.",
        "misconception": "Testing a branch that bypasses the defective comparison."
      }
    ],
    "correctOptionId": "weak-strong-equivalent",
    "explanation": {
      "summary": "For If-None-Match on GET, weak comparison ignores the optional W/ prefix and compares opaque tag values. Byte equality is too strict for a weak-versus-strong representation of the same value.",
      "trace": "\"v1\" and W/\"v1\" compare equal under the specified weak comparison, so GET returns 304."
    },
    "validation": {
      "kind": "tests",
      "marker": "$requested === $current",
      "repair": "preg_replace('/^W\\//', '', $requested) === preg_replace('/^W\\//', '', $current)",
      "cases": [
        {
          "option": "weak-strong-equivalent",
          "probe": "echo conditionalStatus('\"v1\"', 'W/\"v1\"');",
          "expected": "304"
        },
        {
          "option": "same-strong",
          "probe": "echo conditionalStatus('\"v1\"', '\"v1\"');",
          "expected": "304"
        },
        {
          "option": "different-value",
          "probe": "echo conditionalStatus('\"v1\"', '\"v2\"');",
          "expected": "200"
        },
        {
          "option": "no-header",
          "probe": "echo conditionalStatus(null, '\"v1\"');",
          "expected": "200"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc9110.html#name-if-none-match"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0589",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "HTTP & superglobals",
    "subtopic": "vary-header-integration-test-cross-language-cache-reuse",
    "objective": {
      "id": "vary-header-integration-test-cross-language-cache-reuse",
      "text": "Test negotiated response caching across different Accept-Language requests to the same URL."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Exercise cache reuse rather than only origin rendering or cold requests."
    },
    "prerequisites": [
      "HTTP Vary",
      "Shared response caches",
      "Accept-Language negotiation",
      "Integration test sequencing"
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
        "A PHP origin returns Hello for GET /greeting with Accept-Language: en and Bonjour for fr. Responses are fresh and cacheable, but the origin omits Vary. The compliant shared cache keys by URL unless Vary adds request fields. Each proposed test starts with a fresh empty cache. GET /health always returns ok. There are no cookies or authentication."
      ],
      "files": []
    },
    "stem": "Which integration test reveals the missing Vary: Accept-Language?",
    "options": [
      {
        "id": "same-language-repeat",
        "text": "Request /greeting in en twice; assert Hello for both responses.",
        "rationale": "Reusing the English representation is correct for the second English request.",
        "misconception": "Testing reuse without varying the negotiated request field."
      },
      {
        "id": "cold-french",
        "text": "Request /greeting in fr once; assert Bonjour.",
        "rationale": "A cold miss reaches the origin and does not exercise reuse of a different representation.",
        "misconception": "Testing origin negotiation without cache interaction."
      },
      {
        "id": "different-url",
        "text": "Request /greeting in en, then /health in fr; assert Hello then ok.",
        "rationale": "Different URLs already have separate cache keys.",
        "misconception": "Changing the primary key instead of the missing Vary dimension."
      },
      {
        "id": "same-url-different-language",
        "text": "Request /greeting in en, then the same URL in fr; assert Hello then Bonjour.",
        "rationale": "The second request currently reuses Hello, exposing the absent language dimension in the cache key.",
        "misconception": null
      }
    ],
    "correctOptionId": "same-url-different-language",
    "explanation": {
      "summary": "A Vary defect appears when a fresh cached representation is reused for a request that differs in a field used by origin negotiation. A cold request or a different URL cannot demonstrate that collision.",
      "trace": "English primes the URL cache. Without Vary, French receives Hello; with Accept-Language in Vary it obtains Bonjour."
    },
    "validation": {
      "kind": "document-review",
      "rule": "RFC 9111 uses Vary-selected request fields when selecting a stored response for reuse.",
      "optionAudit": {
        "same-language-repeat": "Correct reuse under either policy.",
        "cold-french": "No conflicting cached response exists.",
        "different-url": "Primary URL keys already separate entries.",
        "same-url-different-language": "Exposes reuse across the missing language dimension."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc9111.html#name-calculating-cache-keys-with-"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0590",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "cli-exit-string-is-output-not-failure-status-test",
    "objective": {
      "id": "cli-exit-string-is-output-not-failure-status-test",
      "text": "Test a CLI program’s process status rather than mistaking printed numeric text for a failure exit code."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate stdout bytes from the process exit-status channel."
    },
    "prerequisites": [
      "CLI process exit status",
      "exit string versus integer",
      "Subprocess testing"
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
        "The command must signal failure with integer exit status 1. Its textual output is not part of that contract. The fixture runs as a separate CLI process, never inside the quiz application."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nexit('1');\n"
        }
      ]
    },
    "stem": "Which process-level assertion detects the defect in this failure path?",
    "options": [
      {
        "id": "printed-one",
        "text": "Assert that stdout contains the character 1.",
        "rationale": "The current program already prints that text while exiting successfully.",
        "misconception": "Treating diagnostic output as process failure status."
      },
      {
        "id": "status-one",
        "text": "Assert that the captured process exit status equals integer 1.",
        "rationale": "A string argument is printed and produces status zero; an integer argument is needed for the required status.",
        "misconception": null
      },
      {
        "id": "no-fatal-text",
        "text": "Assert that stderr contains no PHP fatal-error message.",
        "rationale": "A successful exit with the wrong status can have no fatal diagnostic.",
        "misconception": "Using absence of runtime errors as proof of application failure signaling."
      },
      {
        "id": "nonempty-output",
        "text": "Assert that the process produced at least one output byte.",
        "rationale": "The current incorrect string exit satisfies that condition.",
        "misconception": "Using output presence as a substitute for a status assertion."
      }
    ],
    "correctOptionId": "status-one",
    "explanation": {
      "summary": "exit distinguishes its argument types. A string is emitted as output, while an integer supplies the exit status. A subprocess test must inspect the status field to enforce this CLI contract.",
      "trace": "The shown source emits 1 and exits with status 0. exit(1) emits nothing and exits with status 1."
    },
    "validation": {
      "kind": "contract",
      "stdout": "1",
      "keyEvidence": "The runtime harness observes status zero for the string exit and one for the integer variant.",
      "counterexamples": {
        "printed-one": "Accepts the defective program.",
        "no-fatal-text": "Does not constrain exit status.",
        "nonempty-output": "Accepts printed text with success status."
      },
      "contrasts": [
        {
          "name": "integer-status",
          "marker": "exit('1');",
          "replacement": "exit(1);",
          "stdout": "",
          "error": {
            "message": "",
            "exitCode": 1
          }
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.php.net/manual/en/function.exit.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0591",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Validation & web security",
    "subtopic": "base64-canonical-pad-bits-roundtrip-test",
    "objective": {
      "id": "base64-canonical-pad-bits-roundtrip-test",
      "text": "Test canonical Base64 spelling rather than only successful strict-mode decoding."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Distinguish alphabet validation from nonzero unused pad bits that can decode to the same bytes."
    },
    "prerequisites": [
      "Base64 pad bits (advanced)",
      "Strict PHP decoder behavior",
      "Canonical encodings",
      "Decode/re-encode validation"
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
        "The protocol accepts exactly canonical padded standard Base64, including the empty string for empty bytes. It does not allow whitespace or alternative spellings. Zg== is the canonical encoding of f; Zh== has different unused pad bits but PHP’s strict decoder still yields f."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction canonicalBase64(string $text): bool\n{\n    return base64_decode($text, true) !== false;\n}\n"
        }
      ]
    },
    "stem": "Which test exposes the difference between decodable and canonical input?",
    "options": [
      {
        "id": "canonical-f",
        "text": "canonicalBase64(\"Zg==\") must be true.",
        "rationale": "Both checks accept the canonical spelling.",
        "misconception": "Testing only the standard representation."
      },
      {
        "id": "invalid-alphabet",
        "text": "canonicalBase64(\"@@\") must be false.",
        "rationale": "Strict decoding already rejects these foreign alphabet characters.",
        "misconception": "Testing alphabet rejection rather than canonical pad bits."
      },
      {
        "id": "noncanonical-pad-bits",
        "text": "canonicalBase64(\"Zh==\") must be false.",
        "rationale": "PHP decodes it successfully, but re-encoding the bytes yields Zg==, exposing the noncanonical spelling.",
        "misconception": null
      },
      {
        "id": "empty-message",
        "text": "canonicalBase64(\"\") must be true.",
        "rationale": "The stated protocol accepts empty bytes and both implementations do so.",
        "misconception": "Choosing an empty boundary case unrelated to canonical ambiguity."
      }
    ],
    "correctOptionId": "noncanonical-pad-bits",
    "explanation": {
      "summary": "Strict decoding checks decodability and alphabet rules but does not guarantee one canonical spelling. Re-encoding decoded bytes and comparing exact text detects the alternate pad-bit representation.",
      "trace": "Zh== decodes to f; encoding f produces Zg==, so exact canonical comparison rejects Zh==."
    },
    "validation": {
      "kind": "tests",
      "marker": "return base64_decode($text, true) !== false;",
      "repair": "$decoded = base64_decode($text, true);\n\n    return $decoded !== false && base64_encode($decoded) === $text;",
      "cases": [
        {
          "option": "canonical-f",
          "probe": "echo json_encode(canonicalBase64(\"Zg==\"));",
          "expected": "true"
        },
        {
          "option": "invalid-alphabet",
          "probe": "echo json_encode(canonicalBase64(\"@@\"));",
          "expected": "false"
        },
        {
          "option": "noncanonical-pad-bits",
          "probe": "echo json_encode(canonicalBase64(\"Zh==\"));",
          "expected": "false"
        },
        {
          "option": "empty-message",
          "probe": "echo json_encode(canonicalBase64(\"\"));",
          "expected": "true"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc4648.html#section-3.5",
      "https://www.php.net/manual/en/function.base64-decode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0592",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "retry-ownership-prevents-multiplicative-attempts",
    "objective": {
      "id": "retry-ownership-prevents-multiplicative-attempts",
      "text": "Bound total outbound attempts when multiple PHP layers can independently retry the same operation."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace nested retry multiplication and assign one owner for the end-to-end attempt budget."
    },
    "prerequisites": [
      "Nested call layers",
      "Retry budgets",
      "Transient failures",
      "Idempotent reads"
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
        "A PHP worker calls a service wrapper that calls an HTTP client. Each layer currently allows three total attempts, including its first attempt, and retries every propagated transient failure. Every outbound call fails transiently. The operation is a safe read. The required maximum is three outbound calls for one logical worker operation."
      ],
      "files": []
    },
    "stem": "Which design meets that maximum without retry amplification?",
    "options": [
      {
        "id": "all-three",
        "text": "Keep three total attempts at each layer; all layers share the same numeric limit.",
        "rationale": "Independent nested limits can multiply to 27 outbound calls.",
        "misconception": "Confusing equal local limits with a shared total budget."
      },
      {
        "id": "two-layers",
        "text": "Keep three attempts in the worker and client, with one in the service wrapper.",
        "rationale": "The remaining independent retry loops can still produce nine outbound calls.",
        "misconception": "Assuming removing one retry layer eliminates multiplication."
      },
      {
        "id": "one-owner",
        "text": "Give one layer the three-attempt budget and configure the other two for one attempt per call.",
        "rationale": "Only one loop repeats the outbound operation, so at most three calls occur.",
        "misconception": null
      },
      {
        "id": "backoff-only",
        "text": "Keep all three retry loops but add increasing delays at every layer.",
        "rationale": "Delays change timing but do not reduce the total possible attempt count.",
        "misconception": "Treating backoff as an attempt-budget mechanism."
      }
    ],
    "correctOptionId": "one-owner",
    "explanation": {
      "summary": "Local retry limits compose multiplicatively when each outer retry starts a fresh inner retry loop. One explicit owner, or a genuinely shared consumable budget, is needed for an end-to-end call cap.",
      "trace": "Three independent three-attempt loops allow 3×3×3 calls. One three-attempt owner and two single-attempt layers allow 3."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Under the stated nested-loop contract, worst-case calls multiply; assigning one owner bounds the product to three.",
      "optionAudit": {
        "all-three": "Maximum 27.",
        "two-layers": "Maximum 9.",
        "one-owner": "Maximum 3.",
        "backoff-only": "Still maximum 27."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php.net/manual/en/language.exceptions.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0593",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "composer-optional-driver-packages-localize-platform-requirements",
    "objective": {
      "id": "composer-optional-driver-packages-localize-platform-requirements",
      "text": "Structure optional PHP storage adapters so installing one driver enforces its extension requirements without requiring unrelated drivers."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Place platform dependencies in the package that actually owns each optional implementation."
    },
    "prerequisites": [
      "Composer packages",
      "Extension requirements",
      "Optional adapters",
      "Dependency boundaries"
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
        "A reusable PHP core supports either a PostgreSQL adapter requiring ext-pdo_pgsql or a SQLite adapter requiring ext-pdo_sqlite. Consumers must install only their selected driver, and Composer must reject an installation missing that driver’s required extension. The core itself uses neither driver directly."
      ],
      "files": []
    },
    "stem": "Which package structure meets both optionality and installation validation?",
    "options": [
      {
        "id": "core-requires-both",
        "text": "Put both extension requirements in the core package’s require section.",
        "rationale": "This enforces availability but forces every consumer to install both optional drivers.",
        "misconception": "Centralizing all possible platform requirements in the shared core."
      },
      {
        "id": "adapter-requirements",
        "text": "Publish separate adapters, each requiring the core and its own runtime extension.",
        "rationale": "Installing the chosen adapter enforces exactly its required platform capability.",
        "misconception": null
      },
      {
        "id": "suggest-only",
        "text": "Put both extensions only in the core package’s suggest section.",
        "rationale": "Suggestions do not make installation fail when the selected adapter’s required extension is absent.",
        "misconception": "Treating optional package guidance as enforced dependency validation."
      },
      {
        "id": "dev-requirements",
        "text": "Put each driver extension only in its adapter’s require-dev section.",
        "rationale": "A dependency’s development requirements do not enforce its production runtime needs.",
        "misconception": "Classifying a runtime platform dependency as development tooling."
      }
    ],
    "correctOptionId": "adapter-requirements",
    "explanation": {
      "summary": "The optional implementation owns the extension dependency. Keeping the core neutral and declaring requirements in separate adapter packages permits selective installation while preserving Composer’s platform checks.",
      "trace": "A SQLite consumer requires the SQLite adapter, which requires ext-pdo_sqlite; no PostgreSQL extension is forced by the core."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Composer require enforces runtime platform packages; suggest is advisory and require-dev does not define dependency runtime requirements.",
      "optionAudit": {
        "core-requires-both": "Violates driver optionality.",
        "adapter-requirements": "Enforces only selected implementation requirements.",
        "suggest-only": "Does not enforce installation failure.",
        "dev-requirements": "Wrong dependency scope."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://getcomposer.org/doc/04-schema.md#require",
      "https://getcomposer.org/doc/04-schema.md#suggest"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0594",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Classes & object lifecycle",
    "subtopic": "money-value-carries-currency-and-minor-unit-invariant",
    "objective": {
      "id": "money-value-carries-currency-and-minor-unit-invariant",
      "text": "Represent monetary amounts so addition cannot silently combine unrelated currencies."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Choose a domain representation carrying both exact quantity and its unit of meaning."
    },
    "prerequisites": [
      "PHP value objects",
      "Integer minor units",
      "Currency identity",
      "Domain invariants"
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
        "The PHP service supports USD and EUR, each with two decimal places. Amounts are bounded integer minor units and addition cannot overflow. Currency conversion is unavailable. Adding different currencies must be rejected; adding matching currencies must remain exact."
      ],
      "files": []
    },
    "stem": "Which representation and addition contract meet these requirements?",
    "options": [
      {
        "id": "minor-units-only",
        "text": "Store integer minor units alone and add them directly.",
        "rationale": "The quantity is exact, but no currency identity remains to reject cross-currency addition.",
        "misconception": "Assuming exact arithmetic also establishes unit compatibility."
      },
      {
        "id": "formatted-label",
        "text": "Store display strings such as $12.00 and add parsed numeric portions.",
        "rationale": "Display parsing loses reliable currency identity and introduces formatting-dependent arithmetic.",
        "misconception": "Using presentation text as the domain arithmetic representation."
      },
      {
        "id": "global-currency",
        "text": "Store a float amount and use the service’s current global currency during addition.",
        "rationale": "The amount lacks stable currency identity and binary floats do not supply the stated exact minor-unit arithmetic.",
        "misconception": "Relying on ambient context to define a value’s unit."
      },
      {
        "id": "typed-money",
        "text": "Store currency plus integer minor units; addition requires equal currencies and returns a new value.",
        "rationale": "The value carries its unit and exact bounded quantity, allowing the operation to enforce compatibility.",
        "misconception": null
      }
    ],
    "correctOptionId": "typed-money",
    "explanation": {
      "summary": "A monetary quantity needs its currency as well as its numeric magnitude. A value object can enforce matching units before exact integer addition and avoid depending on mutable ambient currency state.",
      "trace": "USD 1200 plus USD 300 yields USD 1500. USD 1200 plus EUR 300 is rejected because no conversion contract exists."
    },
    "validation": {
      "kind": "document-review",
      "rule": "The stated domain invariant requires exact bounded integer arithmetic and explicit equal-currency admission.",
      "optionAudit": {
        "minor-units-only": "Cannot distinguish currencies.",
        "formatted-label": "Presentation parsing is not the required stable representation.",
        "global-currency": "Loses per-value unit identity and exactness.",
        "typed-money": "Carries and enforces both required properties."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.php",
      "https://www.php.net/manual/en/language.types.integer.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0595",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "feature-flag-snapshot-consistent-per-operation",
    "objective": {
      "id": "feature-flag-snapshot-consistent-per-operation",
      "text": "Keep a feature decision consistent within one checkout while allowing later checkouts to observe updated policy."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Choose the configuration snapshot lifetime that matches the operation’s consistency boundary."
    },
    "prerequisites": [
      "Immutable request data",
      "Long-running PHP workers",
      "Feature flags",
      "Operation lifetime"
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
        "A flag selects pricing algorithm A or B. Each checkout invokes pricing twice and must use the same algorithm for both calls. Administrators may change the flag between calls. A later checkout must read the then-current flag. A trusted flag provider can return an immutable boolean snapshot."
      ],
      "files": []
    },
    "stem": "Where should the service obtain and retain that decision?",
    "options": [
      {
        "id": "operation-snapshot",
        "text": "Read once when each checkout starts and pass that snapshot through its pricing calls.",
        "rationale": "The snapshot is stable within the checkout and refreshed for the next operation.",
        "misconception": null
      },
      {
        "id": "every-price-call",
        "text": "Read the provider independently before each pricing call.",
        "rationale": "A mid-checkout change can select two different algorithms for one operation.",
        "misconception": "Equating maximum freshness with operation-level consistency."
      },
      {
        "id": "worker-startup",
        "text": "Read once when the long-running worker starts and retain it for all checkouts.",
        "rationale": "Later checkouts cannot observe changes until the worker restarts.",
        "misconception": "Giving dynamic policy the lifetime of the process."
      },
      {
        "id": "user-cache",
        "text": "Cache the first flag value permanently per user and reuse it across checkouts.",
        "rationale": "The next checkout for that user may not observe the updated flag.",
        "misconception": "Using user identity rather than operation lifetime as the consistency boundary."
      }
    ],
    "correctOptionId": "operation-snapshot",
    "explanation": {
      "summary": "The required unit of consistency is one checkout. Reading once at its start prevents internal disagreement while allowing the next checkout to use a newer decision.",
      "trace": "Both pricing calls receive the same captured boolean. A subsequent checkout obtains a fresh snapshot."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Given the explicit consistency and freshness requirements, the snapshot lifetime must be exactly the checkout operation.",
      "optionAudit": {
        "operation-snapshot": "Meets both requirements.",
        "every-price-call": "Can disagree within one checkout.",
        "worker-startup": "Stale across later operations.",
        "user-cache": "Stale across the same user’s later checkouts."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.php",
      "https://www.php.net/manual/en/functions.anonymous.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0596",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "autoload-definition-files-must-not-bootstrap-optional-services",
    "objective": {
      "id": "autoload-definition-files-must-not-bootstrap-optional-services",
      "text": "Keep loading reusable PHP class definitions independent of starting optional external integrations."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate class discovery from application lifecycle decisions and dependency construction."
    },
    "prerequisites": [
      "Composer autoloading",
      "Class definition files",
      "Composition root",
      "Optional integrations"
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
        "A library’s PSR-4 class file opens a remote telemetry connection at top level when included. Static analysis, CLI help and applications with telemetry disabled must be able to load that class without network activity. Telemetry must start only when the application explicitly enables it. No backend change is requested; this is a design scenario."
      ],
      "files": []
    },
    "stem": "Which boundary satisfies the loading and lifecycle requirements?",
    "options": [
      {
        "id": "autoload-files",
        "text": "Move the connection code into Composer autoload.files so it runs consistently.",
        "rationale": "That starts the side effect even earlier for every consumer of the loader.",
        "misconception": "Treating predictable unconditional execution as optional lifecycle control."
      },
      {
        "id": "static-initializer",
        "text": "Move the connection into a static initialization helper called at the bottom of the class file.",
        "rationale": "The top-level call still performs network activity during class loading.",
        "misconception": "Changing code organization without changing execution timing."
      },
      {
        "id": "explicit-bootstrap",
        "text": "Keep definition files free of the connection side effect and invoke a configured telemetry factory from explicit application startup.",
        "rationale": "The application owns the enablement decision, while loading declarations remains safe for tooling and disabled use cases.",
        "misconception": null
      },
      {
        "id": "first-class-check",
        "text": "Start telemetry when class_exists first autoloads the class.",
        "rationale": "Class discovery is precisely one of the operations that must not trigger network activity.",
        "misconception": "Using class availability checks as application startup signals."
      }
    ],
    "correctOptionId": "explicit-bootstrap",
    "explanation": {
      "summary": "Autoloading is a mechanism for making declarations available, including to tools and optional consumers. The application’s explicit startup flow should own whether an integration is constructed and started.",
      "trace": "The class loads without connecting. Enabled application startup invokes the telemetry factory; disabled startup does not."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP autoload includes class files; moving side effects behind an explicitly invoked application factory separates discovery from activation.",
      "optionAudit": {
        "autoload-files": "Unconditionally activates at loader initialization.",
        "static-initializer": "Still runs on include.",
        "explicit-bootstrap": "Makes activation an explicit lifecycle decision.",
        "first-class-check": "Still activates during discovery."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.autoload.php",
      "https://getcomposer.org/doc/04-schema.md"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0597",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Files & structured data",
    "subtopic": "file-response-metadata-and-bytes-share-open-descriptor",
    "objective": {
      "id": "file-response-metadata-and-bytes-share-open-descriptor",
      "text": "Serve file metadata and bytes from the same opened version during atomic pathname replacement."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine pathname rebinding, descriptor identity and metadata consistency without relying on a pre-open stat observation."
    },
    "prerequisites": [
      "POSIX atomic rename (advanced)",
      "fstat versus stat",
      "Open descriptors",
      "HTTP file response consistency"
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
        "A PHP service serves an owned POSIX file. Publishers replace its pathname by atomic rename and never modify a published file in place. Files remain readable through existing descriptors. The response length and bytes must describe one version, although it need not be the newest after opening. All I/O errors are handled as failures before streaming begins."
      ],
      "files": []
    },
    "stem": "Which reader sequence preserves that version consistency?",
    "options": [
      {
        "id": "stat-then-open",
        "text": "Read filesize(path), then open path and stream its bytes.",
        "rationale": "A replacement between the two operations can mix old metadata with new content.",
        "misconception": "Assuming a pathname resolves to the same file across separate operations."
      },
      {
        "id": "clear-cache-stat",
        "text": "Clear PHP’s stat cache, read filesize(path), then open path.",
        "rationale": "Fresh metadata can still become stale before the later open.",
        "misconception": "Treating cache invalidation as synchronization with a concurrent publisher."
      },
      {
        "id": "open-then-path-stat",
        "text": "Open path, then call filesize(path) and stream the opened handle.",
        "rationale": "The pathname can be replaced after opening, so metadata may describe the new file while the handle reads the old one.",
        "misconception": "Assuming opening first binds subsequent pathname operations to that handle."
      },
      {
        "id": "descriptor-consistency",
        "text": "Open once, obtain length with fstat(handle), then stream that same handle.",
        "rationale": "Metadata and data refer to the same retained file object, which the stated publisher never modifies in place.",
        "misconception": null
      }
    ],
    "correctOptionId": "descriptor-consistency",
    "explanation": {
      "summary": "Atomic rename changes what the pathname names, while an existing handle retains its opened file. fstat queries that handle’s object, so it remains consistent with the bytes subsequently read from it.",
      "trace": "If publication replaces the path after open, both fstat and reads still refer to the opened version. No pathname-based lookup is mixed into the response metadata."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Under immutable-after-publication POSIX files, descriptor-based fstat and reads refer to the same opened object across pathname replacement.",
      "optionAudit": {
        "stat-then-open": "Replacement can occur between metadata and open.",
        "clear-cache-stat": "Freshness does not make operations atomic.",
        "open-then-path-stat": "Path metadata may describe another version.",
        "descriptor-consistency": "Both observations use the retained file identity."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.fstat.php",
      "https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0598",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Transactions, migrations & ORM",
    "subtopic": "canonical-username-uniqueness-enforced-under-concurrency",
    "objective": {
      "id": "canonical-username-uniqueness-enforced-under-concurrency",
      "text": "Enforce case-insensitive username uniqueness across concurrent PHP registrations using the same canonical identity at validation and persistence."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine normalization equivalence with database-enforced concurrency control rather than a pre-insert availability query."
    },
    "prerequisites": [
      "Concurrent registrations (advanced)",
      "Unique constraints",
      "Canonical identity",
      "Constraint violation handling"
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
        "Usernames contain only ASCII letters. Identity is lowercase ASCII, so Ada and ADA are the same username. A PostgreSQL database stores raw display names with case-sensitive text comparison. Concurrent transactions use READ COMMITTED. The application can store a canonical column and enforce a unique constraint on it. Both requests may pass an availability SELECT before either inserts."
      ],
      "files": []
    },
    "stem": "Which design enforces the stated identity rule under that race?",
    "options": [
      {
        "id": "unique-canonical",
        "text": "Compute and store the lowercase canonical name, enforce its unique constraint and handle duplicate violations as name-unavailable.",
        "rationale": "The database arbitrates concurrent inserts using the same canonical identity required by the application.",
        "misconception": null
      },
      {
        "id": "select-before-insert",
        "text": "Lowercase in the availability SELECT, then insert the raw name without a unique canonical constraint.",
        "rationale": "Both requests can observe absence before inserting, so the precheck alone cannot enforce uniqueness.",
        "misconception": "Treating a prior observation as a concurrent write guarantee."
      },
      {
        "id": "unique-display",
        "text": "Keep only a unique constraint on the case-sensitive raw display name.",
        "rationale": "Ada and ADA remain different values under the stated database comparison.",
        "misconception": "Enforcing uniqueness under a different equivalence relation."
      },
      {
        "id": "transaction-only",
        "text": "Wrap the availability SELECT and raw INSERT in READ COMMITTED transactions without a unique constraint.",
        "rationale": "The stated isolation still permits both absence checks and does not create the missing uniqueness invariant.",
        "misconception": "Assuming any transaction serializes concurrent absence checks."
      }
    ],
    "correctOptionId": "unique-canonical",
    "explanation": {
      "summary": "Uniqueness must use the same canonical identity as the application and be enforced where concurrent writes meet. An availability query can improve feedback but cannot replace the database constraint.",
      "trace": "Both requests derive ada. One insert succeeds; the other conflicts on the unique canonical value and is translated into name-unavailable."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PostgreSQL unique constraints reject duplicate stored keys; READ COMMITTED prechecks alone do not serialize the stated competing inserts.",
      "optionAudit": {
        "unique-canonical": "Matches equivalence and arbitrates writes.",
        "select-before-insert": "Both prechecks may pass.",
        "unique-display": "Case variants are distinct stored keys.",
        "transaction-only": "No constraint prevents the competing inserts."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-16"
    },
    "references": [
      "https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS",
      "https://www.postgresql.org/docs/current/transaction-iso.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0599",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Performance, processes & servers",
    "subtopic": "fpm-response-finish-does-not-detach-durable-background-job",
    "objective": {
      "id": "fpm-response-finish-does-not-detach-durable-background-job",
      "text": "Separate finishing an HTTP response from transferring work to a durable execution owner."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Relate FPM worker lifetime, process termination and durable handoff guarantees."
    },
    "prerequisites": [
      "PHP-FPM lifecycle (advanced)",
      "fastcgi_finish_request",
      "Durable queues",
      "Worker restarts"
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
        "A PHP-FPM endpoint must acknowledge accepted work quickly, and accepted work must remain recoverable if that FPM process is killed immediately afterward. A separate durable queue and consumer are available; enqueue acknowledgement means the task is durably stored. No database mutation must be atomically paired with the enqueue in this scenario."
      ],
      "files": []
    },
    "stem": "Which workflow provides the required recovery guarantee?",
    "options": [
      {
        "id": "finish-then-inline",
        "text": "Call fastcgi_finish_request, then perform the work in the same request process.",
        "rationale": "Finishing the client response does not detach execution or preserve work if that process is killed.",
        "misconception": "Equating response completion with durable background ownership."
      },
      {
        "id": "shutdown-callback",
        "text": "Register the work as a shutdown function, then return the acknowledgement.",
        "rationale": "The same process still owns the work, and forced termination can prevent completion or execution.",
        "misconception": "Treating shutdown callbacks as persistent job storage."
      },
      {
        "id": "durable-handoff",
        "text": "Wait for durable enqueue acknowledgement, return the HTTP acknowledgement, and let the separate consumer perform the task.",
        "rationale": "The task survives loss of the FPM process because ownership has moved to durable storage before acceptance is reported.",
        "misconception": null
      },
      {
        "id": "fiber-after-response",
        "text": "Start a Fiber after finishing the response so it survives independently of the FPM request.",
        "rationale": "A Fiber belongs to the same process and does not survive its termination.",
        "misconception": "Treating cooperative execution contexts as independent durable processes."
      }
    ],
    "correctOptionId": "durable-handoff",
    "explanation": {
      "summary": "fastcgi_finish_request closes the response path while PHP code can continue in the same worker. It does not create durable task ownership. The specified queue provides that ownership only after its durable acknowledgement.",
      "trace": "The queue stores the task, then the endpoint acknowledges acceptance. Killing FPM afterward does not erase the queued task."
    },
    "validation": {
      "kind": "document-review",
      "rule": "FPM response finishing does not detach the PHP process; the stated durable queue acknowledgement is the recoverable handoff boundary.",
      "optionAudit": {
        "finish-then-inline": "Work dies with the process.",
        "shutdown-callback": "No durable recovery owner.",
        "durable-handoff": "Persistence precedes acceptance.",
        "fiber-after-response": "Fiber dies with its process."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://www.php.net/manual/en/function.fastcgi-finish-request.php",
      "https://www.php.net/manual/en/language.fibers.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0600",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Validation & web security",
    "subtopic": "webhook-mac-authenticates-exact-raw-body-before-parsing",
    "objective": {
      "id": "webhook-mac-authenticates-exact-raw-body-before-parsing",
      "text": "Place webhook authentication before body transformations when the sender signs the exact request bytes."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine stream ownership, authenticated byte identity and parser boundaries without substituting semantic JSON equivalence."
    },
    "prerequisites": [
      "HMAC input bytes (advanced)",
      "Raw HTTP body",
      "JSON representation differences",
      "Constant-time verification",
      "Bounded reads"
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
        "The trusted provider signs the exact raw body bytes using HMAC-SHA256 and a shared secret. A reviewed verifier already validates signature encoding and compares MACs safely. The body is bounded by an enforced size limit. Middleware can read and retain the original bytes once. The provider does not define JSON canonicalization; whitespace and member order can vary. Replay handling is a separate completed layer."
      ],
      "files": []
    },
    "stem": "Which pipeline preserves the provider’s authentication contract before dispatching parsed data?",
    "options": [
      {
        "id": "canonicalize-first",
        "text": "Decode JSON, sort its members, re-encode compactly, then verify that text before dispatch.",
        "rationale": "Semantically equivalent JSON can have different bytes, so this verifies a message the provider did not sign.",
        "misconception": "Assuming semantic normalization is part of an unspecified signing protocol."
      },
      {
        "id": "verify-original",
        "text": "Retain the bounded original bytes, verify their MAC, then parse and dispatch only after verification succeeds.",
        "rationale": "The verifier receives exactly the signed byte sequence, and unverified parsed data cannot reach dispatch.",
        "misconception": null
      },
      {
        "id": "normalize-lines",
        "text": "Normalize line endings and trim surrounding whitespace before verifying and parsing.",
        "rationale": "Those transformations can change signed bytes even when JSON meaning remains the same.",
        "misconception": "Treating transport-looking whitespace as outside the authenticated message."
      },
      {
        "id": "verify-fields",
        "text": "Decode JSON and verify a serialization of the fields used by the handler.",
        "rationale": "The provider signs the full raw body, not the handler’s selected field projection or PHP serialization.",
        "misconception": "Replacing the protocol’s authenticated message with an application-specific subset."
      }
    ],
    "correctOptionId": "verify-original",
    "explanation": {
      "summary": "A MAC authenticates bytes, not an abstract JSON value. The exact original body must reach the verifier before any transformation; successful verification then permits parsing and dispatch.",
      "trace": "Whitespace or member-order differences remain part of the retained byte string. The verifier checks that exact string; only a verified body becomes application data."
    },
    "validation": {
      "kind": "document-review",
      "rule": "The explicitly stated webhook protocol signs raw body bytes; transformation or projection changes the authenticated message.",
      "optionAudit": {
        "canonicalize-first": "Introduces an undefined canonicalization protocol.",
        "verify-original": "Preserves exact authenticated bytes and dispatch order.",
        "normalize-lines": "Changes potentially signed bytes.",
        "verify-fields": "Authenticates a different message representation."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 6
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries",
      "https://www.php.net/manual/en/function.hash-hmac.php"
    ]
  }
];
