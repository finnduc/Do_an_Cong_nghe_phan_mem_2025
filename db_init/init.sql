CREATE DATABASE  IF NOT EXISTS `project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `project`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: project
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `api_keys`
--

DROP TABLE IF EXISTS `api_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_keys` (
  `api_key_id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL,
  `public_key` text NOT NULL,
  `private_key` text NOT NULL,
  `refresh_token` text NOT NULL,
  `refresh_token_user` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`api_key_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `api_keys_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_keys`
--

LOCK TABLES `api_keys` WRITE;
/*!40000 ALTER TABLE `api_keys` DISABLE KEYS */;
INSERT INTO `api_keys` VALUES ('6ff535b8-4c1f-11f0-8ccd-c85acfb45d7a','2256d3df-3eee-11f0-b0f1-c85acfb45d7a','-----BEGIN RSA PUBLIC KEY-----\nMIICCgKCAgEAtNbfdQuWqkdkriCsT5Hgu57vrPemg+tF19j/rluHNyDjCjJ3RTur\nD8xOzW+w5eM1VFvknv3IUvr+G2EfYQMW5LGnDAMzoezJa4x+XIUXBFb4jtE/B6u2\nHSoavlO0oqSqMGI9DFnARSg7D02lf8KdEo9/lYpnK09ls6aUcamUtRb04OaJYFt3\n6Y2pVeQXA0/Xu/ik+WMFzCJBqOzND4F6CvQxQE6SZzPqhC9dKa1E1Y0/gAp5q+ww\nnF0NVzPwRqVWBvyWuWgYAGIX8xXAIbOqV0oSj5dMz9GpVYIN2/hqyESAq61nblye\n89Xx2gQ3BdlQWZbrvka3dzCBlYIqmK0ecavyYaPWG92QIhKmYHJwd/MjhiDG/wOP\n9XqW9R8hVMc9kzUA16Z5IAUNVCyVeieQCWmhzirNcXu2NNOhA77nIBUk5fYiEh1O\n2q2BpgXSwNChKTGPynUVT8HFeN8lWr2XdSFzeWzhUaW/h1Xs9MOLG2OAFk7vXaX2\nR4F98MprPz+G78wZ8YlXeV85i9W5QV4mWV2sST7Vin8fpCe5h6dsRtZY1tXh5bQf\nKBe/8LUCr7hGTzAmtkHjvo1dh6N9SLtSuWlBuIgExV2HClfiyU9C4gJuAsucnkfu\nWRlRKAINsq67OAe9nCpdVTUlmDgIimEAcrHSQ1to9GorUfe293K37PECAwEAAQ==\n-----END RSA PUBLIC KEY-----\n','-----BEGIN RSA PRIVATE KEY-----\n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\n-----END RSA PRIVATE KEY-----\n','eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjIyNTZkM2RmLTNlZWUtMTFmMC1iMGYxLWM4NWFjZmI0NWQ3YSIsImlhdCI6MTc1MDMwMDg4NCwiZXhwIjoxNzUwOTA1Njg0fQ.Cy3bDQUwjmIo7rkim5V7XB10_Gz61Jq02W6aFqxo90y1ZQhfsTYIXqf6nEtAkxBh0EHuT5amgMo4louHZzzEzDaUGqGwrwUgXfqoszOoblVks_Gmfm8BXmNowK3eRekqVTAbsVBdLRyv9VEN8jPqLGuaDs3Ox0KJ1U3zbP4PrW_pL-RWqSonAepAtdoUWyI--fogSAwI4-_fAIT76DHmBkf85HxZAomLZ6RiKv-MeE0Kf7an4MHZOdNm-7nqvPwSynZg0k-V89e_WmB8HoXuAGOW__B2duVHEVFDlUnXk2Rb39xcjhPRV3Zdu7jno-IIeEcv9bpIEhVtPZNauxrihFrHBRQJV_Dfwrzlrp1mnSWrd9DgwClACQD23AJsXRA7WMqCqGUtCLKIIjaw-2mal6sWdcksRRZ7La4U2Iwcwd9BIqFHkc482orsCYKQicsalFTdESwkpt2seYKYqD4zTDcsYFlGaVQqH-aNp82RJI4l1ZrSOyFjX3UiiuPmpNnmcb07OReQXr34ZpxN0zg9LuTc0y0sLDnzPmvKRUG7ub-jpYHff_kc966aec82Y7MucHM1oC-sbTawMvut6V2TjiVez6kuTESCmhvN2z_w0xm2u_fPc1qNqM9zcVJurHpPbIee0X-Z6-sAx5n_DQNPk2Y5SoYEzJUmkD95206on_w','[]','2025-06-18 08:37:15'),('89a49d0e-4b22-11f0-b066-005056c00001','66ea52e8-3eee-11f0-b0f1-c85acfb45d7a','-----BEGIN RSA PUBLIC KEY-----\nMIICCgKCAgEAri9cXc24BxDjaEc/7JYyoU2wilVkw6gnychYUdrulR1jW4U8ny8A\nrUksMlbPTX+gJlSUsueN5foEyVKOx/yTfUVRnt6OIRXvA/6sL25tXolItT3xZLb7\nODLf6ucD8J5rHqQEyGZumASFrRlySVN4II26/xzRVgL40CbJsHXtJfJ4sG5bDVAp\njycwAkLcv5dvrg0bjUducd4nar48bnY0Cuzvtec0UelpeSsR7uPV6xcAzvy/l/WE\nmO7EFOyglUgTiz/Wwts2jMPku96sntPwqw5SuMrNTTFl9dT3eyhrZTwxx7CZyxqW\n72Vq5b19zfJbf0/aU5Qpq8G4nSTz9PrCjTYHGoEs/oP4Cu2/wlqxFBYC4rYVj5Rz\nEKMt7JcI+GKiSh6/1itL1knba/WyXriWl8MFa5Xa+sttlgisITceG/69KxzxXjei\ngPPyL4a/fyn/sePhdXEoRPFHZ8HBIDe9zkBEyoNKY3KRiseQUG7OuzeeVL2fqLlL\n3iWv7pKqLaJkYYc+UKl/69CEdsE9xSUE1tdrcLc1qLUoS4RFnLk5IWiNvznph0rt\n4x8SnsFQQezt9xEpmWuKe60/kvOmDIyHJhmjr/yFuhfjjjrzBEEnDqu+nwOHLb1v\n7KE2YCUYojnbUhBJYgl9yeT0yPRa8vS2fJ5Pi2JFMFxASFjDKOkk5N0CAwEAAQ==\n-----END RSA PUBLIC KEY-----\n','-----BEGIN RSA PRIVATE KEY-----\n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\n-----END RSA PRIVATE KEY-----\n','eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjY2ZWE1MmU4LTNlZWUtMTFmMC1iMGYxLWM4NWFjZmI0NWQ3YSIsImlhdCI6MTc1MDEyNzIxNSwiZXhwIjoxNzUwNzMyMDE1fQ.oAyoY3UDh10huBMvfWleMA_tu4HBFPyswrr4gscuYEOwtuesz_bI0WvQivshfILavkj3oRpYB3_GNIJdfkm3WUuxB4FJqRKcQD4shz6j47PF24Dw8KNGGmxFk25DRnjoyileUM4nKf6e5zhvQyt-xiRJdPLlL-zCIaoBAETArTXYRRzEAZLE0APCYRxpv3A0EPHk-d4rOugGaLOuwMx5KomAP9z1v3hQuDf-AxKIPS8d1AIPImB5xH4pIHgYnpXkID9vV_S-a3NhPJ2oNq28mbvPjpQ9dbDujVCuaje9EE7eBjMoV-xbDzP0dsnInGtZ2fqUMIPAoHBUVXJedd1TLnmkRtjoUt7xwYzrSYlju8biR3D7FlbM_WgNQE0pq0eJsdF372FbZYgt071XMT_ilugGs667S9j4gG26Jw1ocm8iqSYWIGI4cunaJvMXLBklSFJhyVV2mylumErbT6YcpdhFlZYQkzld2aAmijKcABF6N9HG1QX64Lxfg5zMwDhEVyH2ClEQ7I2pR09iHTpnT715hmQRoox9uHiUqVKwl7w-Zv_EfkacGu7kMu4TbcLNLdpiK5GawnkJwA75R_C6jSZ0XH6DPzQxfqlP11wXAsw-CxQt8vULWmfJ6hBBQRC3i8PrwnnDScZPQfhIt8x1dBisPp0Q7o1gFC1egHYn3nI','[]','2025-06-17 02:26:55');
/*!40000 ALTER TABLE `api_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(100) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('2d4a6532-4c64-11f0-8ccd-c85acfb45d7a','a',1,'2025-06-18 16:49:18'),('c5ac1e54-40ad-11f0-a5d6-c85acfb45d7a','Điện tử',0,'2025-06-03 19:05:53'),('c5ac9708-40ad-11f0-a5d6-c85acfb45d7a','Thực phẩm',0,'2025-06-03 19:05:53'),('c5aca29b-40ad-11f0-a5d6-c85acfb45d7a','Thời trang',0,'2025-06-03 19:05:53'),('c5aca57b-40ad-11f0-a5d6-c85acfb45d7a','Nội thất',0,'2025-06-03 19:05:53'),('c5aca774-40ad-11f0-a5d6-c85acfb45d7a','Đồ gia dụng',0,'2025-06-03 19:05:53'),('c5aca7fd-40ad-11f0-a5d6-c85acfb45d7a','Sách',0,'2025-06-03 19:05:53'),('c5aca896-40ad-11f0-a5d6-c85acfb45d7a','Dược phẩm',0,'2025-06-03 19:05:53'),('c5aca946-40ad-11f0-a5d6-c85acfb45d7a','Văn phòng phẩm',0,'2025-06-03 19:05:53'),('c5aca9e5-40ad-11f0-a5d6-c85acfb45d7a','Đồ thể thao',0,'2025-06-03 19:05:53'),('c5acae8b-40ad-11f0-a5d6-c85acfb45d7a','Đồ chơi trẻ em',0,'2025-06-03 19:05:53'),('c5acafa8-40ad-11f0-a5d6-c85acfb45d7a','Nguyên vật liệu',0,'2025-06-03 19:05:53'),('c5acb1bc-40ad-11f0-a5d6-c85acfb45d7a','Máy móc thiết bị',0,'2025-06-03 19:05:53'),('c5acc018-40ad-11f0-a5d6-c85acfb45d7a','Phụ tùng ô tô',0,'2025-06-03 19:05:53'),('c5acc0b8-40ad-11f0-a5d6-c85acfb45d7a','Trang sức',0,'2025-06-03 19:05:53'),('c5acc126-40ad-11f0-a5d6-c85acfb45d7a','Mỹ phẩm',0,'2025-06-03 19:05:53'),('c5acc19d-40ad-11f0-a5d6-c85acfb45d7a','Thức uống',0,'2025-06-03 19:05:53'),('c5acc257-40ad-11f0-a5d6-c85acfb45d7a','Nông sản',0,'2025-06-03 19:05:53'),('c5acc2cb-40ad-11f0-a5d6-c85acfb45d7a','Hóa chất công nghiệp',0,'2025-06-03 19:05:53'),('c5acc489-40ad-11f0-a5d6-c85acfb45d7a','Vật liệu đóng gói',0,'2025-06-03 19:05:53'),('c5acccba-40ad-11f0-a5d6-c85acfb45d7a','Thiết bị điện',0,'2025-06-03 19:05:53');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `employee_id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES ('0949f80e-4c33-11f0-8ccd-c85acfb45d7a','Nguyễn Văn An','vanan@gmail.com','0869183877',0,'2025-06-18 10:57:33',NULL),('0f72b080-40a0-11f0-a5d6-c85acfb45d7a','abc','doquanghung364@gmail.com','08699838191',1,'2025-06-03 17:27:44',NULL),('827da9ee-3eee-11f0-b0f1-c85acfb45d7a','Đỗ Quang Hùng','hungd4842@gmail.com','0869983819',0,'2025-06-01 13:44:16','66ea52e8-3eee-11f0-b0f1-c85acfb45d7a'),('87371ccb-408a-11f0-a5d6-c85acfb45d7a','Trần Thị Bích Ngọc','bichngoc.tran@company.com','0932 456 789',0,'2025-06-03 14:53:36',NULL),('87adb410-409f-11f0-a5d6-c85acfb45d7a','abc','doquanhghung364@gmail.com',NULL,1,'2025-06-03 17:23:56','2256d3df-3eee-11f0-b0f1-c85acfb45d7a'),('8f3d3ca7-408a-11f0-a5d6-c85acfb45d7a','Lê Hoàng Long','hoanglong.le@company.com','0978 321 654',0,'2025-06-03 14:53:50',NULL),('8f554ebe-3eee-11f0-b0f1-c85acfb45d7a','Đỗ Quang Cường','doquangcuong3624@gmail.com','08699838193',1,'2025-06-01 13:44:37',NULL),('97c29fb9-408a-11f0-a5d6-c85acfb45d7a','Phạm Minh Châu','chau.pham@company.com','0909 876 543',0,'2025-06-03 14:54:04',NULL),('9e921202-408a-11f0-a5d6-c85acfb45d7a','Đỗ Nhật Hào','nhathao.do@company.com','0966 888 777',1,'2025-06-03 14:54:15',NULL),('aa138a36-408a-11f0-a5d6-c85acfb45d7a','Vũ Thị Kim Ngân','kimngan.vu@company.com','0912 334 455',1,'2025-06-03 14:54:35',NULL),('ad3ce465-408a-11f0-a5d6-c85acfb45d7a','Bùi Quốc Khánh','quockhanh.bui@company.com','0944 776 655',1,'2025-06-03 14:54:40',NULL),('b8408cae-408a-11f0-a5d6-c85acfb45d7a','Hồ Thanh Tuyền','thanhtuyen.ho@company.com','0933 111 999',0,'2025-06-03 14:54:58',NULL),('c6000d75-40eb-11f0-bb36-c85acfb45d7a','abc','abc@gmail.com','0123456789',1,'2025-06-04 02:29:43',NULL),('ca438df9-408a-11f0-a5d6-c85acfb45d7a','Lý Gia Hân','giah.ly@company.com','0908 222 333',1,'2025-06-03 14:55:29',NULL),('cda498c8-408a-11f0-a5d6-c85acfb45d7a','Trịnh Công Dũng','congdung.trinh@company.com','0987 765 432',0,'2025-06-03 14:55:34',NULL),('e98dc77c-40eb-11f0-bb36-c85acfb45d7a','ABD','hung2d4842@gmasil.com',NULL,1,'2025-06-04 02:30:42','dd3c26bf-40eb-11f0-bb36-c85acfb45d7a'),('ebd4d765-4c32-11f0-8ccd-c85acfb45d7a','Nguyễn Văn Hùng','vanhung@gmail.com','0869983811',0,'2025-06-18 10:56:43',NULL),('fc3d54cf-4c32-11f0-8ccd-c85acfb45d7a','Nguyễn Văn Giang','vangiang@gmail.com','0869983877',1,'2025-06-18 10:57:11',NULL);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manufacturers`
--

