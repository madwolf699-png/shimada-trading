<?php
// JSONとして返すヘッダ
header('Content-Type: application/json; charset=UTF-8');

// DB接続情報
$dsn = 'mysql:host=db;port=3306;dbname=app_db;charset=utf8mb4';
$user = 'root';
$pass = 'rootpassword';

try {
    // PDOで接続
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $sql = "UPDATE users SET name = :name WHERE id = :id";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':id'    => 1,
        ':name'  => '佐藤太郎',
        //':email' => 'sato@example.com'
    ]);

    echo json_encode([
        'status' => 'success',
        'affected_rows' => $stmt->rowCount()
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    // エラー時
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
