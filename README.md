# Detector de Peluches

Este proyecto permite detectar distintos tipos de peluches (Duende y Dash) utilizando un modelo creado con [Teachable Machine](https://teachablemachine.withgoogle.com/).

Está basado en el [Bananameter](https://medium.com/p/4bfffa765866/).

## Cómo modificar el proyecto

Si quieres modificar el proyecto, aquí van algunas instrucciones:

### Cambiar el modelo

Si entrenas tu propio modelo de detección de imágenes con Techeable Machine, cuando exportes el modelo recibirás una URL.

Dentro del archivo `index.html`, puedes reemplazar la variable `URL` con la URL de tu modelo, cuando el sitio se cargué se ejecutará tu modelo.

### Modificar la función Callback

Cada vez que se hace una predicción, se actualizan los gráficos de barra en base a los resultados que entregue la predicción. Nosotros le decimos que se haga esto cuando llamamos a la función `setupModel` en el archivo `index.html`. El segundo parámetro de la función `setupModel` es una función callback que toma los datos de la predicción desde el modelo y los utiliza para hacer algo. Si deseas que algo más pase utilizando los datos de la predicción, puedes modificar la función de callback a tu gusto.

```
setupModel(URL, data => {
    updateBarGraph(data);
    // Puedes modificar directamente la función updateBarGraph o agregar el código a continuación
});
```

La función callback toma desde el parámetro `data`. Este parámetro `data` es un arreglo de objetos que almacena el nombre de cada clase `className` y su probabilidad `probability`.
Un ejemplo de datos de probabilidades retornados por el modelo para ser usados en la función callback podrían ser algo así:
```
data = [
    { className: 'Duende', probability: .25 },
    { className: 'Dash', probability: .75 },
    { className: 'Normal', probability: 0.00 }
]
```

Aquí yo cambié la función `updateBarGraph` para que cuando obtega los datos de la predicción, verifique si cambiaron, en caso de que hayan cambiado y el valor de la predicción sea 100 (tomar en cuenta que el valor original fue convertido a porcentaje con la función `convertToPercent`) entonces llama a la función `changeColor` para cambiar el color de la ampolleta.

```
export function updateBarGraph(data) {
    // iterate through each element in the data
    data.forEach(({ className, probability }) => {
        // get the HTML elements that we stored in the makeBar function
        let barElements = bars[className];
        let barElement = barElements.bar;
        let percentElement = barElements.percent;
        // set the progress on the bar
        barElement.value = probability;
        // set the percent value on the label

        let oldPrediction = percentElement.innerText;
        let newPrediction = convertToPercent(probability.toFixed(2));

        if (parseInt(oldPrediction) != parseInt(newPrediction)) {
            percentElement.innerText = newPrediction;

            if (parseInt(newPrediction) == 100) {
                if (className == "Duende") {
                    const COLOR_ROJO = 65262;
                    changeColor(COLOR_ROJO);
                } else if (className == "Dash") {
                    const COLOR_AZUL = 47125;
                    changeColor(COLOR_AZUL);
                } else if (className == "Normal") {
                    const COLOR_BLANCO = 34290;
                    changeColor(COLOR_BLANCO);
                }
            }
        }
    });
}
```

### Cambiar el color de la ampolleta

La función `changeColor` permite cambiar el color de una ampolleta Philips HUE realizando una llamada HTTP

```
function changeColor(color) {
    var hue = color;
    fetch("http://192.168.1.100/api/yoihozikFD3cyzL5pb6HxiV1koYLZmkpDW9hro0A/lights/3/state", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "on": true, "hue": hue }),
    }).catch(function (error) {
        console.log("Error: " + error);
    });
}
```

## Más detalles y documentación
Este proyecto utiliza la biblioteca `tmImage`. Para mayor información puedes ver la [documentación](https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image).