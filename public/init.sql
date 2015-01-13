DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `userid` varchar(36) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `facebookid` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `guesses`;

CREATE TABLE `guesses` (
  `guessid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userid` varchar(36) DEFAULT NULL,
  `phrase` varchar(50) DEFAULT NULL,
  `guess` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`userid`, `phrase`),
  UNIQUE KEY `guessid` (`guessid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
