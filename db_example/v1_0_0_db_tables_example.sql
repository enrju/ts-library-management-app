-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 18, 2022 at 06:29 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `megak_library`
--

-- --------------------------------------------------------

--
-- Table structure for table `author_entity`
--

CREATE TABLE `author_entity` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `author_entity`
--

INSERT INTO `author_entity` (`id`, `name`, `surname`) VALUES
(1, 'Adam', 'Mickiewicz'),
(2, 'Bolesław', 'Prus'),
(3, 'Stanisław', 'Wyspiański'),
(4, 'J.K.', 'Rowling'),
(5, 'Liz', 'Soars'),
(6, 'John', 'Soars');

-- --------------------------------------------------------

--
-- Table structure for table `book_entity`
--

CREATE TABLE `book_entity` (
  `id` int(11) NOT NULL,
  `state` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `return_until` datetime DEFAULT NULL,
  `titleEntityId` int(11) DEFAULT NULL,
  `userEntityId` varchar(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `book_entity`
--

INSERT INTO `book_entity` (`id`, `state`, `return_until`, `titleEntityId`, `userEntityId`) VALUES
(1, 'available', NULL, 1, NULL),
(2, 'available', NULL, 1, NULL),
(3, 'available', NULL, 2, NULL),
(4, 'available', NULL, 3, NULL),
(5, 'available', NULL, 3, NULL),
(6, 'available', NULL, 4, NULL),
(7, 'available', NULL, 5, NULL),
(8, 'available', NULL, 6, NULL),
(9, 'available', NULL, 7, NULL),
(10, 'available', NULL, 7, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `title_author_entity`
--

CREATE TABLE `title_author_entity` (
  `id` int(11) NOT NULL,
  `titleEntityId` int(11) DEFAULT NULL,
  `authorEntityId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `title_author_entity`
--

INSERT INTO `title_author_entity` (`id`, `titleEntityId`, `authorEntityId`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 2),
(4, 4, 3),
(5, 5, 4),
(6, 6, 4),
(7, 7, 5),
(8, 7, 6);

-- --------------------------------------------------------

--
-- Table structure for table `title_entity`
--

CREATE TABLE `title_entity` (
  `id` int(11) NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `title_entity`
--

INSERT INTO `title_entity` (`id`, `title`) VALUES
(1, 'Dziady'),
(2, 'Pan Tadeusz'),
(3, 'Lalka'),
(4, 'Wesele'),
(5, 'Harry Potter i kamień filozoficzny'),
(6, 'Harry Potter i komnata tajemnic'),
(7, 'Headway');

-- --------------------------------------------------------

--
-- Table structure for table `user_entity`
--

CREATE TABLE `user_entity` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `currentTokenId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_entity`
--

INSERT INTO `user_entity` (`id`, `name`, `surname`, `email`, `passwordHash`, `currentTokenId`, `role`) VALUES
('059f6859-788c-4221-92ed-d71dc81860d9', 'Tester-1', 'Testowy-1', 'tester-1@test.com', '$2b$10$NC30TwVQ9oS3gM8aJQcgXu8OLvwRGVmVZLpH3Z5fvTGlstceaFMbK', NULL, 'user'),
('6217cd8e-669c-41cf-b7cd-ce51d2fb6e17', 'Tester-admin', 'Testowy-admin', 'tester-admin@test.com', '$2b$10$Ye1x9IBBiA.9zlLMZGUWZe5vxGo0llJ.aG7hxprueTV5l9MfThp0u', NULL, 'admin'),
('e9f73b65-addc-400c-9ed4-5e8f16af62ca', 'Tester-2', 'Testowy-2', 'tester-2@test.com', '$2b$10$MCyz5oLpmuwfbh8GYv0c.ePNhnBmAhoASBNM8ezKHkyqCOK7RT4Ii', NULL, 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `author_entity`
--
ALTER TABLE `author_entity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `book_entity`
--
ALTER TABLE `book_entity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_bb4029f81288d968b72066853fb` (`titleEntityId`),
  ADD KEY `FK_55018ecbb381d3dae54d713f34b` (`userEntityId`);

--
-- Indexes for table `title_author_entity`
--
ALTER TABLE `title_author_entity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_2242edcd851a3fc2d2d2c535b61` (`titleEntityId`),
  ADD KEY `FK_58c9fdecbc40425ba7180ba68e2` (`authorEntityId`);

--
-- Indexes for table `title_entity`
--
ALTER TABLE `title_entity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_entity`
--
ALTER TABLE `user_entity`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `author_entity`
--
ALTER TABLE `author_entity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `book_entity`
--
ALTER TABLE `book_entity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `title_author_entity`
--
ALTER TABLE `title_author_entity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `title_entity`
--
ALTER TABLE `title_entity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `book_entity`
--
ALTER TABLE `book_entity`
  ADD CONSTRAINT `FK_55018ecbb381d3dae54d713f34b` FOREIGN KEY (`userEntityId`) REFERENCES `user_entity` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_bb4029f81288d968b72066853fb` FOREIGN KEY (`titleEntityId`) REFERENCES `title_entity` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `title_author_entity`
--
ALTER TABLE `title_author_entity`
  ADD CONSTRAINT `FK_2242edcd851a3fc2d2d2c535b61` FOREIGN KEY (`titleEntityId`) REFERENCES `title_entity` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_58c9fdecbc40425ba7180ba68e2` FOREIGN KEY (`authorEntityId`) REFERENCES `author_entity` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
