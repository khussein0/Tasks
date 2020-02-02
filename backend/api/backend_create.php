<?php
require_once '_db.php';

$json = file_get_contents('php://input');
$params = json_decode($json);

$start = new DateTime($params->start);
$end = new DateTime($params->end);
$diff = $start->diff($end);
$duration = $diff->h*60 + $diff->i;

$stmt = $db->prepare("INSERT INTO events (name, start, end, duration, resource_id, scheduled) VALUES (:name, :start, :end, :duration, :resource, 1)");
$stmt->bindParam(':start', $params->start);
$stmt->bindParam(':end', $params->end);
$stmt->bindParam(':name', $params->text);
$stmt->bindParam(':duration', $duration);
$stmt->bindParam(':resource', $params->resource);
$stmt->execute();

class Result {}

$response = new Result();
$response->start = $params->start;
$response->end = $params->end;
$response->resource = $params->resource;
$response->text = $params->text;
$response->id = $db->lastInsertId();
$response->duration = $duration;

header('Content-Type: application/json');
echo json_encode($response);

?>