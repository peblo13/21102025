<?php
require_once __DIR__ . '/auth_config.php';
$db = get_db();
$u = current_user($db);
if (!$u) json_out(['authenticated'=>false]);
json_out(['authenticated'=>true,'user'=>$u]);