-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 09, 2025 at 05:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `enrollment_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `institute_tbl`
--

CREATE TABLE `institute_tbl` (
  `ins_id` int(11) NOT NULL,
  `ins_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `institute_tbl`
--

INSERT INTO `institute_tbl` (`ins_id`, `ins_name`) VALUES
(1, 'College of Engineering'),
(2, 'College of Information Technology'),
(3, 'College of Business'),
(4, 'College of Education'),
(5, 'College of Arts and Sciences');

-- --------------------------------------------------------

--
-- Table structure for table `program_tbl`
--

CREATE TABLE `program_tbl` (
  `program_id` int(11) NOT NULL,
  `program_name` varchar(100) DEFAULT NULL,
  `ins_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `program_tbl`
--

INSERT INTO `program_tbl` (`program_id`, `program_name`, `ins_id`) VALUES
(1, 'BS Civil Engineering', 1),
(2, 'BS Computer Science', 2),
(3, 'BS Information Systems', 2),
(4, 'BS Accountancy', 3),
(5, 'BSEd Major in Math', 4);

-- --------------------------------------------------------

--
-- Table structure for table `semester_tbl`
--

CREATE TABLE `semester_tbl` (
  `sem_id` int(11) NOT NULL,
  `sem_name` varchar(50) DEFAULT NULL,
  `year_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `semester_tbl`
--

INSERT INTO `semester_tbl` (`sem_id`, `sem_name`, `year_id`) VALUES
(1, '1st Semester', 1),
(2, '2nd Semester', 1),
(3, '1st Semester', 2),
(4, '2nd Semester', 2),
(5, 'Summer', 2);

-- --------------------------------------------------------

--
-- Table structure for table `student_load`
--

CREATE TABLE `student_load` (
  `load_id` int(11) NOT NULL,
  `stud_id` int(11) DEFAULT NULL,
  `subject_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `student_load`
--

INSERT INTO `student_load` (`load_id`, `stud_id`, `subject_id`) VALUES
(0, 18, 1),
(1, 1, 1),
(3, 2, 3),
(7, 43, 3);

-- --------------------------------------------------------

--
-- Table structure for table `student_tbl`
--

CREATE TABLE `student_tbl` (
  `stud_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `program_id` int(11) DEFAULT NULL,
  `allowance` float(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `student_tbl`
--

INSERT INTO `student_tbl` (`stud_id`, `name`, `program_id`, `allowance`) VALUES
(0, 'Luis Adam Dela Cruz', 3, 500.00),
(1, 'Bianca Santos', 3, 500.00),
(2, 'Cedric Umali', 2, 600.00),
(3, 'Anna Garcia', 1, 700.00),
(4, 'John Cruz', 4, 800.00),
(5, 'Maria Lopez', 5, 900.00),
(6, 'Luis Reyes', 1, 510.50),
(7, 'Ella Mendoza', 3, 620.00),
(8, 'Carlos Diaz', 2, 730.25),
(9, 'Nina Patel', 4, 840.75),
(10, 'Mark Villanueva', 5, 950.10),
(11, 'Sophia Thomas', 1, 560.00),
(12, 'James Lim', 2, 670.20),
(13, 'Olivia Cruz', 3, 780.55),
(14, 'Ethan Ramirez', 4, 890.80),
(15, 'Mia Santos', 5, 910.00),
(16, 'Jacob Lee', 1, 520.00),
(17, 'Grace Kim', 3, 635.75),
(18, 'Benjamin Flores', 2, 755.25),
(19, 'Chloe Gonzales', 4, 865.50),
(20, 'Daniel Murphy', 5, 975.00),
(21, 'Isabella Rivera', 1, 585.00),
(22, 'Alexander Cruz', 2, 695.75),
(23, 'Emma Morales', 3, 805.10),
(24, 'Michael Scott', 4, 920.90),
(25, 'Ava Bennett', 5, 985.50),
(41, 'Retchelle Carpio', 1, 500.00),
(42, 'Kobe T. Deacosta', 3, 900.00),
(43, 'Janeth Cajara', 3, 1000.00);

-- --------------------------------------------------------

--
-- Table structure for table `subject_tbl`
--

CREATE TABLE `subject_tbl` (
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(100) DEFAULT NULL,
  `sem_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `subject_tbl`
--

INSERT INTO `subject_tbl` (`subject_id`, `subject_name`, `sem_id`) VALUES
(1, 'Introduction to Programming', 1),
(2, 'Data Structures', 2),
(3, 'Database Management', 3),
(4, 'Accounting Principles', 4),
(5, 'Educational Psychology', 5);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_all_students`
-- (See below for the actual view)
--
CREATE TABLE `view_all_students` (
`name` varchar(100)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_students_above_average_allowance`
-- (See below for the actual view)
--
CREATE TABLE `view_students_above_average_allowance` (
`name` varchar(100)
,`allowance` float(10,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_students_bsed_major_math`
-- (See below for the actual view)
--
CREATE TABLE `view_students_bsed_major_math` (
`name` varchar(100)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_students_bs_accountancy`
-- (See below for the actual view)
--
CREATE TABLE `view_students_bs_accountancy` (
`name` varchar(100)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_students_bs_civil_engineering`
-- (See below for the actual view)
--
CREATE TABLE `view_students_bs_civil_engineering` (
`name` varchar(100)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_students_bs_computer_science`
-- (See below for the actual view)
--
CREATE TABLE `view_students_bs_computer_science` (
`name` varchar(100)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_students_bs_information_systems`
-- (See below for the actual view)
--
CREATE TABLE `view_students_bs_information_systems` (
`name` varchar(100)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_students_with_programs`
-- (See below for the actual view)
--
CREATE TABLE `view_students_with_programs` (
`name` varchar(100)
,`program_name` varchar(100)
);

-- --------------------------------------------------------

--
-- Table structure for table `year_tbl`
--

CREATE TABLE `year_tbl` (
  `year_id` int(11) NOT NULL,
  `year_from` int(11) DEFAULT NULL,
  `year_to` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `year_tbl`
--

INSERT INTO `year_tbl` (`year_id`, `year_from`, `year_to`) VALUES
(1, 2023, 2024),
(2, 2024, 2025),
(3, 2025, 2026),
(4, 2026, 2027),
(5, 2027, 2028);

-- --------------------------------------------------------

--
-- Structure for view `view_all_students`
--
DROP TABLE IF EXISTS `view_all_students`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_all_students`  AS SELECT `student_tbl`.`name` AS `name` FROM `student_tbl` ;

-- --------------------------------------------------------

--
-- Structure for view `view_students_above_average_allowance`
--
DROP TABLE IF EXISTS `view_students_above_average_allowance`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_students_above_average_allowance`  AS SELECT `student_tbl`.`name` AS `name`, `student_tbl`.`allowance` AS `allowance` FROM `student_tbl` WHERE `student_tbl`.`allowance` > (select avg(`student_tbl`.`allowance`) from `student_tbl`) ;

-- --------------------------------------------------------

--
-- Structure for view `view_students_bsed_major_math`
--
DROP TABLE IF EXISTS `view_students_bsed_major_math`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_students_bsed_major_math`  AS SELECT `student_tbl`.`name` AS `name` FROM `student_tbl` WHERE `student_tbl`.`program_id` = (select `program_tbl`.`program_id` from `program_tbl` where `program_tbl`.`program_name` = 'BSED Major in Math') ;

-- --------------------------------------------------------

--
-- Structure for view `view_students_bs_accountancy`
--
DROP TABLE IF EXISTS `view_students_bs_accountancy`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_students_bs_accountancy`  AS SELECT `student_tbl`.`name` AS `name` FROM `student_tbl` WHERE `student_tbl`.`program_id` = (select `program_tbl`.`program_id` from `program_tbl` where `program_tbl`.`program_name` = 'BS Accountancy') ;

-- --------------------------------------------------------

--
-- Structure for view `view_students_bs_civil_engineering`
--
DROP TABLE IF EXISTS `view_students_bs_civil_engineering`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_students_bs_civil_engineering`  AS SELECT `student_tbl`.`name` AS `name` FROM `student_tbl` WHERE `student_tbl`.`program_id` = (select `program_tbl`.`program_id` from `program_tbl` where `program_tbl`.`program_name` = 'BS Civil Engineering') ;

-- --------------------------------------------------------

--
-- Structure for view `view_students_bs_computer_science`
--
DROP TABLE IF EXISTS `view_students_bs_computer_science`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_students_bs_computer_science`  AS SELECT `student_tbl`.`name` AS `name` FROM `student_tbl` WHERE `student_tbl`.`program_id` = (select `program_tbl`.`program_id` from `program_tbl` where `program_tbl`.`program_name` = 'BS COmputer Science') ;

-- --------------------------------------------------------

--
-- Structure for view `view_students_bs_information_systems`
--
DROP TABLE IF EXISTS `view_students_bs_information_systems`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_students_bs_information_systems`  AS SELECT `student_tbl`.`name` AS `name` FROM `student_tbl` WHERE `student_tbl`.`program_id` = (select `program_tbl`.`program_id` from `program_tbl` where `program_tbl`.`program_name` = 'BS Information Systems') ;

-- --------------------------------------------------------

--
-- Structure for view `view_students_with_programs`
--
DROP TABLE IF EXISTS `view_students_with_programs`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_students_with_programs`  AS SELECT `s`.`name` AS `name`, `p`.`program_name` AS `program_name` FROM (`student_tbl` `s` join `program_tbl` `p` on(`s`.`program_id` = `p`.`program_id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `institute_tbl`
--
ALTER TABLE `institute_tbl`
  ADD PRIMARY KEY (`ins_id`);

--
-- Indexes for table `program_tbl`
--
ALTER TABLE `program_tbl`
  ADD PRIMARY KEY (`program_id`),
  ADD KEY `ins_id` (`ins_id`);

--
-- Indexes for table `semester_tbl`
--
ALTER TABLE `semester_tbl`
  ADD PRIMARY KEY (`sem_id`),
  ADD KEY `year_id` (`year_id`);

--
-- Indexes for table `student_load`
--
ALTER TABLE `student_load`
  ADD PRIMARY KEY (`load_id`),
  ADD KEY `stud_id` (`stud_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `student_tbl`
--
ALTER TABLE `student_tbl`
  ADD PRIMARY KEY (`stud_id`),
  ADD KEY `program_id` (`program_id`);

--
-- Indexes for table `subject_tbl`
--
ALTER TABLE `subject_tbl`
  ADD PRIMARY KEY (`subject_id`),
  ADD KEY `sem_id` (`sem_id`);

--
-- Indexes for table `year_tbl`
--
ALTER TABLE `year_tbl`
  ADD PRIMARY KEY (`year_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `program_tbl`
--
ALTER TABLE `program_tbl`
  ADD CONSTRAINT `program_tbl_ibfk_1` FOREIGN KEY (`ins_id`) REFERENCES `institute_tbl` (`ins_id`);

--
-- Constraints for table `semester_tbl`
--
ALTER TABLE `semester_tbl`
  ADD CONSTRAINT `semester_tbl_ibfk_1` FOREIGN KEY (`year_id`) REFERENCES `year_tbl` (`year_id`);

--
-- Constraints for table `student_load`
--
ALTER TABLE `student_load`
  ADD CONSTRAINT `student_load_ibfk_1` FOREIGN KEY (`stud_id`) REFERENCES `student_tbl` (`stud_id`),
  ADD CONSTRAINT `student_load_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subject_tbl` (`subject_id`);

--
-- Constraints for table `student_tbl`
--
ALTER TABLE `student_tbl`
  ADD CONSTRAINT `student_tbl_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `program_tbl` (`program_id`);

--
-- Constraints for table `subject_tbl`
--
ALTER TABLE `subject_tbl`
  ADD CONSTRAINT `subject_tbl_ibfk_1` FOREIGN KEY (`sem_id`) REFERENCES `semester_tbl` (`sem_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
