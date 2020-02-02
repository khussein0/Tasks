<?php
require_once '_db.php';

$json = file_get_contents('php://input');
$params = json_decode($json);

if ($params->start !== NULL && $params->end !== NULL) {
    $start = new DateTime($params->start);
    $end = new DateTime($params->end);
    $diff = $start->diff($end);
    $params->duration = $diff->h*60 + $diff->i;
}

$stmt = $db->prepare("UPDATE events SET start = :start, end = :end, duration = :duration, resource_id = :resource WHERE id = :id");
$stmt->bindParam(':id', $params->id);
$stmt->bindParam(':start', $params->start);
$stmt->bindParam(':end', $params->end);
$stmt->bindParam(':duration', $params->duration);
$stmt->bindParam(':resource', $params->resource);
$stmt->execute();

class Result {}

$response = $params;
$params->duration += 0;  // make sure it's a number

header('Content-Type: application/json');
echo json_encode($response);

?>
