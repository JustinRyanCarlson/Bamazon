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

INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quanity`) VALUES (NULL, 'PicoBrew Zymatic', 'Gadgets', '2028.00', '0');
INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quanity`) VALUES (NULL, 'ASUS GeForce GTX 1080 8GB ROG STRIX Graphics Card (STRIX-GTX1080-A8G-GAMING)', 'Computer Graphics Cards', '595.95', '7');
INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quanity`) VALUES (NULL, 'Sphero Star Wars BB-8 App Controlled Robot', 'Gadgets', '127.00', '10');
INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quanity`) VALUES (NULL, 'PlayStation 4 Slim 500GB Console - Uncharted 4 Bundle', 'Video Games', '299.99', '300');
INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quanity`) VALUES (NULL, 'All-New Echo Dot (2nd Generation) - Black', 'Amazon Echo', '49.99', '500');
INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quanity`) VALUES (NULL, 'EVGA 500 W1, 80+ WHITE 500W, 3 Year Warranty, Power Supply 100-W1-0500-KR', 'Computer Power Supplies', '37.99', '30');
INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quanity`) VALUES (NULL, 'nonda USB-C to USB 3.0 Mini Adapter', 'Amazon Launchpad Computers', '10.99', '64');
INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quanity`) VALUES (NULL, 'Intel 7th Gen Intel Core Desktop Processor i7-7700K (BX80677I77700K)', 'Computer Desktop CPUs', '350.00', '74');
INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quanity`) VALUES (NULL, 'ASUS LGA1151 DDR4 DP HDMI M.2 mATX Motherboard with onboard AC Wi-Fi and USB 3.1 ROG STRIX Z270G GAMING', 'Computer Motherboards', '199.00', '3');
INSERT INTO `products` (`item_id`, `product_name`, `department_name`, `price`, `stock_quanity`) VALUES (NULL, 'Creative Haven Dazzling Dogs Coloring Book (Adult Coloring)', 'Books', '5.17', '55');