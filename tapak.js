class Tapak {
    constructor() {
        this.name = "Tapak";
        this.color = "#ffffff";
        this.prevMoves = [];
    }

    randomInteger(max) {
        return Math.floor(Math.random() * max);
    }

    mrudaj(q6uCoord, kuftetaCoord, pov) {
        console.log(q6uCoord);
        console.log(kuftetaCoord.length);
        console.log(pov);
        this.prevMoves.push(this.randomInteger(4));
        return this.prevMoves[this.prevMoves.length - 1];
    }
}