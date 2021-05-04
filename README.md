# Data Warehouse

**Acamica DWFS.**

**Proyecto integrador Data Warehouse**

Este proyecto plantea la creación de un sitio web que permita a una compañia de marketing administrar todos los contactos de sus clientes. El sitio permite realizar operaciones CRUD sobre distintos endpoints que involucran usuarios, contactos, regiones, paises y ciudades.

La creación del backend de la aplicación se hizo mediante Node.js, Express.js, MySQL (utilizando el gestor de base de datos XAMPP) y sequelize ORM. Se usó Postman para realizar las pruebas.
Para el frontend se usó bootstrap 5 mediante el sistema de gestión de paquetes npm y Sass como preprocesador CSS

Para probar la API se debe contar principalmente con Node.js y MySQL en el entorno local. Primero se debe importar la base de datos 'warehouse.sql' incluida en el fichero 'backend'. El script crea la base de datos si no existe, y la utiliza con el nombre de 'warehouse' por lo que se recomienda no tener otra base de datos con el mismo nombre. Usando XAMPP se puede importar la base, accediendo a http://localhost/phpmyadmin/ en la pestaña 'importar' o directamente en la ruta http://localhost/phpmyadmin/server_import.php. Una vez allí, dar clic en 'Seleccionar archivo' y ubicar el archivo sql.
Finalmente dar clic en 'Continuar'.

![screenshot1](https://user-images.githubusercontent.com/42284483/103461969-084c1d00-4cf0-11eb-9e38-585c6ef9852c.jpg)

Para probar la aplicación se deben instalar las dependencias necesarias. Por tanto es necesario ejecutar el comando `npm install` por medio de una terminal ubicando la ruta donde se encuentra la carpeta backend del proyecto.  
Luego de instalar las dependecias se puede proceder a ejecutar el servidor en la ruta de la carpeta backend por medio del comando `node server.js`. El servidor estará escuchando entonces las conexiones a través del puerto 3000. Adicionalmente se debe tener en ejecución los servidores de XAMPP para acceder a la base de datos. 
Finalmente con el servidor inicializado y con XAMPP en ejecución se tiene todo preparado para probar la aplicación. Se hace uso de la extensión Live Server de Visual Studio Code que provee un servidor local para lanzar la aplicación desde el archivo 'login.html' 

![image1](https://user-images.githubusercontent.com/42284483/116962895-f0b87d00-ac6c-11eb-93e1-c0baa5a37bc8.png)

Para la autenticación de usuarios se utilizó JWT, por lo que si se quiere acceder como administrador se pueden utilizar las siguientes credenciales: {"usuario": "admin@admin.com", "password": "admin"}. Como usuario administrador se tiene acceso a la creación de usuarios y otras funciones. Si se quiere acceder como un usuario básico se puede utilizar: {"usuario": "usuario@usuario.com", "password": "1234"}

![image2](https://user-images.githubusercontent.com/42284483/116962940-15acf000-ac6d-11eb-8198-c209fc0617a4.png)
