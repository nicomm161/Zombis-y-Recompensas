// Variables
let medidaTauler = parseInt(prompt("Introdueix la mida del tauler:")); // Demanar la medida del tauler
let tauler = []; // Crear el tauler buit
let posicioJugador = [0, 0]; // Indicar on esta el jugador en el tauler
let contadorMonedes = 0; // Comptador de monedes
let contadorMoviments = 0; // Comptador de moviments 
let numZombies = medidaTauler; // Numero de zombis en el tauler
let numRecompenses = Math.floor(medidaTauler / 4); // Numero de recompenses en el tauler
let sortir = false; //Boolean per controlar el bucle
//Joc
inicialitzarTauler(medidaTauler);
//Es un bucle while on faig moure el jugador mentre el jugador vulgui marxar o finalitzi amb la meva funcio de finalitzar el joc que es para el joc
while (!sortir) {
    let direccio = prompt('Nord, Est, Oest, Sud o Sortir del joc').toLocaleLowerCase() 
    if (direccio === 'Sortir del joc'.toLocaleLowerCase() || verificarFinalJoc()) {
        sortir = true;
    }
    moureJugador(direccio)
}




// Funcions
// Inicialitzar el tauler per poguer jugar amb ell
function inicialitzarTauler(medidaTauler) {
    tauler = [];
    for (let i = 0; i < medidaTauler; i++) {
        let fila = [];
        for (let j = 0; j < medidaTauler; j++) {
            fila.push(0); // Afegim a la fila que contengui 0
        }
        tauler.push(fila); //Fiquem que el tauler contingui les files
    }

    tauler[0][0] = 1; // Posició inicial del jugador
    posicioJugador = [0, 0]; // Emmagatzemar la posició del jugador
    colocarZombie(); //Col.loquem zombis al tauler
    colocarRecompensa(); //Col.loquem recompenses al tauler
    dibuixarTauler(); // Inicialitzem el en consola
    mostrarEstat(); // Mostrar i actualitzar l'estat
}



// Dibujar el tablero
function dibuixarTauler() {
    console.clear();
    for (let i = 0; i < tauler.length; i++) {
        let fila = [];
        for (let j = 0; j < tauler[i].length; j++) {
            if (tauler[i][j] === 1) {
                fila.push(1); // Mostrar al jugador que representa un 1
            } else if (tauler[i][j] === 4) {
                fila.push("✔"); // Casella visitada
            } else {
                fila.push(0); // Mostrar un 0 para ocultar zombis y recompensas
            }
        }
        console.log(fila.join(" "));//Fem separacions en consola
    }
}

// Mostrar el estat del jugador (amb recompenses, moviments, zombis, etc)
function mostrarEstat() {
    const estat = document.getElementById('estat');
    estat.textContent = `Moviments: ${contadorMoviments}, Monedes: ${contadorMonedes}, Zombis: ${numZombies}, Recompenses: ${numRecompenses}`;
    console.log(`Moviments: ${contadorMoviments}, Monedes: ${contadorMonedes}, Zombis: ${numZombies}, Recompenses: ${numRecompenses}`);
    
}

