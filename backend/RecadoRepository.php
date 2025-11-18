<?php
require_once "Database.php";
require_once "Recado.php";


class RecadoRepository {


private $db;


public function __construct() {
$this->db = (new Database())->getConnection();
}


public function listar() {
$sql = "SELECT * FROM recados ORDER BY status DESC, id DESC";
return $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
}


public function criar($mensagem) {
$sql = "INSERT INTO recados (mensagem) VALUES (?)";
$stmt = $this->db->prepare($sql);
$stmt->execute([$mensagem]);
}


public function editar($id, $mensagem) {
$sql = "UPDATE recados SET mensagem = ? WHERE id = ?";
$stmt = $this->db->prepare($sql);
$stmt->execute([$mensagem, $id]);
}


public function excluir($id) {
$sql = "DELETE FROM recados WHERE id = ?";
$stmt = $this->db->prepare($sql);
$stmt->execute([$id]);
}


public function detalhe($id) {
$sql = "SELECT * FROM recados WHERE id = ?";
$stmt = $this->db->prepare($sql);
$stmt->execute([$id]);
return $stmt->fetch(PDO::FETCH_ASSOC);
}


public function favoritar($id) {
$sql = "UPDATE recados SET status = NOT status WHERE id = ?";
$stmt = $this->db->prepare($sql);
$stmt->execute([$id]);
}
}
?>