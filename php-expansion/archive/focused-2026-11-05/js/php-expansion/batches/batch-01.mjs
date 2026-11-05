// Accepted for local independent review only. Production activation is not authorized.
export default [
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0001",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Operators & expressions",
    "subtopic": "signed-integer-division",
    "objective": {
      "id": "signed-integer-division",
      "text": "Predict truncation and remainder signs for integer division."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply the definitions of two integer operators to one pair of operands."
    },
    "prerequisites": [
      "Integer arithmetic"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\necho intdiv(-7, 3), '|', -7 % 3;\n"
        }
      ]
    },
    "stem": "What exact text does this program print?",
    "options": [
      {
        "id": "floor",
        "text": "-3|2",
        "rationale": "intdiv truncates toward zero, rather than toward negative infinity.",
        "misconception": "Treating division and remainder as Euclidean floor division."
      },
      {
        "id": "truncate",
        "text": "-2|-1",
        "rationale": "The quotient truncates toward zero; the remainder has the dividend’s sign.",
        "misconception": null
      },
      {
        "id": "positive-remainder",
        "text": "-2|1",
        "rationale": "The negative dividend produces remainder -1, not +1.",
        "misconception": "Assuming every remainder is nonnegative."
      },
      {
        "id": "fraction",
        "text": "-2.3333333333333|-1",
        "rationale": "intdiv returns an integer quotient, not a floating-point quotient.",
        "misconception": "Confusing intdiv with the / operator."
      }
    ],
    "correctOptionId": "truncate",
    "explanation": {
      "summary": "PHP integer division truncates toward zero. The remainder is consistent with -7 = (-2 × 3) + (-1).",
      "trace": "intdiv(-7, 3) is -2 and -7 % 3 is -1; the literal separator is printed between them."
    },
    "validation": {
      "kind": "output",
      "stdout": "-2|-1",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/function.intdiv.php",
      "https://www.php.net/manual/en/language.operators.arithmetic.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0002",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "numeric-string-array-keys",
    "objective": {
      "id": "numeric-string-array-keys",
      "text": "Distinguish canonical integer-string keys from strings with a leading zero."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Follow one key conversion and one replacement in an array literal."
    },
    "prerequisites": [
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
          "source": "<?php\n\n$values = ['8' => 'first', '08' => 'second', 8 => 'third'];\n\necho json_encode(array_keys($values));\n"
        }
      ]
    },
    "stem": "Which JSON array of keys is printed?",
    "options": [
      {
        "id": "three",
        "text": "[\"8\",\"08\",8]",
        "rationale": "The key \"8\" is converted to integer 8 before the later entry is assigned.",
        "misconception": "Assuming all written key types remain distinct."
      },
      {
        "id": "one",
        "text": "[8]",
        "rationale": "The leading-zero key \"08\" stays a string, so it is a separate entry.",
        "misconception": "Converting every digit string to an integer key."
      },
      {
        "id": "two",
        "text": "[8,\"08\"]",
        "rationale": "The last entry replaces integer key 8; the string key \"08\" remains.",
        "misconception": null
      },
      {
        "id": "reordered",
        "text": "[\"08\",8]",
        "rationale": "Replacing an existing key does not move it to the end of iteration order.",
        "misconception": "Treating replacement as removal followed by insertion."
      }
    ],
    "correctOptionId": "two",
    "explanation": {
      "summary": "PHP converts the canonical integer string \"8\" to an integer array key. The leading-zero string \"08\" stays distinct.",
      "trace": "The first key becomes 8. The second is \"08\". Assigning key 8 again changes its value without changing its position."
    },
    "validation": {
      "kind": "output",
      "stdout": "[8,\"08\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0003",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Operators & expressions",
    "subtopic": "nullsafe-argument-evaluation",
    "objective": {
      "id": "nullsafe-argument-evaluation",
      "text": "Determine whether a nullsafe call evaluates its argument expressions."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply the short-circuit rule of a single nullsafe call."
    },
    "prerequisites": [
      "Null",
      "Method-call arguments",
      "Nullsafe operator"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$receiver = null;\n$calls = 0;\n\n$receiver?->save(++$calls);\n\necho $calls;\n"
        }
      ]
    },
    "stem": "What does this program print, or which error escapes? Only the displayed variables are defined.",
    "options": [
      {
        "id": "one",
        "text": "1",
        "rationale": "The call short-circuits before evaluating ++$calls.",
        "misconception": "Evaluating arguments before checking the null receiver."
      },
      {
        "id": "type-error",
        "text": "An uncaught TypeError",
        "rationale": "A null receiver is explicitly permitted by ?->.",
        "misconception": "Treating a nullsafe call like an ordinary method call."
      },
      {
        "id": "method-error",
        "text": "An uncaught Error for an unknown save method",
        "rationale": "Method lookup is skipped when the receiver is null.",
        "misconception": "Resolving the method even though the call short-circuits."
      },
      {
        "id": "zero",
        "text": "0",
        "rationale": "The null receiver skips both the call and its argument expression.",
        "misconception": null
      }
    ],
    "correctOptionId": "zero",
    "explanation": {
      "summary": "The nullsafe operator short-circuits the call when its receiver is null, including evaluation of the call’s arguments.",
      "trace": "receiver is null, so ++$calls is never evaluated and calls remains zero."
    },
    "validation": {
      "kind": "output",
      "stdout": "0",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.basic.php#language.oop5.basic.nullsafe"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0004",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "null-valued-key-presence",
    "objective": {
      "id": "null-valued-key-presence",
      "text": "Choose the correct presence semantics for a null-valued array entry."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Compare two defined key-presence APIs on one stored null."
    },
    "prerequisites": [
      "Associative arrays",
      "null",
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
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$profile = ['email' => null];\n\necho json_encode([\n    isset($profile['email']),\n    array_key_exists('email', $profile),\n]);\n"
        }
      ]
    },
    "stem": "What JSON is printed for the explicitly stored email entry?",
    "options": [
      {
        "id": "both-true",
        "text": "[true,true]",
        "rationale": "isset returns false for a value of null even when the key exists.",
        "misconception": "Treating isset as a pure key-existence test."
      },
      {
        "id": "distinct",
        "text": "[false,true]",
        "rationale": "isset rejects null; array_key_exists still finds the stored key.",
        "misconception": null
      },
      {
        "id": "both-false",
        "text": "[false,false]",
        "rationale": "A stored null does not remove the key from the array.",
        "misconception": "Equating a null-valued entry with an absent key."
      },
      {
        "id": "reversed",
        "text": "[true,false]",
        "rationale": "The two functions have the opposite behaviors from this proposed pair.",
        "misconception": "Assigning null rejection to array_key_exists instead of isset."
      }
    ],
    "correctOptionId": "distinct",
    "explanation": {
      "summary": "isset checks that the value exists and is not null. array_key_exists checks the key independently of its value.",
      "trace": "email is a real key whose value is null, so the first predicate is false and the second true."
    },
    "validation": {
      "kind": "output",
      "stdout": "[false,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.isset.php",
      "https://www.php.net/manual/en/function.array-key-exists.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0005",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "object-assignment-alias",
    "objective": {
      "id": "object-assignment-alias",
      "text": "Recognize that assigning an object variable does not clone the object."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Trace one assignment and one property mutation through two object variables."
    },
    "prerequisites": [
      "Objects",
      "Property access"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$first = (object) ['count' => 1];\n$second = $first;\n$second->count = 4;\n\necho json_encode([$first->count, $first === $second]);\n"
        }
      ]
    },
    "stem": "What JSON is printed after modifying the second variable?",
    "options": [
      {
        "id": "same",
        "text": "[4,true]",
        "rationale": "Both variables identify the same object, whose count is now 4.",
        "misconception": null
      },
      {
        "id": "copied",
        "text": "[1,false]",
        "rationale": "Assignment alone does not create a distinct object.",
        "misconception": "Applying array-style value copying to object assignment."
      },
      {
        "id": "equal-copy",
        "text": "[1,true]",
        "rationale": "Identical object variables cannot expose two different values for this property.",
        "misconception": "Assuming identity comparison means matching initial contents."
      },
      {
        "id": "mutated-copy",
        "text": "[4,false]",
        "rationale": "No clone or new object appears between the two assignments.",
        "misconception": "Assuming property mutation separates the object automatically."
      }
    ],
    "correctOptionId": "same",
    "explanation": {
      "summary": "Object assignment copies the object identifier. Mutating that object through either variable is observable through the other.",
      "trace": "first and second both identify one object. Setting second->count changes that object, and === confirms identity."
    },
    "validation": {
      "kind": "output",
      "stdout": "[4,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0006",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Variables, scope & constants",
    "subtopic": "variable-variable-target",
    "objective": {
      "id": "variable-variable-target",
      "text": "Resolve a variable variable using the current name string."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Resolve two simple indirect assignments without introducing reference semantics."
    },
    "prerequisites": [
      "Variables",
      "Variable variables"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$name = 'count';\n$$name = 3;\n$name = 'limit';\n$$name = 8;\n\necho $count, '|', $limit;\n"
        }
      ]
    },
    "stem": "What text is printed? All variables shown are in the same scope.",
    "options": [
      {
        "id": "same-target",
        "text": "8|8",
        "rationale": "Changing name redirects later indirect assignment; it does not change count.",
        "misconception": "Treating the earlier target as a permanent binding."
      },
      {
        "id": "name-values",
        "text": "count|limit",
        "rationale": "The assignments store integers in the named variables.",
        "misconception": "Confusing the target variable names with their assigned values."
      },
      {
        "id": "distinct",
        "text": "3|8",
        "rationale": "The first assignment targets count and the second targets limit.",
        "misconception": null
      },
      {
        "id": "reference",
        "text": "3|3",
        "rationale": "The two indirect assignments neither alias each other nor share one value.",
        "misconception": "Reading variable-variable syntax as a reference binding."
      }
    ],
    "correctOptionId": "distinct",
    "explanation": {
      "summary": "$$name selects a variable by the current string in name. It does not establish a reference that follows future changes to name.",
      "trace": "The first assignment creates count=3. After changing name, the second creates limit=8."
    },
    "validation": {
      "kind": "output",
      "stdout": "3|8",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-02"
    },
    "references": [
      "https://www.php.net/manual/en/language.variables.variable.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0007",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Types, casting & comparisons",
    "subtopic": "byte-length-utf8-string",
    "objective": {
      "id": "byte-length-utf8-string",
      "text": "Distinguish PHP byte-string length from character count."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply strlen’s byte-count contract to one specified UTF-8 character."
    },
    "prerequisites": [
      "Strings",
      "UTF-8 bytes"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\necho strlen('é');\n"
        }
      ]
    },
    "stem": "What integer is printed? The source is UTF-8, and the string contains only the character é, encoded as bytes C3 A9.",
    "options": [
      {
        "id": "character",
        "text": "1",
        "rationale": "strlen counts the two encoded bytes, not one Unicode character.",
        "misconception": "Treating strlen as a Unicode character counter."
      },
      {
        "id": "bytes",
        "text": "2",
        "rationale": "The explicitly specified UTF-8 encoding contains two bytes.",
        "misconception": null
      },
      {
        "id": "terminator",
        "text": "3",
        "rationale": "PHP string length does not count a trailing C-style null terminator.",
        "misconception": "Adding a storage terminator to the visible byte length."
      },
      {
        "id": "bits",
        "text": "16",
        "rationale": "strlen reports bytes, not the number of bits in those bytes.",
        "misconception": "Converting byte length into bit length."
      }
    ],
    "correctOptionId": "bytes",
    "explanation": {
      "summary": "PHP strings are byte sequences, and strlen reports their byte length.",
      "trace": "The specified encoding is C3 A9, exactly two bytes. No multibyte-string function is called."
    },
    "validation": {
      "kind": "output",
      "stdout": "2",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/function.strlen.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0008",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "append-after-unset-index",
    "objective": {
      "id": "append-after-unset-index",
      "text": "Track the next integer append index after removing the last element."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Follow one unset and one append while distinguishing array keys from positions."
    },
    "prerequisites": [
      "Integer array keys",
      "unset",
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
          "source": "<?php\n\n$items = [10, 20];\nunset($items[1]);\n$items[] = 30;\n\necho json_encode($items);\n"
        }
      ]
    },
    "stem": "What JSON is printed? No reindexing function is called.",
    "options": [
      {
        "id": "list",
        "text": "[10,30]",
        "rationale": "Removing key 1 does not reset the array’s next append index to 1.",
        "misconception": "Assuming append always fills the most recent hole."
      },
      {
        "id": "null-hole",
        "text": "[10,null,30]",
        "rationale": "An absent key is not stored as an explicit null array element.",
        "misconception": "Treating a missing PHP array key as a null list slot."
      },
      {
        "id": "sparse",
        "text": "{\"0\":10,\"2\":30}",
        "rationale": "The appended entry uses key 2; the non-list keys encode as a JSON object.",
        "misconception": null
      },
      {
        "id": "overwrite",
        "text": "[30]",
        "rationale": "Append does not overwrite the remaining entry at key 0.",
        "misconception": "Using the current element count as the existing key to replace."
      }
    ],
    "correctOptionId": "sparse",
    "explanation": {
      "summary": "unset removes an entry without reindexing or rewinding the array’s next integer append index.",
      "trace": "Keys start at 0 and 1. Removing 1 leaves next append index 2. The resulting keys 0 and 2 are not a JSON list."
    },
    "validation": {
      "kind": "output",
      "stdout": "{\"0\":10,\"2\":30}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.array.php",
      "https://www.php.net/manual/en/function.json-encode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0009",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Types, casting & comparisons",
    "subtopic": "boolean-string-conversion",
    "objective": {
      "id": "boolean-string-conversion",
      "text": "Apply PHP’s boolean conversion rules to nonempty strings."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Classify three literal strings using one conversion rule."
    },
    "prerequisites": [
      "Boolean casts",
      "Strings"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$values = ['false', '0', '00'];\n$flags = array_map(fn ($value) => (bool) $value, $values);\n\necho json_encode($flags);\n"
        }
      ]
    },
    "stem": "What JSON is produced by these explicit boolean casts?",
    "options": [
      {
        "id": "word-parsing",
        "text": "[false,false,false]",
        "rationale": "A boolean cast does not parse English boolean words or arbitrary zero-like strings.",
        "misconception": "Treating casts as semantic parsing of form text."
      },
      {
        "id": "all-nonempty",
        "text": "[true,true,true]",
        "rationale": "The exact string \"0\" is a special falsy string.",
        "misconception": "Assuming every nonempty string is truthy."
      },
      {
        "id": "numeric-only",
        "text": "[true,false,false]",
        "rationale": "The two-character string \"00\" is truthy.",
        "misconception": "Applying numeric comparison with zero during a boolean cast."
      },
      {
        "id": "php-rules",
        "text": "[true,false,true]",
        "rationale": "Only the exact string \"0\" among these values is falsy.",
        "misconception": null
      }
    ],
    "correctOptionId": "php-rules",
    "explanation": {
      "summary": "For strings, the empty string and the exact string \"0\" are falsy. Other nonempty strings are truthy.",
      "trace": "\"false\" is a nonempty ordinary string, \"0\" is the special falsy string, and \"00\" is a different nonempty string."
    },
    "validation": {
      "kind": "output",
      "stdout": "[true,false,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.boolean.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0010",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Control flow & pattern matching",
    "subtopic": "unhandled-match-without-default",
    "objective": {
      "id": "unhandled-match-without-default",
      "text": "Identify the outcome of a match expression with no matching arm."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Recognize one defined control-flow failure rather than infer an implicit default."
    },
    "prerequisites": [
      "match",
      "Throwable",
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
          "source": "<?php\n\ntry {\n    $label = match (3) {\n        1 => 'one',\n        2 => 'two',\n    };\n} catch (Throwable $error) {\n    echo get_class($error);\n}\n"
        }
      ]
    },
    "stem": "Which class name is printed by the catch block?",
    "options": [
      {
        "id": "unhandled",
        "text": "UnhandledMatchError",
        "rationale": "No arm matches and there is no default, so PHP raises UnhandledMatchError.",
        "misconception": null
      },
      {
        "id": "type",
        "text": "TypeError",
        "rationale": "The subject and arm conditions are type-valid integers.",
        "misconception": "Mistaking absence of a matching arm for an argument type failure."
      },
      {
        "id": "value",
        "text": "ValueError",
        "rationale": "match has its own defined error type for this situation.",
        "misconception": "Applying the error category used by invalid built-in argument values."
      },
      {
        "id": "exception",
        "text": "Exception",
        "rationale": "get_class reports the concrete thrown object, not a generic exception category.",
        "misconception": "Assuming control-flow failures instantiate the base Exception class."
      }
    ],
    "correctOptionId": "unhandled",
    "explanation": {
      "summary": "A match expression must select an arm. With no matching condition and no default, it throws UnhandledMatchError.",
      "trace": "The subject 3 matches neither integer 1 nor integer 2. Throwable catches the resulting error and get_class reveals its concrete class."
    },
    "validation": {
      "kind": "output",
      "stdout": "UnhandledMatchError",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0011",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Enums, attributes & reflection",
    "subtopic": "enum-case-name-versus-value",
    "objective": {
      "id": "enum-case-name-versus-value",
      "text": "Distinguish a backed enum case’s name from its scalar value."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Read two explicitly declared enum properties without conversion or lookup."
    },
    "prerequisites": [
      "Backed enums (unmapped curriculum)"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nenum State: string\n{\n    case Open = 'open';\n}\n\n$state = State::Open;\n\necho $state->name, '|', $state->value;\n"
        }
      ]
    },
    "stem": "What text is printed from the selected enum case?",
    "options": [
      {
        "id": "values",
        "text": "open|open",
        "rationale": "The name is the declared identifier Open, including its capitalization.",
        "misconception": "Assuming name is an alias for the backing value."
      },
      {
        "id": "names",
        "text": "Open|Open",
        "rationale": "The value is the declared string \"open\", not the identifier.",
        "misconception": "Using the case identifier as the backing value."
      },
      {
        "id": "distinct",
        "text": "Open|open",
        "rationale": "name exposes Open; value exposes the declared string open.",
        "misconception": null
      },
      {
        "id": "qualified",
        "text": "State::Open|open",
        "rationale": "The name property does not include the enum’s qualified class name.",
        "misconception": "Treating the case name property as a fully qualified expression."
      }
    ],
    "correctOptionId": "distinct",
    "explanation": {
      "summary": "A backed enum case exposes its declared case identifier as name and its explicitly assigned scalar as value.",
      "trace": "The declaration names the case Open and assigns the string open. No conversion function is involved."
    },
    "validation": {
      "kind": "output",
      "stdout": "Open|open",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/language.enumerations.basics.php",
      "https://www.php.net/manual/en/language.enumerations.backed.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0012",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "PDO & database access",
    "subtopic": "empty-pdo-fetch-results",
    "objective": {
      "id": "empty-pdo-fetch-results",
      "text": "Distinguish a single-row fetch failure from an empty fetched result set."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply the two fetch methods’ documented empty-result return values."
    },
    "prerequisites": [
      "PDO statements (unmapped curriculum)",
      "Arrays and false"
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
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$one = $pdo->query('SELECT 1 WHERE 0');\n$all = $pdo->query('SELECT 1 WHERE 0');\n\necho json_encode([\n    $one->fetch(PDO::FETCH_ASSOC),\n    $all->fetchAll(PDO::FETCH_ASSOC),\n]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? SQLite is in memory and both queries produce zero rows.",
    "options": [
      {
        "id": "both-arrays",
        "text": "[[],[]]",
        "rationale": "fetch returns false when no next row exists.",
        "misconception": "Assuming every fetching method returns an array on an empty result."
      },
      {
        "id": "distinct",
        "text": "[false,[]]",
        "rationale": "fetch signals no row with false; fetchAll returns an empty result array.",
        "misconception": null
      },
      {
        "id": "both-false",
        "text": "[false,false]",
        "rationale": "fetchAll returns an array containing all remaining rows, even when there are none.",
        "misconception": "Using the single-row sentinel for the whole result set."
      },
      {
        "id": "nulls",
        "text": "[null,null]",
        "rationale": "Neither successful empty query uses null for these method results.",
        "misconception": "Treating absent SQL rows as SQL NULL values."
      }
    ],
    "correctOptionId": "distinct",
    "explanation": {
      "summary": "fetch returns one row or false when exhausted. fetchAll returns an array of rows; zero rows is an empty array.",
      "trace": "Both statements execute successfully. The first has no next row, and the second has no rows to collect."
    },
    "validation": {
      "kind": "output",
      "stdout": "[false,[]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdostatement.fetch.php",
      "https://www.php.net/manual/en/pdostatement.fetchall.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0013",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "merge-numeric-and-string-keys",
    "objective": {
      "id": "merge-numeric-and-string-keys",
      "text": "Predict array_merge behavior for numeric keys and duplicate string keys."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply the documented merge rules to two small arrays."
    },
    "prerequisites": [
      "Numeric and string array keys",
      "array_merge"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$left = [2 => 'a', 'tag' => 'old'];\n$right = [5 => 'b', 'tag' => 'new'];\n\necho json_encode(array_merge($left, $right));\n"
        }
      ]
    },
    "stem": "What JSON does this merge print? Preserve the result’s iteration order in your answer.",
    "options": [
      {
        "id": "preserve-all",
        "text": "{\"2\":\"a\",\"tag\":\"new\",\"5\":\"b\"}",
        "rationale": "array_merge renumbers numeric keys instead of preserving 2 and 5.",
        "misconception": "Applying string-key replacement rules to numeric keys."
      },
      {
        "id": "left-wins",
        "text": "{\"0\":\"a\",\"tag\":\"old\",\"1\":\"b\"}",
        "rationale": "For duplicate string keys, the later value replaces the earlier value.",
        "misconception": "Confusing array_merge with left-biased array union."
      },
      {
        "id": "move-tag",
        "text": "{\"0\":\"a\",\"1\":\"b\",\"tag\":\"new\"}",
        "rationale": "Replacing the tag value does not move its original position.",
        "misconception": "Treating string-key replacement as a new insertion at the end."
      },
      {
        "id": "merge-rules",
        "text": "{\"0\":\"a\",\"tag\":\"new\",\"1\":\"b\"}",
        "rationale": "Numeric entries are renumbered; the later tag value replaces old in place.",
        "misconception": null
      }
    ],
    "correctOptionId": "merge-rules",
    "explanation": {
      "summary": "array_merge appends and renumbers numeric-keyed entries, while later values replace duplicate string-keyed entries.",
      "trace": "The left numeric entry becomes key 0. tag is inserted next. The right numeric entry becomes key 1, and tag is then replaced without moving."
    },
    "validation": {
      "kind": "output",
      "stdout": "{\"0\":\"a\",\"tag\":\"new\",\"1\":\"b\"}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-merge.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0014",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Errors & exceptions",
    "subtopic": "first-matching-catch",
    "objective": {
      "id": "first-matching-catch",
      "text": "Select the first matching catch clause rather than the most specific type."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Use inheritance and source order to select one handler."
    },
    "prerequisites": [
      "Exception inheritance",
      "catch"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\ntry {\n    throw new RuntimeException('failed');\n} catch (Exception $error) {\n    echo 'parent';\n} catch (RuntimeException $error) {\n    echo 'specific';\n}\n"
        }
      ]
    },
    "stem": "Which word is printed when the exception is thrown?",
    "options": [
      {
        "id": "specific",
        "text": "specific",
        "rationale": "PHP does not skip an earlier matching parent-type catch to seek a more specific clause.",
        "misconception": "Assuming catch selection chooses the narrowest available type."
      },
      {
        "id": "both",
        "text": "parentspecific",
        "rationale": "After one catch handles the throwable, later catches are not executed.",
        "misconception": "Treating matching catch clauses as independent if statements."
      },
      {
        "id": "parent",
        "text": "parent",
        "rationale": "RuntimeException extends Exception, so the first catch matches.",
        "misconception": null
      },
      {
        "id": "rejected",
        "text": "No word; the catch order is a syntax error",
        "rationale": "This ordering is legal even though the later catch is unreachable for this throwable.",
        "misconception": "Confusing an unreachable handler with a parse-time prohibition."
      }
    ],
    "correctOptionId": "parent",
    "explanation": {
      "summary": "Catch clauses are checked in order, and the first compatible type handles the throwable.",
      "trace": "RuntimeException is an Exception, so the first catch executes and the second is skipped."
    },
    "validation": {
      "kind": "output",
      "stdout": "parent",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0015",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "class-name-resolution-without-loading",
    "objective": {
      "id": "class-name-resolution-without-loading",
      "text": "Resolve ::class without assuming the referenced class must already exist."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply namespace name resolution to a class-name string expression."
    },
    "prerequisites": [
      "Namespaces",
      "::class"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nnamespace App;\n\necho Missing::class;\n"
        }
      ]
    },
    "stem": "What is printed? No App\\Missing class is defined, and no autoloader is registered.",
    "options": [
      {
        "id": "qualified",
        "text": "App\\Missing",
        "rationale": "::class resolves the class-name string without creating or loading the class.",
        "misconception": null
      },
      {
        "id": "short",
        "text": "Missing",
        "rationale": "An unqualified name in this namespace resolves relative to App.",
        "misconception": "Assuming ::class returns the source spelling before namespace resolution."
      },
      {
        "id": "error",
        "text": "An uncaught Error for a missing class",
        "rationale": "Producing the name string does not require that class to exist.",
        "misconception": "Confusing ::class with constructing an instance."
      },
      {
        "id": "leading-separator",
        "text": "\\App\\Missing",
        "rationale": "The resolved class-name string omits the leading qualification separator.",
        "misconception": "Including a source-level leading backslash in the resolved class-name string."
      }
    ],
    "correctOptionId": "qualified",
    "explanation": {
      "summary": "The ::class form produces a resolved class-name string; it does not instantiate or require the class.",
      "trace": "Missing is an unqualified name inside App, so its resolved spelling is App\\Missing."
    },
    "validation": {
      "kind": "output",
      "stdout": "App\\Missing",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.basic.php#language.oop5.basic.class.class",
      "https://www.php.net/manual/en/language.namespaces.rules.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0016",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Functions & arguments",
    "subtopic": "named-variadic-keys",
    "objective": {
      "id": "named-variadic-keys",
      "text": "Track positional and named values collected by an untyped variadic parameter."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine argument binding rules with the resulting array-key types."
    },
    "prerequisites": [
      "Variadics",
      "Named arguments",
      "JSON list versus object encoding"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction collect(...$arguments): void\n{\n    echo json_encode($arguments);\n}\n\ncollect(7, debug: true);\n"
        }
      ]
    },
    "stem": "What JSON does the function print for this call?",
    "options": [
      {
        "id": "list",
        "text": "[7,true]",
        "rationale": "An unmatched named argument keeps its string key in the variadic array.",
        "misconception": "Assuming variadics discard every argument name."
      },
      {
        "id": "named-only",
        "text": "{\"debug\":true}",
        "rationale": "The positional value is collected as well, under integer key 0.",
        "misconception": "Assuming a named argument replaces already collected positional arguments."
      },
      {
        "id": "mixed-keys",
        "text": "{\"0\":7,\"debug\":true}",
        "rationale": "The positional argument gets key 0 and the named one keeps debug.",
        "misconception": null
      },
      {
        "id": "rejected-name",
        "text": "An uncaught Error for an unknown debug parameter",
        "rationale": "A variadic parameter can collect unmatched named arguments.",
        "misconception": "Applying non-variadic unknown-name rejection to variadic collection."
      }
    ],
    "correctOptionId": "mixed-keys",
    "explanation": {
      "summary": "Variadics collect positional values with numeric keys and unmatched named values with their argument names.",
      "trace": "The array is [0 => 7, \"debug\" => true]. Its mixed key structure encodes as a JSON object."
    },
    "validation": {
      "kind": "output",
      "stdout": "{\"0\":7,\"debug\":true}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/functions.arguments.php#functions.variable-arg-list",
      "https://www.php.net/manual/en/functions.arguments.php#functions.named-arguments"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0017",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Closures, callbacks & callables",
    "subtopic": "arrow-captured-object-rebinding",
    "objective": {
      "id": "arrow-captured-object-rebinding",
      "text": "Separate mutation of a captured object from rebinding the outer variable."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track the captured object identifier through mutation and later assignment of a different object."
    },
    "prerequisites": [
      "Arrow functions",
      "Object identity",
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
          "source": "<?php\n\n$config = (object) ['value' => 1];\n$read = fn () => $config->value;\n\n$config->value = 2;\n$config = (object) ['value' => 3];\n\necho $read();\n"
        }
      ]
    },
    "stem": "Which integer does the closure return when it is finally called?",
    "options": [
      {
        "id": "initial-property",
        "text": "1",
        "rationale": "Capturing an object by value does not snapshot its properties.",
        "misconception": "Treating by-value capture as a deep copy of the object."
      },
      {
        "id": "mutated-object",
        "text": "2",
        "rationale": "The captured identifier still points to the first object, which was mutated to 2.",
        "misconception": null
      },
      {
        "id": "new-object",
        "text": "3",
        "rationale": "The arrow function did not capture the outer variable by reference.",
        "misconception": "Following the outer variable’s later rebinding."
      },
      {
        "id": "unbound",
        "text": "An uncaught Error because config is not imported with use",
        "rationale": "Arrow functions automatically capture the outer values they use.",
        "misconception": "Applying the explicit use requirement of ordinary closures to arrow functions."
      }
    ],
    "correctOptionId": "mutated-object",
    "explanation": {
      "summary": "An arrow function captures the object identifier by value. Mutating that object is visible, while assigning a different object to the outer variable does not redirect the capture.",
      "trace": "read retains the first object. Its value changes from 1 to 2. The later assignment changes only the outer config variable."
    },
    "validation": {
      "kind": "output",
      "stdout": "2",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/functions.arrow.php",
      "https://www.php.net/manual/en/language.oop5.references.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0018",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "destructor-last-strong-reference",
    "objective": {
      "id": "destructor-last-strong-reference",
      "text": "Predict when a destructor runs as two aliases to the same object are unset."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track object lifetime separately from the lifetime of each variable naming it."
    },
    "prerequisites": [
      "Object identity",
      "unset",
      "Destructors"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Box\n{\n    public static array $trace = [];\n\n    public function __destruct()\n    {\n        self::$trace[] = 'released';\n    }\n}\n\n$first = new Box();\n$second = $first;\n\nunset($first);\nBox::$trace[] = 'after-first';\n\nunset($second);\nBox::$trace[] = 'after-second';\n\necho json_encode(Box::$trace);\n"
        }
      ]
    },
    "stem": "What JSON trace is printed? No other references to the Box object are created.",
    "options": [
      {
        "id": "first-unset",
        "text": "[\"released\",\"after-first\",\"after-second\"]",
        "rationale": "The second variable still retains the object after first is unset.",
        "misconception": "Assuming the first unset destroys an object regardless of remaining aliases."
      },
      {
        "id": "last-unset",
        "text": "[\"after-first\",\"released\",\"after-second\"]",
        "rationale": "The last strong reference is removed by unsetting second, so destruction occurs between the two markers.",
        "misconception": null
      },
      {
        "id": "shutdown-only",
        "text": "[\"after-first\",\"after-second\"]",
        "rationale": "This acyclic object is destroyed when its last strong reference is removed, before the final echo.",
        "misconception": "Assuming every destructor waits until process shutdown."
      },
      {
        "id": "each-variable",
        "text": "[\"released\",\"after-first\",\"released\",\"after-second\"]",
        "rationale": "There is one object and one destructor call, not one per variable name.",
        "misconception": "Treating object assignment as creating a second object with its own lifetime."
      }
    ],
    "correctOptionId": "last-unset",
    "explanation": {
      "summary": "Object assignment creates another reference to the same object. Unsetting a variable removes that reference; destruction occurs when the final strong reference to this acyclic object is removed.",
      "trace": "second keeps the object alive after first is unset. Unsetting second invokes __destruct before the after-second marker is appended."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"after-first\",\"released\",\"after-second\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.decon.php#language.oop5.decon.destructor",
      "https://www.php.net/manual/en/language.oop5.references.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0019",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Closures, callbacks & callables",
    "subtopic": "array-walk-mutation-and-return",
    "objective": {
      "id": "array-walk-mutation-and-return",
      "text": "Separate a by-reference callback mutation from array_walk’s own return value."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track the callback’s parameter binding and distinguish two different return values."
    },
    "prerequisites": [
      "Callbacks",
      "References",
      "array_walk"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$values = [2, 3];\n$result = array_walk($values, function (&$value): int {\n    $value *= 2;\n\n    return 99;\n});\n\necho json_encode([$values, $result]);\n"
        }
      ]
    },
    "stem": "What JSON is printed? The callback’s return statement is intentional.",
    "options": [
      {
        "id": "mapped-returns",
        "text": "[[99,99],true]",
        "rationale": "array_walk ignores callback return values rather than using them as replacement elements.",
        "misconception": "Applying array_map’s return-value transformation model."
      },
      {
        "id": "mutation",
        "text": "[[4,6],true]",
        "rationale": "The reference parameter mutates each value, while array_walk returns true.",
        "misconception": null
      },
      {
        "id": "new-array",
        "text": "[[2,3],[4,6]]",
        "rationale": "The original array is mutated and array_walk does not return a transformed array.",
        "misconception": "Treating array_walk as a non-mutating mapping function."
      },
      {
        "id": "callback-result",
        "text": "[[4,6],99]",
        "rationale": "array_walk does not return the last callback result.",
        "misconception": "Propagating the callback’s return value through the outer API."
      }
    ],
    "correctOptionId": "mutation",
    "explanation": {
      "summary": "array_walk passes each element to the callback, and a reference parameter can mutate it. Callback return values are discarded; the walk returns true.",
      "trace": "The two reference writes change 2 to 4 and 3 to 6. Returning 99 has no effect on either the elements or the successful walk result."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[4,6],true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-walk.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0020",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "immutable-timezone-date-boundary",
    "objective": {
      "id": "immutable-timezone-date-boundary",
      "text": "Preserve the original immutable instant while interpreting its date in another offset."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine immutable-return semantics with an explicit offset crossing midnight."
    },
    "prerequisites": [
      "DateTimeImmutable (unmapped curriculum)",
      "Timezone offsets",
      "Object methods"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$utc = new DateTimeImmutable('2024-01-31 23:30:00', new DateTimeZone('UTC'));\n$local = $utc->setTimezone(new DateTimeZone('+02:00'));\n\necho $utc->format('m-d H:i'), '|', $local->format('m-d H:i');\n"
        }
      ]
    },
    "stem": "What text is printed? The second zone is a fixed +02:00 offset, with no daylight-saving transition.",
    "options": [
      {
        "id": "mutated",
        "text": "02-01 01:30|02-01 01:30",
        "rationale": "setTimezone returns a new DateTimeImmutable and does not change utc.",
        "misconception": "Applying mutable DateTime behavior to DateTimeImmutable."
      },
      {
        "id": "unchanged-clock",
        "text": "01-31 23:30|01-31 23:30",
        "rationale": "The instant is preserved, but its displayed wall-clock time changes with the offset.",
        "misconception": "Confusing an unchanged instant with an unchanged local time."
      },
      {
        "id": "converted",
        "text": "01-31 23:30|02-01 01:30",
        "rationale": "utc remains unchanged; adding the display offset crosses into February.",
        "misconception": null
      },
      {
        "id": "same-date",
        "text": "01-31 23:30|01-31 01:30",
        "rationale": "Moving two hours forward from 23:30 crosses the date boundary.",
        "misconception": "Adjusting the hour while failing to carry the day."
      }
    ],
    "correctOptionId": "converted",
    "explanation": {
      "summary": "DateTimeImmutable returns a new value for a timezone change. The same instant appears two hours later in +02:00.",
      "trace": "The original remains January 31 at 23:30 UTC. The returned value displays February 1 at 01:30 with the fixed offset."
    },
    "validation": {
      "kind": "output",
      "stdout": "01-31 23:30|02-01 01:30",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/datetimeimmutable.settimezone.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0021",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Files & structured data",
    "subtopic": "json-object-to-php-list-roundtrip",
    "objective": {
      "id": "json-object-to-php-list-roundtrip",
      "text": "Recognize loss of JSON object shape when decoding numeric keys into an associative PHP array."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace key conversion during decode and list detection during encode."
    },
    "prerequisites": [
      "JSON objects",
      "Associative decoding",
      "Integer array keys"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$data = json_decode('{\"0\":\"a\",\"1\":\"b\"}', true, flags: JSON_THROW_ON_ERROR);\n\necho json_encode($data, JSON_THROW_ON_ERROR);\n"
        }
      ]
    },
    "stem": "What JSON is emitted by this decode/encode round trip?",
    "options": [
      {
        "id": "object-shape",
        "text": "{\"0\":\"a\",\"1\":\"b\"}",
        "rationale": "Associative decoding produces consecutive integer array keys, which encode as a list.",
        "misconception": "Assuming the original JSON object shape is retained as metadata."
      },
      {
        "id": "list-shape",
        "text": "[\"a\",\"b\"]",
        "rationale": "Keys 0 and 1 form a PHP list after decoding, so encoding emits an array.",
        "misconception": null
      },
      {
        "id": "empty",
        "text": "[]",
        "rationale": "Both string values survive decoding; only the container shape changes.",
        "misconception": "Assuming numeric property names are discarded during associative decoding."
      },
      {
        "id": "exception",
        "text": "An uncaught JsonException",
        "rationale": "The input is valid JSON and both operations support these keys.",
        "misconception": "Treating numeric object property names as invalid JSON."
      }
    ],
    "correctOptionId": "list-shape",
    "explanation": {
      "summary": "Associative JSON decoding uses PHP array keys. Consecutive integer keys starting at zero make the resulting PHP array a list when it is encoded again.",
      "trace": "The decoded keys become integers 0 and 1. json_encode therefore writes [\"a\",\"b\"], without the original object syntax."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"a\",\"b\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.json-decode.php",
      "https://www.php.net/manual/en/function.json-encode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0022",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "trait-alias-keeps-original-method",
    "objective": {
      "id": "trait-alias-keeps-original-method",
      "text": "Distinguish creating a private trait alias from changing the original method’s visibility."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Resolve a trait adaptation and the visibility of the unchanged original name."
    },
    "prerequisites": [
      "Traits",
      "Method aliases",
      "Visibility"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\ntrait Greeting\n{\n    public function hello(): string\n    {\n        return 'hello';\n    }\n}\n\nfinal class Greeter\n{\n    use Greeting {\n        hello as private hiddenHello;\n    }\n}\n\necho (new Greeter())->hello();\n"
        }
      ]
    },
    "stem": "What text is printed by the call outside the class?",
    "options": [
      {
        "id": "renamed",
        "text": "An uncaught Error because hello was renamed",
        "rationale": "The as clause adds an alias and does not remove the original name.",
        "misconception": "Treating trait aliasing as destructive renaming."
      },
      {
        "id": "private",
        "text": "An uncaught Error because hello became private",
        "rationale": "The private visibility applies to hiddenHello, the new alias.",
        "misconception": "Applying an alias’s visibility modifier to the original method."
      },
      {
        "id": "visibility-conflict",
        "text": "An uncaught Error because a trait alias cannot narrow the original method’s visibility",
        "rationale": "Trait alias visibility can differ from the original method; this declaration is valid.",
        "misconception": "Confusing alias visibility adaptation with an incompatible inherited-method override."
      },
      {
        "id": "original",
        "text": "hello",
        "rationale": "The original public hello remains available alongside its private alias.",
        "misconception": null
      }
    ],
    "correctOptionId": "original",
    "explanation": {
      "summary": "A trait alias adds another method name. Giving that alias private visibility leaves the original public method unchanged.",
      "trace": "Greeter has public hello and private hiddenHello. The shown call uses public hello once."
    },
    "validation": {
      "kind": "output",
      "stdout": "hello",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0023",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Classes & object lifecycle",
    "subtopic": "readonly-null-coalescing-assignment",
    "objective": {
      "id": "readonly-null-coalescing-assignment",
      "text": "Distinguish a null readonly property from an uninitialized readonly property."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine the null test of ??= with the one-write rule of readonly properties."
    },
    "prerequisites": [
      "Readonly properties",
      "Constructor promotion",
      "Null coalescing assignment"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfinal class Record\n{\n    public function __construct(public readonly ?string $label)\n    {\n    }\n}\n\n$record = new Record(null);\n\ntry {\n    $record->label ??= 'fallback';\n} catch (Error $error) {\n    echo 'blocked';\n}\n\necho '|', json_encode($record->label);\n"
        }
      ]
    },
    "stem": "What text is printed? The readonly property is deliberately initialized to null by construction.",
    "options": [
      {
        "id": "fallback",
        "text": "|\"fallback\"",
        "rationale": "The null value is already initialized; the attempted second write is not permitted.",
        "misconception": "Treating a null readonly property as uninitialized."
      },
      {
        "id": "skip",
        "text": "|null",
        "rationale": "??= attempts assignment when the current value is null.",
        "misconception": "Assuming ??= checks initialization rather than nullness."
      },
      {
        "id": "blocked",
        "text": "blocked|null",
        "rationale": "??= attempts a prohibited write, so Error is caught and the null remains.",
        "misconception": null
      },
      {
        "id": "write-then-error",
        "text": "blocked|\"fallback\"",
        "rationale": "The prohibited write does not commit the fallback value before raising Error.",
        "misconception": "Assuming readonly enforcement occurs after mutation."
      }
    ],
    "correctOptionId": "blocked",
    "explanation": {
      "summary": "A readonly property initialized to null has already consumed its initialization write. ??= still attempts to assign because its value is null.",
      "trace": "Construction initializes label. The coalescing assignment raises Error before changing it, and the final encoding prints null."
    },
    "validation": {
      "kind": "output",
      "stdout": "blocked|null",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties",
      "https://www.php.net/manual/en/language.operators.assignment.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0024",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Iterators, generators & fibers",
    "subtopic": "generator-suspension-and-final-reference",
    "objective": {
      "id": "generator-suspension-and-final-reference",
      "text": "Locate generator cleanup relative to lazy start, early loop termination and destruction."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Track generator creation, suspension at yield and finalization after the last reference is released."
    },
    "prerequisites": [
      "Generators (unmapped advanced curriculum)",
      "finally",
      "Object lifetime"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$events = [];\n\nfunction sequence(array &$events): Generator\n{\n    try {\n        $events[] = 'start';\n        yield 1;\n        $events[] = 'continued';\n    } finally {\n        $events[] = 'cleanup';\n    }\n}\n\n$generator = sequence($events);\n$events[] = 'created';\n\nforeach ($generator as $value) {\n    break;\n}\n\n$events[] = 'after-loop';\nunset($generator);\n\necho json_encode($events);\n"
        }
      ]
    },
    "stem": "What JSON trace is printed? The shown variable is the only surviving reference to the generator after the loop.",
    "options": [
      {
        "id": "eager",
        "text": "[\"start\",\"created\",\"after-loop\",\"cleanup\"]",
        "rationale": "Calling the generator function creates the generator without starting its body.",
        "misconception": "Assuming generator function bodies execute before the first yield immediately on creation."
      },
      {
        "id": "close-on-break",
        "text": "[\"created\",\"start\",\"cleanup\",\"after-loop\"]",
        "rationale": "The generator remains referenced and suspended after break, so cleanup has not run yet.",
        "misconception": "Treating break as closing a still-referenced generator."
      },
      {
        "id": "resume-to-end",
        "text": "[\"created\",\"start\",\"after-loop\",\"continued\",\"cleanup\"]",
        "rationale": "Finalization runs finally without resuming ordinary statements after the yield.",
        "misconception": "Assuming destruction drains the remaining generator body."
      },
      {
        "id": "last-reference",
        "text": "[\"created\",\"start\",\"after-loop\",\"cleanup\"]",
        "rationale": "Iteration starts the body; break leaves it suspended; releasing the last reference runs finally.",
        "misconception": null
      }
    ],
    "correctOptionId": "last-reference",
    "explanation": {
      "summary": "A generator starts lazily and can remain suspended after a consumer breaks. Releasing its final reference finalizes it and executes finally without executing the remaining ordinary body.",
      "trace": "created is appended before iteration starts. The first iteration appends start and yields. break leaves the generator alive. after-loop is appended, and unset then triggers cleanup."
    },
    "validation": {
      "kind": "output",
      "stdout": "[\"created\",\"start\",\"after-loop\",\"cleanup\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/language.generators.overview.php",
      "https://www.php.net/manual/en/language.generators.syntax.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0025",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "execution",
    "topic": "Arrays & destructuring",
    "subtopic": "copied-array-shared-reference-element",
    "objective": {
      "id": "copied-array-shared-reference-element",
      "text": "Track a referenced element shared by value-copied arrays after an external alias is unset."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine array value copying, embedded reference containers and removal of only one reference binding."
    },
    "prerequisites": [
      "References",
      "Array copy-on-write",
      "unset"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$first = [1, 2];\n$alias =& $first[0];\n$second = $first;\n\n$second[0] = 9;\n$second[1] = 8;\nunset($alias);\n$second[0] = 7;\n\necho json_encode([$first, $second]);\n"
        }
      ]
    },
    "stem": "What JSON is printed for the two arrays? Track the referenced first element separately from the ordinary second element.",
    "options": [
      {
        "id": "isolated",
        "text": "[[1,2],[7,8]]",
        "rationale": "The referenced first element remains shared across the copied arrays.",
        "misconception": "Assuming copying an array deep-copies its reference containers."
      },
      {
        "id": "shared-all",
        "text": "[[7,8],[7,8]]",
        "rationale": "The ordinary second element is not a reference and separates on modification.",
        "misconception": "Treating one referenced element as making the entire array an alias."
      },
      {
        "id": "detached-after-unset",
        "text": "[[9,2],[7,8]]",
        "rationale": "Unsetting alias removes only that binding; both arrays still share the reference container.",
        "misconception": "Assuming removing an external alias detaches the arrays from each other."
      },
      {
        "id": "element-reference",
        "text": "[[7,2],[7,8]]",
        "rationale": "Only the referenced first element propagates both writes across the copied arrays.",
        "misconception": null
      }
    ],
    "correctOptionId": "element-reference",
    "explanation": {
      "summary": "An array copy can retain references stored in its elements. Removing one variable that points at a reference does not break the bindings still held by both arrays.",
      "trace": "The first elements share a reference container, so 9 and then 7 reach both arrays. The second element has value semantics, so writing 8 affects only second."
    },
    "validation": {
      "kind": "output",
      "stdout": "[[7,2],[7,8]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/language.references.whatdo.php",
      "https://www.php.net/manual/en/language.references.unset.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0026",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Types, casting & comparisons",
    "subtopic": "strpos-zero-position-repair",
    "objective": {
      "id": "strpos-zero-position-repair",
      "text": "Repair a presence check that rejects a match at byte offset zero."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate the false sentinel from a valid integer position."
    },
    "prerequisites": [
      "strpos",
      "Strict comparison"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction containsCat(string $text): bool\n{\n    $position = strpos($text, 'cat');\n\n    return (bool) $position;\n}\n\necho json_encode(array_map('containsCat', ['catnap', 'a cat', 'dog']));\n"
        }
      ]
    },
    "stem": "containsCat incorrectly rejects a match at the start. Which replacement for its return statement reports matches anywhere and rejects a missing substring?",
    "options": [
      {
        "id": "strict",
        "text": "return $position !== false;",
        "rationale": "This accepts integer zero and other positions while rejecting the failure sentinel.",
        "misconception": null
      },
      {
        "id": "positive",
        "text": "return $position > 0;",
        "rationale": "A valid match at offset zero still fails this check.",
        "misconception": "Assuming successful positions must be strictly positive."
      },
      {
        "id": "nonnegative",
        "text": "return $position >= 0;",
        "rationale": "A false result compares as zero here, so a missing substring is accepted.",
        "misconception": "Applying a numeric range check to the false sentinel."
      },
      {
        "id": "loose",
        "text": "return $position != false;",
        "rationale": "Loose comparison still equates integer zero with false.",
        "misconception": "Assuming inequality automatically distinguishes the return types."
      }
    ],
    "correctOptionId": "strict",
    "explanation": {
      "summary": "strpos returns an integer position or false. A strict comparison with false is needed to retain a position of zero.",
      "trace": "The three return values are 0, 2 and false. Only the strict-sentinel predicate produces true, true and false."
    },
    "validation": {
      "kind": "patch",
      "marker": "return (bool) $position;",
      "stdout": "[true,true,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/function.strpos.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0027",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "array-parameter-writeback",
    "objective": {
      "id": "array-parameter-writeback",
      "text": "Repair an array-mutating function whose caller observes no change."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose the parameter binding needed for the stated in-place API."
    },
    "prerequisites": [
      "Array value semantics",
      "Reference parameters"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction appendItem(array $items): void\n{\n    $items[] = 'next';\n}\n\n$items = ['seed'];\nappendItem($items);\n\necho json_encode($items);\n"
        }
      ]
    },
    "stem": "appendItem must modify the caller’s array in place. Replace only the parameter declaration array $items; keep the body and call unchanged. Which declaration repairs the lost update?",
    "options": [
      {
        "id": "optional",
        "text": "array $items = []",
        "rationale": "A default affects omitted arguments, not whether a supplied array is copied.",
        "misconception": "Treating a default parameter as shared caller storage."
      },
      {
        "id": "reference",
        "text": "array &$items",
        "rationale": "The reference parameter binds writes to the caller’s array.",
        "misconception": null
      },
      {
        "id": "variadic",
        "text": "array ...$items",
        "rationale": "The variadic array collects arguments into a local array and does not write back.",
        "misconception": "Confusing variadic collection with reference passing."
      },
      {
        "id": "nullable",
        "text": "?array $items",
        "rationale": "Allowing null does not change the parameter’s value semantics.",
        "misconception": "Expecting a broader type declaration to change mutation propagation."
      }
    ],
    "correctOptionId": "reference",
    "explanation": {
      "summary": "The existing parameter receives an array value. An ampersand on the parameter makes the documented in-place mutation reach the caller.",
      "trace": "With array &$items, appending next changes the caller’s array to [\"seed\",\"next\"]. The other declarations leave it as [\"seed\"]."
    },
    "validation": {
      "kind": "patch",
      "marker": "array $items",
      "stdout": "[\"seed\",\"next\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/functions.arguments.php#functions.arguments.by-reference"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0028",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Arrays & destructuring",
    "subtopic": "filter-only-null-values",
    "objective": {
      "id": "filter-only-null-values",
      "text": "Repair a default filter that discards valid falsy values."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Use one explicit predicate to distinguish null from other values."
    },
    "prerequisites": [
      "array_filter",
      "Strict comparison",
      "Arrow functions"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$values = [null, 0, false, '', 5];\n$result = array_filter($values);\n\necho json_encode($result);\n"
        }
      ]
    },
    "stem": "The current filter loses valid values. Replace the array_filter call so it removes only null and preserves all remaining keys, including entries whose values are 0, false or an empty string.",
    "options": [
      {
        "id": "strict-null",
        "text": "array_filter($values, fn ($value) => $value !== null)",
        "rationale": "The identity check removes only null and array_filter preserves the surviving keys.",
        "misconception": null
      },
      {
        "id": "loose-null",
        "text": "array_filter($values, fn ($value) => $value != null)",
        "rationale": "Loose comparison also treats the required falsy values as equal to null.",
        "misconception": "Using loose comparison when distinct falsy values must survive."
      },
      {
        "id": "boolean",
        "text": "array_filter($values, fn ($value) => (bool) $value)",
        "rationale": "Explicitly converting to bool repeats the original filter’s unwanted behavior.",
        "misconception": "Assuming an explicit callback automatically fixes default truthiness filtering."
      },
      {
        "id": "strict-false",
        "text": "array_filter($values, fn ($value) => $value !== false)",
        "rationale": "This removes the false value and keeps null, reversing the requested sentinel.",
        "misconception": "Confusing false and null as the rejected value."
      }
    ],
    "correctOptionId": "strict-null",
    "explanation": {
      "summary": "array_filter without a callback removes all falsy values. A strict null predicate expresses the narrower requirement.",
      "trace": "Only key 0 is removed. Keys 1, 2, 3 and 4 keep 0, false, the empty string and 5 respectively."
    },
    "validation": {
      "kind": "patch",
      "marker": "array_filter($values)",
      "stdout": "{\"1\":0,\"2\":false,\"3\":\"\",\"4\":5}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-filter.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0029",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "formatting-return-versus-output",
    "objective": {
      "id": "formatting-return-versus-output",
      "text": "Repair a formatting helper that prints prematurely and returns a character count."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish the return and output contracts of related formatting functions."
    },
    "prerequisites": [
      "Function return values",
      "Formatted strings"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction greeting(string $name): string\n{\n    return printf('Hi %s', $name);\n}\n\necho json_encode(greeting('Ada'));\n"
        }
      ]
    },
    "stem": "greeting must return the formatted string without printing during the call. Replace only printf in the helper with one function name. Which change repairs both the output leak and the returned value?",
    "options": [
      {
        "id": "vector",
        "text": "vprintf",
        "rationale": "vprintf expects an array of values and still prints its result.",
        "misconception": "Confusing the vector-argument formatter with a string-returning formatter."
      },
      {
        "id": "stream",
        "text": "fprintf",
        "rationale": "fprintf expects a stream resource as its first argument.",
        "misconception": "Treating a destination-oriented formatter as a return-value variant."
      },
      {
        "id": "string",
        "text": "sprintf",
        "rationale": "sprintf returns the formatted string without emitting it.",
        "misconception": null
      },
      {
        "id": "vector-string",
        "text": "vsprintf",
        "rationale": "vsprintf returns a string but requires an argument array; name is a string here.",
        "misconception": "Choosing the string-returning family while overlooking its argument shape."
      }
    ],
    "correctOptionId": "string",
    "explanation": {
      "summary": "printf emits text and returns a count. sprintf accepts the same formatting arguments but returns the produced string.",
      "trace": "The repaired helper returns Hi Ada; only the outer json_encode/echo prints it. The vector and stream variants do not match this call’s arguments."
    },
    "validation": {
      "kind": "patch",
      "marker": "printf",
      "stdout": "\"Hi Ada\"",
      "errors": {
        "vector": "TypeError",
        "stream": "TypeError",
        "vector-string": "TypeError"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/function.printf.php",
      "https://www.php.net/manual/en/function.sprintf.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0030",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Arrays & destructuring",
    "subtopic": "in-place-sort-return-assignment",
    "objective": {
      "id": "in-place-sort-return-assignment",
      "text": "Repair replacement of an array by a sorting function’s success flag."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Separate an in-place operation from its return value."
    },
    "prerequisites": [
      "sort",
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
          "source": "<?php\n\n$scores = [3, 1, 2];\n$scores = sort($scores);\n\necho json_encode($scores);\n"
        }
      ]
    },
    "stem": "The sort currently replaces scores with a boolean. Which replacement for the assignment produces the required ascending numeric list?",
    "options": [
      {
        "id": "reverse-copy",
        "text": "$scores = array_reverse($scores);",
        "rationale": "Reversing this unsorted input produces [2,1,3], not ascending order.",
        "misconception": "Treating reversal as sorting."
      },
      {
        "id": "associative-sort",
        "text": "$scores = asort($scores);",
        "rationale": "asort also sorts in place and returns a boolean, so the assignment still loses the array.",
        "misconception": "Assuming the associative sorting variant returns a sorted array."
      },
      {
        "id": "in-place",
        "text": "sort($scores);",
        "rationale": "The sort mutates scores; leaving its boolean return unassigned preserves the sorted array.",
        "misconception": null
      },
      {
        "id": "descending-return",
        "text": "$scores = rsort($scores);",
        "rationale": "rsort returns a boolean too and requests the wrong ordering direction.",
        "misconception": "Expecting a different sort variant to return the modified array."
      }
    ],
    "correctOptionId": "in-place",
    "explanation": {
      "summary": "sort modifies its array argument. Its success flag is not a replacement array and must not overwrite the variable.",
      "trace": "Calling sort without assigning its return leaves scores equal to [1,2,3]."
    },
    "validation": {
      "kind": "patch",
      "marker": "$scores = sort($scores);",
      "stdout": "[1,2,3]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0031",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Operators & expressions",
    "subtopic": "assignment-comparison-parentheses",
    "objective": {
      "id": "assignment-comparison-parentheses",
      "text": "Repair a loop that assigns a comparison result instead of the fetched value."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace assignment precedence while preserving a valid zero-valued item."
    },
    "prerequisites": [
      "Operator precedence",
      "Assignment expressions",
      "while"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$queue = [1, 0, 2];\n$seen = [];\n\nwhile ($item = array_shift($queue) !== null) {\n    $seen[] = $item;\n}\n\necho json_encode($seen);\n"
        }
      ]
    },
    "stem": "The loop currently collects booleans. Replace the complete parenthesized while condition so it collects every integer, including zero, and stops only when array_shift returns null.",
    "options": [
      {
        "id": "group-comparison",
        "text": "($item = (array_shift($queue) !== null))",
        "rationale": "This still assigns the comparison’s boolean result.",
        "misconception": "Adding parentheses around the comparison rather than the assignment."
      },
      {
        "id": "loose-stop",
        "text": "(($item = array_shift($queue)) != null)",
        "rationale": "Zero compares equal to null loosely, so the loop stops too soon.",
        "misconception": "Fixing assignment precedence while introducing a loose sentinel comparison."
      },
      {
        "id": "truthy-stop",
        "text": "($item = array_shift($queue))",
        "rationale": "The integer zero becomes false as a loop condition and terminates iteration.",
        "misconception": "Treating all valid queue values as truthy."
      },
      {
        "id": "group-assignment",
        "text": "(($item = array_shift($queue)) !== null)",
        "rationale": "The fetched value is assigned first and then compared strictly with the sentinel.",
        "misconception": null
      }
    ],
    "correctOptionId": "group-assignment",
    "explanation": {
      "summary": "The comparison binds more tightly than assignment in the original condition. Group the assignment, then compare its result with null using identity.",
      "trace": "The repaired loop assigns and retains 1, 0 and 2; the subsequent empty shift returns null and stops it."
    },
    "validation": {
      "kind": "patch",
      "marker": "($item = array_shift($queue) !== null)",
      "stdout": "[1,0,2]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-05"
    },
    "references": [
      "https://www.php.net/manual/en/language.operators.precedence.php",
      "https://www.php.net/manual/en/function.array-shift.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0032",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Closures, callbacks & callables",
    "subtopic": "three-way-numeric-comparator",
    "objective": {
      "id": "three-way-numeric-comparator",
      "text": "Repair a deprecated boolean comparator without changing numeric sort order."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish numeric three-way ordering from boolean, lexical and reversed comparisons."
    },
    "prerequisites": [
      "usort",
      "Comparator contracts",
      "Spaceship operator"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$values = [10, 2, 3];\n\nusort($values, function (int $left, int $right) {\n    return $left > $right;\n});\n\necho json_encode($values);\n"
        }
      ]
    },
    "stem": "The comparator produces a deprecation diagnostic. Replace its return statement so the integers sort numerically ascending with no diagnostics.",
    "options": [
      {
        "id": "numeric",
        "text": "return $left <=> $right;",
        "rationale": "The spaceship operator returns negative, zero or positive according to numeric order.",
        "misconception": null
      },
      {
        "id": "lexical",
        "text": "return strcmp((string) $left, (string) $right);",
        "rationale": "String comparison places \"10\" before \"2\", violating numeric order.",
        "misconception": "Treating lexical numeric-string order as numeric order."
      },
      {
        "id": "reversed",
        "text": "return $right <=> $left;",
        "rationale": "Reversing operands requests descending order.",
        "misconception": "Reversing the meaning of a negative comparator result."
      },
      {
        "id": "boolean",
        "text": "return $left >= $right;",
        "rationale": "This still returns bool and still violates the comparator contract.",
        "misconception": "Assuming adding equality makes a boolean comparator a three-way comparator."
      }
    ],
    "correctOptionId": "numeric",
    "explanation": {
      "summary": "A comparator must express less than, equal to and greater than using a signed integer result. Numeric spaceship comparison supplies that contract.",
      "trace": "The accepted comparator orders 2, 3, 10. strcmp orders the numeric strings lexically, and a boolean result remains deprecated."
    },
    "validation": {
      "kind": "patch",
      "marker": "return $left > $right;",
      "stdout": "[2,3,10]",
      "errors": {
        "boolean": {
          "message": "Returning bool from comparison function is deprecated",
          "exitCode": 0
        }
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/function.usort.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0033",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Classes & object lifecycle",
    "subtopic": "json-serialization-private-field-leak",
    "objective": {
      "id": "json-serialization-private-field-leak",
      "text": "Repair explicit serialization that leaks a private credential field."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish language visibility from a serializer’s deliberate access to private state."
    },
    "prerequisites": [
      "Private properties",
      "JsonSerializable",
      "Array field selection"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfinal class User implements JsonSerializable\n{\n    public function __construct(private int $id, private string $password)\n    {\n    }\n\n    public function jsonSerialize(): array\n    {\n        return get_object_vars($this);\n    }\n}\n\necho json_encode(new User(7, 'demo-only'));\n"
        }
      ]
    },
    "stem": "The API response leaks password even though that property is private. Replace jsonSerialize’s return statement so the output contains exactly id and no password key.",
    "options": [
      {
        "id": "cast",
        "text": "return (array) $this;",
        "rationale": "Casting includes private properties with mangled keys, rather than omitting the secret.",
        "misconception": "Assuming an array cast applies public-property visibility."
      },
      {
        "id": "redact-null",
        "text": "return ['id' => $this->id, 'password' => null];",
        "rationale": "The contract excludes the password key altogether, not merely its current value.",
        "misconception": "Equating null redaction with field omission."
      },
      {
        "id": "explicit-fields",
        "text": "return ['id' => $this->id];",
        "rationale": "The serializer deliberately selects only the public response field.",
        "misconception": null
      },
      {
        "id": "mangled",
        "text": "return get_mangled_object_vars($this);",
        "rationale": "This explicitly returns non-public properties as well.",
        "misconception": "Mistaking mangled property names for exclusion of private state."
      }
    ],
    "correctOptionId": "explicit-fields",
    "explanation": {
      "summary": "Visibility does not stop a method of the class from reading private properties and returning them. A response serializer should select the permitted fields explicitly.",
      "trace": "get_object_vars called inside User sees both properties. The replacement returns only id, so the encoded object is {\"id\":7}."
    },
    "validation": {
      "kind": "patch",
      "marker": "return get_object_vars($this);",
      "stdout": "{\"id\":7}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/jsonserializable.jsonserialize.php",
      "https://www.php.net/manual/en/function.get-object-vars.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0034",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Errors & exceptions",
    "subtopic": "exception-translation-cause-chain",
    "objective": {
      "id": "exception-translation-cause-chain",
      "text": "Repair exception translation that loses its original cause."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Preserve both the public exception type and its previous throwable through nested catches."
    },
    "prerequisites": [
      "Exception constructors",
      "Previous exceptions",
      "Rethrowing"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction translate(): void\n{\n    try {\n        throw new RuntimeException('low-level failure');\n    } catch (RuntimeException $error) {\n        throw new DomainException('operation failed');\n    }\n}\n\ntry {\n    translate();\n} catch (Throwable $error) {\n    echo json_encode([\n        get_class($error),\n        $error->getPrevious()?->getMessage(),\n    ]);\n}\n"
        }
      ]
    },
    "stem": "The public boundary must throw DomainException while retaining the original RuntimeException as previous. Replace the throw statement in translate; which choice repairs the missing cause?",
    "options": [
      {
        "id": "rethrow",
        "text": "throw $error;",
        "rationale": "Rethrowing preserves the original throwable but fails to expose the required DomainException type.",
        "misconception": "Treating preservation of the original object as equivalent to exception translation."
      },
      {
        "id": "message-only",
        "text": "throw new DomainException($error->getMessage());",
        "rationale": "Copying the message does not populate the previous throwable.",
        "misconception": "Assuming a copied message establishes a causal link."
      },
      {
        "id": "second-argument",
        "text": "throw new DomainException('operation failed', $error);",
        "rationale": "The second constructor argument is the integer code, not previous.",
        "misconception": "Using the code argument position for the cause."
      },
      {
        "id": "previous",
        "text": "throw new DomainException('operation failed', 0, $error);",
        "rationale": "The third argument records the original throwable while the outer type remains DomainException.",
        "misconception": null
      }
    ],
    "correctOptionId": "previous",
    "explanation": {
      "summary": "Exception’s constructor takes the message, integer code and previous throwable in that order. Translation and cause preservation are separate requirements.",
      "trace": "The accepted replacement creates a DomainException whose previous message is low-level failure. The outer catch can inspect both."
    },
    "validation": {
      "kind": "patch",
      "marker": "throw new DomainException('operation failed');",
      "stdout": "[\"DomainException\",\"low-level failure\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/exception.construct.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0035",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "PDO & database access",
    "subtopic": "deferred-pdo-bound-reference",
    "objective": {
      "id": "deferred-pdo-bound-reference",
      "text": "Repair delayed executions that all observe a loop variable’s final value."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track reference binding across prepared statements and a later execution phase."
    },
    "prerequisites": [
      "PDO binding (unmapped curriculum)",
      "References",
      "Loop variables"
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
          "source": "<?php\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec('CREATE TABLE events (id INTEGER)');\n$pending = [];\n\nforeach ([1, 2] as $id) {\n    $statement = $pdo->prepare('INSERT INTO events (id) VALUES (:id)');\n    $statement->bindParam(':id', $id, PDO::PARAM_INT);\n    $pending[] = $statement;\n}\n\nforeach ($pending as $statement) {\n    $statement->execute();\n}\n\necho json_encode($pdo->query('SELECT id FROM events ORDER BY rowid')->fetchAll(PDO::FETCH_COLUMN));\n"
        }
      ]
    },
    "stem": "Both deferred inserts currently use the final id. Replace the binding statement so each prepared statement retains the id from its own loop iteration. Execution must remain deferred until the second loop.",
    "options": [
      {
        "id": "value",
        "text": "$statement->bindValue(':id', $id, PDO::PARAM_INT);",
        "rationale": "bindValue captures the current integer rather than following the loop variable.",
        "misconception": null
      },
      {
        "id": "string-reference",
        "text": "$statement->bindParam(':id', $id, PDO::PARAM_STR);",
        "rationale": "Changing the parameter type does not remove the reference binding.",
        "misconception": "Assuming string binding snapshots a referenced value."
      },
      {
        "id": "zero-position",
        "text": "$statement->bindValue(0, $id, PDO::PARAM_INT);",
        "rationale": "PDO positional parameter numbers begin at 1, not 0.",
        "misconception": "Using zero-based PHP array indexing for PDO parameter positions."
      },
      {
        "id": "null-type",
        "text": "$statement->bindValue(':id', $id, PDO::PARAM_NULL);",
        "rationale": "PARAM_NULL binds SQL NULL rather than the supplied integer.",
        "misconception": "Treating PARAM_NULL as a request to infer a parameter type."
      }
    ],
    "correctOptionId": "value",
    "explanation": {
      "summary": "bindParam keeps a reference to a variable until execution. All statements therefore observe the reused id variable after the first loop. bindValue takes a snapshot instead.",
      "trace": "The accepted bindings retain 1 and 2 separately. Later execution inserts those two integers in order."
    },
    "validation": {
      "kind": "patch",
      "marker": "$statement->bindParam(':id', $id, PDO::PARAM_INT);",
      "stdout": "[1,2]",
      "errors": {
        "zero-position": "must be greater than or equal to 1"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-15"
    },
    "references": [
      "https://www.php.net/manual/en/pdostatement.bindparam.php",
      "https://www.php.net/manual/en/pdostatement.bindvalue.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0036",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "import-function-symbol-kind",
    "objective": {
      "id": "import-function-symbol-kind",
      "text": "Repair a namespace import that targets the wrong symbol category."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Follow a function call across two namespaces and distinguish class, function and constant imports."
    },
    "prerequisites": [
      "Namespaces",
      "Function imports",
      "require"
    ],
    "runtime": {
      "php": [
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
          "path": "formatter.php",
          "kind": "complete-file",
          "source": "<?php\n\nnamespace Formatter;\n\nfunction slug(string $text): string\n{\n    return strtolower(str_replace(' ', '-', $text));\n}\n"
        },
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nnamespace App;\n\nrequire __DIR__ . '/formatter.php';\n\nuse Formatter\\slug;\n\ntry {\n    echo slug('A B');\n} catch (\\Error $error) {\n    echo 'Error';\n}\n"
        }
      ]
    },
    "stem": "Both files are present as shown. Calling slug currently fails. Which replacement for the use declaration makes the call print a-b without changing either function?",
    "options": [
      {
        "id": "class-alias",
        "text": "use Formatter\\slug as slug;",
        "rationale": "This still imports a class-like name rather than a function.",
        "misconception": "Assuming an alias changes the imported symbol category."
      },
      {
        "id": "function",
        "text": "use function Formatter\\slug;",
        "rationale": "The function import binds the unqualified call slug to Formatter\\slug.",
        "misconception": null
      },
      {
        "id": "constant",
        "text": "use const Formatter\\slug;",
        "rationale": "A constant import cannot resolve a function call.",
        "misconception": "Treating all namespace symbols as one import category."
      },
      {
        "id": "different-alias",
        "text": "use function Formatter\\slug as makeSlug;",
        "rationale": "This imports the function under makeSlug, while the unchanged call uses slug.",
        "misconception": "Ignoring the local name introduced by an alias."
      }
    ],
    "correctOptionId": "function",
    "explanation": {
      "summary": "Plain use imports class-like names. Functions require use function, and the local imported name must match the call.",
      "trace": "The required file defines Formatter\\slug. The accepted declaration resolves App’s unqualified slug call to that function."
    },
    "validation": {
      "kind": "patch",
      "marker": "use Formatter\\slug;",
      "stdout": "a-b",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0037",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Files & structured data",
    "subtopic": "invalid-utf8-json-substitution",
    "objective": {
      "id": "invalid-utf8-json-substitution",
      "text": "Repair JSON encoding with an explicit invalid UTF-8 replacement policy."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish substitution, omission, partial output and encoding presentation flags."
    },
    "prerequisites": [
      "JSON encoding flags",
      "UTF-8",
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
          "source": "<?php\n\n$payload = ['text' => \"A\\xFFB\"];\n\ntry {\n    echo json_encode($payload, JSON_THROW_ON_ERROR);\n} catch (JsonException $error) {\n    echo 'error';\n}\n"
        }
      ]
    },
    "stem": "The payload contains the byte FF, which is invalid by itself in UTF-8. Replace JSON_THROW_ON_ERROR in the encode call so valid bytes are retained and the invalid byte becomes U+FFFD. Other encoding failures must still throw. Which flag expression meets that policy?",
    "options": [
      {
        "id": "ignore",
        "text": "JSON_THROW_ON_ERROR | JSON_INVALID_UTF8_IGNORE",
        "rationale": "IGNORE drops the invalid byte, producing AB rather than a replacement character.",
        "misconception": "Equating omission with substitution."
      },
      {
        "id": "partial",
        "text": "JSON_THROW_ON_ERROR | JSON_PARTIAL_OUTPUT_ON_ERROR",
        "rationale": "Partial output substitutes null for the invalid string and takes precedence over throwing.",
        "misconception": "Assuming partial output repairs individual bytes."
      },
      {
        "id": "unescaped",
        "text": "JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE",
        "rationale": "UNESCAPED_UNICODE changes representation of valid Unicode; it does not repair invalid UTF-8.",
        "misconception": "Treating escaping policy as input validation."
      },
      {
        "id": "substitute",
        "text": "JSON_THROW_ON_ERROR | JSON_INVALID_UTF8_SUBSTITUTE",
        "rationale": "SUBSTITUTE replaces invalid UTF-8 with U+FFFD while THROW remains for other failures.",
        "misconception": null
      }
    ],
    "correctOptionId": "substitute",
    "explanation": {
      "summary": "JSON_INVALID_UTF8_SUBSTITUTE is the encoding policy that retains valid text and substitutes the Unicode replacement character for malformed sequences.",
      "trace": "A and B remain. FF becomes U+FFFD, represented by the default JSON escape \\ufffd."
    },
    "validation": {
      "kind": "patch",
      "marker": "JSON_THROW_ON_ERROR",
      "stdout": "{\"text\":\"A\\ufffdB\"}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0038",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "late-static-table-selection",
    "objective": {
      "id": "late-static-table-selection",
      "text": "Repair an inherited factory’s lookup of an overridden class constant."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Compare lexical scope, parent scope and late static binding across two calls."
    },
    "prerequisites": [
      "Inheritance",
      "Class constants",
      "Late static binding"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass RootModel\n{\n    public const TABLE = 'root';\n}\n\nclass Model extends RootModel\n{\n    public const TABLE = 'base';\n\n    public static function table(): string\n    {\n        return self::TABLE;\n    }\n}\n\nclass Users extends Model\n{\n    public const TABLE = 'users';\n}\n\necho json_encode([Model::table(), Users::table()]);\n"
        }
      ]
    },
    "stem": "table must return each called class’s TABLE constant. Replace only self::TABLE so the two calls print [\"base\",\"users\"]. Which expression repairs the inherited method?",
    "options": [
      {
        "id": "parent",
        "text": "parent::TABLE",
        "rationale": "parent refers to RootModel from this method’s declaring scope, so both results are root.",
        "misconception": "Treating parent as the parent of the dynamically called class."
      },
      {
        "id": "class-name",
        "text": "get_called_class()",
        "rationale": "This returns class names Model and Users, not their TABLE values.",
        "misconception": "Confusing the called class name with a class constant lookup."
      },
      {
        "id": "late",
        "text": "static::TABLE",
        "rationale": "static selects the constant using the called class, retaining late static binding.",
        "misconception": null
      },
      {
        "id": "explicit",
        "text": "Model::TABLE",
        "rationale": "Naming Model explicitly fixes both lookups to base.",
        "misconception": "Assuming inherited calls rewrite an explicit class name."
      }
    ],
    "correctOptionId": "late",
    "explanation": {
      "summary": "self binds to the method’s declaring class. static retains the class through which the method was called and sees an override in Users.",
      "trace": "Model::table resolves Model::TABLE. Users::table resolves Users::TABLE with the accepted expression."
    },
    "validation": {
      "kind": "patch",
      "marker": "self::TABLE",
      "stdout": "[\"base\",\"users\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0039",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Functions & arguments",
    "subtopic": "unpack-positional-after-named",
    "objective": {
      "id": "unpack-positional-after-named",
      "text": "Repair mixed-key argument unpacking without reversing parameter values."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track array insertion order, named binding and positional argument restrictions."
    },
    "prerequisites": [
      "Named arguments",
      "Argument unpacking",
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
          "source": "<?php\n\nfunction joinParts(string $a, string $b): string\n{\n    return $a . $b;\n}\n\n$arguments = ['b' => 'B', 0 => 'A'];\n\ntry {\n    echo joinParts(...$arguments);\n} catch (Error $error) {\n    echo 'Error';\n}\n"
        }
      ]
    },
    "stem": "The unpacked array puts a positional argument after a named one, so the call fails. Replace the complete joinParts(...$arguments) expression so a receives A and b receives B. Which repair prints AB?",
    "options": [
      {
        "id": "values",
        "text": "joinParts(...array_values($arguments))",
        "rationale": "array_values preserves insertion order, so the arguments become B then A.",
        "misconception": "Assuming dropping keys sorts positional arguments."
      },
      {
        "id": "ordered",
        "text": "joinParts(...[$arguments[0], 'b' => $arguments['b']])",
        "rationale": "The positional A precedes named b, binding both parameters correctly.",
        "misconception": null
      },
      {
        "id": "named-first",
        "text": "joinParts(...['b' => $arguments['b'], $arguments[0]])",
        "rationale": "This still places a positional argument after a named argument.",
        "misconception": "Assuming rebuilding the array changes the ordering rule."
      },
      {
        "id": "duplicate",
        "text": "joinParts(...array_values($arguments), b: $arguments['b'])",
        "rationale": "The unpacked values already fill b, so the named argument tries to overwrite it.",
        "misconception": "Assuming named arguments override parameters filled positionally."
      }
    ],
    "correctOptionId": "ordered",
    "explanation": {
      "summary": "Integer-keyed unpacked values bind positionally, string-keyed values by name. Positional values must precede named values, and a parameter cannot be supplied twice.",
      "trace": "The accepted array is [0 => A, b => B]. The first value fills a and the named value fills b."
    },
    "validation": {
      "kind": "patch",
      "marker": "joinParts(...$arguments)",
      "stdout": "AB",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0040",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Classes & object lifecycle",
    "subtopic": "uninitialized-typed-property-guard",
    "objective": {
      "id": "uninitialized-typed-property-guard",
      "text": "Repair a property reader while preserving initialized zero."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate declared existence, initialization and truthiness of a typed property."
    },
    "prerequisites": [
      "Typed properties",
      "isset",
      "empty"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Item\n{\n    public int $id;\n}\n\nfunction readId(Item $item): ?int\n{\n    if (property_exists($item, 'id')) {\n        return $item->id;\n    }\n\n    return null;\n}\n\n$empty = new Item();\n$zero = new Item();\n$zero->id = 0;\n\ntry {\n    echo json_encode([readId($empty), readId($zero)]);\n} catch (Error $error) {\n    echo 'Error';\n}\n"
        }
      ]
    },
    "stem": "readId must return null for an uninitialized id and preserve zero when it is initialized. Replace the if condition’s property_exists call. Which predicate prevents the Error and satisfies both cases?",
    "options": [
      {
        "id": "nonempty",
        "text": "!empty($item->id)",
        "rationale": "empty treats initialized zero as empty, losing a valid id.",
        "misconception": "Using truthiness to test initialization."
      },
      {
        "id": "class-declaration",
        "text": "property_exists(get_class($item), 'id')",
        "rationale": "This still checks declaration, which is true even when the property is uninitialized.",
        "misconception": "Expecting a class-level existence check to inspect instance initialization."
      },
      {
        "id": "object-set",
        "text": "isset($item)",
        "rationale": "The parameter itself is a present object in both cases; its property may still be uninitialized.",
        "misconception": "Guarding the container instead of its typed property."
      },
      {
        "id": "property-set",
        "text": "isset($item->id)",
        "rationale": "isset safely returns false for the uninitialized property and true for initialized zero.",
        "misconception": null
      }
    ],
    "correctOptionId": "property-set",
    "explanation": {
      "summary": "A declared typed property can exist without having a value. isset can guard that read without rejecting an initialized integer zero.",
      "trace": "The first object fails isset and returns null. The second passes it and returns 0."
    },
    "validation": {
      "kind": "patch",
      "marker": "property_exists($item, 'id')",
      "stdout": "[null,0]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.properties.php",
      "https://www.php.net/manual/en/function.isset.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0041",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Iterators, generators & fibers",
    "subtopic": "delegated-generator-return-lifecycle",
    "objective": {
      "id": "delegated-generator-return-lifecycle",
      "text": "Repair premature retrieval of a delegated generator’s return value."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace a started generator through exhaustion before reading its return; no concurrent lifetime or recursive generator reasoning is required."
    },
    "prerequisites": [
      "Generators",
      "yield from",
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
          "source": "<?php\n\nfunction inner(): Generator\n{\n    yield 1;\n    yield 2;\n\n    return 9;\n}\n\nfunction outer(): Generator\n{\n    $result = yield from inner();\n\n    return $result + 1;\n}\n\n$generator = outer();\n$generator->current();\n$generator->next();\n\necho $generator->getReturn();\n"
        }
      ]
    },
    "stem": "The driver wants the outer generator’s final return value, 10, after discarding its yielded values. Replace $generator->next(); so the subsequent getReturn is valid. Which driver change works for the shown generator?",
    "options": [
      {
        "id": "single-if",
        "text": "if ($generator->valid()) {\n    $generator->next();\n}",
        "rationale": "One advance reaches the second yield but does not finish the generator.",
        "misconception": "Assuming one next call exhausts a delegated generator."
      },
      {
        "id": "drain",
        "text": "while ($generator->valid()) {\n    $generator->next();\n}",
        "rationale": "Advancing while valid reaches completion, allowing outer to return 10.",
        "misconception": null
      },
      {
        "id": "inverted",
        "text": "while (!$generator->valid()) {\n    $generator->next();\n}",
        "rationale": "The generator is already valid at its first yield, so the loop never advances.",
        "misconception": "Reversing the active-state condition."
      },
      {
        "id": "container",
        "text": "foreach ([$generator] as $iterator) {\n    $iterator->next();\n}",
        "rationale": "This iterates a one-element array, not the yielded values, so it advances only once.",
        "misconception": "Confusing iteration over a generator object’s container with iteration over the generator."
      }
    ],
    "correctOptionId": "drain",
    "explanation": {
      "summary": "getReturn is available only after completion. yield from forwards both inner yields and evaluates to inner’s final return value; outer then adds one.",
      "trace": "current starts the first yield. The accepted loop advances to the second yield, then through inner’s return 9 and outer’s return 10."
    },
    "validation": {
      "kind": "patch",
      "marker": "$generator->next();",
      "stdout": "10",
      "errors": {
        "single-if": "Cannot get return value",
        "inverted": "Cannot get return value",
        "container": "Cannot get return value"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/generator.getreturn.php",
      "https://www.php.net/manual/en/language.generators.syntax.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0042",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Iterators, generators & fibers",
    "subtopic": "fiber-resumption-driver-state",
    "objective": {
      "id": "fiber-resumption-driver-state",
      "text": "Repair a Fiber driver that must feed each suspension’s requested value back into the computation."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Coordinate suspension results, resume arguments and termination across two rounds."
    },
    "prerequisites": [
      "Fibers (advanced)",
      "Cooperative suspension",
      "Loop state"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$fiber = new Fiber(function (): int {\n    $first = Fiber::suspend(3);\n    $second = Fiber::suspend(4);\n\n    return $first + $second;\n});\n\n$request = $fiber->start();\n\nwhile (!$fiber->isTerminated()) {\n    $fiber->resume($request * 2);\n}\n\necho $fiber->getReturn();\n"
        }
      ]
    },
    "stem": "Each suspend requests an integer; the driver must resume with twice that integer. Replace the loop so the final return is 14. start has already received the first request. Which driver correctly handles both suspensions?",
    "options": [
      {
        "id": "update",
        "text": "while (!$fiber->isTerminated()) {\n    $request = $fiber->resume($request * 2);\n}",
        "rationale": "Each resume result supplies the next request, and termination stops before another resume.",
        "misconception": null
      },
      {
        "id": "constant",
        "text": "while (!$fiber->isTerminated()) {\n    $request = $fiber->resume(6);\n}",
        "rationale": "Both resumes send 6, so the return is 12 rather than 14.",
        "misconception": "Reusing the first response instead of calculating from each request."
      },
      {
        "id": "stale",
        "text": "while (!$fiber->isTerminated()) {\n    $fiber->resume($request * 2);\n}",
        "rationale": "request remains 3, so both resumes again send 6.",
        "misconception": "Assuming resume updates the caller’s request variable implicitly."
      },
      {
        "id": "single",
        "text": "if ($fiber->isSuspended()) {\n    $request = $fiber->resume($request * 2);\n}",
        "rationale": "One resume reaches the second suspension, leaving getReturn invalid.",
        "misconception": "Treating a Fiber as having at most one suspension."
      }
    ],
    "correctOptionId": "update",
    "explanation": {
      "summary": "start and resume return the next suspension value. The driver must store each new request and check for termination before resuming again.",
      "trace": "start returns 3; resume(6) returns 4; resume(8) completes the Fiber; getReturn yields 6 + 8."
    },
    "validation": {
      "kind": "patch",
      "marker": "while (!$fiber->isTerminated()) {\n    $fiber->resume($request * 2);\n}",
      "stdout": "14",
      "errors": {
        "single": "Cannot get fiber return value"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/fiber.resume.php",
      "https://www.php.net/manual/en/fiber.getreturn.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0043",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Enums, attributes & reflection",
    "subtopic": "attribute-subtype-instantiation-validation",
    "objective": {
      "id": "attribute-subtype-instantiation-validation",
      "text": "Repair an attribute scanner that must validate derived rule constructors without instantiating unrelated attributes."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine subtype filtering, lazy attribute construction and side-effect isolation."
    },
    "prerequisites": [
      "Attributes (advanced)",
      "ReflectionAttribute",
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
          "source": "<?php\n\n#[Attribute(Attribute::TARGET_CLASS)]\nclass Rule\n{\n    public function __construct(public int $limit)\n    {\n        if ($limit < 0) {\n            throw new InvalidArgumentException('negative');\n        }\n    }\n}\n\n#[Attribute(Attribute::TARGET_CLASS)]\nclass PositiveRule extends Rule\n{\n}\n\n#[Attribute(Attribute::TARGET_CLASS)]\nclass Audit\n{\n    public static int $created = 0;\n\n    public function __construct()\n    {\n        self::$created++;\n    }\n}\n\n#[PositiveRule(1), Audit]\nclass Good\n{\n}\n\n#[PositiveRule(-1), Audit]\nclass Bad\n{\n}\n\nfunction scan(string $class): string\n{\n    $reflection = new ReflectionClass($class);\n\n    try {\n        foreach ($reflection->getAttributes(Rule::class) as $attribute) {\n            $attribute->getArguments();\n        }\n\n        return 'ok';\n    } catch (InvalidArgumentException $error) {\n        return 'invalid';\n    }\n}\n\necho json_encode([scan(Good::class), scan(Bad::class), Audit::$created]);\n"
        }
      ]
    },
    "stem": "scan must instantiate every Rule attribute, including subclasses, and no unrelated attribute. A negative rule must throw InvalidArgumentException; Audit must remain unconstructed. Replace the foreach block. Which scanner yields [\"ok\",\"invalid\",0]?",
    "options": [
      {
        "id": "exact",
        "text": "foreach ($reflection->getAttributes(Rule::class) as $attribute) {\n    $attribute->newInstance();\n}",
        "rationale": "Exact-name filtering misses PositiveRule, so neither constructor validates its limit.",
        "misconception": "Assuming getAttributes includes subclasses without its subtype flag."
      },
      {
        "id": "arguments",
        "text": "foreach ($reflection->getAttributes(Rule::class, ReflectionAttribute::IS_INSTANCEOF) as $attribute) {\n    $attribute->getArguments();\n}",
        "rationale": "Reading argument values does not run the attribute constructor, so the negative limit is not rejected.",
        "misconception": "Treating metadata retrieval as object construction."
      },
      {
        "id": "all",
        "text": "foreach ($reflection->getAttributes() as $attribute) {\n    $attribute->newInstance();\n}",
        "rationale": "This validates the rules but also instantiates Audit on Good, incrementing created.",
        "misconception": "Assuming all class attributes share the scanner’s intended contract."
      },
      {
        "id": "filtered-instance",
        "text": "foreach ($reflection->getAttributes(Rule::class, ReflectionAttribute::IS_INSTANCEOF) as $attribute) {\n    $attribute->newInstance();\n}",
        "rationale": "The subtype filter selects PositiveRule and newInstance invokes the validation constructor.",
        "misconception": null
      }
    ],
    "correctOptionId": "filtered-instance",
    "explanation": {
      "summary": "getAttributes can select a class and its descendants with IS_INSTANCEOF. Reflection metadata is lazy; newInstance, not getArguments, invokes the constructor.",
      "trace": "Good constructs a valid PositiveRule. Bad throws on -1. Neither scan selects Audit, so its counter remains zero."
    },
    "validation": {
      "kind": "patch",
      "marker": "foreach ($reflection->getAttributes(Rule::class) as $attribute) {\n            $attribute->getArguments();\n        }",
      "stdout": "[\"ok\",\"invalid\",0]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-21"
    },
    "references": [
      "https://www.php.net/manual/en/reflectionclass.getattributes.php",
      "https://www.php.net/manual/en/reflectionattribute.newinstance.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0044",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Classes & object lifecycle",
    "subtopic": "virtual-hook-reference-writeback",
    "objective": {
      "id": "virtual-hook-reference-writeback",
      "text": "Repair a reference-based operation on a virtual hooked property without losing the updated value."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Distinguish reference access from get/set transformations and explicit write-back."
    },
    "prerequisites": [
      "PHP 8.4 property hooks (advanced)",
      "References",
      "Floating-point arithmetic"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Temperature\n{\n    private float $fahrenheit = 32.0;\n\n    public float $celsius {\n        get => ($this->fahrenheit - 32) / 1.8;\n        set => $this->fahrenheit = $value * 1.8 + 32;\n    }\n}\n\nfunction addOne(float &$value): void\n{\n    $value += 1;\n}\n\n$temperature = new Temperature();\naddOne($temperature->celsius);\n\necho round($temperature->celsius, 6);\n"
        }
      ]
    },
    "stem": "celsius is a virtual property computed from fahrenheit; it provides no reference-returning get hook. addOne must remain unchanged. Replace the failing addOne call so the object’s temperature increases by one Celsius degree.",
    "options": [
      {
        "id": "local-only",
        "text": "$value = $temperature->celsius;\naddOne($value);",
        "rationale": "The local value changes, but no set hook writes it back to the object.",
        "misconception": "Assuming a normal assignment retains a live property link."
      },
      {
        "id": "early-write",
        "text": "$value = $temperature->celsius;\n$temperature->celsius = $value;\naddOne($value);",
        "rationale": "The write occurs before the local increment, so the object retains zero.",
        "misconception": "Writing back the snapshot before applying the mutation."
      },
      {
        "id": "writeback",
        "text": "$value = $temperature->celsius;\naddOne($value);\n$temperature->celsius = $value;",
        "rationale": "The get hook supplies a value, the local variable supports reference mutation, and the set hook stores the result.",
        "misconception": null
      },
      {
        "id": "reference",
        "text": "$value =& $temperature->celsius;\naddOne($value);",
        "rationale": "A virtual property without a reference-returning getter cannot be aliased this way.",
        "misconception": "Assuming an intermediate reference bypasses property reference restrictions."
      }
    ],
    "correctOptionId": "writeback",
    "explanation": {
      "summary": "The property transforms stored Fahrenheit into Celsius and back. A by-reference function needs a variable it can mutate, so use a local value and then invoke the property setter with the result.",
      "trace": "The getter returns 0. addOne changes the local to 1. Writing 1 invokes the setter and stores 33.8 Fahrenheit, which the getter converts back to 1."
    },
    "validation": {
      "kind": "patch",
      "marker": "addOne($temperature->celsius);",
      "stdout": "1",
      "errors": {
        "reference": "Indirect modification of Temperature::$celsius is not allowed"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0045",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "debugging",
    "topic": "Inheritance, interfaces & traits",
    "subtopic": "intersection-parameter-covariant-return",
    "objective": {
      "id": "intersection-parameter-covariant-return",
      "text": "Repair interface compatibility using contravariant parameters and covariant return types."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Compare an intersection parameter with broader accepted input types and narrower output guarantees."
    },
    "prerequisites": [
      "Intersection types (advanced)",
      "Variance",
      "Traversable and Iterator"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\ninterface Copier\n{\n    public function copy(Iterator&Countable $source): Iterator;\n}\n\nclass Snapshot implements Copier\n{\n    public function copy(ArrayIterator $source): Iterator\n    {\n        return new ArrayIterator(iterator_to_array($source));\n    }\n}\n\n$copy = (new Snapshot())->copy(new ArrayIterator([1, 2]));\n\necho json_encode(iterator_to_array($copy));\n"
        }
      ]
    },
    "stem": "The implementation’s narrow parameter makes this declaration fail. Replace only the public copy signature, retaining its body. Which signature satisfies Copier and successfully copies the shown source?",
    "options": [
      {
        "id": "broad-input",
        "text": "public function copy(Traversable $source): ArrayIterator",
        "rationale": "Traversable accepts every Iterator&Countable, while ArrayIterator is a narrower Iterator return type.",
        "misconception": null
      },
      {
        "id": "extra-constraint",
        "text": "public function copy(Iterator&Countable&ArrayAccess $source): ArrayIterator",
        "rationale": "Adding ArrayAccess excludes some values allowed by the interface.",
        "misconception": "Treating an added input requirement as harmless precision."
      },
      {
        "id": "broad-output",
        "text": "public function copy(Traversable $source): Traversable",
        "rationale": "Traversable is a broader output promise than Iterator and could allow a non-Iterator result.",
        "misconception": "Applying input contravariance rules to return types."
      },
      {
        "id": "narrow-input",
        "text": "public function copy(ArrayIterator $source): ArrayIterator",
        "rationale": "ArrayIterator is only one possible Iterator&Countable implementation, so the parameter remains too narrow.",
        "misconception": "Assuming the specific example argument defines the interface’s entire input domain."
      }
    ],
    "correctOptionId": "broad-input",
    "explanation": {
      "summary": "An implementation may accept more inputs and promise more specific outputs. It may not require extra input capabilities or weaken the declared output guarantee.",
      "trace": "Traversable broadens the accepted domain. ArrayIterator implements Iterator, so the return type strengthens the promise and the body returns a compatible value."
    },
    "validation": {
      "kind": "patch",
      "marker": "public function copy(ArrayIterator $source): Iterator",
      "stdout": "[1,2]",
      "errors": {
        "extra-constraint": "must be compatible",
        "broad-output": "must be compatible",
        "narrow-input": "must be compatible"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0046",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Operators & expressions",
    "subtopic": "coalescing-versus-truthy-default",
    "objective": {
      "id": "coalescing-versus-truthy-default",
      "text": "Review whether replacing null coalescing with a truthiness default preserves valid configuration values."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Compare two defaulting operators for an explicit zero value."
    },
    "prerequisites": [
      "Null coalescing",
      "Ternary expressions"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$config = ['retries' => 0];\n\n$before = $config['retries'] ?? 5;\n$after = $config['retries'] ?: 5;\n\necho json_encode([$before, $after]);\n"
        }
      ]
    },
    "stem": "Zero is a valid retry limit. A reviewer proposes replacing the first assignment with the second. Which assessment is correct for this input?",
    "options": [
      {
        "id": "equivalent",
        "text": "Both preserve zero because the retries key exists.",
        "rationale": "The shorthand ternary tests truthiness, not key existence.",
        "misconception": "Confusing a truthiness check with an existence check."
      },
      {
        "id": "reverse",
        "text": "The first uses 5; the second preserves zero.",
        "rationale": "This reverses the two operators’ conditions.",
        "misconception": "Attributing truthiness fallback to null coalescing."
      },
      {
        "id": "changed",
        "text": "The first preserves zero; the second substitutes 5.",
        "rationale": "Zero is non-null but falsy, so the two operators produce different results.",
        "misconception": null
      },
      {
        "id": "both-default",
        "text": "Both substitute 5 because zero is an empty value.",
        "rationale": "Null coalescing does not reject zero.",
        "misconception": "Applying empty-style rules to both defaulting operators."
      }
    ],
    "correctOptionId": "changed",
    "explanation": {
      "summary": "Null coalescing falls back for absent or null values. The shorthand ternary falls back for any falsy value, including integer zero.",
      "trace": "before is 0; after is 5. The refactor violates the stated configuration contract."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[0,5]",
      "keyEvidence": "Observed distinct values match the stated zero-valid contract.",
      "counterexamples": {
        "equivalent": "after is 5",
        "reverse": "before is 0",
        "both-default": "before is 0"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0047",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Includes, autoloading & paths",
    "subtopic": "include-inherits-local-scope",
    "objective": {
      "id": "include-inherits-local-scope",
      "text": "Review the variable scope of an included configuration file inside a function."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply include scope rules to a local assignment and a separate global variable."
    },
    "prerequisites": [
      "Function scope",
      "include"
    ],
    "runtime": {
      "php": [
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
          "path": "config.php",
          "kind": "complete-file",
          "source": "<?php\n\n$mode = 'local';\n"
        },
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$mode = 'global';\n\nfunction loadMode(): string\n{\n    include __DIR__ . '/config.php';\n\n    return $mode;\n}\n\necho loadMode(), '|', $mode;\n"
        }
      ]
    },
    "stem": "A review claims that config.php overwrites the global mode even though it is included inside loadMode. Which assessment matches this two-file program?",
    "options": [
      {
        "id": "local",
        "text": "The include sets loadMode’s local variable; the global value stays global.",
        "rationale": "Included code inherits the scope of the include statement, here the function scope.",
        "misconception": null
      },
      {
        "id": "global",
        "text": "The include runs in global scope and changes both observed values to local.",
        "rationale": "A filesystem include does not automatically switch to global scope.",
        "misconception": "Assuming file boundaries determine variable scope."
      },
      {
        "id": "isolated",
        "text": "The included assignment is isolated, so loadMode cannot read mode.",
        "rationale": "Included code shares the including scope rather than a separate file-local namespace.",
        "misconception": "Assuming each PHP file has its own variable scope."
      },
      {
        "id": "include-result",
        "text": "The include causes a TypeError because config.php returns 1 inside a function declared to return string.",
        "rationale": "The return type checks return $mode, not the discarded result of the include statement.",
        "misconception": "Confusing the result of an include expression with the return value of the containing function."
      }
    ],
    "correctOptionId": "local",
    "explanation": {
      "summary": "The include statement evaluates the file in its surrounding scope. The assignment becomes local to loadMode, with no global declaration connecting it to the top-level variable.",
      "trace": "loadMode returns local. The later top-level read still returns global."
    },
    "validation": {
      "kind": "contract",
      "stdout": "local|global",
      "keyEvidence": "The two output components expose both scopes.",
      "counterexamples": {
        "global": "Global output remains global",
        "isolated": "The local read succeeds",
        "namespace": "The bare include result is discarded; loadMode returns the local string without a TypeError"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-09"
    },
    "references": [
      "https://www.php.net/manual/en/function.include.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0048",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Arrays & destructuring",
    "subtopic": "map-difference-key-value-contract",
    "objective": {
      "id": "map-difference-key-value-contract",
      "text": "Review a map-difference implementation that must compare key/value associations."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish value-set differences from differences between mappings."
    },
    "prerequisites": [
      "Associative arrays",
      "array_diff",
      "array_diff_assoc"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$before = ['read' => 'yes', 'write' => 'no'];\n$after = ['read' => 'no', 'write' => 'yes'];\n\n$changed = array_diff($after, $before);\n\necho json_encode($changed);\n"
        }
      ]
    },
    "stem": "changed should list entries whose key/value pair differs from before. A value moving to a different key counts as a change. Replace the array_diff call while preserving keys. Which review change meets that requirement?",
    "options": [
      {
        "id": "keys",
        "text": "array_diff_key($after, $before)",
        "rationale": "Both keys already exist, so this reports no changes.",
        "misconception": "Comparing only key membership while ignoring associated values."
      },
      {
        "id": "reverse",
        "text": "array_diff($before, $after)",
        "rationale": "Reversing value-only difference still finds both values present.",
        "misconception": "Assuming direction fixes a comparison that ignores keys."
      },
      {
        "id": "intersect",
        "text": "array_intersect_assoc($after, $before)",
        "rationale": "This selects unchanged pairs, the opposite of the requested result.",
        "misconception": "Confusing equality filtering with change detection."
      },
      {
        "id": "associations",
        "text": "array_diff_assoc($after, $before)",
        "rationale": "This compares each value at its corresponding key and preserves changed entries.",
        "misconception": null
      }
    ],
    "correctOptionId": "associations",
    "explanation": {
      "summary": "array_diff compares values without requiring the same key. array_diff_assoc also compares keys, which is necessary when the association carries meaning.",
      "trace": "Both string values exist in both arrays, but neither remains at its original key. The accepted result includes both after entries."
    },
    "validation": {
      "kind": "patch",
      "marker": "array_diff($after, $before)",
      "stdout": "{\"read\":\"no\",\"write\":\"yes\"}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-diff-assoc.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0049",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Classes & object lifecycle",
    "subtopic": "mutable-date-window-alias",
    "objective": {
      "id": "mutable-date-window-alias",
      "text": "Review a fluent date calculation that unintentionally changes a retained start time."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track mutation and object identity through a fluent method return."
    },
    "prerequisites": [
      "DateTime",
      "Object identity",
      "clone"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$start = new DateTime('2026-01-01', new DateTimeZone('UTC'));\n$end = $start->modify('+1 day');\n\necho json_encode([$start->format('Y-m-d'), $end->format('Y-m-d')]);\n"
        }
      ]
    },
    "stem": "The returned window must retain start at 2026-01-01 and end at 2026-01-02. The constructor type must remain DateTime. Which replacement for the end assignment fixes the review finding?",
    "options": [
      {
        "id": "clone-before",
        "text": "$end = (clone $start)->modify('+1 day');",
        "rationale": "Cloning before the mutating call gives end its own DateTime object.",
        "misconception": null
      },
      {
        "id": "clone-after",
        "text": "$end = clone $start->modify('+1 day');",
        "rationale": "The original is already modified before its returned object is cloned.",
        "misconception": "Assuming a later clone reverses an earlier mutation."
      },
      {
        "id": "assign-first",
        "text": "$end = $start;\n$end->modify('+1 day');",
        "rationale": "The assignment shares the same object, so modifying end also changes start.",
        "misconception": "Treating object assignment as cloning."
      },
      {
        "id": "new-interval",
        "text": "$end = $start->add(new DateInterval('P1D'));",
        "rationale": "DateTime::add also mutates the original object.",
        "misconception": "Assuming a different fluent date method is immutable."
      }
    ],
    "correctOptionId": "clone-before",
    "explanation": {
      "summary": "DateTime::modify mutates its receiver and returns that object. Create the independent object before applying the mutation.",
      "trace": "The original keeps January 1. The clone advances to January 2 and is assigned to end."
    },
    "validation": {
      "kind": "patch",
      "marker": "$end = $start->modify('+1 day');",
      "stdout": "[\"2026-01-01\",\"2026-01-02\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/datetime.modify.php",
      "https://www.php.net/manual/en/language.oop5.cloning.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0050",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Errors & exceptions",
    "subtopic": "exception-sentinel-domain-collision",
    "objective": {
      "id": "exception-sentinel-domain-collision",
      "text": "Review a failure sentinel that collides with a successful domain result."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a valid negative answer from infrastructure failure across an API boundary."
    },
    "prerequisites": [
      "Exceptions",
      "Boolean returns",
      "API contracts"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction lookup(string $id): bool\n{\n    if ($id === 'offline') {\n        throw new RuntimeException('storage unavailable');\n    }\n\n    return $id === 'active';\n}\n\nfunction safeLookup(string $id): bool\n{\n    try {\n        return lookup($id);\n    } catch (RuntimeException $error) {\n        return false;\n    }\n}\n\necho json_encode([safeLookup('active'), safeLookup('inactive'), safeLookup('offline')]);\n"
        }
      ]
    },
    "stem": "lookup returns true for an active account, false for an inactive account, and throws RuntimeException when storage is unavailable. Callers must distinguish all three outcomes. Which change repairs safeLookup without treating storage failure as an account status?",
    "options": [
      {
        "id": "log-and-false",
        "text": "Log the storage exception in catch, then keep returning false.",
        "rationale": "Logging can aid diagnosis but leaves callers unable to distinguish an inactive account from failed storage.",
        "misconception": "Treating a diagnostic side effect as a distinct return-channel outcome."
      },
      {
        "id": "propagate",
        "text": "Let the storage exception propagate while returning the account booleans normally.",
        "rationale": "A successful lookup returns an account status; storage failure remains on the exception channel.",
        "misconception": null
      },
      {
        "id": "true-on-error",
        "text": "Return true from catch so false remains reserved for inactive accounts.",
        "rationale": "This makes storage failure indistinguishable from a successful active-account result.",
        "misconception": "Moving the failure collision to the other successful boolean value."
      },
      {
        "id": "retry-and-false",
        "text": "Retry lookup once; return false if the retry also throws.",
        "rationale": "A persistent outage still becomes an inactive-account result after the retry.",
        "misconception": "Assuming a retry removes the need for an unambiguous final failure channel."
      }
    ],
    "correctOptionId": "propagate",
    "explanation": {
      "summary": "The catch converts an infrastructure failure into the same value used for a successful domain answer. Keeping the exception preserves the distinction without changing the meaning of false.",
      "trace": "The calls return true, false and false. The last false hides a storage exception. Removing the catch preserves the first two booleans and propagates the original failure for the third call."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[true,false,false]",
      "keyEvidence": "The active/inactive results differ, but the failed lookup collides with inactive. Propagating the exception keeps three distinguishable outcomes.",
      "counterexamples": {
        "log-and-false": "A logged failure still returns false like an inactive account.",
        "true-on-error": "Returning true on error collides with the active-account result.",
        "retry-and-false": "Repeated storage failure is still converted to false."
      },
      "contrasts": [
        {
          "name": "propagate",
          "marker": "    try {\n        return lookup($id);\n    } catch (RuntimeException $error) {\n        return false;\n    }",
          "replacement": "    return lookup($id);",
          "stdout": "",
          "error": "storage unavailable"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0051",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Transactions, migrations & ORM",
    "subtopic": "pdo-nested-transaction-ownership",
    "objective": {
      "id": "pdo-nested-transaction-ownership",
      "text": "Review transaction ownership when a helper is invoked inside an existing PDO transaction."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate a helper’s reusable work from ownership of the outer atomic unit."
    },
    "prerequisites": [
      "PDO transactions",
      "Exception flow"
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
          "source": "<?php\n\nfunction insertSecond(PDO $pdo): void\n{\n    $pdo->beginTransaction();\n    $pdo->exec('INSERT INTO events VALUES (2)');\n    $pdo->commit();\n}\n\n$pdo = new PDO('sqlite::memory:');\n$pdo->exec('CREATE TABLE events (id INTEGER)');\n$pdo->beginTransaction();\n$pdo->exec('INSERT INTO events VALUES (1)');\n\ntry {\n    insertSecond($pdo);\n    $pdo->commit();\n} catch (PDOException $error) {\n    $pdo->rollBack();\n    echo 'rolled back';\n}\n"
        }
      ]
    },
    "stem": "The caller must commit its two inserts together. insertSecond is also used by callers that manage their own transaction; its contract is to perform work inside the caller’s transaction. Which review change satisfies that contract?",
    "options": [
      {
        "id": "commit-first",
        "text": "Commit in the caller immediately before invoking insertSecond.",
        "rationale": "This makes the first insert durable separately, violating the required joint atomic unit.",
        "misconception": "Solving nesting by splitting the transaction boundary."
      },
      {
        "id": "nested-native",
        "text": "Keep both calls: PDO automatically maps nested beginTransaction calls to savepoints.",
        "rationale": "PDO::beginTransaction throws when a transaction is already active.",
        "misconception": "Assuming PDO provides automatic nested transactions."
      },
      {
        "id": "helper-work",
        "text": "Remove beginTransaction and commit from insertSecond; let its caller own the transaction.",
        "rationale": "The helper’s stated contract is to participate in the existing unit without committing it.",
        "misconception": null
      },
      {
        "id": "conditional-commit",
        "text": "Skip the helper’s beginTransaction when inTransaction is true, but always call its commit.",
        "rationale": "The helper would commit its caller’s transaction before the caller finishes its unit.",
        "misconception": "Checking transaction existence without preserving ownership."
      }
    ],
    "correctOptionId": "helper-work",
    "explanation": {
      "summary": "A transaction boundary must have an owner. This helper promises to join the caller’s unit, so it should not start or finish that unit itself.",
      "trace": "The nested begin currently throws. The outer catch rolls back the first insert. Removing both helper boundary calls allows the caller to commit both writes together."
    },
    "validation": {
      "kind": "contract",
      "stdout": "rolled back",
      "keyEvidence": "The nested begin produces the observed rollback; caller ownership satisfies the stated atomicity requirement.",
      "counterexamples": {
        "commit-first": "The first write can persist without the second",
        "nested-native": "PDO throws on nested begin",
        "conditional-commit": "The helper prematurely commits the outer transaction"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-16"
    },
    "references": [
      "https://www.php.net/manual/en/pdo.begintransaction.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0052",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Testing, style & static analysis",
    "subtopic": "preg-match-zero-is-not-failure",
    "objective": {
      "id": "preg-match-zero-is-not-failure",
      "text": "Review error handling that confuses a valid non-match with a regex engine failure."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish the three result states of preg_match and their exception policy."
    },
    "prerequisites": [
      "preg_match",
      "Strict comparisons",
      "Exceptions"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction accepts(string $text): bool\n{\n    $result = preg_match('/^[A-Z]+$/', $text);\n\n    if (!$result) {\n        throw new RuntimeException('regex failed');\n    }\n\n    return $result === 1;\n}\n\ntry {\n    echo json_encode([accepts('ABC'), accepts('123')]);\n} catch (RuntimeException $error) {\n    echo 'error';\n}\n"
        }
      ]
    },
    "stem": "A valid pattern that does not match should return false from accepts. Only regex engine failure should throw. Which replacement for !$result preserves this policy?",
    "options": [
      {
        "id": "zero",
        "text": "$result === 0",
        "rationale": "Zero is a valid non-match, so this still throws on ordinary rejected input.",
        "misconception": "Treating the non-match sentinel as engine failure."
      },
      {
        "id": "loose-false",
        "text": "$result == false",
        "rationale": "Both zero and false compare equal to false loosely.",
        "misconception": "Using loose equality for a three-state API."
      },
      {
        "id": "not-one",
        "text": "$result !== 1",
        "rationale": "This combines non-match and engine failure into the same branch.",
        "misconception": "Assuming every unsuccessful match indicates an engine problem."
      },
      {
        "id": "strict-false",
        "text": "$result === false",
        "rationale": "Only the boolean false signals an engine failure; integer zero remains a normal non-match.",
        "misconception": null
      }
    ],
    "correctOptionId": "strict-false",
    "explanation": {
      "summary": "preg_match returns 1 for a match, 0 for no match and false on failure. Strict comparison is necessary to keep those states separate.",
      "trace": "ABC produces 1 and true. 123 produces 0 and false without an exception."
    },
    "validation": {
      "kind": "patch",
      "marker": "!$result",
      "stdout": "[true,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0053",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Arrays & destructuring",
    "subtopic": "reduce-empty-identity-value",
    "objective": {
      "id": "reduce-empty-identity-value",
      "text": "Review a reduction’s identity value for empty input and typed callbacks."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace the initial accumulator and the no-callback case of an empty reduction."
    },
    "prerequisites": [
      "array_reduce",
      "Array callbacks",
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
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction flatten(array $groups): array\n{\n    $append = function (array $all, array $group): array {\n        return array_merge($all, $group);\n    };\n\n    return array_reduce($groups, $append);\n}\n\ntry {\n    echo json_encode([flatten([]), flatten([[1], [2]])]);\n} catch (TypeError $error) {\n    echo 'TypeError';\n}\n"
        }
      ]
    },
    "stem": "flatten must return an array for every list of arrays, including an empty list. Which replacement for the return call preserves that contract and supports the typed accumulator?",
    "options": [
      {
        "id": "identity",
        "text": "array_reduce($groups, $append, [])",
        "rationale": "An empty array is the merge identity and the correctly typed initial accumulator.",
        "misconception": null
      },
      {
        "id": "cast-result",
        "text": "(array) array_reduce($groups, $append)",
        "rationale": "Casting the result helps empty input but cannot prevent the callback from first receiving null on nonempty input.",
        "misconception": "Repairing only the reduction’s final value."
      },
      {
        "id": "first-group",
        "text": "$groups[0] ?? []",
        "rationale": "This discards every group after the first, so it is not an equivalent reduction.",
        "misconception": "Replacing the fold with a seed value without processing the remainder."
      },
      {
        "id": "scalar-seed",
        "text": "array_reduce($groups, $append, 0)",
        "rationale": "Zero is neither an array nor the identity for this array-merging callback.",
        "misconception": "Applying the numeric sum identity to an array operation."
      }
    ],
    "correctOptionId": "identity",
    "explanation": {
      "summary": "Without an explicit initial value, array_reduce starts with null and returns null for empty input. Supplying [] meets both the callback type and the empty-result contract.",
      "trace": "The empty reduction returns []. The nonempty reduction merges [1] and then [2] into the array accumulator."
    },
    "validation": {
      "kind": "patch",
      "marker": "array_reduce($groups, $append)",
      "stdout": "[[],[1,2]]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-reduce.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0054",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Iterators, generators & fibers",
    "subtopic": "generator-materialization-duplicate-keys",
    "objective": {
      "id": "generator-materialization-duplicate-keys",
      "text": "Review materialization of an event stream whose keys are not unique."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish iteration over all yields from insertion into a keyed PHP array."
    },
    "prerequisites": [
      "Generators",
      "iterator_to_array",
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
          "source": "<?php\n\nfunction events(): Generator\n{\n    yield 'same' => 'created';\n    yield 'same' => 'updated';\n}\n\n$events = events();\n\n$output = iterator_to_array($events);\n\necho json_encode($output);\n"
        }
      ]
    },
    "stem": "Both events must remain in a positional list, even though their source keys repeat. Which replacement for iterator_to_array($events) meets that requirement?",
    "options": [
      {
        "id": "values-after",
        "text": "array_values(iterator_to_array($events))",
        "rationale": "The first event is already overwritten before array_values removes keys.",
        "misconception": "Trying to repair information loss after keyed materialization."
      },
      {
        "id": "discard-keys",
        "text": "iterator_to_array($events, false)",
        "rationale": "Disabling key preservation appends both yields under consecutive numeric keys.",
        "misconception": null
      },
      {
        "id": "preserve-keys",
        "text": "iterator_to_array($events, true)",
        "rationale": "Preserved duplicate keys cause the later event to replace the earlier one.",
        "misconception": "Assuming an array can retain multiple entries with the same key."
      },
      {
        "id": "unique-after",
        "text": "array_unique(iterator_to_array($events))",
        "rationale": "The keyed conversion already loses created; uniqueness filtering cannot restore it.",
        "misconception": "Using duplicate-value filtering to address duplicate keys."
      }
    ],
    "correctOptionId": "discard-keys",
    "explanation": {
      "summary": "A generator may yield a key repeatedly. A PHP array cannot store duplicate keys, so preserving those keys during conversion overwrites earlier entries.",
      "trace": "With key preservation disabled, created and updated are appended in yield order and both survive."
    },
    "validation": {
      "kind": "patch",
      "marker": "iterator_to_array($events)",
      "stdout": "[\"created\",\"updated\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/function.iterator-to-array.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0055",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Closures, callbacks & callables",
    "subtopic": "multi-array-map-key-reindexing",
    "objective": {
      "id": "multi-array-map-key-reindexing",
      "text": "Review an array_map refactor that loses associative keys when a second input array is added."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Compare key behavior between single-array and multiple-array mapping."
    },
    "prerequisites": [
      "array_map",
      "Associative arrays",
      "Callbacks"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$values = ['left' => 10, 'right' => 20];\n$offsets = [1, 2];\n\n$before = array_map(fn ($value) => $value + 1, $values);\n$after = array_map(fn ($value, $offset) => $value + $offset, $values, $offsets);\n\necho json_encode([array_keys($before), array_keys($after)]);\n"
        }
      ]
    },
    "stem": "A refactor adds an offsets array to an existing array_map call. The caller requires the output keys left and right. Which review statement accurately explains the displayed result?",
    "options": [
      {
        "id": "values-keys",
        "text": "The numeric offsets are added to the string keys, so PHP converts the keys to integers.",
        "rationale": "The callback receives values, and array_map does not add keys.",
        "misconception": "Attributing key changes to callback arithmetic."
      },
      {
        "id": "both-preserve",
        "text": "Both calls retain the first array’s keys, regardless of additional arrays.",
        "rationale": "Key preservation applies only when exactly one array is supplied.",
        "misconception": "Extending single-array behavior to multi-array mapping."
      },
      {
        "id": "multi-reindexes",
        "text": "The second call receives multiple arrays and produces sequential numeric keys.",
        "rationale": "The multi-array form reindexes its result; preserving keys requires an explicit mapping strategy.",
        "misconception": null
      },
      {
        "id": "arrow-reindexes",
        "text": "The second arrow function has two parameters, so arrow functions discard keys.",
        "rationale": "The number of input arrays determines this behavior, not arrow syntax or callback arity.",
        "misconception": "Assigning collection behavior to the callback’s syntax."
      }
    ],
    "correctOptionId": "multi-reindexes",
    "explanation": {
      "summary": "array_map preserves keys for one input array. With multiple arrays, the result uses sequential integer keys, even when the first input is associative.",
      "trace": "before has keys left and right. after has keys 0 and 1. A keyed loop or deliberate recombination is needed if those names are part of the contract."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[[\"left\",\"right\"],[0,1]]",
      "keyEvidence": "The observed key lists differ exactly at the multi-array call.",
      "counterexamples": {
        "values-keys": "Only values enter the callback",
        "both-preserve": "after keys are 0 and 1",
        "arrow-reindexes": "A two-parameter ordinary closure has the same multi-array behavior"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0056",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Validation & web security",
    "subtopic": "constant-time-token-comparison",
    "objective": {
      "id": "constant-time-token-comparison",
      "text": "Review a secret comparison for strict equality and timing-resistant comparison."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate type-juggling prevention from the additional timing requirement."
    },
    "prerequisites": [
      "String comparison",
      "Authentication tokens",
      "Timing side channels"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$stored = '0e123456789';\n$provided = '0e987654321';\n\n$accepted = $stored == $provided;\n\necho json_encode($accepted);\n"
        }
      ]
    },
    "stem": "These are fixed test strings, not real credentials. Production tokens are equal-length hexadecimal strings. The comparison must reject different contents and use PHP’s timing-safe comparison API. Which replacement satisfies both requirements?",
    "options": [
      {
        "id": "cast",
        "text": "(string) $stored == (string) $provided",
        "rationale": "Both operands are already strings; loose numeric-string comparison still treats both as zero.",
        "misconception": "Assuming string casts disable numeric-string comparison."
      },
      {
        "id": "strict",
        "text": "$stored === $provided",
        "rationale": "Identity rejects these values, but does not provide the requested timing-safe API contract.",
        "misconception": "Treating strict equality as a timing guarantee."
      },
      {
        "id": "strcmp",
        "text": "strcmp($stored, $provided) === 0",
        "rationale": "This compares contents correctly but is not the requested timing-safe comparison API.",
        "misconception": "Assuming all string comparison functions are timing resistant."
      },
      {
        "id": "hash-equals",
        "text": "hash_equals($stored, $provided)",
        "rationale": "hash_equals compares the known string with the user-supplied string using the intended timing-safe API.",
        "misconception": null
      }
    ],
    "correctOptionId": "hash-equals",
    "explanation": {
      "summary": "Loose comparison can treat numeric-looking strings as numbers. Strict comparison fixes that issue, but hash_equals additionally satisfies the explicit timing-safe API requirement.",
      "trace": "The displayed loose comparison returns true because both strings represent zero in scientific notation. hash_equals compares their different bytes and returns false."
    },
    "validation": {
      "kind": "contract",
      "stdout": "true",
      "keyEvidence": "The witness demonstrates loose comparison failure; the manual specifies hash_equals timing-safe contract.",
      "counterexamples": {
        "cast": "Both numeric strings still compare numerically",
        "strict": "No timing-safe guarantee",
        "strcmp": "No timing-safe guarantee"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.hash-equals.php",
      "https://www.php.net/manual/en/language.operators.comparison.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0057",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Files & structured data",
    "subtopic": "lock-before-truncate-file-mode",
    "objective": {
      "id": "lock-before-truncate-file-mode",
      "text": "Review a file replacement sequence that truncates before acquiring its cooperative lock."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Order open-mode side effects and lock acquisition under a stated concurrency protocol."
    },
    "prerequisites": [
      "fopen modes",
      "flock",
      "File truncation"
    ],
    "runtime": {
      "php": [
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
        "All participating writers use an exclusive flock on this same existing file; readers also follow the lock protocol. Each listed operation succeeds. Filesystem replacement is not required."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$path = __DIR__ . '/state.txt';\nfile_put_contents($path, 'old');\n\n$handle = fopen($path, 'w');\n\necho strlen(file_get_contents($path));\n\nfclose($handle);\n"
        }
      ]
    },
    "stem": "The file must not be truncated until this writer owns the exclusive lock. The shown fopen already empties it. Which replacement sequence meets the requirement when all participants obey the stated locking protocol?",
    "options": [
      {
        "id": "w-then-lock",
        "text": "Open with w; acquire LOCK_EX; write the replacement.",
        "rationale": "Mode w truncates during fopen, before flock can run.",
        "misconception": "Assuming truncation waits until the first write."
      },
      {
        "id": "c-lock-truncate",
        "text": "Open with c; acquire LOCK_EX; truncate to zero; rewind; write and flush; unlock.",
        "rationale": "Mode c avoids truncation at open, so truncation occurs only after lock acquisition.",
        "misconception": null
      },
      {
        "id": "a-lock-write",
        "text": "Open with a; acquire LOCK_EX; write the replacement; unlock.",
        "rationale": "Append mode retains old contents and adds new bytes rather than replacing the file.",
        "misconception": "Treating append as a safe replacement mode."
      },
      {
        "id": "r-lock-write",
        "text": "Open with r; acquire LOCK_EX; truncate and write; unlock.",
        "rationale": "A read-only handle cannot perform the required writes and truncation.",
        "misconception": "Assuming an exclusive lock grants write access to a read-only stream."
      }
    ],
    "correctOptionId": "c-lock-truncate",
    "explanation": {
      "summary": "Locking cannot undo a side effect that happened while opening the stream. The c mode opens for writing without truncating, allowing the lock to be acquired first.",
      "trace": "The witness prints 0 immediately after fopen with w, before any write or flock. Under the stated cooperative protocol, c followed by the lock and explicit truncation preserves ordering."
    },
    "validation": {
      "kind": "contract",
      "stdout": "0",
      "keyEvidence": "The empty file before locking demonstrates the ordering defect; c avoids that open-time side effect.",
      "counterexamples": {
        "w-then-lock": "Truncates before lock",
        "a-lock-write": "Appends rather than replaces",
        "r-lock-write": "Handle is not writable"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.fopen.php",
      "https://www.php.net/manual/en/function.flock.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0058",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Performance, processes & servers",
    "subtopic": "weakmap-value-external-reachability",
    "objective": {
      "id": "weakmap-value-external-reachability",
      "text": "Review WeakMap eviction when an externally retained value points back to its key."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Distinguish an external strong reference from a collectable map-value-key cycle across two collection points."
    },
    "prerequisites": [
      "WeakMap (advanced)",
      "Object reachability",
      "Garbage collection"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$cache = new WeakMap();\n$key = new stdClass();\n$value = (object) ['owner' => $key];\n$cache[$key] = $value;\n\nunset($key);\ngc_collect_cycles();\n$whileHeld = count($cache);\n\nunset($value);\ngc_collect_cycles();\n\necho json_encode([$whileHeld, count($cache)]);\n"
        }
      ]
    },
    "stem": "A reviewer expects unsetting key to remove the cache entry immediately. Another variable still retains value, which points to key. Which assessment matches the two collection points?",
    "options": [
      {
        "id": "force-gc",
        "text": "The first collection removes the entry because a WeakMap key can never have a strong owner.",
        "rationale": "WeakMap only weakens its own key edge; the external value variable still owns an object that retains the key.",
        "misconception": "Treating weak-map membership as weakening every reference to the key."
      },
      {
        "id": "key-copied",
        "text": "The entry survives both points because insertion clones and privately owns the key.",
        "rationale": "WeakMap preserves object identity and does not clone its keys.",
        "misconception": "Assuming a map copies its object keys."
      },
      {
        "id": "external-edge",
        "text": "The external value keeps the key alive at the first point; after value is unset, collection removes the entry.",
        "rationale": "The external value-to-owner path retains the key until that external root is removed.",
        "misconception": null
      },
      {
        "id": "permanent-cycle",
        "text": "The entry survives both points because a map-value-key cycle is never collectable.",
        "rationale": "The second explicit collection removes this cycle on both stated runtimes.",
        "misconception": "Assuming every cycle involving a weak map is a permanent leak."
      }
    ],
    "correctOptionId": "external-edge",
    "explanation": {
      "summary": "A weak key relationship does not cancel external strong references to the key. Once the external value is released, the remaining map-related cycle in this example can be collected.",
      "trace": "The first count is 1 because value still retains owner. After value is unset and collection runs, the second count is 0."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[1,0]",
      "keyEvidence": "The two observed counts distinguish external reachability from the remaining collectable cycle.",
      "counterexamples": {
        "force-gc": "The first count is 1",
        "key-copied": "The second count is 0 and no key clone occurs",
        "permanent-cycle": "The second count is 0"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://www.php.net/manual/en/class.weakmap.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0059",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Classes & object lifecycle",
    "subtopic": "readonly-clone-reinitialization",
    "objective": {
      "id": "readonly-clone-reinitialization",
      "text": "Review deep-copy repair using readonly-property reinitialization during cloning."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Combine shallow clone behavior, readonly assignment restrictions and the clone-specific reinitialization rule."
    },
    "prerequisites": [
      "Readonly properties",
      "__clone",
      "Nested object identity"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Snapshot\n{\n    public function __construct(public readonly stdClass $child)\n    {\n    }\n\n    public function __clone(): void\n    {\n        $this->child = clone $this->child;\n    }\n}\n\n$original = new Snapshot((object) ['value' => 1]);\n$copy = clone $original;\n$copy->child->value = 2;\n\necho json_encode([$original->child->value, $copy->child->value]);\n"
        }
      ]
    },
    "stem": "A reviewer claims that assigning child in __clone is forbidden because child is readonly. On the stated PHP 8.4/8.5 runtimes, which assessment is correct?",
    "options": [
      {
        "id": "clone-exception",
        "text": "The assignment is allowed during __clone; it gives the copy an independent child.",
        "rationale": "PHP permits readonly reinitialization during cloning, and the nested clone breaks child sharing.",
        "misconception": null
      },
      {
        "id": "always-forbidden",
        "text": "The assignment must throw because readonly properties can never be reassigned in any context.",
        "rationale": "The stated versions include the clone-specific reinitialization rule.",
        "misconception": "Applying the older unconditional restriction to modern clone behavior."
      },
      {
        "id": "shared-slot",
        "text": "The assignment replaces the child on both snapshots because their readonly property storage is shared.",
        "rationale": "The clone has its own property slot. Replacing that slot does not replace the original snapshot’s child.",
        "misconception": "Confusing a shallow-copied object value with shared property storage between cloned objects."
      },
      {
        "id": "recursive-default",
        "text": "The assignment is unnecessary because cloning Snapshot already recursively clones child.",
        "rationale": "Normal object cloning is shallow; the explicit nested clone is what separates child.",
        "misconception": "Assuming automatic deep cloning."
      }
    ],
    "correctOptionId": "clone-exception",
    "explanation": {
      "summary": "Since PHP 8.3, readonly properties may be reinitialized during cloning. This allows __clone to replace a shallow-copied nested object with its own clone.",
      "trace": "The copy receives an independent child. Updating its value to 2 leaves the original child at 1."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[1,2]",
      "keyEvidence": "The observed independent values validate both the permitted assignment and deep-copy step.",
      "counterexamples": {
        "always-forbidden": "The program completes without Error",
        "shared-slot": "The children have independent values",
        "recursive-default": "Removing the explicit clone would retain the shared child"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0060",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Closures, callbacks & callables",
    "subtopic": "private-first-class-callable-export",
    "objective": {
      "id": "private-first-class-callable-export",
      "text": "Review whether replacing a first-class callable with an array callable preserves private-method access."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Distinguish callable acquisition scope from later invocation visibility checks."
    },
    "prerequisites": [
      "First-class callables (advanced)",
      "Private methods",
      "Closure scope"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Vault\n{\n    private function secret(): string\n    {\n        return 'ok';\n    }\n\n    public function exported(bool $asArray): mixed\n    {\n        if ($asArray) {\n            return [$this, 'secret'];\n        }\n\n        return $this->secret(...);\n    }\n}\n\n$vault = new Vault();\n$closure = $vault->exported(false);\n$array = $vault->exported(true);\n\necho json_encode([$closure(), is_callable($array)]);\n"
        }
      ]
    },
    "stem": "A proposed refactor changes exported from a first-class callable to an array callable. Invocation occurs outside Vault. Which review statement correctly describes the compatibility effect?",
    "options": [
      {
        "id": "same-object",
        "text": "Both remain callable outside because the array retains the same object.",
        "rationale": "Object identity does not grant outside code access to a private method.",
        "misconception": "Equating possession of an object with permission to call its private methods."
      },
      {
        "id": "neither",
        "text": "Neither can be invoked outside because secret is private.",
        "rationale": "The first-class callable is acquired inside the authorized scope and remains invocable.",
        "misconception": "Rechecking private visibility for an already acquired Closure."
      },
      {
        "id": "array-public",
        "text": "The array form makes secret public for subsequent calls.",
        "rationale": "Returning an array does not change method visibility.",
        "misconception": "Treating a callable representation as a visibility modifier."
      },
      {
        "id": "scope-preserved",
        "text": "The Closure works outside; the array form fails the outside visibility check.",
        "rationale": "The acquired Closure retains callable access, while an array is resolved under the later caller’s scope.",
        "misconception": null
      }
    ],
    "correctOptionId": "scope-preserved",
    "explanation": {
      "summary": "First-class callable syntax acquires a Closure in the current scope. Returning an object/method array merely describes a future lookup and does not transfer private access.",
      "trace": "The exported Closure returns ok. Outside Vault, is_callable for the array is false."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"ok\",false]",
      "keyEvidence": "The same private method behaves differently under the two callable representations.",
      "counterexamples": {
        "same-object": "Outside is_callable is false",
        "neither": "The Closure returns ok",
        "array-public": "Visibility remains private"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0061",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Validation & web security",
    "subtopic": "unserialize-disallowed-class-shape",
    "objective": {
      "id": "unserialize-disallowed-class-shape",
      "text": "Review the limits of allowed_classes=false when consuming serialized data."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish class-instantiation restrictions from the type and validation of one decoded value."
    },
    "prerequisites": [
      "Serialization",
      "__wakeup",
      "__PHP_Incomplete_Class"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Message\n{\n    public static int $wakes = 0;\n    public string $text = 'demo';\n\n    public function __wakeup(): void\n    {\n        self::$wakes++;\n    }\n}\n\n$payload = serialize(new Message());\n$decoded = unserialize($payload, ['allowed_classes' => false]);\n\necho json_encode([get_class($decoded), Message::$wakes, is_array($decoded)]);\n"
        }
      ]
    },
    "stem": "The payload is generated locally for this demonstration. A review proposes treating allowed_classes=false as proof that any decoded payload is a validated array. Which assessment of this claim is correct?",
    "options": [
      {
        "id": "array-conversion",
        "text": "The option converts every object into an array and validates its field types.",
        "rationale": "Disallowed objects become incomplete objects; no schema validation is performed.",
        "misconception": "Confusing a class restriction with a data decoder and validator."
      },
      {
        "id": "limited-control",
        "text": "The option prevents Message construction here, but returns an incomplete object rather than a validated array.",
        "rationale": "Class restrictions control instantiation; callers must still validate the decoded value and should not deserialize untrusted input.",
        "misconception": null
      },
      {
        "id": "wake-first",
        "text": "Message::__wakeup runs first, then the option converts its result to an array.",
        "rationale": "A disallowed class’s wakeup hook is not invoked in this case.",
        "misconception": "Assuming class restrictions apply only after object hooks run."
      },
      {
        "id": "null-result",
        "text": "Every disallowed object becomes null, so the caller only needs a null check.",
        "rationale": "The result is __PHP_Incomplete_Class, not null.",
        "misconception": "Assuming rejection discards the whole object value."
      }
    ],
    "correctOptionId": "limited-control",
    "explanation": {
      "summary": "allowed_classes restricts classes that may be instantiated. It does not guarantee an array result, validate a schema or make arbitrary serialized input safe to trust.",
      "trace": "The known fixture produces __PHP_Incomplete_Class, runs no Message wakeup hook and is not an array."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"__PHP_Incomplete_Class\",0,false]",
      "keyEvidence": "The runtime witness directly refutes the claimed array and validation guarantees.",
      "counterexamples": {
        "array-conversion": "is_array is false",
        "wake-first": "wakes remains 0",
        "null-result": "get_class reports __PHP_Incomplete_Class"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.unserialize.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0062",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Classes & object lifecycle",
    "subtopic": "serialization-hook-precedence",
    "objective": {
      "id": "serialization-hook-precedence",
      "text": "Review a serialization-hook migration without assuming legacy hooks still execute."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Apply modern-hook precedence to one serialization round trip and identify skipped legacy validation."
    },
    "prerequisites": [
      "__serialize and __unserialize",
      "__sleep and __wakeup",
      "Static trace state"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Envelope\n{\n    public static array $trace = [];\n    public int $value = 7;\n\n    public function __sleep(): array\n    {\n        self::$trace[] = 'sleep';\n\n        return ['value'];\n    }\n\n    public function __wakeup(): void\n    {\n        self::$trace[] = 'wakeup';\n    }\n\n    public function __serialize(): array\n    {\n        self::$trace[] = 'serialize';\n\n        return ['v' => $this->value];\n    }\n\n    public function __unserialize(array $data): void\n    {\n        self::$trace[] = 'unserialize';\n        $this->value = $data['v'];\n    }\n}\n\n$restored = unserialize(serialize(new Envelope()));\n\necho json_encode([Envelope::$trace, $restored->value]);\n"
        }
      ]
    },
    "stem": "A class adds modern serialization hooks but retains its old hooks. Which review statement matches the hook sequence for a newly serialized instance on PHP 8.4/8.5?",
    "options": [
      {
        "id": "both-pairs",
        "text": "Both old and new hook pairs run, so old validation remains active.",
        "rationale": "The modern hooks take precedence instead of chaining to the legacy hooks.",
        "misconception": "Assuming serialization hooks compose automatically."
      },
      {
        "id": "old-wins",
        "text": "The older hooks retain precedence to preserve backward compatibility.",
        "rationale": "__serialize and __unserialize have precedence when present.",
        "misconception": "Assuming declaration history controls hook selection."
      },
      {
        "id": "modern-only",
        "text": "Only __serialize and __unserialize run; required old-hook logic must be deliberately preserved.",
        "rationale": "The modern pair controls this round trip, so migration must explicitly carry over any necessary validation.",
        "misconception": null
      },
      {
        "id": "mixed",
        "text": "__serialize runs when writing, but __wakeup always runs after restoration.",
        "rationale": "__unserialize suppresses __wakeup for this restoration.",
        "misconception": "Applying modern precedence only to the write side."
      }
    ],
    "correctOptionId": "modern-only",
    "explanation": {
      "summary": "When the modern hooks exist, PHP uses __serialize instead of __sleep and __unserialize instead of __wakeup. Old hook bodies are not automatically called.",
      "trace": "The trace is serialize, unserialize. The modern representation uses v, which the modern reader restores to value 7."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[[\"serialize\",\"unserialize\"],7]",
      "keyEvidence": "The trace records precisely which hooks execute in the round trip.",
      "counterexamples": {
        "both-pairs": "sleep and wakeup are absent",
        "old-wins": "Modern hooks appear in the trace",
        "mixed": "wakeup is absent and unserialize is present"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.magic.php#object.serialize"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0063",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Errors & exceptions",
    "subtopic": "finally-replacement-exception-chain",
    "objective": {
      "id": "finally-replacement-exception-chain",
      "text": "Review exception identity and chaining when cleanup throws during exception propagation."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Trace a work exception through a throwing finally block and inspect the resulting previous chain."
    },
    "prerequisites": [
      "Exception propagation",
      "finally",
      "getPrevious"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\ntry {\n    try {\n        throw new RuntimeException('work');\n    } finally {\n        throw new LogicException('cleanup');\n    }\n} catch (Throwable $error) {\n    echo json_encode([\n        get_class($error),\n        $error->getMessage(),\n        $error->getPrevious()?->getMessage(),\n    ]);\n}\n"
        }
      ]
    },
    "stem": "A review claims that cleanup failure leaves the work failure as the directly caught exception. Which statement describes this code’s actual propagation?",
    "options": [
      {
        "id": "cleanup-primary",
        "text": "LogicException is caught directly, with the work exception retained as previous.",
        "rationale": "The throwable from finally takes precedence, and PHP chains the earlier exception.",
        "misconception": null
      },
      {
        "id": "work-primary",
        "text": "RuntimeException is caught directly, with cleanup retained as previous.",
        "rationale": "The later throwable from finally becomes the directly propagated one.",
        "misconception": "Reversing the precedence of cleanup and pending failures."
      },
      {
        "id": "cleanup-only",
        "text": "LogicException is caught directly, and the earlier work exception is discarded completely.",
        "rationale": "The earlier exception is available through getPrevious in this case.",
        "misconception": "Assuming replacement necessarily deletes the causal chain."
      },
      {
        "id": "both-catches",
        "text": "The catch executes twice, once for each exception.",
        "rationale": "There is one propagated throwable with a previous chain, not two catch invocations.",
        "misconception": "Treating chained exceptions as separate propagation events."
      }
    ],
    "correctOptionId": "cleanup-primary",
    "explanation": {
      "summary": "Throwing from finally changes the primary exception seen by the caller. When an exception was already propagating, PHP preserves it as the previous exception of the new one.",
      "trace": "The catch receives LogicException with message cleanup. getPrevious retrieves the RuntimeException with message work."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"LogicException\",\"cleanup\",\"work\"]",
      "keyEvidence": "All three fields distinguish primary type, primary message and earlier cause.",
      "counterexamples": {
        "work-primary": "The caught type is LogicException",
        "cleanup-only": "previous message is work",
        "both-catches": "Only one JSON tuple is emitted"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/language.exceptions.php#language.exceptions.finally"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0064",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Types, casting & comparisons",
    "subtopic": "dnf-union-refactor-widens-contract",
    "objective": {
      "id": "dnf-union-refactor-widens-contract",
      "text": "Review whether flattening a disjunctive normal form type preserves its capability requirement."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Compare conjunction and disjunction against explicitly declared object capabilities."
    },
    "prerequisites": [
      "Interfaces",
      "Union and intersection types",
      "DNF types"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\ninterface Readable\n{\n}\ninterface Seekable\n{\n}\ninterface IndependentSource\n{\n}\n\nclass ReadOnlySource implements Readable\n{\n}\nclass SeekableSource implements Readable, Seekable\n{\n}\nclass Independent implements IndependentSource\n{\n}\nclass Hybrid implements Readable, IndependentSource\n{\n}\n\nfunction original((Readable&Seekable)|IndependentSource $source): bool\n{\n    return true;\n}\n\nfunction revised(Readable|Seekable|IndependentSource $source): bool\n{\n    return true;\n}\n\nforeach ([new ReadOnlySource(), new SeekableSource(), new Independent(), new Hybrid()] as $source) {\n    try {\n        original($source);\n        echo 'both;';\n    } catch (TypeError $error) {\n        echo revised($source) ? 'new-only;' : 'neither;';\n    }\n}\n"
        }
      ]
    },
    "stem": "The original contract accepts an object that is both Readable and Seekable, or an IndependentSource. A refactor replaces (Readable&Seekable)|IndependentSource with Readable|Seekable|IndependentSource. Which input newly passes even though it violates the original contract?",
    "options": [
      {
        "id": "seekable",
        "text": "SeekableSource",
        "rationale": "It implements both Readable and Seekable, so it already satisfies the original intersection.",
        "misconception": "Treating an intersection as excluding objects that implement both interfaces."
      },
      {
        "id": "independent",
        "text": "Independent",
        "rationale": "The independent-source branch already accepts this object.",
        "misconception": "Ignoring the original union’s second branch."
      },
      {
        "id": "hybrid",
        "text": "Hybrid",
        "rationale": "IndependentSource alone satisfies the original union, regardless of the additional Readable capability.",
        "misconception": "Assuming every accepted object must satisfy the intersection branch."
      },
      {
        "id": "read-only",
        "text": "ReadOnlySource",
        "rationale": "It lacks Seekable and IndependentSource, so only the widened union accepts it.",
        "misconception": null
      }
    ],
    "correctOptionId": "read-only",
    "explanation": {
      "summary": "The intersection requires both capabilities together. Replacing it with a union accepts either capability alone and therefore widens the domain.",
      "trace": "Only the first object prints new-only. The remaining three already satisfy at least one original branch."
    },
    "validation": {
      "kind": "contract",
      "stdout": "new-only;both;both;both;",
      "keyEvidence": "The four witnesses evaluate each option against both type declarations.",
      "counterexamples": {
        "seekable": "Accepted by original intersection",
        "independent": "Accepted by original second branch",
        "hybrid": "Accepted by original second branch"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.composite.dnf"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0065",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "code-review",
    "topic": "Functions & arguments",
    "subtopic": "strict-types-internal-callback-boundary",
    "objective": {
      "id": "strict-types-internal-callback-boundary",
      "text": "Review a callback-to-loop refactor across strict and internal scalar-call boundaries."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Trace call-site strictness through a direct userland call and an internal function invoking a callback."
    },
    "prerequisites": [
      "strict_types",
      "Scalar type declarations",
      "Internal callbacks (advanced)"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\ndeclare(strict_types=1);\n\nfunction takeInt(int $value): int\n{\n    return $value;\n}\n\ntry {\n    takeInt('12');\n    $direct = 'accepted';\n} catch (TypeError $error) {\n    $direct = 'TypeError';\n}\n\n$mapped = array_map('takeInt', ['12']);\n\necho json_encode([$direct, $mapped]);\n"
        }
      ]
    },
    "stem": "A proposed refactor replaces array_map with a foreach loop that directly calls takeInt from this same strict file. Which compatibility concern is demonstrated by the example?",
    "options": [
      {
        "id": "both-reject",
        "text": "No concern: strict_types makes both forms reject every numeric string.",
        "rationale": "Calls made from internal functions do not inherit this file’s strict scalar-call behavior.",
        "misconception": "Treating strict_types as a process-wide setting."
      },
      {
        "id": "boundary-change",
        "text": "The direct loop would reject a numeric string that array_map currently coerces.",
        "rationale": "The direct call originates in the strict file; the callback invocation originates in the internal function.",
        "misconception": null
      },
      {
        "id": "both-coerce",
        "text": "No concern: the parameter’s int type always coerces numeric strings.",
        "rationale": "The direct call in this strict file throws TypeError.",
        "misconception": "Assuming scalar parameter declarations always use coercion."
      },
      {
        "id": "return-only",
        "text": "The difference concerns only return types; argument acceptance stays identical.",
        "rationale": "The witness differs at argument binding before any result is returned.",
        "misconception": "Applying strict_types only to return values."
      }
    ],
    "correctOptionId": "boundary-change",
    "explanation": {
      "summary": "Strict scalar argument behavior is selected at the call site. PHP’s internal callback invocation does not apply the strict setting of the file that called array_map.",
      "trace": "The direct takeInt call rejects the string. array_map invokes the callback with scalar coercion and obtains integer 12."
    },
    "validation": {
      "kind": "contract",
      "stdout": "[\"TypeError\",[12]]",
      "keyEvidence": "The two call paths use the same function and input but have different argument acceptance.",
      "counterexamples": {
        "both-reject": "array_map returns [12]",
        "both-coerce": "Direct call throws TypeError",
        "return-only": "The failure occurs while binding the argument"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-07"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0066",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "split-header-first-delimiter",
    "objective": {
      "id": "split-header-first-delimiter",
      "text": "Split a name/value line at its first delimiter while retaining subsequent delimiters in the value."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Select the appropriate positive split limit for a small string."
    },
    "prerequisites": [
      "explode",
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
          "source": "<?php\n\n$line = 'Location:https://example.test/a:b';\n\n$parts = explode(':', $line);\n\necho json_encode($parts, JSON_UNESCAPED_SLASHES);\n"
        }
      ]
    },
    "stem": "Split this line into exactly [\"Location\",\"https://example.test/a:b\"]. Which expression should replace the current explode call?",
    "options": [
      {
        "id": "three",
        "text": "explode(':', $line, 3)",
        "rationale": "A limit of 3 still splits the colon after https.",
        "misconception": "Counting delimiters rather than desired result elements."
      },
      {
        "id": "two",
        "text": "explode(':', $line, 2)",
        "rationale": "The second element retains the remaining string, including all later colons.",
        "misconception": null
      },
      {
        "id": "negative",
        "text": "explode(':', $line, -1)",
        "rationale": "A negative limit removes trailing pieces after splitting; it does not preserve the unsplit value.",
        "misconception": "Treating negative limits as split-from-the-front counts."
      },
      {
        "id": "one",
        "text": "explode(':', $line, 1)",
        "rationale": "A limit of 1 returns the entire line as one element.",
        "misconception": "Assuming the limit counts delimiter occurrences rather than output pieces."
      }
    ],
    "correctOptionId": "two",
    "explanation": {
      "summary": "A positive explode limit is the maximum number of output elements. The last element contains the remaining unsplit text.",
      "trace": "With limit 2, the first colon separates Location from the complete URL."
    },
    "validation": {
      "kind": "patch",
      "marker": "explode(':', $line)",
      "stdout": "[\"Location\",\"https://example.test/a:b\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.explode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0067",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Arrays & destructuring",
    "subtopic": "array-column-index-and-value",
    "objective": {
      "id": "array-column-index-and-value",
      "text": "Build an identifier-to-name lookup from a list of records."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Choose value and index fields in the array_column call."
    },
    "prerequisites": [
      "Arrays of records",
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
          "source": "<?php\n\n$rows = [\n    ['id' => 7, 'name' => 'Ada'],\n    ['id' => 9, 'name' => 'Lin'],\n];\n\n$lookup = array_column($rows, 'name');\n\necho json_encode($lookup);\n"
        }
      ]
    },
    "stem": "All rows have distinct integer ids and a name. Which expression produces an id-to-name lookup with keys 7 and 9?",
    "options": [
      {
        "id": "names-as-keys",
        "text": "array_column($rows, 'id', 'name')",
        "rationale": "This produces the inverse mapping, names to ids.",
        "misconception": "Reversing the value-field and index-field arguments."
      },
      {
        "id": "whole-rows",
        "text": "array_column($rows, null, 'id')",
        "rationale": "This indexes whole row arrays by id, rather than mapping to names.",
        "misconception": "Using null to mean the desired value column instead of the full row."
      },
      {
        "id": "id-to-name",
        "text": "array_column($rows, 'name', 'id')",
        "rationale": "name supplies the values and id supplies the resulting keys.",
        "misconception": null
      },
      {
        "id": "ids-only",
        "text": "array_column($rows, 'id')",
        "rationale": "This returns a positional list of ids without names.",
        "misconception": "Choosing the desired index field as the extracted value field."
      }
    ],
    "correctOptionId": "id-to-name",
    "explanation": {
      "summary": "array_column takes the value column second and the optional index column third.",
      "trace": "Row 7 contributes key 7 with value Ada; row 9 contributes key 9 with value Lin."
    },
    "validation": {
      "kind": "patch",
      "marker": "array_column($rows, 'name')",
      "stdout": "{\"7\":\"Ada\",\"9\":\"Lin\"}",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-04"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-column.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0068",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Operators & expressions",
    "subtopic": "single-bit-membership-mask",
    "objective": {
      "id": "single-bit-membership-mask",
      "text": "Test whether a specific permission bit is present in a combined mask."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Distinguish bitwise membership from equality and boolean truthiness."
    },
    "prerequisites": [
      "Bitwise AND and OR",
      "Boolean comparisons"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nconst READ = 1;\nconst WRITE = 2;\n\nfunction hasRead(int $mask): bool\n{\n    return $mask === READ;\n}\n\necho json_encode(array_map('hasRead', [0, READ, WRITE, READ | WRITE]));\n"
        }
      ]
    },
    "stem": "READ is bit 1 and WRITE is bit 2. hasRead must return true for masks 1 and 3, but false for 0 and 2. Which return expression implements that rule?",
    "options": [
      {
        "id": "contains",
        "text": "($mask & READ) === READ",
        "rationale": "AND retains the READ bit only when it is present.",
        "misconception": null
      },
      {
        "id": "equals",
        "text": "$mask === READ",
        "rationale": "This rejects a mask that includes both READ and WRITE.",
        "misconception": "Assuming the permission mask contains only one flag."
      },
      {
        "id": "boolean",
        "text": "$mask && READ",
        "rationale": "Any nonzero mask is truthy, including WRITE alone.",
        "misconception": "Using boolean AND instead of bitwise membership."
      },
      {
        "id": "or",
        "text": "($mask | READ) === READ",
        "rationale": "This is also true for mask 0 and false for the combined mask.",
        "misconception": "Using bit addition to test whether a bit was already present."
      }
    ],
    "correctOptionId": "contains",
    "explanation": {
      "summary": "Bitwise AND with READ isolates that bit. Comparing the result to READ accepts both a read-only mask and a mask with additional permissions.",
      "trace": "The four masks yield false, true, false and true respectively."
    },
    "validation": {
      "kind": "patch",
      "marker": "$mask === READ",
      "stdout": "[false,true,false,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0069",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "HTTP & superglobals",
    "subtopic": "query-digit-string-shape-validation",
    "objective": {
      "id": "query-digit-string-shape-validation",
      "text": "Validate a query parameter’s scalar shape and ASCII digit-only content without rejecting leading zeros."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Combine superglobal input shape with a precise lexical policy."
    },
    "prerequisites": [
      "ASCII digit strings",
      "Lexical validation",
      "Empty strings"
    ],
    "runtime": {
      "php": [
        "8.4",
        "8.5"
      ],
      "sapi": "CLI unless the stated context specifies otherwise",
      "extensions": [
        "ctype"
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
          "source": "<?php\n\nfunction validToken(mixed $input): bool\n{\n    return is_numeric($input);\n}\n\n$cases = ['0', '007', '-2', '1e3', '', ['7'], \"7\\n\"];\n\necho json_encode(array_map('validToken', $cases));\n"
        }
      ]
    },
    "stem": "The token must be a nonempty string of ASCII decimal digits. Leading zeros are valid; signs, exponents and array-shaped query values are not. Which predicate implements this policy for the displayed cases?",
    "options": [
      {
        "id": "numeric-string",
        "text": "is_string($input) && is_numeric($input)",
        "rationale": "is_numeric accepts signs and exponent notation.",
        "misconception": "Equating numeric syntax with a digit-only token grammar."
      },
      {
        "id": "integer-filter",
        "text": "is_string($input) && filter_var($input, FILTER_VALIDATE_INT) !== false",
        "rationale": "Integer validation rejects the accepted token 007 under its default rules.",
        "misconception": "Treating a lexical identifier as a canonical integer representation."
      },
      {
        "id": "digits",
        "text": "is_string($input) && ctype_digit($input)",
        "rationale": "The shape check rejects arrays; ctype_digit requires a nonempty all-digit string.",
        "misconception": null
      },
      {
        "id": "word",
        "text": "is_string($input) && preg_match(\"/^[0-9]+$/\", $input) === 1",
        "rationale": "Dollar permits a final newline, so this is broader than the stated all-byte digit policy.",
        "misconception": "Assuming the regex dollar anchor always means the absolute end of the string."
      }
    ],
    "correctOptionId": "digits",
    "explanation": {
      "summary": "The input is a token, not a number to coerce. A string shape check followed by ctype_digit implements its byte-level digit grammar and preserves leading zeros.",
      "trace": "0 and 007 pass. Negative, exponent, empty, array-shaped and newline-terminated values fail."
    },
    "validation": {
      "kind": "patch",
      "marker": "is_numeric($input)",
      "stdout": "[true,true,false,false,false,false,false]",
      "candidates": {},
      "fixtureNote": "A trailing-newline case is included in the source to distinguish the regex anchor alternative.",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.php.net/manual/en/function.ctype-digit.php",
      "https://www.php.net/manual/en/reference.pcre.pattern.syntax.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0070",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "json-top-level-object-shape",
    "objective": {
      "id": "json-top-level-object-shape",
      "text": "Require a top-level JSON object without confusing empty objects with empty lists."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Preserve JSON object/list shape through decoding and validation."
    },
    "prerequisites": [
      "JSON decoding",
      "Objects versus arrays",
      "Runtime type checks"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction objectBody(string $raw): bool\n{\n    $decoded = json_decode($raw, false, 512, JSON_THROW_ON_ERROR);\n\n    return is_array($decoded);\n}\n\necho json_encode(array_map('objectBody', ['{}', '{\"id\":1}', '[]', '\"text\"']));\n"
        }
      ]
    },
    "stem": "The endpoint accepts any JSON object, including {}, but rejects arrays and scalar JSON values. Syntax errors are already handled by JSON_THROW_ON_ERROR. Replace the return predicate. Which choice preserves that object-only policy?",
    "options": [
      {
        "id": "truthy",
        "text": "(bool) $decoded",
        "rationale": "An empty array is false, but a nonempty scalar string is true; truthiness is not object shape.",
        "misconception": "Using truthiness as structural validation."
      },
      {
        "id": "object",
        "text": "$decoded instanceof stdClass",
        "rationale": "Default object decoding produces stdClass for both empty and populated JSON objects.",
        "misconception": null
      },
      {
        "id": "valid-json",
        "text": "json_validate($raw)",
        "rationale": "All four inputs are valid JSON, including the rejected list and scalar.",
        "misconception": "Confusing syntax validity with schema validity."
      },
      {
        "id": "array",
        "text": "is_array(json_decode($raw, true, 512, JSON_THROW_ON_ERROR))",
        "rationale": "Associative decoding turns both JSON objects and arrays into PHP arrays.",
        "misconception": "Discarding the distinction before validating it."
      }
    ],
    "correctOptionId": "object",
    "explanation": {
      "summary": "Decode objects as objects when their distinction from arrays matters. The top-level stdClass check accepts JSON objects without accepting lists or scalars.",
      "trace": "Both object inputs become stdClass. The list becomes a PHP array and the string remains a PHP string."
    },
    "validation": {
      "kind": "patch",
      "marker": "is_array($decoded)",
      "stdout": "[true,true,false,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0071",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "exclusive-file-create-mode",
    "objective": {
      "id": "exclusive-file-create-mode",
      "text": "Choose an open mode that creates a new file while refusing an existing path."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish atomic create-if-absent semantics from truncation, append and nontruncating opens."
    },
    "prerequisites": [
      "File modes",
      "Error handlers",
      "Exceptions"
    ],
    "runtime": {
      "php": [
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
        "The temporary directory is writable; both open attempts target regular local files. The explicit error handler converts fopen warnings to ErrorException."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nset_error_handler(function (int $severity, string $message): never {\n    throw new ErrorException($message, 0, $severity);\n});\n\nfunction create(string $path): bool\n{\n    try {\n        $handle = fopen($path, 'c');\n        fwrite($handle, 'new');\n        fclose($handle);\n\n        return true;\n    } catch (ErrorException $error) {\n        return false;\n    }\n}\n\nfile_put_contents(__DIR__ . '/existing.txt', 'old');\n\n$result = [\n    create(__DIR__ . '/fresh.txt'),\n    create(__DIR__ . '/existing.txt'),\n    file_get_contents(__DIR__ . '/existing.txt'),\n];\n\nrestore_error_handler();\n\necho json_encode($result);\n"
        }
      ]
    },
    "stem": "create must open a missing path for writing and refuse an existing path without altering it. Which mode string should replace c?",
    "options": [
      {
        "id": "write",
        "text": "'w'",
        "rationale": "w opens existing files and truncates them.",
        "misconception": "Treating write mode as exclusive creation."
      },
      {
        "id": "append",
        "text": "'a'",
        "rationale": "a opens existing files and appends new bytes.",
        "misconception": "Assuming append protects an existing path by rejecting it."
      },
      {
        "id": "create",
        "text": "'c'",
        "rationale": "c avoids initial truncation but still opens and permits overwriting an existing file.",
        "misconception": "Confusing nontruncation with create-if-absent."
      },
      {
        "id": "exclusive",
        "text": "'x'",
        "rationale": "x creates a new file and fails if the path already exists.",
        "misconception": null
      }
    ],
    "correctOptionId": "exclusive",
    "explanation": {
      "summary": "The x mode requests exclusive creation. Checking existence separately before a normal open would also leave a race; the mode expresses the create-if-absent operation itself.",
      "trace": "fresh.txt is created. Opening existing.txt warns and is converted to the handled exception, leaving old intact."
    },
    "validation": {
      "kind": "patch",
      "marker": "'c'",
      "stdout": "[true,false,\"old\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0072",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Files & structured data",
    "subtopic": "partial-write-offset-accounting",
    "objective": {
      "id": "partial-write-offset-accounting",
      "text": "Advance a write-all loop by the number of bytes actually accepted."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Track offsets across successful short writes instead of assuming the requested length was written."
    },
    "prerequisites": [
      "fwrite return contract",
      "Byte offsets",
      "Loops"
    ],
    "runtime": {
      "php": [
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
        "writeChunk is a deterministic stand-in for a writer that accepts only some requested bytes. It returns the accepted byte count. The existing guard handles false or zero."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\n$sink = '';\n$quotas = [3, 2, 3];\n\n$writeChunk = function (string $chunk) use (&$sink, &$quotas): int {\n    $count = min(array_shift($quotas) ?? 0, strlen($chunk));\n    $sink .= substr($chunk, 0, $count);\n\n    return $count;\n};\n\n$payload = 'ABCDEFGH';\n$offset = 0;\n\nwhile ($offset < strlen($payload)) {\n    $remaining = substr($payload, $offset);\n    $written = $writeChunk($remaining);\n\n    if ($written === false || $written === 0) {\n        break;\n    }\n\n    $offset += strlen($remaining);\n}\n\necho $sink;\n"
        }
      ]
    },
    "stem": "The loop must deliver every byte exactly once despite short writes. Which replacement for the offset update makes the sink equal ABCDEFGH?",
    "options": [
      {
        "id": "actual",
        "text": "$offset += $written;",
        "rationale": "The accepted-byte count identifies exactly where the next unwritten suffix begins.",
        "misconception": null
      },
      {
        "id": "requested",
        "text": "$offset += strlen($remaining);",
        "rationale": "This skips bytes that were requested but not accepted by the short write.",
        "misconception": "Assuming a successful call writes its entire argument."
      },
      {
        "id": "reset",
        "text": "$offset = $written;",
        "rationale": "This resets the total offset to the latest chunk size, causing repeated earlier bytes.",
        "misconception": "Confusing per-call progress with cumulative progress."
      },
      {
        "id": "difference",
        "text": "$offset += strlen($remaining) - $written;",
        "rationale": "This advances by the unwritten count rather than the written count.",
        "misconception": "Reversing the accepted and remaining portions."
      }
    ],
    "correctOptionId": "actual",
    "explanation": {
      "summary": "A successful write can consume fewer bytes than requested. The next call must begin after exactly those consumed bytes, so the cumulative offset increases by written.",
      "trace": "The writer accepts ABC, then DE, then FGH. Offsets advance 0→3→5→8."
    },
    "validation": {
      "kind": "patch",
      "marker": "$offset += strlen($remaining);",
      "stdout": "ABCDEFGH",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.fwrite.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0073",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Closures, callbacks & callables",
    "subtopic": "deferred-closure-iteration-snapshot",
    "objective": {
      "id": "deferred-closure-iteration-snapshot",
      "text": "Capture each loop value for deferred callbacks without following the reused loop variable."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate callback construction time from invocation time and choose the intended capture semantics."
    },
    "prerequisites": [
      "Arrow functions",
      "Closure capture",
      "Loop variables"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$jobs = [];\n\nforeach ([1, 2] as $id) {\n    $jobs[] = function () use (&$id) {\n        return $id;\n    };\n}\n\necho json_encode(array_map(fn ($job) => $job(), $jobs));\n"
        }
      ]
    },
    "stem": "Each deferred callback must remember its own iteration’s id. Replace the callback expression so later invocation returns [1,2]. Which choice does that?",
    "options": [
      {
        "id": "global",
        "text": "fn () => $GLOBALS['id']",
        "rationale": "Both callbacks read the same top-level loop variable after it has become 2.",
        "misconception": "Using a global lookup instead of capturing an iteration snapshot."
      },
      {
        "id": "parameter",
        "text": "fn ($id = 0) => $id",
        "rationale": "No argument is supplied when the jobs run, so both return the default zero.",
        "misconception": "Assuming a callback parameter automatically binds to an outer variable of the same name."
      },
      {
        "id": "arrow",
        "text": "fn () => $id",
        "rationale": "Each arrow function captures the current id value when it is created.",
        "misconception": null
      },
      {
        "id": "reference",
        "text": "static function () use (&$id) {\n    return $id;\n}",
        "rationale": "static removes implicit this binding; it does not change the explicit reference capture.",
        "misconception": "Assuming static freezes all captured variables."
      }
    ],
    "correctOptionId": "arrow",
    "explanation": {
      "summary": "Arrow functions capture outer variables by value. A by-reference capture instead follows the reused loop variable until the callbacks are invoked.",
      "trace": "The first arrow captures 1 and the second captures 2. Later calls read those two snapshots."
    },
    "validation": {
      "kind": "patch",
      "marker": "function () use (&$id) {\n        return $id;\n    }",
      "stdout": "[1,2]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/functions.arrow.php",
      "https://www.php.net/manual/en/functions.anonymous.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0074",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Iterators, generators & fibers",
    "subtopic": "recursive-generator-delegation",
    "objective": {
      "id": "recursive-generator-delegation",
      "text": "Delegate nested generator values while continuing traversal of later siblings."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish yielding a generator object, returning it and forwarding its yielded values."
    },
    "prerequisites": [
      "Recursion",
      "Generators",
      "yield from"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction walk(array $items): Generator\n{\n    foreach ($items as $item) {\n        if (is_array($item)) {\n            walk($item);\n        } else {\n            yield $item;\n        }\n    }\n}\n\necho json_encode(iterator_to_array(walk([1, [2], 3]), false));\n"
        }
      ]
    },
    "stem": "walk must produce a flat stream of integers from this nested list, in order. Which statement should replace the marked recursive call?",
    "options": [
      {
        "id": "yield-object",
        "text": "yield walk($item);",
        "rationale": "This yields the Generator object itself rather than its integer values.",
        "misconception": "Confusing yielding an iterable with iterating and yielding its contents."
      },
      {
        "id": "delegate",
        "text": "yield from walk($item);",
        "rationale": "Delegation forwards the nested values and then resumes the outer loop.",
        "misconception": null
      },
      {
        "id": "return",
        "text": "return walk($item);",
        "rationale": "This ends the outer generator at the nested item and puts the Generator object on the return channel.",
        "misconception": "Using return where recursive yielded values must be forwarded."
      },
      {
        "id": "call",
        "text": "walk($item);",
        "rationale": "Creating the nested generator without iterating it yields no nested values.",
        "misconception": "Assuming a generator executes fully when its function is called."
      }
    ],
    "correctOptionId": "delegate",
    "explanation": {
      "summary": "yield from iterates the delegated generator and forwards its values. After it finishes, execution continues with the next outer item.",
      "trace": "The outer generator yields 1, delegates the inner 2, then continues to yield 3."
    },
    "validation": {
      "kind": "patch",
      "marker": "walk($item);",
      "stdout": "[1,2,3]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0075",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Closures, callbacks & callables",
    "subtopic": "normalize-callable-to-closure-property",
    "objective": {
      "id": "normalize-callable-to-closure-property",
      "text": "Store an accepted callable in a Closure-typed property without narrowing the public constructor contract."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a callable representation from a Closure object and choose the conversion API."
    },
    "prerequisites": [
      "callable",
      "Closure",
      "Typed properties"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Formatter\n{\n    private Closure $format;\n\n    public function __construct(callable $format)\n    {\n        $this->format = $format;\n    }\n\n    public function apply(string $value): string\n    {\n        return ($this->format)($value);\n    }\n}\n\necho (new Formatter('strtoupper'))->apply('php');\n"
        }
      ]
    },
    "stem": "Formatter accepts any valid callable, including a function-name string, but stores a Closure internally. Which expression should replace $format in the property assignment?",
    "options": [
      {
        "id": "direct",
        "text": "$format",
        "rationale": "A valid callable string is not a Closure instance and cannot be assigned to this property.",
        "misconception": "Equating the callable pseudo-type with the Closure class."
      },
      {
        "id": "construct",
        "text": "new Closure($format)",
        "rationale": "Closure cannot be instantiated directly through its private constructor.",
        "misconception": "Assuming every object type has a public conversion constructor."
      },
      {
        "id": "bind",
        "text": "Closure::bind($format, null)",
        "rationale": "Closure::bind expects an existing Closure as its first argument, not a function-name string.",
        "misconception": "Confusing rebinding a Closure with converting a callable."
      },
      {
        "id": "convert",
        "text": "Closure::fromCallable($format)",
        "rationale": "fromCallable creates a Closure from an accessible valid callable representation.",
        "misconception": null
      }
    ],
    "correctOptionId": "convert",
    "explanation": {
      "summary": "callable includes strings, arrays, invokable objects and Closures. Closure::fromCallable normalizes those accepted forms to the concrete property type.",
      "trace": "The string strtoupper becomes a Closure; invoking the stored Closure with php returns PHP."
    },
    "validation": {
      "kind": "patch",
      "marker": "$this->format = $format;",
      "candidates": {
        "direct": "$this->format = $format;",
        "construct": "$this->format = new Closure($format);",
        "bind": "$this->format = Closure::bind($format, null);",
        "convert": "$this->format = Closure::fromCallable($format);"
      },
      "stdout": "PHP",
      "errors": {
        "direct": "TypeError",
        "construct": "Instantiation of class Closure is not allowed",
        "bind": "TypeError"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-08"
    },
    "references": [
      "https://www.php.net/manual/en/closure.fromcallable.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0076",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "psr4-prefix-removal-case-sensitive-path",
    "objective": {
      "id": "psr4-prefix-removal-case-sensitive-path",
      "text": "Resolve a PSR-4 class path after removing the configured namespace prefix."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Apply one stated namespace-prefix mapping and preserve case in the resulting path."
    },
    "prerequisites": [
      "Namespaces",
      "Composer PSR-4 (unmapped curriculum)",
      "Case-sensitive filesystems"
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
        "Composer maps the exact namespace prefix Acme\\ to src/. The class is Acme\\Billing\\Invoice. The filesystem is case-sensitive; no classmap or fallback autoloader is configured."
      ],
      "files": []
    },
    "stem": "Which file location satisfies this PSR-4 mapping for Acme\\Billing\\Invoice?",
    "options": [
      {
        "id": "full-prefix",
        "text": "src/Acme/Billing/Invoice.php",
        "rationale": "The configured Acme prefix is removed before mapping the remaining namespace segments.",
        "misconception": "Retaining the prefix as an extra directory beneath its base path."
      },
      {
        "id": "lower-directory",
        "text": "src/billing/Invoice.php",
        "rationale": "The Billing namespace segment must match the directory’s case under the stated rules.",
        "misconception": "Assuming PHP class-name case tolerance also makes PSR-4 paths case-insensitive."
      },
      {
        "id": "mapped",
        "text": "src/Billing/Invoice.php",
        "rationale": "After removing Acme, Billing maps to a directory and Invoice maps to Invoice.php.",
        "misconception": null
      },
      {
        "id": "lower-class",
        "text": "src/Billing/invoice.php",
        "rationale": "The class-name filename must match Invoice’s case.",
        "misconception": "Lowercasing a class filename during namespace-to-path conversion."
      }
    ],
    "correctOptionId": "mapped",
    "explanation": {
      "summary": "PSR-4 maps the namespace portion after the registered prefix beneath its base directory, preserving namespace and class-name case in the path.",
      "trace": "Acme\\ is replaced by src/. Billing becomes Billing/, and Invoice becomes Invoice.php."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PSR-4 section 2.3: namespace prefix maps to base directory; subnamespace and class filename match case.",
      "optionAudit": {
        "full-prefix": "Adds a directory already accounted for by the prefix mapping",
        "lower-directory": "Violates subnamespace case",
        "mapped": "Matches the prefix and both case-sensitive segments",
        "lower-class": "Violates class filename case"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://www.php-fig.org/psr/psr-4/",
      "https://getcomposer.org/doc/04-schema.md#psr-4"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0077",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Classes & object lifecycle",
    "subtopic": "memoized-cyclic-object-clone",
    "objective": {
      "id": "memoized-cyclic-object-clone",
      "text": "Memoize a clone before following cyclic object edges while preserving graph identity."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Coordinate object identity, memo lookup and recursive graph traversal without infinite recursion."
    },
    "prerequisites": [
      "Object cloning",
      "SplObjectStorage (advanced)",
      "Recursion with cycles"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Node\n{\n    public ?Node $next = null;\n}\n\nfunction copyNode(Node $node, SplObjectStorage $memo, int $depth = 0): Node\n{\n    if ($memo->offsetExists($node)) {\n        return $memo[$node];\n    }\n\n    if ($depth > 5) {\n        throw new RuntimeException('depth limit');\n    }\n\n    $copy = clone $node;\n    $memo[$node] = clone $node;\n    $copy->next = $node->next === null\n        ? null\n        : copyNode($node->next, $memo, $depth + 1);\n\n    return $copy;\n}\n\n$original = new Node();\n$original->next = $original;\n\ntry {\n    $copy = copyNode($original, new SplObjectStorage());\n    echo json_encode([$copy !== $original, $copy->next === $copy]);\n} catch (RuntimeException $error) {\n    echo 'depth limit';\n}\n"
        }
      ]
    },
    "stem": "copyNode must return a new node whose self-loop points to the new node, never the original. The depth guard is a test safety limit. Which memo assignment makes the copied graph satisfy both identity checks?",
    "options": [
      {
        "id": "memo-copy",
        "text": "$memo[$copy] = $copy;",
        "rationale": "Recursive lookup uses the original node as key, so caching under the clone never breaks the original cycle.",
        "misconception": "Using destination identity as the memo lookup key."
      },
      {
        "id": "memo-original",
        "text": "$memo[$node] = $node;",
        "rationale": "The recursive edge resolves back to the original node rather than the new copy.",
        "misconception": "Using memoization merely to stop recursion without preserving copied identity."
      },
      {
        "id": "memo-extra-clone",
        "text": "$memo[$node] = clone $copy;",
        "rationale": "The edge resolves to a different clone from the one returned at the root.",
        "misconception": "Creating a second copy instead of registering the copy under construction."
      },
      {
        "id": "memo-current",
        "text": "$memo[$node] = $copy;",
        "rationale": "Registering the current clone under the original identity lets the recursive edge resolve to this exact copy.",
        "misconception": null
      }
    ],
    "correctOptionId": "memo-current",
    "explanation": {
      "summary": "Graph cloning needs a mapping from each original object to the single destination object under construction. Register it before traversing outgoing edges so cycles and aliases resolve consistently.",
      "trace": "The original maps to copy. Recursing along the self-loop finds that memo entry and returns copy itself."
    },
    "validation": {
      "kind": "patch",
      "marker": "$memo[$node] = clone $node;",
      "stdout": "[true,true]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/class.splobjectstorage.php",
      "https://www.php.net/manual/en/language.oop5.cloning.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0078",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Validation & web security",
    "subtopic": "unambiguous-binary-field-signing-frame",
    "objective": {
      "id": "unambiguous-binary-field-signing-frame",
      "text": "Encode two ordered byte-string fields unambiguously before computing a message authentication code."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Reject ambiguous concatenation, delimiter collision and order erasure in a signing protocol."
    },
    "prerequisites": [
      "MAC input framing (advanced)",
      "Binary strings",
      "Field boundaries and ordering"
    ],
    "runtime": {
      "php": [
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
        "Each input is an arbitrary byte string shorter than 2^32 bytes. Field order matters. The chosen encoding will be authenticated with HMAC afterward; this question tests the encoding, not hash collision resistance."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction frame(string $first, string $second): string\n{\n    return $first . $second;\n}\n\n$pairs = [\n    [['ab', 'c'], ['a', 'bc']],\n    [[\"a\\nb\", 'c'], ['a', \"b\\nc\"]],\n    [['x', 'y'], ['y', 'x']],\n    [[\"\\xFF\", 'x'], [\"\\xFE\", 'x']],\n];\n\n$collisions = [];\n\nforeach ($pairs as [$left, $right]) {\n    $collisions[] = frame(...$left) === frame(...$right);\n}\n\necho json_encode($collisions);\n"
        }
      ]
    },
    "stem": "Different ordered field pairs must never produce the same encoded bytes. Which return expression gives an unambiguous framing for these bounded fields?",
    "options": [
      {
        "id": "lengths",
        "text": "pack('N', strlen($first)) . $first . pack('N', strlen($second)) . $second",
        "rationale": "Fixed-width byte lengths identify each boundary, and the original field order is retained.",
        "misconception": null
      },
      {
        "id": "json-substitute",
        "text": "json_encode([$first, $second], JSON_INVALID_UTF8_SUBSTITUTE | JSON_THROW_ON_ERROR)",
        "rationale": "Distinct invalid UTF-8 bytes can both become U+FFFD, so this loses byte identity.",
        "misconception": "Assuming JSON with UTF-8 substitution preserves arbitrary binary fields."
      },
      {
        "id": "newline",
        "text": "$first . \"\\n\" . $second",
        "rationale": "A newline within a field can collide with the separator, as the second pair demonstrates.",
        "misconception": "Using a delimiter without escaping or restricting field contents."
      },
      {
        "id": "sorted",
        "text": "min($first, $second) . ':' . max($first, $second)",
        "rationale": "Sorting erases the required field order; x/y and y/x collide.",
        "misconception": "Confusing canonical ordering of an unordered set with encoding an ordered tuple."
      }
    ],
    "correctOptionId": "lengths",
    "explanation": {
      "summary": "An unambiguous MAC input must preserve field boundaries and order. A fixed-width length prefix followed by that many bytes provides a unique parse for each bounded field.",
      "trace": "The witnesses include ambiguous raw boundaries, embedded delimiters, reversed fields and distinct invalid UTF-8 bytes. The delimiter, sorting and substitution alternatives each lose a required distinction; binary length prefixes preserve all four pairs."
    },
    "validation": {
      "kind": "patch",
      "marker": "$first . $second",
      "stdout": "[false,false,false,false]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.pack.php",
      "https://www.php.net/manual/en/function.hash-hmac.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0079",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Transactions, migrations & ORM",
    "subtopic": "transactional-outbox-durable-intent",
    "objective": {
      "id": "transactional-outbox-durable-intent",
      "text": "Choose a PHP persistence workflow that atomically records business changes and a durable publication intent."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Account for crash windows across a database transaction and a separate message broker without a distributed transaction."
    },
    "prerequisites": [
      "PDO transactions",
      "Database/broker crash recovery (advanced)",
      "Idempotent consumers"
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
        "The PHP service uses one transactional database and a separate broker, with no distributed transaction. One database transaction can write multiple tables. An independent worker can read committed database records and retry broker operations. Consumers deduplicate repeated event IDs. Either the request process or worker can crash between operations."
      ],
      "files": []
    },
    "stem": "A committed order must eventually be notified to the broker after recovery, and an order that rolls back must never be notified. Which implementation preserves both requirements across a process crash?",
    "options": [
      {
        "id": "publish-before",
        "text": "Publish to the broker first, then begin and commit the order transaction.",
        "rationale": "A later database failure can leave a notification for an order that never committed.",
        "misconception": "Assuming broker success can be rolled back with an unrelated database transaction."
      },
      {
        "id": "commit-publish",
        "text": "Commit the order, then publish synchronously before returning the HTTP response.",
        "rationale": "A crash after commit but before publish loses the notification intent.",
        "misconception": "Treating request sequencing as durable atomic coordination."
      },
      {
        "id": "outbox",
        "text": "Write the order and outbox event in one transaction; let a retrying worker publish the event.",
        "rationale": "The committed outbox record durably retains the publication intent across process crashes.",
        "misconception": null
      },
      {
        "id": "shutdown",
        "text": "Commit the order and register a shutdown callback that publishes the event.",
        "rationale": "A callback in process memory is not durable and may not run after a crash.",
        "misconception": "Treating a shutdown hook as a persistent job queue."
      }
    ],
    "correctOptionId": "outbox",
    "explanation": {
      "summary": "The database transaction can make the order and publication intent atomic. The worker bridges to the broker with retries, while event IDs and consumer deduplication handle duplicate delivery.",
      "trace": "Before commit, neither record is durable. After commit, both exist. A crash before or after publishing leaves enough durable state for retry; duplicate publication is within the stated contract."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Atomic order/outbox commit closes the lost-intent crash window; broker publication remains at least once, not exactly once.",
      "optionAudit": {
        "publish-before": "Can publish an event for rolled-back work",
        "commit-publish": "Crash gap after commit loses intent",
        "outbox": "Durable same-transaction intent plus retry meets the stated contract",
        "shutdown": "Process-memory callback is not crash-durable"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-16"
    },
    "references": [
      "https://www.php.net/manual/en/pdo.transactions.php",
      "https://microservices.io/patterns/data/transactional-outbox.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0080",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "implementation",
    "topic": "Iterators, generators & fibers",
    "subtopic": "fiber-cancellation-exception-injection",
    "objective": {
      "id": "fiber-cancellation-exception-injection",
      "text": "Cancel a suspended Fiber through its exception path while allowing its finally cleanup to execute."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Distinguish resuming with a value, throwing in the caller and injecting a throwable at the suspension point."
    },
    "prerequisites": [
      "Fibers (advanced)",
      "Exception injection",
      "finally"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$trace = [];\n$worker = new Fiber(function () use (&$trace): void {\n    try {\n        Fiber::suspend('ready');\n        $trace[] = 'completed';\n    } catch (DomainException $error) {\n        $trace[] = 'cancelled';\n    } finally {\n        $trace[] = 'released';\n    }\n});\n\n$worker->start();\n\ntry {\n    $worker->resume(null);\n} catch (DomainException $error) {\n    $trace[] = 'outside';\n}\n\necho json_encode($trace);\n"
        }
      ]
    },
    "stem": "The suspended worker handles DomainException as cancellation and records cleanup in finally. Which driver statement produces exactly [\"cancelled\",\"released\"] before the final echo?",
    "options": [
      {
        "id": "resume-error",
        "text": "$worker->resume(new DomainException('cancel'));",
        "rationale": "resume supplies a normal value as the return of suspend; it does not throw that value.",
        "misconception": "Assuming passing an exception object automatically throws it."
      },
      {
        "id": "inject",
        "text": "$worker->throw(new DomainException('cancel'));",
        "rationale": "Fiber::throw throws at the suspension point, reaching the worker’s catch and finally.",
        "misconception": null
      },
      {
        "id": "outer-throw",
        "text": "throw new DomainException('cancel');",
        "rationale": "This throws in the driver, so the outer catch runs while the worker remains suspended.",
        "misconception": "Assuming a caller’s exception is automatically delivered to its suspended Fiber."
      },
      {
        "id": "null-resume",
        "text": "$worker->resume(null);",
        "rationale": "The worker resumes normally and records completed before cleanup.",
        "misconception": "Treating null as an implicit cancellation signal."
      }
    ],
    "correctOptionId": "inject",
    "explanation": {
      "summary": "Fiber::throw resumes a suspended Fiber by throwing inside it at the suspension point. resume merely sends a value, and a caller-side throw remains on the caller’s stack.",
      "trace": "The injected DomainException reaches the worker’s catch, which records cancelled. Its finally then records released."
    },
    "validation": {
      "kind": "patch",
      "marker": "$worker->resume(null);",
      "stdout": "[\"cancelled\",\"released\"]",
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/fiber.throw.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0081",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "filtered-list-json-shape-regression",
    "objective": {
      "id": "filtered-list-json-shape-regression",
      "text": "Choose a test that exposes loss of JSON list shape after filtering preserves numeric keys."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Relate removal position to PHP array keys and JSON array/object encoding."
    },
    "prerequisites": [
      "array_filter",
      "JSON list encoding",
      "Regression tests"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction encodePositive(array $values): string\n{\n    $positive = array_filter($values, fn ($value) => $value > 0);\n\n    return json_encode($positive);\n}\n"
        }
      ]
    },
    "stem": "encodePositive must return a JSON array containing the positive values in order. Which test fails for this implementation by comparing the returned JSON?",
    "options": [
      {
        "id": "all-kept",
        "text": "encodePositive([1, 2]) should equal [1,2].",
        "rationale": "No key is removed, so the array remains a list and the test passes.",
        "misconception": "Testing only the path that preserves the original key sequence."
      },
      {
        "id": "first-removed",
        "text": "encodePositive([-1, 2]) should equal [2].",
        "rationale": "The surviving key is 1, so the current implementation encodes an object instead of the required list.",
        "misconception": null
      },
      {
        "id": "last-removed",
        "text": "encodePositive([1, -2]) should equal [1].",
        "rationale": "The surviving key is 0, which is still a valid one-element list.",
        "misconception": "Assuming every removal creates a key gap."
      },
      {
        "id": "all-removed",
        "text": "encodePositive([-1, -2]) should equal [].",
        "rationale": "An empty PHP array encodes as an empty JSON array, so this case passes.",
        "misconception": "Assuming an empty filtered array necessarily encodes as an object."
      }
    ],
    "correctOptionId": "first-removed",
    "explanation": {
      "summary": "Filtering preserves keys. A leading removal leaves a nonzero starting key, exposing the distinction between a PHP array and a sequential list.",
      "trace": "The failing result is {\"1\":2}. Reindexing with array_values before encoding produces [2]."
    },
    "validation": {
      "kind": "tests",
      "marker": "json_encode($positive)",
      "repair": "json_encode(array_values($positive))",
      "cases": [
        {
          "option": "all-kept",
          "probe": "echo encodePositive([1, 2]);",
          "expected": "[1,2]"
        },
        {
          "option": "first-removed",
          "probe": "echo encodePositive([-1, 2]);",
          "expected": "[2]"
        },
        {
          "option": "last-removed",
          "probe": "echo encodePositive([1, -2]);",
          "expected": "[1]"
        },
        {
          "option": "all-removed",
          "probe": "echo encodePositive([-1, -2]);",
          "expected": "[]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-filter.php",
      "https://www.php.net/manual/en/function.json-encode.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0082",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "secondary-sort-regression-fixture",
    "objective": {
      "id": "secondary-sort-regression-fixture",
      "text": "Select a fixture that verifies the secondary ordering requirement of a comparator."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish primary-key ordering from tie-breaking while accounting for stable equal comparisons."
    },
    "prerequisites": [
      "usort",
      "Stable sorting",
      "Comparator tie-breakers"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction ordered(array $rows): array\n{\n    usort($rows, function (array $left, array $right): int {\n        return $left[0] <=> $right[0];\n    });\n\n    return $rows;\n}\n"
        }
      ]
    },
    "stem": "Rows must sort by ascending score, then ascending ASCII name. Which test fails against the implementation? Each row below is written as [score, name].",
    "options": [
      {
        "id": "distinct-desc",
        "text": "[[2,\"B\"],[1,\"A\"]] should become [[1,\"A\"],[2,\"B\"]].",
        "rationale": "Different scores are correctly ordered by the existing comparator.",
        "misconception": "Testing only the primary ordering key."
      },
      {
        "id": "tie-ordered",
        "text": "[[1,\"A\"],[1,\"B\"]] should remain in that order.",
        "rationale": "Equal-score rows retain their existing order, which already satisfies the name rule.",
        "misconception": "Using a tie fixture that masks the missing secondary comparison."
      },
      {
        "id": "opposite-names",
        "text": "[[1,\"Z\"],[2,\"A\"]] should remain in that order.",
        "rationale": "Score takes priority, so the existing result is correct despite the name order.",
        "misconception": "Expecting the secondary key to override distinct primary values."
      },
      {
        "id": "tie-reversed",
        "text": "[[1,\"B\"],[1,\"A\"]] should become [[1,\"A\"],[1,\"B\"]].",
        "rationale": "The comparator returns zero and preserves the wrong B/A order, exposing the missing tie-breaker.",
        "misconception": null
      }
    ],
    "correctOptionId": "tie-reversed",
    "explanation": {
      "summary": "To test a secondary sort key, use equal primary keys in an order that contradicts the secondary requirement. Already ordered ties cannot expose the defect.",
      "trace": "The corrected comparator uses the score comparison first and strcmp on names only when scores tie."
    },
    "validation": {
      "kind": "tests",
      "marker": "return $left[0] <=> $right[0];",
      "repair": "return ($left[0] <=> $right[0]) ?: strcmp($left[1], $right[1]);",
      "cases": [
        {
          "option": "distinct-desc",
          "probe": "echo json_encode(ordered([[2,\"B\"],[1,\"A\"]]));",
          "expected": "[[1,\"A\"],[2,\"B\"]]"
        },
        {
          "option": "tie-ordered",
          "probe": "echo json_encode(ordered([[1,\"A\"],[1,\"B\"]]));",
          "expected": "[[1,\"A\"],[1,\"B\"]]"
        },
        {
          "option": "opposite-names",
          "probe": "echo json_encode(ordered([[1,\"Z\"],[2,\"A\"]]));",
          "expected": "[[1,\"Z\"],[2,\"A\"]]"
        },
        {
          "option": "tie-reversed",
          "probe": "echo json_encode(ordered([[1,\"B\"],[1,\"A\"]]));",
          "expected": "[[1,\"A\"],[1,\"B\"]]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.php.net/manual/en/function.usort.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0083",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "memoized-null-negative-cache-test",
    "objective": {
      "id": "memoized-null-negative-cache-test",
      "text": "Select a test that distinguishes cached null from a missing cache entry."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Observe collaborator call counts as well as returned values for repeated misses."
    },
    "prerequisites": [
      "Closures",
      "isset versus array_key_exists",
      "Test doubles"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction scenario(array $keys): int\n{\n    $calls = 0;\n    $load = function (string $key) use (&$calls): ?string {\n        $calls++;\n\n        return $key === 'present' ? 'ok' : null;\n    };\n    $cache = [];\n    $cached = function (string $key) use (&$cache, $load): ?string {\n        if (!isset($cache[$key])) {\n            $cache[$key] = $load($key);\n        }\n\n        return $cache[$key];\n    };\n\n    foreach ($keys as $key) {\n        $cached($key);\n    }\n\n    return $calls;\n}\n"
        }
      ]
    },
    "stem": "The loader returns null for missing keys and ok for present. cached must call it at most once per distinct key, including missing keys. Which test exposes the defect?",
    "options": [
      {
        "id": "same-miss",
        "text": "scenario([\"missing\", \"missing\"]) should return 1.",
        "rationale": "A stored null fails isset, so the second call reloads the same key and returns a call count of 2.",
        "misconception": null
      },
      {
        "id": "same-hit",
        "text": "scenario([\"present\", \"present\"]) should return 1.",
        "rationale": "The cached non-null value passes isset and avoids the second load.",
        "misconception": "Testing only positive cache entries."
      },
      {
        "id": "different-misses",
        "text": "scenario([\"one\", \"two\"]) should return 2.",
        "rationale": "Different keys require separate loads regardless of the null-cache defect.",
        "misconception": "Using distinct misses without checking reuse of one miss."
      },
      {
        "id": "single-miss",
        "text": "scenario([\"missing\"]) should return 1.",
        "rationale": "A first lookup always needs one load; there is no reuse to test.",
        "misconception": "Checking only the initial cache population."
      }
    ],
    "correctOptionId": "same-miss",
    "explanation": {
      "summary": "A null result can be a valid cache entry. isset cannot distinguish it from absence, so the regression test must repeat the same missing key and inspect loader calls.",
      "trace": "Replacing the guard with array_key_exists preserves the cached null and reduces the repeated-miss call count from 2 to 1."
    },
    "validation": {
      "kind": "tests",
      "marker": "!isset($cache[$key])",
      "repair": "!array_key_exists($key, $cache)",
      "cases": [
        {
          "option": "same-miss",
          "probe": "echo scenario([\"missing\", \"missing\"]);",
          "expected": "1"
        },
        {
          "option": "same-hit",
          "probe": "echo scenario([\"present\", \"present\"]);",
          "expected": "1"
        },
        {
          "option": "different-misses",
          "probe": "echo scenario([\"one\", \"two\"]);",
          "expected": "2"
        },
        {
          "option": "single-miss",
          "probe": "echo scenario([\"missing\"]);",
          "expected": "1"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.php.net/manual/en/function.array-key-exists.php",
      "https://www.php.net/manual/en/function.isset.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0084",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "utf8-prefix-character-count-test",
    "objective": {
      "id": "utf8-prefix-character-count-test",
      "text": "Choose a UTF-8 fixture that distinguishes byte-based slicing from a two-code-point prefix."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Count encoded bytes and code points without relying on display appearance alone."
    },
    "prerequisites": [
      "UTF-8",
      "substr versus mb_substr",
      "Hexadecimal bytes"
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
        "Run in a fresh PHP process using only the displayed files and inputs."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction prefix(string $text): string\n{\n    return substr($text, 0, 2);\n}\n"
        }
      ]
    },
    "stem": "prefix must return up to two Unicode code points from valid UTF-8. These examples contain no combining marks. Which test fails against the implementation? é is encoded as C3 A9.",
    "options": [
      {
        "id": "ascii",
        "text": "prefix(\"ABC\") should equal \"AB\".",
        "rationale": "ASCII code points each occupy one byte, so this passes both implementations.",
        "misconception": "Using only single-byte text to test Unicode slicing."
      },
      {
        "id": "one-multibyte",
        "text": "prefix(\"é\") should equal \"é\".",
        "rationale": "The complete one-code-point input is exactly two bytes, so it also passes.",
        "misconception": "Assuming every non-ASCII fixture distinguishes the implementations."
      },
      {
        "id": "mixed",
        "text": "prefix(\"éX\") should equal \"éX\".",
        "rationale": "The first two bytes contain only é; the required two-code-point prefix also includes X.",
        "misconception": null
      },
      {
        "id": "empty",
        "text": "prefix(\"\") should equal \"\".",
        "rationale": "Both implementations preserve empty input.",
        "misconception": "Testing the empty boundary without testing character-width behavior."
      }
    ],
    "correctOptionId": "mixed",
    "explanation": {
      "summary": "substr counts bytes. A two-code-point prefix can require more than two bytes, so the fixture must cross that byte/character boundary.",
      "trace": "The buggy prefix is C3 A9. mb_substr with UTF-8 returns C3 A9 58, retaining the second code point X."
    },
    "validation": {
      "kind": "tests",
      "marker": "substr($text, 0, 2)",
      "repair": "mb_substr($text, 0, 2, 'UTF-8')",
      "cases": [
        {
          "option": "ascii",
          "probe": "echo bin2hex(prefix(\"ABC\"));",
          "expected": "4142"
        },
        {
          "option": "one-multibyte",
          "probe": "echo bin2hex(prefix(\"é\"));",
          "expected": "c3a9"
        },
        {
          "option": "mixed",
          "probe": "echo bin2hex(prefix(\"éX\"));",
          "expected": "c3a958"
        },
        {
          "option": "empty",
          "probe": "echo bin2hex(prefix(\"\"));",
          "expected": ""
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.php.net/manual/en/function.substr.php",
      "https://www.php.net/manual/en/function.mb-substr.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0085",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Validation & web security",
    "subtopic": "canonical-path-directory-boundary-test",
    "objective": {
      "id": "canonical-path-directory-boundary-test",
      "text": "Test a canonical path’s directory boundary rather than only its textual prefix."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Construct a sibling path that shares the root’s character prefix but is outside its directory."
    },
    "prerequisites": [
      "Path containment",
      "str_starts_with",
      "Security regression tests"
    ],
    "runtime": {
      "php": [
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
        "Inputs are already canonical absolute POSIX file paths with no symlinks, dot segments or trailing slash. This pure string check is one stage of a larger access policy; it performs no filesystem operations."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction inside(string $candidate): bool\n{\n    $root = '/srv/files';\n\n    return str_starts_with($candidate, $root);\n}\n"
        }
      ]
    },
    "stem": "inside must accept only descendants of /srv/files/. Which test fails against the implementation?",
    "options": [
      {
        "id": "direct",
        "text": "inside(\"/srv/files/report.pdf\") should be true.",
        "rationale": "A direct descendant passes both the correct and flawed checks.",
        "misconception": "Testing only an authorized path."
      },
      {
        "id": "sibling",
        "text": "inside(\"/srv/files-backup/report.pdf\") should be false.",
        "rationale": "This sibling directory shares the textual prefix and is wrongly accepted.",
        "misconception": null
      },
      {
        "id": "other",
        "text": "inside(\"/srv/other/report.pdf\") should be false.",
        "rationale": "This path does not share the prefix, so the flawed check rejects it correctly.",
        "misconception": "Choosing an outside path that does not exercise the boundary defect."
      },
      {
        "id": "nested",
        "text": "inside(\"/srv/files/nested/report.pdf\") should be true.",
        "rationale": "Nested descendants are valid and pass either implementation.",
        "misconception": "Assuming deeper nesting alone exposes a prefix-boundary error."
      }
    ],
    "correctOptionId": "sibling",
    "explanation": {
      "summary": "A directory name is a path segment, not just a string prefix. Appending the separator to the canonical root prevents similarly named sibling directories from passing.",
      "trace": "The flawed check accepts /srv/files-backup. Requiring the prefix /srv/files/ rejects it while accepting both valid descendants."
    },
    "validation": {
      "kind": "tests",
      "marker": "str_starts_with($candidate, $root)",
      "repair": "str_starts_with($candidate, $root . '/')",
      "cases": [
        {
          "option": "direct",
          "probe": "echo json_encode(inside(\"/srv/files/report.pdf\"));",
          "expected": "true"
        },
        {
          "option": "sibling",
          "probe": "echo json_encode(inside(\"/srv/files-backup/report.pdf\"));",
          "expected": "false"
        },
        {
          "option": "other",
          "probe": "echo json_encode(inside(\"/srv/other/report.pdf\"));",
          "expected": "false"
        },
        {
          "option": "nested",
          "probe": "echo json_encode(inside(\"/srv/files/nested/report.pdf\"));",
          "expected": "true"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-14"
    },
    "references": [
      "https://www.php.net/manual/en/function.realpath.php",
      "https://www.php.net/manual/en/function.str-starts-with.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0086",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Testing, style & static analysis",
    "subtopic": "aggregate-reset-state-transition-test",
    "objective": {
      "id": "aggregate-reset-state-transition-test",
      "text": "Verify that resetting an accumulator clears all state needed for subsequent calculations."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Test reuse after a state transition rather than only fresh-object results."
    },
    "prerequisites": [
      "Object state",
      "Average calculation",
      "Stateful tests"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Average\n{\n    private int $sum = 0;\n    private int $count = 0;\n\n    public function add(int $value): void\n    {\n        $this->sum += $value;\n        $this->count++;\n    }\n\n    public function reset(): void\n    {\n        $this->sum = 0;\n    }\n\n    public function value(): ?float\n    {\n        return $this->count === 0 ? null : $this->sum / $this->count;\n    }\n}\n"
        }
      ]
    },
    "stem": "After reset, Average must behave like a fresh instance. Which test exposes the incomplete reset?",
    "options": [
      {
        "id": "fresh",
        "text": "A fresh instance should return null.",
        "rationale": "Both implementations start with count zero.",
        "misconception": "Testing construction instead of reset."
      },
      {
        "id": "one-add",
        "text": "Add 8 to a fresh instance; value should be 8.",
        "rationale": "No reset occurs, so sum and count agree.",
        "misconception": "Testing only normal accumulation."
      },
      {
        "id": "two-adds",
        "text": "Add 4 and 8 to a fresh instance; value should be 6.",
        "rationale": "The count is correctly incremented by add in both implementations.",
        "misconception": "Testing multiple inputs without exercising the reset transition."
      },
      {
        "id": "reuse",
        "text": "Add 8; reset; add 6; value should be 6.",
        "rationale": "The stale count becomes 2, so the buggy result is 3 rather than 6.",
        "misconception": null
      }
    ],
    "correctOptionId": "reuse",
    "explanation": {
      "summary": "Reset clears sum but leaves count behind. A reuse test must first create nonzero state, reset it, and then perform another calculation.",
      "trace": "The repaired reset also sets count to zero. The next add produces sum 6 and count 1, giving 6."
    },
    "validation": {
      "kind": "tests",
      "marker": "$this->sum = 0;",
      "repair": "$this->sum = 0;\n        $this->count = 0;",
      "cases": [
        {
          "option": "fresh",
          "probe": "$average = new Average(); echo json_encode($average->value());",
          "expected": "null"
        },
        {
          "option": "one-add",
          "probe": "$average = new Average(); $average->add(8); echo $average->value();",
          "expected": "8"
        },
        {
          "option": "two-adds",
          "probe": "$average = new Average(); $average->add(4); $average->add(8); echo $average->value();",
          "expected": "6"
        },
        {
          "option": "reuse",
          "probe": "$average = new Average(); $average->add(8); $average->reset(); $average->add(6); echo $average->value();",
          "expected": "6"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-23"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.properties.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0087",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "HTTP & superglobals",
    "subtopic": "head-representation-length-test",
    "objective": {
      "id": "head-representation-length-test",
      "text": "Verify that a HEAD response omits body bytes while retaining the corresponding GET representation length."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate transmitted content from representation metadata under an explicit response contract."
    },
    "prerequisites": [
      "HTTP GET and HEAD",
      "Content-Length",
      "Response tests"
    ],
    "runtime": {
      "php": [
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
        "The response representation is the supplied ASCII body, with no compression or transfer coding. The function’s contract requires Content-Length to equal the corresponding GET body length even for HEAD."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction response(string $method, string $body): array\n{\n    $sent = $method === 'HEAD' ? '' : $body;\n\n    return [strlen($sent), $sent];\n}\n"
        }
      ]
    },
    "stem": "Which test exposes the incorrect Content-Length computation?",
    "options": [
      {
        "id": "head-content",
        "text": "response(\"HEAD\", \"abc\") should return [3, \"\"].",
        "rationale": "The current function computes zero from the omitted body instead of the representation length.",
        "misconception": null
      },
      {
        "id": "get-content",
        "text": "response(\"GET\", \"abc\") should return [3, \"abc\"].",
        "rationale": "GET sends the same body whose length is measured, so this passes.",
        "misconception": "Testing only GET behavior."
      },
      {
        "id": "head-empty",
        "text": "response(\"HEAD\", \"\") should return [0, \"\"].",
        "rationale": "An empty representation has zero length either way, masking the error.",
        "misconception": "Choosing a HEAD fixture whose representation is already empty."
      },
      {
        "id": "get-empty",
        "text": "response(\"GET\", \"\") should return [0, \"\"].",
        "rationale": "Both implementations agree for an empty GET representation.",
        "misconception": "Testing an empty boundary without separating sent bytes from representation bytes."
      }
    ],
    "correctOptionId": "head-content",
    "explanation": {
      "summary": "A HEAD response has no body, but a Content-Length field, when supplied, describes the corresponding GET representation. Measure the representation before suppressing its transmission.",
      "trace": "Replacing strlen(sent) with strlen(body) retains length 3 while the transmitted body stays empty."
    },
    "validation": {
      "kind": "tests",
      "marker": "strlen($sent)",
      "repair": "strlen($body)",
      "cases": [
        {
          "option": "head-content",
          "probe": "echo json_encode(response(\"HEAD\", \"abc\"));",
          "expected": "[3,\"\"]"
        },
        {
          "option": "get-content",
          "probe": "echo json_encode(response(\"GET\", \"abc\"));",
          "expected": "[3,\"abc\"]"
        },
        {
          "option": "head-empty",
          "probe": "echo json_encode(response(\"HEAD\", \"\"));",
          "expected": "[0,\"\"]"
        },
        {
          "option": "get-empty",
          "probe": "echo json_encode(response(\"GET\", \"\"));",
          "expected": "[0,\"\"]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-11"
    },
    "references": [
      "https://www.rfc-editor.org/rfc/rfc9110.html#section-8.6",
      "https://www.rfc-editor.org/rfc/rfc9110.html#section-9.3.2"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0088",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Files & structured data",
    "subtopic": "pre-read-eof-empty-file-test",
    "objective": {
      "id": "pre-read-eof-empty-file-test",
      "text": "Choose a fixture that exposes processing a failed read as a real line."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish a pre-read EOF flag from the result of the next read, especially for an empty stream."
    },
    "prerequisites": [
      "fgets",
      "feof",
      "Stream tests"
    ],
    "runtime": {
      "php": [
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
        "The memory stream is seekable and every setup operation succeeds. The function should return one string per successfully read line, removing only CR and LF line endings."
      ],
      "files": [
        {
          "path": "main.php",
          "kind": "complete-file",
          "source": "<?php\n\nfunction readLines(string $contents): array\n{\n    $handle = fopen('php://memory', 'w+');\n    fwrite($handle, $contents);\n    rewind($handle);\n    $lines = [];\n\n    while (!feof($handle)) {\n        $line = fgets($handle);\n        $lines[] = rtrim((string) $line, \"\\r\\n\");\n    }\n\n    fclose($handle);\n\n    return $lines;\n}\n"
        }
      ]
    },
    "stem": "readLines must return no lines for an empty stream. Which test fails against the implementation? The quoted inputs use \\n to denote a newline.",
    "options": [
      {
        "id": "one-line",
        "text": "readLines(\"abc\") should return [\"abc\"].",
        "rationale": "The successful unterminated read reaches EOF, so no extra iteration occurs.",
        "misconception": "Assuming any nonempty file exposes the pre-read EOF problem."
      },
      {
        "id": "two-lines",
        "text": "readLines(\"a\\nb\") should return [\"a\",\"b\"].",
        "rationale": "The final unterminated line reaches EOF during its successful read.",
        "misconception": "Testing multiple lines without a failing read being processed."
      },
      {
        "id": "empty",
        "text": "readLines(\"\") should return [].",
        "rationale": "Before the first read, EOF has not yet been detected; the failed fgets is cast to an empty string and appended.",
        "misconception": null
      },
      {
        "id": "zero",
        "text": "readLines(\"0\") should return [\"0\"].",
        "rationale": "The code does not test the line’s truthiness, so the valid zero string is retained.",
        "misconception": "Confusing a pre-read EOF defect with a truthiness-based line-reading defect."
      }
    ],
    "correctOptionId": "empty",
    "explanation": {
      "summary": "feof describes whether EOF has been detected, not whether the next read will return a line. Test fgets itself and append only successful reads.",
      "trace": "The empty-stream read returns false. The original casts it to an empty string and returns [\"\"]. The repaired loop stops before appending anything."
    },
    "validation": {
      "kind": "tests",
      "marker": "while (!feof($handle)) {\n        $line = fgets($handle);",
      "repair": "while (($line = fgets($handle)) !== false) {",
      "cases": [
        {
          "option": "one-line",
          "probe": "echo json_encode(readLines(\"abc\"));",
          "expected": "[\"abc\"]"
        },
        {
          "option": "two-lines",
          "probe": "echo json_encode(readLines(\"a\\nb\"));",
          "expected": "[\"a\",\"b\"]"
        },
        {
          "option": "empty",
          "probe": "echo json_encode(readLines(\"\"));",
          "expected": "[]"
        },
        {
          "option": "zero",
          "probe": "echo json_encode(readLines(\"0\"));",
          "expected": "[\"0\"]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-10"
    },
    "references": [
      "https://www.php.net/manual/en/function.feof.php",
      "https://www.php.net/manual/en/function.fgets.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0089",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Iterators, generators & fibers",
    "subtopic": "iteratoraggregate-repeatable-traversal-test",
    "objective": {
      "id": "iteratoraggregate-repeatable-traversal-test",
      "text": "Test repeated traversal of an IteratorAggregate that incorrectly caches a one-shot Generator."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish multiple aggregate traversals from a single traversal or separate instances."
    },
    "prerequisites": [
      "IteratorAggregate",
      "Generator lifecycle",
      "Repeatability tests"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Items implements IteratorAggregate\n{\n    private Generator $iterator;\n\n    public function __construct(private array $values)\n    {\n        $this->iterator = $this->fresh();\n    }\n\n    private function fresh(): Generator\n    {\n        yield from $this->values;\n    }\n\n    public function getIterator(): Traversable\n    {\n        return $this->iterator;\n    }\n}\n\nfunction readItems(Items $items): array|string\n{\n    try {\n        return iterator_to_array($items, false);\n    } catch (Exception $error) {\n        return 'closed';\n    }\n}\n"
        }
      ]
    },
    "stem": "Items promises a fresh traversal on every getIterator call. Which test fails against the implementation?",
    "options": [
      {
        "id": "one-pass",
        "text": "Read Items([1,2]) once; expect [1,2].",
        "rationale": "The initial Generator is open, so the first traversal succeeds.",
        "misconception": "Testing only first-use behavior."
      },
      {
        "id": "same-instance",
        "text": "Read the same Items([1]) twice; expect [[1],[1]].",
        "rationale": "The second traversal tries to reuse the exhausted Generator and produces closed.",
        "misconception": null
      },
      {
        "id": "two-instances",
        "text": "Read two separate Items([1]) instances once each; expect [[1],[1]].",
        "rationale": "Each instance owns a different fresh Generator, so this passes.",
        "misconception": "Replacing reuse of one aggregate with independent construction."
      },
      {
        "id": "empty-once",
        "text": "Read Items([]) once; expect [].",
        "rationale": "A single empty traversal succeeds and does not test reuse.",
        "misconception": "Assuming an empty traversal alone checks repeatability."
      }
    ],
    "correctOptionId": "same-instance",
    "explanation": {
      "summary": "An IteratorAggregate can provide repeatable traversal by constructing a new iterator for each request. Caching a Generator instead caches one consumable traversal.",
      "trace": "Returning fresh() from getIterator makes both reads of the same aggregate independently yield 1."
    },
    "validation": {
      "kind": "tests",
      "marker": "return $this->iterator;",
      "repair": "return $this->fresh();",
      "cases": [
        {
          "option": "one-pass",
          "probe": "echo json_encode(readItems(new Items([1,2])));",
          "expected": "[1,2]"
        },
        {
          "option": "same-instance",
          "probe": "$items = new Items([1]); echo json_encode([readItems($items), readItems($items)]);",
          "expected": "[[1],[1]]"
        },
        {
          "option": "two-instances",
          "probe": "echo json_encode([readItems(new Items([1])), readItems(new Items([1]))]);",
          "expected": "[[1],[1]]"
        },
        {
          "option": "empty-once",
          "probe": "echo json_encode(readItems(new Items([])));",
          "expected": "[]"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-22"
    },
    "references": [
      "https://www.php.net/manual/en/class.iteratoraggregate.php",
      "https://www.php.net/manual/en/class.generator.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0090",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Errors & exceptions",
    "subtopic": "custom-handler-suppression-mask-test",
    "objective": {
      "id": "custom-handler-suppression-mask-test",
      "text": "Verify that a custom error handler respects the currently enabled severity mask, including suppression."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Select a suppression case that distinguishes handler invocation from the enabled severity mask."
    },
    "prerequisites": [
      "Custom error handlers",
      "Error severity masks",
      "@ behavior in PHP 8"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\n$recorded = [];\n\nset_error_handler(function (int $severity, string $message) use (&$recorded): bool {\n    if (true) {\n        $recorded[] = $message;\n    }\n\n    return true;\n});\n"
        }
      ]
    },
    "stem": "The handler must record only severities enabled by error_reporting at the moment it runs. Each test begins with E_ALL. Which test fails against the implementation?",
    "options": [
      {
        "id": "warning",
        "text": "Trigger one unsuppressed E_USER_WARNING; expect one record.",
        "rationale": "That severity is enabled under E_ALL, so recording it is correct.",
        "misconception": "Testing only enabled diagnostics."
      },
      {
        "id": "notice",
        "text": "Trigger one unsuppressed E_USER_NOTICE; expect one record.",
        "rationale": "The notice is also enabled and should be recorded.",
        "misconception": "Changing severity without changing whether it is enabled."
      },
      {
        "id": "suppressed",
        "text": "Trigger E_USER_WARNING with @; expect zero records.",
        "rationale": "The custom handler is still called, but the warning bit is disabled in the effective reporting mask.",
        "misconception": null
      },
      {
        "id": "two-warnings",
        "text": "Trigger two unsuppressed E_USER_WARNING diagnostics; expect two records.",
        "rationale": "Both enabled warnings should be recorded, so this does not expose suppression handling.",
        "misconception": "Testing repetition rather than reporting policy."
      }
    ],
    "correctOptionId": "suppressed",
    "explanation": {
      "summary": "A custom handler may be invoked even for a suppressed diagnostic. It must inspect error_reporting() & severity if it promises to respect the effective mask; testing only whether the mask is zero is insufficient in modern PHP.",
      "trace": "The repair records a message only when its severity bit is enabled. The suppressed-warning candidate then records zero messages."
    },
    "validation": {
      "kind": "tests",
      "marker": "if (true)",
      "repair": "if ((error_reporting() & $severity) !== 0)",
      "cases": [
        {
          "option": "warning",
          "probe": "trigger_error('one', E_USER_WARNING); restore_error_handler(); echo count($recorded);",
          "expected": "1"
        },
        {
          "option": "notice",
          "probe": "trigger_error('one', E_USER_NOTICE); restore_error_handler(); echo count($recorded);",
          "expected": "1"
        },
        {
          "option": "suppressed",
          "probe": "@trigger_error('one', E_USER_WARNING); restore_error_handler(); echo count($recorded);",
          "expected": "0"
        },
        {
          "option": "two-warnings",
          "probe": "trigger_error('one', E_USER_WARNING); trigger_error('two', E_USER_WARNING); restore_error_handler(); echo count($recorded);",
          "expected": "2"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-20"
    },
    "references": [
      "https://www.php.net/manual/en/function.set-error-handler.php",
      "https://www.php.net/manual/en/language.operators.errorcontrol.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0091",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Classes & object lifecycle",
    "subtopic": "cloned-owned-stream-lifetime-test",
    "objective": {
      "id": "cloned-owned-stream-lifetime-test",
      "text": "Test whether cloning an owning object creates independent stream ownership."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Follow shallow resource copying and destructor effects across two object lifetimes."
    },
    "prerequisites": [
      "Resource handles",
      "clone",
      "Destructors",
      "Ownership contracts (advanced)"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nclass Buffer\n{\n    private $stream;\n\n    public function __construct()\n    {\n        $this->stream = fopen('php://memory', 'w+');\n        fwrite($this->stream, 'abc');\n        rewind($this->stream);\n    }\n\n    public function __clone(): void\n    {\n        // Clone the owned stream here.\n    }\n\n    public function valid(): bool\n    {\n        return is_resource($this->stream);\n    }\n\n    public function __destruct()\n    {\n        if (is_resource($this->stream)) {\n            fclose($this->stream);\n        }\n    }\n}\n"
        }
      ]
    },
    "stem": "Buffer promises that a clone owns an independent memory stream. Which test exposes the empty __clone implementation? valid reports whether that instance still has an open stream.",
    "options": [
      {
        "id": "destroy-copy",
        "text": "Clone a Buffer, unset the clone, then assert the original is still valid.",
        "rationale": "The clone’s destructor closes the shared resource, invalidating the original.",
        "misconception": null
      },
      {
        "id": "fresh-valid",
        "text": "Construct a Buffer and assert it is valid.",
        "rationale": "Construction creates a valid stream; no ownership conflict has occurred.",
        "misconception": "Testing only initial resource acquisition."
      },
      {
        "id": "both-alive",
        "text": "Clone a Buffer and assert both instances are valid while both remain alive.",
        "rationale": "Both instances still reference the open shared resource, so this passes despite the ownership defect.",
        "misconception": "Checking validity without exercising independent lifetimes."
      },
      {
        "id": "separate-objects",
        "text": "Construct two Buffers, unset one, then assert the other is valid.",
        "rationale": "Separate construction already creates separate streams and does not exercise clone behavior.",
        "misconception": "Substituting independent construction for copying an owner."
      }
    ],
    "correctOptionId": "destroy-copy",
    "explanation": {
      "summary": "Cloning an object copies its resource handle value; it does not duplicate the underlying stream. The failure appears when one supposed owner closes the resource while the other remains in use.",
      "trace": "The repair creates a new memory stream, copies bytes and preserves position. Destroying the clone then closes only its own stream."
    },
    "validation": {
      "kind": "tests",
      "marker": "// Clone the owned stream here.",
      "repair": "$original = $this->stream;\n        $position = ftell($original);\n        $this->stream = fopen('php://memory', 'w+');\n        rewind($original);\n        stream_copy_to_stream($original, $this->stream);\n        fseek($original, $position);\n        fseek($this->stream, $position);",
      "cases": [
        {
          "option": "destroy-copy",
          "probe": "$original = new Buffer(); $copy = clone $original; unset($copy); echo json_encode($original->valid());",
          "expected": "true"
        },
        {
          "option": "fresh-valid",
          "probe": "$original = new Buffer(); echo json_encode($original->valid());",
          "expected": "true"
        },
        {
          "option": "both-alive",
          "probe": "$original = new Buffer(); $copy = clone $original; echo json_encode($original->valid() && $copy->valid());",
          "expected": "true"
        },
        {
          "option": "separate-objects",
          "probe": "$original = new Buffer(); $other = new Buffer(); unset($other); echo json_encode($original->valid());",
          "expected": "true"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-17"
    },
    "references": [
      "https://www.php.net/manual/en/language.oop5.cloning.php",
      "https://www.php.net/manual/en/function.fclose.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0092",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "testing",
    "topic": "Types, casting & comparisons",
    "subtopic": "nan-comparator-reflexivity-test",
    "objective": {
      "id": "nan-comparator-reflexivity-test",
      "text": "Test comparator equality for two NaN values under an explicit total-order policy."
    },
    "difficulty": {
      "level": "Foundation",
      "audience": "junior",
      "rationale": "Trace the first matching branch against an explicitly stated equality requirement."
    },
    "prerequisites": [
      "NaN",
      "is_nan",
      "Comparator contracts"
    ],
    "runtime": {
      "php": [
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
          "source": "<?php\n\nfunction compare(float $left, float $right): int\n{\n    if (is_nan($left)) {\n        return 1;\n    }\n\n    if (is_nan($right)) {\n        return -1;\n    }\n\n    return $left <=> $right;\n}\n"
        }
      ]
    },
    "stem": "The comparator’s policy is numeric ascending order, NaN after every non-NaN, and two NaNs equal for ordering. Which test exposes its defect?",
    "options": [
      {
        "id": "nan-first",
        "text": "compare(NAN, 1.0) should return 1.",
        "rationale": "A NaN is correctly ordered after a non-NaN by the first branch.",
        "misconception": "Testing only one NaN operand."
      },
      {
        "id": "nan-second",
        "text": "compare(1.0, NAN) should return -1.",
        "rationale": "The second branch correctly places the finite value first.",
        "misconception": "Testing the reverse one-NaN case without checking equality."
      },
      {
        "id": "finite",
        "text": "compare(1.0, 2.0) should return -1.",
        "rationale": "The numeric comparison works for these finite values.",
        "misconception": "Testing only the ordinary numeric domain."
      },
      {
        "id": "two-nans",
        "text": "compare(NAN, NAN) should return 0.",
        "rationale": "The first branch returns 1 even when the right operand is also NaN, violating the stated equality policy.",
        "misconception": null
      }
    ],
    "correctOptionId": "two-nans",
    "explanation": {
      "summary": "A custom NaN ordering policy must explicitly handle the both-NaN case. Ordinary floating-point equality cannot be relied on because NaN is not equal to itself.",
      "trace": "The corrected first branch returns zero if right is NaN, otherwise one. All other shown cases keep their existing results."
    },
    "validation": {
      "kind": "tests",
      "marker": "return 1;",
      "repair": "return is_nan($right) ? 0 : 1;",
      "cases": [
        {
          "option": "nan-first",
          "probe": "echo compare(NAN, 1.0);",
          "expected": "1"
        },
        {
          "option": "nan-second",
          "probe": "echo compare(1.0, NAN);",
          "expected": "-1"
        },
        {
          "option": "finite",
          "probe": "echo compare(1.0, 2.0);",
          "expected": "-1"
        },
        {
          "option": "two-nans",
          "probe": "echo compare(NAN, NAN);",
          "expected": "0"
        }
      ],
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-03"
    },
    "references": [
      "https://www.php.net/manual/en/language.types.float.php",
      "https://www.php.net/manual/en/function.is-nan.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0093",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Performance, processes & servers",
    "subtopic": "concurrent-worker-explicit-user-context",
    "objective": {
      "id": "concurrent-worker-explicit-user-context",
      "text": "Keep per-job identity separate from shared services in a long-running concurrent PHP worker."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Follow the lifetime mismatch between a shared service and interleaved job-specific state."
    },
    "prerequisites": [
      "Dependency injection",
      "Long-running workers",
      "Cooperative concurrency"
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
        "One service instance handles interleaved Fiber jobs for different users. Operations may suspend. The authorization dependency is safe to share, but the current user is specific to each job."
      ],
      "files": []
    },
    "stem": "Every authorization check must use the calling job’s user even after suspension. Which design meets that requirement without serializing the worker?",
    "options": [
      {
        "id": "singleton-field",
        "text": "Assign currentUser on the shared service before each job and read it after each suspension.",
        "rationale": "Another job can replace the field while the first is suspended.",
        "misconception": "Treating a shared mutable field as job-local state."
      },
      {
        "id": "explicit-context",
        "text": "Pass an immutable user context to each operation, retained in that call’s local state.",
        "rationale": "Each suspended call retains its own context while sharing only the stateless authorization dependency.",
        "misconception": null
      },
      {
        "id": "constructor-user",
        "text": "Capture the first job’s user in the shared service constructor for the worker’s lifetime.",
        "rationale": "Later jobs would inherit the first user’s identity.",
        "misconception": "Giving request-specific state the lifetime of a shared service."
      },
      {
        "id": "global-reset",
        "text": "Set a global current-user variable before each job and clear it in finally.",
        "rationale": "Interleaving jobs still overwrite or clear the same global while another call is suspended.",
        "misconception": "Assuming eventual cleanup prevents concurrent state contamination."
      }
    ],
    "correctOptionId": "explicit-context",
    "explanation": {
      "summary": "Shared services and per-job identity have different lifetimes. Passing immutable context keeps identity in each call’s own state across suspension instead of a shared mutable location.",
      "trace": "Job A retains context A on its stack. Job B uses context B. Resuming A does not require reading a field or global that B may have changed."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Given interleaved operations and shared mutable storage, job-specific values can be overwritten; separate immutable call contexts avoid that shared location.",
      "optionAudit": {
        "singleton-field": "Interleaving overwrites the field",
        "explicit-context": "Each call retains its own immutable identity",
        "constructor-user": "One user is reused for later jobs",
        "global-reset": "Interleaving still races through the global"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-25"
    },
    "references": [
      "https://www.php.net/manual/en/language.fibers.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0094",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "psr7-request-middleware-propagation",
    "objective": {
      "id": "psr7-request-middleware-propagation",
      "text": "Propagate an immutable PSR-7 request change to the downstream PSR-15 handler."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Identify which request instance crosses the middleware boundary."
    },
    "prerequisites": [
      "PSR-7 immutability",
      "PSR-15 middleware"
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
        "request implements PSR-7 ServerRequestInterface; handler implements PSR-15 RequestHandlerInterface. actor is already authenticated. Downstream code reads the actor request attribute."
      ],
      "files": []
    },
    "stem": "Which middleware sequence makes actor available to the downstream handler?",
    "options": [
      {
        "id": "discard-return",
        "text": "Call request.withAttribute(\"actor\", actor), discard its return, then handle the original request.",
        "rationale": "withAttribute returns a changed instance and leaves the original unchanged.",
        "misconception": "Treating a PSR-7 with-method as an in-place setter."
      },
      {
        "id": "after-handler",
        "text": "Handle the original request first, then call withAttribute on that request before returning the response.",
        "rationale": "The downstream handler has already run without the attribute.",
        "misconception": "Assuming a later request change can affect a completed downstream call."
      },
      {
        "id": "clone-discard",
        "text": "Clone the request, call withAttribute on the clone without retaining its return, then handle the clone.",
        "rationale": "Cloning does not change the immutable with-method contract; its returned instance is still discarded.",
        "misconception": "Assuming a clone makes immutable methods mutate in place."
      },
      {
        "id": "pass-result",
        "text": "Retain the instance returned by request.withAttribute(\"actor\", actor), then handle that instance.",
        "rationale": "The modified request instance is the one passed downstream.",
        "misconception": null
      }
    ],
    "correctOptionId": "pass-result",
    "explanation": {
      "summary": "PSR-7 with-methods return a modified instance. Middleware must pass that returned request into the next handler for downstream code to observe the attribute.",
      "trace": "The attribute is attached to the returned instance, which crosses the handler boundary. The original request remains unchanged."
    },
    "validation": {
      "kind": "document-review",
      "rule": "PSR-7 ServerRequestInterface::withAttribute retains immutability; PSR-15 handler consumes the request passed to handle.",
      "optionAudit": {
        "discard-return": "Original instance has no new attribute",
        "after-handler": "Change occurs after consumption",
        "clone-discard": "Changed instance is still discarded",
        "pass-result": "Downstream receives the changed instance"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php-fig.org/psr/psr-7/#321-psrhttpmessageserverrequestinterface",
      "https://www.php-fig.org/psr/psr-15/"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0095",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Errors & exceptions",
    "subtopic": "logging-failure-preserve-primary-exception",
    "objective": {
      "id": "logging-failure-preserve-primary-exception",
      "text": "Preserve the primary operation failure when best-effort logging can also throw."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate a required exception contract from an optional diagnostic side effect."
    },
    "prerequisites": [
      "Nested catches",
      "Exception identity",
      "Logging boundaries"
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
        "The operation throws an exception object original. The caller must receive that same object. Logging is best effort, may throw, and has a separate fallback diagnostic channel that does not throw."
      ],
      "files": []
    },
    "stem": "Which failure-handling design preserves the caller’s exception contract?",
    "options": [
      {
        "id": "guard-log",
        "text": "Attempt logging inside its own guarded try/catch, send logging failure to the fallback, then rethrow original.",
        "rationale": "The diagnostic failure is contained and the original exception object remains the propagated failure.",
        "misconception": null
      },
      {
        "id": "finally-log",
        "text": "Rethrow original from catch and perform the unguarded logging call in finally.",
        "rationale": "A logging exception from finally replaces the directly propagated original.",
        "misconception": "Assuming finally cannot change a pending exception."
      },
      {
        "id": "wrap-logging",
        "text": "If logging fails, throw a new RuntimeException with original as previous.",
        "rationale": "The caller receives a new object rather than the exact original required by the contract.",
        "misconception": "Equating cause preservation with preservation of exception identity."
      },
      {
        "id": "boolean-fallback",
        "text": "If logging fails, return false; otherwise rethrow original.",
        "rationale": "The logging failure changes the operation’s exception contract into a boolean result.",
        "misconception": "Allowing optional diagnostics to choose the public failure channel."
      }
    ],
    "correctOptionId": "guard-log",
    "explanation": {
      "summary": "Best-effort diagnostics must not determine the operation’s externally visible failure. Guard the logging side effect and rethrow the original object after either logging outcome.",
      "trace": "If logging succeeds, original is rethrown. If logging fails, the fallback records that failure and original is still rethrown."
    },
    "validation": {
      "kind": "document-review",
      "rule": "A nested catch can isolate a secondary throwable; throwing original preserves object identity, unlike wrapping or throwing from finally.",
      "optionAudit": {
        "guard-log": "Both logging branches propagate the same original object",
        "finally-log": "A secondary throwable can replace the primary",
        "wrap-logging": "Caller receives a different object",
        "boolean-fallback": "Caller receives a value rather than the required throwable"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0096",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Namespaces, Composer & packages",
    "subtopic": "composer-application-locked-production-install",
    "objective": {
      "id": "composer-application-locked-production-install",
      "text": "Choose a reproducible production dependency workflow for a PHP application."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Distinguish dependency resolution from installation and retain platform compatibility checks."
    },
    "prerequisites": [
      "Composer lock files",
      "Production dependencies",
      "Platform requirements"
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
        "This is a deployable application, not a reusable library. Its reviewed composer.lock is committed. Production must use those locked versions, exclude require-dev packages and verify real runtime platform requirements."
      ],
      "files": []
    },
    "stem": "Which workflow satisfies these deployment constraints?",
    "options": [
      {
        "id": "update",
        "text": "Run composer update --no-dev on the production host for every release.",
        "rationale": "update resolves versions within constraints and may change the reviewed lock.",
        "misconception": "Treating update as an installation of already locked versions."
      },
      {
        "id": "ignore-platform",
        "text": "Run composer install --no-dev --ignore-platform-reqs from the committed lock.",
        "rationale": "This retains versions but deliberately bypasses required platform validation.",
        "misconception": "Solving installation failures by dropping a deployment guarantee."
      },
      {
        "id": "locked-install",
        "text": "Run composer install --no-dev from the committed lock, then composer check-platform-reqs --no-dev.",
        "rationale": "Installation uses locked versions and the check verifies the actual runtime platform without development packages.",
        "misconception": null
      },
      {
        "id": "copy-development",
        "text": "Copy the developer’s entire vendor directory, including require-dev packages, into production.",
        "rationale": "The copied tree includes dependencies explicitly excluded by the stated production contract.",
        "misconception": "Treating a development working tree as the reviewed production dependency artifact."
      }
    ],
    "correctOptionId": "locked-install",
    "explanation": {
      "summary": "For an application, the lock records the reviewed dependency resolution. install consumes it; update resolves again. Platform checks must examine the real deployment runtime rather than be bypassed.",
      "trace": "The production install excludes require-dev. check-platform-reqs verifies the actual PHP and extension requirements of the installed production packages."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Composer install uses composer.lock; --no-dev excludes development requirements; check-platform-reqs checks the real platform.",
      "optionAudit": {
        "update": "Can choose new dependency versions",
        "ignore-platform": "Bypasses platform requirements",
        "locked-install": "Satisfies all three stated constraints",
        "copy-development": "Includes excluded development packages"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-19"
    },
    "references": [
      "https://getcomposer.org/doc/01-basic-usage.md#installing-from-composer-lock",
      "https://getcomposer.org/doc/03-cli.md#check-platform-reqs"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0097",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Cookies & sessions",
    "subtopic": "release-read-only-session-lock-before-work",
    "objective": {
      "id": "release-read-only-session-lock-before-work",
      "text": "Release a PHP session lock after reading authentication data and before long independent work."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Separate session access lifetime from the remainder of the HTTP request."
    },
    "prerequisites": [
      "PHP sessions",
      "File session handler locking",
      "Concurrent requests"
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
        "The configured file session handler holds an exclusive lock until session close. The request needs only a snapshot of user_id and will not modify session data afterward. A long calculation does not depend on keeping the session open."
      ],
      "files": []
    },
    "stem": "Requests from the same session currently wait behind the calculation. Which design permits their session access while this request continues calculating?",
    "options": [
      {
        "id": "regenerate",
        "text": "Regenerate the session ID, keep the session open, then perform the calculation.",
        "rationale": "ID rotation is not a deliberate release of the active session lock and also changes session identity unnecessarily.",
        "misconception": "Using session security rotation as a concurrency primitive."
      },
      {
        "id": "close-early",
        "text": "Read user_id into a local variable, call session_write_close, then perform the calculation.",
        "rationale": "Closing the session releases its lock while the local snapshot remains usable.",
        "misconception": null
      },
      {
        "id": "clear-local",
        "text": "Copy user_id locally and unset $_SESSION, but leave the session active during calculation.",
        "rationale": "Clearing the PHP variable does not close the session or release the handler’s lock.",
        "misconception": "Confusing local variable removal with resource lifecycle completion."
      },
      {
        "id": "close-late",
        "text": "Perform the calculation, then call session_write_close immediately before returning.",
        "rationale": "The lock remains held for the entire slow operation.",
        "misconception": "Moving close slightly earlier without shortening the critical section that causes blocking."
      }
    ],
    "correctOptionId": "close-early",
    "explanation": {
      "summary": "The lock protects active session access, not all work in the request. Once the needed values have been read and no later session writes are required, close the session before unrelated work.",
      "trace": "The local user_id snapshot survives session_write_close. Other requests can then acquire the session lock during this request’s calculation."
    },
    "validation": {
      "kind": "document-review",
      "rule": "session_write_close writes session data and ends the active session, releasing the file-handler lock under the stated configuration.",
      "optionAudit": {
        "regenerate": "Does not implement the required early session close",
        "close-early": "Releases the lock before independent work",
        "clear-local": "Does not end the session",
        "close-late": "Retains the lock throughout the slow calculation"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-13"
    },
    "references": [
      "https://www.php.net/manual/en/function.session-write-close.php"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0098",
    "revision": 2,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Validation & web security",
    "subtopic": "authorization-cache-complete-decision-key",
    "objective": {
      "id": "authorization-cache-complete-decision-key",
      "text": "Choose a cache key that identifies every input to a tenant-scoped authorization decision."
    },
    "difficulty": {
      "level": "Intermediate",
      "audience": "intermediate",
      "rationale": "Derive cache identity from per-tenant, per-user and per-resource policy differences and revision invalidation."
    },
    "prerequisites": [
      "Authorization caching",
      "Tenant isolation",
      "Versioned invalidation"
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
        "The cached action is always view. Resource IDs may repeat across tenants. Within a tenant, users sharing a role may have different overrides, and two resources of the same type may have different permissions. Every permission change increments a policy revision before further checks. Decisions are reused across requests, including requests using different HTTP methods."
      ],
      "files": []
    },
    "stem": "Which four-component key permits safe reuse under these assumptions?",
    "options": [
      {
        "id": "role-key",
        "text": "[tenantId, roleName, resourceId, policyRevision]",
        "rationale": "Users sharing a role may have different overrides, so their decisions cannot share this key.",
        "misconception": "Treating roles as complete user authorization identity."
      },
      {
        "id": "type-key",
        "text": "[tenantId, userId, resourceType, policyRevision]",
        "rationale": "Different resources of the same type may have different access decisions.",
        "misconception": "Replacing resource identity with its category."
      },
      {
        "id": "method-key",
        "text": "[tenantId, userId, resourceId, requestMethod]",
        "rationale": "Permission changes can reuse an old cached decision because the revision is absent.",
        "misconception": "Using request context as a substitute for authorization invalidation state."
      },
      {
        "id": "complete-key",
        "text": "[tenantId, userId, resourceId, policyRevision]",
        "rationale": "The key includes each stated decision input and changes when any of them changes.",
        "misconception": null
      }
    ],
    "correctOptionId": "complete-key",
    "explanation": {
      "summary": "A cached decision is valid only for the same authorization inputs. Tenant, user, resource and policy revision each distinguish cases that may legitimately have different outcomes.",
      "trace": "Cross-tenant IDs remain separate; user overrides remain separate; resources remain separate; new policy revisions bypass earlier decisions."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Cache correctness requires identical keys to imply identical relevant inputs under the stated decision function.",
      "optionAudit": {
        "role-key": "Conflates users with different overrides",
        "type-key": "Conflates distinct resources",
        "method-key": "Conflates old and new policies",
        "complete-key": "Preserves all declared decision dimensions"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
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
    "id": "PHP-E26-0099",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "Transactions, migrations & ORM",
    "subtopic": "unknown-commit-outcome-operation-identity",
    "objective": {
      "id": "unknown-commit-outcome-operation-identity",
      "text": "Recover from an ambiguous transaction commit without duplicating a logical operation."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Distinguish an unknown commit outcome from a confirmed rollback and use durable operation identity."
    },
    "prerequisites": [
      "PDO transactions",
      "Connection failure",
      "Idempotency records (advanced)"
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
        "The connection drops during commit, so the PHP caller cannot tell whether the database committed. Each transaction atomically stores its business changes and a result under a unique operation ID. Reconnecting to the authoritative database can resolve the old transaction before a lookup. Reusing the same operation ID is enforced by a unique constraint."
      ],
      "files": []
    },
    "stem": "Which recovery strategy avoids applying the logical operation twice while still recovering a committed result?",
    "options": [
      {
        "id": "rollback-new",
        "text": "Reconnect and call rollBack on the new connection, then retry under a new operation ID.",
        "rationale": "A new connection cannot roll back a transaction that may already have committed on the old connection.",
        "misconception": "Treating rollback as a global undo of an unknown prior commit."
      },
      {
        "id": "resolve-id",
        "text": "Resolve the old transaction; return its stored result or retry using the same operation ID.",
        "rationale": "The durable operation record distinguishes committed work, and stable identity prevents a second logical application.",
        "misconception": null
      },
      {
        "id": "retry-new",
        "text": "Treat every commit exception as a rollback and repeat the operation with a new ID.",
        "rationale": "The first operation may already be committed, and a new ID bypasses duplicate protection.",
        "misconception": "Equating a missing acknowledgement with a failed commit."
      },
      {
        "id": "local-state",
        "text": "Inspect inTransaction on a new PDO connection and infer success if it returns false.",
        "rationale": "The new connection’s local state contains no evidence of the old transaction’s outcome.",
        "misconception": "Using fresh connection state as a transaction-history query."
      }
    ],
    "correctOptionId": "resolve-id",
    "explanation": {
      "summary": "A communication failure during commit can leave the outcome unknown. Recovery must consult durable state tied to the same logical operation rather than assume rollback or create a new identity.",
      "trace": "If the operation record exists, return its stored result. If the old transaction is resolved as uncommitted, retry with the same unique ID so later duplicate attempts cannot create a second operation."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Given ambiguous commit and atomic unique operation records, authoritative outcome resolution plus stable operation identity distinguishes success from retryable absence.",
      "optionAudit": {
        "rollback-new": "Cannot undo a committed transaction on another connection",
        "resolve-id": "Uses authoritative durable outcome and the same uniqueness boundary",
        "retry-new": "Can duplicate committed work",
        "local-state": "New connection state does not reveal old commit outcome"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-16"
    },
    "references": [
      "https://www.php.net/manual/en/pdo.commit.php",
      "https://www.postgresql.org/docs/current/libpq-status.html"
    ]
  },
  {
    "schemaVersion": 1,
    "technology": "php",
    "collectionId": "php-engineer-2026",
    "id": "PHP-E26-0100",
    "revision": 1,
    "status": "editorially-reviewed",
    "responseType": "single-choice",
    "format": "architecture",
    "topic": "APIs, integrations & PSRs",
    "subtopic": "streamed-response-late-failure-protocol",
    "objective": {
      "id": "streamed-response-late-failure-protocol",
      "text": "Design observable failure semantics for a streamed response after its HTTP headers are committed."
    },
    "difficulty": {
      "level": "Advanced",
      "audience": "advanced",
      "rationale": "Reconcile bounded-memory streaming, irreversible output and application-level completion signaling."
    },
    "prerequisites": [
      "HTTP header commitment",
      "Generators",
      "Framed streaming protocols (advanced)"
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
        "A PHP endpoint emits newline-delimited JSON records with bounded memory and low first-record latency. The connection remains writable, but the producer can fail after records have been sent. Clients support a terminal success or error frame and treat a missing terminal frame as incomplete. Headers and prior bytes cannot be recalled."
      ],
      "files": []
    },
    "stem": "Which response design satisfies the stated streaming and failure requirements?",
    "options": [
      {
        "id": "terminal-frame",
        "text": "Validate what can be checked before starting, stream records, and emit a terminal error frame if a later producer failure occurs.",
        "rationale": "The agreed body protocol can report a late failure without pretending the already committed HTTP status can change.",
        "misconception": null
      },
      {
        "id": "late-status",
        "text": "Stream records normally, then replace the HTTP status with 500 if a later exception occurs.",
        "rationale": "Once headers are committed, a later status change cannot replace what the client already received.",
        "misconception": "Treating response headers as mutable after transmission."
      },
      {
        "id": "buffer-all",
        "text": "Buffer the complete result in memory before sending any record or header.",
        "rationale": "This avoids late producer failures after output but violates both bounded memory and low first-record latency.",
        "misconception": "Solving failure semantics by discarding the required streaming properties."
      },
      {
        "id": "replace-body",
        "text": "After a late failure, clear the output buffer and send a fresh JSON error object instead of the earlier records.",
        "rationale": "Already transmitted bytes cannot be removed by clearing a later local buffer.",
        "misconception": "Treating local buffering as control over bytes already delivered to the client."
      }
    ],
    "correctOptionId": "terminal-frame",
    "explanation": {
      "summary": "A streamed response cannot retroactively change sent headers or erase delivered records. A documented framing protocol can distinguish complete success, explicit failure and an incomplete connection.",
      "trace": "Early validation can still choose an HTTP error before commitment. Later errors use the terminal error frame; clients reject partial data as a completed success."
    },
    "validation": {
      "kind": "document-review",
      "rule": "Under committed headers and irreversible output, late outcome signaling must use the agreed body protocol or connection completion semantics; buffering all violates the explicit streaming constraints.",
      "optionAudit": {
        "terminal-frame": "Meets the stated protocol, latency and memory requirements",
        "late-status": "Cannot replace committed status",
        "buffer-all": "Violates memory and first-record latency requirements",
        "replace-body": "Cannot retract transmitted bytes"
      },
      "status": "editorially-reviewed",
      "independentEditorialReview": "pending",
      "evidenceBatch": 1
    },
    "curriculum": {
      "repositoryTopic": "repo-topic-24"
    },
    "references": [
      "https://www.php.net/manual/en/function.headers-sent.php",
      "https://www.php.net/manual/en/function.ob-clean.php"
    ]
  }
];
