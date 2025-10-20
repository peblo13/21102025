<?php
require_once __DIR__ . '/require_admin.php';
header('Content-Type: application/json');

$page = max(1, (int)($_GET['page'] ?? 1));
$pageSize = min(100, max(1, (int)($_GET['pageSize'] ?? 20)));
$offset = ($page - 1) * $pageSize;
$q = trim($_GET['q'] ?? '');

$where = '';
$params = [];
if ($q !== '') {
    $where = "WHERE email LIKE :q";
    $params[':q'] = '%' . $q . '%';
}

$countSql = "SELECT COUNT(*) FROM users $where";
$stmt = $pdo->prepare($countSql);
$stmt->execute($params);
$total = (int)$stmt->fetchColumn();

$sql = "SELECT id, email, email_verified, role, created_at FROM users $where ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
$stmt = $pdo->prepare($sql);
foreach ($params as $k => $v) { $stmt->bindValue($k, $v, PDO::PARAM_STR); }
$stmt->bindValue(':limit', $pageSize, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'page' => $page,
    'pageSize' => $pageSize,
    'total' => $total,
    'items' => $rows,
]);
