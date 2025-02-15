import { useState } from "react";
import { manastiriRenderer, restaurantsRenderer, muzeumsRenderer, atractiiRenderer, cladiriRenderer, shoppingRenderer } from "../arcgis/renders"; // Importă rendererele

const useLayers = () => {
  const [selectedLayer, setSelectedLayer] = useState(null);

  const layers = [
    {
      name: "Gastronomie",
      url: "https://services8.arcgis.com/BBQ8y8wlr7sbDPZa/arcgis/rest/services/restaurante_bune_romania/FeatureServer",
      renderer: restaurantsRenderer, 
    },
    {
      name: "Istorie",
      url: "https://services8.arcgis.com/BBQ8y8wlr7sbDPZa/arcgis/rest/services/muzee_romania/FeatureServer",
      renderer: muzeumsRenderer,
    },
    {
      name: "Religie",
      url:"https://services3.arcgis.com/087BfB5SU06CcLqR/arcgis/rest/services/Manastiri_Romania/FeatureServer",
      apiKey: process.env.REACT_APP_ARCGIS_API_KEY,
      renderer: manastiriRenderer,
    },
    {
      name: "Natura",
      url: "https://services8.arcgis.com/BBQ8y8wlr7sbDPZa/arcgis/rest/services/atractii_naturale/FeatureServer",
      renderer: atractiiRenderer,
    },
    {
      name: "Cultura",
      url: "https://services8.arcgis.com/BBQ8y8wlr7sbDPZa/arcgis/rest/services/cladiri_faimoase_romania/FeatureServer",
      renderer: cladiriRenderer,
    },
    {
      name: "Shopping",
      url: "https://services8.arcgis.com/BBQ8y8wlr7sbDPZa/arcgis/rest/services/locuri_shopping_romania/FeatureServer",
      renderer: shoppingRenderer,
    }
  ];

  return { selectedLayer, setSelectedLayer, layers };
};

export default useLayers;
