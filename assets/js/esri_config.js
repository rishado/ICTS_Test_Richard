

function selectTime() {

    // let year = document.getElementById('year_select').value;  
    let year = 2010;
    let month = document.getElementById('month_select').value;


    return "X" + year + "_" + month
  }

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

const get_key = async ()=>{
    
    let key = await $.getJSON("./assets/js/config.json", function(json) {
        // esriConfig.apiKey = json["esriConfig.apiKey"]
      
        return json["esriConfig.apiKey"]
        }).then( res => {return res["esriConfig.apiKey"]});

    return (key)

}



const fill_years = (items) => {
    let dates = items.filter(function( element ) {
        return element['text'] !== undefined;
     });
     
     years = dates.map(x => x['text'].split('X')[0].split('_')[0]).filter( onlyUnique );
     
    $.each(years, function (i, item) {
      
        console.log(item);
        $('#year_select').append($('<option>', { 
        value: item,
        text : item
        }));
        });

}



require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/Basemap",
  "esri/layers/FeatureLayer",
  "esri/layers/VectorTileLayer",
  "esri/layers/TileLayer",
  "esri/widgets/BasemapToggle",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Legend",
  "esri/widgets/BasemapGallery/support/PortalBasemapsSource",
  "esri/widgets/ScaleBar",
  "dojo/dom-class",
  "esri/widgets/Expand",
  "esri/widgets/Search",
  "esri/widgets/Home",
  "esri/widgets/Print"
  
], function (esriConfig, Map, MapView, Basemap, FeatureLayer, VectorTileLayer, TileLayer, BasemapToggle, BasemapGallery, Legend,PortalBasemapsSource, ScaleBar,domClass, Expand, Search, Home, Print) {

    esriConfig.apiKey = "AAPK8486b520954f4017a5129e7fdc993929t5cJPSsJJH30bRiIpr-CxHStnP_h_p0JWM9HsPjKFr2ZLdhaZQllFyS4dCK2epkt"
    

    var popupTemplate = {
        title: "{FID}",
        content: "Hello {X2010_Apr} "
    };

    var date ;
    date = selectTime();
  
    const map = new Map({
        basemap: "arcgis-topographic"
    
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [18.02,17.64],
        zoom: 4.5

    });

    const defaultSym = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        outline: {
        // autocasts as new SimpleLineSymbol()
        color: [128, 128, 128, 0.2],
        width: "0.0px"
        }
    };

    const feature_layer_data = new FeatureLayer(
        {
            url: "https://services8.arcgis.com/bhDP7EL6aRtk6BJH/arcgis/rest/services/rainfall/FeatureServer/0"

        }
    )

    const get_time_series_point = (FID) =>{
        console.log('getting data for ', FID);
        feature_layer_data.queryFeatures().then(function(results){

            // prints an array of all the features in the service to the console
            console.log(results.features);
            console.log(results.features.filter(x => x['attributes']['id'] == FID));
          
        });
        
    }
    
    const featureLayer = new FeatureLayer({

        url: "https://services8.arcgis.com/bhDP7EL6aRtk6BJH/arcgis/rest/services/rainfall/FeatureServer/0",
        popupTemplate: popupTemplate,

        renderer: {
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: defaultSym,
        popupEnabled: true,
        visualVariables: [
            {
            type: "color",
            field: date,
            legendOptions: {
                    title: "Data for: "+"Jan "+2010
                },
            stops: [
                {
                value: 0,
                color: "#ffffcc",
                label: "Min"
                },
                {
                value: 300,
                color: "#253494",
                label: "Max"
                }
            ]
            }
        ]
        }
    });

    map.add(featureLayer);
    
    const searchWidget = new Search({
        view: view
    });

    const homeWidget = new Home(
        {
            view : view
        }
    )
    const printWidget = new Print({
        view : view,
        printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
    })
    
    const basemapGallery = new BasemapGallery({
        view: view,
        container: document.createElement("div")
        });

    const bgExpand = new Expand({
        view: view,
        content: basemapGallery
        });

    const exportExpand = new Expand({
        view: view,
        content: printWidget
        });
    
    // close the expand whenever a basemap is selected
    basemapGallery.watch("activeBasemap", () => {
        const mobileSize =
            view.heightBreakpoint === "xsmall" ||
            view.widthBreakpoint === "xsmall";

        if (mobileSize) {
            bgExpand.collapse();
        }
        });

    // Add the expand instance to the ui
    view.ui.add(bgExpand, {position : "top-left",index:3});
    view.ui.add(exportExpand, {position : "bottom-right",index:3});

    view.ui.add(
        new Legend({    
        view
        }),
        "bottom-left");
        
    view.ui.add(searchWidget, {
        position: "top-right",
        index: 0
        });
    view.ui.add(homeWidget, {
        position: "top-left",
        index: 3
        });
    
    view.on("click", function (event) {
        var screenPoint = {
            x: event.x,
            y: event.y
        };
        
        // Search for graphics at the clicked location
        view.hitTest(screenPoint).then(function (response) {
            if (response.results.length) {
                
            var graphic = response.results.filter(function (result) {
            // check if the graphic belongs to the layer of interest
            return result.graphic.layer === featureLayer;
            })[0];
            // do something with the result graphic
            console.log(graphic.graphic.attributes);
            get_time_series_point(graphic.graphic.attributes.FID);
            }
        });
        });
        
    featureLayer.load().then(res => res.fields.map(x => ({"text":x["name"].split('X')[1],"value":x["name"].split('X')[1]}))).then( res => fill_years(res));


    // Adding the event listens to the year and month controls 

    let years = document.getElementById('year_select');
    let months = document.getElementById('month_select');
    
    let update_action = document.getElementById('update_layer');
    
    update_action.addEventListener(
        "click",
        function(event){
       
            let year = document.getElementById('year_select').value;
            let month = document.getElementById('month_select').value;
            let oldRainFallLayer = map.layers.getItemAt(map.layers._items.length-1);
            
            map.remove(oldRainFallLayer)

            currentRainFallLayer = new FeatureLayer({
                url: "https://services8.arcgis.com/bhDP7EL6aRtk6BJH/arcgis/rest/services/rainfall/FeatureServer/0",
                renderer: {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: defaultSym,
                visualVariables: [
                    {
                    type: "color",
                    field: "X"+year+"_"+month,
                    legendOptions: {
                            title: "Data for: "+year+"/"+month
                        },
                    stops: [
                        {
                        value: 0,
                        color: "#ffffcc",
                        label: "Min"
                        },
                        {
                        value: 300,
                        color: "#253494",
                        label: "Max"
                        }
                    ]
                    }
                ]
                }
            });
            // view.whenLayerView(currentRainFallLayer).then(function(layerView) {
            //     layerView.watch('updating', function(value) {
            //         if (!value) $('.main-spinner').addClass('d-none')
            //         else $('.main-spinner').removeClass('d-none')
            //     });
            // });
            // currentRainFallLayer.definitionExpression = "Month = '" + currentMonth + "'" 
            
            map.add(currentRainFallLayer);
            

            console.log("Parameters are ", year, month );

            
        }
    )


   
    
});

    function update_map() {
        
        selectTime();
    
    };