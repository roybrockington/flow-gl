import DeckGL from '@deck.gl/react'
import { GeoJsonLayer, PolygonLayer } from '@deck.gl/layers'
import type { Feature, Geometry } from 'geojson'
import type { PickingInfo } from '@deck.gl/core'
import poly from '../assets/polygon.example.json'

type PropertiesType = {
  name: string;
  color: string;
};

const Map = () => {
  const layers = [
        new GeoJsonLayer<PropertiesType>({
    id: 'GeoJsonLayer',
    data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json',

    stroked: false,
    filled: true,
    pointType: 'circle+text',
    pickable: true,

    getFillColor: [160, 160, 180, 200],
    getLineColor: (f: Feature<Geometry, PropertiesType>) => {
      const hex = f.properties.color;
      // convert to RGB
      return hex ? hex.match(/[0-9a-f]{2}/g).map(x => parseInt(x, 16)) : [0, 0, 0];
    },
    getText: (f: Feature<Geometry, PropertiesType>) => f.properties.name,
    getLineWidth: 20,
    getPointRadius: 4,
    getTextSize: 12
  }),

    ]

  return <DeckGL
    initialViewState={{
      longitude: -122.4,
      latitude: 37.74,
      zoom: 11
    }}
    controller
    getTooltip={({object}: PickingInfo<Feature<Geometry, PropertiesType>>) => object && object.properties.name}
    layers={layers}
  />;
}

export default Map
