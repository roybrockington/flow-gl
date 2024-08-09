import { GeoJsonLayer } from '@deck.gl/layers'
import type { Feature, Geometry } from 'geojson'
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import { DeckProps, PickingInfo } from '@deck.gl/core'
import { GoogleMapsOverlay } from '@deck.gl/google-maps'
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { Node } from '@xyflow/react'
import { Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { ArrowBack } from '@mui/icons-material'

type PropertiesType = {
    name: string
    color: string
}

const DeckGLOverlay = (props: DeckProps) => {
    const map = useMap()
    const overlay = useMemo(() => new GoogleMapsOverlay(props), [])

    useEffect(() => {
        overlay.setMap(map)
        return () => overlay.setMap(null)
    }, [map])

    overlay.setProps(props)
    return null
}

const CompiledMap = ({mapLayers, setMapLayers, setShowMap}: {
    mapLayers: Node[],
    setMapLayers: Dispatch<SetStateAction<Node[]>>,
    setShowMap: Dispatch<SetStateAction<boolean>>
}) => {

    const MAP_ID = '7f459e2f2195760'
    const API_KEY = import.meta.env.VITE_REACT_API_GMAPS

    const addLayer = (dataset: Node) => {
        return new GeoJsonLayer<PropertiesType>({
            id: dataset.id,
            data: dataset.data.url as string,

            stroked: false,
            filled: true,
            pointType: 'circle+text',
            pickable: true,

            getFillColor: [160, 160, 180, 200],
            getLineColor: (f: Feature<Geometry, PropertiesType> | any) => {
                const hex = f.properties.color
                // convert to RGB
                return hex ? hex?.match(/[0-9a-f]{2}/g)?.map((x: string) => parseInt(x, 16)) : [0, 0, 0]
            },
            getText: (f: Feature<Geometry, PropertiesType>) => f.properties.name,
            getLineWidth: 20,
            getPointRadius: 4,
            getTextSize: 12
        })
    }

    const layers = mapLayers.length > 0 ? [
        mapLayers.map(layer =>
            addLayer(layer)
        )
    ] : []

    const clearMap = () => {
        setMapLayers([])
        setShowMap(false)
    }


    return <APIProvider apiKey={API_KEY}>
        <Map
            defaultCenter={{lat: 34.74, lng: -122.4}}
            defaultZoom={7}
            mapId={MAP_ID}
        >
            <DeckGLOverlay 
                layers={layers} 
                controller
                getTooltip={
                    ({object}: PickingInfo<Feature<Geometry, PropertiesType>> | any) => object && object.properties.name
                }
            />
            <div
                style={{ position:'absolute', top:10, right:80 }}
            >
                <Button
                    variant='contained'
                    onClick={() => clearMap()}
                >
                    <ArrowBack sx={{marginRight: 1}} />
                    Back
                </Button>
            </div>
        </Map>
    </APIProvider>
}

export default CompiledMap
