const apikey_openweather = "2098f10545a0ab588317c0e8d99652c3";
const apikey_ninja = "5EoPhIFjdSgVBjVDh2HAxA==Txuc5FYreTuGeNAs";

function buscarCidades() {
  var input = document.getElementById("cidadeInput").value;
  let listaCidades = document.getElementById("listaCidades");

  // Limpe a lista de cidades
  listaCidades.innerHTML = "";

  if (input.length >= 3) {
    // Verifique se o usuário digitou pelo menos 3 caracteres
    // Faça uma solicitação para uma API de sugestão de cidades
    fetch(`https://api.api-ninjas.com/v1/city?name=${input}&limit=30`, {
      headers: { "X-Api-Key": apikey_ninja },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          data.forEach((result) => {
            const cidadeNome = result.name;
            const cidadePais = result.country;
            const cidadeItem = document.createElement("li");

            cidadeItem.textContent = cidadeNome + ", " + cidadePais;
            cidadeItem.style.cursor = "pointer";
            listaCidades.appendChild(cidadeItem);

            cidadeItem.addEventListener("click", () => {
              // Quando o usuário clica em uma cidade, preencha o campo de entrada com o nome da cidade
              document.getElementById("cidadeInput").value =
                cidadeNome + ", " + cidadePais;
              // Oculte a lista de cidades
              listaCidades.style.display = "none";
              // Consulte o clima da cidade selecionada
              fetch(
                `http://api.openweathermap.org/geo/1.0/direct?q=${cidadeNome}&limit=1&appid=${apikey_openweather}`
              )
                .then((response) => response.json())
                .then((data) => {
                  //exibir o resultado da consulta
                  const lat = data[0].lat;
                  const lon = data[0].lon;
                  fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey_openweather}&units=metric`
                  )
                    .then((response) => response.json())
                    .then((data) => {
                      //exibir o resultado da consulta
                      document.getElementById("location-name").textContent = cidadeNome;
                      document.getElementById("temperature").textContent = data.main.temp.toFixed(2) + "°C";
                      document.getElementById("max-temp").textContent = "Máxima: " + data.main.temp_max.toFixed(2) + "°C";
                      document.getElementById("min-temp").textContent = "Mínima: " + data.main.temp_min.toFixed(2) + "°C";
                      document.getElementById("pressure").textContent = "Pressão: " + data.main.pressure + " hPa";
                      document.getElementById("humidity").textContent = "Umidade: " + data.main.humidity + "%";
                      document.getElementById("wind").textContent = "Vento: " + data.wind.speed + " m/s";
                      document.getElementById("weather-icon").alt = data.weather[0].description;
                      document.getElementById("weather-icon").src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                      console.log(data);
                    })
                    .catch((error) => {
                      console.error("Erro na consulta de clima:", error);
                    });
                })
                .catch((error) => {
                  console.error("Erro na consulta de clima:", error);
                });
            });
          });
        } else {
          listaCidades.style.display = "none"; // Oculte a lista se não houver correspondências
        }
      })
      .catch((error) => {
        console.error("Erro na busca de cidades:", error);
      });
    listaCidades.style.display = "block"; // Exiba a lista
  } else {
    listaCidades.style.display = "none"; // Oculte a lista se o campo de entrada estiver vazio
  }
}

function obterLocalizacaoUsuario() {
    // Verifica se o navegador suporta a API de Geolocalização
    if (navigator.geolocation) {
        // Solicita permissão para acessar a localização do usuário
        navigator.geolocation.getCurrentPosition(
            // Callback de sucesso
            function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Agora você pode usar as coordenadas (latitude e longitude) para obter dados de clima, por exemplo.
                console.log(`Latitude: ${lat}, Longitude: ${lon}`);
                // Chame sua função de consulta de clima ou faça o que for necessário com as coordenadas.
                fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey_openweather}&units=metric`
                  )
                    .then((response) => response.json())
                    .then((data) => {
                      //exibir o resultado da consulta
                      document.getElementById("location-name").textContent = data.name;
                      document.getElementById("temperature").textContent = data.main.temp.toFixed(2) + "°C";
                      document.getElementById("max-temp").textContent = "Máxima: " + data.main.temp_max.toFixed(2) + "°C";
                      document.getElementById("min-temp").textContent = "Mínima: " + data.main.temp_min.toFixed(2) + "°C";
                      document.getElementById("pressure").textContent = "Pressão: " + data.main.pressure + " hPa";
                      document.getElementById("humidity").textContent = "Umidade: " + data.main.humidity + "%";
                      document.getElementById("wind").textContent = "Vento: " + data.wind.speed + " m/s";
                      document.getElementById("weather-icon").alt = data.weather[0].description;
                      document.getElementById("weather-icon").src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
                      console.log(data);
                    })
                    .catch((error) => {
                      console.error("Erro na consulta de clima:", error);
                    });
            },
            // Callback de erro
            function (error) {
                console.error('Erro ao obter a localização do usuário:', error.message);
            }
        );
    } else {
        console.error('Seu navegador não suporta a API de Geolocalização.');
    }
}

window.addEventListener('load', obterLocalizacaoUsuario);
