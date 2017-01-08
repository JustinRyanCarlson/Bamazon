CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(250) NOT NULL,
  department_name VARCHAR(250) NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  stock_quanity INT NOT NULL,
  PRIMARY KEY (item_id)
);