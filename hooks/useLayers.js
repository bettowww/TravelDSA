import { useState } from "react";
import { cladiriRenderer, shoppingRenderer, restaurantsRenderer,
        muzeumsRenderer, atractiiNaturaleRenderer,
        manastiriRenderer } from "../arcgis/renders";

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
    {
      name: "Atractii Naturale",
      url: "https://services8.arcgis.com/BBQ8y8wlr7sbDPZa/arcgis/rest/services/atractii_naturale/FeatureServer",
      renderer: atractiiNaturaleRenderer,
    },
    {
      name: "Locuri Shopping",
      url: "https://services8.arcgis.com/BBQ8y8wlr7sbDPZa/arcgis/rest/services/locuri_shopping_romania/FeatureServer",
      renderer: shoppingRenderer,
    },
    {
      name: "Cladiri Faimoase",
      url: "https://services8.arcgis.com/BBQ8y8wlr7sbDPZa/arcgis/rest/services/cladiri_faimoase_romania/FeatureServer",
      renderer: cladiriRenderer,
    },
    {
      name: "Manastiri",
      apiKey: "AAPTxy8BH1VEsoebNVZXo8HurA68jFcPXz-dC0bjRMxYCtO1nOVmGcPe10rzT8zL2l3FmNXnqhHl_CK7CEGjLLcGkmbqUGMCEupe0L9hMH5lQc06EEWW_doPlN2rYUKbDxwCmLkuxHIlIcuIh6tSujzRBcX1EewIBvmGLatGY2udHlU6sLkMu3GUTn7n64JBlZZ4JdOIKV5W8h8jV5C3sKzsvKcIcYWrXaNusHpNvx6tVpA.AT1_I6N9uKO0",
      url: "https://services3.arcgis.com/087BfB5SU06CcLqR/arcgis/rest/services/Manastiri_Romania/FeatureServer",
      renderer: manastiriRenderer,
    }
  ];

  return { selectedLayer, setSelectedLayer, layers };
};

export default useLayers;
