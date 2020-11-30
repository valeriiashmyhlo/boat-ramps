In the project directory, you can run:

### Install dependencies
`yarn` 
### Start application
`REACT_APP_MAPBOX_TOKEN=<token> yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Important note:
Chart updates only on interaction with the map, so to see any updates on charts user should either scroll or zoom map view 

### WIP:

It's not a finalized solution. Most of the time was spent on Mapbox to make it work.

* Fix requirement to interact with map to see updates to charts 
* Better styling
* Add debounce on onViewportChange
* Maybe show "Drag the map to populate results"
* Update project structure, split into components
* Add tests
* Wrap third-party code  
* Optimize if needed
