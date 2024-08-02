# Flow-GL

ReactFlow application featuring custom nodes and map visualisation with DeckGL.

Enter a GeoJSON URL into a source node and connect to a layer node to render the data on the map. Higher placed layer nodes are rendered on top of lower ones.

## Technologies Used

- React + Typescript + Vite
- ReactFlow
- DeckGL
- Google Maps
- Inline CSS

## Installation

- After cloning the repo use `npm i` to install dependencies
- Create a blank .env file in the root directory
- Add variable VITE_REACT_API_GMAPS for a Google Maps JS API key
- Start the local environment with `npm run dev`

## Technical Approach

Built basic interface using ReactFlow's [Drag & Drop example](https://reactflow.dev/examples/interaction/drag-and-drop) as a foundation, before adding custom nodes and localstorage saving functionality on top.

Selected DeckGL's [GoogleMaps Integration](https://deck.gl/docs/developer-guide/base-maps/using-with-google-maps) for map component.

Considered several routes to getting URL data from flow to map including:
- implementing managed state between both flow and map components
- sending node data on demand with the [ Map > ] view button **(selected approach)**

And ways to filter and organise the data before sharing it between views:
- filtering layer nodes and working backwards to check for connected sources/URLs
- filtering sources with layers attached **(selected approach)**

## Future Improvements

- Center map by default to show layers on first render
- Additional validatation on text inputs to check they match a URL pattern
