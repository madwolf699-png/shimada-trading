<?php

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$finder = Finder::create()
    ->files()
    ->in(__DIR__)                 // ← /var/www/html 配下すべて
    ->name('*.php')
    ->exclude([
      '.devcontainer',
      '.phpdoc',
      '.vscode',
      'coverage',
      'docs',
      'manual',
      'tests',
      'vendor',
    ]);

return (new Config())
    ->setRules([
      '@PSR12' => true,
      // 整形系のみ
      'array_syntax' => ['syntax' => 'short'],
      'no_unused_imports' => true,
      'ordered_imports' => true,

      // 整形系のみ
      // singleQuote
      'single_quote' => true,
      // trailingComma: es5 相当
      'trailing_comma_in_multiline' => true,
      // bracketSpacing
      'braces' => [
        'allow_single_line_closure' => true,
      ],
      'spaces_inside_parentheses' => true,
      // インデント関連
      'indentation_type' => true,
      // 配列・演算子整形
      'binary_operator_spaces' => [
        'default' => 'single_space',
      ],
      'array_indentation' => true,
    ])
    ->setIndent('  ')   // スペース2
    ->setLineEnding("\n")
    ->setFinder($finder);
//->setUsingCache(true);
