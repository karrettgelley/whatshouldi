<?php
$key = 'j97kijVww8vTb1QGhkpxA';
$url = 'http://www.goodreads.com/book/random?key='.$key;

$book = simplexml_load_file($url);
$book_json = json_encode($book);

echo $book_json;