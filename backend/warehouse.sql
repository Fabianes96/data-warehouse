-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 04-05-2021 a las 04:51:37
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `warehouse`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canales`
--

CREATE TABLE `canales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `canales`
--

INSERT INTO `canales` (`id`, `nombre`) VALUES
(1, 'Teléfono'),
(2, 'Whatsapp'),
(3, 'Instagram'),
(4, 'Facebook'),
(5, 'Linkedin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canalesPorContactos`
--

CREATE TABLE `canalesPorContactos` (
  `id` int(11) NOT NULL,
  `contacto` int(11) NOT NULL,
  `canal` int(11) NOT NULL,
  `preferencia` int(11) NOT NULL,
  `cuenta` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `canalesPorContactos`
--

INSERT INTO `canalesPorContactos` (`id`, `contacto`, `canal`, `preferencia`, `cuenta`) VALUES
(2, 1, 1, 1, '4442444'),
(3, 2, 3, 3, ''),
(18, 5, 2, 2, '12712368729'),
(29, 14, 2, 2, '323093278439');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `id` int(11) NOT NULL,
  `pais` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `ciudades`
--

INSERT INTO `ciudades` (`id`, `pais`, `nombre`) VALUES
(1, 2, 'Medellín'),
(2, 3, 'Buenos Aires'),
(3, 3, 'Córdoba'),
(4, 2, 'Bogotá'),
(5, 2, 'Cali'),
(7, 6, 'Panamá'),
(8, 6, 'Colón'),
(14, 13, 'Ciudad de México'),
(16, 9, 'Brasilia'),
(18, 14, 'Munich'),
(19, 13, 'Veracruz'),
(24, 22, 'Madrid');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `companias`
--

CREATE TABLE `companias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `ciudad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `companias`
--

INSERT INTO `companias` (`id`, `nombre`, `direccion`, `email`, `telefono`, `ciudad`) VALUES
(1, 'Softtek', 'Carrera 35 # 89-00', 'sofftek@sofftek.com', '+52 23742834', 14),
(2, 'Globant', 'Carrera de prueba', 'globant@globant.com', '+54 09238473641', 2),
(3, 'Rappi', 'Calle 80#9090', 'rappi@rappi.com', '+57 3082638263', 4),
(4, 'Mercadolibre', 'Avenida 90 #32-22', 'mercadolibre@mercadolibre.com', '+54 576832643', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contactos`
--

CREATE TABLE `contactos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `cargo` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `compania` int(11) NOT NULL,
  `ciudad` int(11) NOT NULL,
  `interes` int(11) NOT NULL,
  `direccion` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `contactos`
--

INSERT INTO `contactos` (`id`, `nombre`, `apellido`, `cargo`, `email`, `compania`, `ciudad`, `interes`, `direccion`) VALUES
(1, 'Fabian', 'Higuita', 'Desarrollador', 'fabianes1996@gmail.com', 2, 1, 5, 'calle 79B #87-42'),
(2, 'Camila', 'Soledad Pantó', 'UX Designer', 'camilapanto123@gmail.com', 4, 2, 2, 'Bv. San Juan 327'),
(4, 'Agustin Emanuel', 'Soria', 'UI Designer', 'emanuel@gmail.co', 3, 4, 2, 'Av las americas'),
(5, 'Prueba', 'Prueba', 'Prueba', 'prueba@prruba.com', 1, 3, 3, 'Av 90 #789'),
(8, 'Andres', 'Hernandez', 'Ingeniero QA', 'andres@gmail.com', 2, 4, 4, 'Calle 1'),
(13, 'test', 'test', 'Tester', 'test@test', 4, 19, 3, 'Avenida 80'),
(14, 'Dario', 'Alvarez', 'Ingeniero Backend', 'dario@gmail.com', 1, 16, 1, 'Carrera 23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `interes`
--

CREATE TABLE `interes` (
  `id` int(11) NOT NULL,
  `porcentaje` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `interes`
--

INSERT INTO `interes` (`id`, `porcentaje`) VALUES
(1, 0),
(2, 25),
(3, 50),
(4, 75),
(5, 100);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paises`
--

CREATE TABLE `paises` (
  `id` int(11) NOT NULL,
  `region` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `paises`
--

INSERT INTO `paises` (`id`, `region`, `nombre`) VALUES
(2, 1, 'Colombia'),
(3, 1, 'Argentina'),
(6, 3, 'Panamá'),
(9, 1, 'Brasil'),
(13, 2, 'Mexico'),
(14, 4, 'Alemania'),
(22, 4, 'España');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preferencias`
--

CREATE TABLE `preferencias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `preferencias`
--

INSERT INTO `preferencias` (`id`, `nombre`) VALUES
(1, 'Sin preferencia'),
(2, 'Canal favorito'),
(3, 'No molestar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `regiones`
--

CREATE TABLE `regiones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `regiones`
--

INSERT INTO `regiones` (`id`, `nombre`) VALUES
(1, 'Sudamérica'),
(2, 'Norteamérica'),
(3, 'Centroamérica'),
(4, 'Europa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `perfil` int(2) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `perfil`, `password`) VALUES
(1, 'Fabian', 'Higuita', 'fabian@fabian.com', 1, '81dc9bdb52d04dc20036dbd8313ed055'),
(2, 'admin', 'admin', 'admin@admin.com', 1, '21232f297a57a5a743894a0e4a801fc3'),
(21, 'Usuario', 'Uno', 'usuario@usuario.com', 0, '81dc9bdb52d04dc20036dbd8313ed055'),
(23, 'Usuario', 'Dos', 'usuario2@hotmail.com', 0, '81dc9bdb52d04dc20036dbd8313ed055'),
(24, 'Prueba', 'Prueba', 'prueba@prueba.com', 0, '81dc9bdb52d04dc20036dbd8313ed055');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `canales`
--
ALTER TABLE `canales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `canalesPorContactos`
--
ALTER TABLE `canalesPorContactos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contacto` (`contacto`),
  ADD KEY `canal` (`canal`),
  ADD KEY `preferencia` (`preferencia`);

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pais` (`pais`);

--
-- Indices de la tabla `companias`
--
ALTER TABLE `companias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ciudad` (`ciudad`);

--
-- Indices de la tabla `contactos`
--
ALTER TABLE `contactos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ciudad` (`ciudad`),
  ADD KEY `compania` (`compania`),
  ADD KEY `interes` (`interes`);

--
-- Indices de la tabla `interes`
--
ALTER TABLE `interes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `paises`
--
ALTER TABLE `paises`
  ADD PRIMARY KEY (`id`),
  ADD KEY `region` (`region`);

--
-- Indices de la tabla `preferencias`
--
ALTER TABLE `preferencias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `regiones`
--
ALTER TABLE `regiones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `canales`
--
ALTER TABLE `canales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `canalesPorContactos`
--
ALTER TABLE `canalesPorContactos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `companias`
--
ALTER TABLE `companias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `contactos`
--
ALTER TABLE `contactos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `interes`
--
ALTER TABLE `interes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `paises`
--
ALTER TABLE `paises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `preferencias`
--
ALTER TABLE `preferencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `regiones`
--
ALTER TABLE `regiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `canalesPorContactos`
--
ALTER TABLE `canalesPorContactos`
  ADD CONSTRAINT `canal` FOREIGN KEY (`canal`) REFERENCES `canales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contacto` FOREIGN KEY (`contacto`) REFERENCES `contactos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `preferencia` FOREIGN KEY (`preferencia`) REFERENCES `preferencias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD CONSTRAINT `pais` FOREIGN KEY (`pais`) REFERENCES `paises` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `companias`
--
ALTER TABLE `companias`
  ADD CONSTRAINT `companias_ibfk_1` FOREIGN KEY (`ciudad`) REFERENCES `ciudades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `contactos`
--
ALTER TABLE `contactos`
  ADD CONSTRAINT `ciudad` FOREIGN KEY (`ciudad`) REFERENCES `ciudades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `compania` FOREIGN KEY (`compania`) REFERENCES `companias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `interes` FOREIGN KEY (`interes`) REFERENCES `interes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `paises`
--
ALTER TABLE `paises`
  ADD CONSTRAINT `region` FOREIGN KEY (`region`) REFERENCES `regiones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