DROP TABLE IF EXISTS `manufacturers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manufacturers` (
  `manufacturer_id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(100) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`manufacturer_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manufacturers`
--

LOCK TABLES `manufacturers` WRITE;
/*!40000 ALTER TABLE `manufacturers` DISABLE KEYS */;
INSERT INTO `manufacturers` VALUES ('db2d3cb0-40ad-11f0-a5d6-c85acfb45d7a','Samsung Electronics',0,'2025-06-03 19:06:29'),('db2d620d-40ad-11f0-a5d6-c85acfb45d7a','Apple Inc.',0,'2025-06-03 19:06:29'),('db2d6416-40ad-11f0-a5d6-c85acfb45d7a','Sony Corporation',0,'2025-06-03 19:06:29'),('db2d68d6-40ad-11f0-a5d6-c85acfb45d7a','LG Electronics',0,'2025-06-03 19:06:29'),('db2d750f-40ad-11f0-a5d6-c85acfb45d7a','Panasonic',0,'2025-06-03 19:06:29'),('db2d781f-40ad-11f0-a5d6-c85acfb45d7a','Unilever Vietnam',0,'2025-06-03 19:06:29'),('db2d78cd-40ad-11f0-a5d6-c85acfb45d7a','Nestlé Việt Nam',0,'2025-06-03 19:06:29'),('db2d7985-40ad-11f0-a5d6-c85acfb45d7a','Vinamilk',0,'2025-06-03 19:06:29'),('db2d7a15-40ad-11f0-a5d6-c85acfb45d7a','Thaco Auto',0,'2025-06-03 19:06:29'),('db2d7ba6-40ad-11f0-a5d6-c85acfb45d7a','Hoà Phát Group',0,'2025-06-03 19:06:29'),('db2d81df-40ad-11f0-a5d6-c85acfb45d7a','Toshiba Corporation',0,'2025-06-03 19:06:29'),('db2d8921-40ad-11f0-a5d6-c85acfb45d7a','AsusTek Computer Inc.',0,'2025-06-03 19:06:29'),('db2d89c6-40ad-11f0-a5d6-c85acfb45d7a','Dell Technologies',0,'2025-06-03 19:06:29'),('db2d8a6f-40ad-11f0-a5d6-c85acfb45d7a','HP Inc.',0,'2025-06-03 19:06:29'),('db2d8b04-40ad-11f0-a5d6-c85acfb45d7a','P&G Vietnam',0,'2025-06-03 19:06:29'),('db2d8b84-40ad-11f0-a5d6-c85acfb45d7a','Sanyo Electric Co.',0,'2025-06-03 19:06:29'),('db2d8c07-40ad-11f0-a5d6-c85acfb45d7a','Bình Minh Plastic',0,'2025-06-03 19:06:29'),('db2d8ca6-40ad-11f0-a5d6-c85acfb45d7a','Masan Consumer',0,'2025-06-03 19:06:29'),('db2d8d5e-40ad-11f0-a5d6-c85acfb45d7a','Bosch Vietnam',0,'2025-06-03 19:06:29'),('db2d8e1b-40ad-11f0-a5d6-c85acfb45d7a','Sharp Corporation',0,'2025-06-03 19:06:29');
/*!40000 ALTER TABLE `manufacturers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parameters`
--

DROP TABLE IF EXISTS `parameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parameters` (
  `parameter_id` char(36) NOT NULL DEFAULT (uuid()),
  `product_id` char(36) DEFAULT NULL,
  `manufacturer_id` char(36) DEFAULT NULL,
  `category_id` char(36) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`parameter_id`),
  KEY `product_id` (`product_id`),
  KEY `manufacturer_id` (`manufacturer_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `parameters_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `parameters_ibfk_2` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`manufacturer_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `parameters_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parameters`
--

LOCK TABLES `parameters` WRITE;
/*!40000 ALTER TABLE `parameters` DISABLE KEYS */;
INSERT INTO `parameters` VALUES ('1d1d0c26-30ad-408c-993c-bde25f7a853c','145fd14d-9a4c-458a-a7de-fcef462fc647','db2d781f-40ad-11f0-a5d6-c85acfb45d7a','c5aca7fd-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:24:15'),('21c924c8-2e93-4fdc-a16f-7ba6a67c68d1','d0a1a5d8-432f-4a0e-b932-d7233c93b6b5','db2d750f-40ad-11f0-a5d6-c85acfb45d7a','c5aca774-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:24:15'),('221a09a4-7905-436b-add4-42c62f86d1df','e37b96e4-0ea4-4449-adcb-235b7fd336e0','db2d7a15-40ad-11f0-a5d6-c85acfb45d7a','c5aca9e5-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:24:15'),('63ba8839-f166-44b8-a52c-1b854f4bd98e','301d2eaa-3b11-43b7-a725-83fcfd483b2d','db2d7ba6-40ad-11f0-a5d6-c85acfb45d7a','c5acae8b-40ad-11f0-a5d6-c85acfb45d7a',1,'2025-06-04 01:24:15'),('820e3c12-ec91-479f-9003-1c359a95f76c','7359a6fd-90ac-413d-971e-85c1f79d9053','db2d68d6-40ad-11f0-a5d6-c85acfb45d7a','c5aca57b-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:24:15'),('8754da2a-f1ba-4d11-bc8e-0521dd8fdb4f','66723adf-149c-41df-b7a1-2e43fbf3658d','db2d7985-40ad-11f0-a5d6-c85acfb45d7a','c5aca946-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:24:15'),('8ca7f0e0-4b1b-11f0-b066-005056c00001','8ca6b5c1-4b1b-11f0-b066-005056c00001','db2d620d-40ad-11f0-a5d6-c85acfb45d7a','c5aca57b-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-17 01:36:54'),('be0f05cc-995d-4df2-9177-2abf6e881cb2','732ae55e-5ef8-40f5-81fe-e25730b08055','db2d6416-40ad-11f0-a5d6-c85acfb45d7a','c5aca29b-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:24:15'),('d786c8b3-e03c-4640-833d-afde70ad9186','ed664b18-2aa5-49ff-b87e-b9d163600801','db2d620d-40ad-11f0-a5d6-c85acfb45d7a','c5ac9708-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:24:15'),('f1a7c8e0-40b1-11ef-8b6b-c85acfb45d7a','e9f1c6e2-40b1-11ef-8b6b-c85acfb45d7a','db2d3cb0-40ad-11f0-a5d6-c85acfb45d7a','c5ac9708-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:18:46'),('f1a7cb82-40b1-11ef-8b6b-c85acfb45d7a','e9f1c9a8-40b1-11ef-8b6b-c85acfb45d7a','db2d620d-40ad-11f0-a5d6-c85acfb45d7a','c5ac9708-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:18:46'),('f1a7cd34-40b1-11ef-8b6b-c85acfb45d7a','e9f1cb42-40b1-11ef-8b6b-c85acfb45d7a','db2d6416-40ad-11f0-a5d6-c85acfb45d7a','c5aca29b-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:18:46'),('f1a7ceb0-40b1-11ef-8b6b-c85acfb45d7a','e9f1ccd6-40b1-11ef-8b6b-c85acfb45d7a','db2d68d6-40ad-11f0-a5d6-c85acfb45d7a','c5aca57b-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:18:46'),('f1a7d01c-40b1-11ef-8b6b-c85acfb45d7a','e9f1ce5c-40b1-11ef-8b6b-c85acfb45d7a','db2d750f-40ad-11f0-a5d6-c85acfb45d7a','c5aca774-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:18:46'),('f7b12c4e-38af-45ce-99ae-e6c12a9a981c','be5caf9f-e0bc-455b-93fc-0362e342c838','db2d3cb0-40ad-11f0-a5d6-c85acfb45d7a','c5ac1e54-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:24:15'),('fd982df6-713b-4a4d-b04b-eab5d453c830','3512906a-4dff-4742-8394-311ca8e0c0a1','db2d78cd-40ad-11f0-a5d6-c85acfb45d7a','c5aca896-40ad-11f0-a5d6-c85acfb45d7a',0,'2025-06-04 01:24:15');
/*!40000 ALTER TABLE `parameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partners` (
  `partner_id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(100) NOT NULL,
  `partner_type` enum('supplier','customer') NOT NULL,
  `address` text,
  `phone` varchar(15) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`partner_id`),
  UNIQUE KEY `name` (`name`,`partner_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partners`
--

LOCK TABLES `partners` WRITE;
/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
INSERT INTO `partners` VALUES ('095a31df-40ec-11f0-bb36-c85acfb45d7a','abc','customer',NULL,'08692983819',NULL,1,'2025-06-04 02:31:36'),('1b1df3ac-3f91-11f0-89a7-c85acfb45d7a','partner1','supplier','123 Street 1','0900000001','partner1@example.com',1,'2025-06-02 09:08:10'),('1b1e8297-3f91-11f0-89a7-c85acfb45d7a','partner2','customer','123 Street 2','0900000002','partner2@example.com',1,'2025-06-02 09:08:10'),('1b1e865e-3f91-11f0-89a7-c85acfb45d7a','partner3','supplier','123 Street 3','0900000003','partner3@example.com',1,'2025-06-02 09:08:10'),('1b1e8774-3f91-11f0-89a7-c85acfb45d7a','partner4','customer','123 Street 4','0900000004','partner4@example.com',1,'2025-06-02 09:08:10'),('1b1e8823-3f91-11f0-89a7-c85acfb45d7a','partner5','supplier','123 Street 5','0900000005','partner5@example.com',1,'2025-06-02 09:08:10'),('1b1e889c-3f91-11f0-89a7-c85acfb45d7a','partner6','customer','123 Street 6','0900000006','partner6@example.com',1,'2025-06-02 09:08:10'),('1b1e8910-3f91-11f0-89a7-c85acfb45d7a','partner7','supplier','123 Street 7','0900000007','partner7@example.com',1,'2025-06-02 09:08:10'),('1b1e8987-3f91-11f0-89a7-c85acfb45d7a','partner8','customer','123 Street 8','0900000008','partner8@example.com',1,'2025-06-02 09:08:10'),('1b1e8a11-3f91-11f0-89a7-c85acfb45d7a','partner9','supplier','123 Street 9','0900000009','partner9@example.com',1,'2025-06-02 09:08:10'),('1b1e8aa5-3f91-11f0-89a7-c85acfb45d7a','partner10','customer','123 Street 10','0900000010','partner10@example.com',1,'2025-06-02 09:08:10'),('1b1e8e30-3f91-11f0-89a7-c85acfb45d7a','partner11','supplier','123 Street 11','0900000011','partner11@example.com',1,'2025-06-02 09:08:10'),('1b1e8f00-3f91-11f0-89a7-c85acfb45d7a','partner12','customer','123 Street 12','0900000012','partner12@example.com',1,'2025-06-02 09:08:10'),('1b1e8f8c-3f91-11f0-89a7-c85acfb45d7a','partner13','supplier','123 Street 13','0900000013','partner13@example.com',1,'2025-06-02 09:08:10'),('1b1e901b-3f91-11f0-89a7-c85acfb45d7a','partner14','customer','123 Street 14','0900000014','partner14@example.com',1,'2025-06-02 09:08:10'),('1b1e90c4-3f91-11f0-89a7-c85acfb45d7a','partner15','supplier','123 Street 15','0900000015','partner15@example.com',1,'2025-06-02 09:08:10'),('1b1e9137-3f91-11f0-89a7-c85acfb45d7a','partner16','customer','123 Street 16','0900000016','partner16@example.com',1,'2025-06-02 09:08:10'),('1b1e9198-3f91-11f0-89a7-c85acfb45d7a','partner17','supplier','123 Street 17','0900000017','partner17@example.com',1,'2025-06-02 09:08:10'),('1b1e9201-3f91-11f0-89a7-c85acfb45d7a','partner18','customer','123 Street 18','0900000018','partner18@example.com',1,'2025-06-02 09:08:10'),('1b1e926f-3f91-11f0-89a7-c85acfb45d7a','partner19','supplier','123 Street 19','0900000019','partner19@example.com',1,'2025-06-02 09:08:10'),('1b1e930a-3f91-11f0-89a7-c85acfb45d7a','partner20','customer','123 Street 20','0900000020','partner20@example.com',1,'2025-06-02 09:08:10'),('1f03cbc4-408b-11f0-a5d6-c85acfb45d7a','Công ty TNHH Minh Long','supplier','123 Nguyễn Văn Cừ, Q5, TP.HCM','0901 123 456','minh.long@supplier.com',1,'2025-06-03 14:57:51'),('31079e6e-40ec-11f0-bb36-c85acfb45d7a','az','customer',NULL,'086998381229',NULL,1,'2025-06-04 02:32:42'),('3672a335-408b-11f0-a5d6-c85acfb45d7a','Công ty ABC Logistics1','supplier','45 Lê Lai, Q1, TP.HCM','0987 654 321','contact@abc-logistics.com',1,'2025-06-03 14:58:30'),('afe24731-3eee-11f0-b0f1-c85acfb45d7a','Test name','supplier','Base_address','08699838191','hungd3@gmail.com',1,'2025-06-01 13:45:32'),('d171821f-40a6-11f0-a5d6-c85acfb45d7a','Công ty TNHH Thực Phẩm ABC','supplier','123 Đường Lê Thánh Tôn, Quận 1, TP.HCM','0912345678','contact@abcfood.vn',0,'2025-06-03 18:16:07'),('d171d47f-40a6-11f0-a5d6-c85acfb45d7a','Công ty Cổ Phần Điện Tử XYZ','supplier','45 Đường Trần Phú, Quận 5, TP.HCM','0987654321','info@xyzelectronics.com',0,'2025-06-03 18:16:07'),('d171dc67-40a6-11f0-a5d6-c85acfb45d7a','Công ty TNHH Dược Phẩm Minh An','supplier','78 Đường Lý Tự Trọng, Quận 1, TP.HCM','0934567890','sales@minhanpharm.vn',0,'2025-06-03 18:16:07'),('d171ddab-40a6-11f0-a5d6-c85acfb45d7a','Công ty Cổ Phần Sản Xuất Quang Huy','supplier','10 Nguyễn Hữu Thọ, Quận 7, TP.HCM','0978123456','contact@quanghuy.com.vn',0,'2025-06-03 18:16:07'),('d171deae-40a6-11f0-a5d6-c85acfb45d7a','Công ty TNHH Vận Tải Sài Gòn','supplier','22 Phan Đình Phùng, Quận Phú Nhuận, TP.HCM','0909123456','sales@vantaisaigon.vn',0,'2025-06-03 18:16:07'),('d171e054-40a6-11f0-a5d6-c85acfb45d7a','Công ty Cổ Phần Thời Trang Lan Anh','supplier','5 Nguyễn Văn Cừ, Quận 5, TP.HCM','0918765432','support@lananhfashion.vn',0,'2025-06-03 18:16:07'),('d171e155-40a6-11f0-a5d6-c85acfb45d7a','Công ty TNHH Xây Dựng An Phát','supplier','100 Tô Ký, Quận 12, TP.HCM','0381234567','info@anphatconstruction.vn',0,'2025-06-03 18:16:07'),('d171e2df-40a6-11f0-a5d6-c85acfb45d7a','Công ty Cổ Phần Dịch Vụ Ngân Hà','supplier','200 Cộng Hòa, Quận Tân Bình, TP.HCM','0379876543','contact@nganhaoservice.vn',1,'2025-06-03 18:16:07'),('d171e42b-40a6-11f0-a5d6-c85acfb45d7a','Công ty TNHH Nội Thất Hà Nội','supplier','15 Hoàng Quốc Việt, Cầu Giấy, Hà Nội','0341234567','sales@noithathanoi.vn',0,'2025-06-03 18:16:07'),('d171e4eb-40a6-11f0-a5d6-c85acfb45d7a','Công ty Cổ Phần Công Nghệ Vĩnh Phúc','supplier','50 Trần Phú, Ba Đình, Hà Nội','0359876543','info@vinhphuctech.vn',1,'2025-06-03 18:16:07'),('d171fc01-40a6-11f0-a5d6-c85acfb45d7a','Công ty TNHH Thương Mại Quốc Tế Bảo Lộc','customer','150 Lê Hồng Phong, Thành phố Bảo Lộc, Lâm Đồng','0912341122','contact@baolocintl.vn',0,'2025-06-03 18:16:07'),('d171fd25-40a6-11f0-a5d6-c85acfb45d7a','Công ty Cổ Phần Nông Sản Đồng Tháp','customer','10 Lê Duẩn, Thành phố Cao Lãnh, Đồng Tháp','0933214455','sales@dongsaproduce.vn',0,'2025-06-03 18:16:07'),('d171fdeb-40a6-11f0-a5d6-c85acfb45d7a','Công ty TNHH Một Thành Viên Dịch Vụ Hoàng Gia','customer','5 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội','0988112233','info@hoanggiaservice.vn',0,'2025-06-03 18:16:07'),('d171fec0-40a6-11f0-a5d6-c85acfb45d7a','Công ty Cổ Phần Dịch Vụ Sự Kiện Happy Events1','customer','20 Nguyễn Văn Linh, Quận Thanh Khê, Đà Nẵng','0908123456','contact@happyevents.vn',0,'2025-06-03 18:16:07'),('d171ffc4-40a6-11f0-a5d6-c85acfb45d7a','Công ty TNHH Cơ Khí Chính Xác Đông Phương','customer','55 Trần Phú, Quận Hải Châu, Đà Nẵng','0979123456','sales@dongphuongprecision.vn',0,'2025-06-03 18:16:07'),('d172007f-40a6-11f0-a5d6-c85acfb45d7a','Công ty Cổ Phần XNK Hải Phòng','customer','120 Lạch Tray, Ngô Quyền, Hải Phòng','0888123456','export@haiphongimpex.vn',0,'2025-06-03 18:16:07'),('d1720147-40a6-11f0-a5d6-c85acfb45d7a','Công ty TNHH Thương Mại Sơn Hà','customer','88 Phan Đình Phùng, Biên Hòa, Đồng Nai','0968123456','info@sonha-materials.vn',0,'2025-06-03 18:16:07'),('d172020a-40a6-11f0-a5d6-c85acfb45d7a','Công ty Cổ Phần Dược Liệu Thiên Phúc','customer','12 Lý Thái Tổ, Thành phố Thái Bình, Thái Bình','0928123456','sales@thienphucpharma.vn',0,'2025-06-03 18:16:07'),('d1720366-40a6-11f0-a5d6-c85acfb45d7a','Công ty TNHH Vật Liệu Xây Dựng Thành Công','customer','200 Nguyễn Văn Cừ, Quận Long Biên, Hà Nội','0948123456','contact@thanhcongmaterials.vn',0,'2025-06-03 18:16:07'),('d172049f-40a6-11f0-a5d6-c85acfb45d7a','Công ty Cổ Phần Thiết Bị Y Tế Minh Đức','customer','33 Hoàng Diệu, Quận Hồng Gai, Hạ Long, Quảng Ninh','0898123456','info@minhducmedical.vn',0,'2025-06-03 18:16:07'),('f63b12b1-40a6-11f0-a5d6-c85acfb45d7a','Đỗ Quang Thành','supplier','Gia Lai','0869983819','quangthanh@gmai.com',0,'2025-06-03 18:17:08'),('ff512a4c-408a-11f0-a5d6-c85acfb45d7a','shynciee','supplier','\nk','088459','hungd32@gmail.com',1,'2025-06-03 14:56:58');
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `permission_id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES ('225888e1-3eee-11f0-b0f1-c85acfb45d7a','read','Read access to resources','2025-06-01 13:41:34'),('2258e777-3eee-11f0-b0f1-c85acfb45d7a','create','Create new resources','2025-06-01 13:41:34'),('2259458d-3eee-11f0-b0f1-c85acfb45d7a','update','Update existing resources','2025-06-01 13:41:34'),('2259c12f-3eee-11f0-b0f1-c85acfb45d7a','delete','Delete resources','2025-06-01 13:41:34');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_prices`
--

DROP TABLE IF EXISTS `product_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_prices` (
  `price_id` char(36) NOT NULL DEFAULT (uuid()),
  `stock_id` char(36) NOT NULL,
  `price_type` enum('import','export') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `effective_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`price_id`),
  KEY `stock_id` (`stock_id`),
  CONSTRAINT `product_prices_ibfk_1` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`stock_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_prices_chk_1` CHECK ((`price` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_prices`
--

LOCK TABLES `product_prices` WRITE;
/*!40000 ALTER TABLE `product_prices` DISABLE KEYS */;
INSERT INTO `product_prices` VALUES ('139fab30-40ed-11f0-bb36-c85acfb45d7a','f455d510-3e8e-4e88-b196-e787571c6364','import',1000.00,'2025-06-04 02:39:00',0),('1c62bcf7-4b1c-11f0-b066-005056c00001','8ca91516-4b1b-11f0-b066-005056c00001','export',500.00,'2025-06-17 01:40:56',0),('222caa31-4b1d-11f0-b066-005056c00001','a64c7252-ee61-4eb3-8ad8-e66bce9c1351','import',150.00,'2025-06-17 01:48:13',0),('29c5fe59-4b1d-11f0-b066-005056c00001','4f909d46-dcec-4922-a0cc-b42c5f9b2412','export',100.00,'2025-06-17 01:48:28',0),('2da2b9ee-4b1d-11f0-b066-005056c00001','0915c5fc-0fc4-4b97-a413-eab494dbddcb','export',130.00,'2025-06-17 01:48:34',0),('3126210e-4b1d-11f0-b066-005056c00001','6e94277e-f35d-41cf-a132-4a91f613e45d','export',450.00,'2025-06-17 01:48:40',0),('3c2d28c2-4b1c-11f0-b066-005056c00001','8ca91516-4b1b-11f0-b066-005056c00001','export',500.00,'2025-06-17 01:41:47',0),('42fa4da5-4b1c-11f0-b066-005056c00001','d76abbda-d251-47dd-a8ad-0df2d26e1b15','export',200.00,'2025-06-17 01:42:00',0),('480840ef-40ee-11f0-bb36-c85acfb45d7a','d76abbda-d251-47dd-a8ad-0df2d26e1b15','import',100.00,'2025-06-04 02:47:36',0),('480a3880-40ee-11f0-bb36-c85acfb45d7a','a9d2a7d6-fc11-413c-a20d-fd4cfce56134','import',1000.00,'2025-06-04 02:47:36',0),('485689ef-4b1c-11f0-b066-005056c00001','2325aa2f-b443-4a0d-907e-e67f816b6118','export',300.00,'2025-06-17 01:42:09',0),('530d1dcf-4b1e-11f0-b066-005056c00001','0915c5fc-0fc4-4b97-a413-eab494dbddcb','export',130.00,'2025-06-17 01:56:44',0),('6405b532-4c5e-11f0-8ccd-c85acfb45d7a','0915c5fc-0fc4-4b97-a413-eab494dbddcb','export',130.00,'2025-06-18 16:07:52',0),('71da24f6-3eef-11f0-b0f1-c85acfb45d7a','649295e2-3eef-11f0-b0f1-c85acfb45d7a','export',500.00,'2025-06-01 13:50:58',0),('790df916-3eef-11f0-b0f1-c85acfb45d7a','649295e2-3eef-11f0-b0f1-c85acfb45d7a','export',50.00,'2025-06-01 13:51:10',0),('9309ed31-4b1c-11f0-b066-005056c00001','a796f531-a760-4c3b-95ab-15a2a951f8f0','import',200.00,'2025-06-17 01:44:13',0),('930c0306-3eef-11f0-b0f1-c85acfb45d7a','649295e2-3eef-11f0-b0f1-c85acfb45d7a','import',500.00,'2025-06-01 13:51:51',0),('930cc6b3-3eef-11f0-b0f1-c85acfb45d7a','649295e2-3eef-11f0-b0f1-c85acfb45d7a','import',5.00,'2025-06-01 13:51:51',0),('98a4239e-4b1c-11f0-b066-005056c00001','a796f531-a760-4c3b-95ab-15a2a951f8f0','export',300.00,'2025-06-17 01:44:24',0),('bf9935d1-40e4-11f0-a5d6-c85acfb45d7a','a9d2a7d6-fc11-413c-a20d-fd4cfce56134','export',200.00,'2025-06-04 01:39:26',0),('c02cd675-4b1c-11f0-b066-005056c00001','2325aa2f-b443-4a0d-907e-e67f816b6118','import',150.00,'2025-06-17 01:45:28',0),('c02e7b0d-4b1c-11f0-b066-005056c00001','4f909d46-dcec-4922-a0cc-b42c5f9b2412','import',75.00,'2025-06-17 01:45:28',0),('c702c350-40e4-11f0-a5d6-c85acfb45d7a','a9d2a7d6-fc11-413c-a20d-fd4cfce56134','export',200.00,'2025-06-04 01:39:37',0),('e40b725f-4b21-11f0-b066-005056c00001','0915c5fc-0fc4-4b97-a413-eab494dbddcb','export',130.00,'2025-06-17 02:22:16',0),('e4c7ccbc-4b1b-11f0-b066-005056c00001','a64c7252-ee61-4eb3-8ad8-e66bce9c1351','export',200.00,'2025-06-17 01:39:22',0),('e9370066-4b1c-11f0-b066-005056c00001','0915c5fc-0fc4-4b97-a413-eab494dbddcb','import',100.00,'2025-06-17 01:46:37',0),('e938f1c5-4b1c-11f0-b066-005056c00001','6e94277e-f35d-41cf-a132-4a91f613e45d','import',400.00,'2025-06-17 01:46:37',0),('f10789fb-40ec-11f0-bb36-c85acfb45d7a','649295e2-3eef-11f0-b0f1-c85acfb45d7a','export',500.00,'2025-06-04 02:38:01',0),('f8bdbe81-4b1b-11f0-b066-005056c00001','8ca91516-4b1b-11f0-b066-005056c00001','import',400.00,'2025-06-17 01:39:53',0);
/*!40000 ALTER TABLE `product_prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(100) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('145fd14d-9a4c-458a-a7de-fcef462fc647','Tiểu thuyết \"Bí Ẩn Dòng Sông Đen\"',0,'2025-06-04 01:24:15'),('301d2eaa-3b11-43b7-a725-83fcfd483b2d','Bộ lắp ráp Robot Vui Nhộn EduPlay',1,'2025-06-04 01:24:15'),('3512906a-4dff-4742-8394-311ca8e0c0a1','Thực phẩm bổ sung Nestlé NutriStrong Kids',0,'2025-06-04 01:24:15'),('66723adf-149c-41df-b7a1-2e43fbf3658d','Bộ sổ tay và bút ký Executive Suite',0,'2025-06-04 01:24:15'),('732ae55e-5ef8-40f5-81fe-e25730b08055','Áo khoác gió Sony SportX Pro',0,'2025-06-04 01:24:15'),('7359a6fd-90ac-413d-971e-85c1f79d9053','Ghế sofa thông minh LG ComfortWave',0,'2025-06-04 01:24:15'),('8ca6b5c1-4b1b-11f0-b066-005056c00001','AirPods 4 ',0,'2025-06-17 01:36:54'),('be5caf9f-e0bc-455b-93fc-0362e342c838','Điện thoại Samsung Galaxy Nova S',0,'2025-06-04 01:24:15'),('d0a1a5d8-432f-4a0e-b932-d7233c93b6b5','Máy xay sinh tố Panasonic MasterChef',0,'2025-06-04 01:24:15'),('e37b96e4-0ea4-4449-adcb-235b7fd336e0','Giày chạy bộ FlashRunner Pro 2025',0,'2025-06-04 01:24:15'),('e9f1c6e2-40b1-11ef-8b6b-c85acfb45d7a','Sản phẩm Điện tử từ Samsung',0,'2025-06-04 01:18:46'),('e9f1c9a8-40b1-11ef-8b6b-c85acfb45d7a','Sản phẩm Thực phẩm từ Apple (ví dụ)',0,'2025-06-04 01:18:46'),('e9f1cb42-40b1-11ef-8b6b-c85acfb45d7a','Sản phẩm Thời trang từ Sony (ví dụ)',0,'2025-06-04 01:18:46'),('e9f1ccd6-40b1-11ef-8b6b-c85acfb45d7a','Sản phẩm Nội thất từ LG',0,'2025-06-04 01:18:46'),('e9f1ce5c-40b1-11ef-8b6b-c85acfb45d7a','Sản phẩm Đồ gia dụng từ Panasonic',0,'2025-06-04 01:18:46'),('ed664b18-2aa5-49ff-b87e-b9d163600801','Nước ép hữu cơ AppleFarm Daily',0,'2025-06-04 01:24:15');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resources` (
  `resource_id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`resource_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
INSERT INTO `resources` VALUES ('225a4132-3eee-11f0-b0f1-c85acfb45d7a','users','Resource for users table','2025-06-01 13:41:34'),('225aac5d-3eee-11f0-b0f1-c85acfb45d7a','api_keys','Resource for api_keys table','2025-06-01 13:41:34'),('225b20c9-3eee-11f0-b0f1-c85acfb45d7a','categories','Resource for categories table','2025-06-01 13:41:34'),('225b8120-3eee-11f0-b0f1-c85acfb45d7a','manufacturers','Resource for manufacturers table','2025-06-01 13:41:34'),('225bf197-3eee-11f0-b0f1-c85acfb45d7a','products','Resource for products table','2025-06-01 13:41:34'),('225c52d6-3eee-11f0-b0f1-c85acfb45d7a','stock','Resource for stock table','2025-06-01 13:41:34'),('225cdd1c-3eee-11f0-b0f1-c85acfb45d7a','product_prices','Resource for product_prices table','2025-06-01 13:41:34'),('225d4ef0-3eee-11f0-b0f1-c85acfb45d7a','partners','Resource for partners table','2025-06-01 13:41:34'),('225e0450-3eee-11f0-b0f1-c85acfb45d7a','employees','Resource for employees table','2025-06-01 13:41:34'),('225e5374-3eee-11f0-b0f1-c85acfb45d7a','transactions','Resource for transactions table','2025-06-01 13:41:34'),('225ea75c-3eee-11f0-b0f1-c85acfb45d7a','parameters','Resource for parameters table','2025-06-01 13:41:34'),('225f0aff-3eee-11f0-b0f1-c85acfb45d7a','roles','Resource for roles table','2025-06-01 13:41:34'),('225f5e75-3eee-11f0-b0f1-c85acfb45d7a','permissions','Resource for permissions table','2025-06-01 13:41:34'),('225faa6c-3eee-11f0-b0f1-c85acfb45d7a','resources','Resource for resources table','2025-06-01 13:41:34'),('2260188f-3eee-11f0-b0f1-c85acfb45d7a','user_roles','Resource for user_roles table','2025-06-01 13:41:34'),('226064c7-3eee-11f0-b0f1-c85acfb45d7a','role_permissions','Resource for role_permissions table','2025-06-01 13:41:34');
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` char(36) NOT NULL,
  `permission_id` char(36) NOT NULL,
  `resource_id` char(36) NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`,`resource_id`),
  KEY `permission_id` (`permission_id`),
  KEY `resource_id` (`resource_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_ibfk_3` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`resource_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES ('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225a4132-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225aac5d-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225b20c9-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225b8120-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225bf197-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225c52d6-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225cdd1c-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225d4ef0-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225e0450-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225e5374-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225ea75c-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225f0aff-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225f5e75-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225faa6c-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','2260188f-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','226064c7-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225a4132-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225aac5d-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225b20c9-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225b8120-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225bf197-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225c52d6-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225cdd1c-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225d4ef0-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225e0450-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225e5374-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225ea75c-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225f0aff-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225f5e75-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','225faa6c-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','2260188f-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','225888e1-3eee-11f0-b0f1-c85acfb45d7a','226064c7-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225a4132-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225aac5d-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225b20c9-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225b8120-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225bf197-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225c52d6-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225cdd1c-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225d4ef0-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225e0450-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225e5374-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225ea75c-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225f0aff-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225f5e75-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','225faa6c-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','2260188f-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2258e777-3eee-11f0-b0f1-c85acfb45d7a','226064c7-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225a4132-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225aac5d-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225b20c9-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225b8120-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225bf197-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225c52d6-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225cdd1c-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225d4ef0-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225e0450-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225e5374-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225ea75c-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225f0aff-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225f5e75-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225faa6c-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','2260188f-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','226064c7-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225a4132-3eee-11f0-b0f1-c85acfb45d7a'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','2259458d-3eee-11f0-b0f1-c85acfb45d7a','225c52d6-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225a4132-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225aac5d-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225b20c9-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225b8120-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225bf197-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225c52d6-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225cdd1c-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225d4ef0-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225e0450-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225e5374-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225ea75c-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225f0aff-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225f5e75-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','225faa6c-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','2260188f-3eee-11f0-b0f1-c85acfb45d7a'),('2257856d-3eee-11f0-b0f1-c85acfb45d7a','2259c12f-3eee-11f0-b0f1-c85acfb45d7a','226064c7-3eee-11f0-b0f1-c85acfb45d7a');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES ('2257856d-3eee-11f0-b0f1-c85acfb45d7a','manager','Full access to all resources','2025-06-01 13:41:34'),('2257f1ac-3eee-11f0-b0f1-c85acfb45d7a','employee','Limited access to resources','2025-06-01 13:41:34');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `stock_id` char(36) NOT NULL DEFAULT (uuid()),
  `product_id` char(36) NOT NULL,
  `stock_quantity` int NOT NULL,
  `manufacturer_id` char(36) NOT NULL,
  `category_id` char(36) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`stock_id`),
  KEY `product_id` (`product_id`),
  KEY `manufacturer_id` (`manufacturer_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`manufacturer_id`) ON UPDATE CASCADE,
  CONSTRAINT `stock_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON UPDATE CASCADE,
  CONSTRAINT `stock_chk_1` CHECK ((`stock_quantity` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES ('0915c5fc-0fc4-4b97-a413-eab494dbddcb','e9f1c6e2-40b1-11ef-8b6b-c85acfb45d7a',69,'db2d7985-40ad-11f0-a5d6-c85acfb45d7a','c5aca7fd-40ad-11f0-a5d6-c85acfb45d7a',0),('2325aa2f-b443-4a0d-907e-e67f816b6118','e9f1c9a8-40b1-11ef-8b6b-c85acfb45d7a',132,'db2d7a15-40ad-11f0-a5d6-c85acfb45d7a',NULL,0),('4f909d46-dcec-4922-a0cc-b42c5f9b2412','e37b96e4-0ea4-4449-adcb-235b7fd336e0',125,'db2d78cd-40ad-11f0-a5d6-c85acfb45d7a','c5aca774-40ad-11f0-a5d6-c85acfb45d7a',0),('6e94277e-f35d-41cf-a132-4a91f613e45d','7359a6fd-90ac-413d-971e-85c1f79d9053',186,'db2d68d6-40ad-11f0-a5d6-c85acfb45d7a','c5aca29b-40ad-11f0-a5d6-c85acfb45d7a',0),('73dc8bb9-e3eb-458d-852b-cef17cb319fb','66723adf-149c-41df-b7a1-2e43fbf3658d',179,'db2d620d-40ad-11f0-a5d6-c85acfb45d7a','c5ac9708-40ad-11f0-a5d6-c85acfb45d7a',0),('8ca91516-4b1b-11f0-b066-005056c00001','8ca6b5c1-4b1b-11f0-b066-005056c00001',4,'db2d620d-40ad-11f0-a5d6-c85acfb45d7a','c5ac1e54-40ad-11f0-a5d6-c85acfb45d7a',0),('a64c7252-ee61-4eb3-8ad8-e66bce9c1351','be5caf9f-e0bc-455b-93fc-0362e342c838',130,'db2d750f-40ad-11f0-a5d6-c85acfb45d7a','c5aca57b-40ad-11f0-a5d6-c85acfb45d7a',0),('a796f531-a760-4c3b-95ab-15a2a951f8f0','d0a1a5d8-432f-4a0e-b932-d7233c93b6b5',108,'db2d781f-40ad-11f0-a5d6-c85acfb45d7a',NULL,0),('d76abbda-d251-47dd-a8ad-0df2d26e1b15','732ae55e-5ef8-40f5-81fe-e25730b08055',191,'db2d6416-40ad-11f0-a5d6-c85acfb45d7a',NULL,0);
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_headers`
--

DROP TABLE IF EXISTS `transaction_headers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_headers` (
  `header_id` char(36) NOT NULL DEFAULT (uuid()),
  `action` enum('import','export') NOT NULL,
  `partner_id` char(36) DEFAULT NULL,
  `employee_id` char(36) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` text,
  PRIMARY KEY (`header_id`),
  KEY `partner_id` (`partner_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `transaction_headers_ibfk_1` FOREIGN KEY (`partner_id`) REFERENCES `partners` (`partner_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `transaction_headers_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `transaction_headers_chk_1` CHECK ((`total_amount` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_headers`
--

LOCK TABLES `transaction_headers` WRITE;
/*!40000 ALTER TABLE `transaction_headers` DISABLE KEYS */;
INSERT INTO `transaction_headers` VALUES ('08365531-00b7-40a2-b453-8f3c05bcfbcd','import','afe24731-3eee-11f0-b0f1-c85acfb45d7a','8f554ebe-3eee-11f0-b0f1-c85acfb45d7a',100005.00,'2025-06-01 13:51:51',NULL),('0c9d405c-a2b4-4dc9-a12e-8a84ad674afa','import','d171fd25-40a6-11f0-a5d6-c85acfb45d7a','97c29fb9-408a-11f0-a5d6-c85acfb45d7a',2000.00,'2025-06-17 01:39:53',NULL),('10f39ba2-2090-4ab2-807e-02a55a2ea240','import','d172007f-40a6-11f0-a5d6-c85acfb45d7a','b8408cae-408a-11f0-a5d6-c85acfb45d7a',225.00,'2025-06-17 01:45:28',NULL),('35875a84-8491-49cb-b4f4-2a1801bbd228','import','d171d47f-40a6-11f0-a5d6-c85acfb45d7a','827da9ee-3eee-11f0-b0f1-c85acfb45d7a',5000.00,'2025-06-04 02:39:00',NULL),('3c29201d-4b1c-11f0-b066-005056c00001','export','d172020a-40a6-11f0-a5d6-c85acfb45d7a','cda498c8-408a-11f0-a5d6-c85acfb45d7a',500.00,'2025-06-17 01:41:47',NULL),('3c4f5a0e-bb0c-4551-b7ec-5ad0601087a5','import','d171fd25-40a6-11f0-a5d6-c85acfb45d7a','aa138a36-408a-11f0-a5d6-c85acfb45d7a',2000.00,'2025-06-17 01:44:13',NULL),('5309d1fc-4b1e-11f0-b066-005056c00001','export','d172049f-40a6-11f0-a5d6-c85acfb45d7a','87371ccb-408a-11f0-a5d6-c85acfb45d7a',260.00,'2025-06-17 01:56:44',NULL),('59253e11-a6b6-49dd-9d55-de7a90e6aa77','import','d171dc67-40a6-11f0-a5d6-c85acfb45d7a','cda498c8-408a-11f0-a5d6-c85acfb45d7a',150.00,'2025-06-17 01:48:13',NULL),('62f9f437-92fe-422a-8b45-918a487c53db','import','d172007f-40a6-11f0-a5d6-c85acfb45d7a','8f554ebe-3eee-11f0-b0f1-c85acfb45d7a',110000.00,'2025-06-04 02:47:36',NULL),('63ff64fd-4c5e-11f0-8ccd-c85acfb45d7a','export','d171fd25-40a6-11f0-a5d6-c85acfb45d7a','0949f80e-4c33-11f0-8ccd-c85acfb45d7a',650.00,'2025-06-18 16:07:52',NULL),('8df73ce1-2af8-475a-b198-558cdc435bb0','import','d171e054-40a6-11f0-a5d6-c85acfb45d7a','aa138a36-408a-11f0-a5d6-c85acfb45d7a',9000.00,'2025-06-17 01:46:37',NULL),('c700975e-40e4-11f0-a5d6-c85acfb45d7a','export','d171d47f-40a6-11f0-a5d6-c85acfb45d7a','827da9ee-3eee-11f0-b0f1-c85acfb45d7a',200.00,'2025-06-04 01:39:37',NULL),('e407a614-4b21-11f0-b066-005056c00001','export','d171e054-40a6-11f0-a5d6-c85acfb45d7a','8f3d3ca7-408a-11f0-a5d6-c85acfb45d7a',130.00,'2025-06-17 02:22:16',NULL),('f1033ded-40ec-11f0-bb36-c85acfb45d7a','export','d172007f-40a6-11f0-a5d6-c85acfb45d7a','e98dc77c-40eb-11f0-bb36-c85acfb45d7a',1500.00,'2025-06-04 02:38:01',NULL);
/*!40000 ALTER TABLE `transaction_headers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_items`
--

DROP TABLE IF EXISTS `transaction_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_items` (
  `item_id` char(36) NOT NULL DEFAULT (uuid()),
  `header_id` char(36) NOT NULL,
  `stock_id` char(36) DEFAULT NULL,
  `quantity` int NOT NULL,
  `price_per_unit_snapshot` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`item_id`),
  KEY `header_id` (`header_id`),
  KEY `stock_id` (`stock_id`),
  CONSTRAINT `transaction_items_ibfk_1` FOREIGN KEY (`header_id`) REFERENCES `transaction_headers` (`header_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `transaction_items_ibfk_2` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`stock_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `transaction_items_chk_1` CHECK ((`quantity` > 0)),
  CONSTRAINT `transaction_items_chk_2` CHECK ((`price_per_unit_snapshot` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_items`
--

LOCK TABLES `transaction_items` WRITE;
/*!40000 ALTER TABLE `transaction_items` DISABLE KEYS */;
INSERT INTO `transaction_items` VALUES ('139ec812-40ed-11f0-bb36-c85acfb45d7a','35875a84-8491-49cb-b4f4-2a1801bbd228','f455d510-3e8e-4e88-b196-e787571c6364',5,1000.00,'2025-06-04 02:39:02'),('222c1873-4b1d-11f0-b066-005056c00001','59253e11-a6b6-49dd-9d55-de7a90e6aa77','a64c7252-ee61-4eb3-8ad8-e66bce9c1351',1,150.00,'2025-06-17 01:48:14'),('3c2c9722-4b1c-11f0-b066-005056c00001','3c29201d-4b1c-11f0-b066-005056c00001','8ca91516-4b1b-11f0-b066-005056c00001',1,500.00,'2025-06-17 01:41:48'),('48078b24-40ee-11f0-bb36-c85acfb45d7a','62f9f437-92fe-422a-8b45-918a487c53db','d76abbda-d251-47dd-a8ad-0df2d26e1b15',100,100.00,'2025-06-04 02:47:40'),('48099849-40ee-11f0-bb36-c85acfb45d7a','62f9f437-92fe-422a-8b45-918a487c53db','a9d2a7d6-fc11-413c-a20d-fd4cfce56134',100,1000.00,'2025-06-04 02:47:40'),('530c5507-4b1e-11f0-b066-005056c00001','5309d1fc-4b1e-11f0-b066-005056c00001','0915c5fc-0fc4-4b97-a413-eab494dbddcb',2,130.00,'2025-06-17 01:56:46'),('6405532e-4c5e-11f0-8ccd-c85acfb45d7a','63ff64fd-4c5e-11f0-8ccd-c85acfb45d7a','0915c5fc-0fc4-4b97-a413-eab494dbddcb',5,130.00,'2025-06-18 16:07:53'),('93091f05-4b1c-11f0-b066-005056c00001','3c4f5a0e-bb0c-4551-b7ec-5ad0601087a5','a796f531-a760-4c3b-95ab-15a2a951f8f0',10,200.00,'2025-06-17 01:44:14'),('930b930f-3eef-11f0-b0f1-c85acfb45d7a','08365531-00b7-40a2-b453-8f3c05bcfbcd','649295e2-3eef-11f0-b0f1-c85acfb45d7a',200,500.00,'2025-06-01 13:51:53'),('930c76d1-3eef-11f0-b0f1-c85acfb45d7a','08365531-00b7-40a2-b453-8f3c05bcfbcd','649295e2-3eef-11f0-b0f1-c85acfb45d7a',1,5.00,'2025-06-01 13:51:53'),('c02c13d0-4b1c-11f0-b066-005056c00001','10f39ba2-2090-4ab2-807e-02a55a2ea240','2325aa2f-b443-4a0d-907e-e67f816b6118',1,150.00,'2025-06-17 01:45:30'),('c02df648-4b1c-11f0-b066-005056c00001','10f39ba2-2090-4ab2-807e-02a55a2ea240','4f909d46-dcec-4922-a0cc-b42c5f9b2412',1,75.00,'2025-06-17 01:45:30'),('c7024758-40e4-11f0-a5d6-c85acfb45d7a','c700975e-40e4-11f0-a5d6-c85acfb45d7a','a9d2a7d6-fc11-413c-a20d-fd4cfce56134',1,200.00,'2025-06-04 01:39:38'),('e40ad4c6-4b21-11f0-b066-005056c00001','e407a614-4b21-11f0-b066-005056c00001','0915c5fc-0fc4-4b97-a413-eab494dbddcb',1,130.00,'2025-06-17 02:22:18'),('e9367ad3-4b1c-11f0-b066-005056c00001','8df73ce1-2af8-475a-b198-558cdc435bb0','0915c5fc-0fc4-4b97-a413-eab494dbddcb',10,100.00,'2025-06-17 01:46:39'),('e9384c7c-4b1c-11f0-b066-005056c00001','8df73ce1-2af8-475a-b198-558cdc435bb0','6e94277e-f35d-41cf-a132-4a91f613e45d',20,400.00,'2025-06-17 01:46:39'),('f106b54e-40ec-11f0-bb36-c85acfb45d7a','f1033ded-40ec-11f0-bb36-c85acfb45d7a','649295e2-3eef-11f0-b0f1-c85acfb45d7a',3,500.00,'2025-06-04 02:38:04'),('f8bce725-4b1b-11f0-b066-005056c00001','0c9d405c-a2b4-4dc9-a12e-8a84ad674afa','8ca91516-4b1b-11f0-b066-005056c00001',5,400.00,'2025-06-17 01:39:55');
/*!40000 ALTER TABLE `transaction_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` char(36) NOT NULL,
  `role_id` char(36) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES ('2256d3df-3eee-11f0-b0f1-c85acfb45d7a','2257856d-3eee-11f0-b0f1-c85acfb45d7a'),('66ea52e8-3eee-11f0-b0f1-c85acfb45d7a','2257f1ac-3eee-11f0-b0f1-c85acfb45d7a'),('dd3c26bf-40eb-11f0-bb36-c85acfb45d7a','2257f1ac-3eee-11f0-b0f1-c85acfb45d7a');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` char(36) NOT NULL DEFAULT (uuid()),
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('2256d3df-3eee-11f0-b0f1-c85acfb45d7a','superadmin','superadmin','2025-06-01 13:41:34'),('66ea52e8-3eee-11f0-b0f1-c85acfb45d7a','User_001','User_001','2025-06-01 13:43:29'),('dd3c26bf-40eb-11f0-bb36-c85acfb45d7a','User_002','User_002','2025-06-04 02:30:22');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-19 10:10:57
