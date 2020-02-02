<?php
require_once '_db.php';

$json = file_get_contents('php://input');
$params = json_decode($json);

$stmt = $db->prepare("UPDATE events SET start = NULL, end = NULL, resource_id = NULL WHERE id = :id");
$stmt->bindParam(':id', $params->id);
$stmt->execute();

$stmt = $db->prepare('SELECT * FROM events WHERE id = :id');
$stmt->bindParam(':id', $params->id);
$stmt->execute();
$result = $stmt->fetchAll();

class Result {}

$response = new Result();
$response->id = $result[0]['id'];
$response->text = $result[0]['name'];
$response->duration = $result[0]['duration'] + 0;

header('Content-Type: application/json');
echo json_encode($response);

?>
