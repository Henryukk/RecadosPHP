
<?php
class Database {
private $pdo;


public function __construct() {
require __DIR__ . '/../database/credentials.php';


$this->pdo = new PDO(
"mysql:host=$host;dbname=$db;charset=utf8",
$user,
$pass,
[PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);
}


public function getConnection() {
return $this->pdo;
}
}
?>