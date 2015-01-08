/**
 * Created by Hamster on 12/27/2014.
 */

/// <reference path="HamRand.ts" />
/// <reference path="Terrain.ts" />

class WorldGen
{
	width:number;
	height:number;

	heightMap:number[];
	tempMap:number[];
	oreMap:number[];
	
	terrainMap:Terrain[];

	rand:HamRand;

	static SEED_INTERVAL:number = 32;
	static ROUGHNESS:number = 600;
	static ROUGH_CONST:number = .7;
	static MAX_HEIGHT:number = 1000;
	
	static MAX_TEMP:number = 60;


	constructor(width:number, height:number, seed:number)
	{
		this.width = width;
		this.height = height;
		this.heightMap = [width * height];
		this.tempMap = [width * height];
		this.terrainMap = [width * height];
		this.oreMap = [width * height];

		this.rand = new HamRand(seed);

		//generate terrainMap
		this.seedValues();
		this.diamondSquare(this.heightMap, this.width, this.height, WorldGen.SEED_INTERVAL, WorldGen.ROUGHNESS, WorldGen.ROUGH_CONST);

		//generate ores
		this.seedOre(8);
		this.diamondSquare(this.oreMap, this.width, this.height, 8, 40, .5);

		for (var i:number = 0; i < this.height; i++)
		{
			for (var j:number = 0; j < this.width; j++)
			{
				var hh = this.heightMap[i * this.width + j];
				var temp = this.tempMap[i * this.width + j];
				
				/*if (hh > 925 && hh < 930)
				{
					this.terrainMap[i * this.width + j] = Terrain.ORE;
				}
				else*/
				if (temp < 20)
				{
					if (hh < TerrainZ.WATER)
					{
						this.terrainMap[i * this.width + j] = Terrain.ICE;
					}
					else
					{
						this.terrainMap[i * this.width + j] = Terrain.SNOW;
					}
				}
				else
				if (hh < TerrainZ.DEEP_WATER)
				{
					this.terrainMap[i * this.width + j] = Terrain.DEEP_WATER;
				}
				else if (hh < TerrainZ.WATER)
				{
					this.terrainMap[i * this.width + j] = Terrain.WATER;
				}
				
				else if (hh < TerrainZ.SAND)
				{
					this.terrainMap[i * this.width + j] = Terrain.SAND;
				}
				else
				{
					var oo:number = this.oreMap[i * this.width + j];
					if (oo > 40)
					{
						this.terrainMap[i * this.width + j] = Terrain.ORE;	
					}
					else
					this.terrainMap[i * this.width + j] = Terrain.GRASS;
				}
				
			}
		}
		
		
	}

	public seedValues()
	{
		//preset to -1 prob not needed
		for (var i:number = 0; i < this.height; i++)
		{
			var tt:number = (this.height / 2 - Math.abs(this.height / 2 - i)) / (this.height / 2) * WorldGen.MAX_TEMP;
			for (var j:number = 0; j < this.width; j++)
			{
				this.heightMap[i * this.width + j] = -1;
				this.tempMap[i * this.width + j] = tt;
			}
		}
		for (var i:number = 0; i < this.height; i += WorldGen.SEED_INTERVAL)
		{
			for (var j:number = 0; j < this.width; j += WorldGen.SEED_INTERVAL)
			{
				this.heightMap[i * this.width + j] = this.rand.random() * 1000;
			}
		}

	}
	
	public seedOre(interval:number)
	{
		for (var i:number = 0; i < this.height; i++)
		{
			for (var j:number = 0; j < this.width; j++)
			{
				this.oreMap[i * this.width + j] = -1;
			}
		}
		for (var i:number = 0; i < this.height; i += interval)
		{
			for (var j:number = 0; j < this.width; j += interval)
			{
				this.oreMap[i * this.width + j] = this.rand.random() * 50;
			}
		}
	}


	public diamondSquare(map:number[], width:number, height:number, seedInterval:number, rough:number, rconst:number):void
	{
		var ss:number = seedInterval;
		var rr:number = rough;
		//diamond square starts here
		while (ss >= 2)
		{
			var hh:number = ss / 2;
			console.log(hh);
			for (var i:number = Math.floor(hh); i < height; i += ss)
			{
				for (var j:number = Math.floor(hh); j < width; j += ss)
				{
					//if (this.sample(map, j, i) == -1)
					{

						var topleft:number = this.sample(map, j - hh, i - hh);
						var topright:number = this.sample(map, j + hh, i - hh);
						var botleft:number = this.sample(map, j - hh, i + hh);
						var botright:number = this.sample(map, j + hh, i + hh);

						//console.log(j, i, (topleft + topright + botleft + botright) / 4);
						this.setSample(map, j, i, Math.min(WorldGen.MAX_HEIGHT, Math.max(0, (topleft + topright + botleft + botright) / 4 + this.rand.random() * rr * 2 - rr)))
					}
				}
			}
			for (i = 0; i < height; i += ss)
			{
				for (j = 0; j < width; j += ss)
				{

					this.sampleDiamond(map, j + hh, i, hh, this.rand.random() * rr * 2 - rr);
					this.sampleDiamond(map, j, i + hh, hh, this.rand.random() * rr * 2 - rr);
				}
			}
			ss = ss / 2;
			rr = rr * Math.pow(2, -rconst);
		}
	}

	private sampleDiamond(map:number[], xx:number, yy:number, hh:number, rr:number):void
	{
		/*if (this.sample(map, xx, yy) != -1)
		 return;*/


		var left:number = this.sample(map, xx - hh, yy);
		var top:number = this.sample(map, xx, yy - hh);
		var right:number = this.sample(map, xx + hh, yy);
		var bot:number = this.sample(map, xx, yy + hh);
		this.setSample(map, xx, yy, Math.min(WorldGen.MAX_HEIGHT, Math.max(0, (left + top + bot + right) / 4 + rr)));
	}

	private sample(map:number[], x:number, y:number):number
	{
		if (x < 0)
			x += this.width;
		if (x >= this.width)
			x -= this.width;
		if (y < 0)
			y += this.height;
		if (y >= this.height)
			y -= this.height;

		return map[x + y * this.width];
	}

	private setSample(map:number[], x:number, y:number, value:number):void
	{

		if (x < 0)
			x += this.width;
		if (x >= this.width)
			x -= this.width;
		if (y < 0)
			y += this.height;
		if (y >= this.height)
			y -= this.height;

		map[x + y * this.width] = value;
	}


}