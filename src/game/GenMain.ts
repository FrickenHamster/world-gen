/**
 * Created by Hamster on 12/27/2014.
 */

/// <reference path="../libs/phaser.d.ts" />
/// <reference path="../map/HamRand.ts" />
/// <reference path="../map/WorldGen.ts" />
/// <reference path="../map/Terrain.ts" />
	
	
class GenMain
{
	
	game:Phaser.Game;
	
	testBitmapData:Phaser.BitmapData;
	tempBitmapData:Phaser.BitmapData;
	
	gen:WorldGen;
	
	mapWidth:number = 128;
	mapHeight:number = 128;
	
	
	constructor(game:Phaser.Game)
	{
		
		this.game = game;
		
		this.testBitmapData = game.make.bitmapData(this.mapWidth, this.mapHeight);
		this.tempBitmapData = game.make.bitmapData(this.mapWidth, this.mapHeight);
		
		this.gen = new WorldGen(this.mapWidth, this.mapHeight, 19930812);//19930812);
		
		var vals:number[] = this.gen.heightMap;
		var temp:number[] = this.gen.tempMap;
		var terrain:Terrain[] = this.gen.terrainMap;
		
		for (var i:number = 0; i < this.mapHeight; i++)
		{
			for (var j:number = 0; j < this.mapWidth; j++)
			{
				/*var nn:number = vals[i * this.mapWidth + j] * 255 / 1000;
				this.testBitmapData.setPixel32(j, i, nn, nn, nn, 255, false);
				*/
				var ter:Terrain = terrain[i * this.mapWidth + j];
				switch (ter)
				{
					case Terrain.DEEP_WATER:
						this.testBitmapData.setPixel32(j, i, 0, 0, 100, 255, false);
						break;
					case Terrain.WATER:
						this.testBitmapData.setPixel32(j, i, 20, 20, 255, 255, false);
						break;
					case Terrain.SAND:
						this.testBitmapData.setPixel32(j, i, 200, 190, 80, 255, false);
						break;
					case Terrain.GRASS:
						this.testBitmapData.setPixel32(j, i, 0, 255, 0, 255, false);
						break;
					case Terrain.ICE:
						this.testBitmapData.setPixel32(j, i, 100, 100, 255, 255, false);
						break;
					case Terrain.SNOW:
						this.testBitmapData.setPixel32(j, i, 240, 240, 240, 255, false);
						break;
					case Terrain.ORE:
						this.testBitmapData.setPixel32(j, i, 50,50,50,255,false);
					
				}
				
				
				var tt:number = temp[i * this.mapWidth + j] * 255 / WorldGen.MAX_TEMP;
				this.tempBitmapData.setPixel32(j, i, tt, 0, 255 - tt, 100, false);
				
			}
		}
		//this.testBitmapData.setPixel(0, 0, 0, 0, 0, true);
		this.testBitmapData.context.putImageData(this.testBitmapData.imageData, 0, 0);
		this.tempBitmapData.context.putImageData(this.tempBitmapData.imageData, 0, 0);
		var ii:Phaser.Image = this.testBitmapData.addToWorld();
		ii.scale.x = 4;
		ii.scale.y = 4;
		//this.tempBitmapData.addToWorld();
		
		
	}
	
	
}







