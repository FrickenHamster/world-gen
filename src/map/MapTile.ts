/**
 * Created by Hamster on 1/14/2015.
 */

/// <reference path='Terrain.ts'/>


enum Resource
{
	
}
	

class MapTile
{
	
	
	mapX:number;
	mapY:number;
	upLeftTerrain:Terrain;
	upRightTerrain:Terrain;
	botLeftTerrain:Terrain;
	botRightTerrain:Terrain;
	
	
	resource:Resource;
	
	
	constructor(mapX:number, mapY:number)
	{
		this.mapX = mapX;
		this.mapY = mapY;
	}
	
}

