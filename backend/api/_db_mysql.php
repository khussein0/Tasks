<?php
$host = "127.0.0.1";
$port = 3306;
$username = "username";
$password = "password";
$database = "workorder";   // the database will be created if it doesn't exist

date_default_timezone_set("UTC");

$db = new PDO("mysql:host=$host;port=$port",
    $username,
    $password);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$db->exec("CREATE DATABASE IF NOT EXISTS `$database`");
$db->exec("use `$database`");

function tableExists($dbh, $id)
{
    $results = $dbh->query("SHOW TABLES LIKE '$id'");
    if(!$results) {
        return false;
    }
    if($results->rowCount() > 0) {
        return true;
    }
    return false;
}

$exists = tableExists($db, "resources");

if (!$exists) {
    //create the database
    $db->exec("CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTO_INCREMENT,
        name TEXT,
        start DATETIME,
        end DATETIME,
        resource_id VARCHAR(30),
        duration    INTEGER,
        scheduled   BOOLEAN DEFAULT false NOT NULL)");

    $db->exec("CREATE TABLE groups (
        id INTEGER  NOT NULL PRIMARY KEY,
        name VARCHAR(200)  NULL)");

    $db->exec("CREATE TABLE resources (
        id INTEGER  PRIMARY KEY AUTO_INCREMENT NOT NULL,
        name VARCHAR(200)  NULL,
        group_id INTEGER  NULL)");


    $items = array(
        array('id' => '1', 'name' => 'Team 1'),
        array('id' => '2', 'name' => 'Team 2'),
    );
    $insert = "INSERT INTO groups (id, name) VALUES (:id, :name)";
    $stmt = $db->prepare($insert);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':name', $name);
    foreach ($items as $m) {
        $id = $m['id'];
        $name = $m['name'];
        $stmt->execute();
    }

    $items = array(
        array('group_id' => '1', 'name' => 'John'),
        array('group_id' => '1', 'name' => 'Mary'),
        array('group_id' => '2', 'name' => 'Cindy'),
        array('group_id' => '2', 'name' => 'Robert'),
    );
    $insert = "INSERT INTO resources (group_id, name) VALUES (:group_id, :name)";
    $stmt = $db->prepare($insert);
    $stmt->bindParam(':group_id', $group_id);
    $stmt->bindParam(':name', $name);
    foreach ($items as $m) {
        $group_id = $m['group_id'];
        $name = $m['name'];
        $stmt->execute();
    }

}
