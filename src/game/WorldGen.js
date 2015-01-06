/**
* Created by Hamster on 12/27/2014.
*/
/// <reference path="HamRand.ts" />
/// <reference path="Terrain.ts" />
var WorldGen = (function () {
    function WorldGen(width, height, seed) {
        this.width = width;
        this.height = height;
        this.heightMap = [width * height];
        this.tempMap = [width * height];
        this.terrainMap = [width * height];

        this.rand = new HamRand(seed);

        //generate terrainMap
        this.seedValues();
        this.diamondSquare(this.heightMap, this.width, this.height, WorldGen.SEED_INTERVAL, WorldGen.ROUGHNESS, WorldGen.ROUGH_CONST);

        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var hh = this.heightMap[i * this.width + j];
                var temp = this.tempMap[i * this.width + j];

                if (hh > 925 && hh < 930) {
                    this.terrainMap[i * this.width + j] = 6 /* ORE */;
                } else if (temp < 20) {
                    if (hh < TerrainZ.WATER) {
                        this.terrainMap[i * this.width + j] = 4 /* ICE */;
                    } else {
                        this.terrainMap[i * this.width + j] = 5 /* SNOW */;
                    }
                } else if (hh < TerrainZ.DEEP_WATER) {
                    this.terrainMap[i * this.width + j] = 0 /* DEEP_WATER */;
                } else if (hh < TerrainZ.WATER) {
                    this.terrainMap[i * this.width + j] = 1 /* WATER */;
                } else if (hh < TerrainZ.SAND) {
                    this.terrainMap[i * this.width + j] = 3 /* SAND */;
                } else {
                    this.terrainMap[i * this.width + j] = 2 /* GRASS */;
                }
            }
        }
    }
    WorldGen.prototype.seedValues = function () {
        for (var i = 0; i < this.height; i++) {
            var tt = (this.height / 2 - Math.abs(this.height / 2 - i)) / (this.height / 2) * WorldGen.MAX_TEMP;
            for (var j = 0; j < this.width; j++) {
                this.heightMap[i * this.width + j] = -1;
                this.tempMap[i * this.width + j] = tt;
            }
        }
        for (var i = 0; i < this.height; i += WorldGen.SEED_INTERVAL) {
            for (var j = 0; j < this.width; j += WorldGen.SEED_INTERVAL) {
                this.heightMap[i * this.width + j] = this.rand.random() * 1000;
            }
        }
    };

    WorldGen.prototype.diamondSquare = function (map, width, height, seedInterval, rough, rconst) {
        var ss = seedInterval;
        var rr = rough;

        while (ss >= 2) {
            var hh = ss / 2;
            console.log(hh);
            for (var i = Math.floor(hh); i < height; i += ss) {
                for (var j = Math.floor(hh); j < width; j += ss) {
                     {
                        var topleft = this.sample(map, j - hh, i - hh);
                        var topright = this.sample(map, j + hh, i - hh);
                        var botleft = this.sample(map, j - hh, i + hh);
                        var botright = this.sample(map, j + hh, i + hh);

                        //console.log(j, i, (topleft + topright + botleft + botright) / 4);
                        this.setSample(map, j, i, Math.min(WorldGen.MAX_HEIGHT, Math.max(0, (topleft + topright + botleft + botright) / 4 + this.rand.random() * rr * 2 - rr)));
                    }
                }
            }
            for (i = 0; i < height; i += ss) {
                for (j = 0; j < width; j += ss) {
                    this.sampleDiamond(map, j + hh, i, hh, this.rand.random() * rr * 2 - rr);
                    this.sampleDiamond(map, j, i + hh, hh, this.rand.random() * rr * 2 - rr);
                }
            }
            ss = ss / 2;
            rr = rr * Math.pow(2, -rconst);
        }
    };

    WorldGen.prototype.sampleDiamond = function (map, xx, yy, hh, rr) {
        /*if (this.sample(map, xx, yy) != -1)
        return;*/
        var left = this.sample(map, xx - hh, yy);
        var top = this.sample(map, xx, yy - hh);
        var right = this.sample(map, xx + hh, yy);
        var bot = this.sample(map, xx, yy + hh);
        this.setSample(map, xx, yy, Math.min(WorldGen.MAX_HEIGHT, Math.max(0, (left + top + bot + right) / 4 + rr)));
    };

    WorldGen.prototype.sample = function (map, x, y) {
        if (x < 0)
            x += this.width;
        if (x >= this.width)
            x -= this.width;
        if (y < 0)
            y += this.height;
        if (y >= this.height)
            y -= this.height;

        return map[x + y * this.width];
    };

    WorldGen.prototype.setSample = function (map, x, y, value) {
        if (x < 0)
            x += this.width;
        if (x >= this.width)
            x -= this.width;
        if (y < 0)
            y += this.height;
        if (y >= this.height)
            y -= this.height;

        map[x + y * this.width] = value;
    };
    WorldGen.SEED_INTERVAL = 32;
    WorldGen.ROUGHNESS = 600;
    WorldGen.ROUGH_CONST = .7;
    WorldGen.MAX_HEIGHT = 1000;

    WorldGen.MAX_TEMP = 60;
    return WorldGen;
})();
//# sourceMappingURL=WorldGen.js.map
