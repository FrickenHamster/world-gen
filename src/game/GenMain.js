/**
 * Created by Hamster on 12/27/2014.
 */
/// <reference path="../libs/phaser.d.ts" />
/// <reference path="HamRand.ts" />
/// <reference path="WorldGen.ts" />
/// <reference path="Terrain.ts" />
var GenMain = (function () {
    function GenMain(game) {
        this.mapWidth = 800;
        this.mapHeight = 600;
        this.game = game;
        this.testBitmapData = game.make.bitmapData(this.mapWidth, this.mapHeight);
        this.tempBitmapData = game.make.bitmapData(this.mapWidth, this.mapHeight);
        this.gen = new WorldGen(this.mapWidth, this.mapHeight, 121548); //19930812);
        var vals = this.gen.heightMap;
        var temp = this.gen.tempMap;
        var terrain = this.gen.terrainMap;
        for (var i = 0; i < this.mapHeight; i++) {
            for (var j = 0; j < this.mapWidth; j++) {
                /*var nn:number = vals[i * this.mapWidth + j] * 255 / 1000;
                this.testBitmapData.setPixel32(j, i, nn, nn, nn, 255, false);
                */
                var ter = terrain[i * this.mapWidth + j];
                switch (ter) {
                    case 0 /* DEEP_WATER */:
                        this.testBitmapData.setPixel32(j, i, 0, 0, 100, 255, false);
                        break;
                    case 1 /* WATER */:
                        this.testBitmapData.setPixel32(j, i, 20, 20, 255, 255, false);
                        break;
                    case 3 /* SAND */:
                        this.testBitmapData.setPixel32(j, i, 200, 190, 80, 255, false);
                        break;
                    case 2 /* GRASS */:
                        this.testBitmapData.setPixel32(j, i, 0, 255, 0, 255, false);
                        break;
                    case 4 /* ICE */:
                        this.testBitmapData.setPixel32(j, i, 100, 100, 255, 255, false);
                        break;
                    case 5 /* SNOW */:
                        this.testBitmapData.setPixel32(j, i, 240, 240, 240, 255, false);
                        break;
                }
                var tt = temp[i * this.mapWidth + j] * 255 / WorldGen.MAX_TEMP;
                this.tempBitmapData.setPixel32(j, i, tt, 0, 255 - tt, 100, false);
            }
        }
        //this.testBitmapData.setPixel(0, 0, 0, 0, 0, true);
        this.testBitmapData.context.putImageData(this.testBitmapData.imageData, 0, 0);
        this.tempBitmapData.context.putImageData(this.tempBitmapData.imageData, 0, 0);
        this.testBitmapData.addToWorld();
        //this.tempBitmapData.addToWorld();
    }
    return GenMain;
})();
//# sourceMappingURL=GenMain.js.map