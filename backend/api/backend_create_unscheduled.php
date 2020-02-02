<?php
require_once '_db.php';

$json = file_get_contents('php://input');
$params = json_decode($json);

$stmt = $db->prepare("INSERT INTO events (name, duration, scheduled) VALUES (:name, :duration, 0)");
$stmt->bindParam(':name', $params->text);
$stmt->bindParam(':duration', $params->duration);
$stmt->execute();

class Result {}

$response = new Result();
$response->duration = $params->duration + 0;
$response->text = $params->text;
$response->id = $db->lastInsertId();

header('Content-Type: application/json');
echo json_encode($response);

?>