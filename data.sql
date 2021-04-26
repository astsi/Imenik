-- MySQL dump 10.16  Distrib 10.1.26-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: db
-- ------------------------------------------------------
-- Server version	10.1.26-MariaDB-0+deb9u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dbo.Kontakti`
--

DROP TABLE IF EXISTS `dbo.Kontakti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbo.Kontakti` (
  `ID` tinyint(4) DEFAULT NULL,
  `Ime` varchar(10) DEFAULT NULL,
  `Prezime` varchar(10) DEFAULT NULL,
  `Tip` varchar(12) DEFAULT NULL,
  `Opis` varchar(21) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dbo.Kontakti`
--

LOCK TABLES `dbo.Kontakti` WRITE;
/*!40000 ALTER TABLE `dbo.Kontakti` DISABLE KEYS */;
INSERT INTO `dbo.Kontakti` VALUES (1,'Anastasija','Mihajlenko','Tip kontakta','koleginica sa posla'),(3,'Pera','Peric','Tip','domar'),(66,'Joca','Jocic','usluge','vodoinstalater'),(67,'Jadranka','Jovanovic','porodica','baka'),(68,'Jana','*','komsiluk','*'),(72,'Nada','*','zdravlje','doktorka'),(73,'Goca','Peric','prijatelji','*'),(74,'Nadja','*','posao','koleginica'),(76,'ty','rt','Tip kontakta','npr. Pera sa IT obuke');
/*!40000 ALTER TABLE `dbo.Kontakti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dbo.Telefoni`
--

DROP TABLE IF EXISTS `dbo.Telefoni`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbo.Telefoni` (
  `ID` tinyint(4) DEFAULT NULL,
  `Broj` bigint(20) DEFAULT NULL,
  `Tip` varchar(15) DEFAULT NULL,
  `kontaktid` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dbo.Telefoni`
--

LOCK TABLES `dbo.Telefoni` WRITE;
/*!40000 ALTER TABLE `dbo.Telefoni` DISABLE KEYS */;
INSERT INTO `dbo.Telefoni` VALUES (2,612779551,'mobilni telefon',1),(4,612335543,'mobilni',3),(50,18222333,'fiksni',66),(51,643332223,'mobilni',67),(52,18666777,'fiksni',67),(53,654442221,'mobilni',68),(57,222333,'fiksni',3),(71,777888,'ordinacija',72),(72,12222333,'fiksni',73);
/*!40000 ALTER TABLE `dbo.Telefoni` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dbo.__EFMigrationsHistory`
--

DROP TABLE IF EXISTS `dbo.__EFMigrationsHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dbo.__EFMigrationsHistory` (
  `MigrationId` varchar(17) DEFAULT NULL,
  `ProductVersion` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dbo.__EFMigrationsHistory`
--

LOCK TABLES `dbo.__EFMigrationsHistory` WRITE;
/*!40000 ALTER TABLE `dbo.__EFMigrationsHistory` DISABLE KEYS */;
INSERT INTO `dbo.__EFMigrationsHistory` VALUES ('20210421213031_V1','5.0.5');
/*!40000 ALTER TABLE `dbo.__EFMigrationsHistory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-22 15:20:24
