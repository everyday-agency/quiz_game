// Accepted for local independent review only. Production activation is not authorized.
export default [
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0401",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "nested-positional-destructuring-skip",
    "objective": {
      "id": "nested-positional-destructuring-skip",
      "text": "Trace skipped positions and nested targets in positional array destructuring."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Follow the structure of a short array without treating omitted targets as removals."
    },
    "prerequisites": [
      "Array destructuring",
      "Nested arrays",
      "Positional indexes"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$row = ['Ada', 'ignored', [4, 9]];\n[$name, , [, $score]] = $row;\n\necho json_encode([$name, $score, $row]);\n"
        }
      ]
    },
    "stem": "Which JSON array contains the assigned variables followed by the source?",
    "options": [
      {
        "id": "first-nested",
        "text": "[\"Ada\",4,[\"Ada\",\"ignored\",[4,9]]]",
        "rationale": "The inner omitted target skips index 0, so score is not 4.",
        "misconception": "Ignoring a skipped position inside nested destructuring."
      },
      {
        "id": "second-nested",
        "text": "[\"Ada\",9,[\"Ada\",\"ignored\",[4,9]]]",
        "rationale": "The outer skip bypasses ignored, and the inner skip selects 9 without modifying row.",
        "misconception": null
      },
      {
        "id": "removed-source",
        "text": "[\"Ada\",9,[\"Ada\",[9]]]",
        "rationale": "Destructuring reads the source; omitted targets do not remove source entries.",
        "misconception": "Treating skipped assignment targets as deletion operations."
      },
      {
        "id": "whole-nested",
        "text": "[\"Ada\",[4,9],[\"Ada\",\"ignored\",[4,9]]]",
        "rationale": "The nested target extracts one inner value rather than assigning the whole inner array.",
        "misconception": "Flattening the target structure into one ordinary variable."
      }
    ],
    "correctOptionId": "second-nested",
    "explanation": {
      "summary": "Each destructuring level has its own positional indexes. An empty target advances to the next position, and assignment leaves the source array intact.",
      "trace": "name reads row[0]. The nested target reads row[2][1], which is 9."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"Ada\",9,[\"Ada\",\"ignored\",[4,9]]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
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
    "id": "PHP-E26-0402",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Control flow & pattern matching",
    "subtopic": "for-update-expression-after-continue",
    "objective": {
      "id": "for-update-expression-after-continue",
      "text": "Trace a for loop’s update expression after continue skips the remaining body."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate the loop body from the update phase that still runs before the next condition."
    },
    "prerequisites": [
      "for loops",
      "continue",
      "Compound assignment"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfor ($step = 0; $step < 3; $step++, print('u')) {\n    if ($step === 1) {\n        continue;\n    }\n\n    echo $step;\n}\n"
        }
      ]
    },
    "stem": "What text is printed by this loop, including the update expression’s marker?",
    "options": [
      {
        "id": "body-only",
        "text": "02",
        "rationale": "The update phase explicitly prints u after every completed or continued iteration.",
        "misconception": "Ignoring side effects in the for loop update expression."
      },
      {
        "id": "skip-update",
        "text": "0u2u",
        "rationale": "continue skips the remainder of the body, not the for loop update expression.",
        "misconception": "Treating continue as a jump directly to the condition without the update phase."
      },
      {
        "id": "full-body",
        "text": "0u1u2u",
        "rationale": "The iteration with step 1 reaches continue before echo.",
        "misconception": "Treating continue as a no-op when the update still runs."
      },
      {
        "id": "with-update",
        "text": "0uu2u",
        "rationale": "The first and third bodies print 0 and 2, and all three update phases print u.",
        "misconception": null
      }
    ],
    "correctOptionId": "with-update",
    "explanation": {
      "summary": "continue in a for loop proceeds to the update expression before the condition is checked again. It skips only the rest of that iteration’s body.",
      "trace": "The trace is body 0, update u; skipped body, update u; body 2, update u."
    },
    "validation": {
      "kind": "output",
      "stdout": "0uu2u",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-06"
    },
    "references": [
      "https://www.php.net/manual/en/control-structures.for.php",
      "https://www.php.net/manual/en/control-structures.continue.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0403",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Types, casting & comparisons",
    "subtopic": "numeric-string-versus-lexical-string-order",
    "objective": {
      "id": "numeric-string-versus-lexical-string-order",
      "text": "Distinguish numeric comparison of two numeric strings from lexical comparison of nonnumeric strings."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply the comparison rule to two pairs that look similar but belong to different string categories."
    },
    "prerequisites": [
      "Numeric strings",
      "Relational operators",
      "ASCII character order"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$numeric = '10' < '2';\n$labels = '10a' < '2a';\n\necho json_encode([$numeric, $labels]);\n"
        }
      ]
    },
    "stem": "What JSON pair results from these two string comparisons?",
    "options": [
      {
        "id": "different-rules",
        "text": "[false,true]",
        "rationale": "Numeric strings compare as 10 and 2; nonnumeric strings compare lexically, starting with 1 and 2.",
        "misconception": null
      },
      {
        "id": "both-lexical",
        "text": "[true,true]",
        "rationale": "The first pair consists of numeric strings and is compared numerically.",
        "misconception": "Assuming quoted operands always force lexical comparison."
      },
      {
        "id": "both-numeric",
        "text": "[false,false]",
        "rationale": "The a suffix makes the second pair nonnumeric; the comparison does not use just their numeric prefixes.",
        "misconception": "Treating nonnumeric strings as their leading integer portions."
      },
      {
        "id": "reverse-rules",
        "text": "[true,false]",
        "rationale": "This applies the two comparison policies to the wrong pairs.",
        "misconception": "Reversing which string forms qualify for numeric comparison."
      }
    ],
    "correctOptionId": "different-rules",
    "explanation": {
      "summary": "When both strings are numeric, PHP compares their numeric values. Otherwise, this string-to-string comparison uses lexical ordering.",
      "trace": "10 is not less than 2. For 10a and 2a, the first differing bytes are 1 and 2, so the first label sorts earlier."
    },
    "validation": {
      "kind": "output",
      "stdout": "[false,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.comparison.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0404",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Variables, scope & constants",
    "subtopic": "negative-string-offset-assignment",
    "objective": {
      "id": "negative-string-offset-assignment",
      "text": "Resolve a negative string offset when reading and replacing an ASCII byte."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Count backward from the end without treating a negative index as an invalid array-style key."
    },
    "prerequisites": [
      "PHP string offsets",
      "Negative indexes",
      "ASCII bytes"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$label = 'ABCD';\n$before = $label[-2];\n$label[-1] = 'Z';\n\necho json_encode([$before, $label]);\n"
        }
      ]
    },
    "stem": "What JSON pair is printed after the string offset assignment?",
    "options": [
      {
        "id": "start-relative",
        "text": "[\"B\",\"ZBCD\"]",
        "rationale": "Negative string indexes count from the end, not from the start.",
        "misconception": "Applying a forward zero-based interpretation to a negative offset."
      },
      {
        "id": "last-twice",
        "text": "[\"D\",\"ABCZ\"]",
        "rationale": "Offset -2 selects the second-last byte C, not the last byte D.",
        "misconception": "Treating every negative offset as an alias for the last byte."
      },
      {
        "id": "from-end",
        "text": "[\"C\",\"ABCZ\"]",
        "rationale": "The read selects C and the write replaces the final byte D with Z.",
        "misconception": null
      },
      {
        "id": "append",
        "text": "[\"C\",\"ABCDZ\"]",
        "rationale": "Writing to existing offset -1 replaces its byte rather than appending another.",
        "misconception": "Confusing negative-offset assignment with string append."
      }
    ],
    "correctOptionId": "from-end",
    "explanation": {
      "summary": "PHP string offsets may be negative: -1 is the last byte, -2 the second-last. The ASCII premise makes each displayed character one byte.",
      "trace": "before receives C. Replacing label[-1] changes only D to Z."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"C\",\"ABCZ\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-02"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.string.php#language.types.string.substr"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0405",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "argument-count-versus-default-value",
    "objective": {
      "id": "argument-count-versus-default-value",
      "text": "Distinguish an omitted optional argument from an explicitly supplied default-valued argument using func_num_args."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Track supplied positional arguments independently of the parameter’s final value."
    },
    "prerequisites": [
      "Optional parameters",
      "Default values",
      "func_num_args"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction supplied(?string $label = null): int\n{\n    return func_num_args();\n}\n\necho json_encode([supplied(), supplied(null), supplied('x')]);\n"
        }
      ]
    },
    "stem": "Which JSON array records the argument counts for these three calls?",
    "options": [
      {
        "id": "non-null-only",
        "text": "[0,0,1]",
        "rationale": "An explicitly supplied null still counts as an argument.",
        "misconception": "Counting only nonnull supplied values."
      },
      {
        "id": "supplied-count",
        "text": "[0,1,1]",
        "rationale": "The first call supplies no argument; the next two each supply one.",
        "misconception": null
      },
      {
        "id": "declared-count",
        "text": "[1,1,1]",
        "rationale": "The declared parameter count is not the number of arguments actually supplied.",
        "misconception": "Treating an applied default value as an explicit call argument."
      },
      {
        "id": "nonnull-two",
        "text": "[1,0,1]",
        "rationale": "This counts an omitted default as supplied but excludes an explicit null, reversing the distinction.",
        "misconception": "Inferring argument presence from its final value instead of the call."
      }
    ],
    "correctOptionId": "supplied-count",
    "explanation": {
      "summary": "func_num_args reports how many arguments were passed to the current function. Applying a default does not add an argument to the call.",
      "trace": "The values of label are null, null and x, but the supplied counts are 0, 1 and 1."
    },
    "validation": {
      "kind": "output",
      "stdout": "[0,1,1]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.func-num-args.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0406",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "negative-array-pad-target-length",
    "objective": {
      "id": "negative-array-pad-target-length",
      "text": "Interpret array_pad’s signed target size without confusing it with a count of added entries."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Use the size magnitude for the final minimum length and its sign for the padding side."
    },
    "prerequisites": [
      "array_pad",
      "Array lengths",
      "Returned arrays"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$items = ['A', 'B'];\n$padded = array_pad($items, -4, 'x');\n\necho json_encode([$padded, $items]);\n"
        }
      ]
    },
    "stem": "What JSON pair contains the padded array and the original array?",
    "options": [
      {
        "id": "right-padding",
        "text": "[[\"A\",\"B\",\"x\",\"x\"],[\"A\",\"B\"]]",
        "rationale": "A negative target pads on the left, not the right.",
        "misconception": "Using the magnitude while ignoring the sign’s direction."
      },
      {
        "id": "four-added",
        "text": "[[\"x\",\"x\",\"x\",\"x\",\"A\",\"B\"],[\"A\",\"B\"]]",
        "rationale": "The magnitude 4 is the target length, not four additional entries.",
        "misconception": "Interpreting the size argument as a padding count."
      },
      {
        "id": "mutates-input",
        "text": "[[\"x\",\"x\",\"A\",\"B\"],[\"x\",\"x\",\"A\",\"B\"]]",
        "rationale": "array_pad returns a new array and does not modify items.",
        "misconception": "Assuming the padding operation mutates its argument."
      },
      {
        "id": "left-target",
        "text": "[[\"x\",\"x\",\"A\",\"B\"],[\"A\",\"B\"]]",
        "rationale": "Two leading x entries bring the result to length four while items stays unchanged.",
        "misconception": null
      }
    ],
    "correctOptionId": "left-target",
    "explanation": {
      "summary": "The absolute size is the minimum result length. Its negative sign chooses left padding, and the original input remains unchanged.",
      "trace": "The input has two entries, so two x entries are added before A and B."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[\"x\",\"x\",\"A\",\"B\"],[\"A\",\"B\"]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-pad.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0407",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "string-repeat-count-not-target-width",
    "objective": {
      "id": "string-repeat-count-not-target-width",
      "text": "Interpret str_repeat’s count as repetitions of the entire input string."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish a repetition count from a desired result width and include the zero-repetition case."
    },
    "prerequisites": [
      "str_repeat",
      "Byte-string length",
      "ASCII text"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$text = str_repeat('ab', 3);\n$empty = str_repeat('ab', 0);\n\necho json_encode([$text, $empty, strlen($text)]);\n"
        }
      ]
    },
    "stem": "What JSON shows the repeated text, the zero-count result and the repeated text’s length?",
    "options": [
      {
        "id": "whole-repetitions",
        "text": "[\"ababab\",\"\",6]",
        "rationale": "Three copies of the two-byte input produce six bytes; zero copies produce an empty string.",
        "misconception": null
      },
      {
        "id": "target-width",
        "text": "[\"aba\",\"\",3]",
        "rationale": "The second argument counts copies, not the desired byte length.",
        "misconception": "Confusing repetition with padding to a target width."
      },
      {
        "id": "each-character",
        "text": "[\"aaabbb\",\"\",6]",
        "rationale": "str_repeat repeats the entire string, not each character in a separate group.",
        "misconception": "Applying the count independently to each character position."
      },
      {
        "id": "zero-keeps-input",
        "text": "[\"ababab\",\"ab\",6]",
        "rationale": "Zero repetitions produce no copies; they do not preserve one input copy.",
        "misconception": "Treating zero as a request to leave the source unchanged."
      }
    ],
    "correctOptionId": "whole-repetitions",
    "explanation": {
      "summary": "str_repeat concatenates the whole input string the requested number of times. It returns a new string, including the empty string when the count is zero.",
      "trace": "ab + ab + ab is ababab. Each ASCII copy has two bytes, giving a length of six."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"ababab\",\"\",6]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.str-repeat.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0408",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "array-chunk-preserved-inner-keys",
    "objective": {
      "id": "array-chunk-preserved-inner-keys",
      "text": "Trace chunk grouping separately from preservation of the source keys within each chunk."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Follow a sparse numeric-keyed array through array_chunk with preserve_keys enabled."
    },
    "prerequisites": [
      "array_chunk",
      "Numeric keys",
      "JSON object versus list encoding"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$items = [2 => 'A', 5 => 'B', 9 => 'C'];\n$chunks = array_chunk($items, 2, true);\n\necho json_encode($chunks);\n"
        }
      ]
    },
    "stem": "Which JSON value is emitted for these two-entry chunks?",
    "options": [
      {
        "id": "reindexed",
        "text": "[[\"A\",\"B\"],[\"C\"]]",
        "rationale": "The true argument preserves the source keys inside each chunk.",
        "misconception": "Assuming chunking always reindexes each group."
      },
      {
        "id": "keys-outside",
        "text": "{\"2\":[\"A\",\"B\"],\"9\":[\"C\"]}",
        "rationale": "The outer chunks are a list; source keys are retained within the chunks.",
        "misconception": "Applying preserve_keys to the outer chunk indexes instead of the entries."
      },
      {
        "id": "inner-preserved",
        "text": "[{\"2\":\"A\",\"5\":\"B\"},{\"9\":\"C\"}]",
        "rationale": "The outer result is a list of two chunks, each retaining its original sparse keys.",
        "misconception": null
      },
      {
        "id": "three-groups",
        "text": "[{\"2\":\"A\"},{\"5\":\"B\"},{\"9\":\"C\"}]",
        "rationale": "The size 2 groups two entries per full chunk, regardless of gaps between their keys.",
        "misconception": "Treating key gaps as boundaries that split chunks."
      }
    ],
    "correctOptionId": "inner-preserved",
    "explanation": {
      "summary": "array_chunk counts entries, not key ranges. preserve_keys retains their original keys inside each new chunk, while the outer chunk array uses consecutive indexes.",
      "trace": "A and B form the first chunk; C forms the final partial chunk. Sparse numeric keys make each inner chunk encode as a JSON object."
    },
    "validation": {
      "kind": "output",
      "stdout": "[{\"2\":\"A\",\"5\":\"B\"},{\"9\":\"C\"}]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-chunk.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0409",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Files & structured data",
    "subtopic": "csv-enclosure-doubling-and-embedded-delimiter",
    "objective": {
      "id": "csv-enclosure-doubling-and-embedded-delimiter",
      "text": "Parse a CSV field containing a doubled enclosure and an embedded delimiter."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Apply CSV enclosure rules instead of splitting the raw text at every comma."
    },
    "prerequisites": [
      "CSV enclosures",
      "Doubled quote escaping",
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
          "source": "<?php\n\n$record = '7,\"a,\"\"b\"\"\",x';\n$fields = str_getcsv($record, ',', '\"', '');\n\necho json_encode($fields);\n"
        }
      ]
    },
    "stem": "What JSON list is produced from this CSV record? The proprietary escape parameter is explicitly disabled.",
    "options": [
      {
        "id": "split-comma",
        "text": "[\"7\",\"a\",\"b\",\"x\"]",
        "rationale": "The comma inside the quoted field is data, not a field boundary.",
        "misconception": "Splitting a CSV record without maintaining enclosure state."
      },
      {
        "id": "quotes-removed",
        "text": "[\"7\",\"a,b\",\"x\"]",
        "rationale": "Doubled enclosure characters represent literal quotes in the field; they are not all discarded.",
        "misconception": "Treating every quote byte as framing syntax."
      },
      {
        "id": "extra-quotes",
        "text": "[\"7\",\"a,\\\"\\\"b\\\"\\\"\",\"x\"]",
        "rationale": "Each doubled quote pair becomes one quote character, not two.",
        "misconception": "Retaining the escape representation instead of decoding the field value."
      },
      {
        "id": "csv-decoded",
        "text": "[\"7\",\"a,\\\"b\\\"\",\"x\"]",
        "rationale": "The middle field contains a comma and one literal quote on each side of b.",
        "misconception": null
      }
    ],
    "correctOptionId": "csv-decoded",
    "explanation": {
      "summary": "A delimiter inside an enclosed CSV field remains part of that field. Two adjacent enclosure characters inside it decode to one literal enclosure character.",
      "trace": "The three fields are 7, the text a,\"b\", and x. JSON escapes the literal quotes in its own representation."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"7\",\"a,\\\"b\\\"\",\"x\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
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
    "id": "PHP-E26-0410",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "regex-split-capture-delimiters-empty-fields",
    "objective": {
      "id": "regex-split-capture-delimiters-empty-fields",
      "text": "Trace captured delimiters separately from empty split fields in preg_split."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine the delimiter-capture and no-empty flags without dropping meaningful separators."
    },
    "prerequisites": [
      "PCRE capturing groups",
      "preg_split flags",
      "Empty fields"
    ],
    "runtime": {
      "php": [
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
        "The pattern has one capturing group around either delimiter. The flags apply to preg_split’s result entries."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$parts = preg_split('/([,;])/', 'a,,b;', -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);\n\necho json_encode($parts);\n"
        }
      ]
    },
    "stem": "Which JSON list remains when delimiter capture and empty-field removal are both enabled?",
    "options": [
      {
        "id": "only-fields",
        "text": "[\"a\",\"b\"]",
        "rationale": "Delimiter capture retains the matched separators as nonempty result entries.",
        "misconception": "Assuming NO_EMPTY also removes captured delimiter text."
      },
      {
        "id": "with-separators",
        "text": "[\"a\",\",\",\",\",\"b\",\";\"]",
        "rationale": "The empty field between commas and the trailing empty field are omitted, while every captured delimiter remains.",
        "misconception": null
      },
      {
        "id": "empty-kept",
        "text": "[\"a\",\",\",\"\",\",\",\"b\",\";\",\"\"]",
        "rationale": "The NO_EMPTY flag removes the two empty result strings.",
        "misconception": "Applying delimiter capture while ignoring empty-field filtering."
      },
      {
        "id": "merged-delimiter",
        "text": "[\"a\",\",,\",\"b\",\";\"]",
        "rationale": "The pattern matches one delimiter at a time, so the commas are separate captures.",
        "misconception": "Treating adjacent single-character matches as one combined delimiter."
      }
    ],
    "correctOptionId": "with-separators",
    "explanation": {
      "summary": "PREG_SPLIT_DELIM_CAPTURE includes each captured separator. PREG_SPLIT_NO_EMPTY removes empty strings, not the nonempty separator strings.",
      "trace": "The two commas are two matches. Their intervening empty field is removed, as is the empty field after the final semicolon."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"a\",\",\",\",\",\"b\",\";\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.preg-split.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0411",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Closures, callbacks & callables",
    "subtopic": "array-filter-both-value-key-argument-order",
    "objective": {
      "id": "array-filter-both-value-key-argument-order",
      "text": "Trace value and key arguments in an ARRAY_FILTER_USE_BOTH predicate while retaining source keys."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Apply the callback argument order and comparison to a map whose values differ from its keys."
    },
    "prerequisites": [
      "array_filter",
      "ARRAY_FILTER_USE_BOTH",
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
          "source": "<?php\n\n$values = [3 => 2, 1 => 4, 2 => 2];\n$selected = array_filter(\n    $values,\n    static fn (int $value, int $key): bool => $key < $value,\n    ARRAY_FILTER_USE_BOTH\n);\n\necho json_encode($selected);\n"
        }
      ]
    },
    "stem": "What JSON object survives this key/value predicate?",
    "options": [
      {
        "id": "reversed",
        "text": "{\"3\":2}",
        "rationale": "The callback receives the value first and key second, so key 3 is not less than value 2.",
        "misconception": "Reversing the callback’s value and key parameters."
      },
      {
        "id": "non-strict",
        "text": "{\"1\":4,\"2\":2}",
        "rationale": "The condition is strict less-than, so the equal key/value pair is excluded.",
        "misconception": "Reading a strict inequality as less-than-or-equal."
      },
      {
        "id": "key-preserved",
        "text": "{\"1\":4}",
        "rationale": "Only key 1 is less than its value 4, and array_filter preserves that key.",
        "misconception": null
      },
      {
        "id": "reindexed",
        "text": "[4]",
        "rationale": "The retained value is correct, but array_filter does not reindex the result.",
        "misconception": "Assuming filtering automatically produces a zero-based list."
      }
    ],
    "correctOptionId": "key-preserved",
    "explanation": {
      "summary": "With ARRAY_FILTER_USE_BOTH, the callback receives value then key. A true result retains the original entry with its key unchanged.",
      "trace": "The comparisons are 3 < 2, 1 < 4 and 2 < 2. Only the middle comparison succeeds."
    },
    "validation": {
      "kind": "output",
      "stdout": "{\"1\":4}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-filter.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0412",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "stable-usort-equal-comparator-results",
    "objective": {
      "id": "stable-usort-equal-comparator-results",
      "text": "Predict retained input order for elements that a PHP 8 sort comparator considers equal."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish stable tie order from an unstated secondary sort criterion."
    },
    "prerequisites": [
      "usort comparator contract",
      "PHP sorting",
      "Comparator equivalence",
      "array_column"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$rows = [\n    ['name' => 'B', 'rank' => 2],\n    ['name' => 'C', 'rank' => 1],\n    ['name' => 'A', 'rank' => 2],\n];\n\nusort($rows, static fn (array $left, array $right): int => $left['rank'] <=> $right['rank']);\n\necho json_encode(array_column($rows, 'name'));\n"
        }
      ]
    },
    "stem": "Which JSON name list results? The comparator uses rank only; no alphabetical tie-breaker is present.",
    "options": [
      {
        "id": "stable",
        "text": "[\"C\",\"B\",\"A\"]",
        "rationale": "Rank 1 sorts first, and the equal-rank B and A entries retain their input order.",
        "misconception": null
      },
      {
        "id": "alphabetic-tie",
        "text": "[\"C\",\"A\",\"B\"]",
        "rationale": "The comparator never compares names; stable sorting retains B before A.",
        "misconception": "Assuming sorting supplies an alphabetical tie-breaker automatically."
      },
      {
        "id": "descending",
        "text": "[\"B\",\"A\",\"C\"]",
        "rationale": "The comparator orders smaller ranks first, not last.",
        "misconception": "Reversing the sign convention of the spaceship comparator."
      },
      {
        "id": "unchanged",
        "text": "[\"B\",\"C\",\"A\"]",
        "rationale": "Equality of two rows does not prevent the lower-ranked row from moving before them.",
        "misconception": "Treating one equal pair as making the entire sort a no-op."
      }
    ],
    "correctOptionId": "stable",
    "explanation": {
      "summary": "PHP 8 sorting preserves the original relative order of elements that compare equal. The comparator orders C before the rank-2 group but does not reorder B and A within that group.",
      "trace": "C moves to the front. B preceded A in the original array and still precedes it afterward."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"C\",\"B\",\"A\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.usort.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0413",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "clone-hook-without-constructor-reexecution",
    "objective": {
      "id": "clone-hook-without-constructor-reexecution",
      "text": "Trace constructor and clone-hook calls while separating the original and copied scalar state."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish allocating a clone from constructing a new instance through the constructor."
    },
    "prerequisites": [
      "Object cloning",
      "__construct",
      "__clone",
      "Static counters"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Counter\n{\n    public static int $constructed = 0;\n    public static int $cloned = 0;\n    public int $value = 1;\n\n    public function __construct()\n    {\n        self::$constructed++;\n    }\n\n    public function __clone(): void\n    {\n        self::$cloned++;\n        $this->value++;\n    }\n}\n\n$original = new Counter();\n$copy = clone $original;\n\necho json_encode([Counter::$constructed, Counter::$cloned, $original->value, $copy->value]);\n"
        }
      ]
    },
    "stem": "What JSON records constructor calls, clone-hook calls, original value and copied value?",
    "options": [
      {
        "id": "constructor-again",
        "text": "[2,1,1,2]",
        "rationale": "Cloning does not invoke the constructor again.",
        "misconception": "Treating clone as a constructor call followed by a clone hook."
      },
      {
        "id": "mutates-original",
        "text": "[1,1,2,2]",
        "rationale": "The hook runs on the new clone, whose scalar property is separate from the original.",
        "misconception": "Applying __clone’s scalar mutation to the source object too."
      },
      {
        "id": "hook-on-copy",
        "text": "[1,1,1,2]",
        "rationale": "Construction runs once, the clone hook runs once on the copy, and only the copied scalar is incremented.",
        "misconception": null
      },
      {
        "id": "hook-skipped",
        "text": "[1,0,1,1]",
        "rationale": "The declared __clone hook is invoked automatically after the copy is made.",
        "misconception": "Assuming clone only copies properties without running its hook."
      }
    ],
    "correctOptionId": "hook-on-copy",
    "explanation": {
      "summary": "clone copies the object and then invokes __clone on that new object. It does not call __construct, and scalar property changes in the hook affect the clone.",
      "trace": "The new expression increments constructed. The clone operation increments cloned and changes the copy’s value from 1 to 2."
    },
    "validation": {
      "kind": "output",
      "stdout": "[1,1,1,2]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.cloning.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0414",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "sprintf-positional-reuse-and-zero-padding",
    "objective": {
      "id": "sprintf-positional-reuse-and-zero-padding",
      "text": "Resolve positional sprintf arguments independently of placeholder order and field width."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track argument reuse together with numeric padding without consuming arguments sequentially."
    },
    "prerequisites": [
      "sprintf format strings",
      "Positional placeholders",
      "Numeric field width",
      "Single-quoted PHP strings"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\necho sprintf('%2$s:%1$04d:%2$s', 7, 'Q');\n"
        }
      ]
    },
    "stem": "Which text is printed? The format is a single-quoted PHP string.",
    "options": [
      {
        "id": "positional",
        "text": "Q:0007:Q",
        "rationale": "Argument 2 supplies both string fields; argument 1 is formatted as a zero-padded width-four integer.",
        "misconception": null
      },
      {
        "id": "space-padding",
        "text": "Q:   7:Q",
        "rationale": "The 0 flag chooses zero padding rather than the default spaces.",
        "misconception": "Reading the width while ignoring its padding flag."
      },
      {
        "id": "zero-count",
        "text": "Q:00007:Q",
        "rationale": "Width four includes the digit 7; it does not request four added zeros.",
        "misconception": "Treating a minimum field width as the number of padding characters."
      },
      {
        "id": "sequential",
        "text": "7:0000:Q",
        "rationale": "Explicit positions select arguments rather than consuming them in placeholder order.",
        "misconception": "Ignoring the numbered argument selectors."
      }
    ],
    "correctOptionId": "positional",
    "explanation": {
      "summary": "The number before $ selects a value argument, and repeated selectors reuse that same value. The 04d part formats argument 1 as an integer with minimum width four and leading zeros.",
      "trace": "The two %2$s fields each read Q. The %1$04d field turns 7 into 0007."
    },
    "validation": {
      "kind": "output",
      "stdout": "Q:0007:Q",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
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
    "id": "PHP-E26-0415",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "get-object-vars-calling-scope-and-uninitialized-properties",
    "objective": {
      "id": "get-object-vars-calling-scope-and-uninitialized-properties",
      "text": "Predict property enumeration under different visibility scopes while excluding uninitialized typed properties."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine scope-sensitive accessibility with initialization state in the same object."
    },
    "prerequisites": [
      "Property visibility",
      "get_object_vars",
      "Uninitialized typed properties"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Profile\n{\n    public string $name = 'Ada';\n    private string $secret = 'token';\n    protected string $tag = 'member';\n    public int $pending;\n\n    public function visibleInside(): array\n    {\n        return array_keys(get_object_vars($this));\n    }\n}\n\n$profile = new Profile();\n\necho json_encode([array_keys(get_object_vars($profile)), $profile->visibleInside()]);\n"
        }
      ]
    },
    "stem": "Which JSON pair lists properties visible outside the object and inside its method, in declaration order?",
    "options": [
      {
        "id": "everything",
        "text": "[[\"name\",\"secret\",\"tag\",\"pending\"],[\"name\",\"secret\",\"tag\",\"pending\"]]",
        "rationale": "Visibility and uninitialized typed-property exclusion both apply to get_object_vars.",
        "misconception": "Treating it as unrestricted declaration reflection."
      },
      {
        "id": "public-plus-uninitialized",
        "text": "[[\"name\",\"pending\"],[\"name\",\"secret\",\"tag\",\"pending\"]]",
        "rationale": "The uninitialized pending property is omitted even though its declaration is public.",
        "misconception": "Treating a declared but uninitialized property as an ordinary null-valued entry."
      },
      {
        "id": "public-everywhere",
        "text": "[[\"name\"],[\"name\"]]",
        "rationale": "The method’s class scope can also access its private and protected properties.",
        "misconception": "Assuming get_object_vars always uses external public-only visibility."
      },
      {
        "id": "scope-and-state",
        "text": "[[\"name\"],[\"name\",\"secret\",\"tag\"]]",
        "rationale": "External scope sees name; class scope also sees secret and tag; neither result includes uninitialized pending.",
        "misconception": null
      }
    ],
    "correctOptionId": "scope-and-state",
    "explanation": {
      "summary": "get_object_vars returns accessible nonstatic properties according to the calling scope. Uninitialized typed properties are absent rather than represented as null.",
      "trace": "The outer call can read only name. The method can read the three initialized properties declared by Profile."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[\"name\"],[\"name\",\"secret\",\"tag\"]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/function.get-object-vars.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0416",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Files & structured data",
    "subtopic": "stream-get-contents-offset-and-resulting-cursor",
    "objective": {
      "id": "stream-get-contents-offset-and-resulting-cursor",
      "text": "Trace an explicit stream_get_contents offset and the cursor left for the next read."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish an absolute read offset from a relative skip or a nonmutating peek."
    },
    "prerequisites": [
      "Seekable streams",
      "fread",
      "stream_get_contents",
      "ftell"
    ],
    "runtime": {
      "php": [
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
        "The in-memory stream is seekable, and all displayed I/O succeeds. Offsets and lengths are byte counts."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$handle = fopen('php://memory', 'w+');\nfwrite($handle, 'abcdef');\nrewind($handle);\n\n$first = fread($handle, 2);\n$middle = stream_get_contents($handle, 2, 3);\n$position = ftell($handle);\n$rest = stream_get_contents($handle);\nfclose($handle);\n\necho json_encode([$first, $middle, $position, $rest]);\n"
        }
      ]
    },
    "stem": "What JSON records the first read, offset read, resulting position and final remainder?",
    "options": [
      {
        "id": "relative-offset",
        "text": "[\"ab\",\"f\",6,\"\"]",
        "rationale": "The offset 3 is measured from the beginning, not added to the current position 2.",
        "misconception": "Treating an absolute stream offset as a relative skip."
      },
      {
        "id": "absolute-moving",
        "text": "[\"ab\",\"de\",5,\"f\"]",
        "rationale": "The explicit offset seeks to byte 3, reads d and e, and leaves the cursor at byte 5.",
        "misconception": null
      },
      {
        "id": "nonmoving-peek",
        "text": "[\"ab\",\"de\",2,\"cdef\"]",
        "rationale": "The offset read moves the stream position; it is not a peek that restores the old cursor.",
        "misconception": "Assuming an explicitly positioned read preserves the prior stream cursor."
      },
      {
        "id": "offset-ignored",
        "text": "[\"ab\",\"cd\",4,\"ef\"]",
        "rationale": "The third argument explicitly seeks to offset 3 before reading.",
        "misconception": "Continuing at the current position while ignoring the provided offset."
      }
    ],
    "correctOptionId": "absolute-moving",
    "explanation": {
      "summary": "For this seekable stream, a nonnegative offset tells stream_get_contents where to begin. Reading then advances the actual stream cursor by the bytes consumed.",
      "trace": "The first read ends at 2. Seeking to 3 and reading two bytes ends at 5, leaving only f."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"ab\",\"de\",5,\"f\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.stream-get-contents.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0417",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Errors & exceptions",
    "subtopic": "exception-thrown-inside-catch-skips-sibling-catches",
    "objective": {
      "id": "exception-thrown-inside-catch-skips-sibling-catches",
      "text": "Trace a new exception thrown inside a catch through finally to an outer handler."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Identify which try region a catch belongs to instead of scanning every subsequent catch for a match."
    },
    "prerequisites": [
      "Nested try/catch",
      "finally",
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
          "source": "<?php\n\ntry {\n    try {\n        throw new RuntimeException('initial');\n    } catch (RuntimeException $failure) {\n        echo 'A';\n        throw new LogicException('replacement');\n    } catch (LogicException $failure) {\n        echo 'B';\n    } finally {\n        echo 'F';\n    }\n} catch (LogicException $failure) {\n    echo 'O';\n}\n"
        }
      ]
    },
    "stem": "What exact text is printed when the first catch throws a different exception?",
    "options": [
      {
        "id": "sibling-handles",
        "text": "ABF",
        "rationale": "The later sibling catch handles exceptions from the inner try body, not from the earlier catch body.",
        "misconception": "Treating catch clauses as a sequential chain that catches one another’s throws."
      },
      {
        "id": "outer-before-finally",
        "text": "AOF",
        "rationale": "The inner finally executes while the exception leaves that construct, before the outer handler runs.",
        "misconception": "Deferring finally until after an enclosing catch finishes."
      },
      {
        "id": "finally-then-outer",
        "text": "AFO",
        "rationale": "The first catch prints A, the inner finally prints F, and the outer matching catch prints O.",
        "misconception": null
      },
      {
        "id": "finally-suppresses",
        "text": "AF",
        "rationale": "This finally only prints; it does not return or throw to replace the pending exception.",
        "misconception": "Assuming finally automatically consumes a pending exception."
      }
    ],
    "correctOptionId": "finally-then-outer",
    "explanation": {
      "summary": "Sibling catch clauses belong to the same try body. A throw from one catch leaves that construct, executes its finally, and looks for a handler in an enclosing scope.",
      "trace": "RuntimeException selects the first catch. Its LogicException bypasses the sibling catch, passes through finally, and reaches the outer LogicException handler."
    },
    "validation": {
      "kind": "output",
      "stdout": "AFO",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/language.exceptions.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0418",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Includes, autoloading & paths",
    "subtopic": "class-exists-autoload-toggle-and-loaded-registry",
    "objective": {
      "id": "class-exists-autoload-toggle-and-loaded-registry",
      "text": "Trace when class_exists invokes an autoloader and when it reads the already-loaded class registry."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate a no-autoload lookup, the first loading lookup and a later cached class existence check."
    },
    "prerequisites": [
      "Autoload registration",
      "class_exists second argument",
      "Loaded class definitions"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$loads = 0;\n\nspl_autoload_register(function (string $class) use (&$loads): void {\n    $loads++;\n\n    if ($class === 'DeferredThing') {\n        require __DIR__ . '/thing.php';\n    }\n});\n\n$before = class_exists('DeferredThing', false);\n$loaded = class_exists('DeferredThing', true);\n$after = class_exists('DeferredThing', false);\n\necho json_encode([$before, $loaded, $after, $loads]);\n"
        },
        {
          "path": "thing.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass DeferredThing\n{\n}\n"
        }
      ]
    },
    "stem": "What JSON contains the three existence results and the number of autoloader calls? Initially, DeferredThing is not defined.",
    "options": [
      {
        "id": "toggle-only-loading",
        "text": "[false,true,true,1]",
        "rationale": "The first lookup does not load, the second loads once, and the third finds the now-defined class.",
        "misconception": null
      },
      {
        "id": "false-forbids-existence",
        "text": "[false,true,false,1]",
        "rationale": "Disabling autoload does not hide a class that is already defined.",
        "misconception": "Treating the flag as an existence-result override."
      },
      {
        "id": "every-lookup-loads",
        "text": "[true,true,true,3]",
        "rationale": "The first call disables loading, and a defined class does not need the autoloader again.",
        "misconception": "Assuming class_exists always invokes the loader regardless of its flag and registry state."
      },
      {
        "id": "true-always-reloads",
        "text": "[false,true,true,2]",
        "rationale": "The final lookup has autoload disabled and the class already exists.",
        "misconception": "Counting a later registry lookup as a fresh load."
      }
    ],
    "correctOptionId": "toggle-only-loading",
    "explanation": {
      "summary": "The second argument controls whether an undefined class may trigger autoloading. Once the class has been loaded, class_exists can find it without calling any loader.",
      "trace": "No class exists for the first lookup. The second requires thing.php. The final lookup reads the existing definition, so loads remains one."
    },
    "validation": {
      "kind": "output",
      "stdout": "[false,true,true,1]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-09"
    },
    "references": [
      "https://www.php.net/manual/en/function.class-exists.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0419",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "PDO & database access",
    "subtopic": "sqlite-replace-delete-insert-foreign-key-cascade",
    "objective": {
      "id": "sqlite-replace-delete-insert-foreign-key-cascade",
      "text": "Trace a replacement insert’s deletion side effect through a foreign-key cascade."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish SQLite REPLACE from an in-place update when dependent rows reference the conflicting primary key."
    },
    "prerequisites": [
      "PDO SQLite",
      "INSERT OR REPLACE",
      "Foreign-key ON DELETE CASCADE",
      "Statement effects"
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
        "This fixture uses SQLite with foreign-key enforcement enabled. All setup statements succeed. The behavior asked about is SQLite-specific; it is not a general claim about every database’s upsert syntax."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n$pdo->exec('PRAGMA foreign_keys = ON');\n$pdo->exec('CREATE TABLE parents (id INTEGER PRIMARY KEY, label TEXT NOT NULL)');\n$pdo->exec('CREATE TABLE children (parent_id INTEGER REFERENCES parents(id) ON DELETE CASCADE)');\n$pdo->exec(\"INSERT INTO parents VALUES (1, 'old')\");\n$pdo->exec('INSERT INTO children VALUES (1)');\n\n$pdo->exec(\"INSERT OR REPLACE INTO parents VALUES (1, 'new')\");\n\n$parents = (int) $pdo->query('SELECT COUNT(*) FROM parents')->fetchColumn();\n$children = (int) $pdo->query('SELECT COUNT(*) FROM children')->fetchColumn();\n$label = $pdo->query('SELECT label FROM parents WHERE id = 1')->fetchColumn();\n\necho json_encode([$parents, $children, $label]);\n"
        }
      ]
    },
    "stem": "What JSON contains the remaining parent count, child count and parent label after the replacement?",
    "options": [
      {
        "id": "update-like",
        "text": "[1,1,\"new\"]",
        "rationale": "REPLACE deletes the conflicting row before inserting, so the cascade removes its child.",
        "misconception": "Treating replacement as an in-place update that preserves dependent rows."
      },
      {
        "id": "old-retained",
        "text": "[1,1,\"old\"]",
        "rationale": "The conflict policy is REPLACE rather than IGNORE; the parent is replaced.",
        "misconception": "Confusing conflict-ignore behavior with replacement."
      },
      {
        "id": "parent-deleted",
        "text": "[0,0,false]",
        "rationale": "The conflicting parent is deleted, but the new parent row is then inserted successfully.",
        "misconception": "Tracing only the deletion phase of the replacement."
      },
      {
        "id": "cascade",
        "text": "[1,0,\"new\"]",
        "rationale": "Deleting the old parent cascades to its child, and inserting the new parent does not recreate that child.",
        "misconception": null
      }
    ],
    "correctOptionId": "cascade",
    "explanation": {
      "summary": "SQLite REPLACE resolves this primary-key conflict by deleting the existing row and inserting the supplied row. The deletion’s foreign-key cascade is real even though a parent with the same ID exists again afterward.",
      "trace": "The child disappears when old parent 1 is deleted. The subsequent new parent 1 has label new and no child rows."
    },
    "validation": {
      "kind": "output",
      "stdout": "[1,0,\"new\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.sqlite.org/lang_conflict.html",
      "https://www.sqlite.org/foreignkeys.html#fk_actions"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0420",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "asymmetric-set-visibility-child-partial-update",
    "objective": {
      "id": "asymmetric-set-visibility-child-partial-update",
      "text": "Trace a child method’s writes through protected(set) and private(set) properties without assuming rollback on Error."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine asymmetric visibility, inheritance scope and side effects preceding a failed write."
    },
    "prerequisites": [
      "PHP 8.4 asymmetric visibility",
      "Inheritance scope",
      "Error handling",
      "Sequential mutation"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Record\n{\n    public protected(set) string $label = 'old';\n    public private(set) string $token = 'fixed';\n}\n\nclass EditableRecord extends Record\n{\n    public function revise(): void\n    {\n        $this->label = 'new';\n        $this->token = 'changed';\n    }\n}\n\n$record = new EditableRecord();\n$failed = false;\n\ntry {\n    $record->revise();\n} catch (Error $failure) {\n    $failed = true;\n}\n\necho json_encode([$record->label, $record->token, $failed]);\n"
        }
      ]
    },
    "stem": "What JSON shows both public property values and whether the child method raised Error?",
    "options": [
      {
        "id": "both-public",
        "text": "[\"new\",\"changed\",false]",
        "rationale": "Public reading does not imply public or child-scope writing when set visibility is narrower.",
        "misconception": "Applying the read visibility to both writes."
      },
      {
        "id": "partial-update",
        "text": "[\"new\",\"fixed\",true]",
        "rationale": "The child may write the protected(set) label but cannot write the parent’s private(set) token; the earlier mutation remains.",
        "misconception": null
      },
      {
        "id": "rollback",
        "text": "[\"old\",\"fixed\",true]",
        "rationale": "Throwing Error does not automatically undo the successful earlier label assignment.",
        "misconception": "Assuming a method call’s property updates are transactional."
      },
      {
        "id": "child-no-access",
        "text": "[\"old\",\"fixed\",false]",
        "rationale": "The child has protected-set access to label, and the later private-set write raises Error rather than being ignored.",
        "misconception": "Treating narrower setter visibility as silently skipping all child writes."
      }
    ],
    "correctOptionId": "partial-update",
    "explanation": {
      "summary": "protected(set) permits writes from the inheritance hierarchy, while private(set) restricts writes to the declaring class. The failed second assignment does not roll back the first.",
      "trace": "revise changes label to new, then fails on token. External reads remain legal because both properties are public for reading."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"new\",\"fixed\",true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.visibility.php#language.oop5.visibility-members"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0421",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Enums, attributes & reflection",
    "subtopic": "lazy-ghost-serialization-initialization-policy",
    "objective": {
      "id": "lazy-ghost-serialization-initialization-policy",
      "text": "Trace whether serialization initializes lazy ghosts under the explicit skip-initialization flag."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish creation, observation through serialization and introspection of lazy state."
    },
    "prerequisites": [
      "PHP 8.4 lazy ghosts",
      "ReflectionClass",
      "Serialization triggers",
      "Initialization policy flags"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Payload\n{\n    public int $value;\n}\n\n$reflection = new ReflectionClass(Payload::class);\n$calls = 0;\n$initialize = function (Payload $payload) use (&$calls): void {\n    $calls++;\n    $payload->value = 9;\n};\n\n$normal = $reflection->newLazyGhost($initialize);\n$skipped = $reflection->newLazyGhost(\n    $initialize,\n    ReflectionClass::SKIP_INITIALIZATION_ON_SERIALIZE\n);\n\nserialize($normal);\nserialize($skipped);\n\necho json_encode([\n    $calls,\n    $reflection->isUninitializedLazyObject($normal),\n    $reflection->isUninitializedLazyObject($skipped),\n]);\n"
        }
      ]
    },
    "stem": "What JSON records initializer calls, the normal ghost’s remaining lazy state and the flagged ghost’s remaining lazy state?",
    "options": [
      {
        "id": "neither-initializes",
        "text": "[0,true,true]",
        "rationale": "Serialization initializes the normal ghost by default.",
        "misconception": "Assuming serialization never observes lazy state."
      },
      {
        "id": "both-initialize",
        "text": "[2,false,false]",
        "rationale": "The explicit flag suppresses initialization for skipped during serialization.",
        "misconception": "Ignoring the per-object serialization policy flag."
      },
      {
        "id": "reversed-policy",
        "text": "[1,true,false]",
        "rationale": "The unflagged object initializes; the flagged one stays uninitialized, not the reverse.",
        "misconception": "Reversing the meaning of SKIP_INITIALIZATION_ON_SERIALIZE."
      },
      {
        "id": "flag-respected",
        "text": "[1,false,true]",
        "rationale": "Only normal invokes the initializer; the flagged object remains lazy after serialization.",
        "misconception": null
      }
    ],
    "correctOptionId": "flag-respected",
    "explanation": {
      "summary": "Serializing a lazy ghost normally triggers initialization. SKIP_INITIALIZATION_ON_SERIALIZE changes that behavior for the flagged object, and the reflection state query does not itself initialize it.",
      "trace": "Both objects are created lazily without calling the initializer. Serializing normal increments calls once. Serializing skipped leaves its lazy state intact."
    },
    "validation": {
      "kind": "output",
      "stdout": "[1,false,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/reflectionclass.newlazyghost.php",
      "https://www.php.net/manual/en/reflectionclass.isuninitializedlazyobject.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0422",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Iterators, generators & fibers",
    "subtopic": "fiber-throw-termination-without-return-value",
    "objective": {
      "id": "fiber-throw-termination-without-return-value",
      "text": "Distinguish Fiber termination caused by an exception from normal completion with a return value."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace suspension, exception propagation to resume and the later availability of getReturn."
    },
    "prerequisites": [
      "Fibers",
      "Suspension and resumption",
      "FiberError",
      "Exceptional completion"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$fiber = new Fiber(function (): string {\n    Fiber::suspend('pause');\n\n    throw new RuntimeException('boom');\n});\n\n$trace = [$fiber->start()];\n\ntry {\n    $fiber->resume();\n} catch (RuntimeException $failure) {\n    $trace[] = $failure->getMessage();\n}\n\n$trace[] = $fiber->isTerminated();\n$trace[] = $fiber->isSuspended();\n\ntry {\n    $trace[] = $fiber->getReturn();\n} catch (FiberError $failure) {\n    $trace[] = 'no-return';\n}\n\necho json_encode($trace);\n"
        }
      ]
    },
    "stem": "What JSON trace is printed when the resumed Fiber throws before returning?",
    "options": [
      {
        "id": "exceptional-end",
        "text": "[\"pause\",\"boom\",true,false,\"no-return\"]",
        "rationale": "The exception escapes resume, terminates the Fiber, and leaves no normal return value for getReturn.",
        "misconception": null
      },
      {
        "id": "still-suspended",
        "text": "[\"pause\",\"boom\",false,true,\"no-return\"]",
        "rationale": "A Fiber that exits by throwing is terminated rather than left suspended at its old yield point.",
        "misconception": "Treating a failed resume as preserving the prior suspension state."
      },
      {
        "id": "exception-as-result",
        "text": "[\"pause\",\"boom\",true,false,\"boom\"]",
        "rationale": "The exception message is not converted into the Fiber’s return value.",
        "misconception": "Treating exceptional completion as a normal return carrying the message."
      },
      {
        "id": "null-return",
        "text": "[\"pause\",\"boom\",true,false,null]",
        "rationale": "getReturn raises FiberError after exceptional completion instead of supplying an implicit null result.",
        "misconception": "Assuming every terminated Fiber has a normal return value."
      }
    ],
    "correctOptionId": "exceptional-end",
    "explanation": {
      "summary": "A thrown exception propagates to the code that starts or resumes the Fiber. The Fiber is then terminated, but getReturn is reserved for a Fiber that returned normally.",
      "trace": "start yields pause. resume encounters boom. The Fiber reports terminated and not suspended; getReturn fails and adds no-return to the trace."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"pause\",\"boom\",true,false,\"no-return\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/fiber.resume.php",
      "https://www.php.net/manual/en/fiber.getreturn.php",
      "https://www.php.net/manual/en/fiber.isterminated.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0423",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "contravariant-implementation-runtime-parameter-check",
    "objective": {
      "id": "contravariant-implementation-runtime-parameter-check",
      "text": "Identify the concrete method signature used for runtime argument checking through an interface-typed variable."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Separate a compatible widened implementation from the narrower static interface contract at the call site."
    },
    "prerequisites": [
      "Parameter contravariance (advanced)",
      "Interfaces",
      "Union types",
      "strict_types",
      "Runtime versus static checking"
    ],
    "runtime": {
      "php": [
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
        "The question asks about executing PHP, not whether a static analyzer would accept the call against the interface’s declared contract."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\ndeclare(strict_types=1);\n\ninterface Consumer\n{\n    public function consume(int $value): string;\n}\n\nclass FlexibleConsumer implements Consumer\n{\n    public function consume(int|string $value): string\n    {\n        return get_debug_type($value) . ':' . $value;\n    }\n}\n\nfunction deliver(Consumer $consumer): string\n{\n    return $consumer->consume('7');\n}\n\necho deliver(new FlexibleConsumer());\n"
        }
      ]
    },
    "stem": "What text is printed by this strict PHP file?",
    "options": [
      {
        "id": "interface-coercion",
        "text": "int:7",
        "rationale": "The actual method accepts string directly, and strict mode does not require coercing it through the interface’s int declaration.",
        "misconception": "Applying the interface parameter as a separate runtime conversion layer."
      },
      {
        "id": "interface-typeerror",
        "text": "TypeError before consume executes",
        "rationale": "Runtime dispatch checks the concrete method’s compatible int|string parameter, which accepts this string.",
        "misconception": "Treating the variable’s interface type as the invoked method’s sole runtime signature."
      },
      {
        "id": "concrete-union",
        "text": "string:7",
        "rationale": "The implementation may widen its accepted parameter type, and its concrete signature accepts the string unchanged.",
        "misconception": null
      },
      {
        "id": "incompatible-declaration",
        "text": "Declaration error before deliver executes",
        "rationale": "Accepting int|string widens the input set and is a compatible contravariant implementation of consume(int).",
        "misconception": "Reversing parameter variance and rejecting a broader accepted input type."
      }
    ],
    "correctOptionId": "concrete-union",
    "explanation": {
      "summary": "PHP permits the implementation to accept a broader parameter type. Runtime dispatch uses that implementation’s signature. A static analyzer can still flag the caller for relying on behavior not promised by Consumer itself.",
      "trace": "The object is a FlexibleConsumer. Its consume method accepts string 7 as one union member and reports string:7 without coercion."
    },
    "validation": {
      "kind": "output",
      "stdout": "string:7",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.variance.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0424",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Errors & exceptions",
    "subtopic": "last-error-state-versus-handled-diagnostic",
    "objective": {
      "id": "last-error-state-versus-handled-diagnostic",
      "text": "Trace the last-error record separately from suppressed display and a custom handler’s observations."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track two diagnostic channels and explicit state clearing instead of treating error_get_last as an event log."
    },
    "prerequisites": [
      "Error suppression mask",
      "Custom error handlers",
      "error_get_last",
      "error_clear_last"
    ],
    "runtime": {
      "php": [
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
        "The @ operator is used only to keep this diagnostic experiment’s first warning off the output stream. It does not represent the recommended application error-handling policy."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nerror_clear_last();\n@trigger_error('first', E_USER_WARNING);\n$first = error_get_last()['message'];\n$handled = 0;\n\nset_error_handler(function (int $severity, string $message) use (&$handled): bool {\n    $handled++;\n\n    return true;\n});\n\ntrigger_error('second', E_USER_WARNING);\n$afterHandler = error_get_last()['message'];\nrestore_error_handler();\nerror_clear_last();\n\necho json_encode([$first, $afterHandler, $handled, error_get_last() === null]);\n"
        }
      ]
    },
    "stem": "What JSON contains the first recorded message, the later recorded message, handler calls and the cleared-state check?",
    "options": [
      {
        "id": "handled-replaces",
        "text": "[\"first\",\"second\",1,true]",
        "rationale": "The custom handler returns true, so the second diagnostic does not replace the default last-error record.",
        "misconception": "Assuming error_get_last records every error observed by a custom handler."
      },
      {
        "id": "separate-channels",
        "text": "[\"first\",\"first\",1,true]",
        "rationale": "Suppression leaves the first record available; the handled second warning does not replace it; clearing removes it.",
        "misconception": null
      },
      {
        "id": "suppression-erases",
        "text": "[null,\"second\",1,true]",
        "rationale": "Suppressing display does not prevent the first last-error record, and the handled second event does not replace it.",
        "misconception": "Equating suppression with forgetting a diagnostic and handling with recording it globally."
      },
      {
        "id": "handler-not-called",
        "text": "[\"first\",\"first\",0,true]",
        "rationale": "The second warning is in the registered handler’s mask, so the handler runs once.",
        "misconception": "Assuming the earlier @ operator suppresses a later independent diagnostic."
      }
    ],
    "correctOptionId": "separate-channels",
    "explanation": {
      "summary": "error_get_last reflects the default last-error state, not a complete history of handler invocations. Suppressing the first warning’s display still leaves its record; a successfully handled second warning leaves that record unchanged.",
      "trace": "The first warning records first. The handler counts second and returns true. error_clear_last then makes the final query return null."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"first\",\"first\",1,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/function.error-get-last.php",
      "https://www.php.net/manual/en/function.set-error-handler.php",
      "https://www.php.net/manual/en/function.error-clear-last.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0425",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "weakmap-iteration-key-strong-local-reference",
    "objective": {
      "id": "weakmap-iteration-key-strong-local-reference",
      "text": "Trace object reachability created by the key variable during WeakMap iteration."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish the map’s weak references from the ordinary strong reference returned into a loop variable."
    },
    "prerequisites": [
      "WeakMap",
      "Object reference lifetime",
      "foreach variable lifetime",
      "Reference counting"
    ],
    "runtime": {
      "php": [
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
        "The two key objects have no properties, cycles or destructors. Values are integers, and no references exist beyond the displayed variables and map entries."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$first = new stdClass();\n$second = new stdClass();\n$map = new WeakMap();\n$map[$first] = 1;\n$map[$second] = 2;\n$visited = 0;\n\nforeach ($map as $key => $value) {\n    $visited++;\n}\n\nunset($first, $second);\n$afterOwners = count($map);\nunset($key);\n$afterLoopKey = count($map);\n\necho json_encode([$visited, $afterOwners, $afterLoopKey]);\n"
        }
      ]
    },
    "stem": "What JSON contains the visited-entry count and the map sizes after the two cleanup steps?",
    "options": [
      {
        "id": "all-weak",
        "text": "[2,0,0]",
        "rationale": "The key variable is an ordinary strong object reference even though it came from a WeakMap.",
        "misconception": "Assuming values obtained from weak-key iteration remain weak references."
      },
      {
        "id": "strong-map",
        "text": "[2,2,2]",
        "rationale": "WeakMap entries do not themselves keep the key objects alive.",
        "misconception": "Treating WeakMap like a strong object-key registry."
      },
      {
        "id": "loop-retains-all",
        "text": "[2,2,0]",
        "rationale": "The loop variable holds only the last key, not every key previously assigned to it.",
        "misconception": "Treating one reused iteration variable as a collection of all visited objects."
      },
      {
        "id": "last-key-retained",
        "text": "[2,1,0]",
        "rationale": "After the original variables are unset, the final loop key keeps one entry alive; unsetting it releases the last key.",
        "misconception": null
      }
    ],
    "correctOptionId": "last-key-retained",
    "explanation": {
      "summary": "WeakMap does not keep its keys alive, but reading a key into a normal PHP variable creates an ordinary reference to that object. A foreach variable remains assigned after the loop.",
      "trace": "Two entries are visited. Removing first and second leaves only the last object reachable through key. Removing key then lets the final entry disappear."
    },
    "validation": {
      "kind": "output",
      "stdout": "[2,1,0]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/class.weakmap.php",
      "https://www.php.net/manual/en/control-structures.foreach.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0426",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "trim-boundary-spaces-preserve-internal-content",
    "objective": {
      "id": "trim-boundary-spaces-preserve-internal-content",
      "text": "Remove leading and trailing spaces without changing meaningful spaces inside a label."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose a boundary operation rather than an all-occurrences replacement."
    },
    "prerequisites": [
      "String replacement",
      "Leading and trailing whitespace",
      "Internal spaces"
    ],
    "runtime": {
      "php": [
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
        "Inputs contain ASCII letters and ordinary space characters only. Internal spaces, including repeated spaces, must remain unchanged."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction normalizeLabel(string $label): string\n{\n    return str_replace(' ', '', $label);\n}\n\necho json_encode([\n    normalizeLabel('  A  B  '),\n    normalizeLabel(' C'),\n    normalizeLabel('   '),\n]);\n"
        }
      ]
    },
    "stem": "normalizeLabel currently removes meaningful internal spaces. Which replacement expression satisfies all displayed examples?",
    "options": [
      {
        "id": "leading",
        "text": "ltrim($label)",
        "rationale": "The first example keeps its trailing spaces.",
        "misconception": "Removing only the leading boundary whitespace."
      },
      {
        "id": "trailing",
        "text": "rtrim($label)",
        "rationale": "The first two examples keep their leading spaces.",
        "misconception": "Removing only the trailing boundary whitespace."
      },
      {
        "id": "both-boundaries",
        "text": "trim($label)",
        "rationale": "This removes both boundary runs while preserving the two spaces between A and B.",
        "misconception": null
      },
      {
        "id": "all-spaces",
        "text": "str_replace(' ', '', $label)",
        "rationale": "This produces AB instead of A followed by two spaces and B.",
        "misconception": "Treating internal content as removable boundary whitespace."
      }
    ],
    "correctOptionId": "both-boundaries",
    "explanation": {
      "summary": "trim removes matching characters from the two ends. It does not remove spaces enclosed by nonspace characters, which are meaningful under this contract.",
      "trace": "The results are A followed by two spaces and B, then C, then the empty string."
    },
    "validation": {
      "kind": "patch",
      "marker": "str_replace(' ', '', $label)",
      "stdout": "[\"A  B\",\"C\",\"\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.trim.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0427",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Arrays & destructuring",
    "subtopic": "foreach-key-value-target-order-repair",
    "objective": {
      "id": "foreach-key-value-target-order-repair",
      "text": "Repair reversed foreach key and value targets while retaining named map entries."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Identify the two assignment roles in foreach instead of discarding keys to make the loop run."
    },
    "prerequisites": [
      "Associative arrays",
      "foreach key/value syntax",
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
          "source": "<?php\n\n$weights = ['A' => 2, 'B' => 4];\n$labels = [];\n\nforeach ($weights as $weight => $name) {\n    $labels[] = $name . ':' . $weight;\n}\n\necho json_encode($labels);\n"
        }
      ]
    },
    "stem": "The required labels are [\"A:2\",\"B:4\"], but the loop reverses each pair. Which replacement loop header fixes the result?",
    "options": [
      {
        "id": "keys-only",
        "text": "foreach (array_keys($weights) as $name => $weight)",
        "rationale": "The loop sees numeric list indexes and name strings rather than each name’s weight.",
        "misconception": "Replacing the map with its key list loses the values needed for the labels."
      },
      {
        "id": "correct-targets",
        "text": "foreach ($weights as $name => $weight)",
        "rationale": "The key is assigned to name and its associated value to weight.",
        "misconception": null
      },
      {
        "id": "values-only",
        "text": "foreach (array_values($weights) as $name => $weight)",
        "rationale": "The values remain, but name becomes a numeric index instead of A or B.",
        "misconception": "Reindexing the map to avoid a target-order error."
      },
      {
        "id": "reversed-targets",
        "text": "foreach ($weights as $weight => $name)",
        "rationale": "This preserves the original reversal and produces 2:A and 4:B.",
        "misconception": "Reading the target after the arrow as the key."
      }
    ],
    "correctOptionId": "correct-targets",
    "explanation": {
      "summary": "In foreach (array as key => value), the target before the arrow receives the key and the target after it receives the associated value.",
      "trace": "The first iteration assigns name A and weight 2; the second assigns name B and weight 4."
    },
    "validation": {
      "kind": "patch",
      "marker": "foreach ($weights as $weight => $name)",
      "stdout": "[\"A:2\",\"B:4\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
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
    "id": "PHP-E26-0428",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Control flow & pattern matching",
    "subtopic": "zero-divisor-guard-before-evaluation",
    "objective": {
      "id": "zero-divisor-guard-before-evaluation",
      "text": "Place a zero-divisor guard before the operation it must prevent."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish guarding the denominator from guarding the result or the numerator."
    },
    "prerequisites": [
      "if and return",
      "Floating-point zero",
      "Division by zero",
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
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "Amounts and units are finite floats. A zero unit count must return null; otherwise return amount divided by units, including zero when the amount is zero."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction unitAmount(float $amount, float $units): ?float\n{\n    $result = $amount / $units;\n\n    if ($units === 0.0) {\n        return null;\n    }\n\n    return $result;\n}\n\necho json_encode([unitAmount(8.0, 4.0), unitAmount(8.0, 0.0), unitAmount(0.0, 4.0)]);\n"
        }
      ]
    },
    "stem": "The current zero check runs too late. Which replacement function body meets the contract?",
    "options": [
      {
        "id": "numerator-guard",
        "text": "if ($amount === 0.0) {\n    return null;\n}\n\nreturn $amount / $units;",
        "rationale": "This checks the wrong operand, rejects a valid zero amount, and still divides by zero for the second call.",
        "misconception": "Confusing a zero result with a zero divisor."
      },
      {
        "id": "null-divisor",
        "text": "return $amount / ($units ?? 1.0);",
        "rationale": "A zero float is not null, so coalescing leaves the invalid divisor unchanged.",
        "misconception": "Using null fallback as if it also replaced numeric zero."
      },
      {
        "id": "result-fallback",
        "text": "return ($amount / $units) ?? null;",
        "rationale": "The division throws before its result could be tested for null.",
        "misconception": "Assuming coalescing catches exceptions from evaluating its left operand."
      },
      {
        "id": "guard-first",
        "text": "if ($units === 0.0) {\n    return null;\n}\n\nreturn $amount / $units;",
        "rationale": "The zero-divisor branch returns before division, while a zero amount with nonzero units remains valid.",
        "misconception": null
      }
    ],
    "correctOptionId": "guard-first",
    "explanation": {
      "summary": "A guard prevents an operation only if control reaches it before that operation. Null coalescing checks a value; it does not catch DivisionByZeroError.",
      "trace": "The calls return 2, null and 0. The second call never evaluates division."
    },
    "validation": {
      "kind": "patch",
      "marker": "$result = $amount / $units;\n\n    if ($units === 0.0) {\n        return null;\n    }\n\n    return $result;",
      "candidates": {
        "numerator-guard": "if ($amount === 0.0) {\n        return null;\n    }\n\n    return $amount / $units;",
        "null-divisor": "return $amount / ($units ?? 1.0);",
        "result-fallback": "return ($amount / $units) ?? null;",
        "guard-first": "if ($units === 0.0) {\n        return null;\n    }\n\n    return $amount / $units;"
      },
      "stdout": "[2,null,0]",
      "errors": {
        "numerator-guard": "Division by zero",
        "null-divisor": "Division by zero",
        "result-fallback": "Division by zero"
      },
      "original": {
        "stdout": "",
        "error": "Division by zero"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-06"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.arithmetic.php",
      "https://www.php.net/manual/en/class.divisionbyzeroerror.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0429",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "substring-half-open-end-to-length",
    "objective": {
      "id": "substring-half-open-end-to-length",
      "text": "Translate an exclusive end position into the length expected by substr."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish an endpoint from a byte count and test spans on strings of different lengths."
    },
    "prerequisites": [
      "substr",
      "Zero-based offsets",
      "Half-open intervals"
    ],
    "runtime": {
      "php": [
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
        "Inputs are ASCII strings. Positions satisfy 0 <= start <= end <= strlen(text). The span includes start and excludes end."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction span(string $text, int $start, int $end): string\n{\n    return substr($text, $start, $end);\n}\n\necho json_encode([\n    span('abcdef', 2, 4),\n    span('abcde', 1, 3),\n    span('abcdef', 0, 6),\n]);\n"
        }
      ]
    },
    "stem": "span currently treats end as a length. Which replacement for the third substr argument implements the required spans?",
    "options": [
      {
        "id": "difference",
        "text": "$end - $start",
        "rationale": "The difference is the number of bytes from the inclusive start to the exclusive end.",
        "misconception": null
      },
      {
        "id": "endpoint",
        "text": "$end",
        "rationale": "This reads end bytes after start instead of stopping at position end.",
        "misconception": "Passing an endpoint to an API expecting a length."
      },
      {
        "id": "inclusive-end",
        "text": "$end - $start + 1",
        "rationale": "This includes the byte at end, although the contract excludes it.",
        "misconception": "Applying an inclusive-end length formula to a half-open span."
      },
      {
        "id": "negative-difference",
        "text": "$start - $end",
        "rationale": "A negative length counts backward from the string’s end, which is a different boundary.",
        "misconception": "Assuming negating the span width tells substr where the supplied end position is."
      }
    ],
    "correctOptionId": "difference",
    "explanation": {
      "summary": "substr’s third argument is a length, not an ending offset. For a half-open span, that length is end minus start.",
      "trace": "The three lengths are 2, 2 and 6, yielding cd, bc and abcdef. The differing source lengths prevent a negative-length shortcut from coincidentally matching every case."
    },
    "validation": {
      "kind": "patch",
      "marker": "substr($text, $start, $end)",
      "candidates": {
        "difference": "substr($text, $start, $end - $start)",
        "endpoint": "substr($text, $start, $end)",
        "inclusive-end": "substr($text, $start, $end - $start + 1)",
        "negative-difference": "substr($text, $start, $start - $end)"
      },
      "stdout": "[\"cd\",\"bc\",\"abcdef\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.substr.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0430",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Cookies & sessions",
    "subtopic": "setcookie-does-not-update-current-request-cookie-input",
    "objective": {
      "id": "setcookie-does-not-update-current-request-cookie-input",
      "text": "Diagnose a current-request cookie read after successfully setting a response cookie."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate the incoming request’s cookie data from an outgoing instruction to the browser."
    },
    "prerequisites": [
      "HTTP request and response",
      "setcookie",
      "$_COOKIE"
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
        "An HTTP request arrives with theme=light. No code changes $_COOKIE directly. The handler successfully calls setcookie with name theme and value dark before output, then reads $_COOKIE[\"theme\"] in that same request. The browser has not made another request."
      ],
      "files": []
    },
    "stem": "The same-request read still returns light. Which explanation identifies the mistake in expecting dark immediately?",
    "options": [
      {
        "id": "header-flush",
        "text": "setcookie updates $_COOKIE only after the response headers are flushed, so flushing would change the same-request read.",
        "rationale": "Flushing sends the response but does not turn its Set-Cookie header into new incoming request data.",
        "misconception": "Treating header transmission as a refresh of request superglobals."
      },
      {
        "id": "request-superglobal",
        "text": "An existing cookie must be deleted in a separate response before setcookie can overwrite its value.",
        "rationale": "A matching cookie name, domain and path can be replaced directly. The current request still contains its incoming value regardless of the outgoing replacement.",
        "misconception": "Confusing replacement of a stored browser cookie with mutation of current request input."
      },
      {
        "id": "request-snapshot",
        "text": "$_COOKIE contains cookies received with this request; setcookie sends a response instruction for later browser requests.",
        "rationale": "The input and output belong to different HTTP messages, so the current request keeps its received value.",
        "misconception": null
      },
      {
        "id": "httponly-refresh",
        "text": "The cookie needs HttpOnly enabled before PHP can observe its new value during the current request.",
        "rationale": "HttpOnly concerns browser script access and does not refresh server request data.",
        "misconception": "Using a cookie security attribute as a server-side synchronization option."
      }
    ],
    "correctOptionId": "request-snapshot",
    "explanation": {
      "summary": "setcookie schedules a response header. The current $_COOKIE array represents the Cookie header received earlier; the application should use its selected value directly when rendering this response.",
      "trace": "This request received light. A later eligible browser request can send dark after the browser processes the response cookie."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP documents that a cookie set by setcookie becomes available in the cookie input on a subsequent page load, not by mutating the current request superglobal.",
      "optionAudit": {
        "header-flush": "Sending outgoing headers does not recreate incoming input.",
        "request-superglobal": "A separate deletion response is not required; it would not update the current request either.",
        "request-snapshot": "Correctly separates incoming and outgoing HTTP state.",
        "httponly-refresh": "The security attribute does not change request timing."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-13"
    },
    "references": [
      "https://www.php.net/manual/en/function.setcookie.php",
      "https://www.php.net/manual/en/reserved.variables.cookies.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0431",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Cookies & sessions",
    "subtopic": "session-mutation-after-write-close-not-persisted",
    "objective": {
      "id": "session-mutation-after-write-close-not-persisted",
      "text": "Persist a session update before closing its active write lifecycle."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish the still-readable SESSION array from an active session whose later changes will be written."
    },
    "prerequisites": [
      "Session lifecycle",
      "session_write_close",
      "session_abort",
      "Session storage reload"
    ],
    "runtime": {
      "php": [
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
        "The files session handler stores data only in the fixture directory. Cookies and cache headers are disabled for this CLI demonstration. All storage operations succeed, and no concurrent requests exist. The final reopen verifies persisted state."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nsession_start([\n    'save_path' => __DIR__,\n    'use_cookies' => false,\n    'cache_limiter' => '',\n]);\n$_SESSION['count'] = 0;\nsession_write_close();\nsession_start();\n\n// Update to replace:\nsession_write_close();\n$_SESSION['count'] = 1;\n\n// Verify a fresh load from storage:\nsession_start();\n$persisted = $_SESSION['count'];\nsession_write_close();\n\necho $persisted;\n"
        }
      ]
    },
    "stem": "The final reload prints 0 instead of 1. Which replacement for the marked two-line update persists the change before closing?",
    "options": [
      {
        "id": "abort-update",
        "text": "$_SESSION['count'] = 1;\nsession_abort();",
        "rationale": "Aborting discards the active session’s changes, so storage still contains 0.",
        "misconception": "Using the discard-and-close operation as if it committed changes."
      },
      {
        "id": "close-twice",
        "text": "session_write_close();\n$_SESSION['count'] = 1;\nsession_write_close();",
        "rationale": "The second close has no active session to write; the local array mutation remains unpersisted.",
        "misconception": "Assuming another write-close call reactivates a closed session."
      },
      {
        "id": "write-before-close",
        "text": "$_SESSION['count'] = 1;\nsession_write_close();",
        "rationale": "The change is made while the session is active, so closing writes the new value.",
        "misconception": null
      },
      {
        "id": "reload-after-change",
        "text": "session_write_close();\n$_SESSION['count'] = 1;\nsession_start();\nsession_write_close();",
        "rationale": "Reopening reloads the stored 0 over the unpersisted local change before closing again.",
        "misconception": "Assuming reopening first saves post-close changes from the old in-memory array."
      }
    ],
    "correctOptionId": "write-before-close",
    "explanation": {
      "summary": "session_write_close stores current data and ends the active session. The PHP array can still be modified afterward, but those changes are not automatically committed to the closed session.",
      "trace": "Assigning count 1 before the close writes it to storage. The final session_start then reloads 1."
    },
    "validation": {
      "kind": "patch",
      "marker": "session_write_close();\n$_SESSION['count'] = 1;",
      "stdout": "1",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-13"
    },
    "references": [
      "https://www.php.net/manual/en/function.session-write-close.php",
      "https://www.php.net/manual/en/function.session-abort.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0432",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "json-top-level-object-with-nested-lists",
    "objective": {
      "id": "json-top-level-object-with-nested-lists",
      "text": "Force only the top-level JSON value to be an object while preserving nested arrays as lists."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a shallow PHP object cast from a recursive JSON encoding flag."
    },
    "prerequisites": [
      "JSON object and array shapes",
      "PHP object casting",
      "JSON_FORCE_OBJECT"
    ],
    "runtime": {
      "php": [
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
        "The input is a map with string field names, or an empty map represented by an empty PHP array. Nested numeric lists must remain JSON arrays."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction wire(array $payload): string\n{\n    return json_encode($payload, JSON_THROW_ON_ERROR | JSON_FORCE_OBJECT);\n}\n\necho '[' . wire([]) . ',' . wire(['items' => [1, 2]]) . ']';\n"
        }
      ]
    },
    "stem": "JSON_FORCE_OBJECT changes the nested items list into an object. Which return expression makes the displayed calls produce exactly [{},{\"items\":[1,2]}]?",
    "options": [
      {
        "id": "cast-root",
        "text": "json_encode((object) $payload, JSON_THROW_ON_ERROR)",
        "rationale": "The cast makes the root an object without converting the nested PHP list.",
        "misconception": null
      },
      {
        "id": "no-root-conversion",
        "text": "json_encode($payload, JSON_THROW_ON_ERROR)",
        "rationale": "The nonempty map has the desired shape, but an empty PHP array encodes as [] instead of {}.",
        "misconception": "Fixing the nested list while overlooking the empty-root contract."
      },
      {
        "id": "recursive-flag",
        "text": "json_encode($payload, JSON_THROW_ON_ERROR | JSON_FORCE_OBJECT)",
        "rationale": "The flag also changes nested numeric arrays into objects.",
        "misconception": "Treating an encoding flag as limited to the root value."
      },
      {
        "id": "values-list",
        "text": "json_encode(array_values($payload), JSON_THROW_ON_ERROR)",
        "rationale": "This removes the map’s field names and produces a list at the root.",
        "misconception": "Normalizing list indexes when the root contract requires a named object."
      }
    ],
    "correctOptionId": "cast-root",
    "explanation": {
      "summary": "Casting the outer array to object changes that one container. JSON_FORCE_OBJECT instead applies to arrays encountered throughout the encoded value, including nested lists.",
      "trace": "The empty input becomes {}. The map becomes {\"items\":[1,2]}, preserving items as a list."
    },
    "validation": {
      "kind": "patch",
      "marker": "json_encode($payload, JSON_THROW_ON_ERROR | JSON_FORCE_OBJECT)",
      "stdout": "[{},{\"items\":[1,2]}]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/json.constants.php",
      "https://www.php.net/manual/en/language.types.object.php#language.types.object.casting"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0433",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "unicode-boundary-trim-not-byte-mask",
    "objective": {
      "id": "unicode-boundary-trim-not-byte-mask",
      "text": "Trim specified Unicode space characters at the boundaries without damaging multibyte content."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish code-point matching from a byte-oriented trim character mask."
    },
    "prerequisites": [
      "UTF-8 encoding",
      "PHP byte strings",
      "PCRE Unicode mode",
      "trim character masks"
    ],
    "runtime": {
      "php": [
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
        "Input is valid UTF-8. Remove only ordinary space U+0020 and nonbreaking space U+00A0 at either end. Preserve every interior character. The pound sign is UTF-8 C2 A3; nonbreaking space is C2 A0."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction cleanEdges(string $text): string\n{\n    return trim($text);\n}\n\n$results = [\n    cleanEdges(\"\\u{00A0}£\\u{00A0}\"),\n    cleanEdges(\" A\\u{00A0}B \"),\n];\n\necho json_encode(array_map('bin2hex', $results));\n"
        }
      ]
    },
    "stem": "The current trim misses nonbreaking spaces. Which replacement preserves both the pound sign and the interior nonbreaking space?",
    "options": [
      {
        "id": "byte-mask",
        "text": "trim($text, \" \\xC2\\xA0\")",
        "rationale": "The mask is a set of bytes, so it can strip the C2 byte from the pound sign and corrupt its encoding.",
        "misconception": "Treating a multibyte sequence in trim’s mask as one Unicode character."
      },
      {
        "id": "all-occurrences",
        "text": "str_replace([' ', \"\\u{00A0}\"], '', $text)",
        "rationale": "This also removes the required interior nonbreaking space between A and B.",
        "misconception": "Replacing all matching spaces rather than only the boundary runs."
      },
      {
        "id": "ascii-only",
        "text": "trim($text)",
        "rationale": "Default trim does not remove the C2 A0 sequence as a nonbreaking-space character.",
        "misconception": "Assuming PHP’s default trim recognizes every Unicode whitespace character."
      },
      {
        "id": "unicode-edges",
        "text": "preg_replace('/\\A[ \\x{00A0}]+|[ \\x{00A0}]+\\z/u', '', $text)",
        "rationale": "Unicode mode matches the specified code points only at the two boundaries.",
        "misconception": null
      }
    ],
    "correctOptionId": "unicode-edges",
    "explanation": {
      "summary": "PHP trim uses a byte mask. A Unicode-aware regular expression can match U+00A0 as one character and anchor removal to the beginning or end.",
      "trace": "The first result retains C2 A3 for £. The second retains 41 C2 A0 42 for A, nonbreaking space, B."
    },
    "validation": {
      "kind": "patch",
      "marker": "trim($text)",
      "stdout": "[\"c2a3\",\"41c2a042\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.trim.php",
      "https://www.php.net/manual/en/reference.pcre.pattern.modifiers.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0434",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "HTTP & superglobals",
    "subtopic": "path-percent-decoding-preserves-literal-plus",
    "objective": {
      "id": "path-percent-decoding-preserves-literal-plus",
      "text": "Decode one URI path-segment representation without applying form-style plus-to-space conversion."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Choose the decoder for the component’s encoding contract and avoid an extra decoding pass."
    },
    "prerequisites": [
      "Percent encoding",
      "URI path segments",
      "Form URL encoding",
      "Single decoding boundary"
    ],
    "runtime": {
      "php": [
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
        "These strings are raw encoded path-segment values supplied before any percent decoding. Literal plus is a plus character in this component. Decode exactly once; a percent sign produced by decoding is data."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction decodeSegment(string $encoded): string\n{\n    return urldecode($encoded);\n}\n\necho json_encode([\n    decodeSegment('C++'),\n    decodeSegment('C%2B%2B'),\n    decodeSegment('a%252Fb'),\n]);\n"
        }
      ]
    },
    "stem": "urldecode changes a literal plus into a space. Which replacement correctly decodes all three path-segment inputs?",
    "options": [
      {
        "id": "form-decoder",
        "text": "urldecode($encoded)",
        "rationale": "The literal plus characters in C++ become spaces under form-style decoding.",
        "misconception": "Applying form field decoding rules to a path segment."
      },
      {
        "id": "path-decoder",
        "text": "rawurldecode($encoded)",
        "rationale": "This decodes percent escapes once while leaving literal plus characters unchanged.",
        "misconception": null
      },
      {
        "id": "two-passes",
        "text": "urldecode(rawurldecode($encoded))",
        "rationale": "The second pass changes plus characters and decodes the newly produced %2F again.",
        "misconception": "Applying another decoder to already decoded data."
      },
      {
        "id": "html-decoder",
        "text": "html_entity_decode($encoded)",
        "rationale": "HTML entity decoding does not decode the percent escapes in the second and third inputs.",
        "misconception": "Confusing HTML entity syntax with URI percent encoding."
      }
    ],
    "correctOptionId": "path-decoder",
    "explanation": {
      "summary": "rawurldecode decodes percent-encoded bytes without the application/x-www-form-urlencoded rule that maps plus to space. One pass also preserves a percent escape that was itself encoded as data.",
      "trace": "The results are C++, C++ and a%2Fb. The last result is not decoded again into a/b."
    },
    "validation": {
      "kind": "patch",
      "marker": "urldecode($encoded)",
      "stdout": "[\"C++\",\"C++\",\"a%2Fb\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/function.rawurldecode.php",
      "https://www.php.net/manual/en/function.urldecode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0435",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "dateinterval-total-days-not-day-component",
    "objective": {
      "id": "dateinterval-total-days-not-day-component",
      "text": "Read a date difference’s total elapsed day count rather than its residual day component."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Account for calendar months and leap years without approximating them as fixed-length units."
    },
    "prerequisites": [
      "DateTimeImmutable::diff",
      "DateInterval components",
      "Total days",
      "Leap years"
    ],
    "runtime": {
      "php": [
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
        "Both endpoints are UTC midnights, and end is on or after start. The interval is returned by DateTimeImmutable::diff rather than constructed from an interval specification."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction elapsedDays(string $start, string $end): int\n{\n    $from = new DateTimeImmutable($start, new DateTimeZone('UTC'));\n    $to = new DateTimeImmutable($end, new DateTimeZone('UTC'));\n    $interval = $from->diff($to);\n\n    return $interval->d;\n}\n\necho json_encode([\n    elapsedDays('2024-01-01', '2024-02-02'),\n    elapsedDays('2024-01-01', '2025-01-01'),\n    elapsedDays('2024-01-01', '2024-01-03'),\n]);\n"
        }
      ]
    },
    "stem": "The function loses full months and years by reading d. Which replacement return expression gives the required total days?",
    "options": [
      {
        "id": "thirty-day-months",
        "text": "$interval->m * 30 + $interval->d",
        "rationale": "This estimates months as 30 days and ignores the year component.",
        "misconception": "Converting calendar components using a fixed month length."
      },
      {
        "id": "day-component",
        "text": "$interval->d",
        "rationale": "The d field is the remaining day component after full years and months, not the total.",
        "misconception": "Treating the residual calendar day field as an elapsed duration."
      },
      {
        "id": "total-days",
        "text": "$interval->days",
        "rationale": "A diff-generated interval records the complete number of days in this field.",
        "misconception": null
      },
      {
        "id": "fixed-calendar",
        "text": "$interval->y * 365 + $interval->m * 30 + $interval->d",
        "rationale": "The first span includes a 31-day month and the full-year span includes leap day, so these fixed estimates are wrong.",
        "misconception": "Approximating calendar years and months as fixed day counts."
      }
    ],
    "correctOptionId": "total-days",
    "explanation": {
      "summary": "DateInterval exposes calendar components and, for intervals produced by diff, a separate total days value. The latter answers this UTC-midnight duration question directly.",
      "trace": "The spans contain 32, 366 and 2 days. Their d components alone are 1, 0 and 2."
    },
    "validation": {
      "kind": "patch",
      "marker": "$interval->d;",
      "candidates": {
        "thirty-day-months": "$interval->m * 30 + $interval->d;",
        "day-component": "$interval->d;",
        "total-days": "$interval->days;",
        "fixed-calendar": "$interval->y * 365 + $interval->m * 30 + $interval->d;"
      },
      "stdout": "[32,366,2]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/class.dateinterval.php",
      "https://www.php.net/manual/en/datetime.diff.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0436",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Validation & web security",
    "subtopic": "hmac-base64-raw-digest-not-hex-text",
    "objective": {
      "id": "hmac-base64-raw-digest-not-hex-text",
      "text": "Encode raw HMAC digest bytes as base64 instead of encoding their hexadecimal display text."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate the cryptographic digest from its hexadecimal and base64 representations."
    },
    "prerequisites": [
      "HMAC-SHA-256",
      "hash_hmac binary argument",
      "Base64 encoding",
      "Binary versus hexadecimal text"
    ],
    "runtime": {
      "php": [
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
        "The protocol requires standard padded base64 of the raw 32-byte HMAC-SHA-256 digest. The displayed key and message are public RFC 4231 test data, not credentials. The expected wire value is sDRMYdjbOFNcqK/OrwvxK4gdwgDJgz2nJuk3bC4yz/c=."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$key = str_repeat(\"\\x0b\", 20);\n$message = 'Hi There';\n$signature = base64_encode(hash_hmac('sha256', $message, $key));\n\necho $signature;\n"
        }
      ]
    },
    "stem": "The current expression produces base64 of hexadecimal text. Which replacement matches the required wire representation?",
    "options": [
      {
        "id": "hex-wrapped",
        "text": "base64_encode(hash_hmac('sha256', $message, $key))",
        "rationale": "The default HMAC result is hexadecimal text, so this encodes 64 display bytes rather than 32 digest bytes.",
        "misconception": "Treating the default digest representation as raw binary."
      },
      {
        "id": "hex-only",
        "text": "hash_hmac('sha256', $message, $key)",
        "rationale": "This returns hexadecimal text without applying the required base64 representation.",
        "misconception": "Confusing two different textual encodings of a digest."
      },
      {
        "id": "raw-then-base64",
        "text": "base64_encode(hash_hmac('sha256', $message, $key, true))",
        "rationale": "The true argument requests raw digest bytes, which base64_encode then encodes as required.",
        "misconception": null
      },
      {
        "id": "arguments-reversed",
        "text": "base64_encode(hash_hmac('sha256', $key, $message, true))",
        "rationale": "The encoding order is right, but reversing the message and key computes a different MAC.",
        "misconception": "Treating HMAC’s message and key arguments as interchangeable."
      }
    ],
    "correctOptionId": "raw-then-base64",
    "explanation": {
      "summary": "hash_hmac returns hexadecimal text unless its binary argument is true. Encoding that text again creates a different wire value from encoding the digest bytes.",
      "trace": "The public vector’s SHA-256 MAC has 32 bytes. Base64-encoding those bytes yields the specified 44-character padded value."
    },
    "validation": {
      "kind": "patch",
      "marker": "base64_encode(hash_hmac('sha256', $message, $key))",
      "stdout": "sDRMYdjbOFNcqK/OrwvxK4gdwgDJgz2nJuk3bC4yz/c=",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.hash-hmac.php",
      "https://www.rfc-editor.org/rfc/rfc4231.html#section-4.2"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0437",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "HTTP & superglobals",
    "subtopic": "query-string-wire-separators-not-html-entities",
    "objective": {
      "id": "query-string-wire-separators-not-html-entities",
      "text": "Build a raw RFC 3986 query string without HTML-escaping separators or decoding data delimiters."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Keep URI encoding and HTML rendering as separate output contexts."
    },
    "prerequisites": [
      "http_build_query",
      "RFC 3986 percent encoding",
      "HTML entities",
      "Query separators"
    ],
    "runtime": {
      "php": [
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
        "The result is passed directly to an HTTP client as a raw query string, not inserted into HTML. The receiving contract requires RFC 3986 encoding, including %20 for spaces, and a literal ampersand between parameters."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$parameters = ['q' => 'A & B', 'page' => 2];\n$query = http_build_query($parameters, '', '&amp;', PHP_QUERY_RFC3986);\n\necho $query;\n"
        }
      ]
    },
    "stem": "The service sees an amp;page parameter because the query contains HTML entities. Which expression gives q=A%20%26%20B&page=2 exactly?",
    "options": [
      {
        "id": "html-context",
        "text": "htmlspecialchars(http_build_query($parameters, '', '&', PHP_QUERY_RFC3986), ENT_QUOTES, 'UTF-8')",
        "rationale": "This turns the separator back into &amp;, which belongs to HTML source rather than the raw query.",
        "misconception": "Applying HTML escaping to a value sent directly over an HTTP client API."
      },
      {
        "id": "decoded-query",
        "text": "rawurldecode(http_build_query($parameters, '', '&', PHP_QUERY_RFC3986))",
        "rationale": "This decodes the ampersand inside q into a query delimiter and turns encoded spaces back into spaces.",
        "misconception": "Decoding a completed query string instead of retaining its encoded data values."
      },
      {
        "id": "form-style",
        "text": "http_build_query($parameters, '', '&', PHP_QUERY_RFC1738)",
        "rationale": "This uses plus for spaces, which does not meet the explicitly required RFC 3986 wire form.",
        "misconception": "Assuming all valid query encodings are interchangeable under an exact wire contract."
      },
      {
        "id": "raw-query",
        "text": "http_build_query($parameters, '', '&', PHP_QUERY_RFC3986)",
        "rationale": "This preserves encoded data characters and uses a literal ampersand only between parameters.",
        "misconception": null
      }
    ],
    "correctOptionId": "raw-query",
    "explanation": {
      "summary": "http_build_query can produce the raw query representation directly. HTML escaping is a later concern only if that URI is embedded into HTML, and decoding the complete query would expose data delimiters.",
      "trace": "The ampersand inside A & B becomes %26; the separator before page remains &. Spaces become %20."
    },
    "validation": {
      "kind": "patch",
      "marker": "http_build_query($parameters, '', '&amp;', PHP_QUERY_RFC3986)",
      "stdout": "q=A%20%26%20B&page=2",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
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
    "id": "PHP-E26-0438",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "HTTP & superglobals",
    "subtopic": "https-server-state-not-port-or-client-header",
    "objective": {
      "id": "https-server-state-not-port-or-client-header",
      "text": "Determine transport security from the deployment’s authoritative server state rather than a port convention or client header."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine the server variable’s string values with a stated trust boundary and nonstandard listening ports."
    },
    "prerequisites": [
      "$_SERVER value types",
      "HTTPS server configuration",
      "Client-supplied forwarding headers",
      "Nonstandard ports"
    ],
    "runtime": {
      "php": [
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
        "Clients connect directly to the configured web server; there is no trusted reverse proxy. This deployment supplies HTTPS=\"on\" for TLS and HTTPS=\"off\" or no HTTPS key for cleartext. Those server-controlled values are authoritative. Clients may supply X-Forwarded-Proto."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction secureTransport(array $server): bool\n{\n    return isset($server['HTTPS']);\n}\n\n$requests = [\n    ['HTTPS' => 'on', 'SERVER_PORT' => '8443'],\n    ['HTTPS' => 'off', 'SERVER_PORT' => '443', 'HTTP_X_FORWARDED_PROTO' => 'https'],\n    ['SERVER_PORT' => '80'],\n    ['HTTPS' => 'on', 'SERVER_PORT' => '443'],\n];\n\necho json_encode(array_map('secureTransport', $requests));\n"
        }
      ]
    },
    "stem": "The presence check incorrectly marks HTTPS=\"off\" as secure. Which predicate correctly classifies all four fixtures?",
    "options": [
      {
        "id": "authoritative-state",
        "text": "($server['HTTPS'] ?? 'off') === 'on'",
        "rationale": "The explicit on value matches this deployment’s authoritative TLS signal, regardless of port.",
        "misconception": null
      },
      {
        "id": "presence-only",
        "text": "isset($server['HTTPS'])",
        "rationale": "The off value is still present and nonnull, so the cleartext fixture is incorrectly accepted.",
        "misconception": "Treating presence of a configuration field as its affirmative value."
      },
      {
        "id": "standard-port",
        "text": "(int) ($server['SERVER_PORT'] ?? 0) === 443",
        "rationale": "This rejects TLS on 8443 and accepts the explicitly cleartext fixture on 443.",
        "misconception": "Inferring transport security solely from a conventional port number."
      },
      {
        "id": "forwarded-claim",
        "text": "($server['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https'",
        "rationale": "In this direct-client deployment the header is untrusted, and the spoofing fixture claims https over cleartext.",
        "misconception": "Trusting a forwarding header without an authenticated proxy boundary."
      }
    ],
    "correctOptionId": "authoritative-state",
    "explanation": {
      "summary": "Under the stated server configuration, the exact HTTPS value supplies the transport fact. Ports are conventions and forwarding headers are untrusted client input in this deployment.",
      "trace": "The four results are true, false, false and true. The off string must not be treated as a boolean true merely because it is nonempty."
    },
    "validation": {
      "kind": "patch",
      "marker": "isset($server['HTTPS'])",
      "stdout": "[true,false,false,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/reserved.variables.server.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0439",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "PDO & database access",
    "subtopic": "pdo-fetch-group-versus-unique-row-loss",
    "objective": {
      "id": "pdo-fetch-group-versus-unique-row-loss",
      "text": "Group every fetched row under a nonunique first-column value without overwriting earlier rows."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Select a PDO fetch mode that preserves both group cardinality and associative row shape."
    },
    "prerequisites": [
      "PDO fetchAll modes",
      "FETCH_GROUP",
      "FETCH_UNIQUE",
      "Associative rows"
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
        "Each status must map to a list of records shaped as {\"id\":number}. The SQL order is part of the fixture, and all rows must be retained."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec('CREATE TABLE tasks (id INTEGER PRIMARY KEY, status TEXT NOT NULL)');\n$pdo->exec(\"INSERT INTO tasks VALUES (1, 'open'), (2, 'open'), (3, 'done')\");\n$statement = $pdo->query('SELECT status, id FROM tasks ORDER BY id');\n$result = $statement->fetchAll(PDO::FETCH_UNIQUE | PDO::FETCH_ASSOC);\n\necho json_encode($result);\n"
        }
      ]
    },
    "stem": "FETCH_UNIQUE keeps only one open row. Which fetch-mode expression produces both open records and the done record in the required shape?",
    "options": [
      {
        "id": "unique",
        "text": "PDO::FETCH_UNIQUE | PDO::FETCH_ASSOC",
        "rationale": "A repeated first-column key replaces its earlier row rather than building a group.",
        "misconception": "Using a unique-key mapping for a nonunique category."
      },
      {
        "id": "group-records",
        "text": "PDO::FETCH_GROUP | PDO::FETCH_ASSOC",
        "rationale": "The first column selects the group and each remaining row is appended as an associative record.",
        "misconception": null
      },
      {
        "id": "flat-records",
        "text": "PDO::FETCH_ASSOC",
        "rationale": "This returns a flat row list with status fields instead of a map of grouped record lists.",
        "misconception": "Assuming repeated field values automatically create result groups."
      },
      {
        "id": "group-scalars",
        "text": "PDO::FETCH_GROUP | PDO::FETCH_COLUMN",
        "rationale": "This groups scalar IDs rather than records containing an id field.",
        "misconception": "Preserving grouping while discarding the required row structure."
      }
    ],
    "correctOptionId": "group-records",
    "explanation": {
      "summary": "FETCH_GROUP collects multiple rows under each value of the first selected column. Combining it with FETCH_ASSOC retains associative records for the remaining columns.",
      "trace": "open contains records with IDs 1 and 2, and done contains the record with ID 3. FETCH_UNIQUE cannot represent both open rows."
    },
    "validation": {
      "kind": "patch",
      "marker": "PDO::FETCH_UNIQUE | PDO::FETCH_ASSOC",
      "stdout": "{\"open\":[{\"id\":1},{\"id\":2}],\"done\":[{\"id\":3}]}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdostatement.fetchall.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0440",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "recursive-directory-follow-symlink-cycle-policy",
    "objective": {
      "id": "recursive-directory-follow-symlink-cycle-policy",
      "text": "Prevent recursive descent through directory symlinks instead of changing entry names or traversal order."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish recursion policy flags from presentation and ordering flags."
    },
    "prerequisites": [
      "RecursiveDirectoryIterator",
      "RecursiveIteratorIterator",
      "Directory symlinks",
      "FilesystemIterator flags"
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
        "A finite directory tree contains a directory symlink named back that points to an ancestor. The scanner must not descend through any directory symlink. It currently uses RecursiveDirectoryIterator with SKIP_DOTS | FOLLOW_SYMLINKS and then RecursiveIteratorIterator. There are no concurrent filesystem changes."
      ],
      "files": []
    },
    "stem": "The scanner repeatedly enters back despite SKIP_DOTS. Which change directly enforces the required traversal policy?",
    "options": [
      {
        "id": "path-values",
        "text": "Keep FOLLOW_SYMLINKS and add CURRENT_AS_PATHNAME so the iterator yields paths instead of objects.",
        "rationale": "Changing each yielded value’s representation does not stop descent through symlinks.",
        "misconception": "Treating entry presentation as a recursion boundary."
      },
      {
        "id": "child-first",
        "text": "Keep FOLLOW_SYMLINKS and switch RecursiveIteratorIterator to CHILD_FIRST order.",
        "rationale": "Child-first changes emission order; it does not remove the recursive symlink edge.",
        "misconception": "Using traversal order as cycle prevention."
      },
      {
        "id": "filename-keys",
        "text": "Keep FOLLOW_SYMLINKS and add KEY_AS_FILENAME so repeated directory names have the same key.",
        "rationale": "Iterator keys do not form an automatic visited-directory set.",
        "misconception": "Assuming repeated yielded keys cause recursion to skip a directory."
      },
      {
        "id": "no-symlink-descent",
        "text": "Remove FOLLOW_SYMLINKS while retaining SKIP_DOTS, so directory symlinks are not followed recursively.",
        "rationale": "This disables the descent behavior that created the ancestor loop.",
        "misconception": null
      }
    ],
    "correctOptionId": "no-symlink-descent",
    "explanation": {
      "summary": "SKIP_DOTS excludes the literal dot entries, not every link to an ancestor. FOLLOW_SYMLINKS explicitly enables recursion through directory symlinks, contrary to this scanner’s policy.",
      "trace": "With symlink following disabled, back is not traversed as a child directory. Changing key names, value types or visitation order would leave that edge active."
    },
    "validation": {
      "kind": "document-review",
      "rule": "FilesystemIterator separates FOLLOW_SYMLINKS from SKIP_DOTS, key/value presentation and RecursiveIteratorIterator traversal order.",
      "optionAudit": {
        "path-values": "Changes current-value representation only.",
        "child-first": "Changes visit ordering only.",
        "filename-keys": "Changes keys without creating a visited set.",
        "no-symlink-descent": "Removes recursive symlink traversal as required."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/class.filesystemiterator.php",
      "https://www.php.net/manual/en/recursivedirectoryiterator.haschildren.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0441",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "idempotency-replay-request-fingerprint-binding",
    "objective": {
      "id": "idempotency-replay-request-fingerprint-binding",
      "text": "Reject reuse of an idempotency key for a different operation payload before replaying its saved response."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish key identity, completed state and equivalence of the operation whose result was saved."
    },
    "prerequisites": [
      "Idempotency protocols",
      "Request fingerprints",
      "Canonical request representation",
      "Atomic lookup assumptions"
    ],
    "runtime": {
      "php": [
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
        "This helper runs after an atomic lookup of a completed record scoped to the same actor and endpoint. Request bodies have already been canonicalized consistently, and the fingerprint covers every behavior-changing input. The contract permits replay only for the original key and payload; a different payload under the same key must return conflict. This fixture does not implement concurrent claiming."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction replay(array $stored, string $key, string $fingerprint): string\n{\n    if ($stored['key'] !== $key) {\n        return 'missing';\n    }\n\n    if (/* payload conflict */ false) {\n        return 'conflict';\n    }\n\n    return $stored['response'];\n}\n\n$original = hash('sha256', '{\"amount\":10}');\n$changed = hash('sha256', '{\"amount\":20}');\n$stored = [\n    'key' => 'operation-7',\n    'fingerprint' => $original,\n    'state' => 'complete',\n    'response' => 'accepted:10',\n];\n\necho json_encode([\n    replay($stored, 'operation-7', $original),\n    replay($stored, 'operation-7', $changed),\n    replay($stored, 'operation-8', $original),\n]);\n"
        }
      ]
    },
    "stem": "The helper currently replays the saved response for a changed amount. Which condition replaces the marked false guard?",
    "options": [
      {
        "id": "key-check",
        "text": "$stored['key'] !== $key",
        "rationale": "This condition is already false on the replay path and says nothing about whether the payload changed.",
        "misconception": "Treating idempotency-key equality as proof of request equivalence."
      },
      {
        "id": "fingerprint-match",
        "text": "$stored['fingerprint'] === $fingerprint",
        "rationale": "This rejects the legitimate identical replay and permits a differing fingerprint.",
        "misconception": "Reversing the conflict predicate."
      },
      {
        "id": "state-check",
        "text": "$stored['state'] !== 'complete'",
        "rationale": "Both same-payload and changed-payload requests reach the same completed record.",
        "misconception": "Using completion status as a substitute for binding the saved result to its original request."
      },
      {
        "id": "fingerprint-conflict",
        "text": "$stored['fingerprint'] !== $fingerprint",
        "rationale": "This admits the original request and rejects a different payload before returning the saved response.",
        "misconception": null
      }
    ],
    "correctOptionId": "fingerprint-conflict",
    "explanation": {
      "summary": "An idempotency key identifies a saved operation; it does not grant permission to reuse that result for arbitrary new inputs. The saved fingerprint binds the response to the original canonical request.",
      "trace": "An identical request gets accepted:10. Reusing operation-7 for amount 20 returns conflict. A different key returns missing before the conflict guard."
    },
    "validation": {
      "kind": "patch",
      "marker": "/* payload conflict */ false",
      "stdout": "[\"accepted:10\",\"conflict\",\"missing\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php.net/manual/en/function.hash.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0442",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Performance, processes & servers",
    "subtopic": "redis-lease-release-atomic-owner-comparison",
    "objective": {
      "id": "redis-lease-release-atomic-owner-comparison",
      "text": "Release only the Redis lease still owned by the finishing worker, using an atomic ownership check."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Account for expiration and reassignment between commands instead of assuming a remembered key still identifies the same owner."
    },
    "prerequisites": [
      "Expiring leases (advanced)",
      "Unique owner tokens",
      "Redis Lua atomic execution",
      "Check-then-act races"
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
        "A PHP worker uses one Redis 7 instance with no failover in this scenario. Each acquisition stores a fresh unique owner token under the lock key with a TTL. Worker A can finish after its lease expires and worker B acquires the same key. The release operation must never delete B’s lease. This question concerns release ownership, not whether leases alone protect downstream writes."
      ],
      "files": []
    },
    "stem": "A’s finally block unconditionally sends DEL for the lock key. Which replacement avoids deleting a newer owner’s lease even if ownership changes during release?",
    "options": [
      {
        "id": "atomic-owner-delete",
        "text": "Run one Lua script that compares the stored token with A’s token and deletes the key only if they match.",
        "rationale": "Redis executes the comparison and conditional deletion atomically, so another owner cannot intervene between them.",
        "misconception": null
      },
      {
        "id": "client-check-delete",
        "text": "GET the token, compare it with A’s token in PHP, then send DEL only when the comparison matched.",
        "rationale": "The key can expire and be acquired by B between GET and DEL.",
        "misconception": "Assuming a successful ownership check remains valid across separate commands."
      },
      {
        "id": "ttl-check-delete",
        "text": "Read the remaining TTL and delete when it is within the configured lease duration.",
        "rationale": "B’s new lease also has a TTL within that duration, so this does not identify the owner.",
        "misconception": "Using remaining lifetime as an ownership token."
      },
      {
        "id": "transaction-unconditional",
        "text": "Queue GET and DEL together in MULTI/EXEC, then inspect the returned GET value in PHP.",
        "rationale": "DEL has already executed regardless of the GET result; inspecting the result afterward cannot make deletion conditional.",
        "misconception": "Confusing atomic command grouping with a conditional branch based on a command result."
      }
    ],
    "correctOptionId": "atomic-owner-delete",
    "explanation": {
      "summary": "The release decision must compare the current stored owner token and delete conditionally in one atomic operation. Separate client-side checks leave a race, and an unconditional transaction still deletes the wrong owner.",
      "trace": "If B owns the key, its token differs from A’s and the script leaves the key intact. If A still owns it, the same atomic script removes it."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Redis documents owner-token comparison and conditional deletion in a Lua script to avoid deleting a lock acquired by another client after expiration.",
      "optionAudit": {
        "atomic-owner-delete": "Makes ownership testing and conditional deletion one atomic operation.",
        "client-check-delete": "Leaves an expiration/reacquisition gap between commands.",
        "ttl-check-delete": "Lifetime does not establish owner identity.",
        "transaction-unconditional": "Executes deletion before client-side interpretation of the GET result."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/",
      "https://redis.io/docs/latest/develop/programmability/eval-intro/"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0443",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Enums, attributes & reflection",
    "subtopic": "reflection-dnf-intersection-conjunction",
    "objective": {
      "id": "reflection-dnf-intersection-conjunction",
      "text": "Preserve intersection conjunction while recursively evaluating a reflected disjunctive-normal-form type."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Keep union and intersection composition distinct instead of flattening every type member into an alternative."
    },
    "prerequisites": [
      "DNF types (advanced)",
      "ReflectionUnionType",
      "ReflectionIntersectionType",
      "Recursive predicates",
      "Interface membership"
    ],
    "runtime": {
      "php": [
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
        "The helper is deliberately limited to object types built from named classes/interfaces, unions and intersections. It need not handle built-in scalar types, nullability or self/static names. The empty interfaces are marker types in this fixture."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\ninterface Readable\n{\n}\n\ninterface Seekable\n{\n}\n\nclass ReadOnlyStream implements Readable\n{\n}\n\nclass SeekableReader implements Readable, Seekable\n{\n}\n\nclass MemoryBuffer\n{\n}\n\nfunction target((Readable&Seekable)|MemoryBuffer $value): void\n{\n}\n\nfunction matchesType(ReflectionType $type, object $value): bool\n{\n    if ($type instanceof ReflectionNamedType) {\n        return is_a($value, $type->getName());\n    }\n\n    $matches = array_map(\n        static fn (ReflectionType $part): bool => matchesType($part, $value),\n        $type->getTypes()\n    );\n\n    if ($type instanceof ReflectionIntersectionType) {\n        return /* intersection */ in_array(true, $matches, true);\n    }\n\n    return in_array(true, $matches, true);\n}\n\n$type = (new ReflectionFunction('target'))->getParameters()[0]->getType();\n$values = [new ReadOnlyStream(), new SeekableReader(), new MemoryBuffer(), new stdClass()];\n\necho json_encode(array_map(static fn (object $value): bool => matchesType($type, $value), $values));\n"
        }
      ]
    },
    "stem": "The predicate wrongly accepts ReadOnlyStream. Which replacement for the marked intersection expression makes its results match the declared parameter type?",
    "options": [
      {
        "id": "any-member",
        "text": "in_array(true, $matches, true)",
        "rationale": "This treats the intersection as a union and accepts an object that implements Readable alone.",
        "misconception": "Flattening conjunction into disjunction."
      },
      {
        "id": "exactly-one",
        "text": "count(array_filter($matches)) === 1",
        "rationale": "This accepts a one-interface object while rejecting the object that implements both required interfaces.",
        "misconception": "Treating an intersection as an exclusive choice of one member."
      },
      {
        "id": "every-member",
        "text": "!in_array(false, $matches, true)",
        "rationale": "Every required member must match; the enclosing union can still accept MemoryBuffer through its separate branch.",
        "misconception": null
      },
      {
        "id": "no-members",
        "text": "!in_array(true, $matches, true)",
        "rationale": "This accepts objects matching neither intersection member and rejects objects matching both.",
        "misconception": "Negating the member test instead of requiring all members."
      }
    ],
    "correctOptionId": "every-member",
    "explanation": {
      "summary": "An intersection requires every constituent type, whereas a union accepts any branch. The recursive shape must preserve those different logical operations.",
      "trace": "ReadOnlyStream fails the Seekable requirement. SeekableReader satisfies both interfaces. MemoryBuffer satisfies the other union branch. stdClass satisfies neither branch."
    },
    "validation": {
      "kind": "patch",
      "marker": "/* intersection */ in_array(true, $matches, true)",
      "stdout": "[false,true,true,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.declarations.php",
      "https://www.php.net/manual/en/class.reflectionintersectiontype.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0444",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "binary-frame-width-endianness-byte-length",
    "objective": {
      "id": "binary-frame-width-endianness-byte-length",
      "text": "Construct a binary frame with the required integer width, byte order and byte-count unit."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Reconcile a wire protocol’s binary length prefix with PHP’s byte strings and a multibyte UTF-8 payload."
    },
    "prerequisites": [
      "Binary framing",
      "Network byte order",
      "pack format codes",
      "UTF-8 bytes versus characters"
    ],
    "runtime": {
      "php": [
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
        "The wire format is a four-byte unsigned big-endian payload length followed by the payload bytes unchanged. Length counts bytes, not Unicode code points. The fixture éX contains two code points encoded as C3 A9 58. Only this small in-memory fixture is processed."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$payload = 'éX';\n$characters = 2;\n$frame = pack('V', strlen($payload)) . $payload;\n\necho bin2hex($frame);\n"
        }
      ]
    },
    "stem": "The receiver misreads the current length prefix. Which replacement frame expression produces hexadecimal 00000003c3a958?",
    "options": [
      {
        "id": "little-endian",
        "text": "pack('V', strlen($payload)) . $payload",
        "rationale": "V writes the 32-bit length in little-endian order, contrary to the protocol.",
        "misconception": "Matching the field width while using the opposite byte order."
      },
      {
        "id": "network-bytes",
        "text": "pack('N', strlen($payload)) . $payload",
        "rationale": "N writes four big-endian bytes, and strlen counts the three payload bytes.",
        "misconception": null
      },
      {
        "id": "short-network",
        "text": "pack('n', strlen($payload)) . $payload",
        "rationale": "n uses big-endian order but writes only a two-byte length field.",
        "misconception": "Treating the lowercase and uppercase network-order formats as the same width."
      },
      {
        "id": "network-characters",
        "text": "pack('N', $characters) . $payload",
        "rationale": "This declares a two-byte payload even though three bytes follow the header.",
        "misconception": "Using Unicode character count for a byte-oriented transport length."
      }
    ],
    "correctOptionId": "network-bytes",
    "explanation": {
      "summary": "A binary field needs both the specified width and byte order. The length unit is independent of the text encoding’s character count; PHP strlen measures the bytes that are actually appended.",
      "trace": "The length 3 becomes bytes 00 00 00 03. Appending C3 A9 58 produces the required frame."
    },
    "validation": {
      "kind": "patch",
      "marker": "pack('V', strlen($payload)) . $payload",
      "stdout": "00000003c3a958",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php.net/manual/en/function.pack.php",
      "https://www.php.net/manual/en/function.strlen.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0445",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "composer-transitive-repository-root-configuration",
    "objective": {
      "id": "composer-transitive-repository-root-configuration",
      "text": "Diagnose why a repository declared only by a dependency is unavailable to the consuming application’s dependency resolver."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate transitive package requirements from root-controlled package sources, version stability and autoload metadata."
    },
    "prerequisites": [
      "Composer dependency resolution",
      "Root package settings",
      "Private repositories",
      "Package discovery versus autoloading"
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
        "Composer 2 is resolving a new root application without a lockfile. Public vendor/report 1.0 requires private vendor/engine ^1.0. A compatible stable engine version exists only in a reachable private repository. That repository is declared in report’s composer.json, but not in the root application. The team has verified the repository and authorized using it; there are no authentication or platform conflicts."
      ],
      "files": []
    },
    "stem": "Resolution finds vendor/report but cannot find vendor/engine. Which change addresses the missing package source?",
    "options": [
      {
        "id": "root-repository",
        "text": "Declare the verified private repository in the root application’s repositories configuration, then resolve its dependencies.",
        "rationale": "Repository declarations are root-controlled; a dependency’s repository list is not automatically imported.",
        "misconception": null
      },
      {
        "id": "autoload-map",
        "text": "Add engine’s namespace to the root application’s PSR-4 autoload map, then regenerate autoload files.",
        "rationale": "Autoload mapping locates installed classes; it does not tell the dependency solver where to discover an uninstalled package.",
        "misconception": "Confusing class loading with package discovery."
      },
      {
        "id": "source-preference",
        "text": "Switch the install preference from dist to source so Composer searches report’s repository declarations.",
        "rationale": "Source versus dist chooses how a discovered package is downloaded, not which repository lists are inherited.",
        "misconception": "Treating download format as a repository-discovery policy."
      },
      {
        "id": "development-stability",
        "text": "Lower the root minimum-stability to dev so the private engine repository becomes eligible for discovery.",
        "rationale": "A compatible stable version already exists; stability does not add a repository that the root has not configured.",
        "misconception": "Using a version eligibility setting to solve a missing package-source problem."
      }
    ],
    "correctOptionId": "root-repository",
    "explanation": {
      "summary": "Composer does not recursively import repository declarations from dependencies. The consuming root project chooses its package sources, while require constraints may propagate transitively.",
      "trace": "Adding the verified repository to the root makes engine metadata available to resolution. Autoload, download preference and stability settings address different stages or filters."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Composer documents repositories as root-only: dependency repository declarations are not loaded during resolution of the root project.",
      "optionAudit": {
        "root-repository": "Makes the approved package source available to the root resolver.",
        "autoload-map": "Changes class-path mapping, not package metadata discovery.",
        "source-preference": "Changes download representation after discovery.",
        "development-stability": "Changes version filtering without adding a source."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://getcomposer.org/doc/05-repositories.md",
      "https://getcomposer.org/doc/faqs/why-cant-composer-load-repositories-recursively.md"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0446",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Variables, scope & constants",
    "subtopic": "define-success-result-not-constant-value",
    "objective": {
      "id": "define-success-result-not-constant-value",
      "text": "Review code that mistakes define’s success result for the value assigned to the constant."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate a configuration declaration’s side effect from its boolean return value."
    },
    "prerequisites": [
      "define",
      "Constants",
      "Function return values"
    ],
    "runtime": {
      "php": [
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
        "BASE_PATH has not previously been defined. The call succeeds in this fresh process."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$result = define('BASE_PATH', '/srv/app');\n\necho json_encode([$result, BASE_PATH], JSON_UNESCAPED_SLASHES);\n"
        }
      ]
    },
    "stem": "A reviewer wants to use result as the base-path string. Which assessment matches this code?",
    "options": [
      {
        "id": "value-result",
        "text": "result and BASE_PATH both contain /srv/app, so either can supply the path.",
        "rationale": "define returns a success flag, not the supplied constant value.",
        "misconception": "Assuming a declaration helper returns the value it assigns."
      },
      {
        "id": "void-result",
        "text": "result is null because define only declares a constant and has no return value.",
        "rationale": "define does have a boolean return value, and the successful call returns true.",
        "misconception": "Treating a side-effecting function as necessarily void."
      },
      {
        "id": "success-result",
        "text": "result is true; BASE_PATH contains /srv/app and should supply the path value.",
        "rationale": "The call’s return reports success while the separately declared constant holds the string.",
        "misconception": null
      },
      {
        "id": "variable-declaration",
        "text": "The call creates a variable named BASE_PATH, so reading BASE_PATH as a constant fails.",
        "rationale": "define creates a constant, not a variable; the constant expression is valid.",
        "misconception": "Confusing variable creation with constant declaration."
      }
    ],
    "correctOptionId": "success-result",
    "explanation": {
      "summary": "define establishes the constant and returns whether it succeeded. A caller that needs the configured value should use the constant rather than the boolean result.",
      "trace": "The JSON pair is [true,\"/srv/app\"]. Using result as a path would therefore pass a boolean instead of the intended string."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[true,\"/srv/app\"]",
      "keyEvidence": "The first value is boolean true and the second is the declared path string.",
      "counterexamples": {
        "value-result": "The observed return value is true, not the path.",
        "void-result": "The observed return value is not null.",
        "variable-declaration": "The constant expression successfully returns its string value."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-02"
    },
    "references": [
      "https://www.php.net/manual/en/function.define.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0447",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Functions & arguments",
    "subtopic": "nullable-return-fallthrough-requires-explicit-null",
    "objective": {
      "id": "nullable-return-fallthrough-requires-explicit-null",
      "text": "Review the assumption that a nullable return declaration permits falling off the end without returning."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish an allowed null value from the absence of a return value under a declared return contract."
    },
    "prerequisites": [
      "Nullable return types",
      "Control-flow paths",
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
          "source": "<?php\n\nfunction label(bool $enabled): ?string\n{\n    if ($enabled) {\n        return 'yes';\n    }\n}\n\n$results = [label(true)];\n\ntry {\n    $results[] = label(false);\n} catch (TypeError $failure) {\n    $results[] = 'TypeError';\n}\n\necho json_encode($results);\n"
        }
      ]
    },
    "stem": "A review says the false path automatically returns null because the declaration is nullable. Which assessment is correct?",
    "options": [
      {
        "id": "implicit-null",
        "text": "The false path returns null, so the declaration already covers both paths.",
        "rationale": "Falling off this declared-return function raises TypeError; an explicit return null is needed.",
        "misconception": "Equating an allowed null value with no return statement."
      },
      {
        "id": "explicit-return",
        "text": "The false path raises TypeError; add an explicit return null on that path.",
        "rationale": "The nullable declaration permits returning null, but the function must actually return it.",
        "misconception": null
      },
      {
        "id": "invalid-nullable",
        "text": "Add a bare return on the false path; it is equivalent to returning null for this declaration.",
        "rationale": "A bare return is invalid in this nullable typed function. The permitted null value must be returned explicitly.",
        "misconception": "Treating an absent return expression as a returned null value in a typed function."
      },
      {
        "id": "weak-mode-null",
        "text": "The missing return becomes null in weak mode and fails only with strict_types enabled.",
        "rationale": "This missing-return violation occurs in weak mode too; scalar coercion does not supply a return value.",
        "misconception": "Applying scalar coercion rules to a function that returns no value."
      }
    ],
    "correctOptionId": "explicit-return",
    "explanation": {
      "summary": "A nullable type describes values the function may return. It does not turn a missing return into an explicit null return for a function with this declared return type.",
      "trace": "The true path returns yes. The false path raises TypeError and the catch records that label."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"yes\",\"TypeError\"]",
      "keyEvidence": "The false branch is caught as TypeError even without strict_types.",
      "counterexamples": {
        "implicit-null": "No null result is appended; TypeError is caught.",
        "invalid-nullable": "The isolated bare-return contrast fails compilation, whereas explicit return null produces the required nullable value.",
        "weak-mode-null": "The displayed weak-mode file still reports TypeError."
      },
      "contrasts": [
        {
          "name": "explicit-null-return",
          "marker": "return 'yes';\n    }\n}",
          "replacement": "return 'yes';\n    }\n\n    return null;\n}",
          "stdout": "[\"yes\",null]"
        },
        {
          "name": "bare-return-is-invalid",
          "marker": "return 'yes';\n    }\n}",
          "replacement": "return 'yes';\n    }\n\n    return;\n}",
          "exit": 255,
          "stdout": "",
          "error": "must return a value"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/functions.returning-values.php",
      "https://www.php.net/manual/en/language.types.declarations.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0448",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Functions & arguments",
    "subtopic": "strtolower-ascii-only-not-unicode-case-fold",
    "objective": {
      "id": "strtolower-ascii-only-not-unicode-case-fold",
      "text": "Review whether strtolower alone normalizes non-ASCII letter case in UTF-8 text."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish ASCII byte conversion from Unicode-aware text normalization."
    },
    "prerequisites": [
      "strtolower",
      "ASCII letters",
      "UTF-8 text",
      "Strict string equality"
    ],
    "runtime": {
      "php": [
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
        "The PHP source is UTF-8. The two first letters are uppercase Ä and lowercase ä. No multibyte-string conversion is performed."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$left = strtolower('ÄA');\n$right = strtolower('äa');\n\necho json_encode([$left, $right, $left === $right], JSON_UNESCAPED_UNICODE);\n"
        }
      ]
    },
    "stem": "A review claims this normalization makes the two labels identical. Which assessment matches PHP 8.4 and 8.5?",
    "options": [
      {
        "id": "unicode-lower",
        "text": "Both labels become äa, because strtolower lowercases every UTF-8 letter.",
        "rationale": "strtolower performs ASCII case conversion; it does not convert Ä to ä.",
        "misconception": "Assuming the byte-string function implements Unicode case folding."
      },
      {
        "id": "whole-string-unchanged",
        "text": "Both labels stay unchanged because any non-ASCII byte disables conversion for the whole string.",
        "rationale": "The ASCII A still becomes a even though another character is non-ASCII.",
        "misconception": "Treating a mixed string as an all-or-nothing conversion unit."
      },
      {
        "id": "damaged-encoding",
        "text": "The left label becomes invalid UTF-8 because strtolower rewrites part of Ä’s multibyte encoding.",
        "rationale": "The non-ASCII bytes are left unchanged, so the string remains valid UTF-8.",
        "misconception": "Assuming ASCII case conversion alters arbitrary high bytes."
      },
      {
        "id": "ascii-only",
        "text": "The labels become Äa and äa, so they remain different; only the ASCII A is changed.",
        "rationale": "The observed conversion affects ASCII letters and preserves the distinct non-ASCII characters.",
        "misconception": null
      }
    ],
    "correctOptionId": "ascii-only",
    "explanation": {
      "summary": "In these PHP versions, strtolower converts ASCII uppercase letters. Unicode-aware case normalization requires a suitable Unicode operation and a defined comparison policy.",
      "trace": "The ASCII A becomes a. The initial Ä remains uppercase, so strict equality with äa is false."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"Äa\",\"äa\",false]",
      "keyEvidence": "The non-ASCII letters remain distinct while the ASCII A is lowered.",
      "counterexamples": {
        "unicode-lower": "The first result still begins with Ä.",
        "whole-string-unchanged": "The ASCII A changes to a.",
        "damaged-encoding": "JSON encoding succeeds and retains valid UTF-8."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
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
    "id": "PHP-E26-0449",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Operators & expressions",
    "subtopic": "numeric-string-addition-not-identifier-concatenation",
    "objective": {
      "id": "numeric-string-addition-not-identifier-concatenation",
      "text": "Review arithmetic addition used where textual identifier concatenation is required."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish operator semantics from the string types of the operands and from strict scalar-call checking."
    },
    "prerequisites": [
      "Numeric strings",
      "Addition versus concatenation",
      "strict_types scope"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\ndeclare(strict_types=1);\n\n$prefix = '12';\n$suffix = '03';\n$identifier = $prefix + $suffix;\n\necho json_encode([get_debug_type($identifier), $identifier]);\n"
        }
      ]
    },
    "stem": "The identifier must be the text 1203. A review proposes adding these two string components. Which assessment matches the result?",
    "options": [
      {
        "id": "arithmetic",
        "text": "The result is integer 15; use concatenation to preserve the components as the text 1203.",
        "rationale": "The plus operator adds numeric values, so it does not preserve the suffix’s textual leading zero.",
        "misconception": null
      },
      {
        "id": "string-concatenation",
        "text": "The result is string 1203 because plus concatenates when both operands are strings.",
        "rationale": "PHP uses the dot operator for string concatenation; plus performs arithmetic here.",
        "misconception": "Importing a different language’s string-plus behavior into PHP."
      },
      {
        "id": "strict-rejection",
        "text": "The operation throws TypeError because strict_types forbids numeric-string arithmetic.",
        "rationale": "strict_types does not change this arithmetic operator’s numeric-string behavior.",
        "misconception": "Extending scalar parameter strictness to every operator conversion."
      },
      {
        "id": "string-sum",
        "text": "The result is string 15 because arithmetic retains the string type of its operands.",
        "rationale": "The operation produces an integer numeric result for these integer-valued strings.",
        "misconception": "Assuming the result type must preserve an operand’s original representation."
      }
    ],
    "correctOptionId": "arithmetic",
    "explanation": {
      "summary": "Numeric strings are interpreted numerically by addition. Concatenation is a separate PHP operator, and strict_types does not make plus concatenate or reject these numeric strings.",
      "trace": "The operands contribute numeric values 12 and 3. Their sum is integer 15; concatenating the original strings produces 1203."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"int\",15]",
      "keyEvidence": "The observed value is an integer sum, not an identifier string.",
      "counterexamples": {
        "string-concatenation": "The output is 15, not 1203.",
        "strict-rejection": "Execution succeeds in the strict file.",
        "string-sum": "get_debug_type reports int."
      },
      "contrasts": [
        {
          "name": "textual-concatenation",
          "marker": "$prefix + $suffix",
          "replacement": "$prefix . $suffix",
          "stdout": "[\"string\",\"1203\"]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.arithmetic.php",
      "https://www.php.net/manual/en/language.operators.string.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0450",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Classes & object lifecycle",
    "subtopic": "constructor-parameter-promotion-removal-loses-property",
    "objective": {
      "id": "constructor-parameter-promotion-removal-loses-property",
      "text": "Review removal of a promotion visibility modifier as a change to object storage, not just constructor syntax."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate an ordinary constructor parameter from a declared and initialized instance property."
    },
    "prerequisites": [
      "Constructors",
      "Property promotion",
      "Parameter scope",
      "property_exists"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Promoted\n{\n    public function __construct(public string $name)\n    {\n    }\n}\n\nclass Ordinary\n{\n    public function __construct(string $name)\n    {\n    }\n}\n\n$promoted = new Promoted('Ada');\n$ordinary = new Ordinary('Ada');\n\necho json_encode([\n    property_exists($promoted, 'name'),\n    property_exists($ordinary, 'name'),\n]);\n"
        }
      ]
    },
    "stem": "A refactor removes public from the constructor parameter and changes nothing else. Which assessment follows from these two classes?",
    "options": [
      {
        "id": "implicit-public",
        "text": "Both classes declare and initialize a public name property from the matching parameter name.",
        "rationale": "An ordinary parameter does not implicitly declare an object property.",
        "misconception": "Treating matching parameter and intended field names as automatic storage."
      },
      {
        "id": "parameter-only",
        "text": "Only Promoted declares name as a property; Ordinary accepts the argument but does not store it in a property.",
        "rationale": "The visibility modifier enables promotion; without it, name is only a local constructor parameter.",
        "misconception": null
      },
      {
        "id": "implicit-private",
        "text": "Ordinary still stores name, but the missing visibility modifier makes the property private.",
        "rationale": "There is no property declaration in Ordinary, private or otherwise.",
        "misconception": "Assuming omitted promotion visibility selects a default private property."
      },
      {
        "id": "uninitialized-property",
        "text": "Both classes declare a public name property, but Ordinary leaves it uninitialized.",
        "rationale": "The nonpromoted parameter does not declare the property at all.",
        "misconception": "Separating promotion’s assignment effect while incorrectly retaining its declaration effect."
      }
    ],
    "correctOptionId": "parameter-only",
    "explanation": {
      "summary": "Constructor promotion uses the visibility modifier to declare a property and assign the argument to it. A plain parameter has function-local scope unless the constructor explicitly stores it.",
      "trace": "property_exists returns true for Promoted and false for Ordinary. Both constructors accept the string argument, but only the promoted form retains it as name."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[true,false]",
      "keyEvidence": "The ordinary-parameter class has no name property.",
      "counterexamples": {
        "implicit-public": "property_exists is false for Ordinary.",
        "implicit-private": "property_exists would also detect a declared private property, but returns false.",
        "uninitialized-property": "A declared uninitialized property would exist; this one does not."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.decon.php#language.oop5.decon.constructor.promotion"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0451",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Closures, callbacks & callables",
    "subtopic": "array-map-failed-assignment-versus-partial-inplace-refactor",
    "objective": {
      "id": "array-map-failed-assignment-versus-partial-inplace-refactor",
      "text": "Review a mapping refactor’s state after a callback rejects an element partway through processing."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish committing a completed result assignment from incremental writes to the existing array."
    },
    "prerequisites": [
      "array_map",
      "Assignment evaluation",
      "foreach writes",
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
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "normalize has no side effects beyond returning or throwing. The question concerns these array variables, not transactional guarantees for callbacks with external side effects."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction normalize(string $value): int\n{\n    if (preg_match('/\\A[0-9]+\\z/', $value) !== 1) {\n        throw new InvalidArgumentException('not digits');\n    }\n\n    return (int) $value;\n}\n\n$mapped = ['1', 'bad', '3'];\n\ntry {\n    $mapped = array_map('normalize', $mapped);\n} catch (InvalidArgumentException $failure) {\n}\n\n$inPlace = ['1', 'bad', '3'];\n\ntry {\n    foreach ($inPlace as $key => $value) {\n        $inPlace[$key] = normalize($value);\n    }\n} catch (InvalidArgumentException $failure) {\n}\n\necho json_encode([$mapped, $inPlace]);\n"
        }
      ]
    },
    "stem": "A review calls these two normalization strategies equivalent when validation fails. Which assessment matches the arrays after the catches?",
    "options": [
      {
        "id": "both-partial",
        "text": "Both arrays contain integer 1 followed by the original bad and 3 strings.",
        "rationale": "The array_map assignment never completes, so mapped retains its original string 1.",
        "misconception": "Assuming partial callback results are assigned into the target variable before array_map returns."
      },
      {
        "id": "both-rollback",
        "text": "Both arrays retain only strings because catching the exception rolls back earlier conversions.",
        "rationale": "The catch does not undo the first in-place assignment.",
        "misconception": "Treating exception handling as automatic rollback of array writes."
      },
      {
        "id": "different-failure-state",
        "text": "mapped retains all original strings; inPlace already contains integer 1 when the next element throws.",
        "rationale": "The complete-result assignment and incremental writes expose different failure states.",
        "misconception": null
      },
      {
        "id": "map-skips-invalid",
        "text": "mapped contains integers 1 and 3, while inPlace stops at bad.",
        "rationale": "array_map does not skip a thrown exception and continue to the next element.",
        "misconception": "Confusing mapping with a filter that discards invalid inputs."
      }
    ],
    "correctOptionId": "different-failure-state",
    "explanation": {
      "summary": "The right-hand side of mapped’s assignment must complete before replacing mapped. The foreach path commits each element separately, so its earlier successful write survives the later exception.",
      "trace": "The first normalization returns integer 1. The second throws. mapped remains [\"1\",\"bad\",\"3\"], while inPlace is [1,\"bad\",\"3\"]."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[[\"1\",\"bad\",\"3\"],[1,\"bad\",\"3\"]]",
      "keyEvidence": "The displayed arrays differ in the first element’s type after the same validation failure.",
      "counterexamples": {
        "both-partial": "mapped still contains string 1.",
        "both-rollback": "inPlace retains the committed integer 1.",
        "map-skips-invalid": "mapped retains the original bad element and string 3."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-map.php",
      "https://www.php.net/manual/en/language.operators.assignment.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0452",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Closures, callbacks & callables",
    "subtopic": "regex-callback-result-not-replacement-template",
    "objective": {
      "id": "regex-callback-result-not-replacement-template",
      "text": "Review a regex replacement refactor that treats a callback result as a backreference template."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate preg_replace’s replacement-string processing from a callback’s already-computed return value."
    },
    "prerequisites": [
      "PCRE capture groups",
      "Replacement backreferences",
      "preg_replace_callback",
      "Callback return values"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$input = 'id=12';\n$direct = preg_replace('/(\\d+)/', '[$1]', $input);\n$callback = preg_replace_callback(\n    '/(\\d+)/',\n    static fn (array $matches): string => '[$1]',\n    $input\n);\n\necho json_encode([$direct, $callback]);\n"
        }
      ]
    },
    "stem": "A refactor moves the replacement string into a callback without changing its text. Which assessment matches the two results?",
    "options": [
      {
        "id": "callback-literal",
        "text": "direct is id=[12], but callback is id=[$1]; the callback must build its result from matches[1].",
        "rationale": "The callback’s return is inserted literally rather than parsed again for replacement backreferences.",
        "misconception": null
      },
      {
        "id": "equivalent-template",
        "text": "Both are id=[12], because callback results use the same backreference expansion as replacement strings.",
        "rationale": "The callback is responsible for producing the final replacement text.",
        "misconception": "Assuming a callback return is another replacement template."
      },
      {
        "id": "both-literal",
        "text": "Both are id=[$1], because single-quoted PHP strings disable regex backreferences too.",
        "rationale": "PHP interpolation and preg_replace’s replacement processing are separate stages; the direct form expands $1.",
        "misconception": "Confusing PHP string interpolation with regex replacement syntax."
      },
      {
        "id": "callback-error",
        "text": "direct is id=[12] and callback is id=[$1]; double-quoting the callback string restores capture expansion.",
        "rationale": "Double quotes do not make a callback result a preg_replace template. PHP does not interpolate $1 as a variable, so this quote change still returns the literal text.",
        "misconception": "Trying to enable regex replacement expansion through PHP string quoting."
      }
    ],
    "correctOptionId": "callback-literal",
    "explanation": {
      "summary": "preg_replace interprets backreferences in its replacement argument. preg_replace_callback instead supplies captures to the callback and inserts the returned string as the finished replacement.",
      "trace": "The direct template expands group 1 to 12. The callback literally returns [$1]; returning a string built from matches[1] would produce [12]."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"id=[12]\",\"id=[$1]\"]",
      "keyEvidence": "The callback result retains the literal dollar-sign reference text.",
      "counterexamples": {
        "equivalent-template": "The second result contains $1, not 12.",
        "both-literal": "The direct result expands the captured digits.",
        "callback-error": "The quote-only contrast still returns literal [$1] from the callback."
      },
      "contrasts": [
        {
          "name": "callback-double-quotes",
          "marker": "static fn (array $matches): string => '[$1]'",
          "replacement": "static fn (array $matches): string => \"[$1]\"",
          "stdout": "[\"id=[12]\",\"id=[$1]\"]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/function.preg-replace.php",
      "https://www.php.net/manual/en/function.preg-replace-callback.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0453",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "HTTP & superglobals",
    "subtopic": "http-204-cannot-carry-required-json-content",
    "objective": {
      "id": "http-204-cannot-carry-required-json-content",
      "text": "Review an HTTP success status against a contract requiring a response body."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a no-content status from a successful representation response instead of trying to repair it with content headers."
    },
    "prerequisites": [
      "HTTP 200 and 204",
      "Response content semantics",
      "Content-Type versus status",
      "Completed update operations"
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
        "A PHP endpoint synchronously updates an existing resource and must return its resulting JSON representation to the client. The request is not conditional and is not a range request. The handler currently selects status 204, adds Content-Type: application/json and writes the JSON bytes."
      ],
      "files": []
    },
    "stem": "Clients do not receive the required representation reliably. Which review change aligns the response with its HTTP contract?",
    "options": [
      {
        "id": "length-header",
        "text": "Keep 204 and add Content-Length equal to the JSON byte count so clients know to read it.",
        "rationale": "A length header does not make content valid for a 204 response.",
        "misconception": "Treating framing metadata as permission to violate status semantics."
      },
      {
        "id": "json-content-type",
        "text": "Keep 204 and ensure the media type includes charset=utf-8 so the JSON becomes response content.",
        "rationale": "Content-Type describes content when allowed; it cannot override the no-content status.",
        "misconception": "Treating representation metadata as overriding the status code."
      },
      {
        "id": "not-modified",
        "text": "Use 304 with the updated JSON because the existing resource retains its identity.",
        "rationale": "304 is for conditional retrieval and has no response content; this is a completed update requiring a representation.",
        "misconception": "Confusing unchanged resource identity with a Not Modified conditional response."
      },
      {
        "id": "representation-success",
        "text": "Use 200 with the JSON representation and its appropriate Content-Type.",
        "rationale": "A 200 response can carry the resulting representation required by this completed operation.",
        "misconception": null
      }
    ],
    "correctOptionId": "representation-success",
    "explanation": {
      "summary": "204 indicates successful completion without response content. If this endpoint’s contract requires the resulting representation, it needs a content-bearing success response such as 200.",
      "trace": "The successful update completes before the response. Status 200 and the JSON content describe the outcome together; content headers cannot turn 204 into a body-bearing response."
    },
    "validation": {
      "kind": "document-review",
      "rule": "HTTP semantics define 204 as having no content and distinguish it from 200 representation responses and 304 conditional responses.",
      "optionAudit": {
        "length-header": "Cannot authorize content forbidden by the selected status.",
        "json-content-type": "Does not change status semantics.",
        "not-modified": "Misuses a conditional no-content status.",
        "representation-success": "Provides a status compatible with the required representation."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc9110.html#section-15.3.5",
      "https://www.rfc-editor.org/rfc/rfc9110.html#section-15.3.1"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0454",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Cookies & sessions",
    "subtopic": "session-object-class-loading-before-deserialization",
    "objective": {
      "id": "session-object-class-loading-before-deserialization",
      "text": "Review class-loading order when a session restores a serialized object."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish making a class available for deserialization from defining it after an incomplete object already exists."
    },
    "prerequisites": [
      "Session deserialization",
      "Class loading",
      "__PHP_Incomplete_Class",
      "Serialized object metadata"
    ],
    "runtime": {
      "php": [
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
        "The displayed serialized bytes are a fixed, locally authored test fixture, not external input. The files session handler uses only this fixture directory. No autoloader or unserialize callback is registered, and Profile is initially undefined. All session and file operations succeed."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$serialized = 'a:1:{s:4:\"user\";O:7:\"Profile\":1:{s:4:\"name\";s:3:\"Ada\";}}';\nfile_put_contents(__DIR__ . '/sess_fixture454', $serialized);\nsession_id('fixture454');\nsession_start([\n    'save_path' => __DIR__,\n    'serialize_handler' => 'php_serialize',\n    'use_cookies' => false,\n    'cache_limiter' => '',\n]);\n\n$before = get_class($_SESSION['user']);\nrequire __DIR__ . '/profile.php';\n$after = get_class($_SESSION['user']);\nsession_abort();\n\necho json_encode([$before, $after]);\n"
        },
        {
          "path": "profile.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass Profile\n{\n    public string $name;\n}\n"
        }
      ]
    },
    "stem": "A review says requiring profile.php after session_start repairs the already restored user object. Which assessment matches the two recorded class names?",
    "options": [
      {
        "id": "late-upgrade",
        "text": "The first class name is __PHP_Incomplete_Class and the second becomes Profile automatically after require.",
        "rationale": "Defining a class later does not transform an already-created incomplete object into that class.",
        "misconception": "Assuming class loading retroactively upgrades existing deserialized objects."
      },
      {
        "id": "metadata-loads-file",
        "text": "Both class names are Profile because serialized class metadata automatically locates profile.php.",
        "rationale": "The class name in serialized data does not supply an automatic filesystem mapping when no loader is registered.",
        "misconception": "Treating serialized class names as paths that PHP can load without configuration."
      },
      {
        "id": "load-before-restore",
        "text": "Both names are __PHP_Incomplete_Class; make Profile or its autoloader available before session_start restores it.",
        "rationale": "The first restoration happens without the class, and the resulting object keeps its incomplete-class identity.",
        "misconception": null
      },
      {
        "id": "session-start-rejects",
        "text": "session_start throws solely because Profile is unknown, so neither class name can be recorded.",
        "rationale": "This fixture restores an incomplete object rather than throwing for the unavailable class.",
        "misconception": "Assuming an unknown serialized class always aborts session restoration."
      }
    ],
    "correctOptionId": "load-before-restore",
    "explanation": {
      "summary": "Session object restoration needs the class definition or an appropriate autoloader at deserialization time. Loading the class afterward does not change the identity of an object already restored as incomplete.",
      "trace": "The fixture restores user before Profile is defined. Both observations therefore report __PHP_Incomplete_Class, despite the later successful require."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"__PHP_Incomplete_Class\",\"__PHP_Incomplete_Class\"]",
      "keyEvidence": "The class name remains incomplete across the later require.",
      "counterexamples": {
        "late-upgrade": "The second class name does not change.",
        "metadata-loads-file": "The first restored object is incomplete without an autoloader.",
        "session-start-rejects": "The fixture reaches both observations without an exception."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-13"
    },
    "references": [
      "https://www.php.net/manual/en/function.session-start.php",
      "https://www.php.net/manual/en/class.php-incomplete-class.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0455",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Cookies & sessions",
    "subtopic": "setcookie-preencoded-value-double-encoding",
    "objective": {
      "id": "setcookie-preencoded-value-double-encoding",
      "text": "Review redundant URI encoding before setcookie under PHP’s ordinary cookie decoding behavior."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace the outgoing cookie encoding and the one incoming PHP decoding step separately."
    },
    "prerequisites": [
      "setcookie value encoding",
      "rawurlencode",
      "Percent encoding",
      "$_COOKIE decoding"
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
        "An HTTP handler successfully calls setcookie(\"label\", rawurlencode(\"A B\")). The browser accepts the cookie and sends its stored value on the next eligible request. The next PHP request uses ordinary cookie parsing with no additional application decoding."
      ],
      "files": []
    },
    "stem": "A review expects the next request’s $_COOKIE[\"label\"] to be A B. Which value and explanation match the extra encoding step?",
    "options": [
      {
        "id": "fully-decoded",
        "text": "A B, because one incoming decoding step removes both the explicit encoding and setcookie’s encoding.",
        "rationale": "One decoding pass does not recursively decode a newly exposed percent escape.",
        "misconception": "Treating a single decode operation as repeated decoding until no escapes remain."
      },
      {
        "id": "still-percent-encoded",
        "text": "A%20B, because setcookie encodes the existing percent sign again and PHP later decodes only that outer layer.",
        "rationale": "The explicit rawurlencode turns the space into %20; setcookie then encodes its percent sign, leaving one encoded layer after input parsing.",
        "misconception": null
      },
      {
        "id": "wire-value-unchanged",
        "text": "A%2520B, because PHP exposes the cookie’s wire value without URL decoding it.",
        "rationale": "Ordinary PHP cookie parsing decodes the outer encoded percent sign.",
        "misconception": "Assuming $_COOKIE preserves every percent escape exactly as received."
      },
      {
        "id": "plus-form",
        "text": "A+B, because PHP converts a percent-encoded space into a plus character when reading cookies.",
        "rationale": "The remaining %20 is not decoded again, and incoming decoding does not replace a space with plus.",
        "misconception": "Applying an outgoing form-encoding rule during input decoding."
      }
    ],
    "correctOptionId": "still-percent-encoded",
    "explanation": {
      "summary": "setcookie performs value encoding itself. Pre-encoding an ordinary value adds another layer; the next request removes only the layer PHP expects. Passing the raw value avoids this redundant encoding.",
      "trace": "A B becomes A%20B before setcookie. The outgoing cookie carries A%2520B, and the next $_COOKIE value is A%20B."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP documents setcookie’s automatic value encoding and automatic decoding when the cookie is received; the explicit rawurlencode adds a separate layer.",
      "optionAudit": {
        "fully-decoded": "Incorrectly assumes recursive decoding.",
        "still-percent-encoded": "Tracks the two encodings and one incoming decoding.",
        "wire-value-unchanged": "Omits PHP’s ordinary incoming decoding.",
        "plus-form": "Uses the wrong direction and representation rule."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-13"
    },
    "references": [
      "https://www.php.net/manual/en/function.setcookie.php",
      "https://www.php.net/manual/en/function.rawurlencode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0456",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Types, casting & comparisons",
    "subtopic": "integer-overflow-float-out-of-range-return",
    "objective": {
      "id": "integer-overflow-float-out-of-range-return",
      "text": "Review integer addition beyond PHP_INT_MAX against an int return contract in weak mode."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate arithmetic promotion to float from whether the resulting out-of-range value can satisfy an integer return type."
    },
    "prerequisites": [
      "64-bit integer limits",
      "Arithmetic overflow",
      "Float promotion",
      "Weak return coercion"
    ],
    "runtime": {
      "php": [
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
        "This is 64-bit PHP with no strict_types declaration. The question concerns ordinary PHP integers, not arbitrary-precision extensions."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction addCounts(int $left, int $right): int\n{\n    return $left + $right;\n}\n\n$raw = PHP_INT_MAX + 1;\n\ntry {\n    $typed = addCounts(PHP_INT_MAX, 1);\n} catch (TypeError $failure) {\n    $typed = 'TypeError';\n}\n\necho json_encode([get_debug_type($raw), $typed]);\n"
        }
      ]
    },
    "stem": "A review claims the int return declaration makes overflowing addition wrap or saturate to a valid integer. Which assessment matches the observations?",
    "options": [
      {
        "id": "wraps",
        "text": "The addition wraps to PHP_INT_MIN, and the return declaration accepts that integer.",
        "rationale": "PHP promotes this overflowing arithmetic result to float rather than wrapping to a signed integer.",
        "misconception": "Applying fixed-width machine-integer wraparound to PHP arithmetic."
      },
      {
        "id": "saturates",
        "text": "The addition clamps to PHP_INT_MAX because the function declares an integer result.",
        "rationale": "A return declaration does not change arithmetic into saturating addition.",
        "misconception": "Treating a return type as a numeric range-clamping instruction."
      },
      {
        "id": "operator-throws",
        "text": "The plus operator itself throws TypeError, so no floating-point raw result can be observed.",
        "rationale": "The untyped addition succeeds and produces a float; the typed function fails at its return boundary.",
        "misconception": "Confusing arithmetic overflow behavior with the later type-contract failure."
      },
      {
        "id": "promotes-then-fails",
        "text": "The raw sum is a float, and the out-of-range value cannot satisfy the int return contract, so the function raises TypeError.",
        "rationale": "Arithmetic promotion occurs first; weak coercion cannot turn this out-of-range result into a valid PHP integer.",
        "misconception": null
      }
    ],
    "correctOptionId": "promotes-then-fails",
    "explanation": {
      "summary": "Overflowing PHP integer arithmetic produces a float. An int return declaration does not make that operation wrap or clamp, and this resulting value lies outside the integer range even in weak mode.",
      "trace": "raw has type float. Returning the corresponding value from addCounts fails its int return contract and is caught as TypeError."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"float\",\"TypeError\"]",
      "keyEvidence": "A float is observed outside the function, while the typed call fails.",
      "counterexamples": {
        "wraps": "The raw result is float, not an integer minimum.",
        "saturates": "The function fails rather than returning an integer maximum.",
        "operator-throws": "The raw addition completes before the typed call."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.integer.php#language.types.integer.overflow",
      "https://www.php.net/manual/en/language.types.declarations.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0457",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Closures, callbacks & callables",
    "subtopic": "array-all-short-circuit-versus-eager-filter",
    "objective": {
      "id": "array-all-short-circuit-versus-eager-filter",
      "text": "Review replacing a short-circuit all predicate with eager filtering when the predicate can throw."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Determine whether later inputs are evaluated after an earlier false result already decides the all condition."
    },
    "prerequisites": [
      "PHP 8.4 array_all",
      "array_filter",
      "Predicate exceptions",
      "Short-circuit evaluation"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction positive(int $value): bool\n{\n    if ($value < 0) {\n        throw new RuntimeException('negative input');\n    }\n\n    return $value > 0;\n}\n\n$values = [0, -1];\n$short = array_all($values, 'positive');\n\ntry {\n    $eager = count(array_filter($values, 'positive')) === count($values);\n} catch (RuntimeException $failure) {\n    $eager = 'exception';\n}\n\necho json_encode([$short, $eager]);\n"
        }
      ]
    },
    "stem": "A refactor replaces array_all with a filtered-count comparison. Which assessment matches this throwing predicate?",
    "options": [
      {
        "id": "both-false",
        "text": "Both expressions return false because the first element already fails the predicate.",
        "rationale": "array_filter still evaluates the later negative value and the predicate throws.",
        "misconception": "Assuming the surrounding count comparison makes filtering short-circuit."
      },
      {
        "id": "both-throw",
        "text": "Both expressions throw because every input is passed to the predicate eventually.",
        "rationale": "array_all stops at the first false predicate result, so it never evaluates -1 here.",
        "misconception": "Treating an all predicate as an eager mapping operation."
      },
      {
        "id": "different-evaluation",
        "text": "array_all returns false without visiting -1; the filtered-count version reaches -1 and throws.",
        "rationale": "The two expressions differ in evaluation behavior even when their pure total-predicate boolean results would agree.",
        "misconception": null
      },
      {
        "id": "reverse-evaluation",
        "text": "array_all throws, while array_filter discards the zero and returns false without reading further.",
        "rationale": "Filtering does not stop after excluding one entry, while array_all does stop after a false result.",
        "misconception": "Reversing the two APIs’ evaluation policies."
      }
    ],
    "correctOptionId": "different-evaluation",
    "explanation": {
      "summary": "array_all can decide its result as soon as one predicate result is false. array_filter constructs its result by visiting the remaining entries, so a later exception remains observable.",
      "trace": "positive(0) is false. The all operation stops there; filtering continues to positive(-1), which throws."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[false,\"exception\"]",
      "keyEvidence": "The two paths produce different failure behavior on the same input.",
      "counterexamples": {
        "both-false": "The eager path records exception.",
        "both-throw": "The all path completes with false.",
        "reverse-evaluation": "The observations show the opposite evaluation behavior."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-all.php",
      "https://www.php.net/manual/en/function.array-filter.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0458",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "psr7-set-cookie-separate-header-emission",
    "objective": {
      "id": "psr7-set-cookie-separate-header-emission",
      "text": "Emit multiple PSR-7 Set-Cookie values without comma-folding or overwriting earlier header lines."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine the message API’s multivalue representation with PHP header’s replacement behavior and cookie-specific field semantics."
    },
    "prerequisites": [
      "PSR-7 getHeader and getHeaderLine",
      "Set-Cookie field semantics",
      "PHP header replace argument"
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
        "A conforming PSR-7 response contains two Set-Cookie field values. One includes an Expires date containing a comma. No headers have been sent, and the emitter must preserve both complete cookie fields as separate response lines. The existing emitter sends one line from getHeaderLine(\"Set-Cookie\")."
      ],
      "files": []
    },
    "stem": "Which replacement emitter preserves both cookies correctly?",
    "options": [
      {
        "id": "comma-line",
        "text": "Send getHeaderLine(\"Set-Cookie\") as one Set-Cookie line with header’s replace argument set to false.",
        "rationale": "Appending the line avoids replacement but still folds both cookie fields together with a comma.",
        "misconception": "Fixing overwrite behavior while retaining invalid cookie-field combination."
      },
      {
        "id": "replace-each",
        "text": "Loop over getHeader(\"Set-Cookie\") and call header(\"Set-Cookie: \" . $value) with its default arguments.",
        "rationale": "The default replacement behavior can replace the preceding Set-Cookie line, leaving only the last cookie.",
        "misconception": "Assuming separate calls automatically append repeated header names."
      },
      {
        "id": "append-each",
        "text": "Loop over getHeader(\"Set-Cookie\") and call header(\"Set-Cookie: \" . $value, false) for each value.",
        "rationale": "The array preserves each full cookie field, and false appends each line instead of replacing earlier ones.",
        "misconception": null
      },
      {
        "id": "split-comma",
        "text": "Split getHeaderLine(\"Set-Cookie\") on commas, then append each resulting piece as a Set-Cookie line.",
        "rationale": "A comma inside Expires is part of one cookie field, so splitting it creates broken fragments.",
        "misconception": "Treating Set-Cookie as a generic comma-separated field list."
      }
    ],
    "correctOptionId": "append-each",
    "explanation": {
      "summary": "Set-Cookie needs separate field lines. PSR-7 getHeader returns the original value list, and PHP header’s false replacement argument preserves earlier lines with the same name.",
      "trace": "Each complete cookie value is emitted once. The Expires comma remains inside its own field instead of becoming a splitting point."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PSR-7 distinguishes getHeader’s value array from getHeaderLine’s comma joining, warns about Set-Cookie, and PHP header supports nonreplacing emission with false.",
      "optionAudit": {
        "comma-line": "Still combines cookie fields into one comma-joined value.",
        "replace-each": "Uses replacing emission for repeated field names.",
        "append-each": "Preserves both value boundaries and repeated lines.",
        "split-comma": "Breaks the comma-bearing Expires attribute."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php-fig.org/psr/psr-7/",
      "https://www.php.net/manual/en/function.header.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0459",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "PDO & database access",
    "subtopic": "pdo-execute-array-replaces-explicit-binding-type",
    "objective": {
      "id": "pdo-execute-array-replaces-explicit-binding-type",
      "text": "Review the parameter type used when execute receives a new value array after an explicit integer binding."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish PHP value types from PDO’s default parameter type for values supplied through execute."
    },
    "prerequisites": [
      "PDO bindValue types",
      "PDOStatement::execute arrays",
      "SQLite typeof",
      "Statement reuse"
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
        "The fixture uses PDO SQLite. SQLite typeof reports the storage class of the selected parameter, allowing the binding representation to be observed without relying on fetched-number coercion."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$statement = $pdo->prepare('SELECT typeof(:value)');\n$statement->bindValue('value', 42, PDO::PARAM_INT);\n\n$statement->execute();\n$first = $statement->fetchColumn();\n$statement->closeCursor();\n\n$statement->execute(['value' => 42]);\n$second = $statement->fetchColumn();\n\necho json_encode([$first, $second]);\n"
        }
      ]
    },
    "stem": "A review assumes the earlier PARAM_INT choice also controls a later execute value array. Which assessment matches the two SQLite type names?",
    "options": [
      {
        "id": "persistent-integer",
        "text": "Both results are integer because the original bindValue type persists when execute supplies a new value.",
        "rationale": "The new execute parameter set does not retain that earlier explicit integer binding.",
        "misconception": "Treating a binding type as permanent metadata on the placeholder."
      },
      {
        "id": "always-text",
        "text": "Both results are text because every PDO parameter is sent as a string regardless of binding mode.",
        "rationale": "The explicit PARAM_INT binding is observed as an integer in the first execution.",
        "misconception": "Ignoring explicitly requested PDO parameter types."
      },
      {
        "id": "array-default-string",
        "text": "The results are integer then text; execute’s value array uses its default string parameter type.",
        "rationale": "The explicit integer binding controls the first execution, while the replacement array supplies a string-typed parameter.",
        "misconception": null
      },
      {
        "id": "colon-required",
        "text": "The second execution fails because the value-array key must include the placeholder’s leading colon.",
        "rationale": "PDO accepts this named parameter key without the leading colon; the call executes successfully.",
        "misconception": "Confusing SQL marker syntax with the accepted parameter-map key forms."
      }
    ],
    "correctOptionId": "array-default-string",
    "explanation": {
      "summary": "An explicit bindValue call can choose PARAM_INT. Values supplied as execute’s parameter array use the API’s default string typing, even when the PHP array element is an integer.",
      "trace": "SQLite observes integer for the explicit binding and text for the value supplied through execute. The query exposes that representation directly through typeof."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"integer\",\"text\"]",
      "keyEvidence": "The two executions expose different parameter storage classes despite the same PHP numeric value.",
      "counterexamples": {
        "persistent-integer": "The second type is text, not integer.",
        "always-text": "The first explicit binding is integer.",
        "colon-required": "The unprefixed parameter-map key is accepted."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdostatement.execute.php",
      "https://www.php.net/manual/en/pdostatement.bindvalue.php",
      "https://www.sqlite.org/lang_corefunc.html#typeof"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0460",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Functions & arguments",
    "subtopic": "preg-match-all-result-orientation-refactor",
    "objective": {
      "id": "preg-match-all-result-orientation-refactor",
      "text": "Review changing preg_match_all’s result orientation when downstream code uses fixed nested indexes."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate match count from the different meanings of the two array dimensions."
    },
    "prerequisites": [
      "PCRE capture groups",
      "PREG_PATTERN_ORDER",
      "PREG_SET_ORDER",
      "Nested arrays"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$pattern = '/([a-z])(\\d)/';\n$input = 'a1 b2';\n\n$columnCount = preg_match_all($pattern, $input, $columns, PREG_PATTERN_ORDER);\n$rowCount = preg_match_all($pattern, $input, $rows, PREG_SET_ORDER);\n\necho json_encode([$columns[1][0], $rows[1][0], $columnCount, $rowCount]);\n"
        }
      ]
    },
    "stem": "A review calls the flag change harmless because both calls find two matches. Which assessment matches the downstream indexes?",
    "options": [
      {
        "id": "same-index",
        "text": "Both indexes read a, because the flag changes only the outer array’s labels.",
        "rationale": "The dimensions change meaning: the row-oriented second entry is the second full match.",
        "misconception": "Assuming fixed nested indexes retain their meaning after a representation change."
      },
      {
        "id": "same-capture",
        "text": "The first index reads a and the second reads b, because both indexes select capture group 1.",
        "rationale": "In SET_ORDER, the inner index 0 selects the full match, not capture group 1.",
        "misconception": "Keeping the group-oriented interpretation for the wrong dimension."
      },
      {
        "id": "different-orientation",
        "text": "The indexes read a and b2; equal match counts do not make the two nested representations interchangeable.",
        "rationale": "PATTERN_ORDER groups by capture, while SET_ORDER groups by match occurrence.",
        "misconception": null
      },
      {
        "id": "full-matches",
        "text": "The indexes read a1 and b2, because index 0 always selects the first full match.",
        "rationale": "The first outer index 1 selects capture group 1 in PATTERN_ORDER, whose first value is a.",
        "misconception": "Applying the SET_ORDER interpretation to both result arrays."
      }
    ],
    "correctOptionId": "different-orientation",
    "explanation": {
      "summary": "PATTERN_ORDER places capture groups in the outer dimension, so columns[1][0] is group 1 of the first match. SET_ORDER places match occurrences outside, so rows[1][0] is the second match’s full text.",
      "trace": "The two counts are both 2, but the indexed values are a and b2. Consumers must be updated when the result orientation changes."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"a\",\"b2\",2,2]",
      "keyEvidence": "Equal counts accompany different nested-index values.",
      "counterexamples": {
        "same-index": "The second value is b2, not a.",
        "same-capture": "The second value includes the full match digit.",
        "full-matches": "The first value is only capture group 1, not a1."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.preg-match-all.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0461",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "curl-custom-method-token-retains-post-behavior",
    "objective": {
      "id": "curl-custom-method-token-retains-post-behavior",
      "text": "Review a cURL handle’s custom method token separately from its configured body and transfer behavior."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish wire method text from the stateful options that configure how libcurl performs the request."
    },
    "prerequisites": [
      "PHP cURL options",
      "CURLOPT_POSTFIELDS",
      "CURLOPT_CUSTOMREQUEST",
      "Stateful handle configuration"
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
        "A fresh HTTP cURL handle is configured with the string POSTFIELDS value a=1, then CURLOPT_CUSTOMREQUEST is set to GET. No later option clears the body or selects CURLOPT_HTTPGET. The required outgoing request is a bodyless GET. No network request is executed for validation."
      ],
      "files": []
    },
    "stem": "A review says changing the custom method string is sufficient to convert the configured POST into the required GET. Which assessment is correct?",
    "options": [
      {
        "id": "automatic-get",
        "text": "The GET token automatically clears POSTFIELDS and switches every transfer option to ordinary GET behavior.",
        "rationale": "CUSTOMREQUEST changes the method text without resetting libcurl’s configured transfer behavior.",
        "misconception": "Treating a custom method label as a complete request-mode reset."
      },
      {
        "id": "query-promotion",
        "text": "libcurl moves a=1 from POSTFIELDS into the query string when the custom method becomes GET.",
        "rationale": "The custom method setting does not relocate body data into the URL.",
        "misconception": "Assuming a method change rewrites the request’s data placement."
      },
      {
        "id": "method-only",
        "text": "The request can carry the GET token while retaining the configured body; explicitly reset the request behavior or configure a fresh bodyless GET.",
        "rationale": "The label and body configuration are separate, so changing one does not establish the required state of the other.",
        "misconception": null
      },
      {
        "id": "post-wins",
        "text": "POSTFIELDS forces the wire method to remain POST, so CUSTOMREQUEST has no effect until the body is removed.",
        "rationale": "The custom method text can override the sent token even while the underlying body behavior remains configured.",
        "misconception": "Assuming the internal request mode necessarily overrides the explicit wire token."
      }
    ],
    "correctOptionId": "method-only",
    "explanation": {
      "summary": "CURLOPT_CUSTOMREQUEST substitutes the method string. It does not by itself undo options such as POSTFIELDS or convert a configured transfer into the behavior associated with that method name.",
      "trace": "The handle still has the body configuration after the custom token changes. A bodyless GET requires its method and body-related state to be configured consistently."
    },
    "validation": {
      "kind": "document-review",
      "rule": "libcurl documents CUSTOMREQUEST as changing the sent method string without changing transfer behavior, and distinguishes it from CURLOPT_HTTPGET.",
      "optionAudit": {
        "automatic-get": "Invents an automatic reset of body options.",
        "query-promotion": "Invents automatic body-to-query conversion.",
        "method-only": "Separates the custom token from configured behavior.",
        "post-wins": "Incorrectly says the explicit custom token is ignored."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://curl.se/libcurl/c/CURLOPT_CUSTOMREQUEST.html",
      "https://curl.se/libcurl/c/CURLOPT_HTTPGET.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0462",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "PDO & database access",
    "subtopic": "pdo-emulated-prepare-server-error-boundary",
    "objective": {
      "id": "pdo-emulated-prepare-server-error-boundary",
      "text": "Review a database error boundary after switching from native to emulated PDO preparation."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate client-side statement construction, server-side execution and exception-mode reporting."
    },
    "prerequisites": [
      "PDO MySQL emulated prepares",
      "ERRMODE_EXCEPTION",
      "Prepare versus execute",
      "Failure boundaries"
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
        "PDO MySQL uses ATTR_EMULATE_PREPARES=true and ERRMODE_EXCEPTION. The SQL is syntactically ordinary: SELECT id FROM absent_table WHERE id = :id. absent_table does not exist, the connection works, and the parameter map supplies id correctly. A try/catch surrounds prepare only; execute and fetch are outside it. No database connection is executed for this scenario."
      ],
      "files": []
    },
    "stem": "A review claims successful prepare means this missing-table error is already covered by the catch. Which assessment matches emulated preparation?",
    "options": [
      {
        "id": "execute-boundary",
        "text": "Emulated prepare need not ask the server to validate the table; execute can throw the missing-table PDOException outside that catch.",
        "rationale": "The server encounters the table reference when the emulated statement is executed, so the error boundary must include that operation.",
        "misconception": null
      },
      {
        "id": "exception-forces-validation",
        "text": "ERRMODE_EXCEPTION forces prepare to validate the table on the server even when preparation is emulated.",
        "rationale": "Exception mode controls error reporting, not whether prepare uses the server’s native preparation mechanism.",
        "misconception": "Treating error-reporting policy as a preparation-mode override."
      },
      {
        "id": "fetch-boundary",
        "text": "The server first checks whether the table exists during fetch, because execute only stores the SQL locally.",
        "rationale": "execute sends the query for server execution; fetching rows is not the first point at which the table is resolved.",
        "misconception": "Confusing execution with deferred local query construction."
      },
      {
        "id": "false-instead",
        "text": "execute returns false rather than throwing, because the prepare call was inside a try/catch.",
        "rationale": "The lexical placement of an earlier catch does not disable ERRMODE_EXCEPTION for execute.",
        "misconception": "Treating a completed catch scope as changing the connection’s later error mode."
      }
    ],
    "correctOptionId": "execute-boundary",
    "explanation": {
      "summary": "Emulated prepare does not necessarily communicate with the server. A successful client-side prepare therefore does not prove that server objects exist, and exception mode can report the error from execute.",
      "trace": "prepare builds an emulated statement. execute submits the query, the server reports the missing table, and the exception occurs outside the shown prepare-only error boundary."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PDO documents that emulated prepare does not communicate with the server and therefore does not validate the statement there; ERRMODE_EXCEPTION reports execution errors as exceptions.",
      "optionAudit": {
        "execute-boundary": "Places the server validation failure at execution and outside the existing catch.",
        "exception-forces-validation": "Conflates preparation mechanism with error mode.",
        "fetch-boundary": "Defers server query validation beyond execution incorrectly.",
        "false-instead": "Ignores the configured exception mode."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdo.prepare.php",
      "https://www.php.net/manual/en/pdo.error-handling.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0463",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Iterators, generators & fibers",
    "subtopic": "multipleiterator-unequal-length-missing-member-policy",
    "objective": {
      "id": "multipleiterator-unequal-length-missing-member-policy",
      "text": "Review lockstep iteration when one attached iterator ends before the others."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish aggregate validity policy from the values supplied by already-exhausted member iterators."
    },
    "prerequisites": [
      "SPL MultipleIterator",
      "MIT_NEED_ANY",
      "MIT_KEYS_ASSOC",
      "Unequal-length input sequences"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$joined = new MultipleIterator(MultipleIterator::MIT_NEED_ANY | MultipleIterator::MIT_KEYS_ASSOC);\n$joined->attachIterator(new ArrayIterator(['A', 'B']), 'name');\n$joined->attachIterator(new ArrayIterator([10]), 'price');\n$rows = [];\n\nforeach ($joined as $row) {\n    $rows[] = $row;\n}\n\necho json_encode($rows);\n"
        }
      ]
    },
    "stem": "A review assumes every emitted row has a numeric price because one price iterator is attached. Which assessment matches NEED_ANY on these inputs?",
    "options": [
      {
        "id": "shortest-stops",
        "text": "Only the A row is emitted because any exhausted member ends the combined iteration.",
        "rationale": "That is the all-members-valid stopping policy, not MIT_NEED_ANY.",
        "misconception": "Reading NEED_ANY as requiring every iterator to remain valid."
      },
      {
        "id": "last-value-reused",
        "text": "The B row reuses price 10 because the exhausted iterator retains its last emitted value.",
        "rationale": "The exhausted member contributes null rather than forward-filling its previous value.",
        "misconception": "Assuming automatic carry-forward of missing joined data."
      },
      {
        "id": "missing-is-error",
        "text": "The second row raises an exception because associative keys require every member to have a current value.",
        "rationale": "With NEED_ANY, the missing member’s current value is represented as null; associative keys do not change that validity policy.",
        "misconception": "Confusing result key labeling with required member validity."
      },
      {
        "id": "null-member",
        "text": "Both names are emitted, but the B row has price null; the consumer must handle the unequal lengths explicitly.",
        "rationale": "The names iterator keeps the combination valid, while the exhausted price iterator contributes null.",
        "misconception": null
      }
    ],
    "correctOptionId": "null-member",
    "explanation": {
      "summary": "MIT_NEED_ANY continues while at least one member iterator remains valid. It does not guarantee every member has a value, nor does it fill from an earlier row.",
      "trace": "The first row is A with price 10. On the next step, only the names iterator is valid, so B is paired with null."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[{\"name\":\"A\",\"price\":10},{\"name\":\"B\",\"price\":null}]",
      "keyEvidence": "The second emitted row contains a null for the exhausted price iterator.",
      "counterexamples": {
        "shortest-stops": "A second row is emitted.",
        "last-value-reused": "The second price is null, not 10.",
        "missing-is-error": "Iteration completes without an exception."
      },
      "contrasts": [
        {
          "name": "all-members-required",
          "marker": "MultipleIterator::MIT_NEED_ANY",
          "replacement": "MultipleIterator::MIT_NEED_ALL",
          "stdout": "[{\"name\":\"A\",\"price\":10}]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/class.multipleiterator.php",
      "https://www.php.net/manual/en/multipleiterator.current.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0464",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Iterators, generators & fibers",
    "subtopic": "no-rewind-iterator-break-does-not-advance",
    "objective": {
      "id": "no-rewind-iterator-break-does-not-advance",
      "text": "Review resumable iteration without confusing suppressed rewind with automatic consumption after break."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track the current element across two foreach constructs and the skipped next step on early exit."
    },
    "prerequisites": [
      "NoRewindIterator",
      "Iterator current and next",
      "foreach advancement",
      "Early loop exit"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$iterator = new NoRewindIterator(new ArrayIterator([10, 20]));\n$taken = [];\n\nforeach ($iterator as $value) {\n    $taken[] = $value;\n    break;\n}\n\n// Second traversal:\nforeach ($iterator as $value) {\n    $taken[] = $value;\n    break;\n}\n\necho json_encode($taken);\n"
        }
      ]
    },
    "stem": "A review expects the second loop to take the next item because rewinding is disabled. Which assessment matches this code?",
    "options": [
      {
        "id": "automatic-consumption",
        "text": "taken is [10,20] because reading current automatically consumes it when rewinding is disabled.",
        "rationale": "Reading current does not call next, and break exits before foreach’s normal advancement.",
        "misconception": "Equating a nonrewindable view with a consuming read operation."
      },
      {
        "id": "current-repeated",
        "text": "taken is [10,10]; break leaves the current position unchanged, so advance explicitly before resuming after that item.",
        "rationale": "NoRewindIterator suppresses rewind but does not add a next call on early exit.",
        "misconception": null
      },
      {
        "id": "wrapper-exhausted",
        "text": "taken is [10] because breaking a NoRewindIterator permanently marks the wrapper exhausted.",
        "rationale": "Breaking the loop does not invalidate the still-current underlying element.",
        "misconception": "Treating an early loop exit as iterator exhaustion."
      },
      {
        "id": "second-loop-error",
        "text": "The second foreach throws because a NoRewindIterator forbids any second traversal attempt.",
        "rationale": "Its rewind operation is ignored rather than throwing, so the second loop starts at the retained current position.",
        "misconception": "Treating ignored rewinds as prohibited iteration attempts."
      }
    ],
    "correctOptionId": "current-repeated",
    "explanation": {
      "summary": "foreach normally advances after an iteration body completes. break exits before that step. The wrapper prevents a rewind on the next foreach but does not move the current position itself.",
      "trace": "The first loop reads 10 and breaks while 10 is still current. The second loop reads that same current item. Calling next between the loops produces 10 then 20."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[10,10]",
      "keyEvidence": "Both loops observe the same current element.",
      "counterexamples": {
        "automatic-consumption": "The second recorded value is 10, not 20.",
        "wrapper-exhausted": "The second loop does execute.",
        "second-loop-error": "No exception occurs."
      },
      "contrasts": [
        {
          "name": "explicit-advance",
          "marker": "// Second traversal:",
          "replacement": "$iterator->next();\n\n// Second traversal:",
          "stdout": "[10,20]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/class.norewinditerator.php",
      "https://www.php.net/manual/en/norewinditerator.next.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0465",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Errors & exceptions",
    "subtopic": "destructor-failure-after-factory-catch-scope",
    "objective": {
      "id": "destructor-failure-after-factory-catch-scope",
      "text": "Review which error boundary can catch a destructor exception after an object has left its factory."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine last-reference destruction timing with the lexical lifetime of a completed try/catch."
    },
    "prerequisites": [
      "Object destruction",
      "Returned object ownership",
      "Exception propagation",
      "try/catch lifetime"
    ],
    "runtime": {
      "php": [
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
        "The displayed guard has no cycles or other references. The explicit unset removes its last reference. The throwing destructor is an intentionally problematic design being reviewed, not recommended cleanup practice."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nclass CleanupGuard\n{\n    public function __destruct()\n    {\n        echo 'cleanup;';\n        throw new RuntimeException('cleanup failed');\n    }\n}\n\nfunction createGuard(): ?CleanupGuard\n{\n    try {\n        return new CleanupGuard();\n    } catch (RuntimeException $failure) {\n        echo 'factory;';\n\n        return null;\n    }\n}\n\ntry {\n    $guard = createGuard();\n    echo 'ready;';\n    unset($guard);\n} catch (RuntimeException $failure) {\n    echo 'caller';\n}\n"
        }
      ]
    },
    "stem": "A review claims the factory’s catch covers every RuntimeException from the guard. Which assessment follows when the caller releases it?",
    "options": [
      {
        "id": "factory-catches-later",
        "text": "The factory prints factory when the caller unsets the object, because the object remembers the catch that created it.",
        "rationale": "The factory’s catch scope has already completed; objects do not retain creation-time exception handlers.",
        "misconception": "Treating a lexical error boundary as attached to an object for its whole lifetime."
      },
      {
        "id": "return-destroys",
        "text": "The destructor runs before createGuard returns, so the factory catches it before ready is printed.",
        "rationale": "The returned object remains referenced by the caller, so returning does not destroy it.",
        "misconception": "Confusing the end of a factory’s local scope with the end of the returned object’s lifetime."
      },
      {
        "id": "destructors-uncatchable",
        "text": "The destructor exception cannot be caught at all, so the caller’s catch never runs.",
        "rationale": "An exception from the explicit unset can propagate to the enclosing caller catch in this fixture.",
        "misconception": "Generalizing shutdown-time destructor hazards to every destructor invocation."
      },
      {
        "id": "caller-boundary",
        "text": "The caller prints ready, then cleanup runs during unset and its exception reaches the caller’s catch, not the completed factory catch.",
        "rationale": "The active error boundary at destruction is the one surrounding the caller’s explicit release.",
        "misconception": null
      }
    ],
    "correctOptionId": "caller-boundary",
    "explanation": {
      "summary": "The factory catch only applies while control executes inside its try. The object outlives that scope, and its destructor runs later when the caller releases the last reference.",
      "trace": "The output is ready;cleanup;caller. If cleanup can fail meaningfully, an explicit operation with a clear caller-owned error boundary is easier to reason about than deferred throwing destruction."
    },
    "validation": {
      "kind": "contract",
      "stdout": "ready;cleanup;caller",
      "keyEvidence": "The caller catches the cleanup failure after the factory has returned.",
      "counterexamples": {
        "factory-catches-later": "No factory marker is printed.",
        "return-destroys": "ready appears before cleanup.",
        "destructors-uncatchable": "The caller marker proves the enclosing catch runs."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.decon.php#language.oop5.decon.destructor",
      "https://www.php.net/manual/en/language.exceptions.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0466",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Operators & expressions",
    "subtopic": "logical-boolean-toggle-not-bitwise-complement",
    "objective": {
      "id": "logical-boolean-toggle-not-bitwise-complement",
      "text": "Toggle a boolean value using logical negation rather than bitwise or presence operations."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose an operation that maps true to false and false to true without changing the input domain."
    },
    "prerequisites": [
      "Boolean values",
      "Logical negation",
      "Bitwise not",
      "Nullable versus boolean values"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction toggle(bool $enabled): bool\n{\n    return $enabled;\n}\n\necho json_encode([toggle(true), toggle(false)]);\n"
        }
      ]
    },
    "stem": "toggle must return the opposite boolean for both inputs. Which expression produces [false,true]?",
    "options": [
      {
        "id": "bitwise",
        "text": "~$enabled",
        "rationale": "Bitwise not is not the logical boolean toggle operation and raises TypeError for a boolean operand.",
        "misconception": "Using a bitwise complement operator as a boolean negation operator."
      },
      {
        "id": "logical",
        "text": "!$enabled",
        "rationale": "Logical negation flips each boolean value and returns a boolean.",
        "misconception": null
      },
      {
        "id": "identity",
        "text": "$enabled",
        "rationale": "This returns each input unchanged.",
        "misconception": "Preserving the flag rather than toggling it."
      },
      {
        "id": "nonnull",
        "text": "$enabled !== null",
        "rationale": "Both allowed inputs are nonnull, so this returns true for both.",
        "misconception": "Confusing boolean false with absence or null."
      }
    ],
    "correctOptionId": "logical",
    "explanation": {
      "summary": "The ! operator performs logical negation. A boolean type does not turn false into null, and bitwise complement is a different operation.",
      "trace": "Negating true yields false; negating false yields true."
    },
    "validation": {
      "kind": "patch",
      "marker": "return $enabled;",
      "candidates": {
        "bitwise": "return ~$enabled;",
        "logical": "return !$enabled;",
        "identity": "return $enabled;",
        "nonnull": "return $enabled !== null;"
      },
      "stdout": "[false,true]",
      "errors": {
        "bitwise": "bitwise not"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.logical.php",
      "https://www.php.net/manual/en/language.operators.bitwise.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0467",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Functions & arguments",
    "subtopic": "ascii-string-fixed-byte-chunks",
    "objective": {
      "id": "ascii-string-fixed-byte-chunks",
      "text": "Split an ASCII string into fixed-size chunks while retaining a final shorter chunk."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish chunk length from delimiter count and from selecting only one substring."
    },
    "prerequisites": [
      "str_split",
      "explode",
      "substr",
      "Array return types"
    ],
    "runtime": {
      "php": [
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
        "The input is ASCII text, so byte positions and character positions coincide. Return all chunks in order, including a final chunk shorter than two bytes."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction chunks(string $text): array\n{\n    return str_split($text);\n}\n\necho json_encode(chunks('ABCDE'));\n"
        }
      ]
    },
    "stem": "Which expression makes chunks return [\"AB\",\"CD\",\"E\"] for the displayed input?",
    "options": [
      {
        "id": "delimiter-split",
        "text": "explode(' ', $text, 2)",
        "rationale": "There is no space delimiter, and the limit controls result count rather than fixed chunk width.",
        "misconception": "Treating explode’s limit as the length of each piece."
      },
      {
        "id": "one-substring",
        "text": "substr($text, 0, 2)",
        "rationale": "This returns only AB as a string, not the required list of all chunks.",
        "misconception": "Confusing selection of one prefix with partitioning the entire input."
      },
      {
        "id": "two-byte-chunks",
        "text": "str_split($text, 2)",
        "rationale": "The second argument sets a two-byte chunk size and retains the final E chunk.",
        "misconception": null
      },
      {
        "id": "single-byte-chunks",
        "text": "str_split($text)",
        "rationale": "The omitted chunk size defaults to one byte.",
        "misconception": "Assuming the default chunk size matches the requested pair width."
      }
    ],
    "correctOptionId": "two-byte-chunks",
    "explanation": {
      "summary": "str_split partitions the string by byte count, and its optional length selects the chunk size. It includes the remaining suffix even when it is shorter than that size.",
      "trace": "The bytes group as AB, CD and E. The ASCII premise makes this a character-pair operation too."
    },
    "validation": {
      "kind": "patch",
      "marker": "str_split($text)",
      "stdout": "[\"AB\",\"CD\",\"E\"]",
      "errors": {
        "one-substring": "Return value must be of type array"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.str-split.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0468",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Arrays & destructuring",
    "subtopic": "array-fill-start-index-entry-count",
    "objective": {
      "id": "array-fill-start-index-entry-count",
      "text": "Create a numeric-keyed map with a chosen starting key and a fixed number of identical initial values."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Keep the start index, entry count and fill value in their separate argument roles."
    },
    "prerequisites": [
      "array_fill",
      "Numeric array keys",
      "Count versus endpoint"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$first = 5;\n$count = 3;\n$allocation = range($first, $first + $count - 1);\n\necho json_encode($allocation);\n"
        }
      ]
    },
    "stem": "The allocation map needs three zero-valued entries at keys 5, 6 and 7. Which expression builds that map?",
    "options": [
      {
        "id": "range-values",
        "text": "range($first, $first + $count - 1)",
        "rationale": "This makes the requested numbers into values at keys 0, 1 and 2, rather than keys with zero values.",
        "misconception": "Confusing the desired key range with a list of values."
      },
      {
        "id": "endpoint-as-count",
        "text": "array_fill($first, $first + $count, 0)",
        "rationale": "The second argument is an entry count, so this creates eight entries rather than three.",
        "misconception": "Passing an ending-index expression where a count is required."
      },
      {
        "id": "start-as-value",
        "text": "array_fill(0, $count, $first)",
        "rationale": "This fills keys 0 through 2 with the value 5, reversing the intended roles.",
        "misconception": "Putting the starting key into the fill-value argument."
      },
      {
        "id": "start-count-value",
        "text": "array_fill($first, $count, 0)",
        "rationale": "The first key is 5, three entries are created, and each value is zero.",
        "misconception": null
      }
    ],
    "correctOptionId": "start-count-value",
    "explanation": {
      "summary": "array_fill takes a starting index, a number of entries and a repeated value. The generated numeric keys advance from the starting index.",
      "trace": "Three entries starting at 5 use keys 5, 6 and 7. Their values are all 0."
    },
    "validation": {
      "kind": "patch",
      "marker": "range($first, $first + $count - 1)",
      "stdout": "{\"5\":0,\"6\":0,\"7\":0}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-fill.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0469",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Variables, scope & constants",
    "subtopic": "magic-method-label-declaring-class-and-method",
    "objective": {
      "id": "magic-method-label-declaring-class-and-method",
      "text": "Select the magic constant that names a method together with its declaring class."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish method identity from a bare method name and the class used to make an inherited call."
    },
    "prerequisites": [
      "Magic constants",
      "Inherited methods",
      "self and static class names"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass BaseLog\n{\n    public function tag(): string\n    {\n        return __FUNCTION__;\n    }\n}\n\nclass ChildLog extends BaseLog\n{\n}\n\necho (new ChildLog())->tag();\n"
        }
      ]
    },
    "stem": "The diagnostic label must be BaseLog::tag, identifying where the method is declared even when called on ChildLog. Which expression supplies it?",
    "options": [
      {
        "id": "method-identity",
        "text": "__METHOD__",
        "rationale": "This includes the declaring class and method name: BaseLog::tag.",
        "misconception": null
      },
      {
        "id": "bare-method",
        "text": "__FUNCTION__",
        "rationale": "Inside the method this supplies tag without its class name.",
        "misconception": "Using a function-name constant when a qualified method identity is required."
      },
      {
        "id": "declaring-class",
        "text": "self::class",
        "rationale": "This supplies BaseLog but omits the method name.",
        "misconception": "Using only the declaration’s class identity for a method label."
      },
      {
        "id": "called-class",
        "text": "static::class",
        "rationale": "This supplies ChildLog through late static binding and also omits the method name.",
        "misconception": "Using the called class rather than the declaring method’s identity."
      }
    ],
    "correctOptionId": "method-identity",
    "explanation": {
      "summary": "__METHOD__ identifies the method’s declaration, including its class. It does not change to the subclass merely because that subclass inherited and invoked the method.",
      "trace": "The inherited body is still BaseLog::tag, which is the required diagnostic label."
    },
    "validation": {
      "kind": "patch",
      "marker": "__FUNCTION__",
      "stdout": "BaseLog::tag",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-02"
    },
    "references": [
      "https://www.php.net/manual/en/language.constants.magic.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0470",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Functions & arguments",
    "subtopic": "hexadecimal-text-to-complete-byte-string",
    "objective": {
      "id": "hexadecimal-text-to-complete-byte-string",
      "text": "Decode every hexadecimal byte pair into its corresponding binary byte, including a leading zero byte."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish decoding a byte representation from interpreting it as one number or as another encoding."
    },
    "prerequisites": [
      "Hexadecimal byte pairs",
      "Binary strings",
      "Representation conversion"
    ],
    "runtime": {
      "php": [
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
        "The input contains a valid even number of hexadecimal digits. Uppercase and lowercase hex digits are both permitted. The entire resulting byte string must be retained, including NUL bytes."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction decodeHex(string $hex): string\n{\n    return $hex;\n}\n\n$bytes = decodeHex('00aF10');\necho bin2hex($bytes);\n"
        }
      ]
    },
    "stem": "Which expression decodes 00aF10 so the verification prints 00af10?",
    "options": [
      {
        "id": "hex-bytes",
        "text": "hex2bin($hex)",
        "rationale": "Each pair becomes one byte, preserving the leading zero byte and both following bytes.",
        "misconception": null
      },
      {
        "id": "base64-bytes",
        "text": "base64_decode($hex, true)",
        "rationale": "This interprets the characters using the base64 alphabet and produces different bytes.",
        "misconception": "Treating different text encodings of binary data as interchangeable."
      },
      {
        "id": "one-character",
        "text": "chr(hexdec($hex) & 0xff)",
        "rationale": "This converts the whole input into one number and then one byte, losing the multi-byte sequence.",
        "misconception": "Collapsing a byte sequence into a single character code."
      },
      {
        "id": "unchanged-text",
        "text": "$hex",
        "rationale": "This retains the six hexadecimal characters as six text bytes instead of decoding three bytes.",
        "misconception": "Treating hexadecimal display text as if it were already the represented binary data."
      }
    ],
    "correctOptionId": "hex-bytes",
    "explanation": {
      "summary": "hex2bin decodes two hexadecimal digits per output byte. Numeric conversion is different: it does not preserve a sequence’s leading zero bytes or its full byte width.",
      "trace": "00, aF and 10 become bytes 00 AF 10. bin2hex displays those three bytes as lowercase hex 00af10."
    },
    "validation": {
      "kind": "patch",
      "marker": "return $hex;",
      "candidates": {
        "hex-bytes": "return hex2bin($hex);",
        "base64-bytes": "return base64_decode($hex, true);",
        "one-character": "return chr(hexdec($hex) & 0xff);",
        "unchanged-text": "return $hex;"
      },
      "stdout": "00af10",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.hex2bin.php",
      "https://www.php.net/manual/en/function.chr.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0471",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Types, casting & comparisons",
    "subtopic": "iterable-admission-not-countable-or-object",
    "objective": {
      "id": "iterable-admission-not-countable-or-object",
      "text": "Accept arrays and Traversable objects without accepting every object that can be counted."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate traversal capability from object identity and Countable membership."
    },
    "prerequisites": [
      "Arrays",
      "Traversable",
      "Countable",
      "Runtime type predicates"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass CountOnly implements Countable\n{\n    public function count(): int\n    {\n        return 0;\n    }\n}\n\nfunction accepted(mixed $value): bool\n{\n    return is_object($value);\n}\n\n$values = [[], new ArrayIterator([]), new CountOnly(), new stdClass()];\necho json_encode(array_map('accepted', $values));\n"
        }
      ]
    },
    "stem": "The API accepts arrays and Traversable objects only. Which predicate yields [true,true,false,false] for the displayed values?",
    "options": [
      {
        "id": "arrays-only",
        "text": "is_array($value)",
        "rationale": "This rejects the ArrayIterator even though it implements traversal.",
        "misconception": "Restricting an iterable contract to arrays alone."
      },
      {
        "id": "objects-only",
        "text": "is_object($value)",
        "rationale": "This rejects arrays and accepts the two non-Traversable objects.",
        "misconception": "Using object type as a proxy for the requested traversal capability."
      },
      {
        "id": "iterable",
        "text": "is_iterable($value)",
        "rationale": "This accepts arrays and Traversable instances, matching the stated API type set.",
        "misconception": null
      },
      {
        "id": "countable",
        "text": "is_countable($value)",
        "rationale": "CountOnly is countable but does not implement Traversable.",
        "misconception": "Assuming the ability to count implies the requested iteration interface."
      }
    ],
    "correctOptionId": "iterable",
    "explanation": {
      "summary": "is_iterable recognizes the PHP iterable type set: arrays and Traversable objects. Countable is a separate capability, and being an object alone is not sufficient for this contract.",
      "trace": "The array and ArrayIterator pass. CountOnly and stdClass do not implement Traversable and therefore fail."
    },
    "validation": {
      "kind": "patch",
      "marker": "is_object($value)",
      "stdout": "[true,true,false,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/function.is-iterable.php",
      "https://www.php.net/manual/en/class.countable.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0472",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Functions & arguments",
    "subtopic": "literal-case-sensitive-suffix-predicate",
    "objective": {
      "id": "literal-case-sensitive-suffix-predicate",
      "text": "Require a literal case-sensitive suffix at the end of a label rather than anywhere within it."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish suffix matching from substring or prefix matching and retain the dot in the suffix width."
    },
    "prerequisites": [
      "str_ends_with",
      "str_contains",
      "str_starts_with",
      "String offsets"
    ],
    "runtime": {
      "php": [
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
        "Labels are ASCII strings. This is only a label-matching requirement, not validation of uploaded file contents or trusted filesystem paths. The suffix is exactly .json with lowercase letters."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction matchingLabel(string $label): bool\n{\n    return str_contains($label, '.json');\n}\n\necho json_encode(array_map('matchingLabel', [\n    'report.json',\n    'report.json.bak',\n    '.json',\n    'report.JSON',\n]));\n"
        }
      ]
    },
    "stem": "Which predicate accepts report.json and .json, but rejects report.json.bak and report.JSON?",
    "options": [
      {
        "id": "contains",
        "text": "str_contains($label, '.json')",
        "rationale": "The backup label contains .json but does not end with it.",
        "misconception": "Treating occurrence anywhere as a suffix requirement."
      },
      {
        "id": "suffix",
        "text": "str_ends_with($label, '.json')",
        "rationale": "This checks the exact case-sensitive suffix at the end of each label.",
        "misconception": null
      },
      {
        "id": "prefix",
        "text": "str_starts_with($label, '.json')",
        "rationale": "The ordinary report.json label does not start with the required text.",
        "misconception": "Checking the opposite boundary of the string."
      },
      {
        "id": "four-byte-tail",
        "text": "substr($label, -4) === '.json'",
        "rationale": "The required suffix has five bytes including the dot, so a four-byte tail cannot equal it.",
        "misconception": "Counting only the extension letters while comparing a dot-inclusive suffix."
      }
    ],
    "correctOptionId": "suffix",
    "explanation": {
      "summary": "str_ends_with checks the whole literal suffix at the final boundary and compares case-sensitively. It does not classify content or accept a suffix followed by more text.",
      "trace": "The first and third labels end in .json. The second has a later .bak suffix, and the fourth uses different letter case."
    },
    "validation": {
      "kind": "patch",
      "marker": "str_contains($label, '.json')",
      "stdout": "[true,false,true,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.str-ends-with.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0473",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Validation & web security",
    "subtopic": "unicode-canonical-composition-without-compatibility-folding",
    "objective": {
      "id": "unicode-canonical-composition-without-compatibility-folding",
      "text": "Normalize canonical Unicode equivalents into composed storage without folding compatibility characters or changing case."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish canonical composition from compatibility normalization, decomposition and lowercasing."
    },
    "prerequisites": [
      "Unicode canonical equivalence",
      "NFC versus NFKC",
      "Intl Normalizer",
      "UTF-8 representation"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "intl",
        "mbstring"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "Input is valid UTF-8. Storage requires NFC: e followed by U+0301 must become U+00E9, while fullwidth A U+FF21 and uppercase É U+00C9 retain their distinctions. This policy does not perform case-insensitive matching."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction storageForm(string $text): string\n{\n    return Normalizer::normalize($text, Normalizer::FORM_KC);\n}\n\n$normalized = [\n    storageForm(\"e\\u{0301}\"),\n    storageForm(\"\\u{FF21}\"),\n    storageForm('É'),\n];\n\necho json_encode(array_map('bin2hex', $normalized));\n"
        }
      ]
    },
    "stem": "Which expression implements the storage policy? The hexadecimal output makes composed and decomposed forms distinguishable.",
    "options": [
      {
        "id": "compatibility",
        "text": "Normalizer::normalize($text, Normalizer::FORM_KC)",
        "rationale": "Compatibility normalization also folds fullwidth A into ordinary ASCII A.",
        "misconception": "Using compatibility equivalence when the policy preserves those distinctions."
      },
      {
        "id": "decomposition",
        "text": "Normalizer::normalize($text, Normalizer::FORM_D)",
        "rationale": "This chooses canonical decomposition, so the stored accented letters are not in the required composed form.",
        "misconception": "Treating any canonical normalization form as the same storage representation."
      },
      {
        "id": "lowercase",
        "text": "mb_strtolower($text, 'UTF-8')",
        "rationale": "Lowercasing changes uppercase É and does not supply the required canonical composition of the decomposed input.",
        "misconception": "Confusing Unicode case conversion with normalization."
      },
      {
        "id": "canonical-composition",
        "text": "Normalizer::normalize($text, Normalizer::FORM_C)",
        "rationale": "Canonical composition produces NFC while preserving the compatibility distinction and case.",
        "misconception": null
      }
    ],
    "correctOptionId": "canonical-composition",
    "explanation": {
      "summary": "FORM_C performs canonical composition. FORM_KC additionally removes compatibility distinctions, and case conversion is a separate transformation that this policy does not request.",
      "trace": "The output code points are U+00E9, U+FF21 and U+00C9, encoded as C3 A9, EF BC A1 and C3 89."
    },
    "validation": {
      "kind": "patch",
      "marker": "Normalizer::normalize($text, Normalizer::FORM_KC)",
      "stdout": "[\"c3a9\",\"efbca1\",\"c389\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/normalizer.normalize.php",
      "https://www.unicode.org/reports/tr15/"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0474",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Functions & arguments",
    "subtopic": "bcmath-decimal-addition-scale-without-float-conversion",
    "objective": {
      "id": "bcmath-decimal-addition-scale-without-float-conversion",
      "text": "Add a decimal fee using string-based arithmetic while preserving a fixed two-digit fractional representation."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Avoid both binary floating-point precision loss and unintended BCMath scale truncation."
    },
    "prerequisites": [
      "BCMath decimal strings",
      "bcadd scale",
      "Binary floating-point limits",
      "Fixed decimal output"
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
        "Amounts are valid nonnegative decimal strings with exactly two fractional digits. The result must remain a decimal string with exactly two fractional digits, including for values beyond exact binary64 representation. No rounding beyond the displayed addition is required."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nbcscale(0);\n\nfunction withFee(string $amount): string\n{\n    return bcadd($amount, '0.10');\n}\n\necho json_encode([\n    withFee('9007199254740992.01'),\n    withFee('0.20'),\n]);\n"
        }
      ]
    },
    "stem": "Which return expression adds 0.10 exactly for both amounts and preserves the required two-digit scale?",
    "options": [
      {
        "id": "float-format",
        "text": "number_format((float) $amount + 0.10, 2, '.', '')",
        "rationale": "Converting the large amount to binary64 loses fractional precision before formatting.",
        "misconception": "Assuming decimal formatting can recover precision already lost in arithmetic."
      },
      {
        "id": "explicit-scale",
        "text": "bcadd($amount, '0.10', 2)",
        "rationale": "BCMath operates on the decimal strings and the explicit scale retains two fractional digits.",
        "misconception": null
      },
      {
        "id": "default-scale",
        "text": "bcadd($amount, '0.10')",
        "rationale": "The displayed default scale is zero, so the fractional portion is omitted.",
        "misconception": "Assuming the input strings’ scale automatically controls the result scale."
      },
      {
        "id": "one-digit-scale",
        "text": "bcadd($amount, '0.10', 1)",
        "rationale": "One fractional digit cannot preserve the large result’s final cent or the required two-digit formatting.",
        "misconception": "Confusing the fee’s significant decimal digit with the required output scale."
      }
    ],
    "correctOptionId": "explicit-scale",
    "explanation": {
      "summary": "BCMath accepts decimal strings without converting them through binary floats. Its scale parameter controls the number of fractional digits in the result independently of the input formatting.",
      "trace": "The exact results are 9007199254740992.11 and 0.30. Passing scale 2 preserves both the arithmetic and the wire representation."
    },
    "validation": {
      "kind": "patch",
      "marker": "bcadd($amount, '0.10')",
      "stdout": "[\"9007199254740992.11\",\"0.30\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.bcadd.php",
      "https://www.php.net/manual/en/function.bcscale.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0475",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Functions & arguments",
    "subtopic": "utf8-prefix-byte-budget-without-splitting-character",
    "objective": {
      "id": "utf8-prefix-byte-budget-without-splitting-character",
      "text": "Take the longest UTF-8 prefix within a byte budget without splitting an encoded character."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish byte limits from character counts and display-column widths."
    },
    "prerequisites": [
      "UTF-8 variable-width characters",
      "mb_strcut",
      "mb_substr",
      "Byte budgets"
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
        "Input is valid UTF-8. Return the longest prefix of complete characters occupying at most three bytes. Do not skip a character to include later ones, add markers or pad. Hexadecimal output is used to expose invalid partial encodings in alternatives."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction bytePrefix(string $text): string\n{\n    return substr($text, 0, 3);\n}\n\n$prefixes = [bytePrefix('A€B'), bytePrefix('éBC'), bytePrefix('ABCD')];\necho json_encode(array_map('bin2hex', $prefixes));\n"
        }
      ]
    },
    "stem": "Which expression yields prefixes A, éB and ABC for the three inputs?",
    "options": [
      {
        "id": "safe-byte-cut",
        "text": "mb_strcut($text, 0, 3, 'UTF-8')",
        "rationale": "This respects the byte limit and cuts back to a complete UTF-8 character boundary.",
        "misconception": null
      },
      {
        "id": "character-count",
        "text": "mb_substr($text, 0, 3, 'UTF-8')",
        "rationale": "Three characters may require more than three bytes, as both non-ASCII examples show.",
        "misconception": "Using a character-count limit for a byte-constrained field."
      },
      {
        "id": "raw-byte-cut",
        "text": "substr($text, 0, 3)",
        "rationale": "For A€B, the cut includes only two of the euro sign’s three bytes.",
        "misconception": "Assuming arbitrary byte boundaries are valid UTF-8 character boundaries."
      },
      {
        "id": "display-width",
        "text": "mb_strimwidth($text, 0, 3, '', 'UTF-8')",
        "rationale": "Display width is not encoded byte length; the selected text can exceed the three-byte budget.",
        "misconception": "Using terminal or display width as a transport-size measure."
      }
    ],
    "correctOptionId": "safe-byte-cut",
    "explanation": {
      "summary": "mb_strcut limits encoded bytes while preserving complete characters for the chosen encoding. mb_substr counts characters, and display-width trimming answers another question entirely.",
      "trace": "A fits but adding € would exceed three bytes, so the first prefix is A. é uses two bytes, leaving room for B. ASCII permits ABC."
    },
    "validation": {
      "kind": "patch",
      "marker": "substr($text, 0, 3)",
      "stdout": "[\"41\",\"c3a942\",\"414243\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.mb-strcut.php",
      "https://www.php.net/manual/en/function.mb-strimwidth.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0476",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Validation & web security",
    "subtopic": "cryptographic-token-entropy-versus-encoded-width",
    "objective": {
      "id": "cryptographic-token-entropy-versus-encoded-width",
      "text": "Choose a hexadecimal bearer-token generator meeting both an entropy budget and a wire-length contract."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Translate bytes into bits and hexadecimal characters without mistaking padding for randomness."
    },
    "prerequisites": [
      "Cryptographic random bytes",
      "Hexadecimal encoding",
      "Entropy versus representation length"
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
        "The token must contain 128 independently generated random bits and be represented by exactly 32 lowercase hexadecimal characters. PHP is 64-bit, the operating-system random source works, and generation failures must propagate. No uniqueness guarantee is implied."
      ],
      "files": []
    },
    "stem": "Which expression meets both token requirements?",
    "options": [
      {
        "id": "short-bytes",
        "text": "bin2hex(random_bytes(8))",
        "rationale": "Eight random bytes provide only 64 bits and encode to 16 hexadecimal characters.",
        "misconception": "Counting two hex characters as two independent random bytes."
      },
      {
        "id": "integer-padding",
        "text": "str_pad(dechex(random_int(0, PHP_INT_MAX)), 32, '0', STR_PAD_LEFT)",
        "rationale": "The range contains only 2^63 possible values; deterministic leading zeroes add no entropy.",
        "misconception": "Equating padded output width with the size of the random state space."
      },
      {
        "id": "sixteen-bytes",
        "text": "bin2hex(random_bytes(16))",
        "rationale": "Sixteen cryptographically random bytes contain 128 bits and encode to 32 hex characters.",
        "misconception": null
      },
      {
        "id": "thirty-two-bytes",
        "text": "bin2hex(random_bytes(32))",
        "rationale": "This generates 256 bits but encodes to 64 characters, exceeding the fixed wire length.",
        "misconception": "Using the desired hex-character count as the random-byte count."
      }
    ],
    "correctOptionId": "sixteen-bytes",
    "explanation": {
      "summary": "One byte carries eight bits and becomes two hexadecimal characters. Encoding and padding do not add independent randomness, so both the source-byte count and encoded length matter.",
      "trace": "16 × 8 = 128 random bits; 16 × 2 = 32 hexadecimal characters. A 63-bit integer remains a 63-bit choice after padding."
    },
    "validation": {
      "kind": "document-review",
      "rule": "random_bytes supplies cryptographically secure random bytes; bin2hex represents each byte with two hex digits. The entropy arithmetic is reviewed, not inferred from a statistical sample.",
      "optionAudit": {
        "short-bytes": "Fails both bit and character counts.",
        "integer-padding": "Meets width but has at most 63 random bits.",
        "sixteen-bytes": "Meets the 128-bit and 32-character requirements.",
        "thirty-two-bytes": "Exceeds the fixed representation width."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.random-bytes.php",
      "https://www.php.net/manual/en/function.bin2hex.php",
      "https://www.php.net/manual/en/function.random-int.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0477",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Forms & file uploads",
    "subtopic": "localized-number-parser-full-input-consumption",
    "objective": {
      "id": "localized-number-parser-full-input-consumption",
      "text": "Accept a localized numeric value only when parsing succeeds and consumes the entire input."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine a strict failure check with a parser position check while retaining valid zero."
    },
    "prerequisites": [
      "Intl NumberFormatter",
      "Parse offsets",
      "Strict false checks",
      "Nullable returns"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "intl"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "Inputs in this question are ASCII strings. The required decimal syntax uses the de_DE locale. Trailing text is invalid, and zero is valid. NumberFormatter is configured as displayed with no custom parsing attributes."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction localizedNumber(string $text): ?float\n{\n    $formatter = new NumberFormatter('de_DE', NumberFormatter::DECIMAL);\n    $position = 0;\n    $value = $formatter->parse($text, NumberFormatter::TYPE_DOUBLE, $position);\n\n    if ($value === false) {\n        return null;\n    }\n\n    return $value;\n}\n\necho json_encode([\n    localizedNumber('1,5'),\n    localizedNumber('1,5x'),\n    localizedNumber('0'),\n]);\n"
        }
      ]
    },
    "stem": "Which rejection condition accepts 1,5 and 0 while rejecting the incomplete parse of 1,5x?",
    "options": [
      {
        "id": "false-only",
        "text": "$value === false",
        "rationale": "A successfully parsed prefix is not false, even when trailing text remains.",
        "misconception": "Treating parse success as proof of full-input validation."
      },
      {
        "id": "falsy-value",
        "text": "!$value",
        "rationale": "This rejects valid zero while still accepting the nonzero numeric prefix of 1,5x.",
        "misconception": "Using truthiness for a numeric parser result."
      },
      {
        "id": "unchanged-position",
        "text": "$value === false || $position !== 0",
        "rationale": "A successful parse advances the position, so this rejects the valid inputs.",
        "misconception": "Treating the parse position as an error offset that must remain zero."
      },
      {
        "id": "whole-input",
        "text": "$value === false || $position !== strlen($text)",
        "rationale": "The strict failure check preserves zero, and the position comparison rejects unconsumed suffixes.",
        "misconception": null
      }
    ],
    "correctOptionId": "whole-input",
    "explanation": {
      "summary": "NumberFormatter can successfully parse a numeric prefix. Its output position identifies where parsing stopped; for the stated ASCII inputs, comparing that position with strlen verifies complete consumption.",
      "trace": "The valid decimal consumes three characters, the same prefix in 1,5x leaves x unconsumed, and zero consumes its one-character input without becoming a failure."
    },
    "validation": {
      "kind": "patch",
      "marker": "$value === false",
      "stdout": "[1.5,null,0]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-12"
    },
    "references": [
      "https://www.php.net/manual/en/numberformatter.parse.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0478",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "zip-entry-content-snapshot-versus-open-file",
    "objective": {
      "id": "zip-entry-content-snapshot-versus-open-file",
      "text": "Capture archive-entry bytes before an in-place source-file rewrite, rather than merely capturing a path or open descriptor."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Reason about deferred archive I/O, file identity and immutable byte snapshots."
    },
    "prerequisites": [
      "ZipArchive (advanced)",
      "Deferred file reads",
      "File descriptors versus byte copies",
      "POSIX in-place writes"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "zip"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The small fixture runs on a POSIX filesystem. All file and archive operations succeed. Both source versions are nine bytes. The rewrite modifies the existing file in place, without replacing its inode. PHP supports FL_OPEN_FILE_NOW. Memory can hold this small entry."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$path = __DIR__ . '/report.txt';\nfile_put_contents($path, 'version-a');\n\n$zip = new ZipArchive();\n$zip->open(__DIR__ . '/report.zip', ZipArchive::CREATE | ZipArchive::OVERWRITE);\n$zip->addFile($path, 'report.txt');\n\n$writer = fopen($path, 'r+b');\nfwrite($writer, 'version-b');\nfclose($writer);\n$zip->close();\n\n$reader = new ZipArchive();\n$reader->open(__DIR__ . '/report.zip');\necho $reader->getFromName('report.txt');\n$reader->close();\n"
        }
      ]
    },
    "stem": "Which add operation guarantees that report.txt in the completed archive contains version-a despite the subsequent in-place rewrite?",
    "options": [
      {
        "id": "deferred-file",
        "text": "$zip->addFile($path, 'report.txt');",
        "rationale": "The file-backed source can be read when the archive closes, after the rewrite.",
        "misconception": "Treating adding a file source as immediately copying its bytes."
      },
      {
        "id": "fixed-length",
        "text": "$zip->addFile($path, 'report.txt', 0, 9);",
        "rationale": "A fixed length limits how many bytes are read; it does not freeze their earlier values.",
        "misconception": "Confusing a captured file length with a content snapshot."
      },
      {
        "id": "snapshot-string",
        "text": "$zip->addFromString('report.txt', file_get_contents($path));",
        "rationale": "file_get_contents obtains the earlier bytes immediately, and addFromString uses that string as the entry data.",
        "misconception": null
      },
      {
        "id": "open-now",
        "text": "$zip->addFile($path, 'report.txt', 0, 0, ZipArchive::FL_OPEN_FILE_NOW);",
        "rationale": "Opening the file early preserves a descriptor, not a private copy of bytes later overwritten in that same file.",
        "misconception": "Assuming an open descriptor snapshots file contents."
      }
    ],
    "correctOptionId": "snapshot-string",
    "explanation": {
      "summary": "A file source and a byte string have different lifetimes. Copying the current content into a string captures version-a before the rewrite; fixing a size or opening a descriptor still leaves a file-backed source.",
      "trace": "The string is obtained while the source contains version-a. The later write changes only the file, so closing the archive stores the previously captured string."
    },
    "validation": {
      "kind": "patch",
      "marker": "$zip->addFile($path, 'report.txt');",
      "stdout": "version-a",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/ziparchive.addfile.php",
      "https://www.php.net/manual/en/ziparchive.addfromstring.php",
      "https://libzip.org/documentation/zip_source_file/"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0479",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Validation & web security",
    "subtopic": "aead-associated-data-trusted-destination-context",
    "objective": {
      "id": "aead-associated-data-trusted-destination-context",
      "text": "Bind authenticated decryption to the trusted destination context rather than a replayed envelope’s claimed context."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine AEAD associated-data integrity with the application’s independent tenant boundary."
    },
    "prerequisites": [
      "Authenticated encryption (advanced)",
      "XChaCha20-Poly1305 associated data",
      "Cross-context replay",
      "Trusted versus stored metadata"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "sodium"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "The fixed key and nonce are public test fixtures only. Production key management and nonce generation are outside this question. The caller supplies expectedTenant from its authenticated context. An attacker can copy the whole stored envelope between tenants, including its claimedTenant. The same encryption key serves both tenants."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$key = str_repeat('K', SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_KEYBYTES);\n$nonce = str_repeat('N', SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);\n$envelope = [\n    'claimedTenant' => 'tenant-a',\n    'ciphertext' => sodium_crypto_aead_xchacha20poly1305_ietf_encrypt(\n        'private record',\n        'tenant-a',\n        $nonce,\n        $key,\n    ),\n];\n\nfunction openRecord(array $envelope, string $expectedTenant, string $nonce, string $key): string|false\n{\n    return sodium_crypto_aead_xchacha20poly1305_ietf_decrypt(\n        $envelope['ciphertext'],\n        $envelope['claimedTenant'],\n        $nonce,\n        $key,\n    );\n}\n\necho json_encode([\n    openRecord($envelope, 'tenant-a', $nonce, $key),\n    openRecord($envelope, 'tenant-b', $nonce, $key),\n]);\n"
        }
      ]
    },
    "stem": "Which associated-data expression accepts the original tenant’s message and rejects replay to a different expected tenant?",
    "options": [
      {
        "id": "stored-claim",
        "text": "$envelope['claimedTenant']",
        "rationale": "A copied envelope brings its original claim, so decryption still succeeds in the wrong destination context.",
        "misconception": "Treating authenticated stored metadata as proof of the current caller’s context."
      },
      {
        "id": "expected-context",
        "text": "$expectedTenant",
        "rationale": "The original trusted context reproduces the encryption’s associated data; a different context fails authentication.",
        "misconception": null
      },
      {
        "id": "empty-context",
        "text": "''",
        "rationale": "The encryptor used tenant-a as associated data, so an empty string rejects even the legitimate message.",
        "misconception": "Assuming associated data is optional during verification after it was used for encryption."
      },
      {
        "id": "hashed-context",
        "text": "hash('sha256', $expectedTenant, true)",
        "rationale": "A digest is a different byte string from the raw associated data used by the encryptor, so the valid message also fails.",
        "misconception": "Assuming semantically related metadata representations authenticate interchangeably."
      }
    ],
    "correctOptionId": "expected-context",
    "explanation": {
      "summary": "AEAD authenticates exact associated-data bytes. The receiver must obtain the required context independently; replaying a valid envelope and its own claim cannot establish that it belongs to the current tenant.",
      "trace": "tenant-a reproduces the original associated data and yields private record. tenant-b changes the authenticated bytes, so verification returns false."
    },
    "validation": {
      "kind": "patch",
      "marker": "$envelope['claimedTenant']",
      "stdout": "[\"private record\",false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.sodium-crypto-aead-xchacha20poly1305-ietf-decrypt.php",
      "https://doc.libsodium.org/secret-key_cryptography/aead"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0480",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "atomic-publication-versus-crash-durable-directory-entry",
    "objective": {
      "id": "atomic-publication-versus-crash-durable-directory-entry",
      "text": "Order file-data synchronization and directory-entry synchronization before acknowledging durable publication."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Separate buffered writes, atomic visibility and crash durability under an explicit filesystem contract."
    },
    "prerequisites": [
      "Filesystem durability (advanced)",
      "fflush versus fsync",
      "Atomic same-filesystem rename",
      "Directory entries"
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
        "A PHP publisher writes a complete temporary file beside its destination on a Linux filesystem. This deployment guarantees atomic replacement by same-filesystem rename and durable file data after successful fsync. A trusted native helper can fsync the parent directory and reports failures. There are no concurrent publishers; all required operations must succeed before acknowledgement. A power failure can occur immediately after acknowledgement. The requirement includes durability of both content and the new name binding."
      ],
      "files": []
    },
    "stem": "Which publication sequence meets the stated durability contract?",
    "options": [
      {
        "id": "rename-after-flush",
        "text": "Write the temporary file, fflush it, rename it over the destination, then acknowledge.",
        "rationale": "Flushing PHP buffers does not establish persistent file data or a persistent directory update.",
        "misconception": "Equating userspace flushing and atomic visibility with crash durability."
      },
      {
        "id": "lock-and-rename",
        "text": "Lock the temporary file, write and close it, rename it over the destination, then acknowledge.",
        "rationale": "A lock coordinates access but does not supply either required storage synchronization.",
        "misconception": "Treating mutual exclusion as a persistence guarantee."
      },
      {
        "id": "file-sync-only",
        "text": "Write and fsync the temporary file, close it, rename it over the destination, then acknowledge.",
        "rationale": "The content is synchronized, but the rename’s directory entry has not been made durable under the given contract.",
        "misconception": "Assuming synchronizing a file also synchronizes its later directory-name change."
      },
      {
        "id": "file-then-directory",
        "text": "Write and fsync the temporary file, close it, rename it over the destination, fsync the parent directory, then acknowledge.",
        "rationale": "The content is durable before publication, and the subsequent directory synchronization makes the name change durable before acknowledgement.",
        "misconception": null
      }
    ],
    "correctOptionId": "file-then-directory",
    "explanation": {
      "summary": "Atomic rename controls what concurrent readers can observe; it is not by itself an acknowledgement of durable storage. The stated contract needs the file data synchronized first and the directory update synchronized after rename.",
      "trace": "Data reaches stable storage before the temporary name is published. The directory helper then persists the destination binding. Any failure prevents a success acknowledgement."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP fsync requests file synchronization. Linux documents that persisting the containing directory entry requires a separate directory fsync. No power-failure simulation is claimed.",
      "optionAudit": {
        "rename-after-flush": "Omits storage synchronization for content and name.",
        "lock-and-rename": "Adds coordination but no durability barrier.",
        "file-sync-only": "Leaves the post-rename directory update unsynchronized.",
        "file-then-directory": "Orders both required barriers before success."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.fsync.php",
      "https://man7.org/linux/man-pages/man2/fsync.2.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0481",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Validation & web security",
    "subtopic": "equivalent-ipv6-spellings-address-identity-test",
    "objective": {
      "id": "equivalent-ipv6-spellings-address-identity-test",
      "text": "Test address identity across valid compressed and expanded IPv6 text representations."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish normalized letter case from the binary identity of a parsed network address."
    },
    "prerequisites": [
      "IPv6 text compression",
      "inet_pton",
      "Strict binary-string comparison"
    ],
    "runtime": {
      "php": [
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
        "Every input is a valid bare IPv4 or IPv6 address with no port, brackets or zone ID. Equality means the same address bytes within the same address family; IPv4-mapped IPv6 addresses need not equal IPv4 addresses. No network lookup is performed."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction sameAddress(string $left, string $right): bool\n{\n    return strtolower($left) === strtolower($right);\n}\n"
        }
      ]
    },
    "stem": "Which true-equality case exposes the implementation’s failure to recognize equivalent address spellings?",
    "options": [
      {
        "id": "same-ipv4",
        "text": "192.0.2.1 and 192.0.2.1 → true",
        "rationale": "Identical IPv4 text passes both implementations.",
        "misconception": "Testing only identical representations of an address."
      },
      {
        "id": "case-only",
        "text": "2001:DB8::1 and 2001:db8::1 → true",
        "rationale": "The existing lowercase conversion already handles this difference.",
        "misconception": "Assuming hex-letter case is the only alternate IPv6 spelling."
      },
      {
        "id": "compression",
        "text": "2001:db8::1 and 2001:0db8:0:0:0:0:0:1 → true",
        "rationale": "These have identical parsed bytes but remain different strings after lowercasing.",
        "misconception": null
      },
      {
        "id": "same-loopback",
        "text": "::1 and ::1 → true",
        "rationale": "The repeated compressed form is textually identical, so it does not expose representation variation.",
        "misconception": "Using a special address without changing its spelling."
      }
    ],
    "correctOptionId": "compression",
    "explanation": {
      "summary": "IPv6 permits omitted zero groups and omitted leading zeroes. Case folding cannot canonicalize those structural differences; inet_pton parses each valid address into a comparable byte string.",
      "trace": "The compression fixture produces unequal lowercase strings but equal 16-byte IPv6 values. The other true-equality cases already pass the flawed comparison."
    },
    "validation": {
      "kind": "tests",
      "marker": "strtolower($left) === strtolower($right)",
      "repair": "inet_pton($left) === inet_pton($right)",
      "cases": [
        {
          "option": "same-ipv4",
          "probe": "echo json_encode(sameAddress('192.0.2.1', '192.0.2.1'));",
          "expected": "true"
        },
        {
          "option": "case-only",
          "probe": "echo json_encode(sameAddress('2001:DB8::1', '2001:db8::1'));",
          "expected": "true"
        },
        {
          "option": "compression",
          "probe": "echo json_encode(sameAddress('2001:db8::1', '2001:0db8:0:0:0:0:0:1'));",
          "expected": "true"
        },
        {
          "option": "same-loopback",
          "probe": "echo json_encode(sameAddress('::1', '::1'));",
          "expected": "true"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.inet-pton.php",
      "https://www.rfc-editor.org/rfc/rfc4291.html#section-2.2"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0482",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Errors & exceptions",
    "subtopic": "output-buffer-stack-restoration-on-render-failure",
    "objective": {
      "id": "output-buffer-stack-restoration-on-render-failure",
      "text": "Test restoration of caller-owned output-buffer depth when a rendering callback throws."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Observe a leaked resource boundary independently of successful output and propagated exception text."
    },
    "prerequisites": [
      "Output buffering stack",
      "ob_get_level",
      "Exception paths",
      "Resource ownership"
    ],
    "runtime": {
      "php": [
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
        "The helper owns only the buffer it creates and must leave the caller’s existing buffer stack unchanged on success or failure. The test callback prints partial output and then throws. The cleanup after observation belongs to the test harness."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction render(callable $template): string\n{\n    ob_start();\n    $template();\n\n    return ob_get_clean();\n}\n\nob_start();\n$before = ob_get_level();\n\ntry {\n    render(function (): void {\n        echo 'partial';\n        throw new RuntimeException('template failed');\n    });\n} catch (RuntimeException $failure) {\n    $message = $failure->getMessage();\n}\n\n$after = ob_get_level();\n\nwhile (ob_get_level() > 0) {\n    ob_end_clean();\n}\n\necho json_encode([$after - $before, $message]);\n"
        }
      ]
    },
    "stem": "Which assertion on the failing call detects the helper’s violated ownership contract?",
    "options": [
      {
        "id": "message-only",
        "text": "Assert that the caught message is template failed.",
        "rationale": "The exception message propagates correctly even while the helper’s buffer remains open.",
        "misconception": "Equating correct failure propagation with complete cleanup."
      },
      {
        "id": "success-output",
        "text": "Assert that a separate successful render returns its printed text.",
        "rationale": "The success path reaches ob_get_clean and does not exercise the failing path’s leak.",
        "misconception": "Inferring exceptional cleanup from ordinary return behavior."
      },
      {
        "id": "depth-restored",
        "text": "Assert that $after equals $before after catching the callback’s exception.",
        "rationale": "The leaked helper-owned buffer makes after one greater than before, directly violating the ownership contract.",
        "misconception": null
      },
      {
        "id": "exception-type",
        "text": "Assert that the callback’s failure is caught as RuntimeException.",
        "rationale": "The catch succeeds; it does not close the abandoned output buffer.",
        "misconception": "Using only exception classification to test resource cleanup."
      }
    ],
    "correctOptionId": "depth-restored",
    "explanation": {
      "summary": "The callback throws before ob_get_clean runs. Checking the buffer-stack depth at the boundary exposes the leaked buffer without mistaking caller-owned buffers for disposable state.",
      "trace": "The observed depth delta is 1 and the message is template failed. Cleanup must be placed on both exit paths while preserving the caller’s original depth."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[1,\"template failed\"]",
      "keyEvidence": "The failing call increases buffer depth by one despite propagating the expected exception.",
      "counterexamples": {
        "message-only": "The observed message is already correct.",
        "success-output": "A successful call reaches the existing cleanup.",
        "exception-type": "The displayed catch already accepts RuntimeException."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/function.ob-get-level.php",
      "https://www.php.net/manual/en/function.ob-get-clean.php",
      "https://www.php.net/manual/en/language.exceptions.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0483",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "exception-expectation-scope-excludes-test-arrangement",
    "objective": {
      "id": "exception-expectation-scope-excludes-test-arrangement",
      "text": "Place an exception expectation so a failing fixture cannot satisfy the behavior under test."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate arrangement failures from the intended operation’s exception contract."
    },
    "prerequisites": [
      "PHPUnit exception expectations",
      "Arrange/act/assert structure",
      "Same exception type from different operations"
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
        "PHPUnit 12 is used. buildInput may throw InvalidArgumentException if a test fixture is malformed. validate is required to throw InvalidArgumentException for a well-formed but forbidden input. The test currently calls expectException before both buildInput and validate, and passes even when buildInput throws before validate is called."
      ],
      "files": []
    },
    "stem": "Which revision makes that false positive fail while still testing validate’s exception contract?",
    "options": [
      {
        "id": "expect-after-arrange",
        "text": "Call buildInput first, then expectException, then call validate with the resulting input.",
        "rationale": "A fixture failure happens before the expectation is active, so it fails the test instead of impersonating validate’s behavior.",
        "misconception": null
      },
      {
        "id": "broader-expectation",
        "text": "Keep the ordering but expect Throwable instead of InvalidArgumentException.",
        "rationale": "A broader expected type still accepts the arrangement failure and weakens the assertion.",
        "misconception": "Treating broader exception coverage as better attribution."
      },
      {
        "id": "expected-message",
        "text": "Keep the ordering and require the same message that both fixture and validator currently emit.",
        "rationale": "The stipulated shared message still cannot identify which operation threw.",
        "misconception": "Assuming a coincidentally shared message proves the exception source."
      },
      {
        "id": "catch-arrangement",
        "text": "Catch InvalidArgumentException around both calls and assert that an exception was caught.",
        "rationale": "The catch still spans arrangement and action, preserving the same false positive.",
        "misconception": "Changing assertion style without narrowing the observed operation."
      }
    ],
    "correctOptionId": "expect-after-arrange",
    "explanation": {
      "summary": "An exception expectation applies to subsequent test execution. Activate it only after the input is successfully arranged so the intended call is the operation allowed to satisfy it.",
      "trace": "If buildInput fails, the test fails during arrangement. If it succeeds, validate must produce the expected exception; returning normally fails the expectation."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHPUnit requires expectException before the code expected to throw. Narrowing the expectation’s active region excludes arrangement errors of the same class.",
      "optionAudit": {
        "expect-after-arrange": "Separates fixture creation from the expected failure.",
        "broader-expectation": "Still accepts the fixture exception.",
        "expected-message": "Cannot distinguish the stipulated identical messages.",
        "catch-arrangement": "Retains a catch spanning both candidate sources."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
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
    "id": "PHP-E26-0484",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "negative-path-test-forbidden-dependency-call",
    "objective": {
      "id": "negative-path-test-forbidden-dependency-call",
      "text": "Verify that rejecting invalid input happens before a forbidden repository interaction."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Choose an observation of a negative side-effect contract rather than only the eventual exception."
    },
    "prerequisites": [
      "Test spies",
      "Dependency injection",
      "Validation ordering",
      "Exception assertions"
    ],
    "runtime": {
      "php": [
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
        "An empty account identifier must be rejected without calling the repository, because even a lookup consumes a remote quota. The spy implements the same public lookup contract but performs no I/O."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\ninterface Accounts\n{\n    public function find(string $id): ?string;\n}\n\nfinal class AccountSpy implements Accounts\n{\n    public int $calls = 0;\n\n    public function find(string $id): ?string\n    {\n        $this->calls++;\n\n        return null;\n    }\n}\n\nfunction loadAccount(string $id, Accounts $accounts): ?string\n{\n    $record = $accounts->find($id);\n\n    if ($id === '') {\n        throw new InvalidArgumentException('empty id');\n    }\n\n    return $record;\n}\n\n$spy = new AccountSpy();\n\ntry {\n    loadAccount('', $spy);\n} catch (InvalidArgumentException $failure) {\n    $caught = true;\n}\n\necho json_encode([$caught, $spy->calls]);\n"
        }
      ]
    },
    "stem": "Which test assertion detects the contract violation even though the service throws the expected InvalidArgumentException?",
    "options": [
      {
        "id": "thrown-type",
        "text": "Assert that InvalidArgumentException was caught.",
        "rationale": "That is already true after the unwanted lookup.",
        "misconception": "Testing the final failure without observing earlier side effects."
      },
      {
        "id": "exact-message",
        "text": "Assert that the caught exception’s message is empty id.",
        "rationale": "The message is correct even though the dependency was called first.",
        "misconception": "Using diagnostic accuracy as evidence of correct operation ordering."
      },
      {
        "id": "one-lookup",
        "text": "Assert that the spy recorded exactly one lookup.",
        "rationale": "That expectation blesses the behavior the contract forbids.",
        "misconception": "Assuming every service invocation must contact its repository."
      },
      {
        "id": "no-lookup",
        "text": "Assert that the spy recorded zero lookups after the rejected call.",
        "rationale": "A count of one exposes the interaction that must not occur for invalid input.",
        "misconception": null
      }
    ],
    "correctOptionId": "no-lookup",
    "explanation": {
      "summary": "The service can throw the right exception after doing prohibited work. A spy or a mock expectation must observe the repository boundary as well as the failure result.",
      "trace": "The spy count becomes 1 before validation throws. Moving validation ahead of find is necessary to satisfy both the exception and no-I/O requirements."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[true,1]",
      "keyEvidence": "The exception assertion passes while the zero-call assertion fails.",
      "counterexamples": {
        "thrown-type": "The observed exception is already the expected class.",
        "exact-message": "The message is already empty id.",
        "one-lookup": "One call is the prohibited behavior, not the required observation."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://docs.phpunit.de/en/12.5/test-doubles.html",
      "https://www.php.net/manual/en/language.exceptions.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0485",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Functions & arguments",
    "subtopic": "next-month-last-date-versus-month-overflow-test",
    "objective": {
      "id": "next-month-last-date-versus-month-overflow-test",
      "text": "Select a date fixture that exposes month overflow when the requirement is the last date of the following month."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish PHP’s relative month arithmetic from a specific billing-calendar rule."
    },
    "prerequisites": [
      "DateTimeImmutable::modify",
      "Calendar month lengths",
      "Nonleap February"
    ],
    "runtime": {
      "php": [
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
        "Inputs are UTC dates with no time component. The requirement is always the final calendar date of the month immediately following the input’s month. 2026 is not a leap year."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction nextMonthEnd(string $date): string\n{\n    return (new DateTimeImmutable($date, new DateTimeZone('UTC')))\n        ->modify('+1 month')\n        ->modify('last day of this month')\n        ->format('Y-m-d');\n}\n"
        }
      ]
    },
    "stem": "Which input and expected output fails against the displayed implementation?",
    "options": [
      {
        "id": "middle-january",
        "text": "2026-01-15 → 2026-02-28",
        "rationale": "January 15 advances into February without overflowing, so this case passes.",
        "misconception": "Using only dates present in both months."
      },
      {
        "id": "january-end",
        "text": "2026-01-31 → 2026-02-28",
        "rationale": "February has no 31st; the intermediate month addition overflows into March before the final-day selection.",
        "misconception": null
      },
      {
        "id": "april-end",
        "text": "2026-04-30 → 2026-05-31",
        "rationale": "May has a 30th, so the intermediate date remains in the intended month.",
        "misconception": "Assuming every month-end input exposes the same rollover behavior."
      },
      {
        "id": "year-end",
        "text": "2026-12-31 → 2027-01-31",
        "rationale": "January has a 31st, so crossing the year does not trigger the defect.",
        "misconception": "Treating year rollover as sufficient coverage for short-month overflow."
      }
    ],
    "correctOptionId": "january-end",
    "explanation": {
      "summary": "The intermediate date matters. Starting from January 31, relative +1 month normalizes an impossible February date into March; selecting that month’s last day then produces March 31.",
      "trace": "A direct last day of next month rule selects February 28 without first constructing the overflowing day number. The other three supplied cases pass either implementation."
    },
    "validation": {
      "kind": "tests",
      "marker": "->modify('+1 month')\n        ->modify('last day of this month')",
      "repair": "->modify('last day of next month')",
      "cases": [
        {
          "option": "middle-january",
          "probe": "echo nextMonthEnd('2026-01-15');",
          "expected": "2026-02-28"
        },
        {
          "option": "january-end",
          "probe": "echo nextMonthEnd('2026-01-31');",
          "expected": "2026-02-28"
        },
        {
          "option": "april-end",
          "probe": "echo nextMonthEnd('2026-04-30');",
          "expected": "2026-05-31"
        },
        {
          "option": "year-end",
          "probe": "echo nextMonthEnd('2026-12-31');",
          "expected": "2027-01-31"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/datetimeimmutable.modify.php",
      "https://www.php.net/manual/en/datetime.formats.relative.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0486",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Validation & web security",
    "subtopic": "single-quoted-html-attribute-escaping-regression",
    "objective": {
      "id": "single-quoted-html-attribute-escaping-regression",
      "text": "Select an escaping test that covers the delimiter of a single-quoted HTML attribute."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Relate the output context’s quote delimiter to the chosen htmlspecialchars flags."
    },
    "prerequisites": [
      "HTML attribute delimiters",
      "htmlspecialchars flags",
      "Context-specific escaping"
    ],
    "runtime": {
      "php": [
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
        "The returned value is inserted between single quotes in an ordinary HTML attribute. Input is valid UTF-8. The encoder must escape ampersands, angle brackets and both quotation marks using HTML 4.01 entities, preserving other valid characters. This tests the encoder, not a complete XSS defense for every browser context."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction attributeText(string $text): string\n{\n    return htmlspecialchars($text, ENT_COMPAT | ENT_SUBSTITUTE, 'UTF-8');\n}\n"
        }
      ]
    },
    "stem": "Which exact input/output test fails against the displayed encoder?",
    "options": [
      {
        "id": "ampersand",
        "text": "A&B → A&amp;B",
        "rationale": "Both flag choices escape ampersands.",
        "misconception": "Testing a metacharacter whose behavior is unchanged by the flag defect."
      },
      {
        "id": "double-quote",
        "text": "a\"b → a&quot;b",
        "rationale": "ENT_COMPAT already escapes double quotes, which are not the missing delimiter here.",
        "misconception": "Testing the other attribute quote style."
      },
      {
        "id": "single-quote",
        "text": "O'Reilly → O&#039;Reilly",
        "rationale": "ENT_COMPAT leaves the single quote unescaped, so this fixture exercises the attribute’s actual delimiter.",
        "misconception": null
      },
      {
        "id": "less-than",
        "text": "<tag → &lt;tag",
        "rationale": "Both choices escape the less-than sign, so this case passes despite the defect.",
        "misconception": "Assuming tag-opening coverage also verifies attribute quote boundaries."
      }
    ],
    "correctOptionId": "single-quote",
    "explanation": {
      "summary": "ENT_COMPAT escapes double quotes but leaves single quotes. A single-quoted attribute requires the single quote to be encoded too; ENT_QUOTES covers both.",
      "trace": "The defective helper returns a literal apostrophe for O'Reilly. With ENT_QUOTES, it returns the required &#039; entity while all other supplied cases still agree."
    },
    "validation": {
      "kind": "tests",
      "marker": "ENT_COMPAT | ENT_SUBSTITUTE",
      "repair": "ENT_QUOTES | ENT_SUBSTITUTE",
      "cases": [
        {
          "option": "ampersand",
          "probe": "echo attributeText('A&B');",
          "expected": "A&amp;B"
        },
        {
          "option": "double-quote",
          "probe": "echo attributeText('a\"b');",
          "expected": "a&quot;b"
        },
        {
          "option": "single-quote",
          "probe": "echo attributeText(\"O'Reilly\");",
          "expected": "O&#039;Reilly"
        },
        {
          "option": "less-than",
          "probe": "echo attributeText('<tag');",
          "expected": "&lt;tag"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
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
    "id": "PHP-E26-0487",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Functions & arguments",
    "subtopic": "grapheme-prefix-versus-code-point-prefix-test",
    "objective": {
      "id": "grapheme-prefix-versus-code-point-prefix-test",
      "text": "Select a combining-character fixture that distinguishes one grapheme cluster from one Unicode code point."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Test a user-visible character boundary without confusing it with an encoding byte or code-point count."
    },
    "prerequisites": [
      "Unicode grapheme clusters",
      "Combining marks",
      "mb_substr versus grapheme_substr"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "intl",
        "mbstring"
      ],
      "errorPolicy": "E_ALL; no custom handler unless explicitly shown. 64-bit PHP; UTC; C locale."
    },
    "context": {
      "assumptions": [
        "Run in a fresh PHP process using only the displayed files and inputs.",
        "Inputs are valid UTF-8. The helper must preserve the original bytes of the first extended grapheme cluster, with no normalization. In these examples, an e followed by U+0301 COMBINING ACUTE ACCENT is one cluster consisting of two code points. Hex output makes that distinction visible."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction firstVisibleCharacter(string $text): string\n{\n    return mb_substr($text, 0, 1, 'UTF-8');\n}\n"
        }
      ]
    },
    "stem": "Which input/expected-prefix test fails against the displayed helper?",
    "options": [
      {
        "id": "ascii",
        "text": "AZ → A (hex 41)",
        "rationale": "One ASCII code point is one grapheme cluster here, so the implementation passes.",
        "misconception": "Testing a case where the two counting units coincide."
      },
      {
        "id": "precomposed",
        "text": "éZ → é (hex c3a9)",
        "rationale": "The precomposed accented letter is a single code point and passes the existing slice.",
        "misconception": "Assuming every accented display character requires multiple code points."
      },
      {
        "id": "decomposed",
        "text": "éZ → é (hex 65cc81)",
        "rationale": "The code-point slice returns only e, dropping the combining mark from the required first grapheme cluster.",
        "misconception": null
      },
      {
        "id": "single-ascii",
        "text": "Z → Z (hex 5a)",
        "rationale": "A single ASCII character cannot reveal a multi-code-point cluster boundary.",
        "misconception": "Using whole-input length one as evidence of correct visual-character slicing."
      }
    ],
    "correctOptionId": "decomposed",
    "explanation": {
      "summary": "mb_substr counts code points for UTF-8, whereas the required unit is a grapheme cluster. grapheme_substr retains the combining mark together with its base letter without normalizing their bytes.",
      "trace": "The defective slice returns hex 65 for the decomposed fixture. A grapheme slice returns 65cc81; the other three expected prefixes are unchanged."
    },
    "validation": {
      "kind": "tests",
      "marker": "mb_substr($text, 0, 1, 'UTF-8')",
      "repair": "grapheme_substr($text, 0, 1)",
      "cases": [
        {
          "option": "ascii",
          "probe": "echo bin2hex(firstVisibleCharacter('AZ'));",
          "expected": "41"
        },
        {
          "option": "precomposed",
          "probe": "echo bin2hex(firstVisibleCharacter('éZ'));",
          "expected": "c3a9"
        },
        {
          "option": "decomposed",
          "probe": "echo bin2hex(firstVisibleCharacter(\"e\\u{0301}Z\"));",
          "expected": "65cc81"
        },
        {
          "option": "single-ascii",
          "probe": "echo bin2hex(firstVisibleCharacter('Z'));",
          "expected": "5a"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.grapheme-substr.php",
      "https://www.php.net/manual/en/function.mb-substr.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0488",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "process-exit-test-observes-skipped-finally",
    "objective": {
      "id": "process-exit-test-observes-skipped-finally",
      "text": "Choose a process-level assertion for exit behavior that bypasses an ordinary finally block."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish terminating the PHP process from throwing a catchable exception and preserve the test runner’s own execution."
    },
    "prerequisites": [
      "exit semantics",
      "finally",
      "Subprocess test harnesses",
      "Exit status and standard output"
    ],
    "runtime": {
      "php": [
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
        "The displayed script is the whole child-process fixture. The test harness can run it as a separate PHP CLI process and capture its status and stdout. There are no shutdown callbacks or automatic output buffers."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\ntry {\n    echo 'before;';\n    exit(0);\n} finally {\n    echo 'cleanup;';\n}\n"
        }
      ]
    },
    "stem": "Which assertion accurately verifies this script’s behavior without terminating the parent test runner?",
    "options": [
      {
        "id": "finally-runs",
        "text": "Run a child process; assert status 0 and stdout before;cleanup;.",
        "rationale": "exit terminates execution without running this finally block, so the expected cleanup text is absent.",
        "misconception": "Treating process termination like normal return or exception unwinding."
      },
      {
        "id": "catch-exit",
        "text": "Include the script in the test runner inside catch (Throwable), then assert the caught exception has code 0.",
        "rationale": "exit does not throw Throwable; the include would terminate that runner.",
        "misconception": "Treating exit’s status argument as an exception code."
      },
      {
        "id": "child-observation",
        "text": "Run a child process; assert status 0 and stdout before;.",
        "rationale": "The child exits successfully after the first output, and the parent remains able to assert both observations.",
        "misconception": null
      },
      {
        "id": "silent-success",
        "text": "Run a child process; assert status 0 and empty stdout because termination discards earlier output.",
        "rationale": "The already emitted before; text remains observable in the captured output.",
        "misconception": "Assuming exit rolls back output produced earlier in the process."
      }
    ],
    "correctOptionId": "child-observation",
    "explanation": {
      "summary": "An exit call is a process boundary, not a Throwable. This finally block is skipped, so an external harness must observe the child’s output and termination status.",
      "trace": "The script prints before; and then exits with status 0. No control reaches the cleanup echo."
    },
    "validation": {
      "kind": "contract",
      "stdout": "before;",
      "keyEvidence": "The isolated child exits with status 0 and emits only before;.",
      "counterexamples": {
        "finally-runs": "No cleanup text is emitted.",
        "catch-exit": "The process terminates rather than throwing into a catch.",
        "silent-success": "The first echo remains in stdout."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
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
    "id": "PHP-E26-0489",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Iterators, generators & fibers",
    "subtopic": "generator-error-test-advances-to-failing-element",
    "objective": {
      "id": "generator-error-test-advances-to-failing-element",
      "text": "Place a generator error assertion around the traversal that actually reaches the invalid element."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish creating a lazy computation, observing its first yield and advancing into a later failure."
    },
    "prerequisites": [
      "Generator laziness",
      "current and next",
      "Exceptions during iteration"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction positiveRows(array $values): Generator\n{\n    foreach ($values as $value) {\n        if ($value < 0) {\n            throw new DomainException('negative row');\n        }\n\n        yield $value;\n    }\n}\n\ntry {\n    $rows = positiveRows([1, -1]);\n    echo 'created';\n} catch (DomainException $failure) {\n    echo 'rejected';\n}\n"
        }
      ]
    },
    "stem": "For positiveRows([1, -1]), which action must an exception expectation cover to verify rejection of the negative element?",
    "options": [
      {
        "id": "creation-only",
        "text": "Call positiveRows([1, -1]) and stop before inspecting the returned generator.",
        "rationale": "Creating the generator does not run its body, so the negative element is not examined.",
        "misconception": "Expecting validation inside a generator to run at function-call time."
      },
      {
        "id": "first-only",
        "text": "Call current on the fresh generator and assert that it throws.",
        "rationale": "The first element is positive and is yielded normally.",
        "misconception": "Assuming starting a generator eagerly validates every remaining input."
      },
      {
        "id": "type-only",
        "text": "Assert that the returned object implements Traversable.",
        "rationale": "The type check says nothing about whether traversal rejects a negative row.",
        "misconception": "Substituting a container-interface assertion for behavior during consumption."
      },
      {
        "id": "reach-negative",
        "text": "Read the first yield, then expect DomainException around the next advance.",
        "rationale": "Advancing past the first yield reaches -1 and executes the rejection branch.",
        "misconception": null
      }
    ],
    "correctOptionId": "reach-negative",
    "explanation": {
      "summary": "Generator code executes as it is consumed. The negative row is not reached at construction or at the first current call, so the error assertion must cover the subsequent advance.",
      "trace": "The displayed creation-only check prints created. Reading current would yield 1; the next advance resumes at -1 and throws DomainException to the consumer."
    },
    "validation": {
      "kind": "contract",
      "stdout": "created",
      "keyEvidence": "Creation alone prints created; the contrast reads the first yield and advances to the negative value, reaching the catch.",
      "counterexamples": {
        "creation-only": "The body has not begun.",
        "first-only": "The first observed value is 1.",
        "type-only": "A generator’s Traversable type does not execute its rejection branch."
      },
      "contrasts": [
        {
          "name": "advance-to-negative",
          "marker": "$rows = positiveRows([1, -1]);\n    echo 'created';",
          "replacement": "$rows = positiveRows([1, -1]);\n    $rows->current();\n    $rows->next();\n    echo 'created';",
          "stdout": "rejected"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/language.generators.overview.php",
      "https://www.php.net/manual/en/generator.next.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0490",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "test-isolation-resets-static-state-before-each-case",
    "objective": {
      "id": "test-isolation-resets-static-state-before-each-case",
      "text": "Make tests independent when their subject retains mutable static state across test instances."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Identify the state’s lifetime and select a reset boundary that does not rely on test execution order."
    },
    "prerequisites": [
      "Static properties",
      "Per-test setup",
      "Test order independence"
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
        "A test suite runs in one PHP process. Flags::$mode starts as safe. One test changes it to fast; another test expects safe at entry. Each test already constructs a new Flags object. Flags::reset sets the static mode back to safe, and no background code mutates it. Each test is allowed to set its own mode after setup."
      ],
      "files": []
    },
    "stem": "Which suite change establishes the stated initial mode independently for every test?",
    "options": [
      {
        "id": "new-object",
        "text": "Construct two fresh Flags objects in each test instead of one.",
        "rationale": "All instances still share the same static property.",
        "misconception": "Treating object construction as reinitialization of class-level state."
      },
      {
        "id": "reset-per-test",
        "text": "Call Flags::reset in setup before every test method.",
        "rationale": "Each test begins from the required static baseline regardless of the preceding test’s changes.",
        "misconception": null
      },
      {
        "id": "reset-per-suite",
        "text": "Call Flags::reset once before the entire suite starts.",
        "rationale": "A later test still sees mutations made by earlier tests.",
        "misconception": "Matching the reset lifetime to the process rather than the individual test contract."
      },
      {
        "id": "fixed-order",
        "text": "Always run the safe-mode test before the fast-mode test.",
        "rationale": "This hides the dependency in one order rather than making each test independently valid.",
        "misconception": "Using execution order to compensate for leaked state."
      }
    ],
    "correctOptionId": "reset-per-test",
    "explanation": {
      "summary": "A new object does not reset static properties. The setup boundary must restore the shared state for each test; ordering or suite-level initialization leaves later tests dependent on earlier mutations.",
      "trace": "Reset runs, then the test applies its own configuration and assertions. The next test receives another reset, so its entry conditions do not depend on that mutation."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP static properties belong to the class rather than an individual object; PHPUnit setup runs for each test and can establish a deterministic fixture.",
      "optionAudit": {
        "new-object": "Does not replace static storage.",
        "reset-per-test": "Restores the required entry condition before each case.",
        "reset-per-suite": "Leaves inter-test mutations visible.",
        "fixed-order": "Retains the order dependency."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.static.php",
      "https://docs.phpunit.de/en/12.5/fixtures.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0491",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Transactions, migrations & ORM",
    "subtopic": "lost-update-integration-test-independent-sessions",
    "objective": {
      "id": "lost-update-integration-test-independent-sessions",
      "text": "Design a deterministic integration schedule that exposes a read-compute-write lost update across independent PDO sessions."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Separate PHP object identity, database transaction identity and controlled interleaving of stale reads."
    },
    "prerequisites": [
      "Database concurrency testing (advanced)",
      "PDO connection sessions",
      "PostgreSQL READ COMMITTED",
      "Lost updates",
      "Synchronization barriers"
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
        "PostgreSQL uses READ COMMITTED. Each debit transaction selects balance without a lock, computes balance minus 10 in PHP, then updates balance to that computed constant. Initial balance is 100. Two concurrent debits must leave 80. There is no version predicate or other locking. The test infrastructure can coordinate two genuinely separate database sessions; no database service is executed here."
      ],
      "files": []
    },
    "stem": "Which test schedule reliably exposes the lost update in this implementation?",
    "options": [
      {
        "id": "serial-transactions",
        "text": "Use two independent sessions, but finish the first debit before the second session selects its balance; assert 80.",
        "rationale": "The second read sees 90 and writes 80, so serial execution does not expose the stale-read race.",
        "misconception": "Assuming separate connections alone create the necessary overlap."
      },
      {
        "id": "shared-connection",
        "text": "Pass the same PDO connection to two service objects and begin both transactions before either commits; assert 80.",
        "rationale": "Both services share one database session; nested beginTransaction calls do not create two independent concurrent transactions.",
        "misconception": "Confusing two PHP service objects with two transaction contexts."
      },
      {
        "id": "barrier-after-reads",
        "text": "Use two sessions; let both select 100 before either update, commit one computed write of 90, then commit the other computed write of 90; assert 80.",
        "rationale": "The controlled stale reads produce final balance 90, so the required 80 assertion fails deterministically.",
        "misconception": null
      },
      {
        "id": "barrier-before-read",
        "text": "Start two sessions together, but allow one complete debit before releasing the other session’s first select; assert 80.",
        "rationale": "The second select occurs after the first commit and observes 90, so this schedule still serializes the relevant reads.",
        "misconception": "Placing a barrier before work without controlling the stale-read window."
      }
    ],
    "correctOptionId": "barrier-after-reads",
    "explanation": {
      "summary": "The defect requires both transactions to calculate from the same old balance. A barrier after both reads creates that condition, and separate sessions preserve independent transaction state.",
      "trace": "Both PHP calculations produce 90. Each update writes that constant, leaving 90 after both commits. A correct concurrency strategy must prevent or detect that stale overwrite."
    },
    "validation": {
      "kind": "document-review",
      "rule": "The explicit READ COMMITTED schedule permits both initial selects to observe 100; later constant assignments overwrite rather than recompute. A shared PDO session is not two concurrent transactions.",
      "optionAudit": {
        "serial-transactions": "Second calculation uses the updated balance.",
        "shared-connection": "Does not establish independent transactional sessions.",
        "barrier-after-reads": "Forces both calculations to use the same original value.",
        "barrier-before-read": "Delays the second read until it is fresh."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-16"
    },
    "references": [
      "https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED",
      "https://www.php.net/manual/en/pdo.begintransaction.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0492",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "read-only-dependency-contract-segregation",
    "objective": {
      "id": "read-only-dependency-contract-segregation",
      "text": "Expose only the application operations a read-only consumer needs while keeping a separate writer contract."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Choose a dependency boundary that restricts ordinary static API use without claiming a security sandbox."
    },
    "prerequisites": [
      "PHP interfaces",
      "Dependency injection",
      "Public method contracts",
      "Static type checking"
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
        "A reporting service needs find and list, but never save or delete. The repository implementation supports all four operations and is used by a separate editing service. Both consumers are statically analyzed. The goal is a narrower public dependency contract for normal calls, not protection from malicious reflection or casts."
      ],
      "files": []
    },
    "stem": "Which design makes accidental write calls in the reporting service fail against its declared dependency contract while preserving the editor’s writes?",
    "options": [
      {
        "id": "throwing-repository",
        "text": "Keep one four-method interface and make the report’s repository throw from save and delete.",
        "rationale": "Writes remain valid calls against the declared interface and fail only if executed.",
        "misconception": "Substituting runtime rejection for a narrower compile-time dependency contract."
      },
      {
        "id": "reader-writer-contracts",
        "text": "Define reader and writer interfaces, let the implementation satisfy both, and inject only the reader interface into reporting.",
        "rationale": "The reporting dependency exposes just the required read operations while the editing service can receive the writer capability.",
        "misconception": null
      },
      {
        "id": "public-flag",
        "text": "Keep the full repository type and pass a public readOnly boolean beside it.",
        "rationale": "The flag does not remove write methods from the reporting service’s declared API.",
        "misconception": "Treating configuration metadata as a type-level capability restriction."
      },
      {
        "id": "report-subclass",
        "text": "Subclass the repository for reports and inherit save and delete unchanged.",
        "rationale": "The inherited public methods remain callable and visible to static analysis.",
        "misconception": "Assuming a reporting-specific class name narrows inherited behavior."
      }
    ],
    "correctOptionId": "reader-writer-contracts",
    "explanation": {
      "summary": "A consumer-specific interface can express the smaller operation set it needs. One concrete repository may implement several interfaces, so narrowing the reporting contract does not remove functionality from the editor.",
      "trace": "A normal save call on the reader-typed dependency violates its declared contract in analysis. The editor can use a separately declared writer dependency."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP classes can implement multiple interfaces, each declaring a distinct method contract; consumers can type their dependencies to the relevant interface.",
      "optionAudit": {
        "throwing-repository": "Retains the broad static API.",
        "reader-writer-contracts": "Narrows the reporting API without deleting writer functionality.",
        "public-flag": "Leaves all methods in the type contract.",
        "report-subclass": "Inherits the unwanted public API unchanged."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-18"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.interfaces.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0493",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Forms & file uploads",
    "subtopic": "upload-display-name-separated-from-storage-identity",
    "objective": {
      "id": "upload-display-name-separated-from-storage-identity",
      "text": "Separate an uploaded file’s display metadata from its collision-safe storage identity."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Preserve distinct uploads without letting user-supplied names determine overwrite behavior."
    },
    "prerequisites": [
      "Upload metadata",
      "Filesystem identity",
      "Collision handling",
      "Display-name versus storage-key separation"
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
        "Content validation and authorization have already passed. Every accepted upload must remain a distinct stored record, even when the same user uploads identical bytes under the same original filename twice. A trusted storage API can atomically reserve an unused key and retry on collision; it never overwrites another object. Original filenames are needed only for later display."
      ],
      "files": []
    },
    "stem": "Which storage design meets the distinct-record requirement?",
    "options": [
      {
        "id": "sanitized-original",
        "text": "Sanitize the original filename and use it as the storage key, replacing any existing file at that key.",
        "rationale": "Two accepted uploads with the same sanitized name replace one another.",
        "misconception": "Treating path-safe naming as a uniqueness guarantee."
      },
      {
        "id": "content-hash",
        "text": "Use a hash of the bytes as the sole record key and return the existing record for identical content.",
        "rationale": "The stated requirement keeps identical uploads distinct, so deduplicating their record identity is incorrect.",
        "misconception": "Confusing content identity with the identity of a separate upload event."
      },
      {
        "id": "allocated-key",
        "text": "Allocate an unused server-generated storage key for each upload and store the original filename separately as display metadata.",
        "rationale": "Atomic allocation preserves separate objects while retaining the submitted name without using it as storage authority.",
        "misconception": null
      },
      {
        "id": "user-and-name",
        "text": "Use the authenticated user ID plus the original filename as the key and overwrite on repeat.",
        "rationale": "The same user can upload the same name twice, so the composite key still collapses distinct accepted records.",
        "misconception": "Assuming tenant separation also provides uniqueness within a tenant."
      }
    ],
    "correctOptionId": "allocated-key",
    "explanation": {
      "summary": "A filename can be valid display text without being a suitable unique storage identifier. Allocate storage identity independently and enforce non-overwrite behavior at the storage boundary.",
      "trace": "Two identical submissions receive two independently reserved keys and two records. Their display names and content may match while their upload identities remain distinct."
    },
    "validation": {
      "kind": "document-review",
      "rule": "The explicit requirement concerns distinct upload records. Only the option using a separately allocated non-overwriting key preserves two repeated submissions.",
      "optionAudit": {
        "sanitized-original": "Collides on repeated sanitized names.",
        "content-hash": "Merges identical-content events.",
        "allocated-key": "Preserves separate identities through atomic allocation.",
        "user-and-name": "Still collides for one user’s repeated name."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-12"
    },
    "references": [
      "https://www.php.net/manual/en/features.file-upload.post-method.php",
      "https://www.php.net/manual/en/function.move-uploaded-file.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0494",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Enums, attributes & reflection",
    "subtopic": "unknown-wire-enum-value-preserved-at-boundary",
    "objective": {
      "id": "unknown-wire-enum-value-preserved-at-boundary",
      "text": "Represent an unknown external enum value without inventing a known domain meaning or losing its raw spelling."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate a closed PHP enum from a versioned external vocabulary that can grow independently."
    },
    "prerequisites": [
      "Backed enums",
      "tryFrom versus from",
      "Boundary mapping",
      "Forward-compatible protocol values"
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
        "The local backed enum has queued and done. A remote API can add new status strings before this client is upgraded. The client must retain unknown raw values for display and diagnostics, must not execute a known-status action for them, and must continue processing other records."
      ],
      "files": []
    },
    "stem": "Which boundary design satisfies all three unknown-value requirements?",
    "options": [
      {
        "id": "default-queued",
        "text": "Use Status::tryFrom($raw) ?? Status::Queued and process the result normally.",
        "rationale": "This converts every unknown state into a known queued action and loses its distinct meaning.",
        "misconception": "Treating a fallback enum case as semantically neutral."
      },
      {
        "id": "known-or-unknown",
        "text": "Return either a known enum case or UnknownStatus($raw), and dispatch known-status actions only for the enum branch.",
        "rationale": "The representation preserves both the raw future value and the distinction needed for safe dispatch.",
        "misconception": null
      },
      {
        "id": "direct-from",
        "text": "Use Status::from($raw) outside the per-record error boundary and let ValueError stop processing the response.",
        "rationale": "That rejects new values by aborting processing, contrary to the requirement to continue other records.",
        "misconception": "Assuming a closed enum conversion alone provides forward-compatible ingestion."
      },
      {
        "id": "nullable-only",
        "text": "Convert unknown values to null, discard the raw string, and skip their actions.",
        "rationale": "Skipping actions is correct, but discarding the raw value violates display and diagnostic retention.",
        "misconception": "Preserving absence of a known value while losing the original protocol information."
      }
    ],
    "correctOptionId": "known-or-unknown",
    "explanation": {
      "summary": "A PHP enum remains a useful closed model for recognized states. An adapter can add a separate unknown representation rather than widening the enum dynamically or assigning a false known meaning.",
      "trace": "queued and done become enum cases. A future paused value becomes UnknownStatus(\"paused\"), remains inspectable and follows a non-action branch while later records continue."
    },
    "validation": {
      "kind": "document-review",
      "rule": "BackedEnum::tryFrom returns null for an unknown backing value, while from throws ValueError. The adapter must explicitly preserve the external value and branch on known versus unknown.",
      "optionAudit": {
        "default-queued": "Invents a known action for an unknown status.",
        "known-or-unknown": "Preserves raw data and separates action dispatch.",
        "direct-from": "Stops the stated processing path on an unknown value.",
        "nullable-only": "Discards required diagnostic information."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
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
    "id": "PHP-E26-0495",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "HTTP & superglobals",
    "subtopic": "sensitive-http-response-no-store-versus-revalidation",
    "objective": {
      "id": "sensitive-http-response-no-store-versus-revalidation",
      "text": "Choose an HTTP response cache policy that forbids storage by both private and shared compliant caches."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish storage prohibition from private caching and mandatory revalidation."
    },
    "prerequisites": [
      "HTTP Cache-Control",
      "Private versus shared caches",
      "Storage versus reuse"
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
        "A PHP endpoint returns a newly generated sensitive recovery document. The requirement is that compliant HTTP caches must not store this response. It applies to browser-private caches and shared proxies. It does not claim to prevent screenshots, malicious clients or retention of an older already-cached response."
      ],
      "files": []
    },
    "stem": "Which response Cache-Control value directly expresses the required policy?",
    "options": [
      {
        "id": "private-only",
        "text": "private",
        "rationale": "This prohibits shared-cache storage but still permits private browser caching.",
        "misconception": "Treating private as a prohibition on all storage."
      },
      {
        "id": "revalidate",
        "text": "no-cache",
        "rationale": "A cache may store the response but must validate it before reuse.",
        "misconception": "Reading no-cache as no storage rather than controlled reuse."
      },
      {
        "id": "zero-age",
        "text": "max-age=0, must-revalidate",
        "rationale": "This makes the response immediately stale and constrains reuse, but does not prohibit storing it.",
        "misconception": "Confusing zero freshness lifetime with zero retention."
      },
      {
        "id": "no-storage",
        "text": "no-store",
        "rationale": "This directs compliant private and shared caches not to store the response.",
        "misconception": null
      }
    ],
    "correctOptionId": "no-storage",
    "explanation": {
      "summary": "HTTP caching separates retaining a response from reusing it without contacting the origin. no-store governs retention; no-cache and freshness directives govern reuse of stored responses.",
      "trace": "The endpoint emits Cache-Control: no-store for this response. The rule applies to compliant cache behavior and is not a universal data-erasure mechanism."
    },
    "validation": {
      "kind": "document-review",
      "rule": "RFC 9111 distinguishes no-store from no-cache, private and freshness directives. The question concerns the new response’s storage policy, not removal of historical copies.",
      "optionAudit": {
        "private-only": "Allows private storage.",
        "revalidate": "Allows storage with validation before reuse.",
        "zero-age": "Allows stale storage.",
        "no-storage": "Forbids compliant cache storage of the response."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc9111.html#section-5.2.2.5"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0496",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "library-dependency-range-tested-beyond-own-lock",
    "objective": {
      "id": "library-dependency-range-tested-beyond-own-lock",
      "text": "Support a published library’s declared dependency range rather than assuming its development lock file controls consumers."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate a library’s reproducible development environment from dependency resolution in a consuming root application."
    },
    "prerequisites": [
      "Composer library versus root project",
      "composer.lock scope",
      "Version constraints",
      "Dependency test matrices"
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
        "A library declares helper/package ^3.2. Its own composer.lock currently resolves 3.8. Consumer applications may resolve any compatible release satisfying all their root constraints. The library promises its declared range is supported and must retain that promise rather than pinning everyone to 3.8. Dependency-resolution test jobs run without deployment credentials."
      ],
      "files": []
    },
    "stem": "Which maintenance approach addresses the difference between the library’s locked development environment and supported consumer environments?",
    "options": [
      {
        "id": "own-lock-pins-consumers",
        "text": "Commit only the library’s lock file and assume Composer installs those exact transitive versions for every consumer.",
        "rationale": "A dependency’s lock file does not determine the consuming root project’s resolution.",
        "misconception": "Extending root lock-file behavior to installed libraries."
      },
      {
        "id": "copy-lock-to-consumers",
        "text": "Require each consuming application to replace its root lock file with the library’s lock file.",
        "rationale": "That cannot preserve the consumer’s own complete dependency graph and is not how a shared library advertises compatibility.",
        "misconception": "Treating one library’s development graph as an application-wide dependency solution."
      },
      {
        "id": "range-tests",
        "text": "Keep the development lock for reproducibility and separately test supported lower and current compatible resolutions, correcting constraints when a version is unsupported.",
        "rationale": "This tests the range consumers can actually receive while retaining a reproducible ordinary development environment.",
        "misconception": null
      },
      {
        "id": "test-highest-only",
        "text": "Always update the library to the highest compatible version and remove lower-bound tests because consumers will choose the same version.",
        "rationale": "Other root constraints can retain older compatible releases, so testing only the newest does not verify the advertised lower bound.",
        "misconception": "Assuming all root dependency graphs resolve to the newest release."
      }
    ],
    "correctOptionId": "range-tests",
    "explanation": {
      "summary": "The root application resolves the combined dependency graph. A library’s own lock is useful for development but cannot replace accurate constraints and tests of the versions those constraints permit.",
      "trace": "A lower-resolution job can reveal use of an API added after 3.2; a current-resolution job can reveal later compatibility changes. The advertised range should match observed support."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Composer documents that a library’s lock file does not control consuming projects and recommends testing updated and lower compatible resolutions.",
      "optionAudit": {
        "own-lock-pins-consumers": "Misstates dependency lock-file scope.",
        "copy-lock-to-consumers": "Replaces an unrelated root dependency graph.",
        "range-tests": "Tests the advertised consumer range.",
        "test-highest-only": "Leaves older allowed resolutions unverified."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://getcomposer.org/doc/02-libraries.md#lock-file"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0497",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Performance, processes & servers",
    "subtopic": "extension-capability-gate-beyond-php-version",
    "objective": {
      "id": "extension-capability-gate-beyond-php-version",
      "text": "Gate an extension-dependent security feature on the actual runtime capability rather than PHP’s version alone."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Account for the PHP binding, underlying native library and required failure policy together."
    },
    "prerequisites": [
      "PHP extension builds",
      "libxml parser options",
      "Capability detection",
      "External entity policy"
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
        "An importer’s reviewed design requires LIBXML_NO_XXE while expanding permitted internal entities. The constant is available only with PHP 8.4 or later and libxml 2.13.0 or later. Deployment A is PHP 8.5 linked to libxml 2.9; deployment B is PHP 8.4 linked to libxml 2.13. The team has no separately reviewed fallback parser. Unsupported deployments must not process untrusted XML. No XML is executed in this question."
      ],
      "files": []
    },
    "stem": "Which startup policy correctly enforces the importer’s reviewed requirement?",
    "options": [
      {
        "id": "php-version-only",
        "text": "Enable the importer whenever PHP_VERSION_ID is at least 80400 and pass the option unconditionally.",
        "rationale": "Deployment A meets that PHP check but lacks the required native-library capability and constant.",
        "misconception": "Treating a language-version gate as proof of every extension build feature."
      },
      {
        "id": "capability-check",
        "text": "Require the extension and the defined LIBXML_NO_XXE capability at startup; reject importer activation when it is unavailable.",
        "rationale": "This checks the capability the reviewed parser actually requires and fails closed on deployment A.",
        "misconception": null
      },
      {
        "id": "network-option-fallback",
        "text": "Substitute LIBXML_NONET whenever LIBXML_NO_XXE is unavailable and activate both deployments.",
        "rationale": "A network-only prohibition is not the required external-entity policy; local-file entities are a different access path.",
        "misconception": "Treating network blocking as equivalent to blocking all external entities."
      },
      {
        "id": "zero-option-fallback",
        "text": "Use zero for an undefined LIBXML_NO_XXE flag so the same source runs on both deployments.",
        "rationale": "Zero silently removes the required protection instead of rejecting an unsupported configuration.",
        "misconception": "Treating syntactic compatibility as preservation of a security requirement."
      }
    ],
    "correctOptionId": "capability-check",
    "explanation": {
      "summary": "PHP extension features can depend on the native library used to build the runtime. The importer must verify its actual required capability; silently substituting a different or empty flag changes the reviewed security policy.",
      "trace": "Deployment A is rejected despite PHP 8.5. Deployment B supplies the required capability and can activate after its other configuration checks pass."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PHP documents the combined PHP and libxml version requirement for LIBXML_NO_XXE. LIBXML_NONET addresses network access, not every external entity source.",
      "optionAudit": {
        "php-version-only": "Accepts a runtime missing the required capability.",
        "capability-check": "Checks the actual requirement and rejects the unsupported build.",
        "network-option-fallback": "Weakens the required entity policy.",
        "zero-option-fallback": "Removes the required parser option."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://www.php.net/manual/en/libxml.constants.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0498",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Transactions, migrations & ORM",
    "subtopic": "consumer-dedup-marker-and-effect-atomic-transaction",
    "objective": {
      "id": "consumer-dedup-marker-and-effect-atomic-transaction",
      "text": "Commit a consumed-event deduplication marker atomically with the database effect it protects."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Analyze crash windows on either side of separate marker and business-state commits."
    },
    "prerequisites": [
      "At-least-once delivery (advanced)",
      "Database transactions",
      "Unique event identifiers",
      "Crash recovery",
      "Atomic insert-if-absent"
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
        "A PHP consumer receives events at least once. An event increments one database counter exactly once logically. Its event ID is globally unique. The processed-event table and counter live in the same transactional database, and a unique constraint permits only one processed row per event ID. There are no external side effects. A rollback removes both uncommitted inserts and counter changes. Concurrent deliveries are handled by an atomic insert-if-absent whose result is checked."
      ],
      "files": []
    },
    "stem": "Which transaction boundary avoids both a duplicate increment and a permanently skipped increment after a crash?",
    "options": [
      {
        "id": "marker-first",
        "text": "Commit the processed-event row, then increment and commit the counter in a second transaction.",
        "rationale": "A crash between commits leaves a marker but no increment; redelivery skips the required effect.",
        "misconception": "Assuming an early deduplication marker can safely precede its business effect."
      },
      {
        "id": "effect-first",
        "text": "Commit the counter increment, then insert and commit the processed-event row separately.",
        "rationale": "A crash after the increment but before the marker lets redelivery increment again.",
        "misconception": "Assuming a late marker can retrospectively make an earlier commit idempotent."
      },
      {
        "id": "one-transaction",
        "text": "Within one transaction, atomically claim the event ID; only a new claim increments the counter, and both changes commit together.",
        "rationale": "A committed new marker accompanies its effect, while a rollback leaves neither; existing markers skip the increment.",
        "misconception": null
      },
      {
        "id": "memory-marker",
        "text": "Commit the counter and remember the event ID only in the current PHP worker’s in-memory set.",
        "rationale": "A restart or another worker loses that deduplication knowledge even though the increment persists.",
        "misconception": "Using process-local memory to protect durable effects across redelivery."
      }
    ],
    "correctOptionId": "one-transaction",
    "explanation": {
      "summary": "The marker is evidence that the effect committed. They must share an atomic transaction so a crash cannot leave that evidence ahead of or behind the actual durable change.",
      "trace": "Before commit, a crash rolls both changes back. After commit, a redelivery sees the unique marker and skips the increment. A concurrent duplicate cannot acquire a second new claim."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Under the explicit transactional and uniqueness premises, one commit contains both claim and effect. Separate commits admit the stated crash windows.",
      "optionAudit": {
        "marker-first": "Can commit suppression without the effect.",
        "effect-first": "Can commit the effect without suppression.",
        "one-transaction": "Commits or rolls back the two related changes together.",
        "memory-marker": "Does not survive the required delivery and worker lifecycle."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-16"
    },
    "references": [
      "https://www.php.net/manual/en/pdo.transactions.php",
      "https://www.postgresql.org/docs/18/tutorial-transactions.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0499",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Validation & web security",
    "subtopic": "encrypted-record-key-rotation-read-old-write-new",
    "objective": {
      "id": "encrypted-record-key-rotation-read-old-write-new",
      "text": "Rotate a record-encryption key while preserving access to ciphertext created under older key versions."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate new-write key selection, retained decryption keys and a verified retirement condition."
    },
    "prerequisites": [
      "Encryption key lifecycle",
      "Versioned encrypted envelopes",
      "Local key allowlists",
      "Data migration",
      "Authenticated decryption"
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
        "A PHP service stores authenticated ciphertext envelopes tagged with a key ID. K1 is being rotated routinely, not because of compromise. Existing records use K1; new records must use K2. The service can securely retain both keys and re-encrypt records. Key IDs select only entries in a trusted local key map; unknown IDs are rejected. No external key URLs are accepted."
      ],
      "files": []
    },
    "stem": "Which rollout preserves existing reads while moving new writes and eventually retiring K1?",
    "options": [
      {
        "id": "replace-one-key",
        "text": "Replace K1 with K2 in the single decryption slot immediately and try K2 for every stored record.",
        "rationale": "Ciphertext authenticated under K1 cannot generally be decrypted with unrelated K2.",
        "misconception": "Treating a key rotation as changing only a configuration label."
      },
      {
        "id": "read-old-write-new",
        "text": "Encrypt new records with K2, retain keyed reads for K1/K2, and retire K1 only after verifying all required records are migrated.",
        "rationale": "This separates current encryption policy from the key versions needed to read existing data.",
        "misconception": null
      },
      {
        "id": "rename-identifiers",
        "text": "Change every envelope’s key ID from K1 to K2 without decrypting and re-encrypting its ciphertext.",
        "rationale": "Changing metadata does not transform ciphertext into data encrypted under the new key.",
        "misconception": "Assuming key identifiers determine cryptographic bytes after encryption."
      },
      {
        "id": "expiry-only",
        "text": "Write with K2, retain K1 for a fixed day, then delete K1 regardless of which records were migrated.",
        "rationale": "A time deadline alone does not establish that all required old ciphertext has been migrated or expired.",
        "misconception": "Using elapsed time as evidence that no stored dependency remains."
      }
    ],
    "correctOptionId": "read-old-write-new",
    "explanation": {
      "summary": "Encryption key rotation changes future writes immediately, but old ciphertext remains dependent on its original key until it is migrated or no longer required. Retirement must follow evidence about that dependency.",
      "trace": "Reads dispatch through the trusted key map. Migration decrypts with K1 and writes a new authenticated envelope with K2. Verification of remaining dependencies precedes removal of K1."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Authenticated ciphertext depends on its encryption key. The explicit routine-rotation requirements need retained old-read capability until verified migration or expiry removes every required dependency.",
      "optionAudit": {
        "replace-one-key": "Loses the key needed by existing ciphertext.",
        "read-old-write-new": "Preserves reads and defines an evidence-based retirement condition.",
        "rename-identifiers": "Changes a label without re-encryption.",
        "expiry-only": "Can retire a key still needed by required data."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://doc.libsodium.org/secret-key_cryptography/aead",
      "https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0500",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "nonseekable-request-body-inspection-and-replay",
    "objective": {
      "id": "nonseekable-request-body-inspection-and-replay",
      "text": "Inspect a bounded nonseekable PSR-7 request body while preserving an equivalent readable body for downstream middleware."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine one-pass stream consumption, size limits and immutable request replacement."
    },
    "prerequisites": [
      "PSR-7 streams",
      "Nonseekable input",
      "withBody immutable messages",
      "Bounded buffering",
      "Middleware ownership"
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
        "A PHP middleware must inspect the entire body before calling the next handler. The incoming stream is nonseekable, initially unread and at most 1 MiB if accepted; larger bodies must be rejected without forwarding. A trusted helper can copy into a new seekable stream, enforce the byte limit before exceeding it and leave the copy ready to rewind. No downstream handler has yet read the body."
      ],
      "files": []
    },
    "stem": "Which design preserves the accepted request’s complete body for the next handler?",
    "options": [
      {
        "id": "read-original-forward",
        "text": "Read and inspect the original stream to EOF, then pass the unchanged request downstream.",
        "rationale": "The downstream handler receives the already consumed nonseekable stream.",
        "misconception": "Assuming reading a PSR-7 stream is a nonmutating observation."
      },
      {
        "id": "rewind-original",
        "text": "Read the original stream to EOF, call rewind on it, and forward the original request.",
        "rationale": "The stated stream is nonseekable, so rewinding cannot establish the required body position.",
        "misconception": "Applying seekable-stream cleanup to a one-pass source."
      },
      {
        "id": "bounded-replay",
        "text": "Copy under the limit into a seekable stream, inspect the copy, rewind it, and pass the request returned by withBody(copy) downstream.",
        "rationale": "The bounded copy preserves the bytes, and the forwarded immutable replacement carries a readable stream at its start.",
        "misconception": null
      },
      {
        "id": "ignore-replacement",
        "text": "Copy and inspect under the limit, rewind the copy, call withBody(copy), then forward the original request variable without using the returned message.",
        "rationale": "withBody returns a new message; ignoring it leaves the original consumed stream attached.",
        "misconception": "Treating immutable message replacement as an in-place update."
      }
    ],
    "correctOptionId": "bounded-replay",
    "explanation": {
      "summary": "A nonseekable body cannot be read twice in place. A bounded replay stream supplies the second reader, and PSR-7’s immutable withBody result must be the message actually forwarded.",
      "trace": "Oversized input is rejected at the copy boundary. Accepted bytes are inspected, the copy returns to position zero, and the downstream request contains that copy."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PSR-7 streams expose seekability and mutable cursor state, while message withBody returns a new instance. The stated helper enforces the independent size constraint.",
      "optionAudit": {
        "read-original-forward": "Forwards a consumed source.",
        "rewind-original": "Requires a capability explicitly absent.",
        "bounded-replay": "Preserves bytes, position, size policy and message replacement.",
        "ignore-replacement": "Discards the message carrying the new body."
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 5
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php-fig.org/psr/psr-7/"
    ]
  }
];
