import { GeoJsonLayer } from '@deck.gl/layers'
import type { Feature, Geometry } from 'geojson'
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import { DeckProps, PickingInfo } from '@deck.gl/core'
import { GoogleMapsOverlay } from '@deck.gl/google-maps'
import { useEffect, useMemo, useState } from 'react'
import { Edge, getIncomers, Node } from '@xyflow/react'

type PropertiesType = {
    name: string
    color: string
}

type GeoJson = {
    url: string
    order: number
}

const DeckGLOverlay = (props: DeckProps) => {
    const map = useMap()
    const overlay = useMemo(() => new GoogleMapsOverlay(props), [])

    useEffect(() => {
        overlay.setMap(map);
        return () => overlay.setMap(null);
    }, [map])

    overlay.setProps(props);
    return null;
}

const CompiledMap = (flow: {nodes: Node[], edges: Edge[]}) => {

    const [geoJson, setGeoJson] = useState<GeoJson[]>([])
    const layerNodes = flow.nodes.filter((x: Node) => x.type == 'layer')

    useEffect(() => {
        setGeoJson([])
        layerNodes.forEach(layer => {
            const source = (getIncomers(layer, flow.nodes, flow.edges))
            if(source[0]?.data?.url) {
                setGeoJson([
                    ...geoJson,
                    {url: source[0]?.data.url, order: source[0].position.y}
                ])
                console.log(source[0].data.url)
            }
        })
    }, [flow]
    )

    let MAP_ID = '7f459e2f2195760'
    let API_KEY = import.meta.env.VITE_REACT_API_GMAPS


    const buildLayers = () => {
        if (geoJson.length > 0) {
            geoJson.map(layer =>
                new GeoJsonLayer<PropertiesType>({
                    id: 'GeoJsonLayer-1',
                    data: layer.url,

                    stroked: false,
                    filled: true,
                    pointType: 'circle+text',
                    pickable: true,

                    getFillColor: [160, 160, 180, 200],
                    getLineColor: (f: Feature<Geometry, PropertiesType>) => {
                        const hex = f.properties.color
                        // convert to RGB
                        return hex ? hex.match(/[0-9a-f]{2}/g).map(x => parseInt(x, 16)) : [0, 0, 0]
                    },
                    getText: (f: Feature<Geometry, PropertiesType>) => f.properties.name,
                    getLineWidth: 20,
                    getPointRadius: 4,
                    getTextSize: 12
                }),
            )}
    }


    const layers = [
        buildLayers()
    ]

    return <APIProvider apiKey={API_KEY}>
        <Map
            defaultCenter={{lat: 34.74, lng: -122.4}}
            defaultZoom={7}
            mapId={MAP_ID}
        >
            <DeckGLOverlay 
                layers={layers} 
                controller
                getTooltip={({object}: PickingInfo<Feature<Geometry, PropertiesType>>) => object && object.properties.name}
            />
            <button 
                style={{ position:'absolute', top:10, right:4 }}
                onClick={() => console.log(geoJson)}
            >Back &gt;</button>
        </Map>
    </APIProvider>
}

export default CompiledMap
