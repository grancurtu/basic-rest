#Servidor Simple


### Dependencias
* express
* body-parser
* sqlite3

###Instalacion

* Descargar o clonar el proyecto
* Instalar dependencias
`npm install`
* Inicializar la base de datos que se usara
` npm run init-DB`

* Correr el servidor
`npm run start-server`


#Servicios


El servidor expone 3 rutas: ```/user```, ```/aprove``` y ```/sales```  donde se exponen todos servicios, a los cuales se acceden de distintos métodos http.


##Servicios de Usuario

###Crear

Se invoca haciendo un **post** a la ruta ```localhost:3000/user``` y recibe los parámetros en el body del request.
Ejemplo de parámetros:

```
{
"name": "Nombre",
"lastname":"Apellido",
"email":"simple@mail.com",
"address":"calle false 123"
}
```

De los parámetros el unico  opcional es **address** el resto son todos obligatorios.
Si el servicio se ejecuta correctamente la respuesta es un 200 con un mensaje que se realizo el registro.


###Aprobar

Se invoca haciendo un **post** a la ruta ```localhost:3000/approve``` y recibe los parámetros en el body del request
Ejemplos:

```
{
"email": "simple@mail.com"
}
```

Recibe solo el parámetro **email**  que es obligatorio
Si el servicio se ejecuta correctamente la respuesta es un 200, indicando si se realizaron la aprobación o si ningún registro fue alcanzado.

###Actualizar

Se invoca haciendo un **put** a la ruta ```localhost:3000/user``` y recibe los parámetros en el body del request
Ejemplos:

```
{
"email":"simple@mail.com",
"name":"Nombre",
"address":"calle verdadera 123"
}


{
"email":"simple@mail.com",
"name":"Nombre Nuevo"
}
```
De los parámetros el único mandatario es **email** el resto son todos opcionales.
Si el servicio se ejecuta correctamente la respuesta es un 200, con un mensaje indicando si se realizaron la modificación o si ningún registro fue alcanzado. 

###Deshabilitar

Se invoca haciendo un **delete** a la ruta ```localhost:3000/user``` y recibe los parámetros en el body del request
Ejemplos:

```
{
"email":"simple@mail.com"
}
```

Recibe solo el parámetro **email**  que es obligatorio.
Si el servicio se ejecuta correctamente la respuesta es un 200, indicando si se realizaron la deshabilitación o si ningún registro fue alcanzado.

###Listado

Se invoca haciendo un **get** a la ruta ```localhost:3000/user```
Recibe solo el parámetro **email**  que es obligatorio.
Si el servicio se ejecuta correctamente la respuesta es un 200 y un listado de los usuarios.
Ejemplo de respuesta
```
{
"rows": [
        {
            "email": "email@mail.com",
            "name": "disabled",
            "lastname": "ln1",
            "address": "",
            "sales_amount": 10
        },
        {
            "email": "emai2l@mail.com",
            "name": "created",
            "lastname": "ln2",
            "address": "",
            "sales_amount": 1430.65
        }
    ]
}
```

##Servicios de Venta

###Crear

Se invoca haciendo un **post** a la ruta ```localhost:3000/sale``` y recibe los parámetros en el body del request.
Ejemplo de parámetros:

```
{
"uuid":"123-1231235436-6456464",
"amount":1430.65,
"email":"emai2l@mail.com",
"date": "2018/01/28 16:25"
}
```

Todos los parametros son obligatorios, si el email no es de un usuario o el uuid esta repetido el servicio devuelve un mensaje de error informando el problema.

###Cancelar

Se invoca haciendo un **delete** a la ruta ```localhost:3000/sale``` y recibe los parámetros en el body del request
Ejemplos:

```
{
"uuid":"087b2384-07cf-11e8-ba89-0ed5f89f718b"
}
```

Recibe solo el parámetro **uuid**  que es obligatorio.
Si el servicio se ejecuta correctamente la respuesta es un 200, indicando si se realizaron la cancelación o si ningún registro fue alcanzado.

###Listado

Se invoca haciendo un **get** a la ruta ```localhost:3000/user?email=param_email```.
Recibe solo el parámetro **email**  por URL, el mismo es obligatorio.
Si el servicio se ejecuta correctamente la respuesta es un 200 y un listado de todas las ventas del usuario.
Ejemplo de respuesta

```
{
    "rows": [
        {
            "uuid": "123",
            "amount": 1430.65,
            "date": "2018/02/02 04:19:50",
            "disabled": 0,
            "email": "name@mail.com"
        }
	]
}
```




