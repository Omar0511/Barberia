# Proyecto Barberia

## Tecnologías y/o Herramientas Utilizadas

- HTML5
- SASS
- JAVASCRIPT
- GULP
- NPM
- ACTIVE RECORD
- COMPOSER
- MAILTRAP
- PHPMAILER
- MYSQL
- PHP (MVC)
- SWEET ALERT2
- POSTMAN

### Descripción

- Proyecto diseñado para una barberia o un salón donde se lleva a cabo el registro de citas, servicios, autenticación mediante token, control mediante un ADMIN y generando vistas distintas a los usuarios, adaptación a distintos dispositivos, código limpio y buenas prácticas utilizando arquitectura MVC.

#### Sitio

- **[barber]()**

#### Primeros Pasos

- **_npm install_**
- **_npm run gulp_**
    - Se crea el: **_build_**
- **_composer init_**
    - omar/barber
    - proyecto php 8, mvc, mysql, sass, gulp
    - enter
    - project
    - (require) interactively: NO
    - (require-dev) interactively: NO
    - confirm generation?: yes
        - Se crea el: **_composer.json_** y el **_vendor_**
    - En el archivo: **_composer.json_**, configuramos lo siguiente:
        ```
            "autoload": {
                "psr-4": {
                    "MVC\\": "./",
                    "Controllers\\" : "./controllers",
                    "Model\\" : "./models"
                }
            },
        ```
    - Después ejecutamos:
        - **_composer update_**

