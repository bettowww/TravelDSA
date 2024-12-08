import { useState } from "react";
import { restaurantsRenderer, muzeumsRenderer } from "../arcgis/renders"; // Importă rendererele

const useLayers = () => {
  const [selectedLayer, setSelectedLayer] = useState(null);

  const layers = [
    {
      name: "Restaurante",
      url: "https://services8.arcgis.com/BBQ8y8wlr7sbDPZa/arcgis/rest/services/restaurante_bune_romania/FeatureServer",
      renderer: restaurantsRenderer, 
    },
    {
      name: "Muzee",
      url: "https://services8.arcgis.com/BBQ8y8wlr7sbDPZa/arcgis/rest/services/muzee_romania/FeatureServer",
      renderer: muzeumsRenderer,
    },
  ];

  return { selectedLayer, setSelectedLayer, layers };
};

export default useLayers;
