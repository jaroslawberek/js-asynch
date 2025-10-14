// //import { request } from "";
// //import request from "request";

// /*var request = require("request");

// function getResource(url) {
//   return new Promise((resolve, reject) => {
//     request(url, (error, response, body) => {
//       if (error) reject();
//       else {
//         resolve(body);
//       }
//     });
//   });
// }

// getResource("https://jsonplaceholder.typicode.com/todos/1")
//   .then((data) => console.log(data))
//   .catch((err) => console.error("Błąd:", err));*/

// function doSomething(value) {
//   return new Promise((resolve) => {
//     for (let i = 1; i <= 10; i++) {
//       console.log(i);
//     }
//         resolve("zakonczono");
//   });
// }

// const result = await doSomething(10);
// console.log("huj");
// console.log(result);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}
//ver 1
async function simplePromise(params) {
  function etap(text, time) {
    return new Promise((resolve, reject) => {
      const rnd = randomInt(1, 25);
      setTimeout(() => {
        if (rnd === 5) reject("Powstał błąd przy: etap: " + text);
        else resolve("Wykonano etap:  " + text + " w czasie " + time);
      }, time);
    });
  }
  console.log("Wersja podstawowa...");
  return etap("1.sprawdzanie", randomInt(1000, 3000))
    .then((result) => {
      console.log(result);
      return etap("2.dodawanie", randomInt(1000, 3000));
    })
    .then((result) => {
      console.log(result);
      return etap("3.weryfikacja", randomInt(1000, 3000));
    })
    .then((result) => {
      console.log(result);
      return etap("4.potwierdzenie", randomInt(1000, 3000));
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log("Wystapil błąd: " + error);
    });
}
//ver.2 Skoro ta sama funkcja
async function withDoingTheSame(params) {
  function etap(text, time) {
    return new Promise((resolve, reject) => {
      const rnd = randomInt(1, 15);
      setTimeout(() => {
        if (rnd === 5) reject("Powstał błąd przy: etap: " + text);
        else resolve("Wykonano etap:  " + text + " w czasie " + time);
      }, time);
    });
  }
  function wykonajEtap(nazwa) {
    const t = randomInt(1000, 3000);
    return etap(nazwa, t).then((result) => {
      console.log(result);
      return result;
    });
  }
  console.log("Wersja druga skoro ta sama funkcja to obudowa do wywołania...");
  return wykonajEtap("1.sprawdzanie ver 2")
    .then(() => wykonajEtap("2.dodawanie ver 2"))
    .then(() => wykonajEtap("3.weryfikacja  ver 2"))
    .then(() => wykonajEtap("4.potwierdzenie  ver 2"));
}
// vre 3 z Wykorzystaniem  .reduce()
async function withReduce(params) {
  function etap(text, time) {
    return new Promise((resolve, reject) => {
      const rnd = randomInt(1, 15);
      setTimeout(() => {
        if (rnd === 5) reject("Powstał błąd przy: etap: " + text);
        else resolve("Wykonano etap:  " + text + " w czasie " + time);
      }, time);
    });
  }
  console.log("Wersja z wykorzystaniem reduce - po kolei z tablicy sie wywołuje...");
  const etapy = ["1.sprawdzanie", "2.dodawanie", "3.weryfikacja", "4.potwierdzenie"];
  return etapy.reduce((promise, nazwa) => {
    return promise.then(() => etap(nazwa, randomInt(1000, 3000)).then(console.log));
  }, Promise.resolve());
}
//ver 4 z promisify
async function withPromisify(params) {
  function etapPromisify(text, callback) {
    const rnd = randomInt(1, 15);
    const time = randomInt(1000, 3000);
    setTimeout(() => {
      if (rnd === 5) callback("błąd", "Powstał błąd przy: etap: " + text);
      else callback(null, "Wykonano etap:  " + text + " w czasie " + time);
    }, time);
  }
  console.log("Wersja jak podstawowa ale z promisify - moja funkca mui callback wywolywac odpowiedniego...");
  const readEtapy = promisify(etapPromisify); //robi z funkcji promisa....
  return readEtapy("1. Weryfikacja") //dlatego mozemy zwrocic do await
    .then((res) => {
      console.log(res);
      return readEtapy("2.Dodawanie"); // zwraca promisa
    })
    .then((res) => {
      console.log(res);
      return readEtapy("3.Potwierdzenie"); // i tu zwraca promisa
    })
    .then((res) => {
      console.log(res);
      return readEtapy("4.Zakonczenie"); // i tu zwraca promisa
    })
    .then((res) => {
      console.log(res); //koniec ale na poczatku jest return readEtapya to promis!!
    });
}
try {
  console.clear();
  await simplePromise();
  await withDoingTheSame();
  await withReduce();
  await withPromisify();
} catch (err) {
  console.error(`❌ Błąd w zadaniu :`, err);
}
