<?php
require_once '_db.php';

$stmt = $db->prepare('SELECT * FROM events WHERE resource_id is null');
$stmt->execute();
$result = $stmt->fetchAll();

class Event {}
$events = array();

foreach($result as $row) {
  $e = new Event();
  $e->id = $row['id'];
  $e->text = $row['name'];
  $e->duration = $row['duration'] + 0;

  $events[] = $e;
}

header('Content-Type: application/json');
echo json_encode($events);

?>
