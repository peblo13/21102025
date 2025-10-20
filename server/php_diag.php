<?php
header('Content-Type: application/json; charset=utf-8');
$mods = [
  'pdo' => extension_loaded('PDO'),
  'pdo_sqlite' => extension_loaded('pdo_sqlite'),
  'sqlite3' => extension_loaded('sqlite3'),
  'curl' => extension_loaded('curl'),
  'openssl' => extension_loaded('openssl'),
];
$ini = php_ini_loaded_file();
$ver = PHP_VERSION;
echo json_encode(['php'=>$ver,'ini'=>$ini,'extensions'=>$mods], JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