// Moure al jugador
function moureJugador(direccio) {
    let [x, y] = posicioJugador;
    let nouX = x;
    let nouY = y;

    // Moure al jugador depenen de la direcció
    switch (direccio.toLowerCase()) {
        case 'nord':
            nouX--;
            break;
        case 'est':
            nouY++;
            break;
        case 'oest':
            nouY--;
            break;
        case 'sud':
            nouX++;
            break;
        default:
            mostrarEstat('Posa una direcció vàlida');
            return;
    }

    // Validar si el moviment es vàlid (no pot moure's fora del mapa)
    if (!movimentValid(nouX, nouY)) {
        alert('No pots sortir del tauler!');
        return;//Fa que el jugador no es mogui
    }

    // Validar si ja se ha visitat la casella (quan es dibuixi el moviment i si vol tornar sortira que no pot anar aquesta casella)
    if (tauler[nouX][nouY] === 4) {
        alert('Ja has visitat aquesta casella!');
        return; //Fa que el jugador no es mogui
    }

    contadorMoviments++; // Incrementar el numero de moviments si el moviment es vàlid
    validarRecompensaZombi(nouX, nouY); //Validar recompensa en el lloc

    // Marcar la posició anterior com visitada
    tauler[posicioJugador[0]][posicioJugador[1]] = 4;

    // Actualitzar la posició del jugador
    posicioJugador = [nouX, nouY];
    tauler[nouX][nouY] = 1;
    dibuixarTauler(); // Actualitza tauler consola
    mostrarEstat();

    // Comprovar si se ha visitat tot el tauler
    verificarFinalJoc();
}

// Verificar final del joc
function verificarFinalJoc() {
    for (let i = 0; i < tauler.length; i++) {
        for (let j = 0; j < tauler[i].length; j++) {
            if (tauler[i][j] === 0) return; // Si queda alguna casella sense visitar, no finalitza
        }
    }
    alert('¡Has visitat totes les caselles, joc acabat!');//Retorna si ja s'ha finalitzat el joc
}

// Col.locar zombis
function colocarZombie() {
    for (let i = 0; i < numZombies; i++) {
        let x = Math.floor(Math.random() * medidaTauler); //Ho col.loquem en les files en random
        let y = Math.floor(Math.random() * medidaTauler); //Ho col.loquem en les cel.les en random
        if (tauler[x][y] === 0 && (x !== 0 || y !== 0)) { //Si compleix que les posicions son correctes
            tauler[x][y] = 2; // Col.loca un zombi
        } else {
            i--; // Repetir si intenta col.locar un zombi en la posició inicial o a sobre altre element
        }
    }
}

// Col.locar recompenses
function colocarRecompensa() {
    for (let i = 0; i < numRecompenses; i++) {
        let x = Math.floor(Math.random() * medidaTauler);//Ho col.loquem en les files en random
        let y = Math.floor(Math.random() * medidaTauler);//Ho col.loquem en les cel.les random 
        if (tauler[x][y] === 0 && (x !== 0 || y !== 0)) {
            tauler[x][y] = 3; // Col.locar una recompensa
        } else {
            i--; // Repetir si intenta col.locar una recompensa en la posició inicial o a sobre altre element
        }
    }
}

// Validar si s'ha trobat un zombi o recompensa
function validarRecompensaZombi(x, y) {
    if (tauler[x][y] === 2) { //Si ho troba llançem la funcio troba un zombie
        trobaUnZombie();
    } else if (tauler[x][y] === 3) {//Si ho troba llançem la funcio troba una recompensa
        trobaUnaRecompensa(); 
    } else {
        contadorMonedes += contadorMoviments; //I si no incrementa les monedes ja que continua el joc
    }
}

// Trobar un zombi
function trobaUnZombie() {
    alert('Has trobat un zombi!'); //Posem un alert de que hem trobat un zombi
    numZombies--; //Restem el numero de zombis
    contadorMonedes = Math.floor(contadorMonedes / 2); // Reduïr monedes a la meitat
    alert('Monedes a la meitat');
    contadorMoviments = 0; // Reinitziar comptador de moviments
}

// Trobar una recompensa
function trobaUnaRecompensa() {
    alert('Has trobat una recompensa!'); //Posem un alert
    numRecompenses--; //Restem el numero de recompenses
    contadorMonedes = (contadorMoviments + contadorMonedes) * 5; // Incrementar monedes x5
    alert('Monedes augmentades per 5');
}

//Verifiquem que no es surti del tauler
function movimentValid(x, y) {
    // Verificar que el moviment sigui dins dels limits del tauler
    return x >= 0 && x < medidaTauler && y >= 0 && y < medidaTauler;
}