<?php
// Maintenance helper: extract unchanged method bodies from pinned upstream files.
// It does not load or execute the referenced framework.
function extractMethod(string $file, string $name): string {
    $tokens = token_get_all(file_get_contents($file));
    foreach ($tokens as $i => $token) {
        if (!is_array($token) || $token[0] !== T_FUNCTION) continue;
        $j = $i + 1;
        while (is_array($tokens[$j]) && $tokens[$j][0] === T_WHITESPACE) $j++;
        if (!is_array($tokens[$j]) || $tokens[$j][1] !== $name) continue;
        $body = '';
        $depth = 0;
        $opened = false;
        for ($k = $i; $k < count($tokens); $k++) {
            $part = $tokens[$k];
            $body .= is_array($part) ? $part[1] : $part;
            if ($part === '{' || (is_array($part) && in_array($part[0], [T_CURLY_OPEN, T_DOLLAR_OPEN_CURLY_BRACES], true))) {
                $depth++;
                $opened = true;
            }
            if ($part === '}') $depth--;
            if ($opened && $depth === 0) return 'public '.$body;
        }
    }
    throw new RuntimeException("Missing method $name in $file");
}
$spec = json_decode(stream_get_contents(STDIN), true, flags: JSON_THROW_ON_ERROR);
$result = [];
foreach ($spec as $file => $methods) {
    foreach ($methods as $method) $result[basename($file)][$method] = extractMethod($file, $method);
}
echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
