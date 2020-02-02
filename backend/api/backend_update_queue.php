<?php
require_once '_db.php';

$json = file_get_contents('php://input');
$params = json_decode($json);

$stmt = $db->prepare("UPDATE events SET name = :text, duration = :duration WHERE id = :id");
$stmt->bindParam(':id', $params->id);
$stmt->bindParam(':text', $params->text);
$stmt->bindParam(':duration', $params->duration);
$stmt->execute();

class Result {}

$response = new Result();
$response->id = $params->id;
$response->text = $params->text;
$response->duration = $params->duration + 0;

header('Content-Type: application/json');
echo json_encode($response);

?>
