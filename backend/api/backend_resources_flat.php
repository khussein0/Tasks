<?php
require_once '_db.php';
    
$scheduler_groups = $db->query('SELECT * FROM groups ORDER BY name');

class Resource {}
$resources = array();

$stmt = $db->prepare('SELECT * FROM resources ORDER BY name');
$stmt->execute();
$scheduler_resources = $stmt->fetchAll();

foreach($scheduler_resources as $resource) {
  $r = new Resource();
  $r->id = $resource['id'];
  $r->name = $resource['name'];
  $resources[] = $r;
}

header('Content-Type: application/json');
echo json_encode($resources);

?>
