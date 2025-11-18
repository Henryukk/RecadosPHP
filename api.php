<?php
header('Content-Type: application/json');

require_once __DIR__ . '/backend/RecadoRepository.php';

$repo = new RecadoRepository();
$action = $_GET['action'] ?? '';

try {
  switch ($action) {
    case 'listar':
      echo json_encode(['recados' => $repo->listar()]);
      break;

    case 'criar':
      $msg = trim($_POST['mensagem'] ?? '');
      if (!$msg) throw new Exception('Mensagem inválida.');
      $repo->criar(htmlspecialchars($msg));
      echo json_encode(['ok' => true]);
      break;

    case 'editar':
      $id  = $_GET['id'] ?? $_POST['id'] ?? null;
      $msg = trim($_POST['mensagem'] ?? '');
      if (!$id || !$msg) throw new Exception('Dados inválidos.');
      $repo->editar($id, htmlspecialchars($msg));
      echo json_encode(['ok' => true]);
      break;

    case 'excluir':
      $id = $_GET['id'] ?? $_POST['id'] ?? null;
      if (!$id) throw new Exception('ID inválido.');
      $repo->excluir($id);
      echo json_encode(['ok' => true]);
      break;

    case 'favoritar':
      $id = $_GET['id'] ?? $_POST['id'] ?? null;
      if (!$id) throw new Exception('ID inválido.');
      $repo->favoritar($id);
      echo json_encode(['ok' => true]);
      break;

    case 'detalhe':
      $id = $_GET['id'] ?? null;
      if (!$id) throw new Exception('ID inválido.');
      $recado = $repo->detalhe($id);
      if (!$recado) throw new Exception('Recado não encontrado.');
      echo json_encode(['recado' => $recado]);
      break;

    default:
      throw new Exception('Ação inválida.');
  }
} catch (Exception $e) {
  http_response_code(400);
  echo json_encode(['erro' => $e->getMessage()]);
}
